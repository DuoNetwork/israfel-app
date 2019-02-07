const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
	mode: 'development',
	entry: {
		app: path.resolve(__dirname, 'src/ts/app.tsx')
	},
	output: {
		path: path.join(__dirname, 'dist'),
		filename: '[name].js',
		publicPath: '/'
	},
	devServer: {
		https: true,
		contentBase: './dist',
		hot: true,
		historyApiFallback: true,
		host: '0.0.0.0',
		disableHostCheck: true
	},
	plugins: [
		new webpack.LoaderOptionsPlugin({
			debug: true
		}),
		new webpack.SourceMapDevToolPlugin(),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('development'),
			__ENV__: JSON.stringify('uat')
		}),
		new webpack.HotModuleReplacementPlugin(),
		new HtmlWebpackPlugin({
			title: 'DUO Dex',
			template: path.resolve(__dirname, 'src/index.ejs'),
			favicon: path.join(__dirname, 'src/images/favicon.ico'),
			filename: 'index.html'
		})
	],
	optimization: {
		splitChunks: {
			cacheGroups: {
				commons: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendors',
					chunks: 'all'
				}
			}
		}
	},
	module: {
		rules: [
			{
				enforce: 'pre',
				test: /\.tsx?$/,
				include: path.join(__dirname, 'src'),
				use: 'tslint-loader'
			},
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			},
			{
				test: /\.less$/,
				use: [
					'style-loader',
					'css-loader',
					{
						loader: 'less-loader',
						options: {
							javascriptEnabled: true
						}
					}
				]
			},
			{
				test: /\.(jpg|jpeg|png|gif|svg)(\?.*)?$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 20480
						}
					}
				]
			},
			{
				test: /\.(xlsm|csv|ico|eot|otf|webp|ttf|ttc|woff|woff2|pdf)(\?.*)?$/,
				exclude: /node_modules/,
				use: 'file-loader?name=[name].[ext]'
			}
		]
	},
	resolve: {
		alias: {
			moment: path.resolve('./node_modules/moment'),
			bip39: path.resolve('../israfel-common/node_modules/bip39'),
			'bn.js': path.resolve('../israfel-common/node_modules/bn.js'),
			'bignumber.js': path.resolve('../israfel-common/node_modules/bignumber.js'),
			'core-js': path.resolve('../israfel-common/node_modules/core-js'),
			immutable: path.resolve('./node_modules/immutable'),
			elliptic: path.resolve('./node_modules/elliptic'),
			'ethereumjs-wallet': path.resolve('../israfel-common/node_modules/ethereumjs-wallet'),
			ethers: path.resolve('../israfel-common/node_modules/ethers'),
			lodash: path.resolve('../israfel-common/node_modules/lodash'),
			underscore: path.resolve('../israfel-common/node_modules/underscore'),
			'web3-eth-accounts': path.resolve('../israfel-common/node_modules/web3-eth-accounts'),
			'web3-eth-contract': path.resolve('../israfel-common/node_modules/web3-eth-contract'),
			'web3-eth-personal': path.resolve('../israfel-common/node_modules/web3-eth-personal'),
			'web3-eth': path.resolve('../israfel-common/node_modules/web3-eth'),
			'web3-provider-engine': path.resolve(
				'../israfel-common/node_modules/web3-provider-engine'
			),
			'web3-utils': path.resolve('../israfel-common/node_modules/web3-utils'),
			'web3-core-method': path.resolve('../israfel-common/node_modules/web3-core-method'),
			'web3-core-helpers': path.resolve('../israfel-common/node_modules/web3-core-helpers'),
			'web3-providers-ws': path.resolve('../israfel-common/node_modules/web3-providers-ws'),
			'web3-providers-ipc': path.resolve('../israfel-common/node_modules/web3-providers-ipc'),
			'web3-providers-http': path.resolve(
				'../israfel-common/node_modules/web3-providers-http'
			),
			'@finbook/duo-contract-wrapper': path.resolve(
				'./node_modules/@finbook/duo-contract-wrapper'
			),
			'@finbook/duo-market-data': path.resolve('.//node_modules/@finbook/duo-market-data')
		},
		modules: [path.join(__dirname, 'src'), 'node_modules'],
		extensions: ['.js', '.jsx', '.ts', '.tsx']
	}
};
