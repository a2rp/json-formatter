import assert from "node:assert/strict";
import test from "node:test";
import { formatJson, getJsonErrorDetails, minifyJson, sortJsonValue } from "./jsonFormatter.js";

test("formats objects, arrays, and primitive JSON roots", () => {
    assert.equal(formatJson('{"name":"Ada","active":true}', 2), '{\n  "name": "Ada",\n  "active": true\n}');
    assert.equal(formatJson("[1,2,null]", 4), "[\n    1,\n    2,\n    null\n]");
    assert.equal(formatJson('"ready"'), '"ready"');
});

test("minifies valid JSON without changing its values", () => {
    assert.equal(minifyJson('{ "count": 2, "tags": ["a", "b"] }'), '{"count":2,"tags":["a","b"]}');
});

test("sorts keys recursively while preserving arrays and values", () => {
    const value = { zebra: 1, apple: { kiwi: 2, banana: 3 }, list: [{ z: 1, a: 2 }] };
    assert.deepEqual(sortJsonValue(value), { apple: { banana: 3, kiwi: 2 }, list: [{ a: 2, z: 1 }], zebra: 1 });
    assert.equal(formatJson('{"z":1,"a":{"y":2,"b":3}}', 2, true), '{\n  "a": {\n    "b": 3,\n    "y": 2\n  },\n  "z": 1\n}');
});

test("reports the syntax error line and column when the runtime includes a position", () => {
    const source = '{\n  "name": "Ada",\n  "active": }';
    const error = new SyntaxError("Unexpected token at position 31");
    const details = getJsonErrorDetails(error, source);
    assert.equal(details.line, 3);
    assert.ok(details.column > 1);
});

test("uses parser-provided line and column details if no character position is given", () => {
    const details = getJsonErrorDetails(new SyntaxError("Invalid JSON at line 4 column 9"), "{}");
    assert.equal(details.line, 4);
    assert.equal(details.column, 9);
});

test("keeps the parser explanation when a runtime does not expose a location", () => {
    const details = getJsonErrorDetails(new SyntaxError("Unexpected token, input is not valid JSON"), "{}");
    assert.equal(details.line, null);
    assert.match(details.message, /not valid JSON/);
});

test("accepts object keys without reordering unless the option is enabled", () => {
    assert.equal(formatJson('{"z":1,"a":2}', 2), '{\n  "z": 1,\n  "a": 2\n}');
    assert.equal(minifyJson('{"z":1,"a":2}', true), '{"a":2,"z":1}');
});
