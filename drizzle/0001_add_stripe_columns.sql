-- Migration: Add Stripe subscription columns to users table
ALTER TABLE `users`
  ADD COLUMN `stripeCustomerId` varchar(255),
  ADD COLUMN `stripeSubscriptionId` varchar(255),
  ADD COLUMN `subscriptionTier` enum('free','pro') NOT NULL DEFAULT 'free',
  ADD COLUMN `subscriptionEndsAt` timestamp;
