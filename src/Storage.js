class Storage {
  constructor(storageKey) {
    this.storageKey = storageKey;
  }

  _loadWarehouse() {
    return JSON.parse(window.localStorage.getItem(this.storageKey)) || {};
  }

  load(key) {
    return this._loadWarehouse()[key];
  }

  save(key, value) {
    try {
      window.localStorage.setItem(
        this.storageKey,
        JSON.stringify(Object.assign(
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
}

export default Storage;
