import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
// Your own logic for dealing with plaintext password strings; be careful!
// import { saltAndHashPassword } from "@/utils/password"
import bcrypt from "bcryptjs";
import UserModel from "@/model/User";
import { connectToDb } from "@/lib/dbConnect";

// const saltAndHashPassword = (password: string) => bcrypt.hash(password, 8);

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            id: 'credentials',
            name: 'Credentials',
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },

            authorize: async (credentials: any): Promise<any> => {
                await connectToDb()

                try {
                    let user = null

                    // logic to salt and hash password
                    // const pwHash = await bcrypt.hashSync(credentials?.password, 8)

                    // logic to verify if user exists
                    // user = await getUserFromDb(credentials.email, pwHash)
                    user = await UserModel.findOne({
                        $or:
                            [
                                { email: credentials.identifier },
                                { username: credentials.identifier },
                            ],
                    })

                    if (!user) {
                        throw new Error('No user found with this email');
                    }
                    if (!user.isVerified) {
                        throw new Error('Please verify your account before logging in');
                    }

                    // return user object with the their profile data
                    const isComparePassword = await bcrypt.compare(credentials.password, user.password)

                    if (isComparePassword) return user
                    else throw new Error("Incorrect password")

                } catch (error: any) {
                    throw new Error(error)
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString(); // Convert ObjectId to string
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }
            return token
        },
        async session({ session, token }) {
            if (token) {
                session.user.user.id = token.id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.username = token.username;
            }
            return session
        },
    },

    pages: {
        signIn: "/sign-in",
    },
})