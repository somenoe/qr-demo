const encoder = salt => {
  const textToChars = text => text.split('').map(c => c.charCodeAt(0));
  const byteHex = n => ("0" + Number(n).toString(16)).substr(-2);
  const applySaltToChar = code => textToChars(salt).reduce((a, b) => a ^ b, code);

  return text => text.split('')
    .map(textToChars)
    .map(applySaltToChar)
    .map(byteHex)
    .join('');
}

const decoder = salt => {
  const textToChars = text => text.split('').map(c => c.charCodeAt(0));
  const applySaltToChar = code => textToChars(salt).reduce((a, b) => a ^ b, code);
  return encoded => encoded.match(/.{1,2}/g)
    .map(hex => parseInt(hex, 16))
    .map(applySaltToChar)
    .map(charCode => String.fromCharCode(charCode))
    .join('');
}

const testOnConsole = () => {

  // create a secret key to decrypt the secret text
  const secretKey = 'SecretTextKey';

  // text that you did not want anyone to read
  const targetText = 'the secret string';

  // create a secret text generator
  const secretTextGenerator = encoder(secretKey);

  // create a secret text
  const secretText = secretTextGenerator(targetText);

  // to read the secret text, you need to create a reader that have same secret key to read it
  const secretTextReader = decoder(secretKey);

  // ! cannot decode to THAI
  // use the reader to turn secret text into normal text
  const resultText = secretTextReader(secretText);

  console.log('target key    = ', targetText);
  console.log('secret key    = ', secretKey);
  console.log('secret text   = ', secretText);
  console.log('readable text = ', resultText);
}
