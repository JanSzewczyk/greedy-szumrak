"use client";

import { Button } from "@szum-tech/design-system";
import { StepperContent } from "../../../../design-system/src/components/stepper/stepper-content";

export default function ExpenseCategoriesPage() {
  return (
    <StepperContent value="/onboarding/categories">
      Expense Categories Page
      <Button onClick={() => alert("Finish!")}>Finish</Button>
    </StepperContent>
  );
}
