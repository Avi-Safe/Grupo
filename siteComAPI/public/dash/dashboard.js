function kpiGalpoes() {
    var idEmpresa = sessionStorage.ID_EMPRESA;
    fetch(`/kpiGalpoes/kpiGalpoes/${idEmpresa}`)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (resposta) {
                    console.log(resposta);
                    var html = "";
                    for (var i = 0; i < resposta.length; i++) {
                        html += resposta[i].alerta_html;
                    }
                    geral.innerHTML = html;
                });
            }
        });
}

function kpiHorarioEspecifica() {
    var idEmpresa = sessionStorage.ID_EMPRESA;
    fetch(`/kpiHorarioEspecifica/kpiHorarioEspecifica/${idEmpresa}`)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (resposta) {
                    console.log(resposta);

                    document.getElementById('horario1').innerHTML = (resposta[0].hrColeta);
                    document.getElementById('horario2').innerHTML = (resposta[1].hrColeta);
                    document.getElementById('horario3').innerHTML = (resposta[2].hrColeta);
                });
            }
        });
}

function kpiHorarioIncidencia() {
    var idEmpresa = sessionStorage.ID_EMPRESA;
    fetch(`/kpiHorarioIncidencia/kpiHorarioIncidencia/${idEmpresa}`)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (resposta) {
                    console.log(resposta);

                    document.getElementById('horario1').innerHTML = (resposta[0].hrColeta);
                    document.getElementById('horario2').innerHTML = (resposta[1].hrColeta);
                    document.getElementById('horario3').innerHTML = (resposta[2].hrColeta);
                });
            }
        });
}

function kpiHistoricoAlerta() {
    var idEmpresa = sessionStorage.ID_EMPRESA;
    fetch(`/kpiHistoricoAlerta/kpiHistoricoAlerta/${idEmpresa}`)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (resposta) {
                    console.log(resposta);

                    var html = "";

                    for (var i = resposta.length - 1; i >= 0; i--) {
                        var alerta = resposta[i];

                        if(alerta.temp > 22 && alerta.umidade > 60) {
                            html +=
                            `<div class="alertaNotif">
                            <span class="textoVermelho">Alerta: Temperatura e Umidade acima!</span>
                            ${alerta.hrColeta} - Sensor ${alerta.fkSensor}
                            </div>`;
                        } else if (alerta.temp > 22) {
                            html +=
                            `<div class="alertaNotif">
                            <span class="textoVermelho">Alerta: Temperatura acima!</span>
                            ${alerta.hrColeta} - Sensor ${alerta.fkSensor}
                            </div>`;
                        } else {
                            html +=
                            `<div class="alertaNotif">
                            <span class="textoVermelho">Alerta: Umidade acima!</span>
                            ${alerta.hrColeta} - Sensor ${alerta.fkSensor}
                            </div>`;
                        }
                    }
                    historicoAlertas.innerHTML = html;
                });
            }
        });
}

function kpiIncidenciaSensor() {
    var idEmpresa = sessionStorage.ID_EMPRESA;
    fetch(`/kpiIncidenciaSensor/kpiIncidenciaSensor/${idEmpresa}`)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (resposta) {
                    console.log(resposta);

                    document.getElementById('sensorIncidencia1').innerHTML = `Sensor ${resposta[0].fkSensor}`;
                    document.getElementById('sensorIncidencia2').innerHTML = `Sensor ${resposta[0].fkSensor}`;
                    document.getElementById('medidaIncidencia1').innerHTML = resposta[0].alertasTemp;
                    document.getElementById('medidaIncidencia2').innerHTML = resposta[0].alertasUmi;
                });
            }
        });
}

function kpiIncidenciaGalpao() {
    var idEmpresa = sessionStorage.ID_EMPRESA;
    fetch(`/kpiIncidenciaGalpao/kpiIncidenciaGalpao/${idEmpresa}`)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (resposta) {
                    console.log(resposta);

                    document.getElementById('galpao1').innerHTML = `Galpão ${resposta[0].fkGalpao}`;
                    document.getElementById('galpao2').innerHTML = `Galpão ${resposta[0].fkGalpao}`;

                    document.getElementById('medida1').innerHTML = resposta[0].alertasTemp;
                    document.getElementById('medida2').innerHTML = resposta[0].alertasUmi;
                });
            }
        });
}

