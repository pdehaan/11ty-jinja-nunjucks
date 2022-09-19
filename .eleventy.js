const { EleventyRenderPlugin } = require("@11ty/eleventy");
const { parse } = require("csv-parse/sync");

/**
 * @typedef {import('@11ty/eleventy/src/UserConfig')} EleventyConfig
 * @typedef {ReturnType<import('@11ty/eleventy/src/defaultConfig')>} EleventyReturnValue
 * @type {(eleventyConfig: EleventyConfig) => EleventyReturnValue}
 */
 module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(EleventyRenderPlugin);

  eleventyConfig.addDataExtension("csv", (contents) => {
    const records = parse(contents, {
      columns: true,
      delimiter: '|',
      skip_empty_lines: true,
    });
    return records;
  });

  eleventyConfig.addFilter("inspect", require("node:util").inspect);

  eleventyConfig.addFilter("filter_url", function (name, lang="jinja") {
    if (!name) {
      return `**n/a**`;
    }
    if (!["jinja", "nunjucks"].includes(lang)) {
      throw new Error(`Unknown \`filter_url.lang\`: "${lang}"`);
    }
    const prefixes = {
      jinja: "https://jinja.palletsprojects.com/en/3.1.x/templates/#jinja-filters.",
      nunjucks: "https://mozilla.github.io/nunjucks/templating.html#",
    };
    const langUriPrefix = prefixes[lang];
    return `[\`${name}\`](${langUriPrefix + name})`;
    return `<a href="${prefixes[lang]}${name}"><code>${name}</code></a>`;
  });

  return {
    dir: {
      input: "src",
      output: "www",
    },
    markdownTemplateEngine: "njk"
  };
};
