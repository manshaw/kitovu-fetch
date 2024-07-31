require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { toCamelCase, fetchToken, sendResponse } = require('./helper.js');
const credential = JSON.parse(Buffer.from(process.env.FIREBASE_ADMIN_CREDENTIALS, "base64").toString());
initializeApp({ credential: cert(credential) });
const db = getFirestore();
const app = express()
app.use(cors())
const port = 3000

app.get('/token', async (req, res) => {
    res.send(await fetchToken())
})

app.get('/fetch_by_crop/:crop', async (req, res) => {
    const { crop } = req.params;
    var response = []
    const snapshot = await db.collection('farms').where('crop', '==', await toCamelCase(crop)).get();
    if (snapshot.empty) {
        res.send(await sendResponse(response))
        return
    }
    snapshot.forEach(doc => {
        response.push(doc.data())
    });
    res.send(await sendResponse(response))
})

app.get('/fetch_by_city/:city', async (req, res) => {
    const { city } = req.params;
    var response = []
    const snapshot = await db.collection('farms').where('city', '==', city.toLowerCase()).get();
    if (snapshot.empty) {
        res.send(await sendResponse(response))
        return
    }
    snapshot.forEach(doc => {
        response.push(doc.data())
    });
    res.send(await sendResponse(response))
})

app.get('/fetch_by_country/:country', async (req, res) => {
    const { country } = req.params;
    var response = []
    const snapshot = await db.collection('farms').where('country', '==', country.toLowerCase()).get();
    if (snapshot.empty) {
        res.send(await sendResponse(response))
        return
    }
    snapshot.forEach(doc => {
        response.push(doc.data())
    });
    res.send(await sendResponse(response))
})

app.get('/fetch_by_state/:state', async (req, res) => {
    const { state } = req.params;
    var response = []
    const snapshot = await db.collection('farms').where('state', '==', await toCamelCase(state)).get();
    if (snapshot.empty) {
        res.send(await sendResponse(response))
        return
    }
    snapshot.forEach(doc => {
        response.push(doc.data())
    });
    res.send(await sendResponse(response))
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})