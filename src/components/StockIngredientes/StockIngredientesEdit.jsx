import { useContext, useEffect, useState } from "react";
import Loading from '../Loading/Loading'
import api from "../../Services/apiServices";
import UserContext from "../../context/userContext";



export default function StockIngredientesEdit({ handleShow, datoRow }) {
    const INITIAL_STATE = {
        nomInsumo: datoRow ? datoRow.nomInsumo : '',
        precioCompra: datoRow ? datoRow.precioCompra : '',
        stockActual: datoRow ? datoRow.stockActual : '',
        stockMinimo: datoRow ? datoRow.stockMinimo : '',
        unidadMedida: datoRow ? datoRow.unidadMedida : '',
        esInsumo: datoRow ? datoRow.esInsumo : '',
        rubro: '',
    }

    const { user } = useContext(UserContext)
    const [formData, setFormData] = useState(INITIAL_STATE)
    const [disabledSend, setDisabledSend] = useState(true)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [transition, setTransition] = useState(false)
    const [rubros, setRubros] = useState([]);

    useEffect(() => {
        handleCheck()
    }, [formData])

    useEffect(() => {
        // Después de que se haya realizado la animación, restablecer el estado de newItemAdded
        if (transition) {
            const timeoutId = setTimeout(() => {
                setTransition(false)
            }, 500) // Ajusta el tiempo de espera según la duración de tu transición CSS
            return () => clearTimeout(timeoutId)
        }
    }, [transition])

    useEffect(() => {
        handleLoad()
    }, []);

    async function handleLoad() {
        try {
            const { data: rubroList } = await api.get('rubroIngredientes/getRubroIngredientes')
            setRubros(rubroList.data)
        } catch (error) {
            setRubros([])
        }
    }

    function handleChangeForm(event) {
        const { name, value } = event.target
        setFormData({ ...formData, [name]: value })
    }

    async function handleSubmit() {
        setLoading(true)
        setError('')
        try {
            const dataToSend = {
                ...formData,
                idData: datoRow.idArticuloInsumo
            }
            const { data: editStockIngredientes } = await api.post('stockIngredientes/editStockIngredientes', { fromData: dataToSend })
            if (editStockIngredientes.statusCode === 200) {
                alert('Se guardaron los datos')
                //setFormData(INITIAL_STATE)
                setError('')
                handleShow()
            } else {
                throw new Error()
            }
        } catch (error) {
            setError('Error al guardar datos, intententelo nuevamente')
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    function handleCheck() {
        const values = Object.values(formData);
        if (values.includes('') || values.some(value => value < 0)) {
            setDisabledSend(true);
            return;
        }
        setDisabledSend(false);
    }

    return (
        <>
            <main>
                <div>
                    <h2>Editar Ingrediente</h2>
                    <section className={transition ? "element-hidden" : "element"}>
                        <label>Denominacion</label>
                        <input maxLength={200} onChange={handleChangeForm} value={formData.nomInsumo} type="text" name="nomInsumo" />
                    </section>
                    <section className={transition ? "element-hidden" : "element"}>
                        <label>Precio Compra</label>
                        <input onChange={handleChangeForm} value={formData.precioCompra} type="number" name="precioCompra" style={{ textAlign: "right" }} />
                    </section>
                    <section>
                        <label>Rubro</label>
                        <select onChange={handleChangeForm} name="rubro" defaultValue={formData.rubro}>
                            <option value="">Seleccionar Rubro</option>
                            {rubros.map(rubro => (
                                <option key={rubro.idRubro} value={rubro.idRubro}>{rubro.denominacion}</option>
                            ))}
                        </select>

                    </section>
                    <section className={transition ? "element-hidden" : "element"}>
                        <label>Stock Actual</label>
                        <input onChange={handleChangeForm} value={formData.stockActual} type="number" name="stockActual" style={{ textAlign: "right" }} />
                    </section>
                    <section className={transition ? "element-hidden" : "element"}>
                        <label>Stock Minimo</label>
                        <input onChange={handleChangeForm} value={formData.stockMinimo} type="number" name="stockMinimo" style={{ textAlign: "right" }} />
                    </section>
                    <section className={transition ? "element-hidden" : "element"}>
                        <label>Unidad Medida</label>
                        <input onChange={handleChangeForm} value={formData.unidadMedida} type="text" name="unidadMedida" />
                    </section>
                    <section>
                        <label>Es Insumo</label>
                        <select onChange={handleChangeForm} value={formData.esInsumo} type="text" name="esInsumo" >
                            <option value=""></option>
                            <option value="0">No</option>
                            <option value="1">Si</option>
                        </select>
                    </section>
                    <section>
                        {
                            error &&
                            <strong>{error}</strong>
                        }
                        {
                            loading &&
                            <Loading
                                message='Guardando datos...'
                            />
                        }
                    </section>
                    <button onClick={handleSubmit} disabled={disabledSend} className={disabledSend || loading ? 'button_disabled' : 'button'}>Guardar</button>
                    <button onClick={handleShow} className='button'>Cancelar</button>
                </div>
            </main>
            <style jsx>{`
                main{
                    display: flex;
                    flex-direction:column;
                    justify-content:center;
                    align-items: center;
                    padding:20px;
                }
                div{
                    display: flex;
                    flex-direction:column;
                    justify-content:center;
                    align-items: center;
                    border: 2px solid #cecaca;
                    border-radius: 10px;
                    background-color: #fff;
                    width: 320px;
                    padding: 10px;
                    transition: 0.5 ease;
                }
                label{
                    font-size: 15px;
                    font-weight: bold;
                    text-transform:uppercase;
                    margin-top: 5px;
                }
                .label-receta{
                    font-size: 13px;
                    font-weight: bold;
                    text-transform: uppercase;
                    text-align: center;

                }
                input, select{
                    width: 220px;
                    border-radius: 10px;
                    border: 2px solid #cecaca;
                    padding: 3px;
                }
                textArea{
                    width: 220px;
                    border-radius: 10px;
                    border: 2px solid #cecaca;
                    padding: 3px;
                    resize: none;
                }
                .button{
                    margin-top: 10px;
                    background-color: #E11919;
                    color: white;
                    border-radius: 20px;
                    font-size: 17px;
                    transition: 0.5s;
                    padding: 5px;
                    border: none;
                    width: 220px;
                    text-transform:uppercase;
                }
                .button_disabled{
                    margin-top: 10px;
                    transition: 0.5s;
                    background-color:grey;
                    color: white;
                    border-radius: 20px;
                    font-size: 17px;
                    transition: 0.5s;
                    padding: 5px;
                    border: none;
                    width: 220px;
                    text-transform:uppercase;
                }
                button:hover{
                    color: black;
                }
                .button:hover{
                    color: black;
                    background-color: #FF0000;
                }
                .buttonImage{
                    position: absolute;
                    top: 0;
                    right: 0;
                    border-radius: 50px;
                    background-color: grey;
                    z-index: 1;
                    width: 25px;
                    height: 25px;
                    text-align: center;
                    cursor: pointer;
                    margin: 0;
                    padding: 0;
                }
                section{
                    display:flex;
                    flex-direction: column;
                    text-transform:uppercase;
                    text-align:center;
                    margin: 3px 0;
                }
                p{
                    margin:0;
                    font-size: 15px;
                    color:red;
                    text-transform:uppercase;
                    text-align: center;
                }
                strong{
                    text-transform:uppercase;
                    text-align: center;
                    color:red;
                }
                h2{
                    font-size: 27px;
                }
                article {
                    position: relative;
                    display: flex;
                    flex-direction: row;
                    background-color: rgb(167,167,167);
                    margin: 3px 0;
                }
                .element-hidden{
                    opacity: 0;
                }
                .element{
                    opacity: 1;
                    transition: opacity .7s ease;
                }
            `}
            </style>
        </>
    )
}
