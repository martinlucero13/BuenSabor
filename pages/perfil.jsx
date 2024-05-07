import { useEffect, useContext } from 'react'
import useUser from '../src/Hooks/useUser'
import TablaPerfil from '../src/components/Perfil/TablaPerfil'
import UserContext from '../src/context/userContext'
import { useRouter } from 'next/router'

export default function Perfil() {
    const { checkSession } = useUser()
    const { user } = useContext(UserContext)
    const navigate = useRouter()

    useEffect(() => {
        if (user?.USMARCA1 === null) {
            navigate.push('/home')
        }
    }, [user])

    useEffect(() => {
        checkSession()
    }, [user])

    return (
        <>
            <TablaPerfil />
        </>
    )
}
