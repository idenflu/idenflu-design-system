import * as React from "react";

export function usePickerInputValidation(externalError?: string) {
  const [inputError, setInputError] = React.useState<string | null>(null);

  const clearInputError = React.useCallback(() => {
    setInputError(null);
  }, []);

  const failValidation = React.useCallback((message: string): false => {
    setInputError(message);
    return false;
  }, []);

  const shownError = externalError ?? inputError ?? undefined;

  return { shownError, clearInputError, failValidation };
}
