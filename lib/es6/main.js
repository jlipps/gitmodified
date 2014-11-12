import path from 'path';
import git from 'gift';
import { mapify } from 'es6-mapify';
import Q from 'q';
import _ from 'lodash';
import fs from 'fs';
import rrd from 'recursive-readdir';
import os from 'os';

const modStatuses = ['A', 'M', 'AM', 'MM'];

async function getModified (repoPath, prefix = null, ext = null) {
  let repo = git(repoPath);
  let res = await Q.ninvoke(repo, 'status');
  let files = [];
  let ignores = getIgnoreRegExps(repoPath);
  for (let [fileName, fileData] of mapify(res.files)) {
    let shouldAdd = false;
    shouldAdd = shouldAdd || _(modStatuses).contains(fileData.get('type'));
    shouldAdd = shouldAdd || !fileData.get('tracked')
    if (shouldAdd) {
      if (/\/$/.test(fileName)) {
        let subdir = path.resolve(repoPath, fileName);
        let subfiles = await Q.nfcall(rrd, subdir);
        subfiles = _.map(subfiles, f => f.replace(subdir + '/', ''));
        subfiles = _.filter(subfiles, f => {
          return _.max(_.map(ignores, i => {
            return i.test(f) ? 1 : 0
          })) === 0
        });
        files = files.concat(subfiles);
      } else {
        files.push(fileName);
      }
    }
  }
  if (prefix) {
    files = _.filter(files, f => f.indexOf(prefix) === 0);
    files = _.map(files, f => f.substr(prefix.length, f.length - 1));
  }
  if (ext) {
    files = _.filter(files, f => f.substr(f.length - ext.length, f.length) === ext);
  }
  return files;
}

async function getIgnores (repoPath) {
  let ignores = [];
  try {
    let data = await Q.nfcall(fs.readFile, path.resolve(repoPath, '.gitignore'));
  } catch (e) {
    return ignores;
  }
  ignores = data.toString('utf8').split(os.EOL);
  return ignores;
}

async function getSystemIgnores () {
  return await getIgnores("/Users/" + process.env.USER + "/");
}

async function getIgnoreRegExps (repoPath) {
  let ignores = await getIgnores(repoPath)
  ignores = ignores.concat(await getSystemIgnores());
  ignores = _.filter(ignores, i => i.trim() !== "");
  ignores = _.map(ignores, i => globToRe(i));
  return ignores;
}

function globToRe (g) {
  g = g.replace(".", "\\.");
  g = g.replace(/([^(\\.)])?\*/, ".*");
  return new RegExp(g);
}

export { getModified };
