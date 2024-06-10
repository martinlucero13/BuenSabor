import { useContext, useEffect, useState } from "react"
import PedidoContext from "../../Context/pedidoContext"
import UserContext from "../../context/userContext"
import apiFeco from "../../Services/apiServices"
import dayjs from 'dayjs'
import UtilityContext from "../../Context/utilityContext"
import { Modal } from "react-bootstrap"
import Loading from "../Loading/Loading"
import Cookies from "js-cookie";

export default function ResumenPedido() {
    const { user } = useContext(UserContext)
    const { articulos, setArticulos } = useContext(PedidoContext)
    const { retiro } = useContext(UtilityContext)
    const [totalIVA, setTotalIVA] = useState(0)
    const [totalNETO, setTotalNETO] = useState(0)
    const [finalizarPedido, setFinalizarPedido] = useState(true)
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    async function takeAN8() {
        const token = Cookies.get('tokenColaboradores')
        const { data } = await apiFeco.post('user', { token })
        return data.USAN8 ? data.USAN8 : null
    }

    function totales() {
        let totalesIVA = 0
        let totalesNETO = 0
        /*articulos.forEach(articulo => {
            totalesIVA += articulo.precioVenta * articulo.cantidad
        })*/
        articulos.forEach(articulo => {
            totalesNETO += articulo.precioVenta * articulo.cantidad
        })
        //setTotalIVA(totalesIVA.toFixed(2))
        setTotalNETO(totalesNETO.toFixed(2))
    }

    useEffect(() => {
        totales()
    }, [articulos])

    useEffect(() => {
        if (totalIVA > user.credito) {
            setFinalizarPedido(false)
        } else {
            setFinalizarPedido(true)
        }
    }, [totalIVA])

    async function handleSubmit(e) {
        e.preventDefault()
        setLoading(true)
        setOpen(true)
        const dataPedidoRegalo = [...articulos]
        const legajo = String(user.USNROLEG)
        //const CONDICIONPAGO = verCondicion(articulos[0])
        //const tipPed = articulos[0].tipPed
        //const impuesto = totalNETO * 0.21
        const hora = dayjs().format('HHmmss')
        const fecha = dayjs().format('DDMMYYYY')
        const origen = selectOrigin()
        const dataFiltroRegalo = dataPedidoRegalo.filter(data => data !== null)
        const dataPedido = dataFiltroRegalo.map(articulo => {
            const equivalencia = equivalencias(articulo)
            return {
                ...articulo,
                cantidad: articulo.cantidad,
                retiro: retiro.retiro,
                //tipPed,
                //origen,
                //totalIVA: Number(totalIVA),
                totalNETO: Number(totalNETO),
                legajo: legajo,
                //impuesto: Number(impuesto.toFixed(2)),
                fecha,
                hora,
                //CONDICIONPAGO,
                //EQUI_LIT: Math.round(equivalencia.EQUI_LIT),
                //EQUI_PESO: Math.round(equivalencia.EQUI_PESO),
                //EQUI_UN: Math.round(equivalencia.EQUI_UN),
            }
        })
        /* console.log(dataPedido) */
        try {
            const { data: pedido } = await apiFeco.post('vinos/guardarPedido', { dataPedido })
            if (pedido.data === 1) {
                alert('Su pedido fue realizado')
                setOpen(false)
                setArticulos([])
            } else {
                alert('Error al realizar su pedido, intente de nuevo por favor')
                setLoading(false)
                setOpen(false)
            }
            setLoading(false)
        } catch (error) {
            console.error(error)
            alert('Error al realizar su pedido, intente de nuevo en unos minutos')
            setOpen(false)
            setLoading(false)
        }
    }

    function verCondicion(articulo) {
        const date = dayjs().format('YYYY-MM-DD')
        if (articulo.tipPed === 'SB') {
            /* return '060' */
            return '065'
        } else if (date <= '2022-12-30' && date >= '2022-11-18') {
            return '007'
        } else {
            return '003'
        }
    }

    function equivalencias(articulo) {
        let EQUI_LIT = 0
        let EQUI_PESO = 0
        let EQUI_UN = 0
        if (articulo.OPE_LIT === 'MUL') {
            EQUI_LIT = (articulo.cantidad * articulo.EQUI_LIT) * 10000
        } else {
            EQUI_LIT = (articulo.cantidad / articulo.EQUI_LIT) * 10000
        }

        if (articulo.OPE_PESO === 'MUL') {
            EQUI_PESO = (articulo.cantidad * articulo.EQUI_PESO) * 10000
        } else {
            EQUI_PESO = (articulo.cantidad / articulo.EQUI_PESO) * 10000
        }

        if (articulo.OPE_UN === 'MUL') {
            EQUI_UN = (articulo.cantidad * articulo.EQUI_UN) * 10000
        } else {
            EQUI_UN = (articulo.cantidad / articulo.EQUI_UN) * 10000
        }

        return { EQUI_LIT, EQUI_PESO, EQUI_UN }
    }

    function selectOrigin() {
        if (retiro.retiro === '1') {
            return '1'
        }
        if (retiro.retiro === '2') {
            return '2'
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <h5>Resumen del pedido</h5>
                <p>TOTAL: <span>${totalNETO} ARS </span></p>
                {articulos[0].tipPed === 'SB' &&
                    <p style={{ fontSize: '12px' }}>(SE REALIZARA UNA NOTA DE CREDITO POR LOS DESCUENTOS)</p>
                }
                {(!finalizarPedido) ? (
                    <strong>Crédito insuficiente para realizar el pedido</strong>
                ) :
                    <button>Finalizar Pedido</button>
                }
            </form>
            <Modal
                show={open}
                centered
            >
                <Modal.Body>
                    <div>
                        {loading && <Loading message='Guardando pedido...' marginLeft={-10} />}
                    </div>
                </Modal.Body>
            </Modal>
            <style jsx>{`
                form{
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    background-color: #fff;
                    min-width: 250px;
                    width: 250px;
                    padding: 20px;
                    margin: 30px;
                    border: solid 2px #cecaca;
                    border-radius: 10px;
                }
                form p{
                    text-align: center;
                    margin-bottom: 30px;
                }
                form button{
                    margin-top:50px;
                    height: 35px;
                    width: 100%;
                    background-color: #E11919;
                    color: #fff;
                    border: none;
                    border-radius: 20px;
                    transition: 0.3s
                }
                form button:hover{
                    color: black;
                    background-color: #FF0000;
                }
                form span{
                    font-weight: bold;
                }
                form strong{
                    text-align: center;
                    margin-top: 65px;
                    color: red;
                }
                form h5{
                    border-bottom: 2px dotted black;
                    padding-bottom: 10px;
                    text-align: center;
                    margin-bottom: 10px;
                }
                div{
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                }
                div button{
                    margin-top: 20px;
                    height: 35px;
                    width: 50%;
                    background-color: rgb(138, 13, 111);
                    color: #fff;
                    border: none;
                    border-radius: 20px;
                    transition: 0.3s
                }
            `}</style>
        </>
    )
}
