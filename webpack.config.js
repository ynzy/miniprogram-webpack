const { resolve } = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
// import WXAppWebpackPlugin from 'wxapp-webpack-plugin';
const MinaWebpackPlugin = require('./plugin/MinaWebpackPlugin');
// const MinaWebpackPlugin = require('mina-webpack-plugin') 
// const MinaRuntimePlugin = require('./plugin/MinaRuntimePlugin');
const MinaRuntimePlugin = require('@tinajs/mina-runtime-webpack-plugin')
const LodashWebpackPlugin = require('lodash-webpack-plugin');
const webpack = require('webpack');
const debuggable = process.env.BUILD_TYPE !== 'release'

module.exports = {
  context: resolve('src'), //入口文件所处的目录的绝对路径，默认的值就是项目的根目录
  entry: './app.js', // 入口
  /* entry: { // 配置多个入口
    'app': './app.js',
    'pages/index/index': './pages/index/index.js',
    'pages/logs/logs': './pages/logs/logs.js'
  }, */
  output: {  // 输出目录
    path: resolve('dist'),
    filename: '[name].js', //多个入口起点，确保每个文件具有唯一的名称
    globalObject: 'wx',  //全局对象配置为 wx
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader'
      },
      {
        test: /\.(less)$/,
        include: /src/,
        use: [
          {
            loader: 'file-loader',
            options: {
              useRelativePath: true,
              name: '[path][name].wxss',
              context: resolve('src'),
            },
          },
          {
            loader: 'less-loader',
            options: {
              /* sassOptions: {
                indentWidth: 4,
                includePaths: [resolve('src', 'styles'), resolve('src')],
              } */
              lessOptions: {
                indentWidth: 4,
                includePaths: [resolve('src', 'styles'), resolve('src')],
              }
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: JSON.stringify(process.env.NODE_ENV) || 'development',
      BUILD_TYPE: JSON.stringify(process.env.BUILD_TYPE) || 'debug',
    }),
    new CleanWebpackPlugin({ //清理打包目录
      cleanStaleWebpackAssets: false, //重建时自动删除所有未使用的webpack资产
    }),
    new CopyWebpackPlugin([ //在webpack中拷贝文件和文件夹
      {
        from: '**/*', //定义要拷贝的源文件 
        to: './', //定义要拷贝到的目标文件夹
        // ignore: ['**/*.js'],  //从 src 复制文件到 dist 时，排除文件
        ignore: ['**/*.js', '**/*.less'],
      },
    ]),
    new MinaWebpackPlugin({
      scriptExtensions: ['.js'],
      assetExtensions: ['.less'],
    }),
    // new WXAppWebpackPlugin({
    //   clear: !debuggable
    // }),
    new MinaRuntimePlugin(),
    new LodashWebpackPlugin(),
  ],
  // 不希望每个入口文件都生成 runtime 代码，而是希望将其抽离到一个单独的文件中，以减少 app 的体积。
  optimization: {
    splitChunks: {
      chunks: 'all',
      name: 'common',
      minChunks: 2,
      minSize: 0,
    },
    runtimeChunk: {
      name: 'runtime'
    },
    usedExports: true
  },
  // mode: 'none',
  mode: debuggable ? 'none' : 'production',
  devtool: debuggable ? 'inline-source-map' : 'source-map',
}
