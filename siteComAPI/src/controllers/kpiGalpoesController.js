var kpiGalpoesModel = require("../models/kpiGalpoesModel");

function kpiGalpoes(req, res) {
    var idEmpresa = req.params.idEmpresa;

    kpiGalpoesModel.kpiGalpoes(idEmpresa)
        .then(
            function (resultado) {
                res.json(resultado);
            }
        ).catch(
            function (erro) {
                console.log(erro);
                console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage);
                res.status(500).json(erro.sqlMessage);
            }
        );
}

module.exports = {
    kpiGalpoes
}