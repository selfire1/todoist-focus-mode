module.exports = function (eleventyConfig) {
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