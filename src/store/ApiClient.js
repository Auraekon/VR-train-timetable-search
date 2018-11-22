import axios from 'axios';

/**
 * ApiClient, provides shared axios instance
 */
export default class ApiClient {
  /**
   * shared axios instance
   */
  static _client = axios.create({
    baseURL: process.env.REACT_APP_API_DOMAIN,
    headers: {
      Accept: 'application/json'
    }
  });

  constructor(onRequest, onSuccess, onReject) {
    this._onRequest = onRequest || null;
    this._onSuccess = onSuccess || null;
    this._onReject = onReject || null;
  }

  api() {
    return ApiClient._client;
  }

  async apiWrapper(promise) {
    if (this._onRequest) {
      this._onRequest();
    }

    promise.then(
      // On success
      response => {
        if (this._onSuccess) {
          this._onSuccess();
        }
      },
      // On reject
      response => {
        if (this._onReject) {
          this._onReject();
        }
      }
    );

    return promise;
  }
}
