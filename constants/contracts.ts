export const NETWORK = 'devnet';

export const CONTRACTS = {
  PACKAGE_ID: '0x0af81f0ee8b71ebd70563826133b1ff85affdaa6b12c5674df8fe1968ba098b2',
  REVIEW_REGISTRY: '0x26b5b69028383b03a6447423d7e851fbea6947ab934277e09985a6765e9e143e',
  VOTE_RECORD: '0x781e7cd88112e1ff2061eb792dc6e60154bcc318205741b569b75a62dd3d84ec',
} as const;

export const RATING_DIMENSIONS = [
  { key: 'security', label: 'Security', weight: 0.3 },
  { key: 'usability', label: 'Usability', weight: 0.25 },
  { key: 'performance', label: 'Performance', weight: 0.2 },
  { key: 'documentation', label: 'Documentation', weight: 0.15 },
  { key: 'innovation', label: 'Innovation', weight: 0.1 },
] as const;

export const MAX_REVIEW_LENGTH = 500;
export const MIN_RATING = 1;
export const MAX_RATING = 5;
