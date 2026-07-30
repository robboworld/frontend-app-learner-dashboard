import { useSelector, useDispatch } from 'react-redux';

import { isNavigatingAway } from 'data/navigationAway';
import * as redux from 'data/redux';
import * as module from './requests';

const selectors = redux.selectors.requests;
const actions = redux.actions.requests;

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

/**
 * True when a request was aborted because the user navigated away (or the
 * client cancelled it). Those must not surface as the full-page ErrorPage.
 */
export const isRequestCancellation = (error) => {
  if (!error) {
    return false;
  }
  if (error.name === 'AbortError' || error.name === 'CanceledError') {
    return true;
  }
  if (error.code === 'ERR_CANCELED' || error.code === 'ECONNABORTED') {
    return true;
  }
  if (error.__CANCEL__) {
    return true;
  }
  // XHR often reports unload/navigation as a generic Network Error.
  if (error.message === 'Network Error') {
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
      if (isNavigatingAway() || module.isRequestCancellation(error)) {
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