function coletaTemperatura() {
    const ctxSensor0 = document.getElementById('chart0');
    var idEmpresa = sessionStorage.ID_EMPRESA;
    fetch(`/coletaUmidade/coletaUmidade/${idEmpresa}`)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (resposta) {
                    console.log(resposta);
                    var galpoes = [];
                    for (var i = 0; i < resposta.length; i++) {
                        galpoes.push(`Galpão ${i+1}`)
                    }
                    var galpao1Umi = Math.trunc(resposta[0].media_umi);

                    return fetch(`/coletaTemperatura/coletaTemperatura/${idEmpresa}`)
                    .then(function (response) {
                        if (response.ok) {
                            response.json().then(function (resposta) {
                                console.log(resposta);
                                var galpao1 = Math.trunc(resposta[0].media_temp);
                                new Chart(ctxSensor0, {
                                    data: {
                                        labels: galpoes,
                                        datasets:
                                            [
                                                {
                                                    type: 'bar',
                                                    label: 'Umidade',
                                                    yAxisID: 'y1',
                                                    data: [galpao1Umi],
                                                    borderColor: '#6300CC',
                                                    backgroundColor: '#00CCC9',
                                                },
                                                {
                                                    type: 'bar',
                                                    label: 'Temperatura',
                                                    yAxisID: 'y',
                                                    data: [galpao1],
                                                    borderColor: '#000000',
                                                    backgroundColor: '#CC0003',
                                                }
                                            ]
                                    },
                                    options: {
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                display: true
                                            }
                                        },
                                        scales: {
                                            y: {
                                                position: 'right',
                                                title: { display: true, text: 'Temperatura (°C)' },
                                                min: 15,
                                                max: 35,
                                                grid: {
                                                    color: 'rgba(200,200,200,0.5)',
                                                    borderColor: 'black',
                                                },
                                                ticks: {
                                                    font: { weight: 'bold' },
                                                    color: (context) => {
                                                        if (context.tick.value === 20) return 'red';
                                                        return '#000000';
                                                    },
                                                }
                                            },
                                            y1: {
                                                position: 'left',
                                                title: { display: true, text: 'Umidade (%)' },
                                                min: 20,
                                                max: 100,
                                                grid: { drawOnChartArea: false },
                                                ticks: {
                                                    font: { weight: 'bold' },
                                                    color: (context) => {
                                                        if (context.tick.value === 60) return 'red';
                                                        return '#000000';
                                                    },
                                                }
                                            },
                                            x: {
                                                grid: {
                                                    color: 'rgba(200,200,200,0.0)'
                                                }
                                            }
                                        },
                                    }
                                });
                            })
                        }
                    });
                });
            }
        });
    console.log("ID empresa:", sessionStorage.ID_EMPRESA);
}

function graficoTempInd() {
    var idEmpresa = sessionStorage.ID_EMPRESA;
    
    var ctxSensor1 = document.getElementById('chart1');
    fetch(`/graficoTempInd/graficoTempInd/${idEmpresa}`)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (resposta) {
                    console.log(resposta);

                    var sensores = {};
                    for (var i = 0; i < resposta.length; i++) {
                        var sensor = resposta[i].fkSensor;
                        var temp = Number(resposta[i].temp);

                        // se nao tem o array deste sensor, ele cria
                        if (!sensores[sensor]) {
                            sensores[sensor] = [];
                        }

                        sensores[sensor].push(temp);
                    }   

                    // var horario = [];
                    // for (var i = 0; i < resposta.length; i++) {
                    //     var hora = resposta[i].hrColeta;

                    //     var partes = hora.split(":");
                    //     var minuto = Number(partes[1]);

                    //     if (minuto % 2 == 0) {
                    //         horario.push(hora);
                    //     }
                    // }
                    document.getElementById('sensorTemp4').innerHTML = resposta[0].temp + '° C';
                    document.getElementById('sensorTemp3').innerHTML = resposta[1].temp + '° C';
                    document.getElementById('sensorTemp2').innerHTML = resposta[2].temp + '° C';
                    document.getElementById('sensorTemp1').innerHTML = resposta[3].temp + '° C';

                    new Chart(ctxSensor1, {
                        type: 'bar',
                        data: {
                            labels: ['12:00', '12:10', '12:20', '12:30', '12:40', '12:50', '13:00'],
                            datasets: [{
                                label: 'Sensor 1',
                                data: sensores[1], 
                                borderColor: '#CC0003',
                                backgroundColor: '#CC0003',
                            },
                            {
                                label: 'Sensor 2',
                                data: sensores[2],
                                borderColor: '#69CC00',
                                backgroundColor: '#69CC00',
                            },
                            {
                                label: 'Sensor 3',
                                data: sensores[3],
                                borderColor: '#00CCC9',
                                backgroundColor: '#00CCC9',
                            },
                            {
                                label: 'Sensor 4',
                                data: sensores[4],
                                borderColor: '#6300CC',
                                backgroundColor: '#6300CC',
                            }],
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    display: true
                                }
                            },
                            scales: {
                                y: {
                                    min: 10,
                                    max: 35,
                                    ticks: {
                                        stepSize: 5
                                    },
                                    beginAtZero: false,
                                    grid: { 
                                        display: true ,
                                        color: (context) => {
                                            if (context.tick.value === 0) return 'red';
                                            if (context.tick.value === 15) return 'orange';
                                            if (context.tick.value === 25) return 'orange';
                                            if (context.tick.value === 30) return 'red';
                                            return 'rgba(200,200,200,0.5)'
                                        },
                                        lineWidth: (context) => {
                                            if (context.tick.value === 15) return 2;
                                            if (context.tick.value === 25) return 2;
                                            if (context.tick.value === 30) return 2;
                                            return 1;
                                        }
                                    },
                                    
                                },
                                x: {
                                    grid: { display: false}
                                }
                            },
                            elements: {
                                line: {
                                    borderColor: '#d9363e',
                                    borderWidth: 3,
                                    tension: 0.4,
                                    fill: false
                                },
                                point: {
                                    backgroundColor: '#d9363e',
                                    radius: 4,
                                    hoverRadius: 6
                                }
                            }
                        }
                    });
                });
            }
        });
}

