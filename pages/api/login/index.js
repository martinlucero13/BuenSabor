import api from "../../../src/Services/api"

export default async function handler(req, res) {
    try {
        res.setHeader('Content-Type', 'application/json');
        const { username, password } = req.body;
        const pagina = 'Colaboradores'
        const { data: token } = await api.post('/login', { username, password, pagina });
        res.statusCode = 200;
        res.json(token);
        res.end();
    } catch (error) {
        res.json(error)
        res.status(500).end
    }
}

