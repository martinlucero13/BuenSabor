import { useEffect, useContext, useState } from 'react'
import useUser from '../src/Hooks/useUser'
import UserContext from '../src/context/userContext'
import { useRouter } from 'next/router'
import EstadisticasClientesTable from '../src/components/EstadisticasClientes/EstadisticasClientesTable'

export default function EstadisticasClientes() {
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
            <EstadisticasClientesTable />
        </>
    )
}
