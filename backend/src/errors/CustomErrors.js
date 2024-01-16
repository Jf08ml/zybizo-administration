class NotFoundError extends Error {
    constructor(message) {
      super(message);
      this.name = 'NotFoundError';
      this.statusCode = 404;
    }
  }
  
  class DatabaseError extends Error {
    constructor(message) {
      super(message);
      this.name = 'DatabaseError';
      this.statusCode = 500;
    }
  }

  class ValidationError extends Error {
    constructor(message) {
      super(message);
      this.name = 'ValidationError';
      this.statusCode = 400; // Código de estado para errores de cliente
    }
  }
  
  class DuplicateKeyError extends Error {
    constructor(message) {
      super(message);
      this.name = 'DuplicateKeyError';
      this.statusCode = 409; // Conflicto
    }
  }
  
  
  export default {
    NotFoundError,
    DatabaseError,
    ValidationError,
    DuplicateKeyError
  };
  