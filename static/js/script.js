// Variable to store the loaded data
let data;

// Function to load data from a JSON file
async function loadData() {
  try {
    const dataURL = "https://raw.githubusercontent.com/Dusko2779/Project_3_cleaned_data/main/cleaned_data.json";
    const response = await fetch(dataURL);
    if (!response.ok) {
      throw new Error("Failed to load data");
    }
    data = await response.json();

    // Populate the dropdown with unique topics
    populateTopicDropdown(data);

    // Initialize the chart with the first topic
    updateColumnChart(data[0].topic);
  } catch (error) {
    console.error("Error loading data:", error);
  }
}

// Function to populate the dropdown with unique topics
function populateTopicDropdown(data) {
  const topicSelect = document.getElementById("topicSelect");
  const uniqueTopics = [...new Set(data.map((item) => item.topic))];

  // Clear any existing options in the dropdown
  topicSelect.innerHTML = "";

  // Create an option for each unique topic
  uniqueTopics.forEach((topic) => {
    const option = document.createElement("option");
    option.value = topic;
    option.text = topic;
    topicSelect.appendChild(option);
  });
}

// Function to update the column chart based on the selected topic
function updateColumnChart(selectedTopic) {
  // Filter the data based on the selected topic
  const filteredData = data.filter((item) => item.topic === selectedTopic);

  // Group the filtered data by year and count the number of countries for each year
  const yearCounts = {};
  filteredData.forEach((item) => {
    const year = item.year;
    if (yearCounts[year]) {
      yearCounts[year]++;
    } else {
      yearCounts[year] = 1;
    }
  });

  // Create an array of objects with year and count
  const yearCountsArray = Object.keys(yearCounts).map((year) => ({
    year: year,
    count: yearCounts[year],
  }));

  // Sort the array in descending order by count
  yearCountsArray.sort((a, b) => b.count - a.count);

  // Extract sorted years and counts
  const sortedYears = yearCountsArray.map((item) => item.year);
  const counts = yearCountsArray.map((item) => item.count);

  // Define colors for each year, with a darker yellow for 2022
  const colors = {
    "2020": "red",
    "2021": "blue",
    "2022": "green",
  };

  // Create the trace for the column chart
  const trace = {
    x: sortedYears,
    y: counts,
    type: "bar",
    marker: {
      color: sortedYears.map((year) => colors[year]),
    },
  };

  const layout = {
    title: `Number of Countries Searching for Topic: ${selectedTopic} Each Year`,
    xaxis: { title: "Year", tickvals: sortedYears }, 
    yaxis: { title: "Number of Countries" },
  };

  // Create or update the column chart in the "barChart" div
  Plotly.react("barChart", [trace], layout);
}

// Function to create a pie chart with the average index_trend over three years for top or bottom 10
function createPieChartWithAverage(selectedTopic, chartId, isTop10) {
  // Filter the data based on the selected topic
  const filteredData = data.filter((item) => item.topic === selectedTopic);

  // Sort the data in descending order if it's for the top 10, or ascending for the bottom 10
  filteredData.sort((a, b) => isTop10 ? b.index_trends - a.index_trends : a.index_trends - b.index_trends);

  // Select the top or bottom 10 items
  const topOrBottomData = filteredData.slice(0, 10);

  // Extract country names and index_trends values
  const countryNames = topOrBottomData.map((item) => item.country);
  const indexTrendsValues = topOrBottomData.map((item) => item.index_trends);

  // Calculate the average index_trend
  const averageIndexTrend = indexTrendsValues.reduce((total, value) => total + value, 0) / indexTrendsValues.length;

  // Create an array of labels with both country names and the average value
  const labels = [...countryNames, `Average: ${averageIndexTrend.toFixed(2)}`];

  // Create an array of values with both index_trends values and the average value
  const values = [...indexTrendsValues, averageIndexTrend];

  // Create the trace for the hollow pie chart
  const trace = {
    labels: labels,
    values: values,
    type: "pie",
    hole: 0.3, 
    textinfo: "none", 
    hoverinfo: "label+value", 
  };

  const layout = {
    title: `${isTop10 ? "Top 10" : "Bottom 10"} Countries by Average Index Trends for Topic: ${selectedTopic}`,
  };

  // Create or update the hollow pie chart in the specified chart div
  Plotly.react(chartId, [trace], layout);
}

// Event listener for topic dropdown change
document.getElementById("topicSelect").addEventListener("change", function () {
  const selectedTopic = this.value;
  updateColumnChart(selectedTopic);
  createPieChartWithAverage(selectedTopic, "top10PieChart", true);
  createPieChartWithAverage(selectedTopic, "bottom10PieChart", false);
});

