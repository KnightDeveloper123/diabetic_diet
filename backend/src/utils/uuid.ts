import { v4 as uuidv4 } from "uuid";

// Regex for UUID v4 validation
export const uuidV4Pattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function generateUUID(): string {
  return uuidv4();
}

export function isValidUUID(id: string): boolean {
  return uuidV4Pattern.test(id);
}