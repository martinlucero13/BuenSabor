import { useEffect, useContext, useState } from 'react'
import useUser from '../src/Hooks/useUser'
import UserContext from '../src/context/userContext'
import { useRouter } from 'next/router'
import RubrosProductosTable from '../src/components/RubrosProductos/RubrosProductosTable'

export default function RubrosProductos() {
    const { checkSession } = useUser()
    const { user } = useContext(UserContext)
    const navigate = useRouter()

    useEffect(() => {
        if (user?.USMARCA1 === null) {
            navigate.push('/home')
        }
        if (user?.USROL == 1 || user?.USROL == 2 || user?.USROL == 3) {
            navigate.push("/home");
        }
    }, [user])

    useEffect(() => {
        checkSession()
    }, [user])

    return (
        <>
            <RubrosProductosTable />
        </>
    )
}
