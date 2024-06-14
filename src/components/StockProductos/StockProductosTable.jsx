import { useContext, useEffect, useState } from "react"
import DataTable from "react-data-table-component"
import dayjs from "dayjs"
import { Trash3, PencilSquare, CloudUpload, X, Check } from "react-bootstrap-icons"
import StockProductosForm from "./StockProductosForm"
import StockProductosEdit from "./StockProductosEdit"
import StockProductosIngredientesTable from "./StockProductosIngredientesTable"
import UserContext from "../../context/userContext"
import api from "../../Services/apiServices"
import Loading from "../Loading/Loading"
import ProductoImagen from "./ProductoImagen"
const Columns = (handleDelete, handleEdit, handleIngredientes, handleCargarImagen) => (
    [
        {
            name: 'Rubro',
            selector: row => row.nomrub,
            wrap: true,
            sortable: true,
            center: true,
        },
        {
            name: 'Nombre',
            selector: row => row.denominacion,
            wrap: true,
            sortable: true,
            center: true,
        },
        {
            name: 'Tiempo Cocina',
            selector: row => row.tiempoEstimadoCocina,
            wrap: true,
            sortable: true,
            center: true,
        },
        {
            name: 'Precio Venta',
            selector: row => row.precioVenta,
            wrap: true,
            sortable: true,
            center: true,
        },
        {
            name: 'Descripcion',
            selector: row => row.descripcion,
            wrap: true,
            sortable: true,
            center: true,
        },
        {
            name: 'Receta',
            selector: row => row.receta,
            wrap: true,
            sortable: true,
            center: true,
        },
        {
            name: 'Ingredientes',
            center: true,
            cell: (row) => {
                return (
                    <div onClick={() => handleIngredientes(row)}>
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
            name: 'EDITAR',
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
            name: 'IMAGEN',
            center: true,
            cell: (row) => {
                return (
                    <div onClick={() => handleCargarImagen(row)}>
                        <CloudUpload
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

export default function StockProductosTable() {
    const { user } = useContext(UserContext)
    const [dataTable, setDataTable] = useState([])
    const [show, setShow] = useState(false)
    const [showEdit, setEdit] = useState(false)
    const [showIngre, setIngre] = useState(false)
    const [showCargarImg, setCargarImg] = useState(false)
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
            const { data: getStockProductos } = await api.post('stockProductos/getStockProductos')
            setDataTable(getStockProductos.data)
        } catch (error) {
            setDataTable([])
        } finally {
            setLoading(false)
        }
    }

    async function handleDelete(row) {
        try {
            if (window.confirm('¿Desea borrar el Producto ' + row.denominacion + '?')) {
                const { data: deleteStockProductos } = await api.post('stockProductos/deleteStockProductos', { idArticuloManufacturado: row.idArticuloManufacturado })
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

    async function handleIngredientes(row) {
        setdatoRow(row)
        setIngre(!showIngre)
        if (showIngre) {
            handleLoad()
        }
    }

    async function handleCargarImagen(row) {
        setdatoRow(row)
        setCargarImg(!showCargarImg)
        if (showCargarImg) {
            handleLoad()
        }
    }

    const noData = <strong style={{ color: 'red', textAlign: 'center' }}>No se encontraron productos</strong>

    return (
        <>
            {
                show
                    ? <StockProductosForm
                        handleShow={handleShow}
                    /> : showEdit
                        ? <StockProductosEdit
                            handleShow={handleEdit}
                            datoRow={datoRow}
                        /> : showIngre
                            ? <StockProductosIngredientesTable
                                handleShowTable={handleIngredientes}
                                datoRow={datoRow}
                            /> : showCargarImg
                                ? <ProductoImagen
                                    handleShow={handleCargarImagen}
                                    datoRow={datoRow}
                                />
                                : <>
                                    <div>
                                        <header>
                                            <h1>Stock Productos</h1>
                                            <button onClick={handleShow}>Nuevo</button>
                                        </header>
                                    </div>
                                    <div>
                                        <DataTable
                                            columns={Columns(handleDelete, handleEdit, handleIngredientes, handleCargarImagen)}
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
