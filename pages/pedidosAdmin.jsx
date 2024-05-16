import { useEffect, useContext } from 'react'
import useUser from '../src/Hooks/useUser'
import TablaPedidosAdmin from '../src/components/PedidoAdmin/TablaPedidosAdmin'
import UserContext from '../src/context/userContext'
import { useRouter } from 'next/router'

export default function PedidosAdmin() {
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
            <TablaPedidosAdmin />
        </>
    )
}
