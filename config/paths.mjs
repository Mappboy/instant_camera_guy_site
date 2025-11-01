import fs from 'fs';
import fg from 'fast-glob';
import path from 'path';

const appDirectory = fs.realpathSync(process.cwd());

const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

const src = resolveApp('src');

export default {
  src,

  root: appDirectory,

  imagesDest: resolveApp('_site/assets/images'),

  webpack: {
    entry: [resolveApp('src/assets/js/app'), resolveApp('src/assets/styles/main.css')],
    output: {
      path: resolveApp('public'),
    },
  },

  html: {
    glob: fg.sync(resolveApp('_site/**/*.html'), { dot: false }),
  },
};