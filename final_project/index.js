const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
  try {
    // Session auth feature: token is stored in req.session.authorization
    const authSession = req.session.authorization;

    if (!authSession || !authSession.accessToken) {
      return res.status(401).json({ message: "Unauthorized: No access token in session" });
    }

    const token = authSession.accessToken;

    // Verify token
    jwt.verify(token, "fingerprint_customer", (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Forbidden: Invalid or expired token" });
      }

      // Optional: attach user info to request for downstream routes
      req.user = decoded;

      next();
    });
  } catch (e) {
    return res.status(500).json({ message: "Authentication error", error: e.message });
  }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
