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
import { redirect } from "next/navigation";
import { ProductsForm } from "~/features/onboarding/components/forms/products-form";
import { startOnboarding } from "~/features/onboarding/server/actions/start-onboarding";
import { getOnboardingById } from "~/features/onboarding/server/db/onboarding";
import { OnboardingSteps } from "~/features/onboarding/types/onboarding";
import { createLogger } from "~/lib/logger";

const logger = createLogger({ module: "onboarding-welcome-page" });

async function loadData() {
  const { userId } = await auth();

  // Proxy.ts enforces authentication, but defensive check for type safety
  if (!userId) {
    logger.error("No userId despite proxy authentication");
    redirect("/sign-in");
  }

  logger.info({ userId }, "Loading onboarding welcome page data");

  const [error, onboarding] = await getOnboardingById(userId);
  // Welcome page is special - isNotFound is expected for first-time visitors
  if (error && !error.isNotFound) {
    logger.error(
      {
        userId,
        errorCode: error.code,
        isRetryable: error.isRetryable
      },
      "Database error fetching onboarding data"
    );
    if (error.isRetryable) {
      // Transient error - let error.tsx handle with retry UI
      throw error;
    }
    throw new Error("Unable to access onboarding data");
  }

  if (onboarding) {
    logger.info(
      {
        userId,
        onboardingId: onboarding.id
      },
      "Returning user - loaded existing onboarding data"
    );
  } else {
    logger.info({ userId }, "First-time visitor - onboarding will be created on continue");
  }

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
