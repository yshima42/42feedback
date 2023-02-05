import { NextApiHandler } from "next";
import NextAuth, {
  Account,
  DefaultSession,
  Profile,
  Session,
  User,
} from "next-auth";
import { AdapterUser } from "next-auth/adapters";
import { DefaultJWT, JWT } from "next-auth/jwt";
import FortyTwoProvider from "next-auth/providers/42-school";

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends Record<string, unknown>, DefaultJWT {
    accessToken: string;
  }
}

type JwtProps = {
  token: JWT;
  user?: User | AdapterUser;
  account?: Account | null;
  profile?: Profile;
  isNewUser?: boolean;
};

type SessionProps = {
  session: Session;
  token: JWT;
};

// eslint-disable-next-line @typescript-eslint/no-use-before-define
const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);
export default authHandler;

const options = {
  providers: [
    FortyTwoProvider({
      clientId: process.env.FORTY_TWO_CLIENT_ID as string,
      clientSecret: process.env.FORTY_TWO_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.SECRET,
  callbacks: {
    async jwt({ token, account }: JwtProps) {
      if (account?.access_token) {
        // eslint-disable-next-line no-param-reassign
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }: SessionProps) {
      // eslint-disable-next-line no-param-reassign
      session.accessToken = token.accessToken;
      return session;
    },
  },
};
