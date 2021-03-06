/**
 * Build config for electron renderer process
 */

import path from 'path'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CspHtmlWebpackPlugin from 'csp-html-webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import CleanWebpackPlugin from 'clean-webpack-plugin'
import merge from 'webpack-merge'
import baseConfig, { rootDir } from './webpack.config.base'

export default merge.smart(baseConfig, {
  devtool: 'source-map',

  target: 'electron-renderer',

  mode: 'production',

  entry: path.join(rootDir, 'app', 'index'),

  output: {
    path: path.join(rootDir, 'app', 'dist'),
    publicPath: '../dist/',
    filename: 'renderer.prod.js'
  },

  stats: {
    children: false
  },

  module: {
    rules: [
      // Extract all .global.css to style.css as is
      {
        test: /\.global\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      // Pipe other styles through css modules and append to style.css
      {
        test: /^((?!\.global).)*\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: '[name]__[local]__[hash:base64:5]'
            }
          }
        ]
      },
      // Add SASS support  - compile all .global.scss files and pipe it to style.css
      {
        test: /\.global\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              includePaths: ['app']
            }
          }
        ]
      },
      // Add SASS support  - compile all other .scss files and pipe it to style.css
      {
        test: /^((?!\.global).)*\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
              localIdentName: '[name]__[local]__[hash:base64:5]'
            }
          },
          {
            loader: 'sass-loader',
            options: {
              includePaths: ['app']
            }
          }
        ]
      },
      // WOFF Font
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/font-woff'
          }
        }
      },
      // WOFF2 Font
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/font-woff'
          }
        }
      },
      // TTF Font
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/octet-stream'
          }
        }
      },
      // EOT Font
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        use: 'file-loader'
      },
      // SVG Font
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'image/svg+xml'
          }
        }
      },
      // Common Image Formats
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|webp)$/,
        use: 'url-loader'
      }
    ]
  },

  plugins: [
    new CleanWebpackPlugin([path.join('app', 'dist')]),

    new MiniCssExtractPlugin(),

    new HtmlWebpackPlugin({
      template: path.join('app', 'app.html')
    }),

    new CspHtmlWebpackPlugin({
      'default-src': "'self'",
      'object-src': "'none'",
      'connect-src': ["'self'", 'https://blockchain.info', 'https://zap.jackmallers.com'],
      'script-src': ["'self'"],
      'font-src': [
        "'self'",
        'data:',
        'https://fonts.googleapis.com',
        'https://s3.amazonaws.com',
        'https://fonts.gstatic.com'
      ],
      'style-src': [
        "'self'",
        'blob:',
        'https://fonts.googleapis.com',
        'https://s3.amazonaws.com',
        'https://fonts.gstatic.com',
        "'unsafe-inline'"
      ]
    }),

    new BundleAnalyzerPlugin({
      analyzerMode: process.env.OPEN_ANALYZER === 'true' ? 'server' : 'disabled',
      openAnalyzer: process.env.OPEN_ANALYZER === 'true'
    })
  ]
})
