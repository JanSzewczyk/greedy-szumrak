import { Button, Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@szum-tech/design-system";
import { TableIcon } from "@szum-tech/design-system/icons";
import Link from "next/link";

import { type Sheet } from "~/api";

type SheetCardProps = {
  sheet: Sheet;
};

export function SheetCard({ sheet }: SheetCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{sheet.name}</CardTitle>
        {sheet.description ? <CardDescription>{sheet.description}</CardDescription> : null}
      </CardHeader>
      <div className="flex-1" />
      <CardFooter>
        <Button fullWidth asChild variant="outlined" endIcon={<TableIcon />}>
          <Link href={`/sheets/${sheet.id}`}>Go to Sheet</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
