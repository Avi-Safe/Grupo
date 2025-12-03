var express = require("express");
var router = express.Router();

var kpiHorarioIncidenciaController = require("../controllers/kpiHorarioIncidenciaController");

router.get("/kpiHorarioIncidencia/:idEmpresa", function (req, res) {
    kpiHorarioIncidenciaController.kpiHorarioIncidencia(req, res);
})

module.exports = router;