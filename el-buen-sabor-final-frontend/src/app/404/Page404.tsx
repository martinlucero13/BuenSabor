import "./Page404.css";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { EmojiFrownFill } from "react-bootstrap-icons";

function Page404(): JSX.Element {
    return (
        <section className="py-3">
            <h1 className="text-center">
                Vaya
            </h1>
            
            <p className="zoom-area">
                No hemos podido encontrar la página que buscas.
            </p>

            <p className="text-center">
                <EmojiFrownFill size={30} />
            </p>
            
            <div className="error-container">
                <span>
                    <span>4</span>
                </span>
                <span>
                    0
                </span>
                <span>
                    <span>4</span>
                </span>
            </div>
            
            <div className="text-center">
                <Link to="/" className="d-inline-block">
                    <Button variant="light">
                        Inicio
                    </Button>
                </Link>
            </div>
        </section>
    );
}

export default Page404;