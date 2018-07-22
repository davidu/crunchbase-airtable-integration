import express from "express";
import bodyParser from "body-parser";
import path from "path";
import dataFetcher from "./routes/dataFetcher";
import circularJSON from "circular-json";
import { insertOneDocument, insertManyDocuments } from "./api/dataFetcher";
import axios from "axios";
const app = express();
//
// const handler = async() => {
//     // Get number of pages
//     let numberOfPages = (await axios.get("https://api.crunchbase.com/v3.1/organizations?user_key=93486c676d74b7c40832d060c61d682e&page=1&sort_order=created_at%20DESC&items_per_page=250")).data.data.paging.number_of_pages;
//     for (let a = 1 ; a <= numberOfPages; a++) {
//         let response = await axios.get(`https://api.crunchbase.com/v3.1/organizations?user_key=93486c676d74b7c40832d060c61d682e&page=${a}&sort_order=created_at%20DESC&items_per_page=250`).catch(() => {});
//         if (response) {
//             let organizations = [];
//             response.data.data.items.map(item => {
//                 organizations.push({
//                     uuid: item.uuid,
//                     name: item.properties.name,
//                     permalink: item.properties.permalink
//                 });
//             });
//             insertManyDocuments("organizations", organizations)
//         }
//         console.log("response #" + a);
//     }
// };

const PORT = process.env.PORT || 3345;
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "../src")));

// static files
app.use('/fonts', express.static(path.join(__dirname, '..', '/src/views/static/fonts')));
app.use('/svg', express.static(path.join(__dirname, '..', '/src/views/static/svg')));

// api
app.use('/data', dataFetcher);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../src/views', 'index.html'));
});

app.listen(PORT);