let express = require("express");
let app = express();
let cors = require("cors");
let router = require("./router");

let corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT",
  preflightContinue: false,
  optionSuccessStatus: 200,
};
app.use(express.static(__dirname + "/public"));
app.use(cors(corsOptions));
app.use("/api", router);
module.exports = app;
app.listen(8080, function () {
  /* editing this code in dev branch */
  console.log("Server running");
});
