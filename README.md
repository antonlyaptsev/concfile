# concfile

Very simple key-value file storage with concurrent data change

## Installation

```sh
$ npm install concfile --save
```

## Initialization

```javascript
var ConcurrentStorage = require("concfile");

var storage = ConcurrentStorage('storage', __dirname);
```

This will create storage.json in current directory

## API

### ConcurrentStorage(filename, path)

Returns a new instance.

`filename` - name of the file (without extension).

`path` - directory, where file will be stored.

#### .get(key)

Get an item.

#### .getAll()

Get storage object.

#### .getAll()

Check existence if an item.

#### .set(key, value [, callback])

Set an item.

The `key` must be string.

The `value` must be JSON serializable.

The callback will receive the only argument (err).

#### .delete(key [, callback])

Delete an item.

The callback will receive the only argument (err).

#### .clear([callback])

Deletes all keys.

The callback will receive the only argument (err).