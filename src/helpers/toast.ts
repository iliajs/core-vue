import type { ToastConfig } from "@/types/toasts";
import { ToastType } from "@/types/toasts";
import type { ExtendedDocument } from "@/types/document";
import { lang } from "@/lang";

export const showToast = (toastConfig: ToastConfig): void => {
  const { type, text } = toastConfig;

  const config: any = {
    // TODO: Refactor `any` with PrimeVue type for toast config;
    severity: type,
    detail: text,
    life: 600,
  };

  if (type === ToastType.Error) {
    config.summary = lang.title.error;
  }

  (document as ExtendedDocument).$toast.add(config);
};

export const setGlobalToastObject = (toast: any): void => {
  (document as ExtendedDocument).$toast = toast;
};
