const binaryPermissioner = strict => d => s => h => t => m => a => binPem => {
  if(binPem === undefined || binPem === null) return false;

  let bin = binPem.toString(2);

  for(let i = 0; i < 6 - binPem.toString(2).length; i++) {
    bin = "0" + bin;
  }

  if(strict) {
    let noPem = false;

    if(d === 1 && bin[5] !== '1') noPem = true;
    if(s === 1 && bin[4] !== '1') noPem = true;
    if(h === 1 && bin[3] !== '1') noPem = true;
    if(t === 1 && bin[2] !== '1') noPem = true;
    if(m === 1 && bin[1] !== '1') noPem = true;
    if(a === 1 && bin[0] !== '1') noPem = true;

    return !noPem;
  }
  else {
    let pem = false;

    if(d === 1 && bin[5] === '1') pem = true;
    if(s === 1 && bin[4] === '1') pem = true;
    if(h === 1 && bin[3] === '1') pem = true;
    if(t === 1 && bin[2] === '1') pem = true;
    if(m === 1 && bin[1] === '1') pem = true;
    if(a === 1 && bin[0] === '1') pem = true;

    return pem;
  }
};

export default binaryPermissioner;
