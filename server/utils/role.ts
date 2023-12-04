export const ROLE = {
  USER: "USER",
  ADMIN: "ADMIN",
} as const;
export type Role = keyof typeof ROLE;
export type RoleName = {
  name: Role;
};
export type Permission = "READ" | "CREATE" | "UPDATE" | "DELETE";
