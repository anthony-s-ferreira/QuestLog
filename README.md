<h1 align="center"> Sistema de Log de RPG - QuestLog </h1>

<div align="center"> 
    <img src= "https://ordemparanormal.com.br/wp-content/uploads/2021/07/op-logo.png">
</div>

## Descrição
Este sistema é projetado para gerenciar logs de eventos durante sessões de RPG no universo de Ordem Paranormal. Ele permite que mestres e jogadores acompanhem a evolução das campanhas, personagens e eventos de forma organizada.

O backend é desenvolvido em **Express** com **PostgreSQL** para armazenamento dos dados, e o frontend será implementado em **React**.

---

## Funcionalidades
- Cadastro, edição e autenticação de usuários.
- Criação e gerenciamento de mesas RPGs, incluindo associação de personagens às campanhas.
- Registro de eventos ocorridos nas sessões, como ações de personagens ou momentos narrativos marcantes.
- Organização dos eventos por tipo, com descrição detalhada.

---

## Estrutura do Banco de Dados
### Entidades Principais
1. **RPG**
   - `id` (UUID): Identificador único do RPG.
   - `name` (string): Nome do RPG.
   - `master` (string): Nome do mestre responsável.

2. **User**
   - `id` (UUID): Identificador único do usuário.
   - `name` (string): Nome do usuário.
   - `email` (string): Endereço de e-mail.
   - `password` (string): Senha para autenticação.

3. **Character**
   - `id` (UUID): Identificador único do personagem.
   - `name` (string): Nome do personagem.
   - `owner` (UUID): Identificador do jogador proprietário.
   - **Nota:** Informações adicionais podem ser adicionadas conforme a ficha do personagem.

4. **RPG_Character**
   - `rpgId` (UUID): Identificador do RPG.
   - `characterId` (UUID): Identificador do personagem.

5. **Event**
   - `id` (UUID): Identificador único do evento.
   - `createdAt` (timestamp): Data e hora do evento.
   - `characterId` (UUID): Identificador do personagem envolvido.
   - `type` (UUID): Tipo de evento.
   - `description` (string): Descrição detalhada do evento.

6. **Type**
   - `id` (UUID): Identificador único do tipo de evento.
   - `name` (string): Nome do tipo de evento.
   - `description` (string): Descrição detalhada do tipo.

---

## Tecnologias Utilizadas
- **Backend:** Node.js, Express, PostgreSQL
- **Frontend:** React (em desenvolvimento)
- **Banco de Dados:** PostgreSQL

---

## Como Usar
1. Clone este repositório.
2. Instale o docker.
3. Execute o comando:
   ```bash
   docker-compose up
   ```

## Roadmap

- Implementar autenticação de usuários.
- Desenvolver interface para gerenciamento de RPGs e personagens.
- Adicionar funcionalidades de filtro e busca de eventos.
- Melhorar a interface do usuário para facilitar a navegação.
<div align="center">

## Contribuidores

| [<img src="https://avatars.githubusercontent.com/u/72308168?v=4" width=115><br><sub>Anthony Ferreira</sub>](https://github.com/anthony-s-ferreira) |  [<img src="https://avatars.githubusercontent.com/u/109104329?v=4" width=115><br><sub>Bruno Grangeiro</sub>](https://github.com/Bruno-Grangeiro) |
| :---: | :---: 
<div/>