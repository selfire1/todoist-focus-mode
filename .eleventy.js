module.exports = function (eleventyConfig) {
    const { EleventyRenderPlugin } = require("@11ty/eleventy");
    eleventyConfig.addPlugin(EleventyRenderPlugin);
    const { EleventyServerlessBundlerPlugin } = require("@11ty/eleventy");
    eleventyConfig.addPlugin(EleventyServerlessBundlerPlugin, {
        name: "dynamic",
        functionsDir: "./netlify/functions/"
    });
    const markdownIt = require("markdown-it");
    const markdownItRenderer = new markdownIt();

    eleventyConfig.addFilter('markdownify', (str) => {
        return markdownItRenderer.renderInline(str);
    });
    eleventyConfig.addPassthroughCopy("src/css/");
    eleventyConfig.addPassthroughCopy("src/js/");
    return {
        dir: {
            input: "src",
            output: "_site",
            includes: '_includes',
            layouts: 'layouts',
            data: '_data'
        },
    };
};