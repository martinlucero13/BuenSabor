import api from "../../../src/Services/api"

export default async function handler(req, res) {
    try {
        res.setHeader('Content-Type', 'application/json');
        const { data: getRubroProductos } = await api.get(`/rubroProductos/getRubroProductosMenu`);
        res.statusCode = 200;
        res.json(getRubroProductos);
        res.end();
    } catch (error) {
        res.json(error)
        res.status(500).end
    }
}
