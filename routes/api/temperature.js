var express = require('express');
const jwt = require('jsonwebtoken');
var router = express.Router();

var dbConn = require('../../config/db.js');

// Routes HERE

// INSERT
// @routes POST temperature/add
// @desc INSERT data to the databse
// @access PRIVATE
router.post('/add', (req, res) => {
  const token = req.headers.authorization.split(' ')[1];

  if (!token) {
    res.status(200).json({ success: false, msg: 'Error, Token was not found' });
  }

  const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN);

  console.log(decodedToken.data['email']);

  var userEmail = decodedToken.data['email'];

  var temperature = req.body.temperature;
  var deviceId = req.body.deviceId;
  var readingDate = req.body.date;

  sqlQuery = `INSERT INTO temp_tb(temperature,device_id,date) VALUES(${temperature},"${deviceId}","${readingDate}")`;

  dbConn.query(sqlQuery, function (error, results, fields) {
    if (error) throw error;
    res.status(200).json(results);
  });
});

// VIEW
// @routes GET temperature/view
// @desc View Data
// @access PUBLIC
router.get('/view', (req, res) => {
  sqlQuery = `SELECT * FROM temp_tb`;
  dbConn.query(sqlQuery, function (error, results, fields) {
    if (error) throw error;
    res.status(200).json(results);
  });
});

// UPDATE

// DELETE
// @routes DELETE temperature/delete/:id
// @desc DELETE Data
// @access PRIVATE
router.delete('/delete/:id', (req, res) => {
  //print body for checking

  var readingId = req.params.id;
  sqlQuery = `DELETE FROM temp_tb WHERE id=${readingId}`;
  dbConn.query(sqlQuery, function (error, results, fields) {
    if (error) throw error;
    res.status(200).json({
      msg: 'Data Successfully Deleted',
      results: results,
    });
  });
  // working task by group
  //1. UPDATE Route
  //2. SEARCH record by ID
  //3. SEARCH record by deviceID using LIKE function
});

// update
// @routes PUT  temperature/update/:id
// @desc UPDATE data to the database
// @access PRIVATE
router.put('/update/:id', (req, res) => {
  //print body for checking
  console.log(req.body);

  const token = req.headers.authorization.split(' ')[1];

  //Authorization: 'Bearer TOKEN'
  if (!token) {
    res
      .status(200)
      .json({ success: false, message: 'Error! Token was not provided.' });
  }
  //Decoding the token
  const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
  var temperature = req.body.temperature;
  var id = req.params.id;
  var readingDate = req.body.date;
  sqlQuery = `UPDATE temp_tb set temperature="${temperature}", date="${readingDate}" WHERE id="${id}"`;
  //sqlQuery = `INSERT INTO temp_tb(temperature,device_id,date) VALUES(${temperature},"${deviceId}","${readingDate}")`;

  dbConn.query(sqlQuery, function (error, results, fields) {
    if (error) throw error;
    res.status(200).json(results);
  });
});

module.exports = router;
