var vows = require('vows')
var assert = require('assert')

vows.describe('Connections').addBatch({
    'when no tests available': {
        'of any kind': {
            topic: function() { return '' },
            'we get no problems': function (topic) {
                assert.equal(topic.length, 0)
            }
        }
    }
}).run()
