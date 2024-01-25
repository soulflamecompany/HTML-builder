const fs = require('fs').promises;
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

async function displayFileInformation() {
  try {
    const items = await fs.readdir(folderPath, { withFileTypes: true });

    const filteredFiles = items.filter((item) => item.isFile());

    for (const file of filteredFiles) {
      const filePath = path.join(folderPath, file.name);
      const fileExtension = path.extname(file.name).slice(1) || ''; // Изменено условие для файлов без расширения
      const fileSize = (await fs.stat(filePath)).size;

      showLog(file.name, fileExtension, fileSize);
    }
  } catch (error) {
    console.log('Произошла ошибка:', error.message);
  }
}

function showLog(fileName, fileExtension, fileSize) {
  if (fileExtension) {
    console.log(
      `${fileName.replace('.' + fileExtension, '')}---${fileExtension}---${(
        fileSize / 1024
      ).toFixed(2)}kb`,
    );
  } else {
    console.log(`${fileName}---${(fileSize / 1024).toFixed(2)}kb`);
  }
}

displayFileInformation();
