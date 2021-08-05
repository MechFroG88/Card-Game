var crypto = require('crypto');

export const makeid = (length : number) => {
  var result           = [];
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    let rand = crypto.randomInt(0, 4294967295) / 4294967295;
    result.push(characters.charAt(Math.floor(rand * charactersLength)));
  }
  return result.join('');
};