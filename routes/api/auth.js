var express = require('express');

var router = express.Router();

const jwt = require('jsonwebtoken');

var dbConn = require('../../config/db.js');

router.post('/signup', (req, res, next) => {
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;
  var userId = '';
  try {
    sqlQuery = `INSERT INTO account_credentials(username, email, password) VALUES("${username}","${email}","${password}")`;
    dbConn.query(sqlQuery, function (error, results) {
      userId = results.insertId;
      console.log(results);
      console.log(results.insertId);
      res.status(200).json({ success: true, userId: userId });
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
});

router.post('/login', (req, res, next) => {
  var email = req.body.email;
  var password = req.body.password;

  try {
    sqlQuery = `SELECT * FROM account_credentials WHERE email="${email}" AND password="${password}"`;
    dbConn.query(sqlQuery, function (error, results) {
      console.log(results);
      Object.keys(results).forEach(function (key) {
        var row = results[key];

        var data = {
          username: row.username,
          email: row.email,
        };

        // Create Token
        token = jwt.sign({ data: data }, process.env.SECRET_TOKEN, {
          expiresIn: '1h',
        });

        res.status(200).json({ success: true, token: token });
      });
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
});

module.exports = router;
