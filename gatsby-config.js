/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */
/* eslint-disable */
module.exports = {
  /* Your site config here */
  plugins: [
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-typescript",
    "gatsby-plugin-less",
    "gatsby-plugin-styled-components",
    `gatsby-plugin-modal-routing`,
    {
      resolve: `gatsby-plugin-modal-routing`,
      options: {
        // A selector to set react-modal's app root to, default is `#___gatsby`
        // See http://reactcommunity.org/react-modal/accessibility/#app-element
        appElement: '#___gatsby',

        // Object of props that will be passed to the react-modal container
        // See http://reactcommunity.org/react-modal/#usage
        modalProps: { },
      }
    }
  ]
};
