const w = 700;
const h = 500;

const DATA_SETS = {
    videogames: {
        TITLE: "Video Game Sales",
        DESC: "Top 100 Most Sold Video Games Grouped by Platform",
        URL: "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json"
    },
    movies: {
        TITLE: "Movie Sales",
        DESC: "Top 100 Highest Grossing Movies Grouped By Genre",
        URL: "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/movie-data.json"
    },
    kickstarters: {
        TITLE: "Kickstarter Pledges",
        DESC: "Top 100 Most Pledged Kickstarter Campaigns Grouped By Category",
        URL: "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/kickstarter-funding-data.json"
    }
}

const mvButton = d3.select("#button-container")
                    .append("div")
                    .attr("class", "button")
                    .html("<p>Movies</p>");

const vgButton = d3.select("#button-container")
                    .append("div")
                    .attr("class", "button")
                    .html("<p>Video Games</p>");

const ksButton = d3.select("#button-container")
                    .append("div")
                    .attr("class", "button")
                    .html("<p>Kickstarters</p>");

const treeMapLayout = d3.treemap();
const svg = d3.select("#chart-container").append("svg").attr("id", "chart").attr("width", w).attr("height", h);

d3.queue()
    .defer(d3.json, DATA_SETS.videogames.URL)
    .defer(d3.json, DATA_SETS.movies.URL)
    .defer(d3.json, DATA_SETS.kickstarters.URL)
    .await(ready)

function ready(error, vgData, mvData, ksData) {
    
    let currentData = vgData;

    treeMapLayout
        .size([w, h])
        .paddingOuter(0);

    let root = d3.hierarchy(currentData);

    root.sum(d => d.value);

    treeMapLayout(root);

    d3.select('svg')
        .selectAll('rect')
        .data(root.descendants())
        .enter()
        .append('rect')
        .attr('x', function(d) { return d.x0; })
        .attr('y', function(d) { return d.y0; })
        .attr('width', function(d) { return d.x1 - d.x0; })
        .attr('height', function(d) { return d.y1 - d.y0; })
        .style("stroke", "black")
        .style("fill", "none")


    //console.log(root);
}