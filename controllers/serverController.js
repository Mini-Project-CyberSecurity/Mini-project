const servers = [
  { id: 1, status: "Online" },
  { id: 2, status: "Online" },
  { id: 3, status: "Online" },
  { id: 4, status: "Online" },
  { id: 5, status: "Online" },
]
exports.getServerStatus = (req, res) => {
  res.json(servers)
}
