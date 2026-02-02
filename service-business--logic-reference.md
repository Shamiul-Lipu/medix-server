## Service & Business Logic Reference (Role-based & Action-based)

### **Category Module**

- **Admin**
  - Can create, update, and delete **any category**.
  - Deleting a category removes **all medicines** in that category.

- **Seller**
  - Can create categories.
  - Can update or delete **only their own categories**.
  - When deleting a category:
    - Deletes **their own medicines**.
    - **Other sellers’ medicines** in the category are reassigned to **Admin**.

- **Medicine Handling on Category Delete**
  - **Seller deletion:** removes only seller-owned medicines; reassigns remaining medicines to Admin.
  - **Admin deletion:** removes **all medicines** in the category.

- **Consistency & Safety**
  - Operations use **database transactions** to ensure category deletion and medicine delete/reassignment are **atomic and safe**.

---
