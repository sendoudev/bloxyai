const express = require('express');
const https = require('https');
const app = express();
app.use(express.json());

app.post('/generate', (req, res) => {
    const API_KEY = process.env.GOOGLE_API_KEY;
    const payload = JSON.stringify({
        contents: [{ parts: [{ text: "Génère uniquement du code Luau Roblox pour : " + req.body.message }] }]
    });

    const options = {
        hostname: 'generativelanguage.googleapis.com',
        path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    };

    const request = https.request(options, (response) => {
        let str = '';
        response.on('data', (chunk) => { str += chunk; });
        response.on('end', () => {
            try {
                const data = JSON.parse(str);
                // Vérification de la réponse Google
                if (data.candidates && data.candidates[0].content) {
                    res.json({ code: data.candidates[0].content.parts[0].text });
                } else {
                    res.status(500).json({ error: "Erreur API Google" });
                }
            } catch (e) {
                res.status(500).json({ error: "Erreur JSON" });
            }
        });
    });

    request.on('error', (err) => { res.status(500).json({ error: err.message }); });
    request.write(payload);
    request.end();
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log("SERVEUR OK");
    console.log("Clé détectée :", process.env.GOOGLE_API_KEY ? "OUI" : "NON");
});
app.listen(PORT, () => {
    console.log("SERVEUR OK");
    console.log("Clé détectée :", process.env.GOOGLE_API_KEY ? "OUI" : "NON");
});

