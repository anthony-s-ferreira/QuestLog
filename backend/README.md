# **Backend - Node.js + Typescript** #

This project is a REST API developed with **Node.js** and **TypeScript**, following the principles of **Clean Architecture**. The application uses the **Express** framework, with integration to the **PostgreSQL** database and **Prisma ORM** for data management. The project is configured to provide a scalable and secure structure, with scripts for build, development, testing, and database migrations.

# Summary
*  [Project Structure](#project-structure)
* [Installation and Configuration](#installation-and-configuration)

    * [Prerequisites](#prerequisites)
    
    * [Dependency Installation](#dependency-installation)
* [Database Configuration](#database-configuration)
* [Available Scripts](#available-scripts)
* [Development Execution](#development-execution)
* [Docker Execution](#docker-execution)
* [Database Structure](#database-structure)
* [Prisma Configuration for Production Environment](#prisma-configuration-for-production-environment)
* [Test Execution](#test-execution)
* [Security](#security)
* [Technologies Used](#technologies-used)
* [Final Considerations](#final-considerations)

# Project Structure
```bash
backend/
├── config/           # Infrastructure layer (database connections, tools)
├── prisma            # Prisma schema definition and migrations
│   ├── migrations/   # Prisma migration files
│   └── schema.prisma # Prisma database schema file
├── src               # Application source code
│   ├── config/       # Environment and database configurations
│   ├── controllers/  # Route controller logic
│   ├── domain/       # Entities and use cases (application domain)
│   ├── middlewares/  # Authentication and authorization layer
│   ├── repositories/ # Repository implementations (data access)
│   ├── routes/       # API route definitions
│   ├── services/     # Business logic
│   ├── validators/   # Entity validation logic
|   └── app.ts        # Main file to initialize the Express server
├── tests             # Application tests
├── .env              # Development environment variables (not included in the repository)
├── jest.config.js    # Test configurations (Jest)
├── package.json      # Application dependencies and scripts
├── README.md         # Project documentation
└── tsconfig.json     # TypeScript configurations
```

# **Installation and Configuration**

## Prerequisites
- Node.js version 20.x or higher
- PostgreSQL installed and configured

## Dependency Installation

1.  Clone the repository and navigate to the `backend` directory
2.  Install the dependencies:

      ```bash
      npm install
      ```

# Database Configuration

1. Create a local PostgreSQL database.

2. In the .env file at the root of the project, add the database connection URL. The format is:

   ```bash
   [DATABASE_URL="postgresql://user:password@localhost:5432/QuestLog"]
   ```
Replace `user`, `password`, and `localhost` with the appropriate values for your database environment.

3. To apply the database migrations, run:

   ```bash
   npm run migrate
   ```

# Secret .env

In the .env file at the root of the project, add the **SECRET_KEY**. The format is:

   ```bash
   [SECRET_KEY="your_secret_key"]
   ```

# **Available Scripts**

```bash
- npm run dev     # Starts the server in development mode with hot-reload (using ts-node-dev).
- npm run test    # Runs unit tests with Jest.
- npm run migrate # Executes database migrations.
```

# **Development Execution**
To start the application in development mode, run:

```bash
npm run dev
```

The API will be available at [http://localhost:3000].

# **Database Structure**

The PostgreSQL database is managed by Prisma ORM, where the schema is defined in the prisma/schema.prisma file. With each schema change, you can generate and apply migrations with the command:

```bash
npm run migrate
```

# **Test Execution**
To run unit tests, use:

```bash
npm run test
```

# **Security**

- Helmet: Middleware to set security-related HTTP headers.
- Dotenv: Manages environment variables securely.

# **Technologies Used**

- Node.js (v20.x)
- TypeScript
- Express (Server framework)
- Prisma ORM (PostgreSQL integration)
- PostgreSQL (Relational database)
- Chai (Unit testing)

# **Final Considerations**

This project was structured to provide a solid and scalable foundation for developing a RESTful API with Node.js and TypeScript, applying the best architecture and security practices.