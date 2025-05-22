module.exports = {
    entry: './src/index.tsx',  // Your main JS file
    output: {
        filename: 'bundle.js',  // Output file
        path: path.resolve(__dirname, 'dist'), // Output folder
    },
    mode: 'development', // or 'production',
    module: {
        rules: [
            // ... other rules
            {
                test: /pdf\.worker\.min\.js$/,
                use: 'worker-loader'
            }
        ]
    }
};