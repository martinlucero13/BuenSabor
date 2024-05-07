import api from "../../../src/Services/api"

export default async function handler(req, res) {
    try {
        res.setHeader('Content-Type', 'application/json');
        const { rubro } = req.query;
        const { data: getIngredientes } = await api.get(`/StockProductos/getIngredientes?rubro=${rubro}`);
        res.statusCode = 200;
        res.json(getIngredientes);
        res.end();
    } catch (error) {
        res.json(error)
        res.status(500).end
    }
}
