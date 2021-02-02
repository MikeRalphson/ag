module.exports = function(eleventyConfig) {
  // Add a filter using the Config API
  //eleventyConfig.addFilter( "myFilter", function() {});

  // You can return your Config object (optional).
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/.nojekyll");
  return {
    dir: {
      // ⚠️ These values are both relative to your input directory.
      includes: "_includes",
      layouts: "_layouts"
    }
  };
};

