import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import api from "../Services/apiServices"

export default function useUserData() {
    const [userData, setUserData] = useState({})

    async function takeUser() {
        const token = Cookies.get('tokenColaboradores')
        const { data: user } = await api.post('user', { token })
        setUserData(user)
        return user
    }

    useEffect(() => {
        takeUser()
    }, [])

    return userData ?
        {
            legajo: userData.USNROLEG,
            credito: userData.credito,
            nombre: userData.USNOMUSU,
            rol: userData.USROL,
            an8: userData.USAN8,
            nacimiento: userData.fecnac,
            nrosuc: userData.nrosuc,
            usuario: userData.USUSUARIO,
            takeUser
        }
        : null
}