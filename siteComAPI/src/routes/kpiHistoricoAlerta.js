var express = require("express");
var router = express.Router();

var kpiHistoricoAlertaController = require("../controllers/kpiHistoricoAlertaController");

router.get("/kpiHistoricoAlerta/:idEmpresa", function (req, res) {
    kpiHistoricoAlertaController.kpiHistoricoAlerta(req, res);
})

module.exports = router;