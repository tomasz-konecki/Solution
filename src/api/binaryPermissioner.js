const binaryPermissioner = d => s => h => t => m => a => binPem => {
  if(binPem === undefined || binPem === null) return false;
  let bin = binPem.toString(2);
  let noPem = false;

  if(d === 1 && bin[5] !== '1'){
    noPem = true;
    console.log('d crossed out');
  }
  if(s === 1 && bin[4] !== '1'){
    noPem = true;
    console.log('s crossed out');
  }
  if(h === 1 && bin[3] !== '1'){
    noPem = true;
    console.log('h crossed out');
  }
  if(t === 1 && bin[2] !== '1'){
    noPem = true;
    console.log('t crossed out');
  }
  if(m === 1 && bin[1] !== '1'){
    noPem = true;
    console.log('m crossed out', m, bin[1]);
  }
  if(a === 1 && bin[0] !== '1'){
    noPem = true;
    console.log('a crossed out');
  }

  console.log(d, s, h, t, m, a, binPem, bin, bin.length, 'pem?', !noPem);

  return !noPem;
};

export default binaryPermissioner;
