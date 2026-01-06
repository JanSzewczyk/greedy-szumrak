import { Building2Icon, Edit2Icon, Trash2Icon } from "lucide-react";

import {
  Badge,
  Button,
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle
} from "@szum-tech/design-system";
import { getBrokerInfo } from "~/features/onboarding/constants/investments";
import { type OnboardingInvestment } from "~/features/onboarding/types/onboarding";

/**
 * Render a list item representing an investment account, including a masked account number, broker and currency info, and optional edit/remove actions.
 *
 * @param account - The investment account to display (includes name, number, currency, and brokerId).
 * @param onRemove - Optional callback invoked when the remove/delete button is clicked.
 * @param onEdit - Optional callback invoked when the edit button is clicked.
 * @param readOnly - When `true`, hides the edit and remove action buttons.
 * @returns The JSX element for the investment account list item.
 */
export function InvestmentAccountItem({
  account,
  onRemove,
  onEdit,
  readOnly = false
}: {
  account: OnboardingInvestment;
  onRemove?: () => void;
  onEdit?: () => void;
  readOnly?: boolean;
}) {
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
      {!readOnly ? (
        <ItemActions>
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <Edit2Icon className="size-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onRemove}>
            <Trash2Icon className="size-4" />
          </Button>
        </ItemActions>
      ) : null}
    </Item>
  );
}