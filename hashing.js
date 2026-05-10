const crypto = require('crypto');

/**
 * Generates a SHA-256 hash of the critical crate data.
 * Keys are sorted to ensure deterministic hashing regardless of property order.
 * @param {Object} data - The critical crate data
 * @returns {string} SHA-256 hash in hex format
 */
function generateDataHash(data) {
  const sortedData = Object.keys(data).sort().reduce((acc, key) => {
    acc[key] = data[key];
    return acc;
  }, {});

  const dataString = JSON.stringify(sortedData);
  return crypto.createHash('sha256').update(dataString).digest('hex');
}

module.exports = { generateDataHash };
