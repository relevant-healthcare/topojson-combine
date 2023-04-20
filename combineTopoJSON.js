const fs = require('fs');
const topojson = require('topojson');
const {feature} = require('topojson-client');

// Process command line arguments
const inputFiles = process.argv.slice(2);

if (inputFiles.length === 0) {
  console.error('Please provide at least one TopoJSON file as an argument.');
  process.exit(1);
}

// Read and convert each TopoJSON file to GeoJSON
const geoJSONFeatures = inputFiles.flatMap((inputFile) => {
  const topojsonData = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
  const objectName = Object.keys(topojsonData.objects)[0];
  const geojsonData = feature(topojsonData, topojsonData.objects[objectName]);
  return geojsonData.features;
});

// Combine the GeoJSON features
const combinedGeoJSON = {
  type: 'FeatureCollection',
  features: geoJSONFeatures,
};

// Convert the combined GeoJSON object back to TopoJSON
const combinedTopoJSON = topojson.topology({combined: combinedGeoJSON});

// Write the combined TopoJSON object to a new file
fs.writeFileSync('combined.topojson', JSON.stringify(combinedTopoJSON));
