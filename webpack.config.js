const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const smp = new SpeedMeasurePlugin(); // 打包时间细节

module.exports = smp.wrap({
  mode: 'production',
  // devtool: 'source-map',
  entry: {
    index: './src/index.js',
    // vendor: ['react', 'react-dom'] // 指定公共使用的第三方类库
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    // publicPath: './',
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js'
  },
  resolve: {
    alias: {
      components: path.resolve(__dirname, 'src/components'),
      image: path.resolve(__dirname, 'public/image')
    }
  },
  optimization: {
    // minimize: true,
    // minimizer: [
    //   new UglifyJsPlugin({
    //     cache: true,
    //     parallel: true,
    //     sourceMap: true // set to true if you want JS source maps
    //   }),
    //   new OptimizeCSSAssetsPlugin({
    //     map: {
    //       inline: false,
    //       annotation: true
    //     }
    //   })
    // ],
    // splitChunks: {
    //   cacheGroups: {
    //     vendor: {
    //       chunks: 'initial',
    //       name: 'vendor',
    //       test: 'vendor',
    //       enforce: true
    //     }
    //   }
    // }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [path.resolve(__dirname, 'src')],
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.(css|less)$/,
        include: [path.resolve(__dirname, 'src')],
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader', // translate css into commonJS
              options: {
                importLoaders: 2,
                modules: true,
                localIdentName: '[name]--[local]--[hash:base64]'
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: [require('postcss-cssnext')(), require('cssnano')()],
              }
            },
            {
              loader: 'less-loader', // 将less编译成css
              options: {
                javascriptEnabled: true
              }
            }
          ]
        })
      },
      {
        test: /\.(css|less)$/,
        include: [path.resolve(__dirname, 'node_modules/')],
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader']
        })
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          {
            loader: 'url-loader', //是指定使用的loader和loader的配置参数
            options: {
              limit: 500, //是把小于500B的文件打成Base64的格式，写入JS
              name: 'images/[name]_[hash:7].[ext]'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(), // 清除打包结果

    new ExtractTextPlugin('index.css'), // 提取css样式

    new HtmlWebPackPlugin({
      // 注入script和style
      template: './index.html'
    })

    // new CopyWebpackPlugin([
    //   {
    //     // 复制静态文件
    //     from: path.resolve(__dirname, 'public'),
    //     to: path.resolve(__dirname, 'dist')
    //   }
    // ])
    // new BundleAnalyzerPlugin() // webpack打包分析
  ]
});
