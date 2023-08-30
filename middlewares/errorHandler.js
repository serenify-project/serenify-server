const errorHandler = async (err, request, response, next) => {
  console.log(err, "err handler 888888");
  if (err.name === "Unauthenticated") {
    response.status(401).json({
      message: "Error Authentication",
    });
  } else if (err.name === "JsonWebTokenError" || err.name === "jwtNotFound") {
    response.status(401).json({
      message: "Error Authentication",
    });
  } else if (err.name === "NotFound") {
    response.status(404).json({
      message: "Data not found",
    });
  } else if (err.name === "PxNotFound") {
    response.status(404).json({
      message: "Package not found",
    });
  } else if (err.name === "Unauthorized") {
    response.status(403).json({
      message: "Forbidden Error Authorization",
    });
  } else if (
    err.name === "SequelizeValidationError" ||
    err.name === "SequelizeUniqueConstraintError" ||
    err.name === "SequelizeDatabaseError"
  ) {
    const errors = err.errors || [];
    let messages = [];
    for (const errorMessages of errors) {
      messages.push(errorMessages.message);
    }
    response.status(400).json({ message: messages });
  } else if (err.name === "dateRequired") {
    response.status(400).json({
      message: "Date is required",
    });
  } else if (err.name === "ErrorDelete") {
    response.status(404).json({
      message: "Error not found",
    });
  } else if (err.name == "Invalid") {
    response.status(401).json({
      message: "Invalid email or password",
    });
  } else {
    response.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = { errorHandler };
