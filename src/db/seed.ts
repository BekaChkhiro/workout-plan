import { config } from 'dotenv';

config({ path: '.env.local' });

async function seed() {
  console.log('Seed placeholder — schema not yet defined (see task T2.2).');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
