import express from 'express';
import {initializeABAP} from "../output/init.mjs";
import {cl_express_icf_shim} from "../output/cl_express_icf_shim.clas.mjs";
await initializeABAP();

const PORT = 3000;

const app = express();
app.disable('x-powered-by');
app.set('etag', false);
app.use(express.raw({type: "*/*"}));
// Express 5 leaves req.body undefined for requests without a body (GET);
// the express-icf-shim expects a Buffer (req.body.toString("hex")).
app.use((req, _res, next) => {
  if (!Buffer.isBuffer(req.body)) {
    req.body = Buffer.alloc(0);
  }
  next();
});

// ------------------

// Express 5 / path-to-regexp v8: wildcards must be named; "/{*splat}" also
// matches the root path.
app.all("/{*splat}", async function (req, res) {
  await cl_express_icf_shim.run({req, res, class: "ZCL_SICF"});
});

app.listen(PORT);
console.log("Listening on port http://localhost:" + PORT);