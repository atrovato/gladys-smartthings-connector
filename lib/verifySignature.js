const httpSignature = require('http-signature');

/**
 * Verifies that the request is actually from SmartThings.
 * @returns true if verified, false otherwise.
 */
module.exports = function signatureIsVerified(req) {
  // WARNING: DO NOT USE THIS IN PRODUCTION
  // We will read the public key from FS everytime we need to verify
  // COMMENT OUT THIS LINE INPRODUCTION
  const publicKey = fs.readFileSync('./config/smartthings_rsa.pub', 'utf8');
  // END WARNING
  try {
    let parsed = httpSignature.parseRequest(req);
    if (!httpSignature.verifySignature(parsed, publicKey)) {
      console.error('SmartThings Connector: forbidden - failed verifySignature');
      return false;
    }
  } catch (error) {
    console.error('SmartThings Connector:', error);
    return false;
  }
  return true;
};
