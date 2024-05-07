import api from "../../../src/Services/api"

export default async function handler(req, res) {
    try {
        res.setHeader('Content-Type', 'application/json');
        const { marca, retira } = req.body;
        if (marca === 'all') {
            const { data: productos } = await api.get(`/Productos/getProductos`);
            res.statusCode = 200;
            res.json(productos);
            res.end();
        } else {
            const { data: vinos } = await api.get(`/Productos/getProductosPorMarca?marca=${marca}`);
            res.statusCode = 200;
            res.json(vinos);
            res.end();
        }
    } catch (error) {
        res.json(error)
        res.status(500).end
    }
}