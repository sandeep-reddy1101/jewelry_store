# Jewelry Store Management System

A full-stack web application for managing a jewelry store's inventory, sales, and operations.

## 🏗️ Architecture

- **Backend**: FastAPI (Python) with SQLAlchemy ORM
- **Frontend**: React with TypeScript and Tailwind CSS
- **Database**: PostgreSQL (configurable)

## 📁 Project Structure

```
jewelry_store/
├── backend/                 # FastAPI backend application
│   ├── app/
│   │   ├── api/            # API route handlers
│   │   ├── models/         # Database models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── config/         # Configuration settings
│   │   └── database/       # Database connection and setup
│   ├── alembic/           # Database migrations
│   └── main.py            # Application entry point
└── frontend/              # React frontend application
    ├── src/
    │   ├── components/    # Reusable UI components
    │   ├── pages/         # Application pages
    │   ├── services/      # API service functions
    │   └── types/         # TypeScript type definitions
    └── public/            # Static assets
```

## 🚀 Features

- **Inventory Management**: Track products, categories, and stock levels
- **Sales Management**: Create and manage invoices and sales transactions
- **Employee Management**: Manage staff information and roles
- **Vendor Management**: Track suppliers and purchase orders
- **Analytics**: Sales reports and business insights

## 🛠️ Tech Stack

### Backend
- **FastAPI**: Modern, fast web framework for building APIs
- **SQLAlchemy**: SQL toolkit and ORM
- **Alembic**: Database migration tool
- **Pydantic**: Data validation using Python type annotations

### Frontend
- **React**: UI library for building user interfaces
- **TypeScript**: Typed superset of JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Vite**: Fast build tool and development server

## 📦 Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL (optional, SQLite works for development)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run database migrations:
   ```bash
   alembic upgrade head
   ```

5. Start the development server:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## 🔗 API Endpoints

The backend provides RESTful API endpoints for:

- `/api/products` - Product management
- `/api/categories` - Product categories
- `/api/invoices` - Sales and invoicing
- `/api/employees` - Employee management
- `/api/vendors` - Vendor management
- `/api/analytics` - Business analytics

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
