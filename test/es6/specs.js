/* global describe:true, it:true */

import 'traceur/bin/traceur-runtime';
import 'mochawait';
import should from 'should';
import path from 'path';
import { getModified } from '../../lib/es5/main';

describe("getModified", () => {
  describe("with a real repo", () => {
    it("should return something", async () => {
      let repo = path.resolve(__dirname, "..", "..");
      let res = await getModified(repo);
      should.exist(res);
      should.ok(res instanceof Array);
    });
  });
});

