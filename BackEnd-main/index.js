const { pipeline } = require("node:stream/promises");
const Fastify = require("fastify");
const path = require("path");
const fastify = Fastify({
  logger: true,
  disableRequestLogging: true,
});
const crypto = require("crypto");

const jwtSecret = crypto.randomBytes(64).toString("hex");
const fastifyView = require("@fastify/view");
const mongoose = require("mongoose");

//import route
const BookRoutes = require("./router/BookRoutes");
const UserRoutes = require("./router/UserRoutes");
const authRoutes = require("./router/authRoutes");
const auth = require("./auth");
const authority = require("./authority");

// MongoDB URI
const dbURI = "mongodb://localhost:27017/BanTruyen";
// kết nối đến MongoDB
mongoose
  .connect(dbURI, {})
  .then(() => {
    fastify.log.info("MongoDB connected successfully");
  })
  .catch((err) => {
    fastify.log.error("MongoDB connection error:", err);
  });

// Đóng kết nối mongoose khi tiến trình của node.js dừng lại
process.on("SIGINT", () => {
  mongoose.connection.close(() => {
    console.log("Mongoose connection closed through app termination");
    process.exit(0);
  });
});

//Server
BookRoutes.forEach((route) => {
  fastify.route(route);
}); //Duyệt qua từng phần tử trong BookRoutes

UserRoutes.forEach((route) => {
  fastify.route(route);
}); //Duyệt qua từng phần tử trong UserRoutes

fastify.register(require("@fastify/jwt"), {
  secret: jwtSecret,
  sign: { algorithm: "HS256" },
});

fastify.register(require("@fastify/cookie"), {
  secret: "dkieijeodopwwnvjdiehfnd",
  parseOptions: {},
});

fastify.decorate("authenticate", async function (req, rep) {
  try {
    await req.jwtVerify();
    console.log("Decoded JWT:", req.user);
  } catch (err) {
    rep.clearCookie("token").code(401).send({ error: "Unauthorized" });
  }
});

fastify.register(require("@fastify/formbody"));

fastify.register(authRoutes);

fastify.register(require("@fastify/multipart"), {
  attachFieldsToBody: true,
  limits: {
    fieldSize: 50 * 1024 * 1024,
  },
});
fastify.register(fastifyView, {
  engine: {
    pug: require("pug"),
  },
  root: "views",
  propertyName: "render",
  asyncPropertyName: "asyncReder",
});

fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "public"),
  prefix: "/public/",
});

fastify.get("/create-user", function (req, rep) {
  rep.render("create-user");
});

fastify.get("/create-book", function (req, rep) {
  rep.render("create-book");
});

fastify.get("/login", function (req, rep) {
  rep.render("login");
});

fastify.get("/register", function (req, rep) {
  rep.render("register");
});

fastify.get("/logout", function (req, rep) {
  rep.render("logout");
});

fastify.get("/user-dashboard", function (req, rep) {
  rep.render("user-dashboard");
});

fastify.get(
  "/admin",
  { onRequest: [auth, authority("admin")] },
  function (req, rep) {
    rep.render("admin");
  }
);

//fastify.get('/', (req, rep) => {
// rep.render('homepage');
//});

fastify.listen({ port: 5000 }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
