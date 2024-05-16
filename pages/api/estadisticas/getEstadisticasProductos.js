import api from "../../../src/Services/api"

export default async function handler(req, res) {
    try {
        res.setHeader('Content-Type', 'application/json');
        const { dateDesde } = req.body;
        const { dateHasta } = req.body;
        const { data: getEstadisticasProductos } = await api.get(`/estadisticas/getEstadisticasProductos?dateDesde=${dateDesde}&dateHasta=${dateHasta}`);
        res.statusCode = 200;
        res.json(getEstadisticasProductos);
        res.end();
    } catch (error) {
        res.json(error)
        res.status(500).end
    }
}
