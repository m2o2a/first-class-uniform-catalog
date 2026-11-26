import { NextRequest, NextResponse } from "next/server";
import { pricing, CURRENCY } from "@/lib/pricing";

type EmbroideryItem = {
  placement: string;
  count: number;
};

type QuoteInput = {
  quantity: number;
  fabricId: string;
  modelId: string;
  shapeId: string;
  embroideries: EmbroideryItem[];
  product?: string;
  lang?: "ar" | "en";
};

function localCompute(input: QuoteInput) {
  const fabric = pricing.fabrics.find((f) => f.id === input.fabricId) || pricing.fabrics[0];
  const model = pricing.models.find((m) => m.id === input.modelId) || pricing.models[0];
  const shape = pricing.shapes.find((s) => s.id === input.shapeId) || pricing.shapes[0];
  const embroideries = Array.isArray(input.embroideries) ? input.embroideries : [];
  const totalLogos = embroideries.reduce((sum, e) => sum + (Number(e.count) || 0), 0);
  const embroideryExtra = totalLogos * pricing.embroidery_price;

  const perPieceBeforeDiscount =
    fabric.raw_material_price + fabric.unit_price + model.price + shape.price + embroideryExtra;

  // pick the best matching quantity tier
  const tier = [...pricing.quantity_tiers]
    .sort((a, b) => a.min_qty - b.min_qty)
    .filter((t) => input.quantity >= t.min_qty)
    .pop() || pricing.quantity_tiers[0];

  const discountFactor = 1 - tier.discount_percent / 100;
  const perPiece = Math.round(perPieceBeforeDiscount * discountFactor);
  const total = perPiece * input.quantity;

  // simple rule-based recommendation
  let recommendation_ar = "";
  if (input.quantity >= 300 && fabric.id !== "polyester_mix") {
    recommendation_ar =
      "بما إن العدد كبير، خامة القطن المخلوط ممكن توفرلك في التكلفة الإجمالية من غير ما تأثر كتير على الجودة.";
  } else if (fabric.id === "twill") {
    recommendation_ar = "توين اختيار قوي ومتين، مناسب جدًا للاستخدام اليومي المكثف.";
  } else if (fabric.id === "gabardine") {
    recommendation_ar = "جبردين بيدي مظهر رسمي أنيق، مناسب لقطاعات زي الفنادق والشركات.";
  } else if (fabric.id === "cotton") {
    recommendation_ar = "القطن مريح وتنفسه عالي، اختيار موفق للأجواء الحارة والمطاعم.";
  }

  return {
    fabric_name_ar: fabric.name_ar,
    fabric_name_en: fabric.name_en,
    model_name_ar: model.name_ar,
    shape_name_ar: shape.name_ar,
    per_piece_price: perPiece,
    quantity: input.quantity,
    total_logos: totalLogos,
    total_price: total,
    discount_percent: tier.discount_percent,
    currency: CURRENCY,
    recommendation_ar,
    source: "local"
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as QuoteInput;

    if (!body || !body.fabricId || !body.modelId || !body.shapeId || !body.quantity || body.quantity < 1) {
      return NextResponse.json({ ok: false, error: "missing_fields" }, { status: 400 });
    }

    const n8nUrl = process.env.N8N_QUOTE_WEBHOOK_URL;

    if (n8nUrl) {
      try {
        const res = await fetch(n8nUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          signal: AbortSignal.timeout(8000)
        });
        if (res.ok) {
          const data = await res.json();
          return NextResponse.json({ ok: true, quote: { ...data, source: "n8n" } });
        }
        console.error("n8n quote webhook returned non-OK status", res.status);
      } catch (e) {
        console.error("n8n quote webhook failed, falling back to local calc", e);
      }
    }

    // Fallback: compute locally from lib/pricing.ts so the feature
    // always works, even before the n8n webhook is set up.
    const quote = localCompute(body);
    return NextResponse.json({ ok: true, quote });
  } catch {
    return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
  }
}

export async function GET() {
  // Lets the front-end fetch fabrics/models/shapes without duplicating them.
  return NextResponse.json({
    fabrics: pricing.fabrics,
    models: pricing.models,
    shapes: pricing.shapes,
    embroidery_placements_ar: pricing.embroidery_placements_ar
  });
}
