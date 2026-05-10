import fs from 'node:fs';
import path from 'node:path';

const createCssPlugin = () => ({
  name: 'css-plugin',
  configResolved: config => {
    const CSS_PATH = path.resolve(config.root, 'src/v-scroll.css');
    const OUT_PATH = path.resolve(config.root, 'src/v-scroll-css.js');
    
    if (!fs.existsSync(CSS_PATH)) return;
    
    let css = fs.readFileSync(CSS_PATH, 'utf-8');
    css = css
      .replace(/\/\/.*$/gm, '')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\s+/g, ' ')
      .trim();
    
    fs.writeFileSync(OUT_PATH, `export default ${JSON.stringify(css)};`);
  }
});

export default createCssPlugin;