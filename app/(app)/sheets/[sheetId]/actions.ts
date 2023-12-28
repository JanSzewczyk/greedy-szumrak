"use server";

import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";

import { createExpense } from "~/api";
import { getUserSession } from "~/lib/auth";
import { type ExpenseFormType } from "~/schemas/expense";

export async function createExpenseAction(sheetId: string, formData: ExpenseFormType) {
  const { user } = await getUserSession();
  const [error] = await createExpense({ userId: user?.id ?? "", sheetId, createExpense: formData });

  if (error) {
    return notFound();
  }

  revalidatePath("");
}
