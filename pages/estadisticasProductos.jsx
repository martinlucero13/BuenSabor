import { useEffect, useContext, useState } from 'react'
import useUser from '../src/Hooks/useUser'
import UserContext from '../src/context/userContext'
import { useRouter } from 'next/router'
import EstadisticasProductosTable from '../src/components/EstadisticasProductos/EstadisticasProductosTable'

export default function EstadisticasProductos() {
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
            <EstadisticasProductosTable />
        </>
    )
}
