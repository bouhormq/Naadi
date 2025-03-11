/**
 * Custom API error class for standardized error handling
 */
export class ApiError extends Error {
  statusCode: number;
  
  /**
   * Creates a new API error
   * @param message Error message
   * @param statusCode HTTP status code (default: 500)
   */
  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    
    // Maintains proper stack trace for where our error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
  
  /**
   * Converts the error to a JSON object for API responses
   */
  toJSON() {
    return {
      error: {
        message: this.message,
        statusCode: this.statusCode
      }
    };
  }
}

export function handleApiError(error: unknown) {
  if (error instanceof ApiError) {
    return {
      statusCode: error.statusCode,
      body: JSON.stringify({
        error: error.message
      })
    };
  }
  
  console.error('Unhandled API error:', error);
  
  return {
    statusCode: 500,
    body: JSON.stringify({
      error: 'An unexpected error occurred'
    })
  };
} 