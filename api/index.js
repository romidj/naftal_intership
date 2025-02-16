import express from 'express'
import cors from 'cors'
import userRoutes from "./routes/user.js"
import authRoutes from "./routes/auth.js"
import emailRoutes from "./routes/email.js"
import convocationRoutes from "./routes/convocation.js"
import medecinRoutes from './routes/medecin.js'


const app = express()
app.use(cors());

app.use(express.json())
app.use("/api/user",userRoutes)
app.use("/api/auth",authRoutes)
app.use("/api/email",emailRoutes)
app.use("/api/convocation",convocationRoutes)
app.use("/api/medecin",medecinRoutes)


app.listen(8800, () => {
    console.log("connected")
})