const fs = require('fs').promises;
const path = require('path');

async function processBuildPage() {
  const sourceDirectory = __dirname;
  const outputDirectory = path.join(sourceDirectory, 'project-dist');
  const templateFilePath = path.join(sourceDirectory, 'template.html');
  const indexFilePath = path.join(outputDirectory, 'index.html');
  const componentsDirectory = path.join(sourceDirectory, 'components');
  const assetsDirectory = path.join(sourceDirectory, 'assets');
  const stylesDirectory = path.join(sourceDirectory, 'styles');

  try {
    await createDirectory(outputDirectory);

    const templateContent = await readFile(templateFilePath);
    const componentTags = templateContent.match(/{{\s*([^}\s]+)\s*}}/g);

    if (componentTags) {
      const modifiedContent = await processComponents(
        templateContent,
        componentTags,
        componentsDirectory,
      );
      await writeFile(indexFilePath, modifiedContent);
      console.log('index.html успешно создан.');
    }

    await processStyles(stylesDirectory, outputDirectory);
    await copyAssets(assetsDirectory, path.join(outputDirectory, 'assets'));
    console.log('Процесс сборки завершен успешно.');
  } catch (error) {
    console.error(`Ошибка при сборке страницы: ${error.message}`);
  }
}

async function createDirectory(directoryPath) {
  await fs.mkdir(directoryPath, { recursive: true });
}

async function readFile(filePath) {
  return await fs.readFile(filePath, 'utf-8');
}

async function writeFile(filePath, content) {
  await fs.writeFile(filePath, content);
}

async function processComponents(
  templateContent,
  componentTags,
  componentsDirectory,
) {
  let modifiedContent = templateContent;

  componentTags.forEach((tag) => {
    const componentName = tag.match(/{{\s*([^}\s]+)\s*}}/)[1];
    const componentFilePath = path.join(
      componentsDirectory,
      `${componentName}.html`,
    );
    const componentContent = readFile(componentFilePath);
    modifiedContent = modifiedContent.replace(tag, componentContent);
  });

  return modifiedContent;
}

async function processStyles(stylesDirectory, outputDirectory) {
  const outputStylesFilePath = path.join(outputDirectory, 'style.css');
  const cssFiles = await getFilesWithExtension(stylesDirectory, '.css');
  const styles = await Promise.all(
    cssFiles.map((file) => readFile(path.join(stylesDirectory, file))),
  );

  await writeFile(outputStylesFilePath, styles.join('\n'));
  console.log('style.css успешно создан.');
}

async function getFilesWithExtension(directory, extension) {
  const files = await fs.readdir(directory);
  return files.filter((file) => path.extname(file) === extension);
}

async function copyAssets(sourceDirectory, destinationDirectory) {
  const entries = await fs.readdir(sourceDirectory, { withFileTypes: true });

  entries.forEach(async (entry) => {
    const sourcePath = path.join(sourceDirectory, entry.name);
    const destinationPath = path.join(destinationDirectory, entry.name);

    if (entry.isDirectory()) {
      await createDirectory(destinationPath);
      await copyAssets(sourcePath, destinationPath);
    } else {
      await fs.copyFile(sourcePath, destinationPath);
    }
  });

  console.log('assets успешно скопирован.');
}

processBuildPage();
