import require$$0 from "node:fs";
import require$$1 from "node:fs/promises";
import minpath from "node:path";
var index_min = {};
var hasRequiredIndex_min;
function requireIndex_min() {
  if (hasRequiredIndex_min) return index_min;
  hasRequiredIndex_min = 1;
  (function(exports) {
    var a = (t, e) => () => (e || t((e = { exports: {} }).exports, e), e.exports);
    var _ = a((i) => {
      Object.defineProperty(i, "__esModule", { value: true });
      i.sync = i.isexe = void 0;
      var M = require$$0, x = require$$1, q = async (t, e = {}) => {
        let { ignoreErrors: r = false } = e;
        try {
          return d(await (0, x.stat)(t), e);
        } catch (s) {
          let n = s;
          if (r || n.code === "EACCES") return false;
          throw n;
        }
      };
      i.isexe = q;
      var m = (t, e = {}) => {
        let { ignoreErrors: r = false } = e;
        try {
          return d((0, M.statSync)(t), e);
        } catch (s) {
          let n = s;
          if (r || n.code === "EACCES") return false;
          throw n;
        }
      };
      i.sync = m;
      var d = (t, e) => t.isFile() && A(t, e), A = (t, e) => {
        let r = e.uid ?? process.getuid?.(), s = e.groups ?? process.getgroups?.() ?? [], n = e.gid ?? process.getgid?.() ?? s[0];
        if (r === void 0 || n === void 0) throw new Error("cannot get uid or gid");
        let u = /* @__PURE__ */ new Set([n, ...s]), c = t.mode, S = t.uid, P = t.gid, f = parseInt("100", 8), l = parseInt("010", 8), j = parseInt("001", 8), C = f | l;
        return !!(c & j || c & l && u.has(P) || c & f && S === r || c & C && r === 0);
      };
    });
    var g = a((o) => {
      Object.defineProperty(o, "__esModule", { value: true });
      o.sync = o.isexe = void 0;
      var T = require$$0, I = require$$1, D = minpath, F = async (t, e = {}) => {
        let { ignoreErrors: r = false } = e;
        try {
          return y(await (0, I.stat)(t), t, e);
        } catch (s) {
          let n = s;
          if (r || n.code === "EACCES") return false;
          throw n;
        }
      };
      o.isexe = F;
      var L = (t, e = {}) => {
        let { ignoreErrors: r = false } = e;
        try {
          return y((0, T.statSync)(t), t, e);
        } catch (s) {
          let n = s;
          if (r || n.code === "EACCES") return false;
          throw n;
        }
      };
      o.sync = L;
      var B = (t, e) => {
        let { pathExt: r = process.env.PATHEXT || "" } = e, s = r.split(D.delimiter);
        if (s.indexOf("") !== -1) return true;
        for (let n of s) {
          let u = n.toLowerCase(), c = t.substring(t.length - u.length).toLowerCase();
          if (u && c === u) return true;
        }
        return false;
      }, y = (t, e, r) => t.isFile() && B(e, r);
    });
    var p = a((h) => {
      Object.defineProperty(h, "__esModule", { value: true });
    });
    var v = exports && exports.__createBinding || (Object.create ? (function(t, e, r, s) {
      s === void 0 && (s = r);
      var n = Object.getOwnPropertyDescriptor(e, r);
      (!n || ("get" in n ? !e.__esModule : n.writable || n.configurable)) && (n = { enumerable: true, get: function() {
        return e[r];
      } }), Object.defineProperty(t, s, n);
    }) : (function(t, e, r, s) {
      s === void 0 && (s = r), t[s] = e[r];
    })), G = exports && exports.__setModuleDefault || (Object.create ? (function(t, e) {
      Object.defineProperty(t, "default", { enumerable: true, value: e });
    }) : function(t, e) {
      t.default = e;
    }), w = exports && exports.__importStar || /* @__PURE__ */ (function() {
      var t = function(e) {
        return t = Object.getOwnPropertyNames || function(r) {
          var s = [];
          for (var n in r) Object.prototype.hasOwnProperty.call(r, n) && (s[s.length] = n);
          return s;
        }, t(e);
      };
      return function(e) {
        if (e && e.__esModule) return e;
        var r = {};
        if (e != null) for (var s = t(e), n = 0; n < s.length; n++) s[n] !== "default" && v(r, e, s[n]);
        return G(r, e), r;
      };
    })(), X = exports && exports.__exportStar || function(t, e) {
      for (var r in t) r !== "default" && !Object.prototype.hasOwnProperty.call(e, r) && v(e, t, r);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.sync = exports.isexe = exports.posix = exports.win32 = void 0;
    var E = w(_());
    exports.posix = E;
    var O = w(g());
    exports.win32 = O;
    X(p(), exports);
    var H = process.env._ISEXE_TEST_PLATFORM_ || process.platform, b = H === "win32" ? O : E;
    exports.isexe = b.isexe;
    exports.sync = b.sync;
  })(index_min);
  return index_min;
}
export {
  requireIndex_min as r
};
