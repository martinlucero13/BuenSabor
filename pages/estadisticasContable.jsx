import { useEffect, useContext, useState } from 'react'
import useUser from '../src/Hooks/useUser'
import UserContext from '../src/context/userContext'
import { useRouter } from 'next/router'
import EstadisticasContableTable from '../src/components/EstadisticasContable/EstadisticasContableTable'

export default function EstadisticasContable() {
    const { checkSession } = useUser()
    const { user } = useContext(UserContext)
    const navigate = useRouter()

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
            <EstadisticasContableTable />
        </>
    )
}
