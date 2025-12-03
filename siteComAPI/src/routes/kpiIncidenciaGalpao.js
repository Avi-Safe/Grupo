var express = require("express");
var router = express.Router();

var kpiIncidenciaGalpaoController = require("../controllers/kpiIncidenciaGalpaoController");

router.get("/kpiIncidenciaGalpao/:idEmpresa", function (req, res) {
    kpiIncidenciaGalpaoController.kpiIncidenciaGalpao(req, res);
})

module.exports = router;