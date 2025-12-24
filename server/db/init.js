import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const __dirname = path.dirname(__filename);

// Schema always in code directory
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

// Database location: separate from code
let DB_PATH;
if (process.env.NODE_ENV === 'production') {
  // Production: Use persistent disk (mounted separately from code)
  DB_PATH = '/var/data/recipes.db';
  console.log(`🌐 Production mode - Using persistent disk: ${DB_PATH}`);
} else {
  // Development: Use local directory
  DB_PATH = path.join(__dirname, 'recipes.db');
  console.log(`💻 Development mode - Using local path: ${DB_PATH}`);
}

let db = null;

/**
 * Initialize the SQLite database
 */
function initDatabase() {
  try {
    // Create database connection
    db = new Database(DB_PATH, { verbose: console.log });
    
    // Enable foreign keys
    db.pragma('foreign_keys = ON');
    
    // Read and execute schema
    const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
    db.exec(schema);
    
    console.log('✅ Database initialized successfully');
    console.log(`📁 Database location: ${DB_PATH}`);
    
    return db;
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}

/**
 * Get database instance
 */
function getDatabase() {
  if (!db) {
    db = initDatabase();
  }
  return db;
}

/**
 * Close database connection
 */
function closeDatabase() {
  if (db) {
    db.close();
    db = null;
    console.log('🔒 Database connection closed');
  }
}

export {
  initDatabase,
  getDatabase,
  closeDatabase
};

