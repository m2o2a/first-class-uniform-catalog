export const phones = ["01149631070", "01202997878", "01092218301"];
export const landline = "0242209841";

// لوكيشن المصنع على جوجل ماب
export const mapsLink = "https://maps.app.goo.gl/VVQMgKGbzmixdcE76";

// WhatsApp = رقم بوت المبيعات (بيرد على طول)؛ الاتصال بيفضل على أرقام المصنع (phones[0])
export const whatsappNumber = "201092218301";

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function telLink(number: string) {
  return `tel:${number.replace(/\D/g, "")}`;
}
