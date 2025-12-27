"use client";

import * as React from "react";

import {
  BriefcaseIcon,
  Building2Icon,
  CheckCircle2Icon,
  ChevronRightIcon,
  Edit2Icon,
  InfoIcon,
  PlusIcon,
  Trash2Icon,
  TrendingUpIcon
} from "lucide-react";

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
import { type InvestmentAccountSchemaFormData } from "~/features/onboarding/schemas/investments";
import { type RedirectAction } from "~/lib/action-types";

export type InvestmentSetupFormProps = {
  onBackAction(): void;
  // onContinueAction(data: InvestmentsFormData): RedirectAction;
  onSkipAction(): RedirectAction;
  initialAccounts?: Array<InvestmentAccountSchemaFormData>;
};

function getBrokerInfo(brokerId: string) {
  return brokers.find((b) => b.id === brokerId);
}

export function InvestmentSetupForm({ onBackAction, onSkipAction, initialAccounts = [] }: InvestmentSetupFormProps) {
  const [accounts, setAccounts] = React.useState<Array<InvestmentAccountSchemaFormData>>(initialAccounts ?? []);

  const [isAddingAccount, setIsAddingAccount] = React.useState(false);

  function handleAddAccount() {
    setIsAddingAccount(true);
  }

  function handleSaveAccount(data: InvestmentAccountSchemaFormData) {
    const accountData: InvestmentAccountSchemaFormData = {
      brokerId: data.brokerId,
      name: data.name,
      number: data.number,
      currency: data.currency
    };

    setAccounts((prev) => [...prev, accountData]);
    handleCancelForm();
  }

  function handleCancelForm() {
    setIsAddingAccount(false);
  }

  function handleRemoveAccount(accountId: string) {
    // setAccounts((prev) => prev.filter((acc) => acc.id !== accountId));
  }

  async function handleContinue() {
    // const result = await onContinueAction({ accounts });
    // if (!result.success) {
    //   toast.error(result.error);
    // }
  }

  async function handleSkip() {
    const result = await onSkipAction();
    if (!result.success) {
      toast.error(result.error);
    }
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
          {isAddingAccount ? (
            <InvestmentAccountCardForm onSave={handleSaveAccount} onCancel={handleCancelForm} />
          ) : (
            <AddInvestmentButton onClick={handleAddAccount} />
          )}

          {/* Accounts List */}
          {accounts.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-muted-foreground text-sm font-semibold">Added Accounts ({accounts.length})</h3>
              </div>

              <ItemGroup className="space-y-2">
                {accounts.map((account, index) => (
                  <AccountItem key={index} account={account} />
                ))}
              </ItemGroup>
            </div>
          ) : !isAddingAccount ? (
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
            <Button onClick={handleSkip}>
              Skip for now
              <ChevronRightIcon className="ml-2 size-4" />
            </Button>
          ) : (
            <Button onClick={handleContinue}>
              Continue with accounts
              <ChevronRightIcon className="ml-2 size-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function AccountItem({ account }: { account: InvestmentAccountSchemaFormData; onRemove: () => void, on Edit: () => void }) {
  const brokerInfo = getBrokerInfo(account.brokerId);

  return (
    <Item variant="outline">
      <ItemMedia variant="icon">
        <Building2Icon />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>
          {account?.name || brokerInfo?.name} <Badge variant="secondary">{account.currency}</Badge>
        </ItemTitle>
        {account.name ? <ItemDescription>{brokerInfo?.name}</ItemDescription> : null}
        <ItemDescription>Account: {account.number.slice(-4).padStart(account.number.length, "*")}</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button variant="ghost" size="sm">
          <Edit2Icon className="size-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Trash2Icon className="size-4" />
        </Button>
      </ItemActions>
    </Item>
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
