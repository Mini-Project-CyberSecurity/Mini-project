// serverRoutes.js
const express = require("express")
const { getServerStatus } = require("../controllers/serverController")

const router = express.Router()

router.get("/server-status", getServerStatus)

module.exports = router
