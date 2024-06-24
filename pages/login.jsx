import { useEffect, useState, useContext } from 'react'
import { useRouter } from 'next/router'
import useUser from '../src/Hooks/useUser'
import ModalResetContraseña from '../src/components/Login/ModalResetContraseña'
import ModalRegistrarse from '../src/components/Login/ModalRegistrarse'
import BtnGoogle from '../src/components/Login/BtnGoogle'
import FormLogin from '../src/components/Login/FormLogin'
import Image from 'next/image'

export default function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [datosIngresados, setDatosIngresados] = useState(false)
  const [show, setShow] = useState(false)
  const [showRegistr, setShowRegistr] = useState(false)
  const navigate = useRouter()
  const { login, hasLoginError, hasNotLogin, isLoginLoading, isLogged, blockUser } = useUser()

  useEffect(() => {
    if (isLogged) navigate.push('/home')
    takeUrl()
  }, [isLogged, navigate])

  function takeUrl() {
    const URLactual = window.location;
    /*if (URLactual.href !== 'https://buen.sabor.com/login') {
      navigate.push('https://buen.sabor.com/login')
    }*/
  }

  function handleSubmit(e) {
    e.preventDefault()
    setDatosIngresados(false)
    if ([username, password].includes('')) {
      setDatosIngresados(true)
      return
    }
    try {
      login({ username, password })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <div className='form-signin'>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <section className="feco">
            <Image width={110} height={110} src='/buensabor.png' alt="BS-img" />
          </section>
        </div>
        {!isLoginLoading &&
          <>

            <FormLogin
              password={password}
              setPassword={setPassword}
              username={username}
              setUsername={setUsername}
              handleSubmit={handleSubmit}
              isLoginLoading={isLoginLoading}
              setShow={setShow}
              setShowRegistr={setShowRegistr}
            />
            {/*<BtnGoogle />*/}
          </>
        }
      </div>
      <ModalResetContraseña show={show} setShow={setShow} />
      <ModalRegistrarse show={showRegistr} setShowRegistr={setShowRegistr} />
      {isLoginLoading && <p className='verificar'>Verificando datos ingresados</p>}
      <div className='Login'>
        {datosIngresados && <strong>Ingrese Usuario y Contraseña</strong>}
        {hasNotLogin && <strong>Datos invalidos</strong>}
        {hasLoginError && <strong>Error al iniciar sesión</strong>}
        {blockUser && <strong style={{ fontSize: '25px' }}>El usuario esta bloqueado</strong>}
      </div>
      <style>{`
          .form-signin {
              width: 100%;
              max-width: 330px;
              padding: 15px;
              margin: 0 auto;
              text-align: center;
              margin-top: 50px;
            }
            
            .form-signin .checkbox {
              font-weight: 400;
            }
            
            .form-signin .form-floating:focus-within {
              z-index: 2;
            }
            
            .form-signin {
              margin-bottom: -1px;
              border-bottom-right-radius: 0;
              border-bottom-left-radius: 0;
            }
            .Login{
              text-align: center;
              color: red;
              font-size: 18px;
            }
            
            .form-signin {
              margin-bottom: 10px;
              border-top-left-radius: 0;
              border-top-right-radius: 0;
            }

            .formulario{
              text-align: center;
            }
            
            .form-control {
              text-align: center;
            }
            
            .feco {
              display: flex;
              align-items:center;
              justify-content:center;
              background: none;
              width: 110px;
              margin-bottom: 1px;
            }
            
            .feco {
              animation-name: rotation;
              animation-duration: 4s;
              animation-iteration-count: infinite;
              animation-timing-function: linear;
            }

            h6{
              margin-top: 20px;
              text-decoration: underline;
              color: red;
              cursor: pointer;
              font-size: 15px;
            }

            h6:hover{
              color: rgb(189, 15, 151);
            }
            
            @keyframes rotation {
              0% {
                transform: rotate(0deg);
              }
            
              100% {
                transform: rotate(360deg);
              }
            }
            
            .BUENSABOR {
              margin-top: 30px;
              margin-bottom: 5PX;
              font-size: 45px;
            }
            
            #buttonLogin {
              background-color: #E11919;
              color: white;
            }

            #buttonLogin:hover{
              color: black;
            }

            #buttonGoogle {
              background-color: #E11919;
              color: white;
            }

            #buttonGoogle:hover{
              color: black;
            }
            
            .text-center {
              margin-top: 100px;
              background-color: white;
            }
            .verificar{
              color: black;
              text-align:center;
              font-weight: bold;
            }
        `}
      </style>
    </>
  )
}
