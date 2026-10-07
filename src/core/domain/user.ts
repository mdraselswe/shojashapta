export type UserRole = "user" | "moderator" | "admin";

/** The signed-in person as the app sees them (profile row, not the auth vendor's user). */
export type AppUser = {
  id: string;
  displayName: string;
  avatarUrl: string | null;
  role: UserRole;
  homeDistrictId: number | null;
  isBanned: boolean;
  pointsTotal: number;
};

export type Session = { user: AppUser; expiresAt: Date };
