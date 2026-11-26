// Shared order types and labels — used by the customer account page, the
// admin dashboard and /api/order.

export const ORDER_STATUSES = ["new", "confirmed", "in_production", "ready", "delivered", "cancelled"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const statusAr: Record<string, string> = {
  new: "جديد",
  confirmed: "مؤكد",
  in_production: "في التصنيع",
  ready: "جاهز للتسليم",
  delivered: "اتسلم",
  cancelled: "اتلغى"
};

export const modeAr: Record<string, string> = {
  full: "دفع كامل",
  deposit: "عربون",
  quote: "عرض سعر"
};

export const paymentMethodAr: Record<string, string> = {
  cash: "كاش",
  instapay: "إنستاباي",
  vodafone_cash: "فودافون كاش",
  bank: "تحويل بنكي",
  other: "أخرى"
};

export type OrderItem = { name: string; qty: number; type?: "ready" | "custom"; logos?: number; estimate?: number; src?: string };

export type Payment = {
  id: string;
  order_id: string;
  amount: number;
  method: string | null;
  note: string | null;
  paid_at: string;
  created_at: string;
};

export type Order = {
  id: string;
  user_id: string | null;
  order_no: string;
  mode: string;
  items: OrderItem[];
  total: number;
  due: number;
  status: string;
  created_at: string;
  customer_name: string | null;
  customer_phone: string | null;
  company: string | null;
  address: string | null;
  notes: string | null;
  source: string;
  production: "in_house" | "workshop" | null;
  workshop_name: string | null;
  workshop_cost: number;
  due_date: string | null;
  admin_notes: string | null;
  payments?: Payment[];
};

export function makeOrderNo(d = new Date()) {
  return (
    "FC-" +
    String(d.getFullYear()).slice(2) +
    String(d.getMonth() + 1).padStart(2, "0") +
    String(d.getDate()).padStart(2, "0") +
    "-" +
    Math.random().toString(36).slice(2, 6).toUpperCase()
  );
}

export const isClosed = (o: Pick<Order, "status">) => o.status === "delivered" || o.status === "cancelled";

export const paidOf = (o: Order) => (o.payments || []).reduce((s, p) => s + Number(p.amount), 0);

export const remainingOf = (o: Order) => Math.max(0, Number(o.total) - paidOf(o));

export function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export const isLate = (o: Order) => !!o.due_date && !isClosed(o) && o.due_date < todayISO();

// Egyptian mobile (01xxxxxxxxx) → wa.me format (201xxxxxxxxx)
export function customerWhatsapp(phone: string, text: string) {
  let n = phone.replace(/\D/g, "");
  if (n.startsWith("0")) n = "2" + n;
  return `https://wa.me/${n}?text=${encodeURIComponent(text)}`;
}

export function statusMessage(o: Order) {
  const name = o.customer_name ? `أهلًا ${o.customer_name}، ` : "أهلًا، ";
  const ref = `طلبك رقم ${o.order_no}`;
  switch (o.status) {
    case "confirmed":
      return `${name}${ref} اتأكد وهنبدأ فيه قريب. شكرًا لثقتك في فرست كلاس 🙏`;
    case "in_production":
      return `${name}${ref} دخل التصنيع${o.due_date ? ` ومتوقع يخلص يوم ${o.due_date}` : ""}.`;
    case "ready":
      return `${name}${ref} جاهز للتسليم ✅${remainingOf(o) > 0 ? ` المتبقي: ${remainingOf(o).toLocaleString()} ج.` : ""}`;
    case "delivered":
      return `${name}${ref} اتسلم. نتمنى يعجبك، ومستنيين رأيك 🙏`;
    default:
      return `${name}بخصوص ${ref}: `;
  }
}
