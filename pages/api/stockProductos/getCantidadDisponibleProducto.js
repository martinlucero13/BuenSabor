import api from "../../../src/Services/api"

export default async function handler(req, res) {
    try {
        res.setHeader('Content-Type', 'application/json');
        const { idArticuloManufacturado } = req.body;
        const { data: getCantidadDisponible } = await api.get(`/StockProductos/getCantidadDisponibleProducto?idArticuloManufacturado=${idArticuloManufacturado}`);
        res.statusCode = 200;
        res.json(getCantidadDisponible);
        res.end();
    } catch (error) {
        res.json(error)
        res.status(500).end
    }
}
