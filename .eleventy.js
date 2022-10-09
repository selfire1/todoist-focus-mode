const { EleventyRenderPlugin } = require("@11ty/eleventy");
const { EleventyServerlessBundlerPlugin } = require("@11ty/eleventy");

module.exports = function (eleventyConfig) {
    // Sorting filter
    eleventyConfig.addFilter("customSort", function (tasksArr, queryStr) {
        // No sort is set
        if (!queryStr) { return tasksArr }
        // Split sort parameters by ","
        let queryArr = queryStr.split(",")
        // Construct an object based on the query
        let queryObj = {};
        queryArr.forEach(element => {
            let key = element.split(":")[0];
            let value = element.split(":")[1]
            queryObj[key] = value;
        });
        return queryObj;
        console.log(tasksObj)
        console.log(queryStr)
    })
    // Filters
    const markdownIt = require("markdown-it");
    const markdownItRenderer = new markdownIt();

    eleventyConfig.addFilter('markdownify', (str) => {
        return markdownItRenderer.renderInline(str);
    });
    // Plugins
    eleventyConfig.addPlugin(EleventyRenderPlugin);
    eleventyConfig.addPlugin(EleventyServerlessBundlerPlugin, {
        name: "dynamic",
        functionsDir: "./netlify/functions/"
    });
    // Passthrough
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