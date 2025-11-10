const path = require("path");
const http = require("http");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const { engine } = require("express-handlebars");
const { Server } = require("socket.io");

const { connectDB } = require("./config/db");
const productosRouter = require("./routes/productos.routes");
const authRouter = require("./routes/auth.routes");
const vistasRouter = require("./routes/vistas.routes");
const errorHandler = require("./middlewares/errorHandler");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// Conexion a MongoDB
connectDB(process.env.MONGODB_URI);

// Middlewares globales
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Static
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); //Imagenes subidas
app.use(express.static(path.join(__dirname, "public"))); //Para css, js etc

// ----- Sesiones compartidas (Express + Socket.io) -----
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || "dev_secret",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: "sesiones",
  }),
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60, // 1h
  },
});

app.use(sessionMiddleware);

//Permitimos que socket.io lea las sesiones
io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
});

//Handlebars
app.engine(
  ".hbs",
  engine({
    extname: ".hbs",
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "views", "layouts"),
    partialsDir: path.join(__dirname, "views", "partials"),
    helpers: {
      // pequeño helper para marcar selects
      eq: (a, b) => a === b,
    },
  })
);
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "views"));

// Rutas vistas
app.use("/", vistasRouter); //Vistas protegidas
app.use("/api/auth", authRouter); //API auth
app.use("/api/productos", productosRouter); //Api productos

// Manejo de errores
app.use(errorHandler);

// ---------Socket.io chat
io.on("connection", (socket) => {
  const sess = socket.request.session;
  const usuario = sess && sess.usuario;

  if (!usuario) {
    console.log(" Socket sin usuario, desconectando");
    socket.disconnect(true);
    return;
  }

  console.log(" Socket conectado:", usuario.email);

  const nombre = usuario.nombre || "Usuario";

  socket.broadcast.emit("chat:mensaje", {
    sistema: true,
    texto: `${nombre} se ha unido al chat`,
  });

  socket.on("chat:mensaje", (texto) => {
    if (!texto || typeof texto !== "string") return;

    io.emit("chat:mensaje", {
      usuario: nombre,
      texto: texto.trim(),
      fecha: new Date().toLocaleTimeString(),
    });
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("chat:mensaje", {
      sistema: true,
      texto: `${nombre} salió del chat`,
    });
  });
});


// Iniciar servidor
server.listen(PORT, () => {
  console.log(`[HTTP] Servidor escuchando en http://localhost:${PORT}`);
});