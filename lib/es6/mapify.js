import _ from 'lodash';

function mapify (obj) {
  let m = new Map();
  if (typeof obj !== 'object') {
    throw new Error("Mapify must operate on JS objects");
  }
  _.each(obj, function (v, k) {
    if (typeof v === 'object') {
      m.set(k, mapify(v));
    } else {
      m.set(k, v);
    }
  });
  return m;
}

export { mapify };
