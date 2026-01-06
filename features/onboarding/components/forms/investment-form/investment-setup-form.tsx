"use client";

import * as React from "react";

import {
  BriefcaseIcon,
  Building2Icon,
  ChevronRightIcon,
  Edit2Icon,
  InfoIcon,
  PlusIcon,
  Trash2Icon,
  TrendingUpIcon
} from "lucide-react";
import { type DefaultValues } from "react-hook-form";

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSet,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
  toast
} from "@szum-tech/design-system";
import { InvestmentAccountCardForm } from "~/features/onboarding/components/forms/investment-form/investment-account-card-form";
import { brokers } from "~/features/onboarding/constants/investments";
import { type OnboardingInvestment } from "~/features/onboarding/types/onboarding";
import { type RedirectAction } from "~/lib/action-types";
import { InvestmentAccountItem } from "~/features/onboarding/components/investment-account-item";

export type InvestmentSetupFormProps = {
  onBackAction(): void;
  onContinueAction(data: Array<OnboardingInvestment>): RedirectAction;
  onSkipAction(): RedirectAction;
  initialAccounts?: Array<OnboardingInvestment>;
};

function getBrokerInfo(brokerId: string) {
  return brokers.find((b) => b.id === brokerId);
}

export function InvestmentSetupForm({
  onBackAction,
  onSkipAction,
  initialAccounts = [],
  onContinueAction
}: InvestmentSetupFormProps) {
  const [accounts, setAccounts] = React.useState<Array<OnboardingInvestment>>(initialAccounts);
  const [isPending, startTransition] = React.useTransition();

  const [showInvestmentAccountForm, setShowInvestmentAccountForm] = React.useState<
    false | { mode: "create" } | { mode: "edit"; index: number; defaultValues: DefaultValues<OnboardingInvestment> }
  >(false);

  function handleAddAccount() {
    setShowInvestmentAccountForm({ mode: "create" });
  }

  function handleSaveAccount(formData: OnboardingInvestment) {
    if (showInvestmentAccountForm) {
      if (showInvestmentAccountForm.mode === "edit") {
        setAccounts((prev) => prev.map((acc, idx) => (idx === showInvestmentAccountForm.index ? formData : acc)));
      } else {
        setAccounts((prev) => [...prev, formData]);
      }
    }

    handleCancelForm();
  }

  function handleCancelForm() {
    setShowInvestmentAccountForm(false);
  }

  function handleEditAccount(investmentAccount: OnboardingInvestment, index: number) {
    setShowInvestmentAccountForm({
      mode: "edit",
      index,
      defaultValues: investmentAccount
    });
  }

  function handleRemoveAccount(index: number) {
    setAccounts((prev) => prev.filter((_, idx) => idx !== index));
  }

  function handleContinue() {
    startTransition(async () => {
      const result = await onContinueAction(accounts);
      if (!result.success) {
        toast.error(result.error);
      }
    });
  }

  function handleSkip() {
    startTransition(async () => {
      const result = await onSkipAction();
      if (!result.success) {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="container-xl mt-2">
      <FieldSet>
        <FieldLegend>
          Add Investment Accounts <Badge variant="secondary">Optional</Badge>
        </FieldLegend>
        <FieldDescription>Aggregate your portfolio from different brokers and track profits/losses</FieldDescription>

        <Alert>
          <InfoIcon />
          <AlertTitle>You can add accounts later</AlertTitle>
          <AlertDescription>
            This step helps you have a complete financial picture right away, but you can skip it and add accounts
            anytime in settings.
          </AlertDescription>
        </Alert>

        <FieldGroup>
          {/* Add/Edit Form */}
          {showInvestmentAccountForm ? (
            <InvestmentAccountCardForm
              mode={showInvestmentAccountForm.mode}
              defaultValues={
                (showInvestmentAccountForm.mode === "edit" && showInvestmentAccountForm.defaultValues) || undefined
              }
              onSave={handleSaveAccount}
              onCancel={handleCancelForm}
            />
          ) : (
            <AddInvestmentButton onClick={handleAddAccount} />
          )}

          {/* Accounts List */}
          {accounts.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-muted-foreground text-sm font-semibold">Accounts ({accounts.length})</h3>
              </div>

              <ItemGroup className="space-y-2">
                {accounts.map((account, index) => (
                  <InvestmentAccountItem
                    key={index}
                    account={account}
                    onEdit={() => handleEditAccount(account, index)}
                    onRemove={() => handleRemoveAccount(index)}
                  />
                ))}
              </ItemGroup>
            </div>
          ) : !showInvestmentAccountForm ? (
            <InvestmentsEmptyState />
          ) : null}
        </FieldGroup>
      </FieldSet>

      {/* Action Buttons */}
      <div className="mt-10 flex justify-between">
        <Button type="button" variant="outline" onClick={onBackAction}>
          Back
        </Button>

        <div className="flex items-center gap-3">
          {accounts.length === 0 ? (
            <Button onClick={handleSkip} loading={isPending}>
              Skip for now
              <ChevronRightIcon className="ml-2 size-4" />
            </Button>
          ) : (
            <Button onClick={handleContinue} loading={isPending}>
              Continue with accounts
              <ChevronRightIcon className="ml-2 size-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function AddInvestmentButton({ onClick }: { onClick?: () => void }) {
  return (
    <button onClick={onClick} className="hover:[&>div]:border-primary hover:[&>div]:bg-primary/5">
      <Empty border="dashed" className="!p-8 transition-colors duration-300">
        <EmptyHeader>
          <EmptyMedia>
            <div className="bg-primary/10 flex size-12 items-center justify-center rounded-full">
              <PlusIcon className="text-primary size-6" />
            </div>
          </EmptyMedia>
          <EmptyTitle>Add Investment Account</EmptyTitle>
          <EmptyDescription>Connect your brokerage account to track portfolio </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </button>
  );
}

function InvestmentsEmptyState() {
  return (
    <Empty border="dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <BriefcaseIcon />
        </EmptyMedia>
        <EmptyTitle>No accounts added yet</EmptyTitle>
        <EmptyDescription>
          Add your investment accounts to track your portfolio performance across different brokers
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="text-mute inline-flex items-center gap-2">
          <TrendingUpIcon className="size-4" />
          <span>Track stocks, ETFs, bonds, and more</span>
        </div>
      </EmptyContent>
    </Empty>
  );
}
