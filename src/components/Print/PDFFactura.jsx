import jsPDF from "jspdf";
import dayjs from "dayjs";

export function PDFFactura(row) {
  const fechaImpresion = dayjs().format("DD/MM/YYYY");
  const tipoDoc = "IMPRESIÓN FACTURA A CLIENTES";
  let numViaticos = 0;

  // const codigoBarras = "";
  const heightPage = 297;
  /* const widthPage = 215.9; */
  const heigthHeader = 65;
  const heigthFooter = 50;
  const footer = heightPage - heigthFooter;
  let posicion = heigthHeader;

  const doc = new jsPDF("p", "mm", "a4");

  function getDiseño() {
    doc.roundedRect(5, 8, 203, 285, 3, 3, "D"); //  Black square with rounded corners
    doc.setFont("courier", "normal");
  }

  getDiseño();
  getHeader();
  getFooter();
  getSection();

  /* doc.roundedRect(5, 8, 203, 285, 3, 3, 'D'); //  Black square with rounded corners
    //DATOS DETALLE
    doc.setFont("courier", "normal"); */

  //FOOTER

  function getFooter() {
    doc.setFont("courier", "normal");
    doc.setFontSize(10);
  }

  function getHeader() {
    //CARGO IMAGENES
    doc.addImage("/buensabor1.png", "PNG", 20, 10, 40, 40);

    //aplico código
    doc.setFont("courier", "bold");
    doc.setFontSize(12);
    doc.text(`${tipoDoc}`, 80, 16);

    const FECHA = dayjs(row.FECHA).format("DD/MM/YYYY");
    //Datos
    doc.setFont("courier", "normal");
    doc.setFontSize(8);
    doc.text(`Fecha:         ${fechaImpresion}`, 160, 17);
    doc.text(`Numero Secuencial:  ${row.nrofac}`, 160, 23);
    doc.text(`Fecha Pedido: ${FECHA}`, 80, 25);
    doc.text(`Descuento Aplicado: $ ${row.DESCUENTO}`, 80, 30);

    doc.text(`Total Pedido: $ ${row.TOTALPEDIDO}`, 80, 35);

    doc.setFontSize(8);
    doc.setFont("courier", "bold");

    //Datos Cabecera
    /*doc.setFillColor(205, 205, 205);
        doc.rect(5, 40, 203, 5, 'F');
        doc.text(`DATOS`, 10, 43);
        doc.text(`Hora Inicio: ${row.HORAINICIO}`, 10, 55)
        doc.text(`Hora Fin: ${row.HORAFIN}`, 100, 55)
        doc.text(`Km Inicio: ${row.KMINICIO}`, 10, 60);
        doc.text(`Km Fin: ${row.KMFIN}`, 100, 60)
        doc.text(`Km Totales: ${row.TOTALPEDIDO}`, 10, 65)*/
  }

  function getSection() {
    //section DETALLE
    doc.setFillColor(205, 205, 205);
    doc.rect(5, posicion + 2, 203, 5, "F");
    doc.setFont("courier", "bold");
    doc.setFontSize(8);

    posicion += 5; //70
    doc.text(`Cantidad`, 13, posicion);
    doc.text(`Denominacion`, 53, posicion);
    doc.text(`Precio Venta`, 139, posicion);

    for (let i = 0; i < row.articulo.length; i++) {
      posicion += 5; //75
      doc.text(`${row.articulo[i].cantidad}`, 13, posicion);
      doc.text(`${row.articulo[i].denominacion}`, 53, posicion);
      doc.text(`$ ${row.articulo[i].precioVenta}`, 139, posicion);
      //Verificar si se necesita pagina nueva
      if (posicion + 20 >= footer) {
        pageBreak();
      }
    }
  }

  function pageBreak() {
    numViaticos += 1;
    doc.addPage();
    posicion = heigthHeader + 5;
    getDiseño();
    getHeader();
    getSection();
    getFooter();
    posicion += 5;
  }

  // PAGE NUMBERING
  // Add Page number at bottom-right
  // Get the number of pages
  const pageCount = doc.getNumberOfPages();

  // For each page, print the page number and the total pages
  for (var i = 1; i <= pageCount; i++) {
    // Go to page i
    doc.setPage(i);
    //Print Page 1 of 4 for example
    doc.text(`Página ${i} de ${pageCount}`, 180, footer + 35, null, "right");
  }

  function searchSpace(string) {
    let lengthString = 100;
    for (lengthString; lengthString > 90; lengthString--) {
      const search = string.substr(lengthString, lengthString);
      if (search.indexOf(" ") === 1) {
        break;
      }
    }
    return lengthString + 1;
  }

  return doc;
}
