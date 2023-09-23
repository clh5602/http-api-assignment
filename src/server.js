const http = require('http'); // pull in the http server module
const url = require('url'); // pull in the url module
// pull in the query string module
const query = require('querystring');

// pull in the response handler files
const htmlHandler = require('./htmlResponses.js');
// pull in our json response handler file
//const jsonHandler = require('./jsonResponses.js');

// set the port. process.env.PORT and NODE_PORT are for servers like heroku
const port = process.env.PORT || process.env.NODE_PORT || 3000;

// key:value object to look up URL routes to specific functions
const urlStruct = {
    GET: {
        '/': htmlHandler.getIndex,
        '/style.css': htmlHandler.getIndexCSS,
        notFound: htmlHandler.getIndex,
    },
    HEAD: {
        //'/getUsers': jsonHandler.getUsersMeta,
        //notFound: jsonHandler.notFoundMeta,
    },
};

// handle HTTP requests. In node the HTTP server will automatically
// send this function request and pre-filled response objects.
const onRequest = (request, response) => {
    // parse the url using the url module
    const parsedUrl = url.parse(request.url);

    // Only handle requests we support
    if (!urlStruct[request.method]) {
        return urlStruct.HEAD.notFound(request, response);
    }

    // if function exists, call it!
    if (urlStruct[request.method][parsedUrl.pathname]) {
        return urlStruct[request.method][parsedUrl.pathname](request, response);
    }

    return urlStruct[request.method].notFound(request, response);
};

// start HTTP server
http.createServer(onRequest).listen(port, () => {
    console.log(`Listening on 127.0.0.1: ${port}`);
});