// ====== بيانات التحويل — المكان الوحيد اللي تغيّرها فيه ======
// Shown in: /cart (checkout box before "Confirm order") and the order
// confirmation screen after the order is placed (app/cart/page.tsx).
// سيب أي قيمة فاضية "" لو مش عايزها تظهر. لو instapay و vodafoneCash الاتنين
// فاضيين، العميل هيوصله إن بيانات التحويل هتتبعتله على واتساب بعد تأكيد الطلب.
export const paymentConfig = {
  instapay: "01149631070",
  vodafoneCash: "01202997878",
  accountName: "First Class For Uniform"
};
