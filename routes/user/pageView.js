//include all get requests , only related to pages
const {Router} = require('express');
const router = Router();
const sql = require('mysql');
const path = require('path');
const { resourceUsage } = require('process');

//landing page after loging in
router.get('/homepage/:id', (req, res) =>{
    var connection = sql.createConnection({
        host:"localhost",
        user: "root",
        password: "",
        database: "ic-cadidate-db"
    });
    connection.connect();
    connection.query("SELECT name, joined, assigned, courseName FROM `applied`", (err, result, fields)=>{
        if(err) res.send(err)
        else{
            res.render(path.join(__dirname, "../../views/user/homepage"), {result, id: req.params.id});
            }
        });
    connection.end();
});

router.get('/myProfile/:id', (req, res) =>{
    const {id} = req.params;
    var connection = sql.createConnection({
        host:"localhost",
        user: "root",
        password: "",
        database: "ic-cadidate-db"
    });
    connection.connect();
    connection.query('SELECT name, email FROM `cadidate-data` WHERE Id = ?', id, (err, result, fields) =>{
        if(err) res.send(err);
        else{
            console.log(result)
            res.render(path.join(__dirname, "../../views/user/myProfile"), {result, id})
        }
    })
    connection.end();
    
})

router.get('/applynow/:id', (req, res) =>{
    var connection = sql.createConnection({
        host:"localhost",
        user: "root",
        password: "",
        database: "ic-cadidate-db"
    });
    connection.connect();
    connection.query("SELECT id, title, remaining, description FROM `cources`", (err, result, fields)=>{
        if(err) res.send(err)
        else{
            res.render(path.join(__dirname, "../../views/user/applynow"), {result, id: req.params.id});
            }
        });
    connection.end();
})

router.get('/applynow/:id/join/:courseId', (req, res) =>{
    var connection = sql.createConnection({
        host:"localhost",
        user: "root",
        password: "",
        database: "ic-cadidate-db"
    });
    connection.connect();
    connection.query("SELECT id, title, remaining, description FROM `cources` WHERE id = ?", req.params.courseId, (err, result, fields)=>{
        if(err) res.send(err)
        else{
            res.render(path.join(__dirname, "../../views/user/joinConfirmation"), {result, id: req.params.id});
            }
        });
    connection.end();
})

router.post('/join', (req, res)=>{
    const {userId, courseId, courseName} = req.body;
    var connection = sql.createConnection({
        host:"localhost",
        user: "root",
        password: "",
        database: "ic-cadidate-db"
    });
    connection.connect();
    connection.query("SELECT * FROM `applied` WHERE userId = ?", userId, (err, result0, fields) =>{
        if(err) res.send(err)
        else if(!result0){
            connection.query("SELECT * FROM `cadidate-data` WHERE Id = ?",userId ,(err, result1, fields)=>{
                if(err) res.send(err)
                else{
                    const name = result1[0].name;
                    console.log({name,joined: new Date(), courseId, courseName})
                    connection.query('INSERT INTO `applied` SET ?',{name, joined: new Date(), assigned: 0, courseId, courseName, userId}, (err, result2, fields) =>{
                        console.log('entered second stage')
                        if(err) res.send(err)
                        else{
                            console.log('new field inserted in to the table')
                            res.redirect(`/homepage/${userId}`);
                            connection.end();
                        }
                    })
                }
            })
        }
        else{
            res.redirect(`/homepage/${userId}`);
        }
    })
})

router.get("/viewstatus/:id", (req, res) =>{
    const {id} = req.params;
    console.log(id)
    var connection = sql.createConnection({
        host:"localhost",
        user: "root",
        password: "",
        database: "ic-cadidate-db"
    });
    connection.connect();
    connection.query("SELECT * FROM `applied` WHERE userId = ?",id,  (err, result, fields)=>{
        if(err) res.send(err)
        else{
            console.log(result)
            res.render(path.join(__dirname, "../../views/user/viewStatus"), {result})
            }
        });
    connection.end();
})
   
//web homepage
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "../../views/user/mainPage.html"));
});

router.get('/login', (req, res)=>{
    res.sendFile(path.join(__dirname, "../../views/user/login.html"));
})

router.get('/register', (req, res)=>{
    res.sendFile(path.join(__dirname, "../../views/user/register.html"));
})

module.exports = router;
