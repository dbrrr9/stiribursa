var dist = {};
var test = {};
var definitions = {};
var hasRequiredDefinitions;
function requireDefinitions() {
  if (hasRequiredDefinitions) return definitions;
  hasRequiredDefinitions = 1;
  Object.defineProperty(definitions, "__esModule", { value: true });
  definitions.testDefinitions = void 0;
  definitions.testDefinitions = [];
  return definitions;
}
var hasRequiredTest;
function requireTest() {
  if (hasRequiredTest) return test;
  hasRequiredTest = 1;
  Object.defineProperty(test, "__esModule", { value: true });
  test.test = void 0;
  const definitions_js_1 = requireDefinitions();
  test.test = Object.assign(function test2() {
    handleDefinition(arguments);
  }, {
    ignore() {
      handleDefinition(arguments, { ignore: true });
    },
    only() {
      handleDefinition(arguments, { only: true });
    }
  });
  function handleDefinition(args, additional) {
    var _a, _b;
    let testDef;
    const firstArg = args[0];
    const secondArg = args[1];
    const thirdArg = args[2];
    if (typeof firstArg === "string") {
      if (typeof secondArg === "object") {
        if (typeof thirdArg === "function") {
          if (secondArg.fn != null) {
            throw new TypeError("Unexpected 'fn' field in options, test function is already provided as the third argument.");
          }
        }
        if (secondArg.name != null) {
          throw new TypeError("Unexpected 'name' field in options, test name is already provided as the first argument.");
        }
        testDef = { name: firstArg, fn: thirdArg, ...secondArg };
      } else {
        testDef = { name: firstArg, fn: secondArg };
      }
    } else if (firstArg instanceof Function) {
      if (firstArg.name.length === 0) {
        throw new TypeError("The test function must have a name");
      }
      testDef = { fn: firstArg, name: firstArg.name };
      if (secondArg != null) {
        throw new TypeError("Unexpected second argument to Deno.test()");
      }
    } else if (typeof firstArg === "object") {
      testDef = { ...firstArg };
      if (typeof secondArg === "function") {
        testDef.fn = secondArg;
        if (firstArg.fn != null) {
          throw new TypeError("Unexpected 'fn' field in options, test function is already provided as the second argument.");
        }
        if (testDef.name == null) {
          if (secondArg.name.length === 0) {
            throw new TypeError("The test function must have a name");
          }
          testDef.name = secondArg.name;
        }
      } else {
        if (typeof firstArg.fn !== "function") {
          throw new TypeError("Expected 'fn' field in the first argument to be a test function.");
        }
      }
    } else {
      throw new TypeError("Unknown test overload");
    }
    if (typeof testDef.fn !== "function") {
      throw new TypeError("Missing test function");
    }
    if (((_b = (_a = testDef.name) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) === 0) {
      throw new TypeError("The test name can't be empty");
    }
    if (additional === null || additional === void 0 ? void 0 : additional.ignore) {
      testDef.ignore = true;
    }
    if (additional === null || additional === void 0 ? void 0 : additional.only) {
      testDef.only = true;
    }
    definitions_js_1.testDefinitions.push(testDef);
  }
  return test;
}
var hasRequiredDist;
function requireDist() {
  if (hasRequiredDist) return dist;
  hasRequiredDist = 1;
  (function(exports) {
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
    var __exportStar = dist && dist.__exportStar || function(m, exports2) {
      for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p)) __createBinding(exports2, m, p);
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.testDefinitions = exports.Deno = void 0;
    exports.Deno = requireTest();
    __exportStar(requireTest(), exports);
    var definitions_js_1 = requireDefinitions();
    Object.defineProperty(exports, "testDefinitions", { enumerable: true, get: function() {
      return definitions_js_1.testDefinitions;
    } });
  })(dist);
  return dist;
}
export {
  requireDist as r
};
