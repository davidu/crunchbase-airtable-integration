import * as dataFetcherActions from "./../api/dataFetcher";
import express from "express";
import fs from "fs";
import path from "path"

let filename = 'server/user_key';

let keyRoutes = express.Router();
keyRoutes.get('/airtable', (req, res)  => {
    fs.readFile(filename + "_airtable.txt", function(err, content) {
        res.send(content);
    });
});

keyRoutes.get('/crunchbase', (req, res)  => {
    fs.readFile(filename + "_crunchbase.txt", function(err, content) {
        res.send(content);
    });
});

keyRoutes.put('/update', async (req, res)  => {
    let {key, framework} = req.body;
    console.log(key);
    fs.writeFile(filename + "_" + framework + ".txt", key, function(err) {
        err || console.log('Data replaced \n', key);
        res.status(200).send("key is updated!");
    });
});

export default keyRoutes;