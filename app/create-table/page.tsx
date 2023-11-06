import { TableIcon } from "@radix-ui/react-icons";
import { Button } from "@szum-tech/design-system";

import { createTableAction } from "~/app/create-table/actions";

export default function CreateTablePage() {
  return (
    <div>
      <h1>CreateTablePage</h1>

      <form action={createTableAction}>
        <Button type="submit" endIcon={<TableIcon />}>
          Create new table
        </Button>
      </form>
    </div>
  );
}
