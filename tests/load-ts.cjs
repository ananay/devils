const fs = require('node:fs');
const ts = require('typescript');
const { createRequire } = require('node:module');
exports.load = (filename, mocks = {}) => {
 const source = fs.readFileSync(filename, 'utf8');
 const code = ts.transpileModule(source, {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
 const module = {exports:{}}; const native = createRequire(filename);
 const requireMock = id => Object.hasOwn(mocks,id) ? mocks[id] : native(id);
 new Function('require','module','exports',code)(requireMock,module,module.exports);
 return module.exports;
};
