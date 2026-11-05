import { useId, useState } from "react";
import type { FormEvent } from "react";
import { useI18n } from "../i18n";

type Control = HTMLInputElement | HTMLTextAreaElement;
function isControl(target: EventTarget | null): target is Control {
  return (target instanceof HTMLInputElement && target.type !== "file") || target instanceof HTMLTextAreaElement;
}

export function useFormValidation() {
  const { t, locale } = useI18n();
  const id = useId();
  const [errors, setErrors] = useState<Record<string, string>>( {});

  function check(control: Control): string {
    const value = control.type === "password" ? control.value : control.value.trim();
    if (control.required && !value) return t("Заполни это поле.");
    if (control instanceof HTMLInputElement && control.type === "email" && control.validity.typeMismatch) return t("Укажи корректный email, например traveler@example.com.");
    if (value && control.minLength > 0 && value.length < control.minLength) return locale === "ru"
      ? `Минимум ${control.minLength} символов. Сейчас: ${value.length}.`
      : `At least ${control.minLength} characters. Current: ${value.length}.`;
    if (control.maxLength > 0 && value.length > control.maxLength) return locale === "ru"
      ? `Максимум ${control.maxLength} символов.` : `Maximum ${control.maxLength} characters.`;
    return "";
  }

  function validate(form: HTMLFormElement): boolean {
    const next: Record<string, string> = {};
    let first: Control | undefined;
    for (const control of Array.from(form.elements)) {
      if (!isControl(control) || !control.name) continue;
      const error = check(control);
      if (error) { next[control.name] = error; first ??= control; }
    }
    setErrors(next);
    first?.focus();
    return !first;
  }

  function update(event: FormEvent<HTMLFormElement>, force: boolean) {
    const control = event.target;
    if (!isControl(control) || !control.name) return;
    if (force || errors[control.name]) {
      const error = check(control);
      setErrors(current => ({ ...current, [control.name]: error }));
    }
  }

  return {
    validate,
    reset: () => setErrors({}),
    formProps: { noValidate: true, onBlurCapture: (event: FormEvent<HTMLFormElement>) => update(event, true), onInputCapture: (event: FormEvent<HTMLFormElement>) => update(event, false) },
    fieldProps: (name: string) => ({ "aria-invalid": !!errors[name], "aria-describedby": errors[name] ? `${id}-${name}-error` : undefined }),
    message: (name: string) => errors[name] ? <span className="community-field-error" id={`${id}-${name}-error`}>{errors[name]}</span> : null,
  };
}
