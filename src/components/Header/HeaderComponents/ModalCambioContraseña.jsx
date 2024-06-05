import { useContext, useState } from "react"
import { Modal } from "react-bootstrap"
import UserContext from "../../../context/userContext"
import useUser from "../../../Hooks/useUser"
import apiFeco from "../../../Services/apiServices"
import Loading from '../../Loading/Loading'
import { useSession, signOut } from 'next-auth/react';


export default function UseModalCambioContraseña({ show, setShow, title, cambioContraseña, setCambioContraseña }) {
    const { logout } = useUser()
    const { user } = useContext(UserContext)
    const [contraseña, setContraseña] = useState('')
    const [contraseñaRep, setContraseñaRep] = useState('')
    const [loading, setLoading] = useState(false)
    const [disabled, setDisabled] = useState(false)
    const [error, setError] = useState('')
    const { data: session } = useSession();

    async function handleSubmit(e) {
        e.preventDefault()
        if ([contraseña, contraseñaRep].includes('')) {
            setError('Las contraseñas no deben estar vacias')
            return
        }
        if (contraseña !== contraseñaRep) {
            setError('Las contraseñas no coinciden')
            return
        }
        setError('')
        setLoading(true)
        changePassword()
    }

    async function changePassword() {
        setDisabled(true)
        const legajo = user.USNROLEG
        const { data: cambioContraseña } = await apiFeco.post('user/changePassword', { contraseña, legajo })
        if (cambioContraseña.statusCode === 200) {
            alert('Se cambio la contraseña, vuelva a iniciar sesión con la nueva contraseña')
        }
        setLoading(false)
        // Cierra la sesión local
        await signOut({ redirect: false, callbackUrl: '/' });

        // Si el usuario inició sesión con Google, cierra la sesión de Google también
        if (session?.provider === 'google') {
            const auth2 = window.gapi.auth2.getAuthInstance();
            if (auth2 != null) {
                auth2.signOut().then(auth2.disconnect);
            }
        }
        logout()
        setShow(false)
    }

    function cancel() {
        setCambioContraseña(false)
        setShow(false)
    }

    return (
        <>
            <Modal
                show={show}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Body>
                    <h1>Cambio de contraseña</h1>
                    <main className='formulario'>
                        {title && <p className="pro">{title}</p>}
                        <div className="form-floating">
                            <input
                                type="text"
                                className="form-control mb-1"
                                id="nuevapass"
                                placeholder="Contraseña"
                                value={contraseña}
                                onChange={(e) => setContraseña(e.target.value)}
                            />
                            <label htmlFor="nuevapass">Contraseña</label>
                        </div>
                        <div className="form-floating">
                            <input
                                type="text"
                                className="form-control"
                                id="repcontraseña"
                                placeholder="Repita la Contraseña"
                                value={contraseñaRep}
                                onChange={(e) => setContraseñaRep(e.target.value)}
                            />
                            <label htmlFor="repcontraseña">Repita la Contraseña</label>
                        </div>
                        <button disabled={disabled} onClick={handleSubmit} className="w-100 btn btn-lg btn-light mt-2" id='buttonLogin'>
                            CAMBIAR
                        </button>
                        {cambioContraseña &&
                            <button onClick={cancel} className="w-100 btn btn-lg btn-light mt-2" id='buttonLogin'>
                                CANCELAR
                            </button>}
                        {error && <strong>{error}</strong>}
                    </main>
                    {
                        loading &&
                        <div>
                            <Loading message='Cambiando Contraseña...' />
                        </div>
                    }
                </Modal.Body>
            </Modal>
            <style jsx>{`
                main{
                    display:flex;
                    flex-direction:column;
                    text-align: center;
                    align-items:center;
                }
                button{
                    background-color: rgb(189, 15, 151);
                    color: white;
                    max-width: 210px;
                }
                button:hover{
                    background-color: rgb(189, 15, 151);
                    color: #000;;
                    max-width: 210px;
                }
                h1{
                    align-items:center;
                    text-align: center;
                    margin-bottom: 30px;
                }
                strong{
                    color:red;
                    margin-top: 10px;
                    font-size: 17px;
                }
                div{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-top: 20px;
                }
            `}</style>
        </>
    )
}
