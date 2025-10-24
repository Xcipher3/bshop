# Seller/Store Management Features

This document outlines the seller/store management features implemented in the Bijema admin dashboard.

## Features Overview

The admin dashboard now includes comprehensive seller/store management capabilities:

1. **Store Management**
   - View all stores with filtering by status
   - Approve or reject store applications
   - View detailed store information
   - Manage store products and orders

2. **Store Analytics**
   - Performance metrics for all stores
   - Revenue and order tracking
   - Store distribution visualization
   - Top performing stores ranking

3. **Seller Account Management**
   - Store approval workflow
   - Store status management
   - Store details viewing

## Implementation Details

### Database Schema

The Prisma schema includes a `Store` model with the following fields:
- `id`: Unique identifier
- `userId`: Reference to the store owner
- `name`: Store name
- `description`: Store description
- `username`: Unique store username
- `address`: Store address
- `status`: Store status (pending, approved, rejected)
- `isActive`: Whether the store is active
- `logo`: Store logo URL
- `email`: Store contact email
- `contact`: Store contact phone
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

### API Routes

The following API routes have been implemented:

1. **GET /api/stores** - Fetch all stores with optional status filtering
2. **POST /api/stores** - Create a new store
3. **GET /api/stores/[id]** - Fetch a specific store with related data
4. **PUT /api/stores/[id]** - Update a store
5. **DELETE /api/stores/[id]** - Delete a store
6. **POST /api/stores/[id]/approve** - Approve or reject a store

### Admin Pages

1. **/admin/stores** - Store management overview with filtering
2. **/admin/stores/[id]** - Detailed store view with analytics
3. **/admin/approve** - Store approval workflow
4. **/admin/analytics** - Comprehensive store analytics dashboard

### Components

1. **StoreInfo** - Displays detailed store information
2. **AdminSidebar** - Updated navigation with store management links

## Usage

### Managing Stores

1. Navigate to the "Stores" section in the admin dashboard
2. View all stores or filter by status (All, Pending, Approved, Rejected)
3. Click on a store to view detailed information
4. Approve or reject pending stores as needed

### Viewing Analytics

1. Navigate to the "Analytics" section in the admin dashboard
2. View store distribution by status
3. Analyze store performance metrics
4. Identify top performing stores

### Approving Stores

1. Navigate to the "Approve Store" section
2. View all pending store applications
3. Approve or reject applications as needed

## Data Models

### Store Model
```prisma
model Store {
    id          String   @id @default(cuid())
    userId      String   @unique
    name        String
    description String
    username    String   @unique
    address     String
    status      String   @default("pending")
    isActive    Boolean  @default(false)
    logo        String
    email       String
    contact     String
    createdAt   DateTime @default(now())
    updatedAt   DateTime @updatedAt

    Product Product[]
    Order   Order[]
    user    User      @relation(fields: [userId], references: [id])
}
```

## Future Enhancements

1. **Seller Dashboard** - Dedicated dashboard for sellers to manage their stores
2. **Commission Tracking** - Track and manage seller commissions
3. **Seller Communication** - Messaging system for admin-seller communication
4. **Store Customization** - Allow sellers to customize their store appearance
5. **Inventory Management** - Advanced inventory tracking for sellers