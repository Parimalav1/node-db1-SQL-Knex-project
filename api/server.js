const express = require("express");

const accountsRouter = require("../accounts-router.js");

const server = express();

server.use(express.json());

server.use("/api/accounts", accountsRouter);

server.get("/", (req, res) => {
  res.status(200).json({ api: "Hello" });
});

module.exports = server;
