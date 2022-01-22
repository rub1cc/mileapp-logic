// dot object function from: https://github.com/rhalff/dot-object

(function(global, exportName) {
    'use strict'

    function _process(v, mod) {
        var i
        var r

        if (typeof mod === 'function') {
            r = mod(v)
            if (r !== undefined) {
                v = r
            }
        } else if (Array.isArray(mod)) {
            for (i = 0; i < mod.length; i++) {
                r = mod[i](v)
                if (r !== undefined) {
                    v = r
                }
            }
        }

        return v
    }

    function isIndex(k) {
        return /^\d+$/.test(k)
    }

    function isObject(val) {
        return Object.prototype.toString.call(val) === '[object Object]'
    }

    function isArrayOrObject(val) {
        return Object(val) === val
    }

    function isEmptyObject(val) {
        return Object.keys(val).length === 0
    }

    var blacklist = ['__proto__', 'prototype', 'constructor']
    var blacklistFilter = function(part) {
        return blacklist.indexOf(part) === -1
    }

    function parsePath(path, sep) {
        if (path.indexOf('[') >= 0) {
            path = path.replace(/\[/g, sep).replace(/]/g, '')
        }

        var parts = path.split(sep)

        var check = parts.filter(blacklistFilter)

        if (check.length !== parts.length) {
            throw Error('Refusing to update blacklisted property ' + path)
        }

        return parts
    }


    function DotObject(separator, override, useArray, useBrackets) {
        if (!(this instanceof DotObject)) {
            return new DotObject(separator, override, useArray, useBrackets)
        }

        if (typeof override === 'undefined') override = false
        if (typeof useArray === 'undefined') useArray = true
        if (typeof useBrackets === 'undefined') useBrackets = true
        this.separator = separator || '.'
        this.override = override
        this.useArray = useArray
        this.useBrackets = useBrackets
        this.keepArray = false

        // contains touched arrays
        this.cleanup = []
    }

    var dotDefault = new DotObject('.', false, true, true)

    function wrap(method) {
        return function() {
            return dotDefault[method].apply(dotDefault, arguments)
        }
    }

    DotObject.prototype._fill = function(a, obj, v, mod) {
        var k = a.shift()

        if (a.length > 0) {
            obj[k] = obj[k] || (this.useArray && isIndex(a[0]) ? [] : {})

            if (!isArrayOrObject(obj[k])) {
                obj[k] = {}
            }

            this._fill(a, obj[k], v, mod)
        } else {
            if (!this.override && isArrayOrObject(obj[k]) && !isEmptyObject(obj[k])) {
                if (!(isArrayOrObject(v) && isEmptyObject(v))) {
                    throw new Error("Trying to redefine non-empty obj['" + k + "']")
                }

                return
            }

            obj[k] = _process(v, mod)
        }
    }

    DotObject.prototype.object = function(obj, mods) {
        var self = this

        Object.keys(obj).forEach(function(k) {
            var mod = mods === undefined ? null : mods[k]
            // normalize array notation.
            var ok = parsePath(k, self.separator).join(self.separator)

            if (ok.indexOf(self.separator) !== -1) {
                self._fill(ok.split(self.separator), obj, obj[k], mod)
                delete obj[k]
            } else {
                obj[k] = _process(obj[k], mod)
            }
        })

        return obj
    }

    DotObject.prototype.dot = function(obj, tgt, path) {
        tgt = tgt || {}
        path = path || []
        var isArray = Array.isArray(obj)

        Object.keys(obj).forEach(
            function(key) {
                var index = isArray && this.useBrackets ? '[' + key + ']' : key
                if (
                    isArrayOrObject(obj[key]) &&
                    ((isObject(obj[key]) && !isEmptyObject(obj[key])) ||
                        (Array.isArray(obj[key]) && !this.keepArray && obj[key].length !== 0))
                ) {
                    if (isArray && this.useBrackets) {
                        var previousKey = path[path.length - 1] || ''
                        return this.dot(
                            obj[key],
                            tgt,
                            path.slice(0, -1).concat(previousKey + index)
                        )
                    } else {
                        return this.dot(obj[key], tgt, path.concat(index))
                    }
                } else {
                    if (isArray && this.useBrackets) {
                        tgt[path.join(this.separator).concat('[' + key + ']')] = obj[key]
                    } else {
                        tgt[path.concat(index).join(this.separator)] = obj[key]
                    }
                }
            }.bind(this)
        )
        return tgt
    }

    DotObject.object = wrap('object')
    DotObject.dot = wrap('dot');
    ['override', 'overwrite'].forEach(function(prop) {
        Object.defineProperty(DotObject, prop, {
            get: function() {
                return dotDefault.override
            },
            set: function(val) {
                dotDefault.override = !!val
            }
        })
    });
    ['useArray', 'keepArray', 'useBrackets'].forEach(function(prop) {
        Object.defineProperty(DotObject, prop, {
            get: function() {
                return dotDefault[prop]
            },
            set: function(val) {
                dotDefault[prop] = val
            }
        })
    })

    DotObject._process = _process


    if (typeof define === 'function' && define.amd) {
        define(function() {
            return DotObject
        })
    } else if (typeof module != 'undefined' && module.exports) {
        module.exports = DotObject
    } else {
        global[exportName] = DotObject
    }

})(this, 'DotObject')