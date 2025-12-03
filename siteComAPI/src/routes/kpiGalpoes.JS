var express = require("express");
var router = express.Router();

var kpiGalpoesController = require("../controllers/kpiGalpoesController");

router.get("/kpiGalpoes/:idEmpresa", function (req, res) {
    kpiGalpoesController.kpiGalpoes(req, res);
})

module.exports = router;