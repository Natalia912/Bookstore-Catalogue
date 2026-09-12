import { useTranslations } from 'next-intl';
import enMessages from './messages/en.json';

function getNestedValue(obj: Record<string, unknown>, path: string): string | undefined {
  const parts = path.split('.');
  let current: unknown = obj;
  for (const part of parts) {
    if (current && typeof current === 'object' && current !== null && part in current) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }
  return typeof current === 'string' ? current : undefined;
}

export function getFallbackTranslation(
  namespace: string,
  key: string,
  values?: Record<string, string | number>
): string {
  const fullPath = namespace ? `${namespace}.${key}` : key;
  const template = getNestedValue(enMessages as Record<string, unknown>, fullPath);

  if (!template) {
    return key;
  }

  if (!values) {
    return template;
  }

  return template.replace(/\{(\w+)\}/g, (_, varName) => {
    return values[varName] !== undefined ? String(values[varName]) : `{${varName}}`;
  });
}

export function useSafeTranslations(namespace: string) {
  try {
    const t = useTranslations(namespace);
    return t;
  } catch {
    return (key: string, values?: Record<string, string | number>) =>
      getFallbackTranslation(namespace, key, values);
  }
}
