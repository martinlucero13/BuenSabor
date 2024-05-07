import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

const PedidoContext = React.createContext({})

export function PedidoContextPorvider({ children }) {
    const [total, setTotal] = useState('')
    const [articulos, setArticulos] = useState([])
    const navigate = useRouter()

    useEffect(() => {
        const articulos = Cookies.get('articulos')
        if (articulos) {
            setArticulos(JSON.parse(articulos))
        }
        takeUrl()
    }, [])

    useEffect(() => {
        Cookies.set('articulos', JSON.stringify(articulos), { expires: 1 / 2 })
    }, [articulos])

    function takeUrl() {
        const URLactual = window.location;
        if (URLactual.href.includes(':4431') || URLactual.href.includes('?')) {
            navigate.push('https://buen.sabor.com/login')
        }
    }

    return <PedidoContext.Provider value={{ total, setTotal, articulos, setArticulos }}>
        {children}
    </PedidoContext.Provider>
}

export default PedidoContext;