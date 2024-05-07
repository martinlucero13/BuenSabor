import api from "../../../src/Services/api"

export default async function handler(req, res) {
    try {
        res.setHeader('Content-Type', 'application/json');
        const { data: getRubroIngredientes } = await api.get(`/rubroIngredientes/getRubroIngredientes`);
        res.statusCode = 200;
        res.json(getRubroIngredientes);
        res.end();
    } catch (error) {
        res.json(error)
        res.status(500).end
    }
}
