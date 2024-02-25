const {default: axios} = require('axios');
class News {
    static getNewsByPreferences(url , preferences, callback) {
        axios.get(url, {}, {
        }).then((resp) => {
            let news = resp.data.articles;
            callback(null, news);
        }).catch((err) => {
            callback(err, null);
        });
    }
}
module.exports = News;