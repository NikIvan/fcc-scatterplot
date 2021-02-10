
class HttpRouter {
  static METHOD_GET = 'GET'
  static METHOD_POST = 'POST'
  static METHOD_PUT = 'PUT'
  static METHOD_PATCH = 'PATCH'
  static METHOD_DELETE = 'DELETE'
  static METHOD_OPTIONS = 'OPTIONS'
  static METHOD_HEAD = 'HEAD'
  static METHOD_CONNECT = 'CONNECT'
  static METHOD_TRACE = 'TRACE'

  constructor() {
    this.routes = {};

    this.addMethod(HttpRouter.METHOD_GET);
    this.addMethod(HttpRouter.METHOD_POST);
  }

  set(path = '', options = {}, handler) {
    const {method, isExact = false} = options;

    if (method == null) {
      throw new Error('Please, provide route method!');
    }

    if (this.routes[method] == null) {
      this.addMethod(method);
    }

    if (isExact) {
      this.routes[method].exact.set(path, handler);
    } else {
      this.routes[method].regex.set(path, handler);
    }
  }

  /**
   *
   * @returns {string[]}
   */
  getAvailableMethods() {
    return Object.keys(this.routes);
  }

  addMethod(method) {
    this.routes[method] = {
      exact: new Map(),
      regex: new Map(),
    };
  }

  match(method = '', path = '') {
    let matchedHandler = null;
    const matchedRoutes = this.routes[method];

    if (matchedRoutes == null) {
      return null;
    }

    if (matchedRoutes.exact.has(path)) {
      matchedHandler = matchedRoutes.exact.get(path);
    } else {
      for (const [route, handler] of matchedRoutes.regex) {
        if ((new RegExp(route)).test(path)) {
          matchedHandler = handler;
          break;
        }
      }
    }

    return matchedHandler;
  }
}

module.exports = HttpRouter;
