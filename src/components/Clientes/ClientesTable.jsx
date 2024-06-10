import { useContext, useEffect, useState } from "react"
import DataTable from "react-data-table-component"
import dayjs from "dayjs"
import { Trash3, PencilSquare, X, Check } from "react-bootstrap-icons"
import ClientesForm from "./ClientesForm"
import ClientesEdit from "./ClientesEdit"
import UserContext from "../../context/userContext"
import api from "../../Services/apiServices"
import Loading from "../Loading/Loading"
const Columns = (handleDelete, handleEdit) => (
    [
        {
            name: 'Nombre',
            selector: row => row.nombre,
            wrap: true,
            sortable: true,
            center: true,
        },
        {
            name: 'Apellido',
            selector: row => row.apellido,
            wrap: true,
            sortable: true,
            center: true,
        },
        {
            name: 'Correo',
            selector: row => row.email,
            wrap: true,
            sortable: true,
            center: true,
        },
        {
            name: 'Telefono',
            selector: row => row.telefono,
            wrap: true,
            sortable: true,
            center: true,
        },
        {
            name: 'Calle',
            selector: row => row.calle,
            wrap: true,
            sortable: true,
            center: true,
        },
        {
            name: 'Numero',
            selector: row => row.numero,
            wrap: true,
            sortable: true,
            center: true,
        },
        {
            name: 'Localidad',
            selector: row => row.localidad,
            wrap: true,
            sortable: true,
            center: true,
        }, {
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

export default function ClientesTable() {
    const { user } = useContext(UserContext)
    const [dataTable, setDataTable] = useState([])
    const [show, setShow] = useState(false)
    const [showEdit, setEdit] = useState(false)
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
            const { data: getClientes } = await api.post('clientes/getClientes')
            setDataTable(getClientes.data)
        } catch (error) {
            setDataTable([])
        } finally {
            setLoading(false)
        }
    }

    async function handleDelete(row) {
        try {
            if (window.confirm('¿Desea borrar el cliente ' + row.nombre + ' ' + row.apellido + '?')) {
                const { data: deleteCliente } = await api.post('clientes/deleteCliente', { idUsuario: row.idUsuario })
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

    const noData = <strong style={{ color: 'red', textAlign: 'center' }}>No se encontraron clientes</strong>

    return (
        <>
            {
                show
                    ? <ClientesForm
                        handleShow={handleShow}
                    /> : showEdit
                        ? <ClientesEdit
                            handleShow={handleEdit}
                            datoRow={datoRow}
                        />
                        : <>
                            <div>
                                <header>
                                    <h1>Clientes</h1>
                                    <button onClick={handleShow}>Nuevo</button>
                                </header>
                            </div>
                            <div>
                                <DataTable
                                    columns={Columns(handleDelete, handleEdit)}
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
