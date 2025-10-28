-- -----------------------------------------------------
-- Bloco 1: Criação do Banco e Tabelas
-- -----------------------------------------------------

CREATE DATABASE avisafe_v2;
USE avisafe_v2;

-- (O código de criação das tabelas empresa, galpao, usuario, localSensor, sensor e coleta permanece o mesmo da resposta anterior)

-- Cria a tabela empresa.
CREATE TABLE empresa (
    idEmpresa INT PRIMARY KEY,
    nomeAdministrador VARCHAR(45),
    nomeSocial VARCHAR(45),
    cnpj CHAR(14)
);

-- Cria a tabela galpao.
CREATE TABLE galpao(
    idGalpao INT PRIMARY KEY,
    nomeGalpao VARCHAR(45),
    fkEmpresa INT,
    CONSTRAINT fkGalpaoEmpresa
        FOREIGN KEY (fkEmpresa) REFERENCES empresa(idEmpresa)
);

-- Cria a tabela usuario.
CREATE TABLE usuario (
    idUsuario INT PRIMARY KEY,
    fkEmpresa INT,
    nome VARCHAR(45),
    permissao INT,
    email VARCHAR(45),
    senha VARCHAR(20),
    telefone CHAR(13),
    FOREIGN KEY (fkEmpresa) REFERENCES empresa(idEmpresa)
);

-- Cria a tabela local do sensor 
CREATE TABLE localSensor(
    idLocalSensor INT PRIMARY KEY,
    nomeLocal VARCHAR(45),
    descricao VARCHAR(45),
    areaInterna VARCHAR(45)
);

-- Cria a tabela sensor.
CREATE TABLE sensor (
    idSensor INT PRIMARY KEY,
    nomeSensor VARCHAR(45),
    statusSensor VARCHAR(45),
    dtInstalacao DATE,
    fkGalpao INT,
    fkLocalSensor INT,
    
    CONSTRAINT fkGalpaoSensor 
        FOREIGN KEY (fkGalpao) REFERENCES galpao(idGalpao), 
    
    CONSTRAINT fkLocal
        FOREIGN KEY (fkLocalSensor) REFERENCES localSensor(idLocalSensor)
);
    
-- Cria a tabela Coleta
CREATE TABLE coleta (
    idColeta INT PRIMARY KEY,
    fkSensor INT,
    temp FLOAT (4,2),
    umidade INT,
    dtColeta DATE,
    horaColeta TIME,

    CONSTRAINT fkColetaSensor 
        FOREIGN KEY (fkSensor) REFERENCES sensor(idSensor)
);

-- -----------------------------------------------------
-- Bloco 2: INSERTs (Metadados)
-- -----------------------------------------------------

-- 1 Empresa
INSERT INTO empresa (idEmpresa, nomeAdministrador, nomeSocial, cnpj) VALUES
(1, 'João da Silva', 'Avicultura Sol Nascente', '12345678000199');

-- 1 Galpão
INSERT INTO galpao (idGalpao, nomeGalpao, fkEmpresa) VALUES
(10, 'Galpão Principal', 1);

-- Usuários
INSERT INTO usuario (idUsuario, fkEmpresa, nome, permissao, email, senha, telefone) VALUES
(100, 1, 'Ana Oliveira', 1, 'ana.oliveira@email.com', 'senha123', '11912345678'),
(101, 1, 'Bruno Costa', 2, 'bruno.costa@email.com', 'senha456', '11987654321');

-- Locais
INSERT INTO localSensor (idLocalSensor, nomeLocal, descricao, areaInterna) VALUES
(1, 'Entrada', 'Perto da porta principal', 'Setor A'),
(2, 'Centro', 'Viga central', 'Setor B'),
(3, 'Fundo', 'Próximo aos exaustores', 'Setor C');

-- 6 Sensores
INSERT INTO sensor (idSensor, nomeSensor, statusSensor, dtInstalacao, fkGalpao, fkLocalSensor) VALUES
(1, 'SHT31-A-Temp', 'ativo', '2025-01-15', 10, 1),
(2, 'SHT31-A-Umid', 'ativo', '2025-01-15', 10, 1),
(3, 'DHT22-B-Temp', 'ativo', '2025-01-16', 10, 2),
(4, 'DHT22-B-Umid', 'inativo', '2025-01-16', 10, 2),
(5, 'SHT31-C-Temp', 'manutencao', '2025-01-17', 10, 3),
(6, 'SHT31-C-Umid', 'ativo', '2025-01-17', 10, 3);


