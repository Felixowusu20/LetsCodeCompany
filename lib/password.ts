import { compare, hash } from "bcryptjs";

export async function hashPassword(plain: string) {
  return hash(plain, 12);
}

export async function verifyPassword(plain: string, passwordHash: string) {
  return compare(plain, passwordHash);
}
