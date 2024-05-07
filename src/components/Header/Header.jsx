import { useState, useEffect } from "react"
import useUser from "../../Hooks/useUser"
import NavBarLoggout from './NavBarLoggout'
import ModalCambioContraseña from './HeaderComponents/ModalCambioContraseña'
import NewNavBar from "./NewNavBar"

export default function Header() {
    const { isLogged } = useUser()
    const [show, setShow] = useState(false)
    const [cambioContraseña, setCambioContraseña] = useState(false)

    useEffect(() => {
        setShow(true)
    }, [cambioContraseña])

    return (
        <>
            <header>
                {
                    isLogged
                        ? <NewNavBar setCambioContraseña={setCambioContraseña} />
                        : <NavBarLoggout />
                }
            </header>
            {
                cambioContraseña &&
                <ModalCambioContraseña
                    show={show}
                    setShow={setShow}
                    cambioContraseña={cambioContraseña}
                    setCambioContraseña={setCambioContraseña}
                />
            }
            <style jsx>{`
                header{
                    position: sticky;
                    top: 0;
                    z-index: 1055;
                }
            `}</style>
        </>
    )
}
