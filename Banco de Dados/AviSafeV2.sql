-- -----------------------------------------------------
-- Bloco 1: Criação do Banco e Tabelas
-- -----------------------------------------------------

-- Cria o banco de dados e o seleciona para uso.
CREATE DATABASE avisafe_v2;
USE avisafe_v2;

-- Cria a tabela empresa.
CREATE TABLE empresa (
    idEmpresa INT PRIMARY KEY AUTO_INCREMENT,
    nomeAdministrador VARCHAR(45),
    cnpj CHAR(14),
    telefone CHAR(13),
    email VARCHAR(45),
    senha VARCHAR(20)
);

-- Cria a tabela usuario.
CREATE TABLE usuario (
    idUsuario INT,
    fkEmpresa INT,
    nome VARCHAR(45),
    permissao INT,
    email VARCHAR(45),
    senha VARCHAR(20),
    FOREIGN KEY (fkEmpresa) REFERENCES empresa(idEmpresa),
    PRIMARY KEY(fkEmpresa, idUsuario)
);

-- Cria a tabela sensor.
-- A chave primária é composta por (idSensor, fkEmpresa).
CREATE TABLE sensor (
    idSensor INT,
    fkEmpresa INT,
    nomeSensor VARCHAR(45),
    FOREIGN KEY (fkEmpresa) REFERENCES empresa(idEmpresa),
    PRIMARY KEY(idSensor, fkEmpresa)
);

-- Cria a tabela temperatura.
-- (CORRIGIDO: Adicionada fkEmpresa para conectar com a chave composta de sensor)
CREATE TABLE temperatura (
    idTemperatura INT,
    fkSensor INT,
    temp FLOAT(4,2),
    dtColeta DATE,
    horaColeta TIME,
    fkEmpresa INT, -- Coluna necessária para o JOIN
    FOREIGN KEY (fkSensor, fkEmpresa) REFERENCES sensor(idSensor, fkEmpresa),
    PRIMARY KEY(idTemperatura, fkSensor, fkEmpresa)
);

-- Cria a tabela umidade.
-- (CORRIGIDO: Adicionada fkEmpresa para conectar com a chave composta de sensor)
CREATE TABLE umidade (
    idUmidade INT,
    fkSensor INT,
    umidade INT,
    dtColeta DATE,
    horaColeta TIME,
    fkEmpresa INT, -- Coluna necessária para o JOIN
    FOREIGN KEY (fkSensor, fkEmpresa) REFERENCES sensor(idSensor, fkEmpresa),
    PRIMARY KEY(idUmidade, fkSensor, fkEmpresa)
);

-- -----------------------------------------------------
-- Bloco 2: Inserção de Dados (INSERTs Corrigidos)
-- -----------------------------------------------------

-- Insere dados de exemplo.
INSERT INTO empresa (nomeAdministrador, cnpj, telefone, email, senha) VALUES
('João da Silva', '12345678910123', '1234567891012', 'joaodasilva@gmail.com','senha123'),
('Maria Oliveira', '23456789101234', '2345678901234', 'mariaoliveira@gmail.com','sena234');

-- (Valores originais estavam na ordem errada)
INSERT INTO usuario (idUsuario, fkEmpresa, nome, permissao, email, senha) VALUES
(1, 1, 'Funcionario Granja Felizes', 1, 'contato@granjafeliz.com', 'senha111'),
(1, 2, 'Admin Ovos do Campo', 2, 'admin@ovosdocampo.com', 'senha222');

-- (Valores originais estavam na ordem errada)
INSERT INTO sensor (idSensor, fkEmpresa, nomeSensor) VALUES
(1, 1, 'Sensor Aviário Setor A1'),
(2, 1, 'Sensor Aviário Setor A2'),
(3, 2, 'Sensor Galpão Principal');

