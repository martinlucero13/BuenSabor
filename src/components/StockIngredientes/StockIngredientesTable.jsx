import { useContext, useEffect, useState } from "react"
import DataTable from "react-data-table-component"
import dayjs from "dayjs"
import { Trash3, PencilSquare, BasketFill, Check } from "react-bootstrap-icons"
import StockIngredientesForm from "./StockIngredientesForm"
import StockIngredientesEdit from "./StockIngredientesEdit"
import StockIngredientesComprar from "./StockIngredientesComprar"
import UserContext from "../../context/userContext"
import api from "../../Services/apiServices"
import Loading from "../Loading/Loading"
const Columns = (handleDelete, handleEdit, handleComprar) => (
    [
        {
            name: 'Nombre',
            selector: row => row.nomInsumo,
            wrap: true,
            sortable: true,
            center: true,
        },
        {
            name: 'Precio',
            selector: row => row.precioCompra,
            wrap: true,
            sortable: true,
            center: true,
        },
        {
            name: 'Stock Actual',
            selector: row => row.stockActual,
            wrap: true,
            sortable: true,
            center: true,
        },
        {
            name: 'Stock Minimo',
            selector: row => row.stockMinimo,
            wrap: true,
            sortable: true,
            center: true,
        },
        {
            name: 'Uni. Medida',
            selector: row => row.unidadMedida,
            wrap: true,
            sortable: true,
            center: true,
        },
        {
            name: 'Es Insumo',
            selector: row => {
                if (row.esInsumo === 0) {
                    return "No"
                }
                else if (row.esInsumo === 1) {
                    return "Si"
                }
                else {
                    return "-"
                }
            },
            wrap: true,
            sortable: true,
            center: true,
        },
        {
            name: 'Rubro',
            selector: row => row.denominacion,
            wrap: true,
            sortable: true,
            center: true,
        },
        {
            name: 'Editar',
            center: true,
            cell: (row) => {
                return (
                    <div onClick={() => handleEdit(row)}>
                        <PencilSquare
                            style={{ color: 'black', cursor: 'pointer' }}
                            width={30}
                            height={30}
                        />
                    </div>
                );
            }
        },
        {
            name: 'Comprar',
            center: true,
            cell: (row) => {
                return (
                    <div onClick={() => handleComprar(row)}>
                        <BasketFill
                            style={{ color: 'black', cursor: 'pointer' }}
                            width={30}
                            height={30}
                        />
                    </div>
                );
            }
        },
        {
            name: 'Eliminar',
            center: true,
            cell: (row) => {
                if (row.authrrhh) {
                    return ''
                }
                return <div onClick={() => handleDelete(row)}>
                    <Trash3
                        style={{ color: 'red', cursor: 'pointer' }}
                        width={30}
                        height={30}
                    />
                </div>
            }
        },
    ]
)

export default function StockIngredientesTable() {
    const { user } = useContext(UserContext)
    const [dataTable, setDataTable] = useState([])
    const [show, setShow] = useState(false)
    const [showEdit, setEdit] = useState(false)
    const [showComprar, setComprar] = useState(false)
    const [loading, setLoading] = useState(false)
    const [datoRow, setdatoRow] = useState()

    useEffect(() => {
        if (Object.keys(user).length) {
            handleLoad()
        }
    }, [user])

    async function handleLoad() {
        setLoading(true)
        try {
            const { data: getStockIngredientes } = await api.post('stockIngredientes/getStockIngredientes')
            setDataTable(getStockIngredientes.data)
        } catch (error) {
            setDataTable([])
        } finally {
            setLoading(false)
        }
    }

    async function handleDelete(row) {
        try {
            if (window.confirm('¿Desea borrar el Ingrediente ' + row.nomInsumo + '?')) {
                const { data: deleteStockIngredientes } = await api.post('stockIngredientes/deleteStockIngredientes', { idArticuloInsumo: row.idArticuloInsumo })
            }
        } catch (error) {

        } finally {
            handleLoad()
        }
    }

    function handleShow() {
        setShow(!show)
        if (show) {
            handleLoad()
        }
    }

    async function handleEdit(row) {
        setdatoRow(row)
        setEdit(!showEdit)
        if (showEdit) {
            handleLoad()
        }
    }

    async function handleComprar(row) {
        setdatoRow(row)
        setComprar(!showComprar)
        if (showComprar) {
            handleLoad()
        }
    }

    const noData = <strong style={{ color: 'red', textAlign: 'center' }}>No se encontraron ingredientes</strong>

    return (
        <>
            {
                show
                    ? <StockIngredientesForm
                        handleShow={handleShow}
                    /> : showEdit
                        ? <StockIngredientesEdit
                            handleShow={handleEdit}
                            datoRow={datoRow}
                        />
                        : showComprar
                            ? <StockIngredientesComprar
                                handleShow={handleComprar}
                                datoRow={datoRow}
                            />
                            : <>
                                <div>
                                    <header>
                                        <h1>Stock Ingredientes</h1>
                                        <button onClick={handleShow}>Nuevo</button>
                                    </header>
                                </div>
                                <div>
                                    <DataTable
                                        columns={Columns(handleDelete, handleEdit, handleComprar)}
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
