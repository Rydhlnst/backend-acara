import express from "express";
import bodyParser from "body-parser";
import router from "./routes/api";
import db from "./utils/database"
import docs from "./docs/route";


async function init() {
    try {

        const result = await db();

        console.log(result)

        const app = express();

        app.use(bodyParser.json());

        const PORT = 3000;

        app.get("/", (req, res) => {
            res.status(200).json({
                message: "Server is running",
                data: null
            })
        })
        // Middleware
        app.use("/api", router);
        docs(app);

        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`)
        });

    } catch (error) {
        console.log(Error)
    }
}

init();
