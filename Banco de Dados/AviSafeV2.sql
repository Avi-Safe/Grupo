-- Cria o banco de dados e o seleciona para uso.
CREATE DATABASE avisafe_v2;
USE avisafe_v2;

-- Cria a tabela empresa.
CREATE TABLE empresa (
idEmpresa INT PRIMARY KEY AUTO_INCREMENT,
nomeAdministrador VARCHAR(45),
cnpj char(14),
telefone char(13),
email varchar(45),
senha varchar(20)
);

-- Cria a tabela usuario.
CREATE TABLE usuario (
idUsuario INT,
fkEmpresa INT,
nome VARCHAR(45),
permissao int,
email VARCHAR(45),
senha varchar(20),


FOREIGN KEY (fkEmpresa) REFERENCES empresa(idEmpresa),
primary key(fkEmpresa,idUsuario)
);



-- Cria a tabela sensor.
CREATE TABLE sensor (
idSensor INT,
fkEmpresa INT,
nomeSensor VARCHAR(45),



FOREIGN KEY (fkEmpresa) REFERENCES empresa(idEmpresa),
primary key(idSensor,fkEmpresa)
);

-- Cria a tabela temperatura.
CREATE TABLE temperatura (
idTemperatura INT,
fkSensor INT,
temp FLOAT(4,2),
dtColeta DATE,
horaColeta TIME,



FOREIGN KEY (fkSensor) REFERENCES sensor(idSensor),
primary key(idTemperatura,fkSensor)
);

-- Cria a tabela umidade.
CREATE TABLE umidade (
idUmidade INT,
fkSensor INT,
umidade INT,
dtColeta DATE,
horaColeta TIME,



FOREIGN KEY (fkSensor) REFERENCES sensor(idSensor),
primary key(idUmidade,fkSensor)
);

-- Insere dados de exemplo.
INSERT INTO empresa (nomeAdministrador, cnpj, telefone, email, senha) VALUES
('João da Silva', 123456789101234, 12345678910123, 'joaodasilva@gmail.com','senha123'),
('Maria Oliveira',23456789101234, 23456789012345, 'mariaoliveira@gmail.com','sena234');

INSERT INTO usuario (idUsuario, fkEmpresa, nome, permissao, email, senha) VALUES
('Granja Poedeiras Felizes', 'contato@granjafeliz.com', '11222333000144', '11987654321', 1),
('Ovos do Campo S.A.', 'admin@ovosdocampo.com', '44555666000177', '19912345678', 2);

INSERT INTO sensor (idSensor, fkEmpresa,nomeSensor) VALUES
(1,'Sensor Aviário Setor A1', 1),
(2,'Sensor Aviário Setor A2', 1),
(3,'Sensor Galpão Principal', 2);

INSERT INTO temperatura (idTemperatura, fkSensor, temp, dtColeta, horaColeta) VALUES
(1, 24.5, '2025-10-06', '14:00:00', 1),
(2, 30.2, '2025-10-06', '15:00:00', 1),
(3, 23.8, '2025-10-06', '14:00:00', 3);

INSERT INTO umidade () VALUES
(1, 60, '2025-10-06', '14:00:00', 1),
(2, 55, '2025-10-06', '15:00:00', 1),
(3, 65, '2025-10-06', '14:00:00', 3);

-- Consulta os sensores e seus administradores responsáveis.
SELECT
s.nomeSensor,
e.nomeAdministrador,
e.cargo
FROM sensor AS s
JOIN empresa AS e ON s.fkEmpresa = e.idEmpresa;

-- Junta os dados de temperatura e umidade em uma única consulta.
SELECT
t.dtColeta AS data_coleta,
t.horaColeta AS hora_coleta,
s.nomeSensor,
t.temp AS temperatura,
u.umidade
FROM temperatura AS t
JOIN umidade AS u
ON t.fkSensor = u.fkSensor AND t.dtColeta = u.dtColeta AND t.horaColeta = u.horaColeta
JOIN sensor as s
ON t.fkSensor = s.idSensor;

-- Consulta de alerta para temperaturas altas.
SELECT
e.nomeAdministrador AS responsavel_empresa,
s.nomeSensor AS local_do_sensor,
t.temp AS temperatura_registrada,
t.dtColeta,
t.horaColeta
FROM temperatura AS t
JOIN sensor AS s ON t.fkSensor = s.idSensor
JOIN empresa AS e ON s.fkEmpresa = e.idEmpresa
WHERE t.temp > 28.0;


