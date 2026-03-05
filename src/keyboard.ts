export function bindKeyboard() {
  const keys: Record<string, boolean> = {};
  window.addEventListener('blur', () => {
    Object.keys(keys).forEach((k) => delete keys[k]);
  });
  window.addEventListener('keydown', (event) => {
    keys[event.code] = true;
  });
  window.addEventListener('keyup', (event) => {
    keys[event.code] = false;
  });
  return keys;
}
