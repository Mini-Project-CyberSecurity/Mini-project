const {
  addBlockToBlockchain,
  getBlockchainLogs,
} = require("../models/blockchainModel")

exports.uploadFile = (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.")
  }

  const file = req.files.file
  const fileId = new Date().getTime() // Generate a unique ID
  const userId = "user123" // In production, retrieve from session

  // Encrypt file (simulated for now)
  const encryptedFile = Buffer.from(file.data).toString("base64")

  // Add block to blockchain
  addBlockToBlockchain(fileId, userId, encryptedFile)

  res.json({ message: "File uploaded successfully!" })
}

exports.getBlockchainLogs = (req, res) => {
  const logs = getBlockchainLogs()
  res.send(logs)
}
