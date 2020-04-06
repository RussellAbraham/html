console.log('localStorage loaded');

function localInit(){
	if(localStorage.getItem('localKey') === null){
		var localKey = [];
		localKey.push({name:'localKey'});
		localStorage.setItem('localKey', JSON.stringify(localKey));
		console.log(localStorage.getItem('localKey'));
	} else {
		var localKey = JSON.parse(localStorage.getItem('localKey'));
		console.log(localKey);
	}
}

(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __slice = [].slice,
    __hasProp = {}.hasOwnProperty,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  window.FileSystem = (function() {
    var simultaneousReplace;

    _Class.prototype.pathSeparator = '/';

    _Class.prototype.escapeCharacter = '\\';

    _Class.prototype._storageName = function() {
      return "" + this._name + "_filesystem";
    };

    _Class.prototype._fileName = function(number) {
      return "" + this._name + "_file_" + number;
    };

    _Class.prototype._getFilesystemObject = function() {
      var fs;
      fs = JSON.parse(localStorage.getItem(this._storageName()));
      if (fs === null) {
        this._setFilesystemObject(fs = {});
      }
      return fs;
    };

    _Class.prototype._setFilesystemObject = function(fs) {
      var e;
      try {
        localStorage.setItem(this._storageName(), JSON.stringify(fs));
        return true;
      } catch (_error) {
        e = _error;
        return false;
      }
    };

    _Class.prototype._readFile = function(farray) {
      var result;
      result = localStorage.getItem(this._fileName(farray[0]));
      if (farray[2]) {
        if (typeof LZString === "undefined" || LZString === null) {
          throw Error('Cannot decompress file; LZString undefined');
        }
        result = LZString.decompress(result);
      }
      return JSON.parse(result);
    };

    _Class.prototype._writeFile = function(farray, content) {
      var data;
      data = JSON.stringify(content);
      if (farray[2]) {
        if (typeof LZString === "undefined" || LZString === null) {
          throw Error('Cannot compress file; LZString undefined');
        }
        data = LZString.compress(data);
      }
      localStorage.setItem(this._fileName(farray[0]), data);
      return farray[1] = data.length;
    };

    _Class.prototype._removeFile = function(farray) {
      return localStorage.removeItem(this._fileName(farray[0]));
    };

    function _Class(name) {
      this.rm = __bind(this.rm, this);
      this.type = __bind(this.type, this);
      this.walkPathAndFile = __bind(this.walkPathAndFile, this);
      this.separateWithFilename = __bind(this.separateWithFilename, this);
      this._name = ("" + name) || 'undefined';
      this._getFilesystemObject();
      this._cwd = FileSystem.prototype.pathSeparator;
      this.compressionDefault = false;
    }

    _Class.prototype.getName = function() {
      return this._name;
    };

    _Class.prototype.getCwd = function() {
      return this._cwd;
    };

    simultaneousReplace = function() {
      var found, i, result, string, swaps, _i, _ref;
      string = arguments[0], swaps = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      result = '';
      while (string.length > 0) {
        found = false;
        for (i = _i = 0, _ref = swaps.length - 1; _i < _ref; i = _i += 2) {
          if (string.slice(0, swaps[i].length) === swaps[i]) {
            result += swaps[i + 1];
            string = string.slice(swaps[i].length);
            found = true;
            break;
          }
        }
        if (!found) {
          result += string[0];
          string = string.slice(1);
        }
      }
      return result;
    };

    _Class.prototype._splitPath = function(pathString) {
      var bit, esc, pos, sep, _i, _len, _ref, _results;
      sep = FileSystem.prototype.pathSeparator;
      esc = FileSystem.prototype.escapeCharacter;
      pos = pathString.indexOf(sep + sep);
      while (pos > -1) {
        pathString = pathString.slice(0, pos) + pathString.slice(pos + sep.length);
        pos = pathString.indexOf(sep + sep);
      }
      if (pathString.slice(0, sep.length) === sep) {
        pathString = pathString.slice(sep.length);
      }
      if (pathString.slice(-sep.length) === sep) {
        pathString = pathString.slice(0, -sep.length);
      }
      _ref = (simultaneousReplace(pathString, esc + sep, sep, esc + esc, esc, sep, '\n')).split('\n');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        bit = _ref[_i];
        if (bit !== '') {
          _results.push(bit);
        }
      }
      return _results;
    };

    _Class.prototype._joinPath = function(pathArray) {
      var esc, p, sep;
      sep = FileSystem.prototype.pathSeparator;
      esc = FileSystem.prototype.escapeCharacter;
      return ((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = pathArray.length; _i < _len; _i++) {
          p = pathArray[_i];
          _results.push(simultaneousReplace(p, sep, esc + sep, esc, esc + esc));
        }
        return _results;
      })()).join(sep);
    };

    _Class.prototype._toAbsolutePath = function(cwdPath, relativePath) {
      var result, sep;
      if (relativePath == null) {
        return cwdPath;
      }
      sep = FileSystem.prototype.pathSeparator;
      if (relativePath.slice(0, sep.length) === sep) {
        return relativePath;
      }
      result = FileSystem.prototype._joinPath((FileSystem.prototype._splitPath(cwdPath)).concat(FileSystem.prototype._splitPath(relativePath)));
      if (result.slice(0, sep.length) !== sep) {
        result = sep + result;
      }
      return result;
    };

    _Class.prototype._toCanonicalPath = function(absolutePath) {
      var result, sep, step, _i, _len, _ref;
      result = [];
      _ref = FileSystem.prototype._splitPath(absolutePath);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        step = _ref[_i];
        if (step === '.') {
          continue;
        }
        if (step === '..') {
          if (result.length > 0) {
            result.pop();
          }
        } else {
          result.push(step);
        }
      }
      result = FileSystem.prototype._joinPath(result);
      sep = FileSystem.prototype.pathSeparator;
      if (result.slice(0, sep.length) !== sep) {
        result = sep + result;
      }
      return result;
    };

    _Class.prototype._isValidCanonicalPath = function(absolutePath) {
      var path, step, walk, _i, _len;
      path = FileSystem.prototype._splitPath(absolutePath);
      walk = this._getFilesystemObject();
      for (_i = 0, _len = path.length; _i < _len; _i++) {
        step = path[_i];
        walk = walk[step];
        if (!walk || walk instanceof Array) {
          return false;
        }
      }
      return true;
    };

    _Class.prototype.separate = function(path) {
      return FileSystem.prototype._splitPath(FileSystem.prototype._toCanonicalPath(FileSystem.prototype._toAbsolutePath(this._cwd, path)));
    };

    _Class.prototype.separateWithFilename = function(path) {
      var fullPath;
      fullPath = this.separate(path);
      return {
        path: fullPath.slice(0, -1),
        name: fullPath[fullPath.length - 1]
      };
    };

    _Class.prototype.walkPath = function(start, pathArray) {
      var step, _i, _len;
      for (_i = 0, _len = pathArray.length; _i < _len; _i++) {
        step = pathArray[_i];
        if (!start.hasOwnProperty(step) || start[step] instanceof Array) {
          return null;
        }
        start = start[step];
      }
      return start;
    };

    _Class.prototype.walkPathAndFile = function(start, pathArray) {
      if (pathArray.length === 0) {
        return start;
      }
      start = this.walkPath(start, pathArray.slice(0, -1));
      if (!start) {
        return null;
      }
      return start[pathArray[pathArray.length - 1]] || null;
    };

    _Class.prototype.type = function(pathToEntry) {
      var entry, fullpath;
      fullpath = this.separate(pathToEntry);
      entry = this.walkPathAndFile(this._getFilesystemObject(), fullpath);
      if (!entry) {
        return null;
      }
      if (entry instanceof Array) {
        return 'file';
      } else {
        return 'folder';
      }
    };

    _Class.prototype.cd = function(path) {
      var newcwd;
      if (path == null) {
        path = FileSystem.prototype.pathSeparator;
      }
      newcwd = FileSystem.prototype._toCanonicalPath(FileSystem.prototype._toAbsolutePath(this._cwd, path));
      if (this._isValidCanonicalPath(newcwd)) {
        return this._cwd = newcwd;
      }
    };

    _Class.prototype.mkdir = function(path) {
      var addedSomething, fs, step, walk, _i, _len, _ref;
      if (path == null) {
        path = '.';
      }
      walk = fs = this._getFilesystemObject();
      addedSomething = false;
      _ref = this.separate(path);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        step = _ref[_i];
        if (!walk.hasOwnProperty(step)) {
          walk[step] = {};
          addedSomething = true;
        }
        walk = walk[step];
      }
      return addedSomething && this._setFilesystemObject(fs);
    };

    _Class.prototype.ls = function(folder, type) {
      var entry, files, folders, fullpath;
      if (folder == null) {
        folder = '.';
      }
      if (type == null) {
        type = 'all';
      }
      fullpath = this.separate(folder);
      folder = this.walkPath(this._getFilesystemObject(), fullpath);
      if (!folder) {
        throw Error('Invalid folder');
      }
      if (type === 'all' || type === 'files') {
        files = (function() {
          var _results;
          _results = [];
          for (entry in folder) {
            if (!__hasProp.call(folder, entry)) continue;
            if (folder[entry] instanceof Array) {
              _results.push(entry);
            }
          }
          return _results;
        })();
        files.sort();
        if (type === 'files') {
          return files;
        }
      }
      folders = (function() {
        var _results;
        _results = [];
        for (entry in folder) {
          if (!__hasProp.call(folder, entry)) continue;
          if (!(folder[entry] instanceof Array)) {
            _results.push(entry);
          }
        }
        return _results;
      })();
      folders.sort();
      if (type === 'all') {
        return folders.concat(files);
      } else {
        return folders;
      }
    };

    _Class.prototype._nextAvailableFileNumber = function() {
      var i, keys, result, used, usedNumbers, _i, _j, _ref, _ref1;
      keys = [];
      for (i = _i = 0, _ref = localStorage.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        keys.push(localStorage.key(i));
      }
      result = [];
      usedNumbers = (function(_this) {
        return function(fs) {
          var key, value;
          if (fs == null) {
            fs = _this._getFilesystemObject();
          }
          for (key in fs) {
            if (!__hasProp.call(fs, key)) continue;
            value = fs[key];
            if (value instanceof Array) {
              result.push(value[0]);
            } else {
              result = result.concat(usedNumbers(value));
            }
          }
          return result;
        };
      })(this);
      used = usedNumbers().sort(function(a, b) {
        return a - b;
      });
      if (used.length === 0) {
        return 0;
      }
      for (i = _j = 0, _ref1 = used[used.length - 1] + 1; 0 <= _ref1 ? _j <= _ref1 : _j >= _ref1; i = 0 <= _ref1 ? ++_j : --_j) {
        if (__indexOf.call(used, i) < 0) {
          return i;
        }
      }
    };

    _Class.prototype.write = function(filename, content, compress) {
      var file, folder, former, fs, name, path, wasCompressed, _ref;
      if (compress == null) {
        compress = this.compressionDefault;
      }
      _ref = this.separateWithFilename(filename), path = _ref.path, name = _ref.name;
      fs = this._getFilesystemObject();
      folder = this.walkPath(fs, path);
      if (!folder) {
        throw Error('Invalid folder path');
      }
      if (folder.hasOwnProperty(name)) {
        if (!(folder[name] instanceof Array)) {
          throw Error('Cannot write to a folder');
        }
        file = folder[name];
        former = this._readFile(file);
      } else {
        file = [this._nextAvailableFileNumber(), 0];
        former = null;
      }
      wasCompressed = file[2];
      file[2] = compress;
      this._writeFile(file, content);
      folder[name] = file;
      if (!this._setFilesystemObject(fs)) {
        file[2] = wasCompressed;
        if (former) {
          this._writeFile(file, former);
        } else {
          this._removeFile(file);
        }
        return false;
      }
      return file[1];
    };

    _Class.prototype.read = function(filename) {
      var file;
      file = this.walkPathAndFile(this._getFilesystemObject(), this.separate(filename));
      if (!file) {
        throw Error('No such file');
      }
      return this._readFile(file);
    };

    _Class.prototype.size = function(filename) {
      var file;
      file = this.walkPathAndFile(this._getFilesystemObject(), this.separate(filename));
      return (file != null ? file[1] : void 0) || -1;
    };

    _Class.prototype.append = function(filename, content, compress) {
      var file, folder, former, fs, name, path, wasCompressed, _ref;
      if (compress == null) {
        compress = this.compressionDefault;
      }
      if (typeof content !== 'string') {
        throw Error('Can only append strings to a file');
      }
      _ref = this.separateWithFilename(filename), path = _ref.path, name = _ref.name;
      fs = this._getFilesystemObject();
      folder = this.walkPath(fs, path);
      if (!folder) {
        throw Error('Invalid folder path');
      }
      if (folder.hasOwnProperty(name)) {
        if (!(folder[name] instanceof Array)) {
          throw Error('Cannot append to a folder');
        }
        file = folder[name];
        former = this._readFile(file);
        if (typeof former !== 'string') {
          throw Error('Cannot append to a file unless it contains a string');
        }
        content = former + content;
      } else {
        file = [this._nextAvailableFileNumber(), 0];
        former = null;
      }
      wasCompressed = file[2];
      file[2] = compress;
      this._writeFile(file, content);
      folder[name] = file;
      if (!this._setFilesystemObject(fs)) {
        file[2] = wasCompressed;
        if (former) {
          this._writeFile(file, former);
        } else {
          this._removeFile(file);
        }
        return false;
      }
      return file[1];
    };

    _Class.prototype.rm = function(path) {
      var file, filesBeneath, folder, fs, name, _i, _len, _ref, _ref1;
      _ref = this.separateWithFilename(path), path = _ref.path, name = _ref.name;
      if (!name) {
        return false;
      }
      fs = this._getFilesystemObject();
      folder = this.walkPath(fs, path);
      if (!folder) {
        return false;
      }
      if (!folder.hasOwnProperty(name)) {
        return false;
      }
      filesBeneath = function(entry) {
        var child, result;
        if (entry instanceof Array) {
          return [entry];
        }
        result = [];
        for (child in entry) {
          if (!__hasProp.call(entry, child)) continue;
          result = result.concat(filesBeneath(entry[child]));
        }
        return result;
      };
      _ref1 = filesBeneath(folder[name]);
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        file = _ref1[_i];
        this._removeFile(file);
      }
      delete folder[name];
      this._setFilesystemObject(fs);
      return true;
    };

    _Class.prototype.cp = function(source, dest) {
      var data, destFolder, destName, e, file, fs, name, newfile, path, sourcePath, _ref;
      fs = this._getFilesystemObject();
      sourcePath = this.separate(source);
      file = this.walkPathAndFile(fs, sourcePath);
      if (!file || !(file instanceof Array)) {
        return false;
      }
      _ref = this.separateWithFilename(dest), path = _ref.path, name = _ref.name;
      destFolder = this.walkPath(fs, path);
      if (!destFolder) {
        return;
      }
      if (!name) {
        destName = sourceName;
      } else if (destFolder.hasOwnProperty(name)) {
        if (destFolder[name] instanceof Array) {
          return;
        }
        destFolder = destFolder[name];
        name = sourcePath[sourcePath.length - 1];
        if (destFolder.hasOwnProperty(name)) {
          return;
        }
      }
      data = this._readFile(file);
      newfile = [this._nextAvailableFileNumber(), 0];
      try {
        this._writeFile(newfile, data);
      } catch (_error) {
        e = _error;
        return false;
      }
      destFolder[name] = newfile;
      if (!this._setFilesystemObject(fs)) {
        this._removeFile(newfile);
        return false;
      }
      return true;
    };

    _Class.prototype.mv = function(source, dest) {
      var destFolder, destName, fs, name, path, sourceFolder, sourceName, _ref, _ref1;
      fs = this._getFilesystemObject();
      _ref = this.separateWithFilename(source), path = _ref.path, name = _ref.name;
      sourceFolder = this.walkPath(fs, path);
      if (!sourceFolder || !sourceFolder.hasOwnProperty(name)) {
        throw Error('No such file or folder');
      }
      sourceName = name;
      _ref1 = this.separateWithFilename(dest), path = _ref1.path, name = _ref1.name;
      destFolder = this.walkPath(fs, path);
      destName = name;
      if (!destFolder) {
        return;
      }
      if (!name) {
        destName = sourceName;
      } else if (destFolder.hasOwnProperty(name)) {
        if (destFolder[destName] instanceof Array) {
          return;
        }
        destFolder = destFolder[destName];
        destName = sourceName;
        if (destFolder.hasOwnProperty(destName)) {
          return;
        }
      }
      destFolder[destName] = sourceFolder[sourceName];
      delete sourceFolder[sourceName];
      return this._setFilesystemObject(fs);
    };

    return _Class;

  })();

}).call(this);
