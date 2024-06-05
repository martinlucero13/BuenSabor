import { useEffect, useState } from 'react';
import { Modal } from "react-bootstrap";
import { signIn, useSession } from "next-auth/react";
import useUser from '../../Hooks/useUser';
import { useRouter } from 'next/router';
import api from "../../Services/apiServices";
import Loading from '../Loading/Loading';

export default function ModalRegistrarse({ show, setShowRegistr }) {
    const [datos, setDatos] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login, hasLoginError, hasNotLogin, isLoginLoading, isLogged, blockUser } = useUser();
    const { data: session, status } = useSession();
    const navigate = useRouter();

    useEffect(() => {
        if (isLogged) navigate.push('/home');
    }, [isLogged, navigate]);

    useEffect(() => {
        if (session) {
            // Aquí puedes manejar la lógica adicional después de que el usuario inicie sesión con Google
            handleGoogleLogin(session);
        }
    }, [session]);

    async function handleSubmit(e) {
        e.preventDefault();
        if (Object.keys(datos).length < 10) {
            setError('Los campos no pueden estar vacios');
            return;
        }
        setError('');
        setLoading(true);
        verificarDatos();
    }

    async function iniciarGoogle() {
        signIn("google");
    }
    function obtenerParteAntesDelArroba(email) {
        const partes = email.split('@');
        return partes[0];
    }
    async function handleGoogleLogin(session) {
        try {
            const { email, name } = session.user;
            let nombreUsuario = obtenerParteAntesDelArroba(email)
            const { data: datosUser } = await api.post('user/takePassword', { email: email });
            const { clave } = datosUser.data[0]
            //console.log('Datos del usuario:', session.user);
            //console.log(clave);
            login({ username: nombreUsuario, password: clave }); // Ajusta esto según tu lógica de login
        } catch (error) {
            console.log(error);
        }
    }

    async function verificarDatos() {
        const { data: datosUser } = await api.post('user/validaUsuario', { usuario: datos.usuario });

        if (datos.clave === datos.repclave) {
            if (datosUser.data[0].cantUsu == 0) {
                crearNuevoUsuario();
            } else {
                setError('Ese Usuario ya existe');
                setLoading(false);
            }
        } else {
            setError('Clave invalida');
            setLoading(false);
        }
    }

    async function crearNuevoUsuario() {
        try {
            const { data: clientes } = await api.post('user/createUsuario', { fromData: datos });
            if (clientes.statusCode === 200) {
                alert('Se creo el usuario correctamente, ya puede iniciar sesión');
            } else {
                alert('No se pudo crear el usuario, intente nuevamente mas tarde');
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
        setShowRegistr(false);
    }

    function cancel() {
        setShowRegistr(false);
        setError('');
    }

    function handleChange(e) {
        const { value, name } = e.target;
        setDatos({ ...datos, [name]: value });
    }

    return (
        <>
            <Modal
                show={show}
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Body>
                    <h1>Registrarse</h1>
                    <main className='formulario'>
                        <div className="form-floating">
                            <input
                                type="text"
                                className="form-control mb-1"
                                placeholder="Usuario"
                                name='usuario'
                                onChange={handleChange}
                            />
                            <label htmlFor="usu">Usuario</label>
                        </div>
                        <div className="form-floating">
                            <input
                                type="password"
                                className="form-control mb-1"
                                placeholder="Clave"
                                name='clave'
                                onChange={handleChange}
                            />
                            <label htmlFor="clav">Clave</label>
                        </div>
                        <div className="form-floating">
                            <input
                                type="password"
                                className="form-control mb-1"
                                placeholder="Repetir Clave"
                                name='repclave'
                                onChange={handleChange}
                            />
                            <label htmlFor="repclav">Repetir Clave</label>
                        </div>
                        <div className="form-floating">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Nombre"
                                name='nombre'
                                onChange={handleChange}
                            />
                            <label htmlFor="nom">Nombre</label>
                        </div>
                        <div className="form-floating">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Apellido"
                                name='apellido'
                                onChange={handleChange}
                            />
                            <label htmlFor="ape">Apellido</label>
                        </div>
                        <div className="form-floating">
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Telefono"
                                name='telefono'
                                onChange={handleChange}
                            />
                            <label htmlFor="tel">Telefono</label>
                        </div>
                        <div className="form-floating">
                            <input
                                type="text"
                                className="form-control mb-1"
                                placeholder="Mail"
                                name='mail'
                                onChange={handleChange}
                            />
                            <label htmlFor="mai">Mail</label>
                        </div>
                        <div className="form-floating">
                            <input
                                type="text"
                                className="form-control mb-1"
                                placeholder="Calle"
                                name='calle'
                                onChange={handleChange}
                            />
                            <label htmlFor="call">Calle</label>
                        </div>
                        <div className="form-floating">
                            <input
                                type="number"
                                className="form-control mb-1"
                                placeholder="Numero"
                                name='numero'
                                onChange={handleChange}
                            />
                            <label htmlFor="num">Numero</label>
                        </div>
                        <div className="form-floating">
                            <input
                                type="text"
                                className="form-control mb-1"
                                placeholder="Localidad"
                                name='localidad'
                                onChange={handleChange}
                            />
                            <label htmlFor="local">Localidad</label>
                        </div>
                        <button disabled={loading} onClick={handleSubmit} className="w-100 btn btn-lg btn-light mt-2" id='buttonLogin'>
                            REGISTRARSE
                        </button>
                        {/* Botón de registro con Google */}
                        <button onClick={() => iniciarGoogle()} className="w-100 btn btn-lg btn-light mt-2" id='buttonGoogle'>
                            REGISTRARSE CON GOOGLE
                        </button>
                        <button onClick={cancel} className="w-100 btn btn-lg btn-light mt-2" id='buttonLogin'>
                            CANCELAR
                        </button>
                        {error && <strong>{error}</strong>}
                    </main>
                    {
                        loading &&
                        <div>
                            <Loading message='Creando nuevo usuario...' />
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
          max-width: 200px;
          transition: 0.2s;
        }
        button:hover{
          background-color: rgb(189, 15, 151);
          color: #000;
          max-width: 210px;
          font-size: 19px;
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
          text-transform: uppercase;
        }
        div{
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 5px;
        }
        input{
          width: 200px;
          transition: 0.2s;
        }
      `}</style>
        </>
    );
}
