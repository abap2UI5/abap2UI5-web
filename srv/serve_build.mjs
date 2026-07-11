// Static server for the webpack output (./build) - the realistic way to test
// the all-in-browser demo locally (webpack-dev-server HMR does not play well
// with the document.write boot in app/web.mjs).
import express from 'express';

const PORT = process.env.PORT || 8081;

const app = express();
app.disable('x-powered-by');
app.use(express.static('build'));

app.listen(PORT);
console.log("Serving ./build on http://localhost:" + PORT);
