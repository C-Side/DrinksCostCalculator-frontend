export function extractIdFromResourceUrl(resourceUrl: string): number {
  return Number(resourceUrl.match(/\/(\d+)$/))
}
