#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const { organizeFolder } = require('../lib/organizer');

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

if (!fs.existsSync(targetPath)) {
  console.error("❌ Error: Provided folder does not exist.");
  process.exit(1);
}

organizeFolder(targetPath);
