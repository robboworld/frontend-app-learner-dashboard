import { useSelector, useDispatch } from 'react-redux';

import { isNavigatingAway } from 'data/navigationAway';
// Leaf module: avoid circular import via data/redux barrel.
import { actions, selectors } from '../requests';
import * as module from './requests';

export const useMasqueradeData = () => useSelector(selectors.masquerade);

export const statusSelector = selector => (requestName) => useSelector(selector(requestName));
export const useRequestIsPending = module.statusSelector(selectors.isPending);
export const useRequestIsFailed = module.statusSelector(selectors.isFailed);
export const useRequestIsCompleted = module.statusSelector(selectors.isCompleted);
export const useRequestIsInactive = module.statusSelector(selectors.isInactive);
export const useRequestError = module.statusSelector(selectors.error);
export const useRequestErrorCode = module.statusSelector(selectors.errorCode);
export const useRequestErrorStatus = module.statusSelector(selectors.errorStatus);
export const useRequestData = module.statusSelector(selectors.data);

let pageIsUnloading = false;
if (typeof window !== 'undefined') {
  const markUnloading = () => {
    pageIsUnloading = true;
  };
  window.addEventListener('pagehide', markUnloading);
  window.addEventListener('beforeunload', markUnloading);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      markUnloading();
    }
  });
}

/** True when the browser/axios cancelled the call (navigation away, Strict Mode remount, etc.). */
export const isRequestCancellation = (error) => {
  if (!error) {
    return false;
  }
  if (error.code === 'ERR_CANCELED' || error.code === 'ECONNABORTED') {
    return true;
  }
  if (error.name === 'AbortError' || error.name === 'CanceledError') {
    return true;
  }
  if (error.__CANCEL__) {
    return true;
  }
  if (typeof error.message === 'string' && /abort|cancel/i.test(error.message)) {
    return true;
  }
  if (error.message === 'Network Error') {
    return true;
  }
  return false;
};

/**
 * Fetch died because the user left the page (or the tab hid).
 * On unload axios often reports "Network Error" with no HTTP response — not AbortError —
 * and the rejection can run while visibility is still "visible".
 */
export const isNavigationalFetchFailure = (error) => {
  if (isNavigatingAway()) {
    return true;
  }
  if (module.isRequestCancellation(error)) {
    return true;
  }
  if (pageIsUnloading) {
    return true;
  }
  if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
    return true;
  }
  if (error && !error.response && (error.isAxiosError || error.message === 'Network Error')) {
    return true;
  }
  return false;
};

export const useMakeNetworkRequest = () => {
  const dispatch = useDispatch();
  return ({
    requestKey,
    promise,
    onSuccess,
    onFailure,
  }) => {
    dispatch(actions.startRequest({ requestKey }));
    return promise.then((response) => {
      if (isNavigatingAway()) {
        return;
      }
      if (onSuccess) { onSuccess(response); }
      dispatch(actions.completeRequest({ requestKey, response }));
    }).catch((error) => {
      // Leaving the dashboard mid-fetch aborts the XHR; treating that as failure
      // shows ErrorPage ("unexpected error") via App's hasNetworkFailure.
      if (module.isNavigationalFetchFailure(error)) {
        dispatch(actions.clearRequest({ requestKey }));
        return;
      }
      if (onFailure) { onFailure(error); }
      dispatch(actions.failRequest({ requestKey, error }));
    });
  };
};

export const useClearRequest = () => {
  const dispatch = useDispatch();
  return (requestKey) => {
    dispatch(actions.clearRequest({ requestKey }));
  };
};
