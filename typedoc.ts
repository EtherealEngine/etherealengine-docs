#!/usr/bin/env ts-node

const { spawn } = require("child_process");

const typedoc = spawn("npx", ["typedoc", "/etherealengine", "--options", `/etherealengine/typedoc.json`, "--out", "./build/typedoc"])

typedoc.stdout.on("data", data => {
    console.log(`stdout: ${data}`);
});

typedoc.stderr.on("data", data => {
    console.log(`stderr: ${data}`);
});

typedoc.on('error', (error) => {
    console.log(`error: ${error.message}`);
});

typedoc.on("close", code => {
    console.log(`child process exited with code ${code}`);
});