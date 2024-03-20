# Análise de Métricas de Assinantes

Este projeto é uma aplicação web full-stack desenvolvida para permitir aos usuários carregar planilhas de dados de assinantes e visualizar métricas chave de negócios, como Monthly Recurring Revenue (MRR) e Churn Rate. Utiliza Vue.js no front-end e NestJS no back-end, com visualização de dados através das bibliotecas Chart.js ou D3.js.

## Tecnologias Utilizadas

- **Front-end:** Vue.js
- **Back-end:** NestJS
- **Visualização de Dados:** Chart.js / D3.js
- **Banco de Dados:** MongoDB (opcional, não especificado)
- **Contêineres:** Docker

## Pré-requisitos

Antes de iniciar, você precisa ter o Docker instalado em sua máquina. Visite [Docker](https://www.docker.com/get-started) para instruções de instalação.

## Inicialização do Projeto

Para iniciar o projeto, siga os passos abaixo:

1. **Clone o Repositório**

git clone <URL_DO_REPOSITORIO>
cd <NOME_DO_REPOSITORIO>

2.  **Construa e Inicie os Contêineres**

docker-compose up --build

Este comando constrói as imagens necessárias e inicia os contêineres do front-end e back-end. A primeira execução pode levar alguns minutos.
Acessando a Aplicação

Após a inicialização dos contêineres, a aplicação estará acessível através dos seguintes endereços:

    Front-end: http://localhost:8080
    Back-end: http://localhost:3000

Você pode carregar uma planilha de dados de assinantes através da interface do front-end e visualizar as métricas geradas em gráficos interativos.
Estrutura do Projeto

A estrutura de diretórios do projeto é a seguinte:

    /frontend: Contém o código-fonte do front-end da aplicação.
    /backend: Contém o código-fonte do back-end da aplicação.
    docker-compose.yml: Define os serviços, volumes e outras configurações dos contêineres Docker.
