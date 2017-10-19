const fs = require('fs');
const path = require('path');
const ConcurrentStorage = require('../index');

const storage = new ConcurrentStorage('storage', __dirname);

afterEach((done) => {
  storage.clear((err) => {
    if (err) throw err;
    done();
  });
});

test('creates new file and returns emptyObject', () => {
  const file = path.resolve(__dirname, 'storage.json');
  expect(fs.existsSync(file)).toBe(true);
  expect(storage.getAll()).toEqual(Object.create(null));
});

test('sets key-value pair', done => {
  storage.set('some', 'value', (err) => {
    if (err) throw err;
    expect(storage.get('some')).toEqual('value');
    done();
  });
});

test('calls saveData three times', done => {
  // first call on some: value, second will be timeout call, third will save next:value
  const spy = jest.spyOn(storage, 'saveData');

  storage.set('some', 'value');
  storage.set('next', 'value');

  setTimeout(() => {
    expect(spy).toHaveBeenCalledTimes(3);
    spy.mockReset();
    spy.mockRestore();
    done();
  }, 75);
});

test('deletes key', done => {
  storage.set('first', 'value');
  storage.set('second', 'value');
  storage.set('third', 'value');

  setTimeout(() => {
    storage.delete('second', (err) => {
      if (err) throw err;
      const keys = Object.keys(storage.getAll());
      expect(keys.length).toEqual(2);
      expect(keys).toEqual(['first', 'third']);
      done();
    })
  }, 100);
});