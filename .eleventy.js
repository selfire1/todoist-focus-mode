module.exports = function (eleventyConfig) {
    const { EleventyServerlessBundlerPlugin } = require("@11ty/eleventy");
    eleventyConfig.addPlugin(EleventyServerlessBundlerPlugin, {
        name: "serverless",
        functionsDir: "./netlify/functions/"
    });
    eleventyConfig.addPassthroughCopy("src/css/");
    eleventyConfig.addPassthroughCopy("src/js/");
    eleventyConfig.addPassthroughCopy({ "./node_modules/@doist/todoist-api-typescript/dist/TodoistApi.js": "/js/TodoistApi.js" });
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