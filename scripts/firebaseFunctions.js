/*
NOT WORKING, POTENTIALLY WORK ON LATER. (meant to send stuff to the server, workers should be fine as an alternative)

const functions = require("firebase-functions");
const { spawn } = require("child_process");

exports.serverRun = functions.https.onRequest((req, res) => {
  const code = req.body.code || "";
  const inputValue = req.body.input || ""; //input() support

  const py = spawn("python3", ["-c", code]);

  //send stdin if provided
  if (inputValue) {
    py.stdin.write(inputValue + "\n");
    py.stdin.end();
  }

  let output = "";
  let error = "";

  py.stdout.on("data", (data) => (output += data.toString()));
  py.stderr.on("data", (data) => (error += data.toString()));

  py.on("close", (exitCode) => {
    res.json({ output, error, exitCode });
  });
});
*/
