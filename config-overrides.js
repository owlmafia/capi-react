const path = require("path");
const webpack = require("webpack");

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

  return config;
};
