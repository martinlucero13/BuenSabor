import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import DataTable from "react-data-table-component";
import { ExpandedComponent, paginationOptions, noData } from './columns'
import Loading from "../Loading/Loading";
import apiFeco from "../../Services/apiServices";
import UserContext from "../../context/userContext";
import Cookies from "js-cookie";
import { getDataFormat } from './Helpers'
import dayjs from "dayjs";
import { PrinterFill } from "react-bootstrap-icons";
import { PDFFactura } from '../Print/PDFFactura';

const INITIAL_STATE = {
    dateDesde: '',
    dateHasta: '',
}

export const TablaPedidosAdmin = ({ setPrint }) => {
    const { user } = useContext(UserContext)
    const [loading, setLoading] = useState(false)
    const [dataTable, setDataTable] = useState([])
    const [formData, setFormData] = useState(INITIAL_STATE)
    const [disabledSend, setDisabledSend] = useState(true)
    const navigate = useRouter()


    async function takeNROLEG() {
        const token = Cookies.get('tokenColaboradores')
        const { data } = await apiFeco.post('user', { token })
        return data.USNROLEG ? data.USNROLEG : null
    }

    async function handleLoad() {
        setLoading(true)
        try {
            const { data: pedidos } = await apiFeco.post('vinos/tomarPedidoAdmin', { dateDesde: formData.dateDesde, dateHasta: formData.dateHasta })
            const dataFormat = getDataFormat(pedidos.data)
            setDataTable(dataFormat)
            setLoading(false)
        } catch (error) {
            console.error(error)
            setLoading(false)
        }
    }

    async function handleCancel(row) {
        const idPedido = row.idPedido
        const NROLEG = await takeNROLEG()
        if (window.confirm('¿Desea cancelar el pedido?')) {
            const { data: cancelar } = await apiFeco.post('vinos/cancelarPedido', { NROLEG, idPedido })
            handleLoad()
        }
    }

    function handleChangeForm(event) {
        const { name, value } = event.target;
        let newFormData;
        newFormData = { ...formData, [name]: value };
        setFormData(newFormData);
    }
    useEffect(() => {
        handleCheck()
    }, [formData])
    function handleCheck() {

        if (formData.dateDesde === '' || formData.dateHasta === '') {
            setDisabledSend(true)
            return
        }
        setDisabledSend(false)
    }

    async function Imprimir(row) {
        setPrint(true)
        const doc = PDFFactura(row)
        doc.save(`Factura-N°${row.nrofac}.pdf`)
        setPrint(false)
    }

    const columnsTable = [
        {
            name: 'N° Pedido',
            selector: row => row.idPedido,
            center: true,
            grow: 0.5,
            sortable: true
        },
        {
            name: 'N° Factura',
            selector: row => row.nrofac,
            center: true,
            grow: 0.5,
            sortable: true
        },
        {
            name: 'Fecha Pedido ',
            selector: row => row.FECHA,
            center: true,
            grow: 0.5,
            sortable: true,
            format: (row) => {
                const fecha = dayjs(row.FECHA).format('DD/MM/YYYY')
                return fecha
            }
        },
        {
            name: 'Hora Fin',
            selector: row => row.HORAFIN,
            center: true,
            grow: 0.5,
            sortable: true
        },
        {
            name: 'Lugar Retiro',
            selector: row => row.RETIRO,
            center: true,
            format: (row) => {
                if (row.RETIRO === 1) {
                    return 'Retiro Por Sucursal'
                }
                if (row.RETIRO === 2) {
                    return 'Llevar a Domicilio'
                }
            }
        },
        {
            name: 'Forma de Pago',
            selector: row => row.FORMAPAGO,
            center: true,
            grow: 0.6,
            format: (row) => {
                if (row.FORMAPAGO === '1') {
                    return 'Efectivo'
                }
                if (row.FORMAPAGO === '2') {
                    return 'Mercado Pago'
                }
            }
        },
        {
            name: 'Importe Facturado',
            selector: row => row.TOTALPEDIDO,
            right: true,
            format: (row) => {
                const TOTALPEDIDO = (row.TOTALPEDIDO)
                return '$' + TOTALPEDIDO.toFixed(2)
            }
        },
        {
            name: 'Estado',
            selector: row => row.ESTADO,
            center: true,
            grow: 0.6,
            format: (row) => {
                if (row.ESTADO === 0) {
                    return 'Pendiente'
                }
                if (row.ESTADO === 1) {
                    return 'Confirmado/En Preparacion'
                }
                if (row.ESTADO === 2) {
                    return 'Finalizado'
                }
                if (row.ESTADO === 3) {
                    return 'Cancelado'
                }
                if (row.ESTADO === 4) {
                    return 'Entregado'
                }
            }
        },
        {
            name: 'Factura',
            selector: row => row,
            grow: 0.3,
            center: true,
            format: (row) => {
                return <div onClick={() => Imprimir(row)}>
                    <PrinterFill style={{ color: 'grey', width: '25px', height: '25px', cursor: 'pointer' }} />
                </div>
            }
        }
    ]

    return (
        <>
            <div className="barraNav">
                <header>
                    <h1>Pedidos Administrador</h1>
                    <label>Desde</label>
                    <input onChange={handleChangeForm} value={formData.dateDesde} type="date" name="dateDesde" />

                    <label>Hasta</label>
                    <input onChange={handleChangeForm} value={formData.dateHasta} type="date" name="dateHasta" />

                    <button onClick={handleLoad} disabled={disabledSend} className={disabledSend || loading ? 'button_disabled' : 'button'}>Buscar</button>
                </header>
            </div>
            <div>
                <DataTable
                    data={dataTable}
                    columns={columnsTable}
                    noDataComponent={noData}
                    expandableRows
                    expandableRowsComponent={ExpandedComponent}
                    pagination
                    paginationComponentOptions={paginationOptions}
                    defaultSortFieldId={3}
                    defaultSortAsc={false}
                    progressPending={loading}
                    progressComponent={<Loading message='Cargando pedidos...' fontSize='20' />}
                />
            </div>
            <style jsx>{`
                div{
                    margin: 40px 15px 5px 15px;
                    box-shadow: 1px 1px 4px black;
                    border-top-left-radius: 15px;
                    border-top-right-radius: 15px;
                }
                header {
                    display:flex;
                    justify-content: space-between;
                }
                .barraNav {
                    border: 2px solid #cecaca;
                    border-radius: 10px;
                    background-color: #fff;
                    margin: 50px 10px 0 10px;
                    box-shadow: 1px 2px 1px grey;
                }
                h1 {
                    margin:15px;
                }
                button {
                    margin: 15px;
                    background-color: rgb(138, 13, 111);
                    color: white;
                    border-radius: 20px;
                    font-size: 17px;
                    transition: 0.5s;
                    padding: 5px;
                    border: none;
                    width: 150px;
                    text-transform:uppercase;
                }
                button:hover {
                    color: black;
                    background-color: rgb(182, 27, 182);
                }
                .button_disabled{
                    margin: 15px;
                    transition: 0.5s;
                    background-color:grey;
                    color: white;
                    border-radius: 20px;
                    font-size: 17px;
                    transition: 0.5s;
                    padding: 5px;
                    border: none;
                    width: auto;
                    min-width: 120px;
                    text-transform:uppercase;
                }
                .button_disabled:hover{
                    color: black;
                }
                input, select{
                    margin: 15px;
                    width: auto; /* Cambiado de un ancho fijo a auto para adaptarse a diferentes tamaños de pantalla */
                    border-radius: 10px;
                    border: 2px solid #cecaca;
                    padding: 3px;
                }
                label{
                    margin: 25px;
                    font-size: 15px;
                    font-weight: bold;
                    text-transform:uppercase;
                }
                @media (max-width: 700px) {
                    header {
                        flex-direction: column;
                        align-items: center;
                    }
                    .divBtn{
                        flex-direction: column;
                        align-items: center;
                    }
                    input, select{
                     margin: 5px;
                     }
                    label{
                     margin: 0px;
                     font-size: 15px;
                     }
                    button {
                      margin-top:12px; /* Añadido margen superior para evitar que los elementos estén demasiado juntos en pantallas pequeñas */
                      margin-bottom:12px; /* Añadido margen inferior para evitar que los elementos estén demasiado juntos en pantallas pequeñas */
                      background-color: rgb(138, 13, 111);
                      color: white;
                      border-radius:20px; 
                      font-size:17px; 
                      transition:.5s; 
                      padding :5px; 
                      border:none; 
                      /* Cambiado de un ancho fijo a auto para adaptarse a diferentes tamaños de pantalla */
                      text-transform :uppercase; 
                    }
                 }
            `}</style>
        </>
    )
}
