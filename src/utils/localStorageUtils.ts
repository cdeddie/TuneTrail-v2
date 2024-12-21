// Optional time to live parameter, when loading if the TTL has expired,
// it will simply return null
export const saveToLocalStorage = <T>(key: string, value: T, ttl?: number) => {
  const expiresAt = ttl ? Date.now() + ttl : Infinity;
  const data = { value, expiresAt };
  localStorage.setItem(key, JSON.stringify(data));
};

export const loadFromLocalStorage = <T>(key: string): T | null => {
  const rawData = localStorage.getItem(key);
  if (!rawData) return null;

  try {
    const { value, expiresAt } = JSON.parse(rawData);

    // Check expiration only if TTL was set (expiresAt !== Infinity)
    if (expiresAt !== Infinity && Date.now() > expiresAt) {
      localStorage.removeItem(key);
      return null;
    }

    return value;
  } catch (e) {
    console.error('Failed to parse localStorage data:', e);
    return null;
  }
};