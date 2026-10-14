import { getConfig } from '@edx/frontend-platform';
import { StrictDict } from 'utils';

export const routePath = `${getConfig().PUBLIC_PATH}:courseId`;
export const locationId = window.location.pathname.slice(1);

export const SortKeys = StrictDict({
  enrolled: 'enrolled',
  title: 'title',
});

export const FilterKeys = StrictDict({
  inProgress: 'inProgress',
  notStarted: 'notStarted',
  done: 'done',
  notEnrolled: 'notEnrolled',
  upgraded: 'upgraded',
});

export const ListPageSize = 25;

// Robbo course card preview for the course team (`?robbo_card_preview=<course key>`):
// the card lives outside the course list, under its own card id.
export const RobboCardPreviewParam = 'robbo_card_preview';
export const RobboPreviewCardId = 'card-robbo-preview';
