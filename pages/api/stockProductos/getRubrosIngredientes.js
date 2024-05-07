import api from "../../../src/Services/api"

export default async function handler(req, res) {
    try {
        res.setHeader('Content-Type', 'application/json');
        const { data: getStockProductos } = await api.get(`/StockProductos/getRubrosIngredientes`);
        res.statusCode = 200;
        res.json(getStockProductos);
        res.end();
    } catch (error) {
        res.json(error)
        res.status(500).end
    }
}
