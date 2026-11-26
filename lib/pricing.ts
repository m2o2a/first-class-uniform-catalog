import type { CartItem } from "@/lib/cart-context";

// =====================================================================
//  ALL PRICES LIVE HERE — the only file to edit when prices change.
//  Source: Google Sheet "أسعار فرست كلاس" (confirmed by the owner).
//
//  Per-piece price (quote calculator, /api/quote):
//    (raw_material_price + unit_price) + model.price + shape.price
//    + (total logos × EMBROIDERY_PRICE), then minus the quantity discount.
//
//  NOTE: if N8N_QUOTE_WEBHOOK_URL is set in Vercel, the calculator uses the
//  prices inside n8n-quote-workflow.json instead — keep both in sync.
// =====================================================================

export const CURRENCY = "EGP";

// Embroidery price per logo (EGP).
export const EMBROIDERY_PRICE = 25;

// Deposit for embroidered (custom) orders, in percent.
export const DEPOSIT_PERCENT = 50;

// raw_material_price = material price (سعر الخامة), unit_price = labor (المصنعية).
export const FABRICS = [
  { id: "cotton", name_ar: "قطن", name_en: "Cotton", raw_material_price: 110, unit_price: 70, notes_ar: "مريح وتنفس عالي، مناسب للصيف" },
  { id: "twill", name_ar: "توين", name_en: "Twill", raw_material_price: 140, unit_price: 80, notes_ar: "متين وقوي، الأكثر استخدامًا في الأمن والمصانع" },
  { id: "gabardine", name_ar: "جبردين", name_en: "Gabardine", raw_material_price: 130, unit_price: 80, notes_ar: "مظهر رسمي، مناسب للفنادق والشركات" },
  { id: "polyester_mix", name_ar: "قطن مخلوط", name_en: "Poly-cotton mix", raw_material_price: 95, unit_price: 65, notes_ar: "أرخص خيار، مناسب للأعداد الكبيرة" }
];

// Extra price per model (category). All 0 for now = no surcharge.
// ids must match the category slugs in lib/categories.ts.
export const MODELS = [
  { id: "security", name_ar: "يونيفورم الأمن", price: 0 },
  { id: "medical", name_ar: "يونيفورم طبي", price: 0 },
  { id: "doctors", name_ar: "يونيفورم أطباء", price: 0 },
  { id: "nursing", name_ar: "يونيفورم تمريض", price: 0 },
  { id: "restaurant", name_ar: "يونيفورم مطاعم", price: 0 },
  { id: "cafe", name_ar: "يونيفورم كافيهات", price: 0 },
  { id: "hotel", name_ar: "يونيفورم فنادق", price: 0 },
  { id: "corporate", name_ar: "يونيفورم شركات", price: 0 },
  { id: "factory", name_ar: "يونيفورم مصانع", price: 0 },
  { id: "construction", name_ar: "يونيفورم مقاولات", price: 0 },
  { id: "petroleum", name_ar: "يونيفورم بترول", price: 0 },
  { id: "cleaning", name_ar: "يونيفورم نظافة", price: 0 },
  { id: "school", name_ar: "يونيفورم مدارس", price: 0 },
  { id: "chef", name_ar: "ملابس شيف", price: 0 },
  { id: "hi-vis", name_ar: "سترات عالية الوضوح", price: 0 },
  { id: "safety", name_ar: "ملابس السلامة", price: 0 },
  { id: "coveralls", name_ar: "أفرول", price: 0 },
  { id: "polo", name_ar: "بولو شيرت", price: 0 },
  { id: "tshirts", name_ar: "تي شيرت", price: 0 },
  { id: "jackets", name_ar: "جاكيتات", price: 0 },
  { id: "custom", name_ar: "يونيفورم حسب الطلب", price: 0 },
  { id: "accessories", name_ar: "إكسسوارات", price: 0 },
  { id: "pants", name_ar: "بنطلونات", price: 0 },
  { id: "shirts", name_ar: "قمصان", price: 0 },
  { id: "bib-apron", name_ar: "مرايل", price: 0 },
  { id: "waist-apron", name_ar: "ايبرون", price: 0 }
];

// Extra price per shape/cut. All 0 = no surcharge.
export const SHAPES = [
  { id: "classic", name_ar: "قصة كلاسيك", price: 0 },
  { id: "sport", name_ar: "قصة سبور", price: 0 },
  { id: "slim", name_ar: "قصة ضيقة", price: 0 },
  { id: "custom_shape", name_ar: "شكل حسب الطلب", price: 0 }
];

// Quantity discount: from min_qty pieces → discount_percent off per piece.
export const QUANTITY_TIERS = [
  { min_qty: 1, discount_percent: 0 },
  { min_qty: 50, discount_percent: 5 },
  { min_qty: 100, discount_percent: 10 },
  { min_qty: 300, discount_percent: 15 },
  { min_qty: 1000, discount_percent: 20 }
];

export const EMBROIDERY_PLACEMENTS_AR = ["الصدر", "الضهر", "الكم الشمال", "الكم اليمين", "الياقة", "مكان تاني"];

// Back-compat object with the same shape the old pricing-rules.json had.
export const pricing = {
  fabrics: FABRICS,
  models: MODELS,
  shapes: SHAPES,
  embroidery_price: EMBROIDERY_PRICE,
  quantity_tiers: QUANTITY_TIERS,
  embroidery_placements_ar: EMBROIDERY_PLACEMENTS_AR
};
export default pricing;

// Estimated per-piece price for a cart item (cart page / checkout).
// Uses the default (first) fabric, no shape surcharge and no quantity
// discount — the final price is confirmed by the team. (Unchanged behavior.)
export function estimatePiece(item: Pick<CartItem, "categorySlug" | "type" | "logos">) {
  const fabric = FABRICS[0];
  const model = MODELS.find((m) => m.id === item.categorySlug);
  const base = fabric.raw_material_price + fabric.unit_price + (model?.price || 0);
  const embroidery = item.type === "custom" ? item.logos * EMBROIDERY_PRICE : 0;
  return base + embroidery;
}
