-- Update default currency from USD to BDT (Bangladeshi Taka)

-- Update profiles table default
ALTER TABLE profiles 
ALTER COLUMN currency SET DEFAULT 'BDT';

-- Update wallets table default
ALTER TABLE wallets 
ALTER COLUMN currency SET DEFAULT 'BDT';

-- Update existing profiles with USD to BDT (optional - only affects existing users who haven't changed their currency)
-- Uncomment if you want to migrate existing users
-- UPDATE profiles SET currency = 'BDT' WHERE currency = 'USD';
-- UPDATE wallets SET currency = 'BDT' WHERE currency = 'USD';
