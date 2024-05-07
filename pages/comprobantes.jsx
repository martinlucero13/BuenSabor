import { useContext, useEffect } from 'react'
import useUser from "../src/Hooks/useUser";
import UserContext from '../src/context/userContext'
import { useRouter } from 'next/router'
import ComprobantesTable from '../src/components/Comprobantes/ComprobantesTable';

export default function Comprobantes() {
    const { user } = useContext(UserContext)
    const { checkSession } = useUser()
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
            <ComprobantesTable />
        </>
    )
}
/* enviar mail sobre la liberacion de pedidos 09/06 */