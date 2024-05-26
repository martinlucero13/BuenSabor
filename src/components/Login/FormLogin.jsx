

export default function FormLogin({ username, password, handleSubmit, setPassword, setUsername, setShow, setShowRegistr, isLoginLoading }) {


    return (
        <>
            <form onSubmit={handleSubmit} className='formulario'>
                <strong className="BUENSABOR">BUEN SABOR</strong>
                <p className="pro">EL PLACER DE COMER BIEN</p>
                <div className="form-floating">
                    <input
                        type="text"
                        className="form-control mb-1"
                        id="floatingInput"
                        placeholder="Usuario"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <label htmlFor="floatingInput">Usuario</label>
                </div>
                <div className="form-floating">
                    <input
                        type="password"
                        className="form-control"
                        id="floatingPassword"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <label htmlFor="floatingPassword">Contraseña</label>
                </div>
                <button disabled={isLoginLoading} className="w-100 btn btn-lg btn-light mt-2" id='buttonLogin'>
                    LOGIN
                </button>

            </form>
            <h6 onClick={() => setShow(true)}>¿Olvidaste tu contraseña?</h6>
            <h6 onClick={() => setShowRegistr(true)}>Registrarse</h6>
        </>
    )
}
