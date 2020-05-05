const fs = require('fs');
const path = require('path');
const yaml = require('yaml');

const filePath = path.resolve('env', `.config.yaml`);
const fileContent = fs.readFileSync(filePath, 'utf8');
const parsed = yaml.parse(fileContent);

module.exports = parsed[process.env.DEPLOYMENT || 'development'].database;
