class HttpRouter {
  constructor() {
    this.routes = {};

    this.addMethod(HttpRouter.METHOD_GET);
    this.addMethod(HttpRouter.METHOD_POST);
  }

  set(path = '', options = {}, handler) {
    const { method, isExact = false } = options;

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
      const matchedRoute = Object
        .keys(matchedRoutes.regex)
        .find((route) => new RegExp(route).test(path));

      if (matchedRoute) {
        matchedHandler = matchedRoutes.get(matchedRoute);
      }
    }

    return matchedHandler;
  }
}

HttpRouter.METHOD_GET = 'GET';
HttpRouter.METHOD_POST = 'POST';
HttpRouter.METHOD_PUT = 'PUT';
HttpRouter.METHOD_PATCH = 'PATCH';
HttpRouter.METHOD_DELETE = 'DELETE';
HttpRouter.METHOD_OPTIONS = 'OPTIONS';
HttpRouter.METHOD_HEAD = 'HEAD';
HttpRouter.METHOD_CONNECT = 'CONNECT';
HttpRouter.METHOD_TRACE = 'TRACE';

module.exports = HttpRouter;
