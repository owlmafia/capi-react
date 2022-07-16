const path = require("path");
const webpack = require("webpack");
const { override } = require("customize-cra");

module.exports = function override(config, env) {
  const wasmExtensionRegExp = /\.wasm$/;

  config.module.rules.forEach((rule) => {
    (rule.oneOf || []).forEach((oneOf) => {
      if (oneOf.type === "asset/resource") {
        // make file-loader ignore WASM files
        oneOf.exclude.push(wasmExtensionRegExp);
      }
    });
  });

  // add a dedicated loader for WASM
  config.module.rules.push({
    test: wasmExtensionRegExp,
    include: path.resolve(__dirname, "src"),
    use: [{ loader: require.resolve("wasm-loader"), options: {} }],
  });

  config.experiments = {
    asyncWebAssembly: true,
  };

  config.resolve.fallback = {
    ...config.resolve.fallback,
    stream: require.resolve("stream-browserify"),
    buffer: require.resolve("buffer"),
  };

  config.resolve.extensions = [
    ...config.resolve.extensions,
    ".wasm",
    ".ts",
    ".js",
  ];

  config.plugins = [
    ...config.plugins,
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    }),
  ];

  config.ignoreWarnings = [
    // Ignore warnings raised by source-map-loader.
    // some third party packages may ship miss-configured sourcemaps, that interrupts the build
    // See: https://github.com/facebook/create-react-app/discussions/11278#discussioncomment-1780169
    /**
     *
     * @param {import('webpack').WebpackError} warning
     * @returns {boolean}
     */
    function ignoreSourcemapsloaderWarnings(warning) {
      return (
        warning.module &&
        warning.module.resource.includes("node_modules") &&
        warning.details &&
        warning.details.includes("source-map-loader")
      );
    },
  ];

  return config;
};
