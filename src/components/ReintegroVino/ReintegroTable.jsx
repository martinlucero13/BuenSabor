import { useContext, useEffect, useState } from "react"
import DataTable from "react-data-table-component"
import dayjs from "dayjs"
import { Trash3, X, Check } from "react-bootstrap-icons"
import ReintegroForm from "./ReintegroForm"
import UserContext from "../../context/userContext"
import apiFeco from "../../Services/apiServices"
import Loading from "../Loading/Loading"
const Columns = (handleDelete) => (
    [
        {
            name: 'Fecha Solicitud',
            selector: row => row.dateRequest,
            center: true,
            format: (row) => {
                return dayjs(row.dateRequest).format("DD/MM/YYYY")
            }
        },
        {
            name: 'Fecha Comprobante',
            selector: row => row.date,
            center: true,
            format: (row) => {
                return dayjs(row.date).format("DD/MM/YYYY")
            }
        },
        {
            name: 'Tipo',
            selector: row => row.type,
            left: true,
            wrap: true,
            grow: 0.2
        },
        {
            name: 'Lugar',
            selector: row => row.place,
            left: true,
            wrap: true
        },
        {
            name: 'Productos',
            selector: row => row.products,
            left: true,
            wrap: true
        },
        {
            name: 'N° Comprobante',
            selector: row => row.voucher,
            center: true,
        },
        {
            name: 'Importe',
            selector: row => row.expense,
            right: true,
            grow: 0.2,
            format: (row) => {
                return '$' + row.expense.toFixed(2)
            }
        },
        {
            name: 'Importe Obra Social',
            selector: row => row.expenseSocial,
            right: true,
            wrap: true,
            format: (row) => {
                if (row.expenseSocial) {
                    return '$' + row.expenseSocial.toFixed(2)
                }
                return ''
            }
        },
        {
            name: 'Importe Reconocimiento ',
            selector: row => row.expenseFeco,
            right: true,
            wrap: true,
            format: (row) => {
                if (row.expenseFeco) {
                    return '$' + row.expenseFeco.toFixed(2)
                }
                return ''
            }
        },
        {
            name: 'Aut. RRHH',
            selector: row => row.authrrhh,
            center: true,
            format: (row) => {
                if (row.authrrhh == 1) {
                    return <Check style={{ marginLeft: '30px', color: 'green', width: '40px', height: '40px' }} />
                }
                if (row.authrrhh == 99) {
                    return <X style={{ marginLeft: '30px', color: 'red', width: '40px', height: '40px' }} />
                }
            }
        },
        {
            name: 'Respuesta RRHH',
            selector: row => row.response,
            left: true,
            wrap: true
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

export default function ReintegroTable() {
    const { user } = useContext(UserContext)
    const [dataTable, setDataTable] = useState([])
    const [show, setShow] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (Object.keys(user).length) {
            handleLoad()
        }
    }, [user])

    async function handleLoad() {
        setLoading(true)
        try {
            const { data: getReintegrate } = await apiFeco.post('userRequest/reintegrate/getReintegrate', { legajo: user.USNROLEG })
            setDataTable(getReintegrate.data)
        } catch (error) {
            setDataTable([])
        } finally {
            setLoading(false)
        }
    }

    async function handleDelete(row) {
        try {
            if (window.confirm('¿Desea borrar el reintegro?')) {
                const { data: deleteReintegrate } = await apiFeco.post('userRequest/reintegrate/delete', { nroreint: row.nroreint })
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

    const noData = <strong style={{ color: 'red', textAlign: 'center' }}>No se encontraron reintegros</strong>

    return (
        <>
            {
                show
                    ? <ReintegroForm
                        handleShow={handleShow}
                    />
                    : <>
                        <header>
                            <h1>Reintegros</h1>
                            <button onClick={handleShow}>Nuevo</button>
                        </header>
                        <div>
                            <DataTable
                                columns={Columns(handleDelete)}
                                data={dataTable}
                                progressPending={loading}
                                progressComponent={<Loading message='Cargando datos...' marginLeft={20} />}
                                noDataComponent={noData}
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
