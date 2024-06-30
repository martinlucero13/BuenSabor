import { useContext, useEffect, useState } from "react"
import DataTable from "react-data-table-component"
import dayjs from "dayjs"
import { Trash3, PencilSquare, X, Check } from "react-bootstrap-icons"
import PedidosCocinaDetalleTable from "./PedidosCocinaDetalleTable"
import UserContext from "../../context/userContext"
import api from "../../Services/apiServices"
import Loading from "../Loading/Loading"
const Columns = (handleAgregar, handleCambiarEstado, handleDetalle) => (
    [
        {
            name: 'Pedido',
            selector: row => row.idPedido,
            wrap: true,
            sortable: true,
            center: true,
        },
        {
            name: 'Fecha Pedido',
            selector: row => row.fecha,
            center: true,
            sortable: true,
            format: (row) => {
                const fecha = dayjs(row.fecha).format('DD/MM/YYYY')
                return fecha
            }
        },
        {
            name: 'Hora Fin',
            selector: row => {
                const horaCompleta = row.horaEstimadaFin;
                const horaSinSegundos = horaCompleta.substring(0, 5); // Obtener los primeros 5 caracteres (HH:mm)
                return horaSinSegundos;
            },
            center: true,
            grow: 0.5,
            sortable: true
        },
        {
            name: 'Estado',
            selector: row => row.estado,
            center: true,
            grow: 0.6,
            format: (row) => {
                if (row.estado === 0) {
                    return 'Pendiente'
                }
                if (row.estado === 1) {
                    return 'Confirmado/En Preparacion'
                }
                if (row.estado === 2) {
                    return 'Finalizado'
                }
                if (row.estado === 3) {
                    return 'Cancelado'
                }
                if (row.estado === 4) {
                    return 'Entregado'
                }
            }
        },
        {
            name: 'Detalle Pedido',
            center: true,
            cell: (row) => {
                return (
                    <div onClick={() => handleDetalle(row)}>
                        <button>Detalle</button>
                        <style jsx>{`
                        button {
                        margin: 10px;
                        background-color: #E11919;
                        color: white;
                        border-radius: 20px;
                        font-size: 15px;
                        transition: 0.5s;
                        padding: 10px 1px 10px 1px;
                        border: none;
                        width: 100px;
                        text-transform:uppercase;
                        }
                        button:hover {
                            color: black;
                            background-color: #FF0000;
                        }
                    `}</style>
                    </div>
                );
            }
        },

        {
            name: 'Acciones',
            center: true,
            cell: (row) => {
                let btn = ''
                if (row.estado === 0) {
                    btn = 'Confirmar'
                } else if (row.estado === 1) {
                    btn = 'Terminar'
                }
                return (
                    <>
                        <div onClick={() => handleAgregar(row)}>
                            <button>+ 10 min</button>
                            <style jsx>{`
                                button {
                                margin: 10px;
                                background-color: #E11919;
                                color: white;
                                border-radius: 20px;
                                font-size: 15px;
                                transition: 0.5s;
                                padding: 10px 1px 10px 1px;
                                border: none;
                                width: 100px;
                                text-transform:uppercase;
                                }
                                button:hover {
                                    color: black;
                                    background-color: #FF0000;
                                }
                            `}</style>
                        </div>
                        <div onClick={() => handleCambiarEstado(row)}>
                            <button>{btn}</button>
                            <style jsx>{`
                                button {
                                margin: 10px;
                                background-color: #E11919;
                                color: white;
                                border-radius: 20px;
                                font-size: 15px;
                                transition: 0.5s;
                                padding: 10px 1px 10px 1px;
                                border: none;
                                width: 100px;
                                text-transform:uppercase;
                                }
                                button:hover {
                                    color: black;
                                    background-color: #FF0000;
                                }
                            `}</style>
                        </div>
                    </>
                );
            }
        },
    ]
)

export default function PedidosCocinaTable() {
    const { user } = useContext(UserContext)
    const [dataTable, setDataTable] = useState([])
    const [showDetalle, setDetalle] = useState(false)
    const [loading, setLoading] = useState(false)
    const [datoRow, setdatoRow] = useState()

    useEffect(async () => {
        handleLoad()
    }, [])

    async function handleLoad() {
        setLoading(true)
        try {
            const { data: tomarPedidoCocina } = await api.post('vinos/tomarPedidoCocina')
            setDataTable(tomarPedidoCocina.data)
        } catch (error) {
            setDataTable([])
        } finally {
            setLoading(false)
        }
    }

    async function handleCambiarEstado(row) {
        let res = ''
        if (row.estado === 0) {
            res = 'confirmar'
        } else if (row.estado === 1) {
            res = 'terminar'
        }
        try {
            if (window.confirm('¿Desea ' + res + ' el pedido ' + row.idPedido + '?')) {
                const { data: CambiarEstado } = await api.post('vinos/cambiarEstado', { idPedido: row.idPedido, estado: row.estado })
            }
        } catch (error) {

        } finally {
            handleLoad()
        }
    }
    async function handleAgregar(row) {
        try {
            const { data: agregarTiempo } = await api.post('vinos/agregarTiempo', { idPedido: row.idPedido, horaEstimadaFin: row.horaEstimadaFin })
        } catch (error) {

        } finally {
            handleLoad()
        }
    }

    async function handleDetalle(row) {
        setdatoRow(row)
        setDetalle(!showDetalle)
        if (showDetalle) {
            handleLoad()
        }
    }

    const noData = <strong style={{ color: 'red', textAlign: 'center' }}>No se encontraron productos</strong>

    const customStyles = {
        table: {
            style: {
                maxHeight: "500px",
                overflow: "auto",
            },
        },
    };

    return (
        <>
            {
                showDetalle
                    ? <PedidosCocinaDetalleTable
                        handleShowTable={handleDetalle}
                        datoRow={datoRow}
                    /> : <>
                        <div>
                            <header>
                                <h1>Stock Productos</h1>
                                <button onClick={handleLoad} className='button'>Actualizar</button>
                            </header>
                        </div>
                        <div>
                            <DataTable
                                columns={Columns(handleAgregar, handleCambiarEstado, handleDetalle)}
                                data={dataTable}
                                progressPending={loading}
                                progressComponent={<Loading message='Cargando datos...' marginLeft={20} />}
                                noDataComponent={noData}
                                highlightOnHover
                                fixedHeader={true}
                                resizable={true}
                                customStyles={customStyles}
                            />
                        </div>
                    </>
            }
            <style jsx>{`
                header {
                    display:flex;
                    justify-content: space-between;
                }
                div {
                    border: 2px solid #cecaca;
                    border-radius: 10px;
                    background-color: #fff;
                    margin: 20px 10px 10px 10px;
                    box-shadow: 1px 2px 1px grey;
                }
                button {
                    margin: 15px;
                    background-color: #E11919;
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
                    background-color: #FF0000;
                }
                h1 {
                    margin:15px;
                }
            `}</style>
        </>
    )
}
