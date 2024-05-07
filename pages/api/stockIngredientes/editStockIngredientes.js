import api from "../../../src/Services/api"

export default async function handler(req, res) {
    try {
        res.setHeader('Content-Type', 'application/json');
        const { fromData } = req.body;
        const { data: Ingredientes } = await api.post(`/StockIngredientes/editStockIngredientes`, fromData);
        res.statusCode = 200;
        res.json(Ingredientes);
        res.end();
    } catch (error) {
        res.json(error)
        res.status(500).end
    }
}
