import { defineConfig } from 'taze'

export default defineConfig({
  // Ignore inquirer as it should not be touched due to commitizen and cz-commitlint
  packageMode: {
    inquirer: 'ignore',
  },

  // Include peer dependencies
  peer: true,

  // Only consider packages out of date if an
  // update was published within the last 7 days
  maturityPeriod: 7, // 1 week

  // You can set this to true if you want to bypass the cache
  // and just check npm directly every time.
  force: false,

  // Group updates by source
  group: true,

  // Shows the compatibility with the current version of Node.js
  nodecompat: true,
})
