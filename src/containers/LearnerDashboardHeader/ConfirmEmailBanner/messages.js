import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  confirmEmailBannerPrefix: {
    id: 'robbo.confirmEmailBanner.prefix',
    description: 'Robbo confirm-email banner text before the action link',
    defaultMessage: 'Remember to confirm your email address so you can continue learning!',
  },
  confirmEmailBannerConfirmNow: {
    id: 'robbo.confirmEmailBanner.confirmNow',
    description: 'Robbo confirm-email banner action link label',
    defaultMessage: 'Confirm now',
  },
  confirmEmailBannerSuffix: {
    id: 'robbo.confirmEmailBanner.suffix',
    description: 'Robbo confirm-email banner text after the action link (starts with punctuation)',
    defaultMessage: '. If you do not see the message in your inbox, check your spam folder.',
  },
  verifiedConfirmEmailButton: {
    id: 'leanerDashboard.verifiedConfirmEmailButton',
    description: 'Button for verified confirming email',
    defaultMessage: 'I\'ve confirmed my email',
  },
  confirmEmailModalHeader: {
    id: 'leanerDashboard.confirmEmailModalHeader',
    description: 'title for confirming email modal',
    defaultMessage: 'Confirm your email',
  },
  confirmEmailModalBody: {
    id: 'leanerDashboard.confirmEmailModalBody',
    description: 'text hint for confirming email modal',
    defaultMessage: 'We\'ve sent you an email to verify your account. Please check your inbox and click on the big red button to confirm and keep learning.',
  },
  confirmEmailImageAlt: {
    id: 'leanerDashboard.confirmEmailImageAlt',
    description: 'text alt confirm email image',
    defaultMessage: 'confirm email background',
  },
});

export default messages;