document.addEventListener("DOMContentLoaded", function() {
  let geojsonData;
  function getColorForTopic(topic) {
      switch (topic) {
          case "Air pollution": return "#FF5733"; // Example red color
          case "Avalanche": return "#33FF57";     // Example blue color
          case "Biodiversity loss": return "#5733FF";
          case "Climate change denial": return "#FFFF33";
          case "Climate crisis": return "#FF33FF";
          case "Climate variability and change": return "#33FFFF";
          case "Coastal Flooding": return "#FF3333";
          case "Cold wave": return "#33FF33";
          case "Deforestation": return "#3333FF";
          case "Drought": return "#FF9933";
          case "Earthquake": return "#33FF99";
          case "Environmental degradation": return "#9933FF";
          case "Extreme weather": return "#FF3399";
          case "Flash flood": return "#3399FF";
          case "Flood": return "#FFFF99";
          case "Global warming": return "#FF9999";
          case "Greenhouse effect": return "#9999FF";
          case "Greenhouse gas": return "#FF6633";
          case "Greenhouse gas emission": return "#33FF66";
          case "Hail": return "#6633FF";
          case "Heat wave": return "#FF3366";
          case "Ice Storm": return "#3366FF";
          case "Land degradation": return "#FFCC33";
          case "Landslide": return "#33FFCC";
          case "Light pollution": return "#CC33FF";
          case "Lightning": return "#FF33CC";
          case "Low emission zone": return "#33CCFF";
          case "Low-emission vehicle": return "#FFEE33";
          case "Marine pollution": return "#FFDD33";
          case "Noise pollution": return "#DDFF33";
          case "Plastic pollution": return "#33DDFF";
          case "Pollution": return "#EEFF33";
          case "Sea level rise": return "#33EEFF";
          case "Soil contamination": return "#FFBB33";
          case "Storm": return "#33FFBB";
          case "Tornado": return "#BB33FF";
          case "Tropical cyclone": return "#FF33BB";
          case "Typhoon": return "#33BBFF";
          case "Water pollution": return "#FFAA33";
          case "Wildfire": return "#33FFAA";
          default: return "none";  // Default color
      }
  }
  function updateCountryColorsForTopic(topic, data) {
      const relevantData = data.filter(row => row.topic === topic);
      L.geoJson(geojsonData, {
          style: function(feature) {
              const county = feature.properties.name;
              const countyData = relevantData.find(item => item.country === county);
              return {
                  fillColor: countyData ? getColorForTopic(countyData.topic) : 'gray',
                  weight: 2,
                  opacity: 1,
                  color: 'white',
                  fillOpacity: 0.7
              };
          }
      }).addTo(map);
  }
  fetch('/custom.geo.json')
  .then(response => response.json())
  .then(data => {
      geojsonData = data;
      return fetch('cleaned_data.json');
  })
  .then(response => response.json())
  .then(data => {
      populateDropdown(data);
      window.map = L.map('map').setView([0, 0], 2);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      L.geoJson(geojsonData, {
          style: function(feature) {
              const county = feature.properties.name;
              const countyData = data.find(item => item.country === county);
              return {
                  fillColor: countyData ? getColorForTopic(countyData.topic) : 'gray',
                  weight: 2,
                  opacity: 1,
                  color: 'white',
                  fillOpacity: 0.7
              };
          }
      }).addTo(map);
  });
  document.querySelector('.dropbtn').addEventListener('click', function() {
      const dropdownContent = document.querySelector('.dropdown-content');
      dropdownContent.style.display = dropdownContent.style.display === "block" ? "none" : "block";
  });
  window.addEventListener('click', function(event) {
      if (!event.target.matches('.dropbtn') && !event.target.matches('.dropdown-content a')) {
          const dropdowns = document.getElementsByClassName("dropdown-content");
          for (let i = 0; i < dropdowns.length; i++) {
              dropdowns[i].style.display = "gray";
          }
      }
  });
  let markers = [];
  function populateDropdown(data) {
      const topics = [...new Set(data.map(item => item.topic))];
      const dropdownMenu = document.getElementById('dropdownMenu');
      topics.forEach(topic => {
          let link = document.createElement('a');
          link.href = "#";
          link.innerText = topic;
          link.addEventListener('click', function() {
              updateCountryColorsForTopic(topic, data);
              displayCountryMarkersForTopic(topic, data);
          });
          dropdownMenu.appendChild(link);
      });
  }
  function displayCountryMarkersForTopic(topic, data) {
      markers.forEach(marker => map.removeLayer(marker));
      markers = [];
  
      const relevantData = data.filter(row => row.topic === topic);
  
      relevantData.forEach(item => {
          const country = item.country;
          const coords = getCentroidForCounty(country, geojsonData);
  
          if (coords) {
              const iconPath = getIconForTopic(topic); // Get the icon for the topic
              const customIcon = L.icon({
                  iconUrl: iconPath,
                  iconSize: [25, 41],  // size of the icon (you might need to adjust this)
                  iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
                  popupAnchor: [0, -41] // point from which the popup should open relative to the iconAnchor
              });
              
              const marker = L.marker([coords.lat, coords.lng], { icon: customIcon }).addTo(map)
                  .bindPopup(country + ": " + item.index_trends);
  
              markers.push(marker);
          }
      });
  }
  
  function getCentroidForCounty(county, geoJson) {
      const feature = geoJson.features.find(f => f.properties.name === county);
      if (feature) {
          const latlngBounds = L.geoJSON(feature).getBounds();
          return latlngBounds.getCenter();
      }
      return null;
  }
});
// Initialize the dashboard
loadData().catch((error) => {
  console.error("Error initializing dashboard:", error);
});
