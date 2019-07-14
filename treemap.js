const w = 1000;
const h = 800;

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

const treeMapLayout = d3.treemap();

//button init
const vgButton = d3.select("#button-container")
                    .append("div")
                    .attr("class", "button")
                    .html("<p>Video Games</p>");

const mvButton = d3.select("#button-container")
                    .append("div")
                    .attr("class", "button")
                    .html("<p>Movies</p>");

const ksButton = d3.select("#button-container")
                    .append("div")
                    .attr("class", "button")
                    .html("<p>Kickstarters</p>");

//svg init
const svg = d3.select("#chart-container").append("svg").attr("id", "chart").attr("width", w).attr("height", h);

//color scale
const colorScale = d3.scaleOrdinal(d3.schemeCategory20);

//async data init
d3.queue()
    .defer(d3.json, DATA_SETS.videogames.URL)
    .defer(d3.json, DATA_SETS.movies.URL)
    .defer(d3.json, DATA_SETS.kickstarters.URL)
    .await(ready)

function ready(error, vgData, mvData, ksData) {
    
    mvButton.on("click", () => changeSource(mvData));
    vgButton.on("click", () => changeSource(vgData));
    ksButton.on("click", () => changeSource(ksData));

    let currentData = vgData;

    treeMapLayout
        .size([w, h])
        .paddingOuter(1)
        .paddingInner(2)
        //.tile(d3.treemap);

    function render() {
        let root = d3.hierarchy(currentData);
        root.sum(d => d.value);
        
        treeMapLayout(root);

        //tilesets
        let cell = svg  
            .selectAll("g")
            .data(root.leaves())
            .enter()
            .append("g")
            .attr("class", "tileset")
            .attr("transform", d => "translate(" + [d.x0, d.y0] +  ")")

        //tiles
        let tile = cell.append('rect')
            .attr("class", "tile")
            .attr('width', function(d) { return  (d.x1 - d.x0); })
            .attr('height', function(d) { return d.y1 - d.y0; })
            .style("stroke", "gray")
            .style("fill", (d, i) => colorScale(d.data.category))
        
        //text labels 
        cell.append("text")
        .selectAll("tspan")
        .data(function(d) { return d.data.name.split(/(?=[\s][A-Z])/g)})
        .enter().append("tspan")
            .text(d => d.trim())
            .attr("x", 3)
            .attr("y", (d, i) => 11 + i * 10)
            .style("font-size", ".5em")




            console.log(root)
    }

    

    function changeSource(newSource) {
        currentData = newSource;
        svg.selectAll("*").remove();
        render();
    }


    render();
}

    

    





    

