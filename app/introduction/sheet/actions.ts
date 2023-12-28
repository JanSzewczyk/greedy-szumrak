"use server";

import { notFound, redirect } from "next/navigation";

import { createSheet } from "~/api";
import { ROUTES } from "~/constants/routes";
import { getUserSession } from "~/lib/auth";
import { type CreateSheetFormType } from "~/schemas/sheet";

export async function createSheetAction(data: CreateSheetFormType) {
  const { user } = await getUserSession();

  const [error, sheetId] = await createSheet({ userId: user?.id ?? "", createSheet: data });

  if (error) {
    return notFound();
  }

  redirect(ROUTES.INTRODUCTION.COLUMNS(sheetId));
}
