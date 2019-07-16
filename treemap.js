const w = 1000;
const h = 1000;
const legendRectSize = 40;

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
const headingText = {vg: "Top 100 Most Sold Video Games Grouped by Platform", mv: "Top 100 Highest Grossing Movies Grouped By Genre", ks: "Top 100 Most Pledged Kickstarter Campaigns Grouped By Category"}
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

const tooltip = d3.select("body").append("div").attr("id", "tooltip").attr("data-value", "").html("");

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
        .size([w, h - 300])
        .paddingOuter(2)
        .paddingInner(0)
        .tile(d3.treemapSquarify);


    function render() {
        let root = d3.hierarchy(currentData);
        root.sum(d => d.value);
        
        treeMapLayout(root);
        setHeading(root);

        //tilesets
        let cell = svg  
            .selectAll(".tileset")
            .data(root.leaves())
            .enter()
                .append("g")
                .attr("class", "tileset")
                .attr("transform", d => "translate(" + [d.x0, d.y0] +  ")")

        //tiles
        let tile = cell.append('rect')
            .attr("class", "tile")
            .attr("data-name", d => d.data.name)
            .attr("data-category", d => d.data.category)
            .attr("data-value", d => d.data.value)
            .attr('width', function(d) { return  (d.x1 - d.x0); })
            .attr('height', function(d) { return d.y1 - d.y0; })
            .style("stroke", "white")
            .style("fill", (d, i) => colorScale(d.data.category))
            .on("mousemove", function(d) {
                d3.select("#tooltip")
                    .attr("data-value", d.data.value)
                    .style("top", d3.event.pageY + 10)
                    .style("left", d3.event.pageX + 10)
                    .style("opacity", .9)
                    .html(
                    "<p>Name: " + d.data.name + "<br />" +
                    "Category: " + d.data.category + "<br />" +
                    "Value: " + d.data.value + "</p>"
                    );
            })
            .on("mouseout", function(d) {
                d3.select("#tooltip").style("opacity", 0).html("");
            })
        
        //text labels 
        cell.append("text")
            .selectAll("tspan")
            .data(function(d) { return d.data.name.split(/(?=[\s][A-Z])/g)})
            .enter().append("tspan")
                .text(d => d.trim())
                .attr("x", 3)
                .attr("y", (d, i) => 9 + i * 10)
                .style("font-size", ".5em");

        //legend
        svg.append("g").attr("id", "legend")
            .selectAll(".legend-item")
            .data(root.children)
            .enter().append("rect")
                .attr("class", "legend-item")
                .attr("width", legendRectSize)
                .attr("height", 10)
                .attr("x", (d, i) => ((w - (root.children.length * legendRectSize)) / 2) + i * legendRectSize) //center legend items
                .attr("y", h - 260)
                .style("fill", d => colorScale(d.data.name))
                .style("stroke", "white");

        //legend labels
        d3.select("#legend")
            .selectAll(".legend-text")
            .data(root.children)
            .enter().append("text").attr("class", "legend-text")
                .attr("x", h - 245) //center legend items
                .attr("y", (d, i) => - 15 - ((w - (root.children.length * legendRectSize)) / 2) - i * legendRectSize)
                .text(d => d.data.name)
                .attr("transform", "rotate(90)")
                
                


    }

    function setHeading(data) {
        let heading = d3.select("#description");

        switch(data.data.name) {
            case "Video Game Sales Data Top 100":
                heading.html(headingText.vg);
                break;
            case "Movies":
                heading.html(headingText.mv);
                break;
            case "Kickstarter":
                heading.html(headingText.ks);
                break;
            default:
                return "D3 TreeMap";
        }
    }

    function changeSource(newSource) {
        currentData = newSource;
        svg.selectAll("*").remove();
        render();
    }

    render();
}

    

    





    

