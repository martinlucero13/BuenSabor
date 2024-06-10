import React, { useContext, useEffect, useState } from "react"
import DataTable from "react-data-table-component"
import UserContext from "../../context/userContext"
import api from "../../Services/apiServices"
import Loading from "../Loading/Loading"

const INITIAL_STATE = {
    dateDesde: '',
    dateHasta: '',
}
const Columns = () => (
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
            name: 'Cantidad De Peidos',
            selector: row => row.cantPedidos,
            wrap: true,
            sortable: true,
            center: true,
        },
        {
            name: 'Suma Total Compras',
            selector: row => '$ ' + row.sumTotal,
            wrap: true,
            sortable: true,
            center: true,
        },
    ]
)

export default function EstadisticasClientesTable() {
    const { user } = useContext(UserContext)
    const [dataTable, setDataTable] = useState([])
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState(INITIAL_STATE)
    const [disabledSend, setDisabledSend] = useState(true)
    const [invalidDate, setInvalidDate] = useState("");
    var XLSX = require("xlsx");

    async function handleLoad() {
        setInvalidDate("");
        setLoading(true)
        try {
            const { data: getEstadisticasClientes } = await api.post('estadisticas/getEstadisticasClientes', { dateDesde: formData.dateDesde, dateHasta: formData.dateHasta })
            setDataTable(getEstadisticasClientes.data)
        } catch (error) {
            setDataTable([])
        } finally {
            setLoading(false)
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

    const handleOnExport = () => {
        try {
            if (dataTable.length > 0) {
                setInvalidDate("");
                const dataPrint = dataFormatExcel(dataTable);
                let wb = XLSX.utils.book_new(),
                    ws = XLSX.utils.json_to_sheet(dataPrint);

                XLSX.utils.book_append_sheet(wb, ws, "EstadisticasClientes");
                XLSX.writeFile(wb, "EstadisticasClientes.xlsx");
            } else {
                setInvalidDate("No hay datos para Exportar");
            }
        }
        catch (error) {
            setInvalidDate("No hay datos para Exportar");
        }
    };

    function dataFormatExcel(dataTable) {
        return dataTable.map((data) => {
            return {
                Nombre: data.nombre,
                Apellido: data.apellido,
                CantPedidos: data.cantPedidos,
                SumTotal: data.sumTotal,
            };
        });
    }

    const noData = <strong style={{ color: 'red', textAlign: 'center' }}>No se encontraron estadisticas</strong>

    return (
        <>
            <>
                <div className="barraNav">
                    <header>
                        <h1>Estadisticas Clientes</h1>
                        <label>Desde</label>
                        <input onChange={handleChangeForm} value={formData.dateDesde} type="date" name="dateDesde" />

                        <label>Hasta</label>
                        <input onChange={handleChangeForm} value={formData.dateHasta} type="date" name="dateHasta" />

                        <button onClick={handleLoad} disabled={disabledSend} className={disabledSend || loading ? 'button_disabled' : 'button'}>Buscar</button>

                        <img
                            className="iconExcel"
                            src="Excel50.png"
                            alt="icon"
                            width="50"
                            height="50"
                            onClick={handleOnExport}
                            disabled={disabledSend}
                        />

                    </header>
                    {/*<strong style={{ color: 'red', textAlign: 'center', marginLeft: '15px' }} className="invalidDate d-inline">{invalidDate}</strong>*/}
                </div>
                <div>
                    <DataTable
                        columns={Columns()}
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

            <style jsx>{`
                div{
                    margin: 40px 15px 5px 15px;
                    box-shadow: 1px 1px 4px black;
                    border-radius: 10px;                  
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
                    background-color:grey;
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
                .iconExcel{
                    margin: 15px;
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
