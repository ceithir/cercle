class Storage {
  constructor(storageKey) {
    this.storageKey = storageKey;
    this.available = this._storageAvailable('localStorage');
  }

  //Ref: https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API#Feature-detecting_localStorage
  _storageAvailable(type) {
    try {
      var storage = window[type], x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    } catch(e) {
      return e instanceof DOMException && (
        // everything except Firefox
        e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === 'QuotaExceededError' ||
        // Firefox
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
        // acknowledge QuotaExceededError only if there's something already stored
        storage.length !== 0
      ;
    }
  }

  _loadWarehouse() {
    if (!this.available) {
      return {};
    }

    return JSON.parse(window.localStorage.getItem(this.storageKey)) || {};
  }

  load(key) {
    return this._loadWarehouse()[key];
  }

  save(key, value) {
    if (!this.available) {
      return;
    }

    try {
      window.localStorage.setItem(
        this.storageKey,
        this._stringify(Object.assign(
          {},
          this._loadWarehouse(),
          {[key]: value},
        ))
      );
    } catch(e) {
      // Prevent any kind of exception on save to break about everything
      console.error(e);
    }
  }

  isAvailable() {
    return this.available;
  }

  // JSON.stringify is supported in all major browsers
  // But the abandoned yet still widely used polyfill asserting this has a bug in Opera Mobile
  _stringify (value) {
    //Ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON#Polyfill
    var toString = Object.prototype.toString;
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var isArray = Array.isArray || function (a) { return toString.call(a) === '[object Array]'; };
    var escMap = {'"': '\\"', '\\': '\\\\', '\b': '\\b', '\f': '\\f', '\n': '\\n', '\r': '\\r', '\t': '\\t'};
    var escFunc = function (m) { return escMap[m] || '\\u' + (m.charCodeAt(0) + 0x10000).toString(16).substr(1); };
    var escRE = /[\\"\u0000-\u001F\u2028\u2029]/g;
    if (value == null) {
      return 'null';
    } else if (typeof value === 'number') {
      return isFinite(value) ? value.toString() : 'null';
    } else if (typeof value === 'boolean') {
      return value.toString();
    } else if (typeof value === 'object') {
      if (typeof value.toJSON === 'function') {
        return this._stringify(value.toJSON());
      } else if (isArray(value)) {
        var res = '[';
        for (var i = 0; i < value.length; i++)
          res += (i ? ', ' : '') + this._stringify(value[i]);
        return res + ']';
      } else if (toString.call(value) === '[object Object]') {
        var tmp = [];
        for (var k in value) {
          // in case "hasOwnProperty" has been shadowed
          if (hasOwnProperty.call(value, k))
            tmp.push(this._stringify(k) + ': ' + this._stringify(value[k]));
        }
        return '{' + tmp.join(', ') + '}';
      }
    }
    return '"' + value.toString().replace(escRE, escFunc) + '"';
  }
}

export default Storage;
