const express = require("express")
const mongoose = require("mongoose")
const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const session = require("express-session")
const bcrypt = require("bcryptjs")
const flash = require("connect-flash")
const bodyParser = require("body-parser")
const path = require("path")
const cookieParser = require("cookie-parser")
const multer = require("multer")
const fs = require("fs")
const crypto = require("crypto")

// Initialize express app
const app = express()
const PORT = process.env.PORT || 5000

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/user-auth", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

// Define User Schema
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, default: "admin" },
})

const User = mongoose.model("User", UserSchema)

const FileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  uploadDate: { type: Date, default: Date.now },
})

const File = mongoose.model("File", FileSchema)

// Create an uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads")
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir)
}

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir) // Set the uploads directory
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + path.extname(file.originalname)) // Use unique filename
  },
})

const upload = multer({ storage: storage })

// Middleware to encrypt files
function encryptFile(filePath) {
  const algorithm = "aes-256-cbc"
  const key = crypto.randomBytes(32) // You should store and manage this key securely
  const iv = crypto.randomBytes(16) // Initialization vector

  const cipher = crypto.createCipheriv(algorithm, key, iv)
  const input = fs.createReadStream(filePath)
  const output = fs.createWriteStream(`${filePath}.enc`)

  input.pipe(cipher).pipe(output)

  output.on("finish", () => {
    // Remove original file after encryption
    fs.unlinkSync(filePath)
  })
}

// Middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, "public")))
app.use(cookieParser()) // Add cookie parser middleware

// Express session middleware
app.use(
  session({
    secret: "aakdknfjnfjnaenanfenefsb",
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true, // Prevents JavaScript access to cookies
      secure: false, // Set to true if using HTTPS
      sameSite: "Strict", // Helps prevent CSRF
    },
  })
)

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Connect flash for error messages
app.use(flash())

// Global variables for flash messages
app.use((req, res, next) => {
  res.locals.user = req.user
  res.locals.errorMessage = req.flash("error")
  res.locals.successMessage = req.flash("success")
  next()
})

// Set EJS as the templating engine
app.set("view engine", "ejs") // Set EJS as the view engine
app.set("views", path.join(__dirname, "views")) // Set views directory

// Passport Local Strategy for Login
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      // Match user
      const user = await User.findOne({ username: username })
      if (!user) {
        return done(null, false, { message: "No user found" })
      }

      // Match password
      const isMatch = await bcrypt.compare(password, user.password)
      if (isMatch) {
        return done(null, user)
      } else {
        return done(null, false, { message: "Incorrect password" })
      }
    } catch (err) {
      return done(err)
    }
  })
)

// Passport serialize/deserialize user
passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id)
    done(null, user)
  } catch (err) {
    done(err)
  }
})

// Middleware to check if the user is authenticated
const isLogin = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  } else {
    req.flash("error", "You must be logged in to view this page")
    res.redirect("/login")
  }
}

const isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === "admin") {
    return next()
  }
  req.flash("error", "You do not have permission to access this page.")
  res.redirect("/login")
}

// Routes
app.get("/", (req, res) => {
  res.render("./landing")
})

app.get("/login", (req, res) => {
  res.render("login", {
    error: req.flash("error"),
    success: req.flash("success"),
  })
})

app.get("/signup", (req, res) => {
  res.render("./signup")
})

// Handle Signup (Register User)
app.post("/signup", async (req, res) => {
  const { username, password } = req.body

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ username: username })

    if (existingUser) {
      return res.send("User already exists")
    } else {
      // Create new user and hash password
      const newUser = new User({ username, password })
      const salt = await bcrypt.genSalt(10)
      newUser.password = await bcrypt.hash(newUser.password, salt)
      await newUser.save()
      return res.redirect("./login")
    }
  } catch (err) {
    console.error(err)
    return res.status(500).send("Server error")
  }
})

app.get("/admin", isAdmin, (req, res) => {
  res.render("admin") // Create an admin.ejs file for the admin page
})
// Handle Login
app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err)
    }
    if (!user) {
      req.flash("error", "Invalid username or password.") // Set error message
      return res.redirect("./login")
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err)
      }

      // Here you can set a cookie with user info
      const sessionData = {
        id: user.id,
        username: user.username,
      }

      // Send session data as a cookie
      res.cookie("session", JSON.stringify(sessionData), {
        httpOnly: true, // Prevents JavaScript access to cookies
        secure: false, // Set to true if using HTTPS
        sameSite: "Strict",
      })

      // Set success message for flash
      req.flash("success", "You have logged in successfully.")
      return res.redirect("./dashboard")
    })
  })(req, res, next)
})

// Route to handle file upload
app.post("/upload", isLogin, upload.single("file"), async (req, res) => {
  if (!req.file) {
    req.flash("error", "No file uploaded.")
    return res.redirect("/dashboard")
  }

  const filePath = path.join(uploadsDir, req.file.filename)
  encryptFile(filePath) // Encrypt the uploaded file

  // Create a new file record
  const newFile = new File({
    filename: req.file.filename,
    userId: req.user._id, // Associate the file with the logged-in user
  })

  await newFile.save() // Save the file metadata to the database

  req.flash("success", "File uploaded successfully.")
  res.redirect("/dashboard")
})

// Route to view uploaded files
app.get("/files", isLogin, async (req, res) => {
  try {
    // Find files for the logged-in user
    const files = await File.find({ userId: req.user._id })

    const existingFiles = []
    for (const file of files) {
      const encryptedFilePath = path.join(uploadsDir, file.filename + ".enc")
      if (fs.existsSync(encryptedFilePath)) {
        existingFiles.push(file) // Only keep files that exist
      } else {
        // If the file does not exist, remove it from the database
        await File.deleteOne({ _id: file._id })
      }
    }

    res.render("files", { files: existingFiles })
  } catch (err) {
    console.error("Error reading files:", err)
    return res.status(500).send("Error reading files")
  }
})

// Handle Dashboard (protected route)
app.get("/dashboard", isLogin, (req, res) => {
  res.render("dashboard", {
    success: req.flash("success"),
    error: req.flash("error"),
  })
})

//Delete Files
// Route to handle file deletion
// Route to handle file deletion
// Route to handle file deletion
app.post("/delete/:filename", isLogin, async (req, res) => {
  let fileName = req.params.filename
  let encryptedFileName = fileName + ".enc" // Add .enc extension to look for the encrypted file
  let filePath = path.join(uploadsDir, encryptedFileName) // Path to the encrypted file

  try {
    // Find the file in the database
    const fileRecord = await File.findOne({
      filename: fileName,
      userId: req.user._id, // Ensuring the logged-in user owns the file
    })

    if (!fileRecord) {
      req.flash("error", "You do not have permission to delete this file.")
      return res.redirect("/files")
    }

    // Check if the encrypted file exists before attempting to delete
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        console.error(`File does not exist: ${filePath}`, err)
        req.flash("error", "File not found.")
        return res.redirect("/files")
      }

      // If the file exists, proceed to delete it
      fs.unlink(filePath, async (err) => {
        if (err) {
          console.error("Error deleting file:", err)
          req.flash("error", "Error deleting file.")
          return res.redirect("/files")
        }

        // Delete file record from the database
        await File.deleteOne({ _id: fileRecord._id })
        req.flash("success", "File deleted successfully.")
        return res.redirect("/files")
      })
    })
  } catch (err) {
    console.error("Error during file deletion process:", err)
    req.flash("error", "Server error. Please try again.")
    return res.redirect("/files")
  }
})

// Logout
app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) throw err
    req.flash("success", "You have logged out successfully.")
    res.redirect("./login")
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
