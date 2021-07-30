//includes login register and logout routes
const { Router } = require('express');
const router = Router();
const sql = require('mysql');

router.post('/login', (req, res)=>{

    var connection = sql.createConnection({
        host:"localhost",
        user: "root",
        password: "",
        database: "ic-cadidate-db"
    });
    connection.connect();
    connection.query("SELECT id, password FROM `cadidate-data` WHERE email = ?", req.body.email, (err, result, fields)=>{
        if(err) res.send(err)
        else if(result.length == 0){  res.send('Your email and password do not match');}
        else{
            if(result[0].password === req.body.password){
                res.redirect(`/homepage/${result[0].id}`)
            }
            else{
                res.send('Your email and password do not match');
            }
        }
        //console.log('err is:'+err, 'result is:' +result, 'fields are:'+fields )
    });
    connection.end();
    //res.sendFile(path.join(__dirname, "views/login.html"));
})

router.post('/register', (req, res) => {
    var data = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    }

    var connection = sql.createConnection({
        host:"localhost",
        user: "root",
        password: "",
        database: "ic-cadidate-db"
    });
    connection.connect();
    connection.query("INSERT INTO `cadidate-data` SET ?", data, (err, result, fields)=>{
        if(err) res.send(err);
        console.warn("data inserted to the db");
    });
    connection.end();
    res.redirect('/login');
});

module.exports = router;