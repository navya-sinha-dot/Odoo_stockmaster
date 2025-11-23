# StockMaster – Inventory Management System (IMS)

StockMaster is a modern, modular Inventory Management System designed to replace manual registers, Excel sheets, and scattered workflows with a centralized digital platform.  
It enables smooth handling of **product management**, **warehouse operations**, **stock movement**, and **real-time monitoring**.

---

##  Features

### Authentication
- Login with email + password  
- OTP-based password reset  
- Persistent sessions  
- Role-based access (Manager / Staff)  
- Auto-redirect to Dashboard  

---

## Dashboard
The Dashboard provides a quick snapshot of warehouse activity:

### **KPI Cards**
- Total Products in Stock  
- Low Stock / Out-of-Stock Items  
- Pending Receipts  
- Pending Deliveries  
- Scheduled Internal Transfers  

### **Smart Filters**
Filter any inventory document by:
- Document type: **Receipts / Deliveries / Internal Transfers / Adjustments**  
- Status: **Draft, Waiting, Ready, Done, Canceled**  
- Warehouse / Location  
- Product Category  

---

# Modules

## 1️ Product Management
- Create & update products  
- SKU / Product Code  
- Category  
- Unit of Measure  
- Product image  
- Initial stock (optional)  
- Stock availability per warehouse  
- Reordering rules  

---

## 2️ Receipts (Incoming Stock)
Used when items arrive from vendors.

### Workflow:
1. Create receipt  
2. Add supplier & products  
3. Enter received quantity  
4. Validate → stock **increases automatically**

**Example:**  
Receive 50 units of *Steel Rods* → stock **+50**

---

## 3️ Delivery Orders (Outgoing Stock)
Used when goods are shipped to customers.

### Workflow:
1. Pick  
2. Pack  
3. Validate → stock **decreases automatically**

**Example:**  
Deliver 10 *Chairs* → stock **–10**

---

## 4️ Internal Transfers
Move stock within your organization.

Examples:
- Main Warehouse → Production Floor  
- Rack A → Rack B  
- Warehouse 1 → Warehouse 2  

The total stock remains the same — only the **location changes**.  
Every movement is logged in the **Stock Ledger**.

---

## 5️ Stock Adjustments
Fix mismatches between system records and physical inventory.

### Steps:
1. Select product & location  
2. Enter actual counted quantity  
3. System updates the stock and logs the adjustment  

Examples:
- Damaged goods  
- Lost items  
- Miscount correction  

Includes:
- Low-stock alerts  
- Multi-warehouse support  

---

## Move History
A complete audit trail of:
- Receipts  
- Deliveries  
- Internal Transfers  
- Adjustments  

Logs:
- Date  
- User  
- Product  
- From → To  
- Status  
- Quantity  

---

#  Settings Module

### **Warehouse Management**
- Create / edit warehouses  
- Manage rack/row/bin locations  
- Enable/disable warehouses  

### **User Profile**
- View profile  
- Change password  
- Logout  

---

#  Frontend Features (React)
- Modern UI with TailwindCSS  
- Framer Motion animations  
- List & Grid view toggle  
- Debounced search bar  
- Smart sorting & filtering  
- Toast notifications  
- Image previews  
- Loading skeletons  
- Dark mode ready  

---

#  Backend Features (Node + Express + MongoDB)
- JWT authentication  
- OTP email service  
- Role-based authorization  
- Complete CRUD for:
  - Products  
  - Warehouses  
  - Receipts  
  - Deliveries  
  - Internal Transfers  
  - Adjustments  
- Auto-updating Stock Ledger  
- Global error handling  
- Request logging  

---

#  Inventory Flow Example

### Step 1 — Receive Goods
Receive **100 kg Steel**  
→ Stock: **+100**

### Step 2 — Move to Production Rack  
Internal transfer Main Store → Production  
→ Location updated

### Step 3 — Deliver Items  
Deliver **20 kg Steel**  
→ Stock: **–20**

### Step 4 — Adjustment  
3 kg damaged  
→ Stock: **–3**

All operations are logged in the **Stock Ledger**.

---

# Folder Structure

<pre>
StockMaster/
│── frontend/
│   ├── components/
│   ├── pages/
│   ├── context/
│   └── api.js
│
└── backend/
    ├── models/
    ├── routes/
    ├── controllers/
    ├── middleware/
    └── server.js
</pre>



---

# Installation & Setup

## Backend
```bash
cd backend
npm install
npm run dev

cd frontend
npm install
npm run dev
