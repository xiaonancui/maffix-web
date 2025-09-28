declare module "next-auth" {
  interface Session {
    accessToken?: string;
    provider?: string;
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      diamondBalance?: number;
    };
  }
}
