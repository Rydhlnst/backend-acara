import swaggerAutogen from "swagger-autogen";


const doc = {
    info: {
        version: "v0.0.1",
        title: "API Documentation",
        description: "API Documentation"
    },
    servers: [
        {
        url: "http://localhost:3000/api",
        description: "Local Server"
    },
        {
        url: "https://backend-acara-ruby.vercel.app/api",
        description: "Deploy Server"
    }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
            },
        },
        schemas: {
            LoginRequest: {
                identifier: "rydhlnst@gmail.com",
                password: "12341234"
            },
            RegisterRequest: {
                fullName: "Dapa Nandos",
                userName: "Dapa2000",
                email: "Dapa2000@yopmail.com",
                password: "12341234",
                confirmPassword: "12341234"
            },
            ActivationRequest: {
                code: "abcdef"
            }
        }
    }

}


const outputFile = "./swagger_output.json";

// Akan membaca endpoint2nya
const endPointFiles = ["../routes/api.ts"];


swaggerAutogen({openapi: "3.0.0"})(outputFile, endPointFiles, doc)