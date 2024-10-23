// blockchainRoutes.js
const express = require("express")
const {
  uploadFile,
  getBlockchainLogs,
} = require("../controllers/blockchainController")

const router = express.Router()

router.post("/upload", uploadFile)
router.get("/blockchain-logs", getBlockchainLogs)

module.exports = router
