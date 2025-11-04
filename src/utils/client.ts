export function isClient() {
  return typeof window !== "undefined";
}

export function back() {
  window.history.back();
}

export const setStorage = (
  key: string,
  value: string,
  type: "local" | "session" = "local",
  expireInMs?: number // optional expiration in ms
) => {
  if (isClient()) return;

  const storage = type === "local" ? localStorage : sessionStorage;

  // wrap value with optional expiration timestamp
  const payload = JSON.stringify({
    value,
    expireAt: expireInMs ? Date.now() + expireInMs : null,
  });

  storage.setItem(key, payload);
};

export const getStorage = (
  key: string,
  type: "local" | "session" = "local"
): string | null => {
  if (isClient()) return null;

  const storage = type === "local" ? localStorage : sessionStorage;
  const raw = storage.getItem(key);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);

    // if expired, remove and return null
    if (parsed.expireAt && Date.now() > parsed.expireAt) {
      storage.removeItem(key);
      return null;
    }

    return parsed.value;
  } catch {
    // fallback if old data not JSON formatted
    return raw;
  }
};

export const removeStorage = (
  key: string,
  type: "local" | "session" = "local"
) => {
  if (!isClient()) return;
  const storage = type === "local" ? localStorage : sessionStorage;
  storage.removeItem(key);
};

export function doCall(phoneNumber: string) {
  const sanitizedPhone = phoneNumber.trim().replace(/[^0-9+]/g, "");

  const testLink = document.createElement("a");
  testLink.href = `tel:${sanitizedPhone}`;

  if (testLink.protocol === "tel:") {
    window.location.href = testLink.href;
  } else {
    alert("This device does not support phone calls.");
  }
}
