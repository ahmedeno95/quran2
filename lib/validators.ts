import { z } from "zod";

/**
 * Helpers (Arabic-friendly)
 */
const required = (label: string, min = 2) =>
  z
    .string()
    .trim()
    .min(min, `من فضلك اكتبي ${label} بشكل صحيح.`);

const requiredChoice = (label: string) =>
  z.string().trim().min(1, `من فضلك اختاري إجابة لـ "${label}".`);

/**
 * Accepts:
 * - "25"
 * - 25
 * and validates as English digits only
 */
const englishDigitsOnly = (label: string) =>
  z.preprocess(
    (v) => (typeof v === "number" ? String(v) : v),
    z
      .string({
        invalid_type_error: `من فضلك اكتبي ${label} بالأرقام الإنجليزية فقط.`,
        required_error: `من فضلك اكتبي ${label}.`
      })
      .trim()
      .min(1, `من فضلك اكتبي ${label}.`)
      .refine((v) => /^[0-9]+$/.test(v), {
        message: `من فضلك اكتبي ${label} بالأرقام الإنجليزية فقط.`
      })
  );

const numberFromEnglishDigits = (label: string, min: number, max: number) =>
  englishDigitsOnly(label)
    .transform((v) => Number(v))
    .refine((n) => Number.isFinite(n), { message: `من فضلك اكتبي ${label} بشكل صحيح.` })
    .refine((n) => n >= min && n <= max, {
      message: `من فضلك اكتبي ${label} رقمًا بين ${min} و ${max}.`
    });

export const whatsappRegex = /^\+?[0-9]{10,15}$/;

/**
 * ✅ Server + Client shared schema
 * - Note: Zod output types:
 *    age, online_years, kids_years become numbers after transform
 */
export const TeacherApplicationSchema = z.object({
  // القسم 2: البيانات الشخصية
  full_name_3: required("الاسم الثلاثي", 3),

  age: numberFromEnglishDigits("السن", 14, 80),

  marital_status: requiredChoice("الحالة الاجتماعية").refine(
    (v) => ["آنسة", "متزوجة", "مطلقة-أرملة"].includes(v),
    { message: "من فضلك اختاري الحالة الاجتماعية من الخيارات المتاحة." }
  ),

  whatsapp_number: z
    .string()
    .trim()
    .min(1, "من فضلك اكتبي رقم الواتساب.")
    .refine((v) => whatsappRegex.test(v), {
      message: "رقم واتساب غير صالح. اكتبيه بالأرقام الإنجليزية فقط (مثال: +201234567890)."
    }),

  education: required("المؤهل العلمي", 2),

  finished_study: requiredChoice("هل أنهيتم الدراسة؟").refine((v) => ["نعم", "لا"].includes(v), {
    message: "من فضلك اختاري نعم أو لا."
  }),

  // القسم 1: الشروط الأساسية والجاهزية التقنية
  agree_all_conditions: requiredChoice("الموافقة على الشروط").refine(
    (v) => v === "نعم، موافقة ومتوفرة لدي",
    { message: "لا يمكن إرسال الطلب دون الموافقة على جميع الشروط المذكورة." }
  ),

  available_1_to_8: requiredChoice("التفرغ من 1 إلى 8").refine(
    (v) => ["نعم", "لا"].includes(v),
    { message: "من فضلك اختاري إجابة صحيحة." }
  ),

  internet_type: requiredChoice("نوع الإنترنت").refine(
    (v) => ["واي فاي منزلي (Wi-Fi)", "باقة بيانات (Data)", "كلاهما"].includes(v),
    { message: "من فضلك اختاري نوع الإنترنت من الخيارات." }
  ),

  device_type: requiredChoice("نوع الجهاز").refine(
    (v) => ["هاتف", "لابتوب / كمبيوتر", "تابلت"].includes(v),
    { message: "من فضلك اختاري نوع الجهاز من الخيارات." }
  ),

  can_use_tools: requiredChoice("استخدام أدوات زووم/ميت/السبورة").refine((v) => v === "نعم", {
    message: "يشترط القدرة على استخدام زووم/ميت/السبورة/مشاركة الشاشة."
  }),

  agree_no_direct_contact: requiredChoice("الموافقة على سياسة عدم التواصل المباشر").refine(
    (v) => v === "موافقة",
    { message: "يلزم الموافقة على سياسة عدم التواصل المباشر."
  }),

  // القسم 3: المؤهلات القرآنية والعلمية
  ijazat_and_courses: required("الإجازات والدورات", 2),

  ijazah_hafs: requiredChoice("إجازة حفص").refine((v) => ["نعم", "لا"].includes(v), {
    message: "من فضلك اختاري نعم أو لا."
  }),

  ijazah_tajweed: requiredChoice("إجازة تجويد").refine((v) => ["نعم", "لا"].includes(v), {
    message: "من فضلك اختاري نعم أو لا."
  }),

  can_teach_tajweed: requiredChoice("تدريس التجويد").refine(
    (v) => ["نظري", "عملي", "كلاهما"].includes(v),
    { message: "من فضلك اختاري (نظري/عملي/كلاهما)." }
  ),

  can_teach_noor_al_bayan: requiredChoice("تدريس نور البيان").refine(
    (v) => ["نعم", "لا"].includes(v),
    { message: "من فضلك اختاري نعم أو لا."
  }),

  other_subjects: z.string().trim().optional().or(z.literal("")),

  // القسم 4: الخبرة والمنهجية التعليمية
  online_years: numberFromEnglishDigits("سنوات الخبرة أونلاين", 0, 60),

  kids_years: numberFromEnglishDigits("سنوات الخبرة مع الأطفال", 0, 60),

  good_with_kids: requiredChoice("الصبر مع الأطفال").refine((v) => ["نعم", "لا"].includes(v), {
    message: "من فضلك اختاري نعم أو لا."
  }),

  teaching_age_from: required("أصغر سن للتدريس", 1),

  preferred_students: requiredChoice("الفئة المفضلة").refine(
    (v) => ["أطفال", "كبار", "كلاهما"].includes(v),
    { message: "من فضلك اختاري الفئة من الخيارات."
  }),

  academies_worked_with: required("الأكاديميات التي عملت بها", 2),

  session_plan: required("طريقة تقسيم الحلقة", 10),

  agree_no_stopping_students_policy: requiredChoice("الموافقة على شرط عدم التوقف").refine(
    (v) => v === "نعم أوافق ولا بأس في ذلك",
    { message: "يلزم الموافقة على شرط عدم التوقف لاستكمال الإرسال."
  })
});

export type TeacherApplicationFormInput = z.input<typeof TeacherApplicationSchema>;
export type TeacherApplicationFormOutput = z.output<typeof TeacherApplicationSchema>;

/**
 * Used by the wizard to validate only the current step before moving next.
 */
export const stepFields = [
  // Step 1
  [
    "agree_all_conditions",
    "available_1_to_8",
    "internet_type",
    "device_type",
    "can_use_tools",
    "agree_no_direct_contact"
  ],
  // Step 2
  ["full_name_3", "age", "marital_status", "whatsapp_number", "education", "finished_study"],
  // Step 3
  [
    "ijazat_and_courses",
    "ijazah_hafs",
    "ijazah_tajweed",
    "can_teach_tajweed",
    "can_teach_noor_al_bayan",
    "other_subjects"
  ],
  // Step 4
  [
    "online_years",
    "kids_years",
    "good_with_kids",
    "teaching_age_from",
    "preferred_students",
    "academies_worked_with",
    "session_plan",
    "agree_no_stopping_students_policy"
  ]
] as const;
