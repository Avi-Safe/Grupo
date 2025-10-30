-- -----------------------------------------------------
-- Bloco 1: Criação do Banco e Tabelas
-- -----------------------------------------------------

-- Cria o banco de dados e o seleciona para uso.
CREATE DATABASE avisafe_v2;
USE avisafe_v2;

-- Cria a tabela empresa.
CREATE TABLE empresa (
    idEmpresa INT,
   nomeAdministrador VARCHAR(45),
   nomeSocial VARCHAR(45),
   cnpj CHAR(14)
);

CREATE TABLE galpao(
idGalpao INT,
nomeGalpao VARCHAR(45),
fkEmpresa int,
constraint fkGalpaoEmpresa
	foreign key (fkEmpresa) references empresa(idEmpresa)
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
idLocalSensor INT,
nomeLocal VARCHAR(45),
descricao VARCHAR(45),
areaInterna VARCHAR(45)
);

-- Cria a tabela sensor.
CREATE TABLE sensor (
    idSensor INT,
	nomeSensor VARCHAR(45),
    statusSensor VARCHAR(45),
	dtInstalacao DATE,
    fkGalpao INT,
    fkLocalSensor INT,
    
    constraint fkGalpaoSensor 
		foreign key (fkGalpao) references galpao(idGalpao), 
	
    constraint fkLocal
		foreign key (fkLocalSensor) references localSensor(idLocalSensor)
        );
    

-- Cria a tabela Coleta

CREATE TABLE coleta (
idColeta INT,
fkSensor INT,
temp FLOAT (4,2),
umidade INT,
dtColeta DATE,

constraint fkColetaSensor 
	foreign key (fkSensor) references sensor(idSensor),
		primary key(idColeta,fkSensor)
	);
    