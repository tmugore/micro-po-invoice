-- Create CMS configuration table
CREATE TABLE IF NOT EXISTS cms_config (
    id INTEGER PRIMARY KEY DEFAULT 1,
    config_json TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Add currency column to loan_applications table if it doesn't exist
ALTER TABLE loan_applications ADD COLUMN currency TEXT DEFAULT 'BWP';