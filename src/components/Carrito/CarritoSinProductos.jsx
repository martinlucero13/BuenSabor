import { CarritoSVG } from "./CarritoSVG";


export default function CarritoSinProductos() {


    return (
        <>
            <div>
                <section>
                    <CarritoSVG></CarritoSVG>
                </section>
                <h1>No hay productos en tu carrito.</h1>
            </div>
            <style jsx>{`
            div{
                display: flex;
                flex-direction:column;
                justify-content: center;
                align-items: center;
            }
            div section{
                width: 700px;
                height: 520px;
                margin: 0;
                padding: 0;
            }
            h1{
                color: rgb(138, 13, 111);
                font-size: 60px;
            }
            @media and (max-width: 875px){
                div section{
                    width: 500px;
                    height: 400px;
                }
                h1{
                    font-size: 40px;
                }
            }
            @media and (max-width: 620px){
                div section{
                    max-width: 300px;
                    max-height: 240px;
                }
                h1{
                    font-size: 30px;
                }
            }
            @media and (max-width: 620px){
                h1{
                    font-size: 30px;
                }
            }
            @media and (max-width: 620px){
                h1{
                    font-size: 25px;
                }
            }
        `}</style>
        </>
    )
}