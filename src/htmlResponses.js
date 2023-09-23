const fs = require('fs'); // pull in the file system module

// Load index fully into memory.
const index = fs.readFileSync(`${__dirname}/../client/client.html`);
// Load css into memory
const indexCSS = fs.readFileSync(`${__dirname}/../client/style.css`);

// function to handle general pages - takes the page file as the final param
const getHTMLPage = (request, response, page) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(page);
  response.end();
};

// function to get css page
const getCSS = (request, response, css) => {
  response.writeHead(200, { 'Content-Type': 'text/css' });
  response.write(css);
  response.end();
};

// function for getting the index page
const getIndex = (request, response) => getHTMLPage(request, response, index);
// function for getting the index page's css
const getIndexCSS = (request, response) => getCSS(request, response, indexCSS);

// exports to set functions to public
module.exports = {
  getIndex,
  getIndexCSS,
};
