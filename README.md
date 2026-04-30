# 🔐 Express Server App — Users & Tasks

![Node](https://img.shields.io/badge/node-22.19.0-339933?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-black?logo=express&logoColor=white)
![TypeORM](https://img.shields.io/badge/TypeORM-0.3+-F05032)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-✔-4169E1?logo=postgresql&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-✔-3E67B1)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-9+-4B32C3?logo=eslint&logoColor=white)

A simple demonstration backend app that consists of:
- 🔑 Authentication (Auth)
- 🧑‍🚀 Users
- ✅ Tasks

The project is written in TypeScript, uses Express 5, TypeORM, PostgreSQL, Zod for validation, and follows a clean modular structure with Dependency Injection via module composers.

---

## 🚀 Quick Start

Prerequisites:
- Node.js v22.19.0
- Docker + Docker Compose

Steps:
1) Create or request a .env file with required variables (see env.example)
2) Start infrastructure in Docker: `docker compose up`
3) Install dependencies: `npm i`
4) Run the app:
   - Dev: `npm run start:dev`
   - Prod: `npm run start:prod`

Useful scripts:
- Build: `npm run build`
- Lint: `npm run lint` / `npm run lint:fix`

Default ports:
- App: `APP_PORT=5001`
- Postgres: exposed on host as `DB_PORT` from `.env` (mapped to container 5432)

---

## 🧰 Tech Stack

- 🟢 Node.js 22.19.0
- ⚡ Express 5
- 🗃️ TypeORM
- 🐘 PostgreSQL
- 🧩 Zod (validation)
- 🔐 JWT (auth)
- 🧪 TypeScript with strict mode and verbatimModuleSyntax
- 🧰 ESLint + Prettier config
- 🐳 Docker Compose for Postgres

---

## 🧭 Project Structure

Top-level directories you’ll interact with most:
- `app` — application bootstrap and global composition (things not reused by modules)
- `infrastructure` — infrastructural services (ConfigService, Database, Logger, etc.)
- `shared` — reusable building blocks (types, utils, middlewares, schemas)
- `modules` — main feature modules where most business logic lives
- `ambient` — ambient type augmentations (e.g., Express Request extension)

Core feature modules:
- `auth`
- `user`
- `task`

---

## 🧱 Architectural Notes

- Repository pattern: all ORM/database queries are isolated inside Repository classes. Only repositories talk to TypeORM.
- Services expose business logic and use repositories to access the database.
- Controllers interact with services.
- Validation is done with Zod via middlewares. Controllers receive already validated and typed data.
- Dependency Injection is realized via per-module composers + a global composer.

---

## 🧪 Validation & Typing

- Validation: Zod + middlewares.
- If there is a Zod schema, the TypeScript type must be inferred from it via `z.infer`.
- If no Zod schema exists, use regular TypeScript types.

Example:
```ts
import { z } from 'zod';

export const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type SignInDto = z.infer<typeof SignInSchema>;
```

---

## 🔎 Request Typing and Extended Express.Request

The Express `Request` type is augmented globally (see `src/ambient/express.d.ts`) with:
- `user?: ActiveUser` — current user injected by auth middleware
- `validated?: unknown` — storage for validated, transformed, typed data

Controllers must use the custom `TypedRequest` instead of `express.Request` to get strong typing for `validated`:

```ts
import type { Response } from 'express';
import type { TypedRequest } from '@types';

export class TaskController {
  findOne = async (
    req: TypedRequest<{ params: { id: number } }>,
    res: Response,
  ) => {
    const user = req.user!;
    const taskId = req.validated.params.id;
    // ...
    res.status(200).json({});
  };
}
```

---

## 🧩 Imports, Barrels and Paths

Rules for imports:
1) Within a module — use only relative imports.
2) Between modules — use absolute imports via `tsconfig.paths` aliases.
3) Do not import deep internals of another module; import only from the module barrel (its `index.ts`).

Bad:
```ts
// ❌ Deep import from another module (forbidden)
import { UserEntity } from "@modules/user/entities/user.entity.js";
```

Good:
```ts
// ✅ Only from the module API (barrel)
import { UserEntity } from "@modules/user";
```

Barrel files (re-export `index.ts`):
- Exist only at the root of a module to expose its public API.
- Inside a module, do not re-export; import directly from files using relative paths.

Path aliases (see `tsconfig.json`):
- `@modules/*`, `@infrastructure/*`, `@app/*`, `@schemas/*`, `@utils/*`, `@ambient/*`, `@types`.

---

## 🏷️ verbatimModuleSyntax rule (types-only imports)

The project enforces TypeScript’s `verbatimModuleSyntax: true`. If something is used only as a type — import it as a type.

Bad:
```ts
// ❌ Runtime import when only types are needed
import { ConfigService } from '@infrastructure/config-service';
```

Good:
```ts
// ✅ Type-only import
import type { ConfigService } from '@infrastructure/config-service';
```

You’ll see this pattern across the codebase (e.g., controllers and services use `import type {...}` where appropriate).

---

## ⚙️ Environment & ConfigService

Access to environment variables is centralized via `ConfigService` (`src/infrastructure/config-service`).
- It validates `.env` using Zod (`env.schema.ts`) and exposes a typed `env` object.
- When you change `.env`, you must update both validation (`env.schema.ts`) and typing (see `types.ts`/`environment.d.ts` in the same folder).

env variables (see `env.example`):
- APP_PORT, APP_ENV
- DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE
- JWT_SECRET, JWT_SALT_ROUNDS, ACCESS_TOKEN_TTL, REFRESH_TOKEN_TTL

Example usage:
```ts
const port = configService.env.APP_PORT; // number (coerced and validated)
```

---

## 🧪 Dependency Injection & Composers

Each module has its own composer that:
- Initializes and wires internal dependencies (repositories, services, controllers)
- Builds the module router
- Returns the router and other instances needed by other modules

There’s a global composer in `app` that:
- Initializes infrastructural services (Logger, Config, Database)
- Runs module composers
- Returns composed module routers and cross-cutting instances (e.g., access token guard)

Example (simplified):
```ts
// app/composers/modules.composer.ts
const user = runUserModuleComposer({ dataSource });
const auth = runAuthModuleComposer({ dataSource, configService, userService: user.userService });
const task = runTaskModuleComposer({ dataSource });

return { moduleRouters: { userRouter: user.userRouter, authRouter: auth.authRouter, taskRouter: task.taskRouter }, accessTokenGuard: auth.accessTokenGuard };
```

Routing aggregation:
```ts
// app/composers/routers.composer.ts
rootRouter.use('/auth', moduleRouters.authRouter);
rootRouter.use('/users', [accessTokenGuard.canActivate], moduleRouters.userRouter);
rootRouter.use('/tasks', [accessTokenGuard.canActivate], moduleRouters.taskRouter);
```

---

## 🧱 Module Responsibilities

- Repository: isolates TypeORM and database queries.
- Service: uses repositories to implement business logic and DB access.
- Controller: uses services; no direct ORM calls.

---

## 🐳 Docker

A PostgreSQL instance is provided via Docker Compose. The service reads credentials from your `.env` and exposes Postgres on `${DB_PORT}:5432`.

```yaml
services:
  postgres:
    image: postgres:17.5
    ports:
      - "${DB_PORT}:5432"
    environment:
      POSTGRES_USER: ${DB_USERNAME}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_DATABASE}
    env_file:
      - .env
    volumes:
      - postgres_data:/var/lib/postgresql/data
```

---

## 📜 License

ISC

---

## 🙌 Notes

- This is a small demo application focused on structure and conventions.
- Feel free to extend modules or add new ones following the same patterns.
