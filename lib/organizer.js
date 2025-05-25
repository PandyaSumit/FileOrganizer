#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const DEFAULT_CATEGORIES = {
  Images: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
  Documents: ['.pdf', '.doc', '.docx', '.txt', '.xlsx'],
  Scripts: ['.js', '.ts', '.py', '.sh', '.bat'],
  Media: ['.mp4', '.mp3', '.mov', '.avi'],
  Archives: ['.zip', '.rar', '.tar', '.gz'],
};

function organizeFolder(folderPath) {
  const files = fs.readdirSync(folderPath);

  if (files.length === 0) {
    console.log('📂 Folder is empty. Nothing to organize.');
    return;
  }

  for (const file of files) {
    const fullPath = path.join(folderPath, file);
    if (!fs.statSync(fullPath).isFile()) continue;

    const ext = path.extname(file).toLowerCase();
    const category = getCategoryByExtension(ext) || 'Others';

    moveFileToCategory(fullPath, folderPath, category);
  }

  console.log('✅ Done organizing files.');
}

function getCategoryByExtension(ext) {
  for (const [category, extensions] of Object.entries(DEFAULT_CATEGORIES)) {
    if (extensions.includes(ext)) return category;
  }
  return null;
}

function moveFileToCategory(filePath, baseFolder, category) {
  const categoryFolder = path.join(baseFolder, category);
  const fileName = path.basename(filePath);
  const destinationPath = path.join(categoryFolder, fileName);

  if (!fs.existsSync(categoryFolder)) {
    fs.mkdirSync(categoryFolder);
  }

  fs.renameSync(filePath, destinationPath);
  console.log(`📁 ${fileName} → ${category}/`);
}

module.exports = {
  organizeFolder
};
