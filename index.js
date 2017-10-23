var fs = require('fs');
var path = require('path');

var emptyObject = function emptyObject() {
  return Object.create(null);
};

var loadFile = function loadFile(file) {
  var data;
  try {
    data = JSON.parse(fs.readFileSync(file, 'utf8'));
    return Object.assign(emptyObject(), data);
  } catch (err) {
    if (err.code === 'ENOENT') {
      fs.closeSync(fs.openSync(file, 'w'));
      return emptyObject();
    }

    if (err.name === 'SyntaxError') {
      return emptyObject();
    }

    throw err;
  }
};

function ConcurrentStorage(name, directory) {
  var data;
  this.filename = name ? name + '.json' : 'store.json';
  this.path = directory || __dirname;
  this.file = path.resolve(this.path, this.filename);
  this.saving = false;

  data = loadFile(this.file);
  this.store = Object.assign(emptyObject(), data);
}

ConcurrentStorage.prototype.saveData = function saveData(cb) {
  var that = this;
  var newStore;

  if (!this.saving) {
    this.saving = true;
    newStore = Object.assign(emptyObject(), this.store);
    fs.writeFile(this.file, JSON.stringify(newStore), function handleError(err) {
      if (err && cb) cb(err);
      else if (err) throw err;
      that.saving = false;
      if (cb) cb(null);
    });
  } else {
    setTimeout(function trySaveAgain() {
      that.saveData(cb);
    }, 50);
  }
};

ConcurrentStorage.prototype.get = function get(key) {
  return this.store[key];
};

ConcurrentStorage.prototype.getAll = function getAll() {
  return Object.assign({}, this.store);
};

ConcurrentStorage.prototype.has = function has(key) {
  return Object.prototype.hasOwnProperty.call(this.store, key);
};

ConcurrentStorage.prototype.set = function set(key, value, cb) {
  if (typeof key !== 'string') {
    throw new TypeError('Expected `key` to be of type `string`, got ' + typeof key);
  }

  this.store[key] = value;
  this.saveData(cb);
};

ConcurrentStorage.prototype.delete = function deleteKey(key, cb) {
  delete this.store[key];
  this.saveData(cb);
};

ConcurrentStorage.prototype.clear = function clear(cb) {
  this.store = emptyObject();
  this.saveData(cb);
};

module.exports = ConcurrentStorage;
