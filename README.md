# Devil's Advocate

A premium spirits and cocktails e-commerce website built with Next.js 14.

![Devil's Advocate](https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=1200)

## Features

- 🍾 Browse premium spirits, wines, and cocktails
- 🛒 Full shopping cart and checkout experience
- 👤 User authentication and profile management
- 📦 Order tracking and history
- ⭐ Product reviews and ratings
- 📱 Fully responsive design

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS
- **Authentication**: JWT + Session cookies
- **Deployment**: Docker

## Getting Started

### Prerequisites

- Node.js 18+
- Docker and Docker Compose
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd devils-advocate
```

2. Install dependencies:
```bash
npm install
```

3. Start the database:
```bash
docker-compose up -d db
```

4. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

5. Initialize the database:
```bash
npx prisma db push
npm run db:seed
```

6. Start the development server:
```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### Using Docker

To run the entire application in Docker:

```bash
docker-compose up -d
```

This will start both the PostgreSQL database and the Next.js application.

## Default Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@devilsadvocate.bar | admin123 |
| Customer | john@example.com | password |
| Customer | jane@example.com | password |

## Project Structure

```
devils-advocate/
├── src/
│   ├── app/           # Next.js App Router pages
│   ├── components/    # React components
│   └── lib/           # Utility functions
├── prisma/            # Database schema and seeds
├── public/            # Static assets
└── docker-compose.yml # Docker configuration
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed database with sample data |
| `npm run db:studio` | Open Prisma Studio |

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | - |
| `JWT_SECRET` | Secret for JWT signing | - |
| `SESSION_SECRET` | Secret for session cookies | - |
| `NEXT_PUBLIC_APP_URL` | Application URL | http://localhost:3000 |

## License

This project is for educational purposes only.

---

**Must be 21+ to purchase alcoholic beverages.**






## Session signing configuration

Set `JWT_SECRET` to a cryptographically random value of at least 32 bytes before starting the app (for example, generate one with `openssl rand -hex 32`). No built-in signing key is accepted. Keep the value out of source control.

The v2 signed cookie format invalidates old JWTs and unsigned session cookies: users must log in again when this fix is deployed. Both cookies are HttpOnly. Account roles are loaded from current database records on each authenticated request.

Run focused tests with `node --test tests/*.test.cjs`.
