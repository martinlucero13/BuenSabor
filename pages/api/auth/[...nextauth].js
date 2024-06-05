// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import api from "../../../src/Services/apiServices"

export default NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account.provider === "google") {
                const { email, name, picture } = user;

                // Aquí puedes hacer una llamada a tu API para guardar el usuario en la base de datos
                await api.post('user/createUsuarioGoogle', {
                    email,
                    name,
                    picture,
                });
            }
            return user;
        },
        async session({ session, token, user }) {
            // Puedes agregar datos adicionales a la sesión si es necesario
            return session;
        },
    },
});
