import inquirer from 'inquirer';

// Función que solicita n valores y los concatena
async function concatenateWords() {
  const prompt = await inquirer.prompt([
    {
      type: 'input',
      name: 'numWords',
      message: 'Cuántas palabras deseas ingresar y concatenar?',
      validate: (value) => {
        const parsedValue = parseInt(value);
        if (!isNaN(parsedValue) && parsedValue > 0) {
          return true;
        }
        return 'Ingresa un número válido mayor que 0.';
      },
    },
  ]);

  const numWords = parseInt(prompt.numWords);
  const words = [];

  for (let i = 0; i < numWords; i++) {
    const wordPrompt = await inquirer.prompt([
      {
        type: 'input',
        name: `word${i}`,
        message: `Ingresa la palabra ${i + 1}:`,
      },
    ]);
    words.push(wordPrompt[`word${i}`]);
  }

  const concatenatedString = words.join(' ');
  console.log('Cadena concatenada:', concatenatedString);
}

concatenateWords();
