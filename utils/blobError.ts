export async function getMessageFromBlobError(blob: Blob): Promise<string | null> {
  try {
    const text = await blob.text();
    const parsed = JSON.parse(text) as Record<string, unknown>;
    if (parsed.success === false && typeof parsed.message === "string") return parsed.message;
    if (typeof parsed.message === "string") return parsed.message;
    if (typeof parsed.error === "string") return parsed.error;
  } catch {
    /* not JSON */
  }
  return null;
}

export function filenameFromContentDisposition(
  header: string | undefined,
  fallback: string
): string {
  if (!header) return fallback;
  const utf8 = /filename\*=(?:UTF-8'')?([^;]+)/i.exec(header);
  if (utf8?.[1]) {
    try {
      return decodeURIComponent(utf8[1].trim().replace(/^["']|["']$/g, ""));
    } catch {
      return utf8[1].trim().replace(/^["']|["']$/g, "");
    }
  }
  const simple = /filename=["']?([^"';]+)/i.exec(header);
  if (simple?.[1]) return simple[1].trim();
  return fallback;
}
