const express = require('express');
const app = express();
const port = 3000;
const User = require('./src/models/user.js');
const verifyToken = require('./src/middleware/jwt-check.js');
const news = require('./src/models/news.js');
let url = "https://newsapi.org/v2/everything?apiKey=0a1059db593344c39e73999a8ce52d52&q=bitcoin";
// let url = "https://api.openaq.org/v2/latest?"

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});

app.post('/users/signup', (req, res) => {
    let response = User.validateUserSignUp(req.body);
    return  res.status(response.statusCode).json(response.details);
});

app.post('/users/login', (req, res)=>{
    let response = User.validateLogin(req.body);
    return  res.status(response.statusCode).json(response);
});

app.put('/users/preferences',verifyToken,(req, res)=> {
    if(!req.user) {
        return  res.status(401).json("Invalid User");
    } else {
        let response = User.updatePerferences(req.user,req.body);
        return  res.status(response.statusCode).json(response);
    }
})

app.get('/users/preferences',verifyToken,(req, res)=> {
    if(!req.user) {
        return  res.status(401).json("Invalid User");
    } else {
        let response = User.findUserById(req.user.id);
        return  res.status(200).json(response.preferences);
    }
})

app.get('/news',verifyToken,(req, res)=> {
    if(!req.user) {
        return  res.status(401).json("Invalid User");
    } else {
        news.getNewsByPreferences(url, req.user.preferences, function(err, news) {
            if (err) {
                return  res.status(401).json("Invalid User");
            } else {  
                return  res.status(200).json({news:news});
            }
        });
    }
})

module.exports = app;