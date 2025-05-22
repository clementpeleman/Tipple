-- Create functions to support transactions in Supabase

-- Begin a transaction
CREATE OR REPLACE FUNCTION begin_transaction() RETURNS void AS $$
BEGIN
  EXECUTE 'BEGIN';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Commit a transaction
CREATE OR REPLACE FUNCTION commit_transaction() RETURNS void AS $$
BEGIN
  EXECUTE 'COMMIT';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Rollback a transaction
CREATE OR REPLACE FUNCTION rollback_transaction() RETURNS void AS $$
BEGIN
  EXECUTE 'ROLLBACK';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant access to these functions
GRANT EXECUTE ON FUNCTION begin_transaction TO authenticated;
GRANT EXECUTE ON FUNCTION commit_transaction TO authenticated;
GRANT EXECUTE ON FUNCTION rollback_transaction TO authenticated;