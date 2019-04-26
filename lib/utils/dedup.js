var LRU = require("lru-cache")

class Dedup {
  constructor() {
    this.cache = new LRU({
      max: 100000,
      length: function (n, key) { return 16 },
      maxAge: 5 * 60 * 1000 /* 5 minutes */
    })
  }

  seen(uuid) {
    if (this.cache.peek(uuid)) return true
    this.cache.set(uuid, true)
  }
}

module.exports = Dedup
