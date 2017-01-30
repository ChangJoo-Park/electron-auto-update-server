'use strict';

const fs = require('fs');
const express = require('express');
const path = require('path');
const app = express();

app.use(require('morgan')('dev'));

app.use('/updates/releases/', express.static(path.join(__dirname, 'releases')));

app.get('/updates/latest', (req, res) => {
  console.log('[/updates/latest] START')
  const clientVersion = req.query.v;
  const clientPlatform = req.query.p;
  const latest = getLatestRelease(clientPlatform);
  console.log('[/updates/latest] latest : ', latest);
  console.log('[/updates/latest] clientVersion : ', clientVersion);
  console.log('[/updates/latest] clientVersion : ', clientVersion);
  console.log('[/updates/latest] clientPlatform : ', clientPlatform);
  
  // 현재 클라이언트 버전과 최신버전이 동일하면 종료
  // 다르면 최신 버전 URL을 전달
  if(clientVersion === latest) { 
    res.status(204).end();
  } else {
    res.json({
      url: `${getBaseUrl()}/releases/${clientPlatform}/${latest}/MyApp.zip`
    });
  }
});


let getLatestRelease = (platform) => {
  console.log('[#getLatestRelease] START')
  const dir = `${__dirname}/releases/${platform}`;
  console.log('[#getLatestRelease] dir : ', dir)
  const versionsDesc = fs.readdirSync(dir).filter((file) => {
    const filePath = path.join(dir, file);
    return fs.statSync(filePath).isDirectory();
  }).reverse();

  return versionsDesc[0];
};

let getBaseUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  } else {
    return 'http://download.appname.com' // TODO: Change This to actual URL
  }
};

// APP 기본 URL
app.get('/', function (req, res) {
  res.sendfile(path.join(__dirname  + '/index.html'))
});

app.listen(process.env.PORT, () =>{
  console.log(`Express server listening on port ${process.env.PORT}`);
});