import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import useFiles from "../../Hooks/useFiles";
import ShowImage from "../Viaticos/ShowImage";
import Loading from '../Loading/Loading'
import apiFeco from "../../Services/apiServices";
import UserContext from "../../context/userContext";

const INITIAL_STATE = {
    date: '',
    type: '',
    place: '',
    products: '',
    expense: 0,
    expenseSocial: 0,
    voucher: ''
}

export default function ReintegroVino({ handleShow }) {
    const { user } = useContext(UserContext)
    const { handleChange,
        handleFilterImage,
        handleSelectImage,
        setShow,
        show,
        filesArray,
        imageSrc } = useFiles()
    const [formData, setFormData] = useState(INITIAL_STATE)
    const [disabledSend, setDisabledSend] = useState(true)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [transition, setTransition] = useState(false)

    useEffect(() => {
        handleCheck()
    }, [formData, filesArray])

    useEffect(() => {
        // Después de que se haya realizado la animación, restablecer el estado de newItemAdded
        if (transition) {
            const timeoutId = setTimeout(() => {
                setTransition(false)
            }, 500) // Ajusta el tiempo de espera según la duración de tu transición CSS
            return () => clearTimeout(timeoutId)
        }
    }, [transition])

    function handleClick() {
        document.getElementById('files').value = "";
        document.getElementById('files').click();
    }

    function handleChangeForm(event) {
        const { name, value } = event.target
        if (name === 'type') {
            setTransition(true)
            setFormData({ ...INITIAL_STATE, [name]: value })
            return
        }
        setFormData({ ...formData, [name]: value })
    }

    async function handleSubmit() {
        //en el caso de que se guarde el tipo 3 voy a hacer el guardar dos img, de no ser asi guardo una
        if (formData.type === '3') {
            setLoading(true)
            setError('')
            try {
                const dataToSend = {
                    ...formData,
                    ...filesArray,
                    legajo: user.USNROLEG
                }
                const { data: saveReintegrate } = await apiFeco.post('userRequest/reintegrate/saveReintegrateFarmacia', { fromData: dataToSend })
                if (saveReintegrate.statusCode === 200) {
                    alert('Se guardaron los datos')
                    setFormData(INITIAL_STATE)
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
        } else {
            setLoading(true)
            setError('')
            try {
                const dataToSend = {
                    ...formData,
                    ...filesArray[0],
                    legajo: user.USNROLEG
                }
                const { data: saveReintegrate } = await apiFeco.post('userRequest/reintegrate', { fromData: dataToSend })
                if (saveReintegrate.statusCode === 200) {
                    alert('Se guardaron los datos')
                    setFormData(INITIAL_STATE)
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
    }

    function handleCheck() {
        if (!formData.type) {
            setDisabledSend(true)
            return
        }
        if (formData.type === '1' && (Object.values(formData).includes('') || filesArray.length === 0 || formData.expense === 0)) {
            setDisabledSend(true)
            return
        }
        if ((formData.type === '2' || formData.type === '4') && (formData.date === '' || filesArray.length === 0 || formData.expense === 0)) {
            setDisabledSend(true)
            return
        }
        const { products, ...restOfData } = formData
        if (formData.type === '3' && (Object.values(restOfData).includes('') || filesArray.length === 0 || Object.values(formData).includes(0))) {
            setDisabledSend(true)
            return
        }

        setDisabledSend(false)
    }

    return (
        <>
            {
                show &&
                <ShowImage
                    show={show}
                    setShow={setShow}
                    imageSrc={imageSrc}
                />
            }
            <main>
                <div>
                    <h2>Formulario Reintegro</h2>
                    <section>
                        <label>Tipo reintegro</label>
                        <select onChange={handleChangeForm} value={formData.type} type="date" name="type" >
                            <option disabled value=""></option>
                            <option value="1">Vino</option>
                            <option value="2">Gimnasio</option>
                            <option value="3">Farmacia</option>
                            <option value="4">Guarderia</option>
                        </select>
                    </section>
                    <section className={transition ? "element-hidden" : "element"}>
                        <label>Fecha {(formData.type === '4' || formData.type === '2') ? 'Comprobante' : 'ticket'}</label>
                        <input onChange={handleChangeForm} value={formData.date} type="date" name="date" />
                    </section>
                    {
                        (formData.type === '1' || formData.type === '3') &&
                        <section className={transition ? "element-hidden" : "element"}>
                            <label> {formData.type === '3' ? "Lugar de Trabajo" : 'Restaurante'}</label>
                            <input maxLength={100} onChange={handleChangeForm} value={formData.place} type="text" name="place" placeholder={formData.type === '3' ? 'Casa Matriz - Toro - Resero' : 'Restaurante'} />
                        </section>
                    }
                    {
                        formData.type === '1' &&
                        <section className={transition ? "element-hidden" : "element"}>
                            <label>Productos</label>
                            <textarea placeholder="Ej: Dilema Malbec" maxLength={200} onChange={handleChangeForm} value={formData.products} type="text" name="products" />
                        </section>
                    }
                    {
                        (formData.type === '1' || formData.type === '3') &&
                        <section className={transition ? "element-hidden" : "element"}>
                            <label>N° Comprobante</label>
                            <input placeholder="Ej: 09321-LO0932" maxLength={100} onChange={handleChangeForm} value={formData.voucher} type="text" name="voucher" />
                        </section>
                    }
                    <section className={transition ? "element-hidden" : "element"}>
                        <label>Importe Total</label>
                        <input onChange={handleChangeForm} value={formData.expense} type="number" name="expense" style={{ textAlign: "right" }} />
                    </section>
                    {
                        formData.type === '3' &&
                        <section className={transition ? "element-hidden" : "element"}>
                            <label>Importe Obra Social</label>
                            <input onChange={handleChangeForm} value={formData.expenseSocial} type="number" name="expenseSocial" style={{ textAlign: "right" }} />
                        </section>
                    }
                    {(formData.type === '1' || formData.type === '2' || formData.type === '4') &&
                        <section className={transition ? "element-hidden" : "element"}>
                            <input onChange={handleChange} style={{ display: 'none' }} type="file" id="files" accept="image/png, image/jpeg, image/jpg" />
                            <button disabled={filesArray.length === 1} className={filesArray.length === 1 ? 'button_disabled' : 'button'} onClick={handleClick} >Seleccionar imagen</button>
                        </section>
                    }
                    {(formData.type === '3') &&
                        <section className={transition ? "element-hidden" : "element"}>
                            <input onChange={handleChange} style={{ display: 'none' }} type="file" id="files" accept="image/png, image/jpeg, image/jpg" />
                            <button disabled={filesArray.length === 2} className={filesArray.length === 2 ? 'button_disabled' : 'button'} onClick={handleClick} >Seleccionar imagenes</button>
                        </section>
                    }
                    {
                        formData.type === '3'
                        && <label className="label-receta">
                            (Cargar comprobante y receta)
                        </label>
                    }
                    {(formData.type !== '3' && filesArray.length === 1) &&
                        <article>
                            <button onClick={() => handleFilterImage(filesArray[0])} className="buttonImage button">X</button>
                            <Image
                                src={`data:image/jpeg;base64,${filesArray[0].dataImage}`}
                                onClick={handleSelectImage}
                                width={100}
                                height={100}
                                alt="."
                            />
                        </article>
                    }
                    {formData.type === '3' &&
                        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3,100px)' }}>
                            {filesArray &&
                                filesArray.map((file, index) => (
                                    <article key={file.dataImage + index}>
                                        <button onClick={() => handleFilterImage(filesArray[0])} className="buttonImage button">X</button>
                                        <Image
                                            height={100}
                                            width={100}
                                            src={`data:image/jpeg;base64,${file.dataImage}`}
                                            onClick={handleSelectImage}
                                            alt='viaticImage'
                                        />
                                    </article>
                                ))}
                        </section>
                    }
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
                    background-color: rgb(138, 13, 111);
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
                    background-color: rgb(182, 27, 182);
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
