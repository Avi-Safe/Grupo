var database = require("../database/config")

function kpiHorarioEspecifica(idEmpresa) {
    var instrucaoSql = `select * from vw_horario_maisalertas_setedias_individual where fkEmpresa = ${idEmpresa} and fkGalpao = 1;`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    kpiHorarioEspecifica
};