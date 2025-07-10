// lib/isAdminUser.ts

export function isAdmin(uid: string | null | undefined): boolean {
  const adminUid = process.env.NEXT_PUBLIC_ADMIN_UID;
  return !!uid && !!adminUid && uid === adminUid;
}