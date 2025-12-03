var express = require("express");
var router = express.Router();

var coletaTemperaturaController = require("../controllers/coletaTemperaturaController");

router.get("/coletaTemperatura/:idEmpresa", function (req, res) {
    coletaTemperaturaController.coletaTemperatura(req, res);
})

module.exports = router;