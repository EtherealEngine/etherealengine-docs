#!/usr/bin/env ts-node

const { spawn } = require("child_process");
const appRootPath = require('app-root-path')
const dotenv = require('dotenv').config({
    path: appRootPath.path + '/.env.local'
  })

// @note
//  Should be -->   import { ApiBaseURL } from './website.config'
//  See: https://github.com/TypeStrong/ts-node/issues/1007
const ApiBaseURL = 'api'

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
