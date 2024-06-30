import { Search } from "react-bootstrap-icons";
import MarcasLatetal from "./MarcasLateral";

export default function ListaMarcaVinos({
  handleFilter,
  setMarca,
  marcas,
  filter,
  filterPrecio,
  precioOrden,
  loading,
}) {
  return (
    <>
      <article>
        <form onSubmit={(e) => e.preventDefault()}>
          <Search
            style={{
              color: "#191919",
              position: "absolute",
              width: "20px",
              height: "20px",
              left: "19px",
              top: "4.5%",
              transform: "translateY(-50 %)",
              marginTop: "4px",
            }}
          />
          <input
            value={filter}
            type="text"
            placeholder="BUSCAR"
            onChange={handleFilter}
          />
        </form>
        <select onChange={filterPrecio} value={precioOrden}>
          <option disabled value="">
            ORDENAR POR
          </option>
          <option value="menor">MENOR PRECIO</option>
          <option value="mayor">MAYOR PRECIO</option>
        </select>
        <h5>PRODUCTOS</h5>
        <section>
          {marcas.map((marcaUnica, index) => (
            <MarcasLatetal
              key={index}
              marcaUnica={marcaUnica}
              setMarca={setMarca}
              loading={loading}
            />
          ))}
        </section>
      </article>
      <style jsx>{`
        article {
          display: flex;
          flex-direction: column;
          position: fixed;
          width: 200px;
          margin: 10px 20px;
          padding: 5px;
        }
        main article form {
          margin: 0;
          padding: 0;
          width: 100%;
          justify-content: start;
          position: relative;
        }
        article p:hover {
          text-decoration: underline;
          color: rgb(138, 13, 111);
          cursor: pointer;
        }
        article form input {
          margin-bottom: 10px;
          border: 1px solid #e6e6e6;
          border-radius: 10px;
          width: 200px;
          padding: 10px 10px 10px 35px;
        }
        article input:focus {
          border: 1px solid #e6e6e6;
          outline: none;
        }
        select {
          margin-bottom: 10px;
          border: 1px solid #e6e6e6;
          border-radius: 10px;
          width: 200px;
          padding: 5px;
          text-transform: uppercase;
        }
        section {
          display: flex;
          flex-direction: column;
        }
        @media screen and (max-width: 650px) {
          article {
            position: static;
          }
        }
      `}</style>
    </>
  );
}
