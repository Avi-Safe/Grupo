var express = require("express");
var router = express.Router();

var kpiIncidenciaSensorController = require("../controllers/kpiIncidenciaSensorController");

router.get("/kpiIncidenciaSensor/:idEmpresa", function (req, res) {
    kpiIncidenciaSensorController.kpiIncidenciaSensor(req, res);
})

module.exports = router;