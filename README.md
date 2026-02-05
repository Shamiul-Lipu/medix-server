## Medix-server API Endpoints 💊

A scalable backend service for Medix, an online medicine marketplace supporting Customers, Sellers, and Admins.
Built with Node.js, Express, Prisma and PostgreSQL.

## 🖥️ Live App

- **Frontend:** https://medix-client.vercel.app
- **Backend:** https://medix-server.vercel.app

## 📚 Documentation

- [Service & Business Logic Reference (Role-based & Action-based)](https://github.com/Shamiul-Lipu/medix-server/blob/main/service-business--logic-reference.md)

## Database Schema

➡️ [Medix Database Schema](https://dbdiagram.io/d/medix-69777d08bd82f5fce2a2cf82)

<!-- [![Database Diagram](schema.png)](https://dbdiagram.io/d/medix-697) -->

---

## **API Documentation**

## Admin

| Module | Method | Endpoint                  | Description                        | Access |
| ------ | ------ | ------------------------- | ---------------------------------- | ------ |
| Admin  | GET    | `/api/v1/admin/users`     | Fetch all users                    | Admin  |
| Admin  | GET    | `/api/v1/admin/users/:id` | Fetch single user details by ID    | Admin  |
| Admin  | PUT    | `/api/v1/admin/users/:id` | Control or update user status/role | Admin  |

## Auth

| Module | Method | Endpoint          | Description                     | Access                  |
| ------ | ------ | ----------------- | ------------------------------- | ----------------------- |
| Auth   | GET    | `/api/v1/auth/me` | Get logged-in user profile info | Admin, Seller, Customer |

## Category

| Module   | Method | Endpoint               | Description                                          | Access                 |
| -------- | ------ | ---------------------- | ---------------------------------------------------- | ---------------------- |
| Category | GET    | `/api/v1/category`     | Fetch all categories                                 | Public / Auth optional |
| Category | POST   | `/api/v1/category`     | Create a new category                                | Admin, Seller          |
| Category | PUT    | `/api/v1/category/:id` | Update an existing category                          | Admin, Seller (owner)  |
| Category | DELETE | `/api/v1/category/:id` | Delete a category and handle medicines based on role | Admin, Seller (owner)  |

## Cart

| Module | Method | Endpoint                         | Description                            | Access   |
| ------ | ------ | -------------------------------- | -------------------------------------- | -------- |
| Cart   | GET    | `/api/v1/cart`                   | Get current user’s cart                | Customer |
| Cart   | POST   | `/api/v1/cart/items`             | Add an item to the cart                | Customer |
| Cart   | PATCH  | `/api/v1/cart/items/:medicineId` | Update quantity/details of a cart item | Customer |
| Cart   | DELETE | `/api/v1/cart/items/:medicineId` | Remove an item from the cart           | Customer |
| Cart   | DELETE | `/api/v1/cart`                   | Clear all items from the cart          | Customer |

## Medicine

| Module   | Method | Endpoint               | Description                  | Access        |
| -------- | ------ | ---------------------- | ---------------------------- | ------------- |
| Medicine | GET    | `/api/v1/medicine`     | Fetch all medicines          | Public        |
| Medicine | GET    | `/api/v1/medicine/:id` | Fetch medicine details by ID | Public        |
| Medicine | POST   | `/api/v1/medicine`     | Create a new medicine        | Admin, Seller |
| Medicine | PUT    | `/api/v1/medicine/:id` | Update an existing medicine  | Admin, Seller |
| Medicine | DELETE | `/api/v1/medicine/:id` | Delete a medicine            | Admin, Seller |

## Order

| Module | Method | Endpoint                             | Description                     | Access                  |
| ------ | ------ | ------------------------------------ | ------------------------------- | ----------------------- |
| Order  | POST   | `/api/v1/order`                      | Create a new order              | Customer                |
| Order  | PUT    | `/api/v1/order/:id/cancel`           | Cancel an order                 | Customer, Admin         |
| Order  | GET    | `/api/v1/order`                      | Fetch all orders                | Customer, Seller, Admin |
| Order  | GET    | `/api/v1/order/:id`                  | Fetch order details by order ID | Customer, Seller, Admin |
| Order  | PUT    | `/api/v1/order/items/:itemId/status` | Update order item status        | Seller, Admin           |

## Review

| Module | Method | Endpoint                   | Description               | Access                  |
| ------ | ------ | -------------------------- | ------------------------- | ----------------------- |
| Review | GET    | `/api/v1/review`           | Fetch all reviews         | Public                  |
| Review | POST   | `/api/v1/review`           | Create a new review       | Customer                |
| Review | PATCH  | `/api/v1/review/:reviewId` | Update an existing review | Customer (owner)        |
| Review | DELETE | `/api/v1/review/:reviewId` | Delete a review           | Customer (owner), Admin |

---

## 🔐 Authentication Guards

- **Public**: No authentication required
- **Private**: Requires valid cookies (better-auth)
- **Role-based**: Additional role check (Customer/Seller/Admin)

---

## 📝 RESPONSE

```json
{
  "success": true,
  "message": "Success message",
  "data": { ... }
}
```

2. Error responses:

```json
{
  "success": false,
  "message": "Error message",
  "errors": [ ... ]
}
```

3. Pagination format:

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```
