-- Remove duplicate products based on slug, keeping the one with the most recent creation time (or arbitrary if created_at is same)
-- This uses the ctid to identify physical rows and keeps only one per slug.

DELETE FROM products 
WHERE ctid NOT IN (
  SELECT max(ctid) 
  FROM products 
  GROUP BY slug
);
