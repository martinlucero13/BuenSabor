import { useEffect, useContext } from 'react'
import useUser from '../src/Hooks/useUser'
import TablaPedidosCajero from '../src/components/PedidosCocina/PedidosCocinaTable'
import UserContext from '../src/context/userContext'
import { useRouter } from 'next/router'

export default function PedidosCocina() {
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
            <TablaPedidosCajero />
        </>
    )
}
