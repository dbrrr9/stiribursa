import require$$0$1 from "node:fs";
import require$$0 from "fs";
import require$$1$1 from "node:fs/promises";
import require$$1 from "node:os";
import require$$0$2 from "events";
import require$$0$3 from "os";
import require$$1$5 from "path";
import require$$1$4 from "url";
import require$$1$6 from "node:tty";
import require$$3 from "tty";
import require$$0$4 from "process";
import require$$0$5 from "fs/promises";
import require$$0$6 from "net";
import require$$0$7 from "tls";
import require$$0$8 from "dns";
import require$$0$9 from "child_process";
import require$$1$3 from "node:stream";
import require$$1$2 from "util";
import { r as requireLib } from "../which.mjs";
import { r as requireDist$1 } from "../deno__shim-deno-test.mjs";
var dist = {};
var deno = {};
var main = {};
var classes = {};
var FsFile = {};
var fstat = {};
var stat = {};
var errorMap = {};
var errors = {};
var hasRequiredErrors;
function requireErrors() {
  if (hasRequiredErrors) return errors;
  hasRequiredErrors = 1;
  Object.defineProperty(errors, "__esModule", { value: true });
  errors.WriteZero = errors.UnexpectedEof = errors.TimedOut = errors.PermissionDenied = errors.NotFound = errors.NotConnected = errors.InvalidData = errors.Interrupted = errors.Http = errors.ConnectionReset = errors.ConnectionRefused = errors.ConnectionAborted = errors.Busy = errors.BrokenPipe = errors.BadResource = errors.AlreadyExists = errors.AddrNotAvailable = errors.AddrInUse = void 0;
  class AddrInUse extends Error {
  }
  errors.AddrInUse = AddrInUse;
  class AddrNotAvailable extends Error {
  }
  errors.AddrNotAvailable = AddrNotAvailable;
  class AlreadyExists extends Error {
  }
  errors.AlreadyExists = AlreadyExists;
  class BadResource extends Error {
  }
  errors.BadResource = BadResource;
  class BrokenPipe extends Error {
  }
  errors.BrokenPipe = BrokenPipe;
  class Busy extends Error {
  }
  errors.Busy = Busy;
  class ConnectionAborted extends Error {
  }
  errors.ConnectionAborted = ConnectionAborted;
  class ConnectionRefused extends Error {
  }
  errors.ConnectionRefused = ConnectionRefused;
  class ConnectionReset extends Error {
  }
  errors.ConnectionReset = ConnectionReset;
  class Http extends Error {
  }
  errors.Http = Http;
  class Interrupted extends Error {
  }
  errors.Interrupted = Interrupted;
  class InvalidData extends Error {
  }
  errors.InvalidData = InvalidData;
  class NotConnected extends Error {
  }
  errors.NotConnected = NotConnected;
  class NotFound extends Error {
    constructor() {
      super(...arguments);
      this.code = "ENOENT";
    }
  }
  errors.NotFound = NotFound;
  class PermissionDenied extends Error {
  }
  errors.PermissionDenied = PermissionDenied;
  class TimedOut extends Error {
  }
  errors.TimedOut = TimedOut;
  class UnexpectedEof extends Error {
  }
  errors.UnexpectedEof = UnexpectedEof;
  class WriteZero extends Error {
  }
  errors.WriteZero = WriteZero;
  return errors;
}
var hasRequiredErrorMap;
function requireErrorMap() {
  if (hasRequiredErrorMap) return errorMap;
  hasRequiredErrorMap = 1;
  var __createBinding = errorMap && errorMap.__createBinding || (Object.create ? (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  }) : (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    o[k2] = m[k];
  }));
  var __setModuleDefault = errorMap && errorMap.__setModuleDefault || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  }) : function(o, v) {
    o["default"] = v;
  });
  var __importStar = errorMap && errorMap.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  Object.defineProperty(errorMap, "__esModule", { value: true });
  const errors2 = __importStar(requireErrors());
  const mapper = (Ctor) => (err) => Object.assign(new Ctor(err.message), {
    stack: err.stack
  });
  const map = {
    EEXIST: mapper(errors2.AlreadyExists),
    ENOENT: mapper(errors2.NotFound),
    EBADF: mapper(errors2.BadResource)
  };
  const isNodeErr = (e) => {
    return e instanceof Error && "code" in e;
  };
  function mapError(e) {
    var _a;
    if (!isNodeErr(e))
      return e;
    return ((_a = map[e.code]) === null || _a === void 0 ? void 0 : _a.call(map, e)) || e;
  }
  errorMap.default = mapError;
  return errorMap;
}
var hasRequiredStat;
function requireStat() {
  if (hasRequiredStat) return stat;
  hasRequiredStat = 1;
  var __createBinding = stat && stat.__createBinding || (Object.create ? (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  }) : (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    o[k2] = m[k];
  }));
  var __setModuleDefault = stat && stat.__setModuleDefault || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  }) : function(o, v) {
    o["default"] = v;
  });
  var __importStar = stat && stat.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  var __importDefault = stat && stat.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(stat, "__esModule", { value: true });
  stat.stat = stat.denoifyFileInfo = void 0;
  const promises_1 = require$$1$1;
  const os = __importStar(require$$1);
  const errorMap_js_1 = __importDefault(requireErrorMap());
  const isWindows = os.platform() === "win32";
  function denoifyFileInfo(s) {
    return {
      atime: s.atime,
      birthtime: s.birthtime,
      blksize: isWindows ? null : s.blksize,
      blocks: isWindows ? null : s.blocks,
      dev: s.dev,
      gid: isWindows ? null : s.gid,
      ino: isWindows ? null : s.ino,
      isDirectory: s.isDirectory(),
      isFile: s.isFile(),
      isSymlink: s.isSymbolicLink(),
      isBlockDevice: isWindows ? null : s.isBlockDevice(),
      isCharDevice: isWindows ? null : s.isCharacterDevice(),
      isFifo: isWindows ? null : s.isFIFO(),
      isSocket: isWindows ? null : s.isSocket(),
      mode: isWindows ? null : s.mode,
      mtime: s.mtime,
      nlink: isWindows ? null : s.nlink,
      rdev: isWindows ? null : s.rdev,
      size: s.size,
      uid: isWindows ? null : s.uid
    };
  }
  stat.denoifyFileInfo = denoifyFileInfo;
  const stat$1 = async (path) => {
    try {
      return denoifyFileInfo(await (0, promises_1.stat)(path));
    } catch (e) {
      throw (0, errorMap_js_1.default)(e);
    }
  };
  stat.stat = stat$1;
  return stat;
}
var hasRequiredFstat;
function requireFstat() {
  if (hasRequiredFstat) return fstat;
  hasRequiredFstat = 1;
  var __createBinding = fstat && fstat.__createBinding || (Object.create ? (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  }) : (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    o[k2] = m[k];
  }));
  var __setModuleDefault = fstat && fstat.__setModuleDefault || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  }) : function(o, v) {
    o["default"] = v;
  });
  var __importStar = fstat && fstat.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  var __importDefault = fstat && fstat.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(fstat, "__esModule", { value: true });
  fstat.fstat = void 0;
  const fs = __importStar(require$$0);
  const util_1 = require$$1$2;
  const stat_js_1 = requireStat();
  const errorMap_js_1 = __importDefault(requireErrorMap());
  const nodeFstat = (0, util_1.promisify)(fs.fstat);
  const fstat$1 = async function(fd) {
    try {
      return (0, stat_js_1.denoifyFileInfo)(await nodeFstat(fd));
    } catch (err) {
      throw (0, errorMap_js_1.default)(err);
    }
  };
  fstat.fstat = fstat$1;
  return fstat;
}
var fstatSync = {};
var hasRequiredFstatSync;
function requireFstatSync() {
  if (hasRequiredFstatSync) return fstatSync;
  hasRequiredFstatSync = 1;
  var __importDefault = fstatSync && fstatSync.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(fstatSync, "__esModule", { value: true });
  fstatSync.fstatSync = void 0;
  const fs_1 = require$$0;
  const stat_js_1 = requireStat();
  const errorMap_js_1 = __importDefault(requireErrorMap());
  const fstatSync$1 = function fstatSync2(fd) {
    try {
      return (0, stat_js_1.denoifyFileInfo)((0, fs_1.fstatSync)(fd));
    } catch (err) {
      throw (0, errorMap_js_1.default)(err);
    }
  };
  fstatSync.fstatSync = fstatSync$1;
  return fstatSync;
}
var ftruncate = {};
var hasRequiredFtruncate;
function requireFtruncate() {
  if (hasRequiredFtruncate) return ftruncate;
  hasRequiredFtruncate = 1;
  Object.defineProperty(ftruncate, "__esModule", { value: true });
  ftruncate.ftruncate = void 0;
  const fs_1 = require$$0;
  const util_1 = require$$1$2;
  const _ftruncate = (0, util_1.promisify)(fs_1.ftruncate);
  ftruncate.ftruncate = _ftruncate;
  return ftruncate;
}
var ftruncateSync = {};
var hasRequiredFtruncateSync;
function requireFtruncateSync() {
  if (hasRequiredFtruncateSync) return ftruncateSync;
  hasRequiredFtruncateSync = 1;
  Object.defineProperty(ftruncateSync, "__esModule", { value: true });
  ftruncateSync.ftruncateSync = void 0;
  const fs_1 = require$$0;
  ftruncateSync.ftruncateSync = fs_1.ftruncateSync;
  return ftruncateSync;
}
var fdatasync = {};
var hasRequiredFdatasync;
function requireFdatasync() {
  if (hasRequiredFdatasync) return fdatasync;
  hasRequiredFdatasync = 1;
  Object.defineProperty(fdatasync, "__esModule", { value: true });
  fdatasync.fdatasync = void 0;
  const fs_1 = require$$0;
  const util_1 = require$$1$2;
  const _fdatasync = (0, util_1.promisify)(fs_1.fdatasync);
  fdatasync.fdatasync = _fdatasync;
  return fdatasync;
}
var fdatasyncSync = {};
var hasRequiredFdatasyncSync;
function requireFdatasyncSync() {
  if (hasRequiredFdatasyncSync) return fdatasyncSync;
  hasRequiredFdatasyncSync = 1;
  Object.defineProperty(fdatasyncSync, "__esModule", { value: true });
  fdatasyncSync.fdatasyncSync = void 0;
  const fs_1 = require$$0;
  fdatasyncSync.fdatasyncSync = fs_1.fdatasyncSync;
  return fdatasyncSync;
}
var read = {};
var hasRequiredRead;
function requireRead() {
  if (hasRequiredRead) return read;
  hasRequiredRead = 1;
  Object.defineProperty(read, "__esModule", { value: true });
  read.read = void 0;
  const util_1 = require$$1$2;
  const fs_1 = require$$0;
  const _read = (0, util_1.promisify)(fs_1.read);
  const read$1 = async function read2(rid, buffer) {
    if (buffer == null) {
      throw new TypeError("Buffer must not be null.");
    }
    if (buffer.length === 0) {
      return 0;
    }
    const { bytesRead } = await _read(rid, buffer, 0, buffer.length, null);
    return bytesRead === 0 ? null : bytesRead;
  };
  read.read = read$1;
  return read;
}
var readSync = {};
var hasRequiredReadSync;
function requireReadSync() {
  if (hasRequiredReadSync) return readSync;
  hasRequiredReadSync = 1;
  var __createBinding = readSync && readSync.__createBinding || (Object.create ? (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  }) : (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    o[k2] = m[k];
  }));
  var __setModuleDefault = readSync && readSync.__setModuleDefault || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  }) : function(o, v) {
    o["default"] = v;
  });
  var __importStar = readSync && readSync.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  Object.defineProperty(readSync, "__esModule", { value: true });
  readSync.readSync = void 0;
  const fs = __importStar(require$$0);
  const readSync$1 = (fd, buffer) => {
    const bytesRead = fs.readSync(fd, buffer);
    return bytesRead === 0 ? null : bytesRead;
  };
  readSync.readSync = readSync$1;
  return readSync;
}
var write = {};
var hasRequiredWrite;
function requireWrite() {
  if (hasRequiredWrite) return write;
  hasRequiredWrite = 1;
  var __createBinding = write && write.__createBinding || (Object.create ? (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  }) : (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    o[k2] = m[k];
  }));
  var __setModuleDefault = write && write.__setModuleDefault || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  }) : function(o, v) {
    o["default"] = v;
  });
  var __importStar = write && write.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  Object.defineProperty(write, "__esModule", { value: true });
  write.write = void 0;
  const fs = __importStar(require$$0);
  const util_1 = require$$1$2;
  const nodeWrite = (0, util_1.promisify)(fs.write);
  const write$1 = async (fd, data) => {
    const { bytesWritten } = await nodeWrite(fd, data);
    return bytesWritten;
  };
  write.write = write$1;
  return write;
}
var writeSync = {};
var hasRequiredWriteSync;
function requireWriteSync() {
  if (hasRequiredWriteSync) return writeSync;
  hasRequiredWriteSync = 1;
  var __createBinding = writeSync && writeSync.__createBinding || (Object.create ? (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  }) : (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    o[k2] = m[k];
  }));
  var __setModuleDefault = writeSync && writeSync.__setModuleDefault || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  }) : function(o, v) {
    o["default"] = v;
  });
  var __importStar = writeSync && writeSync.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  Object.defineProperty(writeSync, "__esModule", { value: true });
  writeSync.writeSync = void 0;
  const fs = __importStar(require$$0);
  writeSync.writeSync = fs.writeSync;
  return writeSync;
}
var hasRequiredFsFile;
function requireFsFile() {
  if (hasRequiredFsFile) return FsFile;
  hasRequiredFsFile = 1;
  var __createBinding = FsFile && FsFile.__createBinding || (Object.create ? (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  }) : (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    o[k2] = m[k];
  }));
  var __setModuleDefault = FsFile && FsFile.__setModuleDefault || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  }) : function(o, v) {
    o["default"] = v;
  });
  var __importStar = FsFile && FsFile.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  var __classPrivateFieldGet = FsFile && FsFile.__classPrivateFieldGet || function(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
  };
  var __classPrivateFieldSet = FsFile && FsFile.__classPrivateFieldSet || function(receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
  };
  var _a, _b;
  var _c, _d;
  var _FsFile_closed, _FsFile_readableStream, _FsFile_writableStream;
  Object.defineProperty(FsFile, "__esModule", { value: true });
  FsFile.File = FsFile.FsFile = void 0;
  const fs = __importStar(require$$0$1);
  const stream = __importStar(require$$1$3);
  const fstat_js_1 = requireFstat();
  const fstatSync_js_1 = requireFstatSync();
  const ftruncate_js_1 = requireFtruncate();
  const ftruncateSync_js_1 = requireFtruncateSync();
  const fdatasync_js_1 = requireFdatasync();
  const fdatasyncSync_js_1 = requireFdatasyncSync();
  const read_js_1 = requireRead();
  const readSync_js_1 = requireReadSync();
  const write_js_1 = requireWrite();
  const writeSync_js_1 = requireWriteSync();
  (_a = (_c = Symbol).dispose) !== null && _a !== void 0 ? _a : _c.dispose = /* @__PURE__ */ Symbol("Symbol.dispose");
  (_b = (_d = Symbol).asyncDispose) !== null && _b !== void 0 ? _b : _d.asyncDispose = /* @__PURE__ */ Symbol("Symbol.asyncDispose");
  let FsFile$1 = class FsFile {
    constructor(rid) {
      this.rid = rid;
      _FsFile_closed.set(this, false);
      _FsFile_readableStream.set(this, void 0);
      _FsFile_writableStream.set(this, void 0);
    }
    [(_FsFile_closed = /* @__PURE__ */ new WeakMap(), _FsFile_readableStream = /* @__PURE__ */ new WeakMap(), _FsFile_writableStream = /* @__PURE__ */ new WeakMap(), Symbol.dispose)]() {
      if (!__classPrivateFieldGet(this, _FsFile_closed, "f")) {
        this.close();
      }
    }
    async write(p) {
      return await (0, write_js_1.write)(this.rid, p);
    }
    writeSync(p) {
      return (0, writeSync_js_1.writeSync)(this.rid, p);
    }
    async truncate(len) {
      await (0, ftruncate_js_1.ftruncate)(this.rid, len);
    }
    truncateSync(len) {
      return (0, ftruncateSync_js_1.ftruncateSync)(this.rid, len);
    }
    read(p) {
      return (0, read_js_1.read)(this.rid, p);
    }
    readSync(p) {
      return (0, readSync_js_1.readSync)(this.rid, p);
    }
    seek(_offset, _whence) {
      throw new Error("Method not implemented.");
    }
    seekSync(_offset, _whence) {
      throw new Error("Method not implemented.");
    }
    async stat() {
      return await (0, fstat_js_1.fstat)(this.rid);
    }
    statSync() {
      return (0, fstatSync_js_1.fstatSync)(this.rid);
    }
    sync() {
      throw new Error("Method not implemented.");
    }
    syncSync() {
      throw new Error("Method not implemented.");
    }
    syncData() {
      return (0, fdatasync_js_1.fdatasync)(this.rid);
    }
    syncDataSync() {
      return (0, fdatasyncSync_js_1.fdatasyncSync)(this.rid);
    }
    utime(_atime, _mtime) {
      throw new Error("Method not implemented.");
    }
    utimeSync(_atime, _mtime) {
      throw new Error("Method not implemented.");
    }
    close() {
      __classPrivateFieldSet(this, _FsFile_closed, true, "f");
      fs.closeSync(this.rid);
    }
    get readable() {
      if (__classPrivateFieldGet(this, _FsFile_readableStream, "f") == null) {
        const nodeStream = fs.createReadStream(null, {
          fd: this.rid,
          autoClose: false
        });
        __classPrivateFieldSet(this, _FsFile_readableStream, stream.Readable.toWeb(nodeStream), "f");
      }
      return __classPrivateFieldGet(this, _FsFile_readableStream, "f");
    }
    get writable() {
      if (__classPrivateFieldGet(this, _FsFile_writableStream, "f") == null) {
        const nodeStream = fs.createWriteStream(null, {
          fd: this.rid,
          autoClose: false
        });
        __classPrivateFieldSet(this, _FsFile_writableStream, stream.Writable.toWeb(nodeStream), "f");
      }
      return __classPrivateFieldGet(this, _FsFile_writableStream, "f");
    }
  };
  FsFile.FsFile = FsFile$1;
  const File = FsFile$1;
  FsFile.File = File;
  return FsFile;
}
var Permissions = {};
var PermissionStatus = {};
var hasRequiredPermissionStatus;
function requirePermissionStatus() {
  if (hasRequiredPermissionStatus) return PermissionStatus;
  hasRequiredPermissionStatus = 1;
  var _a, _b;
  var _c;
  Object.defineProperty(PermissionStatus, "__esModule", { value: true });
  PermissionStatus.PermissionStatus = void 0;
  (_a = (_c = globalThis).EventTarget) !== null && _a !== void 0 ? _a : _c.EventTarget = (_b = require$$0$2.EventTarget) !== null && _b !== void 0 ? _b : null;
  let PermissionStatus$1 = class PermissionStatus extends EventTarget {
    /** @internal */
    constructor(state) {
      super();
      this.state = state;
      this.onchange = null;
      this.partial = false;
    }
  };
  PermissionStatus.PermissionStatus = PermissionStatus$1;
  return PermissionStatus;
}
var hasRequiredPermissions$1;
function requirePermissions$1() {
  if (hasRequiredPermissions$1) return Permissions;
  hasRequiredPermissions$1 = 1;
  Object.defineProperty(Permissions, "__esModule", { value: true });
  Permissions.Permissions = void 0;
  const PermissionStatus_js_1 = requirePermissionStatus();
  let Permissions$1 = class Permissions {
    query(desc) {
      return Promise.resolve(this.querySync(desc));
    }
    querySync(_desc) {
      return new PermissionStatus_js_1.PermissionStatus("granted");
    }
    revoke(desc) {
      return Promise.resolve(this.revokeSync(desc));
    }
    revokeSync(_desc) {
      return new PermissionStatus_js_1.PermissionStatus("denied");
    }
    request(desc) {
      return this.query(desc);
    }
    requestSync(desc) {
      return this.querySync(desc);
    }
  };
  Permissions.Permissions = Permissions$1;
  return Permissions;
}
var hasRequiredClasses;
function requireClasses() {
  if (hasRequiredClasses) return classes;
  hasRequiredClasses = 1;
  (function(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PermissionStatus = exports.Permissions = exports.FsFile = exports.File = void 0;
    var FsFile_js_1 = requireFsFile();
    Object.defineProperty(exports, "File", { enumerable: true, get: function() {
      return FsFile_js_1.File;
    } });
    Object.defineProperty(exports, "FsFile", { enumerable: true, get: function() {
      return FsFile_js_1.FsFile;
    } });
    var Permissions_js_1 = requirePermissions$1();
    Object.defineProperty(exports, "Permissions", { enumerable: true, get: function() {
      return Permissions_js_1.Permissions;
    } });
    var PermissionStatus_js_1 = requirePermissionStatus();
    Object.defineProperty(exports, "PermissionStatus", { enumerable: true, get: function() {
      return PermissionStatus_js_1.PermissionStatus;
    } });
  })(classes);
  return classes;
}
var enums = {};
var SeekMode = {};
var hasRequiredSeekMode;
function requireSeekMode() {
  if (hasRequiredSeekMode) return SeekMode;
  hasRequiredSeekMode = 1;
  Object.defineProperty(SeekMode, "__esModule", { value: true });
  SeekMode.SeekMode = void 0;
  var SeekMode$1;
  (function(SeekMode2) {
    SeekMode2[SeekMode2["Start"] = 0] = "Start";
    SeekMode2[SeekMode2["Current"] = 1] = "Current";
    SeekMode2[SeekMode2["End"] = 2] = "End";
  })(SeekMode$1 || (SeekMode.SeekMode = SeekMode$1 = {}));
  return SeekMode;
}
var hasRequiredEnums;
function requireEnums() {
  if (hasRequiredEnums) return enums;
  hasRequiredEnums = 1;
  (function(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SeekMode = void 0;
    var SeekMode_js_1 = requireSeekMode();
    Object.defineProperty(exports, "SeekMode", { enumerable: true, get: function() {
      return SeekMode_js_1.SeekMode;
    } });
  })(enums);
  return enums;
}
var functions = {};
var variables = {};
var build = {};
var hasRequiredBuild;
function requireBuild() {
  if (hasRequiredBuild) return build;
  hasRequiredBuild = 1;
  var __createBinding = build && build.__createBinding || (Object.create ? (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  }) : (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    o[k2] = m[k];
  }));
  var __setModuleDefault = build && build.__setModuleDefault || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  }) : function(o, v) {
    o["default"] = v;
  });
  var __importStar = build && build.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  Object.defineProperty(build, "__esModule", { value: true });
  build.build = void 0;
  const os = __importStar(require$$0$3);
  build.build = {
    arch: "x86_64",
    os: /* @__PURE__ */ ((p) => p === "win32" ? "windows" : p === "darwin" ? "darwin" : "linux")(os.platform()),
    vendor: "pc",
    target: /* @__PURE__ */ ((p) => p === "win32" ? "x86_64-pc-windows-msvc" : p === "darwin" ? "x86_64-apple-darwin" : "x86_64-unknown-linux-gnu")(os.platform())
  };
  return build;
}
var customInspect = {};
var hasRequiredCustomInspect;
function requireCustomInspect() {
  if (hasRequiredCustomInspect) return customInspect;
  hasRequiredCustomInspect = 1;
  Object.defineProperty(customInspect, "__esModule", { value: true });
  customInspect.customInspect = void 0;
  customInspect.customInspect = /* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom");
  return customInspect;
}
var env = {};
var hasRequiredEnv;
function requireEnv() {
  if (hasRequiredEnv) return env;
  hasRequiredEnv = 1;
  Object.defineProperty(env, "__esModule", { value: true });
  env.env = void 0;
  env.env = {
    get(key) {
      assertValidKey(key);
      return process.env[key];
    },
    set(key, value) {
      assertValidKey(key);
      assertValidValue(value);
      process.env[key] = value;
    },
    has(key) {
      assertValidKey(key);
      return key in process.env;
    },
    delete(key) {
      assertValidKey(key);
      delete process.env[key];
    },
    // @ts-expect-error https://github.com/denoland/deno/issues/10267
    toObject() {
      return { ...process.env };
    }
  };
  const invalidKeyChars = ["=", "\0"].map((c) => c.charCodeAt(0));
  const invalidValueChar = "\0".charCodeAt(0);
  function assertValidKey(key) {
    if (key.length === 0) {
      throw new TypeError("Key is an empty string.");
    }
    for (let i = 0; i < key.length; i++) {
      if (invalidKeyChars.includes(key.charCodeAt(i))) {
        const char = key.charCodeAt(i) === "\0".charCodeAt(0) ? "\\0" : key[i];
        throw new TypeError(`Key contains invalid characters: "${char}"`);
      }
    }
  }
  function assertValidValue(value) {
    for (let i = 0; i < value.length; i++) {
      if (value.charCodeAt(i) === invalidValueChar) {
        throw new TypeError('Value contains invalid characters: "\\0"');
      }
    }
  }
  return env;
}
var mainModule = {};
var hasRequiredMainModule;
function requireMainModule() {
  if (hasRequiredMainModule) return mainModule;
  hasRequiredMainModule = 1;
  var _a, _b;
  Object.defineProperty(mainModule, "__esModule", { value: true });
  mainModule.mainModule = void 0;
  const path_1 = require$$1$5;
  const url_1 = require$$1$4;
  mainModule.mainModule = (0, url_1.pathToFileURL)((_b = (_a = require.main) === null || _a === void 0 ? void 0 : _a.filename) !== null && _b !== void 0 ? _b : (0, path_1.join)(__dirname, "$deno$repl.ts")).href;
  return mainModule;
}
var metrics = {};
var hasRequiredMetrics;
function requireMetrics() {
  if (hasRequiredMetrics) return metrics;
  hasRequiredMetrics = 1;
  Object.defineProperty(metrics, "__esModule", { value: true });
  metrics.metrics = void 0;
  const metrics$1 = function metrics2() {
    return {
      opsDispatched: 0,
      opsDispatchedSync: 0,
      opsDispatchedAsync: 0,
      opsDispatchedAsyncUnref: 0,
      opsCompleted: 0,
      opsCompletedSync: 0,
      opsCompletedAsync: 0,
      opsCompletedAsyncUnref: 0,
      bytesSentControl: 0,
      bytesSentData: 0,
      bytesReceived: 0,
      ops: {}
    };
  };
  metrics.metrics = metrics$1;
  return metrics;
}
var noColor = {};
var hasRequiredNoColor;
function requireNoColor() {
  if (hasRequiredNoColor) return noColor;
  hasRequiredNoColor = 1;
  Object.defineProperty(noColor, "__esModule", { value: true });
  noColor.noColor = void 0;
  noColor.noColor = process.env.NO_COLOR !== void 0;
  return noColor;
}
var permissions = {};
var hasRequiredPermissions;
function requirePermissions() {
  if (hasRequiredPermissions) return permissions;
  hasRequiredPermissions = 1;
  Object.defineProperty(permissions, "__esModule", { value: true });
  permissions.permissions = void 0;
  const Permissions_js_1 = requirePermissions$1();
  permissions.permissions = new Permissions_js_1.Permissions();
  return permissions;
}
var pid = {};
var hasRequiredPid;
function requirePid() {
  if (hasRequiredPid) return pid;
  hasRequiredPid = 1;
  Object.defineProperty(pid, "__esModule", { value: true });
  pid.pid = void 0;
  pid.pid = process.pid;
  return pid;
}
var ppid = {};
var hasRequiredPpid;
function requirePpid() {
  if (hasRequiredPpid) return ppid;
  hasRequiredPpid = 1;
  Object.defineProperty(ppid, "__esModule", { value: true });
  ppid.ppid = void 0;
  ppid.ppid = process.ppid;
  return ppid;
}
var resources = {};
var hasRequiredResources;
function requireResources() {
  if (hasRequiredResources) return resources;
  hasRequiredResources = 1;
  Object.defineProperty(resources, "__esModule", { value: true });
  resources.resources = void 0;
  const resources$1 = function resources2() {
    console.warn([
      "Deno.resources() shim returns a dummy object that does not update.",
      "If you think this is a mistake, raise an issue at https://github.com/denoland/node_deno_shims/issues"
    ].join("\n"));
    return {};
  };
  resources.resources = resources$1;
  return resources;
}
var std = {};
var hasRequiredStd;
function requireStd() {
  if (hasRequiredStd) return std;
  hasRequiredStd = 1;
  var __importDefault = std && std.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(std, "__esModule", { value: true });
  std.stderr = std.stdout = std.stdin = void 0;
  const node_stream_1 = __importDefault(require$$1$3);
  const node_tty_1 = __importDefault(require$$1$6);
  const readSync_js_1 = requireReadSync();
  const writeSync_js_1 = requireWriteSync();
  function chain(fn, cleanup) {
    let prev;
    return function _fn(...args2) {
      const curr = (prev || Promise.resolve()).then(() => fn(...args2)).finally(cleanup || (() => {
      })).then((result) => {
        if (prev === curr)
          prev = void 0;
        return result;
      });
      return prev = curr;
    };
  }
  let stdinReadable;
  std.stdin = {
    rid: 0,
    isTerminal() {
      return node_tty_1.default.isatty(this.rid);
    },
    read: chain((p) => {
      return new Promise((resolve, reject) => {
        process.stdin.resume();
        process.stdin.on("error", onerror);
        process.stdin.once("readable", () => {
          var _a;
          process.stdin.off("error", onerror);
          const data = (_a = process.stdin.read(p.length)) !== null && _a !== void 0 ? _a : process.stdin.read();
          if (data) {
            p.set(data);
            resolve(data.length > 0 ? data.length : null);
          } else {
            resolve(null);
          }
        });
        function onerror(error) {
          reject(error);
          process.stdin.off("error", onerror);
        }
      });
    }, () => process.stdin.pause()),
    get readable() {
      if (stdinReadable == null) {
        stdinReadable = node_stream_1.default.Readable.toWeb(process.stdin);
      }
      return stdinReadable;
    },
    readSync(buffer) {
      return (0, readSync_js_1.readSync)(this.rid, buffer);
    },
    close() {
      process.stdin.destroy();
    },
    setRaw(mode, options) {
      if (options === null || options === void 0 ? void 0 : options.cbreak) {
        throw new Error("The cbreak option is not implemented.");
      }
      process.stdin.setRawMode(mode);
    }
  };
  let stdoutWritable;
  std.stdout = {
    rid: 1,
    isTerminal() {
      return node_tty_1.default.isatty(this.rid);
    },
    write: chain((p) => {
      return new Promise((resolve) => {
        const result = process.stdout.write(p);
        if (!result) {
          process.stdout.once("drain", () => resolve(p.length));
        } else {
          resolve(p.length);
        }
      });
    }),
    get writable() {
      if (stdoutWritable == null) {
        stdoutWritable = node_stream_1.default.Writable.toWeb(process.stdout);
      }
      return stdoutWritable;
    },
    writeSync(data) {
      return (0, writeSync_js_1.writeSync)(this.rid, data);
    },
    close() {
      process.stdout.destroy();
    }
  };
  let stderrWritable;
  std.stderr = {
    rid: 2,
    isTerminal() {
      return node_tty_1.default.isatty(this.rid);
    },
    write: chain((p) => {
      return new Promise((resolve) => {
        const result = process.stderr.write(p);
        if (!result) {
          process.stderr.once("drain", () => resolve(p.length));
        } else {
          resolve(p.length);
        }
      });
    }),
    get writable() {
      if (stderrWritable == null) {
        stderrWritable = node_stream_1.default.Writable.toWeb(process.stderr);
      }
      return stderrWritable;
    },
    writeSync(data) {
      return (0, writeSync_js_1.writeSync)(this.rid, data);
    },
    close() {
      process.stderr.destroy();
    }
  };
  return std;
}
var version$1 = {};
var version = {};
var hasRequiredVersion$1;
function requireVersion$1() {
  if (hasRequiredVersion$1) return version;
  hasRequiredVersion$1 = 1;
  Object.defineProperty(version, "__esModule", { value: true });
  version.typescript = version.deno = void 0;
  version.deno = "1.40.3";
  version.typescript = "5.3.3";
  return version;
}
var hasRequiredVersion;
function requireVersion() {
  if (hasRequiredVersion) return version$1;
  hasRequiredVersion = 1;
  Object.defineProperty(version$1, "__esModule", { value: true });
  version$1.version = void 0;
  const version_js_1 = requireVersion$1();
  version$1.version = {
    deno: version_js_1.deno,
    typescript: version_js_1.typescript,
    v8: process.versions.v8
  };
  return version$1;
}
var hasRequiredVariables;
function requireVariables() {
  if (hasRequiredVariables) return variables;
  hasRequiredVariables = 1;
  (function(exports) {
    var __createBinding = variables && variables.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = variables && variables.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = variables && variables.__importStar || function(mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null) {
        for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
      }
      __setModuleDefault(result, mod);
      return result;
    };
    var __exportStar = variables && variables.__exportStar || function(m, exports2) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.version = exports.resources = exports.ppid = exports.pid = exports.permissions = exports.noColor = exports.metrics = exports.mainModule = exports.errors = exports.env = exports.customInspect = exports.build = void 0;
    var build_js_1 = requireBuild();
    Object.defineProperty(exports, "build", { enumerable: true, get: function() {
      return build_js_1.build;
    } });
    var customInspect_js_1 = requireCustomInspect();
    Object.defineProperty(exports, "customInspect", { enumerable: true, get: function() {
      return customInspect_js_1.customInspect;
    } });
    var env_js_1 = requireEnv();
    Object.defineProperty(exports, "env", { enumerable: true, get: function() {
      return env_js_1.env;
    } });
    exports.errors = __importStar(requireErrors());
    var mainModule_js_1 = requireMainModule();
    Object.defineProperty(exports, "mainModule", { enumerable: true, get: function() {
      return mainModule_js_1.mainModule;
    } });
    var metrics_js_1 = requireMetrics();
    Object.defineProperty(exports, "metrics", { enumerable: true, get: function() {
      return metrics_js_1.metrics;
    } });
    var noColor_js_1 = requireNoColor();
    Object.defineProperty(exports, "noColor", { enumerable: true, get: function() {
      return noColor_js_1.noColor;
    } });
    var permissions_js_1 = requirePermissions();
    Object.defineProperty(exports, "permissions", { enumerable: true, get: function() {
      return permissions_js_1.permissions;
    } });
    var pid_js_1 = requirePid();
    Object.defineProperty(exports, "pid", { enumerable: true, get: function() {
      return pid_js_1.pid;
    } });
    var ppid_js_1 = requirePpid();
    Object.defineProperty(exports, "ppid", { enumerable: true, get: function() {
      return ppid_js_1.ppid;
    } });
    var resources_js_1 = requireResources();
    Object.defineProperty(exports, "resources", { enumerable: true, get: function() {
      return resources_js_1.resources;
    } });
    __exportStar(requireStd(), exports);
    var version_js_1 = requireVersion();
    Object.defineProperty(exports, "version", { enumerable: true, get: function() {
      return version_js_1.version;
    } });
  })(variables);
  return variables;
}
var addSignalListener = {};
var hasRequiredAddSignalListener;
function requireAddSignalListener() {
  if (hasRequiredAddSignalListener) return addSignalListener;
  hasRequiredAddSignalListener = 1;
  var __importDefault = addSignalListener && addSignalListener.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(addSignalListener, "__esModule", { value: true });
  addSignalListener.addSignalListener = void 0;
  const process_1 = __importDefault(require$$0$4);
  function denoSignalToNodeJs(signal) {
    if (signal === "SIGEMT") {
      throw new Error("SIGEMT is not supported");
    }
    return signal;
  }
  const addSignalListener$1 = (signal, handler) => {
    process_1.default.addListener(denoSignalToNodeJs(signal), handler);
  };
  addSignalListener.addSignalListener = addSignalListener$1;
  return addSignalListener;
}
var chdir = {};
var hasRequiredChdir;
function requireChdir() {
  if (hasRequiredChdir) return chdir;
  hasRequiredChdir = 1;
  var __importDefault = chdir && chdir.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(chdir, "__esModule", { value: true });
  chdir.chdir = void 0;
  const url_1 = require$$1$4;
  const errorMap_js_1 = __importDefault(requireErrorMap());
  const variables_js_1 = requireVariables();
  const chdir$1 = function(path) {
    try {
      return process.chdir(path instanceof URL ? (0, url_1.fileURLToPath)(path) : path);
    } catch (error) {
      if ((error === null || error === void 0 ? void 0 : error.code) === "ENOENT") {
        throw new variables_js_1.errors.NotFound(`No such file or directory (os error 2), chdir '${path}'`);
      }
      throw (0, errorMap_js_1.default)(error);
    }
  };
  chdir.chdir = chdir$1;
  return chdir;
}
var chmod = {};
var hasRequiredChmod;
function requireChmod() {
  if (hasRequiredChmod) return chmod;
  hasRequiredChmod = 1;
  var __createBinding = chmod && chmod.__createBinding || (Object.create ? (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  }) : (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    o[k2] = m[k];
  }));
  var __setModuleDefault = chmod && chmod.__setModuleDefault || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  }) : function(o, v) {
    o["default"] = v;
  });
  var __importStar = chmod && chmod.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  Object.defineProperty(chmod, "__esModule", { value: true });
  chmod.chmod = void 0;
  const fs = __importStar(require$$0$5);
  chmod.chmod = fs.chmod;
  return chmod;
}
var chmodSync = {};
var hasRequiredChmodSync;
function requireChmodSync() {
  if (hasRequiredChmodSync) return chmodSync;
  hasRequiredChmodSync = 1;
  var __createBinding = chmodSync && chmodSync.__createBinding || (Object.create ? (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  }) : (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    o[k2] = m[k];
  }));
  var __setModuleDefault = chmodSync && chmodSync.__setModuleDefault || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  }) : function(o, v) {
    o["default"] = v;
  });
  var __importStar = chmodSync && chmodSync.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  Object.defineProperty(chmodSync, "__esModule", { value: true });
  chmodSync.chmodSync = void 0;
  const fs = __importStar(require$$0);
  chmodSync.chmodSync = fs.chmodSync;
  return chmodSync;
}
var chown = {};
var hasRequiredChown;
function requireChown() {
  if (hasRequiredChown) return chown;
  hasRequiredChown = 1;
  var __createBinding = chown && chown.__createBinding || (Object.create ? (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  }) : (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    o[k2] = m[k];
  }));
  var __setModuleDefault = chown && chown.__setModuleDefault || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  }) : function(o, v) {
    o["default"] = v;
  });
  var __importStar = chown && chown.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  Object.defineProperty(chown, "__esModule", { value: true });
  chown.chown = void 0;
  const fs = __importStar(require$$0$5);
  const chown$1 = async (path, uid2, gid2) => await fs.chown(path, uid2 !== null && uid2 !== void 0 ? uid2 : -1, gid2 !== null && gid2 !== void 0 ? gid2 : -1);
  chown.chown = chown$1;
  return chown;
}
var chownSync = {};
var hasRequiredChownSync;
function requireChownSync() {
  if (hasRequiredChownSync) return chownSync;
  hasRequiredChownSync = 1;
  var __createBinding = chownSync && chownSync.__createBinding || (Object.create ? (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  }) : (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    o[k2] = m[k];
  }));
  var __setModuleDefault = chownSync && chownSync.__setModuleDefault || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  }) : function(o, v) {
    o["default"] = v;
  });
  var __importStar = chownSync && chownSync.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  Object.defineProperty(chownSync, "__esModule", { value: true });
  chownSync.chownSync = void 0;
  const fs = __importStar(require$$0);
  const chownSync$1 = (path, uid2, gid2) => fs.chownSync(path, uid2 !== null && uid2 !== void 0 ? uid2 : -1, gid2 !== null && gid2 !== void 0 ? gid2 : -1);
  chownSync.chownSync = chownSync$1;
  return chownSync;
}
var close = {};
var hasRequiredClose;
function requireClose() {
  if (hasRequiredClose) return close;
  hasRequiredClose = 1;
  var __createBinding = close && close.__createBinding || (Object.create ? (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  }) : (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    o[k2] = m[k];
  }));
  var __setModuleDefault = close && close.__setModuleDefault || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  }) : function(o, v) {
    o["default"] = v;
  });
  var __importStar = close && close.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  Object.defineProperty(close, "__esModule", { value: true });
  close.close = void 0;
  const fs = __importStar(require$$0);
  close.close = fs.closeSync;
  return close;
}
var connect = {};
var Conn = {};
var hasRequiredConn;
function requireConn() {
  if (hasRequiredConn) return Conn;
  hasRequiredConn = 1;
  var __classPrivateFieldSet = Conn && Conn.__classPrivateFieldSet || function(receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
  };
  var __classPrivateFieldGet = Conn && Conn.__classPrivateFieldGet || function(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
  };
  var _Conn_socket;
  Object.defineProperty(Conn, "__esModule", { value: true });
  Conn.TlsConn = Conn.Conn = void 0;
  const net_1 = require$$0$6;
  const FsFile_js_1 = requireFsFile();
  let Conn$1 = class Conn extends FsFile_js_1.FsFile {
    constructor(rid, localAddr, remoteAddr, socket) {
      super(rid);
      this.rid = rid;
      this.localAddr = localAddr;
      this.remoteAddr = remoteAddr;
      _Conn_socket.set(this, void 0);
      __classPrivateFieldSet(this, _Conn_socket, socket || new net_1.Socket({ fd: rid }), "f");
    }
    [(_Conn_socket = /* @__PURE__ */ new WeakMap(), Symbol.dispose)]() {
      this.close();
    }
    async closeWrite() {
      await new Promise((resolve) => __classPrivateFieldGet(this, _Conn_socket, "f").end(resolve));
    }
    setNoDelay(enable) {
      __classPrivateFieldGet(this, _Conn_socket, "f").setNoDelay(enable);
    }
    setKeepAlive(enable) {
      __classPrivateFieldGet(this, _Conn_socket, "f").setKeepAlive(enable);
    }
    ref() {
      __classPrivateFieldGet(this, _Conn_socket, "f").ref();
    }
    unref() {
      __classPrivateFieldGet(this, _Conn_socket, "f").unref();
    }
  };
  Conn.Conn = Conn$1;
  class TlsConn extends Conn$1 {
    handshake() {
      console.warn("@deno/shim-deno: Handshake is not supported.");
      return Promise.resolve({
        alpnProtocol: null
      });
    }
  }
  Conn.TlsConn = TlsConn;
  return Conn;
}
var hasRequiredConnect;
function requireConnect() {
  if (hasRequiredConnect) return connect;
  hasRequiredConnect = 1;
  Object.defineProperty(connect, "__esModule", { value: true });
  connect.connect = void 0;
  const net_1 = require$$0$6;
  const Conn_js_1 = requireConn();
  const connect$1 = function connect2(options) {
    if (options.transport === "unix") {
      throw new Error("Unstable UnixConnectOptions is not implemented");
    }
    const { transport = "tcp", hostname: hostname2 = "127.0.0.1", port } = options;
    if (transport !== "tcp") {
      throw new Error("Deno.connect is only implemented for transport: tcp");
    }
    const socket = (0, net_1.createConnection)({ port, host: hostname2 });
    socket.on("error", (err) => console.error(err));
    return new Promise((resolve) => {
      socket.once("connect", () => {
        const rid = socket._handle.fd;
        const localAddr = {
          // cannot be undefined while socket is connected
          hostname: socket.localAddress,
          port: socket.localPort,
          transport: "tcp"
        };
        const remoteAddr = {
          // cannot be undefined while socket is connected
          hostname: socket.remoteAddress,
          port: socket.remotePort,
          transport: "tcp"
        };
        resolve(new Conn_js_1.Conn(rid, localAddr, remoteAddr, socket));
      });
    });
  };
  connect.connect = connect$1;
  return connect;
}
var connectTls = {};
var readTextFile = {};
var hasRequiredReadTextFile;
function requireReadTextFile() {
  if (hasRequiredReadTextFile) return readTextFile;
  hasRequiredReadTextFile = 1;
  var __importDefault = readTextFile && readTextFile.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(readTextFile, "__esModule", { value: true });
  readTextFile.readTextFile = void 0;
  const promises_1 = require$$0$5;
  const errorMap_js_1 = __importDefault(requireErrorMap());
  const readTextFile$1 = async (path, { signal } = {}) => {
    try {
      return await (0, promises_1.readFile)(path, { encoding: "utf8", signal });
    } catch (e) {
      throw (0, errorMap_js_1.default)(e);
    }
  };
  readTextFile.readTextFile = readTextFile$1;
  return readTextFile;
}
var hasRequiredConnectTls;
function requireConnectTls() {
  if (hasRequiredConnectTls) return connectTls;
  hasRequiredConnectTls = 1;
  Object.defineProperty(connectTls, "__esModule", { value: true });
  connectTls.connectTls = void 0;
  const tls_1 = require$$0$7;
  const Conn_js_1 = requireConn();
  const readTextFile_js_1 = requireReadTextFile();
  const connectTls$1 = async function connectTls2({ port, hostname: hostname2 = "127.0.0.1", certFile }) {
    const cert = certFile && await (0, readTextFile_js_1.readTextFile)(certFile);
    const socket = (0, tls_1.connect)({ port, host: hostname2, cert });
    return new Promise((resolve) => {
      socket.on("connect", () => {
        const rid = socket._handle.fd;
        const localAddr = {
          // cannot be undefined while socket is connected
          hostname: socket.localAddress,
          port: socket.localPort,
          transport: "tcp"
        };
        const remoteAddr = {
          // cannot be undefined while socket is connected
          hostname: socket.remoteAddress,
          port: socket.remotePort,
          transport: "tcp"
        };
        resolve(new Conn_js_1.TlsConn(rid, localAddr, remoteAddr, socket));
      });
    });
  };
  connectTls.connectTls = connectTls$1;
  return connectTls;
}
var consoleSize = {};
var hasRequiredConsoleSize;
function requireConsoleSize() {
  if (hasRequiredConsoleSize) return consoleSize;
  hasRequiredConsoleSize = 1;
  Object.defineProperty(consoleSize, "__esModule", { value: true });
  consoleSize.consoleSize = void 0;
  const consoleSize$1 = function consoleSize2() {
    const pipes = [process.stderr, process.stdout];
    for (const pipe of pipes) {
      if (pipe.columns != null) {
        const { columns, rows } = pipe;
        return { columns, rows };
      }
    }
    throw new Error("The handle is invalid.");
  };
  consoleSize.consoleSize = consoleSize$1;
  return consoleSize;
}
var copy = {};
var consts = {};
var hasRequiredConsts;
function requireConsts() {
  if (hasRequiredConsts) return consts;
  hasRequiredConsts = 1;
  Object.defineProperty(consts, "__esModule", { value: true });
  consts.DEFAULT_BUFFER_SIZE = void 0;
  consts.DEFAULT_BUFFER_SIZE = 32 * 1024;
  return consts;
}
var hasRequiredCopy;
function requireCopy() {
  if (hasRequiredCopy) return copy;
  hasRequiredCopy = 1;
  Object.defineProperty(copy, "__esModule", { value: true });
  copy.copy = void 0;
  const consts_js_1 = requireConsts();
  const copy$1 = async function copy2(src, dst, options) {
    var _a;
    let n = 0;
    const bufSize = (_a = options === null || options === void 0 ? void 0 : options.bufSize) !== null && _a !== void 0 ? _a : consts_js_1.DEFAULT_BUFFER_SIZE;
    const b = new Uint8Array(bufSize);
    let gotEOF = false;
    while (gotEOF === false) {
      const result = await src.read(b);
      if (result === null) {
        gotEOF = true;
      } else {
        let nwritten = 0;
        while (nwritten < result) {
          nwritten += await dst.write(b.subarray(nwritten, result));
        }
        n += nwritten;
      }
    }
    return n;
  };
  copy.copy = copy$1;
  return copy;
}
var copyFile = {};
var hasRequiredCopyFile;
function requireCopyFile() {
  if (hasRequiredCopyFile) return copyFile;
  hasRequiredCopyFile = 1;
  var __createBinding = copyFile && copyFile.__createBinding || (Object.create ? (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  }) : (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    o[k2] = m[k];
  }));
  var __setModuleDefault = copyFile && copyFile.__setModuleDefault || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  }) : function(o, v) {
    o["default"] = v;
  });
  var __importStar = copyFile && copyFile.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  var __importDefault = copyFile && copyFile.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(copyFile, "__esModule", { value: true });
  copyFile.copyFile = void 0;
  const fs = __importStar(require$$0$5);
  const errorMap_js_1 = __importDefault(requireErrorMap());
  const errors2 = __importStar(requireErrors());
  const copyFile$1 = async (src, dest) => {
    try {
      await fs.copyFile(src, dest);
    } catch (error) {
      if ((error === null || error === void 0 ? void 0 : error.code) === "ENOENT") {
        throw new errors2.NotFound(`File not found, copy '${src}' -> '${dest}'`);
      }
      throw (0, errorMap_js_1.default)(error);
    }
  };
  copyFile.copyFile = copyFile$1;
  return copyFile;
}
var copyFileSync = {};
var hasRequiredCopyFileSync;
function requireCopyFileSync() {
  if (hasRequiredCopyFileSync) return copyFileSync;
  hasRequiredCopyFileSync = 1;
  var __createBinding = copyFileSync && copyFileSync.__createBinding || (Object.create ? (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  }) : (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    o[k2] = m[k];
  }));
  var __setModuleDefault = copyFileSync && copyFileSync.__setModuleDefault || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  }) : function(o, v) {
    o["default"] = v;
  });
  var __importStar = copyFileSync && copyFileSync.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  var __importDefault = copyFileSync && copyFileSync.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(copyFileSync, "__esModule", { value: true });
  copyFileSync.copyFileSync = void 0;
  const fs = __importStar(require$$0);
  const errorMap_js_1 = __importDefault(requireErrorMap());
  const errors2 = __importStar(requireErrors());
  const copyFileSync$1 = (src, dest) => {
    try {
      fs.copyFileSync(src, dest);
    } catch (error) {
      if ((error === null || error === void 0 ? void 0 : error.code) === "ENOENT") {
        throw new errors2.NotFound(`File not found, copy '${src}' -> '${dest}'`);
      }
      throw (0, errorMap_js_1.default)(error);
    }
  };
  copyFileSync.copyFileSync = copyFileSync$1;
  return copyFileSync;
}
var create = {};
var open = {};
var fs_flags = {};
var hasRequiredFs_flags;
function requireFs_flags() {
  if (hasRequiredFs_flags) return fs_flags;
  hasRequiredFs_flags = 1;
  var __createBinding = fs_flags && fs_flags.__createBinding || (Object.create ? (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  }) : (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    o[k2] = m[k];
  }));
  var __setModuleDefault = fs_flags && fs_flags.__setModuleDefault || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  }) : function(o, v) {
    o["default"] = v;
  });
  var __importStar = fs_flags && fs_flags.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  var __importDefault = fs_flags && fs_flags.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(fs_flags, "__esModule", { value: true });
  fs_flags.getFsFlag = fs_flags.getCreationFlag = fs_flags.getAccessFlag = void 0;
  const errors2 = __importStar(requireErrors());
  const fs_1 = require$$0;
  const os_1 = __importDefault(require$$0$3);
  const { O_APPEND, O_CREAT, O_EXCL, O_RDONLY, O_RDWR, O_TRUNC, O_WRONLY } = fs_1.constants;
  function getAccessFlag(opts) {
    if (opts.read && !opts.write && !opts.append)
      return O_RDONLY;
    if (!opts.read && opts.write && !opts.append)
      return O_WRONLY;
    if (opts.read && opts.write && !opts.append)
      return O_RDWR;
    if (!opts.read && opts.append)
      return O_WRONLY | O_APPEND;
    if (opts.read && opts.append)
      return O_RDWR | O_APPEND;
    if (!opts.read && !opts.write && !opts.append) {
      throw new errors2.BadResource("EINVAL: One of 'read', 'write', 'append' is required to open file.");
    }
    throw new errors2.BadResource("EINVAL: Invalid fs flags.");
  }
  fs_flags.getAccessFlag = getAccessFlag;
  function getCreationFlag(opts) {
    if (!opts.write && !opts.append) {
      if (opts.truncate || opts.create || opts.createNew) {
        throw new errors2.BadResource("EINVAL: One of 'write', 'append' is required to 'truncate', 'create' or 'createNew' file.");
      }
    }
    if (opts.append) {
      if (opts.truncate && !opts.createNew) {
        throw new errors2.BadResource("EINVAL: unexpected 'truncate': true and 'createNew': false when 'append' is true.");
      }
    }
    if (!opts.create && !opts.truncate && !opts.createNew)
      return 0;
    if (opts.create && !opts.truncate && !opts.createNew)
      return O_CREAT;
    if (!opts.create && opts.truncate && !opts.createNew) {
      if (os_1.default.platform() === "win32") {
        return O_CREAT | O_TRUNC;
      } else {
        return O_TRUNC;
      }
    }
    if (opts.create && opts.truncate && !opts.createNew) {
      return O_CREAT | O_TRUNC;
    }
    if (opts.createNew)
      return O_CREAT | O_EXCL;
    throw new errors2.BadResource("EINVAL: Invalid fs flags.");
  }
  fs_flags.getCreationFlag = getCreationFlag;
  function getFsFlag(flags) {
    return getAccessFlag(flags) | getCreationFlag(flags);
  }
  fs_flags.getFsFlag = getFsFlag;
  return fs_flags;
}
var hasRequiredOpen;
function requireOpen() {
  if (hasRequiredOpen) return open;
  hasRequiredOpen = 1;
  var __importDefault = open && open.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(open, "__esModule", { value: true });
  open.open = void 0;
  const fs_1 = require$$0;
  const util_1 = require$$1$2;
  const FsFile_js_1 = requireFsFile();
  const fs_flags_js_1 = requireFs_flags();
  const errorMap_js_1 = __importDefault(requireErrorMap());
  const nodeOpen = (0, util_1.promisify)(fs_1.open);
  const open$1 = async function open2(path, { read: read2, write: write2, append, truncate: truncate2, create: create2, createNew, mode = 438 } = {
    read: true
  }) {
    const flagMode = (0, fs_flags_js_1.getFsFlag)({
      read: read2,
      write: write2,
      append,
      truncate: truncate2,
      create: create2,
      createNew
    });
    try {
      const fd = await nodeOpen(path, flagMode, mode);
      return new FsFile_js_1.File(fd);
    } catch (err) {
      throw (0, errorMap_js_1.default)(err);
    }
  };
  open.open = open$1;
  return open;
}
var hasRequiredCreate;
function requireCreate() {
  if (hasRequiredCreate) return create;
  hasRequiredCreate = 1;
  Object.defineProperty(create, "__esModule", { value: true });
  create.create = void 0;
  const open_js_1 = requireOpen();
  const create$1 = async function create2(path) {
    return await (0, open_js_1.open)(path, { write: true, create: true, truncate: true });
  };
  create.create = create$1;
  return create;
}
var createSync = {};
var openSync = {};
var hasRequiredOpenSync;
function requireOpenSync() {
  if (hasRequiredOpenSync) return openSync;
  hasRequiredOpenSync = 1;
  var __importDefault = openSync && openSync.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(openSync, "__esModule", { value: true });
  openSync.openSync = void 0;
  const fs_1 = require$$0;
  const FsFile_js_1 = requireFsFile();
  const fs_flags_js_1 = requireFs_flags();
  const errorMap_js_1 = __importDefault(requireErrorMap());
  const openSync$1 = function openSync2(path, { read: read2, write: write2, append, truncate: truncate2, create: create2, createNew, mode = 438 } = {
    read: true
  }) {
    const flagMode = (0, fs_flags_js_1.getFsFlag)({
      read: read2,
      write: write2,
      append,
      truncate: truncate2,
      create: create2,
      createNew
    });
    try {
      const fd = (0, fs_1.openSync)(path, flagMode, mode);
      return new FsFile_js_1.File(fd);
    } catch (err) {
      throw (0, errorMap_js_1.default)(err);
    }
  };
  openSync.openSync = openSync$1;
  return openSync;
}
var hasRequiredCreateSync;
function requireCreateSync() {
  if (hasRequiredCreateSync) return createSync;
  hasRequiredCreateSync = 1;
  Object.defineProperty(createSync, "__esModule", { value: true });
  createSync.createSync = void 0;
  const openSync_js_1 = requireOpenSync();
  const createSync$1 = function createSync2(path) {
    return (0, openSync_js_1.openSync)(path, {
      create: true,
      truncate: true,
      read: true,
      write: true
    });
  };
  createSync.createSync = createSync$1;
  return createSync;
}
var cwd = {};
var hasRequiredCwd;
function requireCwd() {
  if (hasRequiredCwd) return cwd;
  hasRequiredCwd = 1;
  Object.defineProperty(cwd, "__esModule", { value: true });
  cwd.cwd = void 0;
  cwd.cwd = process.cwd;
  return cwd;
}
var execPath = {};
var hasRequiredExecPath;
function requireExecPath() {
  if (hasRequiredExecPath) return execPath;
  hasRequiredExecPath = 1;
  var __importDefault = execPath && execPath.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(execPath, "__esModule", { value: true });
  execPath.execPath = void 0;
  const which_1 = __importDefault(requireLib());
  const execPath$1 = () => which_1.default.sync("deno");
  execPath.execPath = execPath$1;
  return execPath;
}
var exit = {};
var hasRequiredExit;
function requireExit() {
  if (hasRequiredExit) return exit;
  hasRequiredExit = 1;
  Object.defineProperty(exit, "__esModule", { value: true });
  exit.exit = void 0;
  const exit$1 = function exit2(code) {
    return process.exit(code);
  };
  exit.exit = exit$1;
  return exit;
}
var fsync = {};
var hasRequiredFsync;
function requireFsync() {
  if (hasRequiredFsync) return fsync;
  hasRequiredFsync = 1;
  Object.defineProperty(fsync, "__esModule", { value: true });
  fsync.fsync = void 0;
  const fs_1 = require$$0;
  const util_1 = require$$1$2;
  const fsync$1 = function fsync2(rid) {
    return (0, util_1.promisify)(fs_1.fsync)(rid);
  };
  fsync.fsync = fsync$1;
  return fsync;
}
var fsyncSync = {};
var hasRequiredFsyncSync;
function requireFsyncSync() {
  if (hasRequiredFsyncSync) return fsyncSync;
  hasRequiredFsyncSync = 1;
  Object.defineProperty(fsyncSync, "__esModule", { value: true });
  fsyncSync.fsyncSync = void 0;
  const fs_1 = require$$0;
  const fsyncSync$1 = function fsyncSync2(rid) {
    return (0, fs_1.fsyncSync)(rid);
  };
  fsyncSync.fsyncSync = fsyncSync$1;
  return fsyncSync;
}
var gid = {};
var hasRequiredGid;
function requireGid() {
  if (hasRequiredGid) return gid;
  hasRequiredGid = 1;
  var __importDefault = gid && gid.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  var _a;
  Object.defineProperty(gid, "__esModule", { value: true });
  gid.gid = void 0;
  const process_1 = __importDefault(require$$0$4);
  gid.gid = (_a = process_1.default.getgid) !== null && _a !== void 0 ? _a : (() => null);
  return gid;
}
var hostname = {};
var hasRequiredHostname;
function requireHostname() {
  if (hasRequiredHostname) return hostname;
  hasRequiredHostname = 1;
  var __createBinding = hostname && hostname.__createBinding || (Object.create ? (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  }) : (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    o[k2] = m[k];
  }));
  var __setModuleDefault = hostname && hostname.__setModuleDefault || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  }) : function(o, v) {
    o["default"] = v;
  });
  var __importStar = hostname && hostname.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  Object.defineProperty(hostname, "__esModule", { value: true });
  hostname.hostname = void 0;
  const os = __importStar(require$$0$3);
  const hostname$1 = function hostname2() {
    return os.hostname();
  };
  hostname.hostname = hostname$1;
  return hostname;
}
var inspect = {};
var hasRequiredInspect;
function requireInspect() {
  if (hasRequiredInspect) return inspect;
  hasRequiredInspect = 1;
  var __createBinding = inspect && inspect.__createBinding || (Object.create ? (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  }) : (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    o[k2] = m[k];
  }));
  var __setModuleDefault = inspect && inspect.__setModuleDefault || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  }) : function(o, v) {
    o["default"] = v;
  });
  var __importStar = inspect && inspect.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  Object.defineProperty(inspect, "__esModule", { value: true });
  inspect.inspect = void 0;
  const util = __importStar(require$$1$2);
  const inspect$1 = (value, options = {}) => util.inspect(value, options);
  inspect.inspect = inspect$1;
  return inspect;
}
var kill = {};
var hasRequiredKill;
function requireKill() {
  if (hasRequiredKill) return kill;
  hasRequiredKill = 1;
  var __importDefault = kill && kill.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(kill, "__esModule", { value: true });
  kill.kill = void 0;
  const os_1 = __importDefault(require$$0$3);
  const process_1 = __importDefault(require$$0$4);
  const kill$1 = function(pid2, signo) {
    if (pid2 < 0 && os_1.default.platform() === "win32") {
      throw new TypeError("Invalid pid");
    }
    process_1.default.kill(pid2, signo);
  };
  kill.kill = kill$1;
  return kill;
}
var link = {};
var hasRequiredLink;
function requireLink() {
  if (hasRequiredLink) return link;
  hasRequiredLink = 1;
  var __createBinding = link && link.__createBinding || (Object.create ? (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  }) : (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    o[k2] = m[k];
  }));
  var __setModuleDefault = link && link.__setModuleDefault || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  }) : function(o, v) {
    o["default"] = v;
  });
  var __importStar = link && link.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  Object.defineProperty(link, "__esModule", { value: true });
  link.link = void 0;
  const fs = __importStar(require$$0$5);
  link.link = fs.link;
  return link;
}
var linkSync = {};
var hasRequiredLinkSync;
function requireLinkSync() {
  if (hasRequiredLinkSync) return linkSync;
  hasRequiredLinkSync = 1;
  var __createBinding = linkSync && linkSync.__createBinding || (Object.create ? (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  }) : (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    o[k2] = m[k];
  }));
  var __setModuleDefault = linkSync && linkSync.__setModuleDefault || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  }) : function(o, v) {
    o["default"] = v;
  });
  var __importStar = linkSync && linkSync.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  Object.defineProperty(linkSync, "__esModule", { value: true });
  linkSync.linkSync = void 0;
  const fs = __importStar(require$$0);
  linkSync.linkSync = fs.linkSync;
  return linkSync;
}
var listen = {};
var Listener = {};
var hasRequiredListener;
function requireListener() {
  if (hasRequiredListener) return Listener;
  hasRequiredListener = 1;
  var __createBinding = Listener && Listener.__createBinding || (Object.create ? (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  }) : (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    o[k2] = m[k];
  }));
  var __setModuleDefault = Listener && Listener.__setModuleDefault || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  }) : function(o, v) {
    o["default"] = v;
  });
  var __importStar = Listener && Listener.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  var __classPrivateFieldSet = Listener && Listener.__classPrivateFieldSet || function(receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
  };
  var __classPrivateFieldGet = Listener && Listener.__classPrivateFieldGet || function(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
  };
  var _Listener_listener;
  Object.defineProperty(Listener, "__esModule", { value: true });
  Listener.Listener = void 0;
  const close_js_1 = requireClose();
  const errors2 = __importStar(requireErrors());
  let Listener$1 = class Listener {
    constructor(rid, addr, listener) {
      this.rid = rid;
      this.addr = addr;
      _Listener_listener.set(this, void 0);
      __classPrivateFieldSet(this, _Listener_listener, listener, "f");
    }
    [(_Listener_listener = /* @__PURE__ */ new WeakMap(), Symbol.dispose)]() {
      this.close();
    }
    async accept() {
      if (!__classPrivateFieldGet(this, _Listener_listener, "f")) {
        throw new errors2.BadResource("Listener not initialised");
      }
      const result = await __classPrivateFieldGet(this, _Listener_listener, "f").next();
      if (result.done) {
        throw new errors2.BadResource("Server not listening");
      }
      return result.value;
    }
    async next() {
      let conn;
      try {
        conn = await this.accept();
      } catch (error) {
        if (error instanceof errors2.BadResource) {
          return { value: void 0, done: true };
        }
        throw error;
      }
      return { value: conn, done: false };
    }
    return(value) {
      this.close();
      return Promise.resolve({ value, done: true });
    }
    close() {
      (0, close_js_1.close)(this.rid);
    }
    ref() {
      throw new Error("Not implemented");
    }
    unref() {
      throw new Error("Not implemented");
    }
    [Symbol.asyncIterator]() {
      return this;
    }
  };
  Listener.Listener = Listener$1;
  return Listener;
}
var hasRequiredListen;
function requireListen() {
  if (hasRequiredListen) return listen;
  hasRequiredListen = 1;
  Object.defineProperty(listen, "__esModule", { value: true });
  listen.listen = void 0;
  const net_1 = require$$0$6;
  const Conn_js_1 = requireConn();
  const Listener_js_1 = requireListener();
  async function* _listen(server, waitFor) {
    await waitFor;
    while (server.listening) {
      yield new Promise((resolve) => server.once("connection", (socket) => {
        socket.on("error", (err) => console.error(err));
        const rid = socket._handle.fd;
        const localAddr = {
          // cannot be undefined while socket is connected
          hostname: socket.localAddress,
          port: socket.localPort,
          transport: "tcp"
        };
        const remoteAddr = {
          // cannot be undefined while socket is connected
          hostname: socket.remoteAddress,
          port: socket.remotePort,
          transport: "tcp"
        };
        resolve(new Conn_js_1.Conn(rid, localAddr, remoteAddr));
      }));
    }
  }
  const listen$1 = function listen2(options) {
    if (options.transport === "unix") {
      throw new Error("Unstable UnixListenOptions is not implemented");
    }
    const { port, hostname: hostname2 = "0.0.0.0", transport = "tcp" } = options;
    if (transport !== "tcp") {
      throw new Error("Deno.listen is only implemented for transport: tcp");
    }
    const server = (0, net_1.createServer)();
    const waitFor = new Promise((resolve) => (
      // server._handle.fd is assigned immediately on .listen()
      server.listen(port, hostname2, resolve)
    ));
    const listener = new Listener_js_1.Listener(server._handle.fd, {
      hostname: hostname2,
      port,
      transport: "tcp"
    }, _listen(server, waitFor));
    return listener;
  };
  listen.listen = listen$1;
  return listen;
}
var listenTls = {};
var readTextFileSync = {};
var hasRequiredReadTextFileSync;
function requireReadTextFileSync() {
  if (hasRequiredReadTextFileSync) return readTextFileSync;
  hasRequiredReadTextFileSync = 1;
  var __createBinding = readTextFileSync && readTextFileSync.__createBinding || (Object.create ? (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  }) : (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    o[k2] = m[k];
  }));
  var __setModuleDefault = readTextFileSync && readTextFileSync.__setModuleDefault || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  }) : function(o, v) {
    o["default"] = v;
  });
  var __importStar = readTextFileSync && readTextFileSync.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  var __importDefault = readTextFileSync && readTextFileSync.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(readTextFileSync, "__esModule", { value: true });
  readTextFileSync.readTextFileSync = void 0;
  const fs = __importStar(require$$0);
  const errorMap_js_1 = __importDefault(requireErrorMap());
  const readTextFileSync$1 = function(path) {
    try {
      return fs.readFileSync(path, "utf8");
    } catch (e) {
      throw (0, errorMap_js_1.default)(e);
    }
  };
  readTextFileSync.readTextFileSync = readTextFileSync$1;
  return readTextFileSync;
}
var hasRequiredListenTls;
function requireListenTls() {
  if (hasRequiredListenTls) return listenTls;
  hasRequiredListenTls = 1;
  Object.defineProperty(listenTls, "__esModule", { value: true });
  listenTls.listenTls = void 0;
  const tls_1 = require$$0$7;
  const Conn_js_1 = requireConn();
  const Listener_js_1 = requireListener();
  const readTextFileSync_js_1 = requireReadTextFileSync();
  async function* _listen(server, waitFor) {
    await waitFor;
    while (server.listening) {
      yield new Promise((resolve) => server.once("secureConnection", (socket) => {
        socket.on("error", (err) => console.error(err));
        const rid = socket._handle.fd;
        const localAddr = {
          // cannot be undefined while socket is connected
          hostname: socket.localAddress,
          port: socket.localPort,
          transport: "tcp"
        };
        const remoteAddr = {
          // cannot be undefined while socket is connected
          hostname: socket.remoteAddress,
          port: socket.remotePort,
          transport: "tcp"
        };
        resolve(new Conn_js_1.TlsConn(rid, localAddr, remoteAddr));
      }));
    }
  }
  const listenTls$1 = function listen2({ port, hostname: hostname2 = "0.0.0.0", transport = "tcp", certFile, keyFile }) {
    if (transport !== "tcp") {
      throw new Error("Deno.listen is only implemented for transport: tcp");
    }
    const [cert, key] = [certFile, keyFile].map((f) => f == null ? void 0 : (0, readTextFileSync_js_1.readTextFileSync)(f));
    const server = (0, tls_1.createServer)({ cert, key });
    const waitFor = new Promise((resolve) => (
      // server._handle.fd is assigned immediately on .listen()
      server.listen(port, hostname2, resolve)
    ));
    const listener = new Listener_js_1.Listener(server._handle.fd, {
      hostname: hostname2,
      port,
      transport: "tcp"
    }, _listen(server, waitFor));
    return listener;
  };
  listenTls.listenTls = listenTls$1;
  return listenTls;
}
var loadavg = {};
var hasRequiredLoadavg;
function requireLoadavg() {
  if (hasRequiredLoadavg) return loadavg;
  hasRequiredLoadavg = 1;
  var __createBinding = loadavg && loadavg.__createBinding || (Object.create ? (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  }) : (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    o[k2] = m[k];
  }));
  var __setModuleDefault = loadavg && loadavg.__setModuleDefault || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  }) : function(o, v) {
    o["default"] = v;
  });
  var __importStar = loadavg && loadavg.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  Object.defineProperty(loadavg, "__esModule", { value: true });
  loadavg.loadavg = void 0;
  const os = __importStar(require$$0$3);
  const loadavg$1 = function loadavg2() {
    return os.loadavg();
  };
  loadavg.loadavg = loadavg$1;
  return loadavg;
}
var lstat = {};
var hasRequiredLstat;
function requireLstat() {
  if (hasRequiredLstat) return lstat;
  hasRequiredLstat = 1;
  var __createBinding = lstat && lstat.__createBinding || (Object.create ? (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  }) : (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    o[k2] = m[k];
  }));
  var __setModuleDefault = lstat && lstat.__setModuleDefault || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  }) : function(o, v) {
    o["default"] = v;
  });
  var __importStar = lstat && lstat.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  var __importDefault = lstat && lstat.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(lstat, "__esModule", { value: true });
  lstat.lstat = void 0;
  const fs = __importStar(require$$0$5);
  const stat_js_1 = requireStat();
  const errorMap_js_1 = __importDefault(requireErrorMap());
  const lstat$1 = async (path) => {
    try {
      return (0, stat_js_1.denoifyFileInfo)(await fs.lstat(path));
    } catch (e) {
      throw (0, errorMap_js_1.default)(e);
    }
  };
  lstat.lstat = lstat$1;
  return lstat;
}
var lstatSync = {};
var hasRequiredLstatSync;
function requireLstatSync() {
  if (hasRequiredLstatSync) return lstatSync;
  hasRequiredLstatSync = 1;
  var __createBinding = lstatSync && lstatSync.__createBinding || (Object.create ? (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  }) : (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    o[k2] = m[k];
  }));
  var __setModuleDefault = lstatSync && lstatSync.__setModuleDefault || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  }) : function(o, v) {
    o["default"] = v;
  });
  var __importStar = lstatSync && lstatSync.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  var __importDefault = lstatSync && lstatSync.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(lstatSync, "__esModule", { value: true });
  lstatSync.lstatSync = void 0;
  const fs = __importStar(require$$0);
  const stat_js_1 = requireStat();
  const errorMap_js_1 = __importDefault(requireErrorMap());
  const lstatSync$1 = (path) => {
    try {
      return (0, stat_js_1.denoifyFileInfo)(fs.lstatSync(path));
    } catch (err) {
      throw (0, errorMap_js_1.default)(err);
    }
  };
  lstatSync.lstatSync = lstatSync$1;
  return lstatSync;
}
var makeTempDir = {};
var hasRequiredMakeTempDir;
function requireMakeTempDir() {
  if (hasRequiredMakeTempDir) return makeTempDir;
  hasRequiredMakeTempDir = 1;
  Object.defineProperty(makeTempDir, "__esModule", { value: true });
  makeTempDir.makeTempDir = void 0;
  const promises_1 = require$$0$5;
  const path_1 = require$$1$5;
  const os_1 = require$$0$3;
  const makeTempDir$1 = function makeTempDir2({ prefix = "" } = {}) {
    return (0, promises_1.mkdtemp)((0, path_1.join)((0, os_1.tmpdir)(), prefix || "/"));
  };
  makeTempDir.makeTempDir = makeTempDir$1;
  return makeTempDir;
}
var makeTempDirSync = {};
var hasRequiredMakeTempDirSync;
function requireMakeTempDirSync() {
  if (hasRequiredMakeTempDirSync) return makeTempDirSync;
  hasRequiredMakeTempDirSync = 1;
  Object.defineProperty(makeTempDirSync, "__esModule", { value: true });
  makeTempDirSync.makeTempDirSync = void 0;
  const fs_1 = require$$0;
  const path_1 = require$$1$5;
  const os_1 = require$$0$3;
  const makeTempDirSync$1 = function makeTempDirSync2({ prefix = "" } = {}) {
    return (0, fs_1.mkdtempSync)((0, path_1.join)((0, os_1.tmpdir)(), prefix || "/"));
  };
  makeTempDirSync.makeTempDirSync = makeTempDirSync$1;
  return makeTempDirSync;
}
var makeTempFile = {};
var random_id = {};
var hasRequiredRandom_id;
function requireRandom_id() {
  if (hasRequiredRandom_id) return random_id;
  hasRequiredRandom_id = 1;
  Object.defineProperty(random_id, "__esModule", { value: true });
  random_id.randomId = void 0;
  const randomId = () => {
    const n = (Math.random() * 1048575 * 1e6).toString(16);
    return "" + n.slice(0, 6);
  };
  random_id.randomId = randomId;
  return random_id;
}
var writeTextFile = {};
var hasRequiredWriteTextFile;
function requireWriteTextFile() {
  if (hasRequiredWriteTextFile) return writeTextFile;
  hasRequiredWriteTextFile = 1;
  var __createBinding = writeTextFile && writeTextFile.__createBinding || (Object.create ? (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  }) : (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    o[k2] = m[k];
  }));
  var __setModuleDefault = writeTextFile && writeTextFile.__setModuleDefault || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  }) : function(o, v) {
    o["default"] = v;
  });
  var __importStar = writeTextFile && writeTextFile.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  var __importDefault = writeTextFile && writeTextFile.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(writeTextFile, "__esModule", { value: true });
  writeTextFile.writeTextFile = void 0;
  const fs = __importStar(require$$0$5);
  const errorMap_js_1 = __importDefault(requireErrorMap());
  const fs_flags_js_1 = requireFs_flags();
  const writeTextFile$1 = async function writeTextFile2(path, data, { append = false, create: create2 = true, createNew = false, mode, signal } = {}) {
    const truncate2 = create2 && !append;
    const flag = (0, fs_flags_js_1.getFsFlag)({
      append,
      create: create2,
      createNew,
      truncate: truncate2,
      write: true
    });
    try {
      await fs.writeFile(path, data, { flag, mode, signal });
      if (mode !== void 0)
        await fs.chmod(path, mode);
    } catch (error) {
      throw (0, errorMap_js_1.default)(error);
    }
  };
  writeTextFile.writeTextFile = writeTextFile$1;
  return writeTextFile;
}
var hasRequiredMakeTempFile;
function requireMakeTempFile() {
  if (hasRequiredMakeTempFile) return makeTempFile;
  hasRequiredMakeTempFile = 1;
  Object.defineProperty(makeTempFile, "__esModule", { value: true });
  makeTempFile.makeTempFile = void 0;
  const os_1 = require$$0$3;
  const path_1 = require$$1$5;
  const random_id_js_1 = requireRandom_id();
  const writeTextFile_js_1 = requireWriteTextFile();
  const makeTempFile$1 = async function makeTempFile2({ prefix = "" } = {}) {
    const name = (0, path_1.join)((0, os_1.tmpdir)(), prefix, (0, random_id_js_1.randomId)());
    await (0, writeTextFile_js_1.writeTextFile)(name, "");
    return name;
  };
  makeTempFile.makeTempFile = makeTempFile$1;
  return makeTempFile;
}
var makeTempFileSync = {};
var writeTextFileSync = {};
var hasRequiredWriteTextFileSync;
function requireWriteTextFileSync() {
  if (hasRequiredWriteTextFileSync) return writeTextFileSync;
  hasRequiredWriteTextFileSync = 1;
  var __createBinding = writeTextFileSync && writeTextFileSync.__createBinding || (Object.create ? (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  }) : (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    o[k2] = m[k];
  }));
  var __setModuleDefault = writeTextFileSync && writeTextFileSync.__setModuleDefault || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  }) : function(o, v) {
    o["default"] = v;
  });
  var __importStar = writeTextFileSync && writeTextFileSync.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  var __importDefault = writeTextFileSync && writeTextFileSync.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(writeTextFileSync, "__esModule", { value: true });
  writeTextFileSync.writeTextFileSync = void 0;
  const fs = __importStar(require$$0);
  const errorMap_js_1 = __importDefault(requireErrorMap());
  const writeTextFileSync$1 = (path, data, { append = false, create: create2 = true, mode } = {}) => {
    const flag = create2 ? append ? "a" : "w" : "r+";
    try {
      fs.writeFileSync(path, data, { flag, mode });
      if (mode !== void 0)
        fs.chmodSync(path, mode);
    } catch (error) {
      throw (0, errorMap_js_1.default)(error);
    }
  };
  writeTextFileSync.writeTextFileSync = writeTextFileSync$1;
  return writeTextFileSync;
}
var hasRequiredMakeTempFileSync;
function requireMakeTempFileSync() {
  if (hasRequiredMakeTempFileSync) return makeTempFileSync;
  hasRequiredMakeTempFileSync = 1;
  Object.defineProperty(makeTempFileSync, "__esModule", { value: true });
  makeTempFileSync.makeTempFileSync = void 0;
  const os_1 = require$$0$3;
  const path_1 = require$$1$5;
  const random_id_js_1 = requireRandom_id();
  const writeTextFileSync_js_1 = requireWriteTextFileSync();
  const makeTempFileSync$1 = function makeTempFileSync2({ prefix = "" } = {}) {
    const name = (0, path_1.join)((0, os_1.tmpdir)(), prefix, (0, random_id_js_1.randomId)());
    (0, writeTextFileSync_js_1.writeTextFileSync)(name, "");
    return name;
  };
  makeTempFileSync.makeTempFileSync = makeTempFileSync$1;
  return makeTempFileSync;
}
var memoryUsage = {};
var hasRequiredMemoryUsage;
function requireMemoryUsage() {
  if (hasRequiredMemoryUsage) return memoryUsage;
  hasRequiredMemoryUsage = 1;
  Object.defineProperty(memoryUsage, "__esModule", { value: true });
  memoryUsage.memoryUsage = void 0;
  memoryUsage.memoryUsage = process.memoryUsage;
  return memoryUsage;
}
var mkdir = {};
var hasRequiredMkdir;
function requireMkdir() {
  if (hasRequiredMkdir) return mkdir;
  hasRequiredMkdir = 1;
  var __importDefault = mkdir && mkdir.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(mkdir, "__esModule", { value: true });
  mkdir.mkdir = void 0;
  const promises_1 = require$$0$5;
  const errorMap_js_1 = __importDefault(requireErrorMap());
  const variables_js_1 = requireVariables();
  const mkdir$1 = async function mkdir2(path, options) {
    try {
      await (0, promises_1.mkdir)(path, options);
    } catch (error) {
      if ((error === null || error === void 0 ? void 0 : error.code) === "EEXIST") {
        throw new variables_js_1.errors.AlreadyExists(`File exists (os error 17), mkdir '${path}'`);
      }
      throw (0, errorMap_js_1.default)(error);
    }
  };
  mkdir.mkdir = mkdir$1;
  return mkdir;
}
var mkdirSync = {};
var hasRequiredMkdirSync;
function requireMkdirSync() {
  if (hasRequiredMkdirSync) return mkdirSync;
  hasRequiredMkdirSync = 1;
  var __createBinding = mkdirSync && mkdirSync.__createBinding || (Object.create ? (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  }) : (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    o[k2] = m[k];
  }));
  var __setModuleDefault = mkdirSync && mkdirSync.__setModuleDefault || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  }) : function(o, v) {
    o["default"] = v;
  });
  var __importStar = mkdirSync && mkdirSync.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  var __importDefault = mkdirSync && mkdirSync.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(mkdirSync, "__esModule", { value: true });
  mkdirSync.mkdirSync = void 0;
  const fs = __importStar(require$$0);
  const errorMap_js_1 = __importDefault(requireErrorMap());
  const variables_js_1 = requireVariables();
  const mkdirSync$1 = (path, options) => {
    try {
      fs.mkdirSync(path, options);
    } catch (error) {
      if ((error === null || error === void 0 ? void 0 : error.code) === "EEXIST") {
        throw new variables_js_1.errors.AlreadyExists(`File exists (os error 17), mkdir '${path}'`);
      }
      throw (0, errorMap_js_1.default)(error);
    }
  };
  mkdirSync.mkdirSync = mkdirSync$1;
  return mkdirSync;
}
var osRelease = {};
var hasRequiredOsRelease;
function requireOsRelease() {
  if (hasRequiredOsRelease) return osRelease;
  hasRequiredOsRelease = 1;
  Object.defineProperty(osRelease, "__esModule", { value: true });
  osRelease.osRelease = void 0;
  const os_1 = require$$0$3;
  const osRelease$1 = function osRelease2() {
    return (0, os_1.release)();
  };
  osRelease.osRelease = osRelease$1;
  return osRelease;
}
var osUptime = {};
var hasRequiredOsUptime;
function requireOsUptime() {
  if (hasRequiredOsUptime) return osUptime;
  hasRequiredOsUptime = 1;
  Object.defineProperty(osUptime, "__esModule", { value: true });
  osUptime.osUptime = void 0;
  const os_1 = require$$0$3;
  const osUptime$1 = function osUptime2() {
    return (0, os_1.uptime)();
  };
  osUptime.osUptime = osUptime$1;
  return osUptime;
}
var readDir = {};
var hasRequiredReadDir;
function requireReadDir() {
  if (hasRequiredReadDir) return readDir;
  hasRequiredReadDir = 1;
  var __importDefault = readDir && readDir.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(readDir, "__esModule", { value: true });
  readDir.readDir = void 0;
  const promises_1 = require$$0$5;
  const errorMap_js_1 = __importDefault(requireErrorMap());
  const readDir$1 = async function* readDir2(path) {
    try {
      for await (const e of await (0, promises_1.opendir)(String(path))) {
        const ent = {
          name: e.name,
          isFile: e.isFile(),
          isDirectory: e.isDirectory(),
          isSymlink: e.isSymbolicLink()
        };
        yield ent;
      }
    } catch (e) {
      throw (0, errorMap_js_1.default)(e);
    }
  };
  readDir.readDir = readDir$1;
  return readDir;
}
var readDirSync = {};
var hasRequiredReadDirSync;
function requireReadDirSync() {
  if (hasRequiredReadDirSync) return readDirSync;
  hasRequiredReadDirSync = 1;
  var __importDefault = readDirSync && readDirSync.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(readDirSync, "__esModule", { value: true });
  readDirSync.readDirSync = void 0;
  const fs_1 = require$$0;
  const errorMap_js_1 = __importDefault(requireErrorMap());
  const readDirSync$1 = function* readDir2(path) {
    try {
      for (const e of (0, fs_1.readdirSync)(String(path), { withFileTypes: true })) {
        const ent = {
          name: e.name,
          isFile: e.isFile(),
          isDirectory: e.isDirectory(),
          isSymlink: e.isSymbolicLink()
        };
        yield ent;
      }
    } catch (e) {
      throw (0, errorMap_js_1.default)(e);
    }
  };
  readDirSync.readDirSync = readDirSync$1;
  return readDirSync;
}
var readFile = {};
var hasRequiredReadFile;
function requireReadFile() {
  if (hasRequiredReadFile) return readFile;
  hasRequiredReadFile = 1;
  var __importDefault = readFile && readFile.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(readFile, "__esModule", { value: true });
  readFile.readFile = void 0;
  const promises_1 = require$$0$5;
  const errorMap_js_1 = __importDefault(requireErrorMap());
  const readFile$1 = async function readFile2(path, { signal } = {}) {
    try {
      const buf = await (0, promises_1.readFile)(path, { signal });
      return new Uint8Array(buf.buffer, buf.byteOffset, buf.length);
    } catch (e) {
      throw (0, errorMap_js_1.default)(e);
    }
  };
  readFile.readFile = readFile$1;
  return readFile;
}
var readFileSync = {};
var hasRequiredReadFileSync;
function requireReadFileSync() {
  if (hasRequiredReadFileSync) return readFileSync;
  hasRequiredReadFileSync = 1;
  var __importDefault = readFileSync && readFileSync.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(readFileSync, "__esModule", { value: true });
  readFileSync.readFileSync = void 0;
  const fs_1 = require$$0;
  const errorMap_js_1 = __importDefault(requireErrorMap());
  const readFileSync$1 = function readFileSync2(path) {
    try {
      const buf = (0, fs_1.readFileSync)(path);
      return new Uint8Array(buf.buffer, buf.byteOffset, buf.length);
    } catch (e) {
      throw (0, errorMap_js_1.default)(e);
    }
  };
  readFileSync.readFileSync = readFileSync$1;
  return readFileSync;
}
var readLink = {};
var hasRequiredReadLink;
function requireReadLink() {
  if (hasRequiredReadLink) return readLink;
  hasRequiredReadLink = 1;
  var __createBinding = readLink && readLink.__createBinding || (Object.create ? (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  }) : (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    o[k2] = m[k];
  }));
  var __setModuleDefault = readLink && readLink.__setModuleDefault || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  }) : function(o, v) {
    o["default"] = v;
  });
  var __importStar = readLink && readLink.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  Object.defineProperty(readLink, "__esModule", { value: true });
  readLink.readLink = void 0;
  const fs = __importStar(require$$0$5);
  readLink.readLink = fs.readlink;
  return readLink;
}
var readLinkSync = {};
var hasRequiredReadLinkSync;
function requireReadLinkSync() {
  if (hasRequiredReadLinkSync) return readLinkSync;
  hasRequiredReadLinkSync = 1;
  var __createBinding = readLinkSync && readLinkSync.__createBinding || (Object.create ? (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  }) : (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    o[k2] = m[k];
  }));
  var __setModuleDefault = readLinkSync && readLinkSync.__setModuleDefault || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  }) : function(o, v) {
    o["default"] = v;
  });
  var __importStar = readLinkSync && readLinkSync.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  Object.defineProperty(readLinkSync, "__esModule", { value: true });
  readLinkSync.readLinkSync = void 0;
  const fs = __importStar(require$$0);
  readLinkSync.readLinkSync = fs.readlinkSync;
  return readLinkSync;
}
var realPath = {};
var hasRequiredRealPath;
function requireRealPath() {
  if (hasRequiredRealPath) return realPath;
  hasRequiredRealPath = 1;
  var __createBinding = realPath && realPath.__createBinding || (Object.create ? (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  }) : (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    o[k2] = m[k];
  }));
  var __setModuleDefault = realPath && realPath.__setModuleDefault || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  }) : function(o, v) {
    o["default"] = v;
  });
  var __importStar = realPath && realPath.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  Object.defineProperty(realPath, "__esModule", { value: true });
  realPath.realPath = void 0;
  const fs = __importStar(require$$0$5);
  realPath.realPath = fs.realpath;
  return realPath;
}
var realPathSync = {};
var hasRequiredRealPathSync;
function requireRealPathSync() {
  if (hasRequiredRealPathSync) return realPathSync;
  hasRequiredRealPathSync = 1;
  var __createBinding = realPathSync && realPathSync.__createBinding || (Object.create ? (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  }) : (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    o[k2] = m[k];
  }));
  var __setModuleDefault = realPathSync && realPathSync.__setModuleDefault || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  }) : function(o, v) {
    o["default"] = v;
  });
  var __importStar = realPathSync && realPathSync.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  Object.defineProperty(realPathSync, "__esModule", { value: true });
  realPathSync.realPathSync = void 0;
  const fs = __importStar(require$$0);
  realPathSync.realPathSync = fs.realpathSync;
  return realPathSync;
}
var remove = {};
var hasRequiredRemove;
function requireRemove() {
  if (hasRequiredRemove) return remove;
  hasRequiredRemove = 1;
  Object.defineProperty(remove, "__esModule", { value: true });
  remove.remove = void 0;
  const promises_1 = require$$0$5;
  const remove$1 = async function remove2(path, options = {}) {
    const innerOptions = options.recursive ? { recursive: true, force: true } : {};
    try {
      return await (0, promises_1.rm)(path, innerOptions);
    } catch (err) {
      if (err.code === "ERR_FS_EISDIR") {
        return await (0, promises_1.rmdir)(path, innerOptions);
      } else {
        throw err;
      }
    }
  };
  remove.remove = remove$1;
  return remove;
}
var removeSignalListener = {};
var hasRequiredRemoveSignalListener;
function requireRemoveSignalListener() {
  if (hasRequiredRemoveSignalListener) return removeSignalListener;
  hasRequiredRemoveSignalListener = 1;
  var __importDefault = removeSignalListener && removeSignalListener.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(removeSignalListener, "__esModule", { value: true });
  removeSignalListener.removeSignalListener = void 0;
  const process_1 = __importDefault(require$$0$4);
  const removeSignalListener$1 = (signal, handler) => {
    process_1.default.removeListener(signal, handler);
  };
  removeSignalListener.removeSignalListener = removeSignalListener$1;
  return removeSignalListener;
}
var removeSync = {};
var hasRequiredRemoveSync;
function requireRemoveSync() {
  if (hasRequiredRemoveSync) return removeSync;
  hasRequiredRemoveSync = 1;
  var __createBinding = removeSync && removeSync.__createBinding || (Object.create ? (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  }) : (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    o[k2] = m[k];
  }));
  var __setModuleDefault = removeSync && removeSync.__setModuleDefault || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  }) : function(o, v) {
    o["default"] = v;
  });
  var __importStar = removeSync && removeSync.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  Object.defineProperty(removeSync, "__esModule", { value: true });
  removeSync.removeSync = void 0;
  const fs = __importStar(require$$0);
  const removeSync$1 = (path, options = {}) => {
    const innerOptions = options.recursive ? { recursive: true, force: true } : {};
    try {
      fs.rmSync(path, innerOptions);
    } catch (err) {
      if (err.code === "ERR_FS_EISDIR") {
        fs.rmdirSync(path, innerOptions);
      } else {
        throw err;
      }
    }
  };
  removeSync.removeSync = removeSync$1;
  return removeSync;
}
var rename = {};
var hasRequiredRename;
function requireRename() {
  if (hasRequiredRename) return rename;
  hasRequiredRename = 1;
  Object.defineProperty(rename, "__esModule", { value: true });
  rename.rename = void 0;
  const promises_1 = require$$0$5;
  const rename$1 = function rename2(oldpath, newpath) {
    return (0, promises_1.rename)(oldpath, newpath);
  };
  rename.rename = rename$1;
  return rename;
}
var renameSync = {};
var hasRequiredRenameSync;
function requireRenameSync() {
  if (hasRequiredRenameSync) return renameSync;
  hasRequiredRenameSync = 1;
  var __createBinding = renameSync && renameSync.__createBinding || (Object.create ? (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  }) : (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    o[k2] = m[k];
  }));
  var __setModuleDefault = renameSync && renameSync.__setModuleDefault || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  }) : function(o, v) {
    o["default"] = v;
  });
  var __importStar = renameSync && renameSync.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  Object.defineProperty(renameSync, "__esModule", { value: true });
  renameSync.renameSync = void 0;
  const fs = __importStar(require$$0);
  renameSync.renameSync = fs.renameSync;
  return renameSync;
}
var resolveDns = {};
var hasRequiredResolveDns;
function requireResolveDns() {
  if (hasRequiredResolveDns) return resolveDns;
  hasRequiredResolveDns = 1;
  var __importDefault = resolveDns && resolveDns.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(resolveDns, "__esModule", { value: true });
  resolveDns.resolveDns = void 0;
  const dns_1 = __importDefault(require$$0$8);
  const resolveDns$1 = function resolveDns2(query, recordType, options) {
    if (options) {
      throw Error(`resolveDns option not implemnted yet`);
    }
    switch (recordType) {
      case "A":
      /* falls through */
      case "AAAA":
      case "CNAME":
      case "NS":
      case "PTR":
        return new Promise((resolve, reject) => {
          dns_1.default.resolve(query, recordType, (err, addresses) => {
            if (err) {
              reject(err);
            } else {
              resolve(addresses);
            }
          });
        });
      case "ANAME":
      case "CAA":
      case "MX":
      case "NAPTR":
      case "SOA":
      case "SRV":
      case "TXT":
      default:
        throw Error(`resolveDns type ${recordType} not implemnted yet`);
    }
  };
  resolveDns.resolveDns = resolveDns$1;
  return resolveDns;
}
var run = {};
var streams = {};
var hasRequiredStreams;
function requireStreams() {
  if (hasRequiredStreams) return streams;
  hasRequiredStreams = 1;
  var __classPrivateFieldSet = streams && streams.__classPrivateFieldSet || function(receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
  };
  var __classPrivateFieldGet = streams && streams.__classPrivateFieldGet || function(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
  };
  var _BufferStreamReader_instances, _BufferStreamReader_stream, _BufferStreamReader_error, _BufferStreamReader_ended, _BufferStreamReader_pendingActions, _BufferStreamReader_runPendingActions, _StreamWriter_stream;
  Object.defineProperty(streams, "__esModule", { value: true });
  streams.StreamWriter = streams.BufferStreamReader = void 0;
  class BufferStreamReader {
    constructor(stream) {
      _BufferStreamReader_instances.add(this);
      _BufferStreamReader_stream.set(this, void 0);
      _BufferStreamReader_error.set(this, void 0);
      _BufferStreamReader_ended.set(this, false);
      _BufferStreamReader_pendingActions.set(this, []);
      __classPrivateFieldSet(this, _BufferStreamReader_stream, stream, "f");
      __classPrivateFieldGet(this, _BufferStreamReader_stream, "f").pause();
      __classPrivateFieldGet(this, _BufferStreamReader_stream, "f").on("error", (error) => {
        __classPrivateFieldSet(this, _BufferStreamReader_error, error, "f");
        __classPrivateFieldGet(this, _BufferStreamReader_instances, "m", _BufferStreamReader_runPendingActions).call(this);
      });
      __classPrivateFieldGet(this, _BufferStreamReader_stream, "f").on("readable", () => {
        __classPrivateFieldGet(this, _BufferStreamReader_instances, "m", _BufferStreamReader_runPendingActions).call(this);
      });
      __classPrivateFieldGet(this, _BufferStreamReader_stream, "f").on("end", () => {
        __classPrivateFieldSet(this, _BufferStreamReader_ended, true, "f");
        __classPrivateFieldGet(this, _BufferStreamReader_instances, "m", _BufferStreamReader_runPendingActions).call(this);
      });
    }
    readAll() {
      return new Promise((resolve, reject) => {
        const chunks = [];
        const action = () => {
          if (__classPrivateFieldGet(this, _BufferStreamReader_error, "f")) {
            reject(__classPrivateFieldGet(this, _BufferStreamReader_error, "f"));
            return;
          }
          const buffer = __classPrivateFieldGet(this, _BufferStreamReader_stream, "f").read();
          if (buffer != null) {
            chunks.push(buffer);
            __classPrivateFieldGet(this, _BufferStreamReader_pendingActions, "f").push(action);
          } else if (__classPrivateFieldGet(this, _BufferStreamReader_ended, "f")) {
            const result = Buffer.concat(chunks);
            resolve(result);
          } else {
            __classPrivateFieldGet(this, _BufferStreamReader_pendingActions, "f").push(action);
          }
        };
        action();
      });
    }
    read(p) {
      return new Promise((resolve, reject) => {
        const action = () => {
          if (__classPrivateFieldGet(this, _BufferStreamReader_error, "f")) {
            reject(__classPrivateFieldGet(this, _BufferStreamReader_error, "f"));
            return;
          }
          const readBuffer = __classPrivateFieldGet(this, _BufferStreamReader_stream, "f").read(p.byteLength);
          if (readBuffer && readBuffer.byteLength > 0) {
            readBuffer.copy(p, 0, 0, readBuffer.byteLength);
            resolve(readBuffer.byteLength);
            return;
          }
          if (__classPrivateFieldGet(this, _BufferStreamReader_ended, "f")) {
            resolve(null);
          } else {
            __classPrivateFieldGet(this, _BufferStreamReader_pendingActions, "f").push(action);
          }
        };
        action();
      });
    }
  }
  streams.BufferStreamReader = BufferStreamReader;
  _BufferStreamReader_stream = /* @__PURE__ */ new WeakMap(), _BufferStreamReader_error = /* @__PURE__ */ new WeakMap(), _BufferStreamReader_ended = /* @__PURE__ */ new WeakMap(), _BufferStreamReader_pendingActions = /* @__PURE__ */ new WeakMap(), _BufferStreamReader_instances = /* @__PURE__ */ new WeakSet(), _BufferStreamReader_runPendingActions = function _BufferStreamReader_runPendingActions2() {
    const errors2 = [];
    for (const action of __classPrivateFieldGet(this, _BufferStreamReader_pendingActions, "f").splice(0)) {
      try {
        action();
      } catch (err) {
        errors2.push(err);
      }
    }
    if (errors2.length > 0) {
      throw errors2.length > 1 ? new globalThis.AggregateError(errors2) : errors2[0];
    }
  };
  class StreamWriter {
    constructor(stream) {
      _StreamWriter_stream.set(this, void 0);
      __classPrivateFieldSet(this, _StreamWriter_stream, stream, "f");
    }
    write(p) {
      return new Promise((resolve, reject) => {
        __classPrivateFieldGet(this, _StreamWriter_stream, "f").write(p, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(p.byteLength);
          }
        });
      });
    }
  }
  streams.StreamWriter = StreamWriter;
  _StreamWriter_stream = /* @__PURE__ */ new WeakMap();
  return streams;
}
var hasRequiredRun;
function requireRun() {
  if (hasRequiredRun) return run;
  hasRequiredRun = 1;
  var __createBinding = run && run.__createBinding || (Object.create ? (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  }) : (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    o[k2] = m[k];
  }));
  var __setModuleDefault = run && run.__setModuleDefault || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  }) : function(o, v) {
    o["default"] = v;
  });
  var __importStar = run && run.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  var __classPrivateFieldSet = run && run.__classPrivateFieldSet || function(receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
  };
  var __classPrivateFieldGet = run && run.__classPrivateFieldGet || function(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
  };
  var __importDefault = run && run.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  var _Process_process, _Process_stderr, _Process_stdout, _Process_stdin, _Process_status, _Process_receivedStatus, _ProcessReadStream_stream, _ProcessReadStream_bufferStreamReader, _ProcessReadStream_closed, _ProcessWriteStream_stream, _ProcessWriteStream_streamWriter, _ProcessWriteStream_closed;
  Object.defineProperty(run, "__esModule", { value: true });
  run.Process = run.run = void 0;
  const child_process_1 = __importDefault(require$$0$9);
  const fs_1 = __importDefault(require$$0);
  const os_1 = __importDefault(require$$0$3);
  const url_1 = __importDefault(require$$1$4);
  const events_1 = require$$0$2;
  const which_1 = __importDefault(requireLib());
  const streams_js_1 = requireStreams();
  const errors2 = __importStar(requireErrors());
  const run$1 = function run2(options) {
    const [cmd, ...args2] = options.cmd;
    if (options.cwd && !fs_1.default.existsSync(options.cwd)) {
      throw new Error("The directory name is invalid.");
    }
    const commandName = getCmd(cmd);
    if (!which_1.default.sync(commandName, { nothrow: true })) {
      throw new errors2.NotFound("The system cannot find the file specified.");
    }
    const process2 = child_process_1.default.spawn(commandName, args2, {
      cwd: options.cwd,
      env: getEnv(options),
      uid: options.uid,
      gid: options.gid,
      shell: false,
      stdio: [
        getStdio(options.stdin, "in"),
        getStdio(options.stdout, "out"),
        getStdio(options.stderr, "out")
      ]
    });
    return new Process(process2);
  };
  run.run = run$1;
  function getStdio(value, kind) {
    if (value === "inherit" || value == null) {
      return "inherit";
    } else if (value === "piped") {
      return "pipe";
    } else if (value === "null") {
      return "ignore";
    } else if (typeof value === "number") {
      switch (kind) {
        case "in":
          return fs_1.default.createReadStream(null, { fd: value });
        case "out":
          return fs_1.default.createWriteStream(null, { fd: value });
        default: {
          throw new Error("Unreachable.");
        }
      }
    } else {
      throw new Error("Unknown value.");
    }
  }
  function getCmd(firstArg) {
    if (firstArg instanceof URL) {
      return url_1.default.fileURLToPath(firstArg);
    } else {
      return firstArg;
    }
  }
  function getEnv(options) {
    var _a;
    const env2 = (_a = options.env) !== null && _a !== void 0 ? _a : {};
    for (const name in process.env) {
      if (!Object.prototype.hasOwnProperty.call(env2, name)) {
        if (options.clearEnv) {
          if (os_1.default.platform() === "win32") {
            env2[name] = "";
          } else {
            delete env2[name];
          }
        } else {
          env2[name] = process.env[name];
        }
      }
    }
    return env2;
  }
  class Process {
    /** @internal */
    constructor(process2) {
      var _a, _b, _c;
      _Process_process.set(this, void 0);
      _Process_stderr.set(this, void 0);
      _Process_stdout.set(this, void 0);
      _Process_stdin.set(this, void 0);
      _Process_status.set(this, void 0);
      _Process_receivedStatus.set(this, false);
      __classPrivateFieldSet(this, _Process_process, process2, "f");
      __classPrivateFieldSet(this, _Process_stdout, (_a = ProcessReadStream.fromNullable(__classPrivateFieldGet(this, _Process_process, "f").stdout)) !== null && _a !== void 0 ? _a : null, "f");
      __classPrivateFieldSet(this, _Process_stderr, (_b = ProcessReadStream.fromNullable(__classPrivateFieldGet(this, _Process_process, "f").stderr)) !== null && _b !== void 0 ? _b : null, "f");
      __classPrivateFieldSet(this, _Process_stdin, (_c = ProcessWriteStream.fromNullable(__classPrivateFieldGet(this, _Process_process, "f").stdin)) !== null && _c !== void 0 ? _c : null, "f");
      __classPrivateFieldSet(this, _Process_status, (0, events_1.once)(process2, "exit"), "f");
    }
    get rid() {
      return NaN;
    }
    get pid() {
      return __classPrivateFieldGet(this, _Process_process, "f").pid;
    }
    get stdin() {
      return __classPrivateFieldGet(this, _Process_stdin, "f");
    }
    get stdout() {
      return __classPrivateFieldGet(this, _Process_stdout, "f");
    }
    get stderr() {
      return __classPrivateFieldGet(this, _Process_stderr, "f");
    }
    async status() {
      const [receivedCode, signalName] = await __classPrivateFieldGet(this, _Process_status, "f");
      const signal = signalName ? os_1.default.constants.signals[signalName] : receivedCode > 128 ? receivedCode - 128 : void 0;
      const code = receivedCode != null ? receivedCode : signal != null ? 128 + signal : void 0;
      const success = code === 0;
      __classPrivateFieldSet(this, _Process_receivedStatus, true, "f");
      return { code, signal, success };
    }
    async output() {
      if (!__classPrivateFieldGet(this, _Process_stdout, "f")) {
        throw new TypeError("stdout was not piped");
      }
      const result = await __classPrivateFieldGet(this, _Process_stdout, "f").readAll();
      __classPrivateFieldGet(this, _Process_stdout, "f").close();
      return result;
    }
    async stderrOutput() {
      if (!__classPrivateFieldGet(this, _Process_stderr, "f")) {
        throw new TypeError("stderr was not piped");
      }
      const result = await __classPrivateFieldGet(this, _Process_stderr, "f").readAll();
      __classPrivateFieldGet(this, _Process_stderr, "f").close();
      return result;
    }
    close() {
      __classPrivateFieldGet(this, _Process_process, "f").unref();
      __classPrivateFieldGet(this, _Process_process, "f").kill();
    }
    kill(signo = "SIGTERM") {
      if (__classPrivateFieldGet(this, _Process_receivedStatus, "f")) {
        throw new errors2.NotFound("entity not found");
      }
      __classPrivateFieldGet(this, _Process_process, "f").kill(signo);
    }
  }
  run.Process = Process;
  _Process_process = /* @__PURE__ */ new WeakMap(), _Process_stderr = /* @__PURE__ */ new WeakMap(), _Process_stdout = /* @__PURE__ */ new WeakMap(), _Process_stdin = /* @__PURE__ */ new WeakMap(), _Process_status = /* @__PURE__ */ new WeakMap(), _Process_receivedStatus = /* @__PURE__ */ new WeakMap();
  class ProcessReadStream {
    constructor(stream) {
      _ProcessReadStream_stream.set(this, void 0);
      _ProcessReadStream_bufferStreamReader.set(this, void 0);
      _ProcessReadStream_closed.set(this, false);
      __classPrivateFieldSet(this, _ProcessReadStream_stream, stream, "f");
      __classPrivateFieldSet(this, _ProcessReadStream_bufferStreamReader, new streams_js_1.BufferStreamReader(stream), "f");
    }
    static fromNullable(stream) {
      return stream ? new ProcessReadStream(stream) : void 0;
    }
    readAll() {
      if (__classPrivateFieldGet(this, _ProcessReadStream_closed, "f")) {
        return Promise.resolve(new Uint8Array(0));
      } else {
        return __classPrivateFieldGet(this, _ProcessReadStream_bufferStreamReader, "f").readAll();
      }
    }
    read(p) {
      if (__classPrivateFieldGet(this, _ProcessReadStream_closed, "f")) {
        return Promise.resolve(null);
      } else {
        return __classPrivateFieldGet(this, _ProcessReadStream_bufferStreamReader, "f").read(p);
      }
    }
    close() {
      __classPrivateFieldSet(this, _ProcessReadStream_closed, true, "f");
      __classPrivateFieldGet(this, _ProcessReadStream_stream, "f").destroy();
    }
    get readable() {
      throw new Error("Not implemented.");
    }
    get writable() {
      throw new Error("Not implemented.");
    }
  }
  _ProcessReadStream_stream = /* @__PURE__ */ new WeakMap(), _ProcessReadStream_bufferStreamReader = /* @__PURE__ */ new WeakMap(), _ProcessReadStream_closed = /* @__PURE__ */ new WeakMap();
  class ProcessWriteStream {
    constructor(stream) {
      _ProcessWriteStream_stream.set(this, void 0);
      _ProcessWriteStream_streamWriter.set(this, void 0);
      _ProcessWriteStream_closed.set(this, false);
      __classPrivateFieldSet(this, _ProcessWriteStream_stream, stream, "f");
      __classPrivateFieldSet(this, _ProcessWriteStream_streamWriter, new streams_js_1.StreamWriter(stream), "f");
    }
    static fromNullable(stream) {
      return stream ? new ProcessWriteStream(stream) : void 0;
    }
    write(p) {
      if (__classPrivateFieldGet(this, _ProcessWriteStream_closed, "f")) {
        return Promise.resolve(0);
      } else {
        return __classPrivateFieldGet(this, _ProcessWriteStream_streamWriter, "f").write(p);
      }
    }
    close() {
      __classPrivateFieldSet(this, _ProcessWriteStream_closed, true, "f");
      __classPrivateFieldGet(this, _ProcessWriteStream_stream, "f").end();
    }
  }
  _ProcessWriteStream_stream = /* @__PURE__ */ new WeakMap(), _ProcessWriteStream_streamWriter = /* @__PURE__ */ new WeakMap(), _ProcessWriteStream_closed = /* @__PURE__ */ new WeakMap();
  return run;
}
var shutdown = {};
var hasRequiredShutdown;
function requireShutdown() {
  if (hasRequiredShutdown) return shutdown;
  hasRequiredShutdown = 1;
  Object.defineProperty(shutdown, "__esModule", { value: true });
  shutdown.shutdown = void 0;
  const net_1 = require$$0$6;
  const shutdown$1 = async function shutdown2(rid) {
    await new Promise((resolve) => new net_1.Socket({ fd: rid }).end(resolve));
  };
  shutdown.shutdown = shutdown$1;
  return shutdown;
}
var statSync = {};
var hasRequiredStatSync;
function requireStatSync() {
  if (hasRequiredStatSync) return statSync;
  hasRequiredStatSync = 1;
  var __createBinding = statSync && statSync.__createBinding || (Object.create ? (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  }) : (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    o[k2] = m[k];
  }));
  var __setModuleDefault = statSync && statSync.__setModuleDefault || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  }) : function(o, v) {
    o["default"] = v;
  });
  var __importStar = statSync && statSync.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  var __importDefault = statSync && statSync.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(statSync, "__esModule", { value: true });
  statSync.statSync = void 0;
  const fs = __importStar(require$$0);
  const stat_js_1 = requireStat();
  const errorMap_js_1 = __importDefault(requireErrorMap());
  const statSync$1 = (path) => {
    try {
      return (0, stat_js_1.denoifyFileInfo)(fs.statSync(path));
    } catch (err) {
      throw (0, errorMap_js_1.default)(err);
    }
  };
  statSync.statSync = statSync$1;
  return statSync;
}
var symlink = {};
var hasRequiredSymlink;
function requireSymlink() {
  if (hasRequiredSymlink) return symlink;
  hasRequiredSymlink = 1;
  var __createBinding = symlink && symlink.__createBinding || (Object.create ? (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  }) : (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    o[k2] = m[k];
  }));
  var __setModuleDefault = symlink && symlink.__setModuleDefault || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  }) : function(o, v) {
    o["default"] = v;
  });
  var __importStar = symlink && symlink.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  Object.defineProperty(symlink, "__esModule", { value: true });
  symlink.symlink = void 0;
  const fs = __importStar(require$$0$5);
  const symlink$1 = async (oldpath, newpath, options) => await fs.symlink(oldpath, newpath, options === null || options === void 0 ? void 0 : options.type);
  symlink.symlink = symlink$1;
  return symlink;
}
var symlinkSync = {};
var hasRequiredSymlinkSync;
function requireSymlinkSync() {
  if (hasRequiredSymlinkSync) return symlinkSync;
  hasRequiredSymlinkSync = 1;
  var __createBinding = symlinkSync && symlinkSync.__createBinding || (Object.create ? (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  }) : (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    o[k2] = m[k];
  }));
  var __setModuleDefault = symlinkSync && symlinkSync.__setModuleDefault || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  }) : function(o, v) {
    o["default"] = v;
  });
  var __importStar = symlinkSync && symlinkSync.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  Object.defineProperty(symlinkSync, "__esModule", { value: true });
  symlinkSync.symlinkSync = void 0;
  const fs = __importStar(require$$0);
  const symlinkSync$1 = (oldpath, newpath, options) => fs.symlinkSync(oldpath, newpath, options === null || options === void 0 ? void 0 : options.type);
  symlinkSync.symlinkSync = symlinkSync$1;
  return symlinkSync;
}
var test = {};
var hasRequiredTest;
function requireTest() {
  if (hasRequiredTest) return test;
  hasRequiredTest = 1;
  (function(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.test = void 0;
    var shim_deno_test_1 = requireDist$1();
    Object.defineProperty(exports, "test", { enumerable: true, get: function() {
      return shim_deno_test_1.test;
    } });
  })(test);
  return test;
}
var truncate = {};
var hasRequiredTruncate;
function requireTruncate() {
  if (hasRequiredTruncate) return truncate;
  hasRequiredTruncate = 1;
  var __createBinding = truncate && truncate.__createBinding || (Object.create ? (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  }) : (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    o[k2] = m[k];
  }));
  var __setModuleDefault = truncate && truncate.__setModuleDefault || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  }) : function(o, v) {
    o["default"] = v;
  });
  var __importStar = truncate && truncate.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  var __importDefault = truncate && truncate.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(truncate, "__esModule", { value: true });
  truncate.truncate = void 0;
  const fs = __importStar(require$$0$5);
  const errorMap_js_1 = __importDefault(requireErrorMap());
  const variables_js_1 = requireVariables();
  const truncate$1 = async (name, len) => {
    try {
      return await fs.truncate(name, len);
    } catch (error) {
      if ((error === null || error === void 0 ? void 0 : error.code) === "ENOENT") {
        throw new variables_js_1.errors.NotFound(`No such file or directory (os error 2), truncate '${name}'`);
      }
      throw (0, errorMap_js_1.default)(error);
    }
  };
  truncate.truncate = truncate$1;
  return truncate;
}
var truncateSync = {};
var hasRequiredTruncateSync;
function requireTruncateSync() {
  if (hasRequiredTruncateSync) return truncateSync;
  hasRequiredTruncateSync = 1;
  var __createBinding = truncateSync && truncateSync.__createBinding || (Object.create ? (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  }) : (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    o[k2] = m[k];
  }));
  var __setModuleDefault = truncateSync && truncateSync.__setModuleDefault || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  }) : function(o, v) {
    o["default"] = v;
  });
  var __importStar = truncateSync && truncateSync.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  var __importDefault = truncateSync && truncateSync.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(truncateSync, "__esModule", { value: true });
  truncateSync.truncateSync = void 0;
  const fs = __importStar(require$$0);
  const errorMap_js_1 = __importDefault(requireErrorMap());
  const variables_js_1 = requireVariables();
  const truncateSync$1 = (name, len) => {
    try {
      return fs.truncateSync(name, len);
    } catch (error) {
      if ((error === null || error === void 0 ? void 0 : error.code) === "ENOENT") {
        throw new variables_js_1.errors.NotFound(`No such file or directory (os error 2), truncate '${name}'`);
      }
      throw (0, errorMap_js_1.default)(error);
    }
  };
  truncateSync.truncateSync = truncateSync$1;
  return truncateSync;
}
var uid = {};
var hasRequiredUid;
function requireUid() {
  if (hasRequiredUid) return uid;
  hasRequiredUid = 1;
  var __importDefault = uid && uid.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  var _a;
  Object.defineProperty(uid, "__esModule", { value: true });
  uid.uid = void 0;
  const process_1 = __importDefault(require$$0$4);
  uid.uid = (_a = process_1.default.getuid) !== null && _a !== void 0 ? _a : (() => null);
  return uid;
}
var watchFs = {};
var iterutil = {};
var hasRequiredIterutil;
function requireIterutil() {
  if (hasRequiredIterutil) return iterutil;
  hasRequiredIterutil = 1;
  Object.defineProperty(iterutil, "__esModule", { value: true });
  iterutil.merge = iterutil.filterAsync = iterutil.mapAsync = iterutil.map = void 0;
  function* map(iter, f) {
    for (const i of iter) {
      yield f(i);
    }
  }
  iterutil.map = map;
  async function* mapAsync(iter, f) {
    for await (const i of iter) {
      yield f(i);
    }
  }
  iterutil.mapAsync = mapAsync;
  async function* filterAsync(iter, filter) {
    for await (const i of iter) {
      if (filter(i)) {
        yield i;
      }
    }
  }
  iterutil.filterAsync = filterAsync;
  async function* merge(iterables) {
    const racers = new Map(map(map(iterables, (iter) => iter[Symbol.asyncIterator]()), (iter) => [iter, iter.next()]));
    while (racers.size > 0) {
      const winner = await Promise.race(map(racers.entries(), ([iter, prom]) => prom.then((result) => ({ result, iter }))));
      if (winner.result.done) {
        racers.delete(winner.iter);
      } else {
        yield await winner.result.value;
        racers.set(winner.iter, winner.iter.next());
      }
    }
  }
  iterutil.merge = merge;
  return iterutil;
}
var hasRequiredWatchFs;
function requireWatchFs() {
  if (hasRequiredWatchFs) return watchFs;
  hasRequiredWatchFs = 1;
  Object.defineProperty(watchFs, "__esModule", { value: true });
  watchFs.watchFs = void 0;
  const promises_1 = require$$0$5;
  const path_1 = require$$1$5;
  const iterutil_js_1 = requireIterutil();
  const watchFs$1 = function watchFs2(paths, options = { recursive: true }) {
    paths = Array.isArray(paths) ? paths : [paths];
    const ac = new AbortController();
    const { signal } = ac;
    const rid = -1;
    const masterWatcher = (0, iterutil_js_1.merge)(paths.map((path) => (0, iterutil_js_1.mapAsync)((0, iterutil_js_1.filterAsync)((0, promises_1.watch)(path, { recursive: options === null || options === void 0 ? void 0 : options.recursive, signal }), (info) => info.filename != null), (info) => ({
      kind: "modify",
      paths: [(0, path_1.resolve)(path, info.filename)]
    }))));
    function close2() {
      ac.abort();
    }
    return Object.assign(masterWatcher, {
      rid,
      close: close2,
      [Symbol.dispose]: close2
    });
  };
  watchFs.watchFs = watchFs$1;
  return watchFs;
}
var writeFile = {};
var hasRequiredWriteFile;
function requireWriteFile() {
  if (hasRequiredWriteFile) return writeFile;
  hasRequiredWriteFile = 1;
  var __createBinding = writeFile && writeFile.__createBinding || (Object.create ? (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  }) : (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    o[k2] = m[k];
  }));
  var __setModuleDefault = writeFile && writeFile.__setModuleDefault || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  }) : function(o, v) {
    o["default"] = v;
  });
  var __importStar = writeFile && writeFile.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  var __importDefault = writeFile && writeFile.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(writeFile, "__esModule", { value: true });
  writeFile.writeFile = void 0;
  const fs = __importStar(require$$0$5);
  const errorMap_js_1 = __importDefault(requireErrorMap());
  const fs_flags_js_1 = requireFs_flags();
  const writeFile$1 = async function writeFile2(path, data, { append = false, create: create2 = true, createNew = false, mode, signal } = {}) {
    const truncate2 = create2 && !append;
    const flag = (0, fs_flags_js_1.getFsFlag)({ append, create: create2, createNew, truncate: truncate2, write: true });
    try {
      await fs.writeFile(path, data, { flag, signal });
      if (mode != null)
        await fs.chmod(path, mode);
    } catch (error) {
      throw (0, errorMap_js_1.default)(error);
    }
  };
  writeFile.writeFile = writeFile$1;
  return writeFile;
}
var writeFileSync = {};
var hasRequiredWriteFileSync;
function requireWriteFileSync() {
  if (hasRequiredWriteFileSync) return writeFileSync;
  hasRequiredWriteFileSync = 1;
  var __importDefault = writeFileSync && writeFileSync.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(writeFileSync, "__esModule", { value: true });
  writeFileSync.writeFileSync = void 0;
  const os_1 = require$$0$3;
  const openSync_js_1 = requireOpenSync();
  const errorMap_js_1 = __importDefault(requireErrorMap());
  const statSync_js_1 = requireStatSync();
  const chmodSync_js_1 = requireChmodSync();
  const writeFileSync$1 = function writeFileSync2(path, data, options = {}) {
    try {
      if (options.create !== void 0) {
        const create2 = !!options.create;
        if (!create2) {
          (0, statSync_js_1.statSync)(path);
        }
      }
      const openOptions = {
        write: true,
        create: true,
        createNew: options.createNew,
        append: !!options.append,
        truncate: !options.append
      };
      const file = (0, openSync_js_1.openSync)(path, openOptions);
      if (options.mode !== void 0 && options.mode !== null && (0, os_1.platform)() !== "win32") {
        (0, chmodSync_js_1.chmodSync)(path, options.mode);
      }
      let nwritten = 0;
      while (nwritten < data.length) {
        nwritten += file.writeSync(data.subarray(nwritten));
      }
      file.close();
    } catch (e) {
      throw (0, errorMap_js_1.default)(e);
    }
  };
  writeFileSync.writeFileSync = writeFileSync$1;
  return writeFileSync;
}
var args = {};
var hasRequiredArgs;
function requireArgs() {
  if (hasRequiredArgs) return args;
  hasRequiredArgs = 1;
  Object.defineProperty(args, "__esModule", { value: true });
  args.args = void 0;
  args.args = process.argv.slice(2);
  return args;
}
var hasRequiredFunctions;
function requireFunctions() {
  if (hasRequiredFunctions) return functions;
  hasRequiredFunctions = 1;
  (function(exports) {
    var __importDefault = functions && functions.__importDefault || function(mod) {
      return mod && mod.__esModule ? mod : { "default": mod };
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.read = exports.osUptime = exports.osRelease = exports.openSync = exports.open = exports.mkdirSync = exports.mkdir = exports.memoryUsage = exports.makeTempFileSync = exports.makeTempFile = exports.makeTempDirSync = exports.makeTempDir = exports.lstatSync = exports.lstat = exports.loadavg = exports.listenTls = exports.listen = exports.linkSync = exports.link = exports.kill = exports.inspect = exports.hostname = exports.gid = exports.ftruncateSync = exports.ftruncate = exports.fsyncSync = exports.fsync = exports.fstatSync = exports.fstat = exports.fdatasyncSync = exports.fdatasync = exports.exit = exports.execPath = exports.cwd = exports.createSync = exports.create = exports.copyFileSync = exports.copyFile = exports.copy = exports.consoleSize = exports.connectTls = exports.connect = exports.close = exports.chownSync = exports.chown = exports.chmodSync = exports.chmod = exports.chdir = exports.addSignalListener = exports.isatty = void 0;
    exports.utimeSync = exports.utime = exports.futimeSync = exports.futime = exports.args = exports.writeTextFileSync = exports.writeTextFile = exports.writeSync = exports.writeFileSync = exports.writeFile = exports.write = exports.watchFs = exports.uid = exports.truncateSync = exports.truncate = exports.test = exports.symlinkSync = exports.symlink = exports.statSync = exports.stat = exports.shutdown = exports.run = exports.Process = exports.resolveDns = exports.renameSync = exports.rename = exports.removeSync = exports.removeSignalListener = exports.remove = exports.realPathSync = exports.realPath = exports.readTextFileSync = exports.readTextFile = exports.readSync = exports.readLinkSync = exports.readLink = exports.readFileSync = exports.readFile = exports.readDirSync = exports.readDir = void 0;
    const fs_1 = __importDefault(require$$0);
    const errorMap_js_1 = __importDefault(requireErrorMap());
    const variables_js_1 = requireVariables();
    var tty_1 = require$$3;
    Object.defineProperty(exports, "isatty", { enumerable: true, get: function() {
      return tty_1.isatty;
    } });
    var addSignalListener_js_1 = requireAddSignalListener();
    Object.defineProperty(exports, "addSignalListener", { enumerable: true, get: function() {
      return addSignalListener_js_1.addSignalListener;
    } });
    var chdir_js_1 = requireChdir();
    Object.defineProperty(exports, "chdir", { enumerable: true, get: function() {
      return chdir_js_1.chdir;
    } });
    var chmod_js_1 = requireChmod();
    Object.defineProperty(exports, "chmod", { enumerable: true, get: function() {
      return chmod_js_1.chmod;
    } });
    var chmodSync_js_1 = requireChmodSync();
    Object.defineProperty(exports, "chmodSync", { enumerable: true, get: function() {
      return chmodSync_js_1.chmodSync;
    } });
    var chown_js_1 = requireChown();
    Object.defineProperty(exports, "chown", { enumerable: true, get: function() {
      return chown_js_1.chown;
    } });
    var chownSync_js_1 = requireChownSync();
    Object.defineProperty(exports, "chownSync", { enumerable: true, get: function() {
      return chownSync_js_1.chownSync;
    } });
    var close_js_1 = requireClose();
    Object.defineProperty(exports, "close", { enumerable: true, get: function() {
      return close_js_1.close;
    } });
    var connect_js_1 = requireConnect();
    Object.defineProperty(exports, "connect", { enumerable: true, get: function() {
      return connect_js_1.connect;
    } });
    var connectTls_js_1 = requireConnectTls();
    Object.defineProperty(exports, "connectTls", { enumerable: true, get: function() {
      return connectTls_js_1.connectTls;
    } });
    var consoleSize_js_1 = requireConsoleSize();
    Object.defineProperty(exports, "consoleSize", { enumerable: true, get: function() {
      return consoleSize_js_1.consoleSize;
    } });
    var copy_js_1 = requireCopy();
    Object.defineProperty(exports, "copy", { enumerable: true, get: function() {
      return copy_js_1.copy;
    } });
    var copyFile_js_1 = requireCopyFile();
    Object.defineProperty(exports, "copyFile", { enumerable: true, get: function() {
      return copyFile_js_1.copyFile;
    } });
    var copyFileSync_js_1 = requireCopyFileSync();
    Object.defineProperty(exports, "copyFileSync", { enumerable: true, get: function() {
      return copyFileSync_js_1.copyFileSync;
    } });
    var create_js_1 = requireCreate();
    Object.defineProperty(exports, "create", { enumerable: true, get: function() {
      return create_js_1.create;
    } });
    var createSync_js_1 = requireCreateSync();
    Object.defineProperty(exports, "createSync", { enumerable: true, get: function() {
      return createSync_js_1.createSync;
    } });
    var cwd_js_1 = requireCwd();
    Object.defineProperty(exports, "cwd", { enumerable: true, get: function() {
      return cwd_js_1.cwd;
    } });
    var execPath_js_1 = requireExecPath();
    Object.defineProperty(exports, "execPath", { enumerable: true, get: function() {
      return execPath_js_1.execPath;
    } });
    var exit_js_1 = requireExit();
    Object.defineProperty(exports, "exit", { enumerable: true, get: function() {
      return exit_js_1.exit;
    } });
    var fdatasync_js_1 = requireFdatasync();
    Object.defineProperty(exports, "fdatasync", { enumerable: true, get: function() {
      return fdatasync_js_1.fdatasync;
    } });
    var fdatasyncSync_js_1 = requireFdatasyncSync();
    Object.defineProperty(exports, "fdatasyncSync", { enumerable: true, get: function() {
      return fdatasyncSync_js_1.fdatasyncSync;
    } });
    var fstat_js_1 = requireFstat();
    Object.defineProperty(exports, "fstat", { enumerable: true, get: function() {
      return fstat_js_1.fstat;
    } });
    var fstatSync_js_1 = requireFstatSync();
    Object.defineProperty(exports, "fstatSync", { enumerable: true, get: function() {
      return fstatSync_js_1.fstatSync;
    } });
    var fsync_js_1 = requireFsync();
    Object.defineProperty(exports, "fsync", { enumerable: true, get: function() {
      return fsync_js_1.fsync;
    } });
    var fsyncSync_js_1 = requireFsyncSync();
    Object.defineProperty(exports, "fsyncSync", { enumerable: true, get: function() {
      return fsyncSync_js_1.fsyncSync;
    } });
    var ftruncate_js_1 = requireFtruncate();
    Object.defineProperty(exports, "ftruncate", { enumerable: true, get: function() {
      return ftruncate_js_1.ftruncate;
    } });
    var ftruncateSync_js_1 = requireFtruncateSync();
    Object.defineProperty(exports, "ftruncateSync", { enumerable: true, get: function() {
      return ftruncateSync_js_1.ftruncateSync;
    } });
    var gid_js_1 = requireGid();
    Object.defineProperty(exports, "gid", { enumerable: true, get: function() {
      return gid_js_1.gid;
    } });
    var hostname_js_1 = requireHostname();
    Object.defineProperty(exports, "hostname", { enumerable: true, get: function() {
      return hostname_js_1.hostname;
    } });
    var inspect_js_1 = requireInspect();
    Object.defineProperty(exports, "inspect", { enumerable: true, get: function() {
      return inspect_js_1.inspect;
    } });
    var kill_js_1 = requireKill();
    Object.defineProperty(exports, "kill", { enumerable: true, get: function() {
      return kill_js_1.kill;
    } });
    var link_js_1 = requireLink();
    Object.defineProperty(exports, "link", { enumerable: true, get: function() {
      return link_js_1.link;
    } });
    var linkSync_js_1 = requireLinkSync();
    Object.defineProperty(exports, "linkSync", { enumerable: true, get: function() {
      return linkSync_js_1.linkSync;
    } });
    var listen_js_1 = requireListen();
    Object.defineProperty(exports, "listen", { enumerable: true, get: function() {
      return listen_js_1.listen;
    } });
    var listenTls_js_1 = requireListenTls();
    Object.defineProperty(exports, "listenTls", { enumerable: true, get: function() {
      return listenTls_js_1.listenTls;
    } });
    var loadavg_js_1 = requireLoadavg();
    Object.defineProperty(exports, "loadavg", { enumerable: true, get: function() {
      return loadavg_js_1.loadavg;
    } });
    var lstat_js_1 = requireLstat();
    Object.defineProperty(exports, "lstat", { enumerable: true, get: function() {
      return lstat_js_1.lstat;
    } });
    var lstatSync_js_1 = requireLstatSync();
    Object.defineProperty(exports, "lstatSync", { enumerable: true, get: function() {
      return lstatSync_js_1.lstatSync;
    } });
    var makeTempDir_js_1 = requireMakeTempDir();
    Object.defineProperty(exports, "makeTempDir", { enumerable: true, get: function() {
      return makeTempDir_js_1.makeTempDir;
    } });
    var makeTempDirSync_js_1 = requireMakeTempDirSync();
    Object.defineProperty(exports, "makeTempDirSync", { enumerable: true, get: function() {
      return makeTempDirSync_js_1.makeTempDirSync;
    } });
    var makeTempFile_js_1 = requireMakeTempFile();
    Object.defineProperty(exports, "makeTempFile", { enumerable: true, get: function() {
      return makeTempFile_js_1.makeTempFile;
    } });
    var makeTempFileSync_js_1 = requireMakeTempFileSync();
    Object.defineProperty(exports, "makeTempFileSync", { enumerable: true, get: function() {
      return makeTempFileSync_js_1.makeTempFileSync;
    } });
    var memoryUsage_js_1 = requireMemoryUsage();
    Object.defineProperty(exports, "memoryUsage", { enumerable: true, get: function() {
      return memoryUsage_js_1.memoryUsage;
    } });
    var mkdir_js_1 = requireMkdir();
    Object.defineProperty(exports, "mkdir", { enumerable: true, get: function() {
      return mkdir_js_1.mkdir;
    } });
    var mkdirSync_js_1 = requireMkdirSync();
    Object.defineProperty(exports, "mkdirSync", { enumerable: true, get: function() {
      return mkdirSync_js_1.mkdirSync;
    } });
    var open_js_1 = requireOpen();
    Object.defineProperty(exports, "open", { enumerable: true, get: function() {
      return open_js_1.open;
    } });
    var openSync_js_1 = requireOpenSync();
    Object.defineProperty(exports, "openSync", { enumerable: true, get: function() {
      return openSync_js_1.openSync;
    } });
    var osRelease_js_1 = requireOsRelease();
    Object.defineProperty(exports, "osRelease", { enumerable: true, get: function() {
      return osRelease_js_1.osRelease;
    } });
    var osUptime_js_1 = requireOsUptime();
    Object.defineProperty(exports, "osUptime", { enumerable: true, get: function() {
      return osUptime_js_1.osUptime;
    } });
    var read_js_1 = requireRead();
    Object.defineProperty(exports, "read", { enumerable: true, get: function() {
      return read_js_1.read;
    } });
    var readDir_js_1 = requireReadDir();
    Object.defineProperty(exports, "readDir", { enumerable: true, get: function() {
      return readDir_js_1.readDir;
    } });
    var readDirSync_js_1 = requireReadDirSync();
    Object.defineProperty(exports, "readDirSync", { enumerable: true, get: function() {
      return readDirSync_js_1.readDirSync;
    } });
    var readFile_js_1 = requireReadFile();
    Object.defineProperty(exports, "readFile", { enumerable: true, get: function() {
      return readFile_js_1.readFile;
    } });
    var readFileSync_js_1 = requireReadFileSync();
    Object.defineProperty(exports, "readFileSync", { enumerable: true, get: function() {
      return readFileSync_js_1.readFileSync;
    } });
    var readLink_js_1 = requireReadLink();
    Object.defineProperty(exports, "readLink", { enumerable: true, get: function() {
      return readLink_js_1.readLink;
    } });
    var readLinkSync_js_1 = requireReadLinkSync();
    Object.defineProperty(exports, "readLinkSync", { enumerable: true, get: function() {
      return readLinkSync_js_1.readLinkSync;
    } });
    var readSync_js_1 = requireReadSync();
    Object.defineProperty(exports, "readSync", { enumerable: true, get: function() {
      return readSync_js_1.readSync;
    } });
    var readTextFile_js_1 = requireReadTextFile();
    Object.defineProperty(exports, "readTextFile", { enumerable: true, get: function() {
      return readTextFile_js_1.readTextFile;
    } });
    var readTextFileSync_js_1 = requireReadTextFileSync();
    Object.defineProperty(exports, "readTextFileSync", { enumerable: true, get: function() {
      return readTextFileSync_js_1.readTextFileSync;
    } });
    var realPath_js_1 = requireRealPath();
    Object.defineProperty(exports, "realPath", { enumerable: true, get: function() {
      return realPath_js_1.realPath;
    } });
    var realPathSync_js_1 = requireRealPathSync();
    Object.defineProperty(exports, "realPathSync", { enumerable: true, get: function() {
      return realPathSync_js_1.realPathSync;
    } });
    var remove_js_1 = requireRemove();
    Object.defineProperty(exports, "remove", { enumerable: true, get: function() {
      return remove_js_1.remove;
    } });
    var removeSignalListener_js_1 = requireRemoveSignalListener();
    Object.defineProperty(exports, "removeSignalListener", { enumerable: true, get: function() {
      return removeSignalListener_js_1.removeSignalListener;
    } });
    var removeSync_js_1 = requireRemoveSync();
    Object.defineProperty(exports, "removeSync", { enumerable: true, get: function() {
      return removeSync_js_1.removeSync;
    } });
    var rename_js_1 = requireRename();
    Object.defineProperty(exports, "rename", { enumerable: true, get: function() {
      return rename_js_1.rename;
    } });
    var renameSync_js_1 = requireRenameSync();
    Object.defineProperty(exports, "renameSync", { enumerable: true, get: function() {
      return renameSync_js_1.renameSync;
    } });
    var resolveDns_js_1 = requireResolveDns();
    Object.defineProperty(exports, "resolveDns", { enumerable: true, get: function() {
      return resolveDns_js_1.resolveDns;
    } });
    var run_js_1 = requireRun();
    Object.defineProperty(exports, "Process", { enumerable: true, get: function() {
      return run_js_1.Process;
    } });
    Object.defineProperty(exports, "run", { enumerable: true, get: function() {
      return run_js_1.run;
    } });
    var shutdown_js_1 = requireShutdown();
    Object.defineProperty(exports, "shutdown", { enumerable: true, get: function() {
      return shutdown_js_1.shutdown;
    } });
    var stat_js_1 = requireStat();
    Object.defineProperty(exports, "stat", { enumerable: true, get: function() {
      return stat_js_1.stat;
    } });
    var statSync_js_1 = requireStatSync();
    Object.defineProperty(exports, "statSync", { enumerable: true, get: function() {
      return statSync_js_1.statSync;
    } });
    var symlink_js_1 = requireSymlink();
    Object.defineProperty(exports, "symlink", { enumerable: true, get: function() {
      return symlink_js_1.symlink;
    } });
    var symlinkSync_js_1 = requireSymlinkSync();
    Object.defineProperty(exports, "symlinkSync", { enumerable: true, get: function() {
      return symlinkSync_js_1.symlinkSync;
    } });
    var test_js_1 = requireTest();
    Object.defineProperty(exports, "test", { enumerable: true, get: function() {
      return test_js_1.test;
    } });
    var truncate_js_1 = requireTruncate();
    Object.defineProperty(exports, "truncate", { enumerable: true, get: function() {
      return truncate_js_1.truncate;
    } });
    var truncateSync_js_1 = requireTruncateSync();
    Object.defineProperty(exports, "truncateSync", { enumerable: true, get: function() {
      return truncateSync_js_1.truncateSync;
    } });
    var uid_js_1 = requireUid();
    Object.defineProperty(exports, "uid", { enumerable: true, get: function() {
      return uid_js_1.uid;
    } });
    var watchFs_js_1 = requireWatchFs();
    Object.defineProperty(exports, "watchFs", { enumerable: true, get: function() {
      return watchFs_js_1.watchFs;
    } });
    var write_js_1 = requireWrite();
    Object.defineProperty(exports, "write", { enumerable: true, get: function() {
      return write_js_1.write;
    } });
    var writeFile_js_1 = requireWriteFile();
    Object.defineProperty(exports, "writeFile", { enumerable: true, get: function() {
      return writeFile_js_1.writeFile;
    } });
    var writeFileSync_js_1 = requireWriteFileSync();
    Object.defineProperty(exports, "writeFileSync", { enumerable: true, get: function() {
      return writeFileSync_js_1.writeFileSync;
    } });
    var writeSync_js_1 = requireWriteSync();
    Object.defineProperty(exports, "writeSync", { enumerable: true, get: function() {
      return writeSync_js_1.writeSync;
    } });
    var writeTextFile_js_1 = requireWriteTextFile();
    Object.defineProperty(exports, "writeTextFile", { enumerable: true, get: function() {
      return writeTextFile_js_1.writeTextFile;
    } });
    var writeTextFileSync_js_1 = requireWriteTextFileSync();
    Object.defineProperty(exports, "writeTextFileSync", { enumerable: true, get: function() {
      return writeTextFileSync_js_1.writeTextFileSync;
    } });
    var args_js_1 = requireArgs();
    Object.defineProperty(exports, "args", { enumerable: true, get: function() {
      return args_js_1.args;
    } });
    const futime = async function(rid, atime, mtime) {
      try {
        await new Promise((resolve, reject) => {
          fs_1.default.futimes(rid, atime, mtime, (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        });
      } catch (error) {
        throw (0, errorMap_js_1.default)(error);
      }
    };
    exports.futime = futime;
    const futimeSync = function(rid, atime, mtime) {
      try {
        fs_1.default.futimesSync(rid, atime, mtime);
      } catch (error) {
        throw (0, errorMap_js_1.default)(error);
      }
    };
    exports.futimeSync = futimeSync;
    const utime = async function(path, atime, mtime) {
      try {
        await fs_1.default.promises.utimes(path, atime, mtime);
      } catch (error) {
        if ((error === null || error === void 0 ? void 0 : error.code) === "ENOENT") {
          throw new variables_js_1.errors.NotFound(`No such file or directory (os error 2), utime '${path}'`);
        }
        throw (0, errorMap_js_1.default)(error);
      }
    };
    exports.utime = utime;
    const utimeSync = function(path, atime, mtime) {
      try {
        fs_1.default.utimesSync(path, atime, mtime);
      } catch (error) {
        if ((error === null || error === void 0 ? void 0 : error.code) === "ENOENT") {
          throw new variables_js_1.errors.NotFound(`No such file or directory (os error 2), utime '${path}'`);
        }
        throw (0, errorMap_js_1.default)(error);
      }
    };
    exports.utimeSync = utimeSync;
  })(functions);
  return functions;
}
var types = {};
var hasRequiredTypes;
function requireTypes() {
  if (hasRequiredTypes) return types;
  hasRequiredTypes = 1;
  Object.defineProperty(types, "__esModule", { value: true });
  return types;
}
var hasRequiredMain;
function requireMain() {
  if (hasRequiredMain) return main;
  hasRequiredMain = 1;
  (function(exports) {
    var __createBinding = main && main.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __exportStar = main && main.__exportStar || function(m, exports2) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(requireClasses(), exports);
    __exportStar(requireEnums(), exports);
    __exportStar(requireFunctions(), exports);
    __exportStar(requireTypes(), exports);
    __exportStar(requireVariables(), exports);
  })(main);
  return main;
}
var hasRequiredDeno;
function requireDeno() {
  if (hasRequiredDeno) return deno;
  hasRequiredDeno = 1;
  (function(exports) {
    var __createBinding = deno && deno.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __exportStar = deno && deno.__exportStar || function(m, exports2) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(requireMain(), exports);
  })(deno);
  return deno;
}
var hasRequiredDist;
function requireDist() {
  if (hasRequiredDist) return dist;
  hasRequiredDist = 1;
  var __createBinding = dist && dist.__createBinding || (Object.create ? (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() {
        return m[k];
      } };
    }
    Object.defineProperty(o, k2, desc);
  }) : (function(o, m, k, k2) {
    if (k2 === void 0) k2 = k;
    o[k2] = m[k];
  }));
  var __setModuleDefault = dist && dist.__setModuleDefault || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  }) : function(o, v) {
    o["default"] = v;
  });
  var __importStar = dist && dist.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  Object.defineProperty(dist, "__esModule", { value: true });
  dist.Deno = void 0;
  dist.Deno = __importStar(requireDeno());
  return dist;
}
var distExports = requireDist();
export {
  distExports as d
};
