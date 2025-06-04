var express = require("express");
var router = express.Router();
const productsControl = require("../controller/Product");

router.get("/toptrending", productsControl.TopTrending);
router.get("/find/:query",productsControl.searchName);

router.get("/find/getCate/:query",productsControl.getCate);

module.exports = router;

