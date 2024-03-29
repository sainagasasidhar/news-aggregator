const fs = require('fs');
let users = require('../../data/users.json');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


class User {
    static validateUserSignUp (user) {
        let response = {statusCode:200,details:""};
        if(!user.name) {
            response.statusCode = 400;
            response.details = "Please Enter fullName";
        } else if (!user.email) {
            response.statusCode = 400;
            response.details = "Please Enter Email.";
        } else if(!user.password) {
            response.statusCode = 400;
            response.details = "Please Enter Password.";
        }  else if (!user.preferences || user.preferences.length <0) {
            response.statusCode = 400;
            response.details = "Please Enter atleast one preferences"
        } else {
            let password = bcrypt.hashSync(user.password, 8);
            user.password = password
            user.id = users.length + 1;
            users.push(user);
            fs.writeFileSync('data/users.json', JSON.stringify(users,null,4), {encoding: 'utf8', flag: 'w'});
            response.details = "User Created Successfully.";
        }
        return response
    }
    static validateLogin (signin) {
        let response = {statusCode:200,details:""};
        let user = users.filter(function(user) {
            return user.email == signin.email;
        });
        if (user.length<0) {
            response.statusCode = 400;
            response.details = "Please Enter a Valid Email";
        } else if (!bcrypt.compareSync(signin.password, user[0].password)){
            response.statusCode = 400;
            response.details = "Please Enter a Valid Password";
        } else {
            var token = jwt.sign({
                id: user[0].id
            }, "user_signup", {
                expiresIn: 86400
            });
            response.token = token;
            response.statusCode = 200;
            response.details = "User LoggedIn SuccessFully";
            return response;
        }
    }
    static updatePerferences(data, preferences) {
        let response = {statusCode:200,details:""};
        for (let i=0; i<users.length; i++) {
            if (users[i].id == data.id) {
                users[i].preferences = preferences;
            }
        }
        fs.writeFileSync('data/users.json', JSON.stringify(users,null,4), {encoding: 'utf8', flag: 'w'});
        response.details = "preferences Updated Sucessfully";
        response.statusCode = 200;
        return response;
    }

    static findUserById(id) {
        let user = users.filter(function(user) {
            return user.id == id;
        });
        return user[0];
    }
}
module.exports = User;