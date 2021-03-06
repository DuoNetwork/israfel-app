const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
	mode: 'production',
	entry: {
		app: path.resolve(__dirname, 'src/ts/app.tsx')
	},
	output: {
		path: path.join(__dirname, 'dist'),
		filename: '[name].[contenthash].js',
		publicPath: '/'
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('production'),
			__ENV__: JSON.stringify('uat')
		}),
		new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
		new MiniCssExtractPlugin({
			filename: 'styles.[contenthash].css'
		}),
		new HtmlWebpackPlugin({
			title: 'DUO | Relayer',
			template: path.resolve(__dirname, 'src/index.ejs'),
			favicon: path.join(__dirname, 'src/images/favicon.ico'),
			filename: 'index.html'
		}),
		new BundleAnalyzerPlugin({
			analyzerMode: 'disabled',
			reportFilename: 'report.html',
			generateStatsFile: true
		}),
		new webpack.HashedModuleIdsPlugin()
	],
	optimization: {
		minimizer: [new TerserPlugin({}), new OptimizeCssAssetsPlugin({})],
		runtimeChunk: 'single',
		splitChunks: {
			chunks: 'all',
			maxInitialRequests: Infinity,
			minSize: 0,
			cacheGroups: {
				finbook: {
					test: /[\\/]node_modules[\\/]@finbook/,
					name: 'finbook',
					priority: 100
				},
				'idna-uts46-hx': {
					test: /[\\/]node_modules[\\/]idna-uts46-hx/,
					name: 'idna-uts46-hx',
					priority: 100
				},
				'core-js': {
					test: /[\\/]node_modules[\\/]core-js/,
					name: 'core-js',
					priority: 100
				},
				cryptoJs: {
					test: /[\\/]node_modules[\\/]crypto/,
					name: 'cryptoJs',
					priority: 100
				},
				d3: {
					test: /[\\/]node_modules[\\/]d3/,
					name: 'd3',
					priority: 100
				},
				ethers: {
					test: /[\\/]node_modules[\\/]ethers/,
					name: 'ethers',
					priority: 100
				},
				eth: {
					test: /[\\/]node_modules[\\/]eth/,
					name: 'eth',
					priority: 80
				},
				'0x': {
					test: /[\\/]node_modules[\\/]@0x/,
					name: '0x',
					priority: 90
				},
				'0x-contract-wrappers': {
					test: /[\\/]node_modules[\\/]@0x[\\/]contract-wrappers/,
					name: '0x-contract-wrappers',
					priority: 100
				},
				'0x-contract-artifacts': {
					test: /[\\/]node_modules[\\/]@0x[\\/]contract-artifacts/,
					name: '0x-contract-artifacts',
					priority: 100
				},
				'0x-abi-gen-wrappers': {
					test: /[\\/]node_modules[\\/]@0x[\\/]abi-gen-wrappers/,
					name: '0x-abi-gen-wrappers',
					priority: 100
				},
				lodash: {
					test: /[\\/]node_modules[\\/]lodash/,
					name: 'lodash',
					priority: 100
				},
				bn: {
					test: /[\\/]node_modules[\\/]bn|bignumber/,
					name: 'bn',
					priority: 100
				},
				elliptic: {
					test: /[\\/]node_modules[\\/]elliptic/,
					name: 'elliptic',
					priority: 100
				},
				immutable: {
					test: /[\\/]node_modules[\\/]immutable/,
					name: 'immutable',
					priority: 100
				},
				moment: {
					test: /[\\/]node_modules[\\/]moment/,
					name: 'moment',
					priority: 100
				},
				react: {
					test: /[\\/]node_modules[\\/]react|redux/,
					name: 'react',
					priority: 100
				},
				ant: {
					test: /[\\/]node_modules[\\/]ant/,
					name: 'antd',
					priority: 100
				},
				antIcon: {
					test: /[\\/]node_modules[\\/]@ant/,
					name: 'antIcon',
					priority: 100
				},
				rc: {
					test: /[\\/]node_modules[\\/]rc/,
					name: 'rc',
					priority: 100
				},
				aws: {
					test: /[\\/]node_modules[\\/]aws/,
					name: 'aws',
					priority: 100
				},
				web3: {
					test: /[\\/]node_modules[\\/]web3/,
					name: 'web3',
					priority: 100
				},
				draftjs: {
					test: /[\\/]node_modules[\\/]draft-js/,
					name: 'draft-js',
					priority: 100
				},
				unorm: {
					test: /[\\/]node_modules[\\/]unorm/,
					name: 'unorm',
					priority: 100
				},
				bip39: {
					test: /[\\/]node_modules[\\/]bip39/,
					name: 'bip39',
					priority: 100
				},
				commons: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendors',
					priority: 0
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
				use: [MiniCssExtractPlugin.loader, 'css-loader']
			},
			{
				test: /\.less$/,
				use: [
					MiniCssExtractPlugin.loader,
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
			'bn.js': path.resolve('./node_modules/bn.js'),
			immutable: path.resolve('./node_modules/immutable'),
			elliptic: path.resolve('./node_modules/elliptic')
		},
		modules: [path.join(__dirname, 'src'), 'node_modules'],
		extensions: ['.js', '.jsx', '.ts', '.tsx']
	}
};
