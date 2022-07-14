let jwt = require("jsonwebtoken");
let md5 = require("md5");
let con = require("./db");

let SECRECT_KEY = "my very firt api of jwt and so on so on";

let home = (request, response) => {
  response.sendFile(__dirname + "/public/index.html");
};

let register = (request, response) => {
  console.log(request.body);
  con.query(
    "insert into users (name,email,pwd) values($1,$2,$3)",
    [request.body.name, request.body.email, md5(request.body.pwd)],
    (err, result) => {
      if (err)
        return response
          .status(200)
          .send({ auth: false, message: "Register failed" });
      response.status(200).send({ auth: true, message: "Register Success" });
    }
  );
};

let signin = (request, response) => {
  console.log(request.body);
  con.query(
    "SELECT * from users where email=$1 and pwd=$2",
    [request.body.email, md5(request.body.pwd)],
    (err, result) => {
      // console.log(err);
      if (err)
        response.status(200).send({ auth: false, message: "Login Failed" });
      if (result.rows.length > 0) {
        let personalData = result.rows;
        let expiresIn = 24 * 60 * 60;
        let accessToken = jwt.sign({ personalData }, SECRECT_KEY, {
          expiresIn: expiresIn,
        });
        return response.status(200).send({
          auth: true,
          access_token: accessToken,
          expiresIn: expiresIn,
        });
      } else {
        return response
          .status(200)
          .send({ auth: false, message: "Login Failed" });
      }
    }
  );
};
let profile = (request, response) => {
  let token = request.headers["token"];
  console.log(token);
  if (!token)
    response.status(401).send({ auth: false, message: "No token provided" });
  jwt.verify(token, SECRECT_KEY, (err, decode) => {
    if (err)
      return response
        .status(500)
        .send({ auth: false, message: "Failed to authenticate" });
    response.status(200).send(decode);
  });
};

let deleteUser = (request, response) => {
  let token = request.headers["token"];
  console.log(token);
  console.log(request.body.userId);
  if (!token)
    response.status(401).send({ auth: false, message: "no token found" });
  jwt.verify(token, SECRECT_KEY, (err, decode) => {
    if (err)
      return response
        .status(500)
        .send({ auth: false, message: "Failed to Authenticate" });
    con.query(
      "DELETE from users where id=$1",
      [request.body.userId],
      (err, result) => {
        if (err)
          return response
            .status(200)
            .send({ auth: false, message: "Failed to User Delete" });
        response
          .status(200)
          .send({ auth: true, message: "User Deleted Sucessfully" });
      }
    );
  });
};
let updateUser = (request, response) => {
  let token = request.headers["token"];
  console.log(request.body);
  if (!token)
    response.status(401).send({ auth: false, message: "no token found" });
  jwt.verify(token, SECRECT_KEY, (err, decode) => {
    if (err)
      return response
        .status(500)
        .send({ auth: false, message: "Failed to Authenticate" });
    con.query(
      "UPDATE users SET name=$1 where id=$2",
      [request.body.name, request.body.userId],
      (err, result) => {
        // console.log(err)
        if (err)
          return response
            .status(200)
            .send({ auth: false, message: "Failed to Update User" });
        response
          .status(200)
          .send({ auth: true, message: "User Updated Sucessfully" });
      }
    );
  });
};
let allUsers = (request, response) => {
  let token = request.headers["token"];
  if (!token)
    return response
      .status(401)
      .send({ auth: false, message: "No token found" });
  jwt.verify(token, SECRECT_KEY, (err) => {
    if (err)
      return response
        .status(500)
        .send({ auth: false, message: "Failed to Authenticate" });
    con.query("SELECT * from users", (err, result) => {
      if (result.rows.length > 0) {
        let personalData = result.rows;
        return response.status(200).send({ auth: true, data: personalData });
      } else {
        return response
          .status(200)
          .send({ auth: false, message: "No user found" });
      }
    });
  });
};

module.exports = {
  home,
  register,
  signin,
  profile,
  deleteUser,
  updateUser,
  allUsers,
};
