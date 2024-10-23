const blockchain = []

exports.addBlockToBlockchain = (fileId, userId, encryptedFile) => {
  const newBlock = {
    fileId,
    userId,
    encryptedFile,
    timestamp: new Date(),
  }
  blockchain.push(newBlock)
}

exports.getBlockchainLogs = () => {
  return JSON.stringify(blockchain, null, 2)
}
