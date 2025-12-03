var coletaTemperaturaModel = require("../models/coletaTemperaturaModel");

function coletaTemperatura(req, res) {
    var idEmpresa = req.params.idEmpresa;

    coletaTemperaturaModel.coletaTemperatura(idEmpresa)
        .then(
            function (resultado) {
                res.json(resultado);
            }
        ).catch(
            function (erro) {
                console.log(erro);
                console.log("\nHouve um erro ao realizar o select! Erro: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            }
        );
}


module.exports = {
    coletaTemperatura
}