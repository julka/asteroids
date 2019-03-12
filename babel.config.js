module.exports = function (api) {
  api.cache(false)

  return {
    plugins: [
      [
        '@babel/plugin-proposal-decorators',
        {
          'legacy': true
        }
      ],
      require('@babel/plugin-syntax-dynamic-import').default,
      require('@babel/plugin-transform-destructuring').default,
      require('@babel/plugin-proposal-numeric-separator').default,
      [
        require('@babel/plugin-proposal-class-properties').default,
        {
          loose: true
        }
      ],
      [
        require('@babel/plugin-proposal-object-rest-spread').default,
        {
          useBuiltIns: true
        }
      ],
      [
        require('@babel/plugin-transform-runtime').default,
        {
          helpers: false,
          regenerator: true
        }
      ],
      [
        require('@babel/plugin-transform-regenerator').default,
        {
          async: false
        }
      ]
    ]
  }
}
