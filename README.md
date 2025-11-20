# 🔗 LinkShortify

<div align="center">

![LinkShortify Banner](https://img.shields.io/badge/LinkShortify-Production%20Ready-brightgreen?style=for-the-badge)
[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.0-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Redis](https://img.shields.io/badge/Redis-Caching-DC382D?style=for-the-badge&logo=redis)](https://redis.io/)

**A modern, feature-rich link shortener built with Next.js, featuring custom aliases, QR codes, analytics, and more.**

[Live Demo](#) | [Features](#-features) | [Quick Start](#-quick-start) | [Deploy](#-deploy-to-vercel)

</div>

---

## ✨ Features

### Core Functionality

- 🔗 **Link Shortening** - Convert long URLs into short, shareable links
- ✏️ **Custom Aliases** - Create memorable custom short codes
- 🏷️ **Tags** - Organize links with comma-separated tags
- ⏱️ **Link Expiration** - Set automatic expiry times for temporary links
- 📊 **Real-time Analytics** - Track click counts with auto-refreshing dashboard
- 🔍 **Advanced Search** - Filter links by URL, alias, tags, or short code

### User Experience

- 🎨 **Beautiful UI** - Modern design with glassmorphism and smooth animations
- 🌓 **Dark/Light Mode** - Seamless theme switching with persistence
- 📱 **Fully Responsive** - Optimized for desktop, tablet, and mobile
- 📈 **QR Code Generation** - Inline QR codes with download functionality
- ⚡ **Real-time Updates** - 5-second polling for live click tracking

### Technical Features

- 🔐 **JWT Authentication** - Secure user authentication with HTTP-only cookies
- 🚀 **Redis Caching** - Lightning-fast link resolution with Redis
- 🛡️ **Rate Limiting** - Prevent abuse with Redis-based rate limiting (10 links/minute)
- 🗄️ **POSTGRESQL Database** - Lighting fast postgresql db via neon database with Prisma ORM
- 🧹 **Auto Cleanup** - Background job removes expired links every minute
- ✅ **Input Validation** - Zod schema validation for all API endpoints

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Redis instance (local or cloud - [Redis Cloud](https://redis.com/try-free/) recommended)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/link-shortner-ai.git
   cd link-shortner-ai
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="your-super-secret-jwt-key-change-this"
   REDIS_URL="redis://default:password@host:port"
   ```

4. **Initialize the database**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📸 Screenshots

### Landing Page

Beautiful hero section with gradient backgrounds and feature showcase.

### Dashboard

![Dashboard](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=Dashboard+Screenshot)

Create links, manage them, and track analytics in real-time.

### Link Management

- Custom aliases for branded short links
- Tags for easy organization
- QR codes for mobile sharing
- Click analytics

---

## 🛠️ Tech Stack

### Frontend

- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Shadcn UI** - Accessible component library
- **Framer Motion** - Smooth animations
- **React QR Code** - QR code generation

### Backend

- **Next.js API Routes** - Serverless API endpoints
- **Prisma** - Type-safe ORM
- **SQLite** - Embedded database
- **Redis** - Caching and rate limiting
- **Zod** - Schema validation
- **JWT** - Authentication

---

## 📁 Project Structure

```
link-shortner-ai/
├── app/
│   ├── api/
│   │   ├── auth/          # Authentication endpoints
│   │   └── links/         # Link management endpoints
│   ├── dashboard/         # User dashboard
│   ├── login/             # Auth page
│   └── [shortCode]/       # Redirect handler
├── components/
│   ├── ui/                # Shadcn components
│   ├── create-link-form.tsx
│   ├── link-card.tsx
│   ├── edit-link-dialog.tsx
│   ├── qr-code-dialog.tsx
│   └── mode-toggle.tsx
├── lib/
│   ├── auth.ts            # Authentication utilities
│   ├── db.ts              # Prisma client
│   ├── redis.ts           # Redis client
│   ├── ratelimit.ts       # Rate limiting
│   └── cron.ts            # Background jobs
├── prisma/
│   └── schema.prisma      # Database schema
└── .env                   # Environment variables
```

---

## 🌐 Deploy to Vercel

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/link-shortner-ai)

### Manual Deployment

1. **Push to GitHub**

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Import to Vercel**

   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

3. **Configure Environment Variables**

   Add these in Vercel dashboard under Settings → Environment Variables:

   ```
   DATABASE_URL=file:./prisma/production.db
   JWT_SECRET=your-production-jwt-secret
   REDIS_URL=redis://your-redis-cloud-url
   ```

4. **Deploy**

   Vercel will automatically build and deploy your application!

### Important Notes for Production

- **Redis**: Use a managed Redis service like [Redis Cloud](https://redis.com/try-free/) (free tier available)
- **Database**: For production, consider using PostgreSQL instead of SQLite
- **JWT Secret**: Generate a strong, random secret for production
- **HTTPS**: Vercel automatically provides HTTPS for all deployments

---

## 🔧 Configuration

### Database Migration (PostgreSQL for Production)

To use PostgreSQL instead of SQLite:

1. Update `prisma/schema.prisma`:

   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. Update `.env`:

   ```env
   DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
   ```

3. Run migrations:
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

### Rate Limiting

Adjust rate limits in `lib/ratelimit.ts`:

```typescript
await rateLimit(`create_link:${session.id}`, 10, 60); // 10 requests per 60 seconds
```

---

## 📝 API Documentation

### Authentication

**POST** `/api/auth/register`

```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**POST** `/api/auth/login`

```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

### Links

**POST** `/api/links` - Create a short link

```json
{
  "url": "https://example.com/very-long-url",
  "customAlias": "my-link",
  "tags": "work, urgent",
  "expiresIn": 60
}
```

**GET** `/api/links` - Get user's links

**PATCH** `/api/links/[id]` - Update a link

**DELETE** `/api/links/[id]` - Delete a link

**GET** `/[shortCode]` - Redirect to original URL

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Shadcn UI](https://ui.shadcn.com/) - Beautiful UI components
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Redis](https://redis.io/) - In-memory data structure store

---

<div align="center">

**Built with ❤️ using Next.js**

⭐ Star this repo if you find it helpful!

</div>
