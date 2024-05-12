import { useContext, useEffect, useState } from "react"
import DataTable from "react-data-table-component"
import { Trash3, PencilSquare, X, Check } from "react-bootstrap-icons"
import PedidosCocinaReceta from "./PedidosCocinaReceta"
import UserContext from "../../context/userContext"
import api from "../../Services/apiServices"
import Loading from "../Loading/Loading"
const Columns = (handleShow) => (
    [
        {
            name: 'Cantidad',
            selector: row => row.cantidad,
            wrap: true,
            sortable: true,
            center: true,
        },
        {
            name: 'Productos',
            selector: row => row.denominacion,
            wrap: true,
            sortable: true,
            center: true,
        },
        {
            name: 'Receta',
            center: true,
            cell: (row) => {
                return (
                    <div onClick={() => handleShow(row)}>
                        <button>Receta</button>
                        <style jsx>{`
                        button {
                        margin: 10px;
                        background-color: rgb(138, 13, 111);
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
                            background-color: rgb(182, 27, 182);
                        }
                    `}</style>
                    </div>
                );
            }
        },
    ]
)

export default function PedidosCocinaDetalleTable({ handleShowTable, datoRow }) {
    const { user } = useContext(UserContext)
    const [dataTable, setDataTable] = useState([])
    const [showReceta, setshowReceta] = useState(false)
    const [loading, setLoading] = useState(false)
    const [dataRow, setdataRow] = useState()

    useEffect(() => {
        if (Object.keys(user).length) {
            handleLoad()
        }
    }, [user])

    async function handleLoad() {
        setLoading(true)
        try {
            const { data: tomarDetallePedidoCocina } = await api.post('vinos/tomarDetallePedidoCocina', { idPedido: datoRow.idPedido })
            setDataTable(tomarDetallePedidoCocina.data)
        } catch (error) {
            setDataTable([])
        } finally {
            setLoading(false)
        }
    }

    function handleShow(row) {
        setdataRow(row)
        setshowReceta(!showReceta)
        if (showReceta) {
            handleLoad()
        }
    }
    const noData = <strong style={{ color: 'red', textAlign: 'center' }}>No se encontraron productos</strong>

    return (
        <>
            {
                showReceta
                    ? <PedidosCocinaReceta
                        handleShow={handleShow}
                        dataRow={dataRow}
                    /> : <>
                        <div>
                            <header>
                                <h1>Detalles del Pedido {datoRow.idPedido}</h1>
                                <button onClick={handleShowTable} className='button'>Volver</button>
                            </header>
                        </div>
                        <div>
                            <DataTable
                                columns={Columns(handleShow)}
                                data={dataTable}
                                progressPending={loading}
                                progressComponent={<Loading message='Cargando datos...' marginLeft={20} />}
                                noDataComponent={noData}
                                highlightOnHover
                                fixedHeader={true}
                                resizable={true}
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
                    margin: 50px 10px 0 10px;
                    box-shadow: 1px 2px 1px grey;
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
                h1 {
                    margin:15px;
                }
            `}</style>
        </>
    )
}
