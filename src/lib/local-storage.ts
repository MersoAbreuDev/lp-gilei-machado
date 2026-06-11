const NICKNAME_KEY_PREFIX = "gm:salon-nickname:";

export function getSalonNickname(slug: string): string {
  try {
    return localStorage.getItem(`${NICKNAME_KEY_PREFIX}${slug}`)?.trim() ?? "";
  } catch {
    return "";
  }
}

export function setSalonNickname(slug: string, nickname: string): void {
  try {
    const value = nickname.trim();
    if (value) {
      localStorage.setItem(`${NICKNAME_KEY_PREFIX}${slug}`, value);
    } else {
      localStorage.removeItem(`${NICKNAME_KEY_PREFIX}${slug}`);
    }
  } catch {
    /* ignore */
  }
}
