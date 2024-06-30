import DataTable from "react-data-table-component";
import Image from "next/image";

export const columnsExpand = [
  {
    cell: (row) => {
      return (
        <Image src={`/${row.imagen}.jpg`} alt="comida" width={50} height={50} />
      );
    },
    grow: 0.2,
  },
  {
    name: "Denominacion",
    selector: (row) => row.denominacion,
    center: true,
    wrap: true,
  },
  {
    name: "Cantidad",
    selector: (row) => row.cantidad,
    center: true,
    wrap: true,
  },
  {
    name: "Precio Unitario",
    selector: (row) => row.precioVenta,
    center: true,
    wrap: true,
    format: (row) => {
      const PRECIOVENTA = row.precioVenta;
      return "$" + PRECIOVENTA.toFixed(2);
    },
  },

  {
    name: "Precio Total",
    selector: (row) => row.precioVenta,
    right: true,
    format: (row) => {
      const PRECIOTOTAL = row.precioVenta * row.cantidad;
      return "$" + PRECIOTOTAL.toFixed(2);
    },
  },
];

export const noData = (
  <section
    style={{
      color: "red",
      height: "200px",
      alignItems: "center",
      fontWeight: "bold",
      fontSize: "40px",
    }}
  >
    No hay pedidos
  </section>
);

const customStylesExpand = {
  headCells: {
    style: {
      backgroundColor: "#cecaca",
    },
  },
};

export const paginationOptions = {
  rowsPerPageText: "Filas por Página",
  rangeSeparatorText: "de",
  selectAllRowsItems: true,
  selectAllRowsText: "Todos",
};

export function ExpandedComponent({ data }) {
  return (
    <div style={{ margin: "10px" }}>
      <DataTable
        columns={columnsExpand}
        data={data.articulo}
        customStyles={customStylesExpand}
      />
    </div>
  );
}
