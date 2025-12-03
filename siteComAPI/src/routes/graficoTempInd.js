var express = require("express");
var router = express.Router();

var graficoTempIndController = require("../controllers/graficoTempIndController");

router.get("/graficoTempInd/:idEmpresa", function (req, res) {
    graficoTempIndController.graficoTempInd(req, res);
})

module.exports = router;