import type { UseTranslationResponse } from 'react-i18next';
import { useTranslation as useTranslationOrig } from 'react-i18next';

export type UseAppTranslationResponse = UseTranslationResponse<'translation', undefined>;

export const useTranslation = (): UseAppTranslationResponse => {
  return useTranslationOrig();
};
