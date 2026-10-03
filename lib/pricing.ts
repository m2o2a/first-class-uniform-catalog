import pricing from "@/lib/pricing-rules.json";
import type { CartItem } from "@/lib/cart-context";

// Estimated per-piece price for a cart item, from lib/pricing-rules.json.
// Uses the default (first) fabric; final price is confirmed by the team.
export function estimatePiece(item: Pick<CartItem, "categorySlug" | "type" | "logos">) {
  const fabric = pricing.fabrics[0];
  const model = pricing.models.find((m) => m.id === item.categorySlug);
  const base = fabric.raw_material_price + fabric.unit_price + (model?.price || 0);
  const embroidery = item.type === "custom" ? item.logos * pricing.embroidery_price : 0;
  return base + embroidery;
}

export const DEPOSIT_PERCENT = 50;
