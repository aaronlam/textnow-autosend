module.exports = {
  username: process.env.TEXTNOW_USERNAME || '',
  password: process.env.TEXTNOW_PASSWORD || '',
  cookies: process.env.TEXTNOW_COOKIES || '',
  recipient: process.env.TEXTNOW_RECIPIENT || '(726) 666-0002',
  message: process.env.TEXTNOW_MESSAGE || 'autosend message',
};
