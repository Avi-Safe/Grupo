var express = require("express");
var router = express.Router();

var kpiHorarioEspecificaController = require("../controllers/kpiHorarioEspecificaController");

router.get("/kpiHorarioEspecifica/:idEmpresa", function (req, res) {
    kpiHorarioEspecificaController.kpiHorarioEspecifica(req, res);
})

module.exports = router;