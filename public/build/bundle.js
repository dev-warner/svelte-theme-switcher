var app = (function () {
  "use strict";
  function e() {}
  function t(e, t) {
    for (const n in t) e[n] = t[n];
    return e;
  }
  function n(e) {
    return e();
  }
  function c() {
    return Object.create(null);
  }
  function r(e) {
    e.forEach(n);
  }
  function l(e) {
    return "function" == typeof e;
  }
  function o(e, t) {
    return e != e
      ? t == t
      : e !== t || (e && "object" == typeof e) || "function" == typeof e;
  }
  function i(t, n, c) {
    t.$$.on_destroy.push(
      (function (t, ...n) {
        if (null == t) return e;
        const c = t.subscribe(...n);
        return c.unsubscribe ? () => c.unsubscribe() : c;
      })(n, c)
    );
  }
  function s(e) {
    const t = {};
    for (const n in e) "$" !== n[0] && (t[n] = e[n]);
    return t;
  }
  function a(e, t) {
    e.appendChild(t);
  }
  function h(e, t, n) {
    e.insertBefore(t, n || null);
  }
  function f(e) {
    e.parentNode.removeChild(e);
  }
  function u(e) {
    return document.createElement(e);
  }
  function d(e) {
    return document.createElementNS("http://www.w3.org/2000/svg", e);
  }
  function p(e) {
    return document.createTextNode(e);
  }
  function g() {
    return p(" ");
  }
  function m(e, t, n) {
    null == n
      ? e.removeAttribute(t)
      : e.getAttribute(t) !== n && e.setAttribute(t, n);
  }
  function y(e, t) {
    for (const n in t) m(e, n, t[n]);
  }
  function $(e) {
    return Array.from(e.childNodes);
  }
  function x(e, t, n, c) {
    for (let c = 0; c < e.length; c += 1) {
      const r = e[c];
      if (r.nodeName === t) {
        let t = 0;
        for (; t < r.attributes.length; ) {
          const e = r.attributes[t];
          n[e.name] ? t++ : r.removeAttribute(e.name);
        }
        return e.splice(c, 1)[0];
      }
    }
    return c ? d(t) : u(t);
  }
  function w(e, t) {
    for (let n = 0; n < e.length; n += 1) {
      const c = e[n];
      if (3 === c.nodeType) return (c.data = "" + t), e.splice(n, 1)[0];
    }
    return p(t);
  }
  let b;
  function v(e) {
    b = e;
  }
  const E = [],
    _ = [],
    k = [],
    M = [],
    F = Promise.resolve();
  let S = !1;
  function B(e) {
    k.push(e);
  }
  let C = !1;
  const L = new Set();
  function T() {
    if (!C) {
      C = !0;
      do {
        for (let e = 0; e < E.length; e += 1) {
          const t = E[e];
          v(t), D(t.$$);
        }
        for (E.length = 0; _.length; ) _.pop()();
        for (let e = 0; e < k.length; e += 1) {
          const t = k[e];
          L.has(t) || (L.add(t), t());
        }
        k.length = 0;
      } while (E.length);
      for (; M.length; ) M.pop()();
      (S = !1), (C = !1), L.clear();
    }
  }
  function D(e) {
    if (null !== e.fragment) {
      e.update(), r(e.before_update);
      const t = e.dirty;
      (e.dirty = [-1]),
        e.fragment && e.fragment.p(e.ctx, t),
        e.after_update.forEach(B);
    }
  }
  const j = new Set();
  let H;
  function A(e, t) {
    e && e.i && (j.delete(e), e.i(t));
  }
  function N(e, t, n, c) {
    if (e && e.o) {
      if (j.has(e)) return;
      j.add(e),
        H.c.push(() => {
          j.delete(e), c && (n && e.d(1), c());
        }),
        e.o(t);
    }
  }
  function O(e, t) {
    const n = {},
      c = {},
      r = { $$scope: 1 };
    let l = e.length;
    for (; l--; ) {
      const o = e[l],
        i = t[l];
      if (i) {
        for (const e in o) e in i || (c[e] = 1);
        for (const e in i) r[e] || ((n[e] = i[e]), (r[e] = 1));
        e[l] = i;
      } else for (const e in o) r[e] = 1;
    }
    for (const e in c) e in n || (n[e] = void 0);
    return n;
  }
  function z(e) {
    e && e.c();
  }
  function G(e, t, c) {
    const { fragment: o, on_mount: i, on_destroy: s, after_update: a } = e.$$;
    o && o.m(t, c),
      B(() => {
        const t = i.map(n).filter(l);
        s ? s.push(...t) : r(t), (e.$$.on_mount = []);
      }),
      a.forEach(B);
  }
  function P(e, t) {
    const n = e.$$;
    null !== n.fragment &&
      (r(n.on_destroy),
      n.fragment && n.fragment.d(t),
      (n.on_destroy = n.fragment = null),
      (n.ctx = []));
  }
  function I(e, t) {
    -1 === e.$$.dirty[0] &&
      (E.push(e), S || ((S = !0), F.then(T)), e.$$.dirty.fill(0)),
      (e.$$.dirty[(t / 31) | 0] |= 1 << t % 31);
  }
  function W(t, n, l, o, i, s, a = [-1]) {
    const h = b;
    v(t);
    const u = n.props || {},
      d = (t.$$ = {
        fragment: null,
        ctx: null,
        props: s,
        update: e,
        not_equal: i,
        bound: c(),
        on_mount: [],
        on_destroy: [],
        before_update: [],
        after_update: [],
        context: new Map(h ? h.$$.context : []),
        callbacks: c(),
        dirty: a,
      });
    let p = !1;
    if (
      ((d.ctx = l
        ? l(t, u, (e, n, ...c) => {
            const r = c.length ? c[0] : n;
            return (
              d.ctx &&
                i(d.ctx[e], (d.ctx[e] = r)) &&
                (d.bound[e] && d.bound[e](r), p && I(t, e)),
              n
            );
          })
        : []),
      d.update(),
      (p = !0),
      r(d.before_update),
      (d.fragment = !!o && o(d.ctx)),
      n.target)
    ) {
      if (n.hydrate) {
        const e = $(n.target);
        d.fragment && d.fragment.l(e), e.forEach(f);
      } else d.fragment && d.fragment.c();
      n.intro && A(t.$$.fragment), G(t, n.target, n.anchor), T();
    }
    v(h);
  }
  class q {
    $destroy() {
      P(this, 1), (this.$destroy = e);
    }
    $on(e, t) {
      const n = this.$$.callbacks[e] || (this.$$.callbacks[e] = []);
      return (
        n.push(t),
        () => {
          const e = n.indexOf(t);
          -1 !== e && n.splice(e, 1);
        }
      );
    }
    $set() {}
  }
  const Y = { classList: [], height: "30px" },
    J = ["background", "light", "dark", "height", "width", "transition"];
  function K(e) {
    const { classList: t, ...n } = e;
    return (function e(t, n = "") {
      return Object.keys(t)
        .map((c) => {
          if (!J.includes(c)) return;
          const r = t[c];
          return "object" == typeof r
            ? e(r, n ? `${n}-${c}` : c)
            : `--theme-switcher-${n ? `${n}-` : ""}${c}: ${r};`;
        })
        .flat()
        .filter(Boolean)
        .join(" ");
    })(n);
  }
  const Q = [];
  const R = "dark",
    U = "light",
    V =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches,
    X = localStorage.getItem("current:theme"),
    Z = (function (t, n = e) {
      let c;
      const r = [];
      function l(e) {
        if (o(t, e) && ((t = e), c)) {
          const e = !Q.length;
          for (let e = 0; e < r.length; e += 1) {
            const n = r[e];
            n[1](), Q.push(n, t);
          }
          if (e) {
            for (let e = 0; e < Q.length; e += 2) Q[e][0](Q[e + 1]);
            Q.length = 0;
          }
        }
      }
      return {
        set: l,
        update: function (e) {
          l(e(t));
        },
        subscribe: function (o, i = e) {
          const s = [o, i];
          return (
            r.push(s),
            1 === r.length && (c = n(l) || e),
            o(t),
            () => {
              const e = r.indexOf(s);
              -1 !== e && r.splice(e, 1), 0 === r.length && (c(), (c = null));
            }
          );
        },
      };
    })(X || (V ? R : U));
  function ee() {
    Z.update((e) => (e === R ? U : R));
  }
  function te(n) {
    let c,
      r,
      l,
      o,
      i,
      s,
      u,
      g,
      b,
      v,
      E,
      _,
      k,
      M,
      F = [
        { xmlns: "http://www.w3.org/2000/svg" },
        { viewBox: "0 0 36 36" },
        n[0],
      ],
      S = {};
    for (let e = 0; e < F.length; e += 1) S = t(S, F[e]);
    return {
      c() {
        (c = d("svg")),
          (r = d("title")),
          (l = p("Light theme on: Sun")),
          (o = d("path")),
          (i = d("g")),
          (s = d("circle")),
          (u = d("circle")),
          (g = d("circle")),
          (b = d("circle")),
          (v = d("circle")),
          (E = d("circle")),
          (_ = d("circle")),
          (k = d("circle")),
          (M = d("path")),
          this.h();
      },
      l(e) {
        c = x(e, "svg", { xmlns: !0, viewBox: !0 }, 1);
        var t = $(c);
        r = x(t, "title", {}, 1);
        var n = $(r);
        (l = w(n, "Light theme on: Sun")),
          n.forEach(f),
          (o = x(t, "path", { fill: !0, d: !0 }, 1)),
          $(o).forEach(f),
          (i = x(t, "g", { fill: !0 }, 1));
        var a = $(i);
        (s = x(a, "circle", { cx: !0, cy: !0, r: !0 }, 1)),
          $(s).forEach(f),
          (u = x(a, "circle", { cx: !0, cy: !0, r: !0 }, 1)),
          $(u).forEach(f),
          (g = x(a, "circle", { cx: !0, cy: !0, r: !0 }, 1)),
          $(g).forEach(f),
          (b = x(a, "circle", { cx: !0, cy: !0, r: !0 }, 1)),
          $(b).forEach(f),
          (v = x(a, "circle", { cx: !0, cy: !0, r: !0 }, 1)),
          $(v).forEach(f),
          (E = x(a, "circle", { cx: !0, cy: !0, r: !0 }, 1)),
          $(E).forEach(f),
          (_ = x(a, "circle", { cx: !0, cy: !0, r: !0 }, 1)),
          $(_).forEach(f),
          (k = x(a, "circle", { cx: !0, cy: !0, r: !0 }, 1)),
          $(k).forEach(f),
          a.forEach(f),
          (M = x(t, "path", { d: !0, fill: !0 }, 1)),
          $(M).forEach(f),
          t.forEach(f),
          this.h();
      },
      h() {
        m(o, "fill", "#FFD983"),
          m(
            o,
            "d",
            "M36 18c0 9.941-8.059 18-18 18S0 27.941 0 18 8.059 0 18 0s18 8.059 18 18"
          ),
          m(s, "cx", "9.5"),
          m(s, "cy", "7.5"),
          m(s, "r", "3.5"),
          m(u, "cx", "24.5"),
          m(u, "cy", "28.5"),
          m(u, "r", "3.5"),
          m(g, "cx", "22"),
          m(g, "cy", "5"),
          m(g, "r", "2"),
          m(b, "cx", "3"),
          m(b, "cy", "18"),
          m(b, "r", "1"),
          m(v, "cx", "30"),
          m(v, "cy", "9"),
          m(v, "r", "1"),
          m(E, "cx", "16"),
          m(E, "cy", "31"),
          m(E, "r", "1"),
          m(_, "cx", "32"),
          m(_, "cy", "19"),
          m(_, "r", "2"),
          m(k, "cx", "6"),
          m(k, "cy", "26"),
          m(k, "r", "2"),
          m(i, "fill", "#FFCC4D"),
          m(
            M,
            "d",
            "M18 24.904c-7 0-9-2.618-9-1.381C9 24.762 13 28 18 28s9-3.238\n    9-4.477c0-1.237-2 1.381-9 1.381M27 15c0 1.657-1.344 3-3 3s-3-1.343-3-3\n    1.344-3 3-3 3 1.343 3 3m-12 0c0 1.657-1.344 3-3 3s-3-1.343-3-3 1.344-3 3-3 3\n    1.343 3 3"
          ),
          m(M, "fill", "#292F33"),
          y(c, S);
      },
      m(e, t) {
        h(e, c, t),
          a(c, r),
          a(r, l),
          a(c, o),
          a(c, i),
          a(i, s),
          a(i, u),
          a(i, g),
          a(i, b),
          a(i, v),
          a(i, E),
          a(i, _),
          a(i, k),
          a(c, M);
      },
      p(e, [t]) {
        y(
          c,
          O(F, [
            { xmlns: "http://www.w3.org/2000/svg" },
            { viewBox: "0 0 36 36" },
            1 & t && e[0],
          ])
        );
      },
      i: e,
      o: e,
      d(e) {
        e && f(c);
      },
    };
  }
  function ne(e, n, c) {
    return (
      (e.$set = (e) => {
        c(0, (n = t(t({}, n), s(e))));
      }),
      [(n = s(n))]
    );
  }
  window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener(
      "change",
      function (e) {
        const t = e.matches ? R : U;
        Z.set(t);
      },
      !0
    ),
    Z.subscribe((e) => {
      document.body.classList.remove(`theme-${e === R ? U : R}`),
        document.body.classList.add(`theme-${e}`),
        localStorage.setItem("current:theme", e);
    });
  class ce extends q {
    constructor(e) {
      super(), W(this, e, ne, te, o, {});
    }
  }
  function re(n) {
    let c,
      r,
      l,
      o,
      i,
      s,
      u,
      g,
      b,
      v,
      E,
      _,
      k,
      M,
      F = [
        { xmlns: "http://www.w3.org/2000/svg" },
        { viewBox: "0 0 36 36" },
        n[0],
      ],
      S = {};
    for (let e = 0; e < F.length; e += 1) S = t(S, F[e]);
    return {
      c() {
        (c = d("svg")),
          (r = d("title")),
          (l = p("Dark theme on: Moon")),
          (o = d("circle")),
          (i = d("path")),
          (s = d("circle")),
          (u = d("circle")),
          (g = d("circle")),
          (b = d("circle")),
          (v = d("circle")),
          (E = d("circle")),
          (_ = d("circle")),
          (k = d("circle")),
          (M = d("circle")),
          this.h();
      },
      l(e) {
        c = x(e, "svg", { xmlns: !0, viewBox: !0 }, 1);
        var t = $(c);
        r = x(t, "title", {}, 1);
        var n = $(r);
        (l = w(n, "Dark theme on: Moon")),
          n.forEach(f),
          (o = x(t, "circle", { fill: !0, cx: !0, cy: !0, r: !0 }, 1)),
          $(o).forEach(f),
          (i = x(t, "path", { fill: !0, d: !0 }, 1)),
          $(i).forEach(f),
          (s = x(t, "circle", { fill: !0, cx: !0, cy: !0, r: !0 }, 1)),
          $(s).forEach(f),
          (u = x(t, "circle", { fill: !0, cx: !0, cy: !0, r: !0 }, 1)),
          $(u).forEach(f),
          (g = x(t, "circle", { fill: !0, cx: !0, cy: !0, r: !0 }, 1)),
          $(g).forEach(f),
          (b = x(t, "circle", { fill: !0, cx: !0, cy: !0, r: !0 }, 1)),
          $(b).forEach(f),
          (v = x(t, "circle", { fill: !0, cx: !0, cy: !0, r: !0 }, 1)),
          $(v).forEach(f),
          (E = x(t, "circle", { fill: !0, cx: !0, cy: !0, r: !0 }, 1)),
          $(E).forEach(f),
          (_ = x(t, "circle", { fill: !0, cx: !0, cy: !0, r: !0 }, 1)),
          $(_).forEach(f),
          (k = x(t, "circle", { fill: !0, cx: !0, cy: !0, r: !0 }, 1)),
          $(k).forEach(f),
          (M = x(t, "circle", { fill: !0, cx: !0, cy: !0, r: !0 }, 1)),
          $(M).forEach(f),
          t.forEach(f),
          this.h();
      },
      h() {
        m(o, "fill", "#FFD983"),
          m(o, "cx", "18"),
          m(o, "cy", "18"),
          m(o, "r", "18"),
          m(i, "fill", "#66757F"),
          m(
            i,
            "d",
            "M0 18c0 9.941 8.059 18 18 18 .295 0 .58-.029.87-.043C24.761 33.393 29\n    26.332 29 18 29 9.669 24.761 2.607 18.87.044 18.58.03 18.295 0 18 0 8.059 0\n    0 8.059 0 18z"
          ),
          m(s, "fill", "#5B6876"),
          m(s, "cx", "10.5"),
          m(s, "cy", "8.5"),
          m(s, "r", "3.5"),
          m(u, "fill", "#5B6876"),
          m(u, "cx", "20"),
          m(u, "cy", "16"),
          m(u, "r", "3"),
          m(g, "fill", "#5B6876"),
          m(g, "cx", "21.5"),
          m(g, "cy", "27.5"),
          m(g, "r", "3.5"),
          m(b, "fill", "#5B6876"),
          m(b, "cx", "21"),
          m(b, "cy", "6"),
          m(b, "r", "2"),
          m(v, "fill", "#5B6876"),
          m(v, "cx", "3"),
          m(v, "cy", "18"),
          m(v, "r", "1"),
          m(E, "fill", "#FFCC4D"),
          m(E, "cx", "30"),
          m(E, "cy", "9"),
          m(E, "r", "1"),
          m(_, "fill", "#5B6876"),
          m(_, "cx", "15"),
          m(_, "cy", "31"),
          m(_, "r", "1"),
          m(k, "fill", "#FFCC4D"),
          m(k, "cx", "32"),
          m(k, "cy", "19"),
          m(k, "r", "2"),
          m(M, "fill", "#5B6876"),
          m(M, "cx", "10"),
          m(M, "cy", "23"),
          m(M, "r", "2"),
          y(c, S);
      },
      m(e, t) {
        h(e, c, t),
          a(c, r),
          a(r, l),
          a(c, o),
          a(c, i),
          a(c, s),
          a(c, u),
          a(c, g),
          a(c, b),
          a(c, v),
          a(c, E),
          a(c, _),
          a(c, k),
          a(c, M);
      },
      p(e, [t]) {
        y(
          c,
          O(F, [
            { xmlns: "http://www.w3.org/2000/svg" },
            { viewBox: "0 0 36 36" },
            1 & t && e[0],
          ])
        );
      },
      i: e,
      o: e,
      d(e) {
        e && f(c);
      },
    };
  }
  function le(e, n, c) {
    return (
      (e.$set = (e) => {
        c(0, (n = t(t({}, n), s(e))));
      }),
      [(n = s(n))]
    );
  }
  class oe extends q {
    constructor(e) {
      super(), W(this, e, le, re, o, {});
    }
  }
  function ie(e) {
    let t;
    const n = new ce({ props: { width: e[1], height: e[1] } });
    return {
      c() {
        z(n.$$.fragment);
      },
      m(e, c) {
        G(n, e, c), (t = !0);
      },
      p(e, t) {
        const c = {};
        2 & t && (c.width = e[1]), 2 & t && (c.height = e[1]), n.$set(c);
      },
      i(e) {
        t || (A(n.$$.fragment, e), (t = !0));
      },
      o(e) {
        N(n.$$.fragment, e), (t = !1);
      },
      d(e) {
        P(n, e);
      },
    };
  }
  function se(e) {
    let t;
    const n = new oe({ props: { width: e[1], height: e[1] } });
    return {
      c() {
        z(n.$$.fragment);
      },
      m(e, c) {
        G(n, e, c), (t = !0);
      },
      p(e, t) {
        const c = {};
        2 & t && (c.width = e[1]), 2 & t && (c.height = e[1]), n.$set(c);
      },
      i(e) {
        t || (A(n.$$.fragment, e), (t = !0));
      },
      o(e) {
        N(n.$$.fragment, e), (t = !1);
      },
      d(e) {
        P(n, e);
      },
    };
  }
  function ae(e) {
    let t, n, c, l, o, i, s;
    const d = [se, ie],
      p = [];
    function g(e, t) {
      return e[0] ? 0 : 1;
    }
    return (
      (c = g(e)),
      (l = p[c] = d[c](e)),
      {
        c() {
          (t = u("button")),
            (n = u("span")),
            l.c(),
            m(n, "class", "theme-switcher__state svelte-38g5hk"),
            m(
              t,
              "class",
              (o = "theme-switcher " + e[2].join(" ") + " svelte-38g5hk")
            ),
            m(t, "aria-label", "Switch theme"),
            m(t, "style", e[3]);
        },
        m(e, r, l) {
          var o, f, u, d;
          h(e, t, r),
            a(t, n),
            p[c].m(n, null),
            (i = !0),
            l && s(),
            (f = "click"),
            (u = ee),
            (o = t).addEventListener(f, u, d),
            (s = () => o.removeEventListener(f, u, d));
        },
        p(e, [s]) {
          let a = c;
          (c = g(e)),
            c === a
              ? p[c].p(e, s)
              : ((H = { r: 0, c: [], p: H }),
                N(p[a], 1, 1, () => {
                  p[a] = null;
                }),
                H.r || r(H.c),
                (H = H.p),
                (l = p[c]),
                l || ((l = p[c] = d[c](e)), l.c()),
                A(l, 1),
                l.m(n, null)),
            (!i ||
              (4 & s &&
                o !==
                  (o =
                    "theme-switcher " + e[2].join(" ") + " svelte-38g5hk"))) &&
              m(t, "class", o),
            (!i || 8 & s) && m(t, "style", e[3]);
        },
        i(e) {
          i || (A(l), (i = !0));
        },
        o(e) {
          N(l), (i = !1);
        },
        d(e) {
          e && f(t), p[c].d(), s();
        },
      }
    );
  }
  function he(e, t, n) {
    let c;
    i(e, Z, (e) => n(5, (c = e)));
    let r,
      l,
      o,
      s,
      a,
      { options: h = Y } = t;
    return (
      (e.$set = (e) => {
        "options" in e && n(4, (h = e.options));
      }),
      (e.$$.update = () => {
        32 & e.$$.dirty && n(0, (r = c === R)),
          16 & e.$$.dirty && n(6, (o = { ...Y, ...h })),
          64 & e.$$.dirty &&
            n(1, (l = Number(String(o.height).split("px").shift()))),
          65 & e.$$.dirty &&
            n(
              2,
              (s = [
                ...[o.classList].flat(),
                r
                  ? "theme-switcher__state--dark"
                  : "theme-switcher__state--light",
              ])
            ),
          64 & e.$$.dirty && n(3, (a = K(o)));
      }),
      [r, l, s, a, h]
    );
  }
  class fe extends q {
    constructor(e) {
      super(), W(this, e, he, ae, o, { options: 4 });
    }
  }
  function ue(e) {
    let t,
      n,
      c,
      r,
      l,
      o,
      i,
      s,
      d,
      y,
      $,
      x,
      w,
      b,
      v,
      E,
      _,
      k,
      M,
      F,
      S,
      B,
      C,
      L,
      T;
    const D = new fe({});
    return {
      c() {
        (t = u("section")),
          (n = u("header")),
          z(D.$$.fragment),
          (c = g()),
          (r = u("ul")),
          (r.innerHTML =
            '<li class="header__link svelte-b8h8le"><a class="github-button" href="https://github.com/dev-warner" data-color-scheme="no-preference: light; light: light; dark: dark;" data-size="large" aria-label="Follow @dev-warner on GitHub">\n          Follow @dev-warner\n        </a></li> \n      <li class="header__link svelte-b8h8le"><a class="github-button" href="https://github.com/dev-warner/svelte-theme-switcher" data-color-scheme="no-preference: dark;" data-icon="octicon-star" data-size="large" aria-label="Star dev-warner/svelte-theme-switcher on GitHub">\n          Star\n        </a></li>'),
          (l = g()),
          (o = u("h1")),
          (i = p("What a lovely\n    ")),
          (s = u("b")),
          (d = p(e[0])),
          (y = p("\n    theme you have!")),
          ($ = g()),
          (x = u("h2")),
          (x.textContent = "Features"),
          (w = g()),
          (b = u("ul")),
          (b.innerHTML =
            '<li class="svelte-b8h8le">Selection gets persisted</li> \n    <li class="svelte-b8h8le">Theme reacts to user preferences</li> \n    <li class="svelte-b8h8le">You get a lovely happy switch button</li>'),
          (v = g()),
          (E = u("p")),
          (E.textContent =
            "Fancy stuff, you should open up your OS settings and see this site react to\n    your preferences."),
          (_ = g()),
          (k = u("ul")),
          (k.innerHTML =
            '<li class="svelte-b8h8le"><span>Mac OS:</span> \n      <pre><code class="svelte-b8h8le">Preferences &gt; General &gt; Appearance.</code></pre>\n      Then select your theme\n    </li> \n    <li class="svelte-b8h8le"><span>Windows 10:</span> \n      <pre><code class="svelte-b8h8le">Settings &gt; Personalization &gt; Colors.</code></pre>\n      Then scroll down under Choose your mode and select Dark.\n    </li>'),
          (M = g()),
          (F = u("h2")),
          (F.textContent = "Try it out"),
          (S = g()),
          (B = u("pre")),
          (B.innerHTML =
            '<code class="svelte-b8h8le">$ npm i svelte-theme-switcher</code>'),
          (C = g()),
          (L = u("pre")),
          (L.innerHTML =
            '<code class="svelte-b8h8le">$ yarn add svelte-theme-switcher</code>'),
          m(r, "class", "header__links svelte-b8h8le"),
          m(n, "class", "header svelte-b8h8le"),
          m(b, "class", "svelte-b8h8le"),
          m(E, "class", "svelte-b8h8le"),
          m(k, "class", "svelte-b8h8le"),
          m(t, "class", "container svelte-b8h8le");
      },
      m(e, f) {
        h(e, t, f),
          a(t, n),
          G(D, n, null),
          a(n, c),
          a(n, r),
          a(t, l),
          a(t, o),
          a(o, i),
          a(o, s),
          a(s, d),
          a(o, y),
          a(t, $),
          a(t, x),
          a(t, w),
          a(t, b),
          a(t, v),
          a(t, E),
          a(t, _),
          a(t, k),
          a(t, M),
          a(t, F),
          a(t, S),
          a(t, B),
          a(t, C),
          a(t, L),
          (T = !0);
      },
      p(e, [t]) {
        (!T || 1 & t) &&
          (function (e, t) {
            (t = "" + t), e.data !== t && (e.data = t);
          })(d, e[0]);
      },
      i(e) {
        T || (A(D.$$.fragment, e), (T = !0));
      },
      o(e) {
        N(D.$$.fragment, e), (T = !1);
      },
      d(e) {
        e && f(t), P(D);
      },
    };
  }
  function de(e, t, n) {
    let c;
    return i(e, Z, (e) => n(0, (c = e))), [c];
  }
  return new (class extends q {
    constructor(e) {
      super(), W(this, e, de, ue, o, {});
    }
  })({ target: document.body });
})();
//# sourceMappingURL=bundle.js.map
