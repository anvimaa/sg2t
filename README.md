# Sistema de Mapeamento com Leaflet para Gestão de Terrenos e Espaços - Administração do Uíge

Este projeto tem como objetivo criar um sistema de mapeamento utilizando a biblioteca Leaflet para a gestão eficiente de terrenos e espaços na Administração do Uíge. O sistema oferece uma interface intuitiva e funcionalidades essenciais para facilitar o acompanhamento e a administração desses recursos.

## Acesse o Projeto em Funcionamento

O sistema está disponível online, permitindo que você o explore e experimente suas funcionalidades. [Clique aqui para acessar o projeto](https://projecto-mapa-prisma.vercel.app/).

## Tecnologias Utilizadas

O projeto é desenvolvido utilizando as seguintes tecnologias:

### Backend

- Node.js
- Express
- Prisma ORM
- SQLite (Banco de Dados Local para Desenvolvimento)
- PostgreSQL (Banco de Dados em Produção)

### Frontend
- Hbs (Handlebars) View Engine
- Leaflet.js
- Bootstrap
- AdminLTE
- DataTable

## Como Executar Localmente

1. Clone este repositório:

   ```bash
   git clone https://github.com/anvimaa/projecto-mapa-prisma.git
   ```

2. Instale as dependências e inicialize o PrismaClient:

   ```bash
   cd seu-repositorio
   npm install
   npx prisma migrate dev --name "Inicial"
   ```

3. Execute o aplicativo localmente:

   ```bash
   npm server.js
   ```

4. Abra o navegador e acesse `http://localhost:3000` para visualizar o sistema em execução.

## Contribuições

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests para melhorar o projeto.

## Licença

Este projeto é licenciado sob a [Licença MIT](LICENSE). Sinta-se livre para utilizar, modificar e distribuir conforme necessário.
