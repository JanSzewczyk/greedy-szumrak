"use client";

import * as React from "react";

import { BriefcaseIcon, Building2Icon, CheckCircle2Icon, ChevronLeftIcon } from "lucide-react";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
  toast
} from "@szum-tech/design-system";
import { type BudgetTemplate } from "~/features/budget/types/budget-template";
import { OnboardingBudgetSummary } from "~/features/onboarding/components/final-summary/onboarding-budget-summary";
import { OnboardingPreferencesSummary } from "~/features/onboarding/components/final-summary/onboarding-preferences-summary";
import { getBrokerInfo } from "~/features/onboarding/constants/investments";
import { type Onboarding } from "~/features/onboarding/types/onboarding";
import { type RedirectAction } from "~/lib/action-types";

export type CompleteFormProps = {
  onboarding: Onboarding;
  budgetTemplate: BudgetTemplate | null;
  onBackAction(): void;
  onCompleteAction(): RedirectAction;
};

export function FinalSummary({ onboarding, budgetTemplate, onBackAction, onCompleteAction }: CompleteFormProps) {
  const [isPending, startTransition] = React.useTransition();

  const { preferences, budgetDetails, investments, products } = onboarding;
  const currency = preferences?.currency ?? "PLN";

  function handleComplete() {
    startTransition(async () => {
      const result = await onCompleteAction();
      if (!result.success) {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="container-xl">
      {/* Header */}
      <div className="mb-8 text-center">
        {/*<div className="bg-success/10 mx-auto mb-4 flex size-16 items-center justify-center rounded-full">*/}
        {/*  <PartyPopperIcon className="text-success size-8" />*/}
        {/*</div>*/}
        <h1 className="text-heading-h2 mb-2">Ready to complete setup!</h1>
        <p className="text-muted-foreground text-lead">Review your configuration below and finalize when ready</p>
      </div>

      {/* Summary Cards */}
      <div className="space-y-6">
        {/* Preferences Summary */}
        {preferences ? <OnboardingPreferencesSummary preferences={preferences} /> : null}

        {/* Budget Summary */}
        {products.budget && budgetDetails ? (
          <OnboardingBudgetSummary budgetTemplate={budgetTemplate} budgetDetails={budgetDetails} currency={currency} />
        ) : null}

        {/* Investments Summary */}
        {products.investment && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BriefcaseIcon className="size-5" />
                Investment Accounts
              </CardTitle>
            </CardHeader>
            <CardContent>
              {investments && investments.length > 0 ? (
                <ItemGroup>
                  {investments.map((account, index) => {
                    const brokerInfo = getBrokerInfo(account.brokerId);
                    return (
                      <Item key={index} variant="outline">
                        <ItemMedia variant="icon">
                          <Building2Icon />
                        </ItemMedia>
                        <ItemContent>
                          <ItemTitle>
                            {account.name || brokerInfo?.name}
                            <Badge variant="secondary" className="ml-2">
                              {account.currency}
                            </Badge>
                          </ItemTitle>
                          {account.name && <ItemDescription>{brokerInfo?.name}</ItemDescription>}
                          <ItemDescription>
                            Account: {account.number.slice(-4).padStart(account.number.length, "*")}
                          </ItemDescription>
                        </ItemContent>
                      </Item>
                    );
                  })}
                </ItemGroup>
              ) : (
                <Empty border="dashed">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <BriefcaseIcon />
                    </EmptyMedia>
                    <EmptyTitle>No accounts added</EmptyTitle>
                    <EmptyDescription>You can add investment accounts later in settings</EmptyDescription>
                  </EmptyHeader>
                  <EmptyContent>
                    <CheckCircle2Icon className="text-muted-foreground size-4" />
                    <span className="text-muted-foreground text-sm">This is completely optional</span>
                  </EmptyContent>
                </Empty>
              )}
            </CardContent>
          </Card>
        )}

        {/* Products Enabled */}
        {/*<Card>*/}
        {/*  <CardHeader>*/}
        {/*    <CardTitle className="flex items-center gap-2">*/}
        {/*      <CheckCircle2Icon className="size-5" />*/}
        {/*      Enabled Features*/}
        {/*    </CardTitle>*/}
        {/*  </CardHeader>*/}
        {/*  <CardContent>*/}
        {/*    <div className="flex flex-wrap gap-3">*/}
        {/*      {products.budget && (*/}
        {/*        <Badge className="gap-1.5 px-3 py-1.5">*/}
        {/*          <WalletIcon className="size-4" />*/}
        {/*          Monthly Budgets*/}
        {/*        </Badge>*/}
        {/*      )}*/}
        {/*      {products.investment && (*/}
        {/*        <Badge variant="secondary" className="gap-1.5 px-3 py-1.5">*/}
        {/*          <BriefcaseIcon className="size-4" />*/}
        {/*          Investment Tracking*/}
        {/*        </Badge>*/}
        {/*      )}*/}
        {/*    </div>*/}
        {/*  </CardContent>*/}
        {/*</Card>*/}
      </div>

      {/* Action Buttons */}
      <div className="mt-10 flex justify-between">
        <Button type="button" variant="outline" onClick={onBackAction} startIcon={<ChevronLeftIcon />}>
          Back
        </Button>

        <Button onClick={handleComplete} loading={isPending} size="lg">
          <CheckCircle2Icon className="mr-2 size-5" />
          Complete Setup
        </Button>
      </div>
    </div>
  );
}
