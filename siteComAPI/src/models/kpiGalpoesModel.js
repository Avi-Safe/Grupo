var database = require("../database/config")

function kpiGalpoes(idEmpresa) {
    var instrucaoSql = `select * from vw_popular_menu_galpoes where fkEmpresa = ${idEmpresa};`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    kpiGalpoes
};