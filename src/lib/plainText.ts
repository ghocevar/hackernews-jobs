const namedEntities: Record<string, string> = {
  amp: '&',
  apos: "'",
  gt: '>',
  lt: '<',
  nbsp: ' ',
  quot: '"',
};

function codePoint(entity: string): string | null {
  const hex = entity.startsWith('#x') || entity.startsWith('#X');
  if (!hex && !entity.startsWith('#')) {
    return null;
  }
  const raw = hex ? entity.slice(2) : entity.slice(1);
  if (raw.length === 0) {
    return null;
  }
  const code = Number.parseInt(raw, hex ? 16 : 10);
  if (!Number.isInteger(code) || code < 0 || code > 0x10ffff) {
    return null;
  }
  return String.fromCodePoint(code);
}

function decodeEntity(entity: string): string {
  if (entity.startsWith('#')) {
    return codePoint(entity) ?? `&${entity};`;
  }
  return namedEntities[entity] ?? `&${entity};`;
}

export function plainText(html: string): string {
  const decoded = html.replace(
    /&(#x[0-9a-fA-F]+|#\d+|[a-zA-Z]+);/g,
    (_, entity: string) => decodeEntity(entity)
  );
  const withoutTags = decoded.replace(/<[^>]*>/g, ' ');
  return withoutTags.replace(/\s+/g, ' ').trim();
}
