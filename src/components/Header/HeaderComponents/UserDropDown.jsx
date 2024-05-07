import useUser from "../../../Hooks/useUser"
import { BoxArrowRight, LockFill, FileEarmarkPersonFill } from 'react-bootstrap-icons';
import Router from "next/router";

export default function UserDropDown({ setCambioContraseña }) {
    const { logout } = useUser()

    function logOut() {
        logout()
    }

    function irPerfil() {
        Router.push('/perfil')
    }

    return (
        <>
            <ul>
                <li onClick={() => irPerfil()}>
                    <div data-toggle="tooltip" data-placement="bottom" title="Cambio Contraseña">
                        <FileEarmarkPersonFill width="30" height="30" />
                        <p>Perfil</p>
                    </div>
                </li>
                <li onClick={() => setCambioContraseña(true)}>
                    <div data-toggle="tooltip" data-placement="bottom" title="Cambio Contraseña">
                        <LockFill width="30" height="30" />
                        <p>Cambio Contraseña</p>
                    </div>
                </li>
                <li onClick={logOut}>
                    <div data-toggle="tooltip" data-placement="bottom" title="Cerrar Sesión">
                        <BoxArrowRight width="30" height="30" />
                        <p>Cerrar Sesión</p>
                    </div>
                </li>
            </ul>
            <style jsx>{`
                ul{
                    list-style: none;
                    display: flex;
                    flex-direction: column;
                    margin: 0;
                    padding:0;
                }
                li{
                    margin: 2px;
                    padding: 7px;
                    border-radius: 10px;
                    transition: all .5s;
                }
                li div{
                    display:flex;
                    flex-direction: row;
                    align-items: center;
                }
                p{
                    margin:0 0 0 12px;
                    padding:0;
                }
                li:hover{
                    color:black;
                    background-color: rgb(182, 27, 182);
                    cursor:pointer;
                }
                `}</style>
        </>
    )
}