-- (Valores originais estavam na ordem errada e sem fkEmpresa)
INSERT INTO temperatura (idTemperatura, fkSensor, temp, dtColeta, horaColeta, fkEmpresa) VALUES
(1, 1, 24.5, '2025-10-06', '14:00:00', 1),
(2, 1, 30.2, '2025-10-06', '15:00:00', 1),
(3, 3, 23.8, '2025-10-06', '14:00:00', 2);

-- (Valores originais estavam na ordem errada e sem fkEmpresa)
INSERT INTO umidade (idUmidade, fkSensor, umidade, dtColeta, horaColeta, fkEmpresa) VALUES
(1, 1, 60, '2025-10-06', '14:00:00', 1),
(2, 1, 55, '2025-10-06', '15:00:00', 1),
(3, 3, 65, '2025-10-06', '14:00:00', 2);

-- -----------------------------------------------------
-- Bloco 3: Consultas (SELECTs)
-- -----------------------------------------------------

-- 1. Mostra o sensor e o administrador responsável.
SELECT
    s.nomeSensor,
    e.nomeAdministrador
FROM sensor AS s
JOIN empresa AS e ON s.fkEmpresa = e.idEmpresa;

-- 2. Unifica leituras de temperatura e umidade do mesmo instante.
SELECT
    t.dtColeta AS data_coleta,
    t.horaColeta AS hora_coleta,
    s.nomeSensor,
    t.temp AS temperatura,
    u.umidade
FROM temperatura AS t
JOIN umidade AS u
    ON t.fkSensor = u.fkSensor
    AND t.fkEmpresa = u.fkEmpresa -- Join pela chave composta
    AND t.dtColeta = u.dtColeta 
    AND t.horaColeta = u.horaColeta
JOIN sensor as s
    ON t.fkSensor = s.idSensor AND t.fkEmpresa = s.fkEmpresa; 

-- 3. Alerta de temperaturas acima de 28 graus.
SELECT
    e.nomeAdministrador AS responsavel_empresa,
    s.nomeSensor AS local_do_sensor,
    t.temp AS temperatura_registrada,
    t.dtColeta,
    t.horaColeta
FROM temperatura AS t
JOIN sensor AS s 
    ON t.fkSensor = s.idSensor AND t.fkEmpresa = s.fkEmpresa
JOIN empresa AS e 
    ON s.fkEmpresa = e.idEmpresa
WHERE t.temp > 28.0;

-- 4. Mostra todos os usuários que pertencem à empresa 1.
SELECT nome, email, permissao
FROM usuario
WHERE fkEmpresa = 1;

-- 5. Calcula a temperatura média de cada sensor.
SELECT
    s.nomeSensor,
    AVG(t.temp) AS media_temperatura
FROM temperatura AS t
JOIN sensor AS s
    ON t.fkSensor = s.idSensor AND t.fkEmpresa = s.fkEmpresa
GROUP BY s.nomeSensor, s.idSensor, s.fkEmpresa;

-- 6. Conta quantos sensores cada empresa tem.
SELECT
    e.nomeAdministrador,
    COUNT(s.idSensor) AS total_sensores
FROM empresa AS e
LEFT JOIN sensor AS s ON e.idEmpresa = s.fkEmpresa
GROUP BY e.idEmpresa, e.nomeAdministrador;

-- 7. Alerta de umidade baixa (abaixo de 40%).
SELECT
    s.nomeSensor,
    e.nomeAdministrador,
    u.umidade,
    u.dtColeta,
    u.horaColeta
FROM umidade AS u
JOIN sensor AS s ON u.fkSensor = s.idSensor AND u.fkEmpresa = s.fkEmpresa
JOIN empresa AS e ON s.fkEmpresa = e.idEmpresa
WHERE u.umidade < 40;

-- 8. Mostra quais sensores nunca registraram uma temperatura.
SELECT
    s.nomeSensor,
    e.nomeAdministrador
FROM sensor AS s
LEFT JOIN temperatura AS t 
    ON s.idSensor = t.fkSensor AND s.fkEmpresa = t.fkEmpresa
WHERE t.idTemperatura IS NULL;