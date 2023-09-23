const http = require('http'); // pull in the http server module
const url = require('url'); // pull in the url module
// pull in the query string module
const query = require('querystring');

// pull in the response handler files
const htmlHandler = require('./htmlResponses.js');
// pull in our json response handler file
const requestHandler = require('./dataResponses.js');

// set the port. process.env.PORT and NODE_PORT are for servers like heroku
const port = process.env.PORT || process.env.NODE_PORT || 3000;

// key:value object to look up URL routes to specific functions
const urlStruct = {
  '/': htmlHandler.getIndex,
  '/style.css': htmlHandler.getIndexCSS,
  '/success': requestHandler.generalResponse,
  '/badRequest': requestHandler.generalResponse,
  '/unauthorized': requestHandler.generalResponse,
  '/forbidden': requestHandler.generalResponse,
  '/internal': requestHandler.generalResponse,
  '/notImplemented': requestHandler.generalResponse,
  '/notFound': requestHandler.generalResponse,
  notFound: requestHandler.notFound,
};

// handle HTTP requests. In node the HTTP server will automatically
// send this function request and pre-filled response objects.
const onRequest = (request, response) => {
  // parse the url using the url module
  const parsedUrl = url.parse(request.url);

  // if query provided, convert the query to a js object.
  const params = query.parse(parsedUrl.query);

  // get the requested data types
  const acceptedTypes = request.headers.accept.split(',');

  // if function exists, call it!
  if (urlStruct[parsedUrl.pathname]) {
    return urlStruct[parsedUrl.pathname](request, response, acceptedTypes, params);
  }

  return urlStruct.notFound(request, response, acceptedTypes);
};

// start HTTP server
http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1: ${port}`);
});
