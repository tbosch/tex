module.exports = {
	entry: "./app",
	output: {
		path: __dirname + "/dist",
		filename: "bundle.js"
	},
	resolve: {
		extensions: ['', '.js', '.jsx']
	},
	module: {
		loaders: [
			{
				test: /\.jsx$/,
				loaders: ['jsx-loader', 'babel-loader'],
				exclude: /node_modules/
			}
		]
	}
};