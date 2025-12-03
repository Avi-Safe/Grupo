var database = require("../database/config")

function kpiIncidenciaGalpao(idEmpresa) {
    var instrucaoSql = `select * from vw_galpao_maisalertas_setedias where fkEmpresa = ${idEmpresa};`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    kpiIncidenciaGalpao
};