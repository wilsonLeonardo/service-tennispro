import fs from 'fs';
import path from 'path';
import yaml from 'yaml';

function getConfig() {
  const filePath = path.resolve('env', `.config.yaml`);
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const parsed = yaml.parse(fileContent);
  return parsed[(process.env.DEPLOYMENT as string) || 'development'];
}

export default getConfig();
