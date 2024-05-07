import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import api from '../Services/apiServices';

const UserContext = React.createContext({})

export function UserContextProvider({ children }) {
    const [token, setToken] = useState(Cookies.get('tokenColaboradores') || '')
    const [user, setUser] = useState({})

    useEffect(() => {
        takeUser()
    }, [])

    async function takeUser() {
        const { data } = await api.post('user', { token })
        setUser(data)
    }

    return <UserContext.Provider value={{ token, setToken, user, setUser }}>
        {children}
    </UserContext.Provider>
}

export default UserContext;