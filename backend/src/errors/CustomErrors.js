class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404;
  }

  static throw(message) {
    throw new NotFoundError(message);
  }
}

class DatabaseError extends Error {
  constructor(message) {
    super(message);
    this.name = "DatabaseError";
    this.statusCode = 500;
  }

  static throw(message) {
    throw new DatabaseError(message);
  }
}

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
    this.statusCode = 400; // Código de estado para errores de cliente
  }

  static throw(message) {
    throw new ValidationError(message);
  }
}

class DuplicateKeyError extends Error {
  constructor(message) {
    super(message);
    this.name = "DuplicateKeyError";
    this.statusCode = 409; // Conflicto
  }

  static throw(message) {
    throw new DuplicateKeyError(message);
  }
}

export default {
  NotFoundError,
  DatabaseError,
  ValidationError,
  DuplicateKeyError,
};
