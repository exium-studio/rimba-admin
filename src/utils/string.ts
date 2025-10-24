import useLang from "@/context/useLang";

export function capitalize(string: string) {
  if (typeof string !== "string" || string.length === 0) return "";

  const firstChar = string.charAt(0);
  // Only capitalize if first char is not already uppercase
  return firstChar === firstChar.toUpperCase()
    ? string
    : firstChar.toUpperCase() + string.slice(1);
}

export const capitalizeWords = (str: string): string => {
  if (!str) return "";

  return str
    .split(" ")
    .map((word) => {
      if (!word) return word;

      const firstChar = word[0];
      // Only capitalize if first char is not uppercase
      return firstChar === firstChar.toUpperCase()
        ? word
        : firstChar.toUpperCase() + word.slice(1);
    })
    .join(" ");
};

export const interpolateString = (
  text: string,
  variables: Record<string, string | number>
) => {
  let result = text;

  Object.keys(variables).forEach((variable) => {
    const placeholder = `\${${variable}}`;
    result = result.replace(placeholder, variables[variable].toString());
  });

  return result;
};

export const pluckString = (obj: Record<string, any>, key: string): string => {
  return key.split(".").reduce<any>((acc, curr) => {
    if (acc && typeof acc === "object" && curr in acc) {
      return acc[curr];
    }
    return undefined;
  }, obj);
};

export const maskEmail = (email?: string) => {
  if (!email || typeof email !== "string" || !email.includes("@")) {
    return "";
  }

  const [local, domain] = email.split("@");
  if (local.length <= 3) {
    return `${local}@${domain}`;
  }
  const visible = local.slice(0, 3);
  const stars = "*".repeat(local.length - 3);

  return `${visible}${stars}@${domain}`;
};

export const getL = () => {
  return useLang.getState().l;
};

export type SlugifyOptions = {
  separator?: string;
  lowercase?: boolean;
  removeAccents?: boolean;
  strict?: boolean;
  maxLength?: number;
};

export function slugify(input: string, opts: SlugifyOptions = {}): string {
  const {
    separator = "-",
    lowercase = true,
    removeAccents = true,
    strict = true,
    maxLength,
  } = opts;

  if (!input) return "";

  let s = input.trim();

  if (removeAccents) {
    s = s.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
  }

  if (lowercase) s = s.toLowerCase();

  // replace any sequence of non-alphanumeric characters with separator
  s = s.replace(/[^a-z0-9]+/g, separator);

  if (strict) {
    const esc = escapeRegExp(separator);
    s = s.replace(new RegExp(`${esc}{2,}`, "g"), separator);
    s = s.replace(new RegExp(`^${esc}|${esc}$`, "g"), "");
  } else {
    // trim separator at ends even when not strict
    const esc = escapeRegExp(separator);
    s = s.replace(new RegExp(`^${esc}|${esc}$`, "g"), "");
  }

  if (maxLength && s.length > maxLength) {
    s = s
      .slice(0, maxLength)
      .replace(new RegExp(`${escapeRegExp(separator)}$`), "");
  }

  return s;
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
