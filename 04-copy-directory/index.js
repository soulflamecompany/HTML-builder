const fs = require('fs');
const path = require('path');

const sourceDirectory = path.join(__dirname, 'files');
const destinationDirectory = path.join(__dirname, 'files-copy');

function copyFiles(sourcePath, destinationPath) {
  fs.mkdir(destinationPath, { recursive: true }, (err) => {
    if (err)
      return console.log(`Ошибка при создании директории: ${err.message}`);

    fs.readdir(destinationPath, (err, files) => {
      if (err)
        return console.log(
          `Ошибка при чтении целевой директории: ${err.message}`,
        );

      files.forEach((fileName) => {
        const filePath = path.join(destinationPath, fileName);
        fs.unlink(
          filePath,
          (err) =>
            err && console.log(`Ошибка при удалении файла: ${err.message}`),
        );
      });
    });

    fs.readdir(sourcePath, (err, files) => {
      if (err)
        return console.log(
          `Ошибка при чтении исходной директории: ${err.message}`,
        );

      files.forEach((fileName) => {
        const sourceFilePath = path.join(sourcePath, fileName);
        const destFilePath = path.join(destinationPath, fileName);

        fs.copyFile(
          sourceFilePath,
          destFilePath,
          fs.constants.COPYFILE_FICLONE,
          (err) =>
            err && console.log(`Ошибка при копировании файла: ${err.message}`),
        );
      });
    });
  });
}

copyFiles(sourceDirectory, destinationDirectory);
