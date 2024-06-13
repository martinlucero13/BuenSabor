import { useContext, useEffect } from 'react'
import ListadoPedidos from "../src/components/Carrito/ListadoPedidos";
import ResumenPedido from "../src/components/Carrito/ResumenPedido";
import PedidoContext from '../src/Context/pedidoContext';
import useUser from "../src/Hooks/useUser";
import UserContext from '../src/context/userContext'
import { useRouter } from 'next/router'
import CarritoSinProductos from '../src/components/Carrito/CarritoSinProductos';

export default function Carrito() {
    const { user } = useContext(UserContext)
    const { articulos } = useContext(PedidoContext)
    const { checkSession } = useUser()
    const navigate = useRouter()
    useEffect(() => {
        if (user?.USMARCA1 === null) {
            navigate.push('/home')
        }
    }, [user])

    useEffect(() => {
        checkSession()
    }, [user])

    return (
        <>
            {
                articulos.length
                    ? <main>
                        <div>
                            <ListadoPedidos />
                        </div>
                        <article>
                            <ResumenPedido />
                        </article>
                    </main>
                    : <main>
                        <CarritoSinProductos />
                    </main>
            }
            <style jsx>{`
                main{
                    display:flex;
                    flex-direction: row;
                    justify-content: space-evenly;
                    margin-top: 20px;
                    justify-content: center;
                }
                main div{
                    display:flex;
                    flex-direction: column;
                    margin: 10px;
                    margin-top: 20px;
                }

                @media screen (max-width: 1100px){
                    main{
                        flex-direction: column;
                        align-items: center;
                    }
                    main div{
                        justify-content: center;
                        display:flex;
                    }
                }
                @media screen (max-width: 800px){
                    main div{
                        justify-content: center;
                    }
                }
            `}</style>
        </>
    )
}
