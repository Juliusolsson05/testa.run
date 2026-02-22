-- Add archived issue lifecycle state
ALTER TYPE "IssueStatus" ADD VALUE IF NOT EXISTS 'archived';
