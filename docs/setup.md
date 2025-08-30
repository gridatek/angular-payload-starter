# Blog Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm
- PostgreSQL (via Docker)

### Installation

1. **Start Database**
   ```bash
   pnpm db:start
   ```

2. **Install Dependencies**
   ```bash
   pnpm install
   ```

3. **Start Development**
   ```bash
   # Start both apps
   pnpm dev

   # Or start individually
   pnpm --filter backend dev
   pnpm --filter frontend start
   ```

### Access Points
- **Frontend**: http://localhost:4200
- **Payload Admin**: http://localhost:3000/admin
- **API**: http://localhost:3000/api

## 📝 Content Management

### First Time Setup

1. **Create Admin User**
    - Visit http://localhost:3000/admin
    - Create your first admin account

2. **Add Content**
    - **Categories**: Create categories first
    - **Posts**: Create posts and set status to "Published"
    - **Settings**: Configure site name and description

### Content Structure

**Posts:**
- Title, slug (auto-generated)
- Rich text content
- Excerpt for previews
- Categories and tags
- Published/Draft status

**Categories:**
- Name, slug (auto-generated)
- Optional description and color
- Hierarchical support

## 🔧 Development

### CORS Issues
If you get CORS errors, use Angular proxy:

1. Create `apps/frontend/proxy.conf.json`:
   ```json
   {
     "/api/*": {
       "target": "http://localhost:3000",
       "secure": false,
       "changeOrigin": true
     }
   }
   ```

2. Update `angular.json` serve config:
   ```json
   "serve": {
     "configurations": {
       "development": {
         "proxyConfig": "proxy.conf.json"
       }
     }
   }
   ```

3. Change API URL in BlogService to `/api`

### Troubleshooting

**Empty list?**
- Check posts are "Published" status
- Verify API endpoints: http://localhost:3000/api/posts
- Check browser console for errors

**Build errors?**
- Run `pnpm install` in both apps
- Restart dev servers
- Check TypeScript errors

## 📁 Project Structure

```
blog-monorepo/
├── apps/
│   ├── frontend/          # Angular 17+ app
│   └── backend/           # Payload 3 CMS
├── packages/              # Shared packages (optional)
└── docker-compose.yml     # PostgreSQL setup
```

## 🎨 Features

- **Responsive Design**: Mobile-first Tailwind CSS
- **Rich Editor**: Lexical editor for content
- **SEO Ready**: Meta tags and structured data
- **Media Management**: Image upload and optimization
- **Role-based Access**: Admin, Editor, Author roles

## 🚀 Production

```bash
# Build for production
pnpm build

# Environment variables needed:
# DATABASE_URL, PAYLOAD_SECRET
```