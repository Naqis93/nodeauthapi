let { Client } = require("pg");
let con = new Client({
  user: "postgres",
  host: "localhost",
  database: "api",
  password: "123",
  port: "5432",
});
con.connect((err) => {
  if (err) throw err;
  // console.log("connected");
});

module.exports = con;
