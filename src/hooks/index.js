import * as appReduxHooks from 'data/redux/hooks/app';
import * as requestReduxHooks from 'data/redux/hooks/requests';
import * as api from './api';
import * as utils from './utils';

/**
 * Webpack + `export * as` through a star-re-export barrel can yield a namespace
 * missing individual hooks (usePlatformSettingsData, useEmailConfirmationData, …),
 * especially under Fast Refresh when remounting after LMS ↔ MFE navigation.
 * Build the facade from the leaf modules and resolve properties at call time.
 */
const liveMerge = (...modules) => new Proxy(Object.create(null), {
  get(_, prop) {
    if (prop === '__esModule') {
      return true;
    }
    for (let i = 0; i < modules.length; i += 1) {
      const value = modules[i][prop];
      if (value !== undefined) {
        return value;
      }
    }
    return undefined;
  },
  has(_, prop) {
    return modules.some((mod) => prop in mod);
  },
  ownKeys() {
    return [...new Set(modules.flatMap((mod) => Reflect.ownKeys(mod)))];
  },
  getOwnPropertyDescriptor(_, prop) {
    if (prop === '__esModule' || modules.some((mod) => prop in mod)) {
      return {
        configurable: true,
        enumerable: true,
        get: () => {
          for (let i = 0; i < modules.length; i += 1) {
            const value = modules[i][prop];
            if (value !== undefined) {
              return value;
            }
          }
          return undefined;
        },
      };
    }
    return undefined;
  },
});

export const reduxHooks = liveMerge(appReduxHooks, requestReduxHooks);
export const apiHooks = liveMerge(api);
export const utilHooks = liveMerge(utils);
