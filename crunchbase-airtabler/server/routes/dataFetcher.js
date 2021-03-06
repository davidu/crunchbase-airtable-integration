import * as dataFetcherActions from "./../api/dataFetcher";
import express from "express";

let Airtable = require('airtable');
let base = new Airtable({apiKey: 'key1rk5YNnkac6Iv8'}).base('appoxnXQ7asCyquMr');

const COLLECTION = "organizations";
let dataFetcher = express.Router();
dataFetcher.post('/row', async (req, res) => {
    let {type} = req.body;
    base(type).create(req.body.data, function (err, record) {
        if (err) {
            console.error(err);
            return;
        }
        res.send("ok");
    });
});

dataFetcher.get('/organizations/:permalink', async (req, res) => {
    dataFetcherActions.findDocument(COLLECTION, {}, res);
});

export default dataFetcher;