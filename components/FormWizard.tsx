"use client";

import { useMemo, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Loader2, Send } from "lucide-react";

import { Stepper } from "@/components/Stepper";
import { StepOne, StepTwo, StepThree, StepFour } from "@/components/Steps";
import { Success } from "@/components/Success";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  TeacherApplicationSchema,
  stepFields,
  type TeacherApplicationFormInput,
  type TeacherApplicationFormOutput
} from "@/lib/validators";

const stepsMeta = [
  { title: "الشروط والجاهزية", description: "تأكيد المتطلبات التقنية" },
  { title: "البيانات الشخصية", description: "معلومات التواصل" },
  { title: "المؤهلات", description: "إجازات ودورات" },
  { title: "الخبرة والمنهجية", description: "طريقة التدريس" }
];

export function FormWizard() {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const topRef = useRef<HTMLDivElement | null>(null);

  const methods = useForm<TeacherApplicationFormInput, any, TeacherApplicationFormOutput>({
    resolver: zodResolver(TeacherApplicationSchema),
    mode: "onTouched",
    defaultValues: {
      agree_all_conditions: "",
      available_1_to_8: "",
      internet_type: "",
      device_type: "",
      can_use_tools: "",
      agree_no_direct_contact: "",

      full_name_3: "",
      age: "",
      marital_status: "",
      whatsapp_number: "",
      education: "",
      finished_study: "",

      ijazat_and_courses: "",
      ijazah_hafs: "",
      ijazah_tajweed: "",
      can_teach_tajweed: "",
      can_teach_noor_al_bayan: "",
      other_subjects: "",

      online_years: "",
      kids_years: "",
      good_with_kids: "",
      teaching_age_from: "",
      preferred_students: "",
      academies_worked_with: "",
      session_plan: "",
      agree_no_stopping_students_policy: ""
    }
  });

  const progress = useMemo(() => Math.round(((step + 1) / stepsMeta.length) * 100), [step]);

  const stepComponent = useMemo(() => {
    switch (step) {
      case 0:
        return <StepOne />;
      case 1:
        return <StepTwo />;
      case 2:
        return <StepThree />;
      case 3:
        return <StepFour />;
      default:
        return null;
    }
  }, [step]);

  async function goNext() {
    setServerError(null);
    const fields = stepFields[step] as unknown as (keyof TeacherApplicationFormInput)[];
    const ok = await methods.trigger(fields, { shouldFocus: true });
    if (!ok) return;

    setDirection(1);
    setStep((s) => Math.min(s + 1, stepsMeta.length - 1));
    requestAnimationFrame(() => topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  function goPrev() {
    setServerError(null);
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
    requestAnimationFrame(() => topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  async function onSubmit(values: TeacherApplicationFormOutput) {
    setServerError(null);

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });

      const json = (await res.json().catch(() => null)) as
        | null
        | { ok?: boolean; message?: string; errors?: Record<string, string[]> };

      if (!res.ok) {
        if (json?.errors) {
          for (const [field, msgs] of Object.entries(json.errors)) {
            const msg = msgs?.[0];
            if (msg) methods.setError(field as any, { type: "server", message: msg });
          }
        }
        setServerError(json?.message || "تعذر الإرسال الآن. جرّبي مرة أخرى بعد قليل.");
        return;
      }

      setSuccess(true);
      requestAnimationFrame(() => topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    } catch {
      setServerError("حدث خطأ في الاتصال. تأكدي من الإنترنت ثم أعيدي المحاولة.");
    }
  }

  if (success) {
    return (
      <Card ref={topRef}>
        <CardContent className="p-6 sm:p-8">
          <Success
            onNew={() => {
              setSuccess(false);
              setStep(0);
              setDirection(1);
              setServerError(null);
              methods.reset();
              requestAnimationFrame(() => topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
            }}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card ref={topRef} className="border-primary/15">
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-4">
          <span>تقديم المعلمات</span>
          <span className="text-sm font-semibold text-muted-foreground">{progress}%</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 p-5 sm:p-7">
        <Stepper steps={stepsMeta} currentStep={step} />

        {serverError && (
          <Alert variant="destructive">
            <AlertTitle>تنبيه لطيف</AlertTitle>
            <AlertDescription>{serverError}</AlertDescription>
          </Alert>
        )}

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={step}
                initial={{ opacity: 0, x: direction === 1 ? -24 : 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction === 1 ? 24 : -24 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="space-y-6"
              >
                {stepComponent}
              </motion.div>
            </AnimatePresence>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={goPrev}
                disabled={step === 0 || methods.formState.isSubmitting}
                className="w-full sm:w-auto"
              >
                <ArrowRight className="ml-2 h-4 w-4" />
                السابق
              </Button>

              {step < stepsMeta.length - 1 ? (
                <Button type="button" onClick={goNext} disabled={methods.formState.isSubmitting} className="w-full sm:w-auto">
                  التالي
                  <ArrowLeft className="mr-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={methods.formState.isSubmitting} className="w-full sm:w-auto">
                  {methods.formState.isSubmitting ? (
                    <>
                      <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                      جارٍ الإرسال...
                    </>
                  ) : (
                    <>
                      إرسال الطلب
                      <Send className="mr-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
