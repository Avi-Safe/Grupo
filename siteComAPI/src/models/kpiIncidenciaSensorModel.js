var database = require("../database/config")

function kpiIncidenciaSensor(idEmpresa) {
    var instrucaoSql = `select * from vw_sensor_mais_alertas where fkEmpresa = ${idEmpresa} and fkGalpao = 1;`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    kpiIncidenciaSensor
};