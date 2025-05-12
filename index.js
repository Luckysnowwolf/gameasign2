import express from "express";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

 const app = express();
 const { Pool } = pg;


 const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
 });

 app.get('/', async (req, res) => {
    try {
        const result = pool.query("SELECT * FROM game");
        res.json(result.rows);
    } catch (err) {
        res.status(500).send(err.message);
        
    }
 });

 app.post("/game", (req,res) => {
    const {name, game, score} = req.body;
    try {
        const result = pool.query(
            "INSERT INTO game (name, game, score) VALUES ($1,$2,$3 RETURNING *",
            [name, game, score]
        );
        res.json(result.row[0]);
    } catch (err) {
       res.status(500).send(err.message) 
    }
 });

 app.put("/game/:id", async (req, res) => {
    const { id } = req.params;
    const { name, game, score } = req.body;
    try {
        const result = await pool.query(
            "UPDATE game SET name = $1, game = $2, score = $3 WHERE id = $4 RETURNING *",
            [name, game, score, id]
        );
        if (result.rows.lenght === 0) {
            return res.status(404).send("game not found");
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
 });

 app.delete("/game/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            "DELETE FROM game WHERE id = $1 RETURNING *",
            [id]);
        if (result.rows.lenght === 0) {
            return res.status(404).send("game not found");
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
 });



 app.listen(3000, (req, res) => {
    console.log("server is running")
 });