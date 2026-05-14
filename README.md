# হৃদয়ের চা ঘর - Web Application

A complete tea shop web application with customer ordering system and admin panel.

## Features

### Customer Features
- Browse menu with categorized items
- Add items to cart with quantity selection
- Place orders with customer details
- Order confirmation with status tracking

### Admin Features
- Dashboard with daily stats
- Order management (view, update status)
- Menu management (add, edit, delete items)
- Bill generation for completed orders
- Toggle item availability

## Technology Stack

- **Frontend:** React + Vite
- **Backend:** Express.js
- **Database:** SQLite with Prisma ORM
- **Authentication:** JWT

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation

1. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   npx prisma generate
   npx prisma db push
   npm run seed
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

### Running the Application

1. **Start Backend** (Terminal 1)
   ```bash
   cd backend
   npm run dev
   ```
   Server runs on http://localhost:3001

2. **Start Frontend** (Terminal 2)
   ```bash
   cd frontend
   npm run dev
   ```
   App runs on http://localhost:5173

### Production Build

```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```


## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/menu | Get available menu |
| POST | /api/orders | Place new order |
| GET | /api/orders | Get orders (admin) |
| PATCH | /api/orders/:id/status | Update order status |
| POST | /api/orders/:id/bill | Generate bill |
| POST | /api/auth/login | Admin login |

## Menu Categories

- জুস (Juice)
- লাচ্ছি (Lassi)
- মিল্ক শেক (Milkshake)
- কোল্ড কফি (Cold Coffee)
- রং চা (Color Tea)
- দুধ চা (Milk Tea)
- কফি (Coffee)

## Project Structure

```
/home/nkb/Desktop/Pr/
├── backend/
│   ├── src/
│   │   ├── routes/      # API routes
│   │   ├── middleware/ # Auth middleware
│   │   └── prisma/     # Database client
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/ # UI components
│   │   ├── pages/      # Page components
│   │   ├── context/    # React contexts
│   │   └── services/   # API service
│   └── package.json
├── SPEC.md             # Technical specifications
└── README.md
```

## License

MIT
