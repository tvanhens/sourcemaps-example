// @ts-ignore
import validate from "sourcemap-validator";
import * as swc from "@swc/core";
import * as fs from "fs";

const raw = `
console.log('Hello')
throw(new Error("Ahh"))
`;

const out = swc.transformSync(raw, {
  filename: "hello.js",
  sourceMaps: true,
  plugin: swc.plugins([
    (m) => {
      m.body = [...m.body];
      return m;
    },
  ]),
});

validate(out.code, out.map, { "hello.js": raw });

const extraLog = {
  type: "ExpressionStatement",
  span: {
    start: 0,
    end: 0,
    ctxt: 0,
  },
  expression: {
    type: "CallExpression",
    span: {
      start: 0,
      end: 0,
      ctxt: 0,
    },
    callee: {
      type: "MemberExpression",
      span: {
        start: 0,
        end: 0,
        ctxt: 0,
      },
      object: {
        type: "Identifier",
        span: {
          start: 0,
          end: 0,
          ctxt: 0,
        },
        value: "console",
        optional: false,
      },
      property: {
        type: "Identifier",
        span: {
          start: 0,
          end: 0,
          ctxt: 0,
        },
        value: "log",
        optional: false,
      },
    },
    arguments: [
      {
        spread: null,
        expression: {
          type: "StringLiteral",
          span: {
            start: 0,
            end: 0,
            ctxt: 0,
          },
          value: "Yoooo",
          raw: '"Yoooo"',
        },
      },
    ],
    typeArguments: null,
  },
} as any;

const out2 = swc.transformSync(raw, {
  filename: "hello.js",
  sourceMaps: "inline",
  inlineSourcesContent: true,
  plugin: swc.plugins([
    (m) => {
      m.body = [extraLog, ...m.body];
      return m;
    },
  ]),
});

fs.writeFileSync("out.js", out2.code);
