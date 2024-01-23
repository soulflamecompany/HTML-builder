const fs = require('fs').promises;
const path = require('path');

async function processPageBuild() {
  const sourceDir = path.join(__dirname);
  const destinationDir = path.join(sourceDir, 'project-dist');
  const templatePath = path.join(sourceDir, 'template.html');
  const indexPath = path.join(destinationDir, 'index.html');
  const assetsSourceDir = path.join(sourceDir, 'assets');
  const assetsDestinationDir = path.join(destinationDir, 'assets');

  try {
    await fs.mkdir(destinationDir, { recursive: true });

    const templateContent = await fs.readFile(templatePath, 'utf-8');
    const componentTags = templateContent.match(/{{\s*([^}\s]+)\s*}}/g);

    if (componentTags) {
      const modifiedContent = await createIndexFile(
        templateContent,
        componentTags,
        sourceDir,
      );
      await fs.writeFile(indexPath, modifiedContent);
      console.log('index.html успешно создан.');
    }

    await processStyles(sourceDir, destinationDir);
    await copyAssets(assetsSourceDir, assetsDestinationDir);
    console.log('Процесс сборки завершен успешно.');
  } catch (error) {
    console.error(`Ошибка при сборке страницы: ${error.message}`);
  }
}

async function createIndexFile(templateContent, componentTags, sourceDir) {
  let modifiedContent = templateContent;

  for (const tag of componentTags) {
    const componentName = tag.match(/{{\s*([^}\s]+)\s*}}/)[1];
    const componentPath = path.join(
      sourceDir,
      'components',
      `${componentName}.html`,
    );
    const componentContent = await fs.readFile(componentPath, 'utf-8');
    modifiedContent = modifiedContent.replace(tag, componentContent);
  }

  return modifiedContent;
}

async function processStyles(sourceDir, destinationDir) {
  const stylesSourceDir = path.join(sourceDir, 'styles');
  const stylesDestinationDir = destinationDir;
  const stylesOutputFile = path.join(stylesDestinationDir, 'style.css');

  const files = await fs.readdir(stylesSourceDir);
  const cssFiles = files.filter((file) => path.extname(file) === '.css');

  const styles = await Promise.all(
    cssFiles.map(async (file) => {
      const filePath = path.join(stylesSourceDir, file);
      return await fs.readFile(filePath, 'utf-8');
    }),
  );

  await fs.writeFile(stylesOutputFile, styles.join('\n'));
  console.log('style.css успешно создан.');
}

async function copyAssets(sourceDir, destinationDir) {
  const entries = await fs.readdir(sourceDir, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name);
    const destinationPath = path.join(destinationDir, entry.name);

    if (entry.isDirectory()) {
      await fs.mkdir(destinationPath, { recursive: true });
      await copyAssets(sourcePath, destinationPath);
    } else {
      await fs.copyFile(sourcePath, destinationPath);
    }
  }

  console.log('assets успешно скопирован.');
}

processPageBuild();
