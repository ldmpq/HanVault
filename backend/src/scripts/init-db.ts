import { runSeeder } from './seeder';
import { runAIEnrichment } from './ai-enrichment';
import { db } from '../config/database';
import { vocabularies, vocabularyMeanings, exampleSentences, exampleSentenceTranslations } from '../shared/schema';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function initDatabase() {
  console.log('\n=============================================');
  console.log('🚀 HANVAULT DATABASE INITIALIZER');
  console.log('=============================================\n');

  rl.question('⚠️ WARNING: This will DELETE all existing vocabulary data and reinitialize the database. Continue? (y/N): ', async (answer) => {
    if (answer.toLowerCase() === 'y') {
      try {
        console.log('\n[STEP 1] Clearing existing data...');

        await db.delete(exampleSentenceTranslations);
        await db.delete(exampleSentences);
        await db.delete(vocabularyMeanings);
        await db.delete(vocabularies);
        console.log('✅ Database cleared\n');

        console.log('[STEP 2] Seeding vocabulary data from GitHub...');
        await runSeeder();

        console.log('\n[STEP 3] Running AI enrichment (translations, Sino-Vietnamese, examples)...');
        await runAIEnrichment();
        
        console.log('\n🎉 Database initialization completed successfully!');
      } catch (error) {
        console.error('\n❌ Fatal error:', error);
      }
    } else {
      console.log('\n⏹ Operation cancelled. No changes were made.');
    }
    
    process.exit(0);
  });
}

initDatabase();