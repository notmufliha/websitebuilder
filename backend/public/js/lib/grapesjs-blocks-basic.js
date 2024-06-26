/*! grapesjs-blocks-basic - 0.1.11 */
!(function (e, t) {
  "object" == typeof exports && "object" == typeof module
    ? (module.exports = t(require("grapesjs")))
    : "function" == typeof define && define.amd
      ? define(["grapesjs"], t)
      : "object" == typeof exports
        ? (exports["grapesjs-blocks-basic"] = t(require("grapesjs")))
        : (e["grapesjs-blocks-basic"] = t(e.grapesjs));
})(this, function (e) {
  return (function (e) {
    function t(a) {
      if (n[a]) return n[a].exports;
      var l = (n[a] = { i: a, l: !1, exports: {} });
      return e[a].call(l.exports, l, l.exports, t), (l.l = !0), l.exports;
    }
    var n = {};
    return (
      (t.m = e),
      (t.c = n),
      (t.d = function (e, n, a) {
        t.o(e, n) ||
          Object.defineProperty(e, n, {
            configurable: !1,
            enumerable: !0,
            get: a,
          });
      }),
      (t.n = function (e) {
        var n =
          e && e.__esModule
            ? function () {
              return e.default;
            }
            : function () {
              return e;
            };
        return t.d(n, "a", n), n;
      }),
      (t.o = function (e, t) {
        return Object.prototype.hasOwnProperty.call(e, t);
      }),
      (t.p = ""),
      t((t.s = 0))
    );
  })([
    function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 });
      var a =
        Object.assign ||
        function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var a in n)
              Object.prototype.hasOwnProperty.call(n, a) && (e[a] = n[a]);
          }
          return e;
        },
        l = n(1),
        i = (function (e) {
          return e && e.__esModule ? e : { default: e };
        })(l);
      t.default = i.default.plugins.add("gjs-blocks-basic", function (e) {
        var t =
          arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
          l = a(
            {
              blocks: [
                "column1",
                "column2",
                "column3",
                "column3-7",
                "text",
                "link",
                "image",
                "video",
                "map",
              ],
              flexGrid: 0,
              stylePrefix: "gjs-",
              addBasicStyle: !0,
              category: "Basic",
              labelColumn1: "1 Column",
              labelColumn2: "2 Columns",
              labelColumn3: "3 Columns",
              labelColumn37: "2 Columns 3/7",
              labelText: "Text",
              labelLink: "Link",
              labelImage: "Image",
              labelVideo: "Video",
              labelMap: "Map",
              rowHeight: 75,
            },
            t
          );
        n(2).default(e, l);
      });
    },
    function (t, n) {
      t.exports = e;
    },
    function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 });
      var a =
        Object.assign ||
        function (e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var a in n)
              Object.prototype.hasOwnProperty.call(n, a) && (e[a] = n[a]);
          }
          return e;
        };
      t.default = function (e) {
        var t =
          arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
          n = t,
          l = e.BlockManager,
          i = n.blocks,
          o = n.stylePrefix,
          s = n.flexGrid,
          r = n.addBasicStyle,
          c = n.rowHeight,
          d = o + "row",
          u = o + "cell",
          b = s
            ? "\n    ." +
            d +
            " {\n      display: flex;\n      justify-content: flex-start;\n      align-items: stretch;\n      flex-wrap: nowrap;\n      padding: 10px;\n    }\n    @media (max-width: 768px) {\n      ." +
            d +
            " {\n        flex-wrap: wrap;\n      }\n    }"
            : "\n    ." +
            d +
            " {\n      display: table;\n      padding: 10px;\n      width: 100%;\n    }\n    @media (max-width: 768pxpx) {\n      ." +
            o +
            "cell, ." +
            o +
            "cell30, ." +
            o +
            "cell70 {\n        width: 100%;\n        display: block;\n      }\n    }",
          f = s
            ? "\n    ." +
            u +
            " {\n      min-height: " +
            c +
            "px;\n      flex-grow: 1;\n      flex-basis: 100%;\n    }"
            : "\n    ." +
            u +
            " {\n      width: 8%;\n      display: table-cell;\n      height: " +
            c +
            "px;\n    }",
          g = "\n  ." + o + "cell30 {\n    width: 30%;\n  }",
          p = "\n  ." + o + "cell70 {\n    width: 70%;\n  }",
          y = { tl: 0, tc: 0, tr: 0, cl: 0, cr: 0, bl: 0, br: 0, minDim: 1 },
          m = a({}, y, { cr: 1, bc: 0, currentUnit: 1, minDim: 1, step: 0.2 });
        s && (m.keyWidth = "flex-basis");
        var v = {
          class: d,
          "data-gjs-droppable": "." + u,
          "data-gjs-resizable": y,
          "data-gjs-name": "Row",
        },
          x = {
            class: u,
            "data-gjs-draggable": "." + d,
            "data-gjs-resizable": m,
            "data-gjs-name": "Cell",
          };
        s &&
          ((x["data-gjs-unstylable"] = ["width"]),
            (x["data-gjs-stylable-require"] = ["flex-basis"]));
        var j = ["." + d, "." + u];
        e.on("selector:add", function (e) {
          return j.indexOf(e.getFullName()) >= 0 && e.set("private", 1);
        });
        var h = function (e) {
          var t = [];
          for (var n in e) {
            var a = e[n],
              l = a instanceof Array || a instanceof Object;
            (a = l ? JSON.stringify(a) : a),
              t.push(n + "=" + (l ? "'" + a + "'" : '"' + a + '"'));
          }
          return t.length ? " " + t.join(" ") : "";
        },
          w = function (e) {
            return i.indexOf(e) >= 0;
          },
          k = h(v),
          O = h(x);
        w("column1") &&
          l.add("column1", {
            label: n.labelColumn1,
            category: n.category,
            attributes: { class: "gjs-fonts gjs-f-b1" },
            content:
              "<div " +
              k +
              ">\n        <div " +
              O +
              "></div>\n      </div>\n      " +
              (r
                ? "<style>\n          " +
                b +
                "\n          " +
                f +
                "\n        </style>"
                : ""),
          }),
          w("column2") &&
          l.add("column2", {
            label: n.labelColumn2,
            attributes: { class: "gjs-fonts gjs-f-b2" },
            category: n.category,
            content:
              "<div " +
              k +
              ">\n        <div " +
              O +
              "></div>\n        <div " +
              O +
              "></div>\n      </div>\n      " +
              (r
                ? "<style>\n          " +
                b +
                "\n          " +
                f +
                "\n        </style>"
                : ""),
          }),
          w("column3") &&
          l.add("column3", {
            label: n.labelColumn3,
            category: n.category,
            attributes: { class: "gjs-fonts gjs-f-b3" },
            content:
              "<div " +
              k +
              ">\n        <div " +
              O +
              "></div>\n        <div " +
              O +
              "></div>\n        <div " +
              O +
              "></div>\n      </div>\n      " +
              (r
                ? "<style>\n          " +
                b +
                "\n          " +
                f +
                "\n        </style>"
                : ""),
          }),
          w("column3-7") &&
          l.add("column3-7", {
            label: n.labelColumn37,
            category: n.category,
            attributes: { class: "gjs-fonts gjs-f-b37" },
            content:
              "<div " +
              k +
              ">\n        <div " +
              O +
              ' style="' +
              (s ? "flex-basis" : "width") +
              ': 30%;"></div>\n        <div ' +
              O +
              ' style="' +
              (s ? "flex-basis" : "width") +
              ': 70%;"></div>\n      </div>\n      ' +
              (r
                ? "<style>\n          " +
                b +
                "\n          " +
                f +
                "\n          " +
                g +
                "\n          " +
                p +
                "\n        </style>"
                : ""),
          }),
          w("text") &&
          l.add("text", {
            label: n.labelText,
            category: n.category,
            attributes: { class: "gjs-fonts gjs-f-text" },
            content: {
              type: "text",
              content: "Insert your text here",
              style: { padding: "10px" },
              activeOnRender: 1,
            },
          }),
          w("link") &&
          l.add("link", {
            label: n.labelLink,
            category: n.category,
            attributes: { class: "fa fa-link" },
            content: {
              type: "link",
              content: "Link",
              style: { color: "#d983a6" },
            },
          }),
          w("image") &&
          l.add("image", {
            label: n.labelImage,
            category: n.category,
            attributes: { class: "gjs-fonts gjs-f-image" },
            content: {
              style: { color: "black" },
              type: "image",
              activeOnRender: 1,
            },
          }),
          w("video") &&
          l.add("video", {
            label: n.labelVideo,
            category: n.category,
            attributes: { class: "fa fa-youtube-play" },
            content: {
              type: "video",
              src: "img/video2.webm",
              style: { height: "350px", width: "615px" },
            },
          }),
          w("map") &&
          l.add("map", {
            label: n.labelMap,
            category: n.category,
            attributes: { class: "fa fa-map-o" },
            content: { type: "map", style: { height: "350px" } },
          });
      };
    },
  ]);
});
