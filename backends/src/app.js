import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
const app = express();

// CORS Setup
app.use(
  cors({
    origin: process.env.CORES_ORIGIN,
    methods: "DELETE, POST, GET, PUT",
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
    ],
    credentials: true,
  })
);

// Body parsers and other middleware
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(cookieParser());
app.use(bodyParser.json());

app.use(
  session({
    secret: process.env.GOOGLE_CLIENT_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONODB_URI, // Provide the mongoUrl here
      ttl: 14 * 24 * 60 * 60, // Sessions expire after 14 days
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 14, // 14 days
    },
  })
);

// Routers import
import studentRouter from "./routes/student.route.js";
import teacherRouter from "./routes/teacher.route.js";
import assignmentRouter from "./routes/assignment.route.js";

app.use("/api/v1/students", studentRouter);
app.use("/api/v1/teachers", teacherRouter);
app.use("/api/v1/assignments", assignmentRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Export the app
export { app };
