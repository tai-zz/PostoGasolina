# Sistema Posto

Sistema desktop para gerenciamento de posto de combustíveis, desenvolvido com Electron e PostgreSQL.

## Sobre o projeto

O **Sistema Posto** foi criado para facilitar o controle de informações operacionais de um posto de combustíveis, permitindo o cadastro e acompanhamento de dados importantes do dia a dia.

A aplicação conta com interface desktop moderna, suporte a tema claro/escuro, geração de relatórios por data e exportação em PDF.

## Funcionalidades

- Login de usuário
- Cadastro de usuários
- Cadastro de postos
- Registro de coleta de preços
- Registro de revendas
- Relatório por data
- Geração de PDF para visualização e impressão
- Alternância entre modo claro e modo escuro

## Tecnologias utilizadas

- Electron
- Node.js
- PostgreSQL
- JavaScript
- HTML
- CSS

## Estrutura do projeto
<img width="1179" height="691" alt="image" src="https://github.com/user-attachments/assets/4ca2b1fe-526c-4169-8426-0b70f047e970" />
<img width="1183" height="692" alt="image" src="https://github.com/user-attachments/assets/50fc464b-1035-40ea-afd7-6be5211b2300" />
<img width="1182" height="694" alt="image" src="https://github.com/user-attachments/assets/302993ff-b02b-4018-83f0-be50a71613dd" />
<img width="1178" height="689" alt="image" src="https://github.com/user-attachments/assets/32ffa576-8917-42a7-b2c4-4320075a0b67" />
<img width="1169" height="573" alt="image" src="https://github.com/user-attachments/assets/6f6787ce-3279-4719-a2b8-c3406a2be9dc" />






# Como iniciar a aplicação
npm start
Relatórios
O sistema possui uma tela de Relatório por Data, onde é possível:

Selecionar uma data específica
Visualizar os registros do dia
Gerar um PDF automaticamente
Abrir o PDF no visualizador padrão do sistema
Melhorias futuras
Controle de permissões por tipo de usuário
Dashboard com indicadores
Filtros avançados nos relatórios
Exportação para Excel
Empacotamento da aplicação para instalação
```bash
sistema-posto/
├── controller/
├── css/
├── dao/
├── database/
├── service/
├── util/
├── views/
├── main.js
├── preload.js
├── package.json
Como executar o projeto
1. Clone o repositório
git clone <https://github.com/tai-zz/PostoGasolina>
cd sistema-posto
2. Instale as dependências
npm install
3. Configure o banco PostgreSQL
Crie um banco com o nome:

postogasolina
Configure também as credenciais do PostgreSQL no arquivo de conexão ou por variáveis de ambiente.

Exemplo atual de configuração:

DB_USER
DB_HOST
DB_NAME
DB_PASSWORD
DB_PORT
Estrutura básica das tabelas
Tabela usuario
CREATE TABLE usuario (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    tipo_usuario INTEGER NOT NULL,
    criado_em TIMESTAMP DEFAULT NOW()
);
Tabela posto
CREATE TABLE posto (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(120) NOT NULL,
    cnpj VARCHAR(20) NOT NULL UNIQUE,
    endereco VARCHAR(200),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    estado VARCHAR(2),
    criado_em TIMESTAMP DEFAULT NOW()
);
Tabela revenda
CREATE TABLE revenda (
    id SERIAL PRIMARY KEY,
    posto_id INTEGER NOT NULL,
    data_revenda DATE NOT NULL,
    tipo_combustivel VARCHAR(30) NOT NULL,
    quantidade NUMERIC(10,2) NOT NULL,
    valor_total NUMERIC(12,2) NOT NULL,
    criado_em TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_revenda_posto
        FOREIGN KEY (posto_id)
        REFERENCES posto(id)
        ON DELETE CASCADE
);
Tabela coleta_preco
CREATE TABLE coleta_preco (
    id SERIAL PRIMARY KEY,
    posto_id INTEGER NOT NULL,
    data_coleta DATE NOT NULL,
    tipo_combustivel VARCHAR(30) NOT NULL,
    preco NUMERIC(10,2) NOT NULL,
    criado_em TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_coleta_posto
        FOREIGN KEY (posto_id)
        REFERENCES posto(id)
        ON DELETE CASCADE
);



Desenvolvido por Tai 
