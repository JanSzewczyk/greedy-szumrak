import { CalendarIcon } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@szum-tech/design-system";
import { type OnboardingPreferences } from "~/features/onboarding/types/onboarding";

export type OnboardingPreferencesSummaryProps = {
  preferences: OnboardingPreferences;
};

export function OnboardingPreferencesSummary({ preferences }: OnboardingPreferencesSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="size-5" />
          Preferences
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-muted-foreground text-sm">Currency</p>
            <p className="font-medium">{preferences.currency}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-sm">Date Format</p>
            <p className="font-medium">{preferences.dateFormat}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
