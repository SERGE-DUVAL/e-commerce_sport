const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '../../sport-equip.sqlite'));

try {
  // Check if columns already exist
  const tableInfo = db.prepare("PRAGMA table_info(utilisateurs)").all();
  const hasResetToken = tableInfo.some(col => col.name === 'reset_token');
  const hasResetTokenExpiry = tableInfo.some(col => col.name === 'reset_token_expiry');

  if (hasResetToken && hasResetTokenExpiry) {
    console.log('Columns reset_token and reset_token_expiry already exist');
    process.exit(0);
  }

  // Add missing columns
  if (!hasResetToken) {
    db.prepare('ALTER TABLE utilisateurs ADD COLUMN reset_token TEXT').run();
    console.log('Added reset_token column');
  }

  if (!hasResetTokenExpiry) {
    db.prepare('ALTER TABLE utilisateurs ADD COLUMN reset_token_expiry TEXT').run();
    console.log('Added reset_token_expiry column');
  }

  console.log('Migration completed successfully');
} catch (error) {
  console.error('Migration error:', error);
  process.exit(1);
} finally {
  db.close();
}
