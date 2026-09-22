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

        console.log(`[send-notification] ${tokens.length} token(s) inscrito(s) encontrados.`);
        if (tokens.length === 0) return res.status(200).json({ sent: 0, failed: 0 });

        // Mensagem só com "data" (sem "notification"): assim quem decide exibir a
        // notificação é o nosso Service Worker (firebase-messaging-sw.js), e não o
        // SDK do Firebase automaticamente — evita a notificação aparecer duplicada.
        const response = await admin.messaging().sendEachForMulticast({
            data: { title, body, url: url || '/' },
            tokens,
            // Prioridade alta via Web Push: sem isso, mensagens "data-only" podem ser
            // seguradas pelo Doze mode do Android por bastante tempo antes de entregar.
            webpush: { headers: { Urgency: 'high' } }
        });

        console.log(`[send-notification] sucesso=${response.successCount} falha=${response.failureCount}`);

        const invalidTokens = [];
        response.responses.forEach((r, i) => {
            const code = r.error?.code;
            if (!r.success) {
                console.error(`[send-notification] token ${tokens[i].slice(0, 12)}... falhou: ${code} - ${r.error?.message}`);
            }
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
