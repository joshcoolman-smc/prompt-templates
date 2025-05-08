# Inventory Management System Prompt Template

## Feature Description

The Inventory Management Dashboard is a streamlined tool designed to help e-commerce businesses efficiently track and manage their product inventory. This feature provides a centralized platform for monitoring stock levels and managing product information.

### Key Components

1. Inventory Overview
   - A summary view displaying key metrics such as total number of products, low stock items, and out-of-stock items
   - Quick access to top-selling and slow-moving products

2. Product Catalog
   - A searchable and filterable list of all inventory items
   - Each product entry includes essential information like name, SKU, current stock level, and price

3. Product Details
   - Detailed view of individual product information
   - Includes product description, variants (if applicable), pricing, and current stock level
   - Gallery of product images, allowing multiple images per product

4. Category Management
   - Ability to organize products into categories and subcategories
   - Tools for managing and editing category structures

## Core Entities and Zod Schemas

```typescript
import { z } from "zod";

// Basic Schemas

export const categorySchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  parent_category_id: z.number().nullable(),
});

export const productSchema = z.object({
  id: z.number(),
  sku: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  price: z.number(),
  category_id: z.number().nullable(),
  stock_level: z.number(),
  images: z.array(z.string()),
});

export const productImageSchema = z.object({
  id: z.number(),
  product_id: z.number(),
  image_url: z.string(),
});

// Schemas with References

export const categoryWithParentSchema = categorySchema.extend({
  parent_category: categorySchema.nullable(),
});

export const productWithCategorySchema = productSchema.extend({
  category: categorySchema.nullable(),
});

export const productWithImagesSchema = productSchema.extend({
  product_images: z.array(productImageSchema),
});

// Fully Referenced Schemas

export const fullyCategorizedProductSchema = productWithCategorySchema.extend({
  category: categoryWithParentSchema.nullable(),
});

export const fullProductSchema = fullyCategorizedProductSchema.extend({
  product_images: z.array(productImageSchema),
});

// Inferred Types

export type Category = z.infer<typeof categorySchema>;
export type Product = z.infer<typeof productSchema>;
export type ProductImage = z.infer<typeof productImageSchema>;

export type CategoryWithParent = z.infer<typeof categoryWithParentSchema>;
export type ProductWithCategory = z.infer<typeof productWithCategorySchema>;
export type ProductWithImages = z.infer<typeof productWithImagesSchema>;

export type FullyCategorizedProduct = z.infer<typeof fullyCategorizedProductSchema>;
export type FullProduct = z.infer<typeof fullProductSchema>;
```
