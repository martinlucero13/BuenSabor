import { useContext } from "react"
import UtilityContext from "../../Context/utilityContext"
import Image from "next/image"


export default function MarcaVino({ marca }) {
    const { setMarca, setRetiro, retiro } = useContext(UtilityContext)

    const url = `/${marca.imagen}.jpg`

    function handleSetMarca() {
        if (marca.id === 'promocion') {
            setRetiro({ ...retiro, tipPed: 'SB' })
            setMarca(marca.id)
        } else {
            setRetiro({ ...retiro, tipPed: 'SO' })
            setMarca(marca.id)
        }
    }
    return (
        <>
            <div>
                <article>
                    <section>
                        <Image
                            src={url}
                            alt=""
                            onClick={handleSetMarca}
                            /* onError={({ currentTarget }) => {
                                currentTarget.onerror = null;
                                currentTarget.src = "./error.jpg"
                            }} */
                            width={150}
                            height={150}
                            style={{ borderRadius: '15px' }}
                        />
                    </section>
                    {marca.nombre === 'todos' ? <p onClick={handleSetMarca}>Ver Todos</p> : ''}
                </article>
                <p onClick={handleSetMarca}>{marca.nombre}</p>
            </div>
            <style jsx>{`
            div{
                display: flex;
                flex-direction: column;
                align-items: center;
                height: 250px;
            }
            div p{
                font-size:15px;
                margin-top: 5px;
                text-transform: capitalize;
                max-width: 93%;
                text-align: center;
            }
            div p:hover{
                color: rgb(138, 13, 111);
                text-decoration: underline;
                cursor:pointer;
            }
            article{
                background-color: #cecaca;
                width: 150px;
                height: 150px;
                align-items: center;
                display: flex;
                justify-content:center;
                border-radius: 15px;
                cursor: pointer;
            }
            article p{
                position: absolute;
                font-size: 15px;
                color:#fff;
                text-decoration: underline;
            }
            article p:hover{
                color: rgb(138, 13, 111);
            }
            section{
                width: 97%;
                height: 97%;
                border-radius: 15px;
                transition: transform .4s;
            }
            section:hover{
                transform: scale(1.1);
            }
            img{
                width: 100%;
                height: 100%;
            }
        `}</style>
        </>
    )
}
