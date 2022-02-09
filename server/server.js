const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var config = {
  user: 'express',
  password: 'express',
  server: 'C5LAPTOP',
  database: 'test',
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

app.get('/', (req, res) => {
  try {
    var sql = require('mssql');

    sql.connect(config, function (err) {
      if (err) console.log(err);

      var request = new sql.Request();

      request.query(
        'select * from products order by price desc',
        function (err, recordset) {
          if (err) console.log(err);

          res.send({ error: 0, success: true, data: recordset.recordset });
        }
      );
    });
  } catch (error) {
    res.send({ error: 1, success: false, msg: error.message });
  }
});

app.post('/', (req, res) => {
  try {
    const name = req.body.name;
    if (!name) {
      res.send({ error: 2, success: false, msg: 'Missing Name Parameter' });
      return;
    }
    const size = req.body.size;
    const price = req.body.price;
    const category = req.body.category;
    console.log(name, size, price, category);

    var sql = require('mssql');
    sql.connect(config, function (err) {
      if (err) console.log(err);

      var request = new sql.Request();

      const query = `insert into products (name, size, price, category) values ('${name}','${size}','${price}','${category}')`;
      console.log(query);

      request.query(query, function (err, recordset) {
        if (err) console.log(err);

        res.send({
          error: 0,
          success: true,
          data: recordset,
        });
      });
    });
  } catch (error) {
    res.send({ error: 1, success: false, msg: error.message });
  }
});

app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});
