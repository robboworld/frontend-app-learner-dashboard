/**
 * Copyright (C) 2026 Robbo <https://robbo.ru>
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Part of the Robbo Open edX distribution. See NOTICE at repository root.
 */
import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  eyebrow: {
    id: 'robbo.cardPreview.eyebrow',
    description: 'Label of the course card preview block shown to the course team',
    defaultMessage: 'Preview',
  },
  title: {
    id: 'robbo.cardPreview.title',
    description: 'Heading of the course card preview block on the learner dashboard',
    defaultMessage: 'Course card in My courses',
  },
  text: {
    id: 'robbo.cardPreview.text',
    description: 'Explains what the course card preview shows',
    defaultMessage: 'This is how «{courseName}» looks in a learner\'s My courses right after enrolling.',
  },
  note: {
    id: 'robbo.cardPreview.note',
    description: 'Tells the course team that learners do not see the preview block',
    defaultMessage: 'Only you can see this block.',
  },
  catalogLink: {
    id: 'robbo.cardPreview.catalogLink',
    description: 'Link to the same course card preview in the course catalog',
    defaultMessage: 'View in the catalog',
  },
  studioLink: {
    id: 'robbo.cardPreview.studioLink',
    description: 'Link back to the course settings page in the course editor',
    defaultMessage: 'Back to the course editor',
  },
  exitLink: {
    id: 'robbo.cardPreview.exitLink',
    description: 'Link that closes the course card preview',
    defaultMessage: 'Close preview',
  },
});

export default messages;
