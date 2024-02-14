import express from 'express'
import { config } from 'dotenv'
import { initiateApp } from './src/utils/initiate-app.js'


config({ path: './config/dev.config.env' })

const app = express()

initiateApp(app, express)
