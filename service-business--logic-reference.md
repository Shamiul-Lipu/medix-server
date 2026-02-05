# Service & Business Logic Reference (Role-based & Action-based)

## **Roles**

- **Customer**: Browse, cart, order, review
- **Seller**: Manage own medicines, categories, view relevant orders
- **Admin**: Full control over users, medicines, categories, orders, reviews

---

## **Auth & Dashboard**

- **Customer**: Profile, orders, cart, reviews
- **Seller**: Profile, medicines, low stock alerts, pending orders, recent sales
- **Admin**: Profile, user counts, order stats, medicine stats, recent users

---

## **Users (Admin Only)**

**View Users**: Filter by role, ban status, search; includes role-specific counts (orders/reviews/medicines)  
**Control Users**: Update/ban users (cannot modify self or Super Admin `ADMIN_EMAIL`)  
**View Single User**: Returns user + activity (orders, medicines, reviews, categories based on role)

---

## **Categories**

| Role       | Create | Update/Delete       | On Delete                                         |
| ---------- | ------ | ------------------- | ------------------------------------------------- |
| **Admin**  | ✅     | Any category        | Deletes all medicines in category                 |
| **Seller** | ✅     | Own categories only | Deletes own medicines; reassigns others' to Admin |

**Rules**: Unique names (case-insensitive), transactions ensure safe delete/reassign, supports pagination/search

---

## **Medicines**

| Role         | Create/Update/Delete | View                  |
| ------------ | -------------------- | --------------------- |
| **Admin**    | Any medicine         | All                   |
| **Seller**   | Own medicines only   | All                   |
| **Customer** | ❌                   | Active medicines only |

**Rules**: Must have valid category, soft delete if in orders, filters (search, category, price/stock range), pagination/sorting  
**Display**: Auto-assigns random image if missing, includes category/seller/reviews on detail view

---

## **Cart (Customer Only)**

**Actions**: View, add (validates stock/active status), update quantity, remove item, clear cart  
**Rules**: Qty ≥ 1, medicine must be active with sufficient stock, increments qty if item exists

---

## **Orders**

**Status Flow**: `PLACED → PROCESSING → SHIPPED → DELIVERED` or `→ CANCELLED`

| Role         | Create | View                    | Update Status    | Cancel                         |
| ------------ | ------ | ----------------------- | ---------------- | ------------------------------ |
| **Customer** | ✅     | Own orders              | ❌               | ✅ (only if PLACED/PROCESSING) |
| **Seller**   | ❌     | Orders with their items | ✅ (their items) | ❌                             |
| **Admin**    | ❌     | All                     | ✅               | ✅                             |

**Rules**: Snapshots items on creation, updates stock atomically, clears cart, restores stock on cancel, pagination/filtering available

---

## **Reviews (Customer Only)**

**Create**: Only on **delivered** orders, one review per order item  
**Update**: Only own reviews (rating/comment)  
**Delete**: Customer (own) or Admin (any)

**Rules**: Must own order item, order must be delivered, no duplicates

---

## **Key Safety Features**

- **Transactions**: Category/medicine delete, order creation/cancellation
- **Ownership checks**: Sellers/customers can only modify their own data
- **Protected accounts**: Cannot modify self or Super Admin
- **Stock validation**: Real-time checks on cart/order operations
- **Status transitions**: Enforced order workflow
