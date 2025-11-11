"use server";

import { type ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";
import { TOAST_COOKIE_MAX_AGE, TOAST_COOKIE_NAME } from "~/lib/toast/constants";
import { type ToastMessage, type ToastType } from "~/lib/toast/types";

const cookieConfig: Partial<ResponseCookie> = {
  maxAge: TOAST_COOKIE_MAX_AGE,
  path: "/",
  httpOnly: false,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production"
};

export async function setToastCookie(message: string, type: ToastType = "success", duration?: number) {
  const cookieStore = await cookies();

  const toastData: ToastMessage = {
    type,
    message,
    duration
  };

  cookieStore.set(TOAST_COOKIE_NAME, JSON.stringify(toastData), cookieConfig);
}
