var database = require("../database/config")

function graficoTempInd(idEmpresa) {
    var instrucaoSql = `select * from vw_temp_galpao where fkEmpresa = ${idEmpresa} and fkGalpao = 1;`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    graficoTempInd
};