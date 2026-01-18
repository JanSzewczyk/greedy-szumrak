import * as React from "react";

import { CoinsIcon, WalletIcon } from "lucide-react";

import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
  Separator
} from "@szum-tech/design-system";
import { DynamicIcon } from "lucide-react/dynamic";
import { type BudgetTemplate } from "~/features/budget/types/budget-template";
import { type OnboardingBudgetDetails } from "~/features/onboarding/types/onboarding";
import { formatMoney } from "~/utils/format-money";

export type OnboardingBudgetSummaryProps = {
  budgetTemplate: BudgetTemplate | null;
  budgetDetails: OnboardingBudgetDetails;
  currency: string;
};

export function OnboardingBudgetSummary({ budgetTemplate, budgetDetails, currency }: OnboardingBudgetSummaryProps) {
  const totalBudget = React.useMemo(() => {
    if (!budgetDetails?.allocations) return 0;
    return budgetDetails.allocations.reduce(
      (sum, allocation) => sum + allocation.categories.reduce((catSum, cat) => catSum + (cat.amount || 0), 0),
      0
    );
  }, [budgetDetails]);

  const categoryCount = React.useMemo(() => {
    if (!budgetDetails?.allocations) return 0;
    return budgetDetails.allocations.reduce((sum, allocation) => sum + allocation.categories.length, 0);
  }, [budgetDetails]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <WalletIcon className="size-5" />
          Budget Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Template Info */}
        <div className="bg-muted/50 flex items-center justify-between rounded-lg p-4">
          <div>
            <p className="text-muted-foreground text-sm">Template</p>
            <p className="text-lg font-semibold">{budgetTemplate?.name ?? "Custom"}</p>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground text-sm">Monthly Budget</p>
            <p className="text-primary text-lg font-semibold">{formatMoney(totalBudget, { currency, decimals: 0 })}</p>
          </div>
        </div>

        <Separator />

        {/* Allocations Summary */}
        <div className="space-y-3">
          <p className="text-muted-foreground text-sm font-medium">
            Allocations ({budgetDetails.allocations.length} groups, {categoryCount} categories)
          </p>
          <ItemGroup className="space-y-2">
            {budgetDetails.allocations.map((allocation) => {
              const allocationTotal = allocation.categories.reduce((sum, cat) => sum + (cat.amount || 0), 0);
              return (
                <Item key={allocation.type} variant="muted">
                  <ItemMedia variant="icon">
                    <CoinsIcon />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{allocation.label}</ItemTitle>
                    <ItemDescription>{allocation.categories.length} categories</ItemDescription>
                  </ItemContent>
                  <div className="text-right">
                    <p className="font-semibold">{formatMoney(allocationTotal, { currency, decimals: 0 })}</p>
                    <p className="text-muted-foreground text-xs">
                      {Math.round((allocationTotal / totalBudget) * 100)}% of budget
                    </p>
                  </div>
                </Item>
              );
            })}
          </ItemGroup>
        </div>

        {/* Categories Preview */}
        <div className="space-y-2">
          <p className="text-muted-foreground text-sm font-medium">Top Categories</p>
          <div className="flex flex-wrap gap-2">
            {budgetDetails.allocations
              .flatMap((a) => a.categories)
              .slice(0, 6)
              .map((category, index) => (
                <Badge key={index} variant="outline" className="gap-1.5 py-1">
                  {category.icon && (
                    <DynamicIcon name={category.icon} className="size-3" style={{ color: category.color }} />
                  )}
                  {category.name}
                </Badge>
              ))}
            {categoryCount > 6 && <Badge variant="secondary">+{categoryCount - 6} more</Badge>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
