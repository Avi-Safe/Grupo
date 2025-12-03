var database = require("../database/config")

function kpiHorarioIncidencia(idEmpresa) {
    var instrucaoSql = `select * from vw_horario_maisalertas_setedias where fkEmpresa = ${idEmpresa};`;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    kpiHorarioIncidencia
};