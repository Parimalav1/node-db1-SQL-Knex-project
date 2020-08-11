const express = require('express');

const accountsDb = require('./data/dbConfig');
const { count } = require('./data/dbConfig');
const router = express.Router();

router.get("/", (req, res) => {
    accountsDb.select('*')
        .from('accounts')
        .then(accounts => {
            res.status(200).json({ data: accounts });
        })
        .catch(error => {
            console.log(error);

            res.status(500).json({ error: error.message });
        });
});

router.get("/:id", (req, res) => {
    const accountsId = req.params.id;
    // accountsDb.select('*')
    // .from('accounts')
    accountsDb("accounts")
        .where({ id: accountsId })
        .then(account => {
            res.status(200).json(account);
        })
        .catch(error => {
            console.log(error);

            res.status(500).json({ error: error.message });
        });
});

router.post("/", (req, res) => {
    const account = req.body;

    accountsDb("accounts")
        .insert(account)
        .returning("id") // do not exclude this line if you plan to support PostgreSQL
        .then(id => {
            // the warning: ".returning() is not supported by sqlite3 and will not have any effect."
            // can safely be ignored when using SQLite
            // it will go away when using PostgreSQL
            res.status(201).json({ inserted: id });
        })
        .catch(error => {
            console.log(error);

            res.status(500).json({ error: error.message });
        });
});

router.put("/:id", (req, res) => {
    const editAccount = req.body;
    const accountsId = req.params.id;
    accountsDb("accounts")
        .where({ id: accountsId })
        .update(editAccount)
        .then(count => {
            if(count) {
                res.status(200).json(editAccount);
            } else {
                res.status(404).json({ message: "not found" });
            }  
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error: error.message });
        });
});

router.delete("/:id", (req, res) => {
    const accountsId = req.params.id;
    // accountsDb.select('*')
    // .from('accounts')
    accountsDb("accounts")
        .where({ id: accountsId })
        .del()
        .then(count => {
            if(count) {
                res.status(200).json(count);
            } else {
                res.status(404).json({ message: "not found" });
            }  
        })
        .catch(error => {
            console.log(error);

            res.status(500).json({ error: error.message });
        });
});

module.exports = router;