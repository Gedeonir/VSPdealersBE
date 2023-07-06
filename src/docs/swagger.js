const dotenv = require("dotenv");
const authenticationDoc=require('../Authentication/authenticationDoc.js')
dotenv.config();

const swaggerDoc = {
    openapi: "3.0.0",
    info: {
      title: "Vehicle spare parts project powered By Gedeonir",
      version: "0.0.1",
      description: "This is Vehicle spare parts project RESTful APIs Documetation",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`,
        description: "Local dev Server",
      },
      {
        url: "",
        description: "production dev server",
      },
    ],
    components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            in: "header",
            bearerFormat: "JWT",
          },
        },
      },
    security: [
        {
            bearerAuth: [],
        },
    ],
    paths: {
        ...authenticationDoc
    },
  }
  module.exports = swaggerDoc