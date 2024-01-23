const fs = require('fs').promises;
const path = require('path');
const sourceDirectory = path.join(__dirname, 'files');
const destinationDirectory = path.join(__dirname, 'files-copy');

async function createDirectoryIfNotExists(directory) {
  try {
    await fs.mkdir(directory, { recursive: true });
  } catch (error) {
    console.error(`Ошибка при создании директории: ${error.message}`);
  }
}

async function clearDirectory(directory) {
  const files = await fs.readdir(directory);
  for (const fileName of files) {
    const filePath = path.join(directory, fileName);
    await fs.unlink(filePath);
  }
}

async function copyFiles(sourcePath, destinationPath) {
  try {
    await createDirectoryIfNotExists(destinationPath);
    await clearDirectory(destinationPath);

    const sourceFiles = await fs.readdir(sourcePath);
    for (const fileName of sourceFiles) {
      const sourceFilePath = path.join(sourcePath, fileName);
      const destFilePath = path.join(destinationPath, fileName);

      await fs.copyFile(sourceFilePath, destFilePath);
    }

    console.log('Поздравляю! Директория успешно скопирована и обновлена');
  } catch (error) {
    console.log(`Ошибка при копировании директории: ${error.message}`);
  }
}

copyFiles(sourceDirectory, destinationDirectory);
