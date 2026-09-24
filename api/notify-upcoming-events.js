const admin = require('firebase-admin');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
    });
}

function tomorrowStr() {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() + 1);
    return d.toISOString().split('T')[0];
}

// Disparado 1x/dia pelo Vercel Cron (ver vercel.json). Avisa sobre eventos
// cadastrados no admin (colecao "events") que comecam amanha.
module.exports = async (req, res) => {
    try {
        const db = admin.firestore();
        const tomorrow = tomorrowStr();

        const eventsSnap = await db.collection('events').where('startDate', '==', tomorrow).get();
        if (eventsSnap.empty) return res.status(200).json({ notified: 0 });

        const subsSnap = await db.collection('pushSubscriptions').get();
        const tokens = subsSnap.docs.map(d => d.id);
        if (tokens.length === 0) return res.status(200).json({ notified: 0 });

        let sent = 0;
        for (const eventDoc of eventsSnap.docs) {
            const evt = eventDoc.data();
            const response = await admin.messaging().sendEachForMulticast({
                data: { title: 'Evento amanhã no calendário letivo', body: evt.title, url: '/calendario.html' },
                tokens,
                webpush: { headers: { Urgency: 'high' } }
            });
            sent += response.successCount;
        }

        res.status(200).json({ notified: sent });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Erro ao verificar eventos' });
    }
};
