/* global module, process */
module.exports = function() {
  return {
    pagefront: {
      app: 'csv-generator',
      key: process.env.PAGEFRONT_KEY
    }
  };
};
