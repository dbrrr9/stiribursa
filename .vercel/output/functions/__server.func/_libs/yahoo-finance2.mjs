import { createRequire } from "node:module";
import { pathToFileURL, fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { d as distExports } from "./@deno/shim-deno.mjs";
import { c as cookieExports } from "./tough-cookie.mjs";
const defineGlobalPonyfill = (symbolFor, fn) => {
  if (!Reflect.has(globalThis, Symbol.for(symbolFor))) {
    Object.defineProperty(globalThis, Symbol.for(symbolFor), {
      configurable: true,
      get() {
        return fn;
      }
    });
  }
};
let import_meta_ponyfill_commonjs = Reflect.get(globalThis, /* @__PURE__ */ Symbol.for("import-meta-ponyfill-commonjs")) ?? /* @__PURE__ */ (() => {
  const moduleImportMetaWM = /* @__PURE__ */ new WeakMap();
  return (require2, module) => {
    let importMetaCache = moduleImportMetaWM.get(module);
    if (importMetaCache == null) {
      const importMeta = Object.assign(/* @__PURE__ */ Object.create(null), {
        url: pathToFileURL(module.filename).href,
        main: require2.main == module,
        resolve: (specifier, parentURL = importMeta.url) => {
          return pathToFileURL((importMeta.url === parentURL ? require2 : createRequire(parentURL)).resolve(specifier)).href;
        },
        filename: module.filename,
        dirname: module.path
      });
      moduleImportMetaWM.set(module, importMeta);
      importMetaCache = importMeta;
    }
    return importMetaCache;
  };
})();
defineGlobalPonyfill("import-meta-ponyfill-commonjs", import_meta_ponyfill_commonjs);
let import_meta_ponyfill_esmodule = Reflect.get(globalThis, /* @__PURE__ */ Symbol.for("import-meta-ponyfill-esmodule")) ?? ((importMeta) => {
  const resolveFunStr = String(importMeta.resolve);
  const shimWs = /* @__PURE__ */ new WeakSet();
  const mainUrl = ("file:///" + process.argv[1].replace(/\\/g, "/")).replace(/\/{3,}/, "///");
  const commonShim = (importMeta2) => {
    if (typeof importMeta2.main !== "boolean") {
      importMeta2.main = importMeta2.url === mainUrl;
    }
    if (typeof importMeta2.filename !== "string") {
      importMeta2.filename = fileURLToPath(importMeta2.url);
      importMeta2.dirname = dirname(importMeta2.filename);
    }
  };
  if (
    // v16.2.0+, v14.18.0+: Add support for WHATWG URL object to parentURL parameter.
    resolveFunStr === "undefined" || // v20.0.0+, v18.19.0+"" This API now returns a string synchronously instead of a Promise.
    resolveFunStr.startsWith("async")
  ) {
    import_meta_ponyfill_esmodule = (importMeta2) => {
      if (!shimWs.has(importMeta2)) {
        shimWs.add(importMeta2);
        const importMetaUrlRequire = {
          url: importMeta2.url,
          require: createRequire(importMeta2.url)
        };
        importMeta2.resolve = function resolve(specifier, parentURL = importMeta2.url) {
          return pathToFileURL((importMetaUrlRequire.url === parentURL ? importMetaUrlRequire.require : createRequire(parentURL)).resolve(specifier)).href;
        };
        commonShim(importMeta2);
      }
      return importMeta2;
    };
  } else {
    import_meta_ponyfill_esmodule = (importMeta2) => {
      if (!shimWs.has(importMeta2)) {
        shimWs.add(importMeta2);
        commonShim(importMeta2);
      }
      return importMeta2;
    };
  }
  return import_meta_ponyfill_esmodule(importMeta);
});
defineGlobalPonyfill("import-meta-ponyfill-esmodule", import_meta_ponyfill_esmodule);
const dntGlobals = {
  Deno: distExports.Deno
};
const dntGlobalThis = createMergeProxy(globalThis, dntGlobals);
function createMergeProxy(baseObj, extObj) {
  return new Proxy(baseObj, {
    get(_target, prop, _receiver) {
      if (prop in extObj) {
        return extObj[prop];
      } else {
        return baseObj[prop];
      }
    },
    set(_target, prop, value) {
      if (prop in extObj) {
        delete extObj[prop];
      }
      baseObj[prop] = value;
      return true;
    },
    deleteProperty(_target, prop) {
      let success = false;
      if (prop in extObj) {
        delete extObj[prop];
        success = true;
      }
      if (prop in baseObj) {
        delete baseObj[prop];
        success = true;
      }
      return success;
    },
    ownKeys(_target) {
      const baseKeys = Reflect.ownKeys(baseObj);
      const extKeys = Reflect.ownKeys(extObj);
      const extKeysSet = new Set(extKeys);
      return [...baseKeys.filter((k) => !extKeysSet.has(k)), ...extKeys];
    },
    defineProperty(_target, prop, desc) {
      if (prop in extObj) {
        delete extObj[prop];
      }
      Reflect.defineProperty(baseObj, prop, desc);
      return true;
    },
    getOwnPropertyDescriptor(_target, prop) {
      if (prop in extObj) {
        return Reflect.getOwnPropertyDescriptor(extObj, prop);
      } else {
        return Reflect.getOwnPropertyDescriptor(baseObj, prop);
      }
    },
    has(_target, prop) {
      return prop in extObj || prop in baseObj;
    }
  });
}
class ExtendedCookieJar extends cookieExports.CookieJar {
  /**
   * Sets cookies in the jar from the `Set-Cookie` headers.
   */
  async setFromSetCookieHeaders(setCookieHeader, url) {
    let cookies;
    if (typeof setCookieHeader === "undefined") ;
    else if (setCookieHeader instanceof Array) {
      cookies = setCookieHeader.map((header) => cookieExports.Cookie.parse(header));
    } else if (typeof setCookieHeader === "string") {
      cookies = [cookieExports.Cookie.parse(setCookieHeader)];
    }
    if (cookies) {
      for (const cookie of cookies) {
        if (cookie instanceof cookieExports.Cookie) {
          await this.setCookie(cookie, url);
        }
      }
    }
  }
}
const defaultOptions$1 = {
  // deno-lint-ignore no-explicit-any
  info: (...args) => console.log(...args),
  // deno-lint-ignore no-explicit-any
  warn: (...args) => console.warn(...args),
  // deno-lint-ignore no-explicit-any
  error: (...args) => console.error(...args),
  // deno-lint-ignore no-explicit-any
  dir: (...args) => console.dir(...args),
  // deno-lint-ignore no-explicit-any
  debug: (..._args) => {
  }
};
function validateOptions$1(logger) {
  if (typeof logger !== "object" || logger === null) {
    throw new Error("logger must be an object");
  }
  for (const method of ["info", "warn", "error", "debug", "dir"]) {
    if (!(method in logger)) {
      throw new Error(`logger.${method} is required`);
    }
    if (typeof logger[method] !== "function") {
      throw new Error(`logger.${method} must be a function`);
    }
  }
}
const optionsSchema = {
  "definitions": {
    "YahooFinanceOptions": {
      "type": "object",
      "properties": {
        "YF_QUERY_HOST": {
          "type": "string"
        },
        "queue": {
          "$ref": "#/definitions/QueueOptions"
        },
        "validation": {
          "$ref": "#/definitions/ValidationOptions"
        },
        "suppressNotices": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/NOTICE_IDS"
          }
        },
        "quoteCombine": {
          "$ref": "#/definitions/QuoteCombineOptions"
        },
        "versionCheck": {
          "type": "boolean"
        },
        "cookieJar": {
          "$ref": "#/definitions/ExtendedCookieJar"
        },
        "logger": {
          "$ref": "#/definitions/Logger"
        },
        "fetch": {},
        "fetchOptions": {
          "type": "object",
          "properties": {
            "body": {
              "anyOf": [
                {
                  "type": "object",
                  "properties": {
                    "locked": {
                      "type": "boolean"
                    }
                  },
                  "required": [
                    "locked"
                  ],
                  "additionalProperties": false
                },
                {
                  "type": "object",
                  "properties": {
                    "size": {
                      "type": "number"
                    },
                    "type": {
                      "type": "string"
                    }
                  },
                  "required": [
                    "size",
                    "type"
                  ],
                  "additionalProperties": false
                },
                {
                  "type": "object",
                  "properties": {
                    "buffer": {
                      "type": "object",
                      "properties": {
                        "byteLength": {
                          "type": "number"
                        }
                      },
                      "required": [
                        "byteLength"
                      ],
                      "additionalProperties": false
                    },
                    "byteLength": {
                      "type": "number"
                    },
                    "byteOffset": {
                      "type": "number"
                    }
                  },
                  "required": [
                    "buffer",
                    "byteLength",
                    "byteOffset"
                  ],
                  "additionalProperties": false
                },
                {
                  "type": "object",
                  "properties": {
                    "byteLength": {
                      "type": "number"
                    }
                  },
                  "required": [
                    "byteLength"
                  ],
                  "additionalProperties": false
                },
                {
                  "type": "object",
                  "additionalProperties": false
                },
                {
                  "type": "object",
                  "properties": {
                    "size": {
                      "type": "number"
                    }
                  },
                  "required": [
                    "size"
                  ],
                  "additionalProperties": false
                },
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ]
            },
            "cache": {
              "type": "string",
              "enum": [
                "default",
                "force-cache",
                "no-cache",
                "no-store",
                "only-if-cached",
                "reload"
              ]
            },
            "credentials": {
              "type": "string",
              "enum": [
                "include",
                "omit",
                "same-origin"
              ]
            },
            "headers": {
              "anyOf": [
                {
                  "type": "array",
                  "items": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    },
                    "minItems": 2,
                    "maxItems": 2
                  }
                },
                {
                  "type": "object",
                  "additionalProperties": {
                    "type": "string"
                  }
                },
                {
                  "type": "object",
                  "additionalProperties": false
                }
              ]
            },
            "integrity": {
              "type": "string"
            },
            "keepalive": {
              "type": "boolean"
            },
            "method": {
              "type": "string"
            },
            "mode": {
              "type": "string",
              "enum": [
                "cors",
                "navigate",
                "no-cors",
                "same-origin"
              ]
            },
            "priority": {
              "type": "string",
              "enum": [
                "auto",
                "high",
                "low"
              ]
            },
            "redirect": {
              "type": "string",
              "enum": [
                "error",
                "follow",
                "manual"
              ]
            },
            "referrer": {
              "type": "string"
            },
            "referrerPolicy": {
              "type": "string",
              "enum": [
                "",
                "no-referrer",
                "no-referrer-when-downgrade",
                "origin",
                "origin-when-cross-origin",
                "same-origin",
                "strict-origin",
                "strict-origin-when-cross-origin",
                "unsafe-url"
              ]
            },
            "signal": {
              "anyOf": [
                {
                  "type": "object",
                  "properties": {
                    "aborted": {
                      "type": "boolean"
                    },
                    "onabort": {
                      "anyOf": [
                        {},
                        {
                          "type": "null"
                        }
                      ]
                    },
                    "reason": {}
                  },
                  "required": [
                    "aborted",
                    "onabort",
                    "reason"
                  ],
                  "additionalProperties": false
                },
                {
                  "type": "null"
                }
              ]
            },
            "window": {
              "type": "null"
            }
          },
          "additionalProperties": false
        }
      },
      "additionalProperties": false
    },
    "QueueOptions": {
      "type": "object",
      "properties": {
        "concurrency": {
          "type": "number"
        },
        "interval": {
          "type": "number"
        }
      },
      "additionalProperties": false
    },
    "ValidationOptions": {
      "type": "object",
      "properties": {
        "logErrors": {
          "type": "boolean"
        },
        "logOptionsErrors": {
          "type": "boolean"
        },
        "allowAdditionalProps": {
          "type": "boolean"
        }
      },
      "additionalProperties": false
    },
    "NOTICE_IDS": {
      "type": "string",
      "enum": [
        "yahooSurvey",
        "ripHistorical"
      ]
    },
    "QuoteCombineOptions": {
      "type": "object",
      "properties": {
        "maxSymbolsPerRequest": {
          "type": "number"
        },
        "debounceTime": {
          "type": "number"
        }
      },
      "additionalProperties": false
    },
    "ExtendedCookieJar": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "store": {
          "$ref": "#/definitions/Store"
        },
        "prefixSecurity": {
          "type": "string"
        }
      },
      "required": [
        "prefixSecurity",
        "store"
      ]
    },
    "CookieJar": {
      "type": "object",
      "properties": {
        "store": {
          "$ref": "#/definitions/Store"
        },
        "prefixSecurity": {
          "type": "string"
        }
      },
      "required": [
        "store",
        "prefixSecurity"
      ],
      "additionalProperties": false
    },
    "Store": {
      "type": "object",
      "properties": {
        "synchronous": {
          "type": "boolean"
        }
      },
      "required": [
        "synchronous"
      ],
      "additionalProperties": false
    },
    "Logger": {
      "type": "object",
      "properties": {
        "info": {},
        "warn": {},
        "error": {},
        "debug": {},
        "dir": {}
      },
      "required": [
        "info",
        "warn",
        "error",
        "debug",
        "dir"
      ],
      "additionalProperties": false
    },
    "mergeObjects": {},
    "validateOptions": {},
    "setOptions": {},
    "YahooFinanceFetchModuleOptions": {
      "type": "object",
      "properties": {
        "devel": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            },
            "t": {},
            "onFinish": {}
          },
          "required": [
            "id",
            "t",
            "onFinish"
          ],
          "additionalProperties": false
        },
        "fetch": {},
        "fetchOptions": {
          "type": "object",
          "properties": {
            "body": {
              "anyOf": [
                {
                  "type": "object",
                  "properties": {
                    "locked": {
                      "type": "boolean"
                    }
                  },
                  "required": [
                    "locked"
                  ],
                  "additionalProperties": false
                },
                {
                  "type": "object",
                  "properties": {
                    "size": {
                      "type": "number"
                    },
                    "type": {
                      "type": "string"
                    }
                  },
                  "required": [
                    "size",
                    "type"
                  ],
                  "additionalProperties": false
                },
                {
                  "type": "object",
                  "properties": {
                    "buffer": {
                      "type": "object",
                      "properties": {
                        "byteLength": {
                          "type": "number"
                        }
                      },
                      "required": [
                        "byteLength"
                      ],
                      "additionalProperties": false
                    },
                    "byteLength": {
                      "type": "number"
                    },
                    "byteOffset": {
                      "type": "number"
                    }
                  },
                  "required": [
                    "buffer",
                    "byteLength",
                    "byteOffset"
                  ],
                  "additionalProperties": false
                },
                {
                  "type": "object",
                  "properties": {
                    "byteLength": {
                      "type": "number"
                    }
                  },
                  "required": [
                    "byteLength"
                  ],
                  "additionalProperties": false
                },
                {
                  "type": "object",
                  "additionalProperties": false
                },
                {
                  "type": "object",
                  "properties": {
                    "size": {
                      "type": "number"
                    }
                  },
                  "required": [
                    "size"
                  ],
                  "additionalProperties": false
                },
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ]
            },
            "cache": {
              "type": "string",
              "enum": [
                "default",
                "force-cache",
                "no-cache",
                "no-store",
                "only-if-cached",
                "reload"
              ]
            },
            "credentials": {
              "type": "string",
              "enum": [
                "include",
                "omit",
                "same-origin"
              ]
            },
            "headers": {
              "anyOf": [
                {
                  "type": "array",
                  "items": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    },
                    "minItems": 2,
                    "maxItems": 2
                  }
                },
                {
                  "type": "object",
                  "additionalProperties": {
                    "type": "string"
                  }
                },
                {
                  "type": "object",
                  "additionalProperties": false
                }
              ]
            },
            "integrity": {
              "type": "string"
            },
            "keepalive": {
              "type": "boolean"
            },
            "method": {
              "type": "string"
            },
            "mode": {
              "type": "string",
              "enum": [
                "cors",
                "navigate",
                "no-cors",
                "same-origin"
              ]
            },
            "priority": {
              "type": "string",
              "enum": [
                "auto",
                "high",
                "low"
              ]
            },
            "redirect": {
              "type": "string",
              "enum": [
                "error",
                "follow",
                "manual"
              ]
            },
            "referrer": {
              "type": "string"
            },
            "referrerPolicy": {
              "type": "string",
              "enum": [
                "",
                "no-referrer",
                "no-referrer-when-downgrade",
                "origin",
                "origin-when-cross-origin",
                "same-origin",
                "strict-origin",
                "strict-origin-when-cross-origin",
                "unsafe-url"
              ]
            },
            "signal": {
              "anyOf": [
                {
                  "type": "object",
                  "properties": {
                    "aborted": {
                      "type": "boolean"
                    },
                    "onabort": {
                      "anyOf": [
                        {},
                        {
                          "type": "null"
                        }
                      ]
                    },
                    "reason": {}
                  },
                  "required": [
                    "aborted",
                    "onabort",
                    "reason"
                  ],
                  "additionalProperties": false
                },
                {
                  "type": "null"
                }
              ]
            },
            "window": {
              "type": "null"
            }
          },
          "additionalProperties": false
        },
        "queue": {
          "$ref": "#/definitions/QueueOptions"
        }
      },
      "additionalProperties": false
    },
    "ModuleOptions": {
      "type": "object",
      "properties": {
        "devel": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            },
            "t": {},
            "onFinish": {}
          },
          "required": [
            "id",
            "t",
            "onFinish"
          ],
          "additionalProperties": false
        },
        "fetch": {},
        "fetchOptions": {
          "type": "object",
          "properties": {
            "body": {
              "anyOf": [
                {
                  "type": "object",
                  "properties": {
                    "locked": {
                      "type": "boolean"
                    }
                  },
                  "required": [
                    "locked"
                  ],
                  "additionalProperties": false
                },
                {
                  "type": "object",
                  "properties": {
                    "size": {
                      "type": "number"
                    },
                    "type": {
                      "type": "string"
                    }
                  },
                  "required": [
                    "size",
                    "type"
                  ],
                  "additionalProperties": false
                },
                {
                  "type": "object",
                  "properties": {
                    "buffer": {
                      "type": "object",
                      "properties": {
                        "byteLength": {
                          "type": "number"
                        }
                      },
                      "required": [
                        "byteLength"
                      ],
                      "additionalProperties": false
                    },
                    "byteLength": {
                      "type": "number"
                    },
                    "byteOffset": {
                      "type": "number"
                    }
                  },
                  "required": [
                    "buffer",
                    "byteLength",
                    "byteOffset"
                  ],
                  "additionalProperties": false
                },
                {
                  "type": "object",
                  "properties": {
                    "byteLength": {
                      "type": "number"
                    }
                  },
                  "required": [
                    "byteLength"
                  ],
                  "additionalProperties": false
                },
                {
                  "type": "object",
                  "additionalProperties": false
                },
                {
                  "type": "object",
                  "properties": {
                    "size": {
                      "type": "number"
                    }
                  },
                  "required": [
                    "size"
                  ],
                  "additionalProperties": false
                },
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ]
            },
            "cache": {
              "type": "string",
              "enum": [
                "default",
                "force-cache",
                "no-cache",
                "no-store",
                "only-if-cached",
                "reload"
              ]
            },
            "credentials": {
              "type": "string",
              "enum": [
                "include",
                "omit",
                "same-origin"
              ]
            },
            "headers": {
              "anyOf": [
                {
                  "type": "array",
                  "items": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    },
                    "minItems": 2,
                    "maxItems": 2
                  }
                },
                {
                  "type": "object",
                  "additionalProperties": {
                    "type": "string"
                  }
                },
                {
                  "type": "object",
                  "additionalProperties": false
                }
              ]
            },
            "integrity": {
              "type": "string"
            },
            "keepalive": {
              "type": "boolean"
            },
            "method": {
              "type": "string"
            },
            "mode": {
              "type": "string",
              "enum": [
                "cors",
                "navigate",
                "no-cors",
                "same-origin"
              ]
            },
            "priority": {
              "type": "string",
              "enum": [
                "auto",
                "high",
                "low"
              ]
            },
            "redirect": {
              "type": "string",
              "enum": [
                "error",
                "follow",
                "manual"
              ]
            },
            "referrer": {
              "type": "string"
            },
            "referrerPolicy": {
              "type": "string",
              "enum": [
                "",
                "no-referrer",
                "no-referrer-when-downgrade",
                "origin",
                "origin-when-cross-origin",
                "same-origin",
                "strict-origin",
                "strict-origin-when-cross-origin",
                "unsafe-url"
              ]
            },
            "signal": {
              "anyOf": [
                {
                  "type": "object",
                  "properties": {
                    "aborted": {
                      "type": "boolean"
                    },
                    "onabort": {
                      "anyOf": [
                        {},
                        {
                          "type": "null"
                        }
                      ]
                    },
                    "reason": {}
                  },
                  "required": [
                    "aborted",
                    "onabort",
                    "reason"
                  ],
                  "additionalProperties": false
                },
                {
                  "type": "null"
                }
              ]
            },
            "window": {
              "type": "null"
            }
          },
          "additionalProperties": false
        },
        "queue": {
          "$ref": "#/definitions/QueueOptions"
        },
        "validateOptions": {
          "type": "boolean"
        },
        "validateResult": {
          "type": "boolean"
        }
      },
      "additionalProperties": false
    },
    "ModuleOptionsWithValidateFalse": {
      "type": "object",
      "properties": {
        "devel": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            },
            "t": {},
            "onFinish": {}
          },
          "required": [
            "id",
            "t",
            "onFinish"
          ],
          "additionalProperties": false
        },
        "fetch": {},
        "fetchOptions": {
          "type": "object",
          "properties": {
            "body": {
              "anyOf": [
                {
                  "type": "object",
                  "properties": {
                    "locked": {
                      "type": "boolean"
                    }
                  },
                  "required": [
                    "locked"
                  ],
                  "additionalProperties": false
                },
                {
                  "type": "object",
                  "properties": {
                    "size": {
                      "type": "number"
                    },
                    "type": {
                      "type": "string"
                    }
                  },
                  "required": [
                    "size",
                    "type"
                  ],
                  "additionalProperties": false
                },
                {
                  "type": "object",
                  "properties": {
                    "buffer": {
                      "type": "object",
                      "properties": {
                        "byteLength": {
                          "type": "number"
                        }
                      },
                      "required": [
                        "byteLength"
                      ],
                      "additionalProperties": false
                    },
                    "byteLength": {
                      "type": "number"
                    },
                    "byteOffset": {
                      "type": "number"
                    }
                  },
                  "required": [
                    "buffer",
                    "byteLength",
                    "byteOffset"
                  ],
                  "additionalProperties": false
                },
                {
                  "type": "object",
                  "properties": {
                    "byteLength": {
                      "type": "number"
                    }
                  },
                  "required": [
                    "byteLength"
                  ],
                  "additionalProperties": false
                },
                {
                  "type": "object",
                  "additionalProperties": false
                },
                {
                  "type": "object",
                  "properties": {
                    "size": {
                      "type": "number"
                    }
                  },
                  "required": [
                    "size"
                  ],
                  "additionalProperties": false
                },
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ]
            },
            "cache": {
              "type": "string",
              "enum": [
                "default",
                "force-cache",
                "no-cache",
                "no-store",
                "only-if-cached",
                "reload"
              ]
            },
            "credentials": {
              "type": "string",
              "enum": [
                "include",
                "omit",
                "same-origin"
              ]
            },
            "headers": {
              "anyOf": [
                {
                  "type": "array",
                  "items": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    },
                    "minItems": 2,
                    "maxItems": 2
                  }
                },
                {
                  "type": "object",
                  "additionalProperties": {
                    "type": "string"
                  }
                },
                {
                  "type": "object",
                  "additionalProperties": false
                }
              ]
            },
            "integrity": {
              "type": "string"
            },
            "keepalive": {
              "type": "boolean"
            },
            "method": {
              "type": "string"
            },
            "mode": {
              "type": "string",
              "enum": [
                "cors",
                "navigate",
                "no-cors",
                "same-origin"
              ]
            },
            "priority": {
              "type": "string",
              "enum": [
                "auto",
                "high",
                "low"
              ]
            },
            "redirect": {
              "type": "string",
              "enum": [
                "error",
                "follow",
                "manual"
              ]
            },
            "referrer": {
              "type": "string"
            },
            "referrerPolicy": {
              "type": "string",
              "enum": [
                "",
                "no-referrer",
                "no-referrer-when-downgrade",
                "origin",
                "origin-when-cross-origin",
                "same-origin",
                "strict-origin",
                "strict-origin-when-cross-origin",
                "unsafe-url"
              ]
            },
            "signal": {
              "anyOf": [
                {
                  "type": "object",
                  "properties": {
                    "aborted": {
                      "type": "boolean"
                    },
                    "onabort": {
                      "anyOf": [
                        {},
                        {
                          "type": "null"
                        }
                      ]
                    },
                    "reason": {}
                  },
                  "required": [
                    "aborted",
                    "onabort",
                    "reason"
                  ],
                  "additionalProperties": false
                },
                {
                  "type": "null"
                }
              ]
            },
            "window": {
              "type": "null"
            }
          },
          "additionalProperties": false
        },
        "queue": {
          "$ref": "#/definitions/QueueOptions"
        },
        "validateOptions": {
          "type": "boolean"
        },
        "validateResult": {
          "type": "boolean",
          "const": false
        }
      },
      "required": [
        "validateResult"
      ],
      "additionalProperties": false
    },
    "ModuleOptionsWithValidateTrue": {
      "type": "object",
      "properties": {
        "devel": {
          "type": "object",
          "properties": {
            "id": {
              "type": "string"
            },
            "t": {},
            "onFinish": {}
          },
          "required": [
            "id",
            "t",
            "onFinish"
          ],
          "additionalProperties": false
        },
        "fetch": {},
        "fetchOptions": {
          "type": "object",
          "properties": {
            "body": {
              "anyOf": [
                {
                  "type": "object",
                  "properties": {
                    "locked": {
                      "type": "boolean"
                    }
                  },
                  "required": [
                    "locked"
                  ],
                  "additionalProperties": false
                },
                {
                  "type": "object",
                  "properties": {
                    "size": {
                      "type": "number"
                    },
                    "type": {
                      "type": "string"
                    }
                  },
                  "required": [
                    "size",
                    "type"
                  ],
                  "additionalProperties": false
                },
                {
                  "type": "object",
                  "properties": {
                    "buffer": {
                      "type": "object",
                      "properties": {
                        "byteLength": {
                          "type": "number"
                        }
                      },
                      "required": [
                        "byteLength"
                      ],
                      "additionalProperties": false
                    },
                    "byteLength": {
                      "type": "number"
                    },
                    "byteOffset": {
                      "type": "number"
                    }
                  },
                  "required": [
                    "buffer",
                    "byteLength",
                    "byteOffset"
                  ],
                  "additionalProperties": false
                },
                {
                  "type": "object",
                  "properties": {
                    "byteLength": {
                      "type": "number"
                    }
                  },
                  "required": [
                    "byteLength"
                  ],
                  "additionalProperties": false
                },
                {
                  "type": "object",
                  "additionalProperties": false
                },
                {
                  "type": "object",
                  "properties": {
                    "size": {
                      "type": "number"
                    }
                  },
                  "required": [
                    "size"
                  ],
                  "additionalProperties": false
                },
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ]
            },
            "cache": {
              "type": "string",
              "enum": [
                "default",
                "force-cache",
                "no-cache",
                "no-store",
                "only-if-cached",
                "reload"
              ]
            },
            "credentials": {
              "type": "string",
              "enum": [
                "include",
                "omit",
                "same-origin"
              ]
            },
            "headers": {
              "anyOf": [
                {
                  "type": "array",
                  "items": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    },
                    "minItems": 2,
                    "maxItems": 2
                  }
                },
                {
                  "type": "object",
                  "additionalProperties": {
                    "type": "string"
                  }
                },
                {
                  "type": "object",
                  "additionalProperties": false
                }
              ]
            },
            "integrity": {
              "type": "string"
            },
            "keepalive": {
              "type": "boolean"
            },
            "method": {
              "type": "string"
            },
            "mode": {
              "type": "string",
              "enum": [
                "cors",
                "navigate",
                "no-cors",
                "same-origin"
              ]
            },
            "priority": {
              "type": "string",
              "enum": [
                "auto",
                "high",
                "low"
              ]
            },
            "redirect": {
              "type": "string",
              "enum": [
                "error",
                "follow",
                "manual"
              ]
            },
            "referrer": {
              "type": "string"
            },
            "referrerPolicy": {
              "type": "string",
              "enum": [
                "",
                "no-referrer",
                "no-referrer-when-downgrade",
                "origin",
                "origin-when-cross-origin",
                "same-origin",
                "strict-origin",
                "strict-origin-when-cross-origin",
                "unsafe-url"
              ]
            },
            "signal": {
              "anyOf": [
                {
                  "type": "object",
                  "properties": {
                    "aborted": {
                      "type": "boolean"
                    },
                    "onabort": {
                      "anyOf": [
                        {},
                        {
                          "type": "null"
                        }
                      ]
                    },
                    "reason": {}
                  },
                  "required": [
                    "aborted",
                    "onabort",
                    "reason"
                  ],
                  "additionalProperties": false
                },
                {
                  "type": "null"
                }
              ]
            },
            "window": {
              "type": "null"
            }
          },
          "additionalProperties": false
        },
        "queue": {
          "$ref": "#/definitions/QueueOptions"
        },
        "validateOptions": {
          "type": "boolean"
        },
        "validateResult": {
          "type": "boolean",
          "const": true
        }
      },
      "additionalProperties": false
    },
    "ModuleThis": {
      "type": "object",
      "properties": {
        "_moduleExec": {}
      },
      "required": [
        "_moduleExec"
      ]
    },
    "ModuleError": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string"
        },
        "message": {
          "type": "string"
        },
        "stack": {
          "type": "string"
        }
      },
      "required": [
        "name",
        "message"
      ],
      "additionalProperties": false
    }
  }
};
const pkg = {
  "name": "@gadicc/yahoo-finance2",
  "version": "3.15.2"
};
class BadRequestError extends Error {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "BadRequestError"
    });
  }
}
class HTTPError extends Error {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "HTTPError"
    });
  }
}
class InvalidOptionsError extends Error {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "InvalidOptionsError"
    });
  }
}
class NoEnvironmentError extends Error {
  constructor() {
    super(...arguments);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "NoEnvironmentError"
    });
  }
}
class FailedYahooValidationError extends Error {
  constructor(message, { result, errors: errors2 }) {
    super(message);
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: "FailedYahooValidationError"
    });
    Object.defineProperty(this, "result", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "errors", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.result = result;
    this.errors = errors2;
  }
}
const errors = {
  BadRequestError,
  HTTPError,
  InvalidOptionsError,
  NoEnvironmentError,
  FailedYahooValidationError
};
const array = function array2(input, schema2, ctx, errors2, instancePath, _dataCtx, schemaPath) {
  if (!Array.isArray(input)) {
    errors2.push({ instancePath, message: "Expected an array", data: input });
    return false;
  }
  if (schema2.items) {
    const dataCtx = { parentData: input, parentDataProperty: 0 };
    for (const [idx, value] of input.entries()) {
      dataCtx.parentDataProperty = idx;
      validateAndCoerce(value, schema2.items, ctx, errors2, instancePath + "/" + idx, dataCtx, schemaPath + "/items");
    }
  }
  return true;
};
const boolean = function boolean2(input, _schema, _ctx, errors2, instancePath, _dataCtx, schemaPath) {
  if (typeof input !== "boolean") {
    errors2.push({
      instancePath,
      schemaPath,
      message: "Expected a boolean",
      data: input
    });
    return false;
  }
  return true;
};
const _null = function _null2(input, _schema, _ctx, errors2, instancePath, dataCtx, schemaPath) {
  if (typeof input === "object" && input !== null && Object.keys(input).length === 0) {
    set(dataCtx, null, instancePath);
    return true;
  }
  if (input !== null) {
    errors2.push({
      instancePath,
      schemaPath,
      message: "Expected null",
      data: input
    });
    return false;
  }
  return true;
};
const number = function number2(input, schema2, _ctx, errors2, instancePath, dataCtx, schemaPath) {
  if (typeof input === "string") {
    const float = Number.parseFloat(input);
    if (Number.isNaN(float)) {
      errors2.push({
        instancePath,
        schemaPath,
        keyword: "yahooFinanceType",
        message: "Number.parseFloat returned NaN",
        params: { schema: schema2 },
        data: input
      });
      return false;
    }
    set(dataCtx, float, instancePath);
    return true;
  }
  if (typeof input === "object" && input !== null) {
    if (Object.keys(input).length === 0) {
      if (Array.isArray(schema2.type) && schema2.type.includes("null")) {
        set(dataCtx, null, instancePath);
        return true;
      } else {
        errors2.push({
          instancePath,
          schemaPath,
          keyword: "yahooFinanceType",
          message: "Got {}->null for 'number', did you want 'number | null' ?",
          params: { schema: schema2 },
          data: input
        });
        return false;
      }
    }
    if ("raw" in input && typeof input.raw === "number") {
      set(dataCtx, input.raw, instancePath);
      return true;
    }
  }
  if (typeof input !== "number") {
    errors2.push({
      instancePath,
      schemaPath,
      message: "Expected a number'ish",
      data: input
    });
    return false;
  }
  return true;
};
const object = function object2(input, schema2, ctx, errors2, instancePath, dataCtx, schemaPath, refs) {
  if (refs && refs[refs.length - 1] === "TwoNumberRange") {
    if (typeof input === "object" && input !== null && "low" in input && typeof input.low === "number" && "high" in input && typeof input.high === "number") {
      return true;
    }
    if (typeof input === "string") {
      const parts = input.split("-").map(parseFloat);
      if (Number.isNaN(parts[0]) || Number.isNaN(parts[1])) {
        errors2.push({
          // keyword: "yahooFinanceType",
          instancePath,
          schemaPath,
          message: "yahooFinanceType: Number.parseFloat returned NaN: [" + parts.join(",") + "]",
          // params: { schema, data },
          schema: schema2,
          data: input
        });
        return false;
      }
      set(dataCtx, { low: parts[0], high: parts[1] }, instancePath);
      return true;
    }
    errors2.push({
      // keyword: "yahooFinanceType",
      instancePath,
      schemaPath,
      message: "TwoNumberRange: Unexpected format",
      // params: { schema, data },
      schema: schema2,
      data: input
    });
    return false;
  }
  if (typeof input !== "object") {
    console.log({ schemaPath, schema: schema2 });
    errors2.push({
      instancePath,
      schemaPath,
      message: "Expected an object",
      data: input
    });
    return false;
  }
  const _input = input;
  const _dataCtx = { parentData: _input, parentDataProperty: "" };
  if (schema2.required) {
    for (const key of schema2.required) {
      if (!(key in _input)) {
        errors2.push({
          instancePath,
          schemaPath: schemaPath + "/required",
          message: "Missing required property",
          data: key
        });
      }
    }
  }
  for (const [key, value] of Object.entries(_input)) {
    const propSchema = schema2.properties?.[key];
    _dataCtx.parentDataProperty = key;
    if (propSchema) {
      validateAndCoerce(value, propSchema, ctx, errors2, instancePath + "/" + key, _dataCtx, schemaPath);
    } else {
      if (schema2.additionalProperties === false) {
        errors2.push({
          instancePath,
          schemaPath: schemaPath + "/additionalProperties",
          message: "should NOT have additional properties",
          params: {
            additionalProperty: key
          },
          data: _input
        });
      } else if (schema2.additionalProperties) {
        validateAndCoerce(value, schema2.additionalProperties, ctx, errors2, instancePath + "/" + key, _dataCtx, schemaPath + "/additionalProperties");
      }
    }
  }
  return true;
};
const string = function string2(input, schema2, _ctx, errors2, instancePath, dataCtx, schemaPath, refs) {
  if (schema2.format === "date-time") {
    if (input instanceof Date) {
      return true;
    }
    if (typeof input === "number") {
      if (refs && refs[refs.length - 1] === "DateInMs") {
        set(dataCtx, new Date(input), instancePath);
        return true;
      }
      set(dataCtx, new Date(input * 1e3), instancePath);
      return true;
    }
    if (typeof input === "object" && input !== null) {
      if (Object.keys(input).length === 0) {
        if (Array.isArray(schema2.type) && schema2.type.includes("null")) {
          set(dataCtx, null, instancePath);
          return true;
        } else {
          errors2.push({
            instancePath,
            schemaPath,
            keyword: "yahooFinanceType",
            message: "Got {}->null for 'date', did you want 'date | null' ?",
            params: { schema: schema2 },
            data: input
          });
          return false;
        }
      }
      if ("raw" in input && typeof input.raw === "number") {
        set(dataCtx, new Date(input.raw * 1e3), instancePath);
        return true;
      }
    }
    if (typeof input === "string") {
      if (input.match(/^\d{4,4}-\d{2,2}-\d{2,2}$/) || input.match(/^\d{4,4}-\d{2,2}-\d{2,2}T\d{2,2}:\d{2,2}:\d{2,2}(\.\d{3,3})?Z$/)) {
        set(dataCtx, new Date(input), instancePath);
        return true;
      }
    }
    errors2.push({
      instancePath,
      schemaPath,
      message: "Expecting date'ish",
      params: { schema: schema2 },
      data: input
    });
    return false;
  }
  if (typeof input !== "string") {
    errors2.push({
      instancePath,
      schemaPath,
      message: "Expected a string",
      data: input
    });
    return false;
  }
  if (schema2.const && input !== schema2.const) {
    errors2.push({
      instancePath,
      schemaPath,
      message: "Invalid const value",
      data: input,
      params: { const: schema2.const }
    });
    return false;
  }
  if (schema2.enum && !schema2.enum.includes(input)) {
    errors2.push({
      instancePath,
      schemaPath,
      message: "Invalid enum value",
      data: input,
      params: { enum: schema2.enum }
    });
    return false;
  }
  return true;
};
const _undefined = function _undefined2(input, schema2, _ctx, errors2, instancePath, _dataCtx, schemaPath) {
  if (input !== void 0) {
    errors2.push({
      instancePath,
      schemaPath,
      message: "Expected undefined",
      data: input,
      schema: schema2
    });
    return false;
  }
  return true;
};
const byType = {
  array,
  boolean,
  null: _null,
  number,
  object,
  string,
  undefined: _undefined
};
const getTypedDefinitions = (schema2) => schema2.definitions;
function set(dataCtx, value, instancePath) {
  if (dataCtx && dataCtx.parentData && dataCtx.parentDataProperty !== "") {
    dataCtx.parentData[dataCtx.parentDataProperty] = value;
  } else {
    throw new Error('In "' + instancePath + '", cannot set value ' + JSON.stringify(value) + " to context " + JSON.stringify(dataCtx));
  }
}
function schemaFromSchemaOrSchemaKey(schemaOrSchemaKey, definitions2) {
  let schema2;
  let path = "";
  if (!definitions2) {
    throw new Error("No definitions provided");
  }
  if (typeof schemaOrSchemaKey === "string") {
    const definition = schemaOrSchemaKey.match(/^#\/definitions\/(.*)$/)?.[1];
    if (!definition) {
      throw new Error("No such schema with key: " + schemaOrSchemaKey);
    }
    schema2 = definitions2[definition];
    path = schemaOrSchemaKey;
    if (!schema2) {
      throw new Error(`No such schema with key: ${definition}`);
    }
  } else {
    schema2 = schemaOrSchemaKey;
    if (schema2.$id)
      path = schema2.$id;
  }
  let refs;
  while (schema2.$ref) {
    if (!refs)
      refs = [];
    const ref = schema2.$ref.replace("#/definitions/", "");
    refs.push(ref);
    schema2 = definitions2[ref];
    path = schema2.$ref;
  }
  return [schema2, path, refs];
}
function validateAndCoerce(input, schemaOrSchemaKey, ctx, errors2 = [], instancePath = "", dataCtx, schemaPath = null) {
  const [schema2, foundSchemaPath, refs] = schemaFromSchemaOrSchemaKey(schemaOrSchemaKey, ctx.definitions);
  if (foundSchemaPath)
    schemaPath = foundSchemaPath;
  if (schema2.anyOf) {
    const allErrors = [];
    let _errors = [];
    const serializedInput = JSON.stringify(input);
    let i = 0;
    for (const subSchema of schema2.anyOf) {
      const subSchemaPath = subSchema.$ref || schemaPath + "/anyOf/" + (i++).toString();
      _errors = [];
      validateAndCoerce(input, subSchema, ctx, _errors, instancePath, dataCtx, subSchemaPath);
      if (!_errors.length)
        break;
      allErrors.push(..._errors);
      if (dataCtx?.parentData) {
        input = serializedInput === void 0 ? void 0 : JSON.parse(serializedInput);
        dataCtx.parentData[dataCtx.parentDataProperty] = input;
      }
    }
    if (_errors.length) {
      errors2.push({
        instancePath,
        schemaPath,
        // ! because of "if null" check above
        message: "should match some schema in anyOf",
        data: input,
        // schema,
        subErrors: allErrors
      });
      return errors2;
    }
  } else if (schema2.oneOf) {
    if (!("discriminator" in schema2)) {
      throw new Error("oneOf without discriminator not supported yet");
    }
    const discriminator = schema2.discriminator?.propertyName;
    const allErrors = [];
    let _errors = [];
    const serializedInput = JSON.stringify(input);
    let i = 0;
    for (const subSchema of schema2.oneOf) {
      const subSchemaPath = subSchema.$ref || schemaPath + "/oneOf/" + (i++).toString();
      _errors = [];
      const _subSchema = schemaFromSchemaOrSchemaKey(subSchema, ctx.definitions)[0];
      if (_subSchema.properties?.hasOwnProperty(discriminator)) {
        validateAndCoerce(input, subSchema, ctx, _errors, instancePath, dataCtx, subSchemaPath);
      } else {
        _errors.push({
          instancePath,
          schemaPath: subSchemaPath,
          message: `Missing discriminator field "${discriminator}" in schema`,
          data: input
        });
      }
      if (!_errors.length)
        break;
      if (_errors.some((error) => error.instancePath === "/" + discriminator)) ;
      else {
        allErrors.push(..._errors);
      }
      if (dataCtx?.parentData) {
        input = serializedInput === void 0 ? void 0 : JSON.parse(serializedInput);
        dataCtx.parentData[dataCtx.parentDataProperty] = input;
      }
    }
    if (_errors.length) {
      errors2.push({
        instancePath,
        schemaPath,
        // ! because of "if null" check above
        message: "should match some schema in oneOf",
        params: { discriminator },
        data: input,
        // schema,
        subErrors: allErrors
      });
      return errors2;
    }
  } else {
    if (schema2.type === void 0) ;
    else if (Array.isArray(schema2.type)) {
      let _errors = [];
      for (const type of schema2.type) {
        _errors = [];
        const validator = byType[type];
        if (!validator) {
          throw new Error(`No validator for type ${JSON.stringify(type)} in ${instancePath}`);
        }
        validator(input, schema2, ctx, _errors, instancePath, dataCtx, schemaPath, refs);
        if (!_errors.length)
          break;
      }
      if (_errors.length) {
        errors2.push({
          instancePath,
          message: `Expected one of ${schema2.type.join(", ")}`,
          data: input
        });
        return errors2;
      }
    } else {
      const validator = byType[schema2.type];
      if (!validator) {
        throw new Error(`No validator for type ${JSON.stringify(schema2.type)} in ${instancePath}`);
      }
      validator(input, schema2, ctx, errors2, instancePath, dataCtx, schemaPath, refs);
    }
  }
  return errors2;
}
const repository = "https://github.com/gadicc/yahoo-finance2";
let latestVersion = null;
async function getLatestVersion() {
  if (latestVersion)
    return latestVersion;
  const response = await fetch(`https://registry.npmjs.org/yahoo-finance2/latest`);
  if (!response.ok) {
    throw new Error("Failed to fetch latest version");
  }
  const latestPkgJson = await response.json();
  latestVersion = latestPkgJson.version;
  return latestVersion;
}
let versionCheckResult = null;
async function versionCheck() {
  if (versionCheckResult)
    return versionCheckResult;
  const latestVersion2 = await getLatestVersion();
  return versionCheckResult = {
    current: pkg.version,
    latest: latestVersion2,
    isLatest: latestVersion2 === pkg.version
  };
}
const doneAlready = /* @__PURE__ */ new Map();
function disallowAdditionalProps(definitions2, show = false) {
  if (doneAlready.has(definitions2))
    return;
  doneAlready.set(definitions2, true);
  const disallowed = /* @__PURE__ */ new Set();
  for (const key of Object.keys(definitions2)) {
    if (key.match(/Options$/)) {
      continue;
    }
    const def = definitions2[key];
    if (def.type === "object") {
      if (def.additionalProperties === void 0 || typeof def.additionalProperties === "object" && Object.keys(def.additionalProperties).length === 0) {
        def.additionalProperties = false;
        disallowed.add(key);
      }
    }
  }
  if (show) {
    console.log("Disallowed additional props in " + Array.from(disallowed).join(", "));
  }
}
function aggregateErrors(inputErrors) {
  const missingMap = /* @__PURE__ */ new Map();
  const additionalMap = /* @__PURE__ */ new Map();
  const errors2 = inputErrors.filter((error) => {
    if (error.subErrors) {
      error.subErrors = aggregateErrors(error.subErrors);
    }
    if (error.schemaPath) {
      const key = error.schemaPath + "|" + error.instancePath;
      if (error.message === "Missing required property") {
        let arr;
        if (missingMap.has(key)) {
          arr = missingMap.get(key);
        } else {
          arr = [];
          missingMap.set(key, arr);
        }
        arr.push(error);
        return false;
      } else if (error.message === "should NOT have additional properties") {
        let arr;
        if (additionalMap.has(key)) {
          arr = additionalMap.get(key);
        } else {
          arr = [];
          additionalMap.set(key, arr);
        }
        arr.push(error);
        return false;
      }
    }
    return true;
  });
  for (const arr of missingMap.values()) {
    const missing = [];
    for (const error of arr) {
      missing.push(error.data || "somethingWentWrong(tm)");
    }
    errors2.push({
      schemaPath: arr[0].schemaPath,
      instancePath: arr[0].instancePath,
      message: "Missing required properties",
      params: { missing }
    });
  }
  for (const arr of additionalMap.values()) {
    const additionalProperties = {};
    for (const error of arr) {
      const additionalProperty = error.params?.additionalProperty || "somethingWentWrong(tm)";
      additionalProperties[additionalProperty] = error.data[additionalProperty];
    }
    errors2.push({
      schemaPath: arr[0].schemaPath,
      instancePath: arr[0].instancePath,
      message: "should NOT have additional properties",
      params: { additionalProperties }
    });
  }
  return errors2;
}
function validate({ source, type, object: object3, schemaOrSchemaKey, definitions: definitions2, options: options2, logger, logObj, versionCheck: versionCheck$1 }) {
  const _errors = validateAndCoerce(object3, schemaOrSchemaKey, { definitions: definitions2, logger, logObj });
  if (_errors.length === 0)
    return;
  const errors2 = aggregateErrors(_errors);
  if (type === "result") {
    if (options2.logErrors === true) {
      const title = encodeURIComponent("Failed validation: " + schemaOrSchemaKey);
      logger.error("The following result did not validate with schema: " + schemaOrSchemaKey);
      logObj(errors2, { depth: 5 });
      logger.error(`
This may happen intermittently and you should catch errors appropriately.  However:  1) if this recently started happening on every request for a symbol that used to work, Yahoo may have changed their API.  2) If this happens on every request for a symbol you've never used before, but not for other symbols, you've found an edge-case (OR, we may just be protecting you from "bad" data sometimes stored for e.g. misspelt symbols on Yahoo's side).

Please see if anyone has reported this previously:

  ${repository}/issues?q=is%3Aissue+${title}

or open a new issue (and mention the symbol):  ${pkg.name} v${pkg.version}

  ${repository}/issues/new?labels=bug%2C+validation&template=validation.md&title=${title}

For information on how to turn off the above logging or skip these errors, see https://github.com/gadicc/yahoo-finance2/tree/devel/docs/validation.md.

At the end of the doc, there's also a section on how to "Help Fix Validation Errors" in case you'd like to contribute to the project.  Most of the time, these fixes are very quick and easy; it's just hard for our small core team to keep up, so help is always appreciated!
`);
      if (versionCheck$1) {
        versionCheck().then((result) => {
          if (!result.isLatest) {
            logger.info(`Additionally, your yahoo-finance2 version out of date: ${result.current} < ${result.latest} (latest)`);
          }
        }).catch((error) => {
          logger.error(`Failed to check version: ${error.message}`);
        });
      }
    }
    throw new FailedYahooValidationError("Failed Yahoo Schema validation", {
      result: object3,
      errors: errors2
    });
  } else {
    if (options2.logOptionsErrors === true) {
      logger.error(`[yahooFinance.${source}] Invalid options ("${schemaOrSchemaKey}")`);
      logObj({ errors: errors2, input: object3 });
    }
    throw new InvalidOptionsError(`yahooFinance.${source} called with invalid options.`);
  }
}
const definitions$a = getTypedDefinitions(optionsSchema);
function mergeObjects(original, objToMerge) {
  const ownKeys = Reflect.ownKeys(objToMerge);
  for (const key of ownKeys) {
    if (typeof objToMerge[key] === "object") {
      mergeObjects(original[key], objToMerge[key]);
    } else {
      original[key] = objToMerge[key];
    }
  }
}
function validateOptions(options2, source = "_setOpts") {
  const { cookieJar, logger, fetch: fetch2, ...simpleOptions } = options2;
  validate({
    object: simpleOptions,
    source,
    type: "options",
    // options: this._opts.validation!,
    options: {
      logErrors: false,
      logOptionsErrors: true
    },
    schemaOrSchemaKey: "#/definitions/YahooFinanceOptions",
    definitions: definitions$a,
    logger: this._opts.logger,
    logObj: this._logObj,
    // versionCheck: this._opts.versionCheck!,
    versionCheck: false
  });
  if (cookieJar && !(cookieJar instanceof ExtendedCookieJar)) {
    throw new Error("cookieJar must be an instance of ExtendedCookieJar");
  }
  logger && validateOptions$1(logger);
  if (fetch2 && typeof fetch2 !== "function") {
    throw new Error("fetch must be a function");
  }
}
function setOptions(options2) {
  validateOptions.call(this, options2);
  mergeObjects(this._opts, options2);
}
class Queue {
  constructor(opts = {}) {
    Object.defineProperty(this, "concurrency", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 1
    });
    Object.defineProperty(this, "interval", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 0
    });
    Object.defineProperty(this, "_running", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 0
    });
    Object.defineProperty(this, "_queue", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: []
    });
    Object.defineProperty(this, "_lastRun", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 0
    });
    Object.defineProperty(this, "_timer", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: null
    });
    if (typeof opts.concurrency === "number") {
      this.concurrency = opts.concurrency;
    }
    if (typeof opts.interval === "number") {
      this.interval = opts.interval;
    }
  }
  runNext() {
    const job = this._queue.shift();
    if (!job)
      return;
    this._running++;
    this._lastRun = Date.now();
    job.func().then((result) => job.resolve(result)).catch((error) => job.reject(error)).finally(() => {
      this._running--;
      this.checkQueue();
    });
  }
  checkQueue() {
    if (this._running >= this.concurrency)
      return;
    if (!this._queue.length)
      return;
    const delay = this.interval > 0 && this._lastRun > 0 ? Math.max(0, this._lastRun + this.interval - Date.now()) : 0;
    if (delay > 0) {
      if (!this._timer) {
        this._timer = setTimeout(() => {
          this._timer = null;
          this.checkQueue();
        }, delay);
      }
      return;
    }
    this.runNext();
    if (this.interval > 0)
      this.checkQueue();
  }
  add(func) {
    return new Promise((resolve, reject) => {
      this._queue.push({ func, resolve, reject });
      this.checkQueue();
    });
  }
}
const CONFIG_FAKE_URL = "http://config.yf2/";
let crumb = null;
const parseHtmlEntities = (str) => str.replace(/&#x([0-9A-Fa-f]{1,3});/gi, (_, numStr) => String.fromCharCode(parseInt(numStr, 16)));
async function _getCrumb(cookieJar, fetch2, fetchOptionsBase, logger, url = "https://finance.yahoo.com/quote/AAPL", develOverride = {
  id: "getCrumb-quote-AAPL",
  // By default, unset onFinish, so that a failing test calling getCrumb
  // won't "fail" this call (which isn't actually a test) and, e.g., in
  // the case of FETCH_DEVEL=recache, won't rewrite the json with this id.
  onFinish: void 0
}, noCache = false) {
  if (!crumb) {
    const cookies = await cookieJar.getCookies(CONFIG_FAKE_URL);
    for (const cookie2 of cookies) {
      if (cookie2.key === "crumb") {
        crumb = cookie2.value;
        logger.debug("Retrieved crumb from cookie store: " + crumb);
        break;
      }
    }
  }
  if (crumb && !noCache) {
    const existingCookies = await cookieJar.getCookies(url, { expire: true });
    if (existingCookies.length)
      return crumb;
  }
  async function processSetCookieHeader(header, url2) {
    if (header) {
      await cookieJar.setFromSetCookieHeaders(header, url2);
      return true;
    }
    return false;
  }
  logger.debug("Fetching crumb and cookies from " + url + "...");
  const fetchOptions = {
    ...fetchOptionsBase,
    headers: {
      ...fetchOptionsBase.headers,
      // NB, we won't get a set-cookie header back without this:
      accept: "text/html,application/xhtml+xml,application/xml"
      // This request will get our first cookies, so nothing to send.
      // cookie: await cookieJar.getCookieString(url),
    },
    redirect: "manual"
  };
  if (fetchOptionsBase.devel) {
    fetchOptions.devel = {
      ...fetchOptionsBase.devel,
      ...develOverride
    };
  }
  const response = await fetch2(url, fetchOptions);
  await processSetCookieHeader(response.headers.getSetCookie(), url);
  const location = response.headers.get("location");
  if (location) {
    if (location.match(/guce.yahoo/)) {
      const consentFetchOptions = {
        ...fetchOptions,
        headers: {
          ...fetchOptions.headers,
          // GUCS=XXXXXXXX; Max-Age=1800; Domain=.yahoo.com; Path=/; Secure
          cookie: await cookieJar.getCookieString(location)
        },
        devel: {
          id: "getCrumb-quote-AAPL-consent.html",
          t: develOverride.t,
          onFinish: develOverride.onFinish
        }
      };
      logger.debug(
        "fetch",
        location
        /*, consentFetchOptions */
      );
      const consentResponse = await fetch2(location, consentFetchOptions);
      const consentLocation = consentResponse.headers.get("location");
      if (consentLocation) {
        if (!consentLocation.match(/collectConsent/)) {
          throw new Error("Unexpected redirect to " + consentLocation);
        }
        const collectConsentFetchOptions = {
          ...consentFetchOptions,
          headers: {
            ...fetchOptions.headers,
            cookie: await cookieJar.getCookieString(consentLocation)
          },
          devel: {
            id: "getCrumb-quote-AAPL-collectConsent.html",
            t: develOverride.t,
            onFinish: develOverride.onFinish
          }
        };
        logger.debug("fetch", consentLocation);
        const collectConsentResponse = await fetch2(consentLocation, collectConsentFetchOptions);
        const collectConsentBody = await collectConsentResponse.text();
        const collectConsentResponseParams = [
          ...collectConsentBody.matchAll(/<input type="hidden" name="([^"]+)" value="([^"]+)">/g)
        ].map(([, name, value]) => `${name}=${encodeURIComponent(parseHtmlEntities(value))}&`).join("") + "agree=agree&agree=agree";
        const collectConsentSubmitFetchOptions = {
          ...consentFetchOptions,
          headers: {
            ...fetchOptions.headers,
            cookie: await cookieJar.getCookieString(consentLocation),
            "content-type": "application/x-www-form-urlencoded"
          },
          method: "POST",
          // body: "csrfToken=XjJfOYU&sessionId=3_cc-session_bd9a3b0c-c1b4-4aa8-8c18-7a82ec68a5d5&originalDoneUrl=https%3A%2F%2Ffinance.yahoo.com%2Fquote%2FAAPL%3Fguccounter%3D1&namespace=yahoo&agree=agree&agree=agree",
          body: collectConsentResponseParams,
          devel: {
            id: "getCrumb-quote-AAPL-collectConsentSubmit",
            t: develOverride.t,
            onFinish: develOverride.onFinish
          }
        };
        logger.debug("fetch", consentLocation);
        const collectConsentSubmitResponse = await fetch2(consentLocation, collectConsentSubmitFetchOptions);
        if (!await processSetCookieHeader(collectConsentSubmitResponse.headers.getSetCookie(), consentLocation)) {
          throw new Error("No set-cookie header on collectConsentSubmitResponse, please report.");
        }
        const collectConsentSubmitResponseLocation = collectConsentSubmitResponse.headers.get("location");
        if (!collectConsentSubmitResponseLocation) {
          throw new Error("collectConsentSubmitResponse(1) unexpectedly did not return a Location header, please report.");
        }
        const copyConsentFetchOptions = {
          ...consentFetchOptions,
          headers: {
            ...fetchOptions.headers,
            cookie: await cookieJar.getCookieString(collectConsentSubmitResponseLocation)
          },
          devel: {
            id: "getCrumb-quote-AAPL-copyConsent",
            t: develOverride.t,
            onFinish: develOverride.onFinish
          }
        };
        logger.debug("fetch", collectConsentSubmitResponseLocation);
        const copyConsentResponse = await fetch2(collectConsentSubmitResponseLocation, copyConsentFetchOptions);
        if (!await processSetCookieHeader(copyConsentResponse.headers.getSetCookie(), collectConsentSubmitResponseLocation)) {
          throw new Error("No set-cookie header on copyConsentResponse, please report.");
        }
        const copyConsentResponseLocation = copyConsentResponse.headers.get("location");
        if (!copyConsentResponseLocation) {
          throw new Error("collectConsentSubmitResponse(2) unexpectedly did not return a Location header, please report.");
        }
        const finalResponseFetchOptions = {
          ...fetchOptions,
          headers: {
            ...fetchOptions.headers,
            cookie: await cookieJar.getCookieString(collectConsentSubmitResponseLocation)
          },
          devel: {
            id: "getCrumb-quote-AAPL-consent-final-redirect.html",
            t: develOverride.t,
            onFinish: develOverride.onFinish
          }
        };
        return await _getCrumb(cookieJar, fetch2, finalResponseFetchOptions, logger, copyConsentResponseLocation, {
          id: "getCrumb-quote-AAPL-consent-final-redirect.html",
          t: develOverride.t,
          onFinish: develOverride.onFinish
        }, noCache);
      }
    }
  }
  const cookie = (await cookieJar.getCookies(url, { expire: true }))[0];
  if (cookie) {
    logger.debug("Success. Cookie expires on " + cookie.expires);
  } else {
    throw new Error("No set-cookie header present in Yahoo's response.  Something must have changed, please report.");
  }
  const GET_CRUMB_URL = "https://query1.finance.yahoo.com/v1/test/getcrumb";
  const getCrumbOptions = {
    ...fetchOptions,
    headers: {
      ...fetchOptions.headers,
      cookie: await cookieJar.getCookieString(GET_CRUMB_URL),
      origin: "https://finance.yahoo.com",
      referer: url,
      accept: "*/*",
      "accept-encoding": "gzip, deflate, br",
      "accept-language": "en-US,en;q=0.9",
      "content-type": "text/plain"
    },
    devel: {
      id: "getCrumb-getcrumb",
      t: develOverride.t,
      onFinish: develOverride.onFinish
    }
  };
  logger.debug(
    "fetch",
    GET_CRUMB_URL
    /*, getCrumbOptions */
  );
  const getCrumbResponse = await fetch2(GET_CRUMB_URL, getCrumbOptions);
  if (getCrumbResponse.status !== 200) {
    throw new Error("Failed to get crumb, status " + getCrumbResponse.status + ", statusText: " + getCrumbResponse.statusText);
  }
  const crumbFromGetCrumb = await getCrumbResponse.text();
  crumb = crumbFromGetCrumb;
  if (!crumb) {
    throw new Error("Could not find crumb.  Yahoo's API may have changed; please report.");
  }
  logger.debug("New crumb: " + crumb);
  await cookieJar.setCookie(new cookieExports.Cookie({
    key: "crumb",
    value: crumb
  }), CONFIG_FAKE_URL);
  promise = null;
  return crumb;
}
let promise = null;
function getCrumb(cookieJar, fetch2, fetchOptionsBase, logger, notices2, url = "https://finance.yahoo.com/quote/AAPL", __getCrumb = _getCrumb) {
  notices2.show("yahooSurvey");
  if (!promise) {
    promise = Promise.resolve(__getCrumb(cookieJar, fetch2, fetchOptionsBase, logger, url)).catch((error) => {
      promise = null;
      throw error;
    });
  }
  return promise;
}
const _queue = new Queue();
function assertQueueOptions(queue, opts) {
  if (typeof opts.concurrency === "number" && queue.concurrency !== opts.concurrency) {
    queue.concurrency = opts.concurrency;
  }
  if (typeof opts.timeout === "number" && queue.timeout !== opts.timeout) {
    queue.timeout = opts.timeout;
  }
  if (typeof opts.interval === "number" && queue.interval !== opts.interval) {
    queue.interval = opts.interval;
  }
}
function substituteVariables(urlBase) {
  return urlBase.replace(/\$\{([^}]+)\}/g, (match, varName) => {
    if (varName === "YF_QUERY_HOST") {
      return this._opts.YF_QUERY_HOST || "query2.finance.yahoo.com";
    } else {
      return match;
    }
  });
}
async function yahooFinanceFetch(urlBase, params = {}, moduleOpts = {}, func = "json", needsCrumb = false) {
  if (!(this && this._env)) {
    throw new errors.NoEnvironmentError("yahooFinanceFetch called without this._env set");
  }
  const queueOverride = moduleOpts.queue?._queue;
  const queue = queueOverride instanceof Queue ? queueOverride : _queue;
  assertQueueOptions(queue, { ...this._opts.queue, ...moduleOpts.queue });
  const { fetch: envFetch, fetchDevel } = this._env;
  const fetchFunc = moduleOpts.devel ? await fetchDevel() : moduleOpts.fetch || envFetch || this._opts.fetch || globalThis.fetch;
  const queuedFetch = (input, init) => queue.add(() => fetchFunc(input, init));
  const fetchOptionsBase = {
    ...this._opts.fetchOptions,
    ...moduleOpts.fetchOptions,
    devel: moduleOpts.devel,
    headers: {
      ...this._opts.fetchOptions?.headers,
      ...moduleOpts.fetchOptions?.headers
    }
  };
  if (needsCrumb) {
    if (!this._opts.cookieJar)
      throw new Error("No cookieJar set");
    if (!this._opts.logger)
      throw new Error("Logger was unset.");
    const crumb2 = await getCrumb(this._opts.cookieJar, queuedFetch, fetchOptionsBase, this._opts.logger, this._notices);
    if (crumb2)
      params.crumb = crumb2;
  }
  const urlSearchParams = new URLSearchParams(params);
  const url = substituteVariables.call(this, urlBase) + "?" + urlSearchParams.toString();
  if (!this._opts.cookieJar)
    throw new Error("No cookieJar set");
  const fetchOptions = {
    ...fetchOptionsBase,
    headers: {
      ...fetchOptionsBase.headers,
      cookie: await this._opts.cookieJar.getCookieString(url, {
        allPaths: true
      })
    }
  };
  if (func === "csv")
    func = "text";
  const response = await queuedFetch(url, fetchOptions);
  const setCookieHeaders = response.headers.getSetCookie();
  if (setCookieHeaders) {
    if (!this._opts.cookieJar)
      throw new Error("No cookieJar set");
    this._opts.cookieJar.setFromSetCookieHeaders(setCookieHeaders, url);
  }
  const responseText = await response.text();
  let result = null;
  try {
    result = JSON.parse(responseText);
  } catch (error) {
    if (response.ok) {
      if (error instanceof Error) {
        throw new Error(`Response.ok where we expect JSON, but the response was not parsable.  Response: "${responseText}".  Error: "${error.message}"`);
      }
    }
  }
  if (result && func === "json") {
    const keys = Object.keys(result);
    if (keys.length === 1) {
      const errorObj = result[keys[0]].error;
      if (errorObj) {
        const errorName = errorObj.code.replace(/ /g, "") + "Error";
        const ErrorClass = errors[errorName] || Error;
        throw new ErrorClass(errorObj.description);
      }
    }
  }
  if (!response.ok) {
    console.error(url);
    const error = new errors.HTTPError(responseText || response.statusText);
    error.code = response.status;
    throw error;
  }
  return result;
}
const DELIMITER = ",";
function camelize(str) {
  return str.split(" ").map((str2, i) => i === 0 ? str2.toLowerCase() : str2[0].toUpperCase() + str2.substr(1).toLowerCase()).join("");
}
function convert(input) {
  if (typeof input === "string") {
    if (input.match(/\d{4,4}-\d{2,2}-\d{2,2}/))
      return new Date(input);
    if (input.match(/^[0-9\.]+$/))
      return parseFloat(input);
    if (input === "null")
      return null;
  }
  return input;
}
function csv2json(csv) {
  const lines = csv.split("\n");
  const headers = lines.shift().split(DELIMITER).map(camelize);
  const out = new Array(lines.length);
  for (let i = 0; i < lines.length; i++) {
    const inRow = lines[i].split(DELIMITER);
    const outRow = out[i] = {};
    for (let j = 0; j < inRow.length; j++) {
      outRow[headers[j]] = convert(inRow[j]);
    }
  }
  return out;
}
async function moduleExec(opts) {
  const queryOpts = opts.query;
  const moduleOpts = opts.moduleOptions;
  const moduleName = opts.moduleName;
  const resultOpts = opts.result;
  if (!queryOpts.definitions) {
    throw new Error("no definitions in queryOpts: " + JSON.stringify(queryOpts));
  }
  if (!resultOpts.definitions) {
    throw new Error("no definitions in resultOpts: " + JSON.stringify(resultOpts));
  }
  if (queryOpts.assertSymbol) {
    const symbol = queryOpts.assertSymbol;
    if (typeof symbol !== "string") {
      throw new Error(`yahooFinance.${moduleName}() expects a single string symbol as its query, not a(n) ${typeof symbol}: ${JSON.stringify(symbol)}`);
    }
  }
  if (this._opts.validation?.allowAdditionalProps === false) {
    disallowAdditionalProps(resultOpts.definitions);
  }
  const validateOptions2 = !moduleOpts || moduleOpts.validateOptions === void 0 || moduleOpts.validateOptions === true;
  try {
    validate({
      source: moduleName,
      type: "options",
      object: queryOpts.overrides ?? {},
      definitions: queryOpts.definitions,
      schemaOrSchemaKey: queryOpts.schemaKey,
      options: this._opts.validation,
      logger: this._opts.logger,
      logObj: this._logObj,
      versionCheck: this._opts.versionCheck
    });
  } catch (error) {
    if (validateOptions2)
      throw error;
  }
  let queryOptions = {
    ...queryOpts.defaults,
    // Module defaults e.g. { period: '1wk', lang: 'en' }
    ...queryOpts.runtime,
    // Runtime params e.g. { q: query }
    ...queryOpts.overrides
    // User supplied options that override above
  };
  if (queryOpts.transformWith) {
    queryOptions = queryOpts.transformWith(queryOptions);
  }
  let result = await this._fetch(queryOpts.url, queryOptions, moduleOpts, queryOpts.fetchType, queryOpts.needsCrumb);
  if (queryOpts.fetchType === "csv")
    result = csv2json(result);
  if (opts.result.transformWith)
    result = opts.result.transformWith(result);
  const validateResult = !moduleOpts || moduleOpts.validateResult === void 0 || moduleOpts.validateResult === true;
  const validationOpts = {
    ...this._opts.validation,
    // Set logErrors=false if validateResult=false
    logErrors: validateResult ? this._opts.validation.logErrors : false
  };
  try {
    validate({
      source: moduleName,
      type: "result",
      object: result,
      definitions: resultOpts.definitions,
      schemaOrSchemaKey: resultOpts.schemaKey,
      options: validationOpts,
      logger: this._opts.logger,
      logObj: this._logObj,
      versionCheck: this._opts.versionCheck
    });
  } catch (error) {
    if (validateResult)
      throw error;
  }
  return result;
}
const notices = {
  yahooSurvey: {
    id: "yahooSurvey",
    text: "Please consider completing the survey at https://bit.ly/yahoo-finance-api-feedback if you haven't already; for more info see https://github.com/gadicc/yahoo-finance2/issues/764#issuecomment-2056623851.",
    onceOnly: true
  },
  ripHistorical: {
    id: "ripHistorical",
    text: "[Deprecated] historical() relies on an API that Yahoo have removed.  We'll map this request to chart() for convenience, but, please consider using chart() directly instead; for more info see https://github.com/gadicc/yahoo-finance2/issues/795.",
    level: "warn",
    onceOnly: true
  }
};
class Notices {
  constructor(yahooFinance) {
    Object.defineProperty(this, "_yahooFinance", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "_suppressed", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this._yahooFinance = yahooFinance;
    if (yahooFinance._opts.suppressNotices) {
      this._suppressed = new Set(yahooFinance._opts.suppressNotices);
    } else {
      this._suppressed = /* @__PURE__ */ new Set();
    }
  }
  show(id) {
    const n = notices[id];
    if (!n)
      throw new Error(`Unknown notice id: ${id}`);
    if (this._suppressed.has(id))
      return;
    if (n.onceOnly)
      this._suppressed.add(id);
    const text = n.text + (n.onceOnly ? "  This will only be shown once, but you" : "You") + " can suppress this message in future with `new YahooFinance({ suppressNotices: ['" + id + "'] })`.";
    const level = "level" in n && n.level || "info";
    this._yahooFinance._opts.logger[level](text);
  }
  suppress(noticeIds) {
    noticeIds.forEach((id) => {
      const n = notices[id];
      if (!n) {
        this._yahooFinance._opts.logger.error(`Unknown notice id: ${id}`);
      }
      this._suppressed.add(id);
    });
  }
}
function detectRuntime() {
  const info = { runtime: "unknown", version: null, details: {} };
  const deno = dntGlobalThis.Deno;
  const proc = dntGlobalThis.process;
  const bun = dntGlobalThis.Bun;
  const isRealDeno = (d) => !!(d && d.version?.deno && d.build?.os && d.build?.arch);
  const ua = typeof globalThis.navigator === "object" && typeof globalThis.navigator?.userAgent === "string" ? globalThis.navigator.userAgent : "";
  if (/Cloudflare-Workers/i.test(ua)) {
    info.runtime = "cloudflare";
    info.version = null;
    info.details = {
      userAgent: ua,
      miniflare: !!dntGlobalThis.MINIFLARE || /Miniflare/i.test(ua),
      hasWebSocketPair: typeof dntGlobalThis.WebSocketPair !== "undefined",
      hasCaches: typeof dntGlobalThis.caches !== "undefined"
    };
    return info;
  }
  if (typeof dntGlobalThis.process === "undefined" && typeof dntGlobalThis.Deno === "undefined" && typeof dntGlobalThis.Bun === "undefined" && typeof dntGlobalThis.WebSocketPair !== "undefined" && typeof dntGlobalThis.caches !== "undefined") {
    info.runtime = "cloudflare";
    info.version = null;
    info.details = { userAgent: ua || null, heuristic: true };
    return info;
  }
  if (typeof bun === "object" && typeof bun?.version === "string") {
    info.runtime = "bun";
    info.version = bun.version;
    info.details = {
      bunRevision: bun.revision ?? null,
      nodeCompat: typeof proc === "object" && !!proc?.versions?.node
    };
    return info;
  }
  const hasNode = typeof proc === "object" && !!proc?.versions?.node;
  const nodeDominant = hasNode && !proc?.versions?.deno;
  if (nodeDominant) {
    info.runtime = "node";
    info.version = String(proc.versions.node);
    info.details = {
      v8: proc.versions.v8,
      arch: proc.arch,
      platform: proc.platform,
      denoShimDetected: typeof deno === "object"
    };
    return info;
  }
  const hasDeno = typeof deno === "object" && !!deno?.version?.deno;
  if (hasDeno && (!hasNode || isRealDeno(deno) || proc?.versions?.deno)) {
    info.runtime = "deno";
    info.version = String(deno.version.deno);
    info.details = {
      v8: deno.version.v8,
      typescript: deno.version.typescript,
      os: deno.build?.os,
      arch: deno.build?.arch,
      nodeCompat: !!proc?.versions?.deno
    };
    return info;
  }
  if (hasNode) {
    info.runtime = "node";
    info.version = String(proc.versions.node);
    info.details = {
      v8: proc.versions.v8,
      arch: proc.arch,
      platform: proc.platform
    };
    return info;
  }
  return info;
}
function parseSemver(v) {
  if (v == null)
    return null;
  let s = String(v).trim();
  if (s.startsWith("v"))
    s = s.slice(1);
  const core = s.split("+")[0];
  const [nums, pre = ""] = core.split("-");
  const [maj = "0", min = "0", pat = "0"] = nums.split(".");
  const toInt = (x) => {
    const n = parseInt(String(x), 10);
    return Number.isFinite(n) ? n : 0;
  };
  return { maj: toInt(maj), min: toInt(min), pat: toInt(pat), pre };
}
function cmpSemver(a, b) {
  const A = parseSemver(a), B = parseSemver(b);
  if (!A || !B)
    return 0;
  if (A.maj !== B.maj)
    return A.maj < B.maj ? -1 : 1;
  if (A.min !== B.min)
    return A.min < B.min ? -1 : 1;
  if (A.pat !== B.pat)
    return A.pat < B.pat ? -1 : 1;
  const aPre = A.pre && A.pre.length > 0;
  const bPre = B.pre && B.pre.length > 0;
  if (aPre !== bPre)
    return aPre ? -1 : 1;
  if (aPre && bPre)
    return A.pre < B.pre ? -1 : A.pre > B.pre ? 1 : 0;
  return 0;
}
function isVersionAtLeast(current, minimum) {
  return cmpSemver(current, minimum) >= 0;
}
function checkSupport(policy = {}) {
  const info = detectRuntime();
  const fail = (reason) => ({
    ok: false,
    info,
    reason
  });
  const pass = () => ({ ok: true, info });
  const hasGlobalPath = (path) => {
    const parts = path.split(".");
    let cur = dntGlobalThis;
    for (const p of parts) {
      if (cur == null || !(p in cur))
        return false;
      cur = cur[p];
    }
    return true;
  };
  if (info.runtime === "node" && policy.node) {
    if (!info.version || !isVersionAtLeast(info.version, policy.node)) {
      return fail(`Requires Node >= ${policy.node}, found ${info.version ?? "unknown"}.`);
    }
    return pass();
  }
  if (info.runtime === "deno" && policy.deno) {
    if (!info.version || !isVersionAtLeast(info.version, policy.deno)) {
      return fail(`Requires Deno >= ${policy.deno}, found ${info.version ?? "unknown"}.`);
    }
    return pass();
  }
  if (info.runtime === "bun" && policy.bun) {
    if (!info.version || !isVersionAtLeast(info.version, policy.bun)) {
      return fail(`Requires Bun >= ${policy.bun}, found ${info.version ?? "unknown"}.`);
    }
    return pass();
  }
  if (info.runtime === "cloudflare") {
    const feats = policy.cloudflare?.requireFeatures ?? [];
    for (const f of feats) {
      if (!hasGlobalPath(f)) {
        return fail(`Cloudflare Workers missing required feature: ${f}`);
      }
    }
    return pass();
  }
  return fail("Unsupported runtime.");
}
function assertSupported(policy) {
  const res = checkSupport(policy);
  if (!res.ok) {
    const { runtime, version } = res.info;
    throw new Error(`Unsupported environment: ${res.reason} (runtime=${runtime}, version=${version})`);
  }
}
const schema$7 = {
  "definitions": {
    "QuoteBase": {
      "type": "object",
      "properties": {
        "language": {
          "type": "string"
        },
        "region": {
          "type": "string"
        },
        "quoteType": {
          "type": "string"
        },
        "typeDisp": {
          "type": "string"
        },
        "quoteSourceName": {
          "type": "string"
        },
        "triggerable": {
          "type": "boolean"
        },
        "currency": {
          "type": "string"
        },
        "customPriceAlertConfidence": {
          "type": "string"
        },
        "marketState": {
          "type": "string",
          "enum": [
            "REGULAR",
            "CLOSED",
            "PRE",
            "PREPRE",
            "POST",
            "POSTPOST"
          ]
        },
        "tradeable": {
          "type": "boolean"
        },
        "cryptoTradeable": {
          "type": "boolean"
        },
        "corporateActions": {
          "type": "array",
          "items": {}
        },
        "exchange": {
          "type": "string"
        },
        "shortName": {
          "type": "string"
        },
        "longName": {
          "type": "string"
        },
        "messageBoardId": {
          "type": "string"
        },
        "exchangeTimezoneName": {
          "type": "string"
        },
        "exchangeTimezoneShortName": {
          "type": "string"
        },
        "gmtOffSetMilliseconds": {
          "type": "number"
        },
        "market": {
          "type": "string"
        },
        "esgPopulated": {
          "type": "boolean"
        },
        "fiftyTwoWeekLowChange": {
          "type": "number"
        },
        "fiftyTwoWeekLowChangePercent": {
          "type": "number"
        },
        "fiftyTwoWeekRange": {
          "$ref": "#/definitions/TwoNumberRange"
        },
        "fiftyTwoWeekHighChange": {
          "type": "number"
        },
        "fiftyTwoWeekHighChangePercent": {
          "type": "number"
        },
        "fiftyTwoWeekLow": {
          "type": "number"
        },
        "fiftyTwoWeekHigh": {
          "type": "number"
        },
        "fiftyTwoWeekChangePercent": {
          "type": "number"
        },
        "dividendDate": {
          "type": "string",
          "format": "date-time"
        },
        "earningsTimestamp": {
          "type": "string",
          "format": "date-time"
        },
        "earningsTimestampStart": {
          "type": "string",
          "format": "date-time"
        },
        "earningsTimestampEnd": {
          "type": "string",
          "format": "date-time"
        },
        "earningsCallTimestampStart": {
          "type": "string",
          "format": "date-time"
        },
        "earningsCallTimestampEnd": {
          "type": "string",
          "format": "date-time"
        },
        "isEarningsDateEstimate": {
          "type": "boolean"
        },
        "trailingAnnualDividendRate": {
          "type": "number"
        },
        "trailingPE": {
          "type": "number"
        },
        "trailingAnnualDividendYield": {
          "type": "number"
        },
        "epsTrailingTwelveMonths": {
          "type": "number"
        },
        "epsForward": {
          "type": "number"
        },
        "epsCurrentYear": {
          "type": "number"
        },
        "priceEpsCurrentYear": {
          "type": "number"
        },
        "sharesOutstanding": {
          "type": "number"
        },
        "bookValue": {
          "type": "number"
        },
        "fiftyDayAverage": {
          "type": "number"
        },
        "fiftyDayAverageChange": {
          "type": "number"
        },
        "fiftyDayAverageChangePercent": {
          "type": "number"
        },
        "twoHundredDayAverage": {
          "type": "number"
        },
        "twoHundredDayAverageChange": {
          "type": "number"
        },
        "twoHundredDayAverageChangePercent": {
          "type": "number"
        },
        "marketCap": {
          "type": "number"
        },
        "forwardPE": {
          "type": "number"
        },
        "priceToBook": {
          "type": "number"
        },
        "sourceInterval": {
          "type": "number"
        },
        "exchangeDataDelayedBy": {
          "type": "number"
        },
        "firstTradeDateMilliseconds": {
          "$ref": "#/definitions/DateInMs"
        },
        "priceHint": {
          "type": "number"
        },
        "postMarketChangePercent": {
          "type": "number"
        },
        "postMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "postMarketPrice": {
          "type": "number"
        },
        "postMarketChange": {
          "type": "number"
        },
        "hasPrePostMarketData": {
          "type": "boolean"
        },
        "extendedMarketChange": {
          "type": "number"
        },
        "extendedMarketChangePercent": {
          "type": "number"
        },
        "extendedMarketPrice": {
          "type": "number"
        },
        "extendedMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "regularMarketChange": {
          "type": "number"
        },
        "regularMarketChangePercent": {
          "type": "number"
        },
        "regularMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "regularMarketPrice": {
          "type": "number"
        },
        "regularMarketDayHigh": {
          "type": "number"
        },
        "regularMarketDayRange": {
          "$ref": "#/definitions/TwoNumberRange"
        },
        "regularMarketDayLow": {
          "type": "number"
        },
        "regularMarketVolume": {
          "type": "number"
        },
        "dayHigh": {
          "type": "number"
        },
        "dayLow": {
          "type": "number"
        },
        "volume": {
          "type": "number"
        },
        "regularMarketPreviousClose": {
          "type": "number"
        },
        "preMarketChange": {
          "type": "number"
        },
        "preMarketChangePercent": {
          "type": "number"
        },
        "preMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "preMarketPrice": {
          "type": "number"
        },
        "bid": {
          "type": "number"
        },
        "ask": {
          "type": "number"
        },
        "bidSize": {
          "type": "number"
        },
        "askSize": {
          "type": "number"
        },
        "fullExchangeName": {
          "type": "string"
        },
        "financialCurrency": {
          "type": "string"
        },
        "regularMarketOpen": {
          "type": "number"
        },
        "averageDailyVolume3Month": {
          "type": "number"
        },
        "averageDailyVolume10Day": {
          "type": "number"
        },
        "displayName": {
          "type": "string"
        },
        "symbol": {
          "type": "string"
        },
        "underlyingSymbol": {
          "type": "string"
        },
        "ytdReturn": {
          "type": "number"
        },
        "trailingThreeMonthReturns": {
          "type": "number"
        },
        "trailingThreeMonthNavReturns": {
          "type": "number"
        },
        "ipoExpectedDate": {
          "type": "string",
          "format": "date-time"
        },
        "newListingDate": {
          "type": "string",
          "format": "date-time"
        },
        "nameChangeDate": {
          "type": "string",
          "format": "date-time"
        },
        "prevName": {
          "type": "string"
        },
        "averageAnalystRating": {
          "type": "string"
        },
        "pageViewGrowthWeekly": {
          "type": "number"
        },
        "openInterest": {
          "type": "number"
        },
        "beta": {
          "type": "number"
        },
        "companyLogoUrl": {
          "type": "string"
        },
        "logoUrl": {
          "type": "string"
        },
        "impliedSharesOutstanding": {
          "type": "number"
        }
      },
      "required": [
        "language",
        "region",
        "quoteType",
        "triggerable",
        "marketState",
        "tradeable",
        "exchange",
        "exchangeTimezoneName",
        "exchangeTimezoneShortName",
        "gmtOffSetMilliseconds",
        "market",
        "esgPopulated",
        "sourceInterval",
        "exchangeDataDelayedBy",
        "fullExchangeName",
        "symbol"
      ]
    },
    "TwoNumberRange": {
      "type": "object",
      "properties": {
        "low": {
          "type": "number"
        },
        "high": {
          "type": "number"
        }
      },
      "required": [
        "low",
        "high"
      ],
      "additionalProperties": false
    },
    "DateInMs": {
      "type": "string",
      "format": "date-time"
    },
    "QuoteCryptoCurrency": {
      "type": "object",
      "properties": {
        "language": {
          "type": "string"
        },
        "region": {
          "type": "string"
        },
        "quoteType": {
          "type": "string",
          "const": "CRYPTOCURRENCY"
        },
        "typeDisp": {
          "type": "string"
        },
        "quoteSourceName": {
          "type": "string"
        },
        "triggerable": {
          "type": "boolean"
        },
        "currency": {
          "type": "string"
        },
        "customPriceAlertConfidence": {
          "type": "string"
        },
        "marketState": {
          "type": "string",
          "enum": [
            "REGULAR",
            "CLOSED",
            "PRE",
            "PREPRE",
            "POST",
            "POSTPOST"
          ]
        },
        "tradeable": {
          "type": "boolean"
        },
        "cryptoTradeable": {
          "type": "boolean"
        },
        "corporateActions": {
          "type": "array",
          "items": {}
        },
        "exchange": {
          "type": "string"
        },
        "shortName": {
          "type": "string"
        },
        "longName": {
          "type": "string"
        },
        "messageBoardId": {
          "type": "string"
        },
        "exchangeTimezoneName": {
          "type": "string"
        },
        "exchangeTimezoneShortName": {
          "type": "string"
        },
        "gmtOffSetMilliseconds": {
          "type": "number"
        },
        "market": {
          "type": "string"
        },
        "esgPopulated": {
          "type": "boolean"
        },
        "fiftyTwoWeekLowChange": {
          "type": "number"
        },
        "fiftyTwoWeekLowChangePercent": {
          "type": "number"
        },
        "fiftyTwoWeekRange": {
          "$ref": "#/definitions/TwoNumberRange"
        },
        "fiftyTwoWeekHighChange": {
          "type": "number"
        },
        "fiftyTwoWeekHighChangePercent": {
          "type": "number"
        },
        "fiftyTwoWeekLow": {
          "type": "number"
        },
        "fiftyTwoWeekHigh": {
          "type": "number"
        },
        "fiftyTwoWeekChangePercent": {
          "type": "number"
        },
        "dividendDate": {
          "type": "string",
          "format": "date-time"
        },
        "earningsTimestamp": {
          "type": "string",
          "format": "date-time"
        },
        "earningsTimestampStart": {
          "type": "string",
          "format": "date-time"
        },
        "earningsTimestampEnd": {
          "type": "string",
          "format": "date-time"
        },
        "earningsCallTimestampStart": {
          "type": "string",
          "format": "date-time"
        },
        "earningsCallTimestampEnd": {
          "type": "string",
          "format": "date-time"
        },
        "isEarningsDateEstimate": {
          "type": "boolean"
        },
        "trailingAnnualDividendRate": {
          "type": "number"
        },
        "trailingPE": {
          "type": "number"
        },
        "trailingAnnualDividendYield": {
          "type": "number"
        },
        "epsTrailingTwelveMonths": {
          "type": "number"
        },
        "epsForward": {
          "type": "number"
        },
        "epsCurrentYear": {
          "type": "number"
        },
        "priceEpsCurrentYear": {
          "type": "number"
        },
        "sharesOutstanding": {
          "type": "number"
        },
        "bookValue": {
          "type": "number"
        },
        "fiftyDayAverage": {
          "type": "number"
        },
        "fiftyDayAverageChange": {
          "type": "number"
        },
        "fiftyDayAverageChangePercent": {
          "type": "number"
        },
        "twoHundredDayAverage": {
          "type": "number"
        },
        "twoHundredDayAverageChange": {
          "type": "number"
        },
        "twoHundredDayAverageChangePercent": {
          "type": "number"
        },
        "marketCap": {
          "type": "number"
        },
        "forwardPE": {
          "type": "number"
        },
        "priceToBook": {
          "type": "number"
        },
        "sourceInterval": {
          "type": "number"
        },
        "exchangeDataDelayedBy": {
          "type": "number"
        },
        "firstTradeDateMilliseconds": {
          "$ref": "#/definitions/DateInMs"
        },
        "priceHint": {
          "type": "number"
        },
        "postMarketChangePercent": {
          "type": "number"
        },
        "postMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "postMarketPrice": {
          "type": "number"
        },
        "postMarketChange": {
          "type": "number"
        },
        "hasPrePostMarketData": {
          "type": "boolean"
        },
        "extendedMarketChange": {
          "type": "number"
        },
        "extendedMarketChangePercent": {
          "type": "number"
        },
        "extendedMarketPrice": {
          "type": "number"
        },
        "extendedMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "regularMarketChange": {
          "type": "number"
        },
        "regularMarketChangePercent": {
          "type": "number"
        },
        "regularMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "regularMarketPrice": {
          "type": "number"
        },
        "regularMarketDayHigh": {
          "type": "number"
        },
        "regularMarketDayRange": {
          "$ref": "#/definitions/TwoNumberRange"
        },
        "regularMarketDayLow": {
          "type": "number"
        },
        "regularMarketVolume": {
          "type": "number"
        },
        "dayHigh": {
          "type": "number"
        },
        "dayLow": {
          "type": "number"
        },
        "volume": {
          "type": "number"
        },
        "regularMarketPreviousClose": {
          "type": "number"
        },
        "preMarketChange": {
          "type": "number"
        },
        "preMarketChangePercent": {
          "type": "number"
        },
        "preMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "preMarketPrice": {
          "type": "number"
        },
        "bid": {
          "type": "number"
        },
        "ask": {
          "type": "number"
        },
        "bidSize": {
          "type": "number"
        },
        "askSize": {
          "type": "number"
        },
        "fullExchangeName": {
          "type": "string"
        },
        "financialCurrency": {
          "type": "string"
        },
        "regularMarketOpen": {
          "type": "number"
        },
        "averageDailyVolume3Month": {
          "type": "number"
        },
        "averageDailyVolume10Day": {
          "type": "number"
        },
        "displayName": {
          "type": "string"
        },
        "symbol": {
          "type": "string"
        },
        "underlyingSymbol": {
          "type": "string"
        },
        "ytdReturn": {
          "type": "number"
        },
        "trailingThreeMonthReturns": {
          "type": "number"
        },
        "trailingThreeMonthNavReturns": {
          "type": "number"
        },
        "ipoExpectedDate": {
          "type": "string",
          "format": "date-time"
        },
        "newListingDate": {
          "type": "string",
          "format": "date-time"
        },
        "nameChangeDate": {
          "type": "string",
          "format": "date-time"
        },
        "prevName": {
          "type": "string"
        },
        "averageAnalystRating": {
          "type": "string"
        },
        "pageViewGrowthWeekly": {
          "type": "number"
        },
        "openInterest": {
          "type": "number"
        },
        "beta": {
          "type": "number"
        },
        "companyLogoUrl": {
          "type": "string"
        },
        "logoUrl": {
          "type": "string"
        },
        "impliedSharesOutstanding": {
          "type": "number"
        },
        "circulatingSupply": {
          "type": "number"
        },
        "fromCurrency": {
          "type": "string"
        },
        "toCurrency": {
          "type": "string"
        },
        "lastMarket": {
          "type": "string"
        },
        "coinImageUrl": {
          "type": "string"
        },
        "volume24Hr": {
          "type": "number"
        },
        "volumeAllCurrencies": {
          "type": "number"
        },
        "startDate": {
          "type": "string",
          "format": "date-time"
        },
        "coinMarketCapLink": {
          "type": "string"
        },
        "maxSupply": {
          "type": "number"
        },
        "totalSupply": {
          "type": "number"
        }
      },
      "required": [
        "esgPopulated",
        "exchange",
        "exchangeDataDelayedBy",
        "exchangeTimezoneName",
        "exchangeTimezoneShortName",
        "fullExchangeName",
        "gmtOffSetMilliseconds",
        "language",
        "market",
        "marketState",
        "quoteType",
        "region",
        "sourceInterval",
        "symbol",
        "tradeable",
        "triggerable"
      ]
    },
    "QuoteCurrency": {
      "type": "object",
      "properties": {
        "language": {
          "type": "string"
        },
        "region": {
          "type": "string"
        },
        "quoteType": {
          "type": "string",
          "const": "CURRENCY"
        },
        "typeDisp": {
          "type": "string"
        },
        "quoteSourceName": {
          "type": "string"
        },
        "triggerable": {
          "type": "boolean"
        },
        "currency": {
          "type": "string"
        },
        "customPriceAlertConfidence": {
          "type": "string"
        },
        "marketState": {
          "type": "string",
          "enum": [
            "REGULAR",
            "CLOSED",
            "PRE",
            "PREPRE",
            "POST",
            "POSTPOST"
          ]
        },
        "tradeable": {
          "type": "boolean"
        },
        "cryptoTradeable": {
          "type": "boolean"
        },
        "corporateActions": {
          "type": "array",
          "items": {}
        },
        "exchange": {
          "type": "string"
        },
        "shortName": {
          "type": "string"
        },
        "longName": {
          "type": "string"
        },
        "messageBoardId": {
          "type": "string"
        },
        "exchangeTimezoneName": {
          "type": "string"
        },
        "exchangeTimezoneShortName": {
          "type": "string"
        },
        "gmtOffSetMilliseconds": {
          "type": "number"
        },
        "market": {
          "type": "string"
        },
        "esgPopulated": {
          "type": "boolean"
        },
        "fiftyTwoWeekLowChange": {
          "type": "number"
        },
        "fiftyTwoWeekLowChangePercent": {
          "type": "number"
        },
        "fiftyTwoWeekRange": {
          "$ref": "#/definitions/TwoNumberRange"
        },
        "fiftyTwoWeekHighChange": {
          "type": "number"
        },
        "fiftyTwoWeekHighChangePercent": {
          "type": "number"
        },
        "fiftyTwoWeekLow": {
          "type": "number"
        },
        "fiftyTwoWeekHigh": {
          "type": "number"
        },
        "fiftyTwoWeekChangePercent": {
          "type": "number"
        },
        "dividendDate": {
          "type": "string",
          "format": "date-time"
        },
        "earningsTimestamp": {
          "type": "string",
          "format": "date-time"
        },
        "earningsTimestampStart": {
          "type": "string",
          "format": "date-time"
        },
        "earningsTimestampEnd": {
          "type": "string",
          "format": "date-time"
        },
        "earningsCallTimestampStart": {
          "type": "string",
          "format": "date-time"
        },
        "earningsCallTimestampEnd": {
          "type": "string",
          "format": "date-time"
        },
        "isEarningsDateEstimate": {
          "type": "boolean"
        },
        "trailingAnnualDividendRate": {
          "type": "number"
        },
        "trailingPE": {
          "type": "number"
        },
        "trailingAnnualDividendYield": {
          "type": "number"
        },
        "epsTrailingTwelveMonths": {
          "type": "number"
        },
        "epsForward": {
          "type": "number"
        },
        "epsCurrentYear": {
          "type": "number"
        },
        "priceEpsCurrentYear": {
          "type": "number"
        },
        "sharesOutstanding": {
          "type": "number"
        },
        "bookValue": {
          "type": "number"
        },
        "fiftyDayAverage": {
          "type": "number"
        },
        "fiftyDayAverageChange": {
          "type": "number"
        },
        "fiftyDayAverageChangePercent": {
          "type": "number"
        },
        "twoHundredDayAverage": {
          "type": "number"
        },
        "twoHundredDayAverageChange": {
          "type": "number"
        },
        "twoHundredDayAverageChangePercent": {
          "type": "number"
        },
        "marketCap": {
          "type": "number"
        },
        "forwardPE": {
          "type": "number"
        },
        "priceToBook": {
          "type": "number"
        },
        "sourceInterval": {
          "type": "number"
        },
        "exchangeDataDelayedBy": {
          "type": "number"
        },
        "firstTradeDateMilliseconds": {
          "$ref": "#/definitions/DateInMs"
        },
        "priceHint": {
          "type": "number"
        },
        "postMarketChangePercent": {
          "type": "number"
        },
        "postMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "postMarketPrice": {
          "type": "number"
        },
        "postMarketChange": {
          "type": "number"
        },
        "hasPrePostMarketData": {
          "type": "boolean"
        },
        "extendedMarketChange": {
          "type": "number"
        },
        "extendedMarketChangePercent": {
          "type": "number"
        },
        "extendedMarketPrice": {
          "type": "number"
        },
        "extendedMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "regularMarketChange": {
          "type": "number"
        },
        "regularMarketChangePercent": {
          "type": "number"
        },
        "regularMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "regularMarketPrice": {
          "type": "number"
        },
        "regularMarketDayHigh": {
          "type": "number"
        },
        "regularMarketDayRange": {
          "$ref": "#/definitions/TwoNumberRange"
        },
        "regularMarketDayLow": {
          "type": "number"
        },
        "regularMarketVolume": {
          "type": "number"
        },
        "dayHigh": {
          "type": "number"
        },
        "dayLow": {
          "type": "number"
        },
        "volume": {
          "type": "number"
        },
        "regularMarketPreviousClose": {
          "type": "number"
        },
        "preMarketChange": {
          "type": "number"
        },
        "preMarketChangePercent": {
          "type": "number"
        },
        "preMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "preMarketPrice": {
          "type": "number"
        },
        "bid": {
          "type": "number"
        },
        "ask": {
          "type": "number"
        },
        "bidSize": {
          "type": "number"
        },
        "askSize": {
          "type": "number"
        },
        "fullExchangeName": {
          "type": "string"
        },
        "financialCurrency": {
          "type": "string"
        },
        "regularMarketOpen": {
          "type": "number"
        },
        "averageDailyVolume3Month": {
          "type": "number"
        },
        "averageDailyVolume10Day": {
          "type": "number"
        },
        "displayName": {
          "type": "string"
        },
        "symbol": {
          "type": "string"
        },
        "underlyingSymbol": {
          "type": "string"
        },
        "ytdReturn": {
          "type": "number"
        },
        "trailingThreeMonthReturns": {
          "type": "number"
        },
        "trailingThreeMonthNavReturns": {
          "type": "number"
        },
        "ipoExpectedDate": {
          "type": "string",
          "format": "date-time"
        },
        "newListingDate": {
          "type": "string",
          "format": "date-time"
        },
        "nameChangeDate": {
          "type": "string",
          "format": "date-time"
        },
        "prevName": {
          "type": "string"
        },
        "averageAnalystRating": {
          "type": "string"
        },
        "pageViewGrowthWeekly": {
          "type": "number"
        },
        "openInterest": {
          "type": "number"
        },
        "beta": {
          "type": "number"
        },
        "companyLogoUrl": {
          "type": "string"
        },
        "logoUrl": {
          "type": "string"
        },
        "impliedSharesOutstanding": {
          "type": "number"
        }
      },
      "required": [
        "esgPopulated",
        "exchange",
        "exchangeDataDelayedBy",
        "exchangeTimezoneName",
        "exchangeTimezoneShortName",
        "fullExchangeName",
        "gmtOffSetMilliseconds",
        "language",
        "market",
        "marketState",
        "quoteType",
        "region",
        "sourceInterval",
        "symbol",
        "tradeable",
        "triggerable"
      ]
    },
    "QuoteEtf": {
      "type": "object",
      "properties": {
        "language": {
          "type": "string"
        },
        "region": {
          "type": "string"
        },
        "quoteType": {
          "type": "string",
          "const": "ETF"
        },
        "typeDisp": {
          "type": "string"
        },
        "quoteSourceName": {
          "type": "string"
        },
        "triggerable": {
          "type": "boolean"
        },
        "currency": {
          "type": "string"
        },
        "customPriceAlertConfidence": {
          "type": "string"
        },
        "marketState": {
          "type": "string",
          "enum": [
            "REGULAR",
            "CLOSED",
            "PRE",
            "PREPRE",
            "POST",
            "POSTPOST"
          ]
        },
        "tradeable": {
          "type": "boolean"
        },
        "cryptoTradeable": {
          "type": "boolean"
        },
        "corporateActions": {
          "type": "array",
          "items": {}
        },
        "exchange": {
          "type": "string"
        },
        "shortName": {
          "type": "string"
        },
        "longName": {
          "type": "string"
        },
        "messageBoardId": {
          "type": "string"
        },
        "exchangeTimezoneName": {
          "type": "string"
        },
        "exchangeTimezoneShortName": {
          "type": "string"
        },
        "gmtOffSetMilliseconds": {
          "type": "number"
        },
        "market": {
          "type": "string"
        },
        "esgPopulated": {
          "type": "boolean"
        },
        "fiftyTwoWeekLowChange": {
          "type": "number"
        },
        "fiftyTwoWeekLowChangePercent": {
          "type": "number"
        },
        "fiftyTwoWeekRange": {
          "$ref": "#/definitions/TwoNumberRange"
        },
        "fiftyTwoWeekHighChange": {
          "type": "number"
        },
        "fiftyTwoWeekHighChangePercent": {
          "type": "number"
        },
        "fiftyTwoWeekLow": {
          "type": "number"
        },
        "fiftyTwoWeekHigh": {
          "type": "number"
        },
        "fiftyTwoWeekChangePercent": {
          "type": "number"
        },
        "dividendDate": {
          "type": "string",
          "format": "date-time"
        },
        "earningsTimestamp": {
          "type": "string",
          "format": "date-time"
        },
        "earningsTimestampStart": {
          "type": "string",
          "format": "date-time"
        },
        "earningsTimestampEnd": {
          "type": "string",
          "format": "date-time"
        },
        "earningsCallTimestampStart": {
          "type": "string",
          "format": "date-time"
        },
        "earningsCallTimestampEnd": {
          "type": "string",
          "format": "date-time"
        },
        "isEarningsDateEstimate": {
          "type": "boolean"
        },
        "trailingAnnualDividendRate": {
          "type": "number"
        },
        "trailingPE": {
          "type": "number"
        },
        "trailingAnnualDividendYield": {
          "type": "number"
        },
        "epsTrailingTwelveMonths": {
          "type": "number"
        },
        "epsForward": {
          "type": "number"
        },
        "epsCurrentYear": {
          "type": "number"
        },
        "priceEpsCurrentYear": {
          "type": "number"
        },
        "sharesOutstanding": {
          "type": "number"
        },
        "bookValue": {
          "type": "number"
        },
        "fiftyDayAverage": {
          "type": "number"
        },
        "fiftyDayAverageChange": {
          "type": "number"
        },
        "fiftyDayAverageChangePercent": {
          "type": "number"
        },
        "twoHundredDayAverage": {
          "type": "number"
        },
        "twoHundredDayAverageChange": {
          "type": "number"
        },
        "twoHundredDayAverageChangePercent": {
          "type": "number"
        },
        "marketCap": {
          "type": "number"
        },
        "forwardPE": {
          "type": "number"
        },
        "priceToBook": {
          "type": "number"
        },
        "sourceInterval": {
          "type": "number"
        },
        "exchangeDataDelayedBy": {
          "type": "number"
        },
        "firstTradeDateMilliseconds": {
          "$ref": "#/definitions/DateInMs"
        },
        "priceHint": {
          "type": "number"
        },
        "postMarketChangePercent": {
          "type": "number"
        },
        "postMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "postMarketPrice": {
          "type": "number"
        },
        "postMarketChange": {
          "type": "number"
        },
        "hasPrePostMarketData": {
          "type": "boolean"
        },
        "extendedMarketChange": {
          "type": "number"
        },
        "extendedMarketChangePercent": {
          "type": "number"
        },
        "extendedMarketPrice": {
          "type": "number"
        },
        "extendedMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "regularMarketChange": {
          "type": "number"
        },
        "regularMarketChangePercent": {
          "type": "number"
        },
        "regularMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "regularMarketPrice": {
          "type": "number"
        },
        "regularMarketDayHigh": {
          "type": "number"
        },
        "regularMarketDayRange": {
          "$ref": "#/definitions/TwoNumberRange"
        },
        "regularMarketDayLow": {
          "type": "number"
        },
        "regularMarketVolume": {
          "type": "number"
        },
        "dayHigh": {
          "type": "number"
        },
        "dayLow": {
          "type": "number"
        },
        "volume": {
          "type": "number"
        },
        "regularMarketPreviousClose": {
          "type": "number"
        },
        "preMarketChange": {
          "type": "number"
        },
        "preMarketChangePercent": {
          "type": "number"
        },
        "preMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "preMarketPrice": {
          "type": "number"
        },
        "bid": {
          "type": "number"
        },
        "ask": {
          "type": "number"
        },
        "bidSize": {
          "type": "number"
        },
        "askSize": {
          "type": "number"
        },
        "fullExchangeName": {
          "type": "string"
        },
        "financialCurrency": {
          "type": "string"
        },
        "regularMarketOpen": {
          "type": "number"
        },
        "averageDailyVolume3Month": {
          "type": "number"
        },
        "averageDailyVolume10Day": {
          "type": "number"
        },
        "displayName": {
          "type": "string"
        },
        "symbol": {
          "type": "string"
        },
        "underlyingSymbol": {
          "type": "string"
        },
        "ytdReturn": {
          "type": "number"
        },
        "trailingThreeMonthReturns": {
          "type": "number"
        },
        "trailingThreeMonthNavReturns": {
          "type": "number"
        },
        "ipoExpectedDate": {
          "type": "string",
          "format": "date-time"
        },
        "newListingDate": {
          "type": "string",
          "format": "date-time"
        },
        "nameChangeDate": {
          "type": "string",
          "format": "date-time"
        },
        "prevName": {
          "type": "string"
        },
        "averageAnalystRating": {
          "type": "string"
        },
        "pageViewGrowthWeekly": {
          "type": "number"
        },
        "openInterest": {
          "type": "number"
        },
        "beta": {
          "type": "number"
        },
        "companyLogoUrl": {
          "type": "string"
        },
        "logoUrl": {
          "type": "string"
        },
        "impliedSharesOutstanding": {
          "type": "number"
        },
        "dividendYield": {
          "type": "number"
        },
        "netAssets": {
          "type": "number"
        },
        "netExpenseRatio": {
          "type": "number"
        }
      },
      "required": [
        "esgPopulated",
        "exchange",
        "exchangeDataDelayedBy",
        "exchangeTimezoneName",
        "exchangeTimezoneShortName",
        "fullExchangeName",
        "gmtOffSetMilliseconds",
        "language",
        "market",
        "marketState",
        "quoteType",
        "region",
        "sourceInterval",
        "symbol",
        "tradeable",
        "triggerable"
      ]
    },
    "QuoteEquity": {
      "type": "object",
      "properties": {
        "language": {
          "type": "string"
        },
        "region": {
          "type": "string"
        },
        "quoteType": {
          "type": "string",
          "const": "EQUITY"
        },
        "typeDisp": {
          "type": "string"
        },
        "quoteSourceName": {
          "type": "string"
        },
        "triggerable": {
          "type": "boolean"
        },
        "currency": {
          "type": "string"
        },
        "customPriceAlertConfidence": {
          "type": "string"
        },
        "marketState": {
          "type": "string",
          "enum": [
            "REGULAR",
            "CLOSED",
            "PRE",
            "PREPRE",
            "POST",
            "POSTPOST"
          ]
        },
        "tradeable": {
          "type": "boolean"
        },
        "cryptoTradeable": {
          "type": "boolean"
        },
        "corporateActions": {
          "type": "array",
          "items": {}
        },
        "exchange": {
          "type": "string"
        },
        "shortName": {
          "type": "string"
        },
        "longName": {
          "type": "string"
        },
        "messageBoardId": {
          "type": "string"
        },
        "exchangeTimezoneName": {
          "type": "string"
        },
        "exchangeTimezoneShortName": {
          "type": "string"
        },
        "gmtOffSetMilliseconds": {
          "type": "number"
        },
        "market": {
          "type": "string"
        },
        "esgPopulated": {
          "type": "boolean"
        },
        "fiftyTwoWeekLowChange": {
          "type": "number"
        },
        "fiftyTwoWeekLowChangePercent": {
          "type": "number"
        },
        "fiftyTwoWeekRange": {
          "$ref": "#/definitions/TwoNumberRange"
        },
        "fiftyTwoWeekHighChange": {
          "type": "number"
        },
        "fiftyTwoWeekHighChangePercent": {
          "type": "number"
        },
        "fiftyTwoWeekLow": {
          "type": "number"
        },
        "fiftyTwoWeekHigh": {
          "type": "number"
        },
        "fiftyTwoWeekChangePercent": {
          "type": "number"
        },
        "dividendDate": {
          "type": "string",
          "format": "date-time"
        },
        "earningsTimestamp": {
          "type": "string",
          "format": "date-time"
        },
        "earningsTimestampStart": {
          "type": "string",
          "format": "date-time"
        },
        "earningsTimestampEnd": {
          "type": "string",
          "format": "date-time"
        },
        "earningsCallTimestampStart": {
          "type": "string",
          "format": "date-time"
        },
        "earningsCallTimestampEnd": {
          "type": "string",
          "format": "date-time"
        },
        "isEarningsDateEstimate": {
          "type": "boolean"
        },
        "trailingAnnualDividendRate": {
          "type": "number"
        },
        "trailingPE": {
          "type": "number"
        },
        "trailingAnnualDividendYield": {
          "type": "number"
        },
        "epsTrailingTwelveMonths": {
          "type": "number"
        },
        "epsForward": {
          "type": "number"
        },
        "epsCurrentYear": {
          "type": "number"
        },
        "priceEpsCurrentYear": {
          "type": "number"
        },
        "sharesOutstanding": {
          "type": "number"
        },
        "bookValue": {
          "type": "number"
        },
        "fiftyDayAverage": {
          "type": "number"
        },
        "fiftyDayAverageChange": {
          "type": "number"
        },
        "fiftyDayAverageChangePercent": {
          "type": "number"
        },
        "twoHundredDayAverage": {
          "type": "number"
        },
        "twoHundredDayAverageChange": {
          "type": "number"
        },
        "twoHundredDayAverageChangePercent": {
          "type": "number"
        },
        "marketCap": {
          "type": "number"
        },
        "forwardPE": {
          "type": "number"
        },
        "priceToBook": {
          "type": "number"
        },
        "sourceInterval": {
          "type": "number"
        },
        "exchangeDataDelayedBy": {
          "type": "number"
        },
        "firstTradeDateMilliseconds": {
          "$ref": "#/definitions/DateInMs"
        },
        "priceHint": {
          "type": "number"
        },
        "postMarketChangePercent": {
          "type": "number"
        },
        "postMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "postMarketPrice": {
          "type": "number"
        },
        "postMarketChange": {
          "type": "number"
        },
        "hasPrePostMarketData": {
          "type": "boolean"
        },
        "extendedMarketChange": {
          "type": "number"
        },
        "extendedMarketChangePercent": {
          "type": "number"
        },
        "extendedMarketPrice": {
          "type": "number"
        },
        "extendedMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "regularMarketChange": {
          "type": "number"
        },
        "regularMarketChangePercent": {
          "type": "number"
        },
        "regularMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "regularMarketPrice": {
          "type": "number"
        },
        "regularMarketDayHigh": {
          "type": "number"
        },
        "regularMarketDayRange": {
          "$ref": "#/definitions/TwoNumberRange"
        },
        "regularMarketDayLow": {
          "type": "number"
        },
        "regularMarketVolume": {
          "type": "number"
        },
        "dayHigh": {
          "type": "number"
        },
        "dayLow": {
          "type": "number"
        },
        "volume": {
          "type": "number"
        },
        "regularMarketPreviousClose": {
          "type": "number"
        },
        "preMarketChange": {
          "type": "number"
        },
        "preMarketChangePercent": {
          "type": "number"
        },
        "preMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "preMarketPrice": {
          "type": "number"
        },
        "bid": {
          "type": "number"
        },
        "ask": {
          "type": "number"
        },
        "bidSize": {
          "type": "number"
        },
        "askSize": {
          "type": "number"
        },
        "fullExchangeName": {
          "type": "string"
        },
        "financialCurrency": {
          "type": "string"
        },
        "regularMarketOpen": {
          "type": "number"
        },
        "averageDailyVolume3Month": {
          "type": "number"
        },
        "averageDailyVolume10Day": {
          "type": "number"
        },
        "displayName": {
          "type": "string"
        },
        "symbol": {
          "type": "string"
        },
        "underlyingSymbol": {
          "type": "string"
        },
        "ytdReturn": {
          "type": "number"
        },
        "trailingThreeMonthReturns": {
          "type": "number"
        },
        "trailingThreeMonthNavReturns": {
          "type": "number"
        },
        "ipoExpectedDate": {
          "type": "string",
          "format": "date-time"
        },
        "newListingDate": {
          "type": "string",
          "format": "date-time"
        },
        "nameChangeDate": {
          "type": "string",
          "format": "date-time"
        },
        "prevName": {
          "type": "string"
        },
        "averageAnalystRating": {
          "type": "string"
        },
        "pageViewGrowthWeekly": {
          "type": "number"
        },
        "openInterest": {
          "type": "number"
        },
        "beta": {
          "type": "number"
        },
        "companyLogoUrl": {
          "type": "string"
        },
        "logoUrl": {
          "type": "string"
        },
        "impliedSharesOutstanding": {
          "type": "number"
        },
        "dividendRate": {
          "type": "number"
        },
        "dividendYield": {
          "type": "number"
        }
      },
      "required": [
        "esgPopulated",
        "exchange",
        "exchangeDataDelayedBy",
        "exchangeTimezoneName",
        "exchangeTimezoneShortName",
        "fullExchangeName",
        "gmtOffSetMilliseconds",
        "language",
        "market",
        "marketState",
        "quoteType",
        "region",
        "sourceInterval",
        "symbol",
        "tradeable",
        "triggerable"
      ]
    },
    "QuoteECNQuote": {
      "type": "object",
      "properties": {
        "dividendRate": {
          "type": "number"
        },
        "dividendYield": {
          "type": "number"
        },
        "language": {
          "type": "string"
        },
        "region": {
          "type": "string"
        },
        "typeDisp": {
          "type": "string"
        },
        "quoteSourceName": {
          "type": "string"
        },
        "triggerable": {
          "type": "boolean"
        },
        "currency": {
          "type": "string"
        },
        "customPriceAlertConfidence": {
          "type": "string"
        },
        "marketState": {
          "type": "string",
          "enum": [
            "REGULAR",
            "CLOSED",
            "PRE",
            "PREPRE",
            "POST",
            "POSTPOST"
          ]
        },
        "tradeable": {
          "type": "boolean"
        },
        "cryptoTradeable": {
          "type": "boolean"
        },
        "corporateActions": {
          "type": "array",
          "items": {}
        },
        "exchange": {
          "type": "string"
        },
        "shortName": {
          "type": "string"
        },
        "longName": {
          "type": "string"
        },
        "messageBoardId": {
          "type": "string"
        },
        "exchangeTimezoneName": {
          "type": "string"
        },
        "exchangeTimezoneShortName": {
          "type": "string"
        },
        "gmtOffSetMilliseconds": {
          "type": "number"
        },
        "market": {
          "type": "string"
        },
        "esgPopulated": {
          "type": "boolean"
        },
        "fiftyTwoWeekLowChange": {
          "type": "number"
        },
        "fiftyTwoWeekLowChangePercent": {
          "type": "number"
        },
        "fiftyTwoWeekRange": {
          "$ref": "#/definitions/TwoNumberRange"
        },
        "fiftyTwoWeekHighChange": {
          "type": "number"
        },
        "fiftyTwoWeekHighChangePercent": {
          "type": "number"
        },
        "fiftyTwoWeekLow": {
          "type": "number"
        },
        "fiftyTwoWeekHigh": {
          "type": "number"
        },
        "fiftyTwoWeekChangePercent": {
          "type": "number"
        },
        "dividendDate": {
          "type": "string",
          "format": "date-time"
        },
        "earningsTimestamp": {
          "type": "string",
          "format": "date-time"
        },
        "earningsTimestampStart": {
          "type": "string",
          "format": "date-time"
        },
        "earningsTimestampEnd": {
          "type": "string",
          "format": "date-time"
        },
        "earningsCallTimestampStart": {
          "type": "string",
          "format": "date-time"
        },
        "earningsCallTimestampEnd": {
          "type": "string",
          "format": "date-time"
        },
        "isEarningsDateEstimate": {
          "type": "boolean"
        },
        "trailingAnnualDividendRate": {
          "type": "number"
        },
        "trailingPE": {
          "type": "number"
        },
        "trailingAnnualDividendYield": {
          "type": "number"
        },
        "epsTrailingTwelveMonths": {
          "type": "number"
        },
        "epsForward": {
          "type": "number"
        },
        "epsCurrentYear": {
          "type": "number"
        },
        "priceEpsCurrentYear": {
          "type": "number"
        },
        "sharesOutstanding": {
          "type": "number"
        },
        "bookValue": {
          "type": "number"
        },
        "fiftyDayAverage": {
          "type": "number"
        },
        "fiftyDayAverageChange": {
          "type": "number"
        },
        "fiftyDayAverageChangePercent": {
          "type": "number"
        },
        "twoHundredDayAverage": {
          "type": "number"
        },
        "twoHundredDayAverageChange": {
          "type": "number"
        },
        "twoHundredDayAverageChangePercent": {
          "type": "number"
        },
        "marketCap": {
          "type": "number"
        },
        "forwardPE": {
          "type": "number"
        },
        "priceToBook": {
          "type": "number"
        },
        "sourceInterval": {
          "type": "number"
        },
        "exchangeDataDelayedBy": {
          "type": "number"
        },
        "firstTradeDateMilliseconds": {
          "$ref": "#/definitions/DateInMs"
        },
        "priceHint": {
          "type": "number"
        },
        "postMarketChangePercent": {
          "type": "number"
        },
        "postMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "postMarketPrice": {
          "type": "number"
        },
        "postMarketChange": {
          "type": "number"
        },
        "hasPrePostMarketData": {
          "type": "boolean"
        },
        "extendedMarketChange": {
          "type": "number"
        },
        "extendedMarketChangePercent": {
          "type": "number"
        },
        "extendedMarketPrice": {
          "type": "number"
        },
        "extendedMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "regularMarketChange": {
          "type": "number"
        },
        "regularMarketChangePercent": {
          "type": "number"
        },
        "regularMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "regularMarketPrice": {
          "type": "number"
        },
        "regularMarketDayHigh": {
          "type": "number"
        },
        "regularMarketDayRange": {
          "$ref": "#/definitions/TwoNumberRange"
        },
        "regularMarketDayLow": {
          "type": "number"
        },
        "regularMarketVolume": {
          "type": "number"
        },
        "dayHigh": {
          "type": "number"
        },
        "dayLow": {
          "type": "number"
        },
        "volume": {
          "type": "number"
        },
        "regularMarketPreviousClose": {
          "type": "number"
        },
        "preMarketChange": {
          "type": "number"
        },
        "preMarketChangePercent": {
          "type": "number"
        },
        "preMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "preMarketPrice": {
          "type": "number"
        },
        "bid": {
          "type": "number"
        },
        "ask": {
          "type": "number"
        },
        "bidSize": {
          "type": "number"
        },
        "askSize": {
          "type": "number"
        },
        "fullExchangeName": {
          "type": "string"
        },
        "financialCurrency": {
          "type": "string"
        },
        "regularMarketOpen": {
          "type": "number"
        },
        "averageDailyVolume3Month": {
          "type": "number"
        },
        "averageDailyVolume10Day": {
          "type": "number"
        },
        "displayName": {
          "type": "string"
        },
        "symbol": {
          "type": "string"
        },
        "underlyingSymbol": {
          "type": "string"
        },
        "ytdReturn": {
          "type": "number"
        },
        "trailingThreeMonthReturns": {
          "type": "number"
        },
        "trailingThreeMonthNavReturns": {
          "type": "number"
        },
        "ipoExpectedDate": {
          "type": "string",
          "format": "date-time"
        },
        "newListingDate": {
          "type": "string",
          "format": "date-time"
        },
        "nameChangeDate": {
          "type": "string",
          "format": "date-time"
        },
        "prevName": {
          "type": "string"
        },
        "averageAnalystRating": {
          "type": "string"
        },
        "pageViewGrowthWeekly": {
          "type": "number"
        },
        "openInterest": {
          "type": "number"
        },
        "beta": {
          "type": "number"
        },
        "companyLogoUrl": {
          "type": "string"
        },
        "logoUrl": {
          "type": "string"
        },
        "impliedSharesOutstanding": {
          "type": "number"
        },
        "quoteType": {
          "type": "string",
          "const": "ECNQUOTE"
        }
      },
      "required": [
        "esgPopulated",
        "exchange",
        "exchangeDataDelayedBy",
        "exchangeTimezoneName",
        "exchangeTimezoneShortName",
        "fullExchangeName",
        "gmtOffSetMilliseconds",
        "language",
        "market",
        "marketState",
        "quoteType",
        "region",
        "sourceInterval",
        "symbol",
        "tradeable",
        "triggerable"
      ],
      "additionalProperties": false
    },
    "QuoteFuture": {
      "type": "object",
      "properties": {
        "language": {
          "type": "string"
        },
        "region": {
          "type": "string"
        },
        "quoteType": {
          "type": "string",
          "const": "FUTURE"
        },
        "typeDisp": {
          "type": "string"
        },
        "quoteSourceName": {
          "type": "string"
        },
        "triggerable": {
          "type": "boolean"
        },
        "currency": {
          "type": "string"
        },
        "customPriceAlertConfidence": {
          "type": "string"
        },
        "marketState": {
          "type": "string",
          "enum": [
            "REGULAR",
            "CLOSED",
            "PRE",
            "PREPRE",
            "POST",
            "POSTPOST"
          ]
        },
        "tradeable": {
          "type": "boolean"
        },
        "cryptoTradeable": {
          "type": "boolean"
        },
        "corporateActions": {
          "type": "array",
          "items": {}
        },
        "exchange": {
          "type": "string"
        },
        "shortName": {
          "type": "string"
        },
        "longName": {
          "type": "string"
        },
        "messageBoardId": {
          "type": "string"
        },
        "exchangeTimezoneName": {
          "type": "string"
        },
        "exchangeTimezoneShortName": {
          "type": "string"
        },
        "gmtOffSetMilliseconds": {
          "type": "number"
        },
        "market": {
          "type": "string"
        },
        "esgPopulated": {
          "type": "boolean"
        },
        "fiftyTwoWeekLowChange": {
          "type": "number"
        },
        "fiftyTwoWeekLowChangePercent": {
          "type": "number"
        },
        "fiftyTwoWeekRange": {
          "$ref": "#/definitions/TwoNumberRange"
        },
        "fiftyTwoWeekHighChange": {
          "type": "number"
        },
        "fiftyTwoWeekHighChangePercent": {
          "type": "number"
        },
        "fiftyTwoWeekLow": {
          "type": "number"
        },
        "fiftyTwoWeekHigh": {
          "type": "number"
        },
        "fiftyTwoWeekChangePercent": {
          "type": "number"
        },
        "dividendDate": {
          "type": "string",
          "format": "date-time"
        },
        "earningsTimestamp": {
          "type": "string",
          "format": "date-time"
        },
        "earningsTimestampStart": {
          "type": "string",
          "format": "date-time"
        },
        "earningsTimestampEnd": {
          "type": "string",
          "format": "date-time"
        },
        "earningsCallTimestampStart": {
          "type": "string",
          "format": "date-time"
        },
        "earningsCallTimestampEnd": {
          "type": "string",
          "format": "date-time"
        },
        "isEarningsDateEstimate": {
          "type": "boolean"
        },
        "trailingAnnualDividendRate": {
          "type": "number"
        },
        "trailingPE": {
          "type": "number"
        },
        "trailingAnnualDividendYield": {
          "type": "number"
        },
        "epsTrailingTwelveMonths": {
          "type": "number"
        },
        "epsForward": {
          "type": "number"
        },
        "epsCurrentYear": {
          "type": "number"
        },
        "priceEpsCurrentYear": {
          "type": "number"
        },
        "sharesOutstanding": {
          "type": "number"
        },
        "bookValue": {
          "type": "number"
        },
        "fiftyDayAverage": {
          "type": "number"
        },
        "fiftyDayAverageChange": {
          "type": "number"
        },
        "fiftyDayAverageChangePercent": {
          "type": "number"
        },
        "twoHundredDayAverage": {
          "type": "number"
        },
        "twoHundredDayAverageChange": {
          "type": "number"
        },
        "twoHundredDayAverageChangePercent": {
          "type": "number"
        },
        "marketCap": {
          "type": "number"
        },
        "forwardPE": {
          "type": "number"
        },
        "priceToBook": {
          "type": "number"
        },
        "sourceInterval": {
          "type": "number"
        },
        "exchangeDataDelayedBy": {
          "type": "number"
        },
        "firstTradeDateMilliseconds": {
          "$ref": "#/definitions/DateInMs"
        },
        "priceHint": {
          "type": "number"
        },
        "postMarketChangePercent": {
          "type": "number"
        },
        "postMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "postMarketPrice": {
          "type": "number"
        },
        "postMarketChange": {
          "type": "number"
        },
        "hasPrePostMarketData": {
          "type": "boolean"
        },
        "extendedMarketChange": {
          "type": "number"
        },
        "extendedMarketChangePercent": {
          "type": "number"
        },
        "extendedMarketPrice": {
          "type": "number"
        },
        "extendedMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "regularMarketChange": {
          "type": "number"
        },
        "regularMarketChangePercent": {
          "type": "number"
        },
        "regularMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "regularMarketPrice": {
          "type": "number"
        },
        "regularMarketDayHigh": {
          "type": "number"
        },
        "regularMarketDayRange": {
          "$ref": "#/definitions/TwoNumberRange"
        },
        "regularMarketDayLow": {
          "type": "number"
        },
        "regularMarketVolume": {
          "type": "number"
        },
        "dayHigh": {
          "type": "number"
        },
        "dayLow": {
          "type": "number"
        },
        "volume": {
          "type": "number"
        },
        "regularMarketPreviousClose": {
          "type": "number"
        },
        "preMarketChange": {
          "type": "number"
        },
        "preMarketChangePercent": {
          "type": "number"
        },
        "preMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "preMarketPrice": {
          "type": "number"
        },
        "bid": {
          "type": "number"
        },
        "ask": {
          "type": "number"
        },
        "bidSize": {
          "type": "number"
        },
        "askSize": {
          "type": "number"
        },
        "fullExchangeName": {
          "type": "string"
        },
        "financialCurrency": {
          "type": "string"
        },
        "regularMarketOpen": {
          "type": "number"
        },
        "averageDailyVolume3Month": {
          "type": "number"
        },
        "averageDailyVolume10Day": {
          "type": "number"
        },
        "displayName": {
          "type": "string"
        },
        "symbol": {
          "type": "string"
        },
        "underlyingSymbol": {
          "type": "string"
        },
        "ytdReturn": {
          "type": "number"
        },
        "trailingThreeMonthReturns": {
          "type": "number"
        },
        "trailingThreeMonthNavReturns": {
          "type": "number"
        },
        "ipoExpectedDate": {
          "type": "string",
          "format": "date-time"
        },
        "newListingDate": {
          "type": "string",
          "format": "date-time"
        },
        "nameChangeDate": {
          "type": "string",
          "format": "date-time"
        },
        "prevName": {
          "type": "string"
        },
        "averageAnalystRating": {
          "type": "string"
        },
        "pageViewGrowthWeekly": {
          "type": "number"
        },
        "openInterest": {
          "type": "number"
        },
        "beta": {
          "type": "number"
        },
        "companyLogoUrl": {
          "type": "string"
        },
        "logoUrl": {
          "type": "string"
        },
        "impliedSharesOutstanding": {
          "type": "number"
        },
        "headSymbolAsString": {
          "type": "string"
        },
        "contractSymbol": {
          "type": "boolean"
        },
        "underlyingExchangeSymbol": {
          "type": "string"
        },
        "expireDate": {
          "type": "string",
          "format": "date-time"
        },
        "expireIsoDate": {
          "type": "string",
          "format": "date-time"
        }
      },
      "required": [
        "contractSymbol",
        "esgPopulated",
        "exchange",
        "exchangeDataDelayedBy",
        "exchangeTimezoneName",
        "exchangeTimezoneShortName",
        "expireDate",
        "expireIsoDate",
        "fullExchangeName",
        "gmtOffSetMilliseconds",
        "language",
        "market",
        "marketState",
        "quoteType",
        "region",
        "sourceInterval",
        "symbol",
        "tradeable",
        "triggerable",
        "underlyingExchangeSymbol"
      ]
    },
    "QuoteIndex": {
      "type": "object",
      "properties": {
        "language": {
          "type": "string"
        },
        "region": {
          "type": "string"
        },
        "quoteType": {
          "type": "string",
          "const": "INDEX"
        },
        "typeDisp": {
          "type": "string"
        },
        "quoteSourceName": {
          "type": "string"
        },
        "triggerable": {
          "type": "boolean"
        },
        "currency": {
          "type": "string"
        },
        "customPriceAlertConfidence": {
          "type": "string"
        },
        "marketState": {
          "type": "string",
          "enum": [
            "REGULAR",
            "CLOSED",
            "PRE",
            "PREPRE",
            "POST",
            "POSTPOST"
          ]
        },
        "tradeable": {
          "type": "boolean"
        },
        "cryptoTradeable": {
          "type": "boolean"
        },
        "corporateActions": {
          "type": "array",
          "items": {}
        },
        "exchange": {
          "type": "string"
        },
        "shortName": {
          "type": "string"
        },
        "longName": {
          "type": "string"
        },
        "messageBoardId": {
          "type": "string"
        },
        "exchangeTimezoneName": {
          "type": "string"
        },
        "exchangeTimezoneShortName": {
          "type": "string"
        },
        "gmtOffSetMilliseconds": {
          "type": "number"
        },
        "market": {
          "type": "string"
        },
        "esgPopulated": {
          "type": "boolean"
        },
        "fiftyTwoWeekLowChange": {
          "type": "number"
        },
        "fiftyTwoWeekLowChangePercent": {
          "type": "number"
        },
        "fiftyTwoWeekRange": {
          "$ref": "#/definitions/TwoNumberRange"
        },
        "fiftyTwoWeekHighChange": {
          "type": "number"
        },
        "fiftyTwoWeekHighChangePercent": {
          "type": "number"
        },
        "fiftyTwoWeekLow": {
          "type": "number"
        },
        "fiftyTwoWeekHigh": {
          "type": "number"
        },
        "fiftyTwoWeekChangePercent": {
          "type": "number"
        },
        "dividendDate": {
          "type": "string",
          "format": "date-time"
        },
        "earningsTimestamp": {
          "type": "string",
          "format": "date-time"
        },
        "earningsTimestampStart": {
          "type": "string",
          "format": "date-time"
        },
        "earningsTimestampEnd": {
          "type": "string",
          "format": "date-time"
        },
        "earningsCallTimestampStart": {
          "type": "string",
          "format": "date-time"
        },
        "earningsCallTimestampEnd": {
          "type": "string",
          "format": "date-time"
        },
        "isEarningsDateEstimate": {
          "type": "boolean"
        },
        "trailingAnnualDividendRate": {
          "type": "number"
        },
        "trailingPE": {
          "type": "number"
        },
        "trailingAnnualDividendYield": {
          "type": "number"
        },
        "epsTrailingTwelveMonths": {
          "type": "number"
        },
        "epsForward": {
          "type": "number"
        },
        "epsCurrentYear": {
          "type": "number"
        },
        "priceEpsCurrentYear": {
          "type": "number"
        },
        "sharesOutstanding": {
          "type": "number"
        },
        "bookValue": {
          "type": "number"
        },
        "fiftyDayAverage": {
          "type": "number"
        },
        "fiftyDayAverageChange": {
          "type": "number"
        },
        "fiftyDayAverageChangePercent": {
          "type": "number"
        },
        "twoHundredDayAverage": {
          "type": "number"
        },
        "twoHundredDayAverageChange": {
          "type": "number"
        },
        "twoHundredDayAverageChangePercent": {
          "type": "number"
        },
        "marketCap": {
          "type": "number"
        },
        "forwardPE": {
          "type": "number"
        },
        "priceToBook": {
          "type": "number"
        },
        "sourceInterval": {
          "type": "number"
        },
        "exchangeDataDelayedBy": {
          "type": "number"
        },
        "firstTradeDateMilliseconds": {
          "$ref": "#/definitions/DateInMs"
        },
        "priceHint": {
          "type": "number"
        },
        "postMarketChangePercent": {
          "type": "number"
        },
        "postMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "postMarketPrice": {
          "type": "number"
        },
        "postMarketChange": {
          "type": "number"
        },
        "hasPrePostMarketData": {
          "type": "boolean"
        },
        "extendedMarketChange": {
          "type": "number"
        },
        "extendedMarketChangePercent": {
          "type": "number"
        },
        "extendedMarketPrice": {
          "type": "number"
        },
        "extendedMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "regularMarketChange": {
          "type": "number"
        },
        "regularMarketChangePercent": {
          "type": "number"
        },
        "regularMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "regularMarketPrice": {
          "type": "number"
        },
        "regularMarketDayHigh": {
          "type": "number"
        },
        "regularMarketDayRange": {
          "$ref": "#/definitions/TwoNumberRange"
        },
        "regularMarketDayLow": {
          "type": "number"
        },
        "regularMarketVolume": {
          "type": "number"
        },
        "dayHigh": {
          "type": "number"
        },
        "dayLow": {
          "type": "number"
        },
        "volume": {
          "type": "number"
        },
        "regularMarketPreviousClose": {
          "type": "number"
        },
        "preMarketChange": {
          "type": "number"
        },
        "preMarketChangePercent": {
          "type": "number"
        },
        "preMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "preMarketPrice": {
          "type": "number"
        },
        "bid": {
          "type": "number"
        },
        "ask": {
          "type": "number"
        },
        "bidSize": {
          "type": "number"
        },
        "askSize": {
          "type": "number"
        },
        "fullExchangeName": {
          "type": "string"
        },
        "financialCurrency": {
          "type": "string"
        },
        "regularMarketOpen": {
          "type": "number"
        },
        "averageDailyVolume3Month": {
          "type": "number"
        },
        "averageDailyVolume10Day": {
          "type": "number"
        },
        "displayName": {
          "type": "string"
        },
        "symbol": {
          "type": "string"
        },
        "underlyingSymbol": {
          "type": "string"
        },
        "ytdReturn": {
          "type": "number"
        },
        "trailingThreeMonthReturns": {
          "type": "number"
        },
        "trailingThreeMonthNavReturns": {
          "type": "number"
        },
        "ipoExpectedDate": {
          "type": "string",
          "format": "date-time"
        },
        "newListingDate": {
          "type": "string",
          "format": "date-time"
        },
        "nameChangeDate": {
          "type": "string",
          "format": "date-time"
        },
        "prevName": {
          "type": "string"
        },
        "averageAnalystRating": {
          "type": "string"
        },
        "pageViewGrowthWeekly": {
          "type": "number"
        },
        "openInterest": {
          "type": "number"
        },
        "beta": {
          "type": "number"
        },
        "companyLogoUrl": {
          "type": "string"
        },
        "logoUrl": {
          "type": "string"
        },
        "impliedSharesOutstanding": {
          "type": "number"
        }
      },
      "required": [
        "esgPopulated",
        "exchange",
        "exchangeDataDelayedBy",
        "exchangeTimezoneName",
        "exchangeTimezoneShortName",
        "fullExchangeName",
        "gmtOffSetMilliseconds",
        "language",
        "market",
        "marketState",
        "quoteType",
        "region",
        "sourceInterval",
        "symbol",
        "tradeable",
        "triggerable"
      ]
    },
    "QuoteOption": {
      "type": "object",
      "properties": {
        "language": {
          "type": "string"
        },
        "region": {
          "type": "string"
        },
        "quoteType": {
          "type": "string",
          "const": "OPTION"
        },
        "typeDisp": {
          "type": "string"
        },
        "quoteSourceName": {
          "type": "string"
        },
        "triggerable": {
          "type": "boolean"
        },
        "currency": {
          "type": "string"
        },
        "customPriceAlertConfidence": {
          "type": "string"
        },
        "marketState": {
          "type": "string",
          "enum": [
            "REGULAR",
            "CLOSED",
            "PRE",
            "PREPRE",
            "POST",
            "POSTPOST"
          ]
        },
        "tradeable": {
          "type": "boolean"
        },
        "cryptoTradeable": {
          "type": "boolean"
        },
        "corporateActions": {
          "type": "array",
          "items": {}
        },
        "exchange": {
          "type": "string"
        },
        "shortName": {
          "type": "string"
        },
        "longName": {
          "type": "string"
        },
        "messageBoardId": {
          "type": "string"
        },
        "exchangeTimezoneName": {
          "type": "string"
        },
        "exchangeTimezoneShortName": {
          "type": "string"
        },
        "gmtOffSetMilliseconds": {
          "type": "number"
        },
        "market": {
          "type": "string"
        },
        "esgPopulated": {
          "type": "boolean"
        },
        "fiftyTwoWeekLowChange": {
          "type": "number"
        },
        "fiftyTwoWeekLowChangePercent": {
          "type": "number"
        },
        "fiftyTwoWeekRange": {
          "$ref": "#/definitions/TwoNumberRange"
        },
        "fiftyTwoWeekHighChange": {
          "type": "number"
        },
        "fiftyTwoWeekHighChangePercent": {
          "type": "number"
        },
        "fiftyTwoWeekLow": {
          "type": "number"
        },
        "fiftyTwoWeekHigh": {
          "type": "number"
        },
        "fiftyTwoWeekChangePercent": {
          "type": "number"
        },
        "dividendDate": {
          "type": "string",
          "format": "date-time"
        },
        "earningsTimestamp": {
          "type": "string",
          "format": "date-time"
        },
        "earningsTimestampStart": {
          "type": "string",
          "format": "date-time"
        },
        "earningsTimestampEnd": {
          "type": "string",
          "format": "date-time"
        },
        "earningsCallTimestampStart": {
          "type": "string",
          "format": "date-time"
        },
        "earningsCallTimestampEnd": {
          "type": "string",
          "format": "date-time"
        },
        "isEarningsDateEstimate": {
          "type": "boolean"
        },
        "trailingAnnualDividendRate": {
          "type": "number"
        },
        "trailingPE": {
          "type": "number"
        },
        "trailingAnnualDividendYield": {
          "type": "number"
        },
        "epsTrailingTwelveMonths": {
          "type": "number"
        },
        "epsForward": {
          "type": "number"
        },
        "epsCurrentYear": {
          "type": "number"
        },
        "priceEpsCurrentYear": {
          "type": "number"
        },
        "sharesOutstanding": {
          "type": "number"
        },
        "bookValue": {
          "type": "number"
        },
        "fiftyDayAverage": {
          "type": "number"
        },
        "fiftyDayAverageChange": {
          "type": "number"
        },
        "fiftyDayAverageChangePercent": {
          "type": "number"
        },
        "twoHundredDayAverage": {
          "type": "number"
        },
        "twoHundredDayAverageChange": {
          "type": "number"
        },
        "twoHundredDayAverageChangePercent": {
          "type": "number"
        },
        "marketCap": {
          "type": "number"
        },
        "forwardPE": {
          "type": "number"
        },
        "priceToBook": {
          "type": "number"
        },
        "sourceInterval": {
          "type": "number"
        },
        "exchangeDataDelayedBy": {
          "type": "number"
        },
        "firstTradeDateMilliseconds": {
          "$ref": "#/definitions/DateInMs"
        },
        "priceHint": {
          "type": "number"
        },
        "postMarketChangePercent": {
          "type": "number"
        },
        "postMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "postMarketPrice": {
          "type": "number"
        },
        "postMarketChange": {
          "type": "number"
        },
        "hasPrePostMarketData": {
          "type": "boolean"
        },
        "extendedMarketChange": {
          "type": "number"
        },
        "extendedMarketChangePercent": {
          "type": "number"
        },
        "extendedMarketPrice": {
          "type": "number"
        },
        "extendedMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "regularMarketChange": {
          "type": "number"
        },
        "regularMarketChangePercent": {
          "type": "number"
        },
        "regularMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "regularMarketPrice": {
          "type": "number"
        },
        "regularMarketDayHigh": {
          "type": "number"
        },
        "regularMarketDayRange": {
          "$ref": "#/definitions/TwoNumberRange"
        },
        "regularMarketDayLow": {
          "type": "number"
        },
        "regularMarketVolume": {
          "type": "number"
        },
        "dayHigh": {
          "type": "number"
        },
        "dayLow": {
          "type": "number"
        },
        "volume": {
          "type": "number"
        },
        "regularMarketPreviousClose": {
          "type": "number"
        },
        "preMarketChange": {
          "type": "number"
        },
        "preMarketChangePercent": {
          "type": "number"
        },
        "preMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "preMarketPrice": {
          "type": "number"
        },
        "bid": {
          "type": "number"
        },
        "ask": {
          "type": "number"
        },
        "bidSize": {
          "type": "number"
        },
        "askSize": {
          "type": "number"
        },
        "fullExchangeName": {
          "type": "string"
        },
        "financialCurrency": {
          "type": "string"
        },
        "regularMarketOpen": {
          "type": "number"
        },
        "averageDailyVolume3Month": {
          "type": "number"
        },
        "averageDailyVolume10Day": {
          "type": "number"
        },
        "displayName": {
          "type": "string"
        },
        "symbol": {
          "type": "string"
        },
        "underlyingSymbol": {
          "type": "string"
        },
        "ytdReturn": {
          "type": "number"
        },
        "trailingThreeMonthReturns": {
          "type": "number"
        },
        "trailingThreeMonthNavReturns": {
          "type": "number"
        },
        "ipoExpectedDate": {
          "type": "string",
          "format": "date-time"
        },
        "newListingDate": {
          "type": "string",
          "format": "date-time"
        },
        "nameChangeDate": {
          "type": "string",
          "format": "date-time"
        },
        "prevName": {
          "type": "string"
        },
        "averageAnalystRating": {
          "type": "string"
        },
        "pageViewGrowthWeekly": {
          "type": "number"
        },
        "openInterest": {
          "type": "number"
        },
        "beta": {
          "type": "number"
        },
        "companyLogoUrl": {
          "type": "string"
        },
        "logoUrl": {
          "type": "string"
        },
        "impliedSharesOutstanding": {
          "type": "number"
        },
        "strike": {
          "type": "number"
        },
        "expireDate": {
          "type": "number"
        },
        "expireIsoDate": {
          "type": "string",
          "format": "date-time"
        }
      },
      "required": [
        "esgPopulated",
        "exchange",
        "exchangeDataDelayedBy",
        "exchangeTimezoneName",
        "exchangeTimezoneShortName",
        "expireDate",
        "expireIsoDate",
        "fullExchangeName",
        "gmtOffSetMilliseconds",
        "language",
        "market",
        "marketState",
        "openInterest",
        "quoteType",
        "region",
        "sourceInterval",
        "strike",
        "symbol",
        "tradeable",
        "triggerable",
        "underlyingSymbol"
      ]
    },
    "QuoteMutualfund": {
      "type": "object",
      "properties": {
        "language": {
          "type": "string"
        },
        "region": {
          "type": "string"
        },
        "quoteType": {
          "type": "string",
          "const": "MUTUALFUND"
        },
        "typeDisp": {
          "type": "string"
        },
        "quoteSourceName": {
          "type": "string"
        },
        "triggerable": {
          "type": "boolean"
        },
        "currency": {
          "type": "string"
        },
        "customPriceAlertConfidence": {
          "type": "string"
        },
        "marketState": {
          "type": "string",
          "enum": [
            "REGULAR",
            "CLOSED",
            "PRE",
            "PREPRE",
            "POST",
            "POSTPOST"
          ]
        },
        "tradeable": {
          "type": "boolean"
        },
        "cryptoTradeable": {
          "type": "boolean"
        },
        "corporateActions": {
          "type": "array",
          "items": {}
        },
        "exchange": {
          "type": "string"
        },
        "shortName": {
          "type": "string"
        },
        "longName": {
          "type": "string"
        },
        "messageBoardId": {
          "type": "string"
        },
        "exchangeTimezoneName": {
          "type": "string"
        },
        "exchangeTimezoneShortName": {
          "type": "string"
        },
        "gmtOffSetMilliseconds": {
          "type": "number"
        },
        "market": {
          "type": "string"
        },
        "esgPopulated": {
          "type": "boolean"
        },
        "fiftyTwoWeekLowChange": {
          "type": "number"
        },
        "fiftyTwoWeekLowChangePercent": {
          "type": "number"
        },
        "fiftyTwoWeekRange": {
          "$ref": "#/definitions/TwoNumberRange"
        },
        "fiftyTwoWeekHighChange": {
          "type": "number"
        },
        "fiftyTwoWeekHighChangePercent": {
          "type": "number"
        },
        "fiftyTwoWeekLow": {
          "type": "number"
        },
        "fiftyTwoWeekHigh": {
          "type": "number"
        },
        "fiftyTwoWeekChangePercent": {
          "type": "number"
        },
        "dividendDate": {
          "type": "string",
          "format": "date-time"
        },
        "earningsTimestamp": {
          "type": "string",
          "format": "date-time"
        },
        "earningsTimestampStart": {
          "type": "string",
          "format": "date-time"
        },
        "earningsTimestampEnd": {
          "type": "string",
          "format": "date-time"
        },
        "earningsCallTimestampStart": {
          "type": "string",
          "format": "date-time"
        },
        "earningsCallTimestampEnd": {
          "type": "string",
          "format": "date-time"
        },
        "isEarningsDateEstimate": {
          "type": "boolean"
        },
        "trailingAnnualDividendRate": {
          "type": "number"
        },
        "trailingPE": {
          "type": "number"
        },
        "trailingAnnualDividendYield": {
          "type": "number"
        },
        "epsTrailingTwelveMonths": {
          "type": "number"
        },
        "epsForward": {
          "type": "number"
        },
        "epsCurrentYear": {
          "type": "number"
        },
        "priceEpsCurrentYear": {
          "type": "number"
        },
        "sharesOutstanding": {
          "type": "number"
        },
        "bookValue": {
          "type": "number"
        },
        "fiftyDayAverage": {
          "type": "number"
        },
        "fiftyDayAverageChange": {
          "type": "number"
        },
        "fiftyDayAverageChangePercent": {
          "type": "number"
        },
        "twoHundredDayAverage": {
          "type": "number"
        },
        "twoHundredDayAverageChange": {
          "type": "number"
        },
        "twoHundredDayAverageChangePercent": {
          "type": "number"
        },
        "marketCap": {
          "type": "number"
        },
        "forwardPE": {
          "type": "number"
        },
        "priceToBook": {
          "type": "number"
        },
        "sourceInterval": {
          "type": "number"
        },
        "exchangeDataDelayedBy": {
          "type": "number"
        },
        "firstTradeDateMilliseconds": {
          "$ref": "#/definitions/DateInMs"
        },
        "priceHint": {
          "type": "number"
        },
        "postMarketChangePercent": {
          "type": "number"
        },
        "postMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "postMarketPrice": {
          "type": "number"
        },
        "postMarketChange": {
          "type": "number"
        },
        "hasPrePostMarketData": {
          "type": "boolean"
        },
        "extendedMarketChange": {
          "type": "number"
        },
        "extendedMarketChangePercent": {
          "type": "number"
        },
        "extendedMarketPrice": {
          "type": "number"
        },
        "extendedMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "regularMarketChange": {
          "type": "number"
        },
        "regularMarketChangePercent": {
          "type": "number"
        },
        "regularMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "regularMarketPrice": {
          "type": "number"
        },
        "regularMarketDayHigh": {
          "type": "number"
        },
        "regularMarketDayRange": {
          "$ref": "#/definitions/TwoNumberRange"
        },
        "regularMarketDayLow": {
          "type": "number"
        },
        "regularMarketVolume": {
          "type": "number"
        },
        "dayHigh": {
          "type": "number"
        },
        "dayLow": {
          "type": "number"
        },
        "volume": {
          "type": "number"
        },
        "regularMarketPreviousClose": {
          "type": "number"
        },
        "preMarketChange": {
          "type": "number"
        },
        "preMarketChangePercent": {
          "type": "number"
        },
        "preMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "preMarketPrice": {
          "type": "number"
        },
        "bid": {
          "type": "number"
        },
        "ask": {
          "type": "number"
        },
        "bidSize": {
          "type": "number"
        },
        "askSize": {
          "type": "number"
        },
        "fullExchangeName": {
          "type": "string"
        },
        "financialCurrency": {
          "type": "string"
        },
        "regularMarketOpen": {
          "type": "number"
        },
        "averageDailyVolume3Month": {
          "type": "number"
        },
        "averageDailyVolume10Day": {
          "type": "number"
        },
        "displayName": {
          "type": "string"
        },
        "symbol": {
          "type": "string"
        },
        "underlyingSymbol": {
          "type": "string"
        },
        "ytdReturn": {
          "type": "number"
        },
        "trailingThreeMonthReturns": {
          "type": "number"
        },
        "trailingThreeMonthNavReturns": {
          "type": "number"
        },
        "ipoExpectedDate": {
          "type": "string",
          "format": "date-time"
        },
        "newListingDate": {
          "type": "string",
          "format": "date-time"
        },
        "nameChangeDate": {
          "type": "string",
          "format": "date-time"
        },
        "prevName": {
          "type": "string"
        },
        "averageAnalystRating": {
          "type": "string"
        },
        "pageViewGrowthWeekly": {
          "type": "number"
        },
        "openInterest": {
          "type": "number"
        },
        "beta": {
          "type": "number"
        },
        "companyLogoUrl": {
          "type": "string"
        },
        "logoUrl": {
          "type": "string"
        },
        "impliedSharesOutstanding": {
          "type": "number"
        },
        "dividendRate": {
          "type": "number"
        },
        "dividendYield": {
          "type": "number"
        }
      },
      "required": [
        "esgPopulated",
        "exchange",
        "exchangeDataDelayedBy",
        "exchangeTimezoneName",
        "exchangeTimezoneShortName",
        "fullExchangeName",
        "gmtOffSetMilliseconds",
        "language",
        "market",
        "marketState",
        "quoteType",
        "region",
        "sourceInterval",
        "symbol",
        "tradeable",
        "triggerable"
      ]
    },
    "QuoteMoneyMarket": {
      "type": "object",
      "properties": {
        "language": {
          "type": "string"
        },
        "region": {
          "type": "string"
        },
        "quoteType": {
          "type": "string",
          "const": "MONEYMARKET"
        },
        "typeDisp": {
          "type": "string",
          "const": "MoneyMarket"
        },
        "quoteSourceName": {
          "type": "string"
        },
        "triggerable": {
          "type": "boolean"
        },
        "currency": {
          "type": "string"
        },
        "customPriceAlertConfidence": {
          "type": "string"
        },
        "marketState": {
          "type": "string",
          "enum": [
            "REGULAR",
            "CLOSED",
            "PRE",
            "PREPRE",
            "POST",
            "POSTPOST"
          ]
        },
        "tradeable": {
          "type": "boolean"
        },
        "cryptoTradeable": {
          "type": "boolean"
        },
        "corporateActions": {
          "type": "array",
          "items": {}
        },
        "exchange": {
          "type": "string"
        },
        "shortName": {
          "type": "string"
        },
        "longName": {
          "type": "string"
        },
        "messageBoardId": {
          "type": "string"
        },
        "exchangeTimezoneName": {
          "type": "string"
        },
        "exchangeTimezoneShortName": {
          "type": "string"
        },
        "gmtOffSetMilliseconds": {
          "type": "number"
        },
        "market": {
          "type": "string"
        },
        "esgPopulated": {
          "type": "boolean"
        },
        "fiftyTwoWeekLowChange": {
          "type": "number"
        },
        "fiftyTwoWeekLowChangePercent": {
          "type": "number"
        },
        "fiftyTwoWeekRange": {
          "$ref": "#/definitions/TwoNumberRange"
        },
        "fiftyTwoWeekHighChange": {
          "type": "number"
        },
        "fiftyTwoWeekHighChangePercent": {
          "type": "number"
        },
        "fiftyTwoWeekLow": {
          "type": "number"
        },
        "fiftyTwoWeekHigh": {
          "type": "number"
        },
        "fiftyTwoWeekChangePercent": {
          "type": "number"
        },
        "dividendDate": {
          "type": "string",
          "format": "date-time"
        },
        "earningsTimestamp": {
          "type": "string",
          "format": "date-time"
        },
        "earningsTimestampStart": {
          "type": "string",
          "format": "date-time"
        },
        "earningsTimestampEnd": {
          "type": "string",
          "format": "date-time"
        },
        "earningsCallTimestampStart": {
          "type": "string",
          "format": "date-time"
        },
        "earningsCallTimestampEnd": {
          "type": "string",
          "format": "date-time"
        },
        "isEarningsDateEstimate": {
          "type": "boolean"
        },
        "trailingAnnualDividendRate": {
          "type": "number"
        },
        "trailingPE": {
          "type": "number"
        },
        "trailingAnnualDividendYield": {
          "type": "number"
        },
        "epsTrailingTwelveMonths": {
          "type": "number"
        },
        "epsForward": {
          "type": "number"
        },
        "epsCurrentYear": {
          "type": "number"
        },
        "priceEpsCurrentYear": {
          "type": "number"
        },
        "sharesOutstanding": {
          "type": "number"
        },
        "bookValue": {
          "type": "number"
        },
        "fiftyDayAverage": {
          "type": "number"
        },
        "fiftyDayAverageChange": {
          "type": "number"
        },
        "fiftyDayAverageChangePercent": {
          "type": "number"
        },
        "twoHundredDayAverage": {
          "type": "number"
        },
        "twoHundredDayAverageChange": {
          "type": "number"
        },
        "twoHundredDayAverageChangePercent": {
          "type": "number"
        },
        "marketCap": {
          "type": "number"
        },
        "forwardPE": {
          "type": "number"
        },
        "priceToBook": {
          "type": "number"
        },
        "sourceInterval": {
          "type": "number"
        },
        "exchangeDataDelayedBy": {
          "type": "number"
        },
        "firstTradeDateMilliseconds": {
          "$ref": "#/definitions/DateInMs"
        },
        "priceHint": {
          "type": "number"
        },
        "postMarketChangePercent": {
          "type": "number"
        },
        "postMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "postMarketPrice": {
          "type": "number"
        },
        "postMarketChange": {
          "type": "number"
        },
        "hasPrePostMarketData": {
          "type": "boolean"
        },
        "extendedMarketChange": {
          "type": "number"
        },
        "extendedMarketChangePercent": {
          "type": "number"
        },
        "extendedMarketPrice": {
          "type": "number"
        },
        "extendedMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "regularMarketChange": {
          "type": "number"
        },
        "regularMarketChangePercent": {
          "type": "number"
        },
        "regularMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "regularMarketPrice": {
          "type": "number"
        },
        "regularMarketDayHigh": {
          "type": "number"
        },
        "regularMarketDayRange": {
          "$ref": "#/definitions/TwoNumberRange"
        },
        "regularMarketDayLow": {
          "type": "number"
        },
        "regularMarketVolume": {
          "type": "number"
        },
        "dayHigh": {
          "type": "number"
        },
        "dayLow": {
          "type": "number"
        },
        "volume": {
          "type": "number"
        },
        "regularMarketPreviousClose": {
          "type": "number"
        },
        "preMarketChange": {
          "type": "number"
        },
        "preMarketChangePercent": {
          "type": "number"
        },
        "preMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "preMarketPrice": {
          "type": "number"
        },
        "bid": {
          "type": "number"
        },
        "ask": {
          "type": "number"
        },
        "bidSize": {
          "type": "number"
        },
        "askSize": {
          "type": "number"
        },
        "fullExchangeName": {
          "type": "string"
        },
        "financialCurrency": {
          "type": "string"
        },
        "regularMarketOpen": {
          "type": "number"
        },
        "averageDailyVolume3Month": {
          "type": "number"
        },
        "averageDailyVolume10Day": {
          "type": "number"
        },
        "displayName": {
          "type": "string"
        },
        "symbol": {
          "type": "string"
        },
        "underlyingSymbol": {
          "type": "string"
        },
        "ytdReturn": {
          "type": "number"
        },
        "trailingThreeMonthReturns": {
          "type": "number"
        },
        "trailingThreeMonthNavReturns": {
          "type": "number"
        },
        "ipoExpectedDate": {
          "type": "string",
          "format": "date-time"
        },
        "newListingDate": {
          "type": "string",
          "format": "date-time"
        },
        "nameChangeDate": {
          "type": "string",
          "format": "date-time"
        },
        "prevName": {
          "type": "string"
        },
        "averageAnalystRating": {
          "type": "string"
        },
        "pageViewGrowthWeekly": {
          "type": "number"
        },
        "openInterest": {
          "type": "number"
        },
        "beta": {
          "type": "number"
        },
        "companyLogoUrl": {
          "type": "string"
        },
        "logoUrl": {
          "type": "string"
        },
        "impliedSharesOutstanding": {
          "type": "number"
        },
        "netAssets": {
          "type": "number"
        }
      },
      "required": [
        "esgPopulated",
        "exchange",
        "exchangeDataDelayedBy",
        "exchangeTimezoneName",
        "exchangeTimezoneShortName",
        "fullExchangeName",
        "gmtOffSetMilliseconds",
        "language",
        "market",
        "marketState",
        "quoteType",
        "region",
        "sourceInterval",
        "symbol",
        "tradeable",
        "triggerable",
        "typeDisp"
      ]
    },
    "QuoteAltSymbol": {
      "type": "object",
      "properties": {
        "language": {
          "type": "string"
        },
        "region": {
          "type": "string"
        },
        "quoteType": {
          "type": "string",
          "const": "ALTSYMBOL"
        },
        "typeDisp": {
          "type": "string",
          "const": "ALTSYMBOL"
        },
        "quoteSourceName": {
          "type": "string"
        },
        "triggerable": {
          "type": "boolean"
        },
        "currency": {
          "type": "string"
        },
        "customPriceAlertConfidence": {
          "type": "string"
        },
        "marketState": {
          "type": "string",
          "enum": [
            "REGULAR",
            "CLOSED",
            "PRE",
            "PREPRE",
            "POST",
            "POSTPOST"
          ]
        },
        "tradeable": {
          "type": "boolean"
        },
        "cryptoTradeable": {
          "type": "boolean"
        },
        "corporateActions": {
          "type": "array",
          "items": {}
        },
        "exchange": {
          "type": "string"
        },
        "shortName": {
          "type": "string"
        },
        "longName": {
          "type": "string"
        },
        "messageBoardId": {
          "type": "string"
        },
        "exchangeTimezoneName": {
          "type": "string"
        },
        "exchangeTimezoneShortName": {
          "type": "string"
        },
        "gmtOffSetMilliseconds": {
          "type": "number"
        },
        "market": {
          "type": "string"
        },
        "esgPopulated": {
          "type": "boolean"
        },
        "fiftyTwoWeekLowChange": {
          "type": "number"
        },
        "fiftyTwoWeekLowChangePercent": {
          "type": "number"
        },
        "fiftyTwoWeekRange": {
          "$ref": "#/definitions/TwoNumberRange"
        },
        "fiftyTwoWeekHighChange": {
          "type": "number"
        },
        "fiftyTwoWeekHighChangePercent": {
          "type": "number"
        },
        "fiftyTwoWeekLow": {
          "type": "number"
        },
        "fiftyTwoWeekHigh": {
          "type": "number"
        },
        "fiftyTwoWeekChangePercent": {
          "type": "number"
        },
        "dividendDate": {
          "type": "string",
          "format": "date-time"
        },
        "earningsTimestamp": {
          "type": "string",
          "format": "date-time"
        },
        "earningsTimestampStart": {
          "type": "string",
          "format": "date-time"
        },
        "earningsTimestampEnd": {
          "type": "string",
          "format": "date-time"
        },
        "earningsCallTimestampStart": {
          "type": "string",
          "format": "date-time"
        },
        "earningsCallTimestampEnd": {
          "type": "string",
          "format": "date-time"
        },
        "isEarningsDateEstimate": {
          "type": "boolean"
        },
        "trailingAnnualDividendRate": {
          "type": "number"
        },
        "trailingPE": {
          "type": "number"
        },
        "trailingAnnualDividendYield": {
          "type": "number"
        },
        "epsTrailingTwelveMonths": {
          "type": "number"
        },
        "epsForward": {
          "type": "number"
        },
        "epsCurrentYear": {
          "type": "number"
        },
        "priceEpsCurrentYear": {
          "type": "number"
        },
        "sharesOutstanding": {
          "type": "number"
        },
        "bookValue": {
          "type": "number"
        },
        "fiftyDayAverage": {
          "type": "number"
        },
        "fiftyDayAverageChange": {
          "type": "number"
        },
        "fiftyDayAverageChangePercent": {
          "type": "number"
        },
        "twoHundredDayAverage": {
          "type": "number"
        },
        "twoHundredDayAverageChange": {
          "type": "number"
        },
        "twoHundredDayAverageChangePercent": {
          "type": "number"
        },
        "marketCap": {
          "type": "number"
        },
        "forwardPE": {
          "type": "number"
        },
        "priceToBook": {
          "type": "number"
        },
        "sourceInterval": {
          "type": "number"
        },
        "exchangeDataDelayedBy": {
          "type": "number"
        },
        "firstTradeDateMilliseconds": {
          "$ref": "#/definitions/DateInMs"
        },
        "priceHint": {
          "type": "number"
        },
        "postMarketChangePercent": {
          "type": "number"
        },
        "postMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "postMarketPrice": {
          "type": "number"
        },
        "postMarketChange": {
          "type": "number"
        },
        "hasPrePostMarketData": {
          "type": "boolean"
        },
        "extendedMarketChange": {
          "type": "number"
        },
        "extendedMarketChangePercent": {
          "type": "number"
        },
        "extendedMarketPrice": {
          "type": "number"
        },
        "extendedMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "regularMarketChange": {
          "type": "number"
        },
        "regularMarketChangePercent": {
          "type": "number"
        },
        "regularMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "regularMarketPrice": {
          "type": "number"
        },
        "regularMarketDayHigh": {
          "type": "number"
        },
        "regularMarketDayRange": {
          "$ref": "#/definitions/TwoNumberRange"
        },
        "regularMarketDayLow": {
          "type": "number"
        },
        "regularMarketVolume": {
          "type": "number"
        },
        "dayHigh": {
          "type": "number"
        },
        "dayLow": {
          "type": "number"
        },
        "volume": {
          "type": "number"
        },
        "regularMarketPreviousClose": {
          "type": "number"
        },
        "preMarketChange": {
          "type": "number"
        },
        "preMarketChangePercent": {
          "type": "number"
        },
        "preMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "preMarketPrice": {
          "type": "number"
        },
        "bid": {
          "type": "number"
        },
        "ask": {
          "type": "number"
        },
        "bidSize": {
          "type": "number"
        },
        "askSize": {
          "type": "number"
        },
        "fullExchangeName": {
          "type": "string"
        },
        "financialCurrency": {
          "type": "string"
        },
        "regularMarketOpen": {
          "type": "number"
        },
        "averageDailyVolume3Month": {
          "type": "number"
        },
        "averageDailyVolume10Day": {
          "type": "number"
        },
        "displayName": {
          "type": "string"
        },
        "symbol": {
          "type": "string"
        },
        "underlyingSymbol": {
          "type": "string"
        },
        "ytdReturn": {
          "type": "number"
        },
        "trailingThreeMonthReturns": {
          "type": "number"
        },
        "trailingThreeMonthNavReturns": {
          "type": "number"
        },
        "ipoExpectedDate": {
          "type": "string",
          "format": "date-time"
        },
        "newListingDate": {
          "type": "string",
          "format": "date-time"
        },
        "nameChangeDate": {
          "type": "string",
          "format": "date-time"
        },
        "prevName": {
          "type": "string"
        },
        "averageAnalystRating": {
          "type": "string"
        },
        "pageViewGrowthWeekly": {
          "type": "number"
        },
        "openInterest": {
          "type": "number"
        },
        "beta": {
          "type": "number"
        },
        "companyLogoUrl": {
          "type": "string"
        },
        "logoUrl": {
          "type": "string"
        },
        "impliedSharesOutstanding": {
          "type": "number"
        },
        "underlyingExchangeSymbol": {
          "type": "string"
        },
        "expireDate": {
          "type": "string",
          "format": "date-time"
        },
        "expireIsoDate": {
          "type": "string"
        }
      },
      "required": [
        "esgPopulated",
        "exchange",
        "exchangeDataDelayedBy",
        "exchangeTimezoneName",
        "exchangeTimezoneShortName",
        "expireDate",
        "expireIsoDate",
        "fullExchangeName",
        "gmtOffSetMilliseconds",
        "language",
        "market",
        "marketState",
        "quoteType",
        "region",
        "sourceInterval",
        "symbol",
        "tradeable",
        "triggerable",
        "typeDisp",
        "underlyingExchangeSymbol"
      ]
    },
    "Quote": {
      "type": "object",
      "discriminator": {
        "propertyName": "quoteType"
      },
      "required": [
        "quoteType"
      ],
      "oneOf": [
        {
          "$ref": "#/definitions/QuoteAltSymbol"
        },
        {
          "$ref": "#/definitions/QuoteCryptoCurrency"
        },
        {
          "$ref": "#/definitions/QuoteCurrency"
        },
        {
          "$ref": "#/definitions/QuoteECNQuote"
        },
        {
          "$ref": "#/definitions/QuoteEtf"
        },
        {
          "$ref": "#/definitions/QuoteEquity"
        },
        {
          "$ref": "#/definitions/QuoteFuture"
        },
        {
          "$ref": "#/definitions/QuoteIndex"
        },
        {
          "$ref": "#/definitions/QuoteMutualfund"
        },
        {
          "$ref": "#/definitions/QuoteOption"
        },
        {
          "$ref": "#/definitions/QuoteMoneyMarket"
        }
      ]
    },
    "QuoteField": {
      "type": "string",
      "enum": [
        "quoteType",
        "typeDisp",
        "underlyingExchangeSymbol",
        "expireDate",
        "expireIsoDate",
        "language",
        "region",
        "quoteSourceName",
        "triggerable",
        "currency",
        "customPriceAlertConfidence",
        "marketState",
        "tradeable",
        "cryptoTradeable",
        "corporateActions",
        "exchange",
        "shortName",
        "longName",
        "messageBoardId",
        "exchangeTimezoneName",
        "exchangeTimezoneShortName",
        "gmtOffSetMilliseconds",
        "market",
        "esgPopulated",
        "fiftyTwoWeekLowChange",
        "fiftyTwoWeekLowChangePercent",
        "fiftyTwoWeekRange",
        "fiftyTwoWeekHighChange",
        "fiftyTwoWeekHighChangePercent",
        "fiftyTwoWeekLow",
        "fiftyTwoWeekHigh",
        "fiftyTwoWeekChangePercent",
        "dividendDate",
        "earningsTimestamp",
        "earningsTimestampStart",
        "earningsTimestampEnd",
        "earningsCallTimestampStart",
        "earningsCallTimestampEnd",
        "isEarningsDateEstimate",
        "trailingAnnualDividendRate",
        "trailingPE",
        "trailingAnnualDividendYield",
        "epsTrailingTwelveMonths",
        "epsForward",
        "epsCurrentYear",
        "priceEpsCurrentYear",
        "sharesOutstanding",
        "bookValue",
        "fiftyDayAverage",
        "fiftyDayAverageChange",
        "fiftyDayAverageChangePercent",
        "twoHundredDayAverage",
        "twoHundredDayAverageChange",
        "twoHundredDayAverageChangePercent",
        "marketCap",
        "forwardPE",
        "priceToBook",
        "sourceInterval",
        "exchangeDataDelayedBy",
        "firstTradeDateMilliseconds",
        "priceHint",
        "postMarketChangePercent",
        "postMarketTime",
        "postMarketPrice",
        "postMarketChange",
        "hasPrePostMarketData",
        "extendedMarketChange",
        "extendedMarketChangePercent",
        "extendedMarketPrice",
        "extendedMarketTime",
        "regularMarketChange",
        "regularMarketChangePercent",
        "regularMarketTime",
        "regularMarketPrice",
        "regularMarketDayHigh",
        "regularMarketDayRange",
        "regularMarketDayLow",
        "regularMarketVolume",
        "dayHigh",
        "dayLow",
        "volume",
        "regularMarketPreviousClose",
        "preMarketChange",
        "preMarketChangePercent",
        "preMarketTime",
        "preMarketPrice",
        "bid",
        "ask",
        "bidSize",
        "askSize",
        "fullExchangeName",
        "financialCurrency",
        "regularMarketOpen",
        "averageDailyVolume3Month",
        "averageDailyVolume10Day",
        "displayName",
        "symbol",
        "underlyingSymbol",
        "ytdReturn",
        "trailingThreeMonthReturns",
        "trailingThreeMonthNavReturns",
        "ipoExpectedDate",
        "newListingDate",
        "nameChangeDate",
        "prevName",
        "averageAnalystRating",
        "pageViewGrowthWeekly",
        "openInterest",
        "beta",
        "companyLogoUrl",
        "logoUrl",
        "impliedSharesOutstanding",
        "circulatingSupply",
        "fromCurrency",
        "toCurrency",
        "lastMarket",
        "coinImageUrl",
        "volume24Hr",
        "volumeAllCurrencies",
        "startDate",
        "coinMarketCapLink",
        "maxSupply",
        "totalSupply",
        "dividendRate",
        "dividendYield",
        "netAssets",
        "netExpenseRatio",
        "headSymbolAsString",
        "contractSymbol",
        "strike"
      ]
    },
    "ResultType": {
      "type": "string",
      "enum": [
        "array",
        "object",
        "map"
      ]
    },
    "QuoteResponseArray": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/Quote"
      }
    },
    "QuoteResponseMap": {
      "type": "object",
      "properties": {
        "size": {
          "type": "number"
        }
      },
      "required": [
        "size"
      ],
      "additionalProperties": false
    },
    "QuoteResponseObject": {
      "type": "object",
      "additionalProperties": {
        "$ref": "#/definitions/Quote"
      }
    },
    "QuoteOptions": {
      "type": "object",
      "properties": {
        "fields": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/QuoteField"
          }
        },
        "lang": {
          "type": "string"
        },
        "region": {
          "type": "string"
        },
        "return": {
          "$ref": "#/definitions/ResultType"
        }
      },
      "additionalProperties": false
    },
    "QuoteOptionsWithReturnArray": {
      "type": "object",
      "properties": {
        "fields": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/QuoteField"
          }
        },
        "lang": {
          "type": "string"
        },
        "region": {
          "type": "string"
        },
        "return": {
          "type": "string",
          "const": "array"
        }
      },
      "additionalProperties": false
    },
    "QuoteOptionsWithReturnMap": {
      "type": "object",
      "properties": {
        "fields": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/QuoteField"
          }
        },
        "lang": {
          "type": "string"
        },
        "region": {
          "type": "string"
        },
        "return": {
          "type": "string",
          "const": "map"
        }
      },
      "required": [
        "return"
      ],
      "additionalProperties": false
    },
    "QuoteOptionsWithReturnObject": {
      "type": "object",
      "properties": {
        "fields": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/QuoteField"
          }
        },
        "lang": {
          "type": "string"
        },
        "region": {
          "type": "string"
        },
        "return": {
          "type": "string",
          "const": "object"
        }
      },
      "required": [
        "return"
      ],
      "additionalProperties": false
    },
    "quote": {}
  }
};
const definitions$9 = getTypedDefinitions(schema$7);
const queryOptionsDefaults$a = {};
async function quote(query, queryOptionsOverrides, moduleOptions) {
  const symbols = typeof query === "string" ? query : query.join(",");
  const returnAs = queryOptionsOverrides && queryOptionsOverrides.return;
  const results = await this._moduleExec({
    moduleName: "quote",
    query: {
      url: "https://${YF_QUERY_HOST}/v7/finance/quote",
      needsCrumb: true,
      definitions: definitions$9,
      schemaKey: "#/definitions/QuoteOptions",
      defaults: queryOptionsDefaults$a,
      runtime: { symbols },
      overrides: queryOptionsOverrides,
      transformWith(queryOptions) {
        if (queryOptions.fields)
          queryOptions.fields.join(",");
        delete queryOptions.return;
        return queryOptions;
      }
    },
    result: {
      definitions: definitions$9,
      schemaKey: "#/definitions/QuoteResponseArray",
      // deno-lint-ignore no-explicit-any
      transformWith(rawResult) {
        let results2 = rawResult?.quoteResponse?.result;
        if (!results2 || !Array.isArray(results2)) {
          throw new Error("Unexpected result: " + JSON.stringify(rawResult));
        }
        results2 = results2.filter((quote2) => quote2?.quoteType !== "NONE");
        return results2;
      }
    },
    moduleOptions
  });
  if (returnAs) {
    switch (returnAs) {
      case "array":
        return results;
      case "object": {
        const object3 = {};
        for (const result of results)
          object3[result.symbol] = result;
        return object3;
      }
      case "map": {
        const map = /* @__PURE__ */ new Map();
        for (const result of results)
          map.set(result.symbol, result);
        return map;
      }
    }
  } else {
    return typeof query === "string" ? results[0] : results;
  }
}
const definitions$8 = getTypedDefinitions(schema$7);
const slugMap = /* @__PURE__ */ new Map();
const defaultOptions = {
  maxSymbolsPerRequest: 100,
  debounceTime: 50
};
function quoteCombine(query, _queryOptionsOverrides = {}, moduleOptions) {
  const symbol = query;
  if (typeof symbol !== "string") {
    throw new Error("quoteCombine expects a string query parameter, received: " + JSON.stringify(symbol, null, 2));
  }
  if (_queryOptionsOverrides.return && _queryOptionsOverrides.return !== "array") {
    throw new Error("Can't specify other return types using quoteCombine()");
  }
  const queryOptionsOverrides = _queryOptionsOverrides;
  const validateOptions2 = !moduleOptions || moduleOptions.validateOptions === void 0 || moduleOptions.validateOptions === true;
  try {
    validate({
      source: "quoteCombine",
      type: "options",
      object: queryOptionsOverrides,
      definitions: definitions$8,
      schemaOrSchemaKey: "#/definitions/QuoteOptions",
      options: this._opts.validation,
      logger: this._opts.logger,
      logObj: this._logObj,
      versionCheck: this._opts.versionCheck
    });
  } catch (error) {
    if (validateOptions2)
      throw error;
  }
  const _slug = JSON.stringify(queryOptionsOverrides);
  let entry = slugMap.get(_slug);
  if (!entry) {
    entry = {
      timeout: null,
      queryOptionsOverrides,
      symbols: /* @__PURE__ */ new Map()
    };
    slugMap.set(_slug, entry);
  }
  let i = 1, slug = _slug;
  while (entry && entry.symbols.size >= this._opts.quoteCombine.maxSymbolsPerRequest) {
    slug = `${_slug}-${i++}`;
    entry = slugMap.get(slug);
  }
  if (!entry) {
    entry = {
      timeout: null,
      queryOptionsOverrides,
      symbols: /* @__PURE__ */ new Map()
    };
    slugMap.set(slug, entry);
  }
  if (entry.timeout)
    clearTimeout(entry.timeout);
  return new Promise((resolve, reject) => {
    let symbolPromiseCallbacks = entry.symbols.get(symbol);
    if (!symbolPromiseCallbacks) {
      symbolPromiseCallbacks = [];
      entry.symbols.set(symbol, symbolPromiseCallbacks);
    }
    symbolPromiseCallbacks.push({ resolve, reject });
    entry.timeout = setTimeout(() => {
      slugMap.delete(slug);
      const symbols = Array.from(entry.symbols.keys());
      const thisQuote = quote.bind(this);
      thisQuote(symbols, queryOptionsOverrides, {
        ...moduleOptions,
        validateResult: true
      }).then((results) => {
        for (const result of results) {
          for (const promise2 of entry.symbols.get(result.symbol)) {
            promise2.resolve(result);
            promise2.resolved = true;
          }
        }
        for (const [_symbol, promises] of entry.symbols) {
          for (const promise2 of promises) {
            if (!promise2.resolved) {
              promise2.resolve(void 0);
            }
          }
        }
      }).catch((error) => {
        for (const symbolPromiseCallbacks2 of entry.symbols.values()) {
          for (const promise2 of symbolPromiseCallbacks2)
            promise2.reject(error);
        }
      });
    }, this._opts.quoteCombine.debounceTime);
  });
}
const userAgent = `Mozilla/5.0 (compatible; yahoo-finance2/${pkg.version})`;
const options$1 = {
  YF_QUERY_HOST: "query2.finance.yahoo.com",
  cookieJar: new ExtendedCookieJar(),
  queue: {
    concurrency: 4,
    // Min: 1, Max: Infinity
    interval: 0
    // timeout: 60,
  },
  validation: {
    logErrors: true,
    logOptionsErrors: true,
    allowAdditionalProps: true
  },
  logger: defaultOptions$1,
  quoteCombine: defaultOptions,
  versionCheck: true,
  fetchOptions: {
    headers: {
      "User-Agent": userAgent
    }
  }
};
function isPlainObject(value) {
  if (value === null || typeof value !== "object")
    return false;
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}
function isUnsafeKey(key) {
  return key === "__proto__" || key === "constructor" || key === "prototype";
}
function mergeTwo(target, source) {
  const out = { ...target };
  for (const key of Reflect.ownKeys(source)) {
    if (isUnsafeKey(key))
      continue;
    const srcVal = source[key];
    const tgtVal = out[key];
    if (isPlainObject(tgtVal) && isPlainObject(srcVal)) {
      out[key] = mergeTwo(tgtVal, srcVal);
    } else {
      out[key] = srcVal;
    }
  }
  return out;
}
function deepMerge(...objects) {
  let result = /* @__PURE__ */ Object.create(null);
  for (const obj of objects) {
    if (!isPlainObject(obj)) {
      result = obj;
      continue;
    }
    result = mergeTwo(result, obj);
  }
  return result;
}
const MIN_SUPPORTED_RUNTIMES = {
  node: "22.0.0",
  deno: "2.0.0",
  bun: "1.0.0",
  cloudflare: {
    requireFeatures: []
  }
};
let YahooFinance$1 = class YahooFinance {
  _setOpts(options2) {
    setOptions.call(this, options2);
  }
  constructor(options2) {
    Object.defineProperty(this, "_opts", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "_fetch", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "_moduleExec", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "_notices", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "_env", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "_logObj", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this._fetch = yahooFinanceFetch;
    this._moduleExec = moduleExec;
    this._env = {
      fetch: null
    };
    if ("_createOpts" in this) {
      const createOpts2 = this._createOpts;
      this._opts = deepMerge(options$1, createOpts2["_opts"] ?? {}, options2 ?? {});
      if ("_allowAdditionalProps" in createOpts2) {
        if (!this._opts.validation)
          this._opts.validation = {};
        this._opts.validation.allowAdditionalProps = false;
      }
      if ("fetchDevel" in createOpts2) {
        this._env.fetchDevel = createOpts2.fetchDevel;
      }
    } else {
      this._opts = deepMerge(options$1, options2 ?? {});
    }
    this._notices = new Notices(this);
    this._logObj = distExports.Deno.stdout.isTerminal() ? (obj, opts) => this._opts.logger.dir(obj, { depth: opts?.depth ?? 4, colors: true }) : (obj) => this._opts.logger.info(JSON.stringify(obj, null, 2));
    validateOptions.call(this, options2 ?? {}, "#constructor");
    try {
      assertSupported(MIN_SUPPORTED_RUNTIMES);
    } catch (error) {
      const warning = ". Things might break or work unexpectedly!";
      if (error instanceof Error) {
        this._opts.logger.warn("[yahoo-finance2] " + error.message + warning);
      } else {
        this._opts.logger.warn("[yahoo-finance2] " + JSON.stringify(error) + warning);
      }
    }
  }
};
function createYahooFinance(createOpts2) {
  const { modules: modules2, ...rest } = createOpts2;
  Object.assign(YahooFinance$1.prototype, modules2);
  Object.assign(YahooFinance$1.prototype, { _createOpts: rest });
  Object.assign(YahooFinance$1, Object.fromEntries(Object.keys(modules2).map((key) => [key, function() {
    throw new Error("Call `const yahooFinance = new YahooFinance()` first.  Upgrading from v2?  See https://github.com/gadicc/yahoo-finance2/blob/dev/docs/UPGRADING.md.");
  }])));
  return YahooFinance$1;
}
function autoc() {
  throw new Error("Yahoo decomissioned their autoc server sometime before 20 Nov 2021 (see https://github.com/gadicc/yahoo-finance2/issues/337])). Use `search` instead (just like they do).");
}
const chartSchema = {
  "definitions": {
    "ChartResultObject": {
      "type": "object",
      "properties": {
        "meta": {
          "$ref": "#/definitions/ChartMeta"
        },
        "timestamp": {
          "type": "array",
          "items": {
            "type": "number"
          }
        },
        "events": {
          "$ref": "#/definitions/ChartEventsObject"
        },
        "indicators": {
          "$ref": "#/definitions/ChartIndicatorsObject"
        }
      },
      "required": [
        "meta",
        "indicators"
      ],
      "additionalProperties": {}
    },
    "ChartMeta": {
      "type": "object",
      "properties": {
        "currency": {
          "type": "string"
        },
        "symbol": {
          "type": "string"
        },
        "exchangeName": {
          "type": "string"
        },
        "instrumentType": {
          "type": "string"
        },
        "fiftyTwoWeekHigh": {
          "type": "number"
        },
        "fiftyTwoWeekLow": {
          "type": "number"
        },
        "firstTradeDate": {
          "anyOf": [
            {
              "type": "string",
              "format": "date-time"
            },
            {
              "type": "null"
            }
          ]
        },
        "fullExchangeName": {
          "type": "string"
        },
        "regularMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "gmtoffset": {
          "type": "number"
        },
        "hasPrePostMarketData": {
          "type": "boolean"
        },
        "timezone": {
          "type": "string"
        },
        "exchangeTimezoneName": {
          "type": "string"
        },
        "regularMarketPrice": {
          "type": "number"
        },
        "chartPreviousClose": {
          "type": "number"
        },
        "previousClose": {
          "type": "number"
        },
        "regularMarketDayHigh": {
          "type": "number"
        },
        "regularMarketDayLow": {
          "type": "number"
        },
        "regularMarketVolume": {
          "type": "number"
        },
        "longName": {
          "type": "string"
        },
        "shortName": {
          "type": "string"
        },
        "scale": {
          "type": "number"
        },
        "priceHint": {
          "type": "number"
        },
        "currentTradingPeriod": {
          "type": "object",
          "properties": {
            "pre": {
              "$ref": "#/definitions/ChartMetaTradingPeriod"
            },
            "regular": {
              "$ref": "#/definitions/ChartMetaTradingPeriod"
            },
            "post": {
              "$ref": "#/definitions/ChartMetaTradingPeriod"
            }
          },
          "required": [
            "pre",
            "regular",
            "post"
          ],
          "additionalProperties": {}
        },
        "tradingPeriods": {
          "anyOf": [
            {
              "$ref": "#/definitions/ChartMetaTradingPeriods"
            },
            {
              "type": "array",
              "items": {
                "type": "array",
                "items": {
                  "$ref": "#/definitions/ChartMetaTradingPeriod"
                }
              }
            }
          ]
        },
        "dataGranularity": {
          "type": "string"
        },
        "range": {
          "type": "string"
        },
        "validRanges": {
          "type": "array",
          "items": {
            "type": "string"
          }
        }
      },
      "required": [
        "currency",
        "symbol",
        "exchangeName",
        "instrumentType",
        "firstTradeDate",
        "regularMarketTime",
        "gmtoffset",
        "timezone",
        "exchangeTimezoneName",
        "regularMarketPrice",
        "priceHint",
        "currentTradingPeriod",
        "dataGranularity",
        "range",
        "validRanges"
      ],
      "additionalProperties": {}
    },
    "ChartMetaTradingPeriod": {
      "type": "object",
      "properties": {
        "timezone": {
          "type": "string"
        },
        "start": {
          "type": "string",
          "format": "date-time"
        },
        "end": {
          "type": "string",
          "format": "date-time"
        },
        "gmtoffset": {
          "type": "number"
        }
      },
      "required": [
        "timezone",
        "start",
        "end",
        "gmtoffset"
      ],
      "additionalProperties": {}
    },
    "ChartMetaTradingPeriods": {
      "type": "object",
      "properties": {
        "pre": {
          "type": "array",
          "items": {
            "type": "array",
            "items": {
              "$ref": "#/definitions/ChartMetaTradingPeriod"
            }
          }
        },
        "post": {
          "type": "array",
          "items": {
            "type": "array",
            "items": {
              "$ref": "#/definitions/ChartMetaTradingPeriod"
            }
          }
        },
        "regular": {
          "type": "array",
          "items": {
            "type": "array",
            "items": {
              "$ref": "#/definitions/ChartMetaTradingPeriod"
            }
          }
        }
      },
      "additionalProperties": {}
    },
    "ChartEventsObject": {
      "type": "object",
      "properties": {
        "dividends": {
          "$ref": "#/definitions/ChartEventDividends"
        },
        "splits": {
          "$ref": "#/definitions/ChartEventSplits"
        }
      },
      "additionalProperties": {}
    },
    "ChartEventDividends": {
      "type": "object",
      "additionalProperties": {
        "$ref": "#/definitions/ChartEventDividend"
      }
    },
    "ChartEventDividend": {
      "type": "object",
      "properties": {
        "amount": {
          "type": "number"
        },
        "date": {
          "type": "string",
          "format": "date-time"
        }
      },
      "required": [
        "amount",
        "date"
      ],
      "additionalProperties": {}
    },
    "ChartEventSplits": {
      "type": "object",
      "additionalProperties": {
        "$ref": "#/definitions/ChartEventSplit"
      }
    },
    "ChartEventSplit": {
      "type": "object",
      "properties": {
        "date": {
          "type": "string",
          "format": "date-time"
        },
        "numerator": {
          "type": "number"
        },
        "denominator": {
          "type": "number"
        },
        "splitRatio": {
          "type": "string"
        }
      },
      "required": [
        "date",
        "numerator",
        "denominator",
        "splitRatio"
      ],
      "additionalProperties": {}
    },
    "ChartIndicatorsObject": {
      "type": "object",
      "properties": {
        "quote": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/ChartIndicatorQuote"
          }
        },
        "adjclose": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/ChartIndicatorAdjclose"
          }
        }
      },
      "required": [
        "quote"
      ],
      "additionalProperties": {}
    },
    "ChartIndicatorQuote": {
      "type": "object",
      "properties": {
        "high": {
          "type": "array",
          "items": {
            "type": [
              "number",
              "null"
            ]
          }
        },
        "low": {
          "type": "array",
          "items": {
            "type": [
              "number",
              "null"
            ]
          }
        },
        "open": {
          "type": "array",
          "items": {
            "type": [
              "number",
              "null"
            ]
          }
        },
        "close": {
          "type": "array",
          "items": {
            "type": [
              "number",
              "null"
            ]
          }
        },
        "volume": {
          "type": "array",
          "items": {
            "type": [
              "number",
              "null"
            ]
          }
        }
      },
      "required": [
        "high",
        "low",
        "open",
        "close",
        "volume"
      ],
      "additionalProperties": {}
    },
    "ChartIndicatorAdjclose": {
      "type": "object",
      "properties": {
        "adjclose": {
          "type": "array",
          "items": {
            "type": [
              "number",
              "null"
            ]
          }
        }
      },
      "additionalProperties": {}
    },
    "ChartResultArray": {
      "type": "object",
      "properties": {
        "meta": {
          "$ref": "#/definitions/ChartMeta"
        },
        "events": {
          "$ref": "#/definitions/ChartEventsArray"
        },
        "quotes": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/ChartResultArrayQuote"
          }
        }
      },
      "required": [
        "meta",
        "quotes"
      ],
      "additionalProperties": false
    },
    "ChartEventsArray": {
      "type": "object",
      "properties": {
        "dividends": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/ChartEventDividend"
          }
        },
        "splits": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/ChartEventSplit"
          }
        }
      },
      "additionalProperties": {}
    },
    "ChartResultArrayQuote": {
      "type": "object",
      "properties": {
        "date": {
          "type": "string",
          "format": "date-time"
        },
        "high": {
          "type": [
            "number",
            "null"
          ]
        },
        "low": {
          "type": [
            "number",
            "null"
          ]
        },
        "open": {
          "type": [
            "number",
            "null"
          ]
        },
        "close": {
          "type": [
            "number",
            "null"
          ]
        },
        "volume": {
          "type": [
            "number",
            "null"
          ]
        },
        "adjclose": {
          "type": [
            "number",
            "null"
          ]
        }
      },
      "required": [
        "date",
        "high",
        "low",
        "open",
        "close",
        "volume"
      ],
      "additionalProperties": {}
    },
    "ChartOptions": {
      "type": "object",
      "properties": {
        "period1": {
          "anyOf": [
            {
              "type": "string",
              "format": "date-time"
            },
            {
              "type": "string"
            },
            {
              "type": "number"
            }
          ]
        },
        "period2": {
          "anyOf": [
            {
              "type": "string",
              "format": "date-time"
            },
            {
              "type": "string"
            },
            {
              "type": "number"
            }
          ]
        },
        "useYfid": {
          "type": "boolean"
        },
        "interval": {
          "type": "string",
          "enum": [
            "1m",
            "2m",
            "5m",
            "15m",
            "30m",
            "60m",
            "90m",
            "1h",
            "1d",
            "5d",
            "1wk",
            "1mo",
            "3mo"
          ]
        },
        "includePrePost": {
          "type": "boolean"
        },
        "events": {
          "type": "string"
        },
        "lang": {
          "type": "string"
        },
        "return": {
          "type": "string",
          "enum": [
            "array",
            "object"
          ]
        }
      },
      "required": [
        "period1"
      ],
      "additionalProperties": false
    },
    "ChartOptionsWithReturnArray": {
      "type": "object",
      "properties": {
        "period1": {
          "anyOf": [
            {
              "type": "string",
              "format": "date-time"
            },
            {
              "type": "string"
            },
            {
              "type": "number"
            }
          ]
        },
        "period2": {
          "anyOf": [
            {
              "type": "string",
              "format": "date-time"
            },
            {
              "type": "string"
            },
            {
              "type": "number"
            }
          ]
        },
        "useYfid": {
          "type": "boolean"
        },
        "interval": {
          "type": "string",
          "enum": [
            "1m",
            "2m",
            "5m",
            "15m",
            "30m",
            "60m",
            "90m",
            "1h",
            "1d",
            "5d",
            "1wk",
            "1mo",
            "3mo"
          ]
        },
        "includePrePost": {
          "type": "boolean"
        },
        "events": {
          "type": "string"
        },
        "lang": {
          "type": "string"
        },
        "return": {
          "type": "string",
          "const": "array"
        }
      },
      "additionalProperties": false,
      "required": [
        "period1"
      ]
    },
    "ChartOptionsWithReturnObject": {
      "type": "object",
      "properties": {
        "period1": {
          "anyOf": [
            {
              "type": "string",
              "format": "date-time"
            },
            {
              "type": "string"
            },
            {
              "type": "number"
            }
          ]
        },
        "period2": {
          "anyOf": [
            {
              "type": "string",
              "format": "date-time"
            },
            {
              "type": "string"
            },
            {
              "type": "number"
            }
          ]
        },
        "useYfid": {
          "type": "boolean"
        },
        "interval": {
          "type": "string",
          "enum": [
            "1m",
            "2m",
            "5m",
            "15m",
            "30m",
            "60m",
            "90m",
            "1h",
            "1d",
            "5d",
            "1wk",
            "1mo",
            "3mo"
          ]
        },
        "includePrePost": {
          "type": "boolean"
        },
        "events": {
          "type": "string"
        },
        "lang": {
          "type": "string"
        },
        "return": {
          "type": "string",
          "const": "object"
        }
      },
      "required": [
        "period1",
        "return"
      ],
      "additionalProperties": false
    },
    "chart": {}
  }
};
const definitions$7 = getTypedDefinitions(chartSchema);
const queryOptionsDefaults$9 = {
  useYfid: true,
  interval: "1d",
  includePrePost: true,
  events: "div|split|earn",
  lang: "en-US",
  return: "array"
};
async function chart(symbol, queryOptionsOverrides, moduleOptions) {
  const returnAs = queryOptionsOverrides?.return || "array";
  const result = await this._moduleExec({
    moduleName: "chart",
    query: {
      assertSymbol: symbol,
      url: "https://${YF_QUERY_HOST}/v8/finance/chart/" + symbol,
      definitions: definitions$7,
      schemaKey: "#/definitions/ChartOptions",
      defaults: queryOptionsDefaults$9,
      overrides: queryOptionsOverrides,
      transformWith(queryOptions) {
        if (!queryOptions.period2)
          queryOptions.period2 = /* @__PURE__ */ new Date();
        const dates = ["period1", "period2"];
        for (const fieldName of dates) {
          const value = queryOptions[fieldName];
          if (value instanceof Date) {
            queryOptions[fieldName] = Math.floor(value.getTime() / 1e3);
          } else if (typeof value === "string") {
            const timestamp = new Date(value).getTime();
            if (isNaN(timestamp)) {
              throw new Error("yahooFinance.chart() option '" + fieldName + "' invalid date provided: '" + value + "'");
            }
            queryOptions[fieldName] = Math.floor(timestamp / 1e3);
          }
        }
        if (queryOptions.period1 === queryOptions.period2) {
          throw new Error("yahooFinance.chart() options `period1` and `period2` cannot share the same value.");
        }
        delete queryOptions.return;
        return queryOptions;
      }
    },
    result: {
      definitions: definitions$7,
      schemaKey: "#/definitions/ChartResultObject",
      // deno-lint-ignore no-explicit-any
      transformWith(result2) {
        if (!result2.chart) {
          throw new Error("Unexpected result: " + JSON.stringify(result2));
        }
        const chart2 = result2.chart.result[0];
        if (!chart2.timestamp) {
          if (chart2.indicators.quote.length !== 1) {
            throw new Error("No timestamp with quotes.length !== 1, please report with your query");
          }
          if (Object.keys(chart2.indicators.quote[0]).length !== 0) {
            throw new Error("No timestamp with unexpected quote, please report with your query" + JSON.stringify(chart2.indicators.quote[0]));
          }
          chart2.indicators.quote.pop();
        }
        return chart2;
      }
    },
    moduleOptions
  });
  if (returnAs === "object") {
    return result;
  } else if (returnAs === "array") {
    const timestamp = result.timestamp;
    if (timestamp && result?.indicators?.quote && result.indicators.quote[0].high.length !== timestamp.length) {
      console.log({
        origTimestampSize: result.timestamp && result.timestamp.length,
        filteredSize: timestamp.length,
        quoteSize: result.indicators.quote[0].high.length
      });
      throw new Error("Timestamp count mismatch, please report this with the query you used");
    }
    const result2 = {
      meta: result.meta,
      quotes: timestamp ? new Array(timestamp.length) : []
    };
    const adjclose = result?.indicators?.adjclose?.[0].adjclose;
    if (timestamp) {
      for (let i = 0; i < timestamp.length; i++) {
        result2.quotes[i] = {
          date: new Date(timestamp[i] * 1e3),
          high: result.indicators.quote[0].high[i],
          volume: result.indicators.quote[0].volume[i],
          open: result.indicators.quote[0].open[i],
          low: result.indicators.quote[0].low[i],
          close: result.indicators.quote[0].close[i]
        };
        if (adjclose)
          result2.quotes[i].adjclose = adjclose[i];
      }
    }
    if (result.events) {
      result2.events = {};
      for (const event of ["dividends", "splits"]) {
        if (result.events[event]) {
          result2.events[event] = Object.values(result.events[event]);
        }
      }
    }
    return result2;
  }
}
function dailyGainers() {
  throw new Error("dailyGainers module has been deprecated due to reliability issues. Use screener({ scrIds: 'day_gainers' }) instead. See https://github.com/gadicc/yahoo-finance2/blob/devel/docs/modules/screener.md for details.");
}
function dailyLosers() {
  throw new Error("dailyLosers module has been deprecated due to reliability issues. Use screener({ scrIds: 'day_losers' }) instead. See https://github.com/gadicc/yahoo-finance2/blob/devel/docs/modules/screener.md for details.");
}
const Timeseries_Keys = {
  "financials": [
    "TotalRevenue",
    "OperatingRevenue",
    "CostOfRevenue",
    "GrossProfit",
    "SellingGeneralAndAdministration",
    "SellingAndMarketingExpense",
    "GeneralAndAdministrativeExpense",
    "OtherGandA",
    "ResearchAndDevelopment",
    "DepreciationAmortizationDepletionIncomeStatement",
    "DepletionIncomeStatement",
    "DepreciationAndAmortizationInIncomeStatement",
    "Amortization",
    "AmortizationOfIntangiblesIncomeStatement",
    "DepreciationIncomeStatement",
    "OtherOperatingExpenses",
    "OperatingExpense",
    "OperatingIncome",
    "InterestExpenseNonOperating",
    "InterestIncomeNonOperating",
    "TotalOtherFinanceCost",
    "NetNonOperatingInterestIncomeExpense",
    "WriteOff",
    "SpecialIncomeCharges",
    "GainOnSaleOfPPE",
    "GainOnSaleOfBusiness",
    "GainOnSaleOfSecurity",
    "OtherSpecialCharges",
    "OtherIncomeExpense",
    "OtherNonOperatingIncomeExpenses",
    "TotalExpenses",
    "PretaxIncome",
    "TaxProvision",
    "NetIncomeContinuousOperations",
    "NetIncomeIncludingNoncontrollingInterests",
    "MinorityInterests",
    "NetIncomeFromTaxLossCarryforward",
    "NetIncomeExtraordinary",
    "NetIncomeDiscontinuousOperations",
    "PreferredStockDividends",
    "OtherunderPreferredStockDividend",
    "NetIncomeCommonStockholders",
    "NetIncome",
    "BasicAverageShares",
    "DilutedAverageShares",
    "DividendPerShare",
    "ReportedNormalizedBasicEPS",
    "ContinuingAndDiscontinuedBasicEPS",
    "BasicEPSOtherGainsLosses",
    "TaxLossCarryforwardBasicEPS",
    "NormalizedBasicEPS",
    "BasicEPS",
    "BasicAccountingChange",
    "BasicExtraordinary",
    "BasicDiscontinuousOperations",
    "BasicContinuousOperations",
    "ReportedNormalizedDilutedEPS",
    "ContinuingAndDiscontinuedDilutedEPS",
    "TaxLossCarryforwardDilutedEPS",
    "AverageDilutionEarnings",
    "NormalizedDilutedEPS",
    "DilutedEPS",
    "DilutedAccountingChange",
    "DilutedExtraordinary",
    "DilutedContinuousOperations",
    "DilutedDiscontinuousOperations",
    "DilutedNIAvailtoComStockholders",
    "DilutedEPSOtherGainsLosses",
    "TotalOperatingIncomeAsReported",
    "NetIncomeFromContinuingAndDiscontinuedOperation",
    "NormalizedIncome",
    "NetInterestIncome",
    "EBIT",
    "EBITDA",
    "ReconciledCostOfRevenue",
    "ReconciledDepreciation",
    "NetIncomeFromContinuingOperationNetMinorityInterest",
    "TotalUnusualItemsExcludingGoodwill",
    "TotalUnusualItems",
    "NormalizedEBITDA",
    "TaxRateForCalcs",
    "TaxEffectOfUnusualItems",
    "RentExpenseSupplemental",
    "EarningsFromEquityInterestNetOfTax",
    "ImpairmentOfCapitalAssets",
    "RestructuringAndMergernAcquisition",
    "SecuritiesAmortization",
    "EarningsFromEquityInterest",
    "OtherTaxes",
    "ProvisionForDoubtfulAccounts",
    "InsuranceAndClaims",
    "RentAndLandingFees",
    "SalariesAndWages",
    "ExciseTaxes",
    "InterestExpense",
    "InterestIncome",
    "TotalMoneyMarketInvestments",
    "InterestIncomeAfterProvisionForLoanLoss",
    "OtherThanPreferredStockDividend",
    "LossonExtinguishmentofDebt",
    "IncomefromAssociatesandOtherParticipatingInterests",
    "NonInterestExpense",
    "OtherNonInterestExpense",
    "ProfessionalExpenseAndContractServicesExpense",
    "OccupancyAndEquipment",
    "Equipment",
    "NetOccupancyExpense",
    "CreditLossesProvision",
    "NonInterestIncome",
    "OtherNonInterestIncome",
    "GainLossonSaleofAssets",
    "GainonSaleofInvestmentProperty",
    "GainonSaleofLoans",
    "ForeignExchangeTradingGains",
    "TradingGainLoss",
    "InvestmentBankingProfit",
    "DividendIncome",
    "FeesAndCommissions",
    "FeesandCommissionExpense",
    "FeesandCommissionIncome",
    "OtherCustomerServices",
    "CreditCard",
    "SecuritiesActivities",
    "TrustFeesbyCommissions",
    "ServiceChargeOnDepositorAccounts",
    "TotalPremiumsEarned",
    "OtherInterestExpense",
    "InterestExpenseForFederalFundsSoldAndSecuritiesPurchaseUnderAgreementsToResell",
    "InterestExpenseForLongTermDebtAndCapitalSecurities",
    "InterestExpenseForShortTermDebt",
    "InterestExpenseForDeposit",
    "OtherInterestIncome",
    "InterestIncomeFromFederalFundsSoldAndSecuritiesPurchaseUnderAgreementsToResell",
    "InterestIncomeFromDeposits",
    "InterestIncomeFromSecurities",
    "InterestIncomeFromLoansAndLease",
    "InterestIncomeFromLeases",
    "InterestIncomeFromLoans",
    "DepreciationDepreciationIncomeStatement",
    "OperationAndMaintenance",
    "OtherCostofRevenue",
    "ExplorationDevelopmentAndMineralPropertyLeaseExpenses"
  ],
  "balance-sheet": [
    "NetDebt",
    "TreasurySharesNumber",
    "PreferredSharesNumber",
    "OrdinarySharesNumber",
    "ShareIssued",
    "TotalDebt",
    "TangibleBookValue",
    "InvestedCapital",
    "WorkingCapital",
    "NetTangibleAssets",
    "CapitalLeaseObligations",
    "CommonStockEquity",
    "PreferredStockEquity",
    "TotalCapitalization",
    "TotalEquityGrossMinorityInterest",
    "MinorityInterest",
    "StockholdersEquity",
    "OtherEquityInterest",
    "GainsLossesNotAffectingRetainedEarnings",
    "OtherEquityAdjustments",
    "FixedAssetsRevaluationReserve",
    "ForeignCurrencyTranslationAdjustments",
    "MinimumPensionLiabilities",
    "UnrealizedGainLoss",
    "TreasuryStock",
    "RetainedEarnings",
    "AdditionalPaidInCapital",
    "CapitalStock",
    "OtherCapitalStock",
    "CommonStock",
    "PreferredStock",
    "TotalPartnershipCapital",
    "GeneralPartnershipCapital",
    "LimitedPartnershipCapital",
    "TotalLiabilitiesNetMinorityInterest",
    "TotalNonCurrentLiabilitiesNetMinorityInterest",
    "OtherNonCurrentLiabilities",
    "LiabilitiesHeldforSaleNonCurrent",
    "RestrictedCommonStock",
    "PreferredSecuritiesOutsideStockEquity",
    "DerivativeProductLiabilities",
    "EmployeeBenefits",
    "NonCurrentPensionAndOtherPostretirementBenefitPlans",
    "NonCurrentAccruedExpenses",
    "DuetoRelatedPartiesNonCurrent",
    "TradeandOtherPayablesNonCurrent",
    "NonCurrentDeferredLiabilities",
    "NonCurrentDeferredRevenue",
    "NonCurrentDeferredTaxesLiabilities",
    "LongTermDebtAndCapitalLeaseObligation",
    "LongTermCapitalLeaseObligation",
    "LongTermDebt",
    "LongTermProvisions",
    "CurrentLiabilities",
    "OtherCurrentLiabilities",
    "CurrentDeferredLiabilities",
    "CurrentDeferredRevenue",
    "CurrentDeferredTaxesLiabilities",
    "CurrentDebtAndCapitalLeaseObligation",
    "CurrentCapitalLeaseObligation",
    "CurrentDebt",
    "OtherCurrentBorrowings",
    "LineOfCredit",
    "CommercialPaper",
    "CurrentNotesPayable",
    "PensionandOtherPostRetirementBenefitPlansCurrent",
    "CurrentProvisions",
    "PayablesAndAccruedExpenses",
    "CurrentAccruedExpenses",
    "InterestPayable",
    "Payables",
    "OtherPayable",
    "DuetoRelatedPartiesCurrent",
    "DividendsPayable",
    "TotalTaxPayable",
    "IncomeTaxPayable",
    "AccountsPayable",
    "TotalAssets",
    "TotalNonCurrentAssets",
    "OtherNonCurrentAssets",
    "DefinedPensionBenefit",
    "NonCurrentPrepaidAssets",
    "NonCurrentDeferredAssets",
    "NonCurrentDeferredTaxesAssets",
    "DuefromRelatedPartiesNonCurrent",
    "NonCurrentNoteReceivables",
    "NonCurrentAccountsReceivable",
    "FinancialAssets",
    "InvestmentsAndAdvances",
    "OtherInvestments",
    "InvestmentinFinancialAssets",
    "HeldToMaturitySecurities",
    "AvailableForSaleSecurities",
    "FinancialAssetsDesignatedasFairValueThroughProfitorLossTotal",
    "TradingSecurities",
    "LongTermEquityInvestment",
    "InvestmentsinJointVenturesatCost",
    "InvestmentsInOtherVenturesUnderEquityMethod",
    "InvestmentsinAssociatesatCost",
    "InvestmentsinSubsidiariesatCost",
    "InvestmentProperties",
    "GoodwillAndOtherIntangibleAssets",
    "OtherIntangibleAssets",
    "Goodwill",
    "NetPPE",
    "AccumulatedDepreciation",
    "GrossPPE",
    "Leases",
    "ConstructionInProgress",
    "OtherProperties",
    "MachineryFurnitureEquipment",
    "BuildingsAndImprovements",
    "LandAndImprovements",
    "Properties",
    "CurrentAssets",
    "OtherCurrentAssets",
    "HedgingAssetsCurrent",
    "AssetsHeldForSaleCurrent",
    "CurrentDeferredAssets",
    "CurrentDeferredTaxesAssets",
    "RestrictedCash",
    "PrepaidAssets",
    "Inventory",
    "InventoriesAdjustmentsAllowances",
    "OtherInventories",
    "FinishedGoods",
    "WorkInProcess",
    "RawMaterials",
    "Receivables",
    "ReceivablesAdjustmentsAllowances",
    "OtherReceivables",
    "DuefromRelatedPartiesCurrent",
    "TaxesReceivable",
    "AccruedInterestReceivable",
    "NotesReceivable",
    "LoansReceivable",
    "AccountsReceivable",
    "AllowanceForDoubtfulAccountsReceivable",
    "GrossAccountsReceivable",
    "CashCashEquivalentsAndShortTermInvestments",
    "OtherShortTermInvestments",
    "CashAndCashEquivalents",
    "CashEquivalents",
    "CashFinancial",
    "OtherLiabilities",
    "LiabilitiesOfDiscontinuedOperations",
    "SubordinatedLiabilities",
    "AdvanceFromFederalHomeLoanBanks",
    "TradingLiabilities",
    "DuetoRelatedParties",
    "SecuritiesLoaned",
    "FederalFundsPurchasedAndSecuritiesSoldUnderAgreementToRepurchase",
    "FinancialInstrumentsSoldUnderAgreementsToRepurchase",
    "FederalFundsPurchased",
    "TotalDeposits",
    "NonInterestBearingDeposits",
    "InterestBearingDepositsLiabilities",
    "CustomerAccounts",
    "DepositsbyBank",
    "OtherAssets",
    "AssetsHeldForSale",
    "DeferredAssets",
    "DeferredTaxAssets",
    "DueFromRelatedParties",
    "AllowanceForNotesReceivable",
    "GrossNotesReceivable",
    "NetLoan",
    "UnearnedIncome",
    "AllowanceForLoansAndLeaseLosses",
    "GrossLoan",
    "OtherLoanAssets",
    "MortgageLoan",
    "ConsumerLoan",
    "CommercialLoan",
    "LoansHeldForSale",
    "DerivativeAssets",
    "SecuritiesAndInvestments",
    "BankOwnedLifeInsurance",
    "OtherRealEstateOwned",
    "ForeclosedAssets",
    "CustomerAcceptances",
    "FederalHomeLoanBankStock",
    "SecurityBorrowed",
    "CashCashEquivalentsAndFederalFundsSold",
    "MoneyMarketInvestments",
    "FederalFundsSoldAndSecuritiesPurchaseUnderAgreementsToResell",
    "SecurityAgreeToBeResell",
    "FederalFundsSold",
    "RestrictedCashAndInvestments",
    "RestrictedInvestments",
    "RestrictedCashAndCashEquivalents",
    "InterestBearingDepositsAssets",
    "CashAndDueFromBanks",
    "BankIndebtedness",
    "MineralProperties"
  ],
  "cash-flow": [
    "FreeCashFlow",
    "ForeignSales",
    "DomesticSales",
    "AdjustedGeographySegmentData",
    "RepurchaseOfCapitalStock",
    "RepaymentOfDebt",
    "IssuanceOfDebt",
    "IssuanceOfCapitalStock",
    "CapitalExpenditure",
    "InterestPaidSupplementalData",
    "IncomeTaxPaidSupplementalData",
    "EndCashPosition",
    "OtherCashAdjustmentOutsideChangeinCash",
    "BeginningCashPosition",
    "EffectOfExchangeRateChanges",
    "ChangesInCash",
    "OtherCashAdjustmentInsideChangeinCash",
    "CashFlowFromDiscontinuedOperation",
    "FinancingCashFlow",
    "CashFromDiscontinuedFinancingActivities",
    "CashFlowFromContinuingFinancingActivities",
    "NetOtherFinancingCharges",
    "InterestPaidCFF",
    "ProceedsFromStockOptionExercised",
    "CashDividendsPaid",
    "PreferredStockDividendPaid",
    "CommonStockDividendPaid",
    "NetPreferredStockIssuance",
    "PreferredStockPayments",
    "PreferredStockIssuance",
    "NetCommonStockIssuance",
    "CommonStockPayments",
    "CommonStockIssuance",
    "NetIssuancePaymentsOfDebt",
    "NetShortTermDebtIssuance",
    "ShortTermDebtPayments",
    "ShortTermDebtIssuance",
    "NetLongTermDebtIssuance",
    "LongTermDebtPayments",
    "LongTermDebtIssuance",
    "InvestingCashFlow",
    "CashFromDiscontinuedInvestingActivities",
    "CashFlowFromContinuingInvestingActivities",
    "NetOtherInvestingChanges",
    "InterestReceivedCFI",
    "DividendsReceivedCFI",
    "NetInvestmentPurchaseAndSale",
    "SaleOfInvestment",
    "PurchaseOfInvestment",
    "NetInvestmentPropertiesPurchaseAndSale",
    "SaleOfInvestmentProperties",
    "PurchaseOfInvestmentProperties",
    "NetBusinessPurchaseAndSale",
    "SaleOfBusiness",
    "PurchaseOfBusiness",
    "NetIntangiblesPurchaseAndSale",
    "SaleOfIntangibles",
    "PurchaseOfIntangibles",
    "NetPPEPurchaseAndSale",
    "SaleOfPPE",
    "PurchaseOfPPE",
    "CapitalExpenditureReported",
    "OperatingCashFlow",
    "CashFromDiscontinuedOperatingActivities",
    "CashFlowFromContinuingOperatingActivities",
    "TaxesRefundPaid",
    "InterestReceivedCFO",
    "InterestPaidCFO",
    "DividendReceivedCFO",
    "DividendPaidCFO",
    "ChangeInWorkingCapital",
    "ChangeInOtherWorkingCapital",
    "ChangeInOtherCurrentLiabilities",
    "ChangeInOtherCurrentAssets",
    "ChangeInPayablesAndAccruedExpense",
    "ChangeInAccruedExpense",
    "ChangeInInterestPayable",
    "ChangeInPayable",
    "ChangeInDividendPayable",
    "ChangeInAccountPayable",
    "ChangeInTaxPayable",
    "ChangeInIncomeTaxPayable",
    "ChangeInPrepaidAssets",
    "ChangeInInventory",
    "ChangeInReceivables",
    "ChangesInAccountReceivables",
    "OtherNonCashItems",
    "ExcessTaxBenefitFromStockBasedCompensation",
    "StockBasedCompensation",
    "UnrealizedGainLossOnInvestmentSecurities",
    "ProvisionandWriteOffofAssets",
    "AssetImpairmentCharge",
    "AmortizationOfSecurities",
    "DeferredTax",
    "DeferredIncomeTax",
    "Depletion",
    "DepreciationAndAmortization",
    "AmortizationCashFlow",
    "AmortizationOfIntangibles",
    "Depreciation",
    "OperatingGainsLosses",
    "PensionAndEmployeeBenefitExpense",
    "EarningsLossesFromEquityInvestments",
    "GainLossOnInvestmentSecurities",
    "NetForeignCurrencyExchangeGainLoss",
    "GainLossOnSaleOfPPE",
    "GainLossOnSaleOfBusiness",
    "NetIncomeFromContinuingOperations",
    "CashFlowsfromusedinOperatingActivitiesDirect",
    "TaxesRefundPaidDirect",
    "InterestReceivedDirect",
    "InterestPaidDirect",
    "DividendsReceivedDirect",
    "DividendsPaidDirect",
    "ClassesofCashPayments",
    "OtherCashPaymentsfromOperatingActivities",
    "PaymentsonBehalfofEmployees",
    "PaymentstoSuppliersforGoodsandServices",
    "ClassesofCashReceiptsfromOperatingActivities",
    "OtherCashReceiptsfromOperatingActivities",
    "ReceiptsfromGovernmentGrants",
    "ReceiptsfromCustomers",
    "IncreaseDecreaseInDeposit",
    "ChangeInFederalFundsAndSecuritiesSoldForRepurchase",
    "NetProceedsPaymentForLoan",
    "PaymentForLoans",
    "ProceedsFromLoans",
    "ProceedsPaymentInInterestBearingDepositsInBank",
    "IncreaseinInterestBearingDepositsinBank",
    "DecreaseinInterestBearingDepositsinBank",
    "ProceedsPaymentFederalFundsSoldAndSecuritiesPurchasedUnderAgreementToResell",
    "ChangeInLoans",
    "ChangeInDeferredCharges",
    "ProvisionForLoanLeaseAndOtherLosses",
    "AmortizationOfFinancingCostsAndDiscounts",
    "DepreciationAmortizationDepletion",
    "RealizedGainLossOnSaleOfLoansAndLease",
    "AllTaxesPaid",
    "InterestandCommissionPaid",
    "CashPaymentsforLoans",
    "CashPaymentsforDepositsbyBanksandCustomers",
    "CashReceiptsfromFeesandCommissions",
    "CashReceiptsfromSecuritiesRelatedActivities",
    "CashReceiptsfromLoans",
    "CashReceiptsfromDepositsbyBanksandCustomers",
    "CashReceiptsfromTaxRefunds",
    "AmortizationAmortizationCashFlow"
  ]
};
const schema$6 = {
  "definitions": {
    "FundamentalsTimeSeries_Period": {
      "type": "string",
      "enum": [
        "3M",
        "12M"
      ]
    },
    "FundamentalsTimeSeriesFinancialsResult": {
      "type": "object",
      "properties": {
        "date": {
          "type": "string",
          "format": "date-time"
        },
        "TYPE": {
          "type": "string",
          "const": "FINANCIALS"
        },
        "periodType": {
          "$ref": "#/definitions/FundamentalsTimeSeries_Period"
        },
        "totalRevenue": {
          "type": "number"
        },
        "operatingRevenue": {
          "type": "number"
        },
        "costOfRevenue": {
          "type": "number"
        },
        "grossProfit": {
          "type": "number"
        },
        "sellingGeneralAndAdministration": {
          "type": "number"
        },
        "sellingAndMarketingExpense": {
          "type": "number"
        },
        "generalAndAdministrativeExpense": {
          "type": "number"
        },
        "otherGandA": {
          "type": "number"
        },
        "researchAndDevelopment": {
          "type": "number"
        },
        "depreciationAmortizationDepletionIncomeStatement": {
          "type": "number"
        },
        "depletionIncomeStatement": {
          "type": "number"
        },
        "depreciationAndAmortizationInIncomeStatement": {
          "type": "number"
        },
        "amortization": {
          "type": "number"
        },
        "amortizationOfIntangiblesIncomeStatement": {
          "type": "number"
        },
        "depreciationIncomeStatement": {
          "type": "number"
        },
        "otherOperatingExpenses": {
          "type": "number"
        },
        "operatingExpense": {
          "type": "number"
        },
        "operatingIncome": {
          "type": "number"
        },
        "interestExpenseNonOperating": {
          "type": "number"
        },
        "interestIncomeNonOperating": {
          "type": "number"
        },
        "totalOtherFinanceCost": {
          "type": "number"
        },
        "netNonOperatingInterestIncomeExpense": {
          "type": "number"
        },
        "writeOff": {
          "type": "number"
        },
        "specialIncomeCharges": {
          "type": "number"
        },
        "gainOnSaleOfPPE": {
          "type": "number"
        },
        "gainOnSaleOfBusiness": {
          "type": "number"
        },
        "gainOnSaleOfSecurity": {
          "type": "number"
        },
        "otherSpecialCharges": {
          "type": "number"
        },
        "otherIncomeExpense": {
          "type": "number"
        },
        "otherNonOperatingIncomeExpenses": {
          "type": "number"
        },
        "totalExpenses": {
          "type": "number"
        },
        "pretaxIncome": {
          "type": "number"
        },
        "taxProvision": {
          "type": "number"
        },
        "netIncomeContinuousOperations": {
          "type": "number"
        },
        "netIncomeIncludingNoncontrollingInterests": {
          "type": "number"
        },
        "minorityInterests": {
          "type": "number"
        },
        "netIncomeFromTaxLossCarryforward": {
          "type": "number"
        },
        "netIncomeExtraordinary": {
          "type": "number"
        },
        "netIncomeDiscontinuousOperations": {
          "type": "number"
        },
        "preferredStockDividends": {
          "type": "number"
        },
        "otherunderPreferredStockDividend": {
          "type": "number"
        },
        "netIncomeCommonStockholders": {
          "type": "number"
        },
        "netIncome": {
          "type": "number"
        },
        "basicAverageShares": {
          "type": "number"
        },
        "dilutedAverageShares": {
          "type": "number"
        },
        "dividendPerShare": {
          "type": "number"
        },
        "reportedNormalizedBasicEPS": {
          "type": "number"
        },
        "continuingAndDiscontinuedBasicEPS": {
          "type": "number"
        },
        "basicEPSOtherGainsLosses": {
          "type": "number"
        },
        "taxLossCarryforwardBasicEPS": {
          "type": "number"
        },
        "normalizedBasicEPS": {
          "type": "number"
        },
        "basicEPS": {
          "type": "number"
        },
        "basicAccountingChange": {
          "type": "number"
        },
        "basicExtraordinary": {
          "type": "number"
        },
        "basicDiscontinuousOperations": {
          "type": "number"
        },
        "basicContinuousOperations": {
          "type": "number"
        },
        "reportedNormalizedDilutedEPS": {
          "type": "number"
        },
        "continuingAndDiscontinuedDilutedEPS": {
          "type": "number"
        },
        "taxLossCarryforwardDilutedEPS": {
          "type": "number"
        },
        "averageDilutionEarnings": {
          "type": "number"
        },
        "normalizedDilutedEPS": {
          "type": "number"
        },
        "dilutedEPS": {
          "type": "number"
        },
        "dilutedAccountingChange": {
          "type": "number"
        },
        "dilutedExtraordinary": {
          "type": "number"
        },
        "dilutedContinuousOperations": {
          "type": "number"
        },
        "dilutedDiscontinuousOperations": {
          "type": "number"
        },
        "dilutedNIAvailtoComStockholders": {
          "type": "number"
        },
        "dilutedEPSOtherGainsLosses": {
          "type": "number"
        },
        "totalOperatingIncomeAsReported": {
          "type": "number"
        },
        "netIncomeFromContinuingAndDiscontinuedOperation": {
          "type": "number"
        },
        "normalizedIncome": {
          "type": "number"
        },
        "netInterestIncome": {
          "type": "number"
        },
        "EBIT": {
          "type": "number"
        },
        "EBITDA": {
          "type": "number"
        },
        "reconciledCostOfRevenue": {
          "type": "number"
        },
        "reconciledDepreciation": {
          "type": "number"
        },
        "netIncomeFromContinuingOperationNetMinorityInterest": {
          "type": "number"
        },
        "totalUnusualItemsExcludingGoodwill": {
          "type": "number"
        },
        "totalUnusualItems": {
          "type": "number"
        },
        "normalizedEBITDA": {
          "type": "number"
        },
        "taxRateForCalcs": {
          "type": "number"
        },
        "taxEffectOfUnusualItems": {
          "type": "number"
        },
        "rentExpenseSupplemental": {
          "type": "number"
        },
        "earningsFromEquityInterestNetOfTax": {
          "type": "number"
        },
        "impairmentOfCapitalAssets": {
          "type": "number"
        },
        "restructuringAndMergernAcquisition": {
          "type": "number"
        },
        "securitiesAmortization": {
          "type": "number"
        },
        "earningsFromEquityInterest": {
          "type": "number"
        },
        "otherTaxes": {
          "type": "number"
        },
        "provisionForDoubtfulAccounts": {
          "type": "number"
        },
        "insuranceAndClaims": {
          "type": "number"
        },
        "rentAndLandingFees": {
          "type": "number"
        },
        "salariesAndWages": {
          "type": "number"
        },
        "exciseTaxes": {
          "type": "number"
        },
        "interestExpense": {
          "type": "number"
        },
        "interestIncome": {
          "type": "number"
        },
        "totalMoneyMarketInvestments": {
          "type": "number"
        },
        "interestIncomeAfterProvisionForLoanLoss": {
          "type": "number"
        },
        "otherThanPreferredStockDividend": {
          "type": "number"
        },
        "lossonExtinguishmentofDebt": {
          "type": "number"
        },
        "incomefromAssociatesandOtherParticipatingInterests": {
          "type": "number"
        },
        "nonInterestExpense": {
          "type": "number"
        },
        "otherNonInterestExpense": {
          "type": "number"
        },
        "professionalExpenseAndContractServicesExpense": {
          "type": "number"
        },
        "occupancyAndEquipment": {
          "type": "number"
        },
        "equipment": {
          "type": "number"
        },
        "netOccupancyExpense": {
          "type": "number"
        },
        "creditLossesProvision": {
          "type": "number"
        },
        "nonInterestIncome": {
          "type": "number"
        },
        "otherNonInterestIncome": {
          "type": "number"
        },
        "gainLossonSaleofAssets": {
          "type": "number"
        },
        "gainonSaleofInvestmentProperty": {
          "type": "number"
        },
        "gainonSaleofLoans": {
          "type": "number"
        },
        "foreignExchangeTradingGains": {
          "type": "number"
        },
        "tradingGainLoss": {
          "type": "number"
        },
        "investmentBankingProfit": {
          "type": "number"
        },
        "dividendIncome": {
          "type": "number"
        },
        "feesAndCommissions": {
          "type": "number"
        },
        "feesandCommissionExpense": {
          "type": "number"
        },
        "feesandCommissionIncome": {
          "type": "number"
        },
        "otherCustomerServices": {
          "type": "number"
        },
        "creditCard": {
          "type": "number"
        },
        "securitiesActivities": {
          "type": "number"
        },
        "trustFeesbyCommissions": {
          "type": "number"
        },
        "serviceChargeOnDepositorAccounts": {
          "type": "number"
        },
        "totalPremiumsEarned": {
          "type": "number"
        },
        "otherInterestExpense": {
          "type": "number"
        },
        "interestExpenseForFederalFundsSoldAndSecuritiesPurchaseUnderAgreementsToResell": {
          "type": "number"
        },
        "interestExpenseForLongTermDebtAndCapitalSecurities": {
          "type": "number"
        },
        "interestExpenseForShortTermDebt": {
          "type": "number"
        },
        "interestExpenseForDeposit": {
          "type": "number"
        },
        "otherInterestIncome": {
          "type": "number"
        },
        "interestIncomeFromFederalFundsSoldAndSecuritiesPurchaseUnderAgreementsToResell": {
          "type": "number"
        },
        "interestIncomeFromDeposits": {
          "type": "number"
        },
        "interestIncomeFromSecurities": {
          "type": "number"
        },
        "interestIncomeFromLoansAndLease": {
          "type": "number"
        },
        "interestIncomeFromLeases": {
          "type": "number"
        },
        "interestIncomeFromLoans": {
          "type": "number"
        },
        "depreciationDepreciationIncomeStatement": {
          "type": "number"
        },
        "operationAndMaintenance": {
          "type": "number"
        },
        "otherCostofRevenue": {
          "type": "number"
        },
        "explorationDevelopmentAndMineralPropertyLeaseExpenses": {
          "type": "number"
        }
      },
      "required": [
        "date",
        "TYPE",
        "periodType"
      ],
      "additionalProperties": false
    },
    "FundamentalsTimeSeriesBalanceSheetResult": {
      "type": "object",
      "properties": {
        "date": {
          "type": "string",
          "format": "date-time"
        },
        "TYPE": {
          "type": "string",
          "const": "BALANCE_SHEET"
        },
        "periodType": {
          "$ref": "#/definitions/FundamentalsTimeSeries_Period"
        },
        "netDebt": {
          "type": "number"
        },
        "treasurySharesNumber": {
          "type": "number"
        },
        "preferredSharesNumber": {
          "type": "number"
        },
        "ordinarySharesNumber": {
          "type": "number"
        },
        "shareIssued": {
          "type": "number"
        },
        "totalDebt": {
          "type": "number"
        },
        "tangibleBookValue": {
          "type": "number"
        },
        "investedCapital": {
          "type": "number"
        },
        "workingCapital": {
          "type": "number"
        },
        "netTangibleAssets": {
          "type": "number"
        },
        "capitalLeaseObligations": {
          "type": "number"
        },
        "commonStockEquity": {
          "type": "number"
        },
        "preferredStockEquity": {
          "type": "number"
        },
        "totalCapitalization": {
          "type": "number"
        },
        "totalEquityGrossMinorityInterest": {
          "type": "number"
        },
        "minorityInterest": {
          "type": "number"
        },
        "stockholdersEquity": {
          "type": "number"
        },
        "otherEquityInterest": {
          "type": "number"
        },
        "gainsLossesNotAffectingRetainedEarnings": {
          "type": "number"
        },
        "otherEquityAdjustments": {
          "type": "number"
        },
        "fixedAssetsRevaluationReserve": {
          "type": "number"
        },
        "foreignCurrencyTranslationAdjustments": {
          "type": "number"
        },
        "minimumPensionLiabilities": {
          "type": "number"
        },
        "unrealizedGainLoss": {
          "type": "number"
        },
        "treasuryStock": {
          "type": "number"
        },
        "retainedEarnings": {
          "type": "number"
        },
        "additionalPaidInCapital": {
          "type": "number"
        },
        "capitalStock": {
          "type": "number"
        },
        "otherCapitalStock": {
          "type": "number"
        },
        "commonStock": {
          "type": "number"
        },
        "preferredStock": {
          "type": "number"
        },
        "totalPartnershipCapital": {
          "type": "number"
        },
        "generalPartnershipCapital": {
          "type": "number"
        },
        "limitedPartnershipCapital": {
          "type": "number"
        },
        "totalLiabilitiesNetMinorityInterest": {
          "type": "number"
        },
        "totalNonCurrentLiabilitiesNetMinorityInterest": {
          "type": "number"
        },
        "otherNonCurrentLiabilities": {
          "type": "number"
        },
        "liabilitiesHeldforSaleNonCurrent": {
          "type": "number"
        },
        "restrictedCommonStock": {
          "type": "number"
        },
        "preferredSecuritiesOutsideStockEquity": {
          "type": "number"
        },
        "derivativeProductLiabilities": {
          "type": "number"
        },
        "employeeBenefits": {
          "type": "number"
        },
        "nonCurrentPensionAndOtherPostretirementBenefitPlans": {
          "type": "number"
        },
        "nonCurrentAccruedExpenses": {
          "type": "number"
        },
        "duetoRelatedPartiesNonCurrent": {
          "type": "number"
        },
        "tradeandOtherPayablesNonCurrent": {
          "type": "number"
        },
        "nonCurrentDeferredLiabilities": {
          "type": "number"
        },
        "nonCurrentDeferredRevenue": {
          "type": "number"
        },
        "nonCurrentDeferredTaxesLiabilities": {
          "type": "number"
        },
        "longTermDebtAndCapitalLeaseObligation": {
          "type": "number"
        },
        "longTermCapitalLeaseObligation": {
          "type": "number"
        },
        "longTermDebt": {
          "type": "number"
        },
        "longTermProvisions": {
          "type": "number"
        },
        "currentLiabilities": {
          "type": "number"
        },
        "otherCurrentLiabilities": {
          "type": "number"
        },
        "currentDeferredLiabilities": {
          "type": "number"
        },
        "currentDeferredRevenue": {
          "type": "number"
        },
        "currentDeferredTaxesLiabilities": {
          "type": "number"
        },
        "currentDebtAndCapitalLeaseObligation": {
          "type": "number"
        },
        "currentCapitalLeaseObligation": {
          "type": "number"
        },
        "currentDebt": {
          "type": "number"
        },
        "otherCurrentBorrowings": {
          "type": "number"
        },
        "lineOfCredit": {
          "type": "number"
        },
        "commercialPaper": {
          "type": "number"
        },
        "currentNotesPayable": {
          "type": "number"
        },
        "pensionandOtherPostRetirementBenefitPlansCurrent": {
          "type": "number"
        },
        "currentProvisions": {
          "type": "number"
        },
        "payablesAndAccruedExpenses": {
          "type": "number"
        },
        "currentAccruedExpenses": {
          "type": "number"
        },
        "interestPayable": {
          "type": "number"
        },
        "payables": {
          "type": "number"
        },
        "otherPayable": {
          "type": "number"
        },
        "duetoRelatedPartiesCurrent": {
          "type": "number"
        },
        "dividendsPayable": {
          "type": "number"
        },
        "totalTaxPayable": {
          "type": "number"
        },
        "incomeTaxPayable": {
          "type": "number"
        },
        "accountsPayable": {
          "type": "number"
        },
        "totalAssets": {
          "type": "number"
        },
        "totalNonCurrentAssets": {
          "type": "number"
        },
        "otherNonCurrentAssets": {
          "type": "number"
        },
        "definedPensionBenefit": {
          "type": "number"
        },
        "nonCurrentPrepaidAssets": {
          "type": "number"
        },
        "nonCurrentDeferredAssets": {
          "type": "number"
        },
        "nonCurrentDeferredTaxesAssets": {
          "type": "number"
        },
        "duefromRelatedPartiesNonCurrent": {
          "type": "number"
        },
        "nonCurrentNoteReceivables": {
          "type": "number"
        },
        "nonCurrentAccountsReceivable": {
          "type": "number"
        },
        "financialAssets": {
          "type": "number"
        },
        "investmentsAndAdvances": {
          "type": "number"
        },
        "otherInvestments": {
          "type": "number"
        },
        "investmentinFinancialAssets": {
          "type": "number"
        },
        "heldToMaturitySecurities": {
          "type": "number"
        },
        "availableForSaleSecurities": {
          "type": "number"
        },
        "financialAssetsDesignatedasFairValueThroughProfitorLossTotal": {
          "type": "number"
        },
        "tradingSecurities": {
          "type": "number"
        },
        "longTermEquityInvestment": {
          "type": "number"
        },
        "investmentsinJointVenturesatCost": {
          "type": "number"
        },
        "investmentsInOtherVenturesUnderEquityMethod": {
          "type": "number"
        },
        "investmentsinAssociatesatCost": {
          "type": "number"
        },
        "investmentsinSubsidiariesatCost": {
          "type": "number"
        },
        "investmentProperties": {
          "type": "number"
        },
        "goodwillAndOtherIntangibleAssets": {
          "type": "number"
        },
        "otherIntangibleAssets": {
          "type": "number"
        },
        "goodwill": {
          "type": "number"
        },
        "netPPE": {
          "type": "number"
        },
        "accumulatedDepreciation": {
          "type": "number"
        },
        "grossPPE": {
          "type": "number"
        },
        "leases": {
          "type": "number"
        },
        "constructionInProgress": {
          "type": "number"
        },
        "otherProperties": {
          "type": "number"
        },
        "machineryFurnitureEquipment": {
          "type": "number"
        },
        "buildingsAndImprovements": {
          "type": "number"
        },
        "landAndImprovements": {
          "type": "number"
        },
        "properties": {
          "type": "number"
        },
        "currentAssets": {
          "type": "number"
        },
        "otherCurrentAssets": {
          "type": "number"
        },
        "hedgingAssetsCurrent": {
          "type": "number"
        },
        "assetsHeldForSaleCurrent": {
          "type": "number"
        },
        "currentDeferredAssets": {
          "type": "number"
        },
        "currentDeferredTaxesAssets": {
          "type": "number"
        },
        "restrictedCash": {
          "type": "number"
        },
        "prepaidAssets": {
          "type": "number"
        },
        "inventory": {
          "type": "number"
        },
        "inventoriesAdjustmentsAllowances": {
          "type": "number"
        },
        "otherInventories": {
          "type": "number"
        },
        "finishedGoods": {
          "type": "number"
        },
        "workInProcess": {
          "type": "number"
        },
        "rawMaterials": {
          "type": "number"
        },
        "receivables": {
          "type": "number"
        },
        "receivablesAdjustmentsAllowances": {
          "type": "number"
        },
        "otherReceivables": {
          "type": "number"
        },
        "duefromRelatedPartiesCurrent": {
          "type": "number"
        },
        "taxesReceivable": {
          "type": "number"
        },
        "accruedInterestReceivable": {
          "type": "number"
        },
        "notesReceivable": {
          "type": "number"
        },
        "loansReceivable": {
          "type": "number"
        },
        "accountsReceivable": {
          "type": "number"
        },
        "allowanceForDoubtfulAccountsReceivable": {
          "type": "number"
        },
        "grossAccountsReceivable": {
          "type": "number"
        },
        "cashCashEquivalentsAndShortTermInvestments": {
          "type": "number"
        },
        "otherShortTermInvestments": {
          "type": "number"
        },
        "cashAndCashEquivalents": {
          "type": "number"
        },
        "cashEquivalents": {
          "type": "number"
        },
        "cashFinancial": {
          "type": "number"
        },
        "otherLiabilities": {
          "type": "number"
        },
        "liabilitiesOfDiscontinuedOperations": {
          "type": "number"
        },
        "subordinatedLiabilities": {
          "type": "number"
        },
        "advanceFromFederalHomeLoanBanks": {
          "type": "number"
        },
        "tradingLiabilities": {
          "type": "number"
        },
        "duetoRelatedParties": {
          "type": "number"
        },
        "securitiesLoaned": {
          "type": "number"
        },
        "federalFundsPurchasedAndSecuritiesSoldUnderAgreementToRepurchase": {
          "type": "number"
        },
        "financialInstrumentsSoldUnderAgreementsToRepurchase": {
          "type": "number"
        },
        "federalFundsPurchased": {
          "type": "number"
        },
        "totalDeposits": {
          "type": "number"
        },
        "nonInterestBearingDeposits": {
          "type": "number"
        },
        "interestBearingDepositsLiabilities": {
          "type": "number"
        },
        "customerAccounts": {
          "type": "number"
        },
        "depositsbyBank": {
          "type": "number"
        },
        "otherAssets": {
          "type": "number"
        },
        "assetsHeldForSale": {
          "type": "number"
        },
        "deferredAssets": {
          "type": "number"
        },
        "deferredTaxAssets": {
          "type": "number"
        },
        "dueFromRelatedParties": {
          "type": "number"
        },
        "allowanceForNotesReceivable": {
          "type": "number"
        },
        "grossNotesReceivable": {
          "type": "number"
        },
        "netLoan": {
          "type": "number"
        },
        "unearnedIncome": {
          "type": "number"
        },
        "allowanceForLoansAndLeaseLosses": {
          "type": "number"
        },
        "grossLoan": {
          "type": "number"
        },
        "otherLoanAssets": {
          "type": "number"
        },
        "mortgageLoan": {
          "type": "number"
        },
        "consumerLoan": {
          "type": "number"
        },
        "commercialLoan": {
          "type": "number"
        },
        "loansHeldForSale": {
          "type": "number"
        },
        "derivativeAssets": {
          "type": "number"
        },
        "securitiesAndInvestments": {
          "type": "number"
        },
        "bankOwnedLifeInsurance": {
          "type": "number"
        },
        "otherRealEstateOwned": {
          "type": "number"
        },
        "foreclosedAssets": {
          "type": "number"
        },
        "customerAcceptances": {
          "type": "number"
        },
        "federalHomeLoanBankStock": {
          "type": "number"
        },
        "securityBorrowed": {
          "type": "number"
        },
        "cashCashEquivalentsAndFederalFundsSold": {
          "type": "number"
        },
        "moneyMarketInvestments": {
          "type": "number"
        },
        "federalFundsSoldAndSecuritiesPurchaseUnderAgreementsToResell": {
          "type": "number"
        },
        "securityAgreeToBeResell": {
          "type": "number"
        },
        "federalFundsSold": {
          "type": "number"
        },
        "restrictedCashAndInvestments": {
          "type": "number"
        },
        "restrictedInvestments": {
          "type": "number"
        },
        "restrictedCashAndCashEquivalents": {
          "type": "number"
        },
        "interestBearingDepositsAssets": {
          "type": "number"
        },
        "cashAndDueFromBanks": {
          "type": "number"
        },
        "bankIndebtedness": {
          "type": "number"
        },
        "mineralProperties": {
          "type": "number"
        },
        "netPPEPurchaseAndSale": {
          "type": "number"
        },
        "purchaseOfInvestment": {
          "type": "number"
        },
        "investingCashFlow": {
          "type": "number"
        },
        "grossProfit": {
          "type": "number"
        },
        "cashFlowFromContinuingOperatingActivities": {
          "type": "number"
        },
        "endCashPosition": {
          "type": "number"
        },
        "netIncomeCommonStockholders": {
          "type": "number"
        },
        "changeInAccountPayable": {
          "type": "number"
        },
        "otherNonCashItems": {
          "type": "number"
        },
        "cashDividendsPaid": {
          "type": "number"
        },
        "dilutedAverageShares": {
          "type": "number"
        },
        "repurchaseOfCapitalStock": {
          "type": "number"
        },
        "EBITDA": {
          "type": "number"
        },
        "stockBasedCompensation": {
          "type": "number"
        },
        "commonStockDividendPaid": {
          "type": "number"
        },
        "changeInPayable": {
          "type": "number"
        },
        "costOfRevenue": {
          "type": "number"
        },
        "operatingExpense": {
          "type": "number"
        },
        "changeInInventory": {
          "type": "number"
        },
        "normalizedIncome": {
          "type": "number"
        },
        "netIncomeIncludingNoncontrollingInterests": {
          "type": "number"
        },
        "netIncomeFromContinuingOperationNetMinorityInterest": {
          "type": "number"
        },
        "reconciledCostOfRevenue": {
          "type": "number"
        },
        "otherIncomeExpense": {
          "type": "number"
        },
        "netInvestmentPurchaseAndSale": {
          "type": "number"
        },
        "purchaseOfPPE": {
          "type": "number"
        },
        "taxProvision": {
          "type": "number"
        },
        "pretaxIncome": {
          "type": "number"
        },
        "researchAndDevelopment": {
          "type": "number"
        },
        "longTermDebtPayments": {
          "type": "number"
        },
        "changeInReceivables": {
          "type": "number"
        },
        "dilutedEPS": {
          "type": "number"
        },
        "netIssuancePaymentsOfDebt": {
          "type": "number"
        },
        "netShortTermDebtIssuance": {
          "type": "number"
        },
        "depreciationAndAmortization": {
          "type": "number"
        },
        "cashFlowFromContinuingInvestingActivities": {
          "type": "number"
        },
        "beginningCashPosition": {
          "type": "number"
        },
        "changesInCash": {
          "type": "number"
        },
        "financingCashFlow": {
          "type": "number"
        },
        "changeInOtherCurrentLiabilities": {
          "type": "number"
        },
        "changeInWorkingCapital": {
          "type": "number"
        },
        "operatingIncome": {
          "type": "number"
        },
        "totalRevenue": {
          "type": "number"
        },
        "netIncomeFromContinuingAndDiscontinuedOperation": {
          "type": "number"
        },
        "operatingRevenue": {
          "type": "number"
        },
        "changeInPayablesAndAccruedExpense": {
          "type": "number"
        },
        "netCommonStockIssuance": {
          "type": "number"
        },
        "commonStockPayments": {
          "type": "number"
        },
        "EBIT": {
          "type": "number"
        },
        "netOtherInvestingChanges": {
          "type": "number"
        },
        "basicEPS": {
          "type": "number"
        },
        "shortTermDebtPayments": {
          "type": "number"
        },
        "sellingGeneralAndAdministration": {
          "type": "number"
        },
        "netIncomeContinuousOperations": {
          "type": "number"
        },
        "repaymentOfDebt": {
          "type": "number"
        },
        "totalOperatingIncomeAsReported": {
          "type": "number"
        },
        "normalizedEBITDA": {
          "type": "number"
        },
        "capitalExpenditure": {
          "type": "number"
        },
        "cashFlowFromContinuingFinancingActivities": {
          "type": "number"
        },
        "netIncome": {
          "type": "number"
        },
        "netOtherFinancingCharges": {
          "type": "number"
        },
        "basicAverageShares": {
          "type": "number"
        },
        "netLongTermDebtIssuance": {
          "type": "number"
        },
        "depreciationAmortizationDepletion": {
          "type": "number"
        },
        "operatingCashFlow": {
          "type": "number"
        },
        "dilutedNIAvailtoComStockholders": {
          "type": "number"
        },
        "netIncomeFromContinuingOperations": {
          "type": "number"
        },
        "taxRateForCalcs": {
          "type": "number"
        },
        "freeCashFlow": {
          "type": "number"
        },
        "otherNonOperatingIncomeExpenses": {
          "type": "number"
        },
        "changesInAccountReceivables": {
          "type": "number"
        },
        "totalExpenses": {
          "type": "number"
        },
        "changeInOtherCurrentAssets": {
          "type": "number"
        },
        "reconciledDepreciation": {
          "type": "number"
        },
        "incomeTaxPaidSupplementalData": {
          "type": "number"
        },
        "saleOfInvestment": {
          "type": "number"
        },
        "interestPaidSupplementalData": {
          "type": "number"
        },
        "deferredTax": {
          "type": "number"
        },
        "changeInOtherWorkingCapital": {
          "type": "number"
        },
        "interestIncomeNonOperating": {
          "type": "number"
        },
        "issuanceOfDebt": {
          "type": "number"
        },
        "purchaseOfBusiness": {
          "type": "number"
        },
        "longTermDebtIssuance": {
          "type": "number"
        },
        "interestIncome": {
          "type": "number"
        },
        "netInterestIncome": {
          "type": "number"
        },
        "deferredIncomeTax": {
          "type": "number"
        },
        "interestExpense": {
          "type": "number"
        },
        "netNonOperatingInterestIncomeExpense": {
          "type": "number"
        },
        "interestExpenseNonOperating": {
          "type": "number"
        },
        "netBusinessPurchaseAndSale": {
          "type": "number"
        }
      },
      "required": [
        "date",
        "TYPE",
        "periodType"
      ],
      "additionalProperties": false
    },
    "FundamentalsTimeSeriesCashFlowResult": {
      "type": "object",
      "properties": {
        "date": {
          "type": "string",
          "format": "date-time"
        },
        "TYPE": {
          "type": "string",
          "const": "CASH_FLOW"
        },
        "periodType": {
          "$ref": "#/definitions/FundamentalsTimeSeries_Period"
        },
        "freeCashFlow": {
          "type": "number"
        },
        "foreignSales": {
          "type": "number"
        },
        "domesticSales": {
          "type": "number"
        },
        "adjustedGeographySegmentData": {
          "type": "number"
        },
        "repurchaseOfCapitalStock": {
          "type": "number"
        },
        "repaymentOfDebt": {
          "type": "number"
        },
        "issuanceOfDebt": {
          "type": "number"
        },
        "issuanceOfCapitalStock": {
          "type": "number"
        },
        "capitalExpenditure": {
          "type": "number"
        },
        "interestPaidSupplementalData": {
          "type": "number"
        },
        "incomeTaxPaidSupplementalData": {
          "type": "number"
        },
        "endCashPosition": {
          "type": "number"
        },
        "otherCashAdjustmentOutsideChangeinCash": {
          "type": "number"
        },
        "beginningCashPosition": {
          "type": "number"
        },
        "effectOfExchangeRateChanges": {
          "type": "number"
        },
        "changesInCash": {
          "type": "number"
        },
        "otherCashAdjustmentInsideChangeinCash": {
          "type": "number"
        },
        "cashFlowFromDiscontinuedOperation": {
          "type": "number"
        },
        "financingCashFlow": {
          "type": "number"
        },
        "cashFromDiscontinuedFinancingActivities": {
          "type": "number"
        },
        "cashFlowFromContinuingFinancingActivities": {
          "type": "number"
        },
        "netOtherFinancingCharges": {
          "type": "number"
        },
        "interestPaidCFF": {
          "type": "number"
        },
        "proceedsFromStockOptionExercised": {
          "type": "number"
        },
        "cashDividendsPaid": {
          "type": "number"
        },
        "preferredStockDividendPaid": {
          "type": "number"
        },
        "commonStockDividendPaid": {
          "type": "number"
        },
        "netPreferredStockIssuance": {
          "type": "number"
        },
        "preferredStockPayments": {
          "type": "number"
        },
        "preferredStockIssuance": {
          "type": "number"
        },
        "netCommonStockIssuance": {
          "type": "number"
        },
        "commonStockPayments": {
          "type": "number"
        },
        "commonStockIssuance": {
          "type": "number"
        },
        "netIssuancePaymentsOfDebt": {
          "type": "number"
        },
        "netShortTermDebtIssuance": {
          "type": "number"
        },
        "shortTermDebtPayments": {
          "type": "number"
        },
        "shortTermDebtIssuance": {
          "type": "number"
        },
        "netLongTermDebtIssuance": {
          "type": "number"
        },
        "longTermDebtPayments": {
          "type": "number"
        },
        "longTermDebtIssuance": {
          "type": "number"
        },
        "investingCashFlow": {
          "type": "number"
        },
        "cashFromDiscontinuedInvestingActivities": {
          "type": "number"
        },
        "cashFlowFromContinuingInvestingActivities": {
          "type": "number"
        },
        "netOtherInvestingChanges": {
          "type": "number"
        },
        "interestReceivedCFI": {
          "type": "number"
        },
        "dividendsReceivedCFI": {
          "type": "number"
        },
        "netInvestmentPurchaseAndSale": {
          "type": "number"
        },
        "saleOfInvestment": {
          "type": "number"
        },
        "purchaseOfInvestment": {
          "type": "number"
        },
        "netInvestmentPropertiesPurchaseAndSale": {
          "type": "number"
        },
        "saleOfInvestmentProperties": {
          "type": "number"
        },
        "purchaseOfInvestmentProperties": {
          "type": "number"
        },
        "netBusinessPurchaseAndSale": {
          "type": "number"
        },
        "saleOfBusiness": {
          "type": "number"
        },
        "purchaseOfBusiness": {
          "type": "number"
        },
        "netIntangiblesPurchaseAndSale": {
          "type": "number"
        },
        "saleOfIntangibles": {
          "type": "number"
        },
        "purchaseOfIntangibles": {
          "type": "number"
        },
        "netPPEPurchaseAndSale": {
          "type": "number"
        },
        "saleOfPPE": {
          "type": "number"
        },
        "purchaseOfPPE": {
          "type": "number"
        },
        "capitalExpenditureReported": {
          "type": "number"
        },
        "operatingCashFlow": {
          "type": "number"
        },
        "cashFromDiscontinuedOperatingActivities": {
          "type": "number"
        },
        "cashFlowFromContinuingOperatingActivities": {
          "type": "number"
        },
        "taxesRefundPaid": {
          "type": "number"
        },
        "interestReceivedCFO": {
          "type": "number"
        },
        "interestPaidCFO": {
          "type": "number"
        },
        "dividendReceivedCFO": {
          "type": "number"
        },
        "dividendPaidCFO": {
          "type": "number"
        },
        "changeInWorkingCapital": {
          "type": "number"
        },
        "changeInOtherWorkingCapital": {
          "type": "number"
        },
        "changeInOtherCurrentLiabilities": {
          "type": "number"
        },
        "changeInOtherCurrentAssets": {
          "type": "number"
        },
        "changeInPayablesAndAccruedExpense": {
          "type": "number"
        },
        "changeInAccruedExpense": {
          "type": "number"
        },
        "changeInInterestPayable": {
          "type": "number"
        },
        "changeInPayable": {
          "type": "number"
        },
        "changeInDividendPayable": {
          "type": "number"
        },
        "changeInAccountPayable": {
          "type": "number"
        },
        "changeInTaxPayable": {
          "type": "number"
        },
        "changeInIncomeTaxPayable": {
          "type": "number"
        },
        "changeInPrepaidAssets": {
          "type": "number"
        },
        "changeInInventory": {
          "type": "number"
        },
        "changeInReceivables": {
          "type": "number"
        },
        "changesInAccountReceivables": {
          "type": "number"
        },
        "otherNonCashItems": {
          "type": "number"
        },
        "excessTaxBenefitFromStockBasedCompensation": {
          "type": "number"
        },
        "stockBasedCompensation": {
          "type": "number"
        },
        "unrealizedGainLossOnInvestmentSecurities": {
          "type": "number"
        },
        "provisionandWriteOffofAssets": {
          "type": "number"
        },
        "assetImpairmentCharge": {
          "type": "number"
        },
        "amortizationOfSecurities": {
          "type": "number"
        },
        "deferredTax": {
          "type": "number"
        },
        "deferredIncomeTax": {
          "type": "number"
        },
        "depletion": {
          "type": "number"
        },
        "depreciationAndAmortization": {
          "type": "number"
        },
        "amortizationCashFlow": {
          "type": "number"
        },
        "amortizationOfIntangibles": {
          "type": "number"
        },
        "depreciation": {
          "type": "number"
        },
        "operatingGainsLosses": {
          "type": "number"
        },
        "pensionAndEmployeeBenefitExpense": {
          "type": "number"
        },
        "earningsLossesFromEquityInvestments": {
          "type": "number"
        },
        "gainLossOnInvestmentSecurities": {
          "type": "number"
        },
        "netForeignCurrencyExchangeGainLoss": {
          "type": "number"
        },
        "gainLossOnSaleOfPPE": {
          "type": "number"
        },
        "gainLossOnSaleOfBusiness": {
          "type": "number"
        },
        "netIncomeFromContinuingOperations": {
          "type": "number"
        },
        "cashFlowsfromusedinOperatingActivitiesDirect": {
          "type": "number"
        },
        "taxesRefundPaidDirect": {
          "type": "number"
        },
        "interestReceivedDirect": {
          "type": "number"
        },
        "interestPaidDirect": {
          "type": "number"
        },
        "dividendsReceivedDirect": {
          "type": "number"
        },
        "dividendsPaidDirect": {
          "type": "number"
        },
        "classesofCashPayments": {
          "type": "number"
        },
        "otherCashPaymentsfromOperatingActivities": {
          "type": "number"
        },
        "paymentsonBehalfofEmployees": {
          "type": "number"
        },
        "paymentstoSuppliersforGoodsandServices": {
          "type": "number"
        },
        "classesofCashReceiptsfromOperatingActivities": {
          "type": "number"
        },
        "otherCashReceiptsfromOperatingActivities": {
          "type": "number"
        },
        "receiptsfromGovernmentGrants": {
          "type": "number"
        },
        "receiptsfromCustomers": {
          "type": "number"
        },
        "increaseDecreaseInDeposit": {
          "type": "number"
        },
        "changeInFederalFundsAndSecuritiesSoldForRepurchase": {
          "type": "number"
        },
        "netProceedsPaymentForLoan": {
          "type": "number"
        },
        "paymentForLoans": {
          "type": "number"
        },
        "proceedsFromLoans": {
          "type": "number"
        },
        "proceedsPaymentInInterestBearingDepositsInBank": {
          "type": "number"
        },
        "increaseinInterestBearingDepositsinBank": {
          "type": "number"
        },
        "decreaseinInterestBearingDepositsinBank": {
          "type": "number"
        },
        "proceedsPaymentFederalFundsSoldAndSecuritiesPurchasedUnderAgreementToResell": {
          "type": "number"
        },
        "changeInLoans": {
          "type": "number"
        },
        "changeInDeferredCharges": {
          "type": "number"
        },
        "provisionForLoanLeaseAndOtherLosses": {
          "type": "number"
        },
        "amortizationOfFinancingCostsAndDiscounts": {
          "type": "number"
        },
        "depreciationAmortizationDepletion": {
          "type": "number"
        },
        "realizedGainLossOnSaleOfLoansAndLease": {
          "type": "number"
        },
        "allTaxesPaid": {
          "type": "number"
        },
        "interestandCommissionPaid": {
          "type": "number"
        },
        "cashPaymentsforLoans": {
          "type": "number"
        },
        "cashPaymentsforDepositsbyBanksandCustomers": {
          "type": "number"
        },
        "cashReceiptsfromFeesandCommissions": {
          "type": "number"
        },
        "cashReceiptsfromSecuritiesRelatedActivities": {
          "type": "number"
        },
        "cashReceiptsfromLoans": {
          "type": "number"
        },
        "cashReceiptsfromDepositsbyBanksandCustomers": {
          "type": "number"
        },
        "cashReceiptsfromTaxRefunds": {
          "type": "number"
        },
        "AmortizationAmortizationCashFlow": {
          "type": "number"
        }
      },
      "required": [
        "date",
        "TYPE",
        "periodType"
      ],
      "additionalProperties": false
    },
    "FundamentalsTimeSeriesAllResult": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "TYPE": {
          "type": "string",
          "const": "ALL"
        },
        "date": {
          "type": "string",
          "format": "date-time"
        },
        "periodType": {
          "$ref": "#/definitions/FundamentalsTimeSeries_Period"
        },
        "freeCashFlow": {
          "type": "number"
        },
        "foreignSales": {
          "type": "number"
        },
        "domesticSales": {
          "type": "number"
        },
        "adjustedGeographySegmentData": {
          "type": "number"
        },
        "repurchaseOfCapitalStock": {
          "type": "number"
        },
        "repaymentOfDebt": {
          "type": "number"
        },
        "issuanceOfDebt": {
          "type": "number"
        },
        "issuanceOfCapitalStock": {
          "type": "number"
        },
        "capitalExpenditure": {
          "type": "number"
        },
        "interestPaidSupplementalData": {
          "type": "number"
        },
        "incomeTaxPaidSupplementalData": {
          "type": "number"
        },
        "endCashPosition": {
          "type": "number"
        },
        "otherCashAdjustmentOutsideChangeinCash": {
          "type": "number"
        },
        "beginningCashPosition": {
          "type": "number"
        },
        "effectOfExchangeRateChanges": {
          "type": "number"
        },
        "changesInCash": {
          "type": "number"
        },
        "otherCashAdjustmentInsideChangeinCash": {
          "type": "number"
        },
        "cashFlowFromDiscontinuedOperation": {
          "type": "number"
        },
        "financingCashFlow": {
          "type": "number"
        },
        "cashFromDiscontinuedFinancingActivities": {
          "type": "number"
        },
        "cashFlowFromContinuingFinancingActivities": {
          "type": "number"
        },
        "netOtherFinancingCharges": {
          "type": "number"
        },
        "interestPaidCFF": {
          "type": "number"
        },
        "proceedsFromStockOptionExercised": {
          "type": "number"
        },
        "cashDividendsPaid": {
          "type": "number"
        },
        "preferredStockDividendPaid": {
          "type": "number"
        },
        "commonStockDividendPaid": {
          "type": "number"
        },
        "netPreferredStockIssuance": {
          "type": "number"
        },
        "preferredStockPayments": {
          "type": "number"
        },
        "preferredStockIssuance": {
          "type": "number"
        },
        "netCommonStockIssuance": {
          "type": "number"
        },
        "commonStockPayments": {
          "type": "number"
        },
        "commonStockIssuance": {
          "type": "number"
        },
        "netIssuancePaymentsOfDebt": {
          "type": "number"
        },
        "netShortTermDebtIssuance": {
          "type": "number"
        },
        "shortTermDebtPayments": {
          "type": "number"
        },
        "shortTermDebtIssuance": {
          "type": "number"
        },
        "netLongTermDebtIssuance": {
          "type": "number"
        },
        "longTermDebtPayments": {
          "type": "number"
        },
        "longTermDebtIssuance": {
          "type": "number"
        },
        "investingCashFlow": {
          "type": "number"
        },
        "cashFromDiscontinuedInvestingActivities": {
          "type": "number"
        },
        "cashFlowFromContinuingInvestingActivities": {
          "type": "number"
        },
        "netOtherInvestingChanges": {
          "type": "number"
        },
        "interestReceivedCFI": {
          "type": "number"
        },
        "dividendsReceivedCFI": {
          "type": "number"
        },
        "netInvestmentPurchaseAndSale": {
          "type": "number"
        },
        "saleOfInvestment": {
          "type": "number"
        },
        "purchaseOfInvestment": {
          "type": "number"
        },
        "netInvestmentPropertiesPurchaseAndSale": {
          "type": "number"
        },
        "saleOfInvestmentProperties": {
          "type": "number"
        },
        "purchaseOfInvestmentProperties": {
          "type": "number"
        },
        "netBusinessPurchaseAndSale": {
          "type": "number"
        },
        "saleOfBusiness": {
          "type": "number"
        },
        "purchaseOfBusiness": {
          "type": "number"
        },
        "netIntangiblesPurchaseAndSale": {
          "type": "number"
        },
        "saleOfIntangibles": {
          "type": "number"
        },
        "purchaseOfIntangibles": {
          "type": "number"
        },
        "netPPEPurchaseAndSale": {
          "type": "number"
        },
        "saleOfPPE": {
          "type": "number"
        },
        "purchaseOfPPE": {
          "type": "number"
        },
        "capitalExpenditureReported": {
          "type": "number"
        },
        "operatingCashFlow": {
          "type": "number"
        },
        "cashFromDiscontinuedOperatingActivities": {
          "type": "number"
        },
        "cashFlowFromContinuingOperatingActivities": {
          "type": "number"
        },
        "taxesRefundPaid": {
          "type": "number"
        },
        "interestReceivedCFO": {
          "type": "number"
        },
        "interestPaidCFO": {
          "type": "number"
        },
        "dividendReceivedCFO": {
          "type": "number"
        },
        "dividendPaidCFO": {
          "type": "number"
        },
        "changeInWorkingCapital": {
          "type": "number"
        },
        "changeInOtherWorkingCapital": {
          "type": "number"
        },
        "changeInOtherCurrentLiabilities": {
          "type": "number"
        },
        "changeInOtherCurrentAssets": {
          "type": "number"
        },
        "changeInPayablesAndAccruedExpense": {
          "type": "number"
        },
        "changeInAccruedExpense": {
          "type": "number"
        },
        "changeInInterestPayable": {
          "type": "number"
        },
        "changeInPayable": {
          "type": "number"
        },
        "changeInDividendPayable": {
          "type": "number"
        },
        "changeInAccountPayable": {
          "type": "number"
        },
        "changeInTaxPayable": {
          "type": "number"
        },
        "changeInIncomeTaxPayable": {
          "type": "number"
        },
        "changeInPrepaidAssets": {
          "type": "number"
        },
        "changeInInventory": {
          "type": "number"
        },
        "changeInReceivables": {
          "type": "number"
        },
        "changesInAccountReceivables": {
          "type": "number"
        },
        "otherNonCashItems": {
          "type": "number"
        },
        "excessTaxBenefitFromStockBasedCompensation": {
          "type": "number"
        },
        "stockBasedCompensation": {
          "type": "number"
        },
        "unrealizedGainLossOnInvestmentSecurities": {
          "type": "number"
        },
        "provisionandWriteOffofAssets": {
          "type": "number"
        },
        "assetImpairmentCharge": {
          "type": "number"
        },
        "amortizationOfSecurities": {
          "type": "number"
        },
        "deferredTax": {
          "type": "number"
        },
        "deferredIncomeTax": {
          "type": "number"
        },
        "depletion": {
          "type": "number"
        },
        "depreciationAndAmortization": {
          "type": "number"
        },
        "amortizationCashFlow": {
          "type": "number"
        },
        "amortizationOfIntangibles": {
          "type": "number"
        },
        "depreciation": {
          "type": "number"
        },
        "operatingGainsLosses": {
          "type": "number"
        },
        "pensionAndEmployeeBenefitExpense": {
          "type": "number"
        },
        "earningsLossesFromEquityInvestments": {
          "type": "number"
        },
        "gainLossOnInvestmentSecurities": {
          "type": "number"
        },
        "netForeignCurrencyExchangeGainLoss": {
          "type": "number"
        },
        "gainLossOnSaleOfPPE": {
          "type": "number"
        },
        "gainLossOnSaleOfBusiness": {
          "type": "number"
        },
        "netIncomeFromContinuingOperations": {
          "type": "number"
        },
        "cashFlowsfromusedinOperatingActivitiesDirect": {
          "type": "number"
        },
        "taxesRefundPaidDirect": {
          "type": "number"
        },
        "interestReceivedDirect": {
          "type": "number"
        },
        "interestPaidDirect": {
          "type": "number"
        },
        "dividendsReceivedDirect": {
          "type": "number"
        },
        "dividendsPaidDirect": {
          "type": "number"
        },
        "classesofCashPayments": {
          "type": "number"
        },
        "otherCashPaymentsfromOperatingActivities": {
          "type": "number"
        },
        "paymentsonBehalfofEmployees": {
          "type": "number"
        },
        "paymentstoSuppliersforGoodsandServices": {
          "type": "number"
        },
        "classesofCashReceiptsfromOperatingActivities": {
          "type": "number"
        },
        "otherCashReceiptsfromOperatingActivities": {
          "type": "number"
        },
        "receiptsfromGovernmentGrants": {
          "type": "number"
        },
        "receiptsfromCustomers": {
          "type": "number"
        },
        "increaseDecreaseInDeposit": {
          "type": "number"
        },
        "changeInFederalFundsAndSecuritiesSoldForRepurchase": {
          "type": "number"
        },
        "netProceedsPaymentForLoan": {
          "type": "number"
        },
        "paymentForLoans": {
          "type": "number"
        },
        "proceedsFromLoans": {
          "type": "number"
        },
        "proceedsPaymentInInterestBearingDepositsInBank": {
          "type": "number"
        },
        "increaseinInterestBearingDepositsinBank": {
          "type": "number"
        },
        "decreaseinInterestBearingDepositsinBank": {
          "type": "number"
        },
        "proceedsPaymentFederalFundsSoldAndSecuritiesPurchasedUnderAgreementToResell": {
          "type": "number"
        },
        "changeInLoans": {
          "type": "number"
        },
        "changeInDeferredCharges": {
          "type": "number"
        },
        "provisionForLoanLeaseAndOtherLosses": {
          "type": "number"
        },
        "amortizationOfFinancingCostsAndDiscounts": {
          "type": "number"
        },
        "depreciationAmortizationDepletion": {
          "type": "number"
        },
        "realizedGainLossOnSaleOfLoansAndLease": {
          "type": "number"
        },
        "allTaxesPaid": {
          "type": "number"
        },
        "interestandCommissionPaid": {
          "type": "number"
        },
        "cashPaymentsforLoans": {
          "type": "number"
        },
        "cashPaymentsforDepositsbyBanksandCustomers": {
          "type": "number"
        },
        "cashReceiptsfromFeesandCommissions": {
          "type": "number"
        },
        "cashReceiptsfromSecuritiesRelatedActivities": {
          "type": "number"
        },
        "cashReceiptsfromLoans": {
          "type": "number"
        },
        "cashReceiptsfromDepositsbyBanksandCustomers": {
          "type": "number"
        },
        "cashReceiptsfromTaxRefunds": {
          "type": "number"
        },
        "AmortizationAmortizationCashFlow": {
          "type": "number"
        },
        "netDebt": {
          "type": "number"
        },
        "treasurySharesNumber": {
          "type": "number"
        },
        "preferredSharesNumber": {
          "type": "number"
        },
        "ordinarySharesNumber": {
          "type": "number"
        },
        "shareIssued": {
          "type": "number"
        },
        "totalDebt": {
          "type": "number"
        },
        "tangibleBookValue": {
          "type": "number"
        },
        "investedCapital": {
          "type": "number"
        },
        "workingCapital": {
          "type": "number"
        },
        "netTangibleAssets": {
          "type": "number"
        },
        "capitalLeaseObligations": {
          "type": "number"
        },
        "commonStockEquity": {
          "type": "number"
        },
        "preferredStockEquity": {
          "type": "number"
        },
        "totalCapitalization": {
          "type": "number"
        },
        "totalEquityGrossMinorityInterest": {
          "type": "number"
        },
        "minorityInterest": {
          "type": "number"
        },
        "stockholdersEquity": {
          "type": "number"
        },
        "otherEquityInterest": {
          "type": "number"
        },
        "gainsLossesNotAffectingRetainedEarnings": {
          "type": "number"
        },
        "otherEquityAdjustments": {
          "type": "number"
        },
        "fixedAssetsRevaluationReserve": {
          "type": "number"
        },
        "foreignCurrencyTranslationAdjustments": {
          "type": "number"
        },
        "minimumPensionLiabilities": {
          "type": "number"
        },
        "unrealizedGainLoss": {
          "type": "number"
        },
        "treasuryStock": {
          "type": "number"
        },
        "retainedEarnings": {
          "type": "number"
        },
        "additionalPaidInCapital": {
          "type": "number"
        },
        "capitalStock": {
          "type": "number"
        },
        "otherCapitalStock": {
          "type": "number"
        },
        "commonStock": {
          "type": "number"
        },
        "preferredStock": {
          "type": "number"
        },
        "totalPartnershipCapital": {
          "type": "number"
        },
        "generalPartnershipCapital": {
          "type": "number"
        },
        "limitedPartnershipCapital": {
          "type": "number"
        },
        "totalLiabilitiesNetMinorityInterest": {
          "type": "number"
        },
        "totalNonCurrentLiabilitiesNetMinorityInterest": {
          "type": "number"
        },
        "otherNonCurrentLiabilities": {
          "type": "number"
        },
        "liabilitiesHeldforSaleNonCurrent": {
          "type": "number"
        },
        "restrictedCommonStock": {
          "type": "number"
        },
        "preferredSecuritiesOutsideStockEquity": {
          "type": "number"
        },
        "derivativeProductLiabilities": {
          "type": "number"
        },
        "employeeBenefits": {
          "type": "number"
        },
        "nonCurrentPensionAndOtherPostretirementBenefitPlans": {
          "type": "number"
        },
        "nonCurrentAccruedExpenses": {
          "type": "number"
        },
        "duetoRelatedPartiesNonCurrent": {
          "type": "number"
        },
        "tradeandOtherPayablesNonCurrent": {
          "type": "number"
        },
        "nonCurrentDeferredLiabilities": {
          "type": "number"
        },
        "nonCurrentDeferredRevenue": {
          "type": "number"
        },
        "nonCurrentDeferredTaxesLiabilities": {
          "type": "number"
        },
        "longTermDebtAndCapitalLeaseObligation": {
          "type": "number"
        },
        "longTermCapitalLeaseObligation": {
          "type": "number"
        },
        "longTermDebt": {
          "type": "number"
        },
        "longTermProvisions": {
          "type": "number"
        },
        "currentLiabilities": {
          "type": "number"
        },
        "otherCurrentLiabilities": {
          "type": "number"
        },
        "currentDeferredLiabilities": {
          "type": "number"
        },
        "currentDeferredRevenue": {
          "type": "number"
        },
        "currentDeferredTaxesLiabilities": {
          "type": "number"
        },
        "currentDebtAndCapitalLeaseObligation": {
          "type": "number"
        },
        "currentCapitalLeaseObligation": {
          "type": "number"
        },
        "currentDebt": {
          "type": "number"
        },
        "otherCurrentBorrowings": {
          "type": "number"
        },
        "lineOfCredit": {
          "type": "number"
        },
        "commercialPaper": {
          "type": "number"
        },
        "currentNotesPayable": {
          "type": "number"
        },
        "pensionandOtherPostRetirementBenefitPlansCurrent": {
          "type": "number"
        },
        "currentProvisions": {
          "type": "number"
        },
        "payablesAndAccruedExpenses": {
          "type": "number"
        },
        "currentAccruedExpenses": {
          "type": "number"
        },
        "interestPayable": {
          "type": "number"
        },
        "payables": {
          "type": "number"
        },
        "otherPayable": {
          "type": "number"
        },
        "duetoRelatedPartiesCurrent": {
          "type": "number"
        },
        "dividendsPayable": {
          "type": "number"
        },
        "totalTaxPayable": {
          "type": "number"
        },
        "incomeTaxPayable": {
          "type": "number"
        },
        "accountsPayable": {
          "type": "number"
        },
        "totalAssets": {
          "type": "number"
        },
        "totalNonCurrentAssets": {
          "type": "number"
        },
        "otherNonCurrentAssets": {
          "type": "number"
        },
        "definedPensionBenefit": {
          "type": "number"
        },
        "nonCurrentPrepaidAssets": {
          "type": "number"
        },
        "nonCurrentDeferredAssets": {
          "type": "number"
        },
        "nonCurrentDeferredTaxesAssets": {
          "type": "number"
        },
        "duefromRelatedPartiesNonCurrent": {
          "type": "number"
        },
        "nonCurrentNoteReceivables": {
          "type": "number"
        },
        "nonCurrentAccountsReceivable": {
          "type": "number"
        },
        "financialAssets": {
          "type": "number"
        },
        "investmentsAndAdvances": {
          "type": "number"
        },
        "otherInvestments": {
          "type": "number"
        },
        "investmentinFinancialAssets": {
          "type": "number"
        },
        "heldToMaturitySecurities": {
          "type": "number"
        },
        "availableForSaleSecurities": {
          "type": "number"
        },
        "financialAssetsDesignatedasFairValueThroughProfitorLossTotal": {
          "type": "number"
        },
        "tradingSecurities": {
          "type": "number"
        },
        "longTermEquityInvestment": {
          "type": "number"
        },
        "investmentsinJointVenturesatCost": {
          "type": "number"
        },
        "investmentsInOtherVenturesUnderEquityMethod": {
          "type": "number"
        },
        "investmentsinAssociatesatCost": {
          "type": "number"
        },
        "investmentsinSubsidiariesatCost": {
          "type": "number"
        },
        "investmentProperties": {
          "type": "number"
        },
        "goodwillAndOtherIntangibleAssets": {
          "type": "number"
        },
        "otherIntangibleAssets": {
          "type": "number"
        },
        "goodwill": {
          "type": "number"
        },
        "netPPE": {
          "type": "number"
        },
        "accumulatedDepreciation": {
          "type": "number"
        },
        "grossPPE": {
          "type": "number"
        },
        "leases": {
          "type": "number"
        },
        "constructionInProgress": {
          "type": "number"
        },
        "otherProperties": {
          "type": "number"
        },
        "machineryFurnitureEquipment": {
          "type": "number"
        },
        "buildingsAndImprovements": {
          "type": "number"
        },
        "landAndImprovements": {
          "type": "number"
        },
        "properties": {
          "type": "number"
        },
        "currentAssets": {
          "type": "number"
        },
        "otherCurrentAssets": {
          "type": "number"
        },
        "hedgingAssetsCurrent": {
          "type": "number"
        },
        "assetsHeldForSaleCurrent": {
          "type": "number"
        },
        "currentDeferredAssets": {
          "type": "number"
        },
        "currentDeferredTaxesAssets": {
          "type": "number"
        },
        "restrictedCash": {
          "type": "number"
        },
        "prepaidAssets": {
          "type": "number"
        },
        "inventory": {
          "type": "number"
        },
        "inventoriesAdjustmentsAllowances": {
          "type": "number"
        },
        "otherInventories": {
          "type": "number"
        },
        "finishedGoods": {
          "type": "number"
        },
        "workInProcess": {
          "type": "number"
        },
        "rawMaterials": {
          "type": "number"
        },
        "receivables": {
          "type": "number"
        },
        "receivablesAdjustmentsAllowances": {
          "type": "number"
        },
        "otherReceivables": {
          "type": "number"
        },
        "duefromRelatedPartiesCurrent": {
          "type": "number"
        },
        "taxesReceivable": {
          "type": "number"
        },
        "accruedInterestReceivable": {
          "type": "number"
        },
        "notesReceivable": {
          "type": "number"
        },
        "loansReceivable": {
          "type": "number"
        },
        "accountsReceivable": {
          "type": "number"
        },
        "allowanceForDoubtfulAccountsReceivable": {
          "type": "number"
        },
        "grossAccountsReceivable": {
          "type": "number"
        },
        "cashCashEquivalentsAndShortTermInvestments": {
          "type": "number"
        },
        "otherShortTermInvestments": {
          "type": "number"
        },
        "cashAndCashEquivalents": {
          "type": "number"
        },
        "cashEquivalents": {
          "type": "number"
        },
        "cashFinancial": {
          "type": "number"
        },
        "otherLiabilities": {
          "type": "number"
        },
        "liabilitiesOfDiscontinuedOperations": {
          "type": "number"
        },
        "subordinatedLiabilities": {
          "type": "number"
        },
        "advanceFromFederalHomeLoanBanks": {
          "type": "number"
        },
        "tradingLiabilities": {
          "type": "number"
        },
        "duetoRelatedParties": {
          "type": "number"
        },
        "securitiesLoaned": {
          "type": "number"
        },
        "federalFundsPurchasedAndSecuritiesSoldUnderAgreementToRepurchase": {
          "type": "number"
        },
        "financialInstrumentsSoldUnderAgreementsToRepurchase": {
          "type": "number"
        },
        "federalFundsPurchased": {
          "type": "number"
        },
        "totalDeposits": {
          "type": "number"
        },
        "nonInterestBearingDeposits": {
          "type": "number"
        },
        "interestBearingDepositsLiabilities": {
          "type": "number"
        },
        "customerAccounts": {
          "type": "number"
        },
        "depositsbyBank": {
          "type": "number"
        },
        "otherAssets": {
          "type": "number"
        },
        "assetsHeldForSale": {
          "type": "number"
        },
        "deferredAssets": {
          "type": "number"
        },
        "deferredTaxAssets": {
          "type": "number"
        },
        "dueFromRelatedParties": {
          "type": "number"
        },
        "allowanceForNotesReceivable": {
          "type": "number"
        },
        "grossNotesReceivable": {
          "type": "number"
        },
        "netLoan": {
          "type": "number"
        },
        "unearnedIncome": {
          "type": "number"
        },
        "allowanceForLoansAndLeaseLosses": {
          "type": "number"
        },
        "grossLoan": {
          "type": "number"
        },
        "otherLoanAssets": {
          "type": "number"
        },
        "mortgageLoan": {
          "type": "number"
        },
        "consumerLoan": {
          "type": "number"
        },
        "commercialLoan": {
          "type": "number"
        },
        "loansHeldForSale": {
          "type": "number"
        },
        "derivativeAssets": {
          "type": "number"
        },
        "securitiesAndInvestments": {
          "type": "number"
        },
        "bankOwnedLifeInsurance": {
          "type": "number"
        },
        "otherRealEstateOwned": {
          "type": "number"
        },
        "foreclosedAssets": {
          "type": "number"
        },
        "customerAcceptances": {
          "type": "number"
        },
        "federalHomeLoanBankStock": {
          "type": "number"
        },
        "securityBorrowed": {
          "type": "number"
        },
        "cashCashEquivalentsAndFederalFundsSold": {
          "type": "number"
        },
        "moneyMarketInvestments": {
          "type": "number"
        },
        "federalFundsSoldAndSecuritiesPurchaseUnderAgreementsToResell": {
          "type": "number"
        },
        "securityAgreeToBeResell": {
          "type": "number"
        },
        "federalFundsSold": {
          "type": "number"
        },
        "restrictedCashAndInvestments": {
          "type": "number"
        },
        "restrictedInvestments": {
          "type": "number"
        },
        "restrictedCashAndCashEquivalents": {
          "type": "number"
        },
        "interestBearingDepositsAssets": {
          "type": "number"
        },
        "cashAndDueFromBanks": {
          "type": "number"
        },
        "bankIndebtedness": {
          "type": "number"
        },
        "mineralProperties": {
          "type": "number"
        },
        "grossProfit": {
          "type": "number"
        },
        "netIncomeCommonStockholders": {
          "type": "number"
        },
        "dilutedAverageShares": {
          "type": "number"
        },
        "EBITDA": {
          "type": "number"
        },
        "costOfRevenue": {
          "type": "number"
        },
        "operatingExpense": {
          "type": "number"
        },
        "normalizedIncome": {
          "type": "number"
        },
        "netIncomeIncludingNoncontrollingInterests": {
          "type": "number"
        },
        "netIncomeFromContinuingOperationNetMinorityInterest": {
          "type": "number"
        },
        "reconciledCostOfRevenue": {
          "type": "number"
        },
        "otherIncomeExpense": {
          "type": "number"
        },
        "taxProvision": {
          "type": "number"
        },
        "pretaxIncome": {
          "type": "number"
        },
        "researchAndDevelopment": {
          "type": "number"
        },
        "dilutedEPS": {
          "type": "number"
        },
        "operatingIncome": {
          "type": "number"
        },
        "totalRevenue": {
          "type": "number"
        },
        "netIncomeFromContinuingAndDiscontinuedOperation": {
          "type": "number"
        },
        "operatingRevenue": {
          "type": "number"
        },
        "EBIT": {
          "type": "number"
        },
        "basicEPS": {
          "type": "number"
        },
        "sellingGeneralAndAdministration": {
          "type": "number"
        },
        "netIncomeContinuousOperations": {
          "type": "number"
        },
        "totalOperatingIncomeAsReported": {
          "type": "number"
        },
        "normalizedEBITDA": {
          "type": "number"
        },
        "netIncome": {
          "type": "number"
        },
        "basicAverageShares": {
          "type": "number"
        },
        "dilutedNIAvailtoComStockholders": {
          "type": "number"
        },
        "taxRateForCalcs": {
          "type": "number"
        },
        "otherNonOperatingIncomeExpenses": {
          "type": "number"
        },
        "totalExpenses": {
          "type": "number"
        },
        "reconciledDepreciation": {
          "type": "number"
        },
        "interestIncomeNonOperating": {
          "type": "number"
        },
        "interestIncome": {
          "type": "number"
        },
        "netInterestIncome": {
          "type": "number"
        },
        "interestExpense": {
          "type": "number"
        },
        "netNonOperatingInterestIncomeExpense": {
          "type": "number"
        },
        "interestExpenseNonOperating": {
          "type": "number"
        },
        "sellingAndMarketingExpense": {
          "type": "number"
        },
        "generalAndAdministrativeExpense": {
          "type": "number"
        },
        "otherGandA": {
          "type": "number"
        },
        "depreciationAmortizationDepletionIncomeStatement": {
          "type": "number"
        },
        "depletionIncomeStatement": {
          "type": "number"
        },
        "depreciationAndAmortizationInIncomeStatement": {
          "type": "number"
        },
        "amortization": {
          "type": "number"
        },
        "amortizationOfIntangiblesIncomeStatement": {
          "type": "number"
        },
        "depreciationIncomeStatement": {
          "type": "number"
        },
        "otherOperatingExpenses": {
          "type": "number"
        },
        "totalOtherFinanceCost": {
          "type": "number"
        },
        "writeOff": {
          "type": "number"
        },
        "specialIncomeCharges": {
          "type": "number"
        },
        "gainOnSaleOfPPE": {
          "type": "number"
        },
        "gainOnSaleOfBusiness": {
          "type": "number"
        },
        "gainOnSaleOfSecurity": {
          "type": "number"
        },
        "otherSpecialCharges": {
          "type": "number"
        },
        "minorityInterests": {
          "type": "number"
        },
        "netIncomeFromTaxLossCarryforward": {
          "type": "number"
        },
        "netIncomeExtraordinary": {
          "type": "number"
        },
        "netIncomeDiscontinuousOperations": {
          "type": "number"
        },
        "preferredStockDividends": {
          "type": "number"
        },
        "otherunderPreferredStockDividend": {
          "type": "number"
        },
        "dividendPerShare": {
          "type": "number"
        },
        "reportedNormalizedBasicEPS": {
          "type": "number"
        },
        "continuingAndDiscontinuedBasicEPS": {
          "type": "number"
        },
        "basicEPSOtherGainsLosses": {
          "type": "number"
        },
        "taxLossCarryforwardBasicEPS": {
          "type": "number"
        },
        "normalizedBasicEPS": {
          "type": "number"
        },
        "basicAccountingChange": {
          "type": "number"
        },
        "basicExtraordinary": {
          "type": "number"
        },
        "basicDiscontinuousOperations": {
          "type": "number"
        },
        "basicContinuousOperations": {
          "type": "number"
        },
        "reportedNormalizedDilutedEPS": {
          "type": "number"
        },
        "continuingAndDiscontinuedDilutedEPS": {
          "type": "number"
        },
        "taxLossCarryforwardDilutedEPS": {
          "type": "number"
        },
        "averageDilutionEarnings": {
          "type": "number"
        },
        "normalizedDilutedEPS": {
          "type": "number"
        },
        "dilutedAccountingChange": {
          "type": "number"
        },
        "dilutedExtraordinary": {
          "type": "number"
        },
        "dilutedContinuousOperations": {
          "type": "number"
        },
        "dilutedDiscontinuousOperations": {
          "type": "number"
        },
        "dilutedEPSOtherGainsLosses": {
          "type": "number"
        },
        "totalUnusualItemsExcludingGoodwill": {
          "type": "number"
        },
        "totalUnusualItems": {
          "type": "number"
        },
        "taxEffectOfUnusualItems": {
          "type": "number"
        },
        "rentExpenseSupplemental": {
          "type": "number"
        },
        "earningsFromEquityInterestNetOfTax": {
          "type": "number"
        },
        "impairmentOfCapitalAssets": {
          "type": "number"
        },
        "restructuringAndMergernAcquisition": {
          "type": "number"
        },
        "securitiesAmortization": {
          "type": "number"
        },
        "earningsFromEquityInterest": {
          "type": "number"
        },
        "otherTaxes": {
          "type": "number"
        },
        "provisionForDoubtfulAccounts": {
          "type": "number"
        },
        "insuranceAndClaims": {
          "type": "number"
        },
        "rentAndLandingFees": {
          "type": "number"
        },
        "salariesAndWages": {
          "type": "number"
        },
        "exciseTaxes": {
          "type": "number"
        },
        "totalMoneyMarketInvestments": {
          "type": "number"
        },
        "interestIncomeAfterProvisionForLoanLoss": {
          "type": "number"
        },
        "otherThanPreferredStockDividend": {
          "type": "number"
        },
        "lossonExtinguishmentofDebt": {
          "type": "number"
        },
        "incomefromAssociatesandOtherParticipatingInterests": {
          "type": "number"
        },
        "nonInterestExpense": {
          "type": "number"
        },
        "otherNonInterestExpense": {
          "type": "number"
        },
        "professionalExpenseAndContractServicesExpense": {
          "type": "number"
        },
        "occupancyAndEquipment": {
          "type": "number"
        },
        "equipment": {
          "type": "number"
        },
        "netOccupancyExpense": {
          "type": "number"
        },
        "creditLossesProvision": {
          "type": "number"
        },
        "nonInterestIncome": {
          "type": "number"
        },
        "otherNonInterestIncome": {
          "type": "number"
        },
        "gainLossonSaleofAssets": {
          "type": "number"
        },
        "gainonSaleofInvestmentProperty": {
          "type": "number"
        },
        "gainonSaleofLoans": {
          "type": "number"
        },
        "foreignExchangeTradingGains": {
          "type": "number"
        },
        "tradingGainLoss": {
          "type": "number"
        },
        "investmentBankingProfit": {
          "type": "number"
        },
        "dividendIncome": {
          "type": "number"
        },
        "feesAndCommissions": {
          "type": "number"
        },
        "feesandCommissionExpense": {
          "type": "number"
        },
        "feesandCommissionIncome": {
          "type": "number"
        },
        "otherCustomerServices": {
          "type": "number"
        },
        "creditCard": {
          "type": "number"
        },
        "securitiesActivities": {
          "type": "number"
        },
        "trustFeesbyCommissions": {
          "type": "number"
        },
        "serviceChargeOnDepositorAccounts": {
          "type": "number"
        },
        "totalPremiumsEarned": {
          "type": "number"
        },
        "otherInterestExpense": {
          "type": "number"
        },
        "interestExpenseForFederalFundsSoldAndSecuritiesPurchaseUnderAgreementsToResell": {
          "type": "number"
        },
        "interestExpenseForLongTermDebtAndCapitalSecurities": {
          "type": "number"
        },
        "interestExpenseForShortTermDebt": {
          "type": "number"
        },
        "interestExpenseForDeposit": {
          "type": "number"
        },
        "otherInterestIncome": {
          "type": "number"
        },
        "interestIncomeFromFederalFundsSoldAndSecuritiesPurchaseUnderAgreementsToResell": {
          "type": "number"
        },
        "interestIncomeFromDeposits": {
          "type": "number"
        },
        "interestIncomeFromSecurities": {
          "type": "number"
        },
        "interestIncomeFromLoansAndLease": {
          "type": "number"
        },
        "interestIncomeFromLeases": {
          "type": "number"
        },
        "interestIncomeFromLoans": {
          "type": "number"
        },
        "depreciationDepreciationIncomeStatement": {
          "type": "number"
        },
        "operationAndMaintenance": {
          "type": "number"
        },
        "otherCostofRevenue": {
          "type": "number"
        },
        "explorationDevelopmentAndMineralPropertyLeaseExpenses": {
          "type": "number"
        }
      },
      "required": [
        "TYPE",
        "date",
        "periodType"
      ]
    },
    "FundamentalsTimeSeriesResult": {
      "anyOf": [
        {
          "$ref": "#/definitions/FundamentalsTimeSeriesBalanceSheetResult"
        },
        {
          "$ref": "#/definitions/FundamentalsTimeSeriesCashFlowResult"
        },
        {
          "$ref": "#/definitions/FundamentalsTimeSeriesFinancialsResult"
        },
        {
          "$ref": "#/definitions/FundamentalsTimeSeriesAllResult"
        }
      ]
    },
    "FundamentalsTimeSeriesResults": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/FundamentalsTimeSeriesResult"
      }
    },
    "FundamentalsTimeSeriesOptions": {
      "type": "object",
      "properties": {
        "period1": {
          "anyOf": [
            {
              "type": "string",
              "format": "date-time"
            },
            {
              "type": "number"
            },
            {
              "type": "string"
            }
          ]
        },
        "period2": {
          "anyOf": [
            {
              "type": "string",
              "format": "date-time"
            },
            {
              "type": "number"
            },
            {
              "type": "string"
            }
          ]
        },
        "type": {
          "type": "string"
        },
        "merge": {
          "type": "boolean"
        },
        "padTimeSeries": {
          "type": "boolean"
        },
        "lang": {
          "type": "string"
        },
        "region": {
          "type": "string"
        },
        "module": {
          "type": "string"
        }
      },
      "required": [
        "period1",
        "module"
      ],
      "additionalProperties": false
    },
    "fundamentalsTimeSeries": {},
    "processQuery": {},
    "processResponse": {}
  }
};
const definitions$6 = getTypedDefinitions(schema$6);
const FundamentalsTimeSeries_Types = ["quarterly", "annual", "trailing"];
const FundamentalsTimeSeries_Modules = [
  "financials",
  "balance-sheet",
  "cash-flow",
  "all"
];
const queryOptionsDefaults$8 = {
  merge: false,
  padTimeSeries: true,
  lang: "en-US",
  region: "US",
  type: "quarterly"
};
function fundamentalsTimeSeries(symbol, queryOptionsOverrides, moduleOptions) {
  return this._moduleExec({
    moduleName: "options",
    query: {
      assertSymbol: symbol,
      url: `https://query1.finance.yahoo.com/ws/fundamentals-timeseries/v1/finance/timeseries/${symbol}`,
      needsCrumb: false,
      definitions: definitions$6,
      schemaKey: "#/definitions/FundamentalsTimeSeriesOptions",
      defaults: queryOptionsDefaults$8,
      overrides: queryOptionsOverrides,
      transformWith: processQuery
    },
    result: {
      definitions: definitions$6,
      schemaKey: "#/definitions/FundamentalsTimeSeriesResults",
      // deno-lint-ignore no-explicit-any
      transformWith(response) {
        if (!response || !response.timeseries) {
          throw new Error(`Unexpected result: ${JSON.stringify(response)}`);
        }
        return processResponse(response, queryOptionsOverrides.module ?? queryOptionsOverrides.type);
      }
    },
    moduleOptions
  });
}
const processQuery = function(queryOptions) {
  if (!queryOptions.period2)
    queryOptions.period2 = /* @__PURE__ */ new Date();
  const dates = ["period1", "period2"];
  for (const fieldName of dates) {
    const value = queryOptions[fieldName];
    if (value instanceof Date) {
      queryOptions[fieldName] = Math.floor(value.getTime() / 1e3);
    } else if (typeof value === "string") {
      const timestamp = new Date(value).getTime();
      if (isNaN(timestamp)) {
        throw new Error("yahooFinance.fundamentalsTimeSeries() option '" + fieldName + "' invalid date provided: '" + value + "'");
      }
      queryOptions[fieldName] = Math.floor(timestamp / 1e3);
    }
  }
  if (queryOptions.period1 === queryOptions.period2) {
    throw new Error("yahooFinance.fundamentalsTimeSeries() options `period1` and `period2` cannot share the same value.");
  } else if (!FundamentalsTimeSeries_Types.includes(queryOptions.type || "")) {
    throw new Error("yahooFinance.fundamentalsTimeSeries() option type invalid.");
  } else if (!FundamentalsTimeSeries_Modules.includes(queryOptions.module || "")) {
    throw new Error("yahooFinance.fundamentalsTimeSeries() option module invalid.");
  }
  const keys = Object.entries(Timeseries_Keys).reduce((previous, [module, keys2]) => {
    if (queryOptions.module == "all") {
      return previous.concat(keys2);
    } else if (module == queryOptions.module) {
      return previous.concat(keys2);
    } else
      return previous;
  }, []);
  const queryType = queryOptions.type + keys.join(`,${queryOptions.type}`);
  return {
    period1: queryOptions.period1,
    period2: queryOptions.period2,
    type: queryType
  };
};
const processResponse = function(response, requestModule) {
  const keyedByTimestamp = {};
  const replace = new RegExp(FundamentalsTimeSeries_Types.join("|"));
  for (let ct = 0; ct < response.timeseries.result.length; ct++) {
    let periodType = "UNKNOWN";
    const result = response.timeseries.result[ct];
    if (!result.timestamp || !result.timestamp.length) {
      continue;
    }
    for (let ct2 = 0; ct2 < result.timestamp.length; ct2++) {
      const timestamp = result.timestamp[ct2];
      const dataKey = Object.keys(result)[2];
      if (!keyedByTimestamp[timestamp]) {
        keyedByTimestamp[timestamp] = { date: timestamp };
      }
      if (!result[dataKey][ct2] || !result[dataKey][ct2].reportedValue || !result[dataKey][ct2].reportedValue.raw) {
        continue;
      }
      const short = dataKey.replace(replace, "");
      const key = short == short.toUpperCase() ? short : short[0].toLowerCase() + short.slice(1);
      keyedByTimestamp[timestamp][key] = result[dataKey][ct2].reportedValue.raw;
      const thisPeriodType = result[dataKey][ct2].periodType;
      if (thisPeriodType) {
        if (periodType !== "UNKNOWN" && periodType !== thisPeriodType) {
          throw new Error("periodType mismatch - please report " + periodType + " " + thisPeriodType);
        }
        periodType = thisPeriodType;
        keyedByTimestamp[timestamp].periodType = periodType;
      } else {
        console.log("missing periodType", keyedByTimestamp[timestamp]);
      }
    }
  }
  return Object.values(keyedByTimestamp).filter((entry) => Object.keys(entry).length > 1).map((entry) => ({
    TYPE: requestModule === "all" ? "ALL" : requestModule.toUpperCase().replace("-", "_"),
    ...entry
  }));
};
const historicalSchema = {
  "definitions": {
    "HistoricalHistoryResult": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/HistoricalRowHistory"
      }
    },
    "HistoricalRowHistory": {
      "type": "object",
      "properties": {
        "date": {
          "type": "string",
          "format": "date-time"
        },
        "open": {
          "type": "number"
        },
        "high": {
          "type": "number"
        },
        "low": {
          "type": "number"
        },
        "close": {
          "type": "number"
        },
        "adjClose": {
          "type": "number"
        },
        "volume": {
          "type": "number"
        }
      },
      "required": [
        "date",
        "open",
        "high",
        "low",
        "close",
        "volume"
      ],
      "additionalProperties": {}
    },
    "HistoricalDividendsResult": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/HistoricalRowDividend"
      }
    },
    "HistoricalRowDividend": {
      "type": "object",
      "properties": {
        "date": {
          "type": "string",
          "format": "date-time"
        },
        "dividends": {
          "type": "number"
        }
      },
      "required": [
        "date",
        "dividends"
      ],
      "additionalProperties": false
    },
    "HistoricalStockSplitsResult": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/HistoricalRowStockSplit"
      }
    },
    "HistoricalRowStockSplit": {
      "type": "object",
      "properties": {
        "date": {
          "type": "string",
          "format": "date-time"
        },
        "stockSplits": {
          "type": "string"
        }
      },
      "required": [
        "date",
        "stockSplits"
      ],
      "additionalProperties": false
    },
    "HistoricalResult": {
      "anyOf": [
        {
          "$ref": "#/definitions/HistoricalHistoryResult"
        },
        {
          "$ref": "#/definitions/HistoricalDividendsResult"
        },
        {
          "$ref": "#/definitions/HistoricalStockSplitsResult"
        }
      ]
    },
    "HistoricalOptions": {
      "type": "object",
      "properties": {
        "period1": {
          "anyOf": [
            {
              "type": "string",
              "format": "date-time"
            },
            {
              "type": "string"
            },
            {
              "type": "number"
            }
          ]
        },
        "period2": {
          "anyOf": [
            {
              "type": "string",
              "format": "date-time"
            },
            {
              "type": "string"
            },
            {
              "type": "number"
            }
          ]
        },
        "interval": {
          "type": "string",
          "enum": [
            "1d",
            "1wk",
            "1mo"
          ]
        },
        "events": {
          "type": "string",
          "enum": [
            "history",
            "dividends",
            "split"
          ]
        },
        "includeAdjustedClose": {
          "type": "boolean"
        }
      },
      "required": [
        "period1"
      ],
      "additionalProperties": false
    },
    "HistoricalOptionsEventsHistory": {
      "type": "object",
      "properties": {
        "period1": {
          "anyOf": [
            {
              "type": "string",
              "format": "date-time"
            },
            {
              "type": "string"
            },
            {
              "type": "number"
            }
          ]
        },
        "period2": {
          "anyOf": [
            {
              "type": "string",
              "format": "date-time"
            },
            {
              "type": "string"
            },
            {
              "type": "number"
            }
          ]
        },
        "interval": {
          "type": "string",
          "enum": [
            "1d",
            "1wk",
            "1mo"
          ]
        },
        "events": {
          "type": "string",
          "const": "history"
        },
        "includeAdjustedClose": {
          "type": "boolean"
        }
      },
      "additionalProperties": false,
      "required": [
        "period1"
      ]
    },
    "HistoricalOptionsEventsDividends": {
      "type": "object",
      "properties": {
        "period1": {
          "anyOf": [
            {
              "type": "string",
              "format": "date-time"
            },
            {
              "type": "string"
            },
            {
              "type": "number"
            }
          ]
        },
        "period2": {
          "anyOf": [
            {
              "type": "string",
              "format": "date-time"
            },
            {
              "type": "string"
            },
            {
              "type": "number"
            }
          ]
        },
        "interval": {
          "type": "string",
          "enum": [
            "1d",
            "1wk",
            "1mo"
          ]
        },
        "events": {
          "type": "string",
          "const": "dividends"
        },
        "includeAdjustedClose": {
          "type": "boolean"
        }
      },
      "required": [
        "events",
        "period1"
      ],
      "additionalProperties": false
    },
    "HistoricalOptionsEventsSplit": {
      "type": "object",
      "properties": {
        "period1": {
          "anyOf": [
            {
              "type": "string",
              "format": "date-time"
            },
            {
              "type": "string"
            },
            {
              "type": "number"
            }
          ]
        },
        "period2": {
          "anyOf": [
            {
              "type": "string",
              "format": "date-time"
            },
            {
              "type": "string"
            },
            {
              "type": "number"
            }
          ]
        },
        "interval": {
          "type": "string",
          "enum": [
            "1d",
            "1wk",
            "1mo"
          ]
        },
        "events": {
          "type": "string",
          "const": "split"
        },
        "includeAdjustedClose": {
          "type": "boolean"
        }
      },
      "required": [
        "events",
        "period1"
      ],
      "additionalProperties": false
    },
    "nullFieldCount": {},
    "historical": {}
  }
};
const historicalDefinitions = getTypedDefinitions(historicalSchema);
const chartDefinitions = getTypedDefinitions(chartSchema);
const queryOptionsDefaults$7 = {
  interval: "1d",
  events: "history",
  includeAdjustedClose: true
};
function nullFieldCount(object3) {
  if (object3 == null) {
    return;
  }
  let nullCount = 0;
  for (const val of Object.values(object3))
    if (val === null)
      nullCount++;
  return nullCount;
}
async function historical(symbol, queryOptionsOverrides, moduleOptions) {
  this._notices.show("ripHistorical");
  if (!queryOptionsOverrides.events || queryOptionsOverrides.events === "history") ;
  else if (queryOptionsOverrides.events === "dividends") ;
  else if (queryOptionsOverrides.events === "split") ;
  else
    throw new Error("No such event type:" + queryOptionsOverrides.events);
  const queryOpts = { ...queryOptionsDefaults$7, ...queryOptionsOverrides };
  validate({
    source: "historical",
    type: "options",
    object: queryOpts,
    definitions: historicalDefinitions,
    schemaOrSchemaKey: "#/definitions/HistoricalOptions",
    options: this._opts.validation,
    logger: this._opts.logger,
    logObj: this._logObj,
    versionCheck: this._opts.versionCheck
  });
  const eventsMap = { history: "", dividends: "div", split: "split" };
  const chartQueryOpts = {
    period1: queryOpts.period1,
    period2: queryOpts.period2,
    interval: queryOpts.interval,
    events: eventsMap[queryOpts.events || "history"]
  };
  validate({
    source: "historical",
    type: "options",
    object: chartQueryOpts,
    definitions: chartDefinitions,
    schemaOrSchemaKey: "#/definitions/ChartOptions",
    options: this._opts.validation,
    logger: this._opts.logger,
    logObj: this._logObj,
    versionCheck: this._opts.versionCheck
  });
  if (queryOpts.includeAdjustedClose === false) ;
  const result = await this.chart(symbol, chartQueryOpts, {
    ...moduleOptions,
    validateResult: true
  });
  let out;
  if (queryOpts.events === "dividends") {
    out = (result.events?.dividends ?? []).map((d) => ({
      date: d.date,
      dividends: d.amount
    }));
  } else if (queryOpts.events === "split") {
    out = (result.events?.splits ?? []).map((s) => ({
      date: s.date,
      stockSplits: s.splitRatio
    }));
  } else {
    out = (result.quotes ?? []).filter((quote2) => {
      const fieldCount = Object.keys(quote2).length;
      const nullCount = nullFieldCount(quote2);
      if (nullCount === 0) {
        return true;
      } else if (nullCount !== fieldCount - 1) {
        console.error(nullCount, quote2);
        throw new Error("Historical returned a result with SOME (but not all) null values.  Please report this, and provide the query that caused it.");
      } else {
        return false;
      }
    }).map((quote2) => {
      if (!quote2.adjclose)
        return quote2;
      const { adjclose, ...rest } = quote2;
      return { ...rest, adjClose: adjclose };
    });
  }
  const validateResult = !moduleOptions || moduleOptions.validateResult === void 0 || moduleOptions.validateResult === true;
  const validationOpts = {
    ...this._opts.validation,
    // Set logErrors=false if validateResult=false
    logErrors: validateResult ? this._opts.validation.logErrors : false
  };
  validate({
    source: "historical",
    type: "result",
    object: out,
    definitions: historicalDefinitions,
    schemaOrSchemaKey: "#/definitions/HistoricalResult",
    options: validationOpts,
    logger: this._opts.logger,
    logObj: this._logObj,
    versionCheck: this._opts.versionCheck
  });
  return out;
}
const schema$5 = {
  "definitions": {
    "InsightsResult": {
      "type": "object",
      "properties": {
        "symbol": {
          "type": "string"
        },
        "instrumentInfo": {
          "$ref": "#/definitions/InsightsInstrumentInfo"
        },
        "companySnapshot": {
          "$ref": "#/definitions/InsightsCompanySnapshot"
        },
        "recommendation": {
          "type": "object",
          "properties": {
            "targetPrice": {
              "type": "number"
            },
            "provider": {
              "type": "string"
            },
            "rating": {
              "type": "string",
              "enum": [
                "BUY",
                "SELL",
                "HOLD"
              ]
            }
          },
          "required": [
            "provider",
            "rating"
          ],
          "additionalProperties": false
        },
        "events": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/InsightsEvent"
          }
        },
        "reports": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/InsightsReport"
          }
        },
        "sigDevs": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/InsightsSigDev"
          }
        },
        "upsell": {
          "$ref": "#/definitions/InsightsUpsell"
        },
        "upsellSearchDD": {
          "type": "object",
          "properties": {
            "researchReports": {
              "$ref": "#/definitions/InsightsResearchReport"
            }
          },
          "required": [
            "researchReports"
          ],
          "additionalProperties": false
        },
        "secReports": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/InsightsSecReport"
          }
        }
      },
      "required": [
        "symbol",
        "sigDevs"
      ],
      "additionalProperties": {}
    },
    "InsightsInstrumentInfo": {
      "type": "object",
      "properties": {
        "keyTechnicals": {
          "type": "object",
          "properties": {
            "provider": {
              "type": "string"
            },
            "support": {
              "type": "number"
            },
            "resistance": {
              "type": "number"
            },
            "stopLoss": {
              "type": "number"
            }
          },
          "required": [
            "provider"
          ],
          "additionalProperties": {}
        },
        "technicalEvents": {
          "type": "object",
          "properties": {
            "provider": {
              "type": "string"
            },
            "sector": {
              "type": "string"
            },
            "shortTermOutlook": {
              "$ref": "#/definitions/InsightsOutlook"
            },
            "intermediateTermOutlook": {
              "$ref": "#/definitions/InsightsOutlook"
            },
            "longTermOutlook": {
              "$ref": "#/definitions/InsightsOutlook"
            }
          },
          "required": [
            "provider",
            "shortTermOutlook",
            "intermediateTermOutlook",
            "longTermOutlook"
          ],
          "additionalProperties": {}
        },
        "valuation": {
          "type": "object",
          "properties": {
            "color": {
              "type": "number"
            },
            "description": {
              "type": "string"
            },
            "discount": {
              "type": "string"
            },
            "provider": {
              "type": "string"
            },
            "relativeValue": {
              "type": "string"
            }
          },
          "required": [
            "provider"
          ],
          "additionalProperties": {}
        }
      },
      "required": [
        "keyTechnicals",
        "technicalEvents",
        "valuation"
      ],
      "additionalProperties": {}
    },
    "InsightsOutlook": {
      "type": "object",
      "properties": {
        "stateDescription": {
          "type": "string"
        },
        "direction": {
          "$ref": "#/definitions/InsightsDirection"
        },
        "score": {
          "type": "number"
        },
        "scoreDescription": {
          "type": "string"
        },
        "sectorDirection": {
          "$ref": "#/definitions/InsightsDirection"
        },
        "sectorScore": {
          "type": "number"
        },
        "sectorScoreDescription": {
          "type": "string"
        },
        "indexDirection": {
          "$ref": "#/definitions/InsightsDirection"
        },
        "indexScore": {
          "type": "number"
        },
        "indexScoreDescription": {
          "type": "string"
        }
      },
      "required": [
        "stateDescription",
        "direction",
        "score",
        "scoreDescription",
        "indexDirection",
        "indexScore",
        "indexScoreDescription"
      ],
      "additionalProperties": {}
    },
    "InsightsDirection": {
      "type": "string",
      "enum": [
        "Bearish",
        "Bullish",
        "Neutral"
      ]
    },
    "InsightsCompanySnapshot": {
      "type": "object",
      "properties": {
        "sectorInfo": {
          "type": "string"
        },
        "company": {
          "type": "object",
          "properties": {
            "innovativeness": {
              "type": "number"
            },
            "hiring": {
              "type": "number"
            },
            "sustainability": {
              "type": "number"
            },
            "insiderSentiments": {
              "type": "number"
            },
            "earningsReports": {
              "type": "number"
            },
            "dividends": {
              "type": "number"
            }
          },
          "additionalProperties": {}
        },
        "sector": {
          "type": "object",
          "properties": {
            "innovativeness": {
              "type": "number"
            },
            "hiring": {
              "type": "number"
            },
            "sustainability": {
              "type": "number"
            },
            "insiderSentiments": {
              "type": "number"
            },
            "earningsReports": {
              "type": "number"
            },
            "dividends": {
              "type": "number"
            }
          },
          "required": [
            "innovativeness",
            "hiring",
            "insiderSentiments",
            "dividends"
          ],
          "additionalProperties": {}
        }
      },
      "required": [
        "company",
        "sector"
      ],
      "additionalProperties": {}
    },
    "InsightsEvent": {
      "type": "object",
      "properties": {
        "eventType": {
          "type": "string"
        },
        "pricePeriod": {
          "type": "string"
        },
        "tradingHorizon": {
          "type": "string"
        },
        "tradeType": {
          "type": "string"
        },
        "imageUrl": {
          "type": "string"
        },
        "startDate": {
          "type": "string",
          "format": "date-time"
        },
        "endDate": {
          "type": "string",
          "format": "date-time"
        }
      },
      "required": [
        "eventType",
        "pricePeriod",
        "tradingHorizon",
        "tradeType",
        "imageUrl",
        "startDate",
        "endDate"
      ],
      "additionalProperties": {}
    },
    "InsightsReport": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string"
        },
        "title": {
          "type": "string"
        },
        "headHtml": {
          "type": "string"
        },
        "provider": {
          "type": "string"
        },
        "reportDate": {
          "type": "string",
          "format": "date-time"
        },
        "reportTitle": {
          "type": "string"
        },
        "reportType": {
          "type": "string"
        },
        "targetPrice": {
          "type": "number"
        },
        "targetPriceStatus": {
          "type": "string",
          "enum": [
            "Increased",
            "Maintained",
            "Decreased",
            "-"
          ]
        },
        "investmentRating": {
          "type": "string",
          "enum": [
            "Bullish",
            "Neutral",
            "Bearish"
          ]
        },
        "tickers": {
          "type": "array",
          "items": {
            "type": "string"
          }
        }
      },
      "required": [
        "id",
        "headHtml",
        "provider",
        "reportDate",
        "reportTitle",
        "reportType"
      ],
      "additionalProperties": {}
    },
    "InsightsSigDev": {
      "type": "object",
      "properties": {
        "headline": {
          "type": "string"
        },
        "date": {
          "type": "string",
          "format": "date-time"
        }
      },
      "required": [
        "headline",
        "date"
      ],
      "additionalProperties": {}
    },
    "InsightsUpsell": {
      "type": "object",
      "properties": {
        "msBullishSummary": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "msBearishSummary": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "msBullishBearishSummariesPublishDate": {
          "$ref": "#/definitions/DateInMs"
        },
        "companyName": {
          "type": "string"
        },
        "upsellReportType": {
          "type": "string"
        }
      },
      "additionalProperties": {}
    },
    "DateInMs": {
      "type": "string",
      "format": "date-time"
    },
    "InsightsResearchReport": {
      "type": "object",
      "properties": {
        "reportId": {
          "type": "string"
        },
        "provider": {
          "type": "string"
        },
        "title": {
          "type": "string"
        },
        "reportDate": {
          "type": "string",
          "format": "date-time"
        },
        "summary": {
          "type": "string"
        },
        "investmentRating": {
          "type": "string",
          "enum": [
            "Bullish",
            "Neutral",
            "Bearish"
          ]
        }
      },
      "required": [
        "reportId",
        "provider",
        "title",
        "reportDate",
        "summary"
      ],
      "additionalProperties": false
    },
    "InsightsSecReport": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string"
        },
        "type": {
          "type": "string"
        },
        "title": {
          "type": "string"
        },
        "description": {
          "type": "string"
        },
        "filingDate": {
          "$ref": "#/definitions/DateInMs"
        },
        "snapshotUrl": {
          "type": "string"
        },
        "formType": {
          "type": "string"
        }
      },
      "required": [
        "id",
        "type",
        "title",
        "description",
        "filingDate",
        "snapshotUrl",
        "formType"
      ],
      "additionalProperties": false
    },
    "InsightsOptions": {
      "type": "object",
      "properties": {
        "lang": {
          "type": "string"
        },
        "region": {
          "type": "string"
        },
        "reportsCount": {
          "type": "number"
        }
      },
      "additionalProperties": false
    },
    "insights": {}
  }
};
const definitions$5 = getTypedDefinitions(schema$5);
const queryOptionsDefaults$6 = {
  lang: "en-US",
  region: "US",
  getAllResearchReports: true,
  reportsCount: 2
};
function insights(symbol, queryOptionsOverrides, moduleOptions) {
  return this._moduleExec({
    moduleName: "insights",
    query: {
      assertSymbol: symbol,
      url: "https://${YF_QUERY_HOST}/ws/insights/v2/finance/insights",
      definitions: definitions$5,
      schemaKey: "#/definitions/InsightsOptions",
      defaults: queryOptionsDefaults$6,
      overrides: queryOptionsOverrides,
      runtime: { symbol }
    },
    result: {
      definitions: definitions$5,
      schemaKey: "#/definitions/InsightsResult",
      transformWith(result) {
        if (!result.finance) {
          throw new Error("Unexpected result: " + JSON.stringify(result));
        }
        return result.finance.result;
      }
    },
    moduleOptions
  });
}
const schema$4 = {
  "definitions": {
    "OptionsResult": {
      "type": "object",
      "properties": {
        "underlyingSymbol": {
          "type": "string"
        },
        "expirationDates": {
          "type": "array",
          "items": {
            "type": "string",
            "format": "date-time"
          }
        },
        "strikes": {
          "type": "array",
          "items": {
            "type": "number"
          }
        },
        "hasMiniOptions": {
          "type": "boolean"
        },
        "quote": {
          "$ref": "#/definitions/Quote"
        },
        "options": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/Option"
          }
        }
      },
      "required": [
        "underlyingSymbol",
        "expirationDates",
        "strikes",
        "hasMiniOptions",
        "quote",
        "options"
      ],
      "additionalProperties": {}
    },
    "Quote": {
      "type": "object",
      "discriminator": {
        "propertyName": "quoteType"
      },
      "required": [
        "quoteType"
      ],
      "oneOf": [
        {
          "$ref": "#/definitions/QuoteAltSymbol"
        },
        {
          "$ref": "#/definitions/QuoteCryptoCurrency"
        },
        {
          "$ref": "#/definitions/QuoteCurrency"
        },
        {
          "$ref": "#/definitions/QuoteECNQuote"
        },
        {
          "$ref": "#/definitions/QuoteEtf"
        },
        {
          "$ref": "#/definitions/QuoteEquity"
        },
        {
          "$ref": "#/definitions/QuoteFuture"
        },
        {
          "$ref": "#/definitions/QuoteIndex"
        },
        {
          "$ref": "#/definitions/QuoteMutualfund"
        },
        {
          "$ref": "#/definitions/QuoteOption"
        },
        {
          "$ref": "#/definitions/QuoteMoneyMarket"
        }
      ]
    },
    "QuoteAltSymbol": {
      "type": "object",
      "properties": {
        "language": {
          "type": "string"
        },
        "region": {
          "type": "string"
        },
        "quoteType": {
          "type": "string",
          "const": "ALTSYMBOL"
        },
        "typeDisp": {
          "type": "string",
          "const": "ALTSYMBOL"
        },
        "quoteSourceName": {
          "type": "string"
        },
        "triggerable": {
          "type": "boolean"
        },
        "currency": {
          "type": "string"
        },
        "customPriceAlertConfidence": {
          "type": "string"
        },
        "marketState": {
          "type": "string",
          "enum": [
            "REGULAR",
            "CLOSED",
            "PRE",
            "PREPRE",
            "POST",
            "POSTPOST"
          ]
        },
        "tradeable": {
          "type": "boolean"
        },
        "cryptoTradeable": {
          "type": "boolean"
        },
        "corporateActions": {
          "type": "array",
          "items": {}
        },
        "exchange": {
          "type": "string"
        },
        "shortName": {
          "type": "string"
        },
        "longName": {
          "type": "string"
        },
        "messageBoardId": {
          "type": "string"
        },
        "exchangeTimezoneName": {
          "type": "string"
        },
        "exchangeTimezoneShortName": {
          "type": "string"
        },
        "gmtOffSetMilliseconds": {
          "type": "number"
        },
        "market": {
          "type": "string"
        },
        "esgPopulated": {
          "type": "boolean"
        },
        "fiftyTwoWeekLowChange": {
          "type": "number"
        },
        "fiftyTwoWeekLowChangePercent": {
          "type": "number"
        },
        "fiftyTwoWeekRange": {
          "$ref": "#/definitions/TwoNumberRange"
        },
        "fiftyTwoWeekHighChange": {
          "type": "number"
        },
        "fiftyTwoWeekHighChangePercent": {
          "type": "number"
        },
        "fiftyTwoWeekLow": {
          "type": "number"
        },
        "fiftyTwoWeekHigh": {
          "type": "number"
        },
        "fiftyTwoWeekChangePercent": {
          "type": "number"
        },
        "dividendDate": {
          "type": "string",
          "format": "date-time"
        },
        "earningsTimestamp": {
          "type": "string",
          "format": "date-time"
        },
        "earningsTimestampStart": {
          "type": "string",
          "format": "date-time"
        },
        "earningsTimestampEnd": {
          "type": "string",
          "format": "date-time"
        },
        "earningsCallTimestampStart": {
          "type": "string",
          "format": "date-time"
        },
        "earningsCallTimestampEnd": {
          "type": "string",
          "format": "date-time"
        },
        "isEarningsDateEstimate": {
          "type": "boolean"
        },
        "trailingAnnualDividendRate": {
          "type": "number"
        },
        "trailingPE": {
          "type": "number"
        },
        "trailingAnnualDividendYield": {
          "type": "number"
        },
        "epsTrailingTwelveMonths": {
          "type": "number"
        },
        "epsForward": {
          "type": "number"
        },
        "epsCurrentYear": {
          "type": "number"
        },
        "priceEpsCurrentYear": {
          "type": "number"
        },
        "sharesOutstanding": {
          "type": "number"
        },
        "bookValue": {
          "type": "number"
        },
        "fiftyDayAverage": {
          "type": "number"
        },
        "fiftyDayAverageChange": {
          "type": "number"
        },
        "fiftyDayAverageChangePercent": {
          "type": "number"
        },
        "twoHundredDayAverage": {
          "type": "number"
        },
        "twoHundredDayAverageChange": {
          "type": "number"
        },
        "twoHundredDayAverageChangePercent": {
          "type": "number"
        },
        "marketCap": {
          "type": "number"
        },
        "forwardPE": {
          "type": "number"
        },
        "priceToBook": {
          "type": "number"
        },
        "sourceInterval": {
          "type": "number"
        },
        "exchangeDataDelayedBy": {
          "type": "number"
        },
        "firstTradeDateMilliseconds": {
          "$ref": "#/definitions/DateInMs"
        },
        "priceHint": {
          "type": "number"
        },
        "postMarketChangePercent": {
          "type": "number"
        },
        "postMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "postMarketPrice": {
          "type": "number"
        },
        "postMarketChange": {
          "type": "number"
        },
        "hasPrePostMarketData": {
          "type": "boolean"
        },
        "extendedMarketChange": {
          "type": "number"
        },
        "extendedMarketChangePercent": {
          "type": "number"
        },
        "extendedMarketPrice": {
          "type": "number"
        },
        "extendedMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "regularMarketChange": {
          "type": "number"
        },
        "regularMarketChangePercent": {
          "type": "number"
        },
        "regularMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "regularMarketPrice": {
          "type": "number"
        },
        "regularMarketDayHigh": {
          "type": "number"
        },
        "regularMarketDayRange": {
          "$ref": "#/definitions/TwoNumberRange"
        },
        "regularMarketDayLow": {
          "type": "number"
        },
        "regularMarketVolume": {
          "type": "number"
        },
        "dayHigh": {
          "type": "number"
        },
        "dayLow": {
          "type": "number"
        },
        "volume": {
          "type": "number"
        },
        "regularMarketPreviousClose": {
          "type": "number"
        },
        "preMarketChange": {
          "type": "number"
        },
        "preMarketChangePercent": {
          "type": "number"
        },
        "preMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "preMarketPrice": {
          "type": "number"
        },
        "bid": {
          "type": "number"
        },
        "ask": {
          "type": "number"
        },
        "bidSize": {
          "type": "number"
        },
        "askSize": {
          "type": "number"
        },
        "fullExchangeName": {
          "type": "string"
        },
        "financialCurrency": {
          "type": "string"
        },
        "regularMarketOpen": {
          "type": "number"
        },
        "averageDailyVolume3Month": {
          "type": "number"
        },
        "averageDailyVolume10Day": {
          "type": "number"
        },
        "displayName": {
          "type": "string"
        },
        "symbol": {
          "type": "string"
        },
        "underlyingSymbol": {
          "type": "string"
        },
        "ytdReturn": {
          "type": "number"
        },
        "trailingThreeMonthReturns": {
          "type": "number"
        },
        "trailingThreeMonthNavReturns": {
          "type": "number"
        },
        "ipoExpectedDate": {
          "type": "string",
          "format": "date-time"
        },
        "newListingDate": {
          "type": "string",
          "format": "date-time"
        },
        "nameChangeDate": {
          "type": "string",
          "format": "date-time"
        },
        "prevName": {
          "type": "string"
        },
        "averageAnalystRating": {
          "type": "string"
        },
        "pageViewGrowthWeekly": {
          "type": "number"
        },
        "openInterest": {
          "type": "number"
        },
        "beta": {
          "type": "number"
        },
        "companyLogoUrl": {
          "type": "string"
        },
        "logoUrl": {
          "type": "string"
        },
        "impliedSharesOutstanding": {
          "type": "number"
        },
        "underlyingExchangeSymbol": {
          "type": "string"
        },
        "expireDate": {
          "type": "string",
          "format": "date-time"
        },
        "expireIsoDate": {
          "type": "string"
        }
      },
      "required": [
        "esgPopulated",
        "exchange",
        "exchangeDataDelayedBy",
        "exchangeTimezoneName",
        "exchangeTimezoneShortName",
        "expireDate",
        "expireIsoDate",
        "fullExchangeName",
        "gmtOffSetMilliseconds",
        "language",
        "market",
        "marketState",
        "quoteType",
        "region",
        "sourceInterval",
        "symbol",
        "tradeable",
        "triggerable",
        "typeDisp",
        "underlyingExchangeSymbol"
      ]
    },
    "QuoteBase": {
      "type": "object",
      "properties": {
        "language": {
          "type": "string"
        },
        "region": {
          "type": "string"
        },
        "quoteType": {
          "type": "string"
        },
        "typeDisp": {
          "type": "string"
        },
        "quoteSourceName": {
          "type": "string"
        },
        "triggerable": {
          "type": "boolean"
        },
        "currency": {
          "type": "string"
        },
        "customPriceAlertConfidence": {
          "type": "string"
        },
        "marketState": {
          "type": "string",
          "enum": [
            "REGULAR",
            "CLOSED",
            "PRE",
            "PREPRE",
            "POST",
            "POSTPOST"
          ]
        },
        "tradeable": {
          "type": "boolean"
        },
        "cryptoTradeable": {
          "type": "boolean"
        },
        "corporateActions": {
          "type": "array",
          "items": {}
        },
        "exchange": {
          "type": "string"
        },
        "shortName": {
          "type": "string"
        },
        "longName": {
          "type": "string"
        },
        "messageBoardId": {
          "type": "string"
        },
        "exchangeTimezoneName": {
          "type": "string"
        },
        "exchangeTimezoneShortName": {
          "type": "string"
        },
        "gmtOffSetMilliseconds": {
          "type": "number"
        },
        "market": {
          "type": "string"
        },
        "esgPopulated": {
          "type": "boolean"
        },
        "fiftyTwoWeekLowChange": {
          "type": "number"
        },
        "fiftyTwoWeekLowChangePercent": {
          "type": "number"
        },
        "fiftyTwoWeekRange": {
          "$ref": "#/definitions/TwoNumberRange"
        },
        "fiftyTwoWeekHighChange": {
          "type": "number"
        },
        "fiftyTwoWeekHighChangePercent": {
          "type": "number"
        },
        "fiftyTwoWeekLow": {
          "type": "number"
        },
        "fiftyTwoWeekHigh": {
          "type": "number"
        },
        "fiftyTwoWeekChangePercent": {
          "type": "number"
        },
        "dividendDate": {
          "type": "string",
          "format": "date-time"
        },
        "earningsTimestamp": {
          "type": "string",
          "format": "date-time"
        },
        "earningsTimestampStart": {
          "type": "string",
          "format": "date-time"
        },
        "earningsTimestampEnd": {
          "type": "string",
          "format": "date-time"
        },
        "earningsCallTimestampStart": {
          "type": "string",
          "format": "date-time"
        },
        "earningsCallTimestampEnd": {
          "type": "string",
          "format": "date-time"
        },
        "isEarningsDateEstimate": {
          "type": "boolean"
        },
        "trailingAnnualDividendRate": {
          "type": "number"
        },
        "trailingPE": {
          "type": "number"
        },
        "trailingAnnualDividendYield": {
          "type": "number"
        },
        "epsTrailingTwelveMonths": {
          "type": "number"
        },
        "epsForward": {
          "type": "number"
        },
        "epsCurrentYear": {
          "type": "number"
        },
        "priceEpsCurrentYear": {
          "type": "number"
        },
        "sharesOutstanding": {
          "type": "number"
        },
        "bookValue": {
          "type": "number"
        },
        "fiftyDayAverage": {
          "type": "number"
        },
        "fiftyDayAverageChange": {
          "type": "number"
        },
        "fiftyDayAverageChangePercent": {
          "type": "number"
        },
        "twoHundredDayAverage": {
          "type": "number"
        },
        "twoHundredDayAverageChange": {
          "type": "number"
        },
        "twoHundredDayAverageChangePercent": {
          "type": "number"
        },
        "marketCap": {
          "type": "number"
        },
        "forwardPE": {
          "type": "number"
        },
        "priceToBook": {
          "type": "number"
        },
        "sourceInterval": {
          "type": "number"
        },
        "exchangeDataDelayedBy": {
          "type": "number"
        },
        "firstTradeDateMilliseconds": {
          "$ref": "#/definitions/DateInMs"
        },
        "priceHint": {
          "type": "number"
        },
        "postMarketChangePercent": {
          "type": "number"
        },
        "postMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "postMarketPrice": {
          "type": "number"
        },
        "postMarketChange": {
          "type": "number"
        },
        "hasPrePostMarketData": {
          "type": "boolean"
        },
        "extendedMarketChange": {
          "type": "number"
        },
        "extendedMarketChangePercent": {
          "type": "number"
        },
        "extendedMarketPrice": {
          "type": "number"
        },
        "extendedMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "regularMarketChange": {
          "type": "number"
        },
        "regularMarketChangePercent": {
          "type": "number"
        },
        "regularMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "regularMarketPrice": {
          "type": "number"
        },
        "regularMarketDayHigh": {
          "type": "number"
        },
        "regularMarketDayRange": {
          "$ref": "#/definitions/TwoNumberRange"
        },
        "regularMarketDayLow": {
          "type": "number"
        },
        "regularMarketVolume": {
          "type": "number"
        },
        "dayHigh": {
          "type": "number"
        },
        "dayLow": {
          "type": "number"
        },
        "volume": {
          "type": "number"
        },
        "regularMarketPreviousClose": {
          "type": "number"
        },
        "preMarketChange": {
          "type": "number"
        },
        "preMarketChangePercent": {
          "type": "number"
        },
        "preMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "preMarketPrice": {
          "type": "number"
        },
        "bid": {
          "type": "number"
        },
        "ask": {
          "type": "number"
        },
        "bidSize": {
          "type": "number"
        },
        "askSize": {
          "type": "number"
        },
        "fullExchangeName": {
          "type": "string"
        },
        "financialCurrency": {
          "type": "string"
        },
        "regularMarketOpen": {
          "type": "number"
        },
        "averageDailyVolume3Month": {
          "type": "number"
        },
        "averageDailyVolume10Day": {
          "type": "number"
        },
        "displayName": {
          "type": "string"
        },
        "symbol": {
          "type": "string"
        },
        "underlyingSymbol": {
          "type": "string"
        },
        "ytdReturn": {
          "type": "number"
        },
        "trailingThreeMonthReturns": {
          "type": "number"
        },
        "trailingThreeMonthNavReturns": {
          "type": "number"
        },
        "ipoExpectedDate": {
          "type": "string",
          "format": "date-time"
        },
        "newListingDate": {
          "type": "string",
          "format": "date-time"
        },
        "nameChangeDate": {
          "type": "string",
          "format": "date-time"
        },
        "prevName": {
          "type": "string"
        },
        "averageAnalystRating": {
          "type": "string"
        },
        "pageViewGrowthWeekly": {
          "type": "number"
        },
        "openInterest": {
          "type": "number"
        },
        "beta": {
          "type": "number"
        },
        "companyLogoUrl": {
          "type": "string"
        },
        "logoUrl": {
          "type": "string"
        },
        "impliedSharesOutstanding": {
          "type": "number"
        }
      },
      "required": [
        "language",
        "region",
        "quoteType",
        "triggerable",
        "marketState",
        "tradeable",
        "exchange",
        "exchangeTimezoneName",
        "exchangeTimezoneShortName",
        "gmtOffSetMilliseconds",
        "market",
        "esgPopulated",
        "sourceInterval",
        "exchangeDataDelayedBy",
        "fullExchangeName",
        "symbol"
      ]
    },
    "TwoNumberRange": {
      "type": "object",
      "properties": {
        "low": {
          "type": "number"
        },
        "high": {
          "type": "number"
        }
      },
      "required": [
        "low",
        "high"
      ],
      "additionalProperties": false
    },
    "DateInMs": {
      "type": "string",
      "format": "date-time"
    },
    "QuoteCryptoCurrency": {
      "type": "object",
      "properties": {
        "language": {
          "type": "string"
        },
        "region": {
          "type": "string"
        },
        "quoteType": {
          "type": "string",
          "const": "CRYPTOCURRENCY"
        },
        "typeDisp": {
          "type": "string"
        },
        "quoteSourceName": {
          "type": "string"
        },
        "triggerable": {
          "type": "boolean"
        },
        "currency": {
          "type": "string"
        },
        "customPriceAlertConfidence": {
          "type": "string"
        },
        "marketState": {
          "type": "string",
          "enum": [
            "REGULAR",
            "CLOSED",
            "PRE",
            "PREPRE",
            "POST",
            "POSTPOST"
          ]
        },
        "tradeable": {
          "type": "boolean"
        },
        "cryptoTradeable": {
          "type": "boolean"
        },
        "corporateActions": {
          "type": "array",
          "items": {}
        },
        "exchange": {
          "type": "string"
        },
        "shortName": {
          "type": "string"
        },
        "longName": {
          "type": "string"
        },
        "messageBoardId": {
          "type": "string"
        },
        "exchangeTimezoneName": {
          "type": "string"
        },
        "exchangeTimezoneShortName": {
          "type": "string"
        },
        "gmtOffSetMilliseconds": {
          "type": "number"
        },
        "market": {
          "type": "string"
        },
        "esgPopulated": {
          "type": "boolean"
        },
        "fiftyTwoWeekLowChange": {
          "type": "number"
        },
        "fiftyTwoWeekLowChangePercent": {
          "type": "number"
        },
        "fiftyTwoWeekRange": {
          "$ref": "#/definitions/TwoNumberRange"
        },
        "fiftyTwoWeekHighChange": {
          "type": "number"
        },
        "fiftyTwoWeekHighChangePercent": {
          "type": "number"
        },
        "fiftyTwoWeekLow": {
          "type": "number"
        },
        "fiftyTwoWeekHigh": {
          "type": "number"
        },
        "fiftyTwoWeekChangePercent": {
          "type": "number"
        },
        "dividendDate": {
          "type": "string",
          "format": "date-time"
        },
        "earningsTimestamp": {
          "type": "string",
          "format": "date-time"
        },
        "earningsTimestampStart": {
          "type": "string",
          "format": "date-time"
        },
        "earningsTimestampEnd": {
          "type": "string",
          "format": "date-time"
        },
        "earningsCallTimestampStart": {
          "type": "string",
          "format": "date-time"
        },
        "earningsCallTimestampEnd": {
          "type": "string",
          "format": "date-time"
        },
        "isEarningsDateEstimate": {
          "type": "boolean"
        },
        "trailingAnnualDividendRate": {
          "type": "number"
        },
        "trailingPE": {
          "type": "number"
        },
        "trailingAnnualDividendYield": {
          "type": "number"
        },
        "epsTrailingTwelveMonths": {
          "type": "number"
        },
        "epsForward": {
          "type": "number"
        },
        "epsCurrentYear": {
          "type": "number"
        },
        "priceEpsCurrentYear": {
          "type": "number"
        },
        "sharesOutstanding": {
          "type": "number"
        },
        "bookValue": {
          "type": "number"
        },
        "fiftyDayAverage": {
          "type": "number"
        },
        "fiftyDayAverageChange": {
          "type": "number"
        },
        "fiftyDayAverageChangePercent": {
          "type": "number"
        },
        "twoHundredDayAverage": {
          "type": "number"
        },
        "twoHundredDayAverageChange": {
          "type": "number"
        },
        "twoHundredDayAverageChangePercent": {
          "type": "number"
        },
        "marketCap": {
          "type": "number"
        },
        "forwardPE": {
          "type": "number"
        },
        "priceToBook": {
          "type": "number"
        },
        "sourceInterval": {
          "type": "number"
        },
        "exchangeDataDelayedBy": {
          "type": "number"
        },
        "firstTradeDateMilliseconds": {
          "$ref": "#/definitions/DateInMs"
        },
        "priceHint": {
          "type": "number"
        },
        "postMarketChangePercent": {
          "type": "number"
        },
        "postMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "postMarketPrice": {
          "type": "number"
        },
        "postMarketChange": {
          "type": "number"
        },
        "hasPrePostMarketData": {
          "type": "boolean"
        },
        "extendedMarketChange": {
          "type": "number"
        },
        "extendedMarketChangePercent": {
          "type": "number"
        },
        "extendedMarketPrice": {
          "type": "number"
        },
        "extendedMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "regularMarketChange": {
          "type": "number"
        },
        "regularMarketChangePercent": {
          "type": "number"
        },
        "regularMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "regularMarketPrice": {
          "type": "number"
        },
        "regularMarketDayHigh": {
          "type": "number"
        },
        "regularMarketDayRange": {
          "$ref": "#/definitions/TwoNumberRange"
        },
        "regularMarketDayLow": {
          "type": "number"
        },
        "regularMarketVolume": {
          "type": "number"
        },
        "dayHigh": {
          "type": "number"
        },
        "dayLow": {
          "type": "number"
        },
        "volume": {
          "type": "number"
        },
        "regularMarketPreviousClose": {
          "type": "number"
        },
        "preMarketChange": {
          "type": "number"
        },
        "preMarketChangePercent": {
          "type": "number"
        },
        "preMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "preMarketPrice": {
          "type": "number"
        },
        "bid": {
          "type": "number"
        },
        "ask": {
          "type": "number"
        },
        "bidSize": {
          "type": "number"
        },
        "askSize": {
          "type": "number"
        },
        "fullExchangeName": {
          "type": "string"
        },
        "financialCurrency": {
          "type": "string"
        },
        "regularMarketOpen": {
          "type": "number"
        },
        "averageDailyVolume3Month": {
          "type": "number"
        },
        "averageDailyVolume10Day": {
          "type": "number"
        },
        "displayName": {
          "type": "string"
        },
        "symbol": {
          "type": "string"
        },
        "underlyingSymbol": {
          "type": "string"
        },
        "ytdReturn": {
          "type": "number"
        },
        "trailingThreeMonthReturns": {
          "type": "number"
        },
        "trailingThreeMonthNavReturns": {
          "type": "number"
        },
        "ipoExpectedDate": {
          "type": "string",
          "format": "date-time"
        },
        "newListingDate": {
          "type": "string",
          "format": "date-time"
        },
        "nameChangeDate": {
          "type": "string",
          "format": "date-time"
        },
        "prevName": {
          "type": "string"
        },
        "averageAnalystRating": {
          "type": "string"
        },
        "pageViewGrowthWeekly": {
          "type": "number"
        },
        "openInterest": {
          "type": "number"
        },
        "beta": {
          "type": "number"
        },
        "companyLogoUrl": {
          "type": "string"
        },
        "logoUrl": {
          "type": "string"
        },
        "impliedSharesOutstanding": {
          "type": "number"
        },
        "circulatingSupply": {
          "type": "number"
        },
        "fromCurrency": {
          "type": "string"
        },
        "toCurrency": {
          "type": "string"
        },
        "lastMarket": {
          "type": "string"
        },
        "coinImageUrl": {
          "type": "string"
        },
        "volume24Hr": {
          "type": "number"
        },
        "volumeAllCurrencies": {
          "type": "number"
        },
        "startDate": {
          "type": "string",
          "format": "date-time"
        },
        "coinMarketCapLink": {
          "type": "string"
        },
        "maxSupply": {
          "type": "number"
        },
        "totalSupply": {
          "type": "number"
        }
      },
      "required": [
        "esgPopulated",
        "exchange",
        "exchangeDataDelayedBy",
        "exchangeTimezoneName",
        "exchangeTimezoneShortName",
        "fullExchangeName",
        "gmtOffSetMilliseconds",
        "language",
        "market",
        "marketState",
        "quoteType",
        "region",
        "sourceInterval",
        "symbol",
        "tradeable",
        "triggerable"
      ]
    },
    "QuoteCurrency": {
      "type": "object",
      "properties": {
        "language": {
          "type": "string"
        },
        "region": {
          "type": "string"
        },
        "quoteType": {
          "type": "string",
          "const": "CURRENCY"
        },
        "typeDisp": {
          "type": "string"
        },
        "quoteSourceName": {
          "type": "string"
        },
        "triggerable": {
          "type": "boolean"
        },
        "currency": {
          "type": "string"
        },
        "customPriceAlertConfidence": {
          "type": "string"
        },
        "marketState": {
          "type": "string",
          "enum": [
            "REGULAR",
            "CLOSED",
            "PRE",
            "PREPRE",
            "POST",
            "POSTPOST"
          ]
        },
        "tradeable": {
          "type": "boolean"
        },
        "cryptoTradeable": {
          "type": "boolean"
        },
        "corporateActions": {
          "type": "array",
          "items": {}
        },
        "exchange": {
          "type": "string"
        },
        "shortName": {
          "type": "string"
        },
        "longName": {
          "type": "string"
        },
        "messageBoardId": {
          "type": "string"
        },
        "exchangeTimezoneName": {
          "type": "string"
        },
        "exchangeTimezoneShortName": {
          "type": "string"
        },
        "gmtOffSetMilliseconds": {
          "type": "number"
        },
        "market": {
          "type": "string"
        },
        "esgPopulated": {
          "type": "boolean"
        },
        "fiftyTwoWeekLowChange": {
          "type": "number"
        },
        "fiftyTwoWeekLowChangePercent": {
          "type": "number"
        },
        "fiftyTwoWeekRange": {
          "$ref": "#/definitions/TwoNumberRange"
        },
        "fiftyTwoWeekHighChange": {
          "type": "number"
        },
        "fiftyTwoWeekHighChangePercent": {
          "type": "number"
        },
        "fiftyTwoWeekLow": {
          "type": "number"
        },
        "fiftyTwoWeekHigh": {
          "type": "number"
        },
        "fiftyTwoWeekChangePercent": {
          "type": "number"
        },
        "dividendDate": {
          "type": "string",
          "format": "date-time"
        },
        "earningsTimestamp": {
          "type": "string",
          "format": "date-time"
        },
        "earningsTimestampStart": {
          "type": "string",
          "format": "date-time"
        },
        "earningsTimestampEnd": {
          "type": "string",
          "format": "date-time"
        },
        "earningsCallTimestampStart": {
          "type": "string",
          "format": "date-time"
        },
        "earningsCallTimestampEnd": {
          "type": "string",
          "format": "date-time"
        },
        "isEarningsDateEstimate": {
          "type": "boolean"
        },
        "trailingAnnualDividendRate": {
          "type": "number"
        },
        "trailingPE": {
          "type": "number"
        },
        "trailingAnnualDividendYield": {
          "type": "number"
        },
        "epsTrailingTwelveMonths": {
          "type": "number"
        },
        "epsForward": {
          "type": "number"
        },
        "epsCurrentYear": {
          "type": "number"
        },
        "priceEpsCurrentYear": {
          "type": "number"
        },
        "sharesOutstanding": {
          "type": "number"
        },
        "bookValue": {
          "type": "number"
        },
        "fiftyDayAverage": {
          "type": "number"
        },
        "fiftyDayAverageChange": {
          "type": "number"
        },
        "fiftyDayAverageChangePercent": {
          "type": "number"
        },
        "twoHundredDayAverage": {
          "type": "number"
        },
        "twoHundredDayAverageChange": {
          "type": "number"
        },
        "twoHundredDayAverageChangePercent": {
          "type": "number"
        },
        "marketCap": {
          "type": "number"
        },
        "forwardPE": {
          "type": "number"
        },
        "priceToBook": {
          "type": "number"
        },
        "sourceInterval": {
          "type": "number"
        },
        "exchangeDataDelayedBy": {
          "type": "number"
        },
        "firstTradeDateMilliseconds": {
          "$ref": "#/definitions/DateInMs"
        },
        "priceHint": {
          "type": "number"
        },
        "postMarketChangePercent": {
          "type": "number"
        },
        "postMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "postMarketPrice": {
          "type": "number"
        },
        "postMarketChange": {
          "type": "number"
        },
        "hasPrePostMarketData": {
          "type": "boolean"
        },
        "extendedMarketChange": {
          "type": "number"
        },
        "extendedMarketChangePercent": {
          "type": "number"
        },
        "extendedMarketPrice": {
          "type": "number"
        },
        "extendedMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "regularMarketChange": {
          "type": "number"
        },
        "regularMarketChangePercent": {
          "type": "number"
        },
        "regularMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "regularMarketPrice": {
          "type": "number"
        },
        "regularMarketDayHigh": {
          "type": "number"
        },
        "regularMarketDayRange": {
          "$ref": "#/definitions/TwoNumberRange"
        },
        "regularMarketDayLow": {
          "type": "number"
        },
        "regularMarketVolume": {
          "type": "number"
        },
        "dayHigh": {
          "type": "number"
        },
        "dayLow": {
          "type": "number"
        },
        "volume": {
          "type": "number"
        },
        "regularMarketPreviousClose": {
          "type": "number"
        },
        "preMarketChange": {
          "type": "number"
        },
        "preMarketChangePercent": {
          "type": "number"
        },
        "preMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "preMarketPrice": {
          "type": "number"
        },
        "bid": {
          "type": "number"
        },
        "ask": {
          "type": "number"
        },
        "bidSize": {
          "type": "number"
        },
        "askSize": {
          "type": "number"
        },
        "fullExchangeName": {
          "type": "string"
        },
        "financialCurrency": {
          "type": "string"
        },
        "regularMarketOpen": {
          "type": "number"
        },
        "averageDailyVolume3Month": {
          "type": "number"
        },
        "averageDailyVolume10Day": {
          "type": "number"
        },
        "displayName": {
          "type": "string"
        },
        "symbol": {
          "type": "string"
        },
        "underlyingSymbol": {
          "type": "string"
        },
        "ytdReturn": {
          "type": "number"
        },
        "trailingThreeMonthReturns": {
          "type": "number"
        },
        "trailingThreeMonthNavReturns": {
          "type": "number"
        },
        "ipoExpectedDate": {
          "type": "string",
          "format": "date-time"
        },
        "newListingDate": {
          "type": "string",
          "format": "date-time"
        },
        "nameChangeDate": {
          "type": "string",
          "format": "date-time"
        },
        "prevName": {
          "type": "string"
        },
        "averageAnalystRating": {
          "type": "string"
        },
        "pageViewGrowthWeekly": {
          "type": "number"
        },
        "openInterest": {
          "type": "number"
        },
        "beta": {
          "type": "number"
        },
        "companyLogoUrl": {
          "type": "string"
        },
        "logoUrl": {
          "type": "string"
        },
        "impliedSharesOutstanding": {
          "type": "number"
        }
      },
      "required": [
        "esgPopulated",
        "exchange",
        "exchangeDataDelayedBy",
        "exchangeTimezoneName",
        "exchangeTimezoneShortName",
        "fullExchangeName",
        "gmtOffSetMilliseconds",
        "language",
        "market",
        "marketState",
        "quoteType",
        "region",
        "sourceInterval",
        "symbol",
        "tradeable",
        "triggerable"
      ]
    },
    "QuoteECNQuote": {
      "type": "object",
      "properties": {
        "dividendRate": {
          "type": "number"
        },
        "dividendYield": {
          "type": "number"
        },
        "language": {
          "type": "string"
        },
        "region": {
          "type": "string"
        },
        "typeDisp": {
          "type": "string"
        },
        "quoteSourceName": {
          "type": "string"
        },
        "triggerable": {
          "type": "boolean"
        },
        "currency": {
          "type": "string"
        },
        "customPriceAlertConfidence": {
          "type": "string"
        },
        "marketState": {
          "type": "string",
          "enum": [
            "REGULAR",
            "CLOSED",
            "PRE",
            "PREPRE",
            "POST",
            "POSTPOST"
          ]
        },
        "tradeable": {
          "type": "boolean"
        },
        "cryptoTradeable": {
          "type": "boolean"
        },
        "corporateActions": {
          "type": "array",
          "items": {}
        },
        "exchange": {
          "type": "string"
        },
        "shortName": {
          "type": "string"
        },
        "longName": {
          "type": "string"
        },
        "messageBoardId": {
          "type": "string"
        },
        "exchangeTimezoneName": {
          "type": "string"
        },
        "exchangeTimezoneShortName": {
          "type": "string"
        },
        "gmtOffSetMilliseconds": {
          "type": "number"
        },
        "market": {
          "type": "string"
        },
        "esgPopulated": {
          "type": "boolean"
        },
        "fiftyTwoWeekLowChange": {
          "type": "number"
        },
        "fiftyTwoWeekLowChangePercent": {
          "type": "number"
        },
        "fiftyTwoWeekRange": {
          "$ref": "#/definitions/TwoNumberRange"
        },
        "fiftyTwoWeekHighChange": {
          "type": "number"
        },
        "fiftyTwoWeekHighChangePercent": {
          "type": "number"
        },
        "fiftyTwoWeekLow": {
          "type": "number"
        },
        "fiftyTwoWeekHigh": {
          "type": "number"
        },
        "fiftyTwoWeekChangePercent": {
          "type": "number"
        },
        "dividendDate": {
          "type": "string",
          "format": "date-time"
        },
        "earningsTimestamp": {
          "type": "string",
          "format": "date-time"
        },
        "earningsTimestampStart": {
          "type": "string",
          "format": "date-time"
        },
        "earningsTimestampEnd": {
          "type": "string",
          "format": "date-time"
        },
        "earningsCallTimestampStart": {
          "type": "string",
          "format": "date-time"
        },
        "earningsCallTimestampEnd": {
          "type": "string",
          "format": "date-time"
        },
        "isEarningsDateEstimate": {
          "type": "boolean"
        },
        "trailingAnnualDividendRate": {
          "type": "number"
        },
        "trailingPE": {
          "type": "number"
        },
        "trailingAnnualDividendYield": {
          "type": "number"
        },
        "epsTrailingTwelveMonths": {
          "type": "number"
        },
        "epsForward": {
          "type": "number"
        },
        "epsCurrentYear": {
          "type": "number"
        },
        "priceEpsCurrentYear": {
          "type": "number"
        },
        "sharesOutstanding": {
          "type": "number"
        },
        "bookValue": {
          "type": "number"
        },
        "fiftyDayAverage": {
          "type": "number"
        },
        "fiftyDayAverageChange": {
          "type": "number"
        },
        "fiftyDayAverageChangePercent": {
          "type": "number"
        },
        "twoHundredDayAverage": {
          "type": "number"
        },
        "twoHundredDayAverageChange": {
          "type": "number"
        },
        "twoHundredDayAverageChangePercent": {
          "type": "number"
        },
        "marketCap": {
          "type": "number"
        },
        "forwardPE": {
          "type": "number"
        },
        "priceToBook": {
          "type": "number"
        },
        "sourceInterval": {
          "type": "number"
        },
        "exchangeDataDelayedBy": {
          "type": "number"
        },
        "firstTradeDateMilliseconds": {
          "$ref": "#/definitions/DateInMs"
        },
        "priceHint": {
          "type": "number"
        },
        "postMarketChangePercent": {
          "type": "number"
        },
        "postMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "postMarketPrice": {
          "type": "number"
        },
        "postMarketChange": {
          "type": "number"
        },
        "hasPrePostMarketData": {
          "type": "boolean"
        },
        "extendedMarketChange": {
          "type": "number"
        },
        "extendedMarketChangePercent": {
          "type": "number"
        },
        "extendedMarketPrice": {
          "type": "number"
        },
        "extendedMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "regularMarketChange": {
          "type": "number"
        },
        "regularMarketChangePercent": {
          "type": "number"
        },
        "regularMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "regularMarketPrice": {
          "type": "number"
        },
        "regularMarketDayHigh": {
          "type": "number"
        },
        "regularMarketDayRange": {
          "$ref": "#/definitions/TwoNumberRange"
        },
        "regularMarketDayLow": {
          "type": "number"
        },
        "regularMarketVolume": {
          "type": "number"
        },
        "dayHigh": {
          "type": "number"
        },
        "dayLow": {
          "type": "number"
        },
        "volume": {
          "type": "number"
        },
        "regularMarketPreviousClose": {
          "type": "number"
        },
        "preMarketChange": {
          "type": "number"
        },
        "preMarketChangePercent": {
          "type": "number"
        },
        "preMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "preMarketPrice": {
          "type": "number"
        },
        "bid": {
          "type": "number"
        },
        "ask": {
          "type": "number"
        },
        "bidSize": {
          "type": "number"
        },
        "askSize": {
          "type": "number"
        },
        "fullExchangeName": {
          "type": "string"
        },
        "financialCurrency": {
          "type": "string"
        },
        "regularMarketOpen": {
          "type": "number"
        },
        "averageDailyVolume3Month": {
          "type": "number"
        },
        "averageDailyVolume10Day": {
          "type": "number"
        },
        "displayName": {
          "type": "string"
        },
        "symbol": {
          "type": "string"
        },
        "underlyingSymbol": {
          "type": "string"
        },
        "ytdReturn": {
          "type": "number"
        },
        "trailingThreeMonthReturns": {
          "type": "number"
        },
        "trailingThreeMonthNavReturns": {
          "type": "number"
        },
        "ipoExpectedDate": {
          "type": "string",
          "format": "date-time"
        },
        "newListingDate": {
          "type": "string",
          "format": "date-time"
        },
        "nameChangeDate": {
          "type": "string",
          "format": "date-time"
        },
        "prevName": {
          "type": "string"
        },
        "averageAnalystRating": {
          "type": "string"
        },
        "pageViewGrowthWeekly": {
          "type": "number"
        },
        "openInterest": {
          "type": "number"
        },
        "beta": {
          "type": "number"
        },
        "companyLogoUrl": {
          "type": "string"
        },
        "logoUrl": {
          "type": "string"
        },
        "impliedSharesOutstanding": {
          "type": "number"
        },
        "quoteType": {
          "type": "string",
          "const": "ECNQUOTE"
        }
      },
      "required": [
        "esgPopulated",
        "exchange",
        "exchangeDataDelayedBy",
        "exchangeTimezoneName",
        "exchangeTimezoneShortName",
        "fullExchangeName",
        "gmtOffSetMilliseconds",
        "language",
        "market",
        "marketState",
        "quoteType",
        "region",
        "sourceInterval",
        "symbol",
        "tradeable",
        "triggerable"
      ],
      "additionalProperties": false
    },
    "QuoteEtf": {
      "type": "object",
      "properties": {
        "language": {
          "type": "string"
        },
        "region": {
          "type": "string"
        },
        "quoteType": {
          "type": "string",
          "const": "ETF"
        },
        "typeDisp": {
          "type": "string"
        },
        "quoteSourceName": {
          "type": "string"
        },
        "triggerable": {
          "type": "boolean"
        },
        "currency": {
          "type": "string"
        },
        "customPriceAlertConfidence": {
          "type": "string"
        },
        "marketState": {
          "type": "string",
          "enum": [
            "REGULAR",
            "CLOSED",
            "PRE",
            "PREPRE",
            "POST",
            "POSTPOST"
          ]
        },
        "tradeable": {
          "type": "boolean"
        },
        "cryptoTradeable": {
          "type": "boolean"
        },
        "corporateActions": {
          "type": "array",
          "items": {}
        },
        "exchange": {
          "type": "string"
        },
        "shortName": {
          "type": "string"
        },
        "longName": {
          "type": "string"
        },
        "messageBoardId": {
          "type": "string"
        },
        "exchangeTimezoneName": {
          "type": "string"
        },
        "exchangeTimezoneShortName": {
          "type": "string"
        },
        "gmtOffSetMilliseconds": {
          "type": "number"
        },
        "market": {
          "type": "string"
        },
        "esgPopulated": {
          "type": "boolean"
        },
        "fiftyTwoWeekLowChange": {
          "type": "number"
        },
        "fiftyTwoWeekLowChangePercent": {
          "type": "number"
        },
        "fiftyTwoWeekRange": {
          "$ref": "#/definitions/TwoNumberRange"
        },
        "fiftyTwoWeekHighChange": {
          "type": "number"
        },
        "fiftyTwoWeekHighChangePercent": {
          "type": "number"
        },
        "fiftyTwoWeekLow": {
          "type": "number"
        },
        "fiftyTwoWeekHigh": {
          "type": "number"
        },
        "fiftyTwoWeekChangePercent": {
          "type": "number"
        },
        "dividendDate": {
          "type": "string",
          "format": "date-time"
        },
        "earningsTimestamp": {
          "type": "string",
          "format": "date-time"
        },
        "earningsTimestampStart": {
          "type": "string",
          "format": "date-time"
        },
        "earningsTimestampEnd": {
          "type": "string",
          "format": "date-time"
        },
        "earningsCallTimestampStart": {
          "type": "string",
          "format": "date-time"
        },
        "earningsCallTimestampEnd": {
          "type": "string",
          "format": "date-time"
        },
        "isEarningsDateEstimate": {
          "type": "boolean"
        },
        "trailingAnnualDividendRate": {
          "type": "number"
        },
        "trailingPE": {
          "type": "number"
        },
        "trailingAnnualDividendYield": {
          "type": "number"
        },
        "epsTrailingTwelveMonths": {
          "type": "number"
        },
        "epsForward": {
          "type": "number"
        },
        "epsCurrentYear": {
          "type": "number"
        },
        "priceEpsCurrentYear": {
          "type": "number"
        },
        "sharesOutstanding": {
          "type": "number"
        },
        "bookValue": {
          "type": "number"
        },
        "fiftyDayAverage": {
          "type": "number"
        },
        "fiftyDayAverageChange": {
          "type": "number"
        },
        "fiftyDayAverageChangePercent": {
          "type": "number"
        },
        "twoHundredDayAverage": {
          "type": "number"
        },
        "twoHundredDayAverageChange": {
          "type": "number"
        },
        "twoHundredDayAverageChangePercent": {
          "type": "number"
        },
        "marketCap": {
          "type": "number"
        },
        "forwardPE": {
          "type": "number"
        },
        "priceToBook": {
          "type": "number"
        },
        "sourceInterval": {
          "type": "number"
        },
        "exchangeDataDelayedBy": {
          "type": "number"
        },
        "firstTradeDateMilliseconds": {
          "$ref": "#/definitions/DateInMs"
        },
        "priceHint": {
          "type": "number"
        },
        "postMarketChangePercent": {
          "type": "number"
        },
        "postMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "postMarketPrice": {
          "type": "number"
        },
        "postMarketChange": {
          "type": "number"
        },
        "hasPrePostMarketData": {
          "type": "boolean"
        },
        "extendedMarketChange": {
          "type": "number"
        },
        "extendedMarketChangePercent": {
          "type": "number"
        },
        "extendedMarketPrice": {
          "type": "number"
        },
        "extendedMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "regularMarketChange": {
          "type": "number"
        },
        "regularMarketChangePercent": {
          "type": "number"
        },
        "regularMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "regularMarketPrice": {
          "type": "number"
        },
        "regularMarketDayHigh": {
          "type": "number"
        },
        "regularMarketDayRange": {
          "$ref": "#/definitions/TwoNumberRange"
        },
        "regularMarketDayLow": {
          "type": "number"
        },
        "regularMarketVolume": {
          "type": "number"
        },
        "dayHigh": {
          "type": "number"
        },
        "dayLow": {
          "type": "number"
        },
        "volume": {
          "type": "number"
        },
        "regularMarketPreviousClose": {
          "type": "number"
        },
        "preMarketChange": {
          "type": "number"
        },
        "preMarketChangePercent": {
          "type": "number"
        },
        "preMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "preMarketPrice": {
          "type": "number"
        },
        "bid": {
          "type": "number"
        },
        "ask": {
          "type": "number"
        },
        "bidSize": {
          "type": "number"
        },
        "askSize": {
          "type": "number"
        },
        "fullExchangeName": {
          "type": "string"
        },
        "financialCurrency": {
          "type": "string"
        },
        "regularMarketOpen": {
          "type": "number"
        },
        "averageDailyVolume3Month": {
          "type": "number"
        },
        "averageDailyVolume10Day": {
          "type": "number"
        },
        "displayName": {
          "type": "string"
        },
        "symbol": {
          "type": "string"
        },
        "underlyingSymbol": {
          "type": "string"
        },
        "ytdReturn": {
          "type": "number"
        },
        "trailingThreeMonthReturns": {
          "type": "number"
        },
        "trailingThreeMonthNavReturns": {
          "type": "number"
        },
        "ipoExpectedDate": {
          "type": "string",
          "format": "date-time"
        },
        "newListingDate": {
          "type": "string",
          "format": "date-time"
        },
        "nameChangeDate": {
          "type": "string",
          "format": "date-time"
        },
        "prevName": {
          "type": "string"
        },
        "averageAnalystRating": {
          "type": "string"
        },
        "pageViewGrowthWeekly": {
          "type": "number"
        },
        "openInterest": {
          "type": "number"
        },
        "beta": {
          "type": "number"
        },
        "companyLogoUrl": {
          "type": "string"
        },
        "logoUrl": {
          "type": "string"
        },
        "impliedSharesOutstanding": {
          "type": "number"
        },
        "dividendYield": {
          "type": "number"
        },
        "netAssets": {
          "type": "number"
        },
        "netExpenseRatio": {
          "type": "number"
        }
      },
      "required": [
        "esgPopulated",
        "exchange",
        "exchangeDataDelayedBy",
        "exchangeTimezoneName",
        "exchangeTimezoneShortName",
        "fullExchangeName",
        "gmtOffSetMilliseconds",
        "language",
        "market",
        "marketState",
        "quoteType",
        "region",
        "sourceInterval",
        "symbol",
        "tradeable",
        "triggerable"
      ]
    },
    "QuoteEquity": {
      "type": "object",
      "properties": {
        "language": {
          "type": "string"
        },
        "region": {
          "type": "string"
        },
        "quoteType": {
          "type": "string",
          "const": "EQUITY"
        },
        "typeDisp": {
          "type": "string"
        },
        "quoteSourceName": {
          "type": "string"
        },
        "triggerable": {
          "type": "boolean"
        },
        "currency": {
          "type": "string"
        },
        "customPriceAlertConfidence": {
          "type": "string"
        },
        "marketState": {
          "type": "string",
          "enum": [
            "REGULAR",
            "CLOSED",
            "PRE",
            "PREPRE",
            "POST",
            "POSTPOST"
          ]
        },
        "tradeable": {
          "type": "boolean"
        },
        "cryptoTradeable": {
          "type": "boolean"
        },
        "corporateActions": {
          "type": "array",
          "items": {}
        },
        "exchange": {
          "type": "string"
        },
        "shortName": {
          "type": "string"
        },
        "longName": {
          "type": "string"
        },
        "messageBoardId": {
          "type": "string"
        },
        "exchangeTimezoneName": {
          "type": "string"
        },
        "exchangeTimezoneShortName": {
          "type": "string"
        },
        "gmtOffSetMilliseconds": {
          "type": "number"
        },
        "market": {
          "type": "string"
        },
        "esgPopulated": {
          "type": "boolean"
        },
        "fiftyTwoWeekLowChange": {
          "type": "number"
        },
        "fiftyTwoWeekLowChangePercent": {
          "type": "number"
        },
        "fiftyTwoWeekRange": {
          "$ref": "#/definitions/TwoNumberRange"
        },
        "fiftyTwoWeekHighChange": {
          "type": "number"
        },
        "fiftyTwoWeekHighChangePercent": {
          "type": "number"
        },
        "fiftyTwoWeekLow": {
          "type": "number"
        },
        "fiftyTwoWeekHigh": {
          "type": "number"
        },
        "fiftyTwoWeekChangePercent": {
          "type": "number"
        },
        "dividendDate": {
          "type": "string",
          "format": "date-time"
        },
        "earningsTimestamp": {
          "type": "string",
          "format": "date-time"
        },
        "earningsTimestampStart": {
          "type": "string",
          "format": "date-time"
        },
        "earningsTimestampEnd": {
          "type": "string",
          "format": "date-time"
        },
        "earningsCallTimestampStart": {
          "type": "string",
          "format": "date-time"
        },
        "earningsCallTimestampEnd": {
          "type": "string",
          "format": "date-time"
        },
        "isEarningsDateEstimate": {
          "type": "boolean"
        },
        "trailingAnnualDividendRate": {
          "type": "number"
        },
        "trailingPE": {
          "type": "number"
        },
        "trailingAnnualDividendYield": {
          "type": "number"
        },
        "epsTrailingTwelveMonths": {
          "type": "number"
        },
        "epsForward": {
          "type": "number"
        },
        "epsCurrentYear": {
          "type": "number"
        },
        "priceEpsCurrentYear": {
          "type": "number"
        },
        "sharesOutstanding": {
          "type": "number"
        },
        "bookValue": {
          "type": "number"
        },
        "fiftyDayAverage": {
          "type": "number"
        },
        "fiftyDayAverageChange": {
          "type": "number"
        },
        "fiftyDayAverageChangePercent": {
          "type": "number"
        },
        "twoHundredDayAverage": {
          "type": "number"
        },
        "twoHundredDayAverageChange": {
          "type": "number"
        },
        "twoHundredDayAverageChangePercent": {
          "type": "number"
        },
        "marketCap": {
          "type": "number"
        },
        "forwardPE": {
          "type": "number"
        },
        "priceToBook": {
          "type": "number"
        },
        "sourceInterval": {
          "type": "number"
        },
        "exchangeDataDelayedBy": {
          "type": "number"
        },
        "firstTradeDateMilliseconds": {
          "$ref": "#/definitions/DateInMs"
        },
        "priceHint": {
          "type": "number"
        },
        "postMarketChangePercent": {
          "type": "number"
        },
        "postMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "postMarketPrice": {
          "type": "number"
        },
        "postMarketChange": {
          "type": "number"
        },
        "hasPrePostMarketData": {
          "type": "boolean"
        },
        "extendedMarketChange": {
          "type": "number"
        },
        "extendedMarketChangePercent": {
          "type": "number"
        },
        "extendedMarketPrice": {
          "type": "number"
        },
        "extendedMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "regularMarketChange": {
          "type": "number"
        },
        "regularMarketChangePercent": {
          "type": "number"
        },
        "regularMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "regularMarketPrice": {
          "type": "number"
        },
        "regularMarketDayHigh": {
          "type": "number"
        },
        "regularMarketDayRange": {
          "$ref": "#/definitions/TwoNumberRange"
        },
        "regularMarketDayLow": {
          "type": "number"
        },
        "regularMarketVolume": {
          "type": "number"
        },
        "dayHigh": {
          "type": "number"
        },
        "dayLow": {
          "type": "number"
        },
        "volume": {
          "type": "number"
        },
        "regularMarketPreviousClose": {
          "type": "number"
        },
        "preMarketChange": {
          "type": "number"
        },
        "preMarketChangePercent": {
          "type": "number"
        },
        "preMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "preMarketPrice": {
          "type": "number"
        },
        "bid": {
          "type": "number"
        },
        "ask": {
          "type": "number"
        },
        "bidSize": {
          "type": "number"
        },
        "askSize": {
          "type": "number"
        },
        "fullExchangeName": {
          "type": "string"
        },
        "financialCurrency": {
          "type": "string"
        },
        "regularMarketOpen": {
          "type": "number"
        },
        "averageDailyVolume3Month": {
          "type": "number"
        },
        "averageDailyVolume10Day": {
          "type": "number"
        },
        "displayName": {
          "type": "string"
        },
        "symbol": {
          "type": "string"
        },
        "underlyingSymbol": {
          "type": "string"
        },
        "ytdReturn": {
          "type": "number"
        },
        "trailingThreeMonthReturns": {
          "type": "number"
        },
        "trailingThreeMonthNavReturns": {
          "type": "number"
        },
        "ipoExpectedDate": {
          "type": "string",
          "format": "date-time"
        },
        "newListingDate": {
          "type": "string",
          "format": "date-time"
        },
        "nameChangeDate": {
          "type": "string",
          "format": "date-time"
        },
        "prevName": {
          "type": "string"
        },
        "averageAnalystRating": {
          "type": "string"
        },
        "pageViewGrowthWeekly": {
          "type": "number"
        },
        "openInterest": {
          "type": "number"
        },
        "beta": {
          "type": "number"
        },
        "companyLogoUrl": {
          "type": "string"
        },
        "logoUrl": {
          "type": "string"
        },
        "impliedSharesOutstanding": {
          "type": "number"
        },
        "dividendRate": {
          "type": "number"
        },
        "dividendYield": {
          "type": "number"
        }
      },
      "required": [
        "esgPopulated",
        "exchange",
        "exchangeDataDelayedBy",
        "exchangeTimezoneName",
        "exchangeTimezoneShortName",
        "fullExchangeName",
        "gmtOffSetMilliseconds",
        "language",
        "market",
        "marketState",
        "quoteType",
        "region",
        "sourceInterval",
        "symbol",
        "tradeable",
        "triggerable"
      ]
    },
    "QuoteFuture": {
      "type": "object",
      "properties": {
        "language": {
          "type": "string"
        },
        "region": {
          "type": "string"
        },
        "quoteType": {
          "type": "string",
          "const": "FUTURE"
        },
        "typeDisp": {
          "type": "string"
        },
        "quoteSourceName": {
          "type": "string"
        },
        "triggerable": {
          "type": "boolean"
        },
        "currency": {
          "type": "string"
        },
        "customPriceAlertConfidence": {
          "type": "string"
        },
        "marketState": {
          "type": "string",
          "enum": [
            "REGULAR",
            "CLOSED",
            "PRE",
            "PREPRE",
            "POST",
            "POSTPOST"
          ]
        },
        "tradeable": {
          "type": "boolean"
        },
        "cryptoTradeable": {
          "type": "boolean"
        },
        "corporateActions": {
          "type": "array",
          "items": {}
        },
        "exchange": {
          "type": "string"
        },
        "shortName": {
          "type": "string"
        },
        "longName": {
          "type": "string"
        },
        "messageBoardId": {
          "type": "string"
        },
        "exchangeTimezoneName": {
          "type": "string"
        },
        "exchangeTimezoneShortName": {
          "type": "string"
        },
        "gmtOffSetMilliseconds": {
          "type": "number"
        },
        "market": {
          "type": "string"
        },
        "esgPopulated": {
          "type": "boolean"
        },
        "fiftyTwoWeekLowChange": {
          "type": "number"
        },
        "fiftyTwoWeekLowChangePercent": {
          "type": "number"
        },
        "fiftyTwoWeekRange": {
          "$ref": "#/definitions/TwoNumberRange"
        },
        "fiftyTwoWeekHighChange": {
          "type": "number"
        },
        "fiftyTwoWeekHighChangePercent": {
          "type": "number"
        },
        "fiftyTwoWeekLow": {
          "type": "number"
        },
        "fiftyTwoWeekHigh": {
          "type": "number"
        },
        "fiftyTwoWeekChangePercent": {
          "type": "number"
        },
        "dividendDate": {
          "type": "string",
          "format": "date-time"
        },
        "earningsTimestamp": {
          "type": "string",
          "format": "date-time"
        },
        "earningsTimestampStart": {
          "type": "string",
          "format": "date-time"
        },
        "earningsTimestampEnd": {
          "type": "string",
          "format": "date-time"
        },
        "earningsCallTimestampStart": {
          "type": "string",
          "format": "date-time"
        },
        "earningsCallTimestampEnd": {
          "type": "string",
          "format": "date-time"
        },
        "isEarningsDateEstimate": {
          "type": "boolean"
        },
        "trailingAnnualDividendRate": {
          "type": "number"
        },
        "trailingPE": {
          "type": "number"
        },
        "trailingAnnualDividendYield": {
          "type": "number"
        },
        "epsTrailingTwelveMonths": {
          "type": "number"
        },
        "epsForward": {
          "type": "number"
        },
        "epsCurrentYear": {
          "type": "number"
        },
        "priceEpsCurrentYear": {
          "type": "number"
        },
        "sharesOutstanding": {
          "type": "number"
        },
        "bookValue": {
          "type": "number"
        },
        "fiftyDayAverage": {
          "type": "number"
        },
        "fiftyDayAverageChange": {
          "type": "number"
        },
        "fiftyDayAverageChangePercent": {
          "type": "number"
        },
        "twoHundredDayAverage": {
          "type": "number"
        },
        "twoHundredDayAverageChange": {
          "type": "number"
        },
        "twoHundredDayAverageChangePercent": {
          "type": "number"
        },
        "marketCap": {
          "type": "number"
        },
        "forwardPE": {
          "type": "number"
        },
        "priceToBook": {
          "type": "number"
        },
        "sourceInterval": {
          "type": "number"
        },
        "exchangeDataDelayedBy": {
          "type": "number"
        },
        "firstTradeDateMilliseconds": {
          "$ref": "#/definitions/DateInMs"
        },
        "priceHint": {
          "type": "number"
        },
        "postMarketChangePercent": {
          "type": "number"
        },
        "postMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "postMarketPrice": {
          "type": "number"
        },
        "postMarketChange": {
          "type": "number"
        },
        "hasPrePostMarketData": {
          "type": "boolean"
        },
        "extendedMarketChange": {
          "type": "number"
        },
        "extendedMarketChangePercent": {
          "type": "number"
        },
        "extendedMarketPrice": {
          "type": "number"
        },
        "extendedMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "regularMarketChange": {
          "type": "number"
        },
        "regularMarketChangePercent": {
          "type": "number"
        },
        "regularMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "regularMarketPrice": {
          "type": "number"
        },
        "regularMarketDayHigh": {
          "type": "number"
        },
        "regularMarketDayRange": {
          "$ref": "#/definitions/TwoNumberRange"
        },
        "regularMarketDayLow": {
          "type": "number"
        },
        "regularMarketVolume": {
          "type": "number"
        },
        "dayHigh": {
          "type": "number"
        },
        "dayLow": {
          "type": "number"
        },
        "volume": {
          "type": "number"
        },
        "regularMarketPreviousClose": {
          "type": "number"
        },
        "preMarketChange": {
          "type": "number"
        },
        "preMarketChangePercent": {
          "type": "number"
        },
        "preMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "preMarketPrice": {
          "type": "number"
        },
        "bid": {
          "type": "number"
        },
        "ask": {
          "type": "number"
        },
        "bidSize": {
          "type": "number"
        },
        "askSize": {
          "type": "number"
        },
        "fullExchangeName": {
          "type": "string"
        },
        "financialCurrency": {
          "type": "string"
        },
        "regularMarketOpen": {
          "type": "number"
        },
        "averageDailyVolume3Month": {
          "type": "number"
        },
        "averageDailyVolume10Day": {
          "type": "number"
        },
        "displayName": {
          "type": "string"
        },
        "symbol": {
          "type": "string"
        },
        "underlyingSymbol": {
          "type": "string"
        },
        "ytdReturn": {
          "type": "number"
        },
        "trailingThreeMonthReturns": {
          "type": "number"
        },
        "trailingThreeMonthNavReturns": {
          "type": "number"
        },
        "ipoExpectedDate": {
          "type": "string",
          "format": "date-time"
        },
        "newListingDate": {
          "type": "string",
          "format": "date-time"
        },
        "nameChangeDate": {
          "type": "string",
          "format": "date-time"
        },
        "prevName": {
          "type": "string"
        },
        "averageAnalystRating": {
          "type": "string"
        },
        "pageViewGrowthWeekly": {
          "type": "number"
        },
        "openInterest": {
          "type": "number"
        },
        "beta": {
          "type": "number"
        },
        "companyLogoUrl": {
          "type": "string"
        },
        "logoUrl": {
          "type": "string"
        },
        "impliedSharesOutstanding": {
          "type": "number"
        },
        "headSymbolAsString": {
          "type": "string"
        },
        "contractSymbol": {
          "type": "boolean"
        },
        "underlyingExchangeSymbol": {
          "type": "string"
        },
        "expireDate": {
          "type": "string",
          "format": "date-time"
        },
        "expireIsoDate": {
          "type": "string",
          "format": "date-time"
        }
      },
      "required": [
        "contractSymbol",
        "esgPopulated",
        "exchange",
        "exchangeDataDelayedBy",
        "exchangeTimezoneName",
        "exchangeTimezoneShortName",
        "expireDate",
        "expireIsoDate",
        "fullExchangeName",
        "gmtOffSetMilliseconds",
        "language",
        "market",
        "marketState",
        "quoteType",
        "region",
        "sourceInterval",
        "symbol",
        "tradeable",
        "triggerable",
        "underlyingExchangeSymbol"
      ]
    },
    "QuoteIndex": {
      "type": "object",
      "properties": {
        "language": {
          "type": "string"
        },
        "region": {
          "type": "string"
        },
        "quoteType": {
          "type": "string",
          "const": "INDEX"
        },
        "typeDisp": {
          "type": "string"
        },
        "quoteSourceName": {
          "type": "string"
        },
        "triggerable": {
          "type": "boolean"
        },
        "currency": {
          "type": "string"
        },
        "customPriceAlertConfidence": {
          "type": "string"
        },
        "marketState": {
          "type": "string",
          "enum": [
            "REGULAR",
            "CLOSED",
            "PRE",
            "PREPRE",
            "POST",
            "POSTPOST"
          ]
        },
        "tradeable": {
          "type": "boolean"
        },
        "cryptoTradeable": {
          "type": "boolean"
        },
        "corporateActions": {
          "type": "array",
          "items": {}
        },
        "exchange": {
          "type": "string"
        },
        "shortName": {
          "type": "string"
        },
        "longName": {
          "type": "string"
        },
        "messageBoardId": {
          "type": "string"
        },
        "exchangeTimezoneName": {
          "type": "string"
        },
        "exchangeTimezoneShortName": {
          "type": "string"
        },
        "gmtOffSetMilliseconds": {
          "type": "number"
        },
        "market": {
          "type": "string"
        },
        "esgPopulated": {
          "type": "boolean"
        },
        "fiftyTwoWeekLowChange": {
          "type": "number"
        },
        "fiftyTwoWeekLowChangePercent": {
          "type": "number"
        },
        "fiftyTwoWeekRange": {
          "$ref": "#/definitions/TwoNumberRange"
        },
        "fiftyTwoWeekHighChange": {
          "type": "number"
        },
        "fiftyTwoWeekHighChangePercent": {
          "type": "number"
        },
        "fiftyTwoWeekLow": {
          "type": "number"
        },
        "fiftyTwoWeekHigh": {
          "type": "number"
        },
        "fiftyTwoWeekChangePercent": {
          "type": "number"
        },
        "dividendDate": {
          "type": "string",
          "format": "date-time"
        },
        "earningsTimestamp": {
          "type": "string",
          "format": "date-time"
        },
        "earningsTimestampStart": {
          "type": "string",
          "format": "date-time"
        },
        "earningsTimestampEnd": {
          "type": "string",
          "format": "date-time"
        },
        "earningsCallTimestampStart": {
          "type": "string",
          "format": "date-time"
        },
        "earningsCallTimestampEnd": {
          "type": "string",
          "format": "date-time"
        },
        "isEarningsDateEstimate": {
          "type": "boolean"
        },
        "trailingAnnualDividendRate": {
          "type": "number"
        },
        "trailingPE": {
          "type": "number"
        },
        "trailingAnnualDividendYield": {
          "type": "number"
        },
        "epsTrailingTwelveMonths": {
          "type": "number"
        },
        "epsForward": {
          "type": "number"
        },
        "epsCurrentYear": {
          "type": "number"
        },
        "priceEpsCurrentYear": {
          "type": "number"
        },
        "sharesOutstanding": {
          "type": "number"
        },
        "bookValue": {
          "type": "number"
        },
        "fiftyDayAverage": {
          "type": "number"
        },
        "fiftyDayAverageChange": {
          "type": "number"
        },
        "fiftyDayAverageChangePercent": {
          "type": "number"
        },
        "twoHundredDayAverage": {
          "type": "number"
        },
        "twoHundredDayAverageChange": {
          "type": "number"
        },
        "twoHundredDayAverageChangePercent": {
          "type": "number"
        },
        "marketCap": {
          "type": "number"
        },
        "forwardPE": {
          "type": "number"
        },
        "priceToBook": {
          "type": "number"
        },
        "sourceInterval": {
          "type": "number"
        },
        "exchangeDataDelayedBy": {
          "type": "number"
        },
        "firstTradeDateMilliseconds": {
          "$ref": "#/definitions/DateInMs"
        },
        "priceHint": {
          "type": "number"
        },
        "postMarketChangePercent": {
          "type": "number"
        },
        "postMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "postMarketPrice": {
          "type": "number"
        },
        "postMarketChange": {
          "type": "number"
        },
        "hasPrePostMarketData": {
          "type": "boolean"
        },
        "extendedMarketChange": {
          "type": "number"
        },
        "extendedMarketChangePercent": {
          "type": "number"
        },
        "extendedMarketPrice": {
          "type": "number"
        },
        "extendedMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "regularMarketChange": {
          "type": "number"
        },
        "regularMarketChangePercent": {
          "type": "number"
        },
        "regularMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "regularMarketPrice": {
          "type": "number"
        },
        "regularMarketDayHigh": {
          "type": "number"
        },
        "regularMarketDayRange": {
          "$ref": "#/definitions/TwoNumberRange"
        },
        "regularMarketDayLow": {
          "type": "number"
        },
        "regularMarketVolume": {
          "type": "number"
        },
        "dayHigh": {
          "type": "number"
        },
        "dayLow": {
          "type": "number"
        },
        "volume": {
          "type": "number"
        },
        "regularMarketPreviousClose": {
          "type": "number"
        },
        "preMarketChange": {
          "type": "number"
        },
        "preMarketChangePercent": {
          "type": "number"
        },
        "preMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "preMarketPrice": {
          "type": "number"
        },
        "bid": {
          "type": "number"
        },
        "ask": {
          "type": "number"
        },
        "bidSize": {
          "type": "number"
        },
        "askSize": {
          "type": "number"
        },
        "fullExchangeName": {
          "type": "string"
        },
        "financialCurrency": {
          "type": "string"
        },
        "regularMarketOpen": {
          "type": "number"
        },
        "averageDailyVolume3Month": {
          "type": "number"
        },
        "averageDailyVolume10Day": {
          "type": "number"
        },
        "displayName": {
          "type": "string"
        },
        "symbol": {
          "type": "string"
        },
        "underlyingSymbol": {
          "type": "string"
        },
        "ytdReturn": {
          "type": "number"
        },
        "trailingThreeMonthReturns": {
          "type": "number"
        },
        "trailingThreeMonthNavReturns": {
          "type": "number"
        },
        "ipoExpectedDate": {
          "type": "string",
          "format": "date-time"
        },
        "newListingDate": {
          "type": "string",
          "format": "date-time"
        },
        "nameChangeDate": {
          "type": "string",
          "format": "date-time"
        },
        "prevName": {
          "type": "string"
        },
        "averageAnalystRating": {
          "type": "string"
        },
        "pageViewGrowthWeekly": {
          "type": "number"
        },
        "openInterest": {
          "type": "number"
        },
        "beta": {
          "type": "number"
        },
        "companyLogoUrl": {
          "type": "string"
        },
        "logoUrl": {
          "type": "string"
        },
        "impliedSharesOutstanding": {
          "type": "number"
        }
      },
      "required": [
        "esgPopulated",
        "exchange",
        "exchangeDataDelayedBy",
        "exchangeTimezoneName",
        "exchangeTimezoneShortName",
        "fullExchangeName",
        "gmtOffSetMilliseconds",
        "language",
        "market",
        "marketState",
        "quoteType",
        "region",
        "sourceInterval",
        "symbol",
        "tradeable",
        "triggerable"
      ]
    },
    "QuoteMutualfund": {
      "type": "object",
      "properties": {
        "language": {
          "type": "string"
        },
        "region": {
          "type": "string"
        },
        "quoteType": {
          "type": "string",
          "const": "MUTUALFUND"
        },
        "typeDisp": {
          "type": "string"
        },
        "quoteSourceName": {
          "type": "string"
        },
        "triggerable": {
          "type": "boolean"
        },
        "currency": {
          "type": "string"
        },
        "customPriceAlertConfidence": {
          "type": "string"
        },
        "marketState": {
          "type": "string",
          "enum": [
            "REGULAR",
            "CLOSED",
            "PRE",
            "PREPRE",
            "POST",
            "POSTPOST"
          ]
        },
        "tradeable": {
          "type": "boolean"
        },
        "cryptoTradeable": {
          "type": "boolean"
        },
        "corporateActions": {
          "type": "array",
          "items": {}
        },
        "exchange": {
          "type": "string"
        },
        "shortName": {
          "type": "string"
        },
        "longName": {
          "type": "string"
        },
        "messageBoardId": {
          "type": "string"
        },
        "exchangeTimezoneName": {
          "type": "string"
        },
        "exchangeTimezoneShortName": {
          "type": "string"
        },
        "gmtOffSetMilliseconds": {
          "type": "number"
        },
        "market": {
          "type": "string"
        },
        "esgPopulated": {
          "type": "boolean"
        },
        "fiftyTwoWeekLowChange": {
          "type": "number"
        },
        "fiftyTwoWeekLowChangePercent": {
          "type": "number"
        },
        "fiftyTwoWeekRange": {
          "$ref": "#/definitions/TwoNumberRange"
        },
        "fiftyTwoWeekHighChange": {
          "type": "number"
        },
        "fiftyTwoWeekHighChangePercent": {
          "type": "number"
        },
        "fiftyTwoWeekLow": {
          "type": "number"
        },
        "fiftyTwoWeekHigh": {
          "type": "number"
        },
        "fiftyTwoWeekChangePercent": {
          "type": "number"
        },
        "dividendDate": {
          "type": "string",
          "format": "date-time"
        },
        "earningsTimestamp": {
          "type": "string",
          "format": "date-time"
        },
        "earningsTimestampStart": {
          "type": "string",
          "format": "date-time"
        },
        "earningsTimestampEnd": {
          "type": "string",
          "format": "date-time"
        },
        "earningsCallTimestampStart": {
          "type": "string",
          "format": "date-time"
        },
        "earningsCallTimestampEnd": {
          "type": "string",
          "format": "date-time"
        },
        "isEarningsDateEstimate": {
          "type": "boolean"
        },
        "trailingAnnualDividendRate": {
          "type": "number"
        },
        "trailingPE": {
          "type": "number"
        },
        "trailingAnnualDividendYield": {
          "type": "number"
        },
        "epsTrailingTwelveMonths": {
          "type": "number"
        },
        "epsForward": {
          "type": "number"
        },
        "epsCurrentYear": {
          "type": "number"
        },
        "priceEpsCurrentYear": {
          "type": "number"
        },
        "sharesOutstanding": {
          "type": "number"
        },
        "bookValue": {
          "type": "number"
        },
        "fiftyDayAverage": {
          "type": "number"
        },
        "fiftyDayAverageChange": {
          "type": "number"
        },
        "fiftyDayAverageChangePercent": {
          "type": "number"
        },
        "twoHundredDayAverage": {
          "type": "number"
        },
        "twoHundredDayAverageChange": {
          "type": "number"
        },
        "twoHundredDayAverageChangePercent": {
          "type": "number"
        },
        "marketCap": {
          "type": "number"
        },
        "forwardPE": {
          "type": "number"
        },
        "priceToBook": {
          "type": "number"
        },
        "sourceInterval": {
          "type": "number"
        },
        "exchangeDataDelayedBy": {
          "type": "number"
        },
        "firstTradeDateMilliseconds": {
          "$ref": "#/definitions/DateInMs"
        },
        "priceHint": {
          "type": "number"
        },
        "postMarketChangePercent": {
          "type": "number"
        },
        "postMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "postMarketPrice": {
          "type": "number"
        },
        "postMarketChange": {
          "type": "number"
        },
        "hasPrePostMarketData": {
          "type": "boolean"
        },
        "extendedMarketChange": {
          "type": "number"
        },
        "extendedMarketChangePercent": {
          "type": "number"
        },
        "extendedMarketPrice": {
          "type": "number"
        },
        "extendedMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "regularMarketChange": {
          "type": "number"
        },
        "regularMarketChangePercent": {
          "type": "number"
        },
        "regularMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "regularMarketPrice": {
          "type": "number"
        },
        "regularMarketDayHigh": {
          "type": "number"
        },
        "regularMarketDayRange": {
          "$ref": "#/definitions/TwoNumberRange"
        },
        "regularMarketDayLow": {
          "type": "number"
        },
        "regularMarketVolume": {
          "type": "number"
        },
        "dayHigh": {
          "type": "number"
        },
        "dayLow": {
          "type": "number"
        },
        "volume": {
          "type": "number"
        },
        "regularMarketPreviousClose": {
          "type": "number"
        },
        "preMarketChange": {
          "type": "number"
        },
        "preMarketChangePercent": {
          "type": "number"
        },
        "preMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "preMarketPrice": {
          "type": "number"
        },
        "bid": {
          "type": "number"
        },
        "ask": {
          "type": "number"
        },
        "bidSize": {
          "type": "number"
        },
        "askSize": {
          "type": "number"
        },
        "fullExchangeName": {
          "type": "string"
        },
        "financialCurrency": {
          "type": "string"
        },
        "regularMarketOpen": {
          "type": "number"
        },
        "averageDailyVolume3Month": {
          "type": "number"
        },
        "averageDailyVolume10Day": {
          "type": "number"
        },
        "displayName": {
          "type": "string"
        },
        "symbol": {
          "type": "string"
        },
        "underlyingSymbol": {
          "type": "string"
        },
        "ytdReturn": {
          "type": "number"
        },
        "trailingThreeMonthReturns": {
          "type": "number"
        },
        "trailingThreeMonthNavReturns": {
          "type": "number"
        },
        "ipoExpectedDate": {
          "type": "string",
          "format": "date-time"
        },
        "newListingDate": {
          "type": "string",
          "format": "date-time"
        },
        "nameChangeDate": {
          "type": "string",
          "format": "date-time"
        },
        "prevName": {
          "type": "string"
        },
        "averageAnalystRating": {
          "type": "string"
        },
        "pageViewGrowthWeekly": {
          "type": "number"
        },
        "openInterest": {
          "type": "number"
        },
        "beta": {
          "type": "number"
        },
        "companyLogoUrl": {
          "type": "string"
        },
        "logoUrl": {
          "type": "string"
        },
        "impliedSharesOutstanding": {
          "type": "number"
        },
        "dividendRate": {
          "type": "number"
        },
        "dividendYield": {
          "type": "number"
        }
      },
      "required": [
        "esgPopulated",
        "exchange",
        "exchangeDataDelayedBy",
        "exchangeTimezoneName",
        "exchangeTimezoneShortName",
        "fullExchangeName",
        "gmtOffSetMilliseconds",
        "language",
        "market",
        "marketState",
        "quoteType",
        "region",
        "sourceInterval",
        "symbol",
        "tradeable",
        "triggerable"
      ]
    },
    "QuoteOption": {
      "type": "object",
      "properties": {
        "language": {
          "type": "string"
        },
        "region": {
          "type": "string"
        },
        "quoteType": {
          "type": "string",
          "const": "OPTION"
        },
        "typeDisp": {
          "type": "string"
        },
        "quoteSourceName": {
          "type": "string"
        },
        "triggerable": {
          "type": "boolean"
        },
        "currency": {
          "type": "string"
        },
        "customPriceAlertConfidence": {
          "type": "string"
        },
        "marketState": {
          "type": "string",
          "enum": [
            "REGULAR",
            "CLOSED",
            "PRE",
            "PREPRE",
            "POST",
            "POSTPOST"
          ]
        },
        "tradeable": {
          "type": "boolean"
        },
        "cryptoTradeable": {
          "type": "boolean"
        },
        "corporateActions": {
          "type": "array",
          "items": {}
        },
        "exchange": {
          "type": "string"
        },
        "shortName": {
          "type": "string"
        },
        "longName": {
          "type": "string"
        },
        "messageBoardId": {
          "type": "string"
        },
        "exchangeTimezoneName": {
          "type": "string"
        },
        "exchangeTimezoneShortName": {
          "type": "string"
        },
        "gmtOffSetMilliseconds": {
          "type": "number"
        },
        "market": {
          "type": "string"
        },
        "esgPopulated": {
          "type": "boolean"
        },
        "fiftyTwoWeekLowChange": {
          "type": "number"
        },
        "fiftyTwoWeekLowChangePercent": {
          "type": "number"
        },
        "fiftyTwoWeekRange": {
          "$ref": "#/definitions/TwoNumberRange"
        },
        "fiftyTwoWeekHighChange": {
          "type": "number"
        },
        "fiftyTwoWeekHighChangePercent": {
          "type": "number"
        },
        "fiftyTwoWeekLow": {
          "type": "number"
        },
        "fiftyTwoWeekHigh": {
          "type": "number"
        },
        "fiftyTwoWeekChangePercent": {
          "type": "number"
        },
        "dividendDate": {
          "type": "string",
          "format": "date-time"
        },
        "earningsTimestamp": {
          "type": "string",
          "format": "date-time"
        },
        "earningsTimestampStart": {
          "type": "string",
          "format": "date-time"
        },
        "earningsTimestampEnd": {
          "type": "string",
          "format": "date-time"
        },
        "earningsCallTimestampStart": {
          "type": "string",
          "format": "date-time"
        },
        "earningsCallTimestampEnd": {
          "type": "string",
          "format": "date-time"
        },
        "isEarningsDateEstimate": {
          "type": "boolean"
        },
        "trailingAnnualDividendRate": {
          "type": "number"
        },
        "trailingPE": {
          "type": "number"
        },
        "trailingAnnualDividendYield": {
          "type": "number"
        },
        "epsTrailingTwelveMonths": {
          "type": "number"
        },
        "epsForward": {
          "type": "number"
        },
        "epsCurrentYear": {
          "type": "number"
        },
        "priceEpsCurrentYear": {
          "type": "number"
        },
        "sharesOutstanding": {
          "type": "number"
        },
        "bookValue": {
          "type": "number"
        },
        "fiftyDayAverage": {
          "type": "number"
        },
        "fiftyDayAverageChange": {
          "type": "number"
        },
        "fiftyDayAverageChangePercent": {
          "type": "number"
        },
        "twoHundredDayAverage": {
          "type": "number"
        },
        "twoHundredDayAverageChange": {
          "type": "number"
        },
        "twoHundredDayAverageChangePercent": {
          "type": "number"
        },
        "marketCap": {
          "type": "number"
        },
        "forwardPE": {
          "type": "number"
        },
        "priceToBook": {
          "type": "number"
        },
        "sourceInterval": {
          "type": "number"
        },
        "exchangeDataDelayedBy": {
          "type": "number"
        },
        "firstTradeDateMilliseconds": {
          "$ref": "#/definitions/DateInMs"
        },
        "priceHint": {
          "type": "number"
        },
        "postMarketChangePercent": {
          "type": "number"
        },
        "postMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "postMarketPrice": {
          "type": "number"
        },
        "postMarketChange": {
          "type": "number"
        },
        "hasPrePostMarketData": {
          "type": "boolean"
        },
        "extendedMarketChange": {
          "type": "number"
        },
        "extendedMarketChangePercent": {
          "type": "number"
        },
        "extendedMarketPrice": {
          "type": "number"
        },
        "extendedMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "regularMarketChange": {
          "type": "number"
        },
        "regularMarketChangePercent": {
          "type": "number"
        },
        "regularMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "regularMarketPrice": {
          "type": "number"
        },
        "regularMarketDayHigh": {
          "type": "number"
        },
        "regularMarketDayRange": {
          "$ref": "#/definitions/TwoNumberRange"
        },
        "regularMarketDayLow": {
          "type": "number"
        },
        "regularMarketVolume": {
          "type": "number"
        },
        "dayHigh": {
          "type": "number"
        },
        "dayLow": {
          "type": "number"
        },
        "volume": {
          "type": "number"
        },
        "regularMarketPreviousClose": {
          "type": "number"
        },
        "preMarketChange": {
          "type": "number"
        },
        "preMarketChangePercent": {
          "type": "number"
        },
        "preMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "preMarketPrice": {
          "type": "number"
        },
        "bid": {
          "type": "number"
        },
        "ask": {
          "type": "number"
        },
        "bidSize": {
          "type": "number"
        },
        "askSize": {
          "type": "number"
        },
        "fullExchangeName": {
          "type": "string"
        },
        "financialCurrency": {
          "type": "string"
        },
        "regularMarketOpen": {
          "type": "number"
        },
        "averageDailyVolume3Month": {
          "type": "number"
        },
        "averageDailyVolume10Day": {
          "type": "number"
        },
        "displayName": {
          "type": "string"
        },
        "symbol": {
          "type": "string"
        },
        "underlyingSymbol": {
          "type": "string"
        },
        "ytdReturn": {
          "type": "number"
        },
        "trailingThreeMonthReturns": {
          "type": "number"
        },
        "trailingThreeMonthNavReturns": {
          "type": "number"
        },
        "ipoExpectedDate": {
          "type": "string",
          "format": "date-time"
        },
        "newListingDate": {
          "type": "string",
          "format": "date-time"
        },
        "nameChangeDate": {
          "type": "string",
          "format": "date-time"
        },
        "prevName": {
          "type": "string"
        },
        "averageAnalystRating": {
          "type": "string"
        },
        "pageViewGrowthWeekly": {
          "type": "number"
        },
        "openInterest": {
          "type": "number"
        },
        "beta": {
          "type": "number"
        },
        "companyLogoUrl": {
          "type": "string"
        },
        "logoUrl": {
          "type": "string"
        },
        "impliedSharesOutstanding": {
          "type": "number"
        },
        "strike": {
          "type": "number"
        },
        "expireDate": {
          "type": "number"
        },
        "expireIsoDate": {
          "type": "string",
          "format": "date-time"
        }
      },
      "required": [
        "esgPopulated",
        "exchange",
        "exchangeDataDelayedBy",
        "exchangeTimezoneName",
        "exchangeTimezoneShortName",
        "expireDate",
        "expireIsoDate",
        "fullExchangeName",
        "gmtOffSetMilliseconds",
        "language",
        "market",
        "marketState",
        "openInterest",
        "quoteType",
        "region",
        "sourceInterval",
        "strike",
        "symbol",
        "tradeable",
        "triggerable",
        "underlyingSymbol"
      ]
    },
    "QuoteMoneyMarket": {
      "type": "object",
      "properties": {
        "language": {
          "type": "string"
        },
        "region": {
          "type": "string"
        },
        "quoteType": {
          "type": "string",
          "const": "MONEYMARKET"
        },
        "typeDisp": {
          "type": "string",
          "const": "MoneyMarket"
        },
        "quoteSourceName": {
          "type": "string"
        },
        "triggerable": {
          "type": "boolean"
        },
        "currency": {
          "type": "string"
        },
        "customPriceAlertConfidence": {
          "type": "string"
        },
        "marketState": {
          "type": "string",
          "enum": [
            "REGULAR",
            "CLOSED",
            "PRE",
            "PREPRE",
            "POST",
            "POSTPOST"
          ]
        },
        "tradeable": {
          "type": "boolean"
        },
        "cryptoTradeable": {
          "type": "boolean"
        },
        "corporateActions": {
          "type": "array",
          "items": {}
        },
        "exchange": {
          "type": "string"
        },
        "shortName": {
          "type": "string"
        },
        "longName": {
          "type": "string"
        },
        "messageBoardId": {
          "type": "string"
        },
        "exchangeTimezoneName": {
          "type": "string"
        },
        "exchangeTimezoneShortName": {
          "type": "string"
        },
        "gmtOffSetMilliseconds": {
          "type": "number"
        },
        "market": {
          "type": "string"
        },
        "esgPopulated": {
          "type": "boolean"
        },
        "fiftyTwoWeekLowChange": {
          "type": "number"
        },
        "fiftyTwoWeekLowChangePercent": {
          "type": "number"
        },
        "fiftyTwoWeekRange": {
          "$ref": "#/definitions/TwoNumberRange"
        },
        "fiftyTwoWeekHighChange": {
          "type": "number"
        },
        "fiftyTwoWeekHighChangePercent": {
          "type": "number"
        },
        "fiftyTwoWeekLow": {
          "type": "number"
        },
        "fiftyTwoWeekHigh": {
          "type": "number"
        },
        "fiftyTwoWeekChangePercent": {
          "type": "number"
        },
        "dividendDate": {
          "type": "string",
          "format": "date-time"
        },
        "earningsTimestamp": {
          "type": "string",
          "format": "date-time"
        },
        "earningsTimestampStart": {
          "type": "string",
          "format": "date-time"
        },
        "earningsTimestampEnd": {
          "type": "string",
          "format": "date-time"
        },
        "earningsCallTimestampStart": {
          "type": "string",
          "format": "date-time"
        },
        "earningsCallTimestampEnd": {
          "type": "string",
          "format": "date-time"
        },
        "isEarningsDateEstimate": {
          "type": "boolean"
        },
        "trailingAnnualDividendRate": {
          "type": "number"
        },
        "trailingPE": {
          "type": "number"
        },
        "trailingAnnualDividendYield": {
          "type": "number"
        },
        "epsTrailingTwelveMonths": {
          "type": "number"
        },
        "epsForward": {
          "type": "number"
        },
        "epsCurrentYear": {
          "type": "number"
        },
        "priceEpsCurrentYear": {
          "type": "number"
        },
        "sharesOutstanding": {
          "type": "number"
        },
        "bookValue": {
          "type": "number"
        },
        "fiftyDayAverage": {
          "type": "number"
        },
        "fiftyDayAverageChange": {
          "type": "number"
        },
        "fiftyDayAverageChangePercent": {
          "type": "number"
        },
        "twoHundredDayAverage": {
          "type": "number"
        },
        "twoHundredDayAverageChange": {
          "type": "number"
        },
        "twoHundredDayAverageChangePercent": {
          "type": "number"
        },
        "marketCap": {
          "type": "number"
        },
        "forwardPE": {
          "type": "number"
        },
        "priceToBook": {
          "type": "number"
        },
        "sourceInterval": {
          "type": "number"
        },
        "exchangeDataDelayedBy": {
          "type": "number"
        },
        "firstTradeDateMilliseconds": {
          "$ref": "#/definitions/DateInMs"
        },
        "priceHint": {
          "type": "number"
        },
        "postMarketChangePercent": {
          "type": "number"
        },
        "postMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "postMarketPrice": {
          "type": "number"
        },
        "postMarketChange": {
          "type": "number"
        },
        "hasPrePostMarketData": {
          "type": "boolean"
        },
        "extendedMarketChange": {
          "type": "number"
        },
        "extendedMarketChangePercent": {
          "type": "number"
        },
        "extendedMarketPrice": {
          "type": "number"
        },
        "extendedMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "regularMarketChange": {
          "type": "number"
        },
        "regularMarketChangePercent": {
          "type": "number"
        },
        "regularMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "regularMarketPrice": {
          "type": "number"
        },
        "regularMarketDayHigh": {
          "type": "number"
        },
        "regularMarketDayRange": {
          "$ref": "#/definitions/TwoNumberRange"
        },
        "regularMarketDayLow": {
          "type": "number"
        },
        "regularMarketVolume": {
          "type": "number"
        },
        "dayHigh": {
          "type": "number"
        },
        "dayLow": {
          "type": "number"
        },
        "volume": {
          "type": "number"
        },
        "regularMarketPreviousClose": {
          "type": "number"
        },
        "preMarketChange": {
          "type": "number"
        },
        "preMarketChangePercent": {
          "type": "number"
        },
        "preMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "preMarketPrice": {
          "type": "number"
        },
        "bid": {
          "type": "number"
        },
        "ask": {
          "type": "number"
        },
        "bidSize": {
          "type": "number"
        },
        "askSize": {
          "type": "number"
        },
        "fullExchangeName": {
          "type": "string"
        },
        "financialCurrency": {
          "type": "string"
        },
        "regularMarketOpen": {
          "type": "number"
        },
        "averageDailyVolume3Month": {
          "type": "number"
        },
        "averageDailyVolume10Day": {
          "type": "number"
        },
        "displayName": {
          "type": "string"
        },
        "symbol": {
          "type": "string"
        },
        "underlyingSymbol": {
          "type": "string"
        },
        "ytdReturn": {
          "type": "number"
        },
        "trailingThreeMonthReturns": {
          "type": "number"
        },
        "trailingThreeMonthNavReturns": {
          "type": "number"
        },
        "ipoExpectedDate": {
          "type": "string",
          "format": "date-time"
        },
        "newListingDate": {
          "type": "string",
          "format": "date-time"
        },
        "nameChangeDate": {
          "type": "string",
          "format": "date-time"
        },
        "prevName": {
          "type": "string"
        },
        "averageAnalystRating": {
          "type": "string"
        },
        "pageViewGrowthWeekly": {
          "type": "number"
        },
        "openInterest": {
          "type": "number"
        },
        "beta": {
          "type": "number"
        },
        "companyLogoUrl": {
          "type": "string"
        },
        "logoUrl": {
          "type": "string"
        },
        "impliedSharesOutstanding": {
          "type": "number"
        },
        "netAssets": {
          "type": "number"
        }
      },
      "required": [
        "esgPopulated",
        "exchange",
        "exchangeDataDelayedBy",
        "exchangeTimezoneName",
        "exchangeTimezoneShortName",
        "fullExchangeName",
        "gmtOffSetMilliseconds",
        "language",
        "market",
        "marketState",
        "quoteType",
        "region",
        "sourceInterval",
        "symbol",
        "tradeable",
        "triggerable",
        "typeDisp"
      ]
    },
    "Option": {
      "type": "object",
      "properties": {
        "expirationDate": {
          "type": "string",
          "format": "date-time"
        },
        "hasMiniOptions": {
          "type": "boolean"
        },
        "calls": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/CallOrPut"
          }
        },
        "puts": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/CallOrPut"
          }
        }
      },
      "required": [
        "expirationDate",
        "hasMiniOptions",
        "calls",
        "puts"
      ],
      "additionalProperties": {}
    },
    "CallOrPut": {
      "type": "object",
      "properties": {
        "contractSymbol": {
          "type": "string"
        },
        "strike": {
          "type": "number"
        },
        "currency": {
          "type": "string"
        },
        "lastPrice": {
          "type": "number"
        },
        "change": {
          "type": "number"
        },
        "percentChange": {
          "type": "number"
        },
        "volume": {
          "type": "number"
        },
        "openInterest": {
          "type": "number"
        },
        "bid": {
          "type": "number"
        },
        "ask": {
          "type": "number"
        },
        "contractSize": {
          "type": "string",
          "const": "REGULAR"
        },
        "expiration": {
          "type": "string",
          "format": "date-time"
        },
        "lastTradeDate": {
          "type": "string",
          "format": "date-time"
        },
        "impliedVolatility": {
          "type": "number"
        },
        "inTheMoney": {
          "type": "boolean"
        }
      },
      "required": [
        "contractSymbol",
        "strike",
        "lastPrice",
        "change",
        "contractSize",
        "expiration",
        "lastTradeDate",
        "impliedVolatility",
        "inTheMoney"
      ],
      "additionalProperties": {}
    },
    "OptionsOptions": {
      "type": "object",
      "properties": {
        "formatted": {
          "type": "boolean"
        },
        "lang": {
          "type": "string"
        },
        "region": {
          "type": "string"
        },
        "date": {
          "anyOf": [
            {
              "type": "string",
              "format": "date-time"
            },
            {
              "type": "number"
            },
            {
              "type": "string"
            }
          ]
        }
      },
      "additionalProperties": false
    },
    "options": {}
  }
};
const definitions$4 = getTypedDefinitions(schema$4);
const queryOptionsDefaults$5 = {
  formatted: false,
  lang: "en-US",
  region: "US"
};
function options(symbol, queryOptionsOverrides, moduleOptions) {
  return this._moduleExec({
    moduleName: "options",
    query: {
      assertSymbol: symbol,
      url: "https://${YF_QUERY_HOST}/v7/finance/options/" + symbol,
      needsCrumb: true,
      definitions: definitions$4,
      schemaKey: "#/definitions/OptionsOptions",
      defaults: queryOptionsDefaults$5,
      overrides: queryOptionsOverrides,
      transformWith(queryOptions) {
        const date = queryOptions.date;
        if (date) {
          if (date instanceof Date) {
            queryOptions.date = Math.floor(date.getTime() / 1e3);
          } else {
            throw new Error("Unsupported date type: " + date);
          }
        }
        return queryOptions;
      }
    },
    result: {
      definitions: definitions$4,
      schemaKey: "#/definitions/OptionsResult",
      // deno-lint-ignore no-explicit-any
      transformWith(result) {
        if (!result.optionChain) {
          throw new Error("Unexpected result: " + JSON.stringify(result));
        }
        return result.optionChain.result[0];
      }
    },
    moduleOptions
  });
}
const optsSchema = {
  "definitions": {
    "QuoteSummaryResult": {
      "type": "object",
      "properties": {
        "assetProfile": {
          "$ref": "#/definitions/AssetProfile"
        },
        "balanceSheetHistory": {
          "$ref": "#/definitions/BalanceSheetHistory"
        },
        "balanceSheetHistoryQuarterly": {
          "$ref": "#/definitions/BalanceSheetHistory"
        },
        "calendarEvents": {
          "$ref": "#/definitions/CalendarEvents"
        },
        "cashflowStatementHistory": {
          "$ref": "#/definitions/CashflowStatementHistory"
        },
        "cashflowStatementHistoryQuarterly": {
          "$ref": "#/definitions/CashflowStatementHistory"
        },
        "defaultKeyStatistics": {
          "$ref": "#/definitions/DefaultKeyStatistics"
        },
        "earnings": {
          "$ref": "#/definitions/QuoteSummaryEarnings"
        },
        "earningsHistory": {
          "$ref": "#/definitions/EarningsHistory"
        },
        "earningsTrend": {
          "$ref": "#/definitions/EarningsTrend"
        },
        "financialData": {
          "$ref": "#/definitions/FinancialData"
        },
        "fundOwnership": {
          "$ref": "#/definitions/Ownership"
        },
        "fundPerformance": {
          "$ref": "#/definitions/FundPerformance"
        },
        "fundProfile": {
          "$ref": "#/definitions/FundProfile"
        },
        "incomeStatementHistory": {
          "$ref": "#/definitions/IncomeStatementHistory"
        },
        "incomeStatementHistoryQuarterly": {
          "$ref": "#/definitions/IncomeStatementHistory"
        },
        "indexTrend": {
          "$ref": "#/definitions/IndexTrend"
        },
        "industryTrend": {
          "$ref": "#/definitions/Trend"
        },
        "insiderHolders": {
          "$ref": "#/definitions/Holders"
        },
        "insiderTransactions": {
          "$ref": "#/definitions/InsiderTransactions"
        },
        "institutionOwnership": {
          "$ref": "#/definitions/Ownership"
        },
        "majorDirectHolders": {
          "$ref": "#/definitions/Holders"
        },
        "majorHoldersBreakdown": {
          "$ref": "#/definitions/MajorHoldersBreakdown"
        },
        "netSharePurchaseActivity": {
          "$ref": "#/definitions/NetSharePurchaseActivity"
        },
        "price": {
          "$ref": "#/definitions/Price"
        },
        "quoteType": {
          "$ref": "#/definitions/QuoteType"
        },
        "recommendationTrend": {
          "$ref": "#/definitions/RecommendationTrend"
        },
        "secFilings": {
          "$ref": "#/definitions/SECFilings"
        },
        "sectorTrend": {
          "$ref": "#/definitions/Trend"
        },
        "summaryDetail": {
          "$ref": "#/definitions/SummaryDetail"
        },
        "summaryProfile": {
          "$ref": "#/definitions/SummaryProfile"
        },
        "topHoldings": {
          "$ref": "#/definitions/TopHoldings"
        },
        "upgradeDowngradeHistory": {
          "$ref": "#/definitions/UpgradeDowngradeHistory"
        }
      },
      "additionalProperties": {}
    },
    "AssetProfile": {
      "type": "object",
      "properties": {
        "maxAge": {
          "type": "number"
        },
        "address1": {
          "type": "string"
        },
        "address2": {
          "type": "string"
        },
        "address3": {
          "type": "string"
        },
        "city": {
          "type": "string"
        },
        "state": {
          "type": "string"
        },
        "zip": {
          "type": "string"
        },
        "country": {
          "type": "string"
        },
        "phone": {
          "type": "string"
        },
        "fax": {
          "type": "string"
        },
        "website": {
          "type": "string"
        },
        "industry": {
          "type": "string"
        },
        "industryDisp": {
          "type": "string"
        },
        "industryKey": {
          "type": "string"
        },
        "industrySymbol": {
          "type": "string"
        },
        "sector": {
          "type": "string"
        },
        "sectorDisp": {
          "type": "string"
        },
        "sectorKey": {
          "type": "string"
        },
        "longBusinessSummary": {
          "type": "string"
        },
        "fullTimeEmployees": {
          "type": "number"
        },
        "companyOfficers": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/CompanyOfficer"
          }
        },
        "auditRisk": {
          "type": "number"
        },
        "boardRisk": {
          "type": "number"
        },
        "compensationRisk": {
          "type": "number"
        },
        "shareHolderRightsRisk": {
          "type": "number"
        },
        "overallRisk": {
          "type": "number"
        },
        "governanceEpochDate": {
          "type": "string",
          "format": "date-time"
        },
        "compensationAsOfEpochDate": {
          "type": "string",
          "format": "date-time"
        },
        "name": {
          "type": "string"
        },
        "startDate": {
          "type": "string",
          "format": "date-time"
        },
        "description": {
          "type": "string"
        },
        "twitter": {
          "type": "string"
        },
        "irWebsite": {
          "type": "string"
        },
        "executiveTeam": {
          "type": "array",
          "items": {}
        }
      },
      "required": [
        "maxAge",
        "companyOfficers"
      ],
      "additionalProperties": {}
    },
    "CompanyOfficer": {
      "type": "object",
      "properties": {
        "maxAge": {
          "type": "number"
        },
        "name": {
          "type": "string"
        },
        "age": {
          "type": "number"
        },
        "title": {
          "type": "string"
        },
        "yearBorn": {
          "type": "number"
        },
        "fiscalYear": {
          "type": "number"
        },
        "totalPay": {
          "type": "number"
        },
        "exercisedValue": {
          "type": "number"
        },
        "unexercisedValue": {
          "type": "number"
        }
      },
      "required": [
        "maxAge",
        "name",
        "title"
      ],
      "additionalProperties": {}
    },
    "BalanceSheetHistory": {
      "type": "object",
      "properties": {
        "balanceSheetStatements": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/BalanceSheetStatement"
          }
        },
        "maxAge": {
          "type": "number"
        }
      },
      "required": [
        "balanceSheetStatements",
        "maxAge"
      ],
      "additionalProperties": {}
    },
    "BalanceSheetStatement": {
      "type": "object",
      "properties": {
        "maxAge": {
          "type": "number"
        },
        "endDate": {
          "type": "string",
          "format": "date-time"
        }
      },
      "required": [
        "maxAge",
        "endDate"
      ],
      "additionalProperties": false
    },
    "CalendarEvents": {
      "type": "object",
      "properties": {
        "maxAge": {
          "type": "number"
        },
        "earnings": {
          "$ref": "#/definitions/CalendarEventsEarnings"
        },
        "exDividendDate": {
          "type": "string",
          "format": "date-time"
        },
        "dividendDate": {
          "type": "string",
          "format": "date-time"
        }
      },
      "required": [
        "maxAge",
        "earnings"
      ],
      "additionalProperties": {}
    },
    "CalendarEventsEarnings": {
      "type": "object",
      "properties": {
        "earningsCallDate": {
          "type": "array",
          "items": {
            "type": "string",
            "format": "date-time"
          }
        },
        "isEarningsDateEstimate": {
          "type": "boolean"
        },
        "earningsDate": {
          "type": "array",
          "items": {
            "type": "string",
            "format": "date-time"
          }
        },
        "earningsAverage": {
          "type": "number"
        },
        "earningsLow": {
          "type": "number"
        },
        "earningsHigh": {
          "type": "number"
        },
        "revenueAverage": {
          "type": "number"
        },
        "revenueLow": {
          "type": "number"
        },
        "revenueHigh": {
          "type": "number"
        }
      },
      "required": [
        "earningsCallDate",
        "earningsDate"
      ],
      "additionalProperties": {}
    },
    "CashflowStatementHistory": {
      "type": "object",
      "properties": {
        "cashflowStatements": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/CashflowStatement"
          }
        },
        "maxAge": {
          "type": "number"
        }
      },
      "required": [
        "cashflowStatements",
        "maxAge"
      ],
      "additionalProperties": false
    },
    "CashflowStatement": {
      "type": "object",
      "properties": {
        "maxAge": {
          "type": "number"
        },
        "endDate": {
          "type": "string",
          "format": "date-time"
        },
        "netIncome": {
          "type": "number"
        }
      },
      "required": [
        "maxAge",
        "endDate",
        "netIncome"
      ],
      "additionalProperties": false
    },
    "DefaultKeyStatistics": {
      "type": "object",
      "properties": {
        "maxAge": {
          "type": "number"
        },
        "priceHint": {
          "type": "number"
        },
        "enterpriseValue": {
          "type": "number"
        },
        "forwardPE": {
          "type": "number"
        },
        "profitMargins": {
          "type": "number"
        },
        "floatShares": {
          "type": "number"
        },
        "sharesOutstanding": {
          "type": "number"
        },
        "sharesShort": {
          "type": "number"
        },
        "sharesShortPriorMonth": {
          "type": "string",
          "format": "date-time"
        },
        "sharesShortPreviousMonthDate": {
          "type": "string",
          "format": "date-time"
        },
        "dateShortInterest": {
          "type": "string",
          "format": "date-time"
        },
        "sharesPercentSharesOut": {
          "type": "number"
        },
        "heldPercentInsiders": {
          "type": "number"
        },
        "heldPercentInstitutions": {
          "type": "number"
        },
        "shortRatio": {
          "type": "number"
        },
        "shortPercentOfFloat": {
          "type": "number"
        },
        "beta": {
          "type": "number"
        },
        "impliedSharesOutstanding": {
          "type": "number"
        },
        "category": {
          "type": [
            "null",
            "string"
          ]
        },
        "bookValue": {
          "type": "number"
        },
        "priceToBook": {
          "type": "number"
        },
        "fundFamily": {
          "type": [
            "null",
            "string"
          ]
        },
        "legalType": {
          "type": [
            "null",
            "string"
          ]
        },
        "lastFiscalYearEnd": {
          "type": "string",
          "format": "date-time"
        },
        "nextFiscalYearEnd": {
          "type": "string",
          "format": "date-time"
        },
        "mostRecentQuarter": {
          "type": "string",
          "format": "date-time"
        },
        "earningsQuarterlyGrowth": {
          "type": "number"
        },
        "netIncomeToCommon": {
          "type": "number"
        },
        "trailingEps": {
          "type": "number"
        },
        "forwardEps": {
          "type": "number"
        },
        "pegRatio": {
          "type": "number"
        },
        "lastSplitFactor": {
          "type": [
            "null",
            "string"
          ]
        },
        "lastSplitDate": {
          "type": "number"
        },
        "enterpriseToRevenue": {
          "type": "number"
        },
        "enterpriseToEbitda": {
          "type": "number"
        },
        "52WeekChange": {
          "type": "number"
        },
        "SandP52WeekChange": {
          "type": "number"
        },
        "lastDividendValue": {
          "type": "number"
        },
        "lastDividendDate": {
          "type": "string",
          "format": "date-time"
        },
        "ytdReturn": {
          "type": "number"
        },
        "beta3Year": {
          "type": "number"
        },
        "totalAssets": {
          "type": "number"
        },
        "yield": {
          "type": "number"
        },
        "fundInceptionDate": {
          "type": "string",
          "format": "date-time"
        },
        "threeYearAverageReturn": {
          "type": "number"
        },
        "fiveYearAverageReturn": {
          "type": "number"
        },
        "morningStarOverallRating": {
          "type": "number"
        },
        "morningStarRiskRating": {
          "type": "number"
        },
        "annualReportExpenseRatio": {
          "type": "number"
        },
        "lastCapGain": {
          "type": "number"
        },
        "annualHoldingsTurnover": {
          "type": "number"
        },
        "latestShareClass": {},
        "leadInvestor": {}
      },
      "required": [
        "maxAge",
        "priceHint",
        "category",
        "fundFamily",
        "legalType",
        "lastSplitFactor"
      ],
      "additionalProperties": {}
    },
    "QuoteSummaryEarnings": {
      "type": "object",
      "properties": {
        "maxAge": {
          "type": "number"
        },
        "earningsChart": {
          "$ref": "#/definitions/EarningsChart"
        },
        "financialsChart": {
          "$ref": "#/definitions/FinancialsChart"
        },
        "financialCurrency": {
          "type": "string"
        }
      },
      "required": [
        "maxAge",
        "earningsChart",
        "financialsChart"
      ],
      "additionalProperties": {}
    },
    "EarningsChart": {
      "type": "object",
      "properties": {
        "quarterly": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/EarningsChartQuarterly"
          }
        },
        "currentQuarterEstimate": {
          "type": "number"
        },
        "currentQuarterEstimateDate": {
          "type": "string"
        },
        "currentQuarterEstimateYear": {
          "type": "number"
        },
        "earningsDate": {
          "type": "array",
          "items": {
            "type": "string",
            "format": "date-time"
          }
        },
        "isEarningsDateEstimate": {
          "type": "boolean"
        }
      },
      "required": [
        "quarterly",
        "earningsDate"
      ],
      "additionalProperties": {}
    },
    "EarningsChartQuarterly": {
      "type": "object",
      "properties": {
        "date": {
          "type": "string"
        },
        "actual": {
          "type": "number"
        },
        "estimate": {
          "type": "number"
        }
      },
      "required": [
        "date",
        "estimate"
      ],
      "additionalProperties": {}
    },
    "FinancialsChart": {
      "type": "object",
      "properties": {
        "yearly": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/Yearly"
          }
        },
        "quarterly": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/FinancialsChartQuarterly"
          }
        }
      },
      "required": [
        "yearly",
        "quarterly"
      ],
      "additionalProperties": {}
    },
    "Yearly": {
      "type": "object",
      "properties": {
        "date": {
          "type": "number"
        },
        "revenue": {
          "type": "number"
        },
        "earnings": {
          "type": "number"
        }
      },
      "required": [
        "date",
        "revenue",
        "earnings"
      ],
      "additionalProperties": {}
    },
    "FinancialsChartQuarterly": {
      "type": "object",
      "properties": {
        "date": {
          "type": "string"
        },
        "revenue": {
          "type": "number"
        },
        "earnings": {
          "type": "number"
        }
      },
      "required": [
        "date",
        "revenue",
        "earnings"
      ],
      "additionalProperties": {}
    },
    "EarningsHistory": {
      "type": "object",
      "properties": {
        "history": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/EarningsHistoryHistory"
          }
        },
        "maxAge": {
          "type": "number"
        }
      },
      "required": [
        "history",
        "maxAge"
      ],
      "additionalProperties": {}
    },
    "EarningsHistoryHistory": {
      "type": "object",
      "properties": {
        "maxAge": {
          "type": "number"
        },
        "epsActual": {
          "type": [
            "number",
            "null"
          ]
        },
        "epsEstimate": {
          "type": [
            "number",
            "null"
          ]
        },
        "epsDifference": {
          "type": [
            "number",
            "null"
          ]
        },
        "surprisePercent": {
          "type": [
            "number",
            "null"
          ]
        },
        "quarter": {
          "anyOf": [
            {
              "type": "string",
              "format": "date-time"
            },
            {
              "type": "null"
            }
          ]
        },
        "period": {
          "type": "string"
        },
        "currency": {
          "type": "string"
        }
      },
      "required": [
        "maxAge",
        "epsActual",
        "epsEstimate",
        "epsDifference",
        "surprisePercent",
        "quarter",
        "period"
      ],
      "additionalProperties": {}
    },
    "EarningsTrend": {
      "type": "object",
      "properties": {
        "trend": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/EarningsTrendTrend"
          }
        },
        "maxAge": {
          "type": "number"
        }
      },
      "required": [
        "trend",
        "maxAge"
      ],
      "additionalProperties": {}
    },
    "EarningsTrendTrend": {
      "type": "object",
      "properties": {
        "maxAge": {
          "type": "number"
        },
        "period": {
          "type": "string"
        },
        "endDate": {
          "anyOf": [
            {
              "type": "string",
              "format": "date-time"
            },
            {
              "type": "null"
            }
          ]
        },
        "growth": {
          "type": [
            "number",
            "null"
          ]
        },
        "earningsEstimate": {
          "$ref": "#/definitions/EarningsEstimate"
        },
        "revenueEstimate": {
          "$ref": "#/definitions/RevenueEstimate"
        },
        "epsTrend": {
          "$ref": "#/definitions/EpsTrend"
        },
        "epsRevisions": {
          "$ref": "#/definitions/EpsRevisions"
        }
      },
      "required": [
        "maxAge",
        "period",
        "endDate",
        "growth",
        "earningsEstimate",
        "revenueEstimate",
        "epsTrend",
        "epsRevisions"
      ],
      "additionalProperties": {}
    },
    "EarningsEstimate": {
      "type": "object",
      "properties": {
        "avg": {
          "type": [
            "number",
            "null"
          ]
        },
        "low": {
          "type": [
            "number",
            "null"
          ]
        },
        "high": {
          "type": [
            "number",
            "null"
          ]
        },
        "yearAgoEps": {
          "type": [
            "number",
            "null"
          ]
        },
        "numberOfAnalysts": {
          "type": [
            "number",
            "null"
          ]
        },
        "growth": {
          "type": [
            "number",
            "null"
          ]
        },
        "earningsCurrency": {
          "type": [
            "string",
            "null"
          ]
        }
      },
      "required": [
        "avg",
        "low",
        "high",
        "yearAgoEps",
        "numberOfAnalysts",
        "growth"
      ],
      "additionalProperties": {}
    },
    "RevenueEstimate": {
      "type": "object",
      "properties": {
        "avg": {
          "type": [
            "number",
            "null"
          ]
        },
        "low": {
          "type": [
            "number",
            "null"
          ]
        },
        "high": {
          "type": [
            "number",
            "null"
          ]
        },
        "numberOfAnalysts": {
          "type": [
            "number",
            "null"
          ]
        },
        "yearAgoRevenue": {
          "type": [
            "number",
            "null"
          ]
        },
        "growth": {
          "type": [
            "number",
            "null"
          ]
        },
        "revenueCurrency": {
          "type": [
            "string",
            "null"
          ]
        }
      },
      "required": [
        "avg",
        "low",
        "high",
        "numberOfAnalysts",
        "yearAgoRevenue",
        "growth"
      ],
      "additionalProperties": {}
    },
    "EpsTrend": {
      "type": "object",
      "properties": {
        "current": {
          "type": [
            "number",
            "null"
          ]
        },
        "7daysAgo": {
          "type": [
            "number",
            "null"
          ]
        },
        "30daysAgo": {
          "type": [
            "number",
            "null"
          ]
        },
        "60daysAgo": {
          "type": [
            "number",
            "null"
          ]
        },
        "90daysAgo": {
          "type": [
            "number",
            "null"
          ]
        },
        "epsTrendCurrency": {
          "type": [
            "string",
            "null"
          ]
        }
      },
      "required": [
        "current",
        "7daysAgo",
        "30daysAgo",
        "60daysAgo",
        "90daysAgo"
      ],
      "additionalProperties": {}
    },
    "EpsRevisions": {
      "type": "object",
      "properties": {
        "upLast7days": {
          "type": [
            "number",
            "null"
          ]
        },
        "upLast30days": {
          "type": [
            "number",
            "null"
          ]
        },
        "upLast90days": {
          "type": [
            "number",
            "null"
          ]
        },
        "downLast7Days": {
          "type": [
            "number",
            "null"
          ]
        },
        "downLast30days": {
          "type": [
            "number",
            "null"
          ]
        },
        "downLast90days": {
          "type": [
            "number",
            "null"
          ]
        },
        "epsRevisionsCurrency": {
          "type": [
            "string",
            "null"
          ]
        }
      },
      "additionalProperties": {}
    },
    "FinancialData": {
      "type": "object",
      "properties": {
        "maxAge": {
          "type": "number"
        },
        "currentPrice": {
          "type": "number"
        },
        "targetHighPrice": {
          "type": "number"
        },
        "targetLowPrice": {
          "type": "number"
        },
        "targetMeanPrice": {
          "type": "number"
        },
        "targetMedianPrice": {
          "type": "number"
        },
        "recommendationMean": {
          "type": "number"
        },
        "recommendationKey": {
          "type": "string"
        },
        "numberOfAnalystOpinions": {
          "type": "number"
        },
        "totalCash": {
          "type": "number"
        },
        "totalCashPerShare": {
          "type": "number"
        },
        "ebitda": {
          "type": "number"
        },
        "totalDebt": {
          "type": "number"
        },
        "quickRatio": {
          "type": "number"
        },
        "currentRatio": {
          "type": "number"
        },
        "totalRevenue": {
          "type": "number"
        },
        "debtToEquity": {
          "type": "number"
        },
        "revenuePerShare": {
          "type": "number"
        },
        "returnOnAssets": {
          "type": "number"
        },
        "returnOnEquity": {
          "type": "number"
        },
        "grossProfits": {
          "type": "number"
        },
        "freeCashflow": {
          "type": "number"
        },
        "operatingCashflow": {
          "type": "number"
        },
        "earningsGrowth": {
          "type": "number"
        },
        "revenueGrowth": {
          "type": "number"
        },
        "grossMargins": {
          "type": "number"
        },
        "ebitdaMargins": {
          "type": "number"
        },
        "operatingMargins": {
          "type": "number"
        },
        "profitMargins": {
          "type": "number"
        },
        "financialCurrency": {
          "type": [
            "string",
            "null"
          ]
        }
      },
      "required": [
        "maxAge",
        "recommendationKey",
        "financialCurrency"
      ],
      "additionalProperties": {}
    },
    "Ownership": {
      "type": "object",
      "properties": {
        "maxAge": {
          "type": "number"
        },
        "ownershipList": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/OwnershipList"
          }
        }
      },
      "required": [
        "maxAge",
        "ownershipList"
      ],
      "additionalProperties": {}
    },
    "OwnershipList": {
      "type": "object",
      "properties": {
        "maxAge": {
          "type": "number"
        },
        "reportDate": {
          "type": "string",
          "format": "date-time"
        },
        "organization": {
          "type": "string"
        },
        "pctHeld": {
          "type": "number"
        },
        "position": {
          "type": "number"
        },
        "value": {
          "type": "number"
        },
        "pctChange": {
          "type": "number"
        }
      },
      "required": [
        "maxAge",
        "reportDate",
        "organization",
        "pctHeld",
        "position",
        "value"
      ],
      "additionalProperties": {}
    },
    "FundPerformance": {
      "type": "object",
      "properties": {
        "maxAge": {
          "type": "number"
        },
        "loadAdjustedReturns": {
          "$ref": "#/definitions/PeriodRange"
        },
        "rankInCategory": {
          "$ref": "#/definitions/PeriodRange"
        },
        "performanceOverview": {
          "$ref": "#/definitions/FundPerformancePerformanceOverview"
        },
        "performanceOverviewCat": {
          "$ref": "#/definitions/FundPerformancePerformanceOverviewCat"
        },
        "trailingReturns": {
          "$ref": "#/definitions/FundPerformanceTrailingReturns"
        },
        "trailingReturnsNav": {
          "$ref": "#/definitions/FundPerformanceTrailingReturns"
        },
        "trailingReturnsCat": {
          "$ref": "#/definitions/FundPerformanceTrailingReturns"
        },
        "annualTotalReturns": {
          "$ref": "#/definitions/FundPerformanceReturns"
        },
        "pastQuarterlyReturns": {
          "$ref": "#/definitions/FundPerformanceReturns"
        },
        "riskOverviewStatistics": {
          "$ref": "#/definitions/FundPerformanceRiskOverviewStats"
        },
        "riskOverviewStatisticsCat": {
          "$ref": "#/definitions/FundPerformanceRiskOverviewStatsCat"
        },
        "fundCategoryName": {
          "type": "string"
        }
      },
      "required": [
        "maxAge",
        "performanceOverview",
        "performanceOverviewCat",
        "trailingReturns",
        "trailingReturnsNav",
        "trailingReturnsCat",
        "annualTotalReturns",
        "pastQuarterlyReturns",
        "riskOverviewStatistics",
        "riskOverviewStatisticsCat"
      ],
      "additionalProperties": {}
    },
    "PeriodRange": {
      "type": "object",
      "properties": {
        "asOfDate": {
          "type": "string",
          "format": "date-time"
        },
        "ytd": {
          "type": "number"
        },
        "oneMonth": {
          "type": "number"
        },
        "threeMonth": {
          "type": "number"
        },
        "oneYear": {
          "type": "number"
        },
        "threeYear": {
          "type": "number"
        },
        "fiveYear": {
          "type": "number"
        },
        "tenYear": {
          "type": "number"
        }
      },
      "additionalProperties": {}
    },
    "FundPerformancePerformanceOverview": {
      "type": "object",
      "properties": {
        "asOfDate": {
          "type": "string",
          "format": "date-time"
        },
        "ytdReturnPct": {
          "type": "number"
        },
        "oneYearTotalReturn": {
          "type": "number"
        },
        "threeYearTotalReturn": {
          "type": "number"
        },
        "fiveYrAvgReturnPct": {
          "type": "number"
        },
        "morningStarReturnRating": {
          "type": "number"
        },
        "numYearsUp": {
          "type": "number"
        },
        "numYearsDown": {
          "type": "number"
        },
        "bestOneYrTotalReturn": {
          "type": "number"
        },
        "worstOneYrTotalReturn": {
          "type": "number"
        },
        "bestThreeYrTotalReturn": {
          "type": "number"
        },
        "worstThreeYrTotalReturn": {
          "type": "number"
        }
      },
      "additionalProperties": {}
    },
    "FundPerformancePerformanceOverviewCat": {
      "type": "object",
      "properties": {
        "ytdReturnPct": {
          "type": "number"
        },
        "fiveYrAvgReturnPct": {
          "type": "number"
        },
        "oneYearTotalReturn": {
          "type": "number"
        },
        "threeYearTotalReturn": {
          "type": "number"
        }
      },
      "additionalProperties": {}
    },
    "FundPerformanceTrailingReturns": {
      "type": "object",
      "properties": {
        "asOfDate": {
          "type": "string",
          "format": "date-time"
        },
        "ytd": {
          "type": "number"
        },
        "oneMonth": {
          "type": "number"
        },
        "threeMonth": {
          "type": "number"
        },
        "oneYear": {
          "type": "number"
        },
        "threeYear": {
          "type": "number"
        },
        "fiveYear": {
          "type": "number"
        },
        "tenYear": {
          "type": "number"
        },
        "lastBullMkt": {
          "type": "number"
        },
        "lastBearMkt": {
          "type": "number"
        }
      },
      "additionalProperties": {
        "anyOf": [
          {},
          {}
        ]
      }
    },
    "FundPerformanceReturns": {
      "type": "object",
      "properties": {
        "returns": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/FundPerformanceReturnsRow"
          }
        },
        "returnsCat": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/FundPerformanceReturnsRow"
          }
        }
      },
      "required": [
        "returns"
      ],
      "additionalProperties": {}
    },
    "FundPerformanceReturnsRow": {
      "type": "object",
      "properties": {
        "year": {
          "type": "number"
        },
        "annualValue": {
          "type": "number"
        },
        "q1": {
          "type": "number"
        },
        "q2": {
          "type": "number"
        },
        "q3": {
          "type": "number"
        },
        "q4": {
          "type": "number"
        }
      },
      "required": [
        "year"
      ],
      "additionalProperties": {}
    },
    "FundPerformanceRiskOverviewStats": {
      "type": "object",
      "properties": {
        "riskStatistics": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/FundPerformanceRiskOverviewStatsRow"
          }
        },
        "riskRating": {
          "type": "number"
        }
      },
      "required": [
        "riskStatistics"
      ],
      "additionalProperties": {}
    },
    "FundPerformanceRiskOverviewStatsRow": {
      "type": "object",
      "properties": {
        "year": {
          "type": "string"
        },
        "alpha": {
          "type": "number"
        },
        "beta": {
          "type": "number"
        },
        "meanAnnualReturn": {
          "type": "number"
        },
        "rSquared": {
          "type": "number"
        },
        "stdDev": {
          "type": "number"
        },
        "sharpeRatio": {
          "type": "number"
        },
        "treynorRatio": {
          "type": "number"
        }
      },
      "required": [
        "year",
        "alpha",
        "beta",
        "meanAnnualReturn",
        "rSquared",
        "sharpeRatio",
        "treynorRatio"
      ],
      "additionalProperties": {}
    },
    "FundPerformanceRiskOverviewStatsCat": {
      "type": "object",
      "properties": {
        "riskStatisticsCat": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/FundPerformanceRiskOverviewStatsRow"
          }
        }
      },
      "required": [
        "riskStatisticsCat"
      ],
      "additionalProperties": {}
    },
    "FundProfile": {
      "type": "object",
      "properties": {
        "maxAge": {
          "type": "number"
        },
        "styleBoxUrl": {
          "type": [
            "null",
            "string"
          ]
        },
        "family": {
          "type": [
            "null",
            "string"
          ]
        },
        "categoryName": {
          "type": [
            "null",
            "string"
          ]
        },
        "legalType": {
          "type": [
            "null",
            "string"
          ]
        },
        "managementInfo": {
          "$ref": "#/definitions/FundProfileManagementInfo"
        },
        "feesExpensesInvestment": {
          "$ref": "#/definitions/FundProfileFeesExpensesInvestment"
        },
        "feesExpensesInvestmentCat": {
          "$ref": "#/definitions/FundProfileFeesExpensesInvestmentCat"
        },
        "brokerages": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/FundProfileBrokerage"
          }
        },
        "initInvestment": {
          "type": "number"
        },
        "initIraInvestment": {
          "type": "number"
        },
        "initAipInvestment": {
          "type": "number"
        },
        "subseqInvestment": {
          "type": "number"
        },
        "subseqIraInvestment": {
          "type": "number"
        },
        "subseqAipInvestment": {
          "type": "number"
        }
      },
      "required": [
        "maxAge",
        "family",
        "categoryName",
        "legalType"
      ],
      "additionalProperties": {}
    },
    "FundProfileManagementInfo": {
      "type": "object",
      "properties": {
        "managerName": {
          "type": [
            "null",
            "string"
          ]
        },
        "managerBio": {
          "type": [
            "null",
            "string"
          ]
        },
        "startdate": {
          "type": "string",
          "format": "date-time"
        }
      },
      "required": [
        "managerName",
        "managerBio"
      ],
      "additionalProperties": {}
    },
    "FundProfileFeesExpensesInvestment": {
      "type": "object",
      "properties": {
        "annualHoldingsTurnover": {
          "type": "number"
        },
        "annualReportExpenseRatio": {
          "type": "number"
        },
        "grossExpRatio": {
          "type": "number"
        },
        "netExpRatio": {
          "type": "number"
        },
        "projectionValues": {
          "type": "object"
        },
        "totalNetAssets": {
          "type": "number"
        }
      },
      "required": [
        "projectionValues"
      ],
      "additionalProperties": {}
    },
    "FundProfileFeesExpensesInvestmentCat": {
      "type": "object",
      "properties": {
        "annualHoldingsTurnover": {
          "type": "number"
        },
        "annualReportExpenseRatio": {
          "type": "number"
        },
        "grossExpRatio": {
          "type": "number"
        },
        "netExpRatio": {
          "type": "number"
        },
        "totalNetAssets": {
          "type": "number"
        },
        "projectionValuesCat": {
          "type": "object"
        }
      },
      "required": [
        "projectionValuesCat"
      ],
      "additionalProperties": {
        "anyOf": [
          {},
          {}
        ]
      }
    },
    "FundProfileBrokerage": {
      "type": "object",
      "additionalProperties": {}
    },
    "IncomeStatementHistory": {
      "type": "object",
      "properties": {
        "incomeStatementHistory": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/IncomeStatementHistoryElement"
          }
        },
        "maxAge": {
          "type": "number"
        }
      },
      "required": [
        "incomeStatementHistory",
        "maxAge"
      ],
      "additionalProperties": {}
    },
    "IncomeStatementHistoryElement": {
      "type": "object",
      "properties": {
        "maxAge": {
          "type": "number"
        },
        "endDate": {
          "type": "string",
          "format": "date-time"
        },
        "totalRevenue": {
          "type": "number"
        },
        "costOfRevenue": {
          "type": "number"
        },
        "grossProfit": {
          "type": "number"
        },
        "researchDevelopment": {
          "type": "null"
        },
        "sellingGeneralAdministrative": {
          "type": "null"
        },
        "nonRecurring": {
          "type": "null"
        },
        "otherOperatingExpenses": {
          "type": "null"
        },
        "totalOperatingExpenses": {
          "type": "number"
        },
        "operatingIncome": {
          "type": "null"
        },
        "totalOtherIncomeExpenseNet": {
          "type": "null"
        },
        "ebit": {
          "type": "number"
        },
        "interestExpense": {
          "type": "null"
        },
        "incomeBeforeTax": {
          "type": "null"
        },
        "incomeTaxExpense": {
          "type": "number"
        },
        "minorityInterest": {
          "type": "null"
        },
        "netIncomeFromContinuingOps": {
          "type": "null"
        },
        "discontinuedOperations": {
          "type": "null"
        },
        "extraordinaryItems": {
          "type": "null"
        },
        "effectOfAccountingCharges": {
          "type": "null"
        },
        "otherItems": {
          "type": "null"
        },
        "netIncome": {
          "type": "number"
        },
        "netIncomeApplicableToCommonShares": {
          "type": "null"
        }
      },
      "required": [
        "maxAge",
        "endDate",
        "totalRevenue",
        "costOfRevenue",
        "grossProfit",
        "researchDevelopment",
        "sellingGeneralAdministrative",
        "nonRecurring",
        "otherOperatingExpenses",
        "totalOperatingExpenses",
        "operatingIncome",
        "totalOtherIncomeExpenseNet",
        "ebit",
        "interestExpense",
        "incomeBeforeTax",
        "incomeTaxExpense",
        "minorityInterest",
        "netIncomeFromContinuingOps",
        "discontinuedOperations",
        "extraordinaryItems",
        "effectOfAccountingCharges",
        "otherItems",
        "netIncome",
        "netIncomeApplicableToCommonShares"
      ],
      "additionalProperties": false
    },
    "IndexTrend": {
      "type": "object",
      "properties": {
        "maxAge": {
          "type": "number"
        },
        "symbol": {
          "type": "string"
        },
        "peRatio": {
          "type": "number"
        },
        "pegRatio": {
          "type": "number"
        },
        "estimates": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/Estimate"
          }
        }
      },
      "required": [
        "maxAge",
        "symbol",
        "estimates"
      ],
      "additionalProperties": {}
    },
    "Estimate": {
      "type": "object",
      "properties": {
        "period": {
          "type": "string"
        },
        "growth": {
          "type": "number"
        }
      },
      "required": [
        "period"
      ],
      "additionalProperties": {}
    },
    "Trend": {
      "type": "object",
      "properties": {
        "maxAge": {
          "type": "number"
        },
        "symbol": {
          "type": "null"
        },
        "estimates": {
          "type": "array",
          "items": {}
        }
      },
      "required": [
        "maxAge",
        "symbol",
        "estimates"
      ],
      "additionalProperties": {}
    },
    "Holders": {
      "type": "object",
      "properties": {
        "holders": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/Holder"
          }
        },
        "maxAge": {
          "type": "number"
        }
      },
      "required": [
        "holders",
        "maxAge"
      ],
      "additionalProperties": {}
    },
    "Holder": {
      "type": "object",
      "properties": {
        "maxAge": {
          "type": "number"
        },
        "name": {
          "type": "string"
        },
        "relation": {
          "anyOf": [
            {
              "$ref": "#/definitions/Relation"
            },
            {
              "type": "string"
            }
          ]
        },
        "url": {
          "type": "string"
        },
        "transactionDescription": {
          "type": "string"
        },
        "latestTransDate": {
          "type": "string",
          "format": "date-time"
        },
        "positionDirect": {
          "type": "number"
        },
        "positionDirectDate": {
          "type": "string",
          "format": "date-time"
        },
        "positionIndirect": {
          "type": "number"
        },
        "positionIndirectDate": {
          "type": "string",
          "format": "date-time"
        },
        "positionSummaryDate": {
          "type": "string",
          "format": "date-time"
        }
      },
      "required": [
        "maxAge",
        "name",
        "relation",
        "url",
        "transactionDescription",
        "latestTransDate"
      ],
      "additionalProperties": {}
    },
    "Relation": {
      "type": "string",
      "enum": [
        "Chairman of the Board",
        "Chief Executive Officer",
        "Chief Financial Officer",
        "Chief Operating Officer",
        "Chief Technology Officer",
        "Director",
        "Director (Independent)",
        "",
        "General Counsel",
        "Independent Non-Executive Director",
        "Officer",
        "President"
      ]
    },
    "InsiderTransactions": {
      "type": "object",
      "properties": {
        "transactions": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/Transaction"
          }
        },
        "maxAge": {
          "type": "number"
        }
      },
      "required": [
        "transactions",
        "maxAge"
      ],
      "additionalProperties": {}
    },
    "Transaction": {
      "type": "object",
      "properties": {
        "maxAge": {
          "type": "number"
        },
        "shares": {
          "type": "number"
        },
        "filerUrl": {
          "type": "string"
        },
        "transactionText": {
          "type": "string"
        },
        "filerName": {
          "type": "string"
        },
        "filerRelation": {
          "anyOf": [
            {
              "$ref": "#/definitions/Relation"
            },
            {
              "type": "string"
            }
          ]
        },
        "moneyText": {
          "type": "string"
        },
        "startDate": {
          "type": "string",
          "format": "date-time"
        },
        "ownership": {
          "anyOf": [
            {
              "$ref": "#/definitions/OwnershipEnum"
            },
            {
              "type": "string"
            }
          ]
        },
        "value": {
          "type": "number"
        }
      },
      "required": [
        "maxAge",
        "shares",
        "filerUrl",
        "transactionText",
        "filerName",
        "filerRelation",
        "moneyText",
        "startDate",
        "ownership"
      ],
      "additionalProperties": {}
    },
    "OwnershipEnum": {
      "type": "string",
      "enum": [
        "D",
        "I"
      ]
    },
    "MajorHoldersBreakdown": {
      "type": "object",
      "properties": {
        "maxAge": {
          "type": "number"
        },
        "insidersPercentHeld": {
          "type": "number"
        },
        "institutionsPercentHeld": {
          "type": "number"
        },
        "institutionsFloatPercentHeld": {
          "type": "number"
        },
        "institutionsCount": {
          "type": "number"
        }
      },
      "required": [
        "maxAge"
      ],
      "additionalProperties": {}
    },
    "NetSharePurchaseActivity": {
      "type": "object",
      "properties": {
        "maxAge": {
          "type": "number"
        },
        "period": {
          "type": "string"
        },
        "buyInfoCount": {
          "type": "number"
        },
        "buyInfoShares": {
          "type": "number"
        },
        "buyPercentInsiderShares": {
          "type": "number"
        },
        "sellInfoCount": {
          "type": "number"
        },
        "sellInfoShares": {
          "type": "number"
        },
        "sellPercentInsiderShares": {
          "type": "number"
        },
        "netInfoCount": {
          "type": "number"
        },
        "netInfoShares": {
          "type": "number"
        },
        "netPercentInsiderShares": {
          "type": "number"
        },
        "totalInsiderShares": {
          "type": "number"
        }
      },
      "required": [
        "maxAge",
        "period",
        "buyInfoCount",
        "buyInfoShares",
        "sellInfoCount",
        "netInfoCount",
        "netInfoShares",
        "totalInsiderShares"
      ],
      "additionalProperties": {}
    },
    "Price": {
      "type": "object",
      "properties": {
        "averageDailyVolume10Day": {
          "type": "number"
        },
        "averageDailyVolume3Month": {
          "type": "number"
        },
        "exchange": {
          "type": "string"
        },
        "exchangeName": {
          "type": "string"
        },
        "exchangeDataDelayedBy": {
          "type": "number"
        },
        "maxAge": {
          "type": "number"
        },
        "postMarketChangePercent": {
          "type": "number"
        },
        "postMarketChange": {
          "type": "number"
        },
        "postMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "postMarketPrice": {
          "type": "number"
        },
        "postMarketSource": {
          "type": "string"
        },
        "preMarketChangePercent": {
          "type": "number"
        },
        "preMarketChange": {
          "type": "number"
        },
        "preMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "preMarketPrice": {
          "type": "number"
        },
        "preMarketSource": {
          "type": "string"
        },
        "priceHint": {
          "type": "number"
        },
        "regularMarketChangePercent": {
          "type": "number"
        },
        "regularMarketChange": {
          "type": "number"
        },
        "regularMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "regularMarketPrice": {
          "type": "number"
        },
        "regularMarketDayHigh": {
          "type": "number"
        },
        "regularMarketDayLow": {
          "type": "number"
        },
        "regularMarketVolume": {
          "type": "number"
        },
        "regularMarketPreviousClose": {
          "type": "number"
        },
        "regularMarketSource": {
          "type": "string"
        },
        "regularMarketOpen": {
          "type": "number"
        },
        "quoteSourceName": {
          "type": "string"
        },
        "quoteType": {
          "type": "string"
        },
        "symbol": {
          "type": "string"
        },
        "underlyingSymbol": {
          "type": [
            "null",
            "string"
          ]
        },
        "shortName": {
          "type": [
            "null",
            "string"
          ]
        },
        "longName": {
          "type": [
            "null",
            "string"
          ]
        },
        "lastMarket": {
          "type": [
            "null",
            "string"
          ]
        },
        "marketState": {
          "type": "string"
        },
        "marketCap": {
          "type": "number"
        },
        "currency": {
          "type": "string"
        },
        "currencySymbol": {
          "type": "string"
        },
        "fromCurrency": {
          "type": [
            "string",
            "null"
          ]
        },
        "toCurrency": {
          "type": [
            "string",
            "null"
          ]
        },
        "volume24Hr": {
          "type": "number"
        },
        "volumeAllCurrencies": {
          "type": "number"
        },
        "circulatingSupply": {
          "type": "number"
        },
        "expireDate": {
          "type": "string",
          "format": "date-time"
        },
        "openInterest": {
          "type": "number"
        }
      },
      "required": [
        "maxAge",
        "priceHint",
        "quoteType",
        "symbol",
        "underlyingSymbol",
        "shortName",
        "longName",
        "lastMarket",
        "fromCurrency"
      ],
      "additionalProperties": {}
    },
    "QuoteType": {
      "type": "object",
      "properties": {
        "exchange": {
          "type": "string"
        },
        "quoteType": {
          "type": "string"
        },
        "symbol": {
          "type": "string"
        },
        "underlyingSymbol": {
          "type": "string"
        },
        "shortName": {
          "type": [
            "null",
            "string"
          ]
        },
        "longName": {
          "type": [
            "null",
            "string"
          ]
        },
        "firstTradeDateEpochUtc": {
          "anyOf": [
            {
              "type": "null"
            },
            {
              "type": "string",
              "format": "date-time"
            }
          ]
        },
        "timeZoneFullName": {
          "type": "string"
        },
        "timeZoneShortName": {
          "type": "string"
        },
        "uuid": {
          "type": "string"
        },
        "messageBoardId": {
          "type": [
            "null",
            "string"
          ]
        },
        "gmtOffSetMilliseconds": {
          "type": "number"
        },
        "maxAge": {
          "type": "number"
        }
      },
      "required": [
        "exchange",
        "quoteType",
        "symbol",
        "underlyingSymbol",
        "shortName",
        "timeZoneFullName",
        "timeZoneShortName",
        "uuid",
        "gmtOffSetMilliseconds",
        "maxAge"
      ],
      "additionalProperties": {}
    },
    "RecommendationTrend": {
      "type": "object",
      "properties": {
        "trend": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/RecommendationTrendTrend"
          }
        },
        "maxAge": {
          "type": "number"
        }
      },
      "required": [
        "trend",
        "maxAge"
      ],
      "additionalProperties": {}
    },
    "RecommendationTrendTrend": {
      "type": "object",
      "properties": {
        "period": {
          "type": "string"
        },
        "strongBuy": {
          "type": "number"
        },
        "buy": {
          "type": "number"
        },
        "hold": {
          "type": "number"
        },
        "sell": {
          "type": "number"
        },
        "strongSell": {
          "type": "number"
        }
      },
      "required": [
        "period",
        "strongBuy",
        "buy",
        "hold",
        "sell",
        "strongSell"
      ],
      "additionalProperties": {}
    },
    "SECFilings": {
      "type": "object",
      "properties": {
        "filings": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/Filing"
          }
        },
        "maxAge": {
          "type": "number"
        }
      },
      "required": [
        "filings",
        "maxAge"
      ],
      "additionalProperties": {}
    },
    "Filing": {
      "type": "object",
      "properties": {
        "date": {
          "type": "string"
        },
        "epochDate": {
          "type": "string",
          "format": "date-time"
        },
        "type": {
          "type": "string",
          "enum": [
            "10-K",
            "10-Q",
            "8-K",
            "8-K/A",
            "10-K/A",
            "10-Q/A",
            "SD",
            "PX14A6G",
            "SC 13G/A",
            "DEFA14A",
            "25-NSE",
            "S-8 POS",
            "6-K",
            "F-3ASR",
            "SC 13D/A",
            "20-F",
            "425",
            "SC14D9C",
            "SC 13G",
            "S-8",
            "DEF 14A",
            "F-10",
            "S-3ASR",
            "CORRESP",
            "PX14A6N",
            "N-PX",
            "ARS",
            "PRE 14A",
            "F-6EF",
            "S-3/A",
            "S-3",
            "POS AM",
            "IRANNOTICE",
            "20-F/A",
            "11-K",
            "DEFR14A",
            "S4",
            "RW",
            "S-4/A",
            "S-4",
            "S-4MEF",
            "PRER14A",
            "8-A12B",
            "D",
            "SC 13D"
          ]
        },
        "title": {
          "type": "string"
        },
        "edgarUrl": {
          "type": "string"
        },
        "maxAge": {
          "type": "number"
        },
        "url": {
          "type": "string"
        },
        "exhibits": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "type": {
                "type": "string"
              },
              "url": {
                "type": "string"
              },
              "downloadUrl": {
                "type": "string"
              }
            },
            "required": [
              "type",
              "url"
            ],
            "additionalProperties": false
          }
        }
      },
      "required": [
        "date",
        "epochDate",
        "type",
        "title",
        "edgarUrl",
        "maxAge"
      ],
      "additionalProperties": {}
    },
    "SummaryDetail": {
      "type": "object",
      "properties": {
        "maxAge": {
          "type": "number"
        },
        "priceHint": {
          "type": "number"
        },
        "previousClose": {
          "type": "number"
        },
        "open": {
          "type": "number"
        },
        "dayLow": {
          "type": "number"
        },
        "dayHigh": {
          "type": "number"
        },
        "regularMarketPreviousClose": {
          "type": "number"
        },
        "regularMarketOpen": {
          "type": "number"
        },
        "regularMarketDayLow": {
          "type": "number"
        },
        "regularMarketDayHigh": {
          "type": "number"
        },
        "regularMarketVolume": {
          "type": "number"
        },
        "dividendRate": {
          "type": "number"
        },
        "dividendYield": {
          "type": "number"
        },
        "exDividendDate": {
          "type": "string",
          "format": "date-time"
        },
        "payoutRatio": {
          "type": "number"
        },
        "fiveYearAvgDividendYield": {
          "type": "number"
        },
        "beta": {
          "type": "number"
        },
        "trailingPE": {
          "type": "number"
        },
        "forwardPE": {
          "type": "number"
        },
        "volume": {
          "type": "number"
        },
        "averageVolume": {
          "type": "number"
        },
        "averageVolume10days": {
          "type": "number"
        },
        "averageDailyVolume10Day": {
          "type": "number"
        },
        "bid": {
          "type": "number"
        },
        "ask": {
          "type": "number"
        },
        "bidSize": {
          "type": "number"
        },
        "askSize": {
          "type": "number"
        },
        "marketCap": {
          "type": "number"
        },
        "fiftyDayAverage": {
          "type": "number"
        },
        "fiftyTwoWeekLow": {
          "type": "number"
        },
        "fiftyTwoWeekHigh": {
          "type": "number"
        },
        "twoHundredDayAverage": {
          "type": "number"
        },
        "priceToSalesTrailing12Months": {
          "type": "number"
        },
        "trailingAnnualDividendRate": {
          "type": "number"
        },
        "trailingAnnualDividendYield": {
          "type": "number"
        },
        "currency": {
          "type": "string"
        },
        "algorithm": {
          "type": "null"
        },
        "tradeable": {
          "type": "boolean"
        },
        "yield": {
          "type": "number"
        },
        "totalAssets": {
          "type": "number"
        },
        "navPrice": {
          "type": "number"
        },
        "ytdReturn": {
          "type": "number"
        },
        "fromCurrency": {
          "type": [
            "string",
            "null"
          ]
        },
        "toCurrency": {
          "type": [
            "string",
            "null"
          ]
        },
        "lastMarket": {
          "type": [
            "string",
            "null"
          ]
        },
        "volume24Hr": {
          "type": "number"
        },
        "volumeAllCurrencies": {
          "type": "number"
        },
        "circulatingSupply": {
          "type": "number"
        },
        "startDate": {
          "type": "string",
          "format": "date-time"
        },
        "coinMarketCapLink": {
          "type": [
            "string",
            "null"
          ]
        },
        "expireDate": {
          "type": "string",
          "format": "date-time"
        },
        "openInterest": {
          "type": "number"
        },
        "averageMaturity": {
          "type": "number"
        }
      },
      "required": [
        "maxAge",
        "priceHint",
        "currency",
        "algorithm",
        "tradeable",
        "fromCurrency",
        "lastMarket"
      ],
      "additionalProperties": {}
    },
    "SummaryProfile": {
      "type": "object",
      "properties": {
        "address1": {
          "type": "string"
        },
        "address2": {
          "type": "string"
        },
        "address3": {
          "type": "string"
        },
        "city": {
          "type": "string"
        },
        "state": {
          "type": "string"
        },
        "zip": {
          "type": "string"
        },
        "country": {
          "type": "string"
        },
        "phone": {
          "type": "string"
        },
        "fax": {
          "type": "string"
        },
        "website": {
          "type": "string"
        },
        "industry": {
          "type": "string"
        },
        "industryDisp": {
          "type": "string"
        },
        "sector": {
          "type": "string"
        },
        "sectorDisp": {
          "type": "string"
        },
        "longBusinessSummary": {
          "type": "string"
        },
        "fullTimeEmployees": {
          "type": "number"
        },
        "companyOfficers": {
          "type": "array",
          "items": {}
        },
        "maxAge": {
          "type": "number"
        },
        "twitter": {
          "type": "string"
        },
        "industryKey": {
          "type": "string"
        },
        "sectorKey": {
          "type": "string"
        },
        "irWebsite": {
          "type": "string"
        },
        "executiveTeam": {
          "type": "array",
          "items": {}
        },
        "name": {
          "type": "string"
        },
        "startDate": {
          "type": "string",
          "format": "date-time"
        },
        "description": {
          "type": "string"
        }
      },
      "required": [
        "companyOfficers",
        "maxAge"
      ],
      "additionalProperties": {}
    },
    "TopHoldings": {
      "type": "object",
      "properties": {
        "maxAge": {
          "type": "number"
        },
        "stockPosition": {
          "type": "number"
        },
        "bondPosition": {
          "type": "number"
        },
        "holdings": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/TopHoldingsHolding"
          }
        },
        "equityHoldings": {
          "$ref": "#/definitions/TopHoldingsEquityHoldings"
        },
        "bondHoldings": {
          "type": "object"
        },
        "bondRatings": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/TopHoldingsBondRating"
          }
        },
        "sectorWeightings": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/TopHoldingsSectorWeighting"
          }
        },
        "cashPosition": {
          "type": "number"
        },
        "otherPosition": {
          "type": "number"
        },
        "preferredPosition": {
          "type": "number"
        },
        "convertiblePosition": {
          "type": "number"
        }
      },
      "required": [
        "maxAge",
        "holdings",
        "equityHoldings",
        "bondHoldings",
        "bondRatings",
        "sectorWeightings"
      ],
      "additionalProperties": {}
    },
    "TopHoldingsHolding": {
      "type": "object",
      "properties": {
        "symbol": {
          "type": "string"
        },
        "holdingName": {
          "type": "string"
        },
        "holdingPercent": {
          "type": "number"
        }
      },
      "required": [
        "symbol",
        "holdingName",
        "holdingPercent"
      ],
      "additionalProperties": {}
    },
    "TopHoldingsEquityHoldings": {
      "type": "object",
      "properties": {
        "medianMarketCap": {
          "type": "number"
        },
        "medianMarketCapCat": {
          "type": "number"
        },
        "priceToBook": {
          "type": "number"
        },
        "priceToBookCat": {
          "type": "number"
        },
        "priceToCashflow": {
          "type": "number"
        },
        "priceToCashflowCat": {
          "type": "number"
        },
        "priceToEarnings": {
          "type": "number"
        },
        "priceToEarningsCat": {
          "type": "number"
        },
        "priceToSales": {
          "type": "number"
        },
        "priceToSalesCat": {
          "type": "number"
        },
        "threeYearEarningsGrowth": {
          "type": "number"
        },
        "threeYearEarningsGrowthCat": {
          "type": "number"
        }
      },
      "required": [
        "priceToBook",
        "priceToCashflow",
        "priceToEarnings",
        "priceToSales"
      ],
      "additionalProperties": {}
    },
    "TopHoldingsBondRating": {
      "type": "object",
      "properties": {
        "a": {
          "type": "number"
        },
        "aa": {
          "type": "number"
        },
        "aaa": {
          "type": "number"
        },
        "other": {
          "type": "number"
        },
        "b": {
          "type": "number"
        },
        "bb": {
          "type": "number"
        },
        "bbb": {
          "type": "number"
        },
        "below_b": {
          "type": "number"
        },
        "us_government": {
          "type": "number"
        }
      },
      "additionalProperties": {}
    },
    "TopHoldingsSectorWeighting": {
      "type": "object",
      "properties": {
        "realestate": {
          "type": "number"
        },
        "consumer_cyclical": {
          "type": "number"
        },
        "basic_materials": {
          "type": "number"
        },
        "consumer_defensive": {
          "type": "number"
        },
        "technology": {
          "type": "number"
        },
        "communication_services": {
          "type": "number"
        },
        "financial_services": {
          "type": "number"
        },
        "utilities": {
          "type": "number"
        },
        "industrials": {
          "type": "number"
        },
        "energy": {
          "type": "number"
        },
        "healthcare": {
          "type": "number"
        }
      },
      "additionalProperties": {}
    },
    "UpgradeDowngradeHistory": {
      "type": "object",
      "properties": {
        "history": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/UpgradeDowngradeHistoryHistory"
          }
        },
        "maxAge": {
          "type": "number"
        }
      },
      "required": [
        "history",
        "maxAge"
      ],
      "additionalProperties": {}
    },
    "UpgradeDowngradeHistoryHistory": {
      "type": "object",
      "properties": {
        "epochGradeDate": {
          "type": "string",
          "format": "date-time"
        },
        "firm": {
          "type": "string"
        },
        "toGrade": {
          "$ref": "#/definitions/Grade"
        },
        "fromGrade": {
          "$ref": "#/definitions/Grade"
        },
        "action": {
          "$ref": "#/definitions/Action"
        }
      },
      "required": [
        "epochGradeDate",
        "firm",
        "toGrade",
        "action"
      ],
      "additionalProperties": {}
    },
    "Grade": {
      "type": "string",
      "enum": [
        "Accumulate",
        "Add",
        "Average",
        "Below Average",
        "Buy",
        "Conviction Buy",
        "",
        "Equal-Weight",
        "Fair Value",
        "Equal-weight",
        "Long-term Buy",
        "Hold",
        "Long-Term Buy",
        "Market Outperform",
        "Market Perform",
        "Mixed",
        "Negative",
        "Neutral",
        "In-Line",
        "Outperform",
        "Overweight",
        "Peer Perform",
        "Perform",
        "Positive",
        "Reduce",
        "Sector Outperform",
        "Sector Perform",
        "Sector Weight",
        "Sell",
        "Strong Buy",
        "Top Pick",
        "Underperform",
        "Underperformer",
        "Underweight",
        "Trim",
        "Above Average",
        "In-line",
        "Outperformer",
        "OVerweight",
        "Cautious",
        "Market Weight",
        "Sector Underperform",
        "Market Underperform",
        "Peer perform",
        "Gradually Accumulate",
        "Action List Buy",
        "Performer",
        "Sector Performer",
        "Speculative Buy",
        "Strong Sell",
        "Speculative Hold",
        "Not Rated",
        "Hold Neutral",
        "Developing",
        "buy",
        "HOld",
        "Trading Sell",
        "Tender",
        "market perform",
        "BUy"
      ]
    },
    "Action": {
      "type": "string",
      "enum": [
        "down",
        "init",
        "main",
        "reit",
        "up"
      ]
    },
    "QuoteSummaryModules": {
      "type": "string",
      "enum": [
        "assetProfile",
        "balanceSheetHistory",
        "balanceSheetHistoryQuarterly",
        "calendarEvents",
        "cashflowStatementHistory",
        "cashflowStatementHistoryQuarterly",
        "defaultKeyStatistics",
        "earnings",
        "earningsHistory",
        "earningsTrend",
        "financialData",
        "fundOwnership",
        "fundPerformance",
        "fundProfile",
        "incomeStatementHistory",
        "incomeStatementHistoryQuarterly",
        "indexTrend",
        "industryTrend",
        "insiderHolders",
        "insiderTransactions",
        "institutionOwnership",
        "majorDirectHolders",
        "majorHoldersBreakdown",
        "netSharePurchaseActivity",
        "price",
        "quoteType",
        "recommendationTrend",
        "secFilings",
        "sectorTrend",
        "summaryDetail",
        "summaryProfile",
        "topHoldings",
        "upgradeDowngradeHistory"
      ]
    },
    "QuoteSummaryOptions": {
      "type": "object",
      "properties": {
        "formatted": {
          "type": "boolean"
        },
        "modules": {
          "anyOf": [
            {
              "type": "array",
              "items": {
                "$ref": "#/definitions/QuoteSummaryModules"
              }
            },
            {
              "type": "string",
              "const": "all"
            }
          ]
        }
      },
      "additionalProperties": false
    },
    "quoteSummary": {}
  }
};
const resultsSchema = {
  "definitions": {
    "QuoteSummaryResult": {
      "type": "object",
      "properties": {
        "assetProfile": {
          "$ref": "#/definitions/AssetProfile"
        },
        "balanceSheetHistory": {
          "$ref": "#/definitions/BalanceSheetHistory"
        },
        "balanceSheetHistoryQuarterly": {
          "$ref": "#/definitions/BalanceSheetHistory"
        },
        "calendarEvents": {
          "$ref": "#/definitions/CalendarEvents"
        },
        "cashflowStatementHistory": {
          "$ref": "#/definitions/CashflowStatementHistory"
        },
        "cashflowStatementHistoryQuarterly": {
          "$ref": "#/definitions/CashflowStatementHistory"
        },
        "defaultKeyStatistics": {
          "$ref": "#/definitions/DefaultKeyStatistics"
        },
        "earnings": {
          "$ref": "#/definitions/QuoteSummaryEarnings"
        },
        "earningsHistory": {
          "$ref": "#/definitions/EarningsHistory"
        },
        "earningsTrend": {
          "$ref": "#/definitions/EarningsTrend"
        },
        "financialData": {
          "$ref": "#/definitions/FinancialData"
        },
        "fundOwnership": {
          "$ref": "#/definitions/Ownership"
        },
        "fundPerformance": {
          "$ref": "#/definitions/FundPerformance"
        },
        "fundProfile": {
          "$ref": "#/definitions/FundProfile"
        },
        "incomeStatementHistory": {
          "$ref": "#/definitions/IncomeStatementHistory"
        },
        "incomeStatementHistoryQuarterly": {
          "$ref": "#/definitions/IncomeStatementHistory"
        },
        "indexTrend": {
          "$ref": "#/definitions/IndexTrend"
        },
        "industryTrend": {
          "$ref": "#/definitions/Trend"
        },
        "insiderHolders": {
          "$ref": "#/definitions/Holders"
        },
        "insiderTransactions": {
          "$ref": "#/definitions/InsiderTransactions"
        },
        "institutionOwnership": {
          "$ref": "#/definitions/Ownership"
        },
        "majorDirectHolders": {
          "$ref": "#/definitions/Holders"
        },
        "majorHoldersBreakdown": {
          "$ref": "#/definitions/MajorHoldersBreakdown"
        },
        "netSharePurchaseActivity": {
          "$ref": "#/definitions/NetSharePurchaseActivity"
        },
        "price": {
          "$ref": "#/definitions/Price"
        },
        "quoteType": {
          "$ref": "#/definitions/QuoteType"
        },
        "recommendationTrend": {
          "$ref": "#/definitions/RecommendationTrend"
        },
        "secFilings": {
          "$ref": "#/definitions/SECFilings"
        },
        "sectorTrend": {
          "$ref": "#/definitions/Trend"
        },
        "summaryDetail": {
          "$ref": "#/definitions/SummaryDetail"
        },
        "summaryProfile": {
          "$ref": "#/definitions/SummaryProfile"
        },
        "topHoldings": {
          "$ref": "#/definitions/TopHoldings"
        },
        "upgradeDowngradeHistory": {
          "$ref": "#/definitions/UpgradeDowngradeHistory"
        }
      },
      "additionalProperties": {}
    },
    "AssetProfile": {
      "type": "object",
      "properties": {
        "maxAge": {
          "type": "number"
        },
        "address1": {
          "type": "string"
        },
        "address2": {
          "type": "string"
        },
        "address3": {
          "type": "string"
        },
        "city": {
          "type": "string"
        },
        "state": {
          "type": "string"
        },
        "zip": {
          "type": "string"
        },
        "country": {
          "type": "string"
        },
        "phone": {
          "type": "string"
        },
        "fax": {
          "type": "string"
        },
        "website": {
          "type": "string"
        },
        "industry": {
          "type": "string"
        },
        "industryDisp": {
          "type": "string"
        },
        "industryKey": {
          "type": "string"
        },
        "industrySymbol": {
          "type": "string"
        },
        "sector": {
          "type": "string"
        },
        "sectorDisp": {
          "type": "string"
        },
        "sectorKey": {
          "type": "string"
        },
        "longBusinessSummary": {
          "type": "string"
        },
        "fullTimeEmployees": {
          "type": "number"
        },
        "companyOfficers": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/CompanyOfficer"
          }
        },
        "auditRisk": {
          "type": "number"
        },
        "boardRisk": {
          "type": "number"
        },
        "compensationRisk": {
          "type": "number"
        },
        "shareHolderRightsRisk": {
          "type": "number"
        },
        "overallRisk": {
          "type": "number"
        },
        "governanceEpochDate": {
          "type": "string",
          "format": "date-time"
        },
        "compensationAsOfEpochDate": {
          "type": "string",
          "format": "date-time"
        },
        "name": {
          "type": "string"
        },
        "startDate": {
          "type": "string",
          "format": "date-time"
        },
        "description": {
          "type": "string"
        },
        "twitter": {
          "type": "string"
        },
        "irWebsite": {
          "type": "string"
        },
        "executiveTeam": {
          "type": "array",
          "items": {}
        },
        "blockNumber": {
          "type": "number"
        },
        "blockReward": {
          "type": "number"
        },
        "blockRewardReduction": {
          "type": "string"
        },
        "netHashesPerSecond": {
          "type": "number"
        },
        "whitepaper": {
          "type": "string"
        }
      },
      "required": [
        "maxAge",
        "companyOfficers"
      ],
      "additionalProperties": {}
    },
    "CompanyOfficer": {
      "type": "object",
      "properties": {
        "maxAge": {
          "type": "number"
        },
        "name": {
          "type": "string"
        },
        "age": {
          "type": "number"
        },
        "title": {
          "type": "string"
        },
        "yearBorn": {
          "type": "number"
        },
        "fiscalYear": {
          "type": "number"
        },
        "totalPay": {
          "type": "number"
        },
        "exercisedValue": {
          "type": "number"
        },
        "unexercisedValue": {
          "type": "number"
        }
      },
      "required": [
        "maxAge",
        "name",
        "title"
      ],
      "additionalProperties": {}
    },
    "BalanceSheetHistory": {
      "type": "object",
      "properties": {
        "balanceSheetStatements": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/BalanceSheetStatement"
          }
        },
        "maxAge": {
          "type": "number"
        }
      },
      "required": [
        "balanceSheetStatements",
        "maxAge"
      ],
      "additionalProperties": {}
    },
    "BalanceSheetStatement": {
      "type": "object",
      "properties": {
        "maxAge": {
          "type": "number"
        },
        "endDate": {
          "type": "string",
          "format": "date-time"
        }
      },
      "required": [
        "maxAge",
        "endDate"
      ],
      "additionalProperties": false
    },
    "CalendarEvents": {
      "type": "object",
      "properties": {
        "maxAge": {
          "type": "number"
        },
        "earnings": {
          "$ref": "#/definitions/CalendarEventsEarnings"
        },
        "exDividendDate": {
          "type": "string",
          "format": "date-time"
        },
        "dividendDate": {
          "type": "string",
          "format": "date-time"
        }
      },
      "required": [
        "maxAge",
        "earnings"
      ],
      "additionalProperties": {}
    },
    "CalendarEventsEarnings": {
      "type": "object",
      "properties": {
        "earningsCallDate": {
          "type": "array",
          "items": {
            "type": "string",
            "format": "date-time"
          }
        },
        "isEarningsDateEstimate": {
          "type": "boolean"
        },
        "earningsDate": {
          "type": "array",
          "items": {
            "type": "string",
            "format": "date-time"
          }
        },
        "earningsAverage": {
          "type": "number"
        },
        "earningsLow": {
          "type": "number"
        },
        "earningsHigh": {
          "type": "number"
        },
        "revenueAverage": {
          "type": "number"
        },
        "revenueLow": {
          "type": "number"
        },
        "revenueHigh": {
          "type": "number"
        },
        "defaultMethodology": {
          "type": "string",
          "enum": [
            "nongaap",
            "gaap"
          ]
        }
      },
      "required": [
        "earningsCallDate",
        "earningsDate"
      ],
      "additionalProperties": {}
    },
    "CashflowStatementHistory": {
      "type": "object",
      "properties": {
        "cashflowStatements": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/CashflowStatement"
          }
        },
        "maxAge": {
          "type": "number"
        }
      },
      "required": [
        "cashflowStatements",
        "maxAge"
      ],
      "additionalProperties": false
    },
    "CashflowStatement": {
      "type": "object",
      "properties": {
        "maxAge": {
          "type": "number"
        },
        "endDate": {
          "type": "string",
          "format": "date-time"
        },
        "netIncome": {
          "type": "number"
        }
      },
      "required": [
        "maxAge",
        "endDate",
        "netIncome"
      ],
      "additionalProperties": false
    },
    "DefaultKeyStatistics": {
      "type": "object",
      "properties": {
        "maxAge": {
          "type": "number"
        },
        "priceHint": {
          "type": "number"
        },
        "enterpriseValue": {
          "type": "number"
        },
        "forwardPE": {
          "type": "number"
        },
        "profitMargins": {
          "type": "number"
        },
        "floatShares": {
          "type": "number"
        },
        "sharesOutstanding": {
          "type": "number"
        },
        "sharesShort": {
          "type": "number"
        },
        "sharesShortPriorMonth": {
          "type": "string",
          "format": "date-time"
        },
        "sharesShortPreviousMonthDate": {
          "type": "string",
          "format": "date-time"
        },
        "dateShortInterest": {
          "type": "string",
          "format": "date-time"
        },
        "sharesPercentSharesOut": {
          "type": "number"
        },
        "heldPercentInsiders": {
          "type": "number"
        },
        "heldPercentInstitutions": {
          "type": "number"
        },
        "shortRatio": {
          "type": "number"
        },
        "shortPercentOfFloat": {
          "type": "number"
        },
        "beta": {
          "type": "number"
        },
        "impliedSharesOutstanding": {
          "type": "number"
        },
        "category": {
          "type": [
            "null",
            "string"
          ]
        },
        "bookValue": {
          "type": "number"
        },
        "priceToBook": {
          "type": "number"
        },
        "fundFamily": {
          "type": [
            "null",
            "string"
          ]
        },
        "legalType": {
          "type": [
            "null",
            "string"
          ]
        },
        "lastFiscalYearEnd": {
          "type": "string",
          "format": "date-time"
        },
        "nextFiscalYearEnd": {
          "type": "string",
          "format": "date-time"
        },
        "mostRecentQuarter": {
          "type": "string",
          "format": "date-time"
        },
        "earningsQuarterlyGrowth": {
          "type": "number"
        },
        "netIncomeToCommon": {
          "type": "number"
        },
        "trailingEps": {
          "type": "number"
        },
        "forwardEps": {
          "type": "number"
        },
        "pegRatio": {
          "type": "number"
        },
        "lastSplitFactor": {
          "type": [
            "null",
            "string"
          ]
        },
        "lastSplitDate": {
          "type": "number"
        },
        "enterpriseToRevenue": {
          "type": "number"
        },
        "enterpriseToEbitda": {
          "type": "number"
        },
        "52WeekChange": {
          "type": "number"
        },
        "SandP52WeekChange": {
          "type": "number"
        },
        "lastDividendValue": {
          "type": "number"
        },
        "lastDividendDate": {
          "type": "string",
          "format": "date-time"
        },
        "ytdReturn": {
          "type": "number"
        },
        "beta3Year": {
          "type": "number"
        },
        "totalAssets": {
          "type": "number"
        },
        "yield": {
          "type": "number"
        },
        "fundInceptionDate": {
          "type": "string",
          "format": "date-time"
        },
        "threeYearAverageReturn": {
          "type": "number"
        },
        "fiveYearAverageReturn": {
          "type": "number"
        },
        "morningStarOverallRating": {
          "type": "number"
        },
        "morningStarRiskRating": {
          "type": "number"
        },
        "annualReportExpenseRatio": {
          "type": "number"
        },
        "lastCapGain": {
          "type": "number"
        },
        "annualHoldingsTurnover": {
          "type": "number"
        },
        "latestShareClass": {},
        "leadInvestor": {}
      },
      "required": [
        "maxAge",
        "priceHint",
        "category",
        "fundFamily",
        "legalType",
        "lastSplitFactor"
      ],
      "additionalProperties": {}
    },
    "QuoteSummaryEarnings": {
      "type": "object",
      "properties": {
        "maxAge": {
          "type": "number"
        },
        "earningsChart": {
          "$ref": "#/definitions/EarningsChart"
        },
        "financialsChart": {
          "$ref": "#/definitions/FinancialsChart"
        },
        "financialCurrency": {
          "type": "string"
        },
        "defaultMethodology": {
          "type": "string",
          "enum": [
            "nongaap",
            "gaap"
          ]
        }
      },
      "required": [
        "maxAge",
        "earningsChart",
        "financialsChart",
        "defaultMethodology"
      ],
      "additionalProperties": {}
    },
    "EarningsChart": {
      "type": "object",
      "properties": {
        "quarterly": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/EarningsChartQuarterly"
          }
        },
        "currentQuarterEstimate": {
          "type": "number"
        },
        "currentQuarterEstimateDate": {
          "type": "string"
        },
        "currentQuarterEstimateYear": {
          "type": "number"
        },
        "earningsDate": {
          "type": "array",
          "items": {
            "type": "string",
            "format": "date-time"
          }
        },
        "isEarningsDateEstimate": {
          "type": "boolean"
        },
        "currentCalendarQuarter": {
          "type": "string"
        },
        "currentFiscalQuarter": {
          "type": "string"
        },
        "currentPeriodEndDate": {
          "type": "string",
          "format": "date-time"
        }
      },
      "required": [
        "quarterly",
        "earningsDate"
      ],
      "additionalProperties": {}
    },
    "EarningsChartQuarterly": {
      "type": "object",
      "properties": {
        "date": {
          "type": "string"
        },
        "actual": {
          "type": "number"
        },
        "estimate": {
          "type": "number"
        },
        "fiscalQuarter": {
          "type": "string"
        },
        "calendarQuarter": {
          "type": "string"
        },
        "difference": {
          "type": "string"
        },
        "surprisePct": {
          "type": "string"
        },
        "periodEndDate": {
          "type": "string",
          "format": "date-time"
        },
        "reportedDate": {
          "type": "string",
          "format": "date-time"
        }
      },
      "required": [
        "date",
        "estimate",
        "fiscalQuarter",
        "calendarQuarter",
        "difference",
        "surprisePct",
        "periodEndDate",
        "reportedDate"
      ],
      "additionalProperties": {}
    },
    "FinancialsChart": {
      "type": "object",
      "properties": {
        "yearly": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/Yearly"
          }
        },
        "quarterly": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/FinancialsChartQuarterly"
          }
        }
      },
      "required": [
        "yearly",
        "quarterly"
      ],
      "additionalProperties": {}
    },
    "Yearly": {
      "type": "object",
      "properties": {
        "date": {
          "type": "number"
        },
        "revenue": {
          "type": "number"
        },
        "earnings": {
          "type": "number"
        },
        "profitMargin": {
          "type": "number"
        }
      },
      "required": [
        "date",
        "revenue",
        "earnings",
        "profitMargin"
      ],
      "additionalProperties": {}
    },
    "FinancialsChartQuarterly": {
      "type": "object",
      "properties": {
        "date": {
          "type": "string"
        },
        "revenue": {
          "type": "number"
        },
        "earnings": {
          "type": "number"
        },
        "fiscalQuarter": {
          "type": "string"
        },
        "profitMargin": {
          "type": "number"
        }
      },
      "required": [
        "date",
        "revenue",
        "earnings",
        "fiscalQuarter",
        "profitMargin"
      ],
      "additionalProperties": {}
    },
    "EarningsHistory": {
      "type": "object",
      "properties": {
        "history": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/EarningsHistoryHistory"
          }
        },
        "maxAge": {
          "type": "number"
        },
        "defaultMethodology": {
          "type": "string",
          "enum": [
            "nongaap",
            "gaap"
          ]
        }
      },
      "required": [
        "history",
        "maxAge",
        "defaultMethodology"
      ],
      "additionalProperties": {}
    },
    "EarningsHistoryHistory": {
      "type": "object",
      "properties": {
        "maxAge": {
          "type": "number"
        },
        "epsActual": {
          "type": [
            "number",
            "null"
          ]
        },
        "epsEstimate": {
          "type": [
            "number",
            "null"
          ]
        },
        "epsDifference": {
          "type": [
            "number",
            "null"
          ]
        },
        "surprisePercent": {
          "type": [
            "number",
            "null"
          ]
        },
        "quarter": {
          "anyOf": [
            {
              "type": "string",
              "format": "date-time"
            },
            {
              "type": "null"
            }
          ]
        },
        "period": {
          "type": "string"
        },
        "currency": {
          "type": "string"
        }
      },
      "required": [
        "maxAge",
        "epsActual",
        "epsEstimate",
        "epsDifference",
        "surprisePercent",
        "quarter",
        "period"
      ],
      "additionalProperties": {}
    },
    "EarningsTrend": {
      "type": "object",
      "properties": {
        "trend": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/EarningsTrendTrend"
          }
        },
        "maxAge": {
          "type": "number"
        },
        "defaultMethodology": {
          "type": "string",
          "enum": [
            "nongaap",
            "gaap"
          ]
        }
      },
      "required": [
        "trend",
        "maxAge",
        "defaultMethodology"
      ],
      "additionalProperties": {}
    },
    "EarningsTrendTrend": {
      "type": "object",
      "properties": {
        "maxAge": {
          "type": "number"
        },
        "period": {
          "type": "string"
        },
        "endDate": {
          "anyOf": [
            {
              "type": "string",
              "format": "date-time"
            },
            {
              "type": "null"
            }
          ]
        },
        "growth": {
          "type": [
            "number",
            "null"
          ]
        },
        "earningsEstimate": {
          "$ref": "#/definitions/EarningsEstimate"
        },
        "revenueEstimate": {
          "$ref": "#/definitions/RevenueEstimate"
        },
        "epsTrend": {
          "$ref": "#/definitions/EpsTrend"
        },
        "epsRevisions": {
          "$ref": "#/definitions/EpsRevisions"
        }
      },
      "required": [
        "maxAge",
        "period",
        "endDate",
        "growth",
        "earningsEstimate",
        "revenueEstimate",
        "epsTrend",
        "epsRevisions"
      ],
      "additionalProperties": {}
    },
    "EarningsEstimate": {
      "type": "object",
      "properties": {
        "avg": {
          "type": [
            "number",
            "null"
          ]
        },
        "low": {
          "type": [
            "number",
            "null"
          ]
        },
        "high": {
          "type": [
            "number",
            "null"
          ]
        },
        "yearAgoEps": {
          "type": [
            "number",
            "null"
          ]
        },
        "numberOfAnalysts": {
          "type": [
            "number",
            "null"
          ]
        },
        "growth": {
          "type": [
            "number",
            "null"
          ]
        },
        "earningsCurrency": {
          "type": [
            "string",
            "null"
          ]
        }
      },
      "required": [
        "avg",
        "low",
        "high",
        "yearAgoEps",
        "numberOfAnalysts",
        "growth"
      ],
      "additionalProperties": {}
    },
    "RevenueEstimate": {
      "type": "object",
      "properties": {
        "avg": {
          "type": [
            "number",
            "null"
          ]
        },
        "low": {
          "type": [
            "number",
            "null"
          ]
        },
        "high": {
          "type": [
            "number",
            "null"
          ]
        },
        "numberOfAnalysts": {
          "type": [
            "number",
            "null"
          ]
        },
        "yearAgoRevenue": {
          "type": [
            "number",
            "null"
          ]
        },
        "growth": {
          "type": [
            "number",
            "null"
          ]
        },
        "revenueCurrency": {
          "type": [
            "string",
            "null"
          ]
        }
      },
      "required": [
        "avg",
        "low",
        "high",
        "numberOfAnalysts",
        "yearAgoRevenue",
        "growth"
      ],
      "additionalProperties": {}
    },
    "EpsTrend": {
      "type": "object",
      "properties": {
        "current": {
          "type": [
            "number",
            "null"
          ]
        },
        "7daysAgo": {
          "type": [
            "number",
            "null"
          ]
        },
        "30daysAgo": {
          "type": [
            "number",
            "null"
          ]
        },
        "60daysAgo": {
          "type": [
            "number",
            "null"
          ]
        },
        "90daysAgo": {
          "type": [
            "number",
            "null"
          ]
        },
        "epsTrendCurrency": {
          "type": [
            "string",
            "null"
          ]
        }
      },
      "required": [
        "current",
        "7daysAgo",
        "30daysAgo",
        "60daysAgo",
        "90daysAgo"
      ],
      "additionalProperties": {}
    },
    "EpsRevisions": {
      "type": "object",
      "properties": {
        "upLast7days": {
          "type": [
            "number",
            "null"
          ]
        },
        "upLast30days": {
          "type": [
            "number",
            "null"
          ]
        },
        "upLast90days": {
          "type": [
            "number",
            "null"
          ]
        },
        "downLast7Days": {
          "type": [
            "number",
            "null"
          ]
        },
        "downLast30days": {
          "type": [
            "number",
            "null"
          ]
        },
        "downLast90days": {
          "type": [
            "number",
            "null"
          ]
        },
        "epsRevisionsCurrency": {
          "type": [
            "string",
            "null"
          ]
        }
      },
      "additionalProperties": {}
    },
    "FinancialData": {
      "type": "object",
      "properties": {
        "maxAge": {
          "type": "number"
        },
        "currentPrice": {
          "type": "number"
        },
        "targetHighPrice": {
          "type": "number"
        },
        "targetLowPrice": {
          "type": "number"
        },
        "targetMeanPrice": {
          "type": "number"
        },
        "targetMedianPrice": {
          "type": "number"
        },
        "recommendationMean": {
          "type": "number"
        },
        "recommendationKey": {
          "type": "string"
        },
        "numberOfAnalystOpinions": {
          "type": "number"
        },
        "totalCash": {
          "type": "number"
        },
        "totalCashPerShare": {
          "type": "number"
        },
        "ebitda": {
          "type": "number"
        },
        "totalDebt": {
          "type": "number"
        },
        "quickRatio": {
          "type": "number"
        },
        "currentRatio": {
          "type": "number"
        },
        "totalRevenue": {
          "type": "number"
        },
        "debtToEquity": {
          "type": "number"
        },
        "revenuePerShare": {
          "type": "number"
        },
        "returnOnAssets": {
          "type": "number"
        },
        "returnOnEquity": {
          "type": "number"
        },
        "grossProfits": {
          "type": "number"
        },
        "freeCashflow": {
          "type": "number"
        },
        "operatingCashflow": {
          "type": "number"
        },
        "earningsGrowth": {
          "type": "number"
        },
        "revenueGrowth": {
          "type": "number"
        },
        "grossMargins": {
          "type": "number"
        },
        "ebitdaMargins": {
          "type": "number"
        },
        "operatingMargins": {
          "type": "number"
        },
        "profitMargins": {
          "type": "number"
        },
        "financialCurrency": {
          "type": [
            "string",
            "null"
          ]
        }
      },
      "required": [
        "maxAge",
        "recommendationKey",
        "financialCurrency"
      ],
      "additionalProperties": {}
    },
    "Ownership": {
      "type": "object",
      "properties": {
        "maxAge": {
          "type": "number"
        },
        "ownershipList": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/OwnershipList"
          }
        }
      },
      "required": [
        "maxAge",
        "ownershipList"
      ],
      "additionalProperties": {}
    },
    "OwnershipList": {
      "type": "object",
      "properties": {
        "maxAge": {
          "type": "number"
        },
        "reportDate": {
          "type": "string",
          "format": "date-time"
        },
        "organization": {
          "type": "string"
        },
        "pctHeld": {
          "type": "number"
        },
        "position": {
          "type": "number"
        },
        "value": {
          "type": "number"
        },
        "pctChange": {
          "type": "number"
        }
      },
      "required": [
        "maxAge",
        "reportDate",
        "organization",
        "pctHeld",
        "position",
        "value"
      ],
      "additionalProperties": {}
    },
    "FundPerformance": {
      "type": "object",
      "properties": {
        "maxAge": {
          "type": "number"
        },
        "loadAdjustedReturns": {
          "$ref": "#/definitions/PeriodRange"
        },
        "rankInCategory": {
          "$ref": "#/definitions/PeriodRange"
        },
        "performanceOverview": {
          "$ref": "#/definitions/FundPerformancePerformanceOverview"
        },
        "performanceOverviewCat": {
          "$ref": "#/definitions/FundPerformancePerformanceOverviewCat"
        },
        "trailingReturns": {
          "$ref": "#/definitions/FundPerformanceTrailingReturns"
        },
        "trailingReturnsNav": {
          "$ref": "#/definitions/FundPerformanceTrailingReturns"
        },
        "trailingReturnsCat": {
          "$ref": "#/definitions/FundPerformanceTrailingReturns"
        },
        "annualTotalReturns": {
          "$ref": "#/definitions/FundPerformanceReturns"
        },
        "pastQuarterlyReturns": {
          "$ref": "#/definitions/FundPerformanceReturns"
        },
        "riskOverviewStatistics": {
          "$ref": "#/definitions/FundPerformanceRiskOverviewStats"
        },
        "riskOverviewStatisticsCat": {
          "$ref": "#/definitions/FundPerformanceRiskOverviewStatsCat"
        },
        "fundCategoryName": {
          "type": "string"
        }
      },
      "required": [
        "maxAge",
        "performanceOverview",
        "performanceOverviewCat",
        "trailingReturns",
        "trailingReturnsNav",
        "trailingReturnsCat",
        "annualTotalReturns",
        "pastQuarterlyReturns",
        "riskOverviewStatistics",
        "riskOverviewStatisticsCat"
      ],
      "additionalProperties": {}
    },
    "PeriodRange": {
      "type": "object",
      "properties": {
        "asOfDate": {
          "type": "string",
          "format": "date-time"
        },
        "ytd": {
          "type": "number"
        },
        "oneMonth": {
          "type": "number"
        },
        "threeMonth": {
          "type": "number"
        },
        "oneYear": {
          "type": "number"
        },
        "threeYear": {
          "type": "number"
        },
        "fiveYear": {
          "type": "number"
        },
        "tenYear": {
          "type": "number"
        }
      },
      "additionalProperties": {}
    },
    "FundPerformancePerformanceOverview": {
      "type": "object",
      "properties": {
        "asOfDate": {
          "type": "string",
          "format": "date-time"
        },
        "ytdReturnPct": {
          "type": "number"
        },
        "oneYearTotalReturn": {
          "type": "number"
        },
        "threeYearTotalReturn": {
          "type": "number"
        },
        "fiveYrAvgReturnPct": {
          "type": "number"
        },
        "morningStarReturnRating": {
          "type": "number"
        },
        "numYearsUp": {
          "type": "number"
        },
        "numYearsDown": {
          "type": "number"
        },
        "bestOneYrTotalReturn": {
          "type": "number"
        },
        "worstOneYrTotalReturn": {
          "type": "number"
        },
        "bestThreeYrTotalReturn": {
          "type": "number"
        },
        "worstThreeYrTotalReturn": {
          "type": "number"
        }
      },
      "additionalProperties": {}
    },
    "FundPerformancePerformanceOverviewCat": {
      "type": "object",
      "properties": {
        "ytdReturnPct": {
          "type": "number"
        },
        "fiveYrAvgReturnPct": {
          "type": "number"
        },
        "oneYearTotalReturn": {
          "type": "number"
        },
        "threeYearTotalReturn": {
          "type": "number"
        }
      },
      "additionalProperties": {}
    },
    "FundPerformanceTrailingReturns": {
      "type": "object",
      "properties": {
        "asOfDate": {
          "type": "string",
          "format": "date-time"
        },
        "ytd": {
          "type": "number"
        },
        "oneMonth": {
          "type": "number"
        },
        "threeMonth": {
          "type": "number"
        },
        "oneYear": {
          "type": "number"
        },
        "threeYear": {
          "type": "number"
        },
        "fiveYear": {
          "type": "number"
        },
        "tenYear": {
          "type": "number"
        },
        "lastBullMkt": {
          "type": "number"
        },
        "lastBearMkt": {
          "type": "number"
        }
      },
      "additionalProperties": {
        "anyOf": [
          {},
          {}
        ]
      }
    },
    "FundPerformanceReturns": {
      "type": "object",
      "properties": {
        "returns": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/FundPerformanceReturnsRow"
          }
        },
        "returnsCat": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/FundPerformanceReturnsRow"
          }
        }
      },
      "required": [
        "returns"
      ],
      "additionalProperties": {}
    },
    "FundPerformanceReturnsRow": {
      "type": "object",
      "properties": {
        "year": {
          "type": "number"
        },
        "annualValue": {
          "type": "number"
        },
        "q1": {
          "type": "number"
        },
        "q2": {
          "type": "number"
        },
        "q3": {
          "type": "number"
        },
        "q4": {
          "type": "number"
        }
      },
      "required": [
        "year"
      ],
      "additionalProperties": {}
    },
    "FundPerformanceRiskOverviewStats": {
      "type": "object",
      "properties": {
        "riskStatistics": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/FundPerformanceRiskOverviewStatsRow"
          }
        },
        "riskRating": {
          "type": "number"
        }
      },
      "required": [
        "riskStatistics"
      ],
      "additionalProperties": {}
    },
    "FundPerformanceRiskOverviewStatsRow": {
      "type": "object",
      "properties": {
        "year": {
          "type": "string"
        },
        "alpha": {
          "type": "number"
        },
        "beta": {
          "type": "number"
        },
        "meanAnnualReturn": {
          "type": "number"
        },
        "rSquared": {
          "type": "number"
        },
        "stdDev": {
          "type": "number"
        },
        "sharpeRatio": {
          "type": "number"
        },
        "treynorRatio": {
          "type": "number"
        }
      },
      "required": [
        "year",
        "alpha",
        "beta",
        "meanAnnualReturn",
        "rSquared",
        "sharpeRatio",
        "treynorRatio"
      ],
      "additionalProperties": {}
    },
    "FundPerformanceRiskOverviewStatsCat": {
      "type": "object",
      "properties": {
        "riskStatisticsCat": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/FundPerformanceRiskOverviewStatsRow"
          }
        }
      },
      "required": [
        "riskStatisticsCat"
      ],
      "additionalProperties": {}
    },
    "FundProfile": {
      "type": "object",
      "properties": {
        "maxAge": {
          "type": "number"
        },
        "styleBoxUrl": {
          "type": [
            "null",
            "string"
          ]
        },
        "family": {
          "type": [
            "null",
            "string"
          ]
        },
        "categoryName": {
          "type": [
            "null",
            "string"
          ]
        },
        "legalType": {
          "type": [
            "null",
            "string"
          ]
        },
        "managementInfo": {
          "$ref": "#/definitions/FundProfileManagementInfo"
        },
        "feesExpensesInvestment": {
          "$ref": "#/definitions/FundProfileFeesExpensesInvestment"
        },
        "feesExpensesInvestmentCat": {
          "$ref": "#/definitions/FundProfileFeesExpensesInvestmentCat"
        },
        "brokerages": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/FundProfileBrokerage"
          }
        },
        "initInvestment": {
          "type": "number"
        },
        "initIraInvestment": {
          "type": "number"
        },
        "initAipInvestment": {
          "type": "number"
        },
        "subseqInvestment": {
          "type": "number"
        },
        "subseqIraInvestment": {
          "type": "number"
        },
        "subseqAipInvestment": {
          "type": "number"
        }
      },
      "required": [
        "maxAge",
        "family",
        "categoryName",
        "legalType"
      ],
      "additionalProperties": {}
    },
    "FundProfileManagementInfo": {
      "type": "object",
      "properties": {
        "managerName": {
          "type": [
            "null",
            "string"
          ]
        },
        "managerBio": {
          "type": [
            "null",
            "string"
          ]
        },
        "startdate": {
          "type": "string",
          "format": "date-time"
        }
      },
      "required": [
        "managerName",
        "managerBio"
      ],
      "additionalProperties": {}
    },
    "FundProfileFeesExpensesInvestment": {
      "type": "object",
      "properties": {
        "annualHoldingsTurnover": {
          "type": "number"
        },
        "annualReportExpenseRatio": {
          "type": "number"
        },
        "grossExpRatio": {
          "type": "number"
        },
        "netExpRatio": {
          "type": "number"
        },
        "projectionValues": {
          "type": "object"
        },
        "totalNetAssets": {
          "type": "number"
        }
      },
      "required": [
        "projectionValues"
      ],
      "additionalProperties": {}
    },
    "FundProfileFeesExpensesInvestmentCat": {
      "type": "object",
      "properties": {
        "annualHoldingsTurnover": {
          "type": "number"
        },
        "annualReportExpenseRatio": {
          "type": "number"
        },
        "grossExpRatio": {
          "type": "number"
        },
        "netExpRatio": {
          "type": "number"
        },
        "totalNetAssets": {
          "type": "number"
        },
        "projectionValuesCat": {
          "type": "object"
        }
      },
      "required": [
        "projectionValuesCat"
      ],
      "additionalProperties": {
        "anyOf": [
          {},
          {}
        ]
      }
    },
    "FundProfileBrokerage": {
      "type": "object",
      "additionalProperties": {}
    },
    "IncomeStatementHistory": {
      "type": "object",
      "properties": {
        "incomeStatementHistory": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/IncomeStatementHistoryElement"
          }
        },
        "maxAge": {
          "type": "number"
        }
      },
      "required": [
        "incomeStatementHistory",
        "maxAge"
      ],
      "additionalProperties": {}
    },
    "IncomeStatementHistoryElement": {
      "type": "object",
      "properties": {
        "maxAge": {
          "type": "number"
        },
        "endDate": {
          "type": "string",
          "format": "date-time"
        },
        "totalRevenue": {
          "type": "number"
        },
        "costOfRevenue": {
          "type": "number"
        },
        "grossProfit": {
          "type": "number"
        },
        "researchDevelopment": {
          "type": "null"
        },
        "sellingGeneralAdministrative": {
          "type": "null"
        },
        "nonRecurring": {
          "type": "null"
        },
        "otherOperatingExpenses": {
          "type": "null"
        },
        "totalOperatingExpenses": {
          "type": "number"
        },
        "operatingIncome": {
          "type": "null"
        },
        "totalOtherIncomeExpenseNet": {
          "type": "null"
        },
        "ebit": {
          "type": "number"
        },
        "interestExpense": {
          "type": "null"
        },
        "incomeBeforeTax": {
          "type": "null"
        },
        "incomeTaxExpense": {
          "type": "number"
        },
        "minorityInterest": {
          "type": "null"
        },
        "netIncomeFromContinuingOps": {
          "type": "null"
        },
        "discontinuedOperations": {
          "type": "null"
        },
        "extraordinaryItems": {
          "type": "null"
        },
        "effectOfAccountingCharges": {
          "type": "null"
        },
        "otherItems": {
          "type": "null"
        },
        "netIncome": {
          "type": "number"
        },
        "netIncomeApplicableToCommonShares": {
          "type": "null"
        }
      },
      "required": [
        "maxAge",
        "endDate",
        "totalRevenue",
        "costOfRevenue",
        "grossProfit",
        "researchDevelopment",
        "sellingGeneralAdministrative",
        "nonRecurring",
        "otherOperatingExpenses",
        "totalOperatingExpenses",
        "operatingIncome",
        "totalOtherIncomeExpenseNet",
        "ebit",
        "interestExpense",
        "incomeBeforeTax",
        "incomeTaxExpense",
        "minorityInterest",
        "netIncomeFromContinuingOps",
        "discontinuedOperations",
        "extraordinaryItems",
        "effectOfAccountingCharges",
        "otherItems",
        "netIncome",
        "netIncomeApplicableToCommonShares"
      ],
      "additionalProperties": false
    },
    "IndexTrend": {
      "type": "object",
      "properties": {
        "maxAge": {
          "type": "number"
        },
        "symbol": {
          "type": "string"
        },
        "peRatio": {
          "type": "number"
        },
        "pegRatio": {
          "type": "number"
        },
        "estimates": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/Estimate"
          }
        }
      },
      "required": [
        "maxAge",
        "symbol",
        "estimates"
      ],
      "additionalProperties": {}
    },
    "Estimate": {
      "type": "object",
      "properties": {
        "period": {
          "type": "string"
        },
        "growth": {
          "type": "number"
        }
      },
      "required": [
        "period"
      ],
      "additionalProperties": {}
    },
    "Trend": {
      "type": "object",
      "properties": {
        "maxAge": {
          "type": "number"
        },
        "symbol": {
          "type": "null"
        },
        "estimates": {
          "type": "array",
          "items": {}
        }
      },
      "required": [
        "maxAge",
        "symbol",
        "estimates"
      ],
      "additionalProperties": {}
    },
    "Holders": {
      "type": "object",
      "properties": {
        "holders": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/Holder"
          }
        },
        "maxAge": {
          "type": "number"
        }
      },
      "required": [
        "holders",
        "maxAge"
      ],
      "additionalProperties": {}
    },
    "Holder": {
      "type": "object",
      "properties": {
        "maxAge": {
          "type": "number"
        },
        "name": {
          "type": "string"
        },
        "relation": {
          "anyOf": [
            {
              "$ref": "#/definitions/Relation"
            },
            {
              "type": "string"
            }
          ]
        },
        "url": {
          "type": "string"
        },
        "transactionDescription": {
          "type": "string"
        },
        "latestTransDate": {
          "type": "string",
          "format": "date-time"
        },
        "positionDirect": {
          "type": "number"
        },
        "positionDirectDate": {
          "type": "string",
          "format": "date-time"
        },
        "positionIndirect": {
          "type": "number"
        },
        "positionIndirectDate": {
          "type": "string",
          "format": "date-time"
        },
        "positionSummaryDate": {
          "type": "string",
          "format": "date-time"
        }
      },
      "required": [
        "maxAge",
        "name",
        "relation",
        "url",
        "transactionDescription",
        "latestTransDate"
      ],
      "additionalProperties": {}
    },
    "Relation": {
      "type": "string",
      "enum": [
        "Chairman of the Board",
        "Chief Executive Officer",
        "Chief Financial Officer",
        "Chief Operating Officer",
        "Chief Technology Officer",
        "Director",
        "Director (Independent)",
        "",
        "General Counsel",
        "Independent Non-Executive Director",
        "Officer",
        "President"
      ]
    },
    "InsiderTransactions": {
      "type": "object",
      "properties": {
        "transactions": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/Transaction"
          }
        },
        "maxAge": {
          "type": "number"
        }
      },
      "required": [
        "transactions",
        "maxAge"
      ],
      "additionalProperties": {}
    },
    "Transaction": {
      "type": "object",
      "properties": {
        "maxAge": {
          "type": "number"
        },
        "shares": {
          "type": "number"
        },
        "filerUrl": {
          "type": "string"
        },
        "transactionText": {
          "type": "string"
        },
        "filerName": {
          "type": "string"
        },
        "filerRelation": {
          "anyOf": [
            {
              "$ref": "#/definitions/Relation"
            },
            {
              "type": "string"
            }
          ]
        },
        "moneyText": {
          "type": "string"
        },
        "startDate": {
          "type": "string",
          "format": "date-time"
        },
        "ownership": {
          "anyOf": [
            {
              "$ref": "#/definitions/OwnershipEnum"
            },
            {
              "type": "string"
            }
          ]
        },
        "value": {
          "type": "number"
        }
      },
      "required": [
        "maxAge",
        "shares",
        "filerUrl",
        "transactionText",
        "filerName",
        "filerRelation",
        "moneyText",
        "startDate",
        "ownership"
      ],
      "additionalProperties": {}
    },
    "OwnershipEnum": {
      "type": "string",
      "enum": [
        "D",
        "I"
      ]
    },
    "MajorHoldersBreakdown": {
      "type": "object",
      "properties": {
        "maxAge": {
          "type": "number"
        },
        "insidersPercentHeld": {
          "type": "number"
        },
        "institutionsPercentHeld": {
          "type": "number"
        },
        "institutionsFloatPercentHeld": {
          "type": "number"
        },
        "institutionsCount": {
          "type": "number"
        }
      },
      "required": [
        "maxAge"
      ],
      "additionalProperties": {}
    },
    "NetSharePurchaseActivity": {
      "type": "object",
      "properties": {
        "maxAge": {
          "type": "number"
        },
        "period": {
          "type": "string"
        },
        "buyInfoCount": {
          "type": "number"
        },
        "buyInfoShares": {
          "type": "number"
        },
        "buyPercentInsiderShares": {
          "type": "number"
        },
        "sellInfoCount": {
          "type": "number"
        },
        "sellInfoShares": {
          "type": "number"
        },
        "sellPercentInsiderShares": {
          "type": "number"
        },
        "netInfoCount": {
          "type": "number"
        },
        "netInfoShares": {
          "type": "number"
        },
        "netPercentInsiderShares": {
          "type": "number"
        },
        "totalInsiderShares": {
          "type": "number"
        },
        "netInstSharesBuying": {
          "type": "number"
        },
        "netInstBuyingPercent": {
          "type": "number"
        }
      },
      "required": [
        "maxAge",
        "period",
        "buyInfoCount",
        "buyInfoShares",
        "sellInfoCount",
        "netInfoCount",
        "netInfoShares",
        "totalInsiderShares",
        "netInstSharesBuying",
        "netInstBuyingPercent"
      ],
      "additionalProperties": {}
    },
    "Price": {
      "type": "object",
      "properties": {
        "averageDailyVolume10Day": {
          "type": "number"
        },
        "averageDailyVolume3Month": {
          "type": "number"
        },
        "exchange": {
          "type": "string"
        },
        "exchangeName": {
          "type": "string"
        },
        "exchangeDataDelayedBy": {
          "type": "number"
        },
        "maxAge": {
          "type": "number"
        },
        "priceHint": {
          "type": "number"
        },
        "preMarketChangePercent": {
          "type": "number"
        },
        "preMarketChange": {
          "type": "number"
        },
        "preMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "preMarketPrice": {
          "type": "number"
        },
        "preMarketSource": {
          "type": "string"
        },
        "regularMarketChangePercent": {
          "type": "number"
        },
        "regularMarketChange": {
          "type": "number"
        },
        "regularMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "regularMarketPrice": {
          "type": "number"
        },
        "regularMarketDayHigh": {
          "type": "number"
        },
        "regularMarketDayLow": {
          "type": "number"
        },
        "regularMarketVolume": {
          "type": "number"
        },
        "regularMarketPreviousClose": {
          "type": "number"
        },
        "regularMarketSource": {
          "type": "string"
        },
        "regularMarketOpen": {
          "type": "number"
        },
        "postMarketChangePercent": {
          "type": "number"
        },
        "postMarketChange": {
          "type": "number"
        },
        "postMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "postMarketPrice": {
          "type": "number"
        },
        "postMarketSource": {
          "type": "string"
        },
        "quoteSourceName": {
          "type": "string"
        },
        "quoteType": {
          "type": "string"
        },
        "symbol": {
          "type": "string"
        },
        "underlyingSymbol": {
          "type": [
            "null",
            "string"
          ]
        },
        "shortName": {
          "type": [
            "null",
            "string"
          ]
        },
        "longName": {
          "type": [
            "null",
            "string"
          ]
        },
        "lastMarket": {
          "type": [
            "null",
            "string"
          ]
        },
        "marketState": {
          "type": "string"
        },
        "marketCap": {
          "type": "number"
        },
        "currency": {
          "type": "string"
        },
        "currencySymbol": {
          "type": "string"
        },
        "fromCurrency": {
          "type": [
            "string",
            "null"
          ]
        },
        "toCurrency": {
          "type": [
            "string",
            "null"
          ]
        },
        "volume24Hr": {
          "type": "number"
        },
        "volumeAllCurrencies": {
          "type": "number"
        },
        "circulatingSupply": {
          "type": "number"
        },
        "expireDate": {
          "type": "string",
          "format": "date-time"
        },
        "openInterest": {
          "type": "number"
        }
      },
      "required": [
        "maxAge",
        "priceHint",
        "quoteType",
        "symbol",
        "underlyingSymbol",
        "shortName",
        "longName",
        "lastMarket",
        "fromCurrency"
      ],
      "additionalProperties": {}
    },
    "QuoteType": {
      "type": "object",
      "properties": {
        "exchange": {
          "type": "string"
        },
        "quoteType": {
          "type": "string"
        },
        "symbol": {
          "type": "string"
        },
        "underlyingSymbol": {
          "type": "string"
        },
        "shortName": {
          "type": [
            "null",
            "string"
          ]
        },
        "longName": {
          "type": [
            "null",
            "string"
          ]
        },
        "firstTradeDateEpochUtc": {
          "anyOf": [
            {
              "type": "null"
            },
            {
              "type": "string",
              "format": "date-time"
            }
          ]
        },
        "timeZoneFullName": {
          "type": "string"
        },
        "timeZoneShortName": {
          "type": "string"
        },
        "uuid": {
          "type": "string"
        },
        "messageBoardId": {
          "type": [
            "null",
            "string"
          ]
        },
        "gmtOffSetMilliseconds": {
          "type": "number"
        },
        "maxAge": {
          "type": "number"
        }
      },
      "required": [
        "exchange",
        "quoteType",
        "symbol",
        "underlyingSymbol",
        "shortName",
        "timeZoneFullName",
        "timeZoneShortName",
        "uuid",
        "gmtOffSetMilliseconds",
        "maxAge"
      ],
      "additionalProperties": {}
    },
    "RecommendationTrend": {
      "type": "object",
      "properties": {
        "trend": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/RecommendationTrendTrend"
          }
        },
        "maxAge": {
          "type": "number"
        }
      },
      "required": [
        "trend",
        "maxAge"
      ],
      "additionalProperties": {}
    },
    "RecommendationTrendTrend": {
      "type": "object",
      "properties": {
        "period": {
          "type": "string"
        },
        "strongBuy": {
          "type": "number"
        },
        "buy": {
          "type": "number"
        },
        "hold": {
          "type": "number"
        },
        "sell": {
          "type": "number"
        },
        "strongSell": {
          "type": "number"
        }
      },
      "required": [
        "period",
        "strongBuy",
        "buy",
        "hold",
        "sell",
        "strongSell"
      ],
      "additionalProperties": {}
    },
    "SECFilings": {
      "type": "object",
      "properties": {
        "filings": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/Filing"
          }
        },
        "maxAge": {
          "type": "number"
        }
      },
      "required": [
        "filings",
        "maxAge"
      ],
      "additionalProperties": {}
    },
    "Filing": {
      "type": "object",
      "properties": {
        "date": {
          "type": "string"
        },
        "epochDate": {
          "type": "string",
          "format": "date-time"
        },
        "type": {
          "type": "string",
          "enum": [
            "10-K",
            "10-Q",
            "8-K",
            "8-K/A",
            "10-K/A",
            "10-Q/A",
            "SD",
            "PX14A6G",
            "SC 13G/A",
            "DEFA14A",
            "25-NSE",
            "S-8 POS",
            "6-K",
            "F-3ASR",
            "SC 13D/A",
            "20-F",
            "425",
            "SC14D9C",
            "SC 13G",
            "S-8",
            "DEF 14A",
            "F-10",
            "S-3ASR",
            "CORRESP",
            "PX14A6N",
            "N-PX",
            "ARS",
            "PRE 14A",
            "F-6EF",
            "S-3/A",
            "S-3",
            "POS AM",
            "IRANNOTICE",
            "20-F/A",
            "11-K",
            "DEFR14A",
            "S4",
            "RW",
            "S-4/A",
            "S-4",
            "S-4MEF",
            "PRER14A",
            "8-A12B",
            "D",
            "SC 13D",
            "NT 10-Q/A",
            "F-4"
          ]
        },
        "title": {
          "type": "string"
        },
        "edgarUrl": {
          "type": "string"
        },
        "maxAge": {
          "type": "number"
        },
        "url": {
          "type": "string"
        },
        "exhibits": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "type": {
                "type": "string"
              },
              "url": {
                "type": "string"
              },
              "downloadUrl": {
                "type": "string"
              }
            },
            "required": [
              "type",
              "url"
            ],
            "additionalProperties": false
          }
        }
      },
      "required": [
        "date",
        "epochDate",
        "type",
        "title",
        "edgarUrl",
        "maxAge"
      ],
      "additionalProperties": {}
    },
    "SummaryDetail": {
      "type": "object",
      "properties": {
        "maxAge": {
          "type": "number"
        },
        "priceHint": {
          "type": "number"
        },
        "previousClose": {
          "type": "number"
        },
        "open": {
          "type": "number"
        },
        "dayLow": {
          "type": "number"
        },
        "dayHigh": {
          "type": "number"
        },
        "regularMarketPreviousClose": {
          "type": "number"
        },
        "regularMarketOpen": {
          "type": "number"
        },
        "regularMarketDayLow": {
          "type": "number"
        },
        "regularMarketDayHigh": {
          "type": "number"
        },
        "regularMarketVolume": {
          "type": "number"
        },
        "dividendRate": {
          "type": "number"
        },
        "dividendYield": {
          "type": "number"
        },
        "exDividendDate": {
          "type": "string",
          "format": "date-time"
        },
        "payoutRatio": {
          "type": "number"
        },
        "fiveYearAvgDividendYield": {
          "type": "number"
        },
        "beta": {
          "type": "number"
        },
        "trailingPE": {
          "type": "number"
        },
        "forwardPE": {
          "type": "number"
        },
        "volume": {
          "type": "number"
        },
        "averageVolume": {
          "type": "number"
        },
        "averageVolume10days": {
          "type": "number"
        },
        "averageDailyVolume10Day": {
          "type": "number"
        },
        "bid": {
          "type": "number"
        },
        "ask": {
          "type": "number"
        },
        "bidSize": {
          "type": "number"
        },
        "askSize": {
          "type": "number"
        },
        "marketCap": {
          "type": "number"
        },
        "fiftyDayAverage": {
          "type": "number"
        },
        "fiftyTwoWeekLow": {
          "type": "number"
        },
        "fiftyTwoWeekHigh": {
          "type": "number"
        },
        "twoHundredDayAverage": {
          "type": "number"
        },
        "priceToSalesTrailing12Months": {
          "type": "number"
        },
        "trailingAnnualDividendRate": {
          "type": "number"
        },
        "trailingAnnualDividendYield": {
          "type": "number"
        },
        "currency": {
          "type": "string"
        },
        "algorithm": {
          "type": "null"
        },
        "tradeable": {
          "type": "boolean"
        },
        "yield": {
          "type": "number"
        },
        "totalAssets": {
          "type": "number"
        },
        "navPrice": {
          "type": "number"
        },
        "ytdReturn": {
          "type": "number"
        },
        "fullyDilutedValue": {
          "type": "number"
        },
        "volume24HrMarketCapPercent": {
          "type": "number"
        },
        "fromCurrency": {
          "type": [
            "string",
            "null"
          ]
        },
        "toCurrency": {
          "type": [
            "string",
            "null"
          ]
        },
        "lastMarket": {
          "type": [
            "string",
            "null"
          ]
        },
        "volume24Hr": {
          "type": "number"
        },
        "volumeAllCurrencies": {
          "type": "number"
        },
        "circulatingSupply": {
          "type": "number"
        },
        "startDate": {
          "type": "string",
          "format": "date-time"
        },
        "coinMarketCapLink": {
          "type": [
            "string",
            "null"
          ]
        },
        "maxSupply": {
          "type": "number"
        },
        "totalSupply": {
          "type": "number"
        },
        "expireDate": {
          "type": "string",
          "format": "date-time"
        },
        "openInterest": {
          "type": "number"
        },
        "averageMaturity": {
          "type": "number"
        },
        "nonDilutedMarketCap": {
          "type": "number"
        },
        "allTimeHigh": {
          "type": "number"
        },
        "allTimeLow": {
          "type": "number"
        }
      },
      "required": [
        "maxAge",
        "priceHint",
        "currency",
        "algorithm",
        "tradeable",
        "fromCurrency",
        "lastMarket"
      ],
      "additionalProperties": {}
    },
    "SummaryProfile": {
      "type": "object",
      "properties": {
        "address1": {
          "type": "string"
        },
        "address2": {
          "type": "string"
        },
        "address3": {
          "type": "string"
        },
        "city": {
          "type": "string"
        },
        "state": {
          "type": "string"
        },
        "zip": {
          "type": "string"
        },
        "country": {
          "type": "string"
        },
        "phone": {
          "type": "string"
        },
        "fax": {
          "type": "string"
        },
        "website": {
          "type": "string"
        },
        "industry": {
          "type": "string"
        },
        "industryDisp": {
          "type": "string"
        },
        "sector": {
          "type": "string"
        },
        "sectorDisp": {
          "type": "string"
        },
        "longBusinessSummary": {
          "type": "string"
        },
        "fullTimeEmployees": {
          "type": "number"
        },
        "companyOfficers": {
          "type": "array",
          "items": {}
        },
        "maxAge": {
          "type": "number"
        },
        "twitter": {
          "type": "string"
        },
        "industryKey": {
          "type": "string"
        },
        "sectorKey": {
          "type": "string"
        },
        "irWebsite": {
          "type": "string"
        },
        "executiveTeam": {
          "type": "array",
          "items": {}
        },
        "name": {
          "type": "string"
        },
        "startDate": {
          "type": "string",
          "format": "date-time"
        },
        "description": {
          "type": "string"
        },
        "whitepaper": {
          "type": "string"
        },
        "blockNumber": {
          "type": "number"
        },
        "blockReward": {
          "type": "number"
        },
        "blockRewardReduction": {
          "type": "string"
        },
        "netHashesPerSecond": {
          "type": "string"
        }
      },
      "required": [
        "companyOfficers",
        "maxAge"
      ],
      "additionalProperties": {}
    },
    "TopHoldings": {
      "type": "object",
      "properties": {
        "maxAge": {
          "type": "number"
        },
        "stockPosition": {
          "type": "number"
        },
        "bondPosition": {
          "type": "number"
        },
        "holdings": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/TopHoldingsHolding"
          }
        },
        "equityHoldings": {
          "$ref": "#/definitions/TopHoldingsEquityHoldings"
        },
        "bondHoldings": {
          "type": "object"
        },
        "bondRatings": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/TopHoldingsBondRating"
          }
        },
        "sectorWeightings": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/TopHoldingsSectorWeighting"
          }
        },
        "cashPosition": {
          "type": "number"
        },
        "otherPosition": {
          "type": "number"
        },
        "preferredPosition": {
          "type": "number"
        },
        "convertiblePosition": {
          "type": "number"
        }
      },
      "required": [
        "maxAge",
        "holdings",
        "equityHoldings",
        "bondHoldings",
        "bondRatings",
        "sectorWeightings"
      ],
      "additionalProperties": {}
    },
    "TopHoldingsHolding": {
      "type": "object",
      "properties": {
        "symbol": {
          "type": "string"
        },
        "holdingName": {
          "type": "string"
        },
        "holdingPercent": {
          "type": "number"
        }
      },
      "required": [
        "symbol",
        "holdingName",
        "holdingPercent"
      ],
      "additionalProperties": {}
    },
    "TopHoldingsEquityHoldings": {
      "type": "object",
      "properties": {
        "medianMarketCap": {
          "type": "number"
        },
        "medianMarketCapCat": {
          "type": "number"
        },
        "priceToBook": {
          "type": "number"
        },
        "priceToBookCat": {
          "type": "number"
        },
        "priceToCashflow": {
          "type": "number"
        },
        "priceToCashflowCat": {
          "type": "number"
        },
        "priceToEarnings": {
          "type": "number"
        },
        "priceToEarningsCat": {
          "type": "number"
        },
        "priceToSales": {
          "type": "number"
        },
        "priceToSalesCat": {
          "type": "number"
        },
        "threeYearEarningsGrowth": {
          "type": "number"
        },
        "threeYearEarningsGrowthCat": {
          "type": "number"
        }
      },
      "required": [
        "priceToBook",
        "priceToCashflow",
        "priceToEarnings",
        "priceToSales"
      ],
      "additionalProperties": {}
    },
    "TopHoldingsBondRating": {
      "type": "object",
      "properties": {
        "a": {
          "type": "number"
        },
        "aa": {
          "type": "number"
        },
        "aaa": {
          "type": "number"
        },
        "other": {
          "type": "number"
        },
        "b": {
          "type": "number"
        },
        "bb": {
          "type": "number"
        },
        "bbb": {
          "type": "number"
        },
        "below_b": {
          "type": "number"
        },
        "us_government": {
          "type": "number"
        }
      },
      "additionalProperties": {}
    },
    "TopHoldingsSectorWeighting": {
      "type": "object",
      "properties": {
        "realestate": {
          "type": "number"
        },
        "consumer_cyclical": {
          "type": "number"
        },
        "basic_materials": {
          "type": "number"
        },
        "consumer_defensive": {
          "type": "number"
        },
        "technology": {
          "type": "number"
        },
        "communication_services": {
          "type": "number"
        },
        "financial_services": {
          "type": "number"
        },
        "utilities": {
          "type": "number"
        },
        "industrials": {
          "type": "number"
        },
        "energy": {
          "type": "number"
        },
        "healthcare": {
          "type": "number"
        }
      },
      "additionalProperties": {}
    },
    "UpgradeDowngradeHistory": {
      "type": "object",
      "properties": {
        "history": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/UpgradeDowngradeHistoryHistory"
          }
        },
        "maxAge": {
          "type": "number"
        }
      },
      "required": [
        "history",
        "maxAge"
      ],
      "additionalProperties": {}
    },
    "UpgradeDowngradeHistoryHistory": {
      "type": "object",
      "properties": {
        "epochGradeDate": {
          "type": "string",
          "format": "date-time"
        },
        "firm": {
          "type": "string"
        },
        "toGrade": {
          "$ref": "#/definitions/Grade"
        },
        "fromGrade": {
          "$ref": "#/definitions/Grade"
        },
        "action": {
          "$ref": "#/definitions/Action"
        },
        "priceTargetAction": {
          "type": "string",
          "enum": [
            "Lowers",
            "Raises",
            "Maintains",
            "Announces",
            "Adjusts",
            ""
          ]
        },
        "currentPriceTarget": {
          "type": "number"
        },
        "priorPriceTarget": {
          "type": "number"
        }
      },
      "required": [
        "epochGradeDate",
        "firm",
        "toGrade",
        "action",
        "priceTargetAction",
        "currentPriceTarget",
        "priorPriceTarget"
      ],
      "additionalProperties": {}
    },
    "Grade": {
      "type": "string",
      "enum": [
        "Accumulate",
        "Add",
        "Average",
        "Below Average",
        "Buy",
        "Conviction Buy",
        "",
        "Equal-Weight",
        "Fair Value",
        "Equal-weight",
        "Long-term Buy",
        "Hold",
        "Long-Term Buy",
        "Market Outperform",
        "Market Perform",
        "Mixed",
        "Negative",
        "Neutral",
        "In-Line",
        "Outperform",
        "Overweight",
        "Peer Perform",
        "Perform",
        "Positive",
        "Reduce",
        "Sector Outperform",
        "Sector Perform",
        "Sector Weight",
        "Sell",
        "Strong Buy",
        "Top Pick",
        "Underperform",
        "Underperformer",
        "Underweight",
        "Trim",
        "Above Average",
        "In-line",
        "Outperformer",
        "OVerweight",
        "Cautious",
        "Market Weight",
        "Sector Underperform",
        "Market Underperform",
        "Peer perform",
        "Gradually Accumulate",
        "Action List Buy",
        "Performer",
        "Sector Performer",
        "Speculative Buy",
        "Strong Sell",
        "Speculative Hold",
        "Not Rated",
        "Hold Neutral",
        "Developing",
        "buy",
        "HOld",
        "Trading Sell",
        "Tender",
        "market perform",
        "BUy"
      ]
    },
    "Action": {
      "type": "string",
      "enum": [
        "down",
        "init",
        "main",
        "reit",
        "up"
      ]
    }
  }
};
const optsDefinitions = getTypedDefinitions(optsSchema);
const resultsDefinitions = getTypedDefinitions(resultsSchema);
const quoteSummary_modules = [
  "assetProfile",
  "balanceSheetHistory",
  "balanceSheetHistoryQuarterly",
  "calendarEvents",
  "cashflowStatementHistory",
  "cashflowStatementHistoryQuarterly",
  "defaultKeyStatistics",
  "earnings",
  "earningsHistory",
  "earningsTrend",
  "financialData",
  "fundOwnership",
  "fundPerformance",
  "fundProfile",
  "incomeStatementHistory",
  "incomeStatementHistoryQuarterly",
  "indexTrend",
  "industryTrend",
  "insiderHolders",
  "insiderTransactions",
  "institutionOwnership",
  "majorDirectHolders",
  "majorHoldersBreakdown",
  "netSharePurchaseActivity",
  "price",
  "quoteType",
  "recommendationTrend",
  "secFilings",
  "sectorTrend",
  "summaryDetail",
  "summaryProfile",
  "topHoldings",
  "upgradeDowngradeHistory"
];
const queryOptionsDefaults$4 = {
  formatted: false,
  modules: ["price", "summaryDetail"]
};
function quoteSummary(symbol, queryOptionsOverrides, moduleOptions) {
  const financeModules = [
    "balanceSheetHistory",
    "balanceSheetHistoryQuarterly",
    "cashflowStatementHistory",
    "cashflowStatementHistoryQuarterly",
    "incomeStatementHistory",
    "incomeStatementHistoryQuarterly"
  ];
  const usedFinanceModules = financeModules.filter((m) => queryOptionsOverrides?.modules?.includes(m));
  if (usedFinanceModules.length) {
    const yahooFinance = this;
    yahooFinance._opts.logger.warn("QuoteSummary financial statements submodules like " + usedFinanceModules.join(", ") + " have provided almost no data since Nov 2024. Use `fundamentalsTimeSeries` instead.");
  }
  return this._moduleExec({
    moduleName: "quoteSummary",
    query: {
      assertSymbol: symbol,
      url: "https://${YF_QUERY_HOST}/v10/finance/quoteSummary/" + symbol,
      needsCrumb: true,
      definitions: optsDefinitions,
      schemaKey: "#/definitions/QuoteSummaryOptions",
      defaults: queryOptionsDefaults$4,
      overrides: queryOptionsOverrides,
      transformWith(options2) {
        if (options2.modules === "all") {
          options2.modules = quoteSummary_modules;
        }
        return options2;
      }
    },
    result: {
      definitions: resultsDefinitions,
      schemaKey: "#/definitions/QuoteSummaryResult",
      // deno-lint-ignore no-explicit-any
      transformWith(result) {
        if (!result.quoteSummary) {
          throw new Error("Unexpected result: " + JSON.stringify(result));
        }
        return result.quoteSummary.result[0];
      }
    },
    moduleOptions
  });
}
const schema$3 = {
  "definitions": {
    "RecommendationsBySymbolResponse": {
      "type": "object",
      "properties": {
        "recommendedSymbols": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "score": {
                "type": "number"
              },
              "symbol": {
                "type": "string"
              }
            },
            "required": [
              "score",
              "symbol"
            ],
            "additionalProperties": {}
          }
        },
        "symbol": {
          "type": "string"
        }
      },
      "required": [
        "recommendedSymbols",
        "symbol"
      ],
      "additionalProperties": {}
    },
    "RecommendationsBySymbolResponseArray": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/RecommendationsBySymbolResponse"
      }
    },
    "RecommendationsBySymbolOptions": {
      "type": "object",
      "additionalProperties": {
        "not": {}
      }
    },
    "recommendationsBySymbol": {}
  }
};
const definitions$3 = getTypedDefinitions(schema$3);
const queryOptionsDefaults$3 = {};
function recommendationsBySymbol(query, queryOptionsOverrides, moduleOptions) {
  const symbols = typeof query === "string" ? query : query.join(",");
  return this._moduleExec({
    moduleName: "recommendationsBySymbol",
    query: {
      url: "https://${YF_QUERY_HOST}/v6/finance/recommendationsbysymbol/" + symbols,
      definitions: definitions$3,
      schemaKey: "#/definitions/RecommendationsBySymbolOptions",
      defaults: queryOptionsDefaults$3,
      overrides: queryOptionsOverrides
    },
    result: {
      definitions: definitions$3,
      schemaKey: "#/definitions/RecommendationsBySymbolResponseArray",
      // deno-lint-ignore no-explicit-any
      transformWith(result) {
        if (!result.finance) {
          throw new Error("Unexpected result: " + JSON.stringify(result));
        }
        return result.finance.result;
      }
    },
    moduleOptions
  }).then((results) => {
    return typeof query === "string" ? results[0] : results;
  });
}
const schema$2 = {
  "definitions": {
    "ScreenerResultBase": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string"
        },
        "title": {
          "type": "string"
        },
        "description": {
          "type": "string"
        },
        "canonicalName": {
          "type": "string"
        },
        "criteriaMeta": {
          "$ref": "#/definitions/ScreenerCriteriaMeta"
        },
        "rawCriteria": {
          "type": "string"
        },
        "start": {
          "type": "number"
        },
        "count": {
          "type": "number"
        },
        "total": {
          "type": "number"
        },
        "quotes": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/ScreenerQuote"
          }
        },
        "useRecords": {
          "type": "boolean"
        },
        "predefinedScr": {
          "type": "boolean"
        },
        "versionId": {
          "type": "number"
        },
        "creationDate": {
          "type": "number"
        },
        "lastUpdated": {
          "type": "number"
        },
        "isPremium": {
          "type": "boolean"
        },
        "iconUrl": {
          "type": "string"
        }
      },
      "required": [
        "id",
        "title",
        "description",
        "canonicalName",
        "criteriaMeta",
        "rawCriteria",
        "start",
        "count",
        "total",
        "quotes",
        "useRecords",
        "predefinedScr",
        "versionId",
        "creationDate",
        "lastUpdated",
        "isPremium",
        "iconUrl"
      ],
      "additionalProperties": false
    },
    "ScreenerCriteriaMeta": {
      "type": "object",
      "properties": {
        "size": {
          "type": "number"
        },
        "offset": {
          "type": "number"
        },
        "sortField": {
          "type": "string"
        },
        "sortType": {
          "type": "string"
        },
        "quoteType": {
          "type": "string"
        },
        "criteria": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/ScreenerCriterum"
          }
        },
        "topOperator": {
          "type": "string"
        }
      },
      "required": [
        "size",
        "offset",
        "sortField",
        "sortType",
        "quoteType",
        "criteria",
        "topOperator"
      ],
      "additionalProperties": false
    },
    "ScreenerCriterum": {
      "type": "object",
      "properties": {
        "field": {
          "type": "string"
        },
        "operators": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "values": {
          "type": "array",
          "items": {
            "type": [
              "string",
              "number"
            ]
          }
        },
        "labelsSelected": {
          "type": "array",
          "items": {
            "type": "number"
          }
        },
        "dependentValues": {
          "type": "array",
          "items": {}
        },
        "subField": {
          "type": "null"
        }
      },
      "required": [
        "field",
        "operators",
        "values",
        "labelsSelected",
        "dependentValues"
      ],
      "additionalProperties": false
    },
    "ScreenerQuote": {
      "type": "object",
      "properties": {
        "language": {
          "type": "string"
        },
        "region": {
          "type": "string"
        },
        "quoteType": {
          "type": "string"
        },
        "typeDisp": {
          "type": "string"
        },
        "quoteSourceName": {
          "type": "string"
        },
        "triggerable": {
          "type": "boolean"
        },
        "customPriceAlertConfidence": {
          "type": "string"
        },
        "lastCloseTevEbitLtm": {
          "type": "number"
        },
        "lastClosePriceToNNWCPerShare": {
          "type": "number"
        },
        "firstTradeDateMilliseconds": {
          "type": "number"
        },
        "priceHint": {
          "type": "number"
        },
        "postMarketChangePercent": {
          "type": "number"
        },
        "postMarketTime": {
          "type": "number"
        },
        "postMarketPrice": {
          "type": "number"
        },
        "postMarketChange": {
          "type": "number"
        },
        "regularMarketChange": {
          "type": "number"
        },
        "regularMarketTime": {
          "type": "number"
        },
        "regularMarketPrice": {
          "type": "number"
        },
        "regularMarketDayHigh": {
          "type": "number"
        },
        "regularMarketDayRange": {
          "type": "string"
        },
        "currency": {
          "type": "string"
        },
        "regularMarketDayLow": {
          "type": "number"
        },
        "regularMarketVolume": {
          "type": "number"
        },
        "regularMarketPreviousClose": {
          "type": "number"
        },
        "bid": {
          "type": "number"
        },
        "ask": {
          "type": "number"
        },
        "bidSize": {
          "type": "number"
        },
        "askSize": {
          "type": "number"
        },
        "market": {
          "type": "string"
        },
        "messageBoardId": {
          "type": "string"
        },
        "fullExchangeName": {
          "type": "string"
        },
        "longName": {
          "type": "string"
        },
        "financialCurrency": {
          "type": "string"
        },
        "regularMarketOpen": {
          "type": "number"
        },
        "averageDailyVolume3Month": {
          "type": "number"
        },
        "averageDailyVolume10Day": {
          "type": "number"
        },
        "fiftyTwoWeekLowChange": {
          "type": "number"
        },
        "fiftyTwoWeekLowChangePercent": {
          "type": "number"
        },
        "fiftyTwoWeekRange": {
          "type": "string"
        },
        "fiftyTwoWeekHighChange": {
          "type": "number"
        },
        "fiftyTwoWeekHighChangePercent": {
          "type": "number"
        },
        "fiftyTwoWeekChangePercent": {
          "type": "number"
        },
        "earningsTimestamp": {
          "type": "number"
        },
        "earningsTimestampStart": {
          "type": "number"
        },
        "earningsTimestampEnd": {
          "type": "number"
        },
        "trailingAnnualDividendRate": {
          "type": "number"
        },
        "trailingAnnualDividendYield": {
          "type": "number"
        },
        "marketState": {
          "type": "string"
        },
        "epsTrailingTwelveMonths": {
          "type": "number"
        },
        "epsForward": {
          "type": "number"
        },
        "epsCurrentYear": {
          "type": "number"
        },
        "priceEpsCurrentYear": {
          "type": "number"
        },
        "sharesOutstanding": {
          "type": "number"
        },
        "bookValue": {
          "type": "number"
        },
        "fiftyDayAverage": {
          "type": "number"
        },
        "fiftyDayAverageChange": {
          "type": "number"
        },
        "fiftyDayAverageChangePercent": {
          "type": "number"
        },
        "twoHundredDayAverage": {
          "type": "number"
        },
        "twoHundredDayAverageChange": {
          "type": "number"
        },
        "twoHundredDayAverageChangePercent": {
          "type": "number"
        },
        "marketCap": {
          "type": "number"
        },
        "forwardPE": {
          "type": "number"
        },
        "priceToBook": {
          "type": "number"
        },
        "sourceInterval": {
          "type": "number"
        },
        "exchangeDataDelayedBy": {
          "type": "number"
        },
        "exchangeTimezoneName": {
          "type": "string"
        },
        "exchangeTimezoneShortName": {
          "type": "string"
        },
        "gmtOffSetMilliseconds": {
          "type": "number"
        },
        "esgPopulated": {
          "type": "boolean"
        },
        "tradeable": {
          "type": "boolean"
        },
        "cryptoTradeable": {
          "type": "boolean"
        },
        "exchange": {
          "type": "string"
        },
        "fiftyTwoWeekLow": {
          "type": "number"
        },
        "fiftyTwoWeekHigh": {
          "type": "number"
        },
        "shortName": {
          "type": "string"
        },
        "averageAnalystRating": {
          "type": "string"
        },
        "regularMarketChangePercent": {
          "type": "number"
        },
        "symbol": {
          "type": "string"
        },
        "dividendDate": {
          "type": "number"
        },
        "displayName": {
          "type": "string"
        },
        "trailingPE": {
          "type": "number"
        },
        "prevName": {
          "type": "string"
        },
        "nameChangeDate": {
          "type": "number"
        },
        "ipoExpectedDate": {
          "type": "number"
        },
        "dividendYield": {
          "type": "number"
        },
        "dividendRate": {
          "type": "number"
        },
        "yieldTTM": {
          "type": "number"
        },
        "peTTM": {
          "type": "number"
        },
        "annualReturnNavY3": {
          "type": "number"
        },
        "annualReturnNavY5": {
          "type": "number"
        },
        "ytdReturn": {
          "type": "number"
        },
        "trailingThreeMonthReturns": {
          "type": "number"
        },
        "netAssets": {
          "type": "number"
        },
        "netExpenseRatio": {
          "type": "number"
        },
        "hasPrePostMarketData": {
          "type": "boolean"
        },
        "corporateActions": {
          "type": "array",
          "items": {}
        },
        "earningsCallTimestampStart": {
          "type": "string",
          "format": "date-time"
        },
        "earningsCallTimestampEnd": {
          "type": "string",
          "format": "date-time"
        },
        "isEarningsDateEstimate": {
          "type": "boolean"
        },
        "preMarketChange": {
          "type": "number"
        },
        "preMarketChangePercent": {
          "type": "number"
        },
        "preMarketTime": {
          "type": "string",
          "format": "date-time"
        },
        "preMarketPrice": {
          "type": "number"
        },
        "impliedSharesOutstanding": {
          "type": "number"
        }
      },
      "required": [
        "language",
        "region",
        "quoteType",
        "typeDisp",
        "triggerable",
        "customPriceAlertConfidence",
        "firstTradeDateMilliseconds",
        "priceHint",
        "regularMarketChange",
        "regularMarketTime",
        "regularMarketPrice",
        "currency",
        "regularMarketPreviousClose",
        "market",
        "messageBoardId",
        "fullExchangeName",
        "fiftyTwoWeekLowChange",
        "fiftyTwoWeekRange",
        "fiftyTwoWeekHighChange",
        "fiftyTwoWeekHighChangePercent",
        "fiftyTwoWeekChangePercent",
        "marketState",
        "fiftyDayAverage",
        "fiftyDayAverageChange",
        "fiftyDayAverageChangePercent",
        "twoHundredDayAverage",
        "twoHundredDayAverageChange",
        "twoHundredDayAverageChangePercent",
        "sourceInterval",
        "exchangeDataDelayedBy",
        "exchangeTimezoneName",
        "exchangeTimezoneShortName",
        "gmtOffSetMilliseconds",
        "esgPopulated",
        "tradeable",
        "cryptoTradeable",
        "exchange",
        "fiftyTwoWeekLow",
        "fiftyTwoWeekHigh",
        "regularMarketChangePercent",
        "symbol"
      ],
      "additionalProperties": false
    },
    "ScreenerResultAggressiveSmallCaps": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string"
        },
        "title": {
          "type": "string"
        },
        "description": {
          "type": "string"
        },
        "canonicalName": {
          "type": "string",
          "const": "AGGRESSIVE_SMALL_CAPS"
        },
        "criteriaMeta": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "includeFields": {
              "type": "array",
              "items": {
                "type": "string",
                "enum": [
                  "change_in_number_of_institutional_holders",
                  "trading_central_last_close_price_to_fair_value",
                  "intradaypricechange",
                  "estimated_revenue_growth",
                  "intradaymarketcap",
                  "morningstar_previous_rating",
                  "fiftytwowkhigh",
                  "fiftytwowkpercentchange",
                  "pctheldinst",
                  "morningstar_last_close_price_to_fair_value",
                  "shares_bought_by_funds",
                  "ror_percent",
                  "morningstar_rating",
                  "sector",
                  "peratio.lasttwelvemonths",
                  "bullish_proportion",
                  "percent_change_in_number_of_institutional_holders",
                  "number_of_institutional_sellers",
                  "morningstar_stewardship",
                  "lastclosetevebit.lasttwelvemonths",
                  "percentchange",
                  "morningstar_economic_moat",
                  "percent_of_shares_outstanding_bought_by_institutions",
                  "day_open_price",
                  "morningstar_rating_change",
                  "number_of_institutional_holders",
                  "percent_in_funds_holding",
                  "exchange",
                  "percent_of_shares_outstanding_sold_by_institutions",
                  "dayvolume",
                  "bearish_proportion",
                  "morningstar_fair_value",
                  "sold_proportion",
                  "industry",
                  "morningstar_uncertainty",
                  "shares_sold_by_funds",
                  "fair_value",
                  "bought_proportion",
                  "percent_in_top_ten_holdings",
                  "avgdailyvol3m",
                  "last_close_price_to_nnwc_per_share",
                  "estimated_earnings_growth",
                  "ticker",
                  "longname_us_en-us",
                  "percent_change_in_shares_held_by_funds",
                  "number_of_institutional_buyers",
                  "companyshortname",
                  "intradayprice",
                  "change_in_shares_held_by_funds",
                  "indices",
                  "neutral_proportion",
                  "latest_holdings_report_date",
                  "fiftytwowklow",
                  "value_description",
                  "average_analyst_rating",
                  "region",
                  "epsgrowth.lasttwelvemonths",
                  "quarterlyrevenuegrowth.quarterly",
                  "pegratio_5y"
                ]
              }
            },
            "size": {
              "type": "number"
            },
            "offset": {
              "type": "number"
            },
            "sortField": {
              "type": "string"
            },
            "sortType": {
              "type": "string"
            },
            "quoteType": {
              "type": "string"
            },
            "criteria": {
              "type": "array",
              "items": {
                "$ref": "#/definitions/ScreenerCriterum"
              }
            },
            "topOperator": {
              "type": "string"
            }
          },
          "required": [
            "criteria",
            "includeFields",
            "offset",
            "quoteType",
            "size",
            "sortField",
            "sortType",
            "topOperator"
          ]
        },
        "rawCriteria": {
          "type": "string"
        },
        "start": {
          "type": "number"
        },
        "count": {
          "type": "number"
        },
        "total": {
          "type": "number"
        },
        "quotes": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/ScreenerQuote"
          }
        },
        "useRecords": {
          "type": "boolean"
        },
        "predefinedScr": {
          "type": "boolean"
        },
        "versionId": {
          "type": "number"
        },
        "creationDate": {
          "type": "number"
        },
        "lastUpdated": {
          "type": "number"
        },
        "isPremium": {
          "type": "boolean"
        },
        "iconUrl": {
          "type": "string"
        }
      },
      "required": [
        "canonicalName",
        "count",
        "creationDate",
        "criteriaMeta",
        "description",
        "iconUrl",
        "id",
        "isPremium",
        "lastUpdated",
        "predefinedScr",
        "quotes",
        "rawCriteria",
        "start",
        "title",
        "total",
        "useRecords",
        "versionId"
      ],
      "additionalProperties": false
    },
    "ScreenerCriteriaFieldsFund": {
      "type": "string",
      "enum": [
        "fundnetassets",
        "sold_proportion",
        "annualreportnetexpenseratio",
        "performanceratingoverall",
        "intradaypricechange",
        "bought_proportion",
        "fiftytwowkhigh",
        "fiftydaymovingavg",
        "ticker",
        "longname_us_en-us",
        "percentchange",
        "companyshortname",
        "intradayprice",
        "annualreturnnavy5",
        "day_open_price",
        "annualreturnnavy3",
        "annualreturnnavy1",
        "annualreportgrossexpenseratio",
        "twohundreddaymovingavg",
        "pe_ttm",
        "yield_ttm",
        "exchange",
        "fiftytwowklow",
        "riskratingoverall",
        "trailing_ytd_return",
        "trailing_3m_return",
        "annualreturnnavy1categoryrank",
        "categoryname",
        "initialinvestment",
        "fiftytwowkpercentchange"
      ]
    },
    "ScreenerResultConservativeForeignFunds": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string"
        },
        "title": {
          "type": "string"
        },
        "description": {
          "type": "string"
        },
        "canonicalName": {
          "type": "string",
          "const": "CONSERVATIVE_FOREIGN_FUNDS"
        },
        "criteriaMeta": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "includeFields": {
              "type": "array",
              "items": {
                "$ref": "#/definitions/ScreenerCriteriaFieldsFund"
              }
            },
            "size": {
              "type": "number"
            },
            "offset": {
              "type": "number"
            },
            "sortField": {
              "type": "string"
            },
            "sortType": {
              "type": "string"
            },
            "quoteType": {
              "type": "string"
            },
            "criteria": {
              "type": "array",
              "items": {
                "$ref": "#/definitions/ScreenerCriterum"
              }
            },
            "topOperator": {
              "type": "string"
            }
          },
          "required": [
            "criteria",
            "includeFields",
            "offset",
            "quoteType",
            "size",
            "sortField",
            "sortType",
            "topOperator"
          ]
        },
        "rawCriteria": {
          "type": "string"
        },
        "start": {
          "type": "number"
        },
        "count": {
          "type": "number"
        },
        "total": {
          "type": "number"
        },
        "quotes": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/ScreenerQuote"
          }
        },
        "useRecords": {
          "type": "boolean"
        },
        "predefinedScr": {
          "type": "boolean"
        },
        "versionId": {
          "type": "number"
        },
        "creationDate": {
          "type": "number"
        },
        "lastUpdated": {
          "type": "number"
        },
        "isPremium": {
          "type": "boolean"
        },
        "iconUrl": {
          "type": "string"
        }
      },
      "required": [
        "canonicalName",
        "count",
        "creationDate",
        "criteriaMeta",
        "description",
        "iconUrl",
        "id",
        "isPremium",
        "lastUpdated",
        "predefinedScr",
        "quotes",
        "rawCriteria",
        "start",
        "title",
        "total",
        "useRecords",
        "versionId"
      ],
      "additionalProperties": false
    },
    "ScreenerResultDayGainers": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string"
        },
        "title": {
          "type": "string"
        },
        "description": {
          "type": "string"
        },
        "canonicalName": {
          "type": "string",
          "const": "DAY_GAINERS"
        },
        "criteriaMeta": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "includeFields": {
              "type": "array",
              "items": {
                "type": "string",
                "enum": [
                  "change_in_number_of_institutional_holders",
                  "trading_central_last_close_price_to_fair_value",
                  "intradaypricechange",
                  "estimated_revenue_growth",
                  "intradaymarketcap",
                  "morningstar_previous_rating",
                  "fiftytwowkhigh",
                  "fiftytwowkpercentchange",
                  "pctheldinst",
                  "morningstar_last_close_price_to_fair_value",
                  "shares_bought_by_funds",
                  "ror_percent",
                  "morningstar_rating",
                  "sector",
                  "peratio.lasttwelvemonths",
                  "bullish_proportion",
                  "percent_change_in_number_of_institutional_holders",
                  "number_of_institutional_sellers",
                  "morningstar_stewardship",
                  "lastclosetevebit.lasttwelvemonths",
                  "percentchange",
                  "morningstar_economic_moat",
                  "percent_of_shares_outstanding_bought_by_institutions",
                  "day_open_price",
                  "morningstar_rating_change",
                  "number_of_institutional_holders",
                  "percent_in_funds_holding",
                  "exchange",
                  "percent_of_shares_outstanding_sold_by_institutions",
                  "dayvolume",
                  "bearish_proportion",
                  "morningstar_fair_value",
                  "sold_proportion",
                  "industry",
                  "morningstar_uncertainty",
                  "shares_sold_by_funds",
                  "fair_value",
                  "bought_proportion",
                  "percent_in_top_ten_holdings",
                  "avgdailyvol3m",
                  "last_close_price_to_nnwc_per_share",
                  "estimated_earnings_growth",
                  "ticker",
                  "longname_us_en-us",
                  "percent_change_in_shares_held_by_funds",
                  "number_of_institutional_buyers",
                  "companyshortname",
                  "intradayprice",
                  "change_in_shares_held_by_funds",
                  "indices",
                  "neutral_proportion",
                  "latest_holdings_report_date",
                  "fiftytwowklow",
                  "value_description",
                  "average_analyst_rating",
                  "region",
                  "epsgrowth.lasttwelvemonths",
                  "quarterlyrevenuegrowth.quarterly",
                  "pegratio_5y"
                ]
              }
            },
            "size": {
              "type": "number"
            },
            "offset": {
              "type": "number"
            },
            "sortField": {
              "type": "string"
            },
            "sortType": {
              "type": "string"
            },
            "quoteType": {
              "type": "string"
            },
            "criteria": {
              "type": "array",
              "items": {
                "$ref": "#/definitions/ScreenerCriterum"
              }
            },
            "topOperator": {
              "type": "string"
            }
          },
          "required": [
            "criteria",
            "includeFields",
            "offset",
            "quoteType",
            "size",
            "sortField",
            "sortType",
            "topOperator"
          ]
        },
        "rawCriteria": {
          "type": "string"
        },
        "start": {
          "type": "number"
        },
        "count": {
          "type": "number"
        },
        "total": {
          "type": "number"
        },
        "quotes": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/ScreenerQuote"
          }
        },
        "useRecords": {
          "type": "boolean"
        },
        "predefinedScr": {
          "type": "boolean"
        },
        "versionId": {
          "type": "number"
        },
        "creationDate": {
          "type": "number"
        },
        "lastUpdated": {
          "type": "number"
        },
        "isPremium": {
          "type": "boolean"
        },
        "iconUrl": {
          "type": "string"
        }
      },
      "required": [
        "canonicalName",
        "count",
        "creationDate",
        "criteriaMeta",
        "description",
        "iconUrl",
        "id",
        "isPremium",
        "lastUpdated",
        "predefinedScr",
        "quotes",
        "rawCriteria",
        "start",
        "title",
        "total",
        "useRecords",
        "versionId"
      ],
      "additionalProperties": false
    },
    "ScreenerResultDayLosers": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string"
        },
        "title": {
          "type": "string"
        },
        "description": {
          "type": "string"
        },
        "canonicalName": {
          "type": "string",
          "const": "DAY_LOSERS"
        },
        "criteriaMeta": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "includeFields": {
              "type": "array",
              "items": {
                "type": "string",
                "enum": [
                  "change_in_number_of_institutional_holders",
                  "trading_central_last_close_price_to_fair_value",
                  "intradaypricechange",
                  "estimated_revenue_growth",
                  "intradaymarketcap",
                  "morningstar_previous_rating",
                  "fiftytwowkhigh",
                  "fiftytwowkpercentchange",
                  "pctheldinst",
                  "morningstar_last_close_price_to_fair_value",
                  "shares_bought_by_funds",
                  "ror_percent",
                  "morningstar_rating",
                  "sector",
                  "peratio.lasttwelvemonths",
                  "bullish_proportion",
                  "percent_change_in_number_of_institutional_holders",
                  "number_of_institutional_sellers",
                  "morningstar_stewardship",
                  "lastclosetevebit.lasttwelvemonths",
                  "percentchange",
                  "morningstar_economic_moat",
                  "percent_of_shares_outstanding_bought_by_institutions",
                  "day_open_price",
                  "morningstar_rating_change",
                  "number_of_institutional_holders",
                  "percent_in_funds_holding",
                  "exchange",
                  "percent_of_shares_outstanding_sold_by_institutions",
                  "dayvolume",
                  "bearish_proportion",
                  "morningstar_fair_value",
                  "sold_proportion",
                  "industry",
                  "morningstar_uncertainty",
                  "shares_sold_by_funds",
                  "fair_value",
                  "bought_proportion",
                  "percent_in_top_ten_holdings",
                  "avgdailyvol3m",
                  "last_close_price_to_nnwc_per_share",
                  "estimated_earnings_growth",
                  "ticker",
                  "longname_us_en-us",
                  "percent_change_in_shares_held_by_funds",
                  "number_of_institutional_buyers",
                  "companyshortname",
                  "intradayprice",
                  "change_in_shares_held_by_funds",
                  "indices",
                  "neutral_proportion",
                  "latest_holdings_report_date",
                  "fiftytwowklow",
                  "value_description",
                  "average_analyst_rating",
                  "region",
                  "epsgrowth.lasttwelvemonths",
                  "quarterlyrevenuegrowth.quarterly",
                  "pegratio_5y"
                ]
              }
            },
            "size": {
              "type": "number"
            },
            "offset": {
              "type": "number"
            },
            "sortField": {
              "type": "string"
            },
            "sortType": {
              "type": "string"
            },
            "quoteType": {
              "type": "string"
            },
            "criteria": {
              "type": "array",
              "items": {
                "$ref": "#/definitions/ScreenerCriterum"
              }
            },
            "topOperator": {
              "type": "string"
            }
          },
          "required": [
            "criteria",
            "includeFields",
            "offset",
            "quoteType",
            "size",
            "sortField",
            "sortType",
            "topOperator"
          ]
        },
        "rawCriteria": {
          "type": "string"
        },
        "start": {
          "type": "number"
        },
        "count": {
          "type": "number"
        },
        "total": {
          "type": "number"
        },
        "quotes": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/ScreenerQuote"
          }
        },
        "useRecords": {
          "type": "boolean"
        },
        "predefinedScr": {
          "type": "boolean"
        },
        "versionId": {
          "type": "number"
        },
        "creationDate": {
          "type": "number"
        },
        "lastUpdated": {
          "type": "number"
        },
        "isPremium": {
          "type": "boolean"
        },
        "iconUrl": {
          "type": "string"
        }
      },
      "required": [
        "canonicalName",
        "count",
        "creationDate",
        "criteriaMeta",
        "description",
        "iconUrl",
        "id",
        "isPremium",
        "lastUpdated",
        "predefinedScr",
        "quotes",
        "rawCriteria",
        "start",
        "title",
        "total",
        "useRecords",
        "versionId"
      ],
      "additionalProperties": false
    },
    "ScreenerResultGrowthTechnologyStocks": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string"
        },
        "title": {
          "type": "string"
        },
        "description": {
          "type": "string"
        },
        "canonicalName": {
          "type": "string",
          "const": "GROWTH_TECHNOLOGY_STOCKS"
        },
        "criteriaMeta": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "includeFields": {
              "type": "array",
              "items": {
                "type": "string",
                "enum": [
                  "change_in_number_of_institutional_holders",
                  "trading_central_last_close_price_to_fair_value",
                  "intradaypricechange",
                  "estimated_revenue_growth",
                  "intradaymarketcap",
                  "morningstar_previous_rating",
                  "fiftytwowkhigh",
                  "fiftytwowkpercentchange",
                  "pctheldinst",
                  "morningstar_last_close_price_to_fair_value",
                  "shares_bought_by_funds",
                  "ror_percent",
                  "morningstar_rating",
                  "sector",
                  "peratio.lasttwelvemonths",
                  "bullish_proportion",
                  "percent_change_in_number_of_institutional_holders",
                  "number_of_institutional_sellers",
                  "morningstar_stewardship",
                  "lastclosetevebit.lasttwelvemonths",
                  "percentchange",
                  "morningstar_economic_moat",
                  "percent_of_shares_outstanding_bought_by_institutions",
                  "day_open_price",
                  "morningstar_rating_change",
                  "number_of_institutional_holders",
                  "percent_in_funds_holding",
                  "exchange",
                  "percent_of_shares_outstanding_sold_by_institutions",
                  "dayvolume",
                  "bearish_proportion",
                  "morningstar_fair_value",
                  "sold_proportion",
                  "industry",
                  "morningstar_uncertainty",
                  "shares_sold_by_funds",
                  "fair_value",
                  "bought_proportion",
                  "percent_in_top_ten_holdings",
                  "avgdailyvol3m",
                  "last_close_price_to_nnwc_per_share",
                  "estimated_earnings_growth",
                  "ticker",
                  "longname_us_en-us",
                  "percent_change_in_shares_held_by_funds",
                  "number_of_institutional_buyers",
                  "companyshortname",
                  "intradayprice",
                  "change_in_shares_held_by_funds",
                  "indices",
                  "neutral_proportion",
                  "latest_holdings_report_date",
                  "fiftytwowklow",
                  "value_description",
                  "average_analyst_rating",
                  "region",
                  "epsgrowth.lasttwelvemonths",
                  "quarterlyrevenuegrowth.quarterly",
                  "pegratio_5y"
                ]
              }
            },
            "size": {
              "type": "number"
            },
            "offset": {
              "type": "number"
            },
            "sortField": {
              "type": "string"
            },
            "sortType": {
              "type": "string"
            },
            "quoteType": {
              "type": "string"
            },
            "criteria": {
              "type": "array",
              "items": {
                "$ref": "#/definitions/ScreenerCriterum"
              }
            },
            "topOperator": {
              "type": "string"
            }
          },
          "required": [
            "criteria",
            "includeFields",
            "offset",
            "quoteType",
            "size",
            "sortField",
            "sortType",
            "topOperator"
          ]
        },
        "rawCriteria": {
          "type": "string"
        },
        "start": {
          "type": "number"
        },
        "count": {
          "type": "number"
        },
        "total": {
          "type": "number"
        },
        "quotes": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/ScreenerQuote"
          }
        },
        "useRecords": {
          "type": "boolean"
        },
        "predefinedScr": {
          "type": "boolean"
        },
        "versionId": {
          "type": "number"
        },
        "creationDate": {
          "type": "number"
        },
        "lastUpdated": {
          "type": "number"
        },
        "isPremium": {
          "type": "boolean"
        },
        "iconUrl": {
          "type": "string"
        }
      },
      "required": [
        "canonicalName",
        "count",
        "creationDate",
        "criteriaMeta",
        "description",
        "iconUrl",
        "id",
        "isPremium",
        "lastUpdated",
        "predefinedScr",
        "quotes",
        "rawCriteria",
        "start",
        "title",
        "total",
        "useRecords",
        "versionId"
      ],
      "additionalProperties": false
    },
    "ScreenerResultMostActives": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string"
        },
        "title": {
          "type": "string"
        },
        "description": {
          "type": "string"
        },
        "canonicalName": {
          "type": "string",
          "const": "MOST_ACTIVES"
        },
        "criteriaMeta": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "includeFields": {
              "type": "array",
              "items": {
                "type": "string",
                "enum": [
                  "change_in_number_of_institutional_holders",
                  "trading_central_last_close_price_to_fair_value",
                  "intradaypricechange",
                  "estimated_revenue_growth",
                  "intradaymarketcap",
                  "morningstar_previous_rating",
                  "fiftytwowkhigh",
                  "fiftytwowkpercentchange",
                  "pctheldinst",
                  "morningstar_last_close_price_to_fair_value",
                  "shares_bought_by_funds",
                  "ror_percent",
                  "morningstar_rating",
                  "sector",
                  "peratio.lasttwelvemonths",
                  "bullish_proportion",
                  "percent_change_in_number_of_institutional_holders",
                  "number_of_institutional_sellers",
                  "morningstar_stewardship",
                  "lastclosetevebit.lasttwelvemonths",
                  "percentchange",
                  "morningstar_economic_moat",
                  "percent_of_shares_outstanding_bought_by_institutions",
                  "day_open_price",
                  "morningstar_rating_change",
                  "number_of_institutional_holders",
                  "percent_in_funds_holding",
                  "exchange",
                  "percent_of_shares_outstanding_sold_by_institutions",
                  "dayvolume",
                  "bearish_proportion",
                  "morningstar_fair_value",
                  "sold_proportion",
                  "industry",
                  "morningstar_uncertainty",
                  "shares_sold_by_funds",
                  "fair_value",
                  "bought_proportion",
                  "percent_in_top_ten_holdings",
                  "avgdailyvol3m",
                  "last_close_price_to_nnwc_per_share",
                  "estimated_earnings_growth",
                  "ticker",
                  "longname_us_en-us",
                  "percent_change_in_shares_held_by_funds",
                  "number_of_institutional_buyers",
                  "companyshortname",
                  "intradayprice",
                  "change_in_shares_held_by_funds",
                  "indices",
                  "neutral_proportion",
                  "latest_holdings_report_date",
                  "fiftytwowklow",
                  "value_description",
                  "average_analyst_rating",
                  "region",
                  "epsgrowth.lasttwelvemonths",
                  "quarterlyrevenuegrowth.quarterly",
                  "pegratio_5y"
                ]
              }
            },
            "size": {
              "type": "number"
            },
            "offset": {
              "type": "number"
            },
            "sortField": {
              "type": "string"
            },
            "sortType": {
              "type": "string"
            },
            "quoteType": {
              "type": "string"
            },
            "criteria": {
              "type": "array",
              "items": {
                "$ref": "#/definitions/ScreenerCriterum"
              }
            },
            "topOperator": {
              "type": "string"
            }
          },
          "required": [
            "criteria",
            "includeFields",
            "offset",
            "quoteType",
            "size",
            "sortField",
            "sortType",
            "topOperator"
          ]
        },
        "rawCriteria": {
          "type": "string"
        },
        "start": {
          "type": "number"
        },
        "count": {
          "type": "number"
        },
        "total": {
          "type": "number"
        },
        "quotes": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/ScreenerQuote"
          }
        },
        "useRecords": {
          "type": "boolean"
        },
        "predefinedScr": {
          "type": "boolean"
        },
        "versionId": {
          "type": "number"
        },
        "creationDate": {
          "type": "number"
        },
        "lastUpdated": {
          "type": "number"
        },
        "isPremium": {
          "type": "boolean"
        },
        "iconUrl": {
          "type": "string"
        }
      },
      "required": [
        "canonicalName",
        "count",
        "creationDate",
        "criteriaMeta",
        "description",
        "iconUrl",
        "id",
        "isPremium",
        "lastUpdated",
        "predefinedScr",
        "quotes",
        "rawCriteria",
        "start",
        "title",
        "total",
        "useRecords",
        "versionId"
      ],
      "additionalProperties": false
    },
    "ScreenerResultHighYieldBond": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string"
        },
        "title": {
          "type": "string"
        },
        "description": {
          "type": "string"
        },
        "canonicalName": {
          "type": "string",
          "const": "HIGH_YIELD_BOND"
        },
        "criteriaMeta": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "includeFields": {
              "type": "array",
              "items": {
                "$ref": "#/definitions/ScreenerCriteriaFieldsFund"
              }
            },
            "size": {
              "type": "number"
            },
            "offset": {
              "type": "number"
            },
            "sortField": {
              "type": "string"
            },
            "sortType": {
              "type": "string"
            },
            "quoteType": {
              "type": "string"
            },
            "criteria": {
              "type": "array",
              "items": {
                "$ref": "#/definitions/ScreenerCriterum"
              }
            },
            "topOperator": {
              "type": "string"
            }
          },
          "required": [
            "criteria",
            "includeFields",
            "offset",
            "quoteType",
            "size",
            "sortField",
            "sortType",
            "topOperator"
          ]
        },
        "rawCriteria": {
          "type": "string"
        },
        "start": {
          "type": "number"
        },
        "count": {
          "type": "number"
        },
        "total": {
          "type": "number"
        },
        "quotes": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/ScreenerQuote"
          }
        },
        "useRecords": {
          "type": "boolean"
        },
        "predefinedScr": {
          "type": "boolean"
        },
        "versionId": {
          "type": "number"
        },
        "creationDate": {
          "type": "number"
        },
        "lastUpdated": {
          "type": "number"
        },
        "isPremium": {
          "type": "boolean"
        },
        "iconUrl": {
          "type": "string"
        }
      },
      "required": [
        "canonicalName",
        "count",
        "creationDate",
        "criteriaMeta",
        "description",
        "iconUrl",
        "id",
        "isPremium",
        "lastUpdated",
        "predefinedScr",
        "quotes",
        "rawCriteria",
        "start",
        "title",
        "total",
        "useRecords",
        "versionId"
      ],
      "additionalProperties": false
    },
    "ScreenerResultMostShortedStocks": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string"
        },
        "title": {
          "type": "string"
        },
        "description": {
          "type": "string"
        },
        "canonicalName": {
          "type": "string",
          "const": "MOST_SHORTED_STOCKS"
        },
        "criteriaMeta": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "includeFields": {
              "type": "array",
              "items": {
                "type": "string",
                "enum": [
                  "change_in_number_of_institutional_holders",
                  "trading_central_last_close_price_to_fair_value",
                  "intradaypricechange",
                  "estimated_revenue_growth",
                  "intradaymarketcap",
                  "morningstar_previous_rating",
                  "fiftytwowkhigh",
                  "fiftytwowkpercentchange",
                  "pctheldinst",
                  "morningstar_last_close_price_to_fair_value",
                  "shares_bought_by_funds",
                  "ror_percent",
                  "morningstar_rating",
                  "sector",
                  "peratio.lasttwelvemonths",
                  "bullish_proportion",
                  "percent_change_in_number_of_institutional_holders",
                  "number_of_institutional_sellers",
                  "morningstar_stewardship",
                  "lastclosetevebit.lasttwelvemonths",
                  "percentchange",
                  "morningstar_economic_moat",
                  "percent_of_shares_outstanding_bought_by_institutions",
                  "day_open_price",
                  "morningstar_rating_change",
                  "number_of_institutional_holders",
                  "percent_in_funds_holding",
                  "exchange",
                  "percent_of_shares_outstanding_sold_by_institutions",
                  "dayvolume",
                  "bearish_proportion",
                  "morningstar_fair_value",
                  "sold_proportion",
                  "industry",
                  "morningstar_uncertainty",
                  "shares_sold_by_funds",
                  "fair_value",
                  "bought_proportion",
                  "percent_in_top_ten_holdings",
                  "avgdailyvol3m",
                  "last_close_price_to_nnwc_per_share",
                  "estimated_earnings_growth",
                  "ticker",
                  "longname_us_en-us",
                  "percent_change_in_shares_held_by_funds",
                  "number_of_institutional_buyers",
                  "companyshortname",
                  "intradayprice",
                  "change_in_shares_held_by_funds",
                  "indices",
                  "neutral_proportion",
                  "latest_holdings_report_date",
                  "fiftytwowklow",
                  "value_description",
                  "average_analyst_rating",
                  "region",
                  "epsgrowth.lasttwelvemonths",
                  "quarterlyrevenuegrowth.quarterly",
                  "pegratio_5y"
                ]
              }
            },
            "size": {
              "type": "number"
            },
            "offset": {
              "type": "number"
            },
            "sortField": {
              "type": "string"
            },
            "sortType": {
              "type": "string"
            },
            "quoteType": {
              "type": "string"
            },
            "criteria": {
              "type": "array",
              "items": {
                "$ref": "#/definitions/ScreenerCriterum"
              }
            },
            "topOperator": {
              "type": "string"
            }
          },
          "required": [
            "criteria",
            "includeFields",
            "offset",
            "quoteType",
            "size",
            "sortField",
            "sortType",
            "topOperator"
          ]
        },
        "rawCriteria": {
          "type": "string"
        },
        "start": {
          "type": "number"
        },
        "count": {
          "type": "number"
        },
        "total": {
          "type": "number"
        },
        "quotes": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/ScreenerQuote"
          }
        },
        "useRecords": {
          "type": "boolean"
        },
        "predefinedScr": {
          "type": "boolean"
        },
        "versionId": {
          "type": "number"
        },
        "creationDate": {
          "type": "number"
        },
        "lastUpdated": {
          "type": "number"
        },
        "isPremium": {
          "type": "boolean"
        },
        "iconUrl": {
          "type": "string"
        }
      },
      "required": [
        "canonicalName",
        "count",
        "creationDate",
        "criteriaMeta",
        "description",
        "iconUrl",
        "id",
        "isPremium",
        "lastUpdated",
        "predefinedScr",
        "quotes",
        "rawCriteria",
        "start",
        "title",
        "total",
        "useRecords",
        "versionId"
      ],
      "additionalProperties": false
    },
    "ScreenerResultPortfolioAnchors": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string"
        },
        "title": {
          "type": "string"
        },
        "description": {
          "type": "string"
        },
        "canonicalName": {
          "type": "string",
          "const": "PORTFOLIO_ANCHORS"
        },
        "criteriaMeta": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "includeFields": {
              "type": "array",
              "items": {
                "$ref": "#/definitions/ScreenerCriteriaFieldsFund"
              }
            },
            "size": {
              "type": "number"
            },
            "offset": {
              "type": "number"
            },
            "sortField": {
              "type": "string"
            },
            "sortType": {
              "type": "string"
            },
            "quoteType": {
              "type": "string"
            },
            "criteria": {
              "type": "array",
              "items": {
                "$ref": "#/definitions/ScreenerCriterum"
              }
            },
            "topOperator": {
              "type": "string"
            }
          },
          "required": [
            "criteria",
            "includeFields",
            "offset",
            "quoteType",
            "size",
            "sortField",
            "sortType",
            "topOperator"
          ]
        },
        "rawCriteria": {
          "type": "string"
        },
        "start": {
          "type": "number"
        },
        "count": {
          "type": "number"
        },
        "total": {
          "type": "number"
        },
        "quotes": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/ScreenerQuote"
          }
        },
        "useRecords": {
          "type": "boolean"
        },
        "predefinedScr": {
          "type": "boolean"
        },
        "versionId": {
          "type": "number"
        },
        "creationDate": {
          "type": "number"
        },
        "lastUpdated": {
          "type": "number"
        },
        "isPremium": {
          "type": "boolean"
        },
        "iconUrl": {
          "type": "string"
        }
      },
      "required": [
        "canonicalName",
        "count",
        "creationDate",
        "criteriaMeta",
        "description",
        "iconUrl",
        "id",
        "isPremium",
        "lastUpdated",
        "predefinedScr",
        "quotes",
        "rawCriteria",
        "start",
        "title",
        "total",
        "useRecords",
        "versionId"
      ],
      "additionalProperties": false
    },
    "ScreenerResultSmallCapGainers": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string"
        },
        "title": {
          "type": "string"
        },
        "description": {
          "type": "string"
        },
        "canonicalName": {
          "type": "string",
          "const": "SMALL_CAP_GAINERS"
        },
        "criteriaMeta": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "includeFields": {
              "type": "array",
              "items": {
                "type": "string",
                "enum": [
                  "change_in_number_of_institutional_holders",
                  "trading_central_last_close_price_to_fair_value",
                  "intradaypricechange",
                  "estimated_revenue_growth",
                  "intradaymarketcap",
                  "morningstar_previous_rating",
                  "fiftytwowkhigh",
                  "fiftytwowkpercentchange",
                  "pctheldinst",
                  "morningstar_last_close_price_to_fair_value",
                  "shares_bought_by_funds",
                  "ror_percent",
                  "morningstar_rating",
                  "sector",
                  "peratio.lasttwelvemonths",
                  "bullish_proportion",
                  "percent_change_in_number_of_institutional_holders",
                  "number_of_institutional_sellers",
                  "morningstar_stewardship",
                  "lastclosetevebit.lasttwelvemonths",
                  "percentchange",
                  "morningstar_economic_moat",
                  "percent_of_shares_outstanding_bought_by_institutions",
                  "day_open_price",
                  "morningstar_rating_change",
                  "number_of_institutional_holders",
                  "percent_in_funds_holding",
                  "exchange",
                  "percent_of_shares_outstanding_sold_by_institutions",
                  "dayvolume",
                  "bearish_proportion",
                  "morningstar_fair_value",
                  "sold_proportion",
                  "industry",
                  "morningstar_uncertainty",
                  "shares_sold_by_funds",
                  "fair_value",
                  "bought_proportion",
                  "percent_in_top_ten_holdings",
                  "avgdailyvol3m",
                  "last_close_price_to_nnwc_per_share",
                  "estimated_earnings_growth",
                  "ticker",
                  "longname_us_en-us",
                  "percent_change_in_shares_held_by_funds",
                  "number_of_institutional_buyers",
                  "companyshortname",
                  "intradayprice",
                  "change_in_shares_held_by_funds",
                  "indices",
                  "neutral_proportion",
                  "latest_holdings_report_date",
                  "fiftytwowklow",
                  "value_description",
                  "average_analyst_rating",
                  "region",
                  "epsgrowth.lasttwelvemonths",
                  "quarterlyrevenuegrowth.quarterly",
                  "pegratio_5y"
                ]
              }
            },
            "size": {
              "type": "number"
            },
            "offset": {
              "type": "number"
            },
            "sortField": {
              "type": "string"
            },
            "sortType": {
              "type": "string"
            },
            "quoteType": {
              "type": "string"
            },
            "criteria": {
              "type": "array",
              "items": {
                "$ref": "#/definitions/ScreenerCriterum"
              }
            },
            "topOperator": {
              "type": "string"
            }
          },
          "required": [
            "criteria",
            "includeFields",
            "offset",
            "quoteType",
            "size",
            "sortField",
            "sortType",
            "topOperator"
          ]
        },
        "rawCriteria": {
          "type": "string"
        },
        "start": {
          "type": "number"
        },
        "count": {
          "type": "number"
        },
        "total": {
          "type": "number"
        },
        "quotes": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/ScreenerQuote"
          }
        },
        "useRecords": {
          "type": "boolean"
        },
        "predefinedScr": {
          "type": "boolean"
        },
        "versionId": {
          "type": "number"
        },
        "creationDate": {
          "type": "number"
        },
        "lastUpdated": {
          "type": "number"
        },
        "isPremium": {
          "type": "boolean"
        },
        "iconUrl": {
          "type": "string"
        }
      },
      "required": [
        "canonicalName",
        "count",
        "creationDate",
        "criteriaMeta",
        "description",
        "iconUrl",
        "id",
        "isPremium",
        "lastUpdated",
        "predefinedScr",
        "quotes",
        "rawCriteria",
        "start",
        "title",
        "total",
        "useRecords",
        "versionId"
      ],
      "additionalProperties": false
    },
    "ScreenerResultSolidLargeGrowthFunds": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string"
        },
        "title": {
          "type": "string"
        },
        "description": {
          "type": "string"
        },
        "canonicalName": {
          "type": "string",
          "const": "SOLID_LARGE_GROWTH_FUNDS"
        },
        "criteriaMeta": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "includeFields": {
              "type": "array",
              "items": {
                "$ref": "#/definitions/ScreenerCriteriaFieldsFund"
              }
            },
            "size": {
              "type": "number"
            },
            "offset": {
              "type": "number"
            },
            "sortField": {
              "type": "string"
            },
            "sortType": {
              "type": "string"
            },
            "quoteType": {
              "type": "string"
            },
            "criteria": {
              "type": "array",
              "items": {
                "$ref": "#/definitions/ScreenerCriterum"
              }
            },
            "topOperator": {
              "type": "string"
            }
          },
          "required": [
            "criteria",
            "includeFields",
            "offset",
            "quoteType",
            "size",
            "sortField",
            "sortType",
            "topOperator"
          ]
        },
        "rawCriteria": {
          "type": "string"
        },
        "start": {
          "type": "number"
        },
        "count": {
          "type": "number"
        },
        "total": {
          "type": "number"
        },
        "quotes": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/ScreenerQuote"
          }
        },
        "useRecords": {
          "type": "boolean"
        },
        "predefinedScr": {
          "type": "boolean"
        },
        "versionId": {
          "type": "number"
        },
        "creationDate": {
          "type": "number"
        },
        "lastUpdated": {
          "type": "number"
        },
        "isPremium": {
          "type": "boolean"
        },
        "iconUrl": {
          "type": "string"
        }
      },
      "required": [
        "canonicalName",
        "count",
        "creationDate",
        "criteriaMeta",
        "description",
        "iconUrl",
        "id",
        "isPremium",
        "lastUpdated",
        "predefinedScr",
        "quotes",
        "rawCriteria",
        "start",
        "title",
        "total",
        "useRecords",
        "versionId"
      ],
      "additionalProperties": false
    },
    "ScreenerResultSolidMidcapGrowthFunds": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string"
        },
        "title": {
          "type": "string"
        },
        "description": {
          "type": "string"
        },
        "canonicalName": {
          "type": "string",
          "const": "SOLID_MIDCAP_GROWTH_FUNDS"
        },
        "criteriaMeta": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "includeFields": {
              "type": "array",
              "items": {
                "$ref": "#/definitions/ScreenerCriteriaFieldsFund"
              }
            },
            "size": {
              "type": "number"
            },
            "offset": {
              "type": "number"
            },
            "sortField": {
              "type": "string"
            },
            "sortType": {
              "type": "string"
            },
            "quoteType": {
              "type": "string"
            },
            "criteria": {
              "type": "array",
              "items": {
                "$ref": "#/definitions/ScreenerCriterum"
              }
            },
            "topOperator": {
              "type": "string"
            }
          },
          "required": [
            "criteria",
            "includeFields",
            "offset",
            "quoteType",
            "size",
            "sortField",
            "sortType",
            "topOperator"
          ]
        },
        "rawCriteria": {
          "type": "string"
        },
        "start": {
          "type": "number"
        },
        "count": {
          "type": "number"
        },
        "total": {
          "type": "number"
        },
        "quotes": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/ScreenerQuote"
          }
        },
        "useRecords": {
          "type": "boolean"
        },
        "predefinedScr": {
          "type": "boolean"
        },
        "versionId": {
          "type": "number"
        },
        "creationDate": {
          "type": "number"
        },
        "lastUpdated": {
          "type": "number"
        },
        "isPremium": {
          "type": "boolean"
        },
        "iconUrl": {
          "type": "string"
        }
      },
      "required": [
        "canonicalName",
        "count",
        "creationDate",
        "criteriaMeta",
        "description",
        "iconUrl",
        "id",
        "isPremium",
        "lastUpdated",
        "predefinedScr",
        "quotes",
        "rawCriteria",
        "start",
        "title",
        "total",
        "useRecords",
        "versionId"
      ],
      "additionalProperties": false
    },
    "ScreenerResultTopMutualFunds": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string"
        },
        "title": {
          "type": "string"
        },
        "description": {
          "type": "string"
        },
        "canonicalName": {
          "type": "string",
          "const": "TOP_MUTUAL_FUNDS"
        },
        "criteriaMeta": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "includeFields": {
              "type": "array",
              "items": {
                "$ref": "#/definitions/ScreenerCriteriaFieldsFund"
              }
            },
            "size": {
              "type": "number"
            },
            "offset": {
              "type": "number"
            },
            "sortField": {
              "type": "string"
            },
            "sortType": {
              "type": "string"
            },
            "quoteType": {
              "type": "string"
            },
            "criteria": {
              "type": "array",
              "items": {
                "$ref": "#/definitions/ScreenerCriterum"
              }
            },
            "topOperator": {
              "type": "string"
            }
          },
          "required": [
            "criteria",
            "includeFields",
            "offset",
            "quoteType",
            "size",
            "sortField",
            "sortType",
            "topOperator"
          ]
        },
        "rawCriteria": {
          "type": "string"
        },
        "start": {
          "type": "number"
        },
        "count": {
          "type": "number"
        },
        "total": {
          "type": "number"
        },
        "quotes": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/ScreenerQuote"
          }
        },
        "useRecords": {
          "type": "boolean"
        },
        "predefinedScr": {
          "type": "boolean"
        },
        "versionId": {
          "type": "number"
        },
        "creationDate": {
          "type": "number"
        },
        "lastUpdated": {
          "type": "number"
        },
        "isPremium": {
          "type": "boolean"
        },
        "iconUrl": {
          "type": "string"
        }
      },
      "required": [
        "canonicalName",
        "count",
        "creationDate",
        "criteriaMeta",
        "description",
        "iconUrl",
        "id",
        "isPremium",
        "lastUpdated",
        "predefinedScr",
        "quotes",
        "rawCriteria",
        "start",
        "title",
        "total",
        "useRecords",
        "versionId"
      ],
      "additionalProperties": false
    },
    "ScreenerResultUndervaluedGrowthStocks": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string"
        },
        "title": {
          "type": "string"
        },
        "description": {
          "type": "string"
        },
        "canonicalName": {
          "type": "string",
          "const": "UNDERVALUED_GROWTH_STOCKS"
        },
        "criteriaMeta": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "includeFields": {
              "type": "array",
              "items": {
                "type": "string",
                "enum": [
                  "change_in_number_of_institutional_holders",
                  "trading_central_last_close_price_to_fair_value",
                  "intradaypricechange",
                  "estimated_revenue_growth",
                  "intradaymarketcap",
                  "morningstar_previous_rating",
                  "fiftytwowkhigh",
                  "fiftytwowkpercentchange",
                  "pctheldinst",
                  "morningstar_last_close_price_to_fair_value",
                  "shares_bought_by_funds",
                  "ror_percent",
                  "morningstar_rating",
                  "sector",
                  "peratio.lasttwelvemonths",
                  "bullish_proportion",
                  "percent_change_in_number_of_institutional_holders",
                  "number_of_institutional_sellers",
                  "morningstar_stewardship",
                  "lastclosetevebit.lasttwelvemonths",
                  "percentchange",
                  "morningstar_economic_moat",
                  "percent_of_shares_outstanding_bought_by_institutions",
                  "day_open_price",
                  "morningstar_rating_change",
                  "number_of_institutional_holders",
                  "percent_in_funds_holding",
                  "exchange",
                  "percent_of_shares_outstanding_sold_by_institutions",
                  "dayvolume",
                  "bearish_proportion",
                  "morningstar_fair_value",
                  "sold_proportion",
                  "industry",
                  "morningstar_uncertainty",
                  "shares_sold_by_funds",
                  "fair_value",
                  "bought_proportion",
                  "percent_in_top_ten_holdings",
                  "avgdailyvol3m",
                  "last_close_price_to_nnwc_per_share",
                  "estimated_earnings_growth",
                  "ticker",
                  "longname_us_en-us",
                  "percent_change_in_shares_held_by_funds",
                  "number_of_institutional_buyers",
                  "companyshortname",
                  "intradayprice",
                  "change_in_shares_held_by_funds",
                  "indices",
                  "neutral_proportion",
                  "latest_holdings_report_date",
                  "fiftytwowklow",
                  "value_description",
                  "average_analyst_rating",
                  "region",
                  "epsgrowth.lasttwelvemonths",
                  "quarterlyrevenuegrowth.quarterly",
                  "pegratio_5y"
                ]
              }
            },
            "size": {
              "type": "number"
            },
            "offset": {
              "type": "number"
            },
            "sortField": {
              "type": "string"
            },
            "sortType": {
              "type": "string"
            },
            "quoteType": {
              "type": "string"
            },
            "criteria": {
              "type": "array",
              "items": {
                "$ref": "#/definitions/ScreenerCriterum"
              }
            },
            "topOperator": {
              "type": "string"
            }
          },
          "required": [
            "criteria",
            "includeFields",
            "offset",
            "quoteType",
            "size",
            "sortField",
            "sortType",
            "topOperator"
          ]
        },
        "rawCriteria": {
          "type": "string"
        },
        "start": {
          "type": "number"
        },
        "count": {
          "type": "number"
        },
        "total": {
          "type": "number"
        },
        "quotes": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/ScreenerQuote"
          }
        },
        "useRecords": {
          "type": "boolean"
        },
        "predefinedScr": {
          "type": "boolean"
        },
        "versionId": {
          "type": "number"
        },
        "creationDate": {
          "type": "number"
        },
        "lastUpdated": {
          "type": "number"
        },
        "isPremium": {
          "type": "boolean"
        },
        "iconUrl": {
          "type": "string"
        }
      },
      "required": [
        "canonicalName",
        "count",
        "creationDate",
        "criteriaMeta",
        "description",
        "iconUrl",
        "id",
        "isPremium",
        "lastUpdated",
        "predefinedScr",
        "quotes",
        "rawCriteria",
        "start",
        "title",
        "total",
        "useRecords",
        "versionId"
      ],
      "additionalProperties": false
    },
    "ScreenerResultUndervaluedLargeCaps": {
      "type": "object",
      "properties": {
        "id": {
          "type": "string"
        },
        "title": {
          "type": "string"
        },
        "description": {
          "type": "string"
        },
        "canonicalName": {
          "type": "string",
          "const": "UNDERVALUED_LARGE_CAPS"
        },
        "criteriaMeta": {
          "type": "object",
          "additionalProperties": false,
          "properties": {
            "includeFields": {
              "type": "array",
              "items": {
                "type": "string",
                "enum": [
                  "change_in_number_of_institutional_holders",
                  "trading_central_last_close_price_to_fair_value",
                  "intradaypricechange",
                  "estimated_revenue_growth",
                  "intradaymarketcap",
                  "morningstar_previous_rating",
                  "fiftytwowkhigh",
                  "fiftytwowkpercentchange",
                  "pctheldinst",
                  "morningstar_last_close_price_to_fair_value",
                  "shares_bought_by_funds",
                  "ror_percent",
                  "morningstar_rating",
                  "sector",
                  "peratio.lasttwelvemonths",
                  "bullish_proportion",
                  "percent_change_in_number_of_institutional_holders",
                  "number_of_institutional_sellers",
                  "morningstar_stewardship",
                  "lastclosetevebit.lasttwelvemonths",
                  "percentchange",
                  "morningstar_economic_moat",
                  "percent_of_shares_outstanding_bought_by_institutions",
                  "day_open_price",
                  "morningstar_rating_change",
                  "number_of_institutional_holders",
                  "percent_in_funds_holding",
                  "exchange",
                  "percent_of_shares_outstanding_sold_by_institutions",
                  "dayvolume",
                  "bearish_proportion",
                  "morningstar_fair_value",
                  "sold_proportion",
                  "industry",
                  "morningstar_uncertainty",
                  "shares_sold_by_funds",
                  "fair_value",
                  "bought_proportion",
                  "percent_in_top_ten_holdings",
                  "avgdailyvol3m",
                  "last_close_price_to_nnwc_per_share",
                  "estimated_earnings_growth",
                  "ticker",
                  "longname_us_en-us",
                  "percent_change_in_shares_held_by_funds",
                  "number_of_institutional_buyers",
                  "companyshortname",
                  "intradayprice",
                  "change_in_shares_held_by_funds",
                  "indices",
                  "neutral_proportion",
                  "latest_holdings_report_date",
                  "fiftytwowklow",
                  "value_description",
                  "average_analyst_rating",
                  "region",
                  "epsgrowth.lasttwelvemonths",
                  "quarterlyrevenuegrowth.quarterly",
                  "pegratio_5y"
                ]
              }
            },
            "size": {
              "type": "number"
            },
            "offset": {
              "type": "number"
            },
            "sortField": {
              "type": "string"
            },
            "sortType": {
              "type": "string"
            },
            "quoteType": {
              "type": "string"
            },
            "criteria": {
              "type": "array",
              "items": {
                "$ref": "#/definitions/ScreenerCriterum"
              }
            },
            "topOperator": {
              "type": "string"
            }
          },
          "required": [
            "criteria",
            "includeFields",
            "offset",
            "quoteType",
            "size",
            "sortField",
            "sortType",
            "topOperator"
          ]
        },
        "rawCriteria": {
          "type": "string"
        },
        "start": {
          "type": "number"
        },
        "count": {
          "type": "number"
        },
        "total": {
          "type": "number"
        },
        "quotes": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/ScreenerQuote"
          }
        },
        "useRecords": {
          "type": "boolean"
        },
        "predefinedScr": {
          "type": "boolean"
        },
        "versionId": {
          "type": "number"
        },
        "creationDate": {
          "type": "number"
        },
        "lastUpdated": {
          "type": "number"
        },
        "isPremium": {
          "type": "boolean"
        },
        "iconUrl": {
          "type": "string"
        }
      },
      "required": [
        "canonicalName",
        "count",
        "creationDate",
        "criteriaMeta",
        "description",
        "iconUrl",
        "id",
        "isPremium",
        "lastUpdated",
        "predefinedScr",
        "quotes",
        "rawCriteria",
        "start",
        "title",
        "total",
        "useRecords",
        "versionId"
      ],
      "additionalProperties": false
    },
    "ScreenerResult": {
      "type": "object",
      "discriminator": {
        "propertyName": "canonicalName"
      },
      "required": [
        "canonicalName"
      ],
      "oneOf": [
        {
          "$ref": "#/definitions/ScreenerResultAggressiveSmallCaps"
        },
        {
          "$ref": "#/definitions/ScreenerResultConservativeForeignFunds"
        },
        {
          "$ref": "#/definitions/ScreenerResultDayGainers"
        },
        {
          "$ref": "#/definitions/ScreenerResultDayLosers"
        },
        {
          "$ref": "#/definitions/ScreenerResultGrowthTechnologyStocks"
        },
        {
          "$ref": "#/definitions/ScreenerResultHighYieldBond"
        },
        {
          "$ref": "#/definitions/ScreenerResultMostActives"
        },
        {
          "$ref": "#/definitions/ScreenerResultMostShortedStocks"
        },
        {
          "$ref": "#/definitions/ScreenerResultPortfolioAnchors"
        },
        {
          "$ref": "#/definitions/ScreenerResultSmallCapGainers"
        },
        {
          "$ref": "#/definitions/ScreenerResultSolidLargeGrowthFunds"
        },
        {
          "$ref": "#/definitions/ScreenerResultSolidMidcapGrowthFunds"
        },
        {
          "$ref": "#/definitions/ScreenerResultTopMutualFunds"
        },
        {
          "$ref": "#/definitions/ScreenerResultUndervaluedGrowthStocks"
        },
        {
          "$ref": "#/definitions/ScreenerResultUndervaluedLargeCaps"
        }
      ]
    },
    "PredefinedScreenerModules": {
      "type": "string",
      "enum": [
        "aggressive_small_caps",
        "conservative_foreign_funds",
        "day_gainers",
        "day_losers",
        "growth_technology_stocks",
        "high_yield_bond",
        "most_actives",
        "most_shorted_stocks",
        "portfolio_anchors",
        "small_cap_gainers",
        "solid_large_growth_funds",
        "solid_midcap_growth_funds",
        "top_mutual_funds",
        "undervalued_growth_stocks",
        "undervalued_large_caps"
      ]
    },
    "ScreenerOptions": {
      "type": "object",
      "properties": {
        "lang": {
          "type": "string"
        },
        "region": {
          "type": "string"
        },
        "scrIds": {
          "$ref": "#/definitions/PredefinedScreenerModules"
        },
        "count": {
          "type": "number"
        },
        "start": {
          "type": "number"
        }
      },
      "required": [
        "scrIds"
      ],
      "additionalProperties": false
    },
    "screener": {}
  }
};
const definitions$2 = getTypedDefinitions(schema$2);
const queryOptionsDefaults$2 = {
  lang: "en-US",
  region: "US",
  scrIds: "day_gainers",
  count: 5
};
function screener(scrIdOrOverrides, queryOptionsOverrides, moduleOptions) {
  queryOptionsOverrides = typeof scrIdOrOverrides === "string" ? { scrIds: scrIdOrOverrides, ...queryOptionsOverrides } : scrIdOrOverrides;
  return this._moduleExec({
    moduleName: "screener",
    query: {
      url: "https://${YF_QUERY_HOST}/v1/finance/screener/predefined/saved",
      definitions: definitions$2,
      schemaKey: "#/definitions/ScreenerOptions",
      defaults: queryOptionsDefaults$2,
      overrides: queryOptionsOverrides,
      needsCrumb: true
    },
    result: {
      definitions: definitions$2,
      schemaKey: "#/definitions/ScreenerResult",
      // deno-lint-ignore no-explicit-any
      transformWith(result) {
        if (!result.finance) {
          throw new Error("Unexpected result: " + JSON.stringify(result));
        }
        return result.finance.result[0];
      }
    },
    moduleOptions
  });
}
const schema$1 = {
  "definitions": {
    "SearchQuoteYahoo": {
      "type": "object",
      "properties": {
        "symbol": {
          "type": "string"
        },
        "isYahooFinance": {
          "type": "boolean",
          "const": true
        },
        "exchange": {
          "type": "string"
        },
        "exchDisp": {
          "type": "string"
        },
        "shortname": {
          "type": "string"
        },
        "longname": {
          "type": "string"
        },
        "index": {
          "type": "string",
          "const": "quotes"
        },
        "score": {
          "type": "number"
        },
        "newListingDate": {
          "type": "string",
          "format": "date-time"
        },
        "prevName": {
          "type": "string"
        },
        "nameChangeDate": {
          "type": "string",
          "format": "date-time"
        },
        "sector": {
          "type": "string"
        },
        "industry": {
          "type": "string"
        },
        "dispSecIndFlag": {
          "type": "boolean"
        }
      },
      "required": [
        "symbol",
        "isYahooFinance",
        "exchange",
        "index",
        "score"
      ],
      "additionalProperties": {}
    },
    "SearchQuoteYahooEquity": {
      "type": "object",
      "properties": {
        "symbol": {
          "type": "string"
        },
        "isYahooFinance": {
          "type": "boolean",
          "const": true
        },
        "exchange": {
          "type": "string"
        },
        "exchDisp": {
          "type": "string"
        },
        "shortname": {
          "type": "string"
        },
        "longname": {
          "type": "string"
        },
        "index": {
          "type": "string",
          "const": "quotes"
        },
        "score": {
          "type": "number"
        },
        "newListingDate": {
          "type": "string",
          "format": "date-time"
        },
        "prevName": {
          "type": "string"
        },
        "nameChangeDate": {
          "type": "string",
          "format": "date-time"
        },
        "sector": {
          "type": "string"
        },
        "industry": {
          "type": "string"
        },
        "dispSecIndFlag": {
          "type": "boolean"
        },
        "quoteType": {
          "type": "string",
          "const": "EQUITY"
        },
        "typeDisp": {
          "type": "string",
          "const": "Equity"
        },
        "sectorDisp": {
          "type": "string"
        },
        "industryDisp": {
          "type": "string"
        }
      },
      "required": [
        "exchange",
        "index",
        "isYahooFinance",
        "quoteType",
        "score",
        "symbol",
        "typeDisp"
      ]
    },
    "SearchQuoteYahooOption": {
      "type": "object",
      "properties": {
        "symbol": {
          "type": "string"
        },
        "isYahooFinance": {
          "type": "boolean",
          "const": true
        },
        "exchange": {
          "type": "string"
        },
        "exchDisp": {
          "type": "string"
        },
        "shortname": {
          "type": "string"
        },
        "longname": {
          "type": "string"
        },
        "index": {
          "type": "string",
          "const": "quotes"
        },
        "score": {
          "type": "number"
        },
        "newListingDate": {
          "type": "string",
          "format": "date-time"
        },
        "prevName": {
          "type": "string"
        },
        "nameChangeDate": {
          "type": "string",
          "format": "date-time"
        },
        "sector": {
          "type": "string"
        },
        "industry": {
          "type": "string"
        },
        "dispSecIndFlag": {
          "type": "boolean"
        },
        "quoteType": {
          "type": "string",
          "const": "OPTION"
        },
        "typeDisp": {
          "type": "string",
          "const": "Option"
        }
      },
      "required": [
        "exchange",
        "index",
        "isYahooFinance",
        "quoteType",
        "score",
        "symbol",
        "typeDisp"
      ]
    },
    "SearchQuoteYahooETF": {
      "type": "object",
      "properties": {
        "symbol": {
          "type": "string"
        },
        "isYahooFinance": {
          "type": "boolean",
          "const": true
        },
        "exchange": {
          "type": "string"
        },
        "exchDisp": {
          "type": "string"
        },
        "shortname": {
          "type": "string"
        },
        "longname": {
          "type": "string"
        },
        "index": {
          "type": "string",
          "const": "quotes"
        },
        "score": {
          "type": "number"
        },
        "newListingDate": {
          "type": "string",
          "format": "date-time"
        },
        "prevName": {
          "type": "string"
        },
        "nameChangeDate": {
          "type": "string",
          "format": "date-time"
        },
        "sector": {
          "type": "string"
        },
        "industry": {
          "type": "string"
        },
        "dispSecIndFlag": {
          "type": "boolean"
        },
        "quoteType": {
          "type": "string",
          "const": "ETF"
        },
        "typeDisp": {
          "type": "string",
          "const": "ETF"
        }
      },
      "required": [
        "exchange",
        "index",
        "isYahooFinance",
        "quoteType",
        "score",
        "symbol",
        "typeDisp"
      ]
    },
    "SearchQuoteYahooFund": {
      "type": "object",
      "properties": {
        "symbol": {
          "type": "string"
        },
        "isYahooFinance": {
          "type": "boolean",
          "const": true
        },
        "exchange": {
          "type": "string"
        },
        "exchDisp": {
          "type": "string"
        },
        "shortname": {
          "type": "string"
        },
        "longname": {
          "type": "string"
        },
        "index": {
          "type": "string",
          "const": "quotes"
        },
        "score": {
          "type": "number"
        },
        "newListingDate": {
          "type": "string",
          "format": "date-time"
        },
        "prevName": {
          "type": "string"
        },
        "nameChangeDate": {
          "type": "string",
          "format": "date-time"
        },
        "sector": {
          "type": "string"
        },
        "industry": {
          "type": "string"
        },
        "dispSecIndFlag": {
          "type": "boolean"
        },
        "quoteType": {
          "type": "string",
          "const": "MUTUALFUND"
        },
        "typeDisp": {
          "type": "string",
          "const": "Fund"
        }
      },
      "required": [
        "exchange",
        "index",
        "isYahooFinance",
        "quoteType",
        "score",
        "symbol",
        "typeDisp"
      ]
    },
    "SearchQuoteYahooIndex": {
      "type": "object",
      "properties": {
        "symbol": {
          "type": "string"
        },
        "isYahooFinance": {
          "type": "boolean",
          "const": true
        },
        "exchange": {
          "type": "string"
        },
        "exchDisp": {
          "type": "string"
        },
        "shortname": {
          "type": "string"
        },
        "longname": {
          "type": "string"
        },
        "index": {
          "type": "string",
          "const": "quotes"
        },
        "score": {
          "type": "number"
        },
        "newListingDate": {
          "type": "string",
          "format": "date-time"
        },
        "prevName": {
          "type": "string"
        },
        "nameChangeDate": {
          "type": "string",
          "format": "date-time"
        },
        "sector": {
          "type": "string"
        },
        "industry": {
          "type": "string"
        },
        "dispSecIndFlag": {
          "type": "boolean"
        },
        "quoteType": {
          "type": "string",
          "const": "INDEX"
        },
        "typeDisp": {
          "type": "string",
          "const": "Index"
        }
      },
      "required": [
        "exchange",
        "index",
        "isYahooFinance",
        "quoteType",
        "score",
        "symbol",
        "typeDisp"
      ]
    },
    "SearchQuoteYahooCurrency": {
      "type": "object",
      "properties": {
        "symbol": {
          "type": "string"
        },
        "isYahooFinance": {
          "type": "boolean",
          "const": true
        },
        "exchange": {
          "type": "string"
        },
        "exchDisp": {
          "type": "string"
        },
        "shortname": {
          "type": "string"
        },
        "longname": {
          "type": "string"
        },
        "index": {
          "type": "string",
          "const": "quotes"
        },
        "score": {
          "type": "number"
        },
        "newListingDate": {
          "type": "string",
          "format": "date-time"
        },
        "prevName": {
          "type": "string"
        },
        "nameChangeDate": {
          "type": "string",
          "format": "date-time"
        },
        "sector": {
          "type": "string"
        },
        "industry": {
          "type": "string"
        },
        "dispSecIndFlag": {
          "type": "boolean"
        },
        "quoteType": {
          "type": "string",
          "const": "CURRENCY"
        },
        "typeDisp": {
          "type": "string",
          "const": "Currency"
        }
      },
      "required": [
        "exchange",
        "index",
        "isYahooFinance",
        "quoteType",
        "score",
        "symbol",
        "typeDisp"
      ]
    },
    "SearchQuoteYahooCryptocurrency": {
      "type": "object",
      "properties": {
        "symbol": {
          "type": "string"
        },
        "isYahooFinance": {
          "type": "boolean",
          "const": true
        },
        "exchange": {
          "type": "string"
        },
        "exchDisp": {
          "type": "string"
        },
        "shortname": {
          "type": "string"
        },
        "longname": {
          "type": "string"
        },
        "index": {
          "type": "string",
          "const": "quotes"
        },
        "score": {
          "type": "number"
        },
        "newListingDate": {
          "type": "string",
          "format": "date-time"
        },
        "prevName": {
          "type": "string"
        },
        "nameChangeDate": {
          "type": "string",
          "format": "date-time"
        },
        "sector": {
          "type": "string"
        },
        "industry": {
          "type": "string"
        },
        "dispSecIndFlag": {
          "type": "boolean"
        },
        "quoteType": {
          "type": "string",
          "const": "CRYPTOCURRENCY"
        },
        "typeDisp": {
          "type": "string",
          "const": "Cryptocurrency"
        }
      },
      "required": [
        "exchange",
        "index",
        "isYahooFinance",
        "quoteType",
        "score",
        "symbol",
        "typeDisp"
      ]
    },
    "SearchQuoteYahooFuture": {
      "type": "object",
      "properties": {
        "symbol": {
          "type": "string"
        },
        "isYahooFinance": {
          "type": "boolean",
          "const": true
        },
        "exchange": {
          "type": "string"
        },
        "exchDisp": {
          "type": "string"
        },
        "shortname": {
          "type": "string"
        },
        "longname": {
          "type": "string"
        },
        "index": {
          "type": "string",
          "const": "quotes"
        },
        "score": {
          "type": "number"
        },
        "newListingDate": {
          "type": "string",
          "format": "date-time"
        },
        "prevName": {
          "type": "string"
        },
        "nameChangeDate": {
          "type": "string",
          "format": "date-time"
        },
        "sector": {
          "type": "string"
        },
        "industry": {
          "type": "string"
        },
        "dispSecIndFlag": {
          "type": "boolean"
        },
        "quoteType": {
          "type": "string",
          "const": "FUTURE"
        },
        "typeDisp": {
          "type": "string",
          "enum": [
            "Future",
            "Futures"
          ]
        }
      },
      "required": [
        "exchange",
        "index",
        "isYahooFinance",
        "quoteType",
        "score",
        "symbol",
        "typeDisp"
      ]
    },
    "SearchQuoteYahooMoneyMarket": {
      "type": "object",
      "properties": {
        "symbol": {
          "type": "string"
        },
        "isYahooFinance": {
          "type": "boolean",
          "const": true
        },
        "exchange": {
          "type": "string"
        },
        "exchDisp": {
          "type": "string"
        },
        "shortname": {
          "type": "string"
        },
        "longname": {
          "type": "string"
        },
        "index": {
          "type": "string",
          "const": "quotes"
        },
        "score": {
          "type": "number"
        },
        "newListingDate": {
          "type": "string",
          "format": "date-time"
        },
        "prevName": {
          "type": "string"
        },
        "nameChangeDate": {
          "type": "string",
          "format": "date-time"
        },
        "sector": {
          "type": "string"
        },
        "industry": {
          "type": "string"
        },
        "dispSecIndFlag": {
          "type": "boolean"
        },
        "quoteType": {
          "type": "string",
          "const": "MONEY_MARKET"
        },
        "typeDisp": {
          "type": "string",
          "const": "MoneyMarket"
        }
      },
      "required": [
        "exchange",
        "index",
        "isYahooFinance",
        "quoteType",
        "score",
        "symbol",
        "typeDisp"
      ]
    },
    "SearchQuoteNonYahoo": {
      "type": "object",
      "properties": {
        "index": {
          "type": "string"
        },
        "name": {
          "type": "string"
        },
        "permalink": {
          "type": "string"
        },
        "isYahooFinance": {
          "type": "boolean",
          "const": false
        }
      },
      "required": [
        "index",
        "name",
        "permalink",
        "isYahooFinance"
      ],
      "additionalProperties": {}
    },
    "SearchNews": {
      "type": "object",
      "properties": {
        "uuid": {
          "type": "string"
        },
        "title": {
          "type": "string"
        },
        "publisher": {
          "type": "string"
        },
        "link": {
          "type": "string"
        },
        "providerPublishTime": {
          "type": "string",
          "format": "date-time"
        },
        "type": {
          "type": "string"
        },
        "thumbnail": {
          "type": "object",
          "properties": {
            "resolutions": {
              "type": "array",
              "items": {
                "$ref": "#/definitions/SearchNewsThumbnailResolution"
              }
            }
          },
          "required": [
            "resolutions"
          ],
          "additionalProperties": false
        },
        "relatedTickers": {
          "type": "array",
          "items": {
            "type": "string"
          }
        }
      },
      "required": [
        "uuid",
        "title",
        "publisher",
        "link",
        "providerPublishTime",
        "type"
      ],
      "additionalProperties": {}
    },
    "SearchNewsThumbnailResolution": {
      "type": "object",
      "properties": {
        "url": {
          "type": "string"
        },
        "width": {
          "type": "number"
        },
        "height": {
          "type": "number"
        },
        "tag": {
          "type": "string"
        }
      },
      "required": [
        "url",
        "width",
        "height",
        "tag"
      ],
      "additionalProperties": false
    },
    "SearchResult": {
      "type": "object",
      "properties": {
        "explains": {
          "type": "array",
          "items": {}
        },
        "count": {
          "type": "number"
        },
        "quotes": {
          "type": "array",
          "items": {
            "anyOf": [
              {
                "$ref": "#/definitions/SearchQuoteYahooEquity"
              },
              {
                "$ref": "#/definitions/SearchQuoteYahooOption"
              },
              {
                "$ref": "#/definitions/SearchQuoteYahooETF"
              },
              {
                "$ref": "#/definitions/SearchQuoteYahooFund"
              },
              {
                "$ref": "#/definitions/SearchQuoteYahooIndex"
              },
              {
                "$ref": "#/definitions/SearchQuoteYahooCurrency"
              },
              {
                "$ref": "#/definitions/SearchQuoteYahooCryptocurrency"
              },
              {
                "$ref": "#/definitions/SearchQuoteNonYahoo"
              },
              {
                "$ref": "#/definitions/SearchQuoteYahooFuture"
              },
              {
                "$ref": "#/definitions/SearchQuoteYahooMoneyMarket"
              }
            ]
          }
        },
        "news": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/SearchNews"
          }
        },
        "nav": {
          "type": "array",
          "items": {}
        },
        "lists": {
          "type": "array",
          "items": {}
        },
        "researchReports": {
          "type": "array",
          "items": {}
        },
        "totalTime": {
          "type": "number"
        },
        "screenerFieldResults": {
          "type": "array",
          "items": {}
        },
        "culturalAssets": {
          "type": "array",
          "items": {}
        },
        "timeTakenForQuotes": {
          "type": "number"
        },
        "timeTakenForNews": {
          "type": "number"
        },
        "timeTakenForAlgowatchlist": {
          "type": "number"
        },
        "timeTakenForPredefinedScreener": {
          "type": "number"
        },
        "timeTakenForCrunchbase": {
          "type": "number"
        },
        "timeTakenForNav": {
          "type": "number"
        },
        "timeTakenForResearchReports": {
          "type": "number"
        },
        "timeTakenForScreenerField": {
          "type": "number"
        },
        "timeTakenForCulturalAssets": {
          "type": "number"
        },
        "timeTakenForSearchLists": {
          "type": "number"
        }
      },
      "required": [
        "explains",
        "count",
        "quotes",
        "news",
        "nav",
        "lists",
        "researchReports",
        "totalTime",
        "timeTakenForQuotes",
        "timeTakenForNews",
        "timeTakenForAlgowatchlist",
        "timeTakenForPredefinedScreener",
        "timeTakenForCrunchbase",
        "timeTakenForNav",
        "timeTakenForResearchReports",
        "timeTakenForScreenerField",
        "timeTakenForCulturalAssets",
        "timeTakenForSearchLists"
      ],
      "additionalProperties": {}
    },
    "SearchOptions": {
      "type": "object",
      "properties": {
        "lang": {
          "type": "string"
        },
        "region": {
          "type": "string"
        },
        "quotesCount": {
          "type": "number"
        },
        "newsCount": {
          "type": "number"
        },
        "enableFuzzyQuery": {
          "type": "boolean"
        },
        "quotesQueryId": {
          "type": "string"
        },
        "multiQuoteQueryId": {
          "type": "string"
        },
        "newsQueryId": {
          "type": "string"
        },
        "enableCb": {
          "type": "boolean"
        },
        "enableNavLinks": {
          "type": "boolean"
        },
        "enableEnhancedTrivialQuery": {
          "type": "boolean"
        }
      },
      "additionalProperties": false
    },
    "search": {}
  }
};
const definitions$1 = getTypedDefinitions(schema$1);
const queryOptionsDefaults$1 = {
  lang: "en-US",
  region: "US",
  quotesCount: 6,
  newsCount: 4,
  enableFuzzyQuery: false,
  quotesQueryId: "tss_match_phrase_query",
  multiQuoteQueryId: "multi_quote_single_token_query",
  newsQueryId: "news_cie_vespa",
  enableCb: true,
  enableNavLinks: true,
  enableEnhancedTrivialQuery: true
};
function search(query, queryOptionsOverrides, moduleOptions) {
  return this._moduleExec({
    moduleName: "search",
    query: {
      url: "https://${YF_QUERY_HOST}/v1/finance/search",
      definitions: definitions$1,
      schemaKey: "#/definitions/SearchOptions",
      defaults: queryOptionsDefaults$1,
      runtime: { q: query },
      overrides: queryOptionsOverrides
    },
    result: {
      definitions: definitions$1,
      schemaKey: "#/definitions/SearchResult"
    },
    moduleOptions
  });
}
const schema = {
  "definitions": {
    "TrendingSymbol": {
      "type": "object",
      "properties": {
        "symbol": {
          "type": "string"
        }
      },
      "required": [
        "symbol"
      ],
      "additionalProperties": {}
    },
    "TrendingSymbolsResult": {
      "type": "object",
      "properties": {
        "count": {
          "type": "number"
        },
        "quotes": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/TrendingSymbol"
          }
        },
        "jobTimestamp": {
          "type": "number"
        },
        "startInterval": {
          "type": "number"
        }
      },
      "required": [
        "count",
        "quotes",
        "jobTimestamp",
        "startInterval"
      ],
      "additionalProperties": {}
    },
    "TrendingSymbolsOptions": {
      "type": "object",
      "properties": {
        "lang": {
          "type": "string"
        },
        "region": {
          "type": "string"
        },
        "count": {
          "type": "number"
        }
      },
      "additionalProperties": false
    },
    "trendingSymbols": {}
  }
};
const definitions = getTypedDefinitions(schema);
const queryOptionsDefaults = {
  lang: "en-US",
  count: 5
};
function trendingSymbols(query, queryOptionsOverrides, moduleOptions) {
  return this._moduleExec({
    moduleName: "trendingSymbols",
    query: {
      url: "https://${YF_QUERY_HOST}/v1/finance/trending/" + query,
      definitions,
      schemaKey: "#/definitions/TrendingSymbolsOptions",
      defaults: queryOptionsDefaults,
      overrides: queryOptionsOverrides
    },
    result: {
      definitions,
      schemaKey: "#/definitions/TrendingSymbolsResult",
      // deno-lint-ignore no-explicit-any
      transformWith(result) {
        if (!result.finance) {
          throw new Error("Unexpected result: " + JSON.stringify(result));
        }
        return result.finance.result[0];
      }
    },
    moduleOptions
  });
}
const modules = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  autoc,
  chart,
  dailyGainers,
  dailyLosers,
  fundamentalsTimeSeries,
  historical,
  insights,
  options,
  quote,
  quoteSummary,
  recommendationsBySymbol,
  screener,
  search,
  trendingSymbols
});
const other = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  quoteCombine
});
const allModules = { ...modules, ...other };
const createOpts = { modules: allModules };
const YahooFinance2 = createYahooFinance(createOpts);
export {
  YahooFinance2 as Y
};
