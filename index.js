import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import 'dotenv/config'

const app = express();
const port = 3000;

const db = new pg.Client({
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: 5432
})

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

let countries = [];
db.connect();
db.query('SELECT * FROM countries', (err, res) => {
    if (err) {
        console.error(`Error on fetching the data ${err.stack}`);
    } else {
        countries = res.rows;
    }
    db.end();
})

app.get("/", (req, res) => {
    let country = currentCountry('India');
    res.render("index.ejs", { data: country, countries: countries });
})

app.post("/submit", (req, res) => {
    let country = currentCountry(req.body.country.toLowerCase());
    res.render("index.ejs", { data: country, countries: countries });
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})

function currentCountry(country) {
    return countries.find(c => c.name.toLowerCase() === country.toLowerCase());
}