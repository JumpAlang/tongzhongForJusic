const fetch = require('node-fetch');
const querystring = require('querystring');
const targetUrl = 'http://www.kuwo.cn/api/www/search/searchMusicBykeyWord';
const kuwoSite = 'http://www.kuwo.cn';
const getSongSource = require('./song_source');
const { ResolvePlugin } = require('webpack');

const search = (keyword, limit, page) => {
  const stringified = querystring.stringify({
    key: keyword,
    rn: limit,
    pn: page,
  });
  return new Promise((resolve, reject) => {
    fetch(`${targetUrl}?${stringified}`, {
      headers: {
        cookie: '_ga=GA1.2.1675613707.1589085909; _gid=GA1.2.1099796595.1589085909; Hm_lvt_cdb524f42f0ce19b169a8071123a4797=1589085909,1589087176; Hm_lpvt_cdb524f42f0ce19b169a8071123a4797=1589089377; kw_token=GJZXJFO04YH; _gat=1',
        csrf: 'GJZXJFO04YH',
        referer: 'http://www.kuwo.cn',
      },
    })
      .then(res => res.json())
      .then(json => {
        // console.log('json: ', json);
        if (json.code === 200) {
          const songs = json.data.list.map((song, i) => ({
            originalId: song.rid,
            name: song.name,
            link: `${kuwoSite}/play_detail/${song.rid}`,
            artists: [{
              name: song.artist,
              link: `${kuwoSite}/singer_detail/${song.artistid}`
            }],
            album: {
              name: song.album,
              link: `${kuwoSite}/album_detail/${song.albumid}`
            },
            hasCopyright: true,
            platform: 'kuwo',
          }));
          resolve({
            songs,
            totalCount: parseInt(json.data.total),
          });
        } else {
          reject({ message: 'err' });
        }
      })
      .catch(err => reject(err));
  });
};

const searchSingle = (keyword) => {
  const stringified = querystring.stringify({
    key: keyword,
    rn: 1,
    pn: 1,
  });
  return new Promise((resolve, reject) => {
    fetch(`${targetUrl}?${stringified}`, {
      headers: {
        cookie: '_ga=GA1.2.1675613707.1589085909; _gid=GA1.2.1099796595.1589085909; Hm_lvt_cdb524f42f0ce19b169a8071123a4797=1589085909,1589087176; Hm_lpvt_cdb524f42f0ce19b169a8071123a4797=1589089377; kw_token=GJZXJFO04YH; _gat=1',
        csrf: 'GJZXJFO04YH',
        referer: 'http://www.kuwo.cn',
      },
    })
      .then(res => res.json())
      .then(json => {
        // console.log('json: ', json);
        if (json.code === 200) {
        
          if(json.data.list != null && json.data.list.length > 0){
              let songId = json.data.list[0].rid;
              let rs = single(songId);
              return resolve(rs);
          }else{
            return resolve({code:'10001',message:"无此歌"});
          }

        } else {
          reject({code:'10000' ,message: 'err' });
        }
      })
      .catch(err => reject({code:'10000',"err":err}));
  });
};

const single = function(songId){
   return new Promise((resolve, reject) => {
      fetch(`http://www.kuwo.cn/url?format=mp3&rid=${songId}&response=url&type=convert_url3&br=128kmp3&from=web`, {
      headers: {
        cookie: '_ga=GA1.2.1675613707.1589085909; _gid=GA1.2.1099796595.1589085909; Hm_lvt_cdb524f42f0ce19b169a8071123a4797=1589085909,1589087176; Hm_lpvt_cdb524f42f0ce19b169a8071123a4797=1589089377; kw_token=GJZXJFO04YH; _gat=1',
        csrf: 'GJZXJFO04YH',
        referer: 'http://www.kuwo.cn',
      },
    })
      .then(res => res.json())
      .then(json => {
        if (json.code === 200) {
          resolve(
            {code:"20000",data:json.url}
          );
        } else {
          reject({code:'10000',"message":"没找到"});
        }
      })
      .catch(err => reject({code:'10000',"err":err}));
  });
}
// search('我欲成仙', 4, 1)
//   .then(songs => console.log(songs))
//   .catch(err => console.error(err));

module.exports = {
  search,
  searchSingle
};