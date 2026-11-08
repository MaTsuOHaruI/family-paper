/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  // tsconfig の paths（@/* → src/*、@/assets/* → assets/*）と同じ対応を Jest にも設定する
  moduleNameMapper: {
    '^@/assets/(.*)$': '<rootDir>/assets/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: ['/node_modules/', '/.expo/'],
};
