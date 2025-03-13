/**
 * Mock Expo Router utilities for testing API endpoints
 * 
 * This file provides mock implementations of the Expo Router classes and functions
 * for use in testing API endpoints.
 */

/**
 * Mock Expo Request class
 */
class MockExpoRequest {
  constructor({ url = '', method = 'GET', headers = {}, body = null }) {
    this.url = url;
    this.method = method;
    this.headers = new Headers(headers);
    this._bodyInit = body;
    this._bodyText = typeof body === 'string' ? body : JSON.stringify(body);
  }

  async text() {
    return this._bodyText;
  }

  async json() {
    try {
      return JSON.parse(this._bodyText);
    } catch (error) {
      throw new Error(`Failed to parse JSON: ${error.message}`);
    }
  }

  get bodyJson() {
    try {
      return JSON.parse(this._bodyText);
    } catch (error) {
      return null;
    }
  }
}

/**
 * Mock Expo Response class
 */
class MockExpoResponse {
  constructor() {
    this.status = 200;
    this.statusText = 'OK';
    this.headers = new Headers();
    this._body = '';
    this.bodyJson = null;
  }

  status(code) {
    this.status = code;
    return this;
  }

  set(headerName, headerValue) {
    this.headers.set(headerName, headerValue);
    return this;
  }

  json(data) {
    this.headers.set('Content-Type', 'application/json');
    this._body = JSON.stringify(data);
    this.bodyJson = data;
    return this;
  }

  send(data) {
    this._body = data;
    return this;
  }

  end() {
    return this;
  }
}

/**
 * Create a URL for a mock request
 * @param {string} path - The path for the request, e.g., '/api/users/123'
 * @param {Object} query - Query parameters to include in the URL
 * @returns {string} - A formatted URL string
 */
function createRequestUrl(path, query = {}) {
  const url = new URL(`http://localhost${path}`);
  
  // Add query parameters
  Object.entries(query).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });
  
  return url.toString();
}

/**
 * Create an authorization header for a mock request
 * @param {string} token - The token to include in the header
 * @returns {Object} - A headers object with Authorization set
 */
function createAuthHeader(token) {
  return {
    'Authorization': `Bearer ${token}`
  };
}

// Export the mock classes and utilities
module.exports = {
  MockExpoRequest,
  MockExpoResponse,
  createRequestUrl,
  createAuthHeader
}; 