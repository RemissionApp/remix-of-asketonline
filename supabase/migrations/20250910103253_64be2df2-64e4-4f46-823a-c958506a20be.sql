-- Clean up duplicate subscriptions, keeping only the most recent one per user
WITH ranked_subscriptions AS (
  SELECT id, user_id, 
         ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) as rn
  FROM subscriptions
)
DELETE FROM subscriptions 
WHERE id IN (
  SELECT id FROM ranked_subscriptions WHERE rn > 1
);