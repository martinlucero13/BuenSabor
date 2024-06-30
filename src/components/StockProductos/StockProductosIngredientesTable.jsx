import { useContext, useEffect, useState } from "react"
import DataTable from "react-data-table-component"
import { Trash3, PencilSquare, X, Check } from "react-bootstrap-icons"
import StockProductosFormIngredientes from "./StockProductosFormIngredientes"
import UserContext from "../../context/userContext"
import api from "../../Services/apiServices"
import Loading from "../Loading/Loading"
const Columns = (handleDelete) => (
    [
        {
            name: 'Cantidad',
            selector: row => row.cantidad,
            wrap: true,
            sortable: true,
            center: true,
        },
        {
            name: 'Unidad Medida',
            selector: row => row.unidadMedida,
            wrap: true,
            sortable: true,
            center: true,
        },
        {
            name: 'Ingrediente',
            selector: row => row.denominacion,
            wrap: true,
            sortable: true,
            center: true,
        },
        {
            name: 'Rubro Ingrediente',
            selector: row => row.RubroIngre,
            wrap: true,
            sortable: true,
            center: true,
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

export default function StockProductosIngredientesTable({ handleShowTable, datoRow }) {
    const { user } = useContext(UserContext)
    const [dataTable, setDataTable] = useState([])
    const [showAgregar, setShowAgregar] = useState(false)
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
            const { data: getIngredientesProductos } = await api.post('stockProductos/getIngredientesProductos', { idArticuloManufacturado: datoRow.idArticuloManufacturado })
            setDataTable(getIngredientesProductos.data)
        } catch (error) {
            setDataTable([])
        } finally {
            setLoading(false)
        }
    }

    async function handleDelete(row) {
        try {
            if (window.confirm('¿Desea borrar el Ingrediente ' + row.denominacion + '?')) {
                const { data: deleteIngre } = await api.post('stockProductos/deleteIngredienteProductos', { idCantIngredint: row.idCantIngredint })
            }
        } catch (error) {

        } finally {
            handleLoad()
        }
    }

    function handleShow() {
        setdataRow(datoRow)
        setShowAgregar(!showAgregar)
        if (showAgregar) {
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
                showAgregar
                    ? <StockProductosFormIngredientes
                        handleShow={handleShow}
                        dataRow={dataRow}
                    /> : <>
                        <div>
                            <header>
                                <h1>Ingredientes del Producto {datoRow.denominacion}</h1>
                                <button onClick={handleShow}>Agregar</button>
                                <button onClick={handleShowTable} className='button'>Cancelar</button>
                            </header>
                        </div>
                        <div>
                            <DataTable
                                columns={Columns(handleDelete)}
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
