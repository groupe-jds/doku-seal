module.exports = function (options, webpack) {
  const lazyImports = ['@mapbox/node-pre-gyp', 'mock-aws-s3', 'aws-sdk', 'nock'];

  // Handle externals - can be array, function, or object
  const existingExternals = options.externals || [];

  // Create externals function that handles both existing externals and argon2
  const externalsFunction = function (context, request, callback) {
    // Handle native modules
    if (request === 'argon2') {
      return callback(null, 'commonjs argon2');
    }

    // Handle existing externals if it's a function
    if (typeof existingExternals === 'function') {
      return existingExternals.call(this, context, request, callback);
    }

    // Handle array of externals
    if (Array.isArray(existingExternals)) {
      if (existingExternals.includes(request)) {
        return callback(null, `commonjs ${request}`);
      }
      // Check if any item in the array matches (could be regex or string)
      for (const external of existingExternals) {
        if (typeof external === 'string' && external === request) {
          return callback(null, `commonjs ${request}`);
        }
        if (external instanceof RegExp && external.test(request)) {
          return callback(null, `commonjs ${request}`);
        }
      }
    }

    // Default: bundle it
    callback();
  };

  return {
    ...options,
    externals: externalsFunction,
    plugins: [
      ...options.plugins,
      new webpack.IgnorePlugin({
        checkResource(resource) {
          if (lazyImports.includes(resource)) {
            try {
              require.resolve(resource);
            } catch (err) {
              return true;
            }
          }
          return false;
        },
      }),
    ],
  };
};
