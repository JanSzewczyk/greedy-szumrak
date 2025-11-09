import * as React from "react";

import { CheckIcon, TrendingUpIcon, WalletIcon } from "lucide-react";

import { auth } from "@clerk/nextjs/server";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
  StepperContent
} from "@szum-tech/design-system";
import { unauthorized } from "next/navigation";
import { ProductsForm } from "~/features/onboarding/components/forms/products-form";
import { startOnboarding } from "~/features/onboarding/server/actions/start-onboarding";
import { getOnboardingById } from "~/features/onboarding/server/db/onboarding";
import { OnboardingSteps } from "~/features/onboarding/types/onboarding";
import logger from "~/lib/logger";

async function loadData() {
  const { userId, isAuthenticated } = await auth();

  if (!isAuthenticated) {
    logger.warn("User is not authenticated");
    return unauthorized();
  }

  const [, onboarding] = await getOnboardingById(userId);
  logger.info("Onboarding welcome step loaded");

  return { onboarding };
}

export default async function OnboardingWelcomePage() {
  const { onboarding } = await loadData();

  return (
    <StepperContent value={OnboardingSteps.WELCOME}>
      <div className="container-xl">
        <h4 className="text-heading-h1 mb-3 mt-2 text-center">Welcome to Greedy Szumrak</h4>
        <p className="text-lead text-center">Your personal finance management platform</p>

        <ItemGroup className="py-6">
          <Item>
            <ItemMedia variant="icon">
              <WalletIcon />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Control expenses</ItemTitle>
              <ItemDescription>Create budgets and track how much you can still spend in each category</ItemDescription>
            </ItemContent>
          </Item>
          <Item>
            <ItemMedia variant="icon">
              <TrendingUpIcon />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Monitor investments</ItemTitle>
              <ItemDescription>Aggregate portfolio from different brokers and track profits/losses</ItemDescription>
            </ItemContent>
          </Item>
          <Item>
            <ItemMedia variant="icon">
              <CheckIcon />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Simple setup</ItemTitle>
              <ItemDescription>Ready templates - working budgets in less than 2 minutes</ItemDescription>
            </ItemContent>
          </Item>
        </ItemGroup>

        <ProductsForm onContinueAction={startOnboarding} defaultValues={onboarding?.products} />
      </div>
    </StepperContent>
  );
}
