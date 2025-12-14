"use client";

import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { Info, ShieldAlert } from "lucide-react";

import { BASIC_CONDITIONS, NO_DIRECT_CONTACT_POLICY, NO_STOPPING_POLICY } from "@/lib/content";
import type { TeacherApplicationFormInput } from "@/lib/validators";
import { cn } from "@/lib/utils";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type Option = { label: string; value: string };

function FieldBlock({
  name,
  label,
  hint,
  children
}: {
  name: keyof TeacherApplicationFormInput;
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  const {
    formState: { errors }
  } = useFormContext<TeacherApplicationFormInput>();

  const message = (errors as any)?.[name]?.message as string | undefined;

  return (
    <div className="space-y-2">
      <Label className="text-sm font-semibold" htmlFor={String(name)}>
        {label}
      </Label>
      {children}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      {message ? <p className="text-sm text-destructive">{message}</p> : null}
    </div>
  );
}

function RadioCards({
  name,
  options,
  columns = 2
}: {
  name: keyof TeacherApplicationFormInput;
  options: Option[];
  columns?: 1 | 2 | 3;
}) {
  const { register, watch } = useFormContext<TeacherApplicationFormInput>();
  const value = watch(name) as string;

  const gridCols = useMemo(() => {
    if (columns === 1) return "";
    if (columns === 2) return "sm:grid-cols-2";
    return "sm:grid-cols-3";
  }, [columns]);

  return (
    <div className={cn("grid gap-2", gridCols)}>
      {options.map((opt) => {
        const id = `${String(name)}-${opt.value}`;
        const selected = value === opt.value;

        return (
          <label
            key={opt.value}
            htmlFor={id}
            className={cn(
              "flex cursor-pointer items-center justify-between gap-4 rounded-lg border bg-background px-4 py-3 text-sm shadow-sm transition",
              "hover:bg-muted/60",
              selected && "border-primary ring-2 ring-primary/20"
            )}
          >
            <span className="leading-relaxed">{opt.label}</span>
            <input
              id={id}
              type="radio"
              value={opt.value}
              className="h-4 w-4 accent-[hsl(var(--primary))]"
              {...register(name as any)}
            />
          </label>
        );
      })}
    </div>
  );
}

function AgreementCheckbox({
  name,
  label,
  policyText,
  acceptedValue
}: {
  name: keyof TeacherApplicationFormInput;
  label: string;
  policyText: string;
  acceptedValue: string;
}) {
  const { setValue, watch } = useFormContext<TeacherApplicationFormInput>();
  const current = watch(name) as string;
  const checked = current === acceptedValue;

  return (
    <div className="space-y-3">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>سياسة الأكاديمية</AlertTitle>
        <AlertDescription className="leading-relaxed">{policyText}</AlertDescription>
      </Alert>

      <label className="flex cursor-pointer items-start gap-3 rounded-lg border bg-muted/30 p-4 hover:bg-muted/40">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 accent-[hsl(var(--primary))]"
          checked={checked}
          onChange={(e) =>
            setValue(name as any, e.target.checked ? acceptedValue : "", { shouldValidate: true })
          }
        />
        <span className="text-sm leading-relaxed">
          {label} <span className="font-semibold text-primary">{acceptedValue}</span>
        </span>
      </label>
    </div>
  );
}

/* -------------------- STEP 1 -------------------- */
export function StepOne() {
  const { watch } = useFormContext<TeacherApplicationFormInput>();

  const agreeAll = watch("agree_all_conditions");
  const canUseTools = watch("can_use_tools");

  const blocked =
    agreeAll && agreeAll !== "نعم، موافقة ومتوفرة لدي"
      ? "لا يمكن إكمال التقديم دون الموافقة على الشروط الأساسية."
      : canUseTools && canUseTools !== "نعم"
      ? "يشترط القدرة على استخدام زووم/ميت/السبورة/مشاركة الشاشة."
      : null;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-primary/20 bg-card p-5 sm:p-7">
        <h3 className="text-lg font-extrabold mb-3">الشروط الأساسية</h3>
        <ul className="grid gap-2 sm:grid-cols-2">
          {BASIC_CONDITIONS.map((c) => (
            <li key={c} className="flex items-start gap-2 text-sm text-foreground">
              <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">
                •
              </span>
              <span className="leading-relaxed">{c}</span>
            </li>
          ))}
        </ul>
      </div>

      {blocked ? (
        <Alert variant="destructive">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>تنبيه مهم</AlertTitle>
          <AlertDescription>{blocked}</AlertDescription>
        </Alert>
      ) : null}

      <FieldBlock name="agree_all_conditions" label="1) هل توافقين على جميع الشروط المذكورة أعلاه؟">
        <RadioCards
          name="agree_all_conditions"
          options={[
            { label: "نعم، موافقة ومتوفرة لدي", value: "نعم، موافقة ومتوفرة لدي" },
            { label: "لا", value: "لا" }
          ]}
        />
      </FieldBlock>

      <FieldBlock name="available_1_to_8" label="2) هل حضرتك متفرغة من 1 ظهراً لـ 8 مساءً (4 ساعات على الأقل)؟">
        <RadioCards
          name="available_1_to_8"
          options={[
            { label: "نعم", value: "نعم" },
            { label: "لا", value: "لا" },
          ]}
          columns={3}
        />
      </FieldBlock>

      <FieldBlock name="internet_type" label="3) الإنترنت المتوفر لديكم:">
        <RadioCards
          name="internet_type"
          options={[
            { label: "واي فاي منزلي (Wi-Fi)", value: "واي فاي منزلي (Wi-Fi)" },
            { label: "باقة بيانات (Data)", value: "باقة بيانات (Data)" },
            { label: "كلاهما", value: "كلاهما" }
          ]}
          columns={3}
        />
      </FieldBlock>

      <FieldBlock name="device_type" label="4) هل العمل سيكون عن طريق الهاتف أم لابتوب؟">
        <RadioCards
          name="device_type"
          options={[
            { label: "هاتف", value: "هاتف" },
            { label: "لابتوب / كمبيوتر", value: "لابتوب / كمبيوتر" },
            { label: "تابلت", value: "تابلت" }
          ]}
          columns={3}
        />
      </FieldBlock>

      <FieldBlock
        name="can_use_tools"
        label="5) هل يمكنكم استخدام أدوات الزووم وجوجل ميت والسبورة ومشاركة الشاشة (شرط أساسي)؟"
      >
        <RadioCards
          name="can_use_tools"
          options={[
            { label: "نعم", value: "نعم" },
            { label: "لا", value: "لا" }
          ]}
        />
      </FieldBlock>

      <FieldBlock name="agree_no_direct_contact" label="6) تمنع الأكاديمية التواصل المباشر بين الطالب والمعلم...">
        <AgreementCheckbox
          name="agree_no_direct_contact"
          label="أوافق على هذه السياسة:"
          policyText={NO_DIRECT_CONTACT_POLICY}
          acceptedValue="موافقة"
        />
      </FieldBlock>
    </div>
  );
}

