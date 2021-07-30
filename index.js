const express = require('express');
const app = express();
const port = 3002;
const cors = require('cors');

const authRoutes = require('./routes/user/authRoutes.js');
const pageView = require('./routes/user/pageView.js');

const adminPageView = require('./routes/admin/adminPageView.js')
const adminAuthRoutes = require('./routes/admin/adminAuthRoutes.js');
const adminActions = require('./routes/admin/adminActions.js');

app.use(cors()); 
app.use(express.urlencoded({extended: false}));
app.use('/static', express.static("public"));

app.set('view engine', 'ejs');

app.use('/', authRoutes);
app.use('/', pageView);

app.use('/admin', adminPageView);
app.use('/admin', adminAuthRoutes);
app.use('/admin', adminActions);

app.listen(port, ()=>{
    console.log("server is running at port "+port);
});