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

// app.get('/fetch_by_crop/:crop', async (req, res) => {
//     const { crop } = req.params;
//     var response = []
//     const snapshot = await db.collection('farms').where('crop', '==', await toCamelCase(crop)).get();
//     if (snapshot.empty) {
//         res.send(await sendResponse(response))
//         return
//     }
//     snapshot.forEach(doc => {
//         response.push(doc.data())
//     });
//     res.send(await sendResponse(response))
// })

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


app.get('/fetch_by_name/:name', async (req, res) => {
    const { name } = req.params;
    var response = []
    const snapshot = await db.collection('users').where('name', '==', name).get();
    if (!snapshot.empty) {
        snapshot.forEach(user => response.push({ ...user.data(), id: user.id }))
        await Promise.all(response.map(async (user, index) => {
            const farms = []
            const farmers = []
            const snapshot = await db.collection('farms').where('userId', '==', await user.id).get();
            const snapshot2 = await db.collection('farmers').where('userId', '==', await user.id).get();
            snapshot.forEach(farm => farms.push({ ...farm.data(), id: farm.id }))
            snapshot2.forEach(farmer => farmers.push({ ...farmer.data(), id: farmer.id }))
            response[index]['farms'] = farms;
            response[index]['farmers'] = farmers;
        }))

    }
    res.send(await sendResponse(await response))
})


app.get('/fetch_by_gender/:gender', async (req, res) => {
    const { gender } = req.params;
    var response = []
    const snapshot = await db.collection('users').where('gender', '==', await toCamelCase(gender)).get();
    if (!snapshot.empty) {
        snapshot.forEach(user => response.push({ ...user.data(), id: user.id }))
        await Promise.all(response.map(async (user, index) => {
            const farms = []
            const farmers = []
            const snapshot = await db.collection('farms').where('userId', '==', await user.id).get();
            const snapshot2 = await db.collection('farmers').where('userId', '==', await user.id).get();
            snapshot.forEach(farm => farms.push({ ...farm.data(), id: farm.id }))
            snapshot2.forEach(farmer => farmers.push({ ...farmer.data(), id: farmer.id }))
            response[index]['farms'] = farms;
            response[index]['farmers'] = farmers;
        }))

    }
    res.send(await sendResponse(await response))
})



app.get('/fetch_by_smaller_than_size/:size', async (req, res) => {
    const { size } = req.params;
    var response = []
    const snapshot = await db.collection('users').get();
    if (!snapshot.empty) {
        snapshot.forEach(user => response.push({ ...user.data(), id: user.id }))
        await Promise.all(response.map(async (user, index) => {
            const farms = []
            const farmers = []
            const snapshot = await db.collection('farms').where('userId', '==', await user.id).get();
            const snapshot2 = await db.collection('farmers').where('userId', '==', await user.id).get();
            snapshot.forEach((farm) => {
                if (parseFloat(farm.data().size) < parseFloat(size)) farms.push({ ...farm.data(), id: farm.id })
            })
            snapshot2.forEach(farmer => farmers.push({ ...farmer.data(), id: farmer.id }))
            response[index]['farms'] = farms;
            response[index]['farmers'] = farmers;
        }))

    }
    const final_resposne = response.map((item) => {
        return item.farms.length > 0 ? item : ''
    }).filter(Boolean)
    res.send(await sendResponse(final_resposne))
})


app.get('/fetch_by_greater_than_size/:size', async (req, res) => {
    const { size } = req.params;
    var response = []
    const snapshot = await db.collection('users').get();
    if (!snapshot.empty) {
        snapshot.forEach(user => response.push({ ...user.data(), id: user.id }))
        await Promise.all(response.map(async (user, index) => {
            const farms = []
            const farmers = []
            const snapshot = await db.collection('farms').where('userId', '==', await user.id).get();
            const snapshot2 = await db.collection('farmers').where('userId', '==', await user.id).get();
            snapshot.forEach((farm) => {
                if (parseFloat(farm.data().size) > parseFloat(size)) farms.push({ ...farm.data(), id: farm.id })
            })
            snapshot2.forEach(farmer => farmers.push({ ...farmer.data(), id: farmer.id }))
            response[index]['farms'] = farms;
            response[index]['farmers'] = farmers;
        }))

    }
    const final_resposne = response.map((item) => {
        return item.farms.length > 0 ? item : ''
    }).filter(Boolean)
    res.send(await sendResponse(final_resposne))
})

app.get('/fetch_by_crop/:crop', async (req, res) => {
    const { crop } = req.params;
    var response = []
    const snapshot = await db.collection('users').get();
    if (!snapshot.empty) {
        snapshot.forEach(user => response.push({ ...user.data(), id: user.id }))
        await Promise.all(response.map(async (user, index) => {
            const farms = []
            const farmers = []
            const snapshot = await db.collection('farms').where('userId', '==', await user.id).get();
            const snapshot2 = await db.collection('farmers').where('userId', '==', await user.id).get();
            snapshot.forEach((farm) => {
                if (farm.data().crop.toLowerCase() == crop.toLowerCase()) farms.push({ ...farm.data(), id: farm.id })
            })
            snapshot2.forEach(farmer => farmers.push({ ...farmer.data(), id: farmer.id }))
            response[index]['farms'] = farms;
            response[index]['farmers'] = farmers;
        }))

    }
    const final_resposne = response.map((item) => {
        return item.farms.length > 0 ? item : ''
    }).filter(Boolean)
    res.send(await sendResponse(final_resposne))
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

//env updated