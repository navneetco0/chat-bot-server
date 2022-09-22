const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log();
  if (!authHeader || !authHeader.startsWith("Bearer"))
    return res.status(400).send("No Token");
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id } = decoded;
    next();
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = authMiddleware;
