import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function fallBack(textToConvert: string) {
  let fallBackName = textToConvert[0];
  for (let i = 0; i < textToConvert.length; i++) {
    if (textToConvert[i] === ' ') {
      fallBackName += textToConvert[i + 1];
    }
  }
  return fallBackName;
}
