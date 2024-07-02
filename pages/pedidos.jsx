import { useEffect, useContext, useState } from 'react'
import useUser from '../src/Hooks/useUser'
import { TablaPedidos } from '../src/components/Pedido/TablaPedidos'
import UserContext from '../src/context/userContext'
import { useRouter } from 'next/router'

export default function Pedidos() {
    const { checkSession } = useUser()
    const { user } = useContext(UserContext)
    const navigate = useRouter()
    const [print, setPrint] = useState(false)

    useEffect(() => {
        if (user?.USMARCA1 === null) {
            navigate.push('/home')
        }
        if (user?.USROL != 1) {
            navigate.push("/home");
        }
    }, [user])

    useEffect(() => {
        checkSession()
    }, [user])


    return (
        <>
            {print &&
                <Loading message='Imprimiendo...' fontSize='20' />}
            <TablaPedidos setPrint={setPrint} />
        </>
    )
}
