const path = require("path");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const { connectDB } = require("./config/db");
const productosRouter = require("./routes/productos.routes");
const authRouter = require("./routes/auth.routes");
const errorHandler = require("./middlewares/errorHandler");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Conexion a MongoDB
connectDB(process.env.MONGODB_URI);

// Middlewares globales
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); //Imagenes subidas

//Sesiones
app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev_secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: "sesiones",
    }),
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60, //1 hora
    },
  })
);

// Rutas principales
app.use("/api/auth", authRouter);
app.use("/api/productos", productosRouter);

// Pagina de prueba
app.get("/", (req, res) => res.send("Servidor funcionando correctamente!"));

// Manejo de errores
app.use(errorHandler);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`[HTTP] Servidor escuchando en http://localhost:${PORT}`);
});
