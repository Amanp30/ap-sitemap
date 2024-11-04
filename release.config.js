/**
 * @type {import('semantic-release').GlobalConfig}
 */
module.exports = {
  branches: ["main"], // Adjust according to your branch names
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    ["@semantic-release/npm", { npmPublish: true }], // Publish to npm
    "@semantic-release/github", // Create a release on GitHub, no assets
  ],
};
