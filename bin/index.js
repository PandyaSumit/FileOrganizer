#!/usr/bin/env node
const path = require('path');
const fs = require('fs/promises');
const { organizeFolder } = require('../lib/organizer');

(async () => {
  const input = process.argv[2];

  if (!input || input === '--help') {
    console.log(`
📁 File Organizer CLI

👉 Usage:
  organize <folder-path>

📦 Example:
  organize ./Downloads
`);
    process.exit(0);
  }

  const targetPath = path.resolve(input);

  try {
    const stat = await fs.stat(targetPath);
    if (!stat.isDirectory()) {
      console.error('❌ Error: Provided path is not a folder.');
      process.exit(1);
    }
  } catch {
    console.error('❌ Error: Provided folder does not exist.');
    process.exit(1);
  }

  try {
    await organizeFolder(targetPath);
    console.log('✅ Files organized successfully.');
  } catch (err) {
    console.error(`❌ Error: ${err.message}`);
  }
})();
