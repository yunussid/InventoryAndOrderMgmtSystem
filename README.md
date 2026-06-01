# Inventory & Order Management System

A production-ready, fully containerized full-stack application for managing products, customers, and orders with inventory tracking.

## Tech Stack

- **Frontend:** React (JavaScript)
- **Backend:** Python (FastAPI)
- **Database:** PostgreSQL
- **Containerization:** Docker & Docker Compose

## Quick Start

```bash
docker-compose up --build
```

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Docs (Swagger):** http://localhost:8000/docs

## API Endpoints

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /products | Create a new product |
| GET | /products | Retrieve all products |
| GET | /products/{id} | Retrieve product by ID |
| PUT | /products/{id} | Update product |
| DELETE | /products/{id} | Delete product |

### Customers
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /customers | Create a new customer |
| GET | /customers | Retrieve all customers |
| GET | /customers/{id} | Retrieve customer by ID |
| DELETE | /customers/{id} | Delete customer |

### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /orders | Create a new order |
| GET | /orders | Retrieve all orders |
| GET | /orders/{id} | Retrieve order by ID |
| DELETE | /orders/{id} | Cancel/Delete order |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /dashboard | Summary stats |

## Business Logic

- Product SKU must be unique
- Customer email must be unique
- Product quantity cannot be negative
- Orders cannot be placed if inventory is insufficient
- Creating an order automatically reduces available stock
- Total order amount is calculated automatically

## Environment Variables

| Variable | Description |
|----------|-------------|
| POSTGRES_USER | PostgreSQL username |
| POSTGRES_PASSWORD | PostgreSQL password |
| POSTGRES_DB | Database name |
| DATABASE_URL | Full connection string |

## Deployment

- **Backend:** Deployed on Render
- **Frontend:** Deployed on Vercel

