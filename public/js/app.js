document.addEventListener("DOMContentLoaded", () => {
  // File Upload Logic
  const uploadForm = document.getElementById("uploadForm")
  const fileInput = document.getElementById("fileInput")
  const serversDiv = document.getElementById("servers")
  const blockchainLogs = document.getElementById("blockchainLogs")

  uploadForm.addEventListener("submit", async (e) => {
    e.preventDefault()
    const file = fileInput.files[0]

    if (!file) return alert("Please select a file to upload.")

    const formData = new FormData()
    formData.append("file", file)

    // Upload the file
    const res = await fetch("/upload", {
      method: "POST",
      body: formData,
    })

    const result = await res.json()
    alert(result.message)
    loadServerStatus()
    loadBlockchainLogs()
  })

  // Load Server Status
  const loadServerStatus = async () => {
    const res = await fetch("/server-status")
    const servers = await res.json()
    serversDiv.innerHTML = servers
      .map((server) => `<p>Server ${server.id}: ${server.status}</p>`)
      .join("")
  }

  // Load Blockchain Logs
  const loadBlockchainLogs = async () => {
    const res = await fetch("/blockchain-logs")
    const logs = await res.text()
    blockchainLogs.innerText = logs
  }

  // Initial load
  loadServerStatus()
  loadBlockchainLogs()
})
