const express = require('express');
const app = express();
const port = 3000;
const User = require('./src/models/user.js');
const verifyToken = require('./src/middleware/jwt-check.js');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});

app.post('/register', (req, res) => {
    let response = User.validateUserSignUp(req.body);
    return  res.status(response.statusCode).json(response.details);
});

app.post('/login', (req, res)=>{
    let response = User.validateLogin(req.body);
    return  res.status(response.statusCode).json(response);
});

app.put('/users/preferences',verifyToken,(req, res)=> {
    if(!req.user) {
        return  res.status(401).json(req);
    } else {
        let response = User.updatePerferences(req.body);
        return  res.status(response.statusCode).json(response);
    }
})


module.exports = app;