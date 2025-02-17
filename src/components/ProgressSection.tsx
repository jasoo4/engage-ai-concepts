
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleProgress } from "./CircleProgress";

export function ProgressSection() {
  return (
    <Card className="w-full bg-gradient-to-br from-theme-purple/5 to-theme-teal/5">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Your Progress</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <CircleProgress progress={35} size={120} strokeWidth={10} />
        <div className="text-center">
          <p className="text-2xl font-bold text-theme-purple">35%</p>
          <p className="text-sm text-muted-foreground">Overall Progress</p>
        </div>
      </CardContent>
    </Card>
  );
}
