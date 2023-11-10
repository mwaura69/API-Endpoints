import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import router from './DataRoutes/dataRoutes.js'


const app = express()
app.use(cors())
app.use(express.json())

dotenv.config()
const uri = process.env.MONGODB_URI


app.use('/', router)

mongoose.connect(uri)
.then(() => {
    app.listen(5555, () => {
        console.log('connected to database')
    })
})
.catch((err) => {
    console.log(err)
})