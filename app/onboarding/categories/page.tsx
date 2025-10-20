"use client";

import { Button, StepperContent } from "@szum-tech/design-system";

export default function ExpenseCategoriesPage() {
  return (
    <StepperContent value="/onboarding/categories">
      Expense Categories Page
      <Button onClick={() => alert("Finish!")}>Finish</Button>
    </StepperContent>
  );
}
