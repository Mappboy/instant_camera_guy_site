
const { handleImage } = require('./config/eleventy/image');
const {
  fortawesomeBrandsPlugin,
} = require('@vidhill/fortawesome-brands-11ty-shortcode');
const Image = require("@11ty/eleventy-img");
const markdownIt = require("markdown-it");

module.exports = function(eleventyConfig) {  
  let options = {
    html: true,
    breaks: true,
    linkify: true
  };

  eleventyConfig.setLibrary("md", markdownIt(options));
  eleventyConfig.addShortcode("version", function () {
    return String(Date.now());
  });
  // Apparently this, on top of the PostCSS pruning options watching 11ty, helps 11ty watch Tailwind or something.
  eleventyConfig.addPassthroughCopy({ 'src/assets/fonts': 'fonts' });
  eleventyConfig.addPassthroughCopy('src/**/*.{gif,svg}');
  eleventyConfig.addPassthroughCopy('src/assets/images');
  eleventyConfig.addPassthroughCopy('src/assets/favicon.ico');
  eleventyConfig.addPassthroughCopy('src/assets/manifest.json');

  if (process.env.NODE_ENV === 'development') {
    eleventyConfig.addPassthroughCopy('src/**/*.{jpg,jpeg,png,webp}');
  }

  // /* Filters */
  // eleventyConfig.addFilter('jsAsset', (name) => {
  //   return manifest[name];
  // });

  /* shortcodes */
  eleventyConfig.addShortcode('Image', handleImage);

  eleventyConfig.addPlugin(fortawesomeBrandsPlugin);

  eleventyConfig.addShortcode("image_remote", async function(src, alt, sizes) {
    let metadata = await Image(src, {
      widths: [300, 600, 900, 1200],
      formats: ["avif", "webp", "jpeg"],
      outputDir: "./_site/img/",
    });

    let imageAttributes = {
      alt,
      sizes,
      loading: "lazy",
      decoding: "async",
    };

    // You bet we throw an error on a missing alt (alt="" works okay)
    return Image.generateHTML(metadata, imageAttributes);
  });
    
    // Copy `src/style.css` to `_site/style.css`  
    eleventyConfig.addPassthroughCopy("src/style.css"); 
     return {    
        // When a passthrough file is modified, rebuild the pages:   
         passthroughFileCopy: true,   
          dir: {      
            input: "src",      
            includes: "_includes",     
            data: "_data",      
            output: "_site"    } 
            };
            templateFormats: [
                'html',
                'liquid',
                'md',
                'njk',
                'webc'
              ]
              	// WebC
            };