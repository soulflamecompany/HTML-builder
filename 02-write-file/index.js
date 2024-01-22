const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'your-textFile.txt');
const writeStream = fs.createWriteStream(filePath, { flags: 'a' });

console.log(
  'Салам алейкум!(Для выхода введите "exit" или нажмите Ctrl+C) \nВведите текст:',
);

process.stdin.on('data', (input) => {
  const userInput = input.toString().trim().toLowerCase();
  if (userInput === 'exit') {
    console.log('До свидания! Процесс записи прерван (Ввели "exit")');
    writeStream.end();
    process.exit(0);
  }
  writeStream.write(`${userInput}\n`);
  console.log(
    '\nТекст успешно записан в файл. Для продолжения - Введите еще текст:\n',
  );
});

process.on('SIGINT', () => {
  console.log('\nДо свидания! Процесс записи прерван (Нажали Ctrl+C)');
  writeStream.end();
  process.exit(0);
});
