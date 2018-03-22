"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("./app/server/models");
const server_1 = require("./app/server/server");
models_1.authenticate().then(() => {
    server_1.startApp();
})
    .catch(err => {
    console.error('Unable to connect to the database:', err);
});
