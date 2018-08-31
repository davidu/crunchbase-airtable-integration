import express from "express";
import bodyParser from "body-parser";
import path from "path";
import dataFetcher from "./routes/dataFetcher";
import circularJSON from "circular-json";
import { insertOneDocument, insertManyDocuments } from "./api/dataFetcher";
import axios from "axios";
import keyRoutes from "./routes/keyRoutes";
const app = express();

const PORT = process.env.PORT || 3345;
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "../src")));

// static files
app.use('/fonts', express.static(path.join(__dirname, '..', '/src/views/static/fonts')));
app.use('/img', express.static(path.join(__dirname, '..', '/src/img')));

// api
app.use('/data', dataFetcher);
app.use('/key', keyRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../src/views', 'index.html'));
});

app.listen(PORT);