-- -----------------------------------------------------
-- Bloco 3: INSERTs Fictícios (Coleta de Dados)
-- -----------------------------------------------------
-- Dados de exemplo para os sensores ativos.
INSERT INTO coleta (idColeta, fkSensor, temp, umidade, dtColeta, horaColeta) VALUES
(1000, 1, 30.50, 65, '2025-10-27', '10:00:00'),
(1001, 2, 30.50, 65, '2025-10-27', '10:00:00'),
(1002, 3, 31.00, 62, '2025-10-27', '10:00:00'),
(1003, 6, 29.80, 68, '2025-10-27', '10:00:00'),
(1004, 1, 30.70, 64, '2025-10-27', '10:05:00'),
(1005, 3, 31.10, 61, '2025-10-27', '10:05:00'),
(1006, 6, 29.90, 67, '2025-10-27', '10:05:00');


-- -----------------------------------------------------
-- Bloco 4: SELECTs (Específicos e com CONCAT)
-- -----------------------------------------------------

-- Select 1: Relatório de Leitura Completo (JOIN em 5 tabelas)
-- Mostra *de onde* veio cada leitura (Empresa -> Galpão -> Local -> Sensor -> Leitura)
SELECT 
    e.nomeSocial AS Empresa,
    g.nomeGalpao AS Galpão,
    l.nomeLocal AS Local,
    s.nomeSensor AS Sensor,
    c.temp AS Temperatura,
    c.umidade AS Umidade,
    c.dtColeta AS Data,
    c.horaColeta AS Hora
FROM coleta AS c
JOIN sensor AS s ON c.fkSensor = s.idSensor
JOIN localSensor AS l ON s.fkLocalSensor = l.idLocalSensor
JOIN galpao AS g ON s.fkGalpao = g.idGalpao
JOIN empresa AS e ON g.fkEmpresa = e.idEmpresa;


-- Select 2: Log de Leituras Formatado (CONCAT)
-- Cria uma frase única para cada leitura de um sensor específico (ex: sensor ID 1)
SELECT 
    CONCAT(
        'Sensor: ', s.nomeSensor, 
        ' | Local: ', l.nomeLocal, ' (', l.areaInterna, ')',
        ' | Leitura: ', c.temp, '°C e ', c.umidade, '%',
        ' | Horário: ', c.dtColeta, ' ', c.horaColeta
    ) AS 'Log de Leituras Formatado'
FROM coleta AS c
JOIN sensor AS s ON c.fkSensor = s.idSensor
JOIN localSensor AS l ON s.fkLocalSensor = l.idLocalSensor
WHERE s.idSensor = 1;


-- Select 3: Painel de Status de Sensores (CONCAT e CASE)
-- Mostra o status de *todos* os sensores (mesmo os sem leitura)
SELECT 
    s.nomeSensor,
    l.nomeLocal,
    CASE 
        WHEN s.statusSensor = 'ativo' THEN 'OK - Monitorando'
        WHEN s.statusSensor = 'inativo' THEN 'FALHA - Sensor Offline'
        WHEN s.statusSensor = 'manutencao' THEN 'AVISO - Em Manutenção'
        ELSE 'Desconhecido'
    END AS 'Status Detalhado'
FROM sensor AS s
JOIN localSensor AS l ON s.fkLocalSensor = l.idLocalSensor
WHERE s.fkGalpao = 10;


-- Select 4: Resumo de Médias por Local (AVG, MAX, MIN)
-- Calcula a média, máxima e mínima de temp/umidade para cada *local*
SELECT 
    l.nomeLocal AS Local,
    l.areaInterna AS Setor,
    AVG(c.temp) AS MediaTemp,
    MAX(c.temp) AS MaxTemp,
    MIN(c.umidade) AS MinUmidade,
    MAX(c.umidade) AS MaxUmidade
FROM coleta AS c
JOIN sensor AS s ON c.fkSensor = s.idSensor
JOIN localSensor AS l ON s.fkLocalSensor = l.idLocalSensor
GROUP BY l.nomeLocal, l.areaInterna; -- Agrupa pelo local


-- Select 5: Relatório de Usuários da Empresa (CONCAT)
-- (Este select não usa a tabela 'coleta', mas usa CONCAT)
SELECT 
    CONCAT('Nome: ', nome, ' | Contato: ', email, ' | Tel: ', telefone) AS 'Usuário',
    CASE 
        WHEN permissao = 1 THEN 'Administrador'
        WHEN permissao = 2 THEN 'Técnico'
        ELSE 'Visitante'
    END AS 'Nível de Acesso'
FROM usuario
WHERE fkEmpresa = 1;