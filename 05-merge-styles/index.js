const fs = require('fs').promises;
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const distDir = path.join(__dirname, 'project-dist');
const bundleFile = path.join(distDir, 'bundle.css');

async function mergeStyles() {
  try {
    await fs.mkdir(distDir, { recursive: true });

    const styleFiles = await fs.readdir(stylesDir);
    const filteredCssFiles = styleFiles.filter(
      (file) => path.extname(file) === '.css',
    );

    await fs.writeFile(bundleFile, '');

    for (const cssFile of filteredCssFiles) {
      const filePath = path.join(stylesDir, cssFile);
      const fileContent = await fs.readFile(filePath, 'utf8');
      await fs.appendFile(bundleFile, fileContent, 'utf8');
    }

    console.log('Поздравляю! Стили успешно объединены.');
  } catch (error) {
    console.log(`Ошибка при объединении стилей: ${error.message}`);
  }
}

mergeStyles();
