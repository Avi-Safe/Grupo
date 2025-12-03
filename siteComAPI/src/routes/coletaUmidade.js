var express = require("express");
var router = express.Router();

var coletaUmidadeController = require("../controllers/coletaUmidadeController");

router.get("/coletaUmidade/:idEmpresa", function (req, res) {
    coletaUmidadeController.coletaUmidade(req, res);
})

module.exports = router;