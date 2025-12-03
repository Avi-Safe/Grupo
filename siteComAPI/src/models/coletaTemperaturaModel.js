var database = require("../database/config")

function coletaTemperatura(idEmpresa) {
    var instrucaoSql = `select * from vw_media_por_galpao_temp where fkEmpresa = ${idEmpresa};`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function coletaUmidade(idEmpresa) {
    var instrucaoSql = `select * from vw_media_por_galpao_umi where fkEmpresa = ${idEmpresa};`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    coletaTemperatura,
    coletaUmidade
};