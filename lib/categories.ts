export type Category = {
  slug: string;
  ar: string;
  en: string;
  descAr: string;
  descEn: string;
};

export const categories: Category[] = [
  { slug: "security", ar: "يونيفورم الأمن", en: "Security Uniform", descAr: "قطاع الحراسة والأمن", descEn: "Guarding & security teams" },
  { slug: "medical", ar: "يونيفورم طبي", en: "Medical Uniform", descAr: "الكوادر الطبية والفنية", descEn: "Clinical & technical staff" },
  { slug: "doctors", ar: "يونيفورم أطباء", en: "Doctors Uniform", descAr: "معاطف وأزياء الأطباء", descEn: "Physician coats & attire" },
  { slug: "nursing", ar: "يونيفورم تمريض", en: "Nursing Uniform", descAr: "أزياء التمريض العملية", descEn: "Practical nursing wear" },
  { slug: "restaurant", ar: "يونيفورم مطاعم", en: "Restaurant Uniform", descAr: "طاقم الصالة والخدمة", descEn: "Front-of-house & service staff" },
  { slug: "cafe", ar: "يونيفورم كافيهات", en: "Cafe Uniform", descAr: "طاقم الكافيهات", descEn: "Cafe & barista teams" },
  { slug: "hotel", ar: "يونيفورم فنادق", en: "Hotel Uniform", descAr: "الاستقبال وخدمة الضيافة", descEn: "Front desk & hospitality" },
  { slug: "corporate", ar: "يونيفورم شركات", en: "Corporate Uniform", descAr: "هوية موحدة للشركات", descEn: "Unified corporate identity" },
  { slug: "factory", ar: "يونيفورم مصانع", en: "Factory Uniform", descAr: "خطوط الإنتاج والمصانع", descEn: "Production line workwear" },
  { slug: "construction", ar: "يونيفورم مقاولات", en: "Construction Uniform", descAr: "مواقع البناء والمقاولات", descEn: "Job-site & contracting crews" },
  { slug: "petroleum", ar: "يونيفورم بترول", en: "Petroleum Uniform", descAr: "قطاع البترول والطاقة", descEn: "Oil, gas & energy sector" },
  { slug: "cleaning", ar: "يونيفورم نظافة", en: "Cleaning Uniform", descAr: "فرق النظافة والخدمات", descEn: "Cleaning & facility teams" },
  { slug: "school", ar: "يونيفورم مدارس", en: "School Uniform", descAr: "الزي المدرسي الموحد", descEn: "Unified school attire" },
  { slug: "chef", ar: "ملابس شيف", en: "Chef Wear", descAr: "المطابخ الاحترافية", descEn: "Professional kitchens" },
  { slug: "hi-vis", ar: "سترات عالية الوضوح", en: "High Visibility", descAr: "السلامة في بيئات العمل الخطرة", descEn: "Safety in high-risk sites" },
  { slug: "safety", ar: "ملابس السلامة", en: "Safety Wear", descAr: "معدات ومهمات الحماية", descEn: "Protective equipment & gear" },
  { slug: "coveralls", ar: "أفرول", en: "Coveralls", descAr: "أفرول العمل الشامل", descEn: "Full-body work coveralls" },
  { slug: "polo", ar: "بولو شيرت", en: "Polo Shirts", descAr: "بولو مطرز بالشعار", descEn: "Embroidered branded polos" },
  { slug: "tshirts", ar: "تي شيرت", en: "T-Shirts", descAr: "تيشيرتات العمل اليومية", descEn: "Everyday work tees" },
  { slug: "jackets", ar: "جاكيتات", en: "Jackets", descAr: "جاكيتات الشتاء والميدان", descEn: "Winter & field jackets" },
  { slug: "custom", ar: "يونيفورم حسب الطلب", en: "Custom Uniform", descAr: "تصميم خاص حسب احتياجك", descEn: "Designed to your brief" },
  { slug: "accessories", ar: "إكسسوارات", en: "Accessories", descAr: "شارات، أحزمة، وإضافات", descEn: "Badges, belts & add-ons" }
];

export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
