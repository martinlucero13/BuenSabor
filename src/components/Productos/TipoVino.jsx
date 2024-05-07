import { useContext, useEffect, useMemo, useState } from "react"
import Image from "next/image"
import CompraContext from "../../Context/pedidoContext"
import Alert from "./Alert"
import UtilityContext from "../../Context/utilityContext"

export default function TipoVino({ vino, filter, precioOrden, setOpen }) {
    const { articulos, setArticulos } = useContext(CompraContext)
    const { retiro } = useContext(UtilityContext)
    const [cantidad, setCantidad] = useState(1)
    const [show, setShow] = useState(false)
    const [disabledAdd, setDisabledAdd] = useState(false)
    const [url, setUrl] = useState(`/${vino.imagen}.jpg`)

    useEffect(() => {
        if (cantidad < 1) {
            setCantidad(1)
        }
        else {
            if (cantidad > vino.EXISTENCIAFISICA) {
                setDisabledAdd(true)
            } else {
                setDisabledAdd(false)
            }
        }
        setUrl(`/${vino.imagen}.jpg`)
    }, [cantidad, filter, precioOrden])

    function handleVerifiy(e) {
        e.preventDefault()
        if (articulos.length === 0) {
            handleAdd()
            return
        } else {
            handleAdd()
        }
    }

    function handleAdd() {
        let verificarDuplicidad = 0
        const articulosCantidad = articulos.map(articulo => {
            let cantidadMaxima = 0
            if (articulo.id === vino.idArticuloManufacturado) {
                verificarDuplicidad++
                const cantidadVerificar = articulo.cantidad + cantidad
                if (cantidadVerificar > vino.EXISTENCIAFISICA) {
                    cantidadMaxima = vino.EXISTENCIAFISICA
                } else {
                    cantidadMaxima = cantidadVerificar
                }
                return {
                    ...articulo,
                    cantidad: cantidadMaxima
                }
            } else {
                return articulo
            }
        })
        if (verificarDuplicidad > 0) {
            setArticulos(articulosCantidad)
        } else {
            const articulo = {
                ...vino,
                precio: Number(vino.precioVenta.toFixed(2)),
                descripcion: vino.DESCRIPCION,
                cantidad,
                id: vino.idArticuloManufacturado,
                tiempoEstimadoCocina: vino.tiempoEstimadoCocina,
                denominacion: vino.denominacion,
                precioVenta: vino.precioVenta,
                imagen: vino.imagen,
                descripcion: vino.descripcion,
                idRubro: vino.idRubro,
                receta: vino.receta,
                nomrub: vino.nomrub,
                //tipPed: retiro.tipPed
            }
            /* console.log(articulo) */
            setArticulos([...articulos, articulo])
        }
        setShow(true)
        setCantidad(1)
    }

    return (
        <>
            <div>
                <form onSubmit={handleVerifiy}>
                    <div style={{ height: '230px', marginBottom: '5px', display: 'inline-block', position: 'relative' }}>
                        <Image
                            src={url}
                            alt=''
                            style={{ borderRadius: '20px', marginTop: '2px' }}
                            //onError={handleError}
                            width={220}
                            height={230}
                        />
                    </div>
                    <article>
                        <p>{vino.denominacion}</p>
                    </article>
                    <strong>{vino.precioVenta} ARS</strong>
                    <div>
                        <div onClick={() => setCantidad(cantidad - 1)}>-</div>
                        <p>{cantidad}</p>
                        <div onClick={() => setCantidad(cantidad + 1)}>+</div>
                    </div>
                    <button className={disabledAdd ? 'disabledButton' : 'buttonAdd'} disabled={disabledAdd}>Agregar</button>
                </form>
                <Alert
                    show={show}
                    setShow={setShow}
                />
            </div >
            <style jsx>{`
            div{
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                width: 250px;
                background-color:#cecaca;
                border-radius: 15px;
                margin: 20px;
                padding: 2px;
            }
            form{
                width: 98%;
                height: 98%;
                align-items: center;
                text-align: center;
                background-color: #fff;
                border-radius: 15px;
            }
            form img{
                width: 100%;
                height: 230px;
                /* transition: transform .4s;  */
            }
            /* form img:hover{
                transform: scale(1.1); 
            } */
            .buttonAdd{
                margin: 20px 0;
                padding: 5px;
                border-radius: 50px;
                width: 180px;
                color: #fff;
                background-color:rgb(138, 13, 111);
                border:none;
                transition: 0.3s;
            }
            .buttonAdd:hover{
                color: black;
                background-color: rgb(182, 27, 182);
            }
            .disabledButton{
                margin: 20px 0;
                padding: 5px;
                border-radius: 50px;
                width: 180px;
                color: #fff;
                background-color:grey;
                border:none;
                transition: 0.3s;
            }
            .disabledButton:hover{
                color: black;
            }
            form div{
                display: flex;
                flex-direction: row;
                justify-content: center;
                width: 100%;
                height: 20px;
                background-color: #fff;
                margin: 0;
            }
            form div div{
                margin: 5px;
                padding: 0;
                border-radius: 9999px;
                width: 30px;
                height:30px;
                background: none;
                color: #000;
                border:2px solid #000;
                font-weight: bold;
                cursor: pointer;
                transition: 0.3s;
            }
            form div div:hover{
                background-color: #e6e6e6;
            }
            div form div p{
                margin: 5px;
            }
            div form div span{
                position: absolute; 
                left: 10%;
                bottom: 10%;
                background: #cccccc;
                padding: 3px;
                text-transform: uppercase;
                font-weight: bold;
                color: #464646;
            }
            div form article p{
                margin: 5px;
                height: 45px;
            }
            `}</style>
        </>
    )
}

/* width * height */