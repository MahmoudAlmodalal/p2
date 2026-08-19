import '@testing-library/jest-dom';

// Polyfill crypto.randomUUID if not present in jsdom
if (typeof crypto === 'undefined' || !crypto.randomUUID) {
  Object.defineProperty(globalThis, 'crypto', {
    value: {
      randomUUID: () => 'uuid-' + Math.random().toString(36).substring(2, 11),
    },
  });
}
