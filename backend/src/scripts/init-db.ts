import { runSeeder } from './seeder';
import { runTranslatorFromScratch } from './ai-translator';
import { db } from '../config/database';
import { vocabularies, vocabularyMeanings } from '../shared/schema';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function initDatabase() {
  console.log('\n=============================================');
  console.log('🚀 BỘ KHỞI TẠO DỮ LIỆU TỪ VỰNG - HANVAULT');
  console.log('=============================================\n');

  rl.question('⚠️ WARNING: This action will PERMANENTLY DELETE all existing vocabulary data and reinitialize the database from scratch. Are you sure you want to continue? (y/N): ', async (answer) => {
    if (answer.toLowerCase() === 'y') {
      try {
        console.log('\n[STEP 1] CLEANING THE DATABASE...');

        await db.delete(vocabularyMeanings);
        await db.delete(vocabularies);
        console.log('✅ DATABASE CLEANUP COMPLETED!\n');

        console.log('[STEP 2] LOADING AND SEEDING DATA FROM GITHUB (SEEDER)...');
        await runSeeder();
        console.log('\n[STEP 3] INITIALIZING AI TRANSLATOR FOR MEANING REFINEMENT...');
        await runTranslatorFromScratch();
        
        console.log('\n🎉 INITIALIZATION COMPLETED SUCCESSFULLY!');
      } catch (error) {
        console.error('\n❌ A CRITICAL ERROR HAS OCCURRED:', error);
      }
    } else {
      console.log('\n⏹ Operation cancelled. Your database is safe.');
    }
    
    process.exit(0);
  });
}

initDatabase();