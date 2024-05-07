import { useContext, useEffect, useState } from "react"
import DataTable from "react-data-table-component"
import dayjs from "dayjs"
import { Trash3, PencilSquare, X, Check } from "react-bootstrap-icons"
import EmpleadosForm from "./EmpleadosForm"
import EmpleadosEdit from "./EmpleadosEdit"
import UserContext from "../../context/userContext"
import api from "../../Services/apiServices"
import Loading from "../Loading/Loading"
const Columns = (handleDelete, handleEdit) => (
    [
        {
            name: 'Rol',
            selector: row => {
                if (row.rol === '2') {
                    return "Cajero"
                }
                else if (row.rol === '3') {
                    return "Delivery"
                }
                else if (row.rol === '4') {
                    return "Cocinero"
                }
                else if (row.rol === '5') {
                    return "Administrador"
                }
            },
            wrap: true,
            sortable: true,
            center: true,
        },
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

export default function EmpleadosTable() {
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
            const { data: getEmpleados } = await api.post('empleados/getEmpleados')
            setDataTable(getEmpleados.data)
        } catch (error) {
            setDataTable([])
        } finally {
            setLoading(false)
        }
    }

    async function handleDelete(row) {
        try {
            if (window.confirm('¿Desea borrar el Empleado ' + row.nombre + ' ' + row.apellido + '?')) {
                const { data: deleteEmpleados } = await api.post('empleados/deleteEmpleados', { idUsuario: row.idUsuario })
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

    const noData = <strong style={{ color: 'red', textAlign: 'center' }}>No se encontraron empleados</strong>

    return (
        <>
            {
                show
                    ? <EmpleadosForm
                        handleShow={handleShow}
                    /> : showEdit
                        ? <EmpleadosEdit
                            handleShow={handleEdit}
                            datoRow={datoRow}
                        />
                        : <>
                            <div>
                                <header>
                                    <h1>Empleados</h1>
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
