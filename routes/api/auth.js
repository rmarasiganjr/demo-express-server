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
      console.log(process.env.SECRET_TOKEN);
      // if user does not exist, return error response
      if (results.length === 0) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // if user exists, create and sign a JWT
      const token = jwt.sign({ email }, process.env.SECRET_TOKEN);

      // send token back to the client

      res.status(200).json({ success: true, token: token });
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
});

module.exports = router;
