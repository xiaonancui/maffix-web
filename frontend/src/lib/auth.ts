import GoogleProvider from "next-auth/providers/google";

// Custom TikTok OAuth Provider
const TikTokProvider = {
  id: "tiktok",
  name: "TikTok",
  type: "oauth" as const,
  authorization: {
    url: "https://www.tiktok.com/auth/authorize/",
    params: {
      client_key: process.env.TIKTOK_CLIENT_KEY,
      response_type: "code",
      scope: "user.info.basic",
      redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/tiktok`,
    },
  },
  token: {
    url: "https://open-api.tiktok.com/oauth/access_token/",
    async request(context: any) {
      const { params } = context;
      const response = await fetch(
        "https://open-api.tiktok.com/oauth/access_token/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            client_key: process.env.TIKTOK_CLIENT_KEY!,
            client_secret: process.env.TIKTOK_CLIENT_SECRET!,
            code: params.code,
            grant_type: "authorization_code",
            redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/tiktok`,
          }),
        },
      );

      const tokens = await response.json();
      return { tokens };
    },
  },
  userinfo: {
    url: "https://open-api.tiktok.com/user/info/",
    async request(context: any) {
      const { tokens } = context;
      const response = await fetch("https://open-api.tiktok.com/user/info/", {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      });

      const user = await response.json();
      return user;
    },
  },
  profile(profile: any) {
    return {
      id: profile.data.user.open_id,
      name: profile.data.user.display_name,
      email: null, // TikTok doesn't provide email
      image: profile.data.user.avatar_url,
    };
  },
};

export const authOptions: any = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    TikTokProvider as any,
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user, account }: any) {
      if (account && user) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session, token }: any) {
      session.accessToken = token.accessToken as string;
      session.provider = token.provider as string;
      return session;
    },
    async signIn({ user, account }: any) {
      // Handle OAuth sign in
      if (account?.provider === "google" || account?.provider === "tiktok") {
        try {
          // Send user data to backend API
          const response = await fetch(
            `${process.env.NEXTAUTH_URL}/api/auth/oauth`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                provider: account.provider,
                providerId: user.id,
                email: user.email,
                name: user.name,
                image: user.image,
              }),
            },
          );

          if (response.ok) {
            return true;
          } else {
            console.error("Failed to create user in backend");
            return false;
          }
        } catch (error) {
          console.error("Error during OAuth sign in:", error);
          return false;
        }
      }
      return true;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development",
};
