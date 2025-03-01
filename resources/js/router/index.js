import { createApp, nextTick }  from "vue";
import store from "~/store";
import Meta from "vue-meta";
import { createRouter, createWebHistory } from "vue-router";
import routes from "./routes";

const app = createApp();

app.use(store);
// app.use(Meta);

// The middleware for every page of the application.
const globalMiddleware = ["check-auth"];

// Load middleware modules dynamically.
const routeMiddleware = resolveMiddleware(
  require.context("~/middleware", false, /.*\.js$/),
);

const router = makeRouter();

app.use(router);

export default router;

/**
 * Create a new router instance.
 *
 * @return {Router}
 */
function makeRouter() {
  const router = createRouter({
    history: createWebHistory(),
    routes,
  });

  router.beforeEach(beforeEach);
  router.afterEach(afterEach);

  return router;
}

/**
 * Global router guard.
 *
 * @param {Route} to
 * @param {Route} from
 * @param {Function} next
 */
async function beforeEach(to, from, next) {
  let components = [];

  try {
    // Get the matched components and resolve them.
    components = await resolveComponents(
      router.getMatchedComponents({ ...to }),
    );
  } catch (error) {
    if (/^Loading( CSS)? chunk (\d)+ failed\./.test(error.message)) {
      window.location.reload(true);
      return;
    }
  }

  if (components.length === 0) {
    return next();
  }

  // Start the loading bar.
  // if (components[components.length - 1].loading !== false) {
  //   router.app.$nextTick(() => router.app.$loading.start())
  // }

  // Get the middleware for all the matched components.
  const middleware = getMiddleware(components);

  // Call each middleware.
  callMiddleware(middleware, to, from, (...args) => {
    // Set the application layout only if "next()" was called with no args.
    if (args.length === 0) {
      router.app.setLayout(components[0].layout || "");
    }

    next(...args);
  });
}

/**
 * Global after hook.
 *
 * @param {Route} to
 * @param {Route} from
 * @param {Function} next
 */
async function afterEach(to, from, next) {
  await nextTick();

  // router.app.$loading.finish()
}

/**
 * Call each middleware.
 *
 * @param {Array} middleware
 * @param {Route} to
 * @param {Route} from
 * @param {Function} next
 */
function callMiddleware(middleware, to, from, next) {
  const stack = middleware.reverse();

  const _next = (...args) => {
    // Stop if "_next" was called with an argument or the stack is empty.
    if (args.length > 0 || stack.length === 0) {
      // if (args.length > 0) {
      //   router.app.$loading.finish()
      // }

      return next(...args);
    }

    const middleware = stack.pop();

    if (typeof middleware === "function") {
      middleware(to, from, _next);
    } else if (routeMiddleware[middleware]) {
      routeMiddleware[middleware](to, from, _next);
    } else {
      throw Error(`Undefined middleware [${middleware}]`);
    }
  };

  _next();
}

/**
 * Resolve async components.
 *
 * @param  {Array} components
 * @return {Array}
 */
function resolveComponents(components) {
  return Promise.all(
    components.map((component) => {
      return typeof component === "function" ? component() : component;
    }),
  );
}

/**
 * Merge the the global middleware with the components middleware.
 *
 * @param  {Array} components
 * @return {Array}
 */
function getMiddleware(components) {
  const middleware = [...globalMiddleware];

  components
    .filter((c) => c.middleware)
    .forEach((component) => {
      if (Array.isArray(component.middleware)) {
        middleware.push(...component.middleware);
      } else {
        middleware.push(component.middleware);
      }
    });

  return middleware;
}

/**
 * Scroll Behavior
 *
 * @link https://router.vuejs.org/en/advanced/scroll-behavior.html
 *
 * @param  {Route} to
 * @param  {Route} from
 * @param  {Object|undefined} savedPosition
 * @return {Object}
 */
function scrollBehavior(to, from, savedPosition) {
  if (savedPosition) {
    return savedPosition;
  }

  if (to.hash) {
    return { selector: to.hash };
  }

  const [component] = router.getMatchedComponents({ ...to }).slice(-1);

  if (component && component.scrollToTop === false) {
    return {};
  }

  // return {}
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ x: 0, y: 0 });
    }, 300);
  });
}

/**
 * @param  {Object} requireContext
 * @return {Object}
 */
function resolveMiddleware(requireContext) {
  return requireContext
    .keys()
    .map((file) => [file.replace(/(^.\/)|(\.js$)/g, ""), requireContext(file)])
    .reduce(
      (guards, [name, guard]) => ({ ...guards, [name]: guard.default }),
      {},
    );
}
