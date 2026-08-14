const { Client } = require('pg');

async function main() {
  const databaseUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
  if (!databaseUrl) {
    console.error('Please set DATABASE_URL or SUPABASE_DB_URL environment variable (service_role connection string).');
    process.exit(2);
  }

  const client = new Client({ connectionString: databaseUrl });
  try {
    await client.connect();

    const res = await client.query(
      `SELECT pol.policyname,
              n.nspname AS schemaname,
              c.relname AS tablename,
              pol.polcmd AS command,
              pg_get_expr(pol.polqual, pol.polrelid) AS using,
              pg_get_expr(pol.polwithcheck, pol.polrelid) AS check_expr
       FROM pg_policy pol
       JOIN pg_class c ON pol.polrelid = c.oid
       JOIN pg_namespace n ON c.relnamespace = n.oid
       WHERE c.relname = $1;`,
      ['contents']
    );

    if (!res.rows.length) {
      console.log('No policies found for table `contents`. RLS may not be enabled.');
      process.exitCode = 1;
    } else {
      console.log('Policies for `contents`:');
      for (const r of res.rows) {
        console.log(`- ${r.policyname} (${r.command})`);
        console.log(`  using: ${r.using}`);
        console.log(`  check: ${r.check_expr}`);
      }
    }
  } catch (err) {
    console.error('Error while checking RLS policies:', err.message || err);
    process.exitCode = 2;
  } finally {
    await client.end();
  }
}

main();
