const {Router} = require('express');
const router = Router();
const sql = require('mysql');

router.get('/:adminId/changeStatus/:id/:name', (req, res)=>{
    const {id, name, adminId} = req.params;
    var connection = sql.createConnection({
        host:"localhost",
        user: "root",
        password: "",
        database: "ic-cadidate-db"
    });
    connection.connect();
    connection.query('SELECT assigned FROM `applied` WHERE id = ? AND name = ? ', [id, name], (err, result1, fields) =>{
        if(err) res.send(err);
        else if(!result1) res.send('err');
        else{
            connection.query('UPDATE `applied` SET assigned = ? WHERE id = ?',[!result1[0].assigned, id], (err, result2, fields) =>{
                if(err) res.send(err);
                else{
                    console.log(result2)
                    res.redirect(`/admin/homepage/${adminId}`)
                }
            })
        }
    })
})

router.get('/:adminId/delete/:id/:name', (req, res)=>{
    const {id, name, adminId} = req.params;
    var connection = sql.createConnection({
        host:"localhost",
        user: "root",
        password: "",
        database: "ic-cadidate-db"
    });
    connection.connect();
    connection.query('DELETE FROM `applied` WHERE id=? AND name =?', [id, name], (err, result, fields) =>{
        if(err) res.send(err);
        else if(!result) res.send(err);
        else{
            res.redirect(`/admin/homepage/${adminId}`);
        }
        
    })
})

module.exports = router;