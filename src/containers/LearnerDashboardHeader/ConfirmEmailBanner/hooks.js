import React from 'react';

import { StrictDict } from 'utils';
import { useEmailConfirmationData } from 'data/redux/hooks';

import * as module from './hooks';

export const state = StrictDict({
  showPageBanner: (val) => React.useState(val), // eslint-disable-line
  showConfirmModal: (val) => React.useState(val), // eslint-disable-line
});

export const useConfirmEmailBannerData = () => {
  const { isNeeded } = useEmailConfirmationData() || {};
  const [showPageBanner, setShowPageBanner] = module.state.showPageBanner(isNeeded);
  const [showConfirmModal, setShowConfirmModal] = module.state.showConfirmModal(false);
  const closePageBanner = () => setShowPageBanner(false);
  const closeConfirmModal = () => setShowConfirmModal(false);

  const openConfirmModalButtonClick = () => {
    window.location.reload();
  };

  const userConfirmEmailButtonClick = () => {
    window.location.reload();
  };
  return {
    isNeeded,
    showPageBanner,
    closePageBanner,
    showConfirmModal,
    closeConfirmModal,
    openConfirmModalButtonClick,
    userConfirmEmailButtonClick,
  };
};

export default useConfirmEmailBannerData;
