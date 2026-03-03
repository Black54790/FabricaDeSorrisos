# 🎯 Fábrica de Sorrisos

Plataforma completa para catálogo e gestão de brinquedos, composta por:

* Aplicativo Desktop (Windows Forms) para administração
* Site Web (ASP.NET Core MVC) com área pública e área Admin
* API REST (ASP.NET Core) com autenticação JWT
* Camadas de Aplicação, Domínio e Infraestrutura (EF Core, Identity)

---

## 🎓 Contexto Acadêmico

Projeto desenvolvido em grupo durante o **Curso Técnico em Informática**, com o objetivo de aplicar na prática conceitos de:

* Arquitetura em camadas
* Desenvolvimento Web com ASP.NET Core
* Criação de API REST
* Autenticação e autorização com JWT
* Modelagem e persistência com Entity Framework Core
* Integração entre múltiplas aplicações (Web, Desktop e API)
* Trabalho em equipe com divisão de responsabilidades

---

## 👥 Equipe do Projeto

* **Marcos Vinicíus Moura da Silva** – Modelagem e estruturação do banco de dados, desenvolvimento da aplicação Desktop (Windows Forms) e integração com a API.
* **Enzo Alves Macedo** – Desenvolvimento da aplicação Desktop (Windows Forms).
* **Letícia Peres Rodrigues** – Desenvolvimento Back-end (API), Front-end (Web) e modelagem de banco de dados.
* **Camily Vitória Arrais dos Santos** – Desenvolvimento Front-end (Web).

---

## 👨‍💻 Minha Atuação

Atuei principalmente na:

* Modelagem do banco de dados
* Estruturação das entidades e relacionamentos
* Desenvolvimento das funcionalidades do Desktop
* Integração do Desktop com a API utilizando autenticação JWT
* Implementação de CRUDs administrativos

---

## 🏗️ Arquitetura e Projetos

* **FabricaDeSorrisos.Domain**: entidades e regras básicas
* **FabricaDeSorrisos.Application**: contratos de serviços e DTOs
* **FabricaDeSorrisos.Infrastructure**: EF Core, Identity, repositórios, serviços
* **FabricaDeSorrisos.Api**: API REST
* **FabricaDeSorrisos.Web**: site MVC com área Admin
* **FabricaDeSorrisos.UI**: aplicativo Desktop Windows Forms

---

## 🚀 Visão Geral

* Catálogo com categorias, subcategorias, marcas, personagens e faixas etárias
* Gestão de usuários, produtos, imagens e status (ativo/inativo)
* Busca, filtros e paginação
* Upload e exibição de imagens
* Autenticação via JWT na API e consumo pelo Desktop/Web

---

## 🛠 Tecnologias Utilizadas

* C#
* .NET 10 (SDK preview)
* ASP.NET Core
* ASP.NET Core MVC
* Windows Forms
* Entity Framework Core
* SQL Server LocalDB
* Identity
* Swagger
* Guna.UI2.WinForms

---

## ⚙️ Requisitos

* .NET 10 (SDK preview)
* SQL Server LocalDB
* Windows para execução do Desktop

---

## 🌐 Configuração de URLs

* API: [http://localhost:5259](http://localhost:5259)
* Web: [http://localhost:5179](http://localhost:5179)

APISettings no Desktop:

* BaseUrl: [http://localhost:5259/api/](http://localhost:5259/api/)
* WebBaseUrl: [http://localhost:5179](http://localhost:5179)
* WebBaseUrlHttps: [https://localhost:5179](https://localhost:5179)

---

## ▶️ Como Executar

### API

```bash
dotnet run --project FabricaDeSorrisos.Api
```

### Web

```bash
dotnet run --project FabricaDeSorrisos.Web
```

Área Admin disponível em:

```
/Admin
```

### Desktop

```bash
dotnet run --project FabricaDeSorrisos.UI
```

---

## 🗄 Banco de Dados

* ConnectionStrings definidas em `appsettings.Development.json`
* Migrações e seed realizados pela camada de Infraestrutura

---

## 🔐 Autenticação

* API protegida com JWT
* Configurações (issuer, audience, chave e expiração) em `appsettings.Development.json`
* Desktop injeta Bearer Token via ApiClient + UserSession
* CORS configurado para ambiente de desenvolvimento

---

## 📡 Principais Endpoints

### Brinquedos

* GET /api/brinquedos?pageIndex=&pageSize=&termoBusca=&incluirInativos=
* GET /api/brinquedos/{id}
* POST /api/brinquedos
* PUT /api/brinquedos/{id}

### Categorias

* GET /api/categorias
* POST /api/categorias
* PUT /api/categorias/{id}
* DELETE /api/categorias/{id}

### Subcategorias

* GET /api/subcategorias
* POST /api/subcategorias
* PUT /api/subcategorias/{id}
* DELETE /api/subcategorias/{id}

### Marcas

* GET /api/marcas

### Personagens

* GET /api/personagens

### Usuários

* GET /api/usuarios
* PUT /api/usuarios/{id}

---

## 🖥 Funcionalidades do Desktop

* Listagem com ordenação, filtros e busca
* Criar/Editar brinquedos com imagem, preço e estoque
* Alternar status ativo/inativo
* Gestão de categorias, subcategorias, marcas e personagens
* Gestão de usuários com validações

---

## 🔒 Boas Práticas e Segurança

* Não armazenar segredos no repositório
* JWT com validações e expiração
* CORS restrito durante desenvolvimento
* Separação clara de responsabilidades entre camadas

---

## 🧰 Comandos Úteis

```bash
dotnet build FabricaDeSorrisos.Api
dotnet build FabricaDeSorrisos.Web
dotnet build FabricaDeSorrisos.UI
```

```bash
dotnet run --project FabricaDeSorrisos.Api
dotnet run --project FabricaDeSorrisos.Web
dotnet run --project FabricaDeSorrisos.UI
```

---

## 🚧 Roadmap

* Checkout e carrinho no Web
* Relatórios e dashboards administrativos
* Implementação de testes automatizados
