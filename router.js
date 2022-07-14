let express = require("express");
let controller = require("./controller");
let bodyParser = require("body-parser");

let router = express.Router();
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
router.get("/", controller.home);
router.post("/register", controller.register);
router.post("/sigin", controller.signin);
router.post("/profile", controller.profile);
router.delete("/delete", controller.deleteUser);
router.patch("/update", controller.updateUser);
router.post("/all", controller.allUsers);


module.exports = router;
