var database = require("../database/config")

function kpiHistoricoAlerta(idEmpresa) {
    var instrucaoSql = `select * from vw_historico_alertas where fkEmpresa = ${idEmpresa} and fkGalpao = 1;`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    kpiHistoricoAlerta
};