import { r as require$$0 } from "./tldts.mjs";
var cookie$1 = {};
var memstore = {};
var pathMatch = {};
var hasRequiredPathMatch;
function requirePathMatch() {
  if (hasRequiredPathMatch) return pathMatch;
  hasRequiredPathMatch = 1;
  Object.defineProperty(pathMatch, "__esModule", { value: true });
  pathMatch.pathMatch = pathMatch$1;
  function pathMatch$1(reqPath, cookiePath) {
    if (cookiePath === reqPath) {
      return true;
    }
    const idx = reqPath.indexOf(cookiePath);
    if (idx === 0) {
      if (cookiePath[cookiePath.length - 1] === "/") {
        return true;
      }
      if (reqPath.startsWith(cookiePath) && reqPath[cookiePath.length] === "/") {
        return true;
      }
    }
    return false;
  }
  return pathMatch;
}
var permuteDomain = {};
var getPublicSuffix = {};
var hasRequiredGetPublicSuffix;
function requireGetPublicSuffix() {
  if (hasRequiredGetPublicSuffix) return getPublicSuffix;
  hasRequiredGetPublicSuffix = 1;
  Object.defineProperty(getPublicSuffix, "__esModule", { value: true });
  getPublicSuffix.getPublicSuffix = getPublicSuffix$1;
  const tldts_1 = require$$0;
  const SPECIAL_USE_DOMAINS = ["local", "example", "invalid", "localhost", "test"];
  const SPECIAL_TREATMENT_DOMAINS = ["localhost", "invalid"];
  const defaultGetPublicSuffixOptions = {
    allowSpecialUseDomain: false,
    ignoreError: false
  };
  function getPublicSuffix$1(domain, options = {}) {
    options = { ...defaultGetPublicSuffixOptions, ...options };
    const domainParts = domain.split(".");
    const topLevelDomain = domainParts[domainParts.length - 1];
    const allowSpecialUseDomain = !!options.allowSpecialUseDomain;
    const ignoreError = !!options.ignoreError;
    if (allowSpecialUseDomain && topLevelDomain !== void 0 && SPECIAL_USE_DOMAINS.includes(topLevelDomain)) {
      if (domainParts.length > 1) {
        const secondLevelDomain = domainParts[domainParts.length - 2];
        return `${secondLevelDomain}.${topLevelDomain}`;
      } else if (SPECIAL_TREATMENT_DOMAINS.includes(topLevelDomain)) {
        return topLevelDomain;
      }
    }
    if (!ignoreError && topLevelDomain !== void 0 && SPECIAL_USE_DOMAINS.includes(topLevelDomain)) {
      throw new Error(`Cookie has domain set to the public suffix "${topLevelDomain}" which is a special use domain. To allow this, configure your CookieJar with {allowSpecialUseDomain: true, rejectPublicSuffixes: false}.`);
    }
    const publicSuffix = (0, tldts_1.getDomain)(domain, {
      allowIcannDomains: true,
      allowPrivateDomains: true
    });
    if (publicSuffix)
      return publicSuffix;
  }
  return getPublicSuffix;
}
var hasRequiredPermuteDomain;
function requirePermuteDomain() {
  if (hasRequiredPermuteDomain) return permuteDomain;
  hasRequiredPermuteDomain = 1;
  Object.defineProperty(permuteDomain, "__esModule", { value: true });
  permuteDomain.permuteDomain = permuteDomain$1;
  const getPublicSuffix_1 = requireGetPublicSuffix();
  function permuteDomain$1(domain, allowSpecialUseDomain) {
    const pubSuf = (0, getPublicSuffix_1.getPublicSuffix)(domain, {
      allowSpecialUseDomain
    });
    if (!pubSuf) {
      return void 0;
    }
    if (pubSuf == domain) {
      return [domain];
    }
    if (domain.slice(-1) == ".") {
      domain = domain.slice(0, -1);
    }
    const prefix = domain.slice(0, -(pubSuf.length + 1));
    const parts = prefix.split(".").reverse();
    let cur = pubSuf;
    const permutations = [cur];
    while (parts.length) {
      const part = parts.shift();
      cur = `${part}.${cur}`;
      permutations.push(cur);
    }
    return permutations;
  }
  return permuteDomain;
}
var store = {};
var hasRequiredStore;
function requireStore() {
  if (hasRequiredStore) return store;
  hasRequiredStore = 1;
  Object.defineProperty(store, "__esModule", { value: true });
  store.Store = void 0;
  class Store {
    constructor() {
      this.synchronous = false;
    }
    /**
     * @internal No doc because this is an overload that supports the implementation
     */
    findCookie(_domain, _path, _key, _callback) {
      throw new Error("findCookie is not implemented");
    }
    /**
     * @internal No doc because this is an overload that supports the implementation
     */
    findCookies(_domain, _path, _allowSpecialUseDomain = false, _callback) {
      throw new Error("findCookies is not implemented");
    }
    /**
     * @internal No doc because this is an overload that supports the implementation
     */
    putCookie(_cookie, _callback) {
      throw new Error("putCookie is not implemented");
    }
    /**
     * @internal No doc because this is an overload that supports the implementation
     */
    updateCookie(_oldCookie, _newCookie, _callback) {
      throw new Error("updateCookie is not implemented");
    }
    /**
     * @internal No doc because this is an overload that supports the implementation
     */
    removeCookie(_domain, _path, _key, _callback) {
      throw new Error("removeCookie is not implemented");
    }
    /**
     * @internal No doc because this is an overload that supports the implementation
     */
    removeCookies(_domain, _path, _callback) {
      throw new Error("removeCookies is not implemented");
    }
    /**
     * @internal No doc because this is an overload that supports the implementation
     */
    removeAllCookies(_callback) {
      throw new Error("removeAllCookies is not implemented");
    }
    /**
     * @internal No doc because this is an overload that supports the implementation
     */
    getAllCookies(_callback) {
      throw new Error("getAllCookies is not implemented (therefore jar cannot be serialized)");
    }
  }
  store.Store = Store;
  return store;
}
var utils = {};
var hasRequiredUtils;
function requireUtils() {
  if (hasRequiredUtils) return utils;
  hasRequiredUtils = 1;
  (function(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.safeToString = exports.objectToString = void 0;
    exports.createPromiseCallback = createPromiseCallback;
    exports.inOperator = inOperator;
    const objectToString = (obj) => Object.prototype.toString.call(obj);
    exports.objectToString = objectToString;
    const safeArrayToString = (arr, seenArrays) => {
      if (typeof arr.join !== "function")
        return (0, exports.objectToString)(arr);
      seenArrays.add(arr);
      const mapped = arr.map((val) => val === null || val === void 0 || seenArrays.has(val) ? "" : safeToStringImpl(val, seenArrays));
      return mapped.join();
    };
    const safeToStringImpl = (val, seenArrays = /* @__PURE__ */ new WeakSet()) => {
      if (typeof val !== "object" || val === null) {
        return String(val);
      } else if (typeof val.toString === "function") {
        return Array.isArray(val) ? (
          // Arrays have a weird custom toString that we need to replicate
          safeArrayToString(val, seenArrays)
        ) : (
          // eslint-disable-next-line @typescript-eslint/no-base-to-string
          String(val)
        );
      } else {
        return (0, exports.objectToString)(val);
      }
    };
    const safeToString = (val) => safeToStringImpl(val);
    exports.safeToString = safeToString;
    function createPromiseCallback(cb) {
      let callback;
      let resolve;
      let reject;
      const promise = new Promise((_resolve, _reject) => {
        resolve = _resolve;
        reject = _reject;
      });
      if (typeof cb === "function") {
        callback = (err, result) => {
          try {
            if (err)
              cb(err);
            else
              cb(null, result);
          } catch (e) {
            reject(e instanceof Error ? e : new Error());
          }
        };
      } else {
        callback = (err, result) => {
          try {
            if (err)
              reject(err);
            else
              resolve(result);
          } catch (e) {
            reject(e instanceof Error ? e : new Error());
          }
        };
      }
      return {
        promise,
        callback,
        resolve: (value) => {
          callback(null, value);
          return promise;
        },
        reject: (error) => {
          callback(error);
          return promise;
        }
      };
    }
    function inOperator(k, o) {
      return k in o;
    }
  })(utils);
  return utils;
}
var hasRequiredMemstore;
function requireMemstore() {
  if (hasRequiredMemstore) return memstore;
  hasRequiredMemstore = 1;
  Object.defineProperty(memstore, "__esModule", { value: true });
  memstore.MemoryCookieStore = void 0;
  const pathMatch_1 = requirePathMatch();
  const permuteDomain_1 = requirePermuteDomain();
  const store_1 = requireStore();
  const utils_1 = requireUtils();
  class MemoryCookieStore extends store_1.Store {
    /**
     * Create a new {@link MemoryCookieStore}.
     */
    constructor() {
      super();
      this.synchronous = true;
      this.idx = /* @__PURE__ */ Object.create(null);
    }
    /**
     * @internal No doc because this is an overload that supports the implementation
     */
    findCookie(domain, path, key, callback) {
      const promiseCallback = (0, utils_1.createPromiseCallback)(callback);
      if (domain == null || path == null || key == null) {
        return promiseCallback.resolve(void 0);
      }
      const result = this.idx[domain]?.[path]?.[key];
      return promiseCallback.resolve(result);
    }
    /**
     * @internal No doc because this is an overload that supports the implementation
     */
    findCookies(domain, path, allowSpecialUseDomain = false, callback) {
      if (typeof allowSpecialUseDomain === "function") {
        callback = allowSpecialUseDomain;
        allowSpecialUseDomain = true;
      }
      const results = [];
      const promiseCallback = (0, utils_1.createPromiseCallback)(callback);
      if (!domain) {
        return promiseCallback.resolve([]);
      }
      let pathMatcher;
      if (!path) {
        pathMatcher = function matchAll(domainIndex) {
          for (const curPath in domainIndex) {
            const pathIndex = domainIndex[curPath];
            for (const key in pathIndex) {
              const value = pathIndex[key];
              if (value) {
                results.push(value);
              }
            }
          }
        };
      } else {
        pathMatcher = function matchRFC(domainIndex) {
          for (const cookiePath in domainIndex) {
            if ((0, pathMatch_1.pathMatch)(path, cookiePath)) {
              const pathIndex = domainIndex[cookiePath];
              for (const key in pathIndex) {
                const value = pathIndex[key];
                if (value) {
                  results.push(value);
                }
              }
            }
          }
        };
      }
      const domains = (0, permuteDomain_1.permuteDomain)(domain, allowSpecialUseDomain) || [domain];
      const idx = this.idx;
      domains.forEach((curDomain) => {
        const domainIndex = idx[curDomain];
        if (!domainIndex) {
          return;
        }
        pathMatcher(domainIndex);
      });
      return promiseCallback.resolve(results);
    }
    /**
     * @internal No doc because this is an overload that supports the implementation
     */
    putCookie(cookie2, callback) {
      const promiseCallback = (0, utils_1.createPromiseCallback)(callback);
      const { domain, path, key } = cookie2;
      if (domain == null || path == null || key == null) {
        return promiseCallback.resolve(void 0);
      }
      const domainEntry = this.idx[domain] ?? /* @__PURE__ */ Object.create(null);
      this.idx[domain] = domainEntry;
      const pathEntry = domainEntry[path] ?? /* @__PURE__ */ Object.create(null);
      domainEntry[path] = pathEntry;
      pathEntry[key] = cookie2;
      return promiseCallback.resolve(void 0);
    }
    /**
     * @internal No doc because this is an overload that supports the implementation
     */
    updateCookie(_oldCookie, newCookie, callback) {
      if (callback)
        this.putCookie(newCookie, callback);
      else
        return this.putCookie(newCookie);
    }
    /**
     * @internal No doc because this is an overload that supports the implementation
     */
    removeCookie(domain, path, key, callback) {
      const promiseCallback = (0, utils_1.createPromiseCallback)(callback);
      delete this.idx[domain]?.[path]?.[key];
      return promiseCallback.resolve(void 0);
    }
    /**
     * @internal No doc because this is an overload that supports the implementation
     */
    removeCookies(domain, path, callback) {
      const promiseCallback = (0, utils_1.createPromiseCallback)(callback);
      const domainEntry = this.idx[domain];
      if (domainEntry) {
        if (path) {
          delete domainEntry[path];
        } else {
          delete this.idx[domain];
        }
      }
      return promiseCallback.resolve(void 0);
    }
    /**
     * @internal No doc because this is an overload that supports the implementation
     */
    removeAllCookies(callback) {
      const promiseCallback = (0, utils_1.createPromiseCallback)(callback);
      this.idx = /* @__PURE__ */ Object.create(null);
      return promiseCallback.resolve(void 0);
    }
    /**
     * @internal No doc because this is an overload that supports the implementation
     */
    getAllCookies(callback) {
      const promiseCallback = (0, utils_1.createPromiseCallback)(callback);
      const cookies = [];
      const idx = this.idx;
      const domains = Object.keys(idx);
      domains.forEach((domain) => {
        const domainEntry = idx[domain] ?? {};
        const paths = Object.keys(domainEntry);
        paths.forEach((path) => {
          const pathEntry = domainEntry[path] ?? {};
          const keys = Object.keys(pathEntry);
          keys.forEach((key) => {
            const keyEntry = pathEntry[key];
            if (keyEntry != null) {
              cookies.push(keyEntry);
            }
          });
        });
      });
      cookies.sort((a, b) => {
        return (a.creationIndex || 0) - (b.creationIndex || 0);
      });
      return promiseCallback.resolve(cookies);
    }
  }
  memstore.MemoryCookieStore = MemoryCookieStore;
  return memstore;
}
var validators = {};
var hasRequiredValidators;
function requireValidators() {
  if (hasRequiredValidators) return validators;
  hasRequiredValidators = 1;
  Object.defineProperty(validators, "__esModule", { value: true });
  validators.ParameterError = void 0;
  validators.isNonEmptyString = isNonEmptyString;
  validators.isDate = isDate;
  validators.isEmptyString = isEmptyString;
  validators.isString = isString;
  validators.isObject = isObject;
  validators.isInteger = isInteger;
  validators.validate = validate;
  const utils_1 = requireUtils();
  function isNonEmptyString(data) {
    return isString(data) && data !== "";
  }
  function isDate(data) {
    return data instanceof Date && isInteger(data.getTime());
  }
  function isEmptyString(data) {
    return data === "" || data instanceof String && data.toString() === "";
  }
  function isString(data) {
    return typeof data === "string" || data instanceof String;
  }
  function isObject(data) {
    return (0, utils_1.objectToString)(data) === "[object Object]";
  }
  function isInteger(data) {
    return typeof data === "number" && data % 1 === 0;
  }
  function validate(bool, cbOrMessage, message) {
    if (bool)
      return;
    const cb = typeof cbOrMessage === "function" ? cbOrMessage : void 0;
    let options = typeof cbOrMessage === "function" ? message : cbOrMessage;
    if (!isObject(options))
      options = "[object Object]";
    const err = new ParameterError((0, utils_1.safeToString)(options));
    if (cb)
      cb(err);
    else
      throw err;
  }
  class ParameterError extends Error {
  }
  validators.ParameterError = ParameterError;
  return validators;
}
var version = {};
var hasRequiredVersion;
function requireVersion() {
  if (hasRequiredVersion) return version;
  hasRequiredVersion = 1;
  Object.defineProperty(version, "__esModule", { value: true });
  version.version = void 0;
  version.version = "5.1.2";
  return version;
}
var canonicalDomain = {};
var constants = {};
var hasRequiredConstants;
function requireConstants() {
  if (hasRequiredConstants) return constants;
  hasRequiredConstants = 1;
  (function(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.IP_V6_REGEX_OBJECT = exports.PrefixSecurityEnum = void 0;
    exports.PrefixSecurityEnum = {
      SILENT: "silent",
      STRICT: "strict",
      DISABLED: "unsafe-disabled"
    };
    Object.freeze(exports.PrefixSecurityEnum);
    const IP_V6_REGEX = `
\\[?(?:
(?:[a-fA-F\\d]{1,4}:){7}(?:[a-fA-F\\d]{1,4}|:)|
(?:[a-fA-F\\d]{1,4}:){6}(?:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|:[a-fA-F\\d]{1,4}|:)|
(?:[a-fA-F\\d]{1,4}:){5}(?::(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|(?::[a-fA-F\\d]{1,4}){1,2}|:)|
(?:[a-fA-F\\d]{1,4}:){4}(?:(?::[a-fA-F\\d]{1,4}){0,1}:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|(?::[a-fA-F\\d]{1,4}){1,3}|:)|
(?:[a-fA-F\\d]{1,4}:){3}(?:(?::[a-fA-F\\d]{1,4}){0,2}:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|(?::[a-fA-F\\d]{1,4}){1,4}|:)|
(?:[a-fA-F\\d]{1,4}:){2}(?:(?::[a-fA-F\\d]{1,4}){0,3}:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|(?::[a-fA-F\\d]{1,4}){1,5}|:)|
(?:[a-fA-F\\d]{1,4}:){1}(?:(?::[a-fA-F\\d]{1,4}){0,4}:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|(?::[a-fA-F\\d]{1,4}){1,6}|:)|
(?::(?:(?::[a-fA-F\\d]{1,4}){0,5}:(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}|(?::[a-fA-F\\d]{1,4}){1,7}|:))
)(?:%[0-9a-zA-Z]{1,})?\\]?
`.replace(/\s*\/\/.*$/gm, "").replace(/\n/g, "").trim();
    exports.IP_V6_REGEX_OBJECT = new RegExp(`^${IP_V6_REGEX}$`);
  })(constants);
  return constants;
}
var hasRequiredCanonicalDomain;
function requireCanonicalDomain() {
  if (hasRequiredCanonicalDomain) return canonicalDomain;
  hasRequiredCanonicalDomain = 1;
  Object.defineProperty(canonicalDomain, "__esModule", { value: true });
  canonicalDomain.canonicalDomain = canonicalDomain$1;
  const constants_1 = requireConstants();
  function domainToASCII(domain) {
    return new URL(`http://${domain}`).hostname;
  }
  function canonicalDomain$1(domainName) {
    if (domainName == null) {
      return void 0;
    }
    let str = domainName.trim().replace(/^\./, "");
    if (constants_1.IP_V6_REGEX_OBJECT.test(str)) {
      if (!str.startsWith("[")) {
        str = "[" + str;
      }
      if (!str.endsWith("]")) {
        str = str + "]";
      }
      return domainToASCII(str).slice(1, -1);
    }
    if (/[^\u0001-\u007f]/.test(str)) {
      return domainToASCII(str);
    }
    return str.toLowerCase();
  }
  return canonicalDomain;
}
var cookie = {};
var formatDate = {};
var hasRequiredFormatDate;
function requireFormatDate() {
  if (hasRequiredFormatDate) return formatDate;
  hasRequiredFormatDate = 1;
  Object.defineProperty(formatDate, "__esModule", { value: true });
  formatDate.formatDate = formatDate$1;
  function formatDate$1(date) {
    return date.toUTCString();
  }
  return formatDate;
}
var parseDate = {};
var hasRequiredParseDate;
function requireParseDate() {
  if (hasRequiredParseDate) return parseDate;
  hasRequiredParseDate = 1;
  Object.defineProperty(parseDate, "__esModule", { value: true });
  parseDate.parseDate = parseDate$1;
  const DATE_DELIM = /[\x09\x20-\x2F\x3B-\x40\x5B-\x60\x7B-\x7E]/;
  const MONTH_TO_NUM = {
    jan: 0,
    feb: 1,
    mar: 2,
    apr: 3,
    may: 4,
    jun: 5,
    jul: 6,
    aug: 7,
    sep: 8,
    oct: 9,
    nov: 10,
    dec: 11
  };
  function parseDigits(token, minDigits, maxDigits, trailingOK) {
    let count = 0;
    while (count < token.length) {
      const c = token.charCodeAt(count);
      if (c <= 47 || c >= 58) {
        break;
      }
      count++;
    }
    if (count < minDigits || count > maxDigits) {
      return;
    }
    if (!trailingOK && count != token.length) {
      return;
    }
    return parseInt(token.slice(0, count), 10);
  }
  function parseTime(token) {
    const parts = token.split(":");
    const result = [0, 0, 0];
    if (parts.length !== 3) {
      return;
    }
    for (let i = 0; i < 3; i++) {
      const trailingOK = i == 2;
      const numPart = parts[i];
      if (numPart === void 0) {
        return;
      }
      const num = parseDigits(numPart, 1, 2, trailingOK);
      if (num === void 0) {
        return;
      }
      result[i] = num;
    }
    return result;
  }
  function parseMonth(token) {
    token = String(token).slice(0, 3).toLowerCase();
    switch (token) {
      case "jan":
        return MONTH_TO_NUM.jan;
      case "feb":
        return MONTH_TO_NUM.feb;
      case "mar":
        return MONTH_TO_NUM.mar;
      case "apr":
        return MONTH_TO_NUM.apr;
      case "may":
        return MONTH_TO_NUM.may;
      case "jun":
        return MONTH_TO_NUM.jun;
      case "jul":
        return MONTH_TO_NUM.jul;
      case "aug":
        return MONTH_TO_NUM.aug;
      case "sep":
        return MONTH_TO_NUM.sep;
      case "oct":
        return MONTH_TO_NUM.oct;
      case "nov":
        return MONTH_TO_NUM.nov;
      case "dec":
        return MONTH_TO_NUM.dec;
      default:
        return;
    }
  }
  function parseDate$1(cookieDate) {
    if (!cookieDate) {
      return;
    }
    const tokens = cookieDate.split(DATE_DELIM);
    let hour;
    let minute;
    let second;
    let dayOfMonth;
    let month;
    let year;
    for (let i = 0; i < tokens.length; i++) {
      const token = (tokens[i] ?? "").trim();
      if (!token.length) {
        continue;
      }
      if (second === void 0) {
        const result = parseTime(token);
        if (result) {
          hour = result[0];
          minute = result[1];
          second = result[2];
          continue;
        }
      }
      if (dayOfMonth === void 0) {
        const result = parseDigits(token, 1, 2, true);
        if (result !== void 0) {
          dayOfMonth = result;
          continue;
        }
      }
      if (month === void 0) {
        const result = parseMonth(token);
        if (result !== void 0) {
          month = result;
          continue;
        }
      }
      if (year === void 0) {
        const result = parseDigits(token, 2, 4, true);
        if (result !== void 0) {
          year = result;
          if (year >= 70 && year <= 99) {
            year += 1900;
          } else if (year >= 0 && year <= 69) {
            year += 2e3;
          }
        }
      }
    }
    if (dayOfMonth === void 0 || month === void 0 || year === void 0 || hour === void 0 || minute === void 0 || second === void 0 || dayOfMonth < 1 || dayOfMonth > 31 || year < 1601 || hour > 23 || minute > 59 || second > 59) {
      return;
    }
    return new Date(Date.UTC(year, month, dayOfMonth, hour, minute, second));
  }
  return parseDate;
}
var hasRequiredCookie$1;
function requireCookie$1() {
  if (hasRequiredCookie$1) return cookie;
  hasRequiredCookie$1 = 1;
  var __createBinding = cookie && cookie.__createBinding || (Object.create ? (function(o, m, k, k2) {
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
  var __setModuleDefault = cookie && cookie.__setModuleDefault || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  }) : function(o, v) {
    o["default"] = v;
  });
  var __importStar = cookie && cookie.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  Object.defineProperty(cookie, "__esModule", { value: true });
  cookie.Cookie = void 0;
  const getPublicSuffix_1 = requireGetPublicSuffix();
  const validators2 = __importStar(requireValidators());
  const utils_1 = requireUtils();
  const formatDate_1 = requireFormatDate();
  const parseDate_1 = requireParseDate();
  const canonicalDomain_1 = requireCanonicalDomain();
  const COOKIE_OCTETS = /^[\x21\x23-\x2B\x2D-\x3A\x3C-\x5B\x5D-\x7E]+$/;
  const PATH_VALUE = /[\x20-\x3A\x3C-\x7E]+/;
  const CONTROL_CHARS = /[\x00-\x1F]/;
  const TERMINATORS = ["\n", "\r", "\0"];
  function trimTerminator(str) {
    if (validators2.isEmptyString(str))
      return str;
    for (let t = 0; t < TERMINATORS.length; t++) {
      const terminator = TERMINATORS[t];
      const terminatorIdx = terminator ? str.indexOf(terminator) : -1;
      if (terminatorIdx !== -1) {
        str = str.slice(0, terminatorIdx);
      }
    }
    return str;
  }
  function parseCookiePair(cookiePair, looseMode) {
    cookiePair = trimTerminator(cookiePair);
    let firstEq = cookiePair.indexOf("=");
    if (looseMode) {
      if (firstEq === 0) {
        cookiePair = cookiePair.substring(1);
        firstEq = cookiePair.indexOf("=");
      }
    } else {
      if (firstEq <= 0) {
        return void 0;
      }
    }
    let cookieName, cookieValue;
    if (firstEq <= 0) {
      cookieName = "";
      cookieValue = cookiePair.trim();
    } else {
      cookieName = cookiePair.slice(0, firstEq).trim();
      cookieValue = cookiePair.slice(firstEq + 1).trim();
    }
    if (CONTROL_CHARS.test(cookieName) || CONTROL_CHARS.test(cookieValue)) {
      return void 0;
    }
    const c = new Cookie();
    c.key = cookieName;
    c.value = cookieValue;
    return c;
  }
  function parse(str, options) {
    if (validators2.isEmptyString(str) || !validators2.isString(str)) {
      return void 0;
    }
    str = str.trim();
    const firstSemi = str.indexOf(";");
    const cookiePair = firstSemi === -1 ? str : str.slice(0, firstSemi);
    const c = parseCookiePair(cookiePair, options?.loose ?? false);
    if (!c) {
      return void 0;
    }
    if (firstSemi === -1) {
      return c;
    }
    const unparsed = str.slice(firstSemi + 1).trim();
    if (unparsed.length === 0) {
      return c;
    }
    const cookie_avs = unparsed.split(";");
    while (cookie_avs.length) {
      const av = (cookie_avs.shift() ?? "").trim();
      if (av.length === 0) {
        continue;
      }
      const av_sep = av.indexOf("=");
      let av_key, av_value;
      if (av_sep === -1) {
        av_key = av;
        av_value = null;
      } else {
        av_key = av.slice(0, av_sep);
        av_value = av.slice(av_sep + 1);
      }
      av_key = av_key.trim().toLowerCase();
      if (av_value) {
        av_value = av_value.trim();
      }
      switch (av_key) {
        case "expires":
          if (av_value) {
            const exp = (0, parseDate_1.parseDate)(av_value);
            if (exp) {
              c.expires = exp;
            }
          }
          break;
        case "max-age":
          if (av_value) {
            if (/^-?[0-9]+$/.test(av_value)) {
              const delta = parseInt(av_value, 10);
              c.setMaxAge(delta);
            }
          }
          break;
        case "domain":
          if (av_value) {
            const domain = av_value.trim().replace(/^\./, "");
            if (domain) {
              c.domain = domain.toLowerCase();
            }
          }
          break;
        case "path":
          c.path = av_value && av_value[0] === "/" ? av_value : null;
          break;
        case "secure":
          c.secure = true;
          break;
        case "httponly":
          c.httpOnly = true;
          break;
        case "samesite":
          switch (av_value ? av_value.toLowerCase() : "") {
            case "strict":
              c.sameSite = "strict";
              break;
            case "lax":
              c.sameSite = "lax";
              break;
            case "none":
              c.sameSite = "none";
              break;
            default:
              c.sameSite = void 0;
              break;
          }
          break;
        default:
          c.extensions = c.extensions || [];
          c.extensions.push(av);
          break;
      }
    }
    return c;
  }
  function fromJSON(str) {
    if (!str || validators2.isEmptyString(str)) {
      return void 0;
    }
    let obj;
    if (typeof str === "string") {
      try {
        obj = JSON.parse(str);
      } catch {
        return void 0;
      }
    } else {
      obj = str;
    }
    const c = new Cookie();
    Cookie.serializableProperties.forEach((prop) => {
      if (obj && typeof obj === "object" && (0, utils_1.inOperator)(prop, obj)) {
        const val = obj[prop];
        if (val === void 0) {
          return;
        }
        if ((0, utils_1.inOperator)(prop, cookieDefaults) && val === cookieDefaults[prop]) {
          return;
        }
        switch (prop) {
          case "key":
          case "value":
          case "sameSite":
            if (typeof val === "string") {
              c[prop] = val;
            }
            break;
          case "expires":
          case "creation":
          case "lastAccessed":
            if (typeof val === "number" || typeof val === "string" || val instanceof Date) {
              c[prop] = obj[prop] == "Infinity" ? "Infinity" : new Date(val);
            } else if (val === null) {
              c[prop] = null;
            }
            break;
          case "maxAge":
            if (typeof val === "number" || val === "Infinity" || val === "-Infinity") {
              c[prop] = val;
            }
            break;
          case "domain":
          case "path":
            if (typeof val === "string" || val === null) {
              c[prop] = val;
            }
            break;
          case "secure":
          case "httpOnly":
            if (typeof val === "boolean") {
              c[prop] = val;
            }
            break;
          case "extensions":
            if (Array.isArray(val) && val.every((item) => typeof item === "string")) {
              c[prop] = val;
            }
            break;
          case "hostOnly":
          case "pathIsDefault":
            if (typeof val === "boolean" || val === null) {
              c[prop] = val;
            }
            break;
        }
      }
    });
    return c;
  }
  const cookieDefaults = {
    // the order in which the RFC has them:
    key: "",
    value: "",
    expires: "Infinity",
    maxAge: null,
    domain: null,
    path: null,
    secure: false,
    httpOnly: false,
    extensions: null,
    // set by the CookieJar:
    hostOnly: null,
    pathIsDefault: null,
    creation: null,
    lastAccessed: null,
    sameSite: void 0
  };
  class Cookie {
    /**
     * Create a new Cookie instance.
     * @public
     * @param options - The attributes to set on the cookie
     */
    constructor(options = {}) {
      this.key = options.key ?? cookieDefaults.key;
      this.value = options.value ?? cookieDefaults.value;
      this.expires = options.expires ?? cookieDefaults.expires;
      this.maxAge = options.maxAge ?? cookieDefaults.maxAge;
      this.domain = options.domain ?? cookieDefaults.domain;
      this.path = options.path ?? cookieDefaults.path;
      this.secure = options.secure ?? cookieDefaults.secure;
      this.httpOnly = options.httpOnly ?? cookieDefaults.httpOnly;
      this.extensions = options.extensions ?? cookieDefaults.extensions;
      this.creation = options.creation ?? cookieDefaults.creation;
      this.hostOnly = options.hostOnly ?? cookieDefaults.hostOnly;
      this.pathIsDefault = options.pathIsDefault ?? cookieDefaults.pathIsDefault;
      this.lastAccessed = options.lastAccessed ?? cookieDefaults.lastAccessed;
      this.sameSite = options.sameSite ?? cookieDefaults.sameSite;
      this.creation = options.creation ?? /* @__PURE__ */ new Date();
      Object.defineProperty(this, "creationIndex", {
        configurable: false,
        enumerable: false,
        // important for assert.deepEqual checks
        writable: true,
        value: ++Cookie.cookiesCreated
      });
      this.creationIndex = Cookie.cookiesCreated;
    }
    [/* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom")]() {
      const now = Date.now();
      const hostOnly = this.hostOnly != null ? this.hostOnly.toString() : "?";
      const createAge = this.creation && this.creation !== "Infinity" ? `${String(now - this.creation.getTime())}ms` : "?";
      const accessAge = this.lastAccessed && this.lastAccessed !== "Infinity" ? `${String(now - this.lastAccessed.getTime())}ms` : "?";
      return `Cookie="${this.toString()}; hostOnly=${hostOnly}; aAge=${accessAge}; cAge=${createAge}"`;
    }
    /**
     * For convenience in using `JSON.stringify(cookie)`. Returns a plain-old Object that can be JSON-serialized.
     *
     * @remarks
     * - Any `Date` properties (such as {@link Cookie.expires}, {@link Cookie.creation}, and {@link Cookie.lastAccessed}) are exported in ISO format (`Date.toISOString()`).
     *
     *  - Custom Cookie properties are discarded. In tough-cookie 1.x, since there was no {@link Cookie.toJSON} method explicitly defined, all enumerable properties were captured.
     *      If you want a property to be serialized, add the property name to {@link Cookie.serializableProperties}.
     */
    toJSON() {
      const obj = {};
      for (const prop of Cookie.serializableProperties) {
        const val = this[prop];
        if (val === cookieDefaults[prop]) {
          continue;
        }
        switch (prop) {
          case "key":
          case "value":
          case "sameSite":
            if (typeof val === "string") {
              obj[prop] = val;
            }
            break;
          case "expires":
          case "creation":
          case "lastAccessed":
            if (typeof val === "number" || typeof val === "string" || val instanceof Date) {
              obj[prop] = val == "Infinity" ? "Infinity" : new Date(val).toISOString();
            } else if (val === null) {
              obj[prop] = null;
            }
            break;
          case "maxAge":
            if (typeof val === "number" || val === "Infinity" || val === "-Infinity") {
              obj[prop] = val;
            }
            break;
          case "domain":
          case "path":
            if (typeof val === "string" || val === null) {
              obj[prop] = val;
            }
            break;
          case "secure":
          case "httpOnly":
            if (typeof val === "boolean") {
              obj[prop] = val;
            }
            break;
          case "extensions":
            if (Array.isArray(val)) {
              obj[prop] = val;
            }
            break;
          case "hostOnly":
          case "pathIsDefault":
            if (typeof val === "boolean" || val === null) {
              obj[prop] = val;
            }
            break;
        }
      }
      return obj;
    }
    /**
     * Does a deep clone of this cookie, implemented exactly as `Cookie.fromJSON(cookie.toJSON())`.
     * @public
     */
    clone() {
      return fromJSON(this.toJSON());
    }
    /**
     * Validates cookie attributes for semantic correctness. Useful for "lint" checking any `Set-Cookie` headers you generate.
     * For now, it returns a boolean, but eventually could return a reason string.
     *
     * @remarks
     * Works for a few things, but is by no means comprehensive.
     *
     * @beta
     */
    validate() {
      if (!this.value || !COOKIE_OCTETS.test(this.value)) {
        return false;
      }
      if (this.expires != "Infinity" && !(this.expires instanceof Date) && !(0, parseDate_1.parseDate)(this.expires)) {
        return false;
      }
      if (this.maxAge != null && this.maxAge !== "Infinity" && (this.maxAge === "-Infinity" || this.maxAge <= 0)) {
        return false;
      }
      if (this.path != null && !PATH_VALUE.test(this.path)) {
        return false;
      }
      const cdomain = this.cdomain();
      if (cdomain) {
        if (cdomain.match(/\.$/)) {
          return false;
        }
        const suffix = (0, getPublicSuffix_1.getPublicSuffix)(cdomain);
        if (suffix == null) {
          return false;
        }
      }
      return true;
    }
    /**
     * Sets the 'Expires' attribute on a cookie.
     *
     * @remarks
     * When given a `string` value it will be parsed with {@link parseDate}. If the value can't be parsed as a cookie date
     * then the 'Expires' attribute will be set to `"Infinity"`.
     *
     * @param exp - the new value for the 'Expires' attribute of the cookie.
     */
    setExpires(exp) {
      if (exp instanceof Date) {
        this.expires = exp;
      } else {
        this.expires = (0, parseDate_1.parseDate)(exp) || "Infinity";
      }
    }
    /**
     * Sets the 'Max-Age' attribute (in seconds) on a cookie.
     *
     * @remarks
     * Coerces `-Infinity` to `"-Infinity"` and `Infinity` to `"Infinity"` so it can be serialized to JSON.
     *
     * @param age - the new value for the 'Max-Age' attribute (in seconds).
     */
    setMaxAge(age) {
      if (age === Infinity) {
        this.maxAge = "Infinity";
      } else if (age === -Infinity) {
        this.maxAge = "-Infinity";
      } else {
        this.maxAge = age;
      }
    }
    /**
     * Encodes to a `Cookie` header value (specifically, the {@link Cookie.key} and {@link Cookie.value} properties joined with "=").
     * @public
     */
    cookieString() {
      const val = this.value || "";
      if (this.key) {
        return `${this.key}=${val}`;
      }
      return val;
    }
    /**
     * Encodes to a `Set-Cookie header` value.
     * @public
     */
    toString() {
      let str = this.cookieString();
      if (this.expires != "Infinity") {
        if (this.expires instanceof Date) {
          str += `; Expires=${(0, formatDate_1.formatDate)(this.expires)}`;
        }
      }
      if (this.maxAge != null && this.maxAge != Infinity) {
        str += `; Max-Age=${String(this.maxAge)}`;
      }
      if (this.domain && !this.hostOnly) {
        str += `; Domain=${this.domain}`;
      }
      if (this.path) {
        str += `; Path=${this.path}`;
      }
      if (this.secure) {
        str += "; Secure";
      }
      if (this.httpOnly) {
        str += "; HttpOnly";
      }
      if (this.sameSite && this.sameSite !== "none") {
        if (this.sameSite.toLowerCase() === Cookie.sameSiteCanonical.lax.toLowerCase()) {
          str += `; SameSite=${Cookie.sameSiteCanonical.lax}`;
        } else if (this.sameSite.toLowerCase() === Cookie.sameSiteCanonical.strict.toLowerCase()) {
          str += `; SameSite=${Cookie.sameSiteCanonical.strict}`;
        } else {
          str += `; SameSite=${this.sameSite}`;
        }
      }
      if (this.extensions) {
        this.extensions.forEach((ext) => {
          str += `; ${ext}`;
        });
      }
      return str;
    }
    /**
     * Computes the TTL relative to now (milliseconds).
     *
     * @remarks
     * - `Infinity` is returned for cookies without an explicit expiry
     *
     * - `0` is returned if the cookie is expired.
     *
     * - Otherwise a time-to-live in milliseconds is returned.
     *
     * @param now - passing an explicit value is mostly used for testing purposes since this defaults to the `Date.now()`
     * @public
     */
    TTL(now = Date.now()) {
      if (this.maxAge != null && typeof this.maxAge === "number") {
        return this.maxAge <= 0 ? 0 : this.maxAge * 1e3;
      }
      const expires = this.expires;
      if (expires === "Infinity") {
        return Infinity;
      }
      return (expires?.getTime() ?? now) - (now || Date.now());
    }
    /**
     * Computes the absolute unix-epoch milliseconds that this cookie expires.
     *
     * The "Max-Age" attribute takes precedence over "Expires" (as per the RFC). The {@link Cookie.lastAccessed} attribute
     * (or the `now` parameter if given) is used to offset the {@link Cookie.maxAge} attribute.
     *
     * If Expires ({@link Cookie.expires}) is set, that's returned.
     *
     * @param now - can be used to provide a time offset (instead of {@link Cookie.lastAccessed}) to use when calculating the "Max-Age" value
     */
    expiryTime(now) {
      if (this.maxAge != null) {
        const relativeTo = now || this.lastAccessed || /* @__PURE__ */ new Date();
        const maxAge = typeof this.maxAge === "number" ? this.maxAge : -Infinity;
        const age = maxAge <= 0 ? -Infinity : maxAge * 1e3;
        if (relativeTo === "Infinity") {
          return Infinity;
        }
        return relativeTo.getTime() + age;
      }
      if (this.expires == "Infinity") {
        return Infinity;
      }
      return this.expires ? this.expires.getTime() : void 0;
    }
    /**
     * Similar to {@link Cookie.expiryTime}, computes the absolute unix-epoch milliseconds that this cookie expires and returns it as a Date.
     *
     * The "Max-Age" attribute takes precedence over "Expires" (as per the RFC). The {@link Cookie.lastAccessed} attribute
     * (or the `now` parameter if given) is used to offset the {@link Cookie.maxAge} attribute.
     *
     * If Expires ({@link Cookie.expires}) is set, that's returned.
     *
     * @param now - can be used to provide a time offset (instead of {@link Cookie.lastAccessed}) to use when calculating the "Max-Age" value
     */
    expiryDate(now) {
      const millisec = this.expiryTime(now);
      if (millisec == Infinity) {
        return /* @__PURE__ */ new Date(2147483647e3);
      } else if (millisec == -Infinity) {
        return /* @__PURE__ */ new Date(0);
      } else {
        return millisec == void 0 ? void 0 : new Date(millisec);
      }
    }
    /**
     * Indicates if the cookie has been persisted to a store or not.
     * @public
     */
    isPersistent() {
      return this.maxAge != null || this.expires != "Infinity";
    }
    /**
     * Calls {@link canonicalDomain} with the {@link Cookie.domain} property.
     * @public
     */
    canonicalizedDomain() {
      return (0, canonicalDomain_1.canonicalDomain)(this.domain);
    }
    /**
     * Alias for {@link Cookie.canonicalizedDomain}
     * @public
     */
    cdomain() {
      return (0, canonicalDomain_1.canonicalDomain)(this.domain);
    }
    /**
     * Parses a string into a Cookie object.
     *
     * @remarks
     * Note: when parsing a `Cookie` header it must be split by ';' before each Cookie string can be parsed.
     *
     * @example
     * ```
     * // parse a `Set-Cookie` header
     * const setCookieHeader = 'a=bcd; Expires=Tue, 18 Oct 2011 07:05:03 GMT'
     * const cookie = Cookie.parse(setCookieHeader)
     * cookie.key === 'a'
     * cookie.value === 'bcd'
     * cookie.expires === new Date(Date.parse('Tue, 18 Oct 2011 07:05:03 GMT'))
     * ```
     *
     * @example
     * ```
     * // parse a `Cookie` header
     * const cookieHeader = 'name=value; name2=value2; name3=value3'
     * const cookies = cookieHeader.split(';').map(Cookie.parse)
     * cookies[0].name === 'name'
     * cookies[0].value === 'value'
     * cookies[1].name === 'name2'
     * cookies[1].value === 'value2'
     * cookies[2].name === 'name3'
     * cookies[2].value === 'value3'
     * ```
     *
     * @param str - The `Set-Cookie` header or a Cookie string to parse.
     * @param options - Configures `strict` or `loose` mode for cookie parsing
     */
    static parse(str, options) {
      return parse(str, options);
    }
    /**
     * Does the reverse of {@link Cookie.toJSON}.
     *
     * @remarks
     * Any Date properties (such as .expires, .creation, and .lastAccessed) are parsed via Date.parse, not tough-cookie's parseDate, since ISO timestamps are being handled at this layer.
     *
     * @example
     * ```
     * const json = JSON.stringify({
     *   key: 'alpha',
     *   value: 'beta',
     *   domain: 'example.com',
     *   path: '/foo',
     *   expires: '2038-01-19T03:14:07.000Z',
     * })
     * const cookie = Cookie.fromJSON(json)
     * cookie.key === 'alpha'
     * cookie.value === 'beta'
     * cookie.domain === 'example.com'
     * cookie.path === '/foo'
     * cookie.expires === new Date(Date.parse('2038-01-19T03:14:07.000Z'))
     * ```
     *
     * @param str - An unparsed JSON string or a value that has already been parsed as JSON
     */
    static fromJSON(str) {
      return fromJSON(str);
    }
  }
  cookie.Cookie = Cookie;
  Cookie.cookiesCreated = 0;
  Cookie.sameSiteLevel = {
    strict: 3,
    lax: 2,
    none: 1
  };
  Cookie.sameSiteCanonical = {
    strict: "Strict",
    lax: "Lax"
  };
  Cookie.serializableProperties = [
    "key",
    "value",
    "expires",
    "maxAge",
    "domain",
    "path",
    "secure",
    "httpOnly",
    "extensions",
    "hostOnly",
    "pathIsDefault",
    "creation",
    "lastAccessed",
    "sameSite"
  ];
  return cookie;
}
var cookieCompare = {};
var hasRequiredCookieCompare;
function requireCookieCompare() {
  if (hasRequiredCookieCompare) return cookieCompare;
  hasRequiredCookieCompare = 1;
  Object.defineProperty(cookieCompare, "__esModule", { value: true });
  cookieCompare.cookieCompare = cookieCompare$1;
  const MAX_TIME = 2147483647e3;
  function cookieCompare$1(a, b) {
    let cmp;
    const aPathLen = a.path ? a.path.length : 0;
    const bPathLen = b.path ? b.path.length : 0;
    cmp = bPathLen - aPathLen;
    if (cmp !== 0) {
      return cmp;
    }
    const aTime = a.creation && a.creation instanceof Date ? a.creation.getTime() : MAX_TIME;
    const bTime = b.creation && b.creation instanceof Date ? b.creation.getTime() : MAX_TIME;
    cmp = aTime - bTime;
    if (cmp !== 0) {
      return cmp;
    }
    cmp = (a.creationIndex || 0) - (b.creationIndex || 0);
    return cmp;
  }
  return cookieCompare;
}
var cookieJar = {};
var defaultPath = {};
var hasRequiredDefaultPath;
function requireDefaultPath() {
  if (hasRequiredDefaultPath) return defaultPath;
  hasRequiredDefaultPath = 1;
  Object.defineProperty(defaultPath, "__esModule", { value: true });
  defaultPath.defaultPath = defaultPath$1;
  function defaultPath$1(path) {
    if (!path || path.slice(0, 1) !== "/") {
      return "/";
    }
    if (path === "/") {
      return path;
    }
    const rightSlash = path.lastIndexOf("/");
    if (rightSlash === 0) {
      return "/";
    }
    return path.slice(0, rightSlash);
  }
  return defaultPath;
}
var domainMatch = {};
var hasRequiredDomainMatch;
function requireDomainMatch() {
  if (hasRequiredDomainMatch) return domainMatch;
  hasRequiredDomainMatch = 1;
  Object.defineProperty(domainMatch, "__esModule", { value: true });
  domainMatch.domainMatch = domainMatch$1;
  const canonicalDomain_1 = requireCanonicalDomain();
  const IP_REGEX_LOWERCASE = /(?:^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$)|(?:^(?:(?:[a-f\d]{1,4}:){7}(?:[a-f\d]{1,4}|:)|(?:[a-f\d]{1,4}:){6}(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|:[a-f\d]{1,4}|:)|(?:[a-f\d]{1,4}:){5}(?::(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-f\d]{1,4}){1,2}|:)|(?:[a-f\d]{1,4}:){4}(?:(?::[a-f\d]{1,4}){0,1}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-f\d]{1,4}){1,3}|:)|(?:[a-f\d]{1,4}:){3}(?:(?::[a-f\d]{1,4}){0,2}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-f\d]{1,4}){1,4}|:)|(?:[a-f\d]{1,4}:){2}(?:(?::[a-f\d]{1,4}){0,3}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-f\d]{1,4}){1,5}|:)|(?:[a-f\d]{1,4}:){1}(?:(?::[a-f\d]{1,4}){0,4}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-f\d]{1,4}){1,6}|:)|(?::(?:(?::[a-f\d]{1,4}){0,5}:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}|(?::[a-f\d]{1,4}){1,7}|:)))$)/;
  function domainMatch$1(domain, cookieDomain, canonicalize) {
    if (domain == null || cookieDomain == null) {
      return void 0;
    }
    let _str;
    let _domStr;
    if (canonicalize !== false) {
      _str = (0, canonicalDomain_1.canonicalDomain)(domain);
      _domStr = (0, canonicalDomain_1.canonicalDomain)(cookieDomain);
    } else {
      _str = domain;
      _domStr = cookieDomain;
    }
    if (_str == null || _domStr == null) {
      return void 0;
    }
    if (_str == _domStr) {
      return true;
    }
    const idx = _str.lastIndexOf(_domStr);
    if (idx <= 0) {
      return false;
    }
    if (_str.length !== _domStr.length + idx) {
      return false;
    }
    if (_str.substring(idx - 1, idx) !== ".") {
      return false;
    }
    return !IP_REGEX_LOWERCASE.test(_str);
  }
  return domainMatch;
}
var hasRequiredCookieJar;
function requireCookieJar() {
  if (hasRequiredCookieJar) return cookieJar;
  hasRequiredCookieJar = 1;
  var __createBinding = cookieJar && cookieJar.__createBinding || (Object.create ? (function(o, m, k, k2) {
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
  var __setModuleDefault = cookieJar && cookieJar.__setModuleDefault || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  }) : function(o, v) {
    o["default"] = v;
  });
  var __importStar = cookieJar && cookieJar.__importStar || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    }
    __setModuleDefault(result, mod);
    return result;
  };
  Object.defineProperty(cookieJar, "__esModule", { value: true });
  cookieJar.CookieJar = void 0;
  const getPublicSuffix_1 = requireGetPublicSuffix();
  const validators2 = __importStar(requireValidators());
  const validators_1 = requireValidators();
  const store_1 = requireStore();
  const memstore_1 = requireMemstore();
  const pathMatch_1 = requirePathMatch();
  const cookie_1 = requireCookie$1();
  const utils_1 = requireUtils();
  const canonicalDomain_1 = requireCanonicalDomain();
  const constants_1 = requireConstants();
  const defaultPath_1 = requireDefaultPath();
  const domainMatch_1 = requireDomainMatch();
  const cookieCompare_1 = requireCookieCompare();
  const version_1 = requireVersion();
  const defaultSetCookieOptions = {
    loose: false,
    sameSiteContext: void 0,
    ignoreError: false,
    http: true
  };
  const defaultGetCookieOptions = {
    http: true,
    expire: true,
    allPaths: false,
    sameSiteContext: void 0,
    sort: void 0
  };
  const SAME_SITE_CONTEXT_VAL_ERR = 'Invalid sameSiteContext option for getCookies(); expected one of "strict", "lax", or "none"';
  function getCookieContext(url) {
    if (url && typeof url === "object" && "hostname" in url && typeof url.hostname === "string" && "pathname" in url && typeof url.pathname === "string" && "protocol" in url && typeof url.protocol === "string") {
      return {
        hostname: url.hostname,
        pathname: url.pathname,
        protocol: url.protocol
      };
    } else if (typeof url === "string") {
      try {
        return new URL(decodeURI(url));
      } catch {
        return new URL(url);
      }
    } else {
      throw new validators_1.ParameterError("`url` argument is not a string or URL.");
    }
  }
  function checkSameSiteContext(value) {
    const context = String(value).toLowerCase();
    if (context === "none" || context === "lax" || context === "strict") {
      return context;
    } else {
      return void 0;
    }
  }
  function isSecurePrefixConditionMet(cookie2) {
    const startsWithSecurePrefix = typeof cookie2.key === "string" && cookie2.key.startsWith("__Secure-");
    return !startsWithSecurePrefix || cookie2.secure;
  }
  function isHostPrefixConditionMet(cookie2) {
    const startsWithHostPrefix = typeof cookie2.key === "string" && cookie2.key.startsWith("__Host-");
    return !startsWithHostPrefix || Boolean(cookie2.secure && cookie2.hostOnly && cookie2.path != null && cookie2.path === "/");
  }
  function getNormalizedPrefixSecurity(prefixSecurity) {
    const normalizedPrefixSecurity = prefixSecurity.toLowerCase();
    switch (normalizedPrefixSecurity) {
      case constants_1.PrefixSecurityEnum.STRICT:
      case constants_1.PrefixSecurityEnum.SILENT:
      case constants_1.PrefixSecurityEnum.DISABLED:
        return normalizedPrefixSecurity;
      default:
        return constants_1.PrefixSecurityEnum.SILENT;
    }
  }
  class CookieJar {
    /**
     * Creates a new `CookieJar` instance.
     *
     * @remarks
     * - If a custom store is not passed to the constructor, an in-memory store ({@link MemoryCookieStore} will be created and used.
     * - If a boolean value is passed as the `options` parameter, this is equivalent to passing `{ rejectPublicSuffixes: <value> }`
     *
     * @param store - a custom {@link Store} implementation (defaults to {@link MemoryCookieStore})
     * @param options - configures how cookies are processed by the cookie jar
     */
    constructor(store2, options) {
      if (typeof options === "boolean") {
        options = { rejectPublicSuffixes: options };
      }
      this.rejectPublicSuffixes = options?.rejectPublicSuffixes ?? true;
      this.enableLooseMode = options?.looseMode ?? false;
      this.allowSpecialUseDomain = options?.allowSpecialUseDomain ?? true;
      this.prefixSecurity = getNormalizedPrefixSecurity(options?.prefixSecurity ?? "silent");
      this.store = store2 ?? new memstore_1.MemoryCookieStore();
    }
    callSync(fn) {
      if (!this.store.synchronous) {
        throw new Error("CookieJar store is not synchronous; use async API instead.");
      }
      let syncErr = null;
      let syncResult = void 0;
      try {
        fn.call(this, (error, result) => {
          syncErr = error;
          syncResult = result;
        });
      } catch (err) {
        syncErr = err;
      }
      if (syncErr)
        throw syncErr;
      return syncResult;
    }
    /**
     * @internal No doc because this is the overload implementation
     */
    setCookie(cookie2, url, options, callback) {
      if (typeof options === "function") {
        callback = options;
        options = void 0;
      }
      const promiseCallback = (0, utils_1.createPromiseCallback)(callback);
      const cb = promiseCallback.callback;
      let context;
      try {
        if (typeof url === "string") {
          validators2.validate(validators2.isNonEmptyString(url), callback, (0, utils_1.safeToString)(options));
        }
        context = getCookieContext(url);
        if (typeof url === "function") {
          return promiseCallback.reject(new Error("No URL was specified"));
        }
        if (typeof options === "function") {
          options = defaultSetCookieOptions;
        }
        validators2.validate(typeof cb === "function", cb);
        if (!validators2.isNonEmptyString(cookie2) && !validators2.isObject(cookie2) && cookie2 instanceof String && cookie2.length == 0) {
          return promiseCallback.resolve(void 0);
        }
      } catch (err) {
        return promiseCallback.reject(err);
      }
      const host = (0, canonicalDomain_1.canonicalDomain)(context.hostname) ?? null;
      const loose = options?.loose || this.enableLooseMode;
      let sameSiteContext = null;
      if (options?.sameSiteContext) {
        sameSiteContext = checkSameSiteContext(options.sameSiteContext);
        if (!sameSiteContext) {
          return promiseCallback.reject(new Error(SAME_SITE_CONTEXT_VAL_ERR));
        }
      }
      if (typeof cookie2 === "string" || cookie2 instanceof String) {
        const parsedCookie = cookie_1.Cookie.parse(cookie2.toString(), { loose });
        if (!parsedCookie) {
          const err = new Error("Cookie failed to parse");
          return options?.ignoreError ? promiseCallback.resolve(void 0) : promiseCallback.reject(err);
        }
        cookie2 = parsedCookie;
      } else if (!(cookie2 instanceof cookie_1.Cookie)) {
        const err = new Error("First argument to setCookie must be a Cookie object or string");
        return options?.ignoreError ? promiseCallback.resolve(void 0) : promiseCallback.reject(err);
      }
      const now = options?.now || /* @__PURE__ */ new Date();
      if (this.rejectPublicSuffixes && cookie2.domain) {
        try {
          const cdomain = cookie2.cdomain();
          const suffix = typeof cdomain === "string" ? (0, getPublicSuffix_1.getPublicSuffix)(cdomain, {
            allowSpecialUseDomain: this.allowSpecialUseDomain,
            ignoreError: options?.ignoreError
          }) : null;
          if (suffix == null && !constants_1.IP_V6_REGEX_OBJECT.test(cookie2.domain)) {
            const err = new Error("Cookie has domain set to a public suffix");
            return options?.ignoreError ? promiseCallback.resolve(void 0) : promiseCallback.reject(err);
          }
        } catch (err) {
          return options?.ignoreError ? promiseCallback.resolve(void 0) : (
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            promiseCallback.reject(err)
          );
        }
      }
      if (cookie2.domain) {
        if (!(0, domainMatch_1.domainMatch)(host ?? void 0, cookie2.cdomain() ?? void 0, false)) {
          const err = new Error(`Cookie not in this host's domain. Cookie:${cookie2.cdomain() ?? "null"} Request:${host ?? "null"}`);
          return options?.ignoreError ? promiseCallback.resolve(void 0) : promiseCallback.reject(err);
        }
        if (cookie2.hostOnly == null) {
          cookie2.hostOnly = false;
        }
      } else {
        cookie2.hostOnly = true;
        cookie2.domain = host;
      }
      if (!cookie2.path || cookie2.path[0] !== "/") {
        cookie2.path = (0, defaultPath_1.defaultPath)(context.pathname);
        cookie2.pathIsDefault = true;
      }
      if (options?.http === false && cookie2.httpOnly) {
        const err = new Error("Cookie is HttpOnly and this isn't an HTTP API");
        return options.ignoreError ? promiseCallback.resolve(void 0) : promiseCallback.reject(err);
      }
      if (cookie2.sameSite !== "none" && cookie2.sameSite !== void 0 && sameSiteContext) {
        if (sameSiteContext === "none") {
          const err = new Error("Cookie is SameSite but this is a cross-origin request");
          return options?.ignoreError ? promiseCallback.resolve(void 0) : promiseCallback.reject(err);
        }
      }
      const ignoreErrorForPrefixSecurity = this.prefixSecurity === constants_1.PrefixSecurityEnum.SILENT;
      const prefixSecurityDisabled = this.prefixSecurity === constants_1.PrefixSecurityEnum.DISABLED;
      if (!prefixSecurityDisabled) {
        let errorFound = false;
        let errorMsg;
        if (!isSecurePrefixConditionMet(cookie2)) {
          errorFound = true;
          errorMsg = "Cookie has __Secure prefix but Secure attribute is not set";
        } else if (!isHostPrefixConditionMet(cookie2)) {
          errorFound = true;
          errorMsg = "Cookie has __Host prefix but either Secure or HostOnly attribute is not set or Path is not '/'";
        }
        if (errorFound) {
          return options?.ignoreError || ignoreErrorForPrefixSecurity ? promiseCallback.resolve(void 0) : promiseCallback.reject(new Error(errorMsg));
        }
      }
      const store2 = this.store;
      if (!store2.updateCookie) {
        store2.updateCookie = async function(_oldCookie, newCookie, cb2) {
          return this.putCookie(newCookie).then(() => cb2?.(null), (error) => cb2?.(error));
        };
      }
      const withCookie = function withCookie2(err, oldCookie) {
        if (err) {
          cb(err);
          return;
        }
        const next = function(err2) {
          if (err2) {
            cb(err2);
          } else if (typeof cookie2 === "string") {
            cb(null, void 0);
          } else {
            cb(null, cookie2);
          }
        };
        if (oldCookie) {
          if (options && "http" in options && options.http === false && oldCookie.httpOnly) {
            err = new Error("old Cookie is HttpOnly and this isn't an HTTP API");
            if (options.ignoreError)
              cb(null, void 0);
            else
              cb(err);
            return;
          }
          if (cookie2 instanceof cookie_1.Cookie) {
            cookie2.creation = oldCookie.creation;
            cookie2.creationIndex = oldCookie.creationIndex;
            cookie2.lastAccessed = now;
            store2.updateCookie(oldCookie, cookie2, next);
          }
        } else {
          if (cookie2 instanceof cookie_1.Cookie) {
            cookie2.creation = cookie2.lastAccessed = now;
            store2.putCookie(cookie2, next);
          }
        }
      };
      store2.findCookie(cookie2.domain, cookie2.path, cookie2.key, withCookie);
      return promiseCallback.promise;
    }
    /**
     * Synchronously attempt to set the {@link Cookie} in the {@link CookieJar}.
     *
     * <strong>Note:</strong> Only works if the configured {@link Store} is also synchronous.
     *
     * @remarks
     * - If successfully persisted, the {@link Cookie} will have updated
     *     {@link Cookie.creation}, {@link Cookie.lastAccessed} and {@link Cookie.hostOnly}
     *     properties.
     *
     * - As per the RFC, the {@link Cookie.hostOnly} flag is set if there was no `Domain={value}`
     *     atttribute on the cookie string. The {@link Cookie.domain} property is set to the
     *     fully-qualified hostname of `currentUrl` in this case. Matching this cookie requires an
     *     exact hostname match (not a {@link domainMatch} as per usual)
     *
     * @param cookie - The cookie object or cookie string to store. A string value will be parsed into a cookie using {@link Cookie.parse}.
     * @param url - The domain to store the cookie with.
     * @param options - Configuration settings to use when storing the cookie.
     * @public
     */
    setCookieSync(cookie2, url, options) {
      const setCookieFn = options ? this.setCookie.bind(this, cookie2, url, options) : this.setCookie.bind(this, cookie2, url);
      return this.callSync(setCookieFn);
    }
    /**
     * @internal No doc because this is the overload implementation
     */
    getCookies(url, options, callback) {
      if (typeof options === "function") {
        callback = options;
        options = defaultGetCookieOptions;
      } else if (options === void 0) {
        options = defaultGetCookieOptions;
      }
      const promiseCallback = (0, utils_1.createPromiseCallback)(callback);
      const cb = promiseCallback.callback;
      let context;
      try {
        if (typeof url === "string") {
          validators2.validate(validators2.isNonEmptyString(url), cb, url);
        }
        context = getCookieContext(url);
        validators2.validate(validators2.isObject(options), cb, (0, utils_1.safeToString)(options));
        validators2.validate(typeof cb === "function", cb);
      } catch (parameterError) {
        return promiseCallback.reject(parameterError);
      }
      const host = (0, canonicalDomain_1.canonicalDomain)(context.hostname);
      const path = context.pathname || "/";
      const secure = context.protocol && (context.protocol == "https:" || context.protocol == "wss:");
      let sameSiteLevel = 0;
      if (options.sameSiteContext) {
        const sameSiteContext = checkSameSiteContext(options.sameSiteContext);
        if (sameSiteContext == null) {
          return promiseCallback.reject(new Error(SAME_SITE_CONTEXT_VAL_ERR));
        }
        sameSiteLevel = cookie_1.Cookie.sameSiteLevel[sameSiteContext];
        if (!sameSiteLevel) {
          return promiseCallback.reject(new Error(SAME_SITE_CONTEXT_VAL_ERR));
        }
      }
      const http = options.http ?? true;
      const now = Date.now();
      const expireCheck = options.expire ?? true;
      const allPaths = options.allPaths ?? false;
      const store2 = this.store;
      function matchingCookie(c) {
        if (c.hostOnly) {
          if (c.domain != host) {
            return false;
          }
        } else {
          if (!(0, domainMatch_1.domainMatch)(host ?? void 0, c.domain ?? void 0, false)) {
            return false;
          }
        }
        if (!allPaths && typeof c.path === "string" && !(0, pathMatch_1.pathMatch)(path, c.path)) {
          return false;
        }
        if (c.secure && !secure) {
          return false;
        }
        if (c.httpOnly && !http) {
          return false;
        }
        if (sameSiteLevel) {
          let cookieLevel;
          if (c.sameSite === "lax") {
            cookieLevel = cookie_1.Cookie.sameSiteLevel.lax;
          } else if (c.sameSite === "strict") {
            cookieLevel = cookie_1.Cookie.sameSiteLevel.strict;
          } else {
            cookieLevel = cookie_1.Cookie.sameSiteLevel.none;
          }
          if (cookieLevel > sameSiteLevel) {
            return false;
          }
        }
        const expiryTime = c.expiryTime();
        if (expireCheck && expiryTime != void 0 && expiryTime <= now) {
          store2.removeCookie(c.domain, c.path, c.key, () => {
          });
          return false;
        }
        return true;
      }
      store2.findCookies(host, allPaths ? null : path, this.allowSpecialUseDomain, (err, cookies) => {
        if (err) {
          cb(err);
          return;
        }
        if (cookies == null) {
          cb(null, []);
          return;
        }
        cookies = cookies.filter(matchingCookie);
        if ("sort" in options && options.sort !== false) {
          cookies = cookies.sort(cookieCompare_1.cookieCompare);
        }
        const now2 = /* @__PURE__ */ new Date();
        for (const cookie2 of cookies) {
          cookie2.lastAccessed = now2;
        }
        cb(null, cookies);
      });
      return promiseCallback.promise;
    }
    /**
     * Synchronously retrieve the list of cookies that can be sent in a Cookie header for the
     * current URL.
     *
     * <strong>Note</strong>: Only works if the configured Store is also synchronous.
     *
     * @remarks
     * - The array of cookies returned will be sorted according to {@link cookieCompare}.
     *
     * - The {@link Cookie.lastAccessed} property will be updated on all returned cookies.
     *
     * @param url - The domain to store the cookie with.
     * @param options - Configuration settings to use when retrieving the cookies.
     */
    getCookiesSync(url, options) {
      return this.callSync(this.getCookies.bind(this, url, options)) ?? [];
    }
    /**
     * @internal No doc because this is the overload implementation
     */
    getCookieString(url, options, callback) {
      if (typeof options === "function") {
        callback = options;
        options = void 0;
      }
      const promiseCallback = (0, utils_1.createPromiseCallback)(callback);
      const next = function(err, cookies) {
        if (err) {
          promiseCallback.callback(err);
        } else {
          promiseCallback.callback(null, cookies?.sort(cookieCompare_1.cookieCompare).map((c) => c.cookieString()).join("; "));
        }
      };
      this.getCookies(url, options, next);
      return promiseCallback.promise;
    }
    /**
     * Synchronous version of `.getCookieString()`. Accepts the same options as `.getCookies()` but returns a string suitable for a
     * `Cookie` header rather than an Array.
     *
     * <strong>Note</strong>: Only works if the configured Store is also synchronous.
     *
     * @param url - The domain to store the cookie with.
     * @param options - Configuration settings to use when retrieving the cookies.
     */
    getCookieStringSync(url, options) {
      return this.callSync(options ? this.getCookieString.bind(this, url, options) : this.getCookieString.bind(this, url)) ?? "";
    }
    /**
     * @internal No doc because this is the overload implementation
     */
    getSetCookieStrings(url, options, callback) {
      if (typeof options === "function") {
        callback = options;
        options = void 0;
      }
      const promiseCallback = (0, utils_1.createPromiseCallback)(callback);
      const next = function(err, cookies) {
        if (err) {
          promiseCallback.callback(err);
        } else {
          promiseCallback.callback(null, cookies?.map((c) => {
            return c.toString();
          }));
        }
      };
      this.getCookies(url, options, next);
      return promiseCallback.promise;
    }
    /**
     * Synchronous version of `.getSetCookieStrings()`. Returns an array of strings suitable for `Set-Cookie` headers.
     * Accepts the same options as `.getCookies()`.
     *
     * <strong>Note</strong>: Only works if the configured Store is also synchronous.
     *
     * @param url - The domain to store the cookie with.
     * @param options - Configuration settings to use when retrieving the cookies.
     */
    getSetCookieStringsSync(url, options = {}) {
      return this.callSync(this.getSetCookieStrings.bind(this, url, options)) ?? [];
    }
    /**
     * @internal No doc because this is the overload implementation
     */
    serialize(callback) {
      const promiseCallback = (0, utils_1.createPromiseCallback)(callback);
      let type = this.store.constructor.name;
      if (validators2.isObject(type)) {
        type = null;
      }
      const serialized = {
        // The version of tough-cookie that serialized this jar. Generally a good
        // practice since future versions can make data import decisions based on
        // known past behavior. When/if this matters, use `semver`.
        version: `tough-cookie@${version_1.version}`,
        // add the store type, to make humans happy:
        storeType: type,
        // CookieJar configuration:
        rejectPublicSuffixes: this.rejectPublicSuffixes,
        enableLooseMode: this.enableLooseMode,
        allowSpecialUseDomain: this.allowSpecialUseDomain,
        prefixSecurity: getNormalizedPrefixSecurity(this.prefixSecurity),
        // this gets filled from getAllCookies:
        cookies: []
      };
      if (typeof this.store.getAllCookies !== "function") {
        return promiseCallback.reject(new Error("store does not support getAllCookies and cannot be serialized"));
      }
      this.store.getAllCookies((err, cookies) => {
        if (err) {
          promiseCallback.callback(err);
          return;
        }
        if (cookies == null) {
          promiseCallback.callback(null, serialized);
          return;
        }
        serialized.cookies = cookies.map((cookie2) => {
          const serializedCookie = cookie2.toJSON();
          delete serializedCookie.creationIndex;
          return serializedCookie;
        });
        promiseCallback.callback(null, serialized);
      });
      return promiseCallback.promise;
    }
    /**
     * Serialize the CookieJar if the underlying store supports `.getAllCookies`.
     *
     * <strong>Note</strong>: Only works if the configured Store is also synchronous.
     */
    serializeSync() {
      return this.callSync((callback) => {
        this.serialize(callback);
      });
    }
    /**
     * Alias of {@link CookieJar.serializeSync}. Allows the cookie to be serialized
     * with `JSON.stringify(cookieJar)`.
     */
    toJSON() {
      return this.serializeSync();
    }
    /**
     * Use the class method CookieJar.deserialize instead of calling this directly
     * @internal
     */
    _importCookies(serialized, callback) {
      let cookies = void 0;
      if (serialized && typeof serialized === "object" && (0, utils_1.inOperator)("cookies", serialized) && Array.isArray(serialized.cookies)) {
        cookies = serialized.cookies;
      }
      if (!cookies) {
        callback(new Error("serialized jar has no cookies array"), void 0);
        return;
      }
      cookies = cookies.slice();
      const putNext = (err) => {
        if (err) {
          callback(err, void 0);
          return;
        }
        if (Array.isArray(cookies)) {
          if (!cookies.length) {
            callback(err, this);
            return;
          }
          let cookie2;
          try {
            cookie2 = cookie_1.Cookie.fromJSON(cookies.shift());
          } catch (e) {
            callback(e instanceof Error ? e : new Error(), void 0);
            return;
          }
          if (cookie2 === void 0) {
            putNext(null);
            return;
          }
          this.store.putCookie(cookie2, putNext);
        }
      };
      putNext(null);
    }
    /**
     * @internal
     */
    _importCookiesSync(serialized) {
      this.callSync(this._importCookies.bind(this, serialized));
    }
    /**
     * @internal No doc because this is the overload implementation
     */
    clone(newStore, callback) {
      if (typeof newStore === "function") {
        callback = newStore;
        newStore = void 0;
      }
      const promiseCallback = (0, utils_1.createPromiseCallback)(callback);
      const cb = promiseCallback.callback;
      this.serialize((err, serialized) => {
        if (err) {
          return promiseCallback.reject(err);
        }
        return CookieJar.deserialize(serialized ?? "", newStore, cb);
      });
      return promiseCallback.promise;
    }
    /**
     * @internal
     */
    _cloneSync(newStore) {
      const cloneFn = newStore && typeof newStore !== "function" ? this.clone.bind(this, newStore) : this.clone.bind(this);
      return this.callSync((callback) => {
        cloneFn(callback);
      });
    }
    /**
     * Produces a deep clone of this CookieJar. Modifications to the original do
     * not affect the clone, and vice versa.
     *
     * <strong>Note</strong>: Only works if both the configured Store and destination
     * Store are synchronous.
     *
     * @remarks
     * - When no {@link Store} is provided, a new {@link MemoryCookieStore} will be used.
     *
     * - Transferring between store types is supported so long as the source
     *     implements `.getAllCookies()` and the destination implements `.putCookie()`.
     *
     * @param newStore - The target {@link Store} to clone cookies into.
     */
    cloneSync(newStore) {
      if (!newStore) {
        return this._cloneSync();
      }
      if (!newStore.synchronous) {
        throw new Error("CookieJar clone destination store is not synchronous; use async API instead.");
      }
      return this._cloneSync(newStore);
    }
    /**
     * @internal No doc because this is the overload implementation
     */
    removeAllCookies(callback) {
      const promiseCallback = (0, utils_1.createPromiseCallback)(callback);
      const cb = promiseCallback.callback;
      const store2 = this.store;
      if (typeof store2.removeAllCookies === "function" && store2.removeAllCookies !== store_1.Store.prototype.removeAllCookies) {
        store2.removeAllCookies(cb);
        return promiseCallback.promise;
      }
      store2.getAllCookies((err, cookies) => {
        if (err) {
          cb(err);
          return;
        }
        if (!cookies) {
          cookies = [];
        }
        if (cookies.length === 0) {
          cb(null, void 0);
          return;
        }
        let completedCount = 0;
        const removeErrors = [];
        const removeCookieCb = function removeCookieCb2(removeErr) {
          if (removeErr) {
            removeErrors.push(removeErr);
          }
          completedCount++;
          if (completedCount === cookies.length) {
            if (removeErrors[0])
              cb(removeErrors[0]);
            else
              cb(null, void 0);
            return;
          }
        };
        cookies.forEach((cookie2) => {
          store2.removeCookie(cookie2.domain, cookie2.path, cookie2.key, removeCookieCb);
        });
      });
      return promiseCallback.promise;
    }
    /**
     * Removes all cookies from the CookieJar.
     *
     * <strong>Note</strong>: Only works if the configured Store is also synchronous.
     *
     * @remarks
     * - This is a new backwards-compatible feature of tough-cookie version 2.5,
     *     so not all Stores will implement it efficiently. For Stores that do not
     *     implement `removeAllCookies`, the fallback is to call `removeCookie` after
     *     `getAllCookies`.
     *
     * - If `getAllCookies` fails or isn't implemented in the Store, an error is returned.
     *
     * - If one or more of the `removeCookie` calls fail, only the first error is returned.
     */
    removeAllCookiesSync() {
      this.callSync((callback) => {
        this.removeAllCookies(callback);
      });
    }
    /**
     * @internal No doc because this is the overload implementation
     */
    static deserialize(strOrObj, store2, callback) {
      if (typeof store2 === "function") {
        callback = store2;
        store2 = void 0;
      }
      const promiseCallback = (0, utils_1.createPromiseCallback)(callback);
      let serialized;
      if (typeof strOrObj === "string") {
        try {
          serialized = JSON.parse(strOrObj);
        } catch (e) {
          return promiseCallback.reject(e instanceof Error ? e : new Error());
        }
      } else {
        serialized = strOrObj;
      }
      const readSerializedProperty = (property) => {
        return serialized && typeof serialized === "object" && (0, utils_1.inOperator)(property, serialized) ? serialized[property] : void 0;
      };
      const readSerializedBoolean = (property) => {
        const value = readSerializedProperty(property);
        return typeof value === "boolean" ? value : void 0;
      };
      const readSerializedString = (property) => {
        const value = readSerializedProperty(property);
        return typeof value === "string" ? value : void 0;
      };
      const jar = new CookieJar(store2, {
        rejectPublicSuffixes: readSerializedBoolean("rejectPublicSuffixes"),
        looseMode: readSerializedBoolean("enableLooseMode"),
        allowSpecialUseDomain: readSerializedBoolean("allowSpecialUseDomain"),
        prefixSecurity: getNormalizedPrefixSecurity(readSerializedString("prefixSecurity") ?? "silent")
      });
      jar._importCookies(serialized, (err) => {
        if (err) {
          promiseCallback.callback(err);
          return;
        }
        promiseCallback.callback(null, jar);
      });
      return promiseCallback.promise;
    }
    /**
     * A new CookieJar is created and the serialized {@link Cookie} values are added to
     * the underlying store. Each {@link Cookie} is added via `store.putCookie(...)` in
     * the order in which they appear in the serialization.
     *
     * <strong>Note</strong>: Only works if the configured Store is also synchronous.
     *
     * @remarks
     * - When no {@link Store} is provided, a new {@link MemoryCookieStore} will be used.
     *
     * - As a convenience, if `strOrObj` is a string, it is passed through `JSON.parse` first.
     *
     * @param strOrObj - A JSON string or object representing the deserialized cookies.
     * @param store - The underlying store to persist the deserialized cookies into.
     */
    static deserializeSync(strOrObj, store2) {
      const serialized = typeof strOrObj === "string" ? JSON.parse(strOrObj) : strOrObj;
      const readSerializedProperty = (property) => {
        return serialized && typeof serialized === "object" && (0, utils_1.inOperator)(property, serialized) ? serialized[property] : void 0;
      };
      const readSerializedBoolean = (property) => {
        const value = readSerializedProperty(property);
        return typeof value === "boolean" ? value : void 0;
      };
      const readSerializedString = (property) => {
        const value = readSerializedProperty(property);
        return typeof value === "string" ? value : void 0;
      };
      const jar = new CookieJar(store2, {
        rejectPublicSuffixes: readSerializedBoolean("rejectPublicSuffixes"),
        looseMode: readSerializedBoolean("enableLooseMode"),
        allowSpecialUseDomain: readSerializedBoolean("allowSpecialUseDomain"),
        prefixSecurity: getNormalizedPrefixSecurity(readSerializedString("prefixSecurity") ?? "silent")
      });
      if (!jar.store.synchronous) {
        throw new Error("CookieJar store is not synchronous; use async API instead.");
      }
      jar._importCookiesSync(serialized);
      return jar;
    }
    /**
     * Alias of {@link CookieJar.deserializeSync}.
     *
     * @remarks
     * - When no {@link Store} is provided, a new {@link MemoryCookieStore} will be used.
     *
     * - As a convenience, if `strOrObj` is a string, it is passed through `JSON.parse` first.
     *
     * @param jsonString - A JSON string or object representing the deserialized cookies.
     * @param store - The underlying store to persist the deserialized cookies into.
     */
    static fromJSON(jsonString, store2) {
      return CookieJar.deserializeSync(jsonString, store2);
    }
  }
  cookieJar.CookieJar = CookieJar;
  return cookieJar;
}
var permutePath = {};
var hasRequiredPermutePath;
function requirePermutePath() {
  if (hasRequiredPermutePath) return permutePath;
  hasRequiredPermutePath = 1;
  Object.defineProperty(permutePath, "__esModule", { value: true });
  permutePath.permutePath = permutePath$1;
  function permutePath$1(path) {
    if (path === "/") {
      return ["/"];
    }
    const permutations = [path];
    while (path.length > 1) {
      const lindex = path.lastIndexOf("/");
      if (lindex === 0) {
        break;
      }
      path = path.slice(0, lindex);
      permutations.push(path);
    }
    permutations.push("/");
    return permutations;
  }
  return permutePath;
}
var hasRequiredCookie;
function requireCookie() {
  if (hasRequiredCookie) return cookie$1;
  hasRequiredCookie = 1;
  (function(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.permutePath = exports.parseDate = exports.formatDate = exports.domainMatch = exports.defaultPath = exports.CookieJar = exports.cookieCompare = exports.Cookie = exports.PrefixSecurityEnum = exports.canonicalDomain = exports.version = exports.ParameterError = exports.Store = exports.getPublicSuffix = exports.permuteDomain = exports.pathMatch = exports.MemoryCookieStore = void 0;
    exports.parse = parse;
    exports.fromJSON = fromJSON;
    var memstore_1 = requireMemstore();
    Object.defineProperty(exports, "MemoryCookieStore", { enumerable: true, get: function() {
      return memstore_1.MemoryCookieStore;
    } });
    var pathMatch_1 = requirePathMatch();
    Object.defineProperty(exports, "pathMatch", { enumerable: true, get: function() {
      return pathMatch_1.pathMatch;
    } });
    var permuteDomain_1 = requirePermuteDomain();
    Object.defineProperty(exports, "permuteDomain", { enumerable: true, get: function() {
      return permuteDomain_1.permuteDomain;
    } });
    var getPublicSuffix_1 = requireGetPublicSuffix();
    Object.defineProperty(exports, "getPublicSuffix", { enumerable: true, get: function() {
      return getPublicSuffix_1.getPublicSuffix;
    } });
    var store_1 = requireStore();
    Object.defineProperty(exports, "Store", { enumerable: true, get: function() {
      return store_1.Store;
    } });
    var validators_1 = requireValidators();
    Object.defineProperty(exports, "ParameterError", { enumerable: true, get: function() {
      return validators_1.ParameterError;
    } });
    var version_1 = requireVersion();
    Object.defineProperty(exports, "version", { enumerable: true, get: function() {
      return version_1.version;
    } });
    var canonicalDomain_1 = requireCanonicalDomain();
    Object.defineProperty(exports, "canonicalDomain", { enumerable: true, get: function() {
      return canonicalDomain_1.canonicalDomain;
    } });
    var constants_1 = requireConstants();
    Object.defineProperty(exports, "PrefixSecurityEnum", { enumerable: true, get: function() {
      return constants_1.PrefixSecurityEnum;
    } });
    var cookie_1 = requireCookie$1();
    Object.defineProperty(exports, "Cookie", { enumerable: true, get: function() {
      return cookie_1.Cookie;
    } });
    var cookieCompare_1 = requireCookieCompare();
    Object.defineProperty(exports, "cookieCompare", { enumerable: true, get: function() {
      return cookieCompare_1.cookieCompare;
    } });
    var cookieJar_1 = requireCookieJar();
    Object.defineProperty(exports, "CookieJar", { enumerable: true, get: function() {
      return cookieJar_1.CookieJar;
    } });
    var defaultPath_1 = requireDefaultPath();
    Object.defineProperty(exports, "defaultPath", { enumerable: true, get: function() {
      return defaultPath_1.defaultPath;
    } });
    var domainMatch_1 = requireDomainMatch();
    Object.defineProperty(exports, "domainMatch", { enumerable: true, get: function() {
      return domainMatch_1.domainMatch;
    } });
    var formatDate_1 = requireFormatDate();
    Object.defineProperty(exports, "formatDate", { enumerable: true, get: function() {
      return formatDate_1.formatDate;
    } });
    var parseDate_1 = requireParseDate();
    Object.defineProperty(exports, "parseDate", { enumerable: true, get: function() {
      return parseDate_1.parseDate;
    } });
    var permutePath_1 = requirePermutePath();
    Object.defineProperty(exports, "permutePath", { enumerable: true, get: function() {
      return permutePath_1.permutePath;
    } });
    const cookie_2 = requireCookie$1();
    function parse(str, options) {
      return cookie_2.Cookie.parse(str, options);
    }
    function fromJSON(str) {
      return cookie_2.Cookie.fromJSON(str);
    }
  })(cookie$1);
  return cookie$1;
}
var cookieExports = requireCookie();
export {
  cookieExports as c
};
