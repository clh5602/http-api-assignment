const url = require('url'); // pull in the url module

// obj that holds every message and ID for each URL
const responses = {
  '/success': {
    message: 'This is a successful response',
    status: 200,
  },
  '/badRequest': {
    message: 'Missing valid query parameter set to true',
    id: 'badRequest',
    status: 400,
  },
  '/badRequestT': { // badRequest with correct params
    message: 'This request has the required parameters',
    status: 200,
  },
  '/unauthorized': {
    message: 'Missing loggedIn query parameter set to yes',
    id: 'unauthorized',
    status: 401,
  },
  '/unauthorizedT': { // unauthorized URL with correct params
    message: 'You have successfully viewed the content.',
    status: 200,
  },
  '/forbidden': {
    message: 'You do not have access to this content.',
    id: 'forbidden',
    status: 403,
  },
  '/internal': {
    message: 'Internal Server Error. Something went wrong.',
    id: 'internal',
    status: 500,
  },
  '/notImplemented': {
    message: 'A get request for this page has not been implemented yet. Check again later for updated content.',
    id: 'notImplemented',
    status: 501,
  },
  '/notFound': {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
    status: 404,
  },
};

// creates a json with the given message. If no ID provided, then no ID will be included
const buildJSON = (message, id) => {
  const responseJSON = {
    message,
  };

  if (id) {
    responseJSON.id = id;
  }

  return JSON.stringify(responseJSON);
};

// creates an xml with the given message. If no ID provided, then no ID will be included
const buildXML = (message, id) => {
  let responseXML = `<response><message>${message}</message>`;

  if (id) {
    responseXML += `<id>${id}</id>`;
  }

  responseXML += '</response>';

  return responseXML;
};

// function to send a general response
const respond = (request, response, status, content, type) => {
  response.writeHead(status, { 'Content-Type': type });
  response.write(content);
  response.end();
};

// function that responds to basically any request from the "Send" button
const generalResponse = (request, response, acceptedTypes, params) => {
  // first, get the request URL
  const urlPathname = url.parse(request.url).pathname;

  // get data from the responses object based on the URL
  let responseData = responses[urlPathname];

  // next, check if request url is "badRequest" or "unauthorized". These cases check params
  if (urlPathname === '/badRequest') {
    if (params.valid && params.valid === 'true') {
      // params are valid, get a different obj from responses.
      // the key is the normal key plus 'T'
      responseData = responses[`${urlPathname}T`];
    }
  }

  if (urlPathname === '/unauthorized') {
    if (params.loggedIn && params.loggedIn === 'yes') {
      // params are valid, get a different obj from responses.
      // the key is the normal key plus 'T'
      responseData = responses[`${urlPathname}T`];
    }
  }

  let responseString;
  let responseType;
  const responseCode = responseData.status;

  // now that we have the data, we need to make it either a JSON or XML
  if (acceptedTypes[0] === 'text/xml') {
    responseType = 'text/xml';

    // "buildXML" handles making the string
    responseString = buildXML(responseData.message, responseData.id);
  } else {
    // assume JSON if nothing else
    responseType = 'application/json';

    // "buildJSON" handles making the string
    responseString = buildJSON(responseData.message, responseData.id);
  }

  return respond(request, response, responseCode, responseString, responseType);
};

// function that gets called when a request is not recognized -
// just throws a 404 with an obj response
const notFound = (request, response, acceptedTypes) => {
  const responseData = responses['/notFound'];

  let responseString;
  let responseType;
  const responseCode = responseData.status;

  // now that we have the data, we need to make it either a JSON or XML
  if (acceptedTypes[0] === 'text/xml') {
    responseType = 'text/xml';

    // "buildXML" handles making the string
    responseString = buildXML(responseData.message, responseData.id);
  } else {
    // assume JSON if nothing else
    responseType = 'application/json';

    // "buildJSON" handles making the string
    responseString = buildJSON(responseData.message, responseData.id);
  }

  return respond(request, response, responseCode, responseString, responseType);
};

// exports to set functions to public.
// In this syntax, you can do getIndex:getIndex, but if they
// are the same name, you can short handle to just getIndex,
module.exports = {
  generalResponse,
  notFound,
};
