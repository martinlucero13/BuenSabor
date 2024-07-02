import { useEffect, useContext } from 'react'
import useUser from '../src/Hooks/useUser'
import TablaPedidosCajero from '../src/components/PedidosCajero/TablaPedidosCajero'
import UserContext from '../src/context/userContext'
import { useRouter } from 'next/router'

export default function PedidosCajero() {
    const { checkSession } = useUser()
    const { user } = useContext(UserContext)
    const navigate = useRouter()

    useEffect(() => {
        if (user?.USMARCA1 === null) {
            navigate.push('/home')
        }
        if (user?.USROL != 2) {
            navigate.push("/home");
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
