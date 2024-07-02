import { useEffect, useContext, useState } from 'react'
import useUser from '../src/Hooks/useUser'
import { TablaPedidosAdmin } from '../src/components/PedidoAdmin/TablaPedidosAdmin'
import UserContext from '../src/context/userContext'
import { useRouter } from 'next/router'
import Loading from "../src/components/Loading/Loading";

export default function PedidosAdmin() {
    const { checkSession } = useUser()
    const { user } = useContext(UserContext)
    const navigate = useRouter()
    const [print, setPrint] = useState(false)

    useEffect(() => {
        if (user?.USMARCA1 === null) {
            navigate.push('/home')
        }
        if (user?.USROL != 5) {
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
            <TablaPedidosAdmin setPrint={setPrint} />
        </>
    )
}
