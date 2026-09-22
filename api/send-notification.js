const admin = require('firebase-admin');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
    });
}

module.exports = async (req, res) => {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    const { title, body, url } = req.body || {};
    if (!title || !body) return res.status(400).json({ error: 'title e body são obrigatórios' });

    try {
        const db = admin.firestore();
        const snap = await db.collection('pushSubscriptions').get();
        const tokens = snap.docs.map(d => d.id);

        if (tokens.length === 0) return res.status(200).json({ sent: 0, failed: 0 });

        const response = await admin.messaging().sendEachForMulticast({
            notification: { title, body },
            data: { url: url || '/' },
            tokens
        });

        const invalidTokens = [];
        response.responses.forEach((r, i) => {
            const code = r.error?.code;
            if (!r.success && (code === 'messaging/invalid-registration-token' || code === 'messaging/registration-token-not-registered')) {
                invalidTokens.push(tokens[i]);
            }
        });
        await Promise.all(invalidTokens.map(t => db.collection('pushSubscriptions').doc(t).delete()));

        res.status(200).json({ sent: response.successCount, failed: response.failureCount });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Erro ao enviar notificações' });
    }
};
