function popularVisaoGeral() {
    var html = '';
    for (var i = 1; i <= 8; i++) {
        var nome = 'Galpão ' + i
        var link = 'galpao' + i;
        if (i == 2) {
            html +=`
                <div class="alerta vermelho" style="">
                    <a style="text-decoration: none; color: white;" href="${link}.html">
                        <h3>${nome}</h3>
                    </a>
                </div>`;
        } else {
            html +=`
                <div class="alerta verde" style="">
                    <a style="text-decoration: none; color: white;" href="${link}.html">
                        <h3>${nome}</h3>
                    </a>
                </div>`;
        }
    }
    geral.innerHTML = html;
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
                    
                    // var h1 = [];
                    // var h2 = [];
                    // var h3 = [];
                    // for (var i = 0; i < resposta.length; i++) {
                    //     h1.push(resposta[i].hrColeta);
                    // }
                    
                    // for (var i = 0; i < h2.length; i++) {
                    //     h2.push(resposta[i].hrColeta);
                    // }
                    
                    // for (var i = 0; i < h3.length; i++) {
                    //     h3.push(resposta[i].hrColeta);
                    // }
                    document.getElementById('horario1').innerHTML = (resposta[0].hrColeta);
                    document.getElementById('horario2').innerHTML = (resposta[1].hrColeta);
                    document.getElementById('horario3').innerHTML = (resposta[2].hrColeta);
                });
            }
        });
}

function coletaTemperatura() {
    const ctxSensor1 = document.getElementById('chart1').getContext('2d');
    var idEmpresa = sessionStorage.ID_EMPRESA;
    fetch(`/coletaUmidade/coletaUmidade/${idEmpresa}`)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (resposta) {
                    console.log(resposta);
                   var galpao1Umi = Math.trunc(resposta[0].media_umi);
                return fetch(`/coletaTemperatura/coletaTemperatura/${idEmpresa}`)
                    .then(function (response) {
                        if (response.ok) {
                            response.json().then(function (resposta) {
                                console.log(resposta);
                                var galpao1 = Math.trunc(resposta[0].media_temp);
                                new Chart(ctxSensor1, {
                                    data: {
                                        labels: ['Galpão 1', 'Galpão 2', 'Galpão 3', 'Galpão 4', 'Galpão 5', 'Galpão 6', 'Galpão 7', 'Galpão 8'],
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
    
    var ctxSensor1 = document.getElementById('chart1').getContext('2d');
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
                            }],
                            // {
                            //     label: 'Sensor 3',
                            //     data: [21, 25, 25, 26, 21, 22, 22],
                            //     borderColor: '#00CCC9',
                            //     backgroundColor: '#00CCC9',
                            // },
                            // {
                            //     label: 'Sensor 4',
                            //     data: [23, 30, 30, 28, 21, 24, 23],
                            //     borderColor: '#6300CC',
                            //     backgroundColor: '#6300CC',
                            // }]
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
    
    var ctxSensor2 = document.getElementById('chart2').getContext('2d');
    fetch(`/graficoUmiInd/graficoUmiInd/${idEmpresa}`)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (resposta) {
                    console.log(resposta);

                    new Chart(ctxSensor2, {
                        type: 'bar',
                        data: {
                            labels: ['12:00', '12:10', '12:20', '12:30', '12:40', '12:50', '13:00'],
                            datasets: [{
                                label: 'Sensor 1',
                                data: [46, 49, 39, 46, 50, 55, 60],
                                borderColor: '#CC0003',
                                backgroundColor: '#CC0003',
                            },
                            {
                                label: 'Sensor 2',
                                data: [33, 28, 49, 46, 33, 47, 45],
                                borderColor: '#69CC00',
                                backgroundColor: '#69CC00',
                            }],
                            // {
                            //     label: 'Sensor 3',
                            //     data: [39, 55, 55, 33, 39, 49,43],
                            //     borderColor: '#00CCC9',
                            //     backgroundColor: '#00CCC9',
                            // },
                            // {
                            //     label: 'Sensor 4',
                            //     data: [60, 30, 30, 28, 39, 50,55],
                            //     borderColor: '#6300CC',
                            //     backgroundColor: '#6300CC',
                            // }]
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

    graficoUmiInd();
    graficoTempInd();
    kpiHorarioEspecifica();
    popularVisaoGeral();
    coletaTemperatura();
    // coletaUmidade();
    kpiHorarioIncidencia();
}