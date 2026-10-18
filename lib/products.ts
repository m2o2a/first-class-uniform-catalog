// 🧵 منتجات المصنع — متزامنة من برنامج الـERP (الموديلات + الوصف + الألوان)
// الألوان الفاضية = «حسب الطلب». المقاسات: tops (صدر) · pants (وسط) · free (مقاس فري).

export type SizeType = "tops" | "pants" | "free";

export type Product = {
  slug: string;
  erpId: number;
  ar: string;
  en: string;
  section: string; // slug القسم في lib/categories.ts
  descAr: string;
  descEn: string;
  colorsAr: string[];
  colorsEn: string[];
  sizes: SizeType[];
};

export const products: Product[] = [
  { slug: "baggy-cargo-pants", erpId: 1, ar: "بنطلون باجي", en: "Cargo Work Trousers", section: "pants", sizes: ["pants"], colorsAr: [], colorsEn: [],
    descAr: "بنطلون باجي عملي 6 جيوب: 2 منفاخ جانبي بغطاء و2 خلفي. قماش جبردين 3030 تقيل بيستحمل الشغل الطويل والغسيل المتكرر، بسوستة وزراير قوية. مناسب لأفراد الأمن والحراسات والشغل الميداني.",
    descEn: "Practical 6-pocket cargo trousers: 2 flapped side bellows pockets and 2 back pockets. Heavy 3030 gabardine that handles long shifts and frequent washing, with a strong zip and buttons. Ideal for security, guarding and field work." },
  { slug: "polo-tshirt", erpId: 2, ar: "تي شيرت بولو", en: "Polo T-Shirt", section: "polo", sizes: ["tops"], colorsAr: [], colorsEn: [],
    descAr: "تي شيرت بولو بياقة وبندة بزرارين، من قماش البيكا المريح اللي بيشرب العرق، وممكن شريط عاكس (لشغل النظافة). مثالي لأفراد الأمن والنظافة والشغل في الحر، واللوجو تطريز أو طباعة على الصدر.",
    descEn: "Collared polo with a two-button placket in breathable piqué fabric, with optional reflective tape for cleaning crews. Ideal for security, cleaning and hot-weather work; logo embroidered or printed on the chest." },
  { slug: "classic-security-trousers", erpId: 3, ar: "بنطلون أمن كلاسيك", en: "Classic Security Trousers", section: "pants", sizes: ["pants"], colorsAr: [], colorsEn: [],
    descAr: "بنطلون أمن كلاسيك رسمي بجيب لطش خلفي، من الجبردين المتين اللي بيحافظ على شكله، بسوستة وزرار. شكل محترم لأفراد الأمن والاستقبال والمكاتب.",
    descEn: "Formal classic trousers with a back welt pocket, in durable gabardine that keeps its shape, with zip and button. A smart look for security, reception and office teams." },
  { slug: "classic-shirt", erpId: 4, ar: "قميص كلاسيك", en: "Classic Shirt", section: "shirts", sizes: ["tops"], colorsAr: [], colorsEn: [],
    descAr: "قميص كلاسيك رسمي من قماش الداكرون الخفيف المريح وسهل الكي، ياقة وأساور محشية بتحافظ على شكلها، و10 زراير. مناسب للأمن والاستقبال والشركات، وبنطرّز لوجو الشركة على الصدر.",
    descEn: "Formal classic shirt in light, comfortable, easy-iron Dacron, with interlined collar and cuffs that hold their shape and 10 buttons. Suits security, reception and corporate staff; company logo embroidered on the chest." },
  { slug: "cap", erpId: 5, ar: "كاب", en: "Cap", section: "accessories", sizes: ["free"], colorsAr: [], colorsEn: [],
    descAr: "كاب من الجبردين بمقاس فري يناسب الكل. بنطرّز لوجو الشركة قدام، مناسب للأمن والعمال والفعاليات.",
    descEn: "Gabardine cap, one size fits all, with the company logo embroidered on the front. Great for security, workers and events." },
  { slug: "waist-apron", erpId: 6, ar: "إيبرون نص", en: "Waist Apron", section: "waist-apron", sizes: ["free"], colorsAr: [], colorsEn: [],
    descAr: "إيبرون نص (من الوسط لتحت) من الجبردين برباط وسط طويل. عملي للجرسونات والكاشير والمطابخ وسهل الغسيل، وممكن لوجو المطعم تطريز.",
    descEn: "Gabardine waist apron with long waist ties — practical for waiters, cashiers and kitchens, easy to wash, with optional embroidered restaurant logo." },
  { slug: "bib-apron", erpId: 7, ar: "مريلة صدر", en: "Bib Apron", section: "bib-apron", sizes: ["free"], colorsAr: [], colorsEn: [],
    descAr: "مريلة كاملة بصدر ورباط رقبة ووسط وجيب كبير قدام، من الجبردين المتين اللي بيحمي الهدوم في المطابخ والكافيهات. لوجو المطعم تطريز أو طباعة.",
    descEn: "Full bib apron with neck and waist ties and a large front pocket, in durable gabardine that protects clothing in kitchens and cafés. Restaurant logo embroidered or printed." },
  { slug: "chef-jacket", erpId: 8, ar: "جاكت شيف", en: "Chef Jacket", section: "chef", sizes: ["tops"], colorsAr: [], colorsEn: [],
    descAr: "جاكت شيف بياقة واقفة وزراير وتطعيم بيبنج بلون مختلف على الياقة والجنب والأساور، من الجبردين اللي بيستحمل حرارة المطبخ والغسيل. لوجو المطعم أو اسم الشيف تطريز.",
    descEn: "Chef jacket with stand collar, buttons and contrast piping on the collar, sides and cuffs, in gabardine that withstands kitchen heat and washing. Embroidered restaurant logo or chef name." },
  { slug: "security-belt", erpId: 9, ar: "حزام أمن (إيش)", en: "Security Belt", section: "accessories", sizes: ["free"], colorsAr: [], colorsEn: [],
    descAr: "حزام أمن (إيش) بتوكة معدن قوية، بيكمّل يونيفورم الأمن ويستحمل الاستعمال اليومي.",
    descEn: "Security belt with a strong metal buckle that completes the security uniform and stands up to daily use." },
  { slug: "sweatpants", erpId: 10, ar: "شروال", en: "Sweatpants", section: "pants", sizes: ["pants"], colorsAr: [], colorsEn: [],
    descAr: "شروال (بنطلون رياضي) من السمر ميلتون الناعم، بأستك ورباط في الوسط وأستك في الرجل وجيبين جانب. مريح جدًا للشغل الحركي والتمارين والمدارس.",
    descEn: "Soft summer-melton sweatpants with elastic drawstring waist, elastic cuffs and two side pockets. Very comfortable for active work, training and schools." },
  { slug: "waistcoat", erpId: 11, ar: "صديري", en: "Waistcoat", section: "hotel", sizes: ["tops"], colorsAr: [], colorsEn: [],
    descAr: "صديري رسمي بزراير وجيوب، من الجبردين ببطانة داخلية. شكل أنيق للأمن والاستقبال والفنادق والمطاعم، وبيتلبس فوق القميص.",
    descEn: "Formal buttoned waistcoat with pockets, in lined gabardine — an elegant look for security, reception, hotels and restaurants, worn over a shirt." },
  { slug: "utility-vest", erpId: 12, ar: "فيست عملي", en: "Utility Vest", section: "construction", sizes: ["tops"], colorsAr: [], colorsEn: [],
    descAr: "فيست عملي بسوستة وجيوب كتير بغطاء وسوست، مناسب للمشرفين والمهندسين والشغل الميداني والأمن. ممكن نزود شريط عاكس ولوجو الشركة.",
    descEn: "Zip-front utility vest with many flapped and zipped pockets, for supervisors, engineers, field work and security. Reflective tape and company logo available." },
  { slug: "twill-bib-apron", erpId: 14, ar: "مريلة جبردين ترجال", en: "Twill Bib Apron", section: "bib-apron", sizes: ["free"], colorsAr: [], colorsEn: [],
    descAr: "مريلة من الجبردين الترجال المتين بصدر وجيب، للمطابخ والمصانع والورش.",
    descEn: "Durable twill-gabardine bib apron with a pocket, for kitchens, factories and workshops." },
  { slug: "work-suit", erpId: 15, ar: "بدلة عمال", en: "Work Suit", section: "factory", sizes: ["tops", "pants"], colorsAr: [], colorsEn: [],
    descAr: "بدلة عمال (جاكت + بنطلون) من الجبردين الفسكوز. الجاكت بجيبين صدر بغطاء وأستك في الأكمام، والبنطلون بجيوب جانبية بغطاء. ممكن شريط عاكس على الأكمام ولوجو الشركة، للمصانع والمخازن والصيانة والنظافة.",
    descEn: "Two-piece work suit (jacket + trousers) in viscose gabardine: jacket with two flapped chest pockets and elastic cuffs, trousers with flapped side pockets. Optional reflective tape and company logo — for factories, warehouses, maintenance and cleaning." },
  { slug: "waterproof-fur-collar-jacket", erpId: 16, ar: "جاكت أمن وتر بروف بياقة فرو", en: "Waterproof Security Jacket with Fur Collar", section: "jackets", sizes: ["tops"], colorsAr: [], colorsEn: [],
    descAr: "جاكت أمن شتوي وتر بروف (ضد المية) بياقة فرو وبطانة دافية، للأمن والحراسات في البرد والمطر والشغل برّه.",
    descEn: "Waterproof winter security jacket with a fur collar and warm lining, for guards working outdoors in cold and rain." },
  { slug: "gabardine-security-jacket", erpId: 17, ar: "جاكت أمن جبردين مبطن", en: "Lined Gabardine Security Jacket", section: "jackets", sizes: ["tops"], colorsAr: [], colorsEn: [],
    descAr: "جاكت أمن من الجبردين ببطانة داخلية فايبر ملسوع (مبطن) وياقة، دافي وعملي لشغل الشتا، وممكن لوجو تطريز.",
    descEn: "Gabardine security jacket with quilted fibre lining and collar — warm and practical for winter shifts, with optional embroidered logo." },
  { slug: "waterproof-jacket", erpId: 18, ar: "جاكت وتر بروف", en: "Waterproof Jacket", section: "jackets", sizes: ["tops"], colorsAr: [], colorsEn: [],
    descAr: "جاكت وتر بروف (ضد المية) ببطانة فايبر ملسوع وظبط في الوسط، للمطر والهوا في الشغل الخارجي.",
    descEn: "Waterproof jacket with quilted fibre lining and adjustable waist, for rain and wind on outdoor duty." },
  { slug: "fur-lined-waterproof-jacket", erpId: 19, ar: "جاكت وتر بروف ببطانة فرو", en: "Fur-Lined Waterproof Jacket", section: "jackets", sizes: ["tops"], colorsAr: [], colorsEn: [],
    descAr: "جاكت شتوي وتر بروف مبطن ببطانة فرو، ياقة واقفة وسوستة وكبسون وجيبين بغطاء. أقصى دفا للحراسات الليلية والأماكن الباردة.",
    descEn: "Fur-lined waterproof winter jacket with stand collar, zip and snaps and two flapped pockets — maximum warmth for night guards and cold sites." }
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const productsInSection = (section: string) => products.filter((p) => p.section === section);

// 📏 دليل المقاسات (تقريبي — بيتأكد بعينة)
export const sizeTables: Record<"tops" | "pants", { titleAr: string; titleEn: string; colsAr: string[]; colsEn: string[]; rows: string[][] }> = {
  tops: { titleAr: "قمصان وتيشيرتات وجواكت", titleEn: "Shirts, tees & jackets",
    colsAr: ["المقاس", "محيط الصدر (سم)", "الوزن (كجم)"], colsEn: ["Size", "Chest (cm)", "Weight (kg)"],
    rows: [["S", "96–100", "55–65"], ["M", "100–106", "65–75"], ["L", "106–112", "75–85"], ["XL", "112–118", "85–95"], ["2XL", "118–124", "95–105"], ["3XL", "124–130", "105–115"], ["4XL", "130–138", "115–130"]] },
  pants: { titleAr: "بناطيل وشروال", titleEn: "Trousers",
    colsAr: ["المقاس", "محيط الوسط (سم)", "رقم", "الوزن (كجم)"], colsEn: ["Size", "Waist (cm)", "No.", "Weight (kg)"],
    rows: [["S", "76–80", "30", "55–65"], ["M", "81–86", "32", "65–75"], ["L", "87–92", "34", "75–85"], ["XL", "93–98", "36", "85–95"], ["2XL", "99–104", "38", "95–105"], ["3XL", "105–110", "40", "105–115"], ["4XL", "111–118", "42–44", "115–130"]] }
};

export const sizeTipsAr = [
  "هات قميص أو بنطلون بيظبط عليك، افرده وقيس من الباط للباط واضرب في 2 — ده محيط الصدر. وللبنطلون قيس عرض الوسط واضرب في 2.",
  "أو بشريط مقاس: الصدر عند أعرض حتة تحت الباط، والوسط عند خط السُرّة.",
  "لو بين مقاسين خد الأكبر — يونيفورم الشغل محتاج راحة في الحركة.",
  "للشركات: ابعتلنا كشف بالأطوال والأوزان، وإحنا نوزّع المقاسات ونبعت عينة مقاسات تتجرب الأول."
];
export const sizeTipsEn = [
  "Take a shirt or trousers that fit you well, lay flat and measure armpit to armpit × 2 — that's your chest. For trousers, measure the waist width × 2.",
  "Or with a tape: chest at the fullest part under the arms, waist at the navel line.",
  "Between two sizes? Choose the larger — workwear needs room to move.",
  "For companies: send us a list of heights and weights; we'll assign sizes and send a sizing sample set first."
];
