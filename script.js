// --- Configuration ---
const apiKey = 'b117a1ec22fdf2bdd8e6b0b410ea54f9'; // <<< PUT YOUR KEY HERE
const apiUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=1`;

// --- D3 Chart Dimensions ---
// Using fixed dimensions might be safer if CSS layout is absent
const margin = { top: 30, right: 30, bottom: 100, left: 60 }; // Increased bottom margin for labels
const svgWidth = 700 - margin.left - margin.right; // Fixed width example
const svgHeight = 400 - margin.top - margin.bottom;

const svg = d3.select("#movie-rating-chart")
    .attr("width", svgWidth + margin.left + margin.right)
    .attr("height", svgHeight + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

const errorMessageDiv = document.getElementById('error-message');

// --- API Fetching ---
async function fetchMovieData() {
    errorMessageDiv.textContent = '';
    try {
        // ... (fetch logic remains the same as previous example) ...
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            const processedData = processData(data.results);
            createBarChart(processedData);
        } else {
            errorMessageDiv.textContent = "No movie results found.";
        }
    } catch (error) {
        console.error("Error fetching movie data:", error);
        errorMessageDiv.textContent = `Failed to load movie data: ${error.message}.`;
    }
}

// --- Data Processing ---
function processData(movies) {
    // ... (processData logic remains the same - get top 10, map title/rating) ...
    return movies.slice(0, 10).map(movie => ({
        title: movie.title,
        rating: movie.vote_average
    })).sort((a, b) => b.rating - a.rating);
}

// --- D3 Visualization (Focus on functionality) ---
function createBarChart(data) {
    // 1. Define Scales (Same as before)
    const xScale = d3.scaleBand()
        .domain(data.map(d => d.title))
        .range([0, svgWidth])
        .padding(0.2);

    const yScale = d3.scaleLinear()
        .domain([0, 10])
        .range([svgHeight, 0]);

    // 2. Define Axes (Same as before)
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    // 3. Draw Axes (Apply classes even if CSS is minimal)
    svg.append("g")
        .attr("class", "x-axis axis") // Class helps if you add minimal CSS
        .attr("transform", `translate(0,${svgHeight})`)
        .call(xAxis)
        // Minimal rotation attempt without relying on complex CSS
        .selectAll("text")
            .style("text-anchor", "end")
            // Rotate slightly - adjust angle as needed
            .attr("transform", "rotate(-35)");

    svg.append("g")
        .attr("class", "y-axis axis")
        .call(yAxis);

    // Skip detailed axis labels if no time/CSS to position them well.
    // Focus on getting the bars right.

    // 4. Draw Bars (Core Requirement - MUST BE YOUR CODE)
    svg.selectAll(".bar")
       .data(data)
       .join("rect")
       .attr("class", "bar") // Basic class
       .attr("x", d => xScale(d.title))
       .attr("y", d => yScale(d.rating))
       .attr("width", xScale.bandwidth())
       .attr("height", d => svgHeight - yScale(d.rating))
       // Default fill will likely be black if no CSS
       .attr("fill", "steelblue") // Explicitly set a fill color in JS
       // Simple SVG Tooltip (requires no CSS)
       .append("title")
       .text(d => `${d.title}: ${d.rating.toFixed(1)}`);
}

// --- Initial Load ---
fetchMovieData();
