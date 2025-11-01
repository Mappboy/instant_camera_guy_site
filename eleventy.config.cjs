module.exports = async function(eleventyConfig) {
  const { handleImage } = await import("./config/eleventy/image.mjs");
  const {
    fortawesomeBrandsPlugin,
  } = await import("@vidhill/fortawesome-brands-11ty-shortcode");
  const Image = (await import("@11ty/eleventy-img")).default;
  const { EleventyHtmlBasePlugin } = await import("@11ty/eleventy");
  const postcss = (await import("postcss")).default;
  const tailwindcss = (await import("tailwindcss")).default;
  const autoprefixer = (await import("autoprefixer")).default;
  const fs = require("fs");

  // Eleventy v3: Use new plugin API and updated passthroughCopy
  eleventyConfig.addTemplateFormats("css");
  eleventyConfig.addExtension("css", {
    outputFileExtension: "css",
    compile: async (inputContent, inputPath) => {
      if (inputPath !== "./src/style.css") {
        return;
      }
      return async () => {
        let result = await postcss([
          tailwindcss,
          autoprefixer,
        ]).process(inputContent, { from: inputPath });
        return result.css;
      };
    },
  });

  eleventyConfig.addPlugin(EleventyHtmlBasePlugin, {
    baseHref: "instant_camera_guy_site"
  });

  // Passthrough copy (v3 syntax is the same, but keep up to date)
  eleventyConfig.addPassthroughCopy({ "src/assets/fonts": "fonts" });
  eleventyConfig.addPassthroughCopy({ "src/assets/images": "assets/images" });
  eleventyConfig.addPassthroughCopy({ "src/assets/favicon.ico": "assets/favicon.ico" });
  eleventyConfig.addPassthroughCopy({ "src/assets/manifest.json": "assets/manifest.json" });
  eleventyConfig.addPassthroughCopy("src/**/*.{gif,svg}");
  if (process.env.NODE_ENV === "development") {
    eleventyConfig.addPassthroughCopy("src/**/*.{jpg,jpeg,png,webp}");
  }

  // Shortcodes and plugins
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
    return Image.generateHTML(metadata, imageAttributes);
  });

  eleventyConfig.setServerOptions({
    // ... other options
    callbacks: {
      ready: function(err, bs) {
        bs.addMiddleware("*", (req, res) => {
          if (req.url === "/style.css") {
            fs.readFile("src/style.css", (err, css) => {
              if (err) {
                throw err;
              }
              postcss([tailwindcss, autoprefixer])
                .process(css, { from: "src/style.css" })
                .then((result) => {
                  res.setHeader("Content-Type", "text/css");
                  res.end(result.css);
                });
            });
          }
        });
      }
    }
  });

  return {
    passthroughFileCopy: true,
    dir: {
      input: "src",
      includes: "_includes",
      layouts: "_includes",
      data: "_data",
      output: "_site",
    },
    pathPrefix: "/the_instant_camera_guy_site/",
    templateFormats: ["html", "liquid", "md", "njk", "webc"]
  };
};
