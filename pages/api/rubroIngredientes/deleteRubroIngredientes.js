import api from "../../../src/Services/api"

export default async function handler(req, res) {
    try {
        res.setHeader('Content-Type', 'application/json');
        const { idRubro } = req.body;
        const { data: Ingredientes } = await api.put(`/rubroIngredientes/deleteRubroIngredientes?idRubro=${idRubro}`);
        res.statusCode = 200;
        res.json(Ingredientes);
        res.end();
    } catch (error) {
        res.json(error)
        res.status(500).end
    }
}