function graficoUmiInd() {
    var idEmpresa = sessionStorage.ID_EMPRESA;
    
    var ctxSensor2 = document.getElementById('chart2');
    fetch(`/graficoUmiInd/graficoUmiInd/${idEmpresa}`)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (resposta) {
                    console.log(resposta);

                    var sensores = {};
                    for (var i = 0; i < resposta.length; i++) {
                        var sensor = resposta[i].fkSensor;
                        var umidade = Number(resposta[i].umidade);

                        // se nao tem o array deste sensor, ele cria
                        if (!sensores[sensor]) {
                            sensores[sensor] = [];
                        }

                        sensores[sensor].push(umidade);
                    }

                    document.getElementById('sensorUmi4').innerHTML = resposta[0].umidade + '%';
                    document.getElementById('sensorUmi3').innerHTML = resposta[1].umidade + '%';
                    document.getElementById('sensorUmi2').innerHTML = resposta[2].umidade + '%';
                    document.getElementById('sensorUmi1').innerHTML = resposta[3].umidade + '%';

                    new Chart(ctxSensor2, {
                        type: 'bar',
                        data: {
                            labels: ['12:00', '12:10', '12:20', '12:30', '12:40', '12:50', '13:00'],
                            datasets: [{
                                label: 'Sensor 1',
                                data: sensores[1],
                                borderColor: '#CC0003',
                                backgroundColor: '#CC0003',
                            },
                            {
                                label: 'Sensor 2',
                                data: sensores[2],
                                borderColor: '#69CC00',
                                backgroundColor: '#69CC00',
                            },
                            {
                                label: 'Sensor 3',
                                data: sensores[3],
                                borderColor: '#00CCC9',
                                backgroundColor: '#00CCC9',
                            },
                            {
                                label: 'Sensor 4',
                                data: sensores[4],
                                borderColor: '#6300CC',
                                backgroundColor: '#6300CC',
                            }],
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    display: true
                                }
                            },
                            scales: {
                                y: {
                                    min: 0,
                                    max: 80,
                                    ticks: {
                                        stepSize: 5
                                    },
                                    beginAtZero: false,
                                    grid: { 
                                        display: true ,
                                        color: (context) => {
                                            if (context.tick.value === 30) return 'red';
                                            if (context.tick.value === 60) return 'orange';
                                            if (context.tick.value === 75) return 'red';
                                            return 'rgba(200,200,200,0.0)'
                                        },
                                        lineWidth: (context) => {
                                            if (context.tick.value === 30) return 2;
                                            if (context.tick.value === 60) return 2;
                                            if (context.tick.value === 75) return 2;
                                            return 1;
                                        }
                                    },
                                    
                                },
                                x: {
                                    grid: { display: false }
                                }
                            },
                            elements: {
                                line: {
                                    borderColor: '#d9363e',
                                    borderWidth: 3,
                                    tension: 0.4,
                                    fill: false
                                },
                                point: {
                                    backgroundColor: '#d9363e',
                                    radius: 4,
                                    hoverRadius: 6
                                }
                            }
                        }
                    });
                });
            }
        });
}

function limparSessao() {
    sessionStorage.clear();
    setInterval(() => {
        window.location = "../login.html";
    }, 2000);
}

function inicializarDashboard() {
    document.getElementById('usuario').innerHTML = sessionStorage.NOME_USUARIO;

    kpiGalpoes();
    kpiIncidenciaGalpao();
    kpiIncidenciaSensor();
    kpiHistoricoAlerta();
    graficoUmiInd();
    graficoTempInd();
    kpiHorarioEspecifica();
    coletaTemperatura();
    kpiHorarioIncidencia();
}