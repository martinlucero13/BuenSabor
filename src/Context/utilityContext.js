import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const UtilityContext = React.createContext({})

export function UtilityContextPorvider({ children }) {
    const [marca, setMarca] = useState('')
    const [retiro, setRetiro] = useState({})

    useEffect(() => {
        const retiro = Cookies.get('retiro')
        if (retiro) {
            setRetiro(JSON.parse(retiro))
        }
    }, [])

    useEffect(() => {
        Cookies.set('retiro', JSON.stringify(retiro), { expires: 1 / 2 })
    }, [retiro])

    return <UtilityContext.Provider value={{ marca, setMarca, retiro, setRetiro }}>
        {children}
    </UtilityContext.Provider>
}

export default UtilityContext;