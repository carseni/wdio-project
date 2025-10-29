import { Given } from '@wdio/cucumber-framework';
import { getValue } from './context.js';

// Single shared Given to avoid ambiguous step definitions across modules.
// It accepts any module's token (articles/tags/comments) or a global auth token
// set by other helpers. This keeps features using the common phrase stable.
Given('a registered user with a valid token', () => {
  const token = getValue('token_articles') || getValue('token_comments') || getValue('token_tags') || (typeof global !== 'undefined' && global.authToken);
  // eslint-disable-next-line no-console
  console.log('[auth.steps] token present:', !!token);
  if (!token) throw new Error('No auth token found for the scenario');
});

export default {};
