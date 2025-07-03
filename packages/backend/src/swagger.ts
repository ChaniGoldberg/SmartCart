import express, { Express } from "express";
const swaggerJSDoc = require("swagger-jsdoc");

import swaggerUi from "swagger-ui-express";

const options= {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SmartCart API",
      version: "1.0.0",
      description: "תיעוד ה־API של SmartCart",
    },
    servers: [
      {
        url: "http://localhost:3001/api", //הכתובת שהשרת רץ עליו
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"], //נתיב לקבצי ה־API וה־Controllers
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