/* -------------------- STEP 2 -------------------- */
export function StepTwo() {
  const { register } = useFormContext<TeacherApplicationFormInput>();

  return (
    <div className="space-y-6">
      <FieldBlock name="full_name_3" label="1) الاسم ثلاثي">
        <Input id="full_name_3" placeholder="مثال: فاطمة أحمد محمد" {...register("full_name_3")} />
      </FieldBlock>

      <FieldBlock name="age" label="2) السن" hint="اكتبيه بالأرقام الإنجليزية فقط (مثال: 25).">
        <Input id="age" inputMode="numeric" placeholder="مثال: 25" {...register("age" as any)} />
      </FieldBlock>

      <FieldBlock name="marital_status" label="3) الحالة الاجتماعية">
<RadioCards
  name="marital_status"
  options={[
    { label: "آنسة", value: "آنسة" },
    { label: "مخطوبة", value: "مخطوبة" },
    { label: "متزوجة", value: "متزوجة" },
    { label: "متزوجة وحامل", value: "متزوجة وحامل" },
    { label: "مطلقة-أرملة", value: "مطلقة-أرملة" }
  ]}
  columns={3}
/>
      </FieldBlock>

      <FieldBlock
        name="whatsapp_number"
        label="4) رقم واتساب بالإنجليزي"
        hint="اكتبيه بصيغة صحيحة (مثال: +201234567890) أو (01234567890)."
      >
        <Input
          id="whatsapp_number"
          dir="ltr"
          className="text-left"
          inputMode="tel"
          placeholder="+201234567890"
          {...register("whatsapp_number")}
        />
      </FieldBlock>

      <FieldBlock name="education" label="5) المؤهل العلمي">
        <Input id="education" placeholder="مثال: ليسانس / بكالوريوس ..." {...register("education")} />
      </FieldBlock>

      <FieldBlock name="finished_study" label="6) هل أنهيتم الدراسة؟">
        <RadioCards
          name="finished_study"
          options={[
            { label: "نعم", value: "نعم" },
            { label: "لا", value: "لا" }
          ]}
        />
      </FieldBlock>
    </div>
  );
}

