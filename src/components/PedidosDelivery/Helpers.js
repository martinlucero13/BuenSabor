
export function getDataFormat(dataTable) {
    const cabeceraOrdenada = dataTable.sort((a, b) => b.idPedido - a.idPedido);

    let idPedido = 0
    const cabeceraMap = cabeceraOrdenada.map(data => {
        if (data.idPedido !== idPedido) {
            idPedido = data.idPedido
            return data
        }
    })
    const cabeceraFiltro = cabeceraMap.filter((dataMap) => dataMap !== undefined)
    const cabecera = cabeceraFiltro.map(data => {
        return {
            idPedido: data.idPedido,
            NOMBRE: data.nombre + ' ' + data.apellido,
            TELEFONO: data.telefono,
            DOMICILIO: data.calle + ', Nro:' + data.nrocalle,
            FECHA: data.fecha,
            LOCALIDAD: data.localidad,
            HORAFIN: data.horaEstimadaFin,
            RETIRO: data.tipoEnvio,
            TOTALPEDIDO: data.totalCosto,
            FORMAPAGO: data.formaPago,
            ESTADO: data.estado,
            PAGADO: data.pagado,
            CANCELAR: data.CANCELAR,
            PENDIENTE: data.PENDIENTE,
            FACTURA: data.FACTURA,
        }
    })

    const getGroupDetailsMap = (details) => {
        const detailsMap = {};

        details.forEach((detail) => {
            if (!detailsMap[detail.idPedido]) {
                detailsMap[detail.idPedido] = [detail];
            } else {
                detailsMap[detail.idPedido].push(detail);
            }
        })
        return detailsMap
    }

    const detalle = getGroupDetailsMap(dataTable)

    return cabecera.map((row) => {
        return {
            ...row,
            articulo: detalle[row.idPedido]
        }
    })
}
