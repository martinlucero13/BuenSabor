import { useEffect, useContext } from 'react'
import useUser from '../src/Hooks/useUser'
import TablaPedidosDelivery from '../src/components/PedidosDelivery/TablaPedidosDelivery'
import UserContext from '../src/context/userContext'
import { useRouter } from 'next/router'

export default function PedidosDelivery() {
    const { checkSession } = useUser()
    const { user } = useContext(UserContext)
    const navigate = useRouter()

    useEffect(() => {
        if (user?.USMARCA1 === null) {
            navigate.push('/home')
        }
        if (user?.USROL != 3) {
            navigate.push("/home");
        }
    }, [user])

    useEffect(() => {
        checkSession()
    }, [user])

    return (
        <>
            <TablaPedidosDelivery />
        </>
    )
}
