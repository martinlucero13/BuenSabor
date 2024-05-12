import { useContext, useEffect, useState } from "react";
import Loading from '../Loading/Loading'
import api from "../../Services/apiServices";
import UserContext from "../../context/userContext";
import DataTable from "react-data-table-component"
import Image from "next/image"
const Columns = () => (
    [
        {
            name: 'Cantidad',
            selector: row => row.cantidad,
            wrap: true,
            sortable: true,
            center: true,
        },
        {
            name: 'Unidad de Medida',
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
    ]
)
export default function PedidosCocinaReceta({ handleShow, dataRow }) {
    const [loading, setLoading] = useState(false)
    const [dataTable, setDataTable] = useState([])

    useEffect(() => {
        handleLoad()
    }, []);

    async function handleLoad() {
        setLoading(true)
        try {

            const { data: tomarIngredientesPedido } = await api.post('vinos/tomarIngredientesPedido', { idArti: dataRow.idArticuloManufacturado })
            setDataTable(tomarIngredientesPedido.data)
        } catch (error) {
            setDataTable([])
            setLoading(false)
        } finally {
            setLoading(false)
        }
    }
    const noData = <strong style={{ color: 'red', textAlign: 'center' }}>No se encontraron ingredientes</strong>
    return (
        <>
            <main>
                <div>
                    <header>
                        <h2>Receta De {dataRow.denominacion}</h2>
                        <button onClick={handleShow} className='button'>Volver</button>
                    </header>
                </div>
                <div className="receta">
                    <Image
                        src={`/${dataRow.imagen}.jpg`}
                        alt=''
                        style={{ borderRadius: '20px', marginTop: '2px' }}
                        //onError={handleError}
                        width={220}
                        height={230}
                    />
                    <p>{dataRow.receta}</p>

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
            </main>
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
                h2, p {
                    margin:15px;
                }
                .receta{
                    display:flex;
                    justify-content: space-between;
                    aling-item: left;
                }
            `}
            </style>
        </>
    )
}
