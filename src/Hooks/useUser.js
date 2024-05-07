import { useCallback, useContext, useState } from "react"
import UserContext from "../context/userContext"
import LoginService from "../Services/login/loginService"
import Cookies from 'js-cookie'
import api from "../Services/apiServices"
import Router from "next/router"

export default function useUser() {
    const { token, setToken, setUser, user } = useContext(UserContext)
    const { logIn } = LoginService()
    const [state, setState] = useState({ loading: false, error: false, fatalError: false, block: false })
    const Min = 1 / 2

    const login = useCallback(async ({ username, password }) => {
        setState({ loading: true, error: false, fatalError: false, block: false })
        try {
            const token = await logIn({ username, password })
            const { data: user } = await api.post('user', { token })
            /* console.log('token = ', token)
            console.log(user) */
            if (token) {
                if (user.USMARCA2 === 1) {
                    setState({ loading: false, error: false, fatalError: false, block: true })
                } else {
                    const userData = {
                        an8: user.USAN8,
                        username,
                        razonSocial: user.USNOMUSU,
                        tipo: 'Colaboradores'
                    }
                    //const { data: register } = await api.post('login/saveRegister', { userData })
                    Cookies.set('tokenColaboradores', token, { expires: Min })
                    Router.push('/home')
                    setUser(user)
                    setToken(token)
                }
            } else {
                setState({ loading: false, error: true, fatalError: false, block: false })
            }
        } catch (error) {
            console.log(error)
            setState({ loading: false, error: false, fatalError: true, block: false })
        }
    }, [user, logIn, token])

    function logout() {
        Router.push('/login')
        Cookies.remove('tokenColaboradores')
        setToken(null)
        setState({ loading: false, error: false, fatalError: false, block: false })
    }

    const checkSession = () => {
        const token = Cookies.get('tokenColaboradores')
        if (!token) logout()
    }

    return {
        isLogged: Boolean(token),
        login,
        logout,
        checkSession,
        isLoginLoading: state.loading,
        hasNotLogin: state.error,
        hasLoginError: state.fatalError,
        blockUser: state.block
    }
}
