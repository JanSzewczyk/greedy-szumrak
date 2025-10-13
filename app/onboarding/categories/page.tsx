"use client";

import { Button } from "@szum-tech/design-system";
import { StepperContent } from "~/components/ui/stepper/stepper-content";

export default function ExpenseCategoriesPage() {
  return (
    <StepperContent value={4}>
      Expense Categories Page
      <Button onClick={() => alert("Finish!")}>Finish</Button>
    </StepperContent>
  );
}
