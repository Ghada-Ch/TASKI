import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await fetch(process.env.NEXT_PUBLIC_API_URL!, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              query: `
                mutation Login($email: String!, $password: String!) {
                  login(email: $email, password: $password) {
                    access_token
                    user {
                      id
                      email
                      name
                      role
                    }
                  }
                }
              `,
              variables: {
                email: credentials?.email,
                password: credentials?.password,
              },
            }),
          });

          const { data, errors } = await res.json();
          if (errors) {
            console.error("GraphQL Errors:", errors);
            return null;
          }

          const { access_token, user } = data.login;

          return {
            ...user,
            accessToken: access_token,
          };
        } catch (err) {
          console.error("Login error:", err);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
  // ✅ must be literal type, not string
  session: { strategy: "jwt" as const },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
