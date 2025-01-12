# FeastFind API

## Getting Started

Copy and edit `.env` file:

```sh
cp .env.example .env
```

Setup database:

```sh
# Run database only
docker:up
```

Install dependencies:

```sh
bun install
```

Migrate database and generate Prisma Client:

```sh
bun db:migrate
# prisma migrate dev && prisma generate
```

Seed initial products:

```sh
bun db:seed
# prisma db seed
```

Check data on studio:

```sh
bun db:studio
# prisma studio
```

Run development server:

```sh
bun dev
# bun run --hot src/index.ts
```

Open <http://localhost:3000>.

## Production

Make sure the `DATABASE_URL` is configured in `.env` file for usage with Docker Compose.

Build the Docker image:

```sh
bun docker:build
# docker compose up -d --build
```

If only run the Docker container:

```sh
bun docker:up
# docker compose up -d
```

Open <http://localhost:3000>.

## ERD

```mermaid
erDiagram
    USER {
        string id PK
        string name
        string username
        string email
        string avatarURL
        string createdAt
        string updatedAt
    }

    PASSWORD {
        string id PK
        string hash
        string userId FK
    }

    PLACE {
        string id PK
        string slug
        string name
        string description
        decimal priceMin
        decimal priceMax
        string address
        float latitude
        float longitude
        string createdAt
        string updatedAt
        string userId FK
        string cityId FK
    }

    MENU_ITEM {
        string id PK
        string slug
        string name
        string description
        string createdAt
        string updatedAt
        string placeId FK
        string userId FK
    }

    MENU_ITEM_IMAGE {
        string id PK
        string url
        string menuItemId FK
        string createdAt
        string updatedAt
    }

    MENU_ITEM_REVIEW {
        string id PK
        string menuItemId FK
        string userId FK
        int rating
        string comment
        string createdAt
        string updatedAt
    }

    CITY {
        string id PK
        string slug
        string name
        float latitude
        float longitude
        string createdAt
        string updatedAt
    }

    USER ||--o| PASSWORD : has
    USER ||--o| PLACE : owns
    USER ||--o| MENU_ITEM : creates
    USER ||--o| MENU_ITEM_REVIEW : writes
    PLACE ||--o| MENU_ITEM : has
    PLACE ||--o| CITY : located_in
    MENU_ITEM ||--o| MENU_ITEM_IMAGE : contains
    MENU_ITEM ||--o| MENU_ITEM_REVIEW : receives
```
