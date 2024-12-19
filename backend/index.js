import express from "express"
import userRouter from "./routes/user.routes.js"
import db from "./Database/db.js"
import "dotenv/config"

const app = express()

app.use(express.json())

app.use("/api" , userRouter)

app.listen(3500, () => {
    db()
    console.log(`Server is running on http://localhost:3500`)
})