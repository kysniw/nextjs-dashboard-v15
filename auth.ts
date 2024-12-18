import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { User } from "./app/lib/definitions";
import { sql } from "@vercel/postgres";
import bcrypt from "bcrypt";

const getUser = async (email: string): Promise<User | undefined> => {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE email = ${email}`;
    return user.rows[0];
  } catch (error) {
    console.log("Failed to fetch user: ", error);
    throw new Error("Failed to fetch user.");
  }
};

export const { signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parseCredentials = z
          .object({
            email: z.string().email(),
            password: z.string().min(6),
          })
          .safeParse(credentials);

        if (parseCredentials.success) {
          const { email, password } = parseCredentials.data;
          const user = await getUser(email);
          if (!user) return null;

          const matchPassword = await bcrypt.compare(password, user.password);
          if (matchPassword) return user;
        }

        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
});
