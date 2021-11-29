export const util = {
    parseConfig : function(jsonStr) {
        let config = JSON.parse(jsonStr);
        config = config.sort((a, b) => a.index - b.index);
        return config;
    }
};