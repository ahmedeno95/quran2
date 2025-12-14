import { CheckCircle2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Success({ onNew }: { onNew: () => void }) {
  return (
    <div className="space-y-5 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <CheckCircle2 className="h-9 w-9 text-primary" />
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-extrabold">تم استلام طلبك بنجاح ✨</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          شكرًا لكِ. تم إرسال البيانات إلى الأكاديمية وسيتم التواصل معكِ عند الحاجة بإذن الله.
        </p>
      </div>

      <Button type="button" variant="outline" onClick={onNew} className="mx-auto">
        تقديم جديد
        <RotateCcw className="mr-2 h-4 w-4" />
      </Button>
    </div>
  );
}
