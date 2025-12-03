var express = require("express");
var router = express.Router();

var graficoUmiIndController = require("../controllers/graficoUmiIndController");

router.get("/graficoUmiInd/:idEmpresa", function (req, res) {
    graficoUmiIndController.graficoUmiInd(req, res);
})

module.exports = router;