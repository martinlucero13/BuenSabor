import { useContext, useEffect, useState } from 'react'
import CarrouselTest from '../src/components/Home/CarrouselTest'
import Informativo from '../src/components/Home/Informativo'
import ModalCambioContraseña from '../src/components/Header/HeaderComponents/ModalCambioContraseña'
import UserContext from '../src/context/userContext'
import useUser from '../src/Hooks/useUser'


export default function Home() {
  const { user } = useContext(UserContext)
  const { checkSession } = useUser()
  const [show, setShow] = useState(false)
  const title = 'Por motivos de seguridad, se solicita acada usuario que cambie la constraseña actual.'

  useEffect(() => {
    checkSession()
  }, [user])

  useEffect(() => {
    if (user?.USMARCA1 === null) {
      setShow(true)
    }
  }, [user])

  return (
    <>
      <main>
        <CarrouselTest />
        <Informativo />
      </main>
      <ModalCambioContraseña
        show={show}
        setShow={setShow}
        title={title}
      />
      <style jsx>{`
            main{
              width: 100%;
              height: 100%;
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: space-around;
            }
            @media screen and (max-width: 1310px){
              main{
                display: flex;
                align-items: center;
                flex-direction: column;
                justify-content: center;
              }
            }
            `}</style>
    </>
  )
}
