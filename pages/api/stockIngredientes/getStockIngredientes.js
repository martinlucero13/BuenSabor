import api from "../../../src/Services/api"

export default async function handler(req, res) {
    try {
        res.setHeader('Content-Type', 'application/json');
        const { data: getStockIngredientes } = await api.get(`/StockIngredientes/getStockIngredientes`);
        res.statusCode = 200;
        res.json(getStockIngredientes);
        res.end();
    } catch (error) {
        res.json(error)
        res.status(500).end
    }
}
