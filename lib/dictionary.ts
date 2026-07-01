export type Lang = "ar" | "en";

export const dictionary = {
  ar: {
    brand: "فرست كلاس",
    brandSub: "لليونيفورم",
    nav: {
      home: "الرئيسية",
      sections: "الأقسام",
      projects: "سابقة الأعمال",
      clients: "عملاؤنا",
      contact: "تواصل معنا"
    },
    hero: {
      eyebrow: "متخصصون في اليونيفورم منذ 2009",
      title1: "FIRST CLASS",
      title2: "FOR UNIFORM",
      tagline: "حلول يونيفورم فاخرة لكل قطاع",
      browse: "تصفح المجموعة",
      whatsapp: "واتساب",
      call: "اتصل بنا"
    },
    sectionsPage: {
      eyebrow: "22 قسمًا متخصصًا",
      title: "اختر قطاعك",
      sub: "كل قطاع له تصميم وخامة تناسب طبيعة عمله"
    },
    categoryPage: {
      requestQuote: "اطلب عرض سعر",
      whatsapp: "واتساب",
      call: "اتصل الآن",
      gallery: "معرض الصور",
      placeholderNote:
        "صور المنتجات الحقيقية لهذا القسم هتتضاف هنا — المساحة جاهزة ومهيأة للعرض الاحترافي."
    },
    projects: {
      eyebrow: "أعمال منفذة بالفعل",
      title: "سابقة أعمالنا",
      sub: "بنفخر بثقة عملائنا في قطاعات مختلفة على مدار سنوات"
    },
    clients: {
      eyebrow: "أكثر من 60 عميل",
      title: "شركاء النجاح",
      sub: "من قطاع الأمن للمستشفيات للفنادق والمصانع — دي شركات وثقت فينا"
    },
    contact: {
      eyebrow: "خطوة واحدة تفصلك عن عرض السعر",
      title: "تواصل معنا",
      sub: "من غير فورم طويل. اختار الطريقة الأسهل ليك",
      whatsapp: "تواصل واتساب",
      call: "اتصال مباشر",
      share: "شارك الكتالوج",
      phones: "أرقام التواصل"
    },
    footer: {
      rights: "جميع الحقوق محفوظة",
      since: "منذ 2009"
    },
    sectorNames: {
      security: "قطاع الأمن",
      hospitals: "قطاع المستشفيات",
      restaurants: "قطاع المطاعم والكافيهات",
      cleaning: "قطاع النظافة",
      petroleum: "قطاع البترول",
      construction: "قطاع المقاولات والفنادق",
      factories: "مصانع"
    }
  },
  en: {
    brand: "FIRST CLASS",
    brandSub: "FOR UNIFORM",
    nav: {
      home: "Home",
      sections: "Sections",
      projects: "Our Work",
      clients: "Clients",
      contact: "Contact"
    },
    hero: {
      eyebrow: "Uniform specialists since 2009",
      title1: "FIRST CLASS",
      title2: "FOR UNIFORM",
      tagline: "Premium uniform solutions for every industry",
      browse: "Browse Collection",
      whatsapp: "WhatsApp",
      call: "Call Now"
    },
    sectionsPage: {
      eyebrow: "22 specialized sections",
      title: "Choose your sector",
      sub: "Every sector gets a fit and fabric built for how the job moves"
    },
    categoryPage: {
      requestQuote: "Request a Quote",
      whatsapp: "WhatsApp",
      call: "Call Now",
      gallery: "Gallery",
      placeholderNote:
        "Real product photography for this section drops in here — the layout is production-ready."
    },
    projects: {
      eyebrow: "Delivered work",
      title: "Previous Projects",
      sub: "Trusted by teams across sectors, year after year"
    },
    clients: {
      eyebrow: "60+ clients",
      title: "Partners in the field",
      sub: "From security to hospitals, hotels to factories — these are the names that trust us"
    },
    contact: {
      eyebrow: "One step from your quote",
      title: "Get in Touch",
      sub: "No long forms. Pick whatever's easiest for you",
      whatsapp: "Message on WhatsApp",
      call: "Call directly",
      share: "Share catalog",
      phones: "Contact numbers"
    },
    footer: {
      rights: "All rights reserved",
      since: "Since 2009"
    },
    sectorNames: {
      security: "Security",
      hospitals: "Hospitals",
      restaurants: "Restaurants & Cafes",
      cleaning: "Cleaning",
      petroleum: "Petroleum",
      construction: "Construction & Hotels",
      factories: "Factories"
    }
  }
} as const;
