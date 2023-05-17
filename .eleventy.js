const { handleImage } = require("./config/eleventy/image");
const {
  fortawesomeBrandsPlugin,
} = require("@vidhill/fortawesome-brands-11ty-shortcode");
const Image = require("@11ty/eleventy-img");
const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");


module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin, {
    baseHref: eleventyConfig.pathPrefix
  });
  eleventyConfig.addPassthroughCopy({ "src/assets/fonts": "fonts" });
  eleventyConfig.addPassthroughCopy("src/**/*.{gif,svg}");
  eleventyConfig.addPassthroughCopy("src/assets/images");
  eleventyConfig.addPassthroughCopy("src/assets/favicon.ico");
  eleventyConfig.addPassthroughCopy("src/assets/manifest.json");

  if (process.env.NODE_ENV === "development") {
    eleventyConfig.addPassthroughCopy("src/**/*.{jpg,jpeg,png,webp}");
  }

  // /* Filters */
  // eleventyConfig.addFilter('jsAsset', (name) => {
  //   return manifest[name];
  // });

  /* shortcodes */
  eleventyConfig.addShortcode("Image", handleImage);

  eleventyConfig.addPlugin(fortawesomeBrandsPlugin);

  eleventyConfig.addShortcode("image_remote", async function (src, alt, sizes) {
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

  return {
    // When a passthrough file is modified, rebuild the pages:
    passthroughFileCopy: true,
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    pathPrefix: "/the_instant_camera_guy_site/"
  };
  templateFormats: ["html", "liquid", "md", "njk", "webc"];
  // WebC
};
