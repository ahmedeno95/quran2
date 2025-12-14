import Image from "next/image";
import { CheckCircle2, Sparkles, ShieldCheck, Clock, Wifi, Video } from "lucide-react";
import { FormWizard } from "@/components/FormWizard";
import { BackgroundBlobs } from "@/components/BackgroundBlobs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ACADEMY_NAME, APPLY_CTA, BASIC_CONDITIONS, WELCOME_TAGLINE } from "@/lib/content";

export default function Page() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <BackgroundBlobs />

      <header className="relative">
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('/assets/header.jpg'), url('/assets/header.png')" }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/40 via-background/75 to-background" />

        <div className="container py-10 sm:py-14">
          <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_.8fr]">
            <div className="space-y-5">
              <Badge className="inline-flex items-center gap-2" variant="secondary">
                <Sparkles className="h-4 w-4" />
                {WELCOME_TAGLINE}
              </Badge>

              <h1 className="text-3xl font-extrabold leading-tight text-foreground sm:text-5xl">
                <span className="text-primary">{ACADEMY_NAME}</span>
                <span className="block text-lg font-semibold text-muted-foreground sm:text-xl">
                  نموذج تقديم المعلمات (أونلاين)
                </span>
              </h1>

              <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                يسعدنا استقبال طلبات المعلمات المؤهلات لتعليم القرآن الكريم والتجويد عبر الإنترنت.
                النموذج التالي عبارة عن خطوات قصيرة وواضحة، ويستغرق عادةً دقائق قليلة لإتمامه.
              </p>

              <div className="flex flex-col gap-3 sm:flex-row">
                <a href="#apply" className={cn(buttonVariants({ size: "lg" }))}>
                  {APPLY_CTA}
                </a>
                <a href="#conditions" className={cn(buttonVariants({ size: "lg", variant: "outline" }))}>
                  الاطلاع على الشروط
                </a>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <Card>
                  <CardContent className="flex items-center gap-3 p-4">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    <div className="text-sm">
                      <p className="font-semibold">خصوصية وتنظيم</p>
                      <p className="text-muted-foreground">سياسات واضحة للتواصل</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex items-center gap-3 p-4">
                    <Wifi className="h-5 w-5 text-primary" />
                    <div className="text-sm">
                      <p className="font-semibold">تعليم أونلاين</p>
                      <p className="text-muted-foreground">زووم / ميت / مشاركة شاشة</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="flex items-center gap-3 p-4">
                    <Clock className="h-5 w-5 text-primary" />
                    <div className="text-sm">
                      <p className="font-semibold">وقت محدد</p>
                      <p className="text-muted-foreground">من 1 ظهرًا إلى 8 مساءً</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <Card className="w-full max-w-md">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-3">
                    <Image
                      src="/assets/logo.png"
                      alt="Logo"
                      width={54}
                      height={54}
                      className="h-[54px] w-[54px] object-contain"
                      priority
                    />
                    <span>ملخص سريع</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3 text-sm">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />
                    <p className="text-muted-foreground">نموذج متعدد الخطوات مع حفظ الإجابات أثناء التنقل.</p>
                  </div>
                  <div className="flex items-start gap-3 text-sm">
                    <Video className="mt-0.5 h-5 w-5 text-primary" />
                    <p className="text-muted-foreground">يشترط فتح الكاميرا (مشرفات الحضور نساء فقط).</p>
                  </div>
                  <div className="rounded-lg border bg-muted/40 p-3 text-sm">
                    <p className="font-semibold">معلومة مهمة:</p>
                    <p className="text-muted-foreground">سعر الساعة: 70ج</p>
                  </div>
                  <a href="#apply" className={cn(buttonVariants({ className: "w-full" }))}>
                    ابدئي الآن
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </header>

      <section id="conditions" className="container py-10 sm:py-14">
        <div className="mb-6 space-y-2">
          <h2 className="text-2xl font-extrabold sm:text-3xl">الشروط الأساسية</h2>
          <p className="text-muted-foreground">نرجو قراءة الشروط التالية قبل التقديم لضمان توافق المتطلبات.</p>
        </div>

        <Card className="border-primary/20">
          <CardContent className="p-5 sm:p-7">
            <ul className="grid gap-3 sm:grid-cols-2">
              {BASIC_CONDITIONS.map((c) => (
                <li key={c} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  </span>
                  <span className="text-sm leading-relaxed text-foreground">{c}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      <section id="apply" className="container pb-16 sm:pb-24">
        <div className="mb-6 space-y-2">
          <h2 className="text-2xl font-extrabold sm:text-3xl">نموذج التقديم</h2>
          <p className="text-muted-foreground">
            اكملي الخطوات الأربع، ثم اضغطي إرسال. ستظهر رسالة نجاح عند اكتمال الإرسال.
          </p>
        </div>

        <FormWizard />
      </section>

      <footer className="border-t bg-background/60">
        <div className="container py-8 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} {ACADEMY_NAME}. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </main>
  );
}
