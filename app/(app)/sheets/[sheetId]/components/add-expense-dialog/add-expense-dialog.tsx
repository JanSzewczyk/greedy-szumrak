"use client";

import * as React from "react";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@szum-tech/design-system";

import { type Sheet, type SheetColumn } from "~/api";

import { AddExpenseForm } from "./add-expense-form";

type AddExpenseDialogProps = {
  columns: Array<SheetColumn>;
  sheet: Sheet;
};

export function AddExpenseDialog({ columns, sheet }: AddExpenseDialogProps) {
  const [show, setShow] = React.useState<boolean>(false);
  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogTrigger asChild>
        <Button variant="contained">Add expense</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Expense</DialogTitle>
          <DialogDescription>Fill form to create new expense</DialogDescription>
        </DialogHeader>

        <AddExpenseForm onClose={() => setShow(false)} columns={columns} sheet={sheet} />
      </DialogContent>
    </Dialog>
  );
}
