const qs = require('qs')
const axios = require('axios')

async function toCamelCase(value) {
    return await value[0].toUpperCase() + value.substring(1, value.length);
}

async function sendResponse(data) {
    return data.length ? {
        error: false,
        message: "Success",
        data
    } : {
        error: true,
        message: "Data not found",
        data: []
    }
}

async function fetchToken() {

    const instance = axios.create({
        baseURL: "https://services.sentinel-hub.com"
    })

    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        }
    }

    const body = qs.stringify({
        client_id: process.env.SENTINEL_CLIENT_ID,
        client_secret: process.env.SENTINEL_CLIENT_SECRET,
        grant_type: "client_credentials"
    })

    const result = await instance.post("/auth/realms/main/protocol/openid-connect/token", body, config);
    return {
        token: result.data.access_token,
        expires_in: result.data.expires_in
    }
}

module.exports = {
    toCamelCase,
    sendResponse,
    fetchToken,
  };