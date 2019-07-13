
const w = 800;
const h = 500;
const padding = 40;

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

const heading = d3.select("#heading");
const canvas = d3.select("#chart-container")
                .append("svg")
                .attr("id", "chart")
                .style("background", "#ddd")
                .attr("width", w + padding)
                .attr("height", h + padding);

const svg = d3.select("#chart");

d3.queue()
    .defer(d3.json, DATA_SETS.videogames.URL)
    .defer(d3.json, DATA_SETS.movies.URL)
    .defer(d3.json, DATA_SETS.kickstarters.URL)
    .await(ready)

function ready(error, vgData, mvData, ksData) {
    
    if (error) {throw error};

    let currentData = vgData;

    function render() {
        
        heading.html(currentData.name);

        svg
            .selectAll("g")
            .data(currentData.children)
            .enter()
            .append("g")
            .style("border", function(d, i ) {
                console.log(d.children[0]);
                return "1px solid black";
            })


            
            

    }

    function changeSource(newSource) {
        currentData = newSource;
        svg.selectAll("*").remove();
        render();
    }

    render();
    



    mvButton.on("click", () => changeSource(mvData));
    vgButton.on("click", () => changeSource(vgData));
    ksButton.on("click", () => changeSource(ksData));
    
}