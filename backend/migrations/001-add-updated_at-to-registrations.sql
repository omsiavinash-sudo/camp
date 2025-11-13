-- Migration: add updated_at column to registrations
-- Run this once. It will add a nullable TIMESTAMP column with automatic update.

ALTER TABLE registrations
  ADD COLUMN updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  AFTER created_at;
