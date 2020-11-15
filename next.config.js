module.exports = {
    webpack: (config, { webpack }) => {
        config.plugins.push(new webpack.ProvidePlugin({
            THREE: 'three',
        }));
        return config
    },
}