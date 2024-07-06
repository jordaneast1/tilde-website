// gatsby-node.js
exports.onCreateBabelConfig = ({ actions }) => {
    actions.setBabelPlugin({
      name: '@babel/plugin-proposal-class-properties',
      options: { loose: true },
    });
    actions.setBabelPlugin({
      name: '@babel/plugin-proposal-private-methods',
      options: { loose: true },
    });
  };
  
