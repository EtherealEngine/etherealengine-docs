#!/usr/bin/env ts-node

const { spawn } = require("child_process");
const appRootPath = require('app-root-path')
const dotenv = require('dotenv').config({
    path: appRootPath.path + '/.env.local'
  })

import { ApiBaseURL } from './website.config'

const typedoc = spawn("npx", ["typedoc", process.env.ENGINE_PATH, "--options", `${process.env.ENGINE_PATH}/typedoc.json`, "--out", "./build/"+ApiBaseURL])

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
