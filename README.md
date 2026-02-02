## Medix-server API Endpoints 💊

## Database Schema

➡️ [Medix Database Schema](https://dbdiagram.io/d/medix-69777d08bd82f5fce2a2cf82)

<!-- [![Database Diagram](schema.png)](https://dbdiagram.io/d/medix-697) -->

---

## **API Documentation**

| Module   | Method | Endpoint               | Description                                          | Access                 |
| -------- | ------ | ---------------------- | ---------------------------------------------------- | ---------------------- |
| Category | GET    | `/api/v1/category`     | Fetch all categories                                 | Public / Auth optional |
| Category | POST   | `/api/v1/category`     | Create a new category                                | Admin, Seller          |
| Category | PUT    | `/api/v1/category/:id` | Update an existing category                          | Admin, Seller (owner)  |
| Category | DELETE | `/api/v1/category/:id` | Delete a category and handle medicines based on role | Admin, Seller (owner)  |

**Notes for DELETE**

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
