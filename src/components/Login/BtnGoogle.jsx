import { useEffect } from 'react';
import { signIn, useSession } from "next-auth/react";
import useUser from '../../Hooks/useUser';
import { useRouter } from 'next/router';
import api from "../../Services/apiServices";

export default function BtnGoogle() {
    const { login, hasLoginError, hasNotLogin, isLoginLoading, isLogged, blockUser } = useUser();
    const { data: session, status } = useSession();
    const navigate = useRouter();

    useEffect(() => {
        if (isLogged) navigate.push('/home');
    }, [isLogged, navigate]);

    useEffect(() => {
        if (session) {
            // Aquí puedes manejar la lógica adicional después de que el usuario inicie sesión con Google
            handleGoogleLogin(session);
        }
    }, [session]);


    async function iniciarGoogle() {
        signIn("google");
    }
    function obtenerParteAntesDelArroba(email) {
        const partes = email.split('@');
        return partes[0];
    }
    async function handleGoogleLogin(session) {
        try {
            const { data: datosUser } = await api.post('user/takePassword', { email: email });
            const { email, name } = session.user;
            let nombreUsuario = obtenerParteAntesDelArroba(email)
            const { clave } = datosUser.data[0]
            //console.log('Datos del usuario:', session.user);
            login({ username: nombreUsuario, password: clave }); // Ajusta esto según tu lógica de login
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>

            <button onClick={() => iniciarGoogle()} className="w-100 btn btn-lg btn-light mt-2" id='buttonGoogle'>
                LOGEARSE CON GOOGLE
            </button>
        </>
    );
}
