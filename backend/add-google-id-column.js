const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '../sport-equip.sqlite'));

try {
  // Check if google_id column already exists
  const columns = db.prepare("PRAGMA table_info(utilisateurs)").all();
  const hasGoogleId = columns.some(col => col.name === 'google_id');
  
  if (hasGoogleId) {
    console.log('Column google_id already exists in utilisateurs table');
  } else {
    // Add google_id column
    db.prepare("ALTER TABLE utilisateurs ADD COLUMN google_id TEXT").run();
    console.log('Successfully added google_id column to utilisateurs table');
  }
  
  // Also add reset_token and reset_token_expiry columns if they don't exist
  const hasResetToken = columns.some(col => col.name === 'reset_token');
  if (!hasResetToken) {
    db.prepare("ALTER TABLE utilisateurs ADD COLUMN reset_token TEXT").run();
    console.log('Successfully added reset_token column to utilisateurs table');
  }
  
  const hasResetTokenExpiry = columns.some(col => col.name === 'reset_token_expiry');
  if (!hasResetTokenExpiry) {
    db.prepare("ALTER TABLE utilisateurs ADD COLUMN reset_token_expiry TEXT").run();
    console.log('Successfully added reset_token_expiry column to utilisateurs table');
  }
  
  db.close();
  console.log('Migration completed successfully');
} catch (error) {
  console.error('Error during migration:', error);
  db.close();
  process.exit(1);
}