/* -------------------- STEP 3 -------------------- */
export function StepThree() {
  const { register } = useFormContext<TeacherApplicationFormInput>();

  return (
    <div className="space-y-6">
      <FieldBlock
        name="ijazat_and_courses"
        label="1) الإجازات والدورات"
        hint="اذكري الإجازات والدورات بإيجاز (أو اكتبي: لا يوجد)."
      >
        <Textarea
          id="ijazat_and_courses"
          rows={4}
          placeholder="مثال: إجازة في ... / دورة تجويد ... / دورة نور البيان ..."
          {...register("ijazat_and_courses")}
        />
      </FieldBlock>

      <FieldBlock name="ijazah_hafs" label="2) إجازة حفص؟">
        <RadioCards
          name="ijazah_hafs"
          options={[
            { label: "نعم", value: "نعم" },
            { label: "لا", value: "لا" }
          ]}
        />
      </FieldBlock>

      <FieldBlock name="ijazah_tajweed" label="3) إجازة تجويد؟">
        <RadioCards
          name="ijazah_tajweed"
          options={[
            { label: "نعم", value: "نعم" },
            { label: "لا", value: "لا" }
          ]}
        />
      </FieldBlock>

      <FieldBlock name="can_teach_tajweed" label="4) تدريس التجويد؟">
        <RadioCards
          name="can_teach_tajweed"
          options={[
            { label: "نظري", value: "نظري" },
            { label: "عملي", value: "عملي" },
            { label: "كلاهما", value: "كلاهما" }
          ]}
          columns={3}
        />
      </FieldBlock>

      <FieldBlock name="can_teach_noor_al_bayan" label="5) تدريس نور البيان؟">
        <RadioCards
          name="can_teach_noor_al_bayan"
          options={[
            { label: "نعم", value: "نعم" },
            { label: "لا", value: "لا" }
          ]}
        />
      </FieldBlock>

      <FieldBlock name="other_subjects" label="6) مواد أخرى؟ (اختياري)">
        <Textarea id="other_subjects" rows={3} placeholder="مثال: تحفيظ / تصحيح تلاوة /..." {...register("other_subjects")} />
      </FieldBlock>
    </div>
  );
}

/* -------------------- STEP 4 -------------------- */
export function StepFour() {
  const { register } = useFormContext<TeacherApplicationFormInput>();

  return (
    <div className="space-y-6">
      <FieldBlock name="online_years" label="1) سنوات الخبرة أونلاين" hint="بالأرقام الإنجليزية فقط.">
        <Input id="online_years" inputMode="numeric" placeholder="مثال: 2" {...register("online_years" as any)} />
      </FieldBlock>

      <FieldBlock name="kids_years" label="2) سنوات خبرة مع الأطفال" hint="بالأرقام الإنجليزية فقط.">
        <Input id="kids_years" inputMode="numeric" placeholder="مثال: 1" {...register("kids_years" as any)} />
      </FieldBlock>

      <FieldBlock name="good_with_kids" label="3) خبرة وصبر مع الأطفال؟">
        <RadioCards
          name="good_with_kids"
          options={[
            { label: "نعم", value: "نعم" },
            { label: "لا", value: "لا" }
          ]}
        />
      </FieldBlock>

      <FieldBlock name="teaching_age_from" label="4) من أي سن تستطيعين التدريس؟">
        <Input id="teaching_age_from" placeholder="مثال: من 4 سنوات" {...register("teaching_age_from")} />
      </FieldBlock>

      <FieldBlock name="preferred_students" label="5) الفئة المفضلة">
        <RadioCards
          name="preferred_students"
          options={[
            { label: "أطفال", value: "أطفال" },
            { label: "كبار", value: "كبار" },
            { label: "كلاهما", value: "كلاهما" }
          ]}
          columns={3}
        />
      </FieldBlock>

      <FieldBlock name="academies_worked_with" label="6) الأكاديميات التي عملت بها" hint="اكتبي الأسماء أو اكتبي: لا يوجد.">
        <Textarea id="academies_worked_with" rows={3} placeholder="..." {...register("academies_worked_with")} />
      </FieldBlock>

      <FieldBlock name="session_plan" label="7) كيف تقسمين الحلقة القرآنية؟" hint="وصف تفصيلي (مثال: تلاوة/تصحيح/مراجعة/تجويد/واجب).">
        <Textarea id="session_plan" rows={4} placeholder="..." {...register("session_plan")} />
      </FieldBlock>

      <FieldBlock name="agree_no_stopping_students_policy" label="8) شرط عدم التوقف مع الطلاب…">
        <AgreementCheckbox
          name="agree_no_stopping_students_policy"
          label="أوافق على هذا الشرط:"
          policyText={NO_STOPPING_POLICY}
          acceptedValue="نعم أوافق ولا بأس في ذلك"
        />
      </FieldBlock>
    </div>
  );
}
