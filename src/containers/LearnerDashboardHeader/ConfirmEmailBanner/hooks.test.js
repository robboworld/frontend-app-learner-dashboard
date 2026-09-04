import { MockUseState } from 'testUtils';
import { useEmailConfirmationData } from 'data/redux/hooks';

import * as hooks from './hooks';

jest.mock('data/redux/hooks', () => ({
  useEmailConfirmationData: jest.fn(),
}));

const emailConfirmation = {
  isNeeded: true,
};

const state = new MockUseState(hooks);

describe('ConfirmEmailBanner hooks', () => {
  let out;
  describe('state values', () => {
    state.testGetter(state.keys.showPageBanner);
    state.testGetter(state.keys.showConfirmModal);
  });
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('useEmailConfirmationData', () => {
    beforeEach(() => state.mock());
    afterEach(state.restore);

    test('show page banner on unverified email', () => {
      useEmailConfirmationData.mockReturnValueOnce({ ...emailConfirmation });
      out = hooks.useConfirmEmailBannerData();
      expect(out.isNeeded).toEqual(emailConfirmation.isNeeded);
      useEmailConfirmationData.mockReturnValueOnce({ isNeeded: false });
    });

    test('hide page banner on verified email', () => {
      useEmailConfirmationData.mockReturnValueOnce({ isNeeded: false });
      out = hooks.useConfirmEmailBannerData();
      expect(out.isNeeded).toEqual(false);
    });
  });

  describe('behavior', () => {
    beforeEach(() => {
      state.mock();
      useEmailConfirmationData.mockReturnValueOnce({ ...emailConfirmation });
      out = hooks.useConfirmEmailBannerData();
    });
    afterEach(state.restore);
    test('closePageBanner', () => {
      out.closePageBanner();
      expect(state.values.showPageBanner).toEqual(false);
    });
    test('closeConfirmModal', () => {
      out.closeConfirmModal();
      expect(state.values.showConfirmModal).toEqual(false);
    });
    test('openConfirmModalButtonClick', () => {
      const original = window.location;
      delete window.location;
      window.location = { ...original, reload: jest.fn() };
      out.openConfirmModalButtonClick();
      expect(window.location.reload).toHaveBeenCalled();
      window.location = original;
    });
    test('userConfirmEmailButtonClick', () => {
      const original = window.location;
      delete window.location;
      window.location = { ...original, reload: jest.fn() };
      out.userConfirmEmailButtonClick();
      expect(window.location.reload).toHaveBeenCalled();
      window.location = original;
    });
  });
});
