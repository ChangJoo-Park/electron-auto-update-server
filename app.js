'use strict';

const fs = require('fs');
const express = require('express');
const path = require('path');
const app = express();

app.use(require('morgan')('dev'));

app.use('/updates/releases', express.static(path.join(__dirname, 'releases')));

app.get('/updates/latest', (req, res) => {
  console.log('[/updates/latest] START')
  const latest = getLatestRelease();
  console.log('[/updates/latest] latest : ', latest);
  const clientVersion = req.query.v;
  console.log('[/updates/latest] clientVersion : ', clientVersion);
  if(clientVersion === latest) { 
    res.status(204).end();
  } else {
    res.json({
      url: `${getBaseUrl()}/releases/darwin/${latest}/MyApp.zip`
    });
  }
});


let getLatestRelease = () => {
  console.log('[#getLatestRelease] START')
  const dir = `${__dirname}/releases/darwin`;
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

app.listen(process.env.PORT, () =>{
  console.log(`Express server listening on port ${process.env.PORT}`);
});