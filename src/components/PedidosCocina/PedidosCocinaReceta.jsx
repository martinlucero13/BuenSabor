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
            <main className="main">
                <div className="container">
                    <header>
                        <h2>Receta De {dataRow.denominacion}</h2>
                        <button onClick={handleShow} className='button'>Volver</button>
                    </header>
                    <div className="receta">
                        <div className="image-container">
                            <Image
                                src={`/${dataRow.imagen}.jpg`}
                                alt=''
                                style={{ borderRadius: '20px', objectFit: 'cover' }}
                                width={240}
                                height={240}
                            />
                        </div>
                        <p>{dataRow.receta}</p>
                    </div>
                    <DataTable
                        columns={Columns()}
                        data={dataTable}
                        progressPending={loading}
                        progressComponent={<Loading message='Cargando datos...' marginLeft={20} />}
                        noDataComponent={noData}
                        highlightOnHover
                        fixedHeader
                        resizable
                    />
                </div>
            </main>
            <style jsx>{`
            .main {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 100%;
                    height: 100%;
                }
                .container {
                    border: 2px solid #cecaca;
                    border-radius: 10px;
                    background-color: #fff;
                    margin: 10px;
                    box-shadow: 1px 2px 1px grey;
                    padding: 20px;
                }
                header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }
                .button {
                    background-color: #E11919;
                    color: white;
                    border-radius: 20px;
                    font-size: 17px;
                    transition: 0.5s;
                    padding: 10px;
                    border: none;
                    width: 150px;
                    text-transform: uppercase;
                }
                .button:hover {
                    color: black;
                    background-color: #FF0000;
                }
                h2, p {
                    margin: 15px 0;
                }
                .receta {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                }
                .image-container {
                    width: 240px;
                    height: 240px;
                    margin-bottom: 20px;
                }
                @media (min-width: 768px) {
                    .receta {
                        flex-direction: row;
                        text-align: left;
                    }
                    .image-container {
                        margin-right: 20px;
                    }
                }
            `}
            </style>
        </>
    );
}
