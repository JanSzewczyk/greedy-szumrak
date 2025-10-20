import * as React from "react";

import { ChevronRightIcon, WalletIcon } from "lucide-react";

import {
  Button,
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
  StepperContent
} from "@szum-tech/design-system";
import { startOnboarding } from "~/features/onboarding/server/actions/onboarding";
import { OnboardingSteps } from "~/features/onboarding/types/onboarding";
import logger from "~/lib/logger";

export default function OnboardingWelcomePage() {
  logger.info("Onboarding layout loaded");

  return (
    <StepperContent value={OnboardingSteps.WELCOME}>
      <div className="mx-auto max-w-xl">
        <h4 className="text-heading-5 mt-8 mb-4 text-center">Welcome to Greedy Szumrak</h4>
        <p className="text-subtitle-1 mb-8 text-center text-gray-400">Your personal finance management platform</p>

        <ItemGroup className="gap-y-8">
          <Item variant="outlined">
            <ItemMedia variant="icon">
              <WalletIcon />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Track Expenses</ItemTitle>
              <ItemDescription>
                Monitor your monthly spending across different categories with detailed insights.
              </ItemDescription>
            </ItemContent>
          </Item>

          <Item variant="outlined">
            <ItemMedia variant="icon">
              <WalletIcon />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Manage Investments</ItemTitle>
              <ItemDescription>
                Keep track of your investment portfolio and monitor returns in real-time.
              </ItemDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
      </div>
      <div className="mt-10 flex justify-end">
        <Button variant="contained" endIcon={<ChevronRightIcon />} onClick={startOnboarding}>
          Continue
        </Button>
      </div>
    </StepperContent>
  );
}
