import 'traceur/bin/traceur-runtime';
import minimist from 'minimist';
import path from 'path';
import { getModified } from './main';

async function main() {
  let args = minimist(process.argv.slice(2));
  let cwd = process.cwd();
  let repoPath = args._[0] || process.cwd();
  repoPath = path.resolve(cwd, repoPath);
  let prefix = args.pre || args.prefix || args.p;
  let files = await getModified(repoPath, prefix);
  for (let f of files) {
    console.log(f);
  }
}

if (require.main === module) {
  main().then(function() {}, function (err) { throw err; });
}
