const fs = require('fs');
const path = require('path');

const directoriesToProcess = [
  'src/components',
  'src/pages',
  'src/context'
];

directoriesToProcess.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (fs.existsSync(fullPath)) {
    const files = fs.readdirSync(fullPath);
    files.forEach(file => {
      if (file.endsWith('.js')) {
        const oldPath = path.join(fullPath, file);
        const newPath = path.join(fullPath, file.replace('.js', '.jsx'));
        
        try {
          fs.renameSync(oldPath, newPath);
          console.log(`Renamed: ${file} -> ${file.replace('.js', '.jsx')}`);
        } catch (error) {
          console.error(`Error renaming ${file}:`, error.message);
        }
      }
    });
  }
});

console.log('Renaming complete!');
