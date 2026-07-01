export const phones = ["01149631070", "01202997878", "01092218301"];
export const landline = "0242209841";

// Primary WhatsApp number (first mobile number), international format for wa.me
export const whatsappNumber = "201149631070";

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function telLink(number: string) {
  return `tel:${number.replace(/\D/g, "")}`;
}
