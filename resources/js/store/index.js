import {createStore} from 'vuex'
import notification from './modules/notification'

// Load store modules dynamically.
const requireContext = require.context('./modules', false, /.*\.js$/)

const modules = requireContext.keys()
  .reduce((modules, file) => {
    const moduleName = file.replace(/(^.\/)|(\.js$)/g, '')
    const moduleConfig = requireContext(file)

    if (moduleConfig.default) {
      modules[moduleName] = {
        ...moduleConfig.default,
        namespaced: moduleConfig.default.namespaced !== undefined ? moduleConfig.default.namespaced : true,
      };
    } else {
      console.error(`Module ${moduleName} does not have a default export.`);
    }

    return modules
  }, {})

const store = createStore({
  modules
});

export default store;
