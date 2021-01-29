const webpack = require('webpack');
const Dotenv = require('dotenv');
const fs = require('fs'); // to check if the file exists
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const path = require('path'); // to get the current path

const BUILD_DIR = path.resolve(__dirname, './public/js');
const APP_DIR = path.resolve(__dirname, './resources/jsx');

module.exports = (env) => {

	const currentPath = path.join(__dirname);
	const basePath = currentPath + '/.env';
	const envPath = basePath + '.' + env.ENVIRONMENT;
	const finalPath = fs.existsSync(envPath) ? envPath : basePath;

	const fileEnv = Dotenv.config({ path: finalPath }).parsed;
	const EnvKeys = Object.keys(fileEnv).reduce((prev, next) => {
		prev[`process.env.${next}`] = JSON.stringify(fileEnv[next]);
		return prev;
	}, {});

	let commands=[];

	return {
		mode: fileEnv.APP_ENV==='production'?'production':'development',
		watchOptions: {
			aggregateTimeout: 300,
			//poll: 1000,
			ignored: /(node_modules|vendor)/
		},
		entry: {
			//poly:"@babel/polyfill",
			updater:APP_DIR + '/updater.jsx',
		},
		output: {
			path: BUILD_DIR,
			filename: '[name].js',
			chunkFilename: 'vendor.js'
		},
		resolve:{
			extensions: [".js",".jsx",".json"],
			alias:{
				components: path.resolve('resources/jsx/components/'),
				common: path.resolve('resources/jsx/common/'),
				json: path.resolve('resources/json/'),
				scss: path.resolve('resources/sass/')
			},
			fallback:{
			}
		},
		optimization: {
			splitChunks: {
				cacheGroups: {
					vendor: {
						chunks: 'initial',
						name: 'vendor',
						test: /node_modules/,
						enforce: true
					},
				}
			},
			minimizer: [
				new TerserPlugin({
					terserOptions: {
						output: {
							comments: false
							}
						}
					})
			]
		},
		module : {
		rules : [
				{
					test : /\.jsx/,
					include : APP_DIR,
					exclude : /(node_modules|vendor|bower_components)/,
					loader : 'babel-loader',
					options : {
						"presets" : ["@babel/preset-env", "@babel/preset-react"],
						"plugins" : [
							"@babel/plugin-proposal-class-properties",
							"@babel/plugin-proposal-export-default-from",
						]
					}
				},
				{
					test: /\.s[ac]ss/i,
					use: ['style-loader', 'css-loader', 'sass-loader'],
				},
				{
					test: /\.css$/i,
					use: ['style-loader', 'css-loader'],
				},
				{
					test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
					use: [
						{
							loader: 'file-loader',
							options: {
								name: '[name].[ext]',
								outputPath: '../res/fonts/'
							}
						}
					]
				},
				{
					test: /\.(png|jpe?g|gif)$/i,
					use: [
						{
							loader: 'file-loader',
							options: {
								name: '[name].[ext]',
								outputPath: '../res/images/'
							}
						}
					]
				}
			]
		},
		plugins:[
			new webpack.DefinePlugin(EnvKeys),
			new CleanWebpackPlugin(),
			new HtmlWebpackPlugin({
			  title: process.env.APP_NAME,
			  filename: '../index.html',
			  template: path.resolve('resources/jsx/index.ejs'),
			  publicPath: '/js',
			  cache: false,
			  minify: false
			})
		]
	}
}
