const fs = require('fs').promises;
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

async function displayFileInformation() {
  try {
    const items = await fs.readdir(folderPath, { withFileTypes: true });

    const filteredFiles = items.filter((item) => item.isFile());

    for (const file of filteredFiles) {
      const filePath = path.join(folderPath, file.name);
      const fileExtension = path.extname(file.name).slice(1);
      const fileStats = await fs.stat(filePath);

      showLog(file.name, fileExtension, fileStats.size);
    }
  } catch (error) {
    console.log('Произошла ошибка:', error.message);
  }
}

function showLog(fileName, fileExtension, fileSize) {
  console.log(
    `${fileName}---${fileExtension}---${(fileSize / 1024).toFixed(3)}kb`,
  );
}

displayFileInformation();
