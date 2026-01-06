const express = require('express');
const https = require('https');
const app = express();
app.use(express.json());

app.post('/generate', (req, res) => {
    const API_KEY = process.env.GOOGLE_API_KEY;
    const payload = JSON.stringify({
        contents: [{ parts: [{ text: "Génère du code Luau Roblox pour : " + (req.body.message || "test") }] }]
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
                const reply = data.candidates[0].content.parts[0].text;
                res.json({ code: reply });
            } catch (e) { res.status(500).json({ error: "Erreur Google" }); }
        });
    });
    request.write(payload);
    request.end();
});

app.listen(process.env.PORT || 10000, () => console.log("SERVEUR OK - CLÉ: OUI"));
