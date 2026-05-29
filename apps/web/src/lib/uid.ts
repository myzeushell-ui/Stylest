// Генерация id на клиенте (локально-первый режим). crypto.randomUUID есть во
// всех современных браузерах; fallback на случай старых окружений.
export function uid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return 'id-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function now(): string {
  return new Date().toISOString();
}
