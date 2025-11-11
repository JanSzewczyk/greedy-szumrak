"use client";

import * as React from "react";

import Cookies from "js-cookie";

import { toast } from "@szum-tech/design-system";
import { usePathname } from "next/navigation";
import logger from "~/lib/logger";
import { TOAST_COOKIE_NAME } from "~/lib/toast/constants";
import { type ToastMessage } from "~/lib/toast/types";

export function ToastHandler() {
  const pathname = usePathname();

  React.useEffect(() => {
    const toastCookie = Cookies.get(TOAST_COOKIE_NAME) ?? "";
    if (!toastCookie) {
      return;
    }

    try {
      const toastData = JSON.parse(toastCookie) as ToastMessage;

      // Wyświetl odpowiedni toast
      switch (toastData.type) {
        case "success":
          toast.success(toastData.message, {
            duration: toastData.duration
          });
          break;
        case "error":
          toast.error(toastData.message, {
            duration: toastData.duration
          });
          break;
        case "info":
          toast.info(toastData.message, {
            duration: toastData.duration
          });
          break;
        case "warning":
          toast.warning(toastData.message, {
            duration: toastData.duration
          });
          break;
        default:
          toast(toastData.message, {
            duration: toastData.duration
          });
      }

      Cookies.remove(TOAST_COOKIE_NAME, { path: "/" });
    } catch (error) {
      logger.error({ error }, "Failed to parse toast cookie");
    } finally {
      Cookies.remove(TOAST_COOKIE_NAME, { path: "/" });
    }
  }, [pathname]);

  return null;
}
