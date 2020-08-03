const xiami = require('./xiami/search');
const kuwo = require('./kuwo/search');
const { stringify } = require('querystring');

const searchsingle = (req, res, next) => {
  let { keyword, provider} = req.query;
  if (!(keyword && provider)) {
    return res.json({
      code: "10000",
      message: 'Lack of necessary parameters!'
    });
  }

  if (provider === 'xiami') {
    xiami.searchSingle(keyword)
      .then(data => res.json(data)).catch(err => res.json({
        code: '10000',
        message: err.message
      }));
  } else if (provider === 'kuwo') {
    kuwo.searchSingle(keyword)
      .then(data => res.json(data)).catch(err => res.json({
        code: "10000",
        message: err.message
      }));
  } else {
    res.json({
      code: '10000',
      message: 'Incorrect provider!'
    });
  }
};

module.exports = searchsingle;
