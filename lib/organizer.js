const fs = require('fs/promises');
const path = require('path');

const DEFAULT_CATEGORIES = {
  Images: ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff', '.tif', '.svg', '.webp', '.heif', '.heic', '.raw', '.ico', '.eps', '.ai'],
  Documents: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.rtf', '.odt', '.wps', '.xml', '.json', '.csv', '.md', '.tex', '.pages'],
  Audio: ['.mp3', '.wav', '.aac', '.ogg', '.flac', '.m4a', '.wma', '.alac', '.aiff', '.opus', '.ra'],
  Video: ['.mp4', '.avi', '.mkv', '.mov', '.wmv', '.flv', '.webm', '.m4v', '.mpeg', '.mpg', '.3gp', '.3g2', '.f4v', '.vob'],
  Archives: ['.zip', '.rar', '.tar', '.gz', '.7z', '.bz2', '.xz', '.iso', '.cab', '.z'],
  Executables: ['.exe', '.bat', '.sh', '.msi', '.app', '.apk', '.bin', '.jar', '.cmd'],
  Fonts: ['.ttf', '.otf', '.woff', '.woff2', '.eot', '.fon', '.svg']
};

async function organizeFolder(folderPath) {
  try {
    const files = await fs.readdir(folderPath);
    if (!files.length) {
      console.log('📂 Folder is empty.');
      return;
    }

    for (const file of files) {
      const fullPath = path.join(folderPath, file);
      const stat = await fs.stat(fullPath);

      if (!stat.isFile()) continue;

      const ext = path.extname(file).toLowerCase();
      const category = getCategoryByExtension(ext) || 'Others';

      await moveFileToCategory(fullPath, folderPath, category);
    }
  } catch (err) {
    throw new Error(`Failed to organize: ${err.message}`);
  }
}

function getCategoryByExtension(ext) {
  for (const [category, extensions] of Object.entries(DEFAULT_CATEGORIES)) {
    if (extensions.includes(ext)) return category;
  }
  return null;
}

async function moveFileToCategory(filePath, baseFolder, category) {
  const categoryFolder = path.join(baseFolder, category);
  const fileName = path.basename(filePath);
  const destinationPath = path.join(categoryFolder, fileName);

  try {
    await fs.mkdir(categoryFolder, { recursive: true });
    await fs.rename(filePath, destinationPath);
    console.log(`📁 ${fileName} → ${category}/`);
  } catch (err) {
    console.error(`❌ Could not move ${fileName}: ${err.message}`);
  }
}

module.exports = {
  organizeFolder
};
