-- -----------------------------------------------------
-- Bloco 1: Criação do Banco e Tabelas
-- -----------------------------------------------------
CREATE DATABASE avisafe;
USE avisafe;

-- Cria a tabela empresa.
CREATE TABLE empresa (
    idEmpresa INT PRIMARY KEY AUTO_INCREMENT,
    nomeAdministrador VARCHAR(45),
    nomeSocial VARCHAR(45),
    cnpj CHAR(14)
);

-- Cria a tabela galpao.
CREATE TABLE galpao(
    idGalpao INT primary key auto_increment,
    nomeGalpao VARCHAR(45),
    fkEmpresa INT,
    CONSTRAINT fkGalpaoEmpresa
        FOREIGN KEY (fkEmpresa) REFERENCES empresa(idEmpresa)
);

-- Cria a tabela usuario.
CREATE TABLE usuario (
    idUsuario INT,
    fkEmpresa INT,
    nome VARCHAR(45),
    permissao INT,
    email VARCHAR(45),
    senha VARCHAR(20),
    telefone CHAR(13),
    FOREIGN KEY (fkEmpresa) REFERENCES empresa(idEmpresa),
    PRIMARY KEY(idUsuario, fkEmpresa)
);

-- Cria a tabela local do sensor 
CREATE TABLE localSensor(
    idLocalSensor INT primary key,
    nomeLocal VARCHAR(45),
    descricao VARCHAR(45),
    areaInterna VARCHAR(45)
);

-- Cria a tabela sensor.
CREATE TABLE sensor (
    idSensor INT primary key,
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
idColeta INT,
fkSensor INT,
temp DECIMAL(4,2),
umidade INT,
dtColeta DATE,
hrColeta TIME,

constraint fkColetaSensor 
	foreign key (fkSensor) references sensor(idSensor),
		primary key(idColeta,fkSensor)
	);
-- -----------------------------------------------------
-- Bloco 2: INSERTs (Metadados)
-- -----------------------------------------------------

-- 1 Empresa
INSERT INTO empresa (idEmpresa, nomeAdministrador, nomeSocial, cnpj) VALUES
(1, 'João da Silva', 'Avicultura Sol Nascente', '12345678000199');

-- 1 Galpão
INSERT INTO galpao (idGalpao, nomeGalpao, fkEmpresa) VALUES
(1, 'Galpão Principal', 1);

-- Usuários
INSERT INTO usuario (idUsuario, fkEmpresa, nome, permissao, email, senha, telefone) VALUES
(1, 1, 'Ana Oliveira', 1, 'ana.oliveira@email.com', 'senha123', '11912345678'),
(2, 1, 'Bruno Costa', 2, 'bruno.costa@email.com', 'senha456', '11987654321');

-- Locais
INSERT INTO localSensor (idLocalSensor, nomeLocal, descricao, areaInterna) VALUES
(1, 'Nordeste', 'Perto da porta principal', 'Setor A'),
(2, 'Noroeste', 'Viga central', 'Setor B'),
(3, 'Sudoeste', 'Próximo aos exaustores', 'Setor C'),
(4, 'Sudeste', 'Próximo a parede', 'Setor D');

-- 6 Sensores
INSERT INTO sensor (idSensor, nomeSensor, statusSensor, dtInstalacao, fkGalpao, fkLocalSensor) VALUES
(1, 'DHT11', 'ativo', '2025-01-15', 1, 1),
(2, 'DHT11', 'ativo', '2025-01-15', 1, 2);


-- -----------------------------------------------------
-- Bloco 3: INSERTs Fictícios (Coleta de Dados)
-- -----------------------------------------------------
-- Dados de exemplo para os sensores ativos.

INSERT INTO coleta (idColeta, fkSensor, temp, umidade, dtColeta, hrColeta) VALUES
(1, 1, 10.50, 45, '2025-10-27', '10:00:00'),
(2, 1, 22.50, 65, '2025-10-27', '10:10:00'),
(1, 2, 38.50, 39, '2025-10-27', '10:00:00');

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
    c.hrColeta AS Hora
FROM coleta AS c
JOIN sensor AS s ON c.fkSensor = s.idSensor
JOIN localSensor AS l ON s.fkLocalSensor = l.idLocalSensor
JOIN galpao AS g ON s.fkGalpao = g.idGalpao
JOIN empresa AS e ON g.fkEmpresa = e.idEmpresa;

select * from coleta join sensor on fkSensor = idSensor where idSensor = 2; 


-- Select 2: Log de Leituras Formatado (CONCAT)
-- Cria uma frase única para cada leitura de um sensor específico (ex: sensor ID 1)
SELECT 
    CONCAT(
        'Sensor: ', s.nomeSensor, 
        ' | Local: ', l.nomeLocal, ' (', l.areaInterna, ')',
        ' | Leitura: ', c.temp, '°C e ', c.umidade, '%',
        ' | Horário: ', c.dtColeta, ' ', c.hrColeta
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
WHERE s.fkGalpao = 1;



-- Select 4: Relatório de Usuários da Empresa (CONCAT)
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

select concat('Horário: ', c.hrColeta, case 
	when c.temp < 18 then ' Alerta de temperatura.'
    when c.temp > 23 then' Alerta de temperatura.'
    else ' Temperatura controlada.' end, ' Sensor: ', s.idSensor ) as 'Histórico de Avisos'
    from coleta c join sensor s on c.fkSensor = s.idSensor;
    
select concat('Horário: ', c.hrColeta, case 
	when c.umidade < 40 then ' Alerta de umidade.'
    when c.umidade > 60 then' Alerta de umidade.'
    else ' Umidade controlada.' end, ' Sensor: ', s.idSensor ) as 'Histórico de Avisos'
    from coleta c join sensor s on c.fkSensor = s.idSensor;