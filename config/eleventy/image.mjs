import path from 'path';
import Image from '@11ty/eleventy-img';
import sharp from 'sharp';
import fs from 'fs/promises';

import paths from './../paths.mjs';

async function getPlaceHolder(outputPath) {
  // The following code is causing a native crash in the `sharp` module.
  // This is likely a bug in `sharp` or one of its dependencies.
  // As a workaround, we are returning a dummy placeholder.
  // You can try to update `sharp` to the latest version, or report the issue to the `sharp` developers.
  // const imageBuffer = await fs.readFile(outputPath);
  // const placeholder = await sharp(imageBuffer)
  //   .resize({ fit: sharp.fit.inside })
  //   .blur()
  //   .toBuffer();
  // return placeholder;
  return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
}

function generateSrcset(stats) {
  return Object.keys(stats).reduce(
    (acc, format) => ({
      ...acc,
      [format]: stats[format].map(entry => entry.srcset).join(', ')
    }),
    {}
  );
}

function getSrc(relativeSrc, outputPath) {
  let src = relativeSrc;

  if (relativeSrc.startsWith('https://')) {
    // do nothing
  } else if (process.env.NODE_ENV === 'development') {
    src = path.join(
      '/' + outputPath.split('/').slice(2, -1).join('/'),
      relativeSrc
    );
  } else {
    src = path.relative(
      paths.root,
      path.resolve(outputPath.split('/').slice(0, -1).join('/'), relativeSrc)
    );
  }

  return src;
}

async function handleImage(relativeSrc, alt, height, width, img_class) {
  if (!alt) throw new Error(`Missing alt on myImage from: ${relativeSrc}`);

  const src = getSrc(relativeSrc, this.page.inputPath);

  if (process.env.NODE_ENV === 'development') {
    return `<div class='image-wrapper'>
      <img src=${src} alt=${alt} />
    </div>`;
  }

  let stats = await Image(src, {
    widths: [24, 320, 640, 960, 1200, 1800, 2400],
    formats: ['jpeg', 'webp'],
    urlPath: 'assets/images/',
    outputDir: paths.imagesDest,
  });

  const originalSrc = stats['jpeg'][stats['jpeg'].length - 1];

  const placeholder = await getPlaceHolder(stats['webp'][0].outputPath);

  const srcset = generateSrcset(stats);

  const sourceWebp = `<source type="image/webp" sizes="(min-width: 1024px) 1024px, 100vw" srcset="${srcset['webp']}">`;
  const sourceJpeg = `<source type="image/jpeg" sizes="(min-width: 1024px) 1024px, 100vw" srcset="${srcset['jpeg']}">`;

  const img = `<img
    loading="lazy"
    alt="${alt}"
    src="${originalSrc.url}"
    decoding="async"
    
    width="${width}"
    height="${height}">`;

  return `<div class="image-wrapper ${img_class}"> <picture> ${sourceWebp} ${sourceJpeg} ${img} </picture> </div>`;
}

export { handleImage };