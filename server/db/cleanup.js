import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'recipes.db');

/**
 * Remove duplicate recipes from the database
 * Keeps the oldest recipe when duplicates are found
 */
function removeDuplicateRecipes() {
  try {
    const db = new Database(DB_PATH);
    
    // Get all recipes with their ingredients
    const recipes = db.prepare('SELECT * FROM recipes ORDER BY created_at ASC').all();
    
    const seenIngredientSets = new Map();
    const duplicateIds = [];
    
    for (const recipe of recipes) {
      // Get ingredients for this recipe
      const ingredients = db.prepare('SELECT ingredient_name FROM recipe_ingredients WHERE recipe_id = ?').all(recipe.id);
      const sortedIngredients = ingredients
        .map(ing => ing.ingredient_name.toLowerCase().trim())
        .sort()
        .join('|');
      
      // Check if we've seen this ingredient combination before
      if (seenIngredientSets.has(sortedIngredients)) {
        // This is a duplicate - mark for deletion
        duplicateIds.push(recipe.id);
        console.log(`🗑️  Found duplicate recipe: "${recipe.name}" (ID: ${recipe.id})`);
      } else {
        // First time seeing this ingredient set
        seenIngredientSets.set(sortedIngredients, recipe.id);
      }
    }
    
    // Delete duplicates
    if (duplicateIds.length > 0) {
      const deleteStmt = db.prepare('DELETE FROM recipes WHERE id = ?');
      for (const id of duplicateIds) {
        deleteStmt.run(id);
      }
      console.log(`✅ Removed ${duplicateIds.length} duplicate recipe(s)`);
    } else {
      console.log('✅ No duplicate recipes found');
    }
    
    db.close();
  } catch (error) {
    console.error('⚠️  Error cleaning up duplicates:', error.message);
    // Don't throw - allow server to continue even if cleanup fails
  }
}

// Run cleanup
console.log('🔍 Checking for duplicate recipes...');
removeDuplicateRecipes();

