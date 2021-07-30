//include all get requests , only related to pages
const { resolveSoa } = require('dns');
const {Router} = require('express');
const router = Router();
const sql = require('mysql');
const path = require('path');

//landing page after loging in
router.get('/homepage/:id', (req, res) =>{
    const adminId = req.params.id;
    var connection = sql.createConnection({
        host:"localhost",
        user: "root",
        password: "",
        database: "ic-cadidate-db"
    });
    connection.connect();
    connection.query("SELECT id, name, joined, assigned, userId FROM `applied`", (err, result, fields)=>{
        if(err) res.send(err)
        else{
            res.render(path.join(__dirname, "../../views/admin/adminHomepage"), {result, adminId});
        }
    });
    connection.end();
});

router.get('/:adminId/viewprofile/:userId', (req, res) =>{
    const { adminId, userId } = req.params;
    var connection = sql.createConnection({
        host:"localhost",
        user: "root",
        password: "",
        database: "ic-cadidate-db"
    });
    connection.connect();
    connection.query('SELECT name, email FROM `cadidate-data` WHERE Id = ?', userId, (err, result, fields) =>{
        if(err) res.send(err);
        else if(result.length === 0){ res.send('err'); console.log(result)}
        else{
            console.log(result)
            res.render(path.join(__dirname, "../../views/admin/userViewProfile"), {result, adminId, userId})
        }
    })
    connection.end();
})

router.get('/login', (req, res)=>{
    res.sendFile(path.join(__dirname, "../../views/admin/adminLogin.html"));
})

//create a admin view profile page to see teh details fo selected user
//display name resume and other qualifications

module.exports = router;
