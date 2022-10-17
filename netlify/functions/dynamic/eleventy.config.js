const faviconPlugin = require("eleventy-favicon");
const { EleventyRenderPlugin } = require("@11ty/eleventy");
const { EleventyServerlessBundlerPlugin } = require("@11ty/eleventy");
const Image = require("@11ty/eleventy-img");

async function imageShortcode(src, alt, sizes) {
    let metadata = await Image(src, {
        widths: [500, 800, 1000],
        formats: ["avif", "jpeg"],
        outputDir: "./_site/img/"
    });

    let imageAttributes = {
        alt,
        sizes,
        loading: "lazy",
        decoding: "async",
    };

    // You bet we throw an error on missing alt in `imageAttributes` (alt="" works okay)
    return Image.generateHTML(metadata, imageAttributes);
}

module.exports = function (eleventyConfig) {
    // Sorting filter
    eleventyConfig.addFilter("customSort", function (tasksArr, queryStr) {
        // No sort is set
        if (!queryStr) { return tasksArr }
        let tasks = tasksArr;
        // Split sort parameters by ","
        let queryArr = queryStr.split(",")
        // Construct an object based on the query
        let queryObj = {};
        queryArr.forEach(element => {
            let key = element.split(":")[0];
            let value = element.split(":")[1]
            queryObj[key] = value;
        });
        // return queryObj;
        tasks = tasks.sort((a, b) => {
            for (const parameter in queryObj) {
                if (Object.hasOwnProperty.call(queryObj, parameter)) {
                    let asc;
                    // Check if query is ascending or descending
                    queryObj[parameter] == "asc" ? asc = true : asc = false;
                    let compA;
                    let compB;
                    switch (parameter) {
                        case "prio":
                            compA = a.priority
                            compB = b.priority
                            if (!asc) {
                                // Reverse the order on a descending call
                                if (compA < compB) { return 1; }
                                if (compA > compB) { return -1; }
                                return 0;
                            }
                            if (compA < compB) { return -1; }
                            if (compA > compB) { return 1; }
                            return 0;
                            break;
                        case "proj":
                            compA = a.project_id;
                            compB = b.project_id;
                        case "due":
                            console.log("comparing date")
                            compA = new Date(a.due?.date) || 0;
                            compB = new Date(b.due?.date) || 0;
                            if (!asc) {
                                // reverse the sort on a descending call
                                return (compB - compA);
                            }
                            return (compA - compB);
                        case "alph":
                            compA = a.content;
                            compB = b.content;
                        default:
                            break;
                    }
                    if (!asc) {
                        if (compA < compB) { return 1; }
                        if (compA > compB) { return -1; }
                        return 0;
                    }
                }
                if (compA < compB) { return -1; }
                if (compA > compB) { return 1; }
                return 0;
            }
        }

        )
        return tasks;
    })
    // Filters
    const markdownIt = require("markdown-it");
    const markdownItRenderer = new markdownIt();

    eleventyConfig.addFilter('markdownify', (str) => {
        return markdownItRenderer.renderInline(str);
    });

    eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);


    // Plugins
    eleventyConfig.addPlugin(EleventyRenderPlugin);
    eleventyConfig.addPlugin(faviconPlugin);
    eleventyConfig.addPlugin(EleventyServerlessBundlerPlugin, {
        name: "dynamic",
        functionsDir: "./netlify/functions/"
    });
    // Passthrough
    eleventyConfig.addPassthroughCopy("src/css/");
    eleventyConfig.addPassthroughCopy("src/assets");
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