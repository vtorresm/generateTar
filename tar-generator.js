import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import tar from 'tar';

async function createTarArchive(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputPath);
    const archive = tar.c({ cwd: inputPath, sync: true }, fs.readdirSync(inputPath));

    archive.pipe(output);

    archive.on('end', () => {
      console.log('Archivo .tar creado exitosamente:', outputPath);
      resolve();
    });

    output.on('error', (err) => {
      reject(err);
    });

    archive.finalize();
  });
}

async function main() {
  const questions = [
    {
      type: 'input',
      name: 'inputPath',
      message: 'Ruta de la carpeta que deseas comprimir:',
      validate: (inputPath) => {
        if (!fs.existsSync(inputPath)) {
          return 'La ruta no existe.';
        }
        if (!fs.lstatSync(inputPath).isDirectory()) {
          return 'Ingresa una ruta válida de carpeta.';
        }
        return true;
      },
    },
    {
      type: 'input',
      name: 'outputPath',
      message: 'Ruta y nombre del archivo .tar:',
      validate: (outputPath) => {
        const dir = path.dirname(outputPath);
        if (!fs.existsSync(dir)) {
          return 'La ruta de salida no existe.';
        }
        return true;
      },
    },
  ];

  try {
    const answers = await inquirer.prompt(questions);
    await createTarArchive(answers.inputPath, answers.outputPath);
  } catch (error) {
    console.error('Ocurrió un error:', error.message);
    if (error.code === 'EISDIR') {
      console.error('No se puede crear un archivo .tar desde una carpeta directamente.');
    }
  }
}

main();
