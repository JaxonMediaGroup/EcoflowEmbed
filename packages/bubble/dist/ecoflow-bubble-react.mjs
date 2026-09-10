var Ta = Object.defineProperty;
var Un = (l) => {
  throw TypeError(l);
};
var Aa = (l, r, a) => r in l ? Ta(l, r, { enumerable: !0, configurable: !0, writable: !0, value: a }) : l[r] = a;
var Vt = (l, r, a) => Aa(l, typeof r != "symbol" ? r + "" : r, a), Sa = (l, r, a) => r.has(l) || Un("Cannot " + a);
var qn = (l, r, a) => r.has(l) ? Un("Cannot add the same private member more than once") : r instanceof WeakSet ? r.add(l) : r.set(l, a);
var ds = (l, r, a) => (Sa(l, r, "access private method"), a);
import { useRef as Ea, useEffect as Ca, createElement as Pa } from "react";
const vn = {
  chatflowId: "",
  apiHost: "",
  buttonType: "icon",
  buttonSide: "right",
  buttonBottom: "20px",
  buttonOffsetX: "20px",
  buttonWidth: "60px",
  buttonHeight: "60px",
  buttonBackgroundColor: "#1b2f55",
  buttonZIndex: "10001",
  buttonText: "💬",
  buttonImageSrc: "",
  buttonAriaLabel: "Abrir chat",
  lottieAnimationPath: "",
  lottieLoop: !0,
  lottieAutoplay: !0,
  tooltipEnabled: !1,
  tooltipText: "¡Haz clic para chatear!",
  tooltipBackgroundColor: "#333333",
  tooltipTextColor: "#ffffff",
  tooltipFontSize: "13px",
  tooltipPadding: "5px 10px",
  tooltipBorderRadius: "8px",
  tooltipPositionOffset: 8,
  windowTitle: "Asistente Virtual",
  windowWelcomeMessage: "",
  windowWidth: 400,
  windowHeight: 500,
  windowErrorMessage: "Lo siento, ocurrió un error de conexión. ¿Podrías intentarlo de nuevo?",
  windowShowAgentMessages: !1,
  windowBackgroundColor: "#ffffff",
  windowFontSize: 15,
  windowFontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  windowHeaderBackgroundColor: "",
  windowZIndex: "10000",
  botMessageBackgroundColor: "#f0f2f7",
  botMessageTextColor: "#303235",
  botMessageShowAvatar: !0,
  botMessageAvatarSrc: "",
  userMessageBackgroundColor: "#1b2f55",
  userMessageTextColor: "#ffffff",
  userMessageShowAvatar: !1,
  userMessageAvatarSrc: "",
  textInputPlaceholder: "Escribe tu pregunta aquí...",
  textInputBackgroundColor: "#ffffff",
  textInputTextColor: "#303235",
  textInputSendButtonColor: "#1b2f55",
  textInputMaxChars: 1e3,
  textInputAutoFocus: !0,
  footerText: "Powered by",
  footerCompany: "",
  footerCompanyLink: "",
  footerTextColor: "#9aa0a6"
}, Io = {
  themeChatWindowTitle: "windowTitle",
  themeChatWindowWelcomeMessage: "windowWelcomeMessage",
  themeChatWindowHeight: "windowHeight",
  themeChatWindowWidth: "windowWidth",
  themeChatWindowErrorMessage: "windowErrorMessage",
  themeChatWindowShowAgentMessages: "windowShowAgentMessages",
  themeChatWindowBackgroundColor: "windowBackgroundColor",
  themeChatWindowFontSize: "windowFontSize",
  themeButtonBackgroundColor: "buttonBackgroundColor",
  themeButtonRight: "buttonOffsetX",
  themeButtonBottom: "buttonBottom",
  themeButtonZIndex: "buttonZIndex",
  themeZIndex: "windowZIndex",
  lottieButtonBottom: "buttonBottom",
  lottieButtonRight: "buttonOffsetX",
  lottieButtonLeft: { key: "buttonOffsetX", extra: { buttonSide: "left" } },
  lottieButtonWidth: "buttonWidth",
  lottieButtonHeight: "buttonHeight",
  lottieButtonZIndex: "buttonZIndex",
  lottieTooltipEnabled: "tooltipEnabled",
  lottieTooltipText: "tooltipText",
  lottieTooltipBackgroundColor: "tooltipBackgroundColor",
  lottieTooltipTextColor: "tooltipTextColor",
  lottieTooltipFontSize: "tooltipFontSize",
  lottieTooltipPadding: "tooltipPadding",
  lottieTooltipBorderRadius: "tooltipBorderRadius",
  lottieTooltipPositionOffset: "tooltipPositionOffset",
  themeBotMessageBackgroundColor: "botMessageBackgroundColor",
  themeBotMessageTextColor: "botMessageTextColor",
  themeBotMessageShowAvatar: "botMessageShowAvatar",
  themeBotMessageAvatarSrc: "botMessageAvatarSrc",
  themeUserMessageBackgroundColor: "userMessageBackgroundColor",
  themeUserMessageTextColor: "userMessageTextColor",
  themeUserMessageShowAvatar: "userMessageShowAvatar",
  themeUserMessageAvatarSrc: "userMessageAvatarSrc",
  themeTextInputPlaceholder: "textInputPlaceholder",
  themeTextInputBackgroundColor: "textInputBackgroundColor",
  themeTextInputTextColor: "textInputTextColor",
  themeTextInputSendButtonColor: "textInputSendButtonColor",
  themeTextInputMaxChars: "textInputMaxChars",
  themeTextInputAutoFocus: "textInputAutoFocus",
  themeFooterText: "footerText",
  themeFooterCompany: "footerCompany",
  themeFooterCompanyLink: "footerCompanyLink",
  themeFooterTextColor: "footerTextColor"
};
function yn(l) {
  return l.toLowerCase().replace(/^data-/, "").replace(/[^a-z0-9]/g, "");
}
const Ma = new Map(
  Object.keys(vn).map((l) => [
    yn(l),
    l
  ])
), Ia = new Map(
  Object.entries(Io).map(([l, r]) => [yn(l), r])
);
function Ks(l) {
  const r = l.trim();
  return r === "" || r === "true" ? !0 : r === "false" ? !1 : /^-?\d+(\.\d+)?$/.test(r) ? Number(r) : r;
}
function Lo(l) {
  const r = {}, a = Array.isArray(l) ? l : Array.from(l);
  for (const h of a) {
    const g = yn(h.name), v = Ma.get(g);
    if (v) {
      r[v] = Ks(h.value);
      continue;
    }
    const b = Ia.get(g);
    typeof b == "string" ? r[b] = Ks(h.value) : b && typeof b == "object" && (r[b.key] = Ks(h.value), Object.assign(r, b.extra));
  }
  return r;
}
function La() {
  const l = (h) => h.replace(/[A-Z]/g, (g) => "-" + g.toLowerCase()), r = Object.keys(vn).map(l), a = Object.keys(Io).map(l);
  return Array.from(/* @__PURE__ */ new Set([...r, ...a]));
}
function Fa(l) {
  const r = Object.assign({}, vn, ...l);
  return r.buttonType === "icon" && r.lottieAnimationPath && !r.buttonImageSrc ? r.buttonType = "lottie" : r.buttonType === "lottie" && !r.lottieAnimationPath && (r.buttonType = r.buttonImageSrc ? "image" : "icon"), r.buttonType === "image" && !r.buttonImageSrc && (r.buttonType = "icon"), r.windowHeaderBackgroundColor || (r.windowHeaderBackgroundColor = r.buttonBackgroundColor), r;
}
var Is, Lt, Fo, Ri, Gn, Ro, Oo, Qs, bs, Gr, No, _n, an, ln, Ts = {}, As = [], Ra = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i, Ls = Array.isArray;
function ui(l, r) {
  for (var a in r) l[a] = r[a];
  return l;
}
function bn(l) {
  l && l.parentNode && l.parentNode.removeChild(l);
}
function Oa(l, r, a) {
  var h, g, v, b = {};
  for (v in r) v == "key" ? h = r[v] : v == "ref" ? g = r[v] : b[v] = r[v];
  if (arguments.length > 2 && (b.children = arguments.length > 3 ? Is.call(arguments, 2) : a), typeof l == "function" && l.defaultProps != null) for (v in l.defaultProps) b[v] === void 0 && (b[v] = l.defaultProps[v]);
  return ws(l, b, h, g, null);
}
function ws(l, r, a, h, g) {
  var v = { type: l, props: r, key: a, ref: h, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: g ?? ++Fo, __i: -1, __u: 0 };
  return g == null && Lt.vnode != null && Lt.vnode(v), v;
}
function Fs(l) {
  return l.children;
}
function ks(l, r) {
  this.props = l, this.context = r;
}
function Zi(l, r) {
  if (r == null) return l.__ ? Zi(l.__, l.__i + 1) : null;
  for (var a; r < l.__k.length; r++) if ((a = l.__k[r]) != null && a.__e != null) return a.__e;
  return typeof l.type == "function" ? Zi(l) : null;
}
function Na(l) {
  if (l.__P && l.__d) {
    var r = l.__v, a = r.__e, h = [], g = [], v = ui({}, r);
    v.__v = r.__v + 1, Lt.vnode && Lt.vnode(v), wn(l.__P, v, r, l.__n, l.__P.namespaceURI, 32 & r.__u ? [a] : null, h, a ?? Zi(r), !!(32 & r.__u), g), v.__v = r.__v, v.__.__k[v.__i] = v, $o(h, v, g), r.__e = r.__ = null, v.__e != a && zo(v);
  }
}
function zo(l) {
  if ((l = l.__) != null && l.__c != null) return l.__e = l.__c.base = null, l.__k.some(function(r) {
    if (r != null && r.__e != null) return l.__e = l.__c.base = r.__e;
  }), zo(l);
}
function Yn(l) {
  (!l.__d && (l.__d = !0) && Ri.push(l) && !Ss.__r++ || Gn != Lt.debounceRendering) && ((Gn = Lt.debounceRendering) || Ro)(Ss);
}
function Ss() {
  try {
    for (var l, r = 1; Ri.length; ) Ri.length > r && Ri.sort(Oo), l = Ri.shift(), r = Ri.length, Na(l);
  } finally {
    Ri.length = Ss.__r = 0;
  }
}
function Do(l, r, a, h, g, v, b, O, V, W, H) {
  var U, R, X, tt, rt, vt, yt = h && h.__k || As, mt = r.length;
  for (V = za(a, r, yt, V, mt), U = 0; U < mt; U++) (X = a.__k[U]) != null && (R = X.__i != -1 && yt[X.__i] || Ts, X.__i = U, vt = wn(l, X, R, g, v, b, O, V, W, H), tt = X.__e, X.ref && R.ref != X.ref && (R.ref && kn(R.ref, null, X), H.push(X.ref, X.__c || tt, X)), rt == null && tt != null && (rt = tt), 4 & X.__u ? (V = Bo(X, V, l), R.__e && (R.__e = null)) : typeof X.type == "function" && vt !== void 0 ? V = vt : tt && (V = tt.nextSibling), X.__u &= -7);
  return a.__e = rt, V;
}
function za(l, r, a, h, g) {
  var v, b, O, V, W, H = a.length, U = H, R = 0;
  for (l.__k = new Array(g), v = 0; v < g; v++) (b = r[v]) != null && typeof b != "boolean" && typeof b != "function" ? (typeof b == "string" || typeof b == "number" || typeof b == "bigint" || b.constructor == String ? b = l.__k[v] = ws(null, b, null, null, null) : Ls(b) ? b = l.__k[v] = ws(Fs, { children: b }, null, null, null) : b.constructor === void 0 && b.__b > 0 ? b = l.__k[v] = ws(b.type, b.props, b.key, b.ref ? b.ref : null, b.__v) : l.__k[v] = b, V = v + R, b.__ = l, b.__b = l.__b + 1, O = null, (W = b.__i = Da(b, a, V, U)) != -1 && (U--, (O = a[W]) && (O.__u |= 2)), O == null || O.__v == null ? (W == -1 && (g > H ? R-- : g < H && R++), typeof b.type != "function" && (b.__u |= 4)) : W != V && (W == V - 1 ? R-- : W == V + 1 ? R++ : (W > V ? R-- : R++, b.__u |= 4))) : l.__k[v] = null;
  if (U) for (v = 0; v < H; v++) (O = a[v]) != null && !(2 & O.__u) && (O.__e == h && (h = Zi(O)), Wo(O, O));
  return h;
}
function Bo(l, r, a) {
  var h, g;
  if (typeof l.type == "function") {
    for (h = l.__k, g = 0; h && g < h.length; g++) h[g] && (h[g].__ = l, r = Bo(h[g], r, a));
    return r;
  }
  l.__e != r && (r && l.type && !r.parentNode && (r = Zi(l)), r = a.insertBefore(l.__e, r || null));
  do
    r = r && r.nextSibling;
  while (r != null && r.nodeType == 8);
  return r;
}
function Da(l, r, a, h) {
  var g, v, b, O = l.key, V = l.type, W = r[a], H = W != null && (2 & W.__u) == 0;
  if (W === null && O == null || H && O == W.key && V == W.type) return a;
  if (h > (H ? 1 : 0)) {
    for (g = a - 1, v = a + 1; g >= 0 || v < r.length; ) if ((W = r[b = g >= 0 ? g-- : v++]) != null && !(2 & W.__u) && O == W.key && V == W.type) return b;
  }
  return -1;
}
function Xn(l, r, a) {
  r[0] == "-" ? l.setProperty(r, a ?? "") : l[r] = a == null ? "" : typeof a != "number" || Ra.test(r) ? a : a + "px";
}
function ms(l, r, a, h, g) {
  var v, b;
  t: if (r == "style") if (typeof a == "string") l.style.cssText = a;
  else {
    if (typeof h == "string" && (l.style.cssText = h = ""), h) for (r in h) a && r in a || Xn(l.style, r, "");
    if (a) for (r in a) h && a[r] == h[r] || Xn(l.style, r, a[r]);
  }
  else if (r[0] == "o" && r[1] == "n") v = r != (r = r.replace(No, "$1")), b = r.toLowerCase(), r = b in l || r == "onFocusOut" || r == "onFocusIn" ? b.slice(2) : r.slice(2), l.l || (l.l = {}), l.l[r + v] = a, a ? h ? a[Gr] = h[Gr] : (a[Gr] = _n, l.addEventListener(r, v ? ln : an, v)) : l.removeEventListener(r, v ? ln : an, v);
  else {
    if (g == "http://www.w3.org/2000/svg") r = r.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
    else if (r != "width" && r != "height" && r != "href" && r != "list" && r != "form" && r != "tabIndex" && r != "download" && r != "rowSpan" && r != "colSpan" && r != "role" && r != "popover" && r in l) try {
      l[r] = a ?? "";
      break t;
    } catch {
    }
    typeof a == "function" || (a == null || a === !1 && r[4] != "-" ? l.removeAttribute(r) : l.setAttribute(r, r == "popover" && a == 1 ? "" : a));
  }
}
function Zn(l) {
  return function(r) {
    if (this.l) {
      var a = this.l[r.type + l];
      if (r[bs] == null) r[bs] = _n++;
      else if (r[bs] < a[Gr]) return;
      return a(Lt.event ? Lt.event(r) : r);
    }
  };
}
function wn(l, r, a, h, g, v, b, O, V, W) {
  var H, U, R, X, tt, rt, vt, yt, mt, jt, Ft, Rt, Bt, Te, ue, At, _t = r.type;
  if (r.constructor !== void 0) return null;
  128 & a.__u && (V = !!(32 & a.__u), v = [O = r.__e = a.__e]), (H = Lt.__b) && H(r);
  t: if (typeof _t == "function") {
    U = b.length;
    try {
      if (mt = r.props, jt = _t.prototype && _t.prototype.render, Ft = (H = _t.contextType) && h[H.__c], Rt = H ? Ft ? Ft.props.value : H.__ : h, a.__c ? yt = (R = r.__c = a.__c).__ = R.__E : (jt ? r.__c = R = new _t(mt, Rt) : (r.__c = R = new ks(mt, Rt), R.constructor = _t, R.render = Va), Ft && Ft.sub(R), R.state || (R.state = {}), R.__n = h, X = R.__d = !0, R.__h = [], R._sb = []), jt && R.__s == null && (R.__s = R.state), jt && _t.getDerivedStateFromProps != null && (R.__s == R.state && (R.__s = ui({}, R.__s)), ui(R.__s, _t.getDerivedStateFromProps(mt, R.__s))), tt = R.props, rt = R.state, R.__v = r, X) jt && _t.getDerivedStateFromProps == null && R.componentWillMount != null && R.componentWillMount(), jt && R.componentDidMount != null && R.__h.push(R.componentDidMount);
      else {
        if (jt && _t.getDerivedStateFromProps == null && mt !== tt && R.componentWillReceiveProps != null && R.componentWillReceiveProps(mt, Rt), r.__v == a.__v || !R.__e && R.shouldComponentUpdate != null && R.shouldComponentUpdate(mt, R.__s, Rt) === !1) {
          r.__v != a.__v && (R.props = mt, R.state = R.__s, R.__d = !1), r.__e = a.__e, r.__k = a.__k, r.__k.some(function(Wt) {
            Wt && (Wt.__ = r);
          }), As.push.apply(R.__h, R._sb), R._sb = [], R.__h.length && b.push(R), O = Zi(a);
          break t;
        }
        R.componentWillUpdate != null && R.componentWillUpdate(mt, R.__s, Rt), jt && R.componentDidUpdate != null && R.__h.push(function() {
          R.componentDidUpdate(tt, rt, vt);
        });
      }
      if (R.context = Rt, R.props = mt, R.__P = l, R.__e = !1, Bt = Lt.__r, Te = 0, jt) R.state = R.__s, R.__d = !1, Bt && Bt(r), H = R.render(R.props, R.state, R.context), As.push.apply(R.__h, R._sb), R._sb = [];
      else do
        R.__d = !1, Bt && Bt(r), H = R.render(R.props, R.state, R.context), R.state = R.__s;
      while (R.__d && ++Te < 25);
      R.state = R.__s, R.getChildContext != null && (h = ui(ui({}, h), R.getChildContext())), jt && !X && R.getSnapshotBeforeUpdate != null && (vt = R.getSnapshotBeforeUpdate(tt, rt)), ue = H != null && H.type === Fs && H.key == null ? jo(H.props.children) : H, O = Do(l, Ls(ue) ? ue : [ue], r, a, h, g, v, b, O, V, W), R.base = r.__e, r.__u &= -161, R.__h.length && b.push(R), yt && (R.__E = R.__ = null);
    } catch (Wt) {
      if (b.length = U, r.__v = null, V || v != null) {
        if (Wt.then) {
          for (r.__u |= V ? 160 : 128; O && O.nodeType == 8 && O.nextSibling; ) O = O.nextSibling;
          v != null && (v[v.indexOf(O)] = null), r.__e = O;
        } else if (v != null) for (At = v.length; At--; ) bn(v[At]);
      } else r.__e = a.__e;
      r.__k == null && (r.__k = a.__k || []), Wt.then || Vo(r), Lt.__e(Wt, r, a);
    }
  } else v == null && r.__v == a.__v ? (r.__k = a.__k, r.__e = a.__e) : O = r.__e = Ba(a.__e, r, a, h, g, v, b, V, W);
  return (H = Lt.diffed) && H(r), 128 & r.__u ? void 0 : O;
}
function Vo(l) {
  l && (l.__c && (l.__c.__e = !0), l.__k && l.__k.some(Vo));
}
function $o(l, r, a) {
  for (var h = 0; h < a.length; h++) kn(a[h], a[++h], a[++h]);
  Lt.__c && Lt.__c(r, l), l.some(function(g) {
    try {
      l = g.__h, g.__h = [], l.some(function(v) {
        v.call(g);
      });
    } catch (v) {
      Lt.__e(v, g.__v);
    }
  });
}
function jo(l) {
  return typeof l != "object" || l == null || l.__b > 0 ? l : Ls(l) ? l.map(jo) : l.constructor !== void 0 ? null : ui({}, l);
}
function Ba(l, r, a, h, g, v, b, O, V) {
  var W, H, U, R, X, tt, rt, vt = a.props || Ts, yt = r.props, mt = r.type;
  if (mt == "svg" ? g = "http://www.w3.org/2000/svg" : mt == "math" ? g = "http://www.w3.org/1998/Math/MathML" : g || (g = "http://www.w3.org/1999/xhtml"), v != null) {
    for (W = 0; W < v.length; W++) if ((X = v[W]) && "setAttribute" in X == !!mt && (mt ? X.localName == mt : X.nodeType == 3)) {
      l = X, v[W] = null;
      break;
    }
  }
  if (l == null) {
    if (mt == null) return document.createTextNode(yt);
    l = document.createElementNS(g, mt, yt.is && yt), O && (Lt.__m && Lt.__m(r, v), O = !1), v = null;
  }
  if (mt == null) vt === yt || O && l.data == yt || (l.data = yt);
  else {
    if (v = mt == "textarea" && yt.defaultValue != null ? null : v && Is.call(l.childNodes), !O && v != null) for (vt = {}, W = 0; W < l.attributes.length; W++) vt[(X = l.attributes[W]).name] = X.value;
    for (W in vt) X = vt[W], W == "dangerouslySetInnerHTML" ? U = X : W == "children" || W in yt || W == "value" && "defaultValue" in yt || W == "checked" && "defaultChecked" in yt || ms(l, W, null, X, g);
    for (W in yt) X = yt[W], W == "children" ? R = X : W == "dangerouslySetInnerHTML" ? H = X : W == "value" ? tt = X : W == "checked" ? rt = X : O && typeof X != "function" || vt[W] === X || ms(l, W, X, vt[W], g);
    if (H) O || U && (H.__html == U.__html || H.__html == l.innerHTML) || (l.innerHTML = H.__html), r.__k = [];
    else if (U && (l.innerHTML = ""), Do(r.type == "template" ? l.content : l, Ls(R) ? R : [R], r, a, h, mt == "foreignObject" ? "http://www.w3.org/1999/xhtml" : g, v, b, v ? v[0] : a.__k && Zi(a, 0), O, V), v != null) for (W = v.length; W--; ) bn(v[W]);
    O && mt != "textarea" || (W = "value", mt == "progress" && tt == null ? l.removeAttribute("value") : tt != null && (tt !== l[W] || mt == "progress" && !tt || mt == "option" && tt != vt[W]) && ms(l, W, tt, vt[W], g), W = "checked", rt != null && rt != l[W] && ms(l, W, rt, vt[W], g));
  }
  return l;
}
function kn(l, r, a) {
  try {
    if (typeof l == "function") {
      var h = typeof l.__u == "function";
      h && l.__u(), h && r == null || (l.__u = l(r));
    } else l.current = r;
  } catch (g) {
    Lt.__e(g, a);
  }
}
function Wo(l, r, a) {
  var h, g;
  if (Lt.unmount && Lt.unmount(l), (h = l.ref) && (h.current && h.current != l.__e || kn(h, null, r)), (h = l.__c) != null) {
    if (h.componentWillUnmount) try {
      h.componentWillUnmount();
    } catch (v) {
      Lt.__e(v, r);
    }
    h.base = h.__P = h.__n = null;
  }
  if (h = l.__k) for (g = 0; g < h.length; g++) h[g] && Wo(h[g], r, a || typeof l.type != "function");
  a || bn(l.__e), l.__c = l.__ = l.__e = void 0;
}
function Va(l, r, a) {
  return this.constructor(l, a);
}
function Kn(l, r, a) {
  var h, g, v, b;
  r == document && (r = document.documentElement), Lt.__ && Lt.__(l, r), g = (h = !1) ? null : r.__k, v = [], b = [], wn(r, l = r.__k = Oa(Fs, null, [l]), g || Ts, Ts, r.namespaceURI, g ? null : r.firstChild ? Is.call(r.childNodes) : null, v, g ? g.__e : r.firstChild, h, b), $o(v, l, b), l.props.children = null;
}
Is = As.slice, Lt = { __e: function(l, r, a, h) {
  for (var g, v, b; r = r.__; ) if ((g = r.__c) && !g.__) try {
    if ((v = g.constructor) && v.getDerivedStateFromError != null && (g.setState(v.getDerivedStateFromError(l)), b = g.__d), g.componentDidCatch != null && (g.componentDidCatch(l, h || {}), b = g.__d), b) return g.__E = g;
  } catch (O) {
    l = O;
  }
  throw l;
} }, Fo = 0, ks.prototype.setState = function(l, r) {
  var a;
  a = this.__s != null && this.__s != this.state ? this.__s : this.__s = ui({}, this.state), typeof l == "function" && (l = l(ui({}, a), this.props)), l && ui(a, l), l != null && this.__v && (r && this._sb.push(r), Yn(this));
}, ks.prototype.forceUpdate = function(l) {
  this.__v && (this.__e = !0, l && this.__h.push(l), Yn(this));
}, ks.prototype.render = Fs, Ri = [], Ro = typeof Promise == "function" ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, Oo = function(l, r) {
  return l.__v.__b - r.__v.__b;
}, Ss.__r = 0, Qs = Math.random().toString(8), bs = "__d" + Qs, Gr = "__a" + Qs, No = /(PointerCapture)$|Capture$/i, _n = 0, an = Zn(!1), ln = Zn(!0);
var $a = 0;
function gt(l, r, a, h, g, v) {
  r || (r = {});
  var b, O, V = r;
  if ("ref" in V) for (O in V = {}, r) O == "ref" ? b = r[O] : V[O] = r[O];
  var W = { type: l, props: V, key: a, ref: b, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: --$a, __i: -1, __u: 0, __source: g, __self: v };
  if (typeof l == "function" && (b = l.defaultProps)) for (O in b) V[O] === void 0 && (V[O] = b[O]);
  return Lt.vnode && Lt.vnode(W), W;
}
var Zr, Gt, Js, Qn, Es = 0, Ho = [], Jt = Lt, Jn = Jt.__b, to = Jt.__r, eo = Jt.diffed, io = Jt.__c, ro = Jt.unmount, so = Jt.__;
function xn(l, r) {
  Jt.__h && Jt.__h(Gt, l, Es || r), Es = 0;
  var a = Gt.__H || (Gt.__H = { __: [], __h: [] });
  return l >= a.__.length && a.__.push({}), a.__[l];
}
function gr(l) {
  return Es = 1, ja(qo, l);
}
function ja(l, r, a) {
  var h = xn(Zr++, 2);
  if (h.t = l, !h.__c && (h.__ = [qo(void 0, r), function(O) {
    var V = h.__N ? h.__N[0] : h.__[0], W = h.t(V, O);
    V !== W && (h.__N = [W, h.__[1]], h.__c.setState({}));
  }], h.__c = Gt, !Gt.__f)) {
    var g = function(O, V, W) {
      if (!h.__c.__H) return !0;
      var H = !1, U = h.__c.props !== O;
      if (h.__c.__H.__.some(function(X) {
        if (X.__N) {
          H = !0;
          var tt = X.__[0];
          X.__ = X.__N, X.__N = void 0, tt !== X.__[0] && (U = !0);
        }
      }), v) {
        var R = v.call(this, O, V, W);
        return H ? R || U : R;
      }
      return !H || U;
    };
    Gt.__f = !0;
    var v = Gt.shouldComponentUpdate, b = Gt.componentWillUpdate;
    Gt.componentWillUpdate = function(O, V, W) {
      if (this.__e) {
        var H = v;
        v = void 0, g(O, V, W), v = H;
      }
      b && b.call(this, O, V, W);
    }, Gt.shouldComponentUpdate = g;
  }
  return h.__N || h.__;
}
function _r(l, r) {
  var a = xn(Zr++, 3);
  !Jt.__s && Uo(a.__H, r) && (a.__ = l, a.u = r, Gt.__H.__h.push(a));
}
function Fi(l) {
  return Es = 5, Wa(function() {
    return { current: l };
  }, []);
}
function Wa(l, r) {
  var a = xn(Zr++, 7);
  return Uo(a.__H, r) && (a.__ = l(), a.__H = r, a.__h = l), a.__;
}
function Ha() {
  for (var l; l = Ho.shift(); ) {
    var r = l.__H;
    if (l.__P && r) try {
      r.__h.some(xs), r.__h.some(hn), r.__h = [];
    } catch (a) {
      r.__h = [], Jt.__e(a, l.__v);
    }
  }
}
Jt.__b = function(l) {
  Gt = null, Jn && Jn(l);
}, Jt.__ = function(l, r) {
  l && r.__k && r.__k.__m && (l.__m = r.__k.__m), so && so(l, r);
}, Jt.__r = function(l) {
  to && to(l), Zr = 0;
  var r = (Gt = l.__c).__H;
  r && (Js === Gt ? (r.__h = [], Gt.__h = [], r.__.some(function(a) {
    a.__N && (a.__ = a.__N), a.u = a.__N = void 0;
  })) : (r.__h.some(xs), r.__h.some(hn), r.__h = [], Zr = 0)), Js = Gt;
}, Jt.diffed = function(l) {
  eo && eo(l);
  var r = l.__c;
  r && r.__H && (r.__H.__h.length && (Ho.push(r) !== 1 && Qn === Jt.requestAnimationFrame || ((Qn = Jt.requestAnimationFrame) || Ua)(Ha)), r.__H.__.some(function(a) {
    a.u && (a.__H = a.u, a.u = void 0);
  })), Js = Gt = null;
}, Jt.__c = function(l, r) {
  r.some(function(a) {
    try {
      a.__h.some(xs), a.__h = a.__h.filter(function(h) {
        return !h.__ || hn(h);
      });
    } catch (h) {
      r.some(function(g) {
        g.__h && (g.__h = []);
      }), r = [], Jt.__e(h, a.__v);
    }
  }), io && io(l, r);
}, Jt.unmount = function(l) {
  ro && ro(l);
  var r, a = l.__c;
  a && a.__H && (a.__H.__.some(function(h) {
    try {
      xs(h);
    } catch (g) {
      r = g;
    }
  }), a.__H = void 0, r && Jt.__e(r, a.__v));
};
var no = typeof requestAnimationFrame == "function";
function Ua(l) {
  var r, a = function() {
    clearTimeout(h), no && cancelAnimationFrame(r), setTimeout(l);
  }, h = setTimeout(a, 35);
  no && (r = requestAnimationFrame(a));
}
function xs(l) {
  var r = Gt, a = l.__c;
  typeof a == "function" && (l.__c = void 0, a()), Gt = r;
}
function hn(l) {
  var r = Gt;
  l.__c = l.__(), Gt = r;
}
function Uo(l, r) {
  return !l || l.length !== r.length || r.some(function(a, h) {
    return a !== l[h];
  });
}
function qo(l, r) {
  return typeof r == "function" ? r(l) : r;
}
function qa(l) {
  const r = [];
  let a = l;
  const g = l.replace(/\r\n/g, `
`).split(`

`);
  a = l.endsWith(`

`) ? "" : g.pop() ?? "";
  for (const v of g) {
    const b = v.split(`
`).filter((V) => V.startsWith("data:")).map((V) => V.slice(5).trim());
    if (b.length === 0) continue;
    const O = b.join(`
`);
    try {
      const V = JSON.parse(O);
      r.push({ event: V.event ?? "message", data: V.data });
    } catch {
      O !== "[DONE]" && r.push({ event: "token", data: O });
    }
  }
  return { events: r, rest: a };
}
function Ga(l) {
  return `${l.apiHost.replace(/\/+$/, "")}/api/v1/prediction/${encodeURIComponent(l.chatflowId)}`;
}
async function Ya(l, r, a) {
  var U, R;
  const h = {
    question: l.question,
    chatId: l.chatId,
    streaming: l.streaming ?? !0,
    ...l.overrideConfig ? { overrideConfig: l.overrideConfig } : {}
  }, g = await fetch(Ga(l), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(h),
    signal: a
  });
  if (!g.ok) {
    let X = `${g.status} ${g.statusText}`;
    try {
      const tt = await g.json();
      tt != null && tt.message && (X = tt.message);
    } catch {
    }
    throw new Error(X);
  }
  if (!l.streaming || !g.body) {
    const X = await g.json();
    X.text && r.onToken(X.text), (X.chatId || X.followUpPrompts) && ((U = r.onMetadata) == null || U.call(r, { chatId: X.chatId, followUpPrompts: X.followUpPrompts })), r.onDone();
    return;
  }
  (R = r.onStart) == null || R.call(r);
  const v = g.body.getReader(), b = new TextDecoder();
  let O = "", V = !1;
  const W = (X) => {
    var vt, yt;
    const { event: tt, data: rt } = X;
    switch (tt) {
      case "token":
        typeof rt == "string" && r.onToken(rt);
        break;
      case "thinking":
      case "tool":
      case "usedTools":
      case "calledTools":
      case "agentReasoning":
      case "nextAgent":
        (vt = r.onActivity) == null || vt.call(r, tt);
        break;
      case "metadata":
        rt && typeof rt == "object" && ((yt = r.onMetadata) == null || yt.call(r, rt));
        break;
      case "error":
        V = !0, r.onError(typeof rt == "string" ? rt : JSON.stringify(rt));
        break;
      case "end":
        return !0;
    }
    return !1;
  };
  let H = !1;
  for (; !H; ) {
    const { done: X, value: tt } = await v.read();
    if (X) break;
    O += b.decode(tt, { stream: !0 });
    const { events: rt, rest: vt } = qa(O);
    O = vt;
    for (const yt of rt)
      if (W(yt)) {
        H = !0;
        break;
      }
  }
  V || r.onDone();
}
function Xa() {
  return typeof crypto < "u" && "randomUUID" in crypto ? crypto.randomUUID() : "chat-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
}
var Za = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Ka(l) {
  return l && l.__esModule && Object.prototype.hasOwnProperty.call(l, "default") ? l.default : l;
}
var fn = { exports: {} };
(function(l, r) {
  typeof document < "u" && typeof navigator < "u" && function(a, h) {
    l.exports = h();
  }(Za, function() {
    var a = "http://www.w3.org/2000/svg", h = "", g = !1, v = -999999, b = function(e) {
      g = !!e;
    }, O = function() {
      return g;
    }, V = function(e) {
      h = e;
    }, W = function() {
      return h;
    };
    function H(t) {
      return document.createElement(t);
    }
    function U(t, e) {
      var i, s = t.length, o;
      for (i = 0; i < s; i += 1) {
        o = t[i].prototype;
        for (var n in o)
          Object.prototype.hasOwnProperty.call(o, n) && (e.prototype[n] = o[n]);
      }
    }
    function R(t) {
      function e() {
      }
      return e.prototype = t, e;
    }
    var X = function() {
      function t(e) {
        this.audios = [], this.audioFactory = e, this._volume = 1, this._isMuted = !1;
      }
      return t.prototype = {
        addAudio: function(i) {
          this.audios.push(i);
        },
        pause: function() {
          var i, s = this.audios.length;
          for (i = 0; i < s; i += 1)
            this.audios[i].pause();
        },
        resume: function() {
          var i, s = this.audios.length;
          for (i = 0; i < s; i += 1)
            this.audios[i].resume();
        },
        setRate: function(i) {
          var s, o = this.audios.length;
          for (s = 0; s < o; s += 1)
            this.audios[s].setRate(i);
        },
        createAudio: function(i) {
          return this.audioFactory ? this.audioFactory(i) : window.Howl ? new window.Howl({
            src: [i]
          }) : {
            isPlaying: !1,
            play: function() {
              this.isPlaying = !0;
            },
            seek: function() {
              this.isPlaying = !1;
            },
            playing: function() {
            },
            rate: function() {
            },
            setVolume: function() {
            }
          };
        },
        setAudioFactory: function(i) {
          this.audioFactory = i;
        },
        setVolume: function(i) {
          this._volume = i, this._updateVolume();
        },
        mute: function() {
          this._isMuted = !0, this._updateVolume();
        },
        unmute: function() {
          this._isMuted = !1, this._updateVolume();
        },
        getVolume: function() {
          return this._volume;
        },
        _updateVolume: function() {
          var i, s = this.audios.length;
          for (i = 0; i < s; i += 1)
            this.audios[i].volume(this._volume * (this._isMuted ? 0 : 1));
        }
      }, function() {
        return new t();
      };
    }(), tt = /* @__PURE__ */ function() {
      function t(i, s) {
        var o = 0, n = [], c;
        switch (i) {
          case "int16":
          case "uint8c":
            c = 1;
            break;
          default:
            c = 1.1;
            break;
        }
        for (o = 0; o < s; o += 1)
          n.push(c);
        return n;
      }
      function e(i, s) {
        return i === "float32" ? new Float32Array(s) : i === "int16" ? new Int16Array(s) : i === "uint8c" ? new Uint8ClampedArray(s) : t(i, s);
      }
      return typeof Uint8ClampedArray == "function" && typeof Float32Array == "function" ? e : t;
    }();
    function rt(t) {
      return Array.apply(null, {
        length: t
      });
    }
    var vt = !0, yt = null, mt = "", jt = /^((?!chrome|android).)*safari/i.test(navigator.userAgent), Ft = Math.pow, Rt = Math.sqrt, Bt = Math.floor, Te = Math.min, ue = 150, At = Math.PI / 180, _t = 0.5519;
    function Wt(t, e, i, s) {
      this.type = t, this.currentTime = e, this.totalTime = i, this.direction = s < 0 ? -1 : 1;
    }
    function Je(t, e) {
      this.type = t, this.direction = e < 0 ? -1 : 1;
    }
    function pi(t, e, i, s) {
      this.type = t, this.currentLoop = i, this.totalLoops = e, this.direction = s < 0 ? -1 : 1;
    }
    function je(t, e, i) {
      this.type = t, this.firstFrame = e, this.totalFrames = i;
    }
    function dt(t, e) {
      this.type = t, this.target = e;
    }
    function Ut(t, e) {
      this.type = "renderFrameError", this.nativeError = t, this.currentTime = e;
    }
    function me(t) {
      this.type = "configError", this.nativeError = t;
    }
    var Et = /* @__PURE__ */ function() {
      var t = 0;
      return function() {
        return t += 1, mt + "__lottie_element_" + t;
      };
    }();
    function Ot(t, e, i) {
      var s, o, n, c, _, u, T, E;
      switch (c = Math.floor(t * 6), _ = t * 6 - c, u = i * (1 - e), T = i * (1 - _ * e), E = i * (1 - (1 - _) * e), c % 6) {
        case 0:
          s = i, o = E, n = u;
          break;
        case 1:
          s = T, o = i, n = u;
          break;
        case 2:
          s = u, o = i, n = E;
          break;
        case 3:
          s = u, o = T, n = i;
          break;
        case 4:
          s = E, o = u, n = i;
          break;
        case 5:
          s = i, o = u, n = T;
          break;
      }
      return [s, o, n];
    }
    function Yt(t, e, i) {
      var s = Math.max(t, e, i), o = Math.min(t, e, i), n = s - o, c, _ = s === 0 ? 0 : n / s, u = s / 255;
      switch (s) {
        case o:
          c = 0;
          break;
        case t:
          c = e - i + n * (e < i ? 6 : 0), c /= 6 * n;
          break;
        case e:
          c = i - t + n * 2, c /= 6 * n;
          break;
        case i:
          c = t - e + n * 4, c /= 6 * n;
          break;
      }
      return [c, _, u];
    }
    function Fe(t, e) {
      var i = Yt(t[0] * 255, t[1] * 255, t[2] * 255);
      return i[1] += e, i[1] > 1 ? i[1] = 1 : i[1] <= 0 && (i[1] = 0), Ot(i[0], i[1], i[2]);
    }
    function tr(t, e) {
      var i = Yt(t[0] * 255, t[1] * 255, t[2] * 255);
      return i[2] += e, i[2] > 1 ? i[2] = 1 : i[2] < 0 && (i[2] = 0), Ot(i[0], i[1], i[2]);
    }
    function Jr(t, e) {
      var i = Yt(t[0] * 255, t[1] * 255, t[2] * 255);
      return i[0] += e / 360, i[0] > 1 ? i[0] -= 1 : i[0] < 0 && (i[0] += 1), Ot(i[0], i[1], i[2]);
    }
    (function() {
      var t = [], e, i;
      for (e = 0; e < 256; e += 1)
        i = e.toString(16), t[e] = i.length === 1 ? "0" + i : i;
      return function(s, o, n) {
        return s < 0 && (s = 0), o < 0 && (o = 0), n < 0 && (n = 0), "#" + t[s] + t[o] + t[n];
      };
    })();
    var Os = function(e) {
      vt = !!e;
    }, Nt = function() {
      return vt;
    }, Ns = function(e) {
      yt = e;
    }, er = function() {
      return yt;
    }, ir = function(e) {
      ue = e;
    }, rr = function() {
      return ue;
    }, zs = function(e) {
      mt = e;
    };
    function ft(t) {
      return document.createElementNS(a, t);
    }
    function sr(t) {
      "@babel/helpers - typeof";
      return sr = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
        return typeof e;
      } : function(e) {
        return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
      }, sr(t);
    }
    var Oi = /* @__PURE__ */ function() {
      var t = 1, e = [], i, s, o = {
        onmessage: function() {
        },
        postMessage: function(C) {
          i({
            data: C
          });
        }
      }, n = {
        postMessage: function(C) {
          o.onmessage({
            data: C
          });
        }
      };
      function c(m) {
        if (window.Worker && window.Blob && O()) {
          var C = new Blob(["var _workerSelf = self; self.onmessage = ", m.toString()], {
            type: "text/javascript"
          }), I = URL.createObjectURL(C);
          return new Worker(I);
        }
        return i = m, o;
      }
      function _() {
        s || (s = c(function(C) {
          function I() {
            function N(G, w) {
              var M, f, p = G.length, $, F, et, ht;
              for (f = 0; f < p; f += 1)
                if (M = G[f], "ks" in M && !M.completed) {
                  if (M.completed = !0, M.hasMask) {
                    var ut = M.masksProperties;
                    for (F = ut.length, $ = 0; $ < F; $ += 1)
                      if (ut[$].pt.k.i)
                        A(ut[$].pt.k);
                      else
                        for (ht = ut[$].pt.k.length, et = 0; et < ht; et += 1)
                          ut[$].pt.k[et].s && A(ut[$].pt.k[et].s[0]), ut[$].pt.k[et].e && A(ut[$].pt.k[et].e[0]);
                  }
                  M.ty === 0 ? (M.layers = d(M.refId, w), N(M.layers, w)) : M.ty === 4 ? y(M.shapes) : M.ty === 5 && pt(M);
                }
            }
            function S(G, w) {
              if (G) {
                var M = 0, f = G.length;
                for (M = 0; M < f; M += 1)
                  G[M].t === 1 && (G[M].data.layers = d(G[M].data.refId, w), N(G[M].data.layers, w));
              }
            }
            function x(G, w) {
              for (var M = 0, f = w.length; M < f; ) {
                if (w[M].id === G)
                  return w[M];
                M += 1;
              }
              return null;
            }
            function d(G, w) {
              var M = x(G, w);
              return M ? M.layers.__used ? JSON.parse(JSON.stringify(M.layers)) : (M.layers.__used = !0, M.layers) : null;
            }
            function y(G) {
              var w, M = G.length, f, p;
              for (w = M - 1; w >= 0; w -= 1)
                if (G[w].ty === "sh")
                  if (G[w].ks.k.i)
                    A(G[w].ks.k);
                  else
                    for (p = G[w].ks.k.length, f = 0; f < p; f += 1)
                      G[w].ks.k[f].s && A(G[w].ks.k[f].s[0]), G[w].ks.k[f].e && A(G[w].ks.k[f].e[0]);
                else G[w].ty === "gr" && y(G[w].it);
            }
            function A(G) {
              var w, M = G.i.length;
              for (w = 0; w < M; w += 1)
                G.i[w][0] += G.v[w][0], G.i[w][1] += G.v[w][1], G.o[w][0] += G.v[w][0], G.o[w][1] += G.v[w][1];
            }
            function L(G, w) {
              var M = w ? w.split(".") : [100, 100, 100];
              return G[0] > M[0] ? !0 : M[0] > G[0] ? !1 : G[1] > M[1] ? !0 : M[1] > G[1] ? !1 : G[2] > M[2] ? !0 : M[2] > G[2] ? !1 : null;
            }
            var D = /* @__PURE__ */ function() {
              var G = [4, 4, 14];
              function w(f) {
                var p = f.t.d;
                f.t.d = {
                  k: [{
                    s: p,
                    t: 0
                  }]
                };
              }
              function M(f) {
                var p, $ = f.length;
                for (p = 0; p < $; p += 1)
                  f[p].ty === 5 && w(f[p]);
              }
              return function(f) {
                if (L(G, f.v) && (M(f.layers), f.assets)) {
                  var p, $ = f.assets.length;
                  for (p = 0; p < $; p += 1)
                    f.assets[p].layers && M(f.assets[p].layers);
                }
              };
            }(), j = /* @__PURE__ */ function() {
              var G = [4, 7, 99];
              return function(w) {
                if (w.chars && !L(G, w.v)) {
                  var M, f = w.chars.length;
                  for (M = 0; M < f; M += 1) {
                    var p = w.chars[M];
                    p.data && p.data.shapes && (y(p.data.shapes), p.data.ip = 0, p.data.op = 99999, p.data.st = 0, p.data.sr = 1, p.data.ks = {
                      p: {
                        k: [0, 0],
                        a: 0
                      },
                      s: {
                        k: [100, 100],
                        a: 0
                      },
                      a: {
                        k: [0, 0],
                        a: 0
                      },
                      r: {
                        k: 0,
                        a: 0
                      },
                      o: {
                        k: 100,
                        a: 0
                      }
                    }, w.chars[M].t || (p.data.shapes.push({
                      ty: "no"
                    }), p.data.shapes[0].it.push({
                      p: {
                        k: [0, 0],
                        a: 0
                      },
                      s: {
                        k: [100, 100],
                        a: 0
                      },
                      a: {
                        k: [0, 0],
                        a: 0
                      },
                      r: {
                        k: 0,
                        a: 0
                      },
                      o: {
                        k: 100,
                        a: 0
                      },
                      sk: {
                        k: 0,
                        a: 0
                      },
                      sa: {
                        k: 0,
                        a: 0
                      },
                      ty: "tr"
                    })));
                  }
                }
              };
            }(), Y = /* @__PURE__ */ function() {
              var G = [5, 7, 15];
              function w(f) {
                var p = f.t.p;
                typeof p.a == "number" && (p.a = {
                  a: 0,
                  k: p.a
                }), typeof p.p == "number" && (p.p = {
                  a: 0,
                  k: p.p
                }), typeof p.r == "number" && (p.r = {
                  a: 0,
                  k: p.r
                });
              }
              function M(f) {
                var p, $ = f.length;
                for (p = 0; p < $; p += 1)
                  f[p].ty === 5 && w(f[p]);
              }
              return function(f) {
                if (L(G, f.v) && (M(f.layers), f.assets)) {
                  var p, $ = f.assets.length;
                  for (p = 0; p < $; p += 1)
                    f.assets[p].layers && M(f.assets[p].layers);
                }
              };
            }(), ct = /* @__PURE__ */ function() {
              var G = [4, 1, 9];
              function w(f) {
                var p, $ = f.length, F, et;
                for (p = 0; p < $; p += 1)
                  if (f[p].ty === "gr")
                    w(f[p].it);
                  else if (f[p].ty === "fl" || f[p].ty === "st")
                    if (f[p].c.k && f[p].c.k[0].i)
                      for (et = f[p].c.k.length, F = 0; F < et; F += 1)
                        f[p].c.k[F].s && (f[p].c.k[F].s[0] /= 255, f[p].c.k[F].s[1] /= 255, f[p].c.k[F].s[2] /= 255, f[p].c.k[F].s[3] /= 255), f[p].c.k[F].e && (f[p].c.k[F].e[0] /= 255, f[p].c.k[F].e[1] /= 255, f[p].c.k[F].e[2] /= 255, f[p].c.k[F].e[3] /= 255);
                    else
                      f[p].c.k[0] /= 255, f[p].c.k[1] /= 255, f[p].c.k[2] /= 255, f[p].c.k[3] /= 255;
              }
              function M(f) {
                var p, $ = f.length;
                for (p = 0; p < $; p += 1)
                  f[p].ty === 4 && w(f[p].shapes);
              }
              return function(f) {
                if (L(G, f.v) && (M(f.layers), f.assets)) {
                  var p, $ = f.assets.length;
                  for (p = 0; p < $; p += 1)
                    f.assets[p].layers && M(f.assets[p].layers);
                }
              };
            }(), ot = /* @__PURE__ */ function() {
              var G = [4, 4, 18];
              function w(f) {
                var p, $ = f.length, F, et;
                for (p = $ - 1; p >= 0; p -= 1)
                  if (f[p].ty === "sh")
                    if (f[p].ks.k.i)
                      f[p].ks.k.c = f[p].closed;
                    else
                      for (et = f[p].ks.k.length, F = 0; F < et; F += 1)
                        f[p].ks.k[F].s && (f[p].ks.k[F].s[0].c = f[p].closed), f[p].ks.k[F].e && (f[p].ks.k[F].e[0].c = f[p].closed);
                  else f[p].ty === "gr" && w(f[p].it);
              }
              function M(f) {
                var p, $, F = f.length, et, ht, ut, kt;
                for ($ = 0; $ < F; $ += 1) {
                  if (p = f[$], p.hasMask) {
                    var xt = p.masksProperties;
                    for (ht = xt.length, et = 0; et < ht; et += 1)
                      if (xt[et].pt.k.i)
                        xt[et].pt.k.c = xt[et].cl;
                      else
                        for (kt = xt[et].pt.k.length, ut = 0; ut < kt; ut += 1)
                          xt[et].pt.k[ut].s && (xt[et].pt.k[ut].s[0].c = xt[et].cl), xt[et].pt.k[ut].e && (xt[et].pt.k[ut].e[0].c = xt[et].cl);
                  }
                  p.ty === 4 && w(p.shapes);
                }
              }
              return function(f) {
                if (L(G, f.v) && (M(f.layers), f.assets)) {
                  var p, $ = f.assets.length;
                  for (p = 0; p < $; p += 1)
                    f.assets[p].layers && M(f.assets[p].layers);
                }
              };
            }();
            function K(G) {
              G.__complete || (ct(G), D(G), j(G), Y(G), ot(G), N(G.layers, G.assets), S(G.chars, G.assets), G.__complete = !0);
            }
            function pt(G) {
              G.t.a.length === 0 && "m" in G.t.p;
            }
            var it = {};
            return it.completeData = K, it.checkColors = ct, it.checkChars = j, it.checkPathProperties = Y, it.checkShapes = ot, it.completeLayers = N, it;
          }
          if (n.dataManager || (n.dataManager = I()), n.assetLoader || (n.assetLoader = /* @__PURE__ */ function() {
            function N(x) {
              var d = x.getResponseHeader("content-type");
              return d && x.responseType === "json" && d.indexOf("json") !== -1 || x.response && sr(x.response) === "object" ? x.response : x.response && typeof x.response == "string" ? JSON.parse(x.response) : x.responseText ? JSON.parse(x.responseText) : null;
            }
            function S(x, d, y, A) {
              var L, D = new XMLHttpRequest();
              try {
                D.responseType = "json";
              } catch {
              }
              D.onreadystatechange = function() {
                if (D.readyState === 4)
                  if (D.status === 200)
                    L = N(D), y(L);
                  else
                    try {
                      L = N(D), y(L);
                    } catch (j) {
                      A && A(j);
                    }
              };
              try {
                D.open(["G", "E", "T"].join(""), x, !0);
              } catch {
                D.open(["G", "E", "T"].join(""), d + "/" + x, !0);
              }
              D.send();
            }
            return {
              load: S
            };
          }()), C.data.type === "loadAnimation")
            n.assetLoader.load(C.data.path, C.data.fullPath, function(N) {
              n.dataManager.completeData(N), n.postMessage({
                id: C.data.id,
                payload: N,
                status: "success"
              });
            }, function() {
              n.postMessage({
                id: C.data.id,
                status: "error"
              });
            });
          else if (C.data.type === "complete") {
            var P = C.data.animation;
            n.dataManager.completeData(P), n.postMessage({
              id: C.data.id,
              payload: P,
              status: "success"
            });
          } else C.data.type === "loadData" && n.assetLoader.load(C.data.path, C.data.fullPath, function(N) {
            n.postMessage({
              id: C.data.id,
              payload: N,
              status: "success"
            });
          }, function() {
            n.postMessage({
              id: C.data.id,
              status: "error"
            });
          });
        }), s.onmessage = function(m) {
          var C = m.data, I = C.id, P = e[I];
          e[I] = null, C.status === "success" ? P.onComplete(C.payload) : P.onError && P.onError();
        });
      }
      function u(m, C) {
        t += 1;
        var I = "processId_" + t;
        return e[I] = {
          onComplete: m,
          onError: C
        }, I;
      }
      function T(m, C, I) {
        _();
        var P = u(C, I);
        s.postMessage({
          type: "loadAnimation",
          path: m,
          fullPath: window.location.origin + window.location.pathname,
          id: P
        });
      }
      function E(m, C, I) {
        _();
        var P = u(C, I);
        s.postMessage({
          type: "loadData",
          path: m,
          fullPath: window.location.origin + window.location.pathname,
          id: P
        });
      }
      function B(m, C, I) {
        _();
        var P = u(C, I);
        s.postMessage({
          type: "complete",
          animation: m,
          id: P
        });
      }
      return {
        loadAnimation: T,
        loadData: E,
        completeAnimation: B
      };
    }(), ts = function() {
      var t = function() {
        var S = H("canvas");
        S.width = 1, S.height = 1;
        var x = S.getContext("2d");
        return x.fillStyle = "rgba(0,0,0,0)", x.fillRect(0, 0, 1, 1), S;
      }();
      function e() {
        this.loadedAssets += 1, this.loadedAssets === this.totalImages && this.loadedFootagesCount === this.totalFootages && this.imagesLoadedCb && this.imagesLoadedCb(null);
      }
      function i() {
        this.loadedFootagesCount += 1, this.loadedAssets === this.totalImages && this.loadedFootagesCount === this.totalFootages && this.imagesLoadedCb && this.imagesLoadedCb(null);
      }
      function s(S, x, d) {
        var y = "";
        if (S.e)
          y = S.p;
        else if (x) {
          var A = S.p;
          A.indexOf("images/") !== -1 && (A = A.split("/")[1]), y = x + A;
        } else
          y = d, y += S.u ? S.u : "", y += S.p;
        return y;
      }
      function o(S) {
        var x = 0, d = setInterval((function() {
          var y = S.getBBox();
          (y.width || x > 500) && (this._imageLoaded(), clearInterval(d)), x += 1;
        }).bind(this), 50);
      }
      function n(S) {
        var x = s(S, this.assetsPath, this.path), d = ft("image");
        jt ? this.testImageLoaded(d) : d.addEventListener("load", this._imageLoaded, !1), d.addEventListener("error", (function() {
          y.img = t, this._imageLoaded();
        }).bind(this), !1), d.setAttributeNS("http://www.w3.org/1999/xlink", "href", x), this._elementHelper.append ? this._elementHelper.append(d) : this._elementHelper.appendChild(d);
        var y = {
          img: d,
          assetData: S
        };
        return y;
      }
      function c(S) {
        var x = s(S, this.assetsPath, this.path), d = H("img");
        d.crossOrigin = "anonymous", d.addEventListener("load", this._imageLoaded, !1), d.addEventListener("error", (function() {
          y.img = t, this._imageLoaded();
        }).bind(this), !1), d.src = x;
        var y = {
          img: d,
          assetData: S
        };
        return y;
      }
      function _(S) {
        var x = {
          assetData: S
        }, d = s(S, this.assetsPath, this.path);
        return Oi.loadData(d, (function(y) {
          x.img = y, this._footageLoaded();
        }).bind(this), (function() {
          x.img = {}, this._footageLoaded();
        }).bind(this)), x;
      }
      function u(S, x) {
        this.imagesLoadedCb = x;
        var d, y = S.length;
        for (d = 0; d < y; d += 1)
          S[d].layers || (!S[d].t || S[d].t === "seq" ? (this.totalImages += 1, this.images.push(this._createImageData(S[d]))) : S[d].t === 3 && (this.totalFootages += 1, this.images.push(this.createFootageData(S[d]))));
      }
      function T(S) {
        this.path = S || "";
      }
      function E(S) {
        this.assetsPath = S || "";
      }
      function B(S) {
        for (var x = 0, d = this.images.length; x < d; ) {
          if (this.images[x].assetData === S)
            return this.images[x].img;
          x += 1;
        }
        return null;
      }
      function m() {
        this.imagesLoadedCb = null, this.images.length = 0;
      }
      function C() {
        return this.totalImages === this.loadedAssets;
      }
      function I() {
        return this.totalFootages === this.loadedFootagesCount;
      }
      function P(S, x) {
        S === "svg" ? (this._elementHelper = x, this._createImageData = this.createImageData.bind(this)) : this._createImageData = this.createImgData.bind(this);
      }
      function N() {
        this._imageLoaded = e.bind(this), this._footageLoaded = i.bind(this), this.testImageLoaded = o.bind(this), this.createFootageData = _.bind(this), this.assetsPath = "", this.path = "", this.totalImages = 0, this.totalFootages = 0, this.loadedAssets = 0, this.loadedFootagesCount = 0, this.imagesLoadedCb = null, this.images = [];
      }
      return N.prototype = {
        loadAssets: u,
        setAssetsPath: E,
        setPath: T,
        loadedImages: C,
        loadedFootages: I,
        destroy: m,
        getAsset: B,
        createImgData: c,
        createImageData: n,
        imageLoaded: e,
        footageLoaded: i,
        setCacheType: P
      }, N;
    }();
    function It() {
    }
    It.prototype = {
      triggerEvent: function(e, i) {
        if (this._cbs[e])
          for (var s = this._cbs[e], o = 0; o < s.length; o += 1)
            s[o](i);
      },
      addEventListener: function(e, i) {
        return this._cbs[e] || (this._cbs[e] = []), this._cbs[e].push(i), (function() {
          this.removeEventListener(e, i);
        }).bind(this);
      },
      removeEventListener: function(e, i) {
        if (!i)
          this._cbs[e] = null;
        else if (this._cbs[e]) {
          for (var s = 0, o = this._cbs[e].length; s < o; )
            this._cbs[e][s] === i && (this._cbs[e].splice(s, 1), s -= 1, o -= 1), s += 1;
          this._cbs[e].length || (this._cbs[e] = null);
        }
      }
    };
    var kr = /* @__PURE__ */ function() {
      function t(e) {
        for (var i = e.split(`\r
`), s = {}, o, n = 0, c = 0; c < i.length; c += 1)
          o = i[c].split(":"), o.length === 2 && (s[o[0]] = o[1].trim(), n += 1);
        if (n === 0)
          throw new Error();
        return s;
      }
      return function(e) {
        for (var i = [], s = 0; s < e.length; s += 1) {
          var o = e[s], n = {
            time: o.tm,
            duration: o.dr
          };
          try {
            n.payload = JSON.parse(e[s].cm);
          } catch {
            try {
              n.payload = t(e[s].cm);
            } catch {
              n.payload = {
                name: e[s].cm
              };
            }
          }
          i.push(n);
        }
        return i;
      };
    }(), zt = /* @__PURE__ */ function() {
      function t(e) {
        this.compositions.push(e);
      }
      return function() {
        function e(i) {
          for (var s = 0, o = this.compositions.length; s < o; ) {
            if (this.compositions[s].data && this.compositions[s].data.nm === i)
              return this.compositions[s].prepareFrame && this.compositions[s].data.xt && this.compositions[s].prepareFrame(this.currentFrame), this.compositions[s].compInterface;
            s += 1;
          }
          return null;
        }
        return e.compositions = [], e.currentFrame = 0, e.registerComposition = t, e;
      };
    }(), ti = {}, Re = function(e, i) {
      ti[e] = i;
    };
    function Ni(t) {
      return ti[t];
    }
    function es() {
      if (ti.canvas)
        return "canvas";
      for (var t in ti)
        if (ti[t])
          return t;
      return "";
    }
    function Ae(t) {
      "@babel/helpers - typeof";
      return Ae = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
        return typeof e;
      } : function(e) {
        return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
      }, Ae(t);
    }
    var at = function() {
      this._cbs = [], this.name = "", this.path = "", this.isLoaded = !1, this.currentFrame = 0, this.currentRawFrame = 0, this.firstFrame = 0, this.totalFrames = 0, this.frameRate = 0, this.frameMult = 0, this.playSpeed = 1, this.playDirection = 1, this.playCount = 0, this.animationData = {}, this.assets = [], this.isPaused = !0, this.autoplay = !1, this.loop = !0, this.renderer = null, this.animationID = Et(), this.assetsPath = "", this.timeCompleted = 0, this.segmentPos = 0, this.isSubframeEnabled = Nt(), this.segments = [], this._idle = !0, this._completedLoop = !1, this.projectInterface = zt(), this.imagePreloader = new ts(), this.audioController = X(), this.markers = [], this.configAnimation = this.configAnimation.bind(this), this.onSetupError = this.onSetupError.bind(this), this.onSegmentComplete = this.onSegmentComplete.bind(this), this.drawnFrameEvent = new Wt("drawnFrame", 0, 0, 0), this.expressionsPlugin = er();
    };
    U([It], at), at.prototype.setParams = function(t) {
      (t.wrapper || t.container) && (this.wrapper = t.wrapper || t.container);
      var e = "svg";
      t.animType ? e = t.animType : t.renderer && (e = t.renderer);
      var i = Ni(e);
      this.renderer = new i(this, t.rendererSettings), this.imagePreloader.setCacheType(e, this.renderer.globalData.defs), this.renderer.setProjectInterface(this.projectInterface), this.animType = e, t.loop === "" || t.loop === null || t.loop === void 0 || t.loop === !0 ? this.loop = !0 : t.loop === !1 ? this.loop = !1 : this.loop = parseInt(t.loop, 10), this.autoplay = "autoplay" in t ? t.autoplay : !0, this.name = t.name ? t.name : "", this.autoloadSegments = Object.prototype.hasOwnProperty.call(t, "autoloadSegments") ? t.autoloadSegments : !0, this.assetsPath = t.assetsPath, this.initialSegment = t.initialSegment, t.audioFactory && this.audioController.setAudioFactory(t.audioFactory), t.animationData ? this.setupAnimation(t.animationData) : t.path && (t.path.lastIndexOf("\\") !== -1 ? this.path = t.path.substr(0, t.path.lastIndexOf("\\") + 1) : this.path = t.path.substr(0, t.path.lastIndexOf("/") + 1), this.fileName = t.path.substr(t.path.lastIndexOf("/") + 1), this.fileName = this.fileName.substr(0, this.fileName.lastIndexOf(".json")), Oi.loadAnimation(t.path, this.configAnimation, this.onSetupError));
    }, at.prototype.onSetupError = function() {
      this.trigger("data_failed");
    }, at.prototype.setupAnimation = function(t) {
      Oi.completeAnimation(t, this.configAnimation);
    }, at.prototype.setData = function(t, e) {
      e && Ae(e) !== "object" && (e = JSON.parse(e));
      var i = {
        wrapper: t,
        animationData: e
      }, s = t.attributes;
      i.path = s.getNamedItem("data-animation-path") ? s.getNamedItem("data-animation-path").value : s.getNamedItem("data-bm-path") ? s.getNamedItem("data-bm-path").value : s.getNamedItem("bm-path") ? s.getNamedItem("bm-path").value : "", i.animType = s.getNamedItem("data-anim-type") ? s.getNamedItem("data-anim-type").value : s.getNamedItem("data-bm-type") ? s.getNamedItem("data-bm-type").value : s.getNamedItem("bm-type") ? s.getNamedItem("bm-type").value : s.getNamedItem("data-bm-renderer") ? s.getNamedItem("data-bm-renderer").value : s.getNamedItem("bm-renderer") ? s.getNamedItem("bm-renderer").value : es() || "canvas";
      var o = s.getNamedItem("data-anim-loop") ? s.getNamedItem("data-anim-loop").value : s.getNamedItem("data-bm-loop") ? s.getNamedItem("data-bm-loop").value : s.getNamedItem("bm-loop") ? s.getNamedItem("bm-loop").value : "";
      o === "false" ? i.loop = !1 : o === "true" ? i.loop = !0 : o !== "" && (i.loop = parseInt(o, 10));
      var n = s.getNamedItem("data-anim-autoplay") ? s.getNamedItem("data-anim-autoplay").value : s.getNamedItem("data-bm-autoplay") ? s.getNamedItem("data-bm-autoplay").value : s.getNamedItem("bm-autoplay") ? s.getNamedItem("bm-autoplay").value : !0;
      i.autoplay = n !== "false", i.name = s.getNamedItem("data-name") ? s.getNamedItem("data-name").value : s.getNamedItem("data-bm-name") ? s.getNamedItem("data-bm-name").value : s.getNamedItem("bm-name") ? s.getNamedItem("bm-name").value : "";
      var c = s.getNamedItem("data-anim-prerender") ? s.getNamedItem("data-anim-prerender").value : s.getNamedItem("data-bm-prerender") ? s.getNamedItem("data-bm-prerender").value : s.getNamedItem("bm-prerender") ? s.getNamedItem("bm-prerender").value : "";
      c === "false" && (i.prerender = !1), i.path ? this.setParams(i) : this.trigger("destroy");
    }, at.prototype.includeLayers = function(t) {
      t.op > this.animationData.op && (this.animationData.op = t.op, this.totalFrames = Math.floor(t.op - this.animationData.ip));
      var e = this.animationData.layers, i, s = e.length, o = t.layers, n, c = o.length;
      for (n = 0; n < c; n += 1)
        for (i = 0; i < s; ) {
          if (e[i].id === o[n].id) {
            e[i] = o[n];
            break;
          }
          i += 1;
        }
      if ((t.chars || t.fonts) && (this.renderer.globalData.fontManager.addChars(t.chars), this.renderer.globalData.fontManager.addFonts(t.fonts, this.renderer.globalData.defs)), t.assets)
        for (s = t.assets.length, i = 0; i < s; i += 1)
          this.animationData.assets.push(t.assets[i]);
      this.animationData.__complete = !1, Oi.completeAnimation(this.animationData, this.onSegmentComplete);
    }, at.prototype.onSegmentComplete = function(t) {
      this.animationData = t;
      var e = er();
      e && e.initExpressions(this), this.loadNextSegment();
    }, at.prototype.loadNextSegment = function() {
      var t = this.animationData.segments;
      if (!t || t.length === 0 || !this.autoloadSegments) {
        this.trigger("data_ready"), this.timeCompleted = this.totalFrames;
        return;
      }
      var e = t.shift();
      this.timeCompleted = e.time * this.frameRate;
      var i = this.path + this.fileName + "_" + this.segmentPos + ".json";
      this.segmentPos += 1, Oi.loadData(i, this.includeLayers.bind(this), (function() {
        this.trigger("data_failed");
      }).bind(this));
    }, at.prototype.loadSegments = function() {
      var t = this.animationData.segments;
      t || (this.timeCompleted = this.totalFrames), this.loadNextSegment();
    }, at.prototype.imagesLoaded = function() {
      this.trigger("loaded_images"), this.checkLoaded();
    }, at.prototype.preloadImages = function() {
      this.imagePreloader.setAssetsPath(this.assetsPath), this.imagePreloader.setPath(this.path), this.imagePreloader.loadAssets(this.animationData.assets, this.imagesLoaded.bind(this));
    }, at.prototype.configAnimation = function(t) {
      if (this.renderer)
        try {
          this.animationData = t, this.initialSegment ? (this.totalFrames = Math.floor(this.initialSegment[1] - this.initialSegment[0]), this.firstFrame = Math.round(this.initialSegment[0])) : (this.totalFrames = Math.floor(this.animationData.op - this.animationData.ip), this.firstFrame = Math.round(this.animationData.ip)), this.renderer.configAnimation(t), t.assets || (t.assets = []), this.assets = this.animationData.assets, this.frameRate = this.animationData.fr, this.frameMult = this.animationData.fr / 1e3, this.renderer.searchExtraCompositions(t.assets), this.markers = kr(t.markers || []), this.trigger("config_ready"), this.preloadImages(), this.loadSegments(), this.updaFrameModifier(), this.waitForFontsLoaded(), this.isPaused && this.audioController.pause();
        } catch (e) {
          this.triggerConfigError(e);
        }
    }, at.prototype.waitForFontsLoaded = function() {
      this.renderer && (this.renderer.globalData.fontManager.isLoaded ? this.checkLoaded() : setTimeout(this.waitForFontsLoaded.bind(this), 20));
    }, at.prototype.checkLoaded = function() {
      if (!this.isLoaded && this.renderer.globalData.fontManager.isLoaded && (this.imagePreloader.loadedImages() || this.renderer.rendererType !== "canvas") && this.imagePreloader.loadedFootages()) {
        this.isLoaded = !0;
        var t = er();
        t && t.initExpressions(this), this.renderer.initItems(), setTimeout((function() {
          this.trigger("DOMLoaded");
        }).bind(this), 0), this.gotoFrame(), this.autoplay && this.play();
      }
    }, at.prototype.resize = function(t, e) {
      var i = typeof t == "number" ? t : void 0, s = typeof e == "number" ? e : void 0;
      this.renderer.updateContainerSize(i, s);
    }, at.prototype.setSubframe = function(t) {
      this.isSubframeEnabled = !!t;
    }, at.prototype.gotoFrame = function() {
      this.currentFrame = this.isSubframeEnabled ? this.currentRawFrame : ~~this.currentRawFrame, this.timeCompleted !== this.totalFrames && this.currentFrame > this.timeCompleted && (this.currentFrame = this.timeCompleted), this.trigger("enterFrame"), this.renderFrame(), this.trigger("drawnFrame");
    }, at.prototype.renderFrame = function() {
      if (!(this.isLoaded === !1 || !this.renderer))
        try {
          this.expressionsPlugin && this.expressionsPlugin.resetFrame(), this.renderer.renderFrame(this.currentFrame + this.firstFrame);
        } catch (t) {
          this.triggerRenderFrameError(t);
        }
    }, at.prototype.play = function(t) {
      t && this.name !== t || this.isPaused === !0 && (this.isPaused = !1, this.trigger("_play"), this.audioController.resume(), this._idle && (this._idle = !1, this.trigger("_active")));
    }, at.prototype.pause = function(t) {
      t && this.name !== t || this.isPaused === !1 && (this.isPaused = !0, this.trigger("_pause"), this._idle = !0, this.trigger("_idle"), this.audioController.pause());
    }, at.prototype.togglePause = function(t) {
      t && this.name !== t || (this.isPaused === !0 ? this.play() : this.pause());
    }, at.prototype.stop = function(t) {
      t && this.name !== t || (this.pause(), this.playCount = 0, this._completedLoop = !1, this.setCurrentRawFrameValue(0));
    }, at.prototype.getMarkerData = function(t) {
      for (var e, i = 0; i < this.markers.length; i += 1)
        if (e = this.markers[i], e.payload && e.payload.name === t)
          return e;
      return null;
    }, at.prototype.goToAndStop = function(t, e, i) {
      if (!(i && this.name !== i)) {
        var s = Number(t);
        if (isNaN(s)) {
          var o = this.getMarkerData(t);
          o && this.goToAndStop(o.time, !0);
        } else e ? this.setCurrentRawFrameValue(t) : this.setCurrentRawFrameValue(t * this.frameModifier);
        this.pause();
      }
    }, at.prototype.goToAndPlay = function(t, e, i) {
      if (!(i && this.name !== i)) {
        var s = Number(t);
        if (isNaN(s)) {
          var o = this.getMarkerData(t);
          o && (o.duration ? this.playSegments([o.time, o.time + o.duration], !0) : this.goToAndStop(o.time, !0));
        } else
          this.goToAndStop(s, e, i);
        this.play();
      }
    }, at.prototype.advanceTime = function(t) {
      if (!(this.isPaused === !0 || this.isLoaded === !1)) {
        var e = this.currentRawFrame + t * this.frameModifier, i = !1;
        e >= this.totalFrames - 1 && this.frameModifier > 0 ? !this.loop || this.playCount === this.loop ? this.checkSegments(e > this.totalFrames ? e % this.totalFrames : 0) || (i = !0, e = this.totalFrames - 1) : e >= this.totalFrames ? (this.playCount += 1, this.checkSegments(e % this.totalFrames) || (this.setCurrentRawFrameValue(e % this.totalFrames), this._completedLoop = !0, this.trigger("loopComplete"))) : this.setCurrentRawFrameValue(e) : e < 0 ? this.checkSegments(e % this.totalFrames) || (this.loop && !(this.playCount-- <= 0 && this.loop !== !0) ? (this.setCurrentRawFrameValue(this.totalFrames + e % this.totalFrames), this._completedLoop ? this.trigger("loopComplete") : this._completedLoop = !0) : (i = !0, e = 0)) : this.setCurrentRawFrameValue(e), i && (this.setCurrentRawFrameValue(e), this.pause(), this.trigger("complete"));
      }
    }, at.prototype.adjustSegment = function(t, e) {
      this.playCount = 0, t[1] < t[0] ? (this.frameModifier > 0 && (this.playSpeed < 0 ? this.setSpeed(-this.playSpeed) : this.setDirection(-1)), this.totalFrames = t[0] - t[1], this.timeCompleted = this.totalFrames, this.firstFrame = t[1], this.setCurrentRawFrameValue(this.totalFrames - 1e-3 - e)) : t[1] > t[0] && (this.frameModifier < 0 && (this.playSpeed < 0 ? this.setSpeed(-this.playSpeed) : this.setDirection(1)), this.totalFrames = t[1] - t[0], this.timeCompleted = this.totalFrames, this.firstFrame = t[0], this.setCurrentRawFrameValue(1e-3 + e)), this.trigger("segmentStart");
    }, at.prototype.setSegment = function(t, e) {
      var i = -1;
      this.isPaused && (this.currentRawFrame + this.firstFrame < t ? i = t : this.currentRawFrame + this.firstFrame > e && (i = e - t)), this.firstFrame = t, this.totalFrames = e - t, this.timeCompleted = this.totalFrames, i !== -1 && this.goToAndStop(i, !0);
    }, at.prototype.playSegments = function(t, e) {
      if (e && (this.segments.length = 0), Ae(t[0]) === "object") {
        var i, s = t.length;
        for (i = 0; i < s; i += 1)
          this.segments.push(t[i]);
      } else
        this.segments.push(t);
      this.segments.length && e && this.adjustSegment(this.segments.shift(), 0), this.isPaused && this.play();
    }, at.prototype.resetSegments = function(t) {
      this.segments.length = 0, this.segments.push([this.animationData.ip, this.animationData.op]), t && this.checkSegments(0);
    }, at.prototype.checkSegments = function(t) {
      return this.segments.length ? (this.adjustSegment(this.segments.shift(), t), !0) : !1;
    }, at.prototype.destroy = function(t) {
      t && this.name !== t || !this.renderer || (this.renderer.destroy(), this.imagePreloader.destroy(), this.trigger("destroy"), this._cbs = null, this.onEnterFrame = null, this.onLoopComplete = null, this.onComplete = null, this.onSegmentStart = null, this.onDestroy = null, this.renderer = null, this.expressionsPlugin = null, this.imagePreloader = null, this.projectInterface = null);
    }, at.prototype.setCurrentRawFrameValue = function(t) {
      this.currentRawFrame = t, this.gotoFrame();
    }, at.prototype.setSpeed = function(t) {
      this.playSpeed = t, this.updaFrameModifier();
    }, at.prototype.setDirection = function(t) {
      this.playDirection = t < 0 ? -1 : 1, this.updaFrameModifier();
    }, at.prototype.setLoop = function(t) {
      this.loop = t;
    }, at.prototype.setVolume = function(t, e) {
      e && this.name !== e || this.audioController.setVolume(t);
    }, at.prototype.getVolume = function() {
      return this.audioController.getVolume();
    }, at.prototype.mute = function(t) {
      t && this.name !== t || this.audioController.mute();
    }, at.prototype.unmute = function(t) {
      t && this.name !== t || this.audioController.unmute();
    }, at.prototype.updaFrameModifier = function() {
      this.frameModifier = this.frameMult * this.playSpeed * this.playDirection, this.audioController.setRate(this.playSpeed * this.playDirection);
    }, at.prototype.getPath = function() {
      return this.path;
    }, at.prototype.getAssetsPath = function(t) {
      var e = "";
      if (t.e)
        e = t.p;
      else if (this.assetsPath) {
        var i = t.p;
        i.indexOf("images/") !== -1 && (i = i.split("/")[1]), e = this.assetsPath + i;
      } else
        e = this.path, e += t.u ? t.u : "", e += t.p;
      return e;
    }, at.prototype.getAssetData = function(t) {
      for (var e = 0, i = this.assets.length; e < i; ) {
        if (t === this.assets[e].id)
          return this.assets[e];
        e += 1;
      }
      return null;
    }, at.prototype.hide = function() {
      this.renderer.hide();
    }, at.prototype.show = function() {
      this.renderer.show();
    }, at.prototype.getDuration = function(t) {
      return t ? this.totalFrames : this.totalFrames / this.frameRate;
    }, at.prototype.updateDocumentData = function(t, e, i) {
      try {
        var s = this.renderer.getElementByPath(t);
        s.updateDocumentData(e, i);
      } catch {
      }
    }, at.prototype.trigger = function(t) {
      if (this._cbs && this._cbs[t])
        switch (t) {
          case "enterFrame":
            this.triggerEvent(t, new Wt(t, this.currentFrame, this.totalFrames, this.frameModifier));
            break;
          case "drawnFrame":
            this.drawnFrameEvent.currentTime = this.currentFrame, this.drawnFrameEvent.totalTime = this.totalFrames, this.drawnFrameEvent.direction = this.frameModifier, this.triggerEvent(t, this.drawnFrameEvent);
            break;
          case "loopComplete":
            this.triggerEvent(t, new pi(t, this.loop, this.playCount, this.frameMult));
            break;
          case "complete":
            this.triggerEvent(t, new Je(t, this.frameMult));
            break;
          case "segmentStart":
            this.triggerEvent(t, new je(t, this.firstFrame, this.totalFrames));
            break;
          case "destroy":
            this.triggerEvent(t, new dt(t, this));
            break;
          default:
            this.triggerEvent(t);
        }
      t === "enterFrame" && this.onEnterFrame && this.onEnterFrame.call(this, new Wt(t, this.currentFrame, this.totalFrames, this.frameMult)), t === "loopComplete" && this.onLoopComplete && this.onLoopComplete.call(this, new pi(t, this.loop, this.playCount, this.frameMult)), t === "complete" && this.onComplete && this.onComplete.call(this, new Je(t, this.frameMult)), t === "segmentStart" && this.onSegmentStart && this.onSegmentStart.call(this, new je(t, this.firstFrame, this.totalFrames)), t === "destroy" && this.onDestroy && this.onDestroy.call(this, new dt(t, this));
    }, at.prototype.triggerRenderFrameError = function(t) {
      var e = new Ut(t, this.currentFrame);
      this.triggerEvent("error", e), this.onError && this.onError.call(this, e);
    }, at.prototype.triggerConfigError = function(t) {
      var e = new me(t, this.currentFrame);
      this.triggerEvent("error", e), this.onError && this.onError.call(this, e);
    };
    var Ht = function() {
      var t = {}, e = [], i = 0, s = 0, o = 0, n = !0, c = !1;
      function _(w) {
        for (var M = 0, f = w.target; M < s; )
          e[M].animation === f && (e.splice(M, 1), M -= 1, s -= 1, f.isPaused || B()), M += 1;
      }
      function u(w, M) {
        if (!w)
          return null;
        for (var f = 0; f < s; ) {
          if (e[f].elem === w && e[f].elem !== null)
            return e[f].animation;
          f += 1;
        }
        var p = new at();
        return m(p, w), p.setData(w, M), p;
      }
      function T() {
        var w, M = e.length, f = [];
        for (w = 0; w < M; w += 1)
          f.push(e[w].animation);
        return f;
      }
      function E() {
        o += 1, ct();
      }
      function B() {
        o -= 1;
      }
      function m(w, M) {
        w.addEventListener("destroy", _), w.addEventListener("_active", E), w.addEventListener("_idle", B), e.push({
          elem: M,
          animation: w
        }), s += 1;
      }
      function C(w) {
        var M = new at();
        return m(M, null), M.setParams(w), M;
      }
      function I(w, M) {
        var f;
        for (f = 0; f < s; f += 1)
          e[f].animation.setSpeed(w, M);
      }
      function P(w, M) {
        var f;
        for (f = 0; f < s; f += 1)
          e[f].animation.setDirection(w, M);
      }
      function N(w) {
        var M;
        for (M = 0; M < s; M += 1)
          e[M].animation.play(w);
      }
      function S(w) {
        var M = w - i, f;
        for (f = 0; f < s; f += 1)
          e[f].animation.advanceTime(M);
        i = w, o && !c ? window.requestAnimationFrame(S) : n = !0;
      }
      function x(w) {
        i = w, window.requestAnimationFrame(S);
      }
      function d(w) {
        var M;
        for (M = 0; M < s; M += 1)
          e[M].animation.pause(w);
      }
      function y(w, M, f) {
        var p;
        for (p = 0; p < s; p += 1)
          e[p].animation.goToAndStop(w, M, f);
      }
      function A(w) {
        var M;
        for (M = 0; M < s; M += 1)
          e[M].animation.stop(w);
      }
      function L(w) {
        var M;
        for (M = 0; M < s; M += 1)
          e[M].animation.togglePause(w);
      }
      function D(w) {
        var M;
        for (M = s - 1; M >= 0; M -= 1)
          e[M].animation.destroy(w);
      }
      function j(w, M, f) {
        var p = [].concat([].slice.call(document.getElementsByClassName("lottie")), [].slice.call(document.getElementsByClassName("bodymovin"))), $, F = p.length;
        for ($ = 0; $ < F; $ += 1)
          f && p[$].setAttribute("data-bm-type", f), u(p[$], w);
        if (M && F === 0) {
          f || (f = "svg");
          var et = document.getElementsByTagName("body")[0];
          et.innerText = "";
          var ht = H("div");
          ht.style.width = "100%", ht.style.height = "100%", ht.setAttribute("data-bm-type", f), et.appendChild(ht), u(ht, w);
        }
      }
      function Y() {
        var w;
        for (w = 0; w < s; w += 1)
          e[w].animation.resize();
      }
      function ct() {
        !c && o && n && (window.requestAnimationFrame(x), n = !1);
      }
      function ot() {
        c = !0;
      }
      function K() {
        c = !1, ct();
      }
      function pt(w, M) {
        var f;
        for (f = 0; f < s; f += 1)
          e[f].animation.setVolume(w, M);
      }
      function it(w) {
        var M;
        for (M = 0; M < s; M += 1)
          e[M].animation.mute(w);
      }
      function G(w) {
        var M;
        for (M = 0; M < s; M += 1)
          e[M].animation.unmute(w);
      }
      return t.registerAnimation = u, t.loadAnimation = C, t.setSpeed = I, t.setDirection = P, t.play = N, t.pause = d, t.stop = A, t.togglePause = L, t.searchAnimations = j, t.resize = Y, t.goToAndStop = y, t.destroy = D, t.freeze = ot, t.unfreeze = K, t.setVolume = pt, t.mute = it, t.unmute = G, t.getRegisteredAnimations = T, t;
    }(), di = function() {
      var t = {};
      t.getBezierEasing = i;
      var e = {};
      function i(x, d, y, A, L) {
        var D = L || ("bez_" + x + "_" + d + "_" + y + "_" + A).replace(/\./g, "p");
        if (e[D])
          return e[D];
        var j = new S([x, d, y, A]);
        return e[D] = j, j;
      }
      var s = 4, o = 1e-3, n = 1e-7, c = 10, _ = 11, u = 1 / (_ - 1), T = typeof Float32Array == "function";
      function E(x, d) {
        return 1 - 3 * d + 3 * x;
      }
      function B(x, d) {
        return 3 * d - 6 * x;
      }
      function m(x) {
        return 3 * x;
      }
      function C(x, d, y) {
        return ((E(d, y) * x + B(d, y)) * x + m(d)) * x;
      }
      function I(x, d, y) {
        return 3 * E(d, y) * x * x + 2 * B(d, y) * x + m(d);
      }
      function P(x, d, y, A, L) {
        var D, j, Y = 0;
        do
          j = d + (y - d) / 2, D = C(j, A, L) - x, D > 0 ? y = j : d = j;
        while (Math.abs(D) > n && ++Y < c);
        return j;
      }
      function N(x, d, y, A) {
        for (var L = 0; L < s; ++L) {
          var D = I(d, y, A);
          if (D === 0) return d;
          var j = C(d, y, A) - x;
          d -= j / D;
        }
        return d;
      }
      function S(x) {
        this._p = x, this._mSampleValues = T ? new Float32Array(_) : new Array(_), this._precomputed = !1, this.get = this.get.bind(this);
      }
      return S.prototype = {
        get: function(d) {
          var y = this._p[0], A = this._p[1], L = this._p[2], D = this._p[3];
          return this._precomputed || this._precompute(), y === A && L === D ? d : d === 0 ? 0 : d === 1 ? 1 : C(this._getTForX(d), A, D);
        },
        // Private part
        _precompute: function() {
          var d = this._p[0], y = this._p[1], A = this._p[2], L = this._p[3];
          this._precomputed = !0, (d !== y || A !== L) && this._calcSampleValues();
        },
        _calcSampleValues: function() {
          for (var d = this._p[0], y = this._p[2], A = 0; A < _; ++A)
            this._mSampleValues[A] = C(A * u, d, y);
        },
        /**
             * getTForX chose the fastest heuristic to determine the percentage value precisely from a given X projection.
             */
        _getTForX: function(d) {
          for (var y = this._p[0], A = this._p[2], L = this._mSampleValues, D = 0, j = 1, Y = _ - 1; j !== Y && L[j] <= d; ++j)
            D += u;
          --j;
          var ct = (d - L[j]) / (L[j + 1] - L[j]), ot = D + ct * u, K = I(ot, y, A);
          return K >= o ? N(d, ot, y, A) : K === 0 ? ot : P(d, D, D + u, y, A);
        }
      }, t;
    }(), xr = /* @__PURE__ */ function() {
      function t(e) {
        return e.concat(rt(e.length));
      }
      return {
        double: t
      };
    }(), Se = /* @__PURE__ */ function() {
      return function(t, e, i) {
        var s = 0, o = t, n = rt(o), c = {
          newElement: _,
          release: u
        };
        function _() {
          var T;
          return s ? (s -= 1, T = n[s]) : T = e(), T;
        }
        function u(T) {
          s === o && (n = xr.double(n), o *= 2), i && i(T), n[s] = T, s += 1;
        }
        return c;
      };
    }(), We = function() {
      function t() {
        return {
          addedLength: 0,
          percents: tt("float32", rr()),
          lengths: tt("float32", rr())
        };
      }
      return Se(8, t);
    }(), He = function() {
      function t() {
        return {
          lengths: [],
          totalLength: 0
        };
      }
      function e(i) {
        var s, o = i.lengths.length;
        for (s = 0; s < o; s += 1)
          We.release(i.lengths[s]);
        i.lengths.length = 0;
      }
      return Se(8, t, e);
    }();
    function Tr() {
      var t = Math;
      function e(m, C, I, P, N, S) {
        var x = m * P + C * N + I * S - N * P - S * m - I * C;
        return x > -1e-3 && x < 1e-3;
      }
      function i(m, C, I, P, N, S, x, d, y) {
        if (I === 0 && S === 0 && y === 0)
          return e(m, C, P, N, x, d);
        var A = t.sqrt(t.pow(P - m, 2) + t.pow(N - C, 2) + t.pow(S - I, 2)), L = t.sqrt(t.pow(x - m, 2) + t.pow(d - C, 2) + t.pow(y - I, 2)), D = t.sqrt(t.pow(x - P, 2) + t.pow(d - N, 2) + t.pow(y - S, 2)), j;
        return A > L ? A > D ? j = A - L - D : j = D - L - A : D > L ? j = D - L - A : j = L - A - D, j > -1e-4 && j < 1e-4;
      }
      var s = /* @__PURE__ */ function() {
        return function(m, C, I, P) {
          var N = rr(), S, x, d, y, A, L = 0, D, j = [], Y = [], ct = We.newElement();
          for (d = I.length, S = 0; S < N; S += 1) {
            for (A = S / (N - 1), D = 0, x = 0; x < d; x += 1)
              y = Ft(1 - A, 3) * m[x] + 3 * Ft(1 - A, 2) * A * I[x] + 3 * (1 - A) * Ft(A, 2) * P[x] + Ft(A, 3) * C[x], j[x] = y, Y[x] !== null && (D += Ft(j[x] - Y[x], 2)), Y[x] = j[x];
            D && (D = Rt(D), L += D), ct.percents[S] = A, ct.lengths[S] = L;
          }
          return ct.addedLength = L, ct;
        };
      }();
      function o(m) {
        var C = He.newElement(), I = m.c, P = m.v, N = m.o, S = m.i, x, d = m._length, y = C.lengths, A = 0;
        for (x = 0; x < d - 1; x += 1)
          y[x] = s(P[x], P[x + 1], N[x], S[x + 1]), A += y[x].addedLength;
        return I && d && (y[x] = s(P[x], P[0], N[x], S[0]), A += y[x].addedLength), C.totalLength = A, C;
      }
      function n(m) {
        this.segmentLength = 0, this.points = new Array(m);
      }
      function c(m, C) {
        this.partialLength = m, this.point = C;
      }
      var _ = /* @__PURE__ */ function() {
        var m = {};
        return function(C, I, P, N) {
          var S = (C[0] + "_" + C[1] + "_" + I[0] + "_" + I[1] + "_" + P[0] + "_" + P[1] + "_" + N[0] + "_" + N[1]).replace(/\./g, "p");
          if (!m[S]) {
            var x = rr(), d, y, A, L, D, j = 0, Y, ct, ot = null;
            C.length === 2 && (C[0] !== I[0] || C[1] !== I[1]) && e(C[0], C[1], I[0], I[1], C[0] + P[0], C[1] + P[1]) && e(C[0], C[1], I[0], I[1], I[0] + N[0], I[1] + N[1]) && (x = 2);
            var K = new n(x);
            for (A = P.length, d = 0; d < x; d += 1) {
              for (ct = rt(A), D = d / (x - 1), Y = 0, y = 0; y < A; y += 1)
                L = Ft(1 - D, 3) * C[y] + 3 * Ft(1 - D, 2) * D * (C[y] + P[y]) + 3 * (1 - D) * Ft(D, 2) * (I[y] + N[y]) + Ft(D, 3) * I[y], ct[y] = L, ot !== null && (Y += Ft(ct[y] - ot[y], 2));
              Y = Rt(Y), j += Y, K.points[d] = new c(Y, ct), ot = ct;
            }
            K.segmentLength = j, m[S] = K;
          }
          return m[S];
        };
      }();
      function u(m, C) {
        var I = C.percents, P = C.lengths, N = I.length, S = Bt((N - 1) * m), x = m * C.addedLength, d = 0;
        if (S === N - 1 || S === 0 || x === P[S])
          return I[S];
        for (var y = P[S] > x ? -1 : 1, A = !0; A; )
          if (P[S] <= x && P[S + 1] > x ? (d = (x - P[S]) / (P[S + 1] - P[S]), A = !1) : S += y, S < 0 || S >= N - 1) {
            if (S === N - 1)
              return I[S];
            A = !1;
          }
        return I[S] + (I[S + 1] - I[S]) * d;
      }
      function T(m, C, I, P, N, S) {
        var x = u(N, S), d = 1 - x, y = t.round((d * d * d * m[0] + (x * d * d + d * x * d + d * d * x) * I[0] + (x * x * d + d * x * x + x * d * x) * P[0] + x * x * x * C[0]) * 1e3) / 1e3, A = t.round((d * d * d * m[1] + (x * d * d + d * x * d + d * d * x) * I[1] + (x * x * d + d * x * x + x * d * x) * P[1] + x * x * x * C[1]) * 1e3) / 1e3;
        return [y, A];
      }
      var E = tt("float32", 8);
      function B(m, C, I, P, N, S, x) {
        N < 0 ? N = 0 : N > 1 && (N = 1);
        var d = u(N, x);
        S = S > 1 ? 1 : S;
        var y = u(S, x), A, L = m.length, D = 1 - d, j = 1 - y, Y = D * D * D, ct = d * D * D * 3, ot = d * d * D * 3, K = d * d * d, pt = D * D * j, it = d * D * j + D * d * j + D * D * y, G = d * d * j + D * d * y + d * D * y, w = d * d * y, M = D * j * j, f = d * j * j + D * y * j + D * j * y, p = d * y * j + D * y * y + d * j * y, $ = d * y * y, F = j * j * j, et = y * j * j + j * y * j + j * j * y, ht = y * y * j + j * y * y + y * j * y, ut = y * y * y;
        for (A = 0; A < L; A += 1)
          E[A * 4] = t.round((Y * m[A] + ct * I[A] + ot * P[A] + K * C[A]) * 1e3) / 1e3, E[A * 4 + 1] = t.round((pt * m[A] + it * I[A] + G * P[A] + w * C[A]) * 1e3) / 1e3, E[A * 4 + 2] = t.round((M * m[A] + f * I[A] + p * P[A] + $ * C[A]) * 1e3) / 1e3, E[A * 4 + 3] = t.round((F * m[A] + et * I[A] + ht * P[A] + ut * C[A]) * 1e3) / 1e3;
        return E;
      }
      return {
        getSegmentsLength: o,
        getNewSegment: B,
        getPointInSegment: T,
        buildBezierData: _,
        pointOnLine2D: e,
        pointOnLine3D: i
      };
    }
    var pe = Tr(), Oe = v, nr = Math.abs;
    function ei(t, e) {
      var i = this.offsetTime, s;
      this.propType === "multidimensional" && (s = tt("float32", this.pv.length));
      for (var o = e.lastIndex, n = o, c = this.keyframes.length - 1, _ = !0, u, T, E; _; ) {
        if (u = this.keyframes[n], T = this.keyframes[n + 1], n === c - 1 && t >= T.t - i) {
          u.h && (u = T), o = 0;
          break;
        }
        if (T.t - i > t) {
          o = n;
          break;
        }
        n < c - 1 ? n += 1 : (o = 0, _ = !1);
      }
      E = this.keyframesMetadata[n] || {};
      var B, m, C, I, P, N, S = T.t - i, x = u.t - i, d;
      if (u.to) {
        E.bezierData || (E.bezierData = pe.buildBezierData(u.s, T.s || u.e, u.to, u.ti));
        var y = E.bezierData;
        if (t >= S || t < x) {
          var A = t >= S ? y.points.length - 1 : 0;
          for (m = y.points[A].point.length, B = 0; B < m; B += 1)
            s[B] = y.points[A].point[B];
        } else {
          E.__fnct ? N = E.__fnct : (N = di.getBezierEasing(u.o.x, u.o.y, u.i.x, u.i.y, u.n).get, E.__fnct = N), C = N((t - x) / (S - x));
          var L = y.segmentLength * C, D, j = e.lastFrame < t && e._lastKeyframeIndex === n ? e._lastAddedLength : 0;
          for (P = e.lastFrame < t && e._lastKeyframeIndex === n ? e._lastPoint : 0, _ = !0, I = y.points.length; _; ) {
            if (j += y.points[P].partialLength, L === 0 || C === 0 || P === y.points.length - 1) {
              for (m = y.points[P].point.length, B = 0; B < m; B += 1)
                s[B] = y.points[P].point[B];
              break;
            } else if (L >= j && L < j + y.points[P + 1].partialLength) {
              for (D = (L - j) / y.points[P + 1].partialLength, m = y.points[P].point.length, B = 0; B < m; B += 1)
                s[B] = y.points[P].point[B] + (y.points[P + 1].point[B] - y.points[P].point[B]) * D;
              break;
            }
            P < I - 1 ? P += 1 : _ = !1;
          }
          e._lastPoint = P, e._lastAddedLength = j - y.points[P].partialLength, e._lastKeyframeIndex = n;
        }
      } else {
        var Y, ct, ot, K, pt;
        if (c = u.s.length, d = T.s || u.e, this.sh && u.h !== 1)
          if (t >= S)
            s[0] = d[0], s[1] = d[1], s[2] = d[2];
          else if (t <= x)
            s[0] = u.s[0], s[1] = u.s[1], s[2] = u.s[2];
          else {
            var it = Ar(u.s), G = Ar(d), w = (t - x) / (S - x);
            ar(s, or(it, G, w));
          }
        else
          for (n = 0; n < c; n += 1)
            u.h !== 1 && (t >= S ? C = 1 : t < x ? C = 0 : (u.o.x.constructor === Array ? (E.__fnct || (E.__fnct = []), E.__fnct[n] ? N = E.__fnct[n] : (Y = u.o.x[n] === void 0 ? u.o.x[0] : u.o.x[n], ct = u.o.y[n] === void 0 ? u.o.y[0] : u.o.y[n], ot = u.i.x[n] === void 0 ? u.i.x[0] : u.i.x[n], K = u.i.y[n] === void 0 ? u.i.y[0] : u.i.y[n], N = di.getBezierEasing(Y, ct, ot, K).get, E.__fnct[n] = N)) : E.__fnct ? N = E.__fnct : (Y = u.o.x, ct = u.o.y, ot = u.i.x, K = u.i.y, N = di.getBezierEasing(Y, ct, ot, K).get, u.keyframeMetadata = N), C = N((t - x) / (S - x)))), d = T.s || u.e, pt = u.h === 1 ? u.s[n] : u.s[n] + (d[n] - u.s[n]) * C, this.propType === "multidimensional" ? s[n] = pt : s = pt;
      }
      return e.lastIndex = o, s;
    }
    function or(t, e, i) {
      var s = [], o = t[0], n = t[1], c = t[2], _ = t[3], u = e[0], T = e[1], E = e[2], B = e[3], m, C, I, P, N;
      return C = o * u + n * T + c * E + _ * B, C < 0 && (C = -C, u = -u, T = -T, E = -E, B = -B), 1 - C > 1e-6 ? (m = Math.acos(C), I = Math.sin(m), P = Math.sin((1 - i) * m) / I, N = Math.sin(i * m) / I) : (P = 1 - i, N = i), s[0] = P * o + N * u, s[1] = P * n + N * T, s[2] = P * c + N * E, s[3] = P * _ + N * B, s;
    }
    function ar(t, e) {
      var i = e[0], s = e[1], o = e[2], n = e[3], c = Math.atan2(2 * s * n - 2 * i * o, 1 - 2 * s * s - 2 * o * o), _ = Math.asin(2 * i * s + 2 * o * n), u = Math.atan2(2 * i * n - 2 * s * o, 1 - 2 * i * i - 2 * o * o);
      t[0] = c / At, t[1] = _ / At, t[2] = u / At;
    }
    function Ar(t) {
      var e = t[0] * At, i = t[1] * At, s = t[2] * At, o = Math.cos(e / 2), n = Math.cos(i / 2), c = Math.cos(s / 2), _ = Math.sin(e / 2), u = Math.sin(i / 2), T = Math.sin(s / 2), E = o * n * c - _ * u * T, B = _ * u * c + o * n * T, m = _ * n * c + o * u * T, C = o * u * c - _ * n * T;
      return [B, m, C, E];
    }
    function Sr() {
      var t = this.comp.renderedFrame - this.offsetTime, e = this.keyframes[0].t - this.offsetTime, i = this.keyframes[this.keyframes.length - 1].t - this.offsetTime;
      if (!(t === this._caching.lastFrame || this._caching.lastFrame !== Oe && (this._caching.lastFrame >= i && t >= i || this._caching.lastFrame < e && t < e))) {
        this._caching.lastFrame >= t && (this._caching._lastKeyframeIndex = -1, this._caching.lastIndex = 0);
        var s = this.interpolateValue(t, this._caching);
        this.pv = s;
      }
      return this._caching.lastFrame = t, this.pv;
    }
    function zi(t) {
      var e;
      if (this.propType === "unidimensional")
        e = t * this.mult, nr(this.v - e) > 1e-5 && (this.v = e, this._mdf = !0);
      else
        for (var i = 0, s = this.v.length; i < s; )
          e = t[i] * this.mult, nr(this.v[i] - e) > 1e-5 && (this.v[i] = e, this._mdf = !0), i += 1;
    }
    function mi() {
      if (!(this.elem.globalData.frameId === this.frameId || !this.effectsSequence.length)) {
        if (this.lock) {
          this.setVValue(this.pv);
          return;
        }
        this.lock = !0, this._mdf = this._isFirstFrame;
        var t, e = this.effectsSequence.length, i = this.kf ? this.pv : this.data.k;
        for (t = 0; t < e; t += 1)
          i = this.effectsSequence[t](i);
        this.setVValue(i), this._isFirstFrame = !1, this.lock = !1, this.frameId = this.elem.globalData.frameId;
      }
    }
    function gi(t) {
      this.effectsSequence.push(t), this.container.addDynamicProperty(this);
    }
    function vi(t, e, i, s) {
      this.propType = "unidimensional", this.mult = i || 1, this.data = e, this.v = i ? e.k * i : e.k, this.pv = e.k, this._mdf = !1, this.elem = t, this.container = s, this.comp = t.comp, this.k = !1, this.kf = !1, this.vel = 0, this.effectsSequence = [], this._isFirstFrame = !0, this.getValue = mi, this.setVValue = zi, this.addEffect = gi;
    }
    function yi(t, e, i, s) {
      this.propType = "multidimensional", this.mult = i || 1, this.data = e, this._mdf = !1, this.elem = t, this.container = s, this.comp = t.comp, this.k = !1, this.kf = !1, this.frameId = -1;
      var o, n = e.k.length;
      for (this.v = tt("float32", n), this.pv = tt("float32", n), this.vel = tt("float32", n), o = 0; o < n; o += 1)
        this.v[o] = e.k[o] * this.mult, this.pv[o] = e.k[o];
      this._isFirstFrame = !0, this.effectsSequence = [], this.getValue = mi, this.setVValue = zi, this.addEffect = gi;
    }
    function is(t, e, i, s) {
      this.propType = "unidimensional", this.keyframes = e.k, this.keyframesMetadata = [], this.offsetTime = t.data.st, this.frameId = -1, this._caching = {
        lastFrame: Oe,
        lastIndex: 0,
        value: 0,
        _lastKeyframeIndex: -1
      }, this.k = !0, this.kf = !0, this.data = e, this.mult = i || 1, this.elem = t, this.container = s, this.comp = t.comp, this.v = Oe, this.pv = Oe, this._isFirstFrame = !0, this.getValue = mi, this.setVValue = zi, this.interpolateValue = ei, this.effectsSequence = [Sr.bind(this)], this.addEffect = gi;
    }
    function rs(t, e, i, s) {
      this.propType = "multidimensional";
      var o, n = e.k.length, c, _, u, T;
      for (o = 0; o < n - 1; o += 1)
        e.k[o].to && e.k[o].s && e.k[o + 1] && e.k[o + 1].s && (c = e.k[o].s, _ = e.k[o + 1].s, u = e.k[o].to, T = e.k[o].ti, (c.length === 2 && !(c[0] === _[0] && c[1] === _[1]) && pe.pointOnLine2D(c[0], c[1], _[0], _[1], c[0] + u[0], c[1] + u[1]) && pe.pointOnLine2D(c[0], c[1], _[0], _[1], _[0] + T[0], _[1] + T[1]) || c.length === 3 && !(c[0] === _[0] && c[1] === _[1] && c[2] === _[2]) && pe.pointOnLine3D(c[0], c[1], c[2], _[0], _[1], _[2], c[0] + u[0], c[1] + u[1], c[2] + u[2]) && pe.pointOnLine3D(c[0], c[1], c[2], _[0], _[1], _[2], _[0] + T[0], _[1] + T[1], _[2] + T[2])) && (e.k[o].to = null, e.k[o].ti = null), c[0] === _[0] && c[1] === _[1] && u[0] === 0 && u[1] === 0 && T[0] === 0 && T[1] === 0 && (c.length === 2 || c[2] === _[2] && u[2] === 0 && T[2] === 0) && (e.k[o].to = null, e.k[o].ti = null));
      this.effectsSequence = [Sr.bind(this)], this.data = e, this.keyframes = e.k, this.keyframesMetadata = [], this.offsetTime = t.data.st, this.k = !0, this.kf = !0, this._isFirstFrame = !0, this.mult = i || 1, this.elem = t, this.container = s, this.comp = t.comp, this.getValue = mi, this.setVValue = zi, this.interpolateValue = ei, this.frameId = -1;
      var E = e.k[0].s.length;
      for (this.v = tt("float32", E), this.pv = tt("float32", E), o = 0; o < E; o += 1)
        this.v[o] = Oe, this.pv[o] = Oe;
      this._caching = {
        lastFrame: Oe,
        lastIndex: 0,
        value: tt("float32", E)
      }, this.addEffect = gi;
    }
    var Q = /* @__PURE__ */ function() {
      function t(i, s, o, n, c) {
        s.sid && (s = i.globalData.slotManager.getProp(s));
        var _;
        if (!s.k.length)
          _ = new vi(i, s, n, c);
        else if (typeof s.k[0] == "number")
          _ = new yi(i, s, n, c);
        else
          switch (o) {
            case 0:
              _ = new is(i, s, n, c);
              break;
            case 1:
              _ = new rs(i, s, n, c);
              break;
          }
        return _.effectsSequence.length && c.addDynamicProperty(_), _;
      }
      var e = {
        getProp: t
      };
      return e;
    }();
    function Xt() {
    }
    Xt.prototype = {
      addDynamicProperty: function(e) {
        this.dynamicProperties.indexOf(e) === -1 && (this.dynamicProperties.push(e), this.container.addDynamicProperty(this), this._isAnimated = !0);
      },
      iterateDynamicProperties: function() {
        this._mdf = !1;
        var e, i = this.dynamicProperties.length;
        for (e = 0; e < i; e += 1)
          this.dynamicProperties[e].getValue(), this.dynamicProperties[e]._mdf && (this._mdf = !0);
      },
      initDynamicPropertyContainer: function(e) {
        this.container = e, this.dynamicProperties = [], this._mdf = !1, this._isAnimated = !1;
      }
    };
    var Ue = function() {
      function t() {
        return tt("float32", 2);
      }
      return Se(8, t);
    }();
    function ge() {
      this.c = !1, this._length = 0, this._maxLength = 8, this.v = rt(this._maxLength), this.o = rt(this._maxLength), this.i = rt(this._maxLength);
    }
    ge.prototype.setPathData = function(t, e) {
      this.c = t, this.setLength(e);
      for (var i = 0; i < e; )
        this.v[i] = Ue.newElement(), this.o[i] = Ue.newElement(), this.i[i] = Ue.newElement(), i += 1;
    }, ge.prototype.setLength = function(t) {
      for (; this._maxLength < t; )
        this.doubleArrayLength();
      this._length = t;
    }, ge.prototype.doubleArrayLength = function() {
      this.v = this.v.concat(rt(this._maxLength)), this.i = this.i.concat(rt(this._maxLength)), this.o = this.o.concat(rt(this._maxLength)), this._maxLength *= 2;
    }, ge.prototype.setXYAt = function(t, e, i, s, o) {
      var n;
      switch (this._length = Math.max(this._length, s + 1), this._length >= this._maxLength && this.doubleArrayLength(), i) {
        case "v":
          n = this.v;
          break;
        case "i":
          n = this.i;
          break;
        case "o":
          n = this.o;
          break;
        default:
          n = [];
          break;
      }
      (!n[s] || n[s] && !o) && (n[s] = Ue.newElement()), n[s][0] = t, n[s][1] = e;
    }, ge.prototype.setTripleAt = function(t, e, i, s, o, n, c, _) {
      this.setXYAt(t, e, "v", c, _), this.setXYAt(i, s, "o", c, _), this.setXYAt(o, n, "i", c, _);
    }, ge.prototype.reverse = function() {
      var t = new ge();
      t.setPathData(this.c, this._length);
      var e = this.v, i = this.o, s = this.i, o = 0;
      this.c && (t.setTripleAt(e[0][0], e[0][1], s[0][0], s[0][1], i[0][0], i[0][1], 0, !1), o = 1);
      var n = this._length - 1, c = this._length, _;
      for (_ = o; _ < c; _ += 1)
        t.setTripleAt(e[n][0], e[n][1], s[n][0], s[n][1], i[n][0], i[n][1], _, !1), n -= 1;
      return t;
    }, ge.prototype.length = function() {
      return this._length;
    };
    var qt = function() {
      function t() {
        return new ge();
      }
      function e(o) {
        var n = o._length, c;
        for (c = 0; c < n; c += 1)
          Ue.release(o.v[c]), Ue.release(o.i[c]), Ue.release(o.o[c]), o.v[c] = null, o.i[c] = null, o.o[c] = null;
        o._length = 0, o.c = !1;
      }
      function i(o) {
        var n = s.newElement(), c, _ = o._length === void 0 ? o.v.length : o._length;
        for (n.setLength(_), n.c = o.c, c = 0; c < _; c += 1)
          n.setTripleAt(o.v[c][0], o.v[c][1], o.o[c][0], o.o[c][1], o.i[c][0], o.i[c][1], c);
        return n;
      }
      var s = Se(4, t, e);
      return s.clone = i, s;
    }();
    function ve() {
      this._length = 0, this._maxLength = 4, this.shapes = rt(this._maxLength);
    }
    ve.prototype.addShape = function(t) {
      this._length === this._maxLength && (this.shapes = this.shapes.concat(rt(this._maxLength)), this._maxLength *= 2), this.shapes[this._length] = t, this._length += 1;
    }, ve.prototype.releaseShapes = function() {
      var t;
      for (t = 0; t < this._length; t += 1)
        qt.release(this.shapes[t]);
      this._length = 0;
    };
    var Ee = function() {
      var t = {
        newShapeCollection: o,
        release: n
      }, e = 0, i = 4, s = rt(i);
      function o() {
        var c;
        return e ? (e -= 1, c = s[e]) : c = new ve(), c;
      }
      function n(c) {
        var _, u = c._length;
        for (_ = 0; _ < u; _ += 1)
          qt.release(c.shapes[_]);
        c._length = 0, e === i && (s = xr.double(s), i *= 2), s[e] = c, e += 1;
      }
      return t;
    }(), _i = function() {
      var t = -999999;
      function e(S, x, d) {
        var y = d.lastIndex, A, L, D, j, Y, ct, ot, K, pt, it = this.keyframes;
        if (S < it[0].t - this.offsetTime)
          A = it[0].s[0], D = !0, y = 0;
        else if (S >= it[it.length - 1].t - this.offsetTime)
          A = it[it.length - 1].s ? it[it.length - 1].s[0] : it[it.length - 2].e[0], D = !0;
        else {
          for (var G = y, w = it.length - 1, M = !0, f, p, $; M && (f = it[G], p = it[G + 1], !(p.t - this.offsetTime > S)); )
            G < w - 1 ? G += 1 : M = !1;
          if ($ = this.keyframesMetadata[G] || {}, D = f.h === 1, y = G, !D) {
            if (S >= p.t - this.offsetTime)
              K = 1;
            else if (S < f.t - this.offsetTime)
              K = 0;
            else {
              var F;
              $.__fnct ? F = $.__fnct : (F = di.getBezierEasing(f.o.x, f.o.y, f.i.x, f.i.y).get, $.__fnct = F), K = F((S - (f.t - this.offsetTime)) / (p.t - this.offsetTime - (f.t - this.offsetTime)));
            }
            L = p.s ? p.s[0] : f.e[0];
          }
          A = f.s[0];
        }
        for (ct = x._length, ot = A.i[0].length, d.lastIndex = y, j = 0; j < ct; j += 1)
          for (Y = 0; Y < ot; Y += 1)
            pt = D ? A.i[j][Y] : A.i[j][Y] + (L.i[j][Y] - A.i[j][Y]) * K, x.i[j][Y] = pt, pt = D ? A.o[j][Y] : A.o[j][Y] + (L.o[j][Y] - A.o[j][Y]) * K, x.o[j][Y] = pt, pt = D ? A.v[j][Y] : A.v[j][Y] + (L.v[j][Y] - A.v[j][Y]) * K, x.v[j][Y] = pt;
      }
      function i() {
        var S = this.comp.renderedFrame - this.offsetTime, x = this.keyframes[0].t - this.offsetTime, d = this.keyframes[this.keyframes.length - 1].t - this.offsetTime, y = this._caching.lastFrame;
        return y !== t && (y < x && S < x || y > d && S > d) || (this._caching.lastIndex = y < S ? this._caching.lastIndex : 0, this.interpolateShape(S, this.pv, this._caching)), this._caching.lastFrame = S, this.pv;
      }
      function s() {
        this.paths = this.localShapeCollection;
      }
      function o(S, x) {
        if (S._length !== x._length || S.c !== x.c)
          return !1;
        var d, y = S._length;
        for (d = 0; d < y; d += 1)
          if (S.v[d][0] !== x.v[d][0] || S.v[d][1] !== x.v[d][1] || S.o[d][0] !== x.o[d][0] || S.o[d][1] !== x.o[d][1] || S.i[d][0] !== x.i[d][0] || S.i[d][1] !== x.i[d][1])
            return !1;
        return !0;
      }
      function n(S) {
        o(this.v, S) || (this.v = qt.clone(S), this.localShapeCollection.releaseShapes(), this.localShapeCollection.addShape(this.v), this._mdf = !0, this.paths = this.localShapeCollection);
      }
      function c() {
        if (this.elem.globalData.frameId !== this.frameId) {
          if (!this.effectsSequence.length) {
            this._mdf = !1;
            return;
          }
          if (this.lock) {
            this.setVValue(this.pv);
            return;
          }
          this.lock = !0, this._mdf = !1;
          var S;
          this.kf ? S = this.pv : this.data.ks ? S = this.data.ks.k : S = this.data.pt.k;
          var x, d = this.effectsSequence.length;
          for (x = 0; x < d; x += 1)
            S = this.effectsSequence[x](S);
          this.setVValue(S), this.lock = !1, this.frameId = this.elem.globalData.frameId;
        }
      }
      function _(S, x, d) {
        this.propType = "shape", this.comp = S.comp, this.container = S, this.elem = S, this.data = x, this.k = !1, this.kf = !1, this._mdf = !1;
        var y = d === 3 ? x.pt.k : x.ks.k;
        this.v = qt.clone(y), this.pv = qt.clone(this.v), this.localShapeCollection = Ee.newShapeCollection(), this.paths = this.localShapeCollection, this.paths.addShape(this.v), this.reset = s, this.effectsSequence = [];
      }
      function u(S) {
        this.effectsSequence.push(S), this.container.addDynamicProperty(this);
      }
      _.prototype.interpolateShape = e, _.prototype.getValue = c, _.prototype.setVValue = n, _.prototype.addEffect = u;
      function T(S, x, d) {
        this.propType = "shape", this.comp = S.comp, this.elem = S, this.container = S, this.offsetTime = S.data.st, this.keyframes = d === 3 ? x.pt.k : x.ks.k, this.keyframesMetadata = [], this.k = !0, this.kf = !0;
        var y = this.keyframes[0].s[0].i.length;
        this.v = qt.newElement(), this.v.setPathData(this.keyframes[0].s[0].c, y), this.pv = qt.clone(this.v), this.localShapeCollection = Ee.newShapeCollection(), this.paths = this.localShapeCollection, this.paths.addShape(this.v), this.lastFrame = t, this.reset = s, this._caching = {
          lastFrame: t,
          lastIndex: 0
        }, this.effectsSequence = [i.bind(this)];
      }
      T.prototype.getValue = c, T.prototype.interpolateShape = e, T.prototype.setVValue = n, T.prototype.addEffect = u;
      var E = function() {
        var S = _t;
        function x(d, y) {
          this.v = qt.newElement(), this.v.setPathData(!0, 4), this.localShapeCollection = Ee.newShapeCollection(), this.paths = this.localShapeCollection, this.localShapeCollection.addShape(this.v), this.d = y.d, this.elem = d, this.comp = d.comp, this.frameId = -1, this.initDynamicPropertyContainer(d), this.p = Q.getProp(d, y.p, 1, 0, this), this.s = Q.getProp(d, y.s, 1, 0, this), this.dynamicProperties.length ? this.k = !0 : (this.k = !1, this.convertEllToPath());
        }
        return x.prototype = {
          reset: s,
          getValue: function() {
            this.elem.globalData.frameId !== this.frameId && (this.frameId = this.elem.globalData.frameId, this.iterateDynamicProperties(), this._mdf && this.convertEllToPath());
          },
          convertEllToPath: function() {
            var y = this.p.v[0], A = this.p.v[1], L = this.s.v[0] / 2, D = this.s.v[1] / 2, j = this.d !== 3, Y = this.v;
            Y.v[0][0] = y, Y.v[0][1] = A - D, Y.v[1][0] = j ? y + L : y - L, Y.v[1][1] = A, Y.v[2][0] = y, Y.v[2][1] = A + D, Y.v[3][0] = j ? y - L : y + L, Y.v[3][1] = A, Y.i[0][0] = j ? y - L * S : y + L * S, Y.i[0][1] = A - D, Y.i[1][0] = j ? y + L : y - L, Y.i[1][1] = A - D * S, Y.i[2][0] = j ? y + L * S : y - L * S, Y.i[2][1] = A + D, Y.i[3][0] = j ? y - L : y + L, Y.i[3][1] = A + D * S, Y.o[0][0] = j ? y + L * S : y - L * S, Y.o[0][1] = A - D, Y.o[1][0] = j ? y + L : y - L, Y.o[1][1] = A + D * S, Y.o[2][0] = j ? y - L * S : y + L * S, Y.o[2][1] = A + D, Y.o[3][0] = j ? y - L : y + L, Y.o[3][1] = A - D * S;
          }
        }, U([Xt], x), x;
      }(), B = function() {
        function S(x, d) {
          this.v = qt.newElement(), this.v.setPathData(!0, 0), this.elem = x, this.comp = x.comp, this.data = d, this.frameId = -1, this.d = d.d, this.initDynamicPropertyContainer(x), d.sy === 1 ? (this.ir = Q.getProp(x, d.ir, 0, 0, this), this.is = Q.getProp(x, d.is, 0, 0.01, this), this.convertToPath = this.convertStarToPath) : this.convertToPath = this.convertPolygonToPath, this.pt = Q.getProp(x, d.pt, 0, 0, this), this.p = Q.getProp(x, d.p, 1, 0, this), this.r = Q.getProp(x, d.r, 0, At, this), this.or = Q.getProp(x, d.or, 0, 0, this), this.os = Q.getProp(x, d.os, 0, 0.01, this), this.localShapeCollection = Ee.newShapeCollection(), this.localShapeCollection.addShape(this.v), this.paths = this.localShapeCollection, this.dynamicProperties.length ? this.k = !0 : (this.k = !1, this.convertToPath());
        }
        return S.prototype = {
          reset: s,
          getValue: function() {
            this.elem.globalData.frameId !== this.frameId && (this.frameId = this.elem.globalData.frameId, this.iterateDynamicProperties(), this._mdf && this.convertToPath());
          },
          convertStarToPath: function() {
            var d = Math.floor(this.pt.v) * 2, y = Math.PI * 2 / d, A = !0, L = this.or.v, D = this.ir.v, j = this.os.v, Y = this.is.v, ct = 2 * Math.PI * L / (d * 2), ot = 2 * Math.PI * D / (d * 2), K, pt, it, G, w = -Math.PI / 2;
            w += this.r.v;
            var M = this.data.d === 3 ? -1 : 1;
            for (this.v._length = 0, K = 0; K < d; K += 1) {
              pt = A ? L : D, it = A ? j : Y, G = A ? ct : ot;
              var f = pt * Math.cos(w), p = pt * Math.sin(w), $ = f === 0 && p === 0 ? 0 : p / Math.sqrt(f * f + p * p), F = f === 0 && p === 0 ? 0 : -f / Math.sqrt(f * f + p * p);
              f += +this.p.v[0], p += +this.p.v[1], this.v.setTripleAt(f, p, f - $ * G * it * M, p - F * G * it * M, f + $ * G * it * M, p + F * G * it * M, K, !0), A = !A, w += y * M;
            }
          },
          convertPolygonToPath: function() {
            var d = Math.floor(this.pt.v), y = Math.PI * 2 / d, A = this.or.v, L = this.os.v, D = 2 * Math.PI * A / (d * 4), j, Y = -Math.PI * 0.5, ct = this.data.d === 3 ? -1 : 1;
            for (Y += this.r.v, this.v._length = 0, j = 0; j < d; j += 1) {
              var ot = A * Math.cos(Y), K = A * Math.sin(Y), pt = ot === 0 && K === 0 ? 0 : K / Math.sqrt(ot * ot + K * K), it = ot === 0 && K === 0 ? 0 : -ot / Math.sqrt(ot * ot + K * K);
              ot += +this.p.v[0], K += +this.p.v[1], this.v.setTripleAt(ot, K, ot - pt * D * L * ct, K - it * D * L * ct, ot + pt * D * L * ct, K + it * D * L * ct, j, !0), Y += y * ct;
            }
            this.paths.length = 0, this.paths[0] = this.v;
          }
        }, U([Xt], S), S;
      }(), m = function() {
        function S(x, d) {
          this.v = qt.newElement(), this.v.c = !0, this.localShapeCollection = Ee.newShapeCollection(), this.localShapeCollection.addShape(this.v), this.paths = this.localShapeCollection, this.elem = x, this.comp = x.comp, this.frameId = -1, this.d = d.d, this.initDynamicPropertyContainer(x), this.p = Q.getProp(x, d.p, 1, 0, this), this.s = Q.getProp(x, d.s, 1, 0, this), this.r = Q.getProp(x, d.r, 0, 0, this), this.dynamicProperties.length ? this.k = !0 : (this.k = !1, this.convertRectToPath());
        }
        return S.prototype = {
          convertRectToPath: function() {
            var d = this.p.v[0], y = this.p.v[1], A = this.s.v[0] / 2, L = this.s.v[1] / 2, D = Te(A, L, this.r.v), j = D * (1 - _t);
            this.v._length = 0, this.d === 2 || this.d === 1 ? (this.v.setTripleAt(d + A, y - L + D, d + A, y - L + D, d + A, y - L + j, 0, !0), this.v.setTripleAt(d + A, y + L - D, d + A, y + L - j, d + A, y + L - D, 1, !0), D !== 0 ? (this.v.setTripleAt(d + A - D, y + L, d + A - D, y + L, d + A - j, y + L, 2, !0), this.v.setTripleAt(d - A + D, y + L, d - A + j, y + L, d - A + D, y + L, 3, !0), this.v.setTripleAt(d - A, y + L - D, d - A, y + L - D, d - A, y + L - j, 4, !0), this.v.setTripleAt(d - A, y - L + D, d - A, y - L + j, d - A, y - L + D, 5, !0), this.v.setTripleAt(d - A + D, y - L, d - A + D, y - L, d - A + j, y - L, 6, !0), this.v.setTripleAt(d + A - D, y - L, d + A - j, y - L, d + A - D, y - L, 7, !0)) : (this.v.setTripleAt(d - A, y + L, d - A + j, y + L, d - A, y + L, 2), this.v.setTripleAt(d - A, y - L, d - A, y - L + j, d - A, y - L, 3))) : (this.v.setTripleAt(d + A, y - L + D, d + A, y - L + j, d + A, y - L + D, 0, !0), D !== 0 ? (this.v.setTripleAt(d + A - D, y - L, d + A - D, y - L, d + A - j, y - L, 1, !0), this.v.setTripleAt(d - A + D, y - L, d - A + j, y - L, d - A + D, y - L, 2, !0), this.v.setTripleAt(d - A, y - L + D, d - A, y - L + D, d - A, y - L + j, 3, !0), this.v.setTripleAt(d - A, y + L - D, d - A, y + L - j, d - A, y + L - D, 4, !0), this.v.setTripleAt(d - A + D, y + L, d - A + D, y + L, d - A + j, y + L, 5, !0), this.v.setTripleAt(d + A - D, y + L, d + A - j, y + L, d + A - D, y + L, 6, !0), this.v.setTripleAt(d + A, y + L - D, d + A, y + L - D, d + A, y + L - j, 7, !0)) : (this.v.setTripleAt(d - A, y - L, d - A + j, y - L, d - A, y - L, 1, !0), this.v.setTripleAt(d - A, y + L, d - A, y + L - j, d - A, y + L, 2, !0), this.v.setTripleAt(d + A, y + L, d + A - j, y + L, d + A, y + L, 3, !0)));
          },
          getValue: function() {
            this.elem.globalData.frameId !== this.frameId && (this.frameId = this.elem.globalData.frameId, this.iterateDynamicProperties(), this._mdf && this.convertRectToPath());
          },
          reset: s
        }, U([Xt], S), S;
      }();
      function C(S, x, d) {
        var y;
        if (d === 3 || d === 4) {
          var A = d === 3 ? x.pt : x.ks, L = A.k;
          L.length ? y = new T(S, x, d) : y = new _(S, x, d);
        } else d === 5 ? y = new m(S, x) : d === 6 ? y = new E(S, x) : d === 7 && (y = new B(S, x));
        return y.k && S.addDynamicProperty(y), y;
      }
      function I() {
        return _;
      }
      function P() {
        return T;
      }
      var N = {};
      return N.getShapeProp = C, N.getConstructorFunction = I, N.getKeyframedConstructorFunction = P, N;
    }();
    /*!
     Transformation Matrix v2.0
     (c) Epistemex 2014-2015
     www.epistemex.com
     By Ken Fyrstenberg
     Contributions by leeoniya.
     License: MIT, header required.
     */
    var Zt = /* @__PURE__ */ function() {
      var t = Math.cos, e = Math.sin, i = Math.tan, s = Math.round;
      function o() {
        return this.props[0] = 1, this.props[1] = 0, this.props[2] = 0, this.props[3] = 0, this.props[4] = 0, this.props[5] = 1, this.props[6] = 0, this.props[7] = 0, this.props[8] = 0, this.props[9] = 0, this.props[10] = 1, this.props[11] = 0, this.props[12] = 0, this.props[13] = 0, this.props[14] = 0, this.props[15] = 1, this;
      }
      function n(f) {
        if (f === 0)
          return this;
        var p = t(f), $ = e(f);
        return this._t(p, -$, 0, 0, $, p, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
      }
      function c(f) {
        if (f === 0)
          return this;
        var p = t(f), $ = e(f);
        return this._t(1, 0, 0, 0, 0, p, -$, 0, 0, $, p, 0, 0, 0, 0, 1);
      }
      function _(f) {
        if (f === 0)
          return this;
        var p = t(f), $ = e(f);
        return this._t(p, 0, $, 0, 0, 1, 0, 0, -$, 0, p, 0, 0, 0, 0, 1);
      }
      function u(f) {
        if (f === 0)
          return this;
        var p = t(f), $ = e(f);
        return this._t(p, -$, 0, 0, $, p, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
      }
      function T(f, p) {
        return this._t(1, p, f, 1, 0, 0);
      }
      function E(f, p) {
        return this.shear(i(f), i(p));
      }
      function B(f, p) {
        var $ = t(p), F = e(p);
        return this._t($, F, 0, 0, -F, $, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)._t(1, 0, 0, 0, i(f), 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)._t($, -F, 0, 0, F, $, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
      }
      function m(f, p, $) {
        return !$ && $ !== 0 && ($ = 1), f === 1 && p === 1 && $ === 1 ? this : this._t(f, 0, 0, 0, 0, p, 0, 0, 0, 0, $, 0, 0, 0, 0, 1);
      }
      function C(f, p, $, F, et, ht, ut, kt, xt, ie, be, Xe, we, le, Pe, Pt) {
        return this.props[0] = f, this.props[1] = p, this.props[2] = $, this.props[3] = F, this.props[4] = et, this.props[5] = ht, this.props[6] = ut, this.props[7] = kt, this.props[8] = xt, this.props[9] = ie, this.props[10] = be, this.props[11] = Xe, this.props[12] = we, this.props[13] = le, this.props[14] = Pe, this.props[15] = Pt, this;
      }
      function I(f, p, $) {
        return $ = $ || 0, f !== 0 || p !== 0 || $ !== 0 ? this._t(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, f, p, $, 1) : this;
      }
      function P(f, p, $, F, et, ht, ut, kt, xt, ie, be, Xe, we, le, Pe, Pt) {
        var nt = this.props;
        if (f === 1 && p === 0 && $ === 0 && F === 0 && et === 0 && ht === 1 && ut === 0 && kt === 0 && xt === 0 && ie === 0 && be === 1 && Xe === 0)
          return nt[12] = nt[12] * f + nt[15] * we, nt[13] = nt[13] * ht + nt[15] * le, nt[14] = nt[14] * be + nt[15] * Pe, nt[15] *= Pt, this._identityCalculated = !1, this;
        var li = nt[0], Ci = nt[1], hi = nt[2], Ze = nt[3], fi = nt[4], ci = nt[5], ke = nt[6], Pi = nt[7], Mi = nt[8], Ve = nt[9], Ii = nt[10], $e = nt[11], qi = nt[12], cs = nt[13], us = nt[14], ps = nt[15];
        return nt[0] = li * f + Ci * et + hi * xt + Ze * we, nt[1] = li * p + Ci * ht + hi * ie + Ze * le, nt[2] = li * $ + Ci * ut + hi * be + Ze * Pe, nt[3] = li * F + Ci * kt + hi * Xe + Ze * Pt, nt[4] = fi * f + ci * et + ke * xt + Pi * we, nt[5] = fi * p + ci * ht + ke * ie + Pi * le, nt[6] = fi * $ + ci * ut + ke * be + Pi * Pe, nt[7] = fi * F + ci * kt + ke * Xe + Pi * Pt, nt[8] = Mi * f + Ve * et + Ii * xt + $e * we, nt[9] = Mi * p + Ve * ht + Ii * ie + $e * le, nt[10] = Mi * $ + Ve * ut + Ii * be + $e * Pe, nt[11] = Mi * F + Ve * kt + Ii * Xe + $e * Pt, nt[12] = qi * f + cs * et + us * xt + ps * we, nt[13] = qi * p + cs * ht + us * ie + ps * le, nt[14] = qi * $ + cs * ut + us * be + ps * Pe, nt[15] = qi * F + cs * kt + us * Xe + ps * Pt, this._identityCalculated = !1, this;
      }
      function N(f) {
        var p = f.props;
        return this.transform(p[0], p[1], p[2], p[3], p[4], p[5], p[6], p[7], p[8], p[9], p[10], p[11], p[12], p[13], p[14], p[15]);
      }
      function S() {
        return this._identityCalculated || (this._identity = !(this.props[0] !== 1 || this.props[1] !== 0 || this.props[2] !== 0 || this.props[3] !== 0 || this.props[4] !== 0 || this.props[5] !== 1 || this.props[6] !== 0 || this.props[7] !== 0 || this.props[8] !== 0 || this.props[9] !== 0 || this.props[10] !== 1 || this.props[11] !== 0 || this.props[12] !== 0 || this.props[13] !== 0 || this.props[14] !== 0 || this.props[15] !== 1), this._identityCalculated = !0), this._identity;
      }
      function x(f) {
        for (var p = 0; p < 16; ) {
          if (f.props[p] !== this.props[p])
            return !1;
          p += 1;
        }
        return !0;
      }
      function d(f) {
        var p;
        for (p = 0; p < 16; p += 1)
          f.props[p] = this.props[p];
        return f;
      }
      function y(f) {
        var p;
        for (p = 0; p < 16; p += 1)
          this.props[p] = f[p];
      }
      function A(f, p, $) {
        return {
          x: f * this.props[0] + p * this.props[4] + $ * this.props[8] + this.props[12],
          y: f * this.props[1] + p * this.props[5] + $ * this.props[9] + this.props[13],
          z: f * this.props[2] + p * this.props[6] + $ * this.props[10] + this.props[14]
        };
      }
      function L(f, p, $) {
        return f * this.props[0] + p * this.props[4] + $ * this.props[8] + this.props[12];
      }
      function D(f, p, $) {
        return f * this.props[1] + p * this.props[5] + $ * this.props[9] + this.props[13];
      }
      function j(f, p, $) {
        return f * this.props[2] + p * this.props[6] + $ * this.props[10] + this.props[14];
      }
      function Y() {
        var f = this.props[0] * this.props[5] - this.props[1] * this.props[4], p = this.props[5] / f, $ = -this.props[1] / f, F = -this.props[4] / f, et = this.props[0] / f, ht = (this.props[4] * this.props[13] - this.props[5] * this.props[12]) / f, ut = -(this.props[0] * this.props[13] - this.props[1] * this.props[12]) / f, kt = new Zt();
        return kt.props[0] = p, kt.props[1] = $, kt.props[4] = F, kt.props[5] = et, kt.props[12] = ht, kt.props[13] = ut, kt;
      }
      function ct(f) {
        var p = this.getInverseMatrix();
        return p.applyToPointArray(f[0], f[1], f[2] || 0);
      }
      function ot(f) {
        var p, $ = f.length, F = [];
        for (p = 0; p < $; p += 1)
          F[p] = ct(f[p]);
        return F;
      }
      function K(f, p, $) {
        var F = tt("float32", 6);
        if (this.isIdentity())
          F[0] = f[0], F[1] = f[1], F[2] = p[0], F[3] = p[1], F[4] = $[0], F[5] = $[1];
        else {
          var et = this.props[0], ht = this.props[1], ut = this.props[4], kt = this.props[5], xt = this.props[12], ie = this.props[13];
          F[0] = f[0] * et + f[1] * ut + xt, F[1] = f[0] * ht + f[1] * kt + ie, F[2] = p[0] * et + p[1] * ut + xt, F[3] = p[0] * ht + p[1] * kt + ie, F[4] = $[0] * et + $[1] * ut + xt, F[5] = $[0] * ht + $[1] * kt + ie;
        }
        return F;
      }
      function pt(f, p, $) {
        var F;
        return this.isIdentity() ? F = [f, p, $] : F = [f * this.props[0] + p * this.props[4] + $ * this.props[8] + this.props[12], f * this.props[1] + p * this.props[5] + $ * this.props[9] + this.props[13], f * this.props[2] + p * this.props[6] + $ * this.props[10] + this.props[14]], F;
      }
      function it(f, p) {
        if (this.isIdentity())
          return f + "," + p;
        var $ = this.props;
        return Math.round((f * $[0] + p * $[4] + $[12]) * 100) / 100 + "," + Math.round((f * $[1] + p * $[5] + $[13]) * 100) / 100;
      }
      function G() {
        for (var f = 0, p = this.props, $ = "matrix3d(", F = 1e4; f < 16; )
          $ += s(p[f] * F) / F, $ += f === 15 ? ")" : ",", f += 1;
        return $;
      }
      function w(f) {
        var p = 1e4;
        return f < 1e-6 && f > 0 || f > -1e-6 && f < 0 ? s(f * p) / p : f;
      }
      function M() {
        var f = this.props, p = w(f[0]), $ = w(f[1]), F = w(f[4]), et = w(f[5]), ht = w(f[12]), ut = w(f[13]);
        return "matrix(" + p + "," + $ + "," + F + "," + et + "," + ht + "," + ut + ")";
      }
      return function() {
        this.reset = o, this.rotate = n, this.rotateX = c, this.rotateY = _, this.rotateZ = u, this.skew = E, this.skewFromAxis = B, this.shear = T, this.scale = m, this.setTransform = C, this.translate = I, this.transform = P, this.multiply = N, this.applyToPoint = A, this.applyToX = L, this.applyToY = D, this.applyToZ = j, this.applyToPointArray = pt, this.applyToTriplePoints = K, this.applyToPointStringified = it, this.toCSS = G, this.to2dCSS = M, this.clone = d, this.cloneFromProps = y, this.equals = x, this.inversePoints = ot, this.inversePoint = ct, this.getInverseMatrix = Y, this._t = this.transform, this.isIdentity = S, this._identity = !0, this._identityCalculated = !1, this.props = tt("float32", 16), this.reset();
      };
    }();
    function Er(t) {
      "@babel/helpers - typeof";
      return Er = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
        return typeof e;
      } : function(e) {
        return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
      }, Er(t);
    }
    var wt = {};
    function Cr(t) {
      V(t);
    }
    function Pr() {
      Ht.searchAnimations();
    }
    function Mr(t) {
      Os(t);
    }
    function Ds(t) {
      zs(t);
    }
    function Di(t) {
      return Ht.loadAnimation(t);
    }
    function Bs(t) {
      if (typeof t == "string")
        switch (t) {
          case "high":
            ir(200);
            break;
          default:
          case "medium":
            ir(50);
            break;
          case "low":
            ir(10);
            break;
        }
      else !isNaN(t) && t > 1 && ir(t);
    }
    function Vs() {
      return typeof navigator < "u";
    }
    function $t(t, e) {
      t === "expressions" && Ns(e);
    }
    function bi(t) {
      switch (t) {
        case "propertyFactory":
          return Q;
        case "shapePropertyFactory":
          return _i;
        case "matrix":
          return Zt;
        default:
          return null;
      }
    }
    wt.play = Ht.play, wt.pause = Ht.pause, wt.setLocationHref = Cr, wt.togglePause = Ht.togglePause, wt.setSpeed = Ht.setSpeed, wt.setDirection = Ht.setDirection, wt.stop = Ht.stop, wt.searchAnimations = Pr, wt.registerAnimation = Ht.registerAnimation, wt.loadAnimation = Di, wt.setSubframeRendering = Mr, wt.resize = Ht.resize, wt.goToAndStop = Ht.goToAndStop, wt.destroy = Ht.destroy, wt.setQuality = Bs, wt.inBrowser = Vs, wt.installPlugin = $t, wt.freeze = Ht.freeze, wt.unfreeze = Ht.unfreeze, wt.setVolume = Ht.setVolume, wt.mute = Ht.mute, wt.unmute = Ht.unmute, wt.getRegisteredAnimations = Ht.getRegisteredAnimations, wt.useWebWorker = b, wt.setIDPrefix = Ds, wt.__getFactory = bi, wt.version = "5.13.0";
    function $s() {
      document.readyState === "complete" && (clearInterval(js), Pr());
    }
    function ss(t) {
      for (var e = lr.split("&"), i = 0; i < e.length; i += 1) {
        var s = e[i].split("=");
        if (decodeURIComponent(s[0]) == t)
          return decodeURIComponent(s[1]);
      }
      return null;
    }
    var lr = "";
    {
      var Ir = document.getElementsByTagName("script"), ns = Ir.length - 1, os = Ir[ns] || {
        src: ""
      };
      lr = os.src ? os.src.replace(/^[^\?]+\??/, "") : "", ss("renderer");
    }
    var js = setInterval($s, 100);
    try {
      Er(r) !== "object" && (window.bodymovin = wt);
    } catch {
    }
    var qe = function() {
      var t = {}, e = {};
      t.registerModifier = i, t.getModifier = s;
      function i(o, n) {
        e[o] || (e[o] = n);
      }
      function s(o, n, c) {
        return new e[o](n, c);
      }
      return t;
    }();
    function ye() {
    }
    ye.prototype.initModifierProperties = function() {
    }, ye.prototype.addShapeToModifier = function() {
    }, ye.prototype.addShape = function(t) {
      if (!this.closed) {
        t.sh.container.addDynamicProperty(t.sh);
        var e = {
          shape: t.sh,
          data: t,
          localShapeCollection: Ee.newShapeCollection()
        };
        this.shapes.push(e), this.addShapeToModifier(e), this._isAnimated && t.setAsAnimated();
      }
    }, ye.prototype.init = function(t, e) {
      this.shapes = [], this.elem = t, this.initDynamicPropertyContainer(t), this.initModifierProperties(t, e), this.frameId = v, this.closed = !1, this.k = !1, this.dynamicProperties.length ? this.k = !0 : this.getValue(!0);
    }, ye.prototype.processKeys = function() {
      this.elem.globalData.frameId !== this.frameId && (this.frameId = this.elem.globalData.frameId, this.iterateDynamicProperties());
    }, U([Xt], ye);
    function Kt() {
    }
    U([ye], Kt), Kt.prototype.initModifierProperties = function(t, e) {
      this.s = Q.getProp(t, e.s, 0, 0.01, this), this.e = Q.getProp(t, e.e, 0, 0.01, this), this.o = Q.getProp(t, e.o, 0, 0, this), this.sValue = 0, this.eValue = 0, this.getValue = this.processKeys, this.m = e.m, this._isAnimated = !!this.s.effectsSequence.length || !!this.e.effectsSequence.length || !!this.o.effectsSequence.length;
    }, Kt.prototype.addShapeToModifier = function(t) {
      t.pathsData = [];
    }, Kt.prototype.calculateShapeEdges = function(t, e, i, s, o) {
      var n = [];
      e <= 1 ? n.push({
        s: t,
        e
      }) : t >= 1 ? n.push({
        s: t - 1,
        e: e - 1
      }) : (n.push({
        s: t,
        e: 1
      }), n.push({
        s: 0,
        e: e - 1
      }));
      var c = [], _, u = n.length, T;
      for (_ = 0; _ < u; _ += 1)
        if (T = n[_], !(T.e * o < s || T.s * o > s + i)) {
          var E, B;
          T.s * o <= s ? E = 0 : E = (T.s * o - s) / i, T.e * o >= s + i ? B = 1 : B = (T.e * o - s) / i, c.push([E, B]);
        }
      return c.length || c.push([0, 0]), c;
    }, Kt.prototype.releasePathsData = function(t) {
      var e, i = t.length;
      for (e = 0; e < i; e += 1)
        He.release(t[e]);
      return t.length = 0, t;
    }, Kt.prototype.processShapes = function(t) {
      var e, i;
      if (this._mdf || t) {
        var s = this.o.v % 360 / 360;
        if (s < 0 && (s += 1), this.s.v > 1 ? e = 1 + s : this.s.v < 0 ? e = 0 + s : e = this.s.v + s, this.e.v > 1 ? i = 1 + s : this.e.v < 0 ? i = 0 + s : i = this.e.v + s, e > i) {
          var o = e;
          e = i, i = o;
        }
        e = Math.round(e * 1e4) * 1e-4, i = Math.round(i * 1e4) * 1e-4, this.sValue = e, this.eValue = i;
      } else
        e = this.sValue, i = this.eValue;
      var n, c, _ = this.shapes.length, u, T, E, B, m, C = 0;
      if (i === e)
        for (c = 0; c < _; c += 1)
          this.shapes[c].localShapeCollection.releaseShapes(), this.shapes[c].shape._mdf = !0, this.shapes[c].shape.paths = this.shapes[c].localShapeCollection, this._mdf && (this.shapes[c].pathsData.length = 0);
      else if (i === 1 && e === 0 || i === 0 && e === 1) {
        if (this._mdf)
          for (c = 0; c < _; c += 1)
            this.shapes[c].pathsData.length = 0, this.shapes[c].shape._mdf = !0;
      } else {
        var I = [], P, N;
        for (c = 0; c < _; c += 1)
          if (P = this.shapes[c], !P.shape._mdf && !this._mdf && !t && this.m !== 2)
            P.shape.paths = P.localShapeCollection;
          else {
            if (n = P.shape.paths, T = n._length, m = 0, !P.shape._mdf && P.pathsData.length)
              m = P.totalShapeLength;
            else {
              for (E = this.releasePathsData(P.pathsData), u = 0; u < T; u += 1)
                B = pe.getSegmentsLength(n.shapes[u]), E.push(B), m += B.totalLength;
              P.totalShapeLength = m, P.pathsData = E;
            }
            C += m, P.shape._mdf = !0;
          }
        var S = e, x = i, d = 0, y;
        for (c = _ - 1; c >= 0; c -= 1)
          if (P = this.shapes[c], P.shape._mdf) {
            for (N = P.localShapeCollection, N.releaseShapes(), this.m === 2 && _ > 1 ? (y = this.calculateShapeEdges(e, i, P.totalShapeLength, d, C), d += P.totalShapeLength) : y = [[S, x]], T = y.length, u = 0; u < T; u += 1) {
              S = y[u][0], x = y[u][1], I.length = 0, x <= 1 ? I.push({
                s: P.totalShapeLength * S,
                e: P.totalShapeLength * x
              }) : S >= 1 ? I.push({
                s: P.totalShapeLength * (S - 1),
                e: P.totalShapeLength * (x - 1)
              }) : (I.push({
                s: P.totalShapeLength * S,
                e: P.totalShapeLength
              }), I.push({
                s: 0,
                e: P.totalShapeLength * (x - 1)
              }));
              var A = this.addShapes(P, I[0]);
              if (I[0].s !== I[0].e) {
                if (I.length > 1) {
                  var L = P.shape.paths.shapes[P.shape.paths._length - 1];
                  if (L.c) {
                    var D = A.pop();
                    this.addPaths(A, N), A = this.addShapes(P, I[1], D);
                  } else
                    this.addPaths(A, N), A = this.addShapes(P, I[1]);
                }
                this.addPaths(A, N);
              }
            }
            P.shape.paths = N;
          }
      }
    }, Kt.prototype.addPaths = function(t, e) {
      var i, s = t.length;
      for (i = 0; i < s; i += 1)
        e.addShape(t[i]);
    }, Kt.prototype.addSegment = function(t, e, i, s, o, n, c) {
      o.setXYAt(e[0], e[1], "o", n), o.setXYAt(i[0], i[1], "i", n + 1), c && o.setXYAt(t[0], t[1], "v", n), o.setXYAt(s[0], s[1], "v", n + 1);
    }, Kt.prototype.addSegmentFromArray = function(t, e, i, s) {
      e.setXYAt(t[1], t[5], "o", i), e.setXYAt(t[2], t[6], "i", i + 1), s && e.setXYAt(t[0], t[4], "v", i), e.setXYAt(t[3], t[7], "v", i + 1);
    }, Kt.prototype.addShapes = function(t, e, i) {
      var s = t.pathsData, o = t.shape.paths.shapes, n, c = t.shape.paths._length, _, u, T = 0, E, B, m, C, I = [], P, N = !0;
      for (i ? (B = i._length, P = i._length) : (i = qt.newElement(), B = 0, P = 0), I.push(i), n = 0; n < c; n += 1) {
        for (m = s[n].lengths, i.c = o[n].c, u = o[n].c ? m.length : m.length + 1, _ = 1; _ < u; _ += 1)
          if (E = m[_ - 1], T + E.addedLength < e.s)
            T += E.addedLength, i.c = !1;
          else if (T > e.e) {
            i.c = !1;
            break;
          } else
            e.s <= T && e.e >= T + E.addedLength ? (this.addSegment(o[n].v[_ - 1], o[n].o[_ - 1], o[n].i[_], o[n].v[_], i, B, N), N = !1) : (C = pe.getNewSegment(o[n].v[_ - 1], o[n].v[_], o[n].o[_ - 1], o[n].i[_], (e.s - T) / E.addedLength, (e.e - T) / E.addedLength, m[_ - 1]), this.addSegmentFromArray(C, i, B, N), N = !1, i.c = !1), T += E.addedLength, B += 1;
        if (o[n].c && m.length) {
          if (E = m[_ - 1], T <= e.e) {
            var S = m[_ - 1].addedLength;
            e.s <= T && e.e >= T + S ? (this.addSegment(o[n].v[_ - 1], o[n].o[_ - 1], o[n].i[0], o[n].v[0], i, B, N), N = !1) : (C = pe.getNewSegment(o[n].v[_ - 1], o[n].v[0], o[n].o[_ - 1], o[n].i[0], (e.s - T) / S, (e.e - T) / S, m[_ - 1]), this.addSegmentFromArray(C, i, B, N), N = !1, i.c = !1);
          } else
            i.c = !1;
          T += E.addedLength, B += 1;
        }
        if (i._length && (i.setXYAt(i.v[P][0], i.v[P][1], "i", P), i.setXYAt(i.v[i._length - 1][0], i.v[i._length - 1][1], "o", i._length - 1)), T > e.e)
          break;
        n < c - 1 && (i = qt.newElement(), N = !0, I.push(i), B = 0);
      }
      return I;
    };
    function wi() {
    }
    U([ye], wi), wi.prototype.initModifierProperties = function(t, e) {
      this.getValue = this.processKeys, this.amount = Q.getProp(t, e.a, 0, null, this), this._isAnimated = !!this.amount.effectsSequence.length;
    }, wi.prototype.processPath = function(t, e) {
      var i = e / 100, s = [0, 0], o = t._length, n = 0;
      for (n = 0; n < o; n += 1)
        s[0] += t.v[n][0], s[1] += t.v[n][1];
      s[0] /= o, s[1] /= o;
      var c = qt.newElement();
      c.c = t.c;
      var _, u, T, E, B, m;
      for (n = 0; n < o; n += 1)
        _ = t.v[n][0] + (s[0] - t.v[n][0]) * i, u = t.v[n][1] + (s[1] - t.v[n][1]) * i, T = t.o[n][0] + (s[0] - t.o[n][0]) * -i, E = t.o[n][1] + (s[1] - t.o[n][1]) * -i, B = t.i[n][0] + (s[0] - t.i[n][0]) * -i, m = t.i[n][1] + (s[1] - t.i[n][1]) * -i, c.setTripleAt(_, u, T, E, B, m, n);
      return c;
    }, wi.prototype.processShapes = function(t) {
      var e, i, s = this.shapes.length, o, n, c = this.amount.v;
      if (c !== 0) {
        var _, u;
        for (i = 0; i < s; i += 1) {
          if (_ = this.shapes[i], u = _.localShapeCollection, !(!_.shape._mdf && !this._mdf && !t))
            for (u.releaseShapes(), _.shape._mdf = !0, e = _.shape.paths.shapes, n = _.shape.paths._length, o = 0; o < n; o += 1)
              u.addShape(this.processPath(e[o], c));
          _.shape.paths = _.localShapeCollection;
        }
      }
      this.dynamicProperties.length || (this._mdf = !1);
    };
    var ki = function() {
      var t = [0, 0];
      function e(u) {
        var T = this._mdf;
        this.iterateDynamicProperties(), this._mdf = this._mdf || T, this.a && u.translate(-this.a.v[0], -this.a.v[1], this.a.v[2]), this.s && u.scale(this.s.v[0], this.s.v[1], this.s.v[2]), this.sk && u.skewFromAxis(-this.sk.v, this.sa.v), this.r ? u.rotate(-this.r.v) : u.rotateZ(-this.rz.v).rotateY(this.ry.v).rotateX(this.rx.v).rotateZ(-this.or.v[2]).rotateY(this.or.v[1]).rotateX(this.or.v[0]), this.data.p.s ? this.data.p.z ? u.translate(this.px.v, this.py.v, -this.pz.v) : u.translate(this.px.v, this.py.v, 0) : u.translate(this.p.v[0], this.p.v[1], -this.p.v[2]);
      }
      function i(u) {
        if (this.elem.globalData.frameId !== this.frameId) {
          if (this._isDirty && (this.precalculateMatrix(), this._isDirty = !1), this.iterateDynamicProperties(), this._mdf || u) {
            var T;
            if (this.v.cloneFromProps(this.pre.props), this.appliedTransformations < 1 && this.v.translate(-this.a.v[0], -this.a.v[1], this.a.v[2]), this.appliedTransformations < 2 && this.v.scale(this.s.v[0], this.s.v[1], this.s.v[2]), this.sk && this.appliedTransformations < 3 && this.v.skewFromAxis(-this.sk.v, this.sa.v), this.r && this.appliedTransformations < 4 ? this.v.rotate(-this.r.v) : !this.r && this.appliedTransformations < 4 && this.v.rotateZ(-this.rz.v).rotateY(this.ry.v).rotateX(this.rx.v).rotateZ(-this.or.v[2]).rotateY(this.or.v[1]).rotateX(this.or.v[0]), this.autoOriented) {
              var E, B;
              if (T = this.elem.globalData.frameRate, this.p && this.p.keyframes && this.p.getValueAtTime)
                this.p._caching.lastFrame + this.p.offsetTime <= this.p.keyframes[0].t ? (E = this.p.getValueAtTime((this.p.keyframes[0].t + 0.01) / T, 0), B = this.p.getValueAtTime(this.p.keyframes[0].t / T, 0)) : this.p._caching.lastFrame + this.p.offsetTime >= this.p.keyframes[this.p.keyframes.length - 1].t ? (E = this.p.getValueAtTime(this.p.keyframes[this.p.keyframes.length - 1].t / T, 0), B = this.p.getValueAtTime((this.p.keyframes[this.p.keyframes.length - 1].t - 0.05) / T, 0)) : (E = this.p.pv, B = this.p.getValueAtTime((this.p._caching.lastFrame + this.p.offsetTime - 0.01) / T, this.p.offsetTime));
              else if (this.px && this.px.keyframes && this.py.keyframes && this.px.getValueAtTime && this.py.getValueAtTime) {
                E = [], B = [];
                var m = this.px, C = this.py;
                m._caching.lastFrame + m.offsetTime <= m.keyframes[0].t ? (E[0] = m.getValueAtTime((m.keyframes[0].t + 0.01) / T, 0), E[1] = C.getValueAtTime((C.keyframes[0].t + 0.01) / T, 0), B[0] = m.getValueAtTime(m.keyframes[0].t / T, 0), B[1] = C.getValueAtTime(C.keyframes[0].t / T, 0)) : m._caching.lastFrame + m.offsetTime >= m.keyframes[m.keyframes.length - 1].t ? (E[0] = m.getValueAtTime(m.keyframes[m.keyframes.length - 1].t / T, 0), E[1] = C.getValueAtTime(C.keyframes[C.keyframes.length - 1].t / T, 0), B[0] = m.getValueAtTime((m.keyframes[m.keyframes.length - 1].t - 0.01) / T, 0), B[1] = C.getValueAtTime((C.keyframes[C.keyframes.length - 1].t - 0.01) / T, 0)) : (E = [m.pv, C.pv], B[0] = m.getValueAtTime((m._caching.lastFrame + m.offsetTime - 0.01) / T, m.offsetTime), B[1] = C.getValueAtTime((C._caching.lastFrame + C.offsetTime - 0.01) / T, C.offsetTime));
              } else
                B = t, E = B;
              this.v.rotate(-Math.atan2(E[1] - B[1], E[0] - B[0]));
            }
            this.data.p && this.data.p.s ? this.data.p.z ? this.v.translate(this.px.v, this.py.v, -this.pz.v) : this.v.translate(this.px.v, this.py.v, 0) : this.v.translate(this.p.v[0], this.p.v[1], -this.p.v[2]);
          }
          this.frameId = this.elem.globalData.frameId;
        }
      }
      function s() {
        if (this.appliedTransformations = 0, this.pre.reset(), !this.a.effectsSequence.length)
          this.pre.translate(-this.a.v[0], -this.a.v[1], this.a.v[2]), this.appliedTransformations = 1;
        else
          return;
        if (!this.s.effectsSequence.length)
          this.pre.scale(this.s.v[0], this.s.v[1], this.s.v[2]), this.appliedTransformations = 2;
        else
          return;
        if (this.sk)
          if (!this.sk.effectsSequence.length && !this.sa.effectsSequence.length)
            this.pre.skewFromAxis(-this.sk.v, this.sa.v), this.appliedTransformations = 3;
          else
            return;
        this.r ? this.r.effectsSequence.length || (this.pre.rotate(-this.r.v), this.appliedTransformations = 4) : !this.rz.effectsSequence.length && !this.ry.effectsSequence.length && !this.rx.effectsSequence.length && !this.or.effectsSequence.length && (this.pre.rotateZ(-this.rz.v).rotateY(this.ry.v).rotateX(this.rx.v).rotateZ(-this.or.v[2]).rotateY(this.or.v[1]).rotateX(this.or.v[0]), this.appliedTransformations = 4);
      }
      function o() {
      }
      function n(u) {
        this._addDynamicProperty(u), this.elem.addDynamicProperty(u), this._isDirty = !0;
      }
      function c(u, T, E) {
        if (this.elem = u, this.frameId = -1, this.propType = "transform", this.data = T, this.v = new Zt(), this.pre = new Zt(), this.appliedTransformations = 0, this.initDynamicPropertyContainer(E || u), T.p && T.p.s ? (this.px = Q.getProp(u, T.p.x, 0, 0, this), this.py = Q.getProp(u, T.p.y, 0, 0, this), T.p.z && (this.pz = Q.getProp(u, T.p.z, 0, 0, this))) : this.p = Q.getProp(u, T.p || {
          k: [0, 0, 0]
        }, 1, 0, this), T.rx) {
          if (this.rx = Q.getProp(u, T.rx, 0, At, this), this.ry = Q.getProp(u, T.ry, 0, At, this), this.rz = Q.getProp(u, T.rz, 0, At, this), T.or.k[0].ti) {
            var B, m = T.or.k.length;
            for (B = 0; B < m; B += 1)
              T.or.k[B].to = null, T.or.k[B].ti = null;
          }
          this.or = Q.getProp(u, T.or, 1, At, this), this.or.sh = !0;
        } else
          this.r = Q.getProp(u, T.r || {
            k: 0
          }, 0, At, this);
        T.sk && (this.sk = Q.getProp(u, T.sk, 0, At, this), this.sa = Q.getProp(u, T.sa, 0, At, this)), this.a = Q.getProp(u, T.a || {
          k: [0, 0, 0]
        }, 1, 0, this), this.s = Q.getProp(u, T.s || {
          k: [100, 100, 100]
        }, 1, 0.01, this), T.o ? this.o = Q.getProp(u, T.o, 0, 0.01, u) : this.o = {
          _mdf: !1,
          v: 1
        }, this._isDirty = !0, this.dynamicProperties.length || this.getValue(!0);
      }
      c.prototype = {
        applyToMatrix: e,
        getValue: i,
        precalculateMatrix: s,
        autoOrient: o
      }, U([Xt], c), c.prototype.addDynamicProperty = n, c.prototype._addDynamicProperty = Xt.prototype.addDynamicProperty;
      function _(u, T, E) {
        return new c(u, T, E);
      }
      return {
        getTransformProperty: _
      };
    }();
    function se() {
    }
    U([ye], se), se.prototype.initModifierProperties = function(t, e) {
      this.getValue = this.processKeys, this.c = Q.getProp(t, e.c, 0, null, this), this.o = Q.getProp(t, e.o, 0, null, this), this.tr = ki.getTransformProperty(t, e.tr, this), this.so = Q.getProp(t, e.tr.so, 0, 0.01, this), this.eo = Q.getProp(t, e.tr.eo, 0, 0.01, this), this.data = e, this.dynamicProperties.length || this.getValue(!0), this._isAnimated = !!this.dynamicProperties.length, this.pMatrix = new Zt(), this.rMatrix = new Zt(), this.sMatrix = new Zt(), this.tMatrix = new Zt(), this.matrix = new Zt();
    }, se.prototype.applyTransforms = function(t, e, i, s, o, n) {
      var c = n ? -1 : 1, _ = s.s.v[0] + (1 - s.s.v[0]) * (1 - o), u = s.s.v[1] + (1 - s.s.v[1]) * (1 - o);
      t.translate(s.p.v[0] * c * o, s.p.v[1] * c * o, s.p.v[2]), e.translate(-s.a.v[0], -s.a.v[1], s.a.v[2]), e.rotate(-s.r.v * c * o), e.translate(s.a.v[0], s.a.v[1], s.a.v[2]), i.translate(-s.a.v[0], -s.a.v[1], s.a.v[2]), i.scale(n ? 1 / _ : _, n ? 1 / u : u), i.translate(s.a.v[0], s.a.v[1], s.a.v[2]);
    }, se.prototype.init = function(t, e, i, s) {
      for (this.elem = t, this.arr = e, this.pos = i, this.elemsData = s, this._currentCopies = 0, this._elements = [], this._groups = [], this.frameId = -1, this.initDynamicPropertyContainer(t), this.initModifierProperties(t, e[i]); i > 0; )
        i -= 1, this._elements.unshift(e[i]);
      this.dynamicProperties.length ? this.k = !0 : this.getValue(!0);
    }, se.prototype.resetElements = function(t) {
      var e, i = t.length;
      for (e = 0; e < i; e += 1)
        t[e]._processed = !1, t[e].ty === "gr" && this.resetElements(t[e].it);
    }, se.prototype.cloneElements = function(t) {
      var e = JSON.parse(JSON.stringify(t));
      return this.resetElements(e), e;
    }, se.prototype.changeGroupRender = function(t, e) {
      var i, s = t.length;
      for (i = 0; i < s; i += 1)
        t[i]._render = e, t[i].ty === "gr" && this.changeGroupRender(t[i].it, e);
    }, se.prototype.processShapes = function(t) {
      var e, i, s, o, n, c = !1;
      if (this._mdf || t) {
        var _ = Math.ceil(this.c.v);
        if (this._groups.length < _) {
          for (; this._groups.length < _; ) {
            var u = {
              it: this.cloneElements(this._elements),
              ty: "gr"
            };
            u.it.push({
              a: {
                a: 0,
                ix: 1,
                k: [0, 0]
              },
              nm: "Transform",
              o: {
                a: 0,
                ix: 7,
                k: 100
              },
              p: {
                a: 0,
                ix: 2,
                k: [0, 0]
              },
              r: {
                a: 1,
                ix: 6,
                k: [{
                  s: 0,
                  e: 0,
                  t: 0
                }, {
                  s: 0,
                  e: 0,
                  t: 1
                }]
              },
              s: {
                a: 0,
                ix: 3,
                k: [100, 100]
              },
              sa: {
                a: 0,
                ix: 5,
                k: 0
              },
              sk: {
                a: 0,
                ix: 4,
                k: 0
              },
              ty: "tr"
            }), this.arr.splice(0, 0, u), this._groups.splice(0, 0, u), this._currentCopies += 1;
          }
          this.elem.reloadShapes(), c = !0;
        }
        n = 0;
        var T;
        for (s = 0; s <= this._groups.length - 1; s += 1) {
          if (T = n < _, this._groups[s]._render = T, this.changeGroupRender(this._groups[s].it, T), !T) {
            var E = this.elemsData[s].it, B = E[E.length - 1];
            B.transform.op.v !== 0 ? (B.transform.op._mdf = !0, B.transform.op.v = 0) : B.transform.op._mdf = !1;
          }
          n += 1;
        }
        this._currentCopies = _;
        var m = this.o.v, C = m % 1, I = m > 0 ? Math.floor(m) : Math.ceil(m), P = this.pMatrix.props, N = this.rMatrix.props, S = this.sMatrix.props;
        this.pMatrix.reset(), this.rMatrix.reset(), this.sMatrix.reset(), this.tMatrix.reset(), this.matrix.reset();
        var x = 0;
        if (m > 0) {
          for (; x < I; )
            this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, 1, !1), x += 1;
          C && (this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, C, !1), x += C);
        } else if (m < 0) {
          for (; x > I; )
            this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, 1, !0), x -= 1;
          C && (this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, -C, !0), x -= C);
        }
        s = this.data.m === 1 ? 0 : this._currentCopies - 1, o = this.data.m === 1 ? 1 : -1, n = this._currentCopies;
        for (var d, y; n; ) {
          if (e = this.elemsData[s].it, i = e[e.length - 1].transform.mProps.v.props, y = i.length, e[e.length - 1].transform.mProps._mdf = !0, e[e.length - 1].transform.op._mdf = !0, e[e.length - 1].transform.op.v = this._currentCopies === 1 ? this.so.v : this.so.v + (this.eo.v - this.so.v) * (s / (this._currentCopies - 1)), x !== 0) {
            for ((s !== 0 && o === 1 || s !== this._currentCopies - 1 && o === -1) && this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, 1, !1), this.matrix.transform(N[0], N[1], N[2], N[3], N[4], N[5], N[6], N[7], N[8], N[9], N[10], N[11], N[12], N[13], N[14], N[15]), this.matrix.transform(S[0], S[1], S[2], S[3], S[4], S[5], S[6], S[7], S[8], S[9], S[10], S[11], S[12], S[13], S[14], S[15]), this.matrix.transform(P[0], P[1], P[2], P[3], P[4], P[5], P[6], P[7], P[8], P[9], P[10], P[11], P[12], P[13], P[14], P[15]), d = 0; d < y; d += 1)
              i[d] = this.matrix.props[d];
            this.matrix.reset();
          } else
            for (this.matrix.reset(), d = 0; d < y; d += 1)
              i[d] = this.matrix.props[d];
          x += 1, n -= 1, s += o;
        }
      } else
        for (n = this._currentCopies, s = 0, o = 1; n; )
          e = this.elemsData[s].it, i = e[e.length - 1].transform.mProps.v.props, e[e.length - 1].transform.mProps._mdf = !1, e[e.length - 1].transform.op._mdf = !1, n -= 1, s += o;
      return c;
    }, se.prototype.addShape = function() {
    };
    function Bi() {
    }
    U([ye], Bi), Bi.prototype.initModifierProperties = function(t, e) {
      this.getValue = this.processKeys, this.rd = Q.getProp(t, e.r, 0, null, this), this._isAnimated = !!this.rd.effectsSequence.length;
    }, Bi.prototype.processPath = function(t, e) {
      var i = qt.newElement();
      i.c = t.c;
      var s, o = t._length, n, c, _, u, T, E, B = 0, m, C, I, P, N, S;
      for (s = 0; s < o; s += 1)
        n = t.v[s], _ = t.o[s], c = t.i[s], n[0] === _[0] && n[1] === _[1] && n[0] === c[0] && n[1] === c[1] ? (s === 0 || s === o - 1) && !t.c ? (i.setTripleAt(n[0], n[1], _[0], _[1], c[0], c[1], B), B += 1) : (s === 0 ? u = t.v[o - 1] : u = t.v[s - 1], T = Math.sqrt(Math.pow(n[0] - u[0], 2) + Math.pow(n[1] - u[1], 2)), E = T ? Math.min(T / 2, e) / T : 0, N = n[0] + (u[0] - n[0]) * E, m = N, S = n[1] - (n[1] - u[1]) * E, C = S, I = m - (m - n[0]) * _t, P = C - (C - n[1]) * _t, i.setTripleAt(m, C, I, P, N, S, B), B += 1, s === o - 1 ? u = t.v[0] : u = t.v[s + 1], T = Math.sqrt(Math.pow(n[0] - u[0], 2) + Math.pow(n[1] - u[1], 2)), E = T ? Math.min(T / 2, e) / T : 0, I = n[0] + (u[0] - n[0]) * E, m = I, P = n[1] + (u[1] - n[1]) * E, C = P, N = m - (m - n[0]) * _t, S = C - (C - n[1]) * _t, i.setTripleAt(m, C, I, P, N, S, B), B += 1) : (i.setTripleAt(t.v[s][0], t.v[s][1], t.o[s][0], t.o[s][1], t.i[s][0], t.i[s][1], B), B += 1);
      return i;
    }, Bi.prototype.processShapes = function(t) {
      var e, i, s = this.shapes.length, o, n, c = this.rd.v;
      if (c !== 0) {
        var _, u;
        for (i = 0; i < s; i += 1) {
          if (_ = this.shapes[i], u = _.localShapeCollection, !(!_.shape._mdf && !this._mdf && !t))
            for (u.releaseShapes(), _.shape._mdf = !0, e = _.shape.paths.shapes, n = _.shape.paths._length, o = 0; o < n; o += 1)
              u.addShape(this.processPath(e[o], c));
          _.shape.paths = _.localShapeCollection;
        }
      }
      this.dynamicProperties.length || (this._mdf = !1);
    };
    function ii(t, e) {
      return Math.abs(t - e) * 1e5 <= Math.min(Math.abs(t), Math.abs(e));
    }
    function hr(t) {
      return Math.abs(t) <= 1e-5;
    }
    function as(t, e, i) {
      return t * (1 - i) + e * i;
    }
    function Be(t, e, i) {
      return [as(t[0], e[0], i), as(t[1], e[1], i)];
    }
    function ls(t, e, i) {
      if (t === 0) return [];
      var s = e * e - 4 * t * i;
      if (s < 0) return [];
      var o = -e / (2 * t);
      if (s === 0) return [o];
      var n = Math.sqrt(s) / (2 * t);
      return [o - n, o + n];
    }
    function Vi(t, e, i, s) {
      return [-t + 3 * e - 3 * i + s, 3 * t - 6 * e + 3 * i, -3 * t + 3 * e, t];
    }
    function fr(t) {
      return new Dt(t, t, t, t, !1);
    }
    function Dt(t, e, i, s, o) {
      o && ni(t, e) && (e = Be(t, s, 1 / 3)), o && ni(i, s) && (i = Be(t, s, 2 / 3));
      var n = Vi(t[0], e[0], i[0], s[0]), c = Vi(t[1], e[1], i[1], s[1]);
      this.a = [n[0], c[0]], this.b = [n[1], c[1]], this.c = [n[2], c[2]], this.d = [n[3], c[3]], this.points = [t, e, i, s];
    }
    Dt.prototype.point = function(t) {
      return [((this.a[0] * t + this.b[0]) * t + this.c[0]) * t + this.d[0], ((this.a[1] * t + this.b[1]) * t + this.c[1]) * t + this.d[1]];
    }, Dt.prototype.derivative = function(t) {
      return [(3 * t * this.a[0] + 2 * this.b[0]) * t + this.c[0], (3 * t * this.a[1] + 2 * this.b[1]) * t + this.c[1]];
    }, Dt.prototype.tangentAngle = function(t) {
      var e = this.derivative(t);
      return Math.atan2(e[1], e[0]);
    }, Dt.prototype.normalAngle = function(t) {
      var e = this.derivative(t);
      return Math.atan2(e[0], e[1]);
    }, Dt.prototype.inflectionPoints = function() {
      var t = this.a[1] * this.b[0] - this.a[0] * this.b[1];
      if (hr(t)) return [];
      var e = -0.5 * (this.a[1] * this.c[0] - this.a[0] * this.c[1]) / t, i = e * e - 1 / 3 * (this.b[1] * this.c[0] - this.b[0] * this.c[1]) / t;
      if (i < 0) return [];
      var s = Math.sqrt(i);
      return hr(s) ? s > 0 && s < 1 ? [e] : [] : [e - s, e + s].filter(function(o) {
        return o > 0 && o < 1;
      });
    }, Dt.prototype.split = function(t) {
      if (t <= 0) return [fr(this.points[0]), this];
      if (t >= 1) return [this, fr(this.points[this.points.length - 1])];
      var e = Be(this.points[0], this.points[1], t), i = Be(this.points[1], this.points[2], t), s = Be(this.points[2], this.points[3], t), o = Be(e, i, t), n = Be(i, s, t), c = Be(o, n, t);
      return [new Dt(this.points[0], e, o, c, !0), new Dt(c, n, s, this.points[3], !0)];
    };
    function ri(t, e) {
      var i = t.points[0][e], s = t.points[t.points.length - 1][e];
      if (i > s) {
        var o = s;
        s = i, i = o;
      }
      for (var n = ls(3 * t.a[e], 2 * t.b[e], t.c[e]), c = 0; c < n.length; c += 1)
        if (n[c] > 0 && n[c] < 1) {
          var _ = t.point(n[c])[e];
          _ < i ? i = _ : _ > s && (s = _);
        }
      return {
        min: i,
        max: s
      };
    }
    Dt.prototype.bounds = function() {
      return {
        x: ri(this, 0),
        y: ri(this, 1)
      };
    }, Dt.prototype.boundingBox = function() {
      var t = this.bounds();
      return {
        left: t.x.min,
        right: t.x.max,
        top: t.y.min,
        bottom: t.y.max,
        width: t.x.max - t.x.min,
        height: t.y.max - t.y.min,
        cx: (t.x.max + t.x.min) / 2,
        cy: (t.y.max + t.y.min) / 2
      };
    };
    function Ge(t, e, i) {
      var s = t.boundingBox();
      return {
        cx: s.cx,
        cy: s.cy,
        width: s.width,
        height: s.height,
        bez: t,
        t: (e + i) / 2,
        t1: e,
        t2: i
      };
    }
    function Ce(t) {
      var e = t.bez.split(0.5);
      return [Ge(e[0], t.t1, t.t), Ge(e[1], t.t, t.t2)];
    }
    function Ws(t, e) {
      return Math.abs(t.cx - e.cx) * 2 < t.width + e.width && Math.abs(t.cy - e.cy) * 2 < t.height + e.height;
    }
    function Ye(t, e, i, s, o, n) {
      if (Ws(t, e)) {
        if (i >= n || t.width <= s && t.height <= s && e.width <= s && e.height <= s) {
          o.push([t.t, e.t]);
          return;
        }
        var c = Ce(t), _ = Ce(e);
        Ye(c[0], _[0], i + 1, s, o, n), Ye(c[0], _[1], i + 1, s, o, n), Ye(c[1], _[0], i + 1, s, o, n), Ye(c[1], _[1], i + 1, s, o, n);
      }
    }
    Dt.prototype.intersections = function(t, e, i) {
      e === void 0 && (e = 2), i === void 0 && (i = 7);
      var s = [];
      return Ye(Ge(this, 0, 1), Ge(t, 0, 1), 0, e, s, i), s;
    }, Dt.shapeSegment = function(t, e) {
      var i = (e + 1) % t.length();
      return new Dt(t.v[e], t.o[e], t.i[i], t.v[i], !0);
    }, Dt.shapeSegmentInverted = function(t, e) {
      var i = (e + 1) % t.length();
      return new Dt(t.v[i], t.i[i], t.o[e], t.v[e], !0);
    };
    function Lr(t, e) {
      return [t[1] * e[2] - t[2] * e[1], t[2] * e[0] - t[0] * e[2], t[0] * e[1] - t[1] * e[0]];
    }
    function $i(t, e, i, s) {
      var o = [t[0], t[1], 1], n = [e[0], e[1], 1], c = [i[0], i[1], 1], _ = [s[0], s[1], 1], u = Lr(Lr(o, n), Lr(c, _));
      return hr(u[2]) ? null : [u[0] / u[2], u[1] / u[2]];
    }
    function si(t, e, i) {
      return [t[0] + Math.cos(e) * i, t[1] - Math.sin(e) * i];
    }
    function cr(t, e) {
      return Math.hypot(t[0] - e[0], t[1] - e[1]);
    }
    function ni(t, e) {
      return ii(t[0], e[0]) && ii(t[1], e[1]);
    }
    function ji() {
    }
    U([ye], ji), ji.prototype.initModifierProperties = function(t, e) {
      this.getValue = this.processKeys, this.amplitude = Q.getProp(t, e.s, 0, null, this), this.frequency = Q.getProp(t, e.r, 0, null, this), this.pointsType = Q.getProp(t, e.pt, 0, null, this), this._isAnimated = this.amplitude.effectsSequence.length !== 0 || this.frequency.effectsSequence.length !== 0 || this.pointsType.effectsSequence.length !== 0;
    };
    function Fr(t, e, i, s, o, n, c) {
      var _ = i - Math.PI / 2, u = i + Math.PI / 2, T = e[0] + Math.cos(i) * s * o, E = e[1] - Math.sin(i) * s * o;
      t.setTripleAt(T, E, T + Math.cos(_) * n, E - Math.sin(_) * n, T + Math.cos(u) * c, E - Math.sin(u) * c, t.length());
    }
    function Hs(t, e) {
      var i = [e[0] - t[0], e[1] - t[1]], s = -Math.PI * 0.5, o = [Math.cos(s) * i[0] - Math.sin(s) * i[1], Math.sin(s) * i[0] + Math.cos(s) * i[1]];
      return o;
    }
    function Us(t, e) {
      var i = e === 0 ? t.length() - 1 : e - 1, s = (e + 1) % t.length(), o = t.v[i], n = t.v[s], c = Hs(o, n);
      return Math.atan2(0, 1) - Math.atan2(c[1], c[0]);
    }
    function Rr(t, e, i, s, o, n, c) {
      var _ = Us(e, i), u = e.v[i % e._length], T = e.v[i === 0 ? e._length - 1 : i - 1], E = e.v[(i + 1) % e._length], B = n === 2 ? Math.sqrt(Math.pow(u[0] - T[0], 2) + Math.pow(u[1] - T[1], 2)) : 0, m = n === 2 ? Math.sqrt(Math.pow(u[0] - E[0], 2) + Math.pow(u[1] - E[1], 2)) : 0;
      Fr(t, e.v[i % e._length], _, c, s, m / ((o + 1) * 2), B / ((o + 1) * 2));
    }
    function ur(t, e, i, s, o, n) {
      for (var c = 0; c < s; c += 1) {
        var _ = (c + 1) / (s + 1), u = o === 2 ? Math.sqrt(Math.pow(e.points[3][0] - e.points[0][0], 2) + Math.pow(e.points[3][1] - e.points[0][1], 2)) : 0, T = e.normalAngle(_), E = e.point(_);
        Fr(t, E, T, n, i, u / ((s + 1) * 2), u / ((s + 1) * 2)), n = -n;
      }
      return n;
    }
    ji.prototype.processPath = function(t, e, i, s) {
      var o = t._length, n = qt.newElement();
      if (n.c = t.c, t.c || (o -= 1), o === 0) return n;
      var c = -1, _ = Dt.shapeSegment(t, 0);
      Rr(n, t, 0, e, i, s, c);
      for (var u = 0; u < o; u += 1)
        c = ur(n, _, e, i, s, -c), u === o - 1 && !t.c ? _ = null : _ = Dt.shapeSegment(t, (u + 1) % o), Rr(n, t, u + 1, e, i, s, c);
      return n;
    }, ji.prototype.processShapes = function(t) {
      var e, i, s = this.shapes.length, o, n, c = this.amplitude.v, _ = Math.max(0, Math.round(this.frequency.v)), u = this.pointsType.v;
      if (c !== 0) {
        var T, E;
        for (i = 0; i < s; i += 1) {
          if (T = this.shapes[i], E = T.localShapeCollection, !(!T.shape._mdf && !this._mdf && !t))
            for (E.releaseShapes(), T.shape._mdf = !0, e = T.shape.paths.shapes, n = T.shape.paths._length, o = 0; o < n; o += 1)
              E.addShape(this.processPath(e[o], c, _, u));
          T.shape.paths = T.localShapeCollection;
        }
      }
      this.dynamicProperties.length || (this._mdf = !1);
    };
    function Wi(t, e, i) {
      var s = Math.atan2(e[0] - t[0], e[1] - t[1]);
      return [si(t, s, i), si(e, s, i)];
    }
    function Z(t, e) {
      var i, s, o, n, c, _, u;
      u = Wi(t.points[0], t.points[1], e), i = u[0], s = u[1], u = Wi(t.points[1], t.points[2], e), o = u[0], n = u[1], u = Wi(t.points[2], t.points[3], e), c = u[0], _ = u[1];
      var T = $i(i, s, o, n);
      T === null && (T = s);
      var E = $i(c, _, o, n);
      return E === null && (E = c), new Dt(i, T, E, _);
    }
    function k(t, e, i, s, o) {
      var n = e.points[3], c = i.points[0];
      if (s === 3 || ni(n, c)) return n;
      if (s === 2) {
        var _ = -e.tangentAngle(1), u = -i.tangentAngle(0) + Math.PI, T = $i(n, si(n, _ + Math.PI / 2, 100), c, si(c, _ + Math.PI / 2, 100)), E = T ? cr(T, n) : cr(n, c) / 2, B = si(n, _, 2 * E * _t);
        return t.setXYAt(B[0], B[1], "o", t.length() - 1), B = si(c, u, 2 * E * _t), t.setTripleAt(c[0], c[1], c[0], c[1], B[0], B[1], t.length()), c;
      }
      var m = ni(n, e.points[2]) ? e.points[0] : e.points[2], C = ni(c, i.points[1]) ? i.points[3] : i.points[1], I = $i(m, n, c, C);
      return I && cr(I, n) < o ? (t.setTripleAt(I[0], I[1], I[0], I[1], I[0], I[1], t.length()), I) : n;
    }
    function z(t, e) {
      var i = t.intersections(e);
      return i.length && ii(i[0][0], 1) && i.shift(), i.length ? i[0] : null;
    }
    function q(t, e) {
      var i = t.slice(), s = e.slice(), o = z(t[t.length - 1], e[0]);
      return o && (i[t.length - 1] = t[t.length - 1].split(o[0])[0], s[0] = e[0].split(o[1])[1]), t.length > 1 && e.length > 1 && (o = z(t[0], e[e.length - 1]), o) ? [[t[0].split(o[0])[0]], [e[e.length - 1].split(o[1])[1]]] : [i, s];
    }
    function J(t) {
      for (var e, i = 1; i < t.length; i += 1)
        e = q(t[i - 1], t[i]), t[i - 1] = e[0], t[i] = e[1];
      return t.length > 1 && (e = q(t[t.length - 1], t[0]), t[t.length - 1] = e[0], t[0] = e[1]), t;
    }
    function st(t, e) {
      var i = t.inflectionPoints(), s, o, n, c;
      if (i.length === 0)
        return [Z(t, e)];
      if (i.length === 1 || ii(i[1], 1))
        return n = t.split(i[0]), s = n[0], o = n[1], [Z(s, e), Z(o, e)];
      n = t.split(i[0]), s = n[0];
      var _ = (i[1] - i[0]) / (1 - i[0]);
      return n = n[1].split(_), c = n[0], o = n[1], [Z(s, e), Z(c, e), Z(o, e)];
    }
    function lt() {
    }
    U([ye], lt), lt.prototype.initModifierProperties = function(t, e) {
      this.getValue = this.processKeys, this.amount = Q.getProp(t, e.a, 0, null, this), this.miterLimit = Q.getProp(t, e.ml, 0, null, this), this.lineJoin = e.lj, this._isAnimated = this.amount.effectsSequence.length !== 0;
    }, lt.prototype.processPath = function(t, e, i, s) {
      var o = qt.newElement();
      o.c = t.c;
      var n = t.length();
      t.c || (n -= 1);
      var c, _, u, T = [];
      for (c = 0; c < n; c += 1)
        u = Dt.shapeSegment(t, c), T.push(st(u, e));
      if (!t.c)
        for (c = n - 1; c >= 0; c -= 1)
          u = Dt.shapeSegmentInverted(t, c), T.push(st(u, e));
      T = J(T);
      var E = null, B = null;
      for (c = 0; c < T.length; c += 1) {
        var m = T[c];
        for (B && (E = k(o, B, m[0], i, s)), B = m[m.length - 1], _ = 0; _ < m.length; _ += 1)
          u = m[_], E && ni(u.points[0], E) ? o.setXYAt(u.points[1][0], u.points[1][1], "o", o.length() - 1) : o.setTripleAt(u.points[0][0], u.points[0][1], u.points[1][0], u.points[1][1], u.points[0][0], u.points[0][1], o.length()), o.setTripleAt(u.points[3][0], u.points[3][1], u.points[3][0], u.points[3][1], u.points[2][0], u.points[2][1], o.length()), E = u.points[3];
      }
      return T.length && k(o, B, T[0][0], i, s), o;
    }, lt.prototype.processShapes = function(t) {
      var e, i, s = this.shapes.length, o, n, c = this.amount.v, _ = this.miterLimit.v, u = this.lineJoin;
      if (c !== 0) {
        var T, E;
        for (i = 0; i < s; i += 1) {
          if (T = this.shapes[i], E = T.localShapeCollection, !(!T.shape._mdf && !this._mdf && !t))
            for (E.releaseShapes(), T.shape._mdf = !0, e = T.shape.paths.shapes, n = T.shape.paths._length, o = 0; o < n; o += 1)
              E.addShape(this.processPath(e[o], c, u, _));
          T.shape.paths = T.localShapeCollection;
        }
      }
      this.dynamicProperties.length || (this._mdf = !1);
    };
    function Ct(t) {
      for (var e = t.fStyle ? t.fStyle.split(" ") : [], i = "normal", s = "normal", o = e.length, n, c = 0; c < o; c += 1)
        switch (n = e[c].toLowerCase(), n) {
          case "italic":
            s = "italic";
            break;
          case "bold":
            i = "700";
            break;
          case "black":
            i = "900";
            break;
          case "medium":
            i = "500";
            break;
          case "regular":
          case "normal":
            i = "400";
            break;
          case "light":
          case "thin":
            i = "200";
            break;
        }
      return {
        style: s,
        weight: t.fWeight || i
      };
    }
    var Tt = function() {
      var t = 5e3, e = {
        w: 0,
        size: 0,
        shapes: [],
        data: {
          shapes: []
        }
      }, i = [];
      i = i.concat([2304, 2305, 2306, 2307, 2362, 2363, 2364, 2364, 2366, 2367, 2368, 2369, 2370, 2371, 2372, 2373, 2374, 2375, 2376, 2377, 2378, 2379, 2380, 2381, 2382, 2383, 2387, 2388, 2389, 2390, 2391, 2402, 2403]);
      var s = 127988, o = 917631, n = 917601, c = 917626, _ = 65039, u = 8205, T = 127462, E = 127487, B = ["d83cdffb", "d83cdffc", "d83cdffd", "d83cdffe", "d83cdfff"];
      function m(w) {
        var M = w.split(","), f, p = M.length, $ = [];
        for (f = 0; f < p; f += 1)
          M[f] !== "sans-serif" && M[f] !== "monospace" && $.push(M[f]);
        return $.join(",");
      }
      function C(w, M) {
        var f = H("span");
        f.setAttribute("aria-hidden", !0), f.style.fontFamily = M;
        var p = H("span");
        p.innerText = "giItT1WQy@!-/#", f.style.position = "absolute", f.style.left = "-10000px", f.style.top = "-10000px", f.style.fontSize = "300px", f.style.fontVariant = "normal", f.style.fontStyle = "normal", f.style.fontWeight = "normal", f.style.letterSpacing = "0", f.appendChild(p), document.body.appendChild(f);
        var $ = p.offsetWidth;
        return p.style.fontFamily = m(w) + ", " + M, {
          node: p,
          w: $,
          parent: f
        };
      }
      function I() {
        var w, M = this.fonts.length, f, p, $ = M;
        for (w = 0; w < M; w += 1)
          this.fonts[w].loaded ? $ -= 1 : this.fonts[w].fOrigin === "n" || this.fonts[w].origin === 0 ? this.fonts[w].loaded = !0 : (f = this.fonts[w].monoCase.node, p = this.fonts[w].monoCase.w, f.offsetWidth !== p ? ($ -= 1, this.fonts[w].loaded = !0) : (f = this.fonts[w].sansCase.node, p = this.fonts[w].sansCase.w, f.offsetWidth !== p && ($ -= 1, this.fonts[w].loaded = !0)), this.fonts[w].loaded && (this.fonts[w].sansCase.parent.parentNode.removeChild(this.fonts[w].sansCase.parent), this.fonts[w].monoCase.parent.parentNode.removeChild(this.fonts[w].monoCase.parent)));
        $ !== 0 && Date.now() - this.initTime < t ? setTimeout(this.checkLoadedFontsBinded, 20) : setTimeout(this.setIsLoadedBinded, 10);
      }
      function P(w, M) {
        var f = document.body && M ? "svg" : "canvas", p, $ = Ct(w);
        if (f === "svg") {
          var F = ft("text");
          F.style.fontSize = "100px", F.setAttribute("font-family", w.fFamily), F.setAttribute("font-style", $.style), F.setAttribute("font-weight", $.weight), F.textContent = "1", w.fClass ? (F.style.fontFamily = "inherit", F.setAttribute("class", w.fClass)) : F.style.fontFamily = w.fFamily, M.appendChild(F), p = F;
        } else {
          var et = new OffscreenCanvas(500, 500).getContext("2d");
          et.font = $.style + " " + $.weight + " 100px " + w.fFamily, p = et;
        }
        function ht(ut) {
          return f === "svg" ? (p.textContent = ut, p.getComputedTextLength()) : p.measureText(ut).width;
        }
        return {
          measureText: ht
        };
      }
      function N(w, M) {
        if (!w) {
          this.isLoaded = !0;
          return;
        }
        if (this.chars) {
          this.isLoaded = !0, this.fonts = w.list;
          return;
        }
        if (!document.body) {
          this.isLoaded = !0, w.list.forEach(function(be) {
            be.helper = P(be), be.cache = {};
          }), this.fonts = w.list;
          return;
        }
        var f = w.list, p, $ = f.length, F = $;
        for (p = 0; p < $; p += 1) {
          var et = !0, ht, ut;
          if (f[p].loaded = !1, f[p].monoCase = C(f[p].fFamily, "monospace"), f[p].sansCase = C(f[p].fFamily, "sans-serif"), !f[p].fPath)
            f[p].loaded = !0, F -= 1;
          else if (f[p].fOrigin === "p" || f[p].origin === 3) {
            if (ht = document.querySelectorAll('style[f-forigin="p"][f-family="' + f[p].fFamily + '"], style[f-origin="3"][f-family="' + f[p].fFamily + '"]'), ht.length > 0 && (et = !1), et) {
              var kt = H("style");
              kt.setAttribute("f-forigin", f[p].fOrigin), kt.setAttribute("f-origin", f[p].origin), kt.setAttribute("f-family", f[p].fFamily), kt.type = "text/css", kt.innerText = "@font-face {font-family: " + f[p].fFamily + "; font-style: normal; src: url('" + f[p].fPath + "');}", M.appendChild(kt);
            }
          } else if (f[p].fOrigin === "g" || f[p].origin === 1) {
            for (ht = document.querySelectorAll('link[f-forigin="g"], link[f-origin="1"]'), ut = 0; ut < ht.length; ut += 1)
              ht[ut].href.indexOf(f[p].fPath) !== -1 && (et = !1);
            if (et) {
              var xt = H("link");
              xt.setAttribute("f-forigin", f[p].fOrigin), xt.setAttribute("f-origin", f[p].origin), xt.type = "text/css", xt.rel = "stylesheet", xt.href = f[p].fPath, document.body.appendChild(xt);
            }
          } else if (f[p].fOrigin === "t" || f[p].origin === 2) {
            for (ht = document.querySelectorAll('script[f-forigin="t"], script[f-origin="2"]'), ut = 0; ut < ht.length; ut += 1)
              f[p].fPath === ht[ut].src && (et = !1);
            if (et) {
              var ie = H("link");
              ie.setAttribute("f-forigin", f[p].fOrigin), ie.setAttribute("f-origin", f[p].origin), ie.setAttribute("rel", "stylesheet"), ie.setAttribute("href", f[p].fPath), M.appendChild(ie);
            }
          }
          f[p].helper = P(f[p], M), f[p].cache = {}, this.fonts.push(f[p]);
        }
        F === 0 ? this.isLoaded = !0 : setTimeout(this.checkLoadedFonts.bind(this), 100);
      }
      function S(w) {
        if (w) {
          this.chars || (this.chars = []);
          var M, f = w.length, p, $ = this.chars.length, F;
          for (M = 0; M < f; M += 1) {
            for (p = 0, F = !1; p < $; )
              this.chars[p].style === w[M].style && this.chars[p].fFamily === w[M].fFamily && this.chars[p].ch === w[M].ch && (F = !0), p += 1;
            F || (this.chars.push(w[M]), $ += 1);
          }
        }
      }
      function x(w, M, f) {
        for (var p = 0, $ = this.chars.length; p < $; ) {
          if (this.chars[p].ch === w && this.chars[p].style === M && this.chars[p].fFamily === f)
            return this.chars[p];
          p += 1;
        }
        return (typeof w == "string" && w.charCodeAt(0) !== 13 || !w) && console && console.warn && !this._warned && (this._warned = !0, console.warn("Missing character from exported characters list: ", w, M, f)), e;
      }
      function d(w, M, f) {
        var p = this.getFontByName(M), $ = w;
        if (!p.cache[$]) {
          var F = p.helper;
          if (w === " ") {
            var et = F.measureText("|" + w + "|"), ht = F.measureText("||");
            p.cache[$] = (et - ht) / 100;
          } else
            p.cache[$] = F.measureText(w) / 100;
        }
        return p.cache[$] * f;
      }
      function y(w) {
        for (var M = 0, f = this.fonts.length; M < f; ) {
          if (this.fonts[M].fName === w)
            return this.fonts[M];
          M += 1;
        }
        return this.fonts[0];
      }
      function A(w) {
        var M = 0, f = w.charCodeAt(0);
        if (f >= 55296 && f <= 56319) {
          var p = w.charCodeAt(1);
          p >= 56320 && p <= 57343 && (M = (f - 55296) * 1024 + p - 56320 + 65536);
        }
        return M;
      }
      function L(w, M) {
        var f = w.toString(16) + M.toString(16);
        return B.indexOf(f) !== -1;
      }
      function D(w) {
        return w === u;
      }
      function j(w) {
        return w === _;
      }
      function Y(w) {
        var M = A(w);
        return M >= T && M <= E;
      }
      function ct(w) {
        return Y(w.substr(0, 2)) && Y(w.substr(2, 2));
      }
      function ot(w) {
        return i.indexOf(w) !== -1;
      }
      function K(w, M) {
        var f = A(w.substr(M, 2));
        if (f !== s)
          return !1;
        var p = 0;
        for (M += 2; p < 5; ) {
          if (f = A(w.substr(M, 2)), f < n || f > c)
            return !1;
          p += 1, M += 2;
        }
        return A(w.substr(M, 2)) === o;
      }
      function pt() {
        this.isLoaded = !0;
      }
      var it = function() {
        this.fonts = [], this.chars = null, this.typekitLoaded = 0, this.isLoaded = !1, this._warned = !1, this.initTime = Date.now(), this.setIsLoadedBinded = this.setIsLoaded.bind(this), this.checkLoadedFontsBinded = this.checkLoadedFonts.bind(this);
      };
      it.isModifier = L, it.isZeroWidthJoiner = D, it.isFlagEmoji = ct, it.isRegionalCode = Y, it.isCombinedCharacter = ot, it.isRegionalFlag = K, it.isVariationSelector = j, it.BLACK_FLAG_CODE_POINT = s;
      var G = {
        addChars: S,
        addFonts: N,
        getCharData: x,
        getFontByName: y,
        measureText: d,
        checkLoadedFonts: I,
        setIsLoaded: pt
      };
      return it.prototype = G, it;
    }();
    function ae(t) {
      this.animationData = t;
    }
    ae.prototype.getProp = function(t) {
      return this.animationData.slots && this.animationData.slots[t.sid] ? Object.assign(t, this.animationData.slots[t.sid].p) : t;
    };
    function he(t) {
      return new ae(t);
    }
    function xi() {
    }
    xi.prototype = {
      initRenderable: function() {
        this.isInRange = !1, this.hidden = !1, this.isTransparent = !1, this.renderableComponents = [];
      },
      addRenderableComponent: function(e) {
        this.renderableComponents.indexOf(e) === -1 && this.renderableComponents.push(e);
      },
      removeRenderableComponent: function(e) {
        this.renderableComponents.indexOf(e) !== -1 && this.renderableComponents.splice(this.renderableComponents.indexOf(e), 1);
      },
      prepareRenderableFrame: function(e) {
        this.checkLayerLimits(e);
      },
      checkTransparency: function() {
        this.finalTransform.mProp.o.v <= 0 ? !this.isTransparent && this.globalData.renderConfig.hideOnTransparent && (this.isTransparent = !0, this.hide()) : this.isTransparent && (this.isTransparent = !1, this.show());
      },
      /**
         * @function
         * Initializes frame related properties.
         *
         * @param {number} num
         * current frame number in Layer's time
         *
         */
      checkLayerLimits: function(e) {
        this.data.ip - this.data.st <= e && this.data.op - this.data.st > e ? this.isInRange !== !0 && (this.globalData._mdf = !0, this._mdf = !0, this.isInRange = !0, this.show()) : this.isInRange !== !1 && (this.globalData._mdf = !0, this.isInRange = !1, this.hide());
      },
      renderRenderable: function() {
        var e, i = this.renderableComponents.length;
        for (e = 0; e < i; e += 1)
          this.renderableComponents[e].renderFrame(this._isFirstFrame);
      },
      sourceRectAtTime: function() {
        return {
          top: 0,
          left: 0,
          width: 100,
          height: 100
        };
      },
      getLayerSize: function() {
        return this.data.ty === 5 ? {
          w: this.data.textData.width,
          h: this.data.textData.height
        } : {
          w: this.data.width,
          h: this.data.height
        };
      }
    };
    var ee = /* @__PURE__ */ function() {
      var t = {
        0: "source-over",
        1: "multiply",
        2: "screen",
        3: "overlay",
        4: "darken",
        5: "lighten",
        6: "color-dodge",
        7: "color-burn",
        8: "hard-light",
        9: "soft-light",
        10: "difference",
        11: "exclusion",
        12: "hue",
        13: "saturation",
        14: "color",
        15: "luminosity"
      };
      return function(e) {
        return t[e] || "";
      };
    }();
    function hs(t, e, i) {
      this.p = Q.getProp(e, t.v, 0, 0, i);
    }
    function In(t, e, i) {
      this.p = Q.getProp(e, t.v, 0, 0, i);
    }
    function fa(t, e, i) {
      this.p = Q.getProp(e, t.v, 1, 0, i);
    }
    function ca(t, e, i) {
      this.p = Q.getProp(e, t.v, 1, 0, i);
    }
    function ua(t, e, i) {
      this.p = Q.getProp(e, t.v, 0, 0, i);
    }
    function pa(t, e, i) {
      this.p = Q.getProp(e, t.v, 0, 0, i);
    }
    function da(t, e, i) {
      this.p = Q.getProp(e, t.v, 0, 0, i);
    }
    function ma() {
      this.p = {};
    }
    function Ln(t, e) {
      var i = t.ef || [];
      this.effectElements = [];
      var s, o = i.length, n;
      for (s = 0; s < o; s += 1)
        n = new Or(i[s], e), this.effectElements.push(n);
    }
    function Or(t, e) {
      this.init(t, e);
    }
    U([Xt], Or), Or.prototype.getValue = Or.prototype.iterateDynamicProperties, Or.prototype.init = function(t, e) {
      this.data = t, this.effectElements = [], this.initDynamicPropertyContainer(e);
      var i, s = this.data.ef.length, o, n = this.data.ef;
      for (i = 0; i < s; i += 1) {
        switch (o = null, n[i].ty) {
          case 0:
            o = new hs(n[i], e, this);
            break;
          case 1:
            o = new In(n[i], e, this);
            break;
          case 2:
            o = new fa(n[i], e, this);
            break;
          case 3:
            o = new ca(n[i], e, this);
            break;
          case 4:
          case 7:
            o = new da(n[i], e, this);
            break;
          case 10:
            o = new ua(n[i], e, this);
            break;
          case 11:
            o = new pa(n[i], e, this);
            break;
          case 5:
            o = new Ln(n[i], e);
            break;
          default:
            o = new ma(n[i]);
            break;
        }
        o && this.effectElements.push(o);
      }
    };
    function Ti() {
    }
    Ti.prototype = {
      checkMasks: function() {
        if (!this.data.hasMask)
          return !1;
        for (var e = 0, i = this.data.masksProperties.length; e < i; ) {
          if (this.data.masksProperties[e].mode !== "n" && this.data.masksProperties[e].cl !== !1)
            return !0;
          e += 1;
        }
        return !1;
      },
      initExpressions: function() {
      },
      setBlendMode: function() {
        var e = ee(this.data.bm), i = this.baseElement || this.layerElement;
        i.style["mix-blend-mode"] = e;
      },
      initBaseData: function(e, i, s) {
        this.globalData = i, this.comp = s, this.data = e, this.layerId = Et(), this.data.sr || (this.data.sr = 1), this.effectsManager = new Ln(this.data, this, this.dynamicProperties);
      },
      getType: function() {
        return this.type;
      },
      sourceRectAtTime: function() {
      }
    };
    function Ai() {
    }
    Ai.prototype = {
      /**
         * @function
         * Initializes frame related properties.
         *
         */
      initFrame: function() {
        this._isFirstFrame = !1, this.dynamicProperties = [], this._mdf = !1;
      },
      /**
         * @function
         * Calculates all dynamic values
         *
         * @param {number} num
         * current frame number in Layer's time
         * @param {boolean} isVisible
         * if layers is currently in range
         *
         */
      prepareProperties: function(e, i) {
        var s, o = this.dynamicProperties.length;
        for (s = 0; s < o; s += 1)
          (i || this._isParent && this.dynamicProperties[s].propType === "transform") && (this.dynamicProperties[s].getValue(), this.dynamicProperties[s]._mdf && (this.globalData._mdf = !0, this._mdf = !0));
      },
      addDynamicProperty: function(e) {
        this.dynamicProperties.indexOf(e) === -1 && this.dynamicProperties.push(e);
      }
    };
    function Si(t, e, i) {
      this.initFrame(), this.initRenderable(), this.assetData = e.getAssetData(t.refId), this.footageData = e.imageLoader.getAsset(this.assetData), this.initBaseData(t, e, i);
    }
    Si.prototype.prepareFrame = function() {
    }, U([xi, Ti, Ai], Si), Si.prototype.getBaseElement = function() {
      return null;
    }, Si.prototype.renderFrame = function() {
    }, Si.prototype.destroy = function() {
    }, Si.prototype.initExpressions = function() {
    }, Si.prototype.getFootageData = function() {
      return this.footageData;
    };
    function _e(t, e, i) {
      this.initFrame(), this.initRenderable(), this.assetData = e.getAssetData(t.refId), this.initBaseData(t, e, i), this._isPlaying = !1, this._canPlay = !1;
      var s = this.globalData.getAssetsPath(this.assetData);
      this.audio = this.globalData.audioController.createAudio(s), this._currentTime = 0, this.globalData.audioController.addAudio(this), this._volumeMultiplier = 1, this._volume = 1, this._previousVolume = null, this.tm = t.tm ? Q.getProp(this, t.tm, 0, e.frameRate, this) : {
        _placeholder: !0
      }, this.lv = Q.getProp(this, t.au && t.au.lv ? t.au.lv : {
        k: [100]
      }, 1, 0.01, this);
    }
    _e.prototype.prepareFrame = function(t) {
      if (this.prepareRenderableFrame(t, !0), this.prepareProperties(t, !0), this.tm._placeholder)
        this._currentTime = t / this.data.sr;
      else {
        var e = this.tm.v;
        this._currentTime = e;
      }
      this._volume = this.lv.v[0];
      var i = this._volume * this._volumeMultiplier;
      this._previousVolume !== i && (this._previousVolume = i, this.audio.volume(i));
    }, U([xi, Ti, Ai], _e), _e.prototype.renderFrame = function() {
      this.isInRange && this._canPlay && (this._isPlaying ? (!this.audio.playing() || Math.abs(this._currentTime / this.globalData.frameRate - this.audio.seek()) > 0.1) && this.audio.seek(this._currentTime / this.globalData.frameRate) : (this.audio.play(), this.audio.seek(this._currentTime / this.globalData.frameRate), this._isPlaying = !0));
    }, _e.prototype.show = function() {
    }, _e.prototype.hide = function() {
      this.audio.pause(), this._isPlaying = !1;
    }, _e.prototype.pause = function() {
      this.audio.pause(), this._isPlaying = !1, this._canPlay = !1;
    }, _e.prototype.resume = function() {
      this._canPlay = !0;
    }, _e.prototype.setRate = function(t) {
      this.audio.rate(t);
    }, _e.prototype.volume = function(t) {
      this._volumeMultiplier = t, this._previousVolume = t * this._volume, this.audio.volume(this._previousVolume);
    }, _e.prototype.getBaseElement = function() {
      return null;
    }, _e.prototype.destroy = function() {
    }, _e.prototype.sourceRectAtTime = function() {
    }, _e.prototype.initExpressions = function() {
    };
    function fe() {
    }
    fe.prototype.checkLayers = function(t) {
      var e, i = this.layers.length, s;
      for (this.completeLayers = !0, e = i - 1; e >= 0; e -= 1)
        this.elements[e] || (s = this.layers[e], s.ip - s.st <= t - this.layers[e].st && s.op - s.st > t - this.layers[e].st && this.buildItem(e)), this.completeLayers = this.elements[e] ? this.completeLayers : !1;
      this.checkPendingElements();
    }, fe.prototype.createItem = function(t) {
      switch (t.ty) {
        case 2:
          return this.createImage(t);
        case 0:
          return this.createComp(t);
        case 1:
          return this.createSolid(t);
        case 3:
          return this.createNull(t);
        case 4:
          return this.createShape(t);
        case 5:
          return this.createText(t);
        case 6:
          return this.createAudio(t);
        case 13:
          return this.createCamera(t);
        case 15:
          return this.createFootage(t);
        default:
          return this.createNull(t);
      }
    }, fe.prototype.createCamera = function() {
      throw new Error("You're using a 3d camera. Try the html renderer.");
    }, fe.prototype.createAudio = function(t) {
      return new _e(t, this.globalData, this);
    }, fe.prototype.createFootage = function(t) {
      return new Si(t, this.globalData, this);
    }, fe.prototype.buildAllItems = function() {
      var t, e = this.layers.length;
      for (t = 0; t < e; t += 1)
        this.buildItem(t);
      this.checkPendingElements();
    }, fe.prototype.includeLayers = function(t) {
      this.completeLayers = !1;
      var e, i = t.length, s, o = this.layers.length;
      for (e = 0; e < i; e += 1)
        for (s = 0; s < o; ) {
          if (this.layers[s].id === t[e].id) {
            this.layers[s] = t[e];
            break;
          }
          s += 1;
        }
    }, fe.prototype.setProjectInterface = function(t) {
      this.globalData.projectInterface = t;
    }, fe.prototype.initItems = function() {
      this.globalData.progressiveLoad || this.buildAllItems();
    }, fe.prototype.buildElementParenting = function(t, e, i) {
      for (var s = this.elements, o = this.layers, n = 0, c = o.length; n < c; )
        o[n].ind == e && (!s[n] || s[n] === !0 ? (this.buildItem(n), this.addPendingElement(t)) : (i.push(s[n]), s[n].setAsParent(), o[n].parent !== void 0 ? this.buildElementParenting(t, o[n].parent, i) : t.setHierarchy(i))), n += 1;
    }, fe.prototype.addPendingElement = function(t) {
      this.pendingElements.push(t);
    }, fe.prototype.searchExtraCompositions = function(t) {
      var e, i = t.length;
      for (e = 0; e < i; e += 1)
        if (t[e].xt) {
          var s = this.createComp(t[e]);
          s.initExpressions(), this.globalData.projectInterface.registerComposition(s);
        }
    }, fe.prototype.getElementById = function(t) {
      var e, i = this.elements.length;
      for (e = 0; e < i; e += 1)
        if (this.elements[e].data.ind === t)
          return this.elements[e];
      return null;
    }, fe.prototype.getElementByPath = function(t) {
      var e = t.shift(), i;
      if (typeof e == "number")
        i = this.elements[e];
      else {
        var s, o = this.elements.length;
        for (s = 0; s < o; s += 1)
          if (this.elements[s].data.nm === e) {
            i = this.elements[s];
            break;
          }
      }
      return t.length === 0 ? i : i.getElementByPath(t);
    }, fe.prototype.setupGlobalData = function(t, e) {
      this.globalData.fontManager = new Tt(), this.globalData.slotManager = he(t), this.globalData.fontManager.addChars(t.chars), this.globalData.fontManager.addFonts(t.fonts, e), this.globalData.getAssetData = this.animationItem.getAssetData.bind(this.animationItem), this.globalData.getAssetsPath = this.animationItem.getAssetsPath.bind(this.animationItem), this.globalData.imageLoader = this.animationItem.imagePreloader, this.globalData.audioController = this.animationItem.audioController, this.globalData.frameId = 0, this.globalData.frameRate = t.fr, this.globalData.nm = t.nm, this.globalData.compSize = {
        w: t.w,
        h: t.h
      };
    };
    var ga = {
      TRANSFORM_EFFECT: "transformEFfect"
    };
    function pr() {
    }
    pr.prototype = {
      initTransform: function() {
        var e = new Zt();
        this.finalTransform = {
          mProp: this.data.ks ? ki.getTransformProperty(this, this.data.ks, this) : {
            o: 0
          },
          _matMdf: !1,
          _localMatMdf: !1,
          _opMdf: !1,
          mat: e,
          localMat: e,
          localOpacity: 1
        }, this.data.ao && (this.finalTransform.mProp.autoOriented = !0), this.data.ty;
      },
      renderTransform: function() {
        if (this.finalTransform._opMdf = this.finalTransform.mProp.o._mdf || this._isFirstFrame, this.finalTransform._matMdf = this.finalTransform.mProp._mdf || this._isFirstFrame, this.hierarchy) {
          var e, i = this.finalTransform.mat, s = 0, o = this.hierarchy.length;
          if (!this.finalTransform._matMdf)
            for (; s < o; ) {
              if (this.hierarchy[s].finalTransform.mProp._mdf) {
                this.finalTransform._matMdf = !0;
                break;
              }
              s += 1;
            }
          if (this.finalTransform._matMdf)
            for (e = this.finalTransform.mProp.v.props, i.cloneFromProps(e), s = 0; s < o; s += 1)
              i.multiply(this.hierarchy[s].finalTransform.mProp.v);
        }
        (!this.localTransforms || this.finalTransform._matMdf) && (this.finalTransform._localMatMdf = this.finalTransform._matMdf), this.finalTransform._opMdf && (this.finalTransform.localOpacity = this.finalTransform.mProp.o.v);
      },
      renderLocalTransform: function() {
        if (this.localTransforms) {
          var e = 0, i = this.localTransforms.length;
          if (this.finalTransform._localMatMdf = this.finalTransform._matMdf, !this.finalTransform._localMatMdf || !this.finalTransform._opMdf)
            for (; e < i; )
              this.localTransforms[e]._mdf && (this.finalTransform._localMatMdf = !0), this.localTransforms[e]._opMdf && !this.finalTransform._opMdf && (this.finalTransform.localOpacity = this.finalTransform.mProp.o.v, this.finalTransform._opMdf = !0), e += 1;
          if (this.finalTransform._localMatMdf) {
            var s = this.finalTransform.localMat;
            for (this.localTransforms[0].matrix.clone(s), e = 1; e < i; e += 1) {
              var o = this.localTransforms[e].matrix;
              s.multiply(o);
            }
            s.multiply(this.finalTransform.mat);
          }
          if (this.finalTransform._opMdf) {
            var n = this.finalTransform.localOpacity;
            for (e = 0; e < i; e += 1)
              n *= this.localTransforms[e].opacity * 0.01;
            this.finalTransform.localOpacity = n;
          }
        }
      },
      searchEffectTransforms: function() {
        if (this.renderableEffectsManager) {
          var e = this.renderableEffectsManager.getEffects(ga.TRANSFORM_EFFECT);
          if (e.length) {
            this.localTransforms = [], this.finalTransform.localMat = new Zt();
            var i = 0, s = e.length;
            for (i = 0; i < s; i += 1)
              this.localTransforms.push(e[i]);
          }
        }
      },
      globalToLocal: function(e) {
        var i = [];
        i.push(this.finalTransform);
        for (var s = !0, o = this.comp; s; )
          o.finalTransform ? (o.data.hasMask && i.splice(0, 0, o.finalTransform), o = o.comp) : s = !1;
        var n, c = i.length, _;
        for (n = 0; n < c; n += 1)
          _ = i[n].mat.applyToPointArray(0, 0, 0), e = [e[0] - _[0], e[1] - _[1], 0];
        return e;
      },
      mHelper: new Zt()
    };
    function Hi(t, e, i) {
      this.data = t, this.element = e, this.globalData = i, this.storedData = [], this.masksProperties = this.data.masksProperties || [], this.maskElement = null;
      var s = this.globalData.defs, o, n = this.masksProperties ? this.masksProperties.length : 0;
      this.viewData = rt(n), this.solidPath = "";
      var c, _ = this.masksProperties, u = 0, T = [], E, B, m = Et(), C, I, P, N, S = "clipPath", x = "clip-path";
      for (o = 0; o < n; o += 1)
        if ((_[o].mode !== "a" && _[o].mode !== "n" || _[o].inv || _[o].o.k !== 100 || _[o].o.x) && (S = "mask", x = "mask"), (_[o].mode === "s" || _[o].mode === "i") && u === 0 ? (C = ft("rect"), C.setAttribute("fill", "#ffffff"), C.setAttribute("width", this.element.comp.data.w || 0), C.setAttribute("height", this.element.comp.data.h || 0), T.push(C)) : C = null, c = ft("path"), _[o].mode === "n")
          this.viewData[o] = {
            op: Q.getProp(this.element, _[o].o, 0, 0.01, this.element),
            prop: _i.getShapeProp(this.element, _[o], 3),
            elem: c,
            lastPath: ""
          }, s.appendChild(c);
        else {
          u += 1, c.setAttribute("fill", _[o].mode === "s" ? "#000000" : "#ffffff"), c.setAttribute("clip-rule", "nonzero");
          var d;
          if (_[o].x.k !== 0 ? (S = "mask", x = "mask", N = Q.getProp(this.element, _[o].x, 0, null, this.element), d = Et(), I = ft("filter"), I.setAttribute("id", d), P = ft("feMorphology"), P.setAttribute("operator", "erode"), P.setAttribute("in", "SourceGraphic"), P.setAttribute("radius", "0"), I.appendChild(P), s.appendChild(I), c.setAttribute("stroke", _[o].mode === "s" ? "#000000" : "#ffffff")) : (P = null, N = null), this.storedData[o] = {
            elem: c,
            x: N,
            expan: P,
            lastPath: "",
            lastOperator: "",
            filterId: d,
            lastRadius: 0
          }, _[o].mode === "i") {
            B = T.length;
            var y = ft("g");
            for (E = 0; E < B; E += 1)
              y.appendChild(T[E]);
            var A = ft("mask");
            A.setAttribute("mask-type", "alpha"), A.setAttribute("id", m + "_" + u), A.appendChild(c), s.appendChild(A), y.setAttribute("mask", "url(" + W() + "#" + m + "_" + u + ")"), T.length = 0, T.push(y);
          } else
            T.push(c);
          _[o].inv && !this.solidPath && (this.solidPath = this.createLayerSolidPath()), this.viewData[o] = {
            elem: c,
            lastPath: "",
            op: Q.getProp(this.element, _[o].o, 0, 0.01, this.element),
            prop: _i.getShapeProp(this.element, _[o], 3),
            invRect: C
          }, this.viewData[o].prop.k || this.drawPath(_[o], this.viewData[o].prop.v, this.viewData[o]);
        }
      for (this.maskElement = ft(S), n = T.length, o = 0; o < n; o += 1)
        this.maskElement.appendChild(T[o]);
      u > 0 && (this.maskElement.setAttribute("id", m), this.element.maskedElement.setAttribute(x, "url(" + W() + "#" + m + ")"), s.appendChild(this.maskElement)), this.viewData.length && this.element.addRenderableComponent(this);
    }
    Hi.prototype.getMaskProperty = function(t) {
      return this.viewData[t].prop;
    }, Hi.prototype.renderFrame = function(t) {
      var e = this.element.finalTransform.mat, i, s = this.masksProperties.length;
      for (i = 0; i < s; i += 1)
        if ((this.viewData[i].prop._mdf || t) && this.drawPath(this.masksProperties[i], this.viewData[i].prop.v, this.viewData[i]), (this.viewData[i].op._mdf || t) && this.viewData[i].elem.setAttribute("fill-opacity", this.viewData[i].op.v), this.masksProperties[i].mode !== "n" && (this.viewData[i].invRect && (this.element.finalTransform.mProp._mdf || t) && this.viewData[i].invRect.setAttribute("transform", e.getInverseMatrix().to2dCSS()), this.storedData[i].x && (this.storedData[i].x._mdf || t))) {
          var o = this.storedData[i].expan;
          this.storedData[i].x.v < 0 ? (this.storedData[i].lastOperator !== "erode" && (this.storedData[i].lastOperator = "erode", this.storedData[i].elem.setAttribute("filter", "url(" + W() + "#" + this.storedData[i].filterId + ")")), o.setAttribute("radius", -this.storedData[i].x.v)) : (this.storedData[i].lastOperator !== "dilate" && (this.storedData[i].lastOperator = "dilate", this.storedData[i].elem.setAttribute("filter", null)), this.storedData[i].elem.setAttribute("stroke-width", this.storedData[i].x.v * 2));
        }
    }, Hi.prototype.getMaskelement = function() {
      return this.maskElement;
    }, Hi.prototype.createLayerSolidPath = function() {
      var t = "M0,0 ";
      return t += " h" + this.globalData.compSize.w, t += " v" + this.globalData.compSize.h, t += " h-" + this.globalData.compSize.w, t += " v-" + this.globalData.compSize.h + " ", t;
    }, Hi.prototype.drawPath = function(t, e, i) {
      var s = " M" + e.v[0][0] + "," + e.v[0][1], o, n;
      for (n = e._length, o = 1; o < n; o += 1)
        s += " C" + e.o[o - 1][0] + "," + e.o[o - 1][1] + " " + e.i[o][0] + "," + e.i[o][1] + " " + e.v[o][0] + "," + e.v[o][1];
      if (e.c && n > 1 && (s += " C" + e.o[o - 1][0] + "," + e.o[o - 1][1] + " " + e.i[0][0] + "," + e.i[0][1] + " " + e.v[0][0] + "," + e.v[0][1]), i.lastPath !== s) {
        var c = "";
        i.elem && (e.c && (c = t.inv ? this.solidPath + s : s), i.elem.setAttribute("d", c)), i.lastPath = s;
      }
    }, Hi.prototype.destroy = function() {
      this.element = null, this.globalData = null, this.maskElement = null, this.data = null, this.masksProperties = null;
    };
    var Nr = function() {
      var t = {};
      t.createFilter = e, t.createAlphaToLuminanceFilter = i;
      function e(s, o) {
        var n = ft("filter");
        return n.setAttribute("id", s), o !== !0 && (n.setAttribute("filterUnits", "objectBoundingBox"), n.setAttribute("x", "0%"), n.setAttribute("y", "0%"), n.setAttribute("width", "100%"), n.setAttribute("height", "100%")), n;
      }
      function i() {
        var s = ft("feColorMatrix");
        return s.setAttribute("type", "matrix"), s.setAttribute("color-interpolation-filters", "sRGB"), s.setAttribute("values", "0 0 0 1 0  0 0 0 1 0  0 0 0 1 0  0 0 0 1 1"), s;
      }
      return t;
    }(), Fn = function() {
      var t = {
        maskType: !0,
        svgLumaHidden: !0,
        offscreenCanvas: typeof OffscreenCanvas < "u"
      };
      return (/MSIE 10/i.test(navigator.userAgent) || /MSIE 9/i.test(navigator.userAgent) || /rv:11.0/i.test(navigator.userAgent) || /Edge\/\d./i.test(navigator.userAgent)) && (t.maskType = !1), /firefox/i.test(navigator.userAgent) && (t.svgLumaHidden = !1), t;
    }(), qs = {}, Rn = "filter_result_";
    function Gs(t) {
      var e, i = "SourceGraphic", s = t.data.ef ? t.data.ef.length : 0, o = Et(), n = Nr.createFilter(o, !0), c = 0;
      this.filters = [];
      var _;
      for (e = 0; e < s; e += 1) {
        _ = null;
        var u = t.data.ef[e].ty;
        if (qs[u]) {
          var T = qs[u].effect;
          _ = new T(n, t.effectsManager.effectElements[e], t, Rn + c, i), i = Rn + c, qs[u].countsAsEffect && (c += 1);
        }
        _ && this.filters.push(_);
      }
      c && (t.globalData.defs.appendChild(n), t.layerElement.setAttribute("filter", "url(" + W() + "#" + o + ")")), this.filters.length && t.addRenderableComponent(this);
    }
    Gs.prototype.renderFrame = function(t) {
      var e, i = this.filters.length;
      for (e = 0; e < i; e += 1)
        this.filters[e].renderFrame(t);
    }, Gs.prototype.getEffects = function(t) {
      var e, i = this.filters.length, s = [];
      for (e = 0; e < i; e += 1)
        this.filters[e].type === t && s.push(this.filters[e]);
      return s;
    };
    function zr() {
    }
    zr.prototype = {
      initRendererElement: function() {
        this.layerElement = ft("g");
      },
      createContainerElements: function() {
        this.matteElement = ft("g"), this.transformedElement = this.layerElement, this.maskedElement = this.layerElement, this._sizeChanged = !1;
        var e = null;
        if (this.data.td) {
          this.matteMasks = {};
          var i = ft("g");
          i.setAttribute("id", this.layerId), i.appendChild(this.layerElement), e = i, this.globalData.defs.appendChild(i);
        } else this.data.tt ? (this.matteElement.appendChild(this.layerElement), e = this.matteElement, this.baseElement = this.matteElement) : this.baseElement = this.layerElement;
        if (this.data.ln && this.layerElement.setAttribute("id", this.data.ln), this.data.cl && this.layerElement.setAttribute("class", this.data.cl), this.data.ty === 0 && !this.data.hd) {
          var s = ft("clipPath"), o = ft("path");
          o.setAttribute("d", "M0,0 L" + this.data.w + ",0 L" + this.data.w + "," + this.data.h + " L0," + this.data.h + "z");
          var n = Et();
          if (s.setAttribute("id", n), s.appendChild(o), this.globalData.defs.appendChild(s), this.checkMasks()) {
            var c = ft("g");
            c.setAttribute("clip-path", "url(" + W() + "#" + n + ")"), c.appendChild(this.layerElement), this.transformedElement = c, e ? e.appendChild(this.transformedElement) : this.baseElement = this.transformedElement;
          } else
            this.layerElement.setAttribute("clip-path", "url(" + W() + "#" + n + ")");
        }
        this.data.bm !== 0 && this.setBlendMode();
      },
      renderElement: function() {
        this.finalTransform._localMatMdf && this.transformedElement.setAttribute("transform", this.finalTransform.localMat.to2dCSS()), this.finalTransform._opMdf && this.transformedElement.setAttribute("opacity", this.finalTransform.localOpacity);
      },
      destroyBaseElement: function() {
        this.layerElement = null, this.matteElement = null, this.maskManager.destroy();
      },
      getBaseElement: function() {
        return this.data.hd ? null : this.baseElement;
      },
      createRenderableComponents: function() {
        this.maskManager = new Hi(this.data, this, this.globalData), this.renderableEffectsManager = new Gs(this), this.searchEffectTransforms();
      },
      getMatte: function(e) {
        if (this.matteMasks || (this.matteMasks = {}), !this.matteMasks[e]) {
          var i = this.layerId + "_" + e, s, o, n, c;
          if (e === 1 || e === 3) {
            var _ = ft("mask");
            _.setAttribute("id", i), _.setAttribute("mask-type", e === 3 ? "luminance" : "alpha"), n = ft("use"), n.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#" + this.layerId), _.appendChild(n), this.globalData.defs.appendChild(_), !Fn.maskType && e === 1 && (_.setAttribute("mask-type", "luminance"), s = Et(), o = Nr.createFilter(s), this.globalData.defs.appendChild(o), o.appendChild(Nr.createAlphaToLuminanceFilter()), c = ft("g"), c.appendChild(n), _.appendChild(c), c.setAttribute("filter", "url(" + W() + "#" + s + ")"));
          } else if (e === 2) {
            var u = ft("mask");
            u.setAttribute("id", i), u.setAttribute("mask-type", "alpha");
            var T = ft("g");
            u.appendChild(T), s = Et(), o = Nr.createFilter(s);
            var E = ft("feComponentTransfer");
            E.setAttribute("in", "SourceGraphic"), o.appendChild(E);
            var B = ft("feFuncA");
            B.setAttribute("type", "table"), B.setAttribute("tableValues", "1.0 0.0"), E.appendChild(B), this.globalData.defs.appendChild(o);
            var m = ft("rect");
            m.setAttribute("width", this.comp.data.w), m.setAttribute("height", this.comp.data.h), m.setAttribute("x", "0"), m.setAttribute("y", "0"), m.setAttribute("fill", "#ffffff"), m.setAttribute("opacity", "0"), T.setAttribute("filter", "url(" + W() + "#" + s + ")"), T.appendChild(m), n = ft("use"), n.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#" + this.layerId), T.appendChild(n), Fn.maskType || (u.setAttribute("mask-type", "luminance"), o.appendChild(Nr.createAlphaToLuminanceFilter()), c = ft("g"), T.appendChild(m), c.appendChild(this.layerElement), T.appendChild(c)), this.globalData.defs.appendChild(u);
          }
          this.matteMasks[e] = i;
        }
        return this.matteMasks[e];
      },
      setMatte: function(e) {
        this.matteElement && this.matteElement.setAttribute("mask", "url(" + W() + "#" + e + ")");
      }
    };
    function dr() {
    }
    dr.prototype = {
      /**
         * @function
         * Initializes hierarchy properties
         *
         */
      initHierarchy: function() {
        this.hierarchy = [], this._isParent = !1, this.checkParenting();
      },
      /**
         * @function
         * Sets layer's hierarchy.
         * @param {array} hierarch
         * layer's parent list
         *
         */
      setHierarchy: function(e) {
        this.hierarchy = e;
      },
      /**
         * @function
         * Sets layer as parent.
         *
         */
      setAsParent: function() {
        this._isParent = !0;
      },
      /**
         * @function
         * Searches layer's parenting chain
         *
         */
      checkParenting: function() {
        this.data.parent !== void 0 && this.comp.buildElementParenting(this, this.data.parent, []);
      }
    };
    function Dr() {
    }
    (function() {
      var t = {
        initElement: function(i, s, o) {
          this.initFrame(), this.initBaseData(i, s, o), this.initTransform(i, s, o), this.initHierarchy(), this.initRenderable(), this.initRendererElement(), this.createContainerElements(), this.createRenderableComponents(), this.createContent(), this.hide();
        },
        hide: function() {
          if (!this.hidden && (!this.isInRange || this.isTransparent)) {
            var i = this.baseElement || this.layerElement;
            i.style.display = "none", this.hidden = !0;
          }
        },
        show: function() {
          if (this.isInRange && !this.isTransparent) {
            if (!this.data.hd) {
              var i = this.baseElement || this.layerElement;
              i.style.display = "block";
            }
            this.hidden = !1, this._isFirstFrame = !0;
          }
        },
        renderFrame: function() {
          this.data.hd || this.hidden || (this.renderTransform(), this.renderRenderable(), this.renderLocalTransform(), this.renderElement(), this.renderInnerContent(), this._isFirstFrame && (this._isFirstFrame = !1));
        },
        renderInnerContent: function() {
        },
        prepareFrame: function(i) {
          this._mdf = !1, this.prepareRenderableFrame(i), this.prepareProperties(i, this.isInRange), this.checkTransparency();
        },
        destroy: function() {
          this.innerElem = null, this.destroyBaseElement();
        }
      };
      U([xi, R(t)], Dr);
    })();
    function Br(t, e, i) {
      this.assetData = e.getAssetData(t.refId), this.assetData && this.assetData.sid && (this.assetData = e.slotManager.getProp(this.assetData)), this.initElement(t, e, i), this.sourceRect = {
        top: 0,
        left: 0,
        width: this.assetData.w,
        height: this.assetData.h
      };
    }
    U([Ti, pr, zr, dr, Ai, Dr], Br), Br.prototype.createContent = function() {
      var t = this.globalData.getAssetsPath(this.assetData);
      this.innerElem = ft("image"), this.innerElem.setAttribute("width", this.assetData.w + "px"), this.innerElem.setAttribute("height", this.assetData.h + "px"), this.innerElem.setAttribute("preserveAspectRatio", this.assetData.pr || this.globalData.renderConfig.imagePreserveAspectRatio), this.innerElem.setAttributeNS("http://www.w3.org/1999/xlink", "href", t), this.layerElement.appendChild(this.innerElem);
    }, Br.prototype.sourceRectAtTime = function() {
      return this.sourceRect;
    };
    function va(t, e) {
      this.elem = t, this.pos = e;
    }
    function On() {
    }
    On.prototype = {
      addShapeToModifiers: function(e) {
        var i, s = this.shapeModifiers.length;
        for (i = 0; i < s; i += 1)
          this.shapeModifiers[i].addShape(e);
      },
      isShapeInAnimatedModifiers: function(e) {
        for (var i = 0, s = this.shapeModifiers.length; i < s; )
          if (this.shapeModifiers[i].isAnimatedWithShape(e))
            return !0;
        return !1;
      },
      renderModifiers: function() {
        if (this.shapeModifiers.length) {
          var e, i = this.shapes.length;
          for (e = 0; e < i; e += 1)
            this.shapes[e].sh.reset();
          i = this.shapeModifiers.length;
          var s;
          for (e = i - 1; e >= 0 && (s = this.shapeModifiers[e].processShapes(this._isFirstFrame), !s); e -= 1)
            ;
        }
      },
      searchProcessedElement: function(e) {
        for (var i = this.processedElements, s = 0, o = i.length; s < o; ) {
          if (i[s].elem === e)
            return i[s].pos;
          s += 1;
        }
        return 0;
      },
      addProcessedElement: function(e, i) {
        for (var s = this.processedElements, o = s.length; o; )
          if (o -= 1, s[o].elem === e) {
            s[o].pos = i;
            return;
          }
        s.push(new va(e, i));
      },
      prepareFrame: function(e) {
        this.prepareRenderableFrame(e), this.prepareProperties(e, this.isInRange);
      }
    };
    var Nn = {
      1: "butt",
      2: "round",
      3: "square"
    }, zn = {
      1: "miter",
      2: "round",
      3: "bevel"
    };
    function Dn(t, e, i) {
      this.caches = [], this.styles = [], this.transformers = t, this.lStr = "", this.sh = i, this.lvl = e, this._isAnimated = !!i.k;
      for (var s = 0, o = t.length; s < o; ) {
        if (t[s].mProps.dynamicProperties.length) {
          this._isAnimated = !0;
          break;
        }
        s += 1;
      }
    }
    Dn.prototype.setAsAnimated = function() {
      this._isAnimated = !0;
    };
    function Bn(t, e) {
      this.data = t, this.type = t.ty, this.d = "", this.lvl = e, this._mdf = !1, this.closed = t.hd === !0, this.pElem = ft("path"), this.msElem = null;
    }
    Bn.prototype.reset = function() {
      this.d = "", this._mdf = !1;
    };
    function fs(t, e, i, s) {
      this.elem = t, this.frameId = -1, this.dataProps = rt(e.length), this.renderer = i, this.k = !1, this.dashStr = "", this.dashArray = tt("float32", e.length ? e.length - 1 : 0), this.dashoffset = tt("float32", 1), this.initDynamicPropertyContainer(s);
      var o, n = e.length || 0, c;
      for (o = 0; o < n; o += 1)
        c = Q.getProp(t, e[o].v, 0, 0, this), this.k = c.k || this.k, this.dataProps[o] = {
          n: e[o].n,
          p: c
        };
      this.k || this.getValue(!0), this._isAnimated = this.k;
    }
    fs.prototype.getValue = function(t) {
      if (!(this.elem.globalData.frameId === this.frameId && !t) && (this.frameId = this.elem.globalData.frameId, this.iterateDynamicProperties(), this._mdf = this._mdf || t, this._mdf)) {
        var e = 0, i = this.dataProps.length;
        for (this.renderer === "svg" && (this.dashStr = ""), e = 0; e < i; e += 1)
          this.dataProps[e].n !== "o" ? this.renderer === "svg" ? this.dashStr += " " + this.dataProps[e].p.v : this.dashArray[e] = this.dataProps[e].p.v : this.dashoffset[0] = this.dataProps[e].p.v;
      }
    }, U([Xt], fs);
    function Vn(t, e, i) {
      this.initDynamicPropertyContainer(t), this.getValue = this.iterateDynamicProperties, this.o = Q.getProp(t, e.o, 0, 0.01, this), this.w = Q.getProp(t, e.w, 0, null, this), this.d = new fs(t, e.d || {}, "svg", this), this.c = Q.getProp(t, e.c, 1, 255, this), this.style = i, this._isAnimated = !!this._isAnimated;
    }
    U([Xt], Vn);
    function $n(t, e, i) {
      this.initDynamicPropertyContainer(t), this.getValue = this.iterateDynamicProperties, this.o = Q.getProp(t, e.o, 0, 0.01, this), this.c = Q.getProp(t, e.c, 1, 255, this), this.style = i;
    }
    U([Xt], $n);
    function jn(t, e, i) {
      this.initDynamicPropertyContainer(t), this.getValue = this.iterateDynamicProperties, this.style = i;
    }
    U([Xt], jn);
    function Vr(t, e, i) {
      this.data = e, this.c = tt("uint8c", e.p * 4);
      var s = e.k.k[0].s ? e.k.k[0].s.length - e.p * 4 : e.k.k.length - e.p * 4;
      this.o = tt("float32", s), this._cmdf = !1, this._omdf = !1, this._collapsable = this.checkCollapsable(), this._hasOpacity = s, this.initDynamicPropertyContainer(i), this.prop = Q.getProp(t, e.k, 1, null, this), this.k = this.prop.k, this.getValue(!0);
    }
    Vr.prototype.comparePoints = function(t, e) {
      for (var i = 0, s = this.o.length / 2, o; i < s; ) {
        if (o = Math.abs(t[i * 4] - t[e * 4 + i * 2]), o > 0.01)
          return !1;
        i += 1;
      }
      return !0;
    }, Vr.prototype.checkCollapsable = function() {
      if (this.o.length / 2 !== this.c.length / 4)
        return !1;
      if (this.data.k.k[0].s)
        for (var t = 0, e = this.data.k.k.length; t < e; ) {
          if (!this.comparePoints(this.data.k.k[t].s, this.data.p))
            return !1;
          t += 1;
        }
      else if (!this.comparePoints(this.data.k.k, this.data.p))
        return !1;
      return !0;
    }, Vr.prototype.getValue = function(t) {
      if (this.prop.getValue(), this._mdf = !1, this._cmdf = !1, this._omdf = !1, this.prop._mdf || t) {
        var e, i = this.data.p * 4, s, o;
        for (e = 0; e < i; e += 1)
          s = e % 4 === 0 ? 100 : 255, o = Math.round(this.prop.v[e] * s), this.c[e] !== o && (this.c[e] = o, this._cmdf = !t);
        if (this.o.length)
          for (i = this.prop.v.length, e = this.data.p * 4; e < i; e += 1)
            s = e % 2 === 0 ? 100 : 1, o = e % 2 === 0 ? Math.round(this.prop.v[e] * 100) : this.prop.v[e], this.o[e - this.data.p * 4] !== o && (this.o[e - this.data.p * 4] = o, this._omdf = !t);
        this._mdf = !t;
      }
    }, U([Xt], Vr);
    function mr(t, e, i) {
      this.initDynamicPropertyContainer(t), this.getValue = this.iterateDynamicProperties, this.initGradientData(t, e, i);
    }
    mr.prototype.initGradientData = function(t, e, i) {
      this.o = Q.getProp(t, e.o, 0, 0.01, this), this.s = Q.getProp(t, e.s, 1, null, this), this.e = Q.getProp(t, e.e, 1, null, this), this.h = Q.getProp(t, e.h || {
        k: 0
      }, 0, 0.01, this), this.a = Q.getProp(t, e.a || {
        k: 0
      }, 0, At, this), this.g = new Vr(t, e.g, this), this.style = i, this.stops = [], this.setGradientData(i.pElem, e), this.setGradientOpacity(e, i), this._isAnimated = !!this._isAnimated;
    }, mr.prototype.setGradientData = function(t, e) {
      var i = Et(), s = ft(e.t === 1 ? "linearGradient" : "radialGradient");
      s.setAttribute("id", i), s.setAttribute("spreadMethod", "pad"), s.setAttribute("gradientUnits", "userSpaceOnUse");
      var o = [], n, c, _;
      for (_ = e.g.p * 4, c = 0; c < _; c += 4)
        n = ft("stop"), s.appendChild(n), o.push(n);
      t.setAttribute(e.ty === "gf" ? "fill" : "stroke", "url(" + W() + "#" + i + ")"), this.gf = s, this.cst = o;
    }, mr.prototype.setGradientOpacity = function(t, e) {
      if (this.g._hasOpacity && !this.g._collapsable) {
        var i, s, o, n = ft("mask"), c = ft("path");
        n.appendChild(c);
        var _ = Et(), u = Et();
        n.setAttribute("id", u);
        var T = ft(t.t === 1 ? "linearGradient" : "radialGradient");
        T.setAttribute("id", _), T.setAttribute("spreadMethod", "pad"), T.setAttribute("gradientUnits", "userSpaceOnUse"), o = t.g.k.k[0].s ? t.g.k.k[0].s.length : t.g.k.k.length;
        var E = this.stops;
        for (s = t.g.p * 4; s < o; s += 2)
          i = ft("stop"), i.setAttribute("stop-color", "rgb(255,255,255)"), T.appendChild(i), E.push(i);
        c.setAttribute(t.ty === "gf" ? "fill" : "stroke", "url(" + W() + "#" + _ + ")"), t.ty === "gs" && (c.setAttribute("stroke-linecap", Nn[t.lc || 2]), c.setAttribute("stroke-linejoin", zn[t.lj || 2]), t.lj === 1 && c.setAttribute("stroke-miterlimit", t.ml)), this.of = T, this.ms = n, this.ost = E, this.maskId = u, e.msElem = c;
      }
    }, U([Xt], mr);
    function Wn(t, e, i) {
      this.initDynamicPropertyContainer(t), this.getValue = this.iterateDynamicProperties, this.w = Q.getProp(t, e.w, 0, null, this), this.d = new fs(t, e.d || {}, "svg", this), this.initGradientData(t, e, i), this._isAnimated = !!this._isAnimated;
    }
    U([mr, Xt], Wn);
    function ya() {
      this.it = [], this.prevViewData = [], this.gr = ft("g");
    }
    function _a(t, e, i) {
      this.transform = {
        mProps: t,
        op: e,
        container: i
      }, this.elements = [], this._isAnimated = this.transform.mProps.dynamicProperties.length || this.transform.op.effectsSequence.length;
    }
    var Hn = function(e, i, s, o) {
      if (i === 0)
        return "";
      var n = e.o, c = e.i, _ = e.v, u, T = " M" + o.applyToPointStringified(_[0][0], _[0][1]);
      for (u = 1; u < i; u += 1)
        T += " C" + o.applyToPointStringified(n[u - 1][0], n[u - 1][1]) + " " + o.applyToPointStringified(c[u][0], c[u][1]) + " " + o.applyToPointStringified(_[u][0], _[u][1]);
      return s && i && (T += " C" + o.applyToPointStringified(n[u - 1][0], n[u - 1][1]) + " " + o.applyToPointStringified(c[0][0], c[0][1]) + " " + o.applyToPointStringified(_[0][0], _[0][1]), T += "z"), T;
    }, ba = function() {
      var t = new Zt(), e = new Zt(), i = {
        createRenderFunction: s
      };
      function s(B) {
        switch (B.ty) {
          case "fl":
            return _;
          case "gf":
            return T;
          case "gs":
            return u;
          case "st":
            return E;
          case "sh":
          case "el":
          case "rc":
          case "sr":
            return c;
          case "tr":
            return o;
          case "no":
            return n;
          default:
            return null;
        }
      }
      function o(B, m, C) {
        (C || m.transform.op._mdf) && m.transform.container.setAttribute("opacity", m.transform.op.v), (C || m.transform.mProps._mdf) && m.transform.container.setAttribute("transform", m.transform.mProps.v.to2dCSS());
      }
      function n() {
      }
      function c(B, m, C) {
        var I, P, N, S, x, d, y = m.styles.length, A = m.lvl, L, D, j, Y;
        for (d = 0; d < y; d += 1) {
          if (S = m.sh._mdf || C, m.styles[d].lvl < A) {
            for (D = e.reset(), j = A - m.styles[d].lvl, Y = m.transformers.length - 1; !S && j > 0; )
              S = m.transformers[Y].mProps._mdf || S, j -= 1, Y -= 1;
            if (S)
              for (j = A - m.styles[d].lvl, Y = m.transformers.length - 1; j > 0; )
                D.multiply(m.transformers[Y].mProps.v), j -= 1, Y -= 1;
          } else
            D = t;
          if (L = m.sh.paths, P = L._length, S) {
            for (N = "", I = 0; I < P; I += 1)
              x = L.shapes[I], x && x._length && (N += Hn(x, x._length, x.c, D));
            m.caches[d] = N;
          } else
            N = m.caches[d];
          m.styles[d].d += B.hd === !0 ? "" : N, m.styles[d]._mdf = S || m.styles[d]._mdf;
        }
      }
      function _(B, m, C) {
        var I = m.style;
        (m.c._mdf || C) && I.pElem.setAttribute("fill", "rgb(" + Bt(m.c.v[0]) + "," + Bt(m.c.v[1]) + "," + Bt(m.c.v[2]) + ")"), (m.o._mdf || C) && I.pElem.setAttribute("fill-opacity", m.o.v);
      }
      function u(B, m, C) {
        T(B, m, C), E(B, m, C);
      }
      function T(B, m, C) {
        var I = m.gf, P = m.g._hasOpacity, N = m.s.v, S = m.e.v;
        if (m.o._mdf || C) {
          var x = B.ty === "gf" ? "fill-opacity" : "stroke-opacity";
          m.style.pElem.setAttribute(x, m.o.v);
        }
        if (m.s._mdf || C) {
          var d = B.t === 1 ? "x1" : "cx", y = d === "x1" ? "y1" : "cy";
          I.setAttribute(d, N[0]), I.setAttribute(y, N[1]), P && !m.g._collapsable && (m.of.setAttribute(d, N[0]), m.of.setAttribute(y, N[1]));
        }
        var A, L, D, j;
        if (m.g._cmdf || C) {
          A = m.cst;
          var Y = m.g.c;
          for (D = A.length, L = 0; L < D; L += 1)
            j = A[L], j.setAttribute("offset", Y[L * 4] + "%"), j.setAttribute("stop-color", "rgb(" + Y[L * 4 + 1] + "," + Y[L * 4 + 2] + "," + Y[L * 4 + 3] + ")");
        }
        if (P && (m.g._omdf || C)) {
          var ct = m.g.o;
          for (m.g._collapsable ? A = m.cst : A = m.ost, D = A.length, L = 0; L < D; L += 1)
            j = A[L], m.g._collapsable || j.setAttribute("offset", ct[L * 2] + "%"), j.setAttribute("stop-opacity", ct[L * 2 + 1]);
        }
        if (B.t === 1)
          (m.e._mdf || C) && (I.setAttribute("x2", S[0]), I.setAttribute("y2", S[1]), P && !m.g._collapsable && (m.of.setAttribute("x2", S[0]), m.of.setAttribute("y2", S[1])));
        else {
          var ot;
          if ((m.s._mdf || m.e._mdf || C) && (ot = Math.sqrt(Math.pow(N[0] - S[0], 2) + Math.pow(N[1] - S[1], 2)), I.setAttribute("r", ot), P && !m.g._collapsable && m.of.setAttribute("r", ot)), m.s._mdf || m.e._mdf || m.h._mdf || m.a._mdf || C) {
            ot || (ot = Math.sqrt(Math.pow(N[0] - S[0], 2) + Math.pow(N[1] - S[1], 2)));
            var K = Math.atan2(S[1] - N[1], S[0] - N[0]), pt = m.h.v;
            pt >= 1 ? pt = 0.99 : pt <= -1 && (pt = -0.99);
            var it = ot * pt, G = Math.cos(K + m.a.v) * it + N[0], w = Math.sin(K + m.a.v) * it + N[1];
            I.setAttribute("fx", G), I.setAttribute("fy", w), P && !m.g._collapsable && (m.of.setAttribute("fx", G), m.of.setAttribute("fy", w));
          }
        }
      }
      function E(B, m, C) {
        var I = m.style, P = m.d;
        P && (P._mdf || C) && P.dashStr && (I.pElem.setAttribute("stroke-dasharray", P.dashStr), I.pElem.setAttribute("stroke-dashoffset", P.dashoffset[0])), m.c && (m.c._mdf || C) && I.pElem.setAttribute("stroke", "rgb(" + Bt(m.c.v[0]) + "," + Bt(m.c.v[1]) + "," + Bt(m.c.v[2]) + ")"), (m.o._mdf || C) && I.pElem.setAttribute("stroke-opacity", m.o.v), (m.w._mdf || C) && (I.pElem.setAttribute("stroke-width", m.w.v), I.msElem && I.msElem.setAttribute("stroke-width", m.w.v));
      }
      return i;
    }();
    function Qt(t, e, i) {
      this.shapes = [], this.shapesData = t.shapes, this.stylesList = [], this.shapeModifiers = [], this.itemsData = [], this.processedElements = [], this.animatedContents = [], this.initElement(t, e, i), this.prevViewData = [];
    }
    U([Ti, pr, zr, On, dr, Ai, Dr], Qt), Qt.prototype.initSecondaryElement = function() {
    }, Qt.prototype.identityMatrix = new Zt(), Qt.prototype.buildExpressionInterface = function() {
    }, Qt.prototype.createContent = function() {
      this.searchShapes(this.shapesData, this.itemsData, this.prevViewData, this.layerElement, 0, [], !0), this.filterUniqueShapes();
    }, Qt.prototype.filterUniqueShapes = function() {
      var t, e = this.shapes.length, i, s, o = this.stylesList.length, n, c = [], _ = !1;
      for (s = 0; s < o; s += 1) {
        for (n = this.stylesList[s], _ = !1, c.length = 0, t = 0; t < e; t += 1)
          i = this.shapes[t], i.styles.indexOf(n) !== -1 && (c.push(i), _ = i._isAnimated || _);
        c.length > 1 && _ && this.setShapesAsAnimated(c);
      }
    }, Qt.prototype.setShapesAsAnimated = function(t) {
      var e, i = t.length;
      for (e = 0; e < i; e += 1)
        t[e].setAsAnimated();
    }, Qt.prototype.createStyleElement = function(t, e) {
      var i, s = new Bn(t, e), o = s.pElem;
      if (t.ty === "st")
        i = new Vn(this, t, s);
      else if (t.ty === "fl")
        i = new $n(this, t, s);
      else if (t.ty === "gf" || t.ty === "gs") {
        var n = t.ty === "gf" ? mr : Wn;
        i = new n(this, t, s), this.globalData.defs.appendChild(i.gf), i.maskId && (this.globalData.defs.appendChild(i.ms), this.globalData.defs.appendChild(i.of), o.setAttribute("mask", "url(" + W() + "#" + i.maskId + ")"));
      } else t.ty === "no" && (i = new jn(this, t, s));
      return (t.ty === "st" || t.ty === "gs") && (o.setAttribute("stroke-linecap", Nn[t.lc || 2]), o.setAttribute("stroke-linejoin", zn[t.lj || 2]), o.setAttribute("fill-opacity", "0"), t.lj === 1 && o.setAttribute("stroke-miterlimit", t.ml)), t.r === 2 && o.setAttribute("fill-rule", "evenodd"), t.ln && o.setAttribute("id", t.ln), t.cl && o.setAttribute("class", t.cl), t.bm && (o.style["mix-blend-mode"] = ee(t.bm)), this.stylesList.push(s), this.addToAnimatedContents(t, i), i;
    }, Qt.prototype.createGroupElement = function(t) {
      var e = new ya();
      return t.ln && e.gr.setAttribute("id", t.ln), t.cl && e.gr.setAttribute("class", t.cl), t.bm && (e.gr.style["mix-blend-mode"] = ee(t.bm)), e;
    }, Qt.prototype.createTransformElement = function(t, e) {
      var i = ki.getTransformProperty(this, t, this), s = new _a(i, i.o, e);
      return this.addToAnimatedContents(t, s), s;
    }, Qt.prototype.createShapeElement = function(t, e, i) {
      var s = 4;
      t.ty === "rc" ? s = 5 : t.ty === "el" ? s = 6 : t.ty === "sr" && (s = 7);
      var o = _i.getShapeProp(this, t, s, this), n = new Dn(e, i, o);
      return this.shapes.push(n), this.addShapeToModifiers(n), this.addToAnimatedContents(t, n), n;
    }, Qt.prototype.addToAnimatedContents = function(t, e) {
      for (var i = 0, s = this.animatedContents.length; i < s; ) {
        if (this.animatedContents[i].element === e)
          return;
        i += 1;
      }
      this.animatedContents.push({
        fn: ba.createRenderFunction(t),
        element: e,
        data: t
      });
    }, Qt.prototype.setElementStyles = function(t) {
      var e = t.styles, i, s = this.stylesList.length;
      for (i = 0; i < s; i += 1)
        e.indexOf(this.stylesList[i]) === -1 && !this.stylesList[i].closed && e.push(this.stylesList[i]);
    }, Qt.prototype.reloadShapes = function() {
      this._isFirstFrame = !0;
      var t, e = this.itemsData.length;
      for (t = 0; t < e; t += 1)
        this.prevViewData[t] = this.itemsData[t];
      for (this.searchShapes(this.shapesData, this.itemsData, this.prevViewData, this.layerElement, 0, [], !0), this.filterUniqueShapes(), e = this.dynamicProperties.length, t = 0; t < e; t += 1)
        this.dynamicProperties[t].getValue();
      this.renderModifiers();
    }, Qt.prototype.searchShapes = function(t, e, i, s, o, n, c) {
      var _ = [].concat(n), u, T = t.length - 1, E, B, m = [], C = [], I, P, N;
      for (u = T; u >= 0; u -= 1) {
        if (N = this.searchProcessedElement(t[u]), N ? e[u] = i[N - 1] : t[u]._render = c, t[u].ty === "fl" || t[u].ty === "st" || t[u].ty === "gf" || t[u].ty === "gs" || t[u].ty === "no")
          N ? e[u].style.closed = t[u].hd : e[u] = this.createStyleElement(t[u], o), t[u]._render && e[u].style.pElem.parentNode !== s && s.appendChild(e[u].style.pElem), m.push(e[u].style);
        else if (t[u].ty === "gr") {
          if (!N)
            e[u] = this.createGroupElement(t[u]);
          else
            for (B = e[u].it.length, E = 0; E < B; E += 1)
              e[u].prevViewData[E] = e[u].it[E];
          this.searchShapes(t[u].it, e[u].it, e[u].prevViewData, e[u].gr, o + 1, _, c), t[u]._render && e[u].gr.parentNode !== s && s.appendChild(e[u].gr);
        } else t[u].ty === "tr" ? (N || (e[u] = this.createTransformElement(t[u], s)), I = e[u].transform, _.push(I)) : t[u].ty === "sh" || t[u].ty === "rc" || t[u].ty === "el" || t[u].ty === "sr" ? (N || (e[u] = this.createShapeElement(t[u], _, o)), this.setElementStyles(e[u])) : t[u].ty === "tm" || t[u].ty === "rd" || t[u].ty === "ms" || t[u].ty === "pb" || t[u].ty === "zz" || t[u].ty === "op" ? (N ? (P = e[u], P.closed = !1) : (P = qe.getModifier(t[u].ty), P.init(this, t[u]), e[u] = P, this.shapeModifiers.push(P)), C.push(P)) : t[u].ty === "rp" && (N ? (P = e[u], P.closed = !0) : (P = qe.getModifier(t[u].ty), e[u] = P, P.init(this, t, u, e), this.shapeModifiers.push(P), c = !1), C.push(P));
        this.addProcessedElement(t[u], u + 1);
      }
      for (T = m.length, u = 0; u < T; u += 1)
        m[u].closed = !0;
      for (T = C.length, u = 0; u < T; u += 1)
        C[u].closed = !0;
    }, Qt.prototype.renderInnerContent = function() {
      this.renderModifiers();
      var t, e = this.stylesList.length;
      for (t = 0; t < e; t += 1)
        this.stylesList[t].reset();
      for (this.renderShape(), t = 0; t < e; t += 1)
        (this.stylesList[t]._mdf || this._isFirstFrame) && (this.stylesList[t].msElem && (this.stylesList[t].msElem.setAttribute("d", this.stylesList[t].d), this.stylesList[t].d = "M0 0" + this.stylesList[t].d), this.stylesList[t].pElem.setAttribute("d", this.stylesList[t].d || "M0 0"));
    }, Qt.prototype.renderShape = function() {
      var t, e = this.animatedContents.length, i;
      for (t = 0; t < e; t += 1)
        i = this.animatedContents[t], (this._isFirstFrame || i.element._isAnimated) && i.data !== !0 && i.fn(i.data, i.element, this._isFirstFrame);
    }, Qt.prototype.destroy = function() {
      this.destroyBaseElement(), this.shapesData = null, this.itemsData = null;
    };
    function Ys(t, e, i, s, o, n) {
      this.o = t, this.sw = e, this.sc = i, this.fc = s, this.m = o, this.p = n, this._mdf = {
        o: !0,
        sw: !!e,
        sc: !!i,
        fc: !!s,
        m: !0,
        p: !0
      };
    }
    Ys.prototype.update = function(t, e, i, s, o, n) {
      this._mdf.o = !1, this._mdf.sw = !1, this._mdf.sc = !1, this._mdf.fc = !1, this._mdf.m = !1, this._mdf.p = !1;
      var c = !1;
      return this.o !== t && (this.o = t, this._mdf.o = !0, c = !0), this.sw !== e && (this.sw = e, this._mdf.sw = !0, c = !0), this.sc !== i && (this.sc = i, this._mdf.sc = !0, c = !0), this.fc !== s && (this.fc = s, this._mdf.fc = !0, c = !0), this.m !== o && (this.m = o, this._mdf.m = !0, c = !0), n.length && (this.p[0] !== n[0] || this.p[1] !== n[1] || this.p[4] !== n[4] || this.p[5] !== n[5] || this.p[12] !== n[12] || this.p[13] !== n[13]) && (this.p = n, this._mdf.p = !0, c = !0), c;
    };
    function de(t, e) {
      this._frameId = v, this.pv = "", this.v = "", this.kf = !1, this._isFirstFrame = !0, this._mdf = !1, e.d && e.d.sid && (e.d = t.globalData.slotManager.getProp(e.d)), this.data = e, this.elem = t, this.comp = this.elem.comp, this.keysIndex = 0, this.canResize = !1, this.minimumFontSize = 1, this.effectsSequence = [], this.currentData = {
        ascent: 0,
        boxWidth: this.defaultBoxWidth,
        f: "",
        fStyle: "",
        fWeight: "",
        fc: "",
        j: "",
        justifyOffset: "",
        l: [],
        lh: 0,
        lineWidths: [],
        ls: "",
        of: "",
        s: "",
        sc: "",
        sw: 0,
        t: 0,
        tr: 0,
        sz: 0,
        ps: null,
        fillColorAnim: !1,
        strokeColorAnim: !1,
        strokeWidthAnim: !1,
        yOffset: 0,
        finalSize: 0,
        finalText: [],
        finalLineHeight: 0,
        __complete: !1
      }, this.copyData(this.currentData, this.data.d.k[0].s), this.searchProperty() || this.completeTextData(this.currentData);
    }
    de.prototype.defaultBoxWidth = [0, 0], de.prototype.copyData = function(t, e) {
      for (var i in e)
        Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
      return t;
    }, de.prototype.setCurrentData = function(t) {
      t.__complete || this.completeTextData(t), this.currentData = t, this.currentData.boxWidth = this.currentData.boxWidth || this.defaultBoxWidth, this._mdf = !0;
    }, de.prototype.searchProperty = function() {
      return this.searchKeyframes();
    }, de.prototype.searchKeyframes = function() {
      return this.kf = this.data.d.k.length > 1, this.kf && this.addEffect(this.getKeyframeValue.bind(this)), this.kf;
    }, de.prototype.addEffect = function(t) {
      this.effectsSequence.push(t), this.elem.addDynamicProperty(this);
    }, de.prototype.getValue = function(t) {
      if (!((this.elem.globalData.frameId === this.frameId || !this.effectsSequence.length) && !t)) {
        this.currentData.t = this.data.d.k[this.keysIndex].s.t;
        var e = this.currentData, i = this.keysIndex;
        if (this.lock) {
          this.setCurrentData(this.currentData);
          return;
        }
        this.lock = !0, this._mdf = !1;
        var s, o = this.effectsSequence.length, n = t || this.data.d.k[this.keysIndex].s;
        for (s = 0; s < o; s += 1)
          i !== this.keysIndex ? n = this.effectsSequence[s](n, n.t) : n = this.effectsSequence[s](this.currentData, n.t);
        e !== n && this.setCurrentData(n), this.v = this.currentData, this.pv = this.v, this.lock = !1, this.frameId = this.elem.globalData.frameId;
      }
    }, de.prototype.getKeyframeValue = function() {
      for (var t = this.data.d.k, e = this.elem.comp.renderedFrame, i = 0, s = t.length; i <= s - 1 && !(i === s - 1 || t[i + 1].t > e); )
        i += 1;
      return this.keysIndex !== i && (this.keysIndex = i), this.data.d.k[this.keysIndex].s;
    }, de.prototype.buildFinalText = function(t) {
      for (var e = [], i = 0, s = t.length, o, n, c = !1, _ = !1, u = ""; i < s; )
        c = _, _ = !1, o = t.charCodeAt(i), u = t.charAt(i), Tt.isCombinedCharacter(o) ? c = !0 : o >= 55296 && o <= 56319 ? Tt.isRegionalFlag(t, i) ? u = t.substr(i, 14) : (n = t.charCodeAt(i + 1), n >= 56320 && n <= 57343 && (Tt.isModifier(o, n) ? (u = t.substr(i, 2), c = !0) : Tt.isFlagEmoji(t.substr(i, 4)) ? u = t.substr(i, 4) : u = t.substr(i, 2))) : o > 56319 ? (n = t.charCodeAt(i + 1), Tt.isVariationSelector(o) && (c = !0)) : Tt.isZeroWidthJoiner(o) && (c = !0, _ = !0), c ? (e[e.length - 1] += u, c = !1) : e.push(u), i += u.length;
      return e;
    }, de.prototype.completeTextData = function(t) {
      t.__complete = !0;
      var e = this.elem.globalData.fontManager, i = this.data, s = [], o, n, c, _ = 0, u, T = i.m.g, E = 0, B = 0, m = 0, C = [], I = 0, P = 0, N, S, x = e.getFontByName(t.f), d, y = 0, A = Ct(x);
      t.fWeight = A.weight, t.fStyle = A.style, t.finalSize = t.s, t.finalText = this.buildFinalText(t.t), n = t.finalText.length, t.finalLineHeight = t.lh;
      var L = t.tr / 1e3 * t.finalSize, D;
      if (t.sz)
        for (var j = !0, Y = t.sz[0], ct = t.sz[1], ot, K; j; ) {
          K = this.buildFinalText(t.t), ot = 0, I = 0, n = K.length, L = t.tr / 1e3 * t.finalSize;
          var pt = -1;
          for (o = 0; o < n; o += 1)
            D = K[o].charCodeAt(0), c = !1, K[o] === " " ? pt = o : (D === 13 || D === 3) && (I = 0, c = !0, ot += t.finalLineHeight || t.finalSize * 1.2), e.chars ? (d = e.getCharData(K[o], x.fStyle, x.fFamily), y = c ? 0 : d.w * t.finalSize / 100) : y = e.measureText(K[o], t.f, t.finalSize), I + y > Y && K[o] !== " " ? (pt === -1 ? n += 1 : o = pt, ot += t.finalLineHeight || t.finalSize * 1.2, K.splice(o, pt === o ? 1 : 0, "\r"), pt = -1, I = 0) : (I += y, I += L);
          ot += x.ascent * t.finalSize / 100, this.canResize && t.finalSize > this.minimumFontSize && ct < ot ? (t.finalSize -= 1, t.finalLineHeight = t.finalSize * t.lh / t.s) : (t.finalText = K, n = t.finalText.length, j = !1);
        }
      I = -L, y = 0;
      var it = 0, G;
      for (o = 0; o < n; o += 1)
        if (c = !1, G = t.finalText[o], D = G.charCodeAt(0), D === 13 || D === 3 ? (it = 0, C.push(I), P = I > P ? I : P, I = -2 * L, u = "", c = !0, m += 1) : u = G, e.chars ? (d = e.getCharData(G, x.fStyle, e.getFontByName(t.f).fFamily), y = c ? 0 : d.w * t.finalSize / 100) : y = e.measureText(u, t.f, t.finalSize), G === " " ? it += y + L : (I += y + L + it, it = 0), s.push({
          l: y,
          an: y,
          add: E,
          n: c,
          anIndexes: [],
          val: u,
          line: m,
          animatorJustifyOffset: 0
        }), T == 2) {
          if (E += y, u === "" || u === " " || o === n - 1) {
            for ((u === "" || u === " ") && (E -= y); B <= o; )
              s[B].an = E, s[B].ind = _, s[B].extra = y, B += 1;
            _ += 1, E = 0;
          }
        } else if (T == 3) {
          if (E += y, u === "" || o === n - 1) {
            for (u === "" && (E -= y); B <= o; )
              s[B].an = E, s[B].ind = _, s[B].extra = y, B += 1;
            E = 0, _ += 1;
          }
        } else
          s[_].ind = _, s[_].extra = 0, _ += 1;
      if (t.l = s, P = I > P ? I : P, C.push(I), t.sz)
        t.boxWidth = t.sz[0], t.justifyOffset = 0;
      else
        switch (t.boxWidth = P, t.j) {
          case 1:
            t.justifyOffset = -t.boxWidth;
            break;
          case 2:
            t.justifyOffset = -t.boxWidth / 2;
            break;
          default:
            t.justifyOffset = 0;
        }
      t.lineWidths = C;
      var w = i.a, M, f;
      S = w.length;
      var p, $, F = [];
      for (N = 0; N < S; N += 1) {
        for (M = w[N], M.a.sc && (t.strokeColorAnim = !0), M.a.sw && (t.strokeWidthAnim = !0), (M.a.fc || M.a.fh || M.a.fs || M.a.fb) && (t.fillColorAnim = !0), $ = 0, p = M.s.b, o = 0; o < n; o += 1)
          f = s[o], f.anIndexes[N] = $, (p == 1 && f.val !== "" || p == 2 && f.val !== "" && f.val !== " " || p == 3 && (f.n || f.val == " " || o == n - 1) || p == 4 && (f.n || o == n - 1)) && (M.s.rn === 1 && F.push($), $ += 1);
        i.a[N].s.totalChars = $;
        var et = -1, ht;
        if (M.s.rn === 1)
          for (o = 0; o < n; o += 1)
            f = s[o], et != f.anIndexes[N] && (et = f.anIndexes[N], ht = F.splice(Math.floor(Math.random() * F.length), 1)[0]), f.anIndexes[N] = ht;
      }
      t.yOffset = t.finalLineHeight || t.finalSize * 1.2, t.ls = t.ls || 0, t.ascent = x.ascent * t.finalSize / 100;
    }, de.prototype.updateDocumentData = function(t, e) {
      e = e === void 0 ? this.keysIndex : e;
      var i = this.copyData({}, this.data.d.k[e].s);
      i = this.copyData(i, t), this.data.d.k[e].s = i, this.recalculate(e), this.setCurrentData(i), this.elem.addDynamicProperty(this);
    }, de.prototype.recalculate = function(t) {
      var e = this.data.d.k[t].s;
      e.__complete = !1, this.keysIndex = 0, this._isFirstFrame = !0, this.getValue(e);
    }, de.prototype.canResizeFont = function(t) {
      this.canResize = t, this.recalculate(this.keysIndex), this.elem.addDynamicProperty(this);
    }, de.prototype.setMinimumFontSize = function(t) {
      this.minimumFontSize = Math.floor(t) || 1, this.recalculate(this.keysIndex), this.elem.addDynamicProperty(this);
    };
    var wa = function() {
      var t = Math.max, e = Math.min, i = Math.floor;
      function s(n, c) {
        this._currentTextLength = -1, this.k = !1, this.data = c, this.elem = n, this.comp = n.comp, this.finalS = 0, this.finalE = 0, this.initDynamicPropertyContainer(n), this.s = Q.getProp(n, c.s || {
          k: 0
        }, 0, 0, this), "e" in c ? this.e = Q.getProp(n, c.e, 0, 0, this) : this.e = {
          v: 100
        }, this.o = Q.getProp(n, c.o || {
          k: 0
        }, 0, 0, this), this.xe = Q.getProp(n, c.xe || {
          k: 0
        }, 0, 0, this), this.ne = Q.getProp(n, c.ne || {
          k: 0
        }, 0, 0, this), this.sm = Q.getProp(n, c.sm || {
          k: 100
        }, 0, 0, this), this.a = Q.getProp(n, c.a, 0, 0.01, this), this.dynamicProperties.length || this.getValue();
      }
      s.prototype = {
        getMult: function(c) {
          this._currentTextLength !== this.elem.textProperty.currentData.l.length && this.getValue();
          var _ = 0, u = 0, T = 1, E = 1;
          this.ne.v > 0 ? _ = this.ne.v / 100 : u = -this.ne.v / 100, this.xe.v > 0 ? T = 1 - this.xe.v / 100 : E = 1 + this.xe.v / 100;
          var B = di.getBezierEasing(_, u, T, E).get, m = 0, C = this.finalS, I = this.finalE, P = this.data.sh;
          if (P === 2)
            I === C ? m = c >= I ? 1 : 0 : m = t(0, e(0.5 / (I - C) + (c - C) / (I - C), 1)), m = B(m);
          else if (P === 3)
            I === C ? m = c >= I ? 0 : 1 : m = 1 - t(0, e(0.5 / (I - C) + (c - C) / (I - C), 1)), m = B(m);
          else if (P === 4)
            I === C ? m = 0 : (m = t(0, e(0.5 / (I - C) + (c - C) / (I - C), 1)), m < 0.5 ? m *= 2 : m = 1 - 2 * (m - 0.5)), m = B(m);
          else if (P === 5) {
            if (I === C)
              m = 0;
            else {
              var N = I - C;
              c = e(t(0, c + 0.5 - C), I - C);
              var S = -N / 2 + c, x = N / 2;
              m = Math.sqrt(1 - S * S / (x * x));
            }
            m = B(m);
          } else P === 6 ? (I === C ? m = 0 : (c = e(t(0, c + 0.5 - C), I - C), m = (1 + Math.cos(Math.PI + Math.PI * 2 * c / (I - C))) / 2), m = B(m)) : (c >= i(C) && (c - C < 0 ? m = t(0, e(e(I, 1) - (C - c), 1)) : m = t(0, e(I - c, 1))), m = B(m));
          if (this.sm.v !== 100) {
            var d = this.sm.v * 0.01;
            d === 0 && (d = 1e-8);
            var y = 0.5 - d * 0.5;
            m < y ? m = 0 : (m = (m - y) / d, m > 1 && (m = 1));
          }
          return m * this.a.v;
        },
        getValue: function(c) {
          this.iterateDynamicProperties(), this._mdf = c || this._mdf, this._currentTextLength = this.elem.textProperty.currentData.l.length || 0, c && this.data.r === 2 && (this.e.v = this._currentTextLength);
          var _ = this.data.r === 2 ? 1 : 100 / this.data.totalChars, u = this.o.v / _, T = this.s.v / _ + u, E = this.e.v / _ + u;
          if (T > E) {
            var B = T;
            T = E, E = B;
          }
          this.finalS = T, this.finalE = E;
        }
      }, U([Xt], s);
      function o(n, c, _) {
        return new s(n, c);
      }
      return {
        getTextSelectorProp: o
      };
    }();
    function ka(t, e, i) {
      var s = {
        propType: !1
      }, o = Q.getProp, n = e.a;
      this.a = {
        r: n.r ? o(t, n.r, 0, At, i) : s,
        rx: n.rx ? o(t, n.rx, 0, At, i) : s,
        ry: n.ry ? o(t, n.ry, 0, At, i) : s,
        sk: n.sk ? o(t, n.sk, 0, At, i) : s,
        sa: n.sa ? o(t, n.sa, 0, At, i) : s,
        s: n.s ? o(t, n.s, 1, 0.01, i) : s,
        a: n.a ? o(t, n.a, 1, 0, i) : s,
        o: n.o ? o(t, n.o, 0, 0.01, i) : s,
        p: n.p ? o(t, n.p, 1, 0, i) : s,
        sw: n.sw ? o(t, n.sw, 0, 0, i) : s,
        sc: n.sc ? o(t, n.sc, 1, 0, i) : s,
        fc: n.fc ? o(t, n.fc, 1, 0, i) : s,
        fh: n.fh ? o(t, n.fh, 0, 0, i) : s,
        fs: n.fs ? o(t, n.fs, 0, 0.01, i) : s,
        fb: n.fb ? o(t, n.fb, 0, 0.01, i) : s,
        t: n.t ? o(t, n.t, 0, 0, i) : s
      }, this.s = wa.getTextSelectorProp(t, e.s, i), this.s.t = e.s.t;
    }
    function Ui(t, e, i) {
      this._isFirstFrame = !0, this._hasMaskedPath = !1, this._frameId = -1, this._textData = t, this._renderType = e, this._elem = i, this._animatorsData = rt(this._textData.a.length), this._pathData = {}, this._moreOptions = {
        alignment: {}
      }, this.renderedLetters = [], this.lettersChangedFlag = !1, this.initDynamicPropertyContainer(i);
    }
    Ui.prototype.searchProperties = function() {
      var t, e = this._textData.a.length, i, s = Q.getProp;
      for (t = 0; t < e; t += 1)
        i = this._textData.a[t], this._animatorsData[t] = new ka(this._elem, i, this);
      this._textData.p && "m" in this._textData.p ? (this._pathData = {
        a: s(this._elem, this._textData.p.a, 0, 0, this),
        f: s(this._elem, this._textData.p.f, 0, 0, this),
        l: s(this._elem, this._textData.p.l, 0, 0, this),
        r: s(this._elem, this._textData.p.r, 0, 0, this),
        p: s(this._elem, this._textData.p.p, 0, 0, this),
        m: this._elem.maskManager.getMaskProperty(this._textData.p.m)
      }, this._hasMaskedPath = !0) : this._hasMaskedPath = !1, this._moreOptions.alignment = s(this._elem, this._textData.m.a, 1, 0, this);
    }, Ui.prototype.getMeasures = function(t, e) {
      if (this.lettersChangedFlag = e, !(!this._mdf && !this._isFirstFrame && !e && (!this._hasMaskedPath || !this._pathData.m._mdf))) {
        this._isFirstFrame = !1;
        var i = this._moreOptions.alignment.v, s = this._animatorsData, o = this._textData, n = this.mHelper, c = this._renderType, _ = this.renderedLetters.length, u, T, E, B, m = t.l, C, I, P, N, S, x, d, y, A, L, D, j, Y, ct, ot;
        if (this._hasMaskedPath) {
          if (ot = this._pathData.m, !this._pathData.n || this._pathData._mdf) {
            var K = ot.v;
            this._pathData.r.v && (K = K.reverse()), C = {
              tLength: 0,
              segments: []
            }, B = K._length - 1;
            var pt;
            for (j = 0, E = 0; E < B; E += 1)
              pt = pe.buildBezierData(K.v[E], K.v[E + 1], [K.o[E][0] - K.v[E][0], K.o[E][1] - K.v[E][1]], [K.i[E + 1][0] - K.v[E + 1][0], K.i[E + 1][1] - K.v[E + 1][1]]), C.tLength += pt.segmentLength, C.segments.push(pt), j += pt.segmentLength;
            E = B, ot.v.c && (pt = pe.buildBezierData(K.v[E], K.v[0], [K.o[E][0] - K.v[E][0], K.o[E][1] - K.v[E][1]], [K.i[0][0] - K.v[0][0], K.i[0][1] - K.v[0][1]]), C.tLength += pt.segmentLength, C.segments.push(pt), j += pt.segmentLength), this._pathData.pi = C;
          }
          if (C = this._pathData.pi, I = this._pathData.f.v, d = 0, x = 1, N = 0, S = !0, L = C.segments, I < 0 && ot.v.c)
            for (C.tLength < Math.abs(I) && (I = -Math.abs(I) % C.tLength), d = L.length - 1, A = L[d].points, x = A.length - 1; I < 0; )
              I += A[x].partialLength, x -= 1, x < 0 && (d -= 1, A = L[d].points, x = A.length - 1);
          A = L[d].points, y = A[x - 1], P = A[x], D = P.partialLength;
        }
        B = m.length, u = 0, T = 0;
        var it = t.finalSize * 1.2 * 0.714, G = !0, w, M, f, p, $;
        p = s.length;
        var F, et = -1, ht, ut, kt, xt = I, ie = d, be = x, Xe = -1, we, le, Pe, Pt, nt, li, Ci, hi, Ze = "", fi = this.defaultPropsArray, ci;
        if (t.j === 2 || t.j === 1) {
          var ke = 0, Pi = 0, Mi = t.j === 2 ? -0.5 : -1, Ve = 0, Ii = !0;
          for (E = 0; E < B; E += 1)
            if (m[E].n) {
              for (ke && (ke += Pi); Ve < E; )
                m[Ve].animatorJustifyOffset = ke, Ve += 1;
              ke = 0, Ii = !0;
            } else {
              for (f = 0; f < p; f += 1)
                w = s[f].a, w.t.propType && (Ii && t.j === 2 && (Pi += w.t.v * Mi), M = s[f].s, F = M.getMult(m[E].anIndexes[f], o.a[f].s.totalChars), F.length ? ke += w.t.v * F[0] * Mi : ke += w.t.v * F * Mi);
              Ii = !1;
            }
          for (ke && (ke += Pi); Ve < E; )
            m[Ve].animatorJustifyOffset = ke, Ve += 1;
        }
        for (E = 0; E < B; E += 1) {
          if (n.reset(), we = 1, m[E].n)
            u = 0, T += t.yOffset, T += G ? 1 : 0, I = xt, G = !1, this._hasMaskedPath && (d = ie, x = be, A = L[d].points, y = A[x - 1], P = A[x], D = P.partialLength, N = 0), Ze = "", hi = "", li = "", ci = "", fi = this.defaultPropsArray;
          else {
            if (this._hasMaskedPath) {
              if (Xe !== m[E].line) {
                switch (t.j) {
                  case 1:
                    I += j - t.lineWidths[m[E].line];
                    break;
                  case 2:
                    I += (j - t.lineWidths[m[E].line]) / 2;
                    break;
                }
                Xe = m[E].line;
              }
              et !== m[E].ind && (m[et] && (I += m[et].extra), I += m[E].an / 2, et = m[E].ind), I += i[0] * m[E].an * 5e-3;
              var $e = 0;
              for (f = 0; f < p; f += 1)
                w = s[f].a, w.p.propType && (M = s[f].s, F = M.getMult(m[E].anIndexes[f], o.a[f].s.totalChars), F.length ? $e += w.p.v[0] * F[0] : $e += w.p.v[0] * F), w.a.propType && (M = s[f].s, F = M.getMult(m[E].anIndexes[f], o.a[f].s.totalChars), F.length ? $e += w.a.v[0] * F[0] : $e += w.a.v[0] * F);
              for (S = !0, this._pathData.a.v && (I = m[0].an * 0.5 + (j - this._pathData.f.v - m[0].an * 0.5 - m[m.length - 1].an * 0.5) * et / (B - 1), I += this._pathData.f.v); S; )
                N + D >= I + $e || !A ? (Y = (I + $e - N) / P.partialLength, ut = y.point[0] + (P.point[0] - y.point[0]) * Y, kt = y.point[1] + (P.point[1] - y.point[1]) * Y, n.translate(-i[0] * m[E].an * 5e-3, -(i[1] * it) * 0.01), S = !1) : A && (N += P.partialLength, x += 1, x >= A.length && (x = 0, d += 1, L[d] ? A = L[d].points : ot.v.c ? (x = 0, d = 0, A = L[d].points) : (N -= P.partialLength, A = null)), A && (y = P, P = A[x], D = P.partialLength));
              ht = m[E].an / 2 - m[E].add, n.translate(-ht, 0, 0);
            } else
              ht = m[E].an / 2 - m[E].add, n.translate(-ht, 0, 0), n.translate(-i[0] * m[E].an * 5e-3, -i[1] * it * 0.01, 0);
            for (f = 0; f < p; f += 1)
              w = s[f].a, w.t.propType && (M = s[f].s, F = M.getMult(m[E].anIndexes[f], o.a[f].s.totalChars), (u !== 0 || t.j !== 0) && (this._hasMaskedPath ? F.length ? I += w.t.v * F[0] : I += w.t.v * F : F.length ? u += w.t.v * F[0] : u += w.t.v * F));
            for (t.strokeWidthAnim && (Pe = t.sw || 0), t.strokeColorAnim && (t.sc ? le = [t.sc[0], t.sc[1], t.sc[2]] : le = [0, 0, 0]), t.fillColorAnim && t.fc && (Pt = [t.fc[0], t.fc[1], t.fc[2]]), f = 0; f < p; f += 1)
              w = s[f].a, w.a.propType && (M = s[f].s, F = M.getMult(m[E].anIndexes[f], o.a[f].s.totalChars), F.length ? n.translate(-w.a.v[0] * F[0], -w.a.v[1] * F[1], w.a.v[2] * F[2]) : n.translate(-w.a.v[0] * F, -w.a.v[1] * F, w.a.v[2] * F));
            for (f = 0; f < p; f += 1)
              w = s[f].a, w.s.propType && (M = s[f].s, F = M.getMult(m[E].anIndexes[f], o.a[f].s.totalChars), F.length ? n.scale(1 + (w.s.v[0] - 1) * F[0], 1 + (w.s.v[1] - 1) * F[1], 1) : n.scale(1 + (w.s.v[0] - 1) * F, 1 + (w.s.v[1] - 1) * F, 1));
            for (f = 0; f < p; f += 1) {
              if (w = s[f].a, M = s[f].s, F = M.getMult(m[E].anIndexes[f], o.a[f].s.totalChars), w.sk.propType && (F.length ? n.skewFromAxis(-w.sk.v * F[0], w.sa.v * F[1]) : n.skewFromAxis(-w.sk.v * F, w.sa.v * F)), w.r.propType && (F.length ? n.rotateZ(-w.r.v * F[2]) : n.rotateZ(-w.r.v * F)), w.ry.propType && (F.length ? n.rotateY(w.ry.v * F[1]) : n.rotateY(w.ry.v * F)), w.rx.propType && (F.length ? n.rotateX(w.rx.v * F[0]) : n.rotateX(w.rx.v * F)), w.o.propType && (F.length ? we += (w.o.v * F[0] - we) * F[0] : we += (w.o.v * F - we) * F), t.strokeWidthAnim && w.sw.propType && (F.length ? Pe += w.sw.v * F[0] : Pe += w.sw.v * F), t.strokeColorAnim && w.sc.propType)
                for (nt = 0; nt < 3; nt += 1)
                  F.length ? le[nt] += (w.sc.v[nt] - le[nt]) * F[0] : le[nt] += (w.sc.v[nt] - le[nt]) * F;
              if (t.fillColorAnim && t.fc) {
                if (w.fc.propType)
                  for (nt = 0; nt < 3; nt += 1)
                    F.length ? Pt[nt] += (w.fc.v[nt] - Pt[nt]) * F[0] : Pt[nt] += (w.fc.v[nt] - Pt[nt]) * F;
                w.fh.propType && (F.length ? Pt = Jr(Pt, w.fh.v * F[0]) : Pt = Jr(Pt, w.fh.v * F)), w.fs.propType && (F.length ? Pt = Fe(Pt, w.fs.v * F[0]) : Pt = Fe(Pt, w.fs.v * F)), w.fb.propType && (F.length ? Pt = tr(Pt, w.fb.v * F[0]) : Pt = tr(Pt, w.fb.v * F));
              }
            }
            for (f = 0; f < p; f += 1)
              w = s[f].a, w.p.propType && (M = s[f].s, F = M.getMult(m[E].anIndexes[f], o.a[f].s.totalChars), this._hasMaskedPath ? F.length ? n.translate(0, w.p.v[1] * F[0], -w.p.v[2] * F[1]) : n.translate(0, w.p.v[1] * F, -w.p.v[2] * F) : F.length ? n.translate(w.p.v[0] * F[0], w.p.v[1] * F[1], -w.p.v[2] * F[2]) : n.translate(w.p.v[0] * F, w.p.v[1] * F, -w.p.v[2] * F));
            if (t.strokeWidthAnim && (li = Pe < 0 ? 0 : Pe), t.strokeColorAnim && (Ci = "rgb(" + Math.round(le[0] * 255) + "," + Math.round(le[1] * 255) + "," + Math.round(le[2] * 255) + ")"), t.fillColorAnim && t.fc && (hi = "rgb(" + Math.round(Pt[0] * 255) + "," + Math.round(Pt[1] * 255) + "," + Math.round(Pt[2] * 255) + ")"), this._hasMaskedPath) {
              if (n.translate(0, -t.ls), n.translate(0, i[1] * it * 0.01 + T, 0), this._pathData.p.v) {
                ct = (P.point[1] - y.point[1]) / (P.point[0] - y.point[0]);
                var qi = Math.atan(ct) * 180 / Math.PI;
                P.point[0] < y.point[0] && (qi += 180), n.rotate(-qi * Math.PI / 180);
              }
              n.translate(ut, kt, 0), I -= i[0] * m[E].an * 5e-3, m[E + 1] && et !== m[E + 1].ind && (I += m[E].an / 2, I += t.tr * 1e-3 * t.finalSize);
            } else {
              switch (n.translate(u, T, 0), t.ps && n.translate(t.ps[0], t.ps[1] + t.ascent, 0), t.j) {
                case 1:
                  n.translate(m[E].animatorJustifyOffset + t.justifyOffset + (t.boxWidth - t.lineWidths[m[E].line]), 0, 0);
                  break;
                case 2:
                  n.translate(m[E].animatorJustifyOffset + t.justifyOffset + (t.boxWidth - t.lineWidths[m[E].line]) / 2, 0, 0);
                  break;
              }
              n.translate(0, -t.ls), n.translate(ht, 0, 0), n.translate(i[0] * m[E].an * 5e-3, i[1] * it * 0.01, 0), u += m[E].l + t.tr * 1e-3 * t.finalSize;
            }
            c === "html" ? Ze = n.toCSS() : c === "svg" ? Ze = n.to2dCSS() : fi = [n.props[0], n.props[1], n.props[2], n.props[3], n.props[4], n.props[5], n.props[6], n.props[7], n.props[8], n.props[9], n.props[10], n.props[11], n.props[12], n.props[13], n.props[14], n.props[15]], ci = we;
          }
          _ <= E ? ($ = new Ys(ci, li, Ci, hi, Ze, fi), this.renderedLetters.push($), _ += 1, this.lettersChangedFlag = !0) : ($ = this.renderedLetters[E], this.lettersChangedFlag = $.update(ci, li, Ci, hi, Ze, fi) || this.lettersChangedFlag);
        }
      }
    }, Ui.prototype.getValue = function() {
      this._elem.globalData.frameId !== this._frameId && (this._frameId = this._elem.globalData.frameId, this.iterateDynamicProperties());
    }, Ui.prototype.mHelper = new Zt(), Ui.prototype.defaultPropsArray = [], U([Xt], Ui);
    function Ne() {
    }
    Ne.prototype.initElement = function(t, e, i) {
      this.lettersChangedFlag = !0, this.initFrame(), this.initBaseData(t, e, i), this.textProperty = new de(this, t.t, this.dynamicProperties), this.textAnimator = new Ui(t.t, this.renderType, this), this.initTransform(t, e, i), this.initHierarchy(), this.initRenderable(), this.initRendererElement(), this.createContainerElements(), this.createRenderableComponents(), this.createContent(), this.hide(), this.textAnimator.searchProperties(this.dynamicProperties);
    }, Ne.prototype.prepareFrame = function(t) {
      this._mdf = !1, this.prepareRenderableFrame(t), this.prepareProperties(t, this.isInRange);
    }, Ne.prototype.createPathShape = function(t, e) {
      var i, s = e.length, o, n = "";
      for (i = 0; i < s; i += 1)
        e[i].ty === "sh" && (o = e[i].ks.k, n += Hn(o, o.i.length, !0, t));
      return n;
    }, Ne.prototype.updateDocumentData = function(t, e) {
      this.textProperty.updateDocumentData(t, e);
    }, Ne.prototype.canResizeFont = function(t) {
      this.textProperty.canResizeFont(t);
    }, Ne.prototype.setMinimumFontSize = function(t) {
      this.textProperty.setMinimumFontSize(t);
    }, Ne.prototype.applyTextPropertiesToMatrix = function(t, e, i, s, o) {
      switch (t.ps && e.translate(t.ps[0], t.ps[1] + t.ascent, 0), e.translate(0, -t.ls, 0), t.j) {
        case 1:
          e.translate(t.justifyOffset + (t.boxWidth - t.lineWidths[i]), 0, 0);
          break;
        case 2:
          e.translate(t.justifyOffset + (t.boxWidth - t.lineWidths[i]) / 2, 0, 0);
          break;
      }
      e.translate(s, o, 0);
    }, Ne.prototype.buildColor = function(t) {
      return "rgb(" + Math.round(t[0] * 255) + "," + Math.round(t[1] * 255) + "," + Math.round(t[2] * 255) + ")";
    }, Ne.prototype.emptyProp = new Ys(), Ne.prototype.destroy = function() {
    }, Ne.prototype.validateText = function() {
      (this.textProperty._mdf || this.textProperty._isFirstFrame) && (this.buildNewText(), this.textProperty._isFirstFrame = !1, this.textProperty._mdf = !1);
    };
    var xa = {
      shapes: []
    };
    function oi(t, e, i) {
      this.textSpans = [], this.renderType = "svg", this.initElement(t, e, i);
    }
    U([Ti, pr, zr, dr, Ai, Dr, Ne], oi), oi.prototype.createContent = function() {
      this.data.singleShape && !this.globalData.fontManager.chars && (this.textContainer = ft("text"));
    }, oi.prototype.buildTextContents = function(t) {
      for (var e = 0, i = t.length, s = [], o = ""; e < i; )
        t[e] === "\r" || t[e] === "" ? (s.push(o), o = "") : o += t[e], e += 1;
      return s.push(o), s;
    }, oi.prototype.buildShapeData = function(t, e) {
      if (t.shapes && t.shapes.length) {
        var i = t.shapes[0];
        if (i.it) {
          var s = i.it[i.it.length - 1];
          s.s && (s.s.k[0] = e, s.s.k[1] = e);
        }
      }
      return t;
    }, oi.prototype.buildNewText = function() {
      this.addDynamicProperty(this);
      var t, e, i = this.textProperty.currentData;
      this.renderedLetters = rt(i ? i.l.length : 0), i.fc ? this.layerElement.setAttribute("fill", this.buildColor(i.fc)) : this.layerElement.setAttribute("fill", "rgba(0,0,0,0)"), i.sc && (this.layerElement.setAttribute("stroke", this.buildColor(i.sc)), this.layerElement.setAttribute("stroke-width", i.sw)), this.layerElement.setAttribute("font-size", i.finalSize);
      var s = this.globalData.fontManager.getFontByName(i.f);
      if (s.fClass)
        this.layerElement.setAttribute("class", s.fClass);
      else {
        this.layerElement.setAttribute("font-family", s.fFamily);
        var o = i.fWeight, n = i.fStyle;
        this.layerElement.setAttribute("font-style", n), this.layerElement.setAttribute("font-weight", o);
      }
      this.layerElement.setAttribute("aria-label", i.t);
      var c = i.l || [], _ = !!this.globalData.fontManager.chars;
      e = c.length;
      var u, T = this.mHelper, E = "", B = this.data.singleShape, m = 0, C = 0, I = !0, P = i.tr * 1e-3 * i.finalSize;
      if (B && !_ && !i.sz) {
        var N = this.textContainer, S = "start";
        switch (i.j) {
          case 1:
            S = "end";
            break;
          case 2:
            S = "middle";
            break;
          default:
            S = "start";
            break;
        }
        N.setAttribute("text-anchor", S), N.setAttribute("letter-spacing", P);
        var x = this.buildTextContents(i.finalText);
        for (e = x.length, C = i.ps ? i.ps[1] + i.ascent : 0, t = 0; t < e; t += 1)
          u = this.textSpans[t].span || ft("tspan"), u.textContent = x[t], u.setAttribute("x", 0), u.setAttribute("y", C), u.style.display = "inherit", N.appendChild(u), this.textSpans[t] || (this.textSpans[t] = {
            span: null,
            glyph: null
          }), this.textSpans[t].span = u, C += i.finalLineHeight;
        this.layerElement.appendChild(N);
      } else {
        var d = this.textSpans.length, y;
        for (t = 0; t < e; t += 1) {
          if (this.textSpans[t] || (this.textSpans[t] = {
            span: null,
            childSpan: null,
            glyph: null
          }), !_ || !B || t === 0) {
            if (u = d > t ? this.textSpans[t].span : ft(_ ? "g" : "text"), d <= t) {
              if (u.setAttribute("stroke-linecap", "butt"), u.setAttribute("stroke-linejoin", "round"), u.setAttribute("stroke-miterlimit", "4"), this.textSpans[t].span = u, _) {
                var A = ft("g");
                u.appendChild(A), this.textSpans[t].childSpan = A;
              }
              this.textSpans[t].span = u, this.layerElement.appendChild(u);
            }
            u.style.display = "inherit";
          }
          if (T.reset(), B && (c[t].n && (m = -P, C += i.yOffset, C += I ? 1 : 0, I = !1), this.applyTextPropertiesToMatrix(i, T, c[t].line, m, C), m += c[t].l || 0, m += P), _) {
            y = this.globalData.fontManager.getCharData(i.finalText[t], s.fStyle, this.globalData.fontManager.getFontByName(i.f).fFamily);
            var L;
            if (y.t === 1)
              L = new $r(y.data, this.globalData, this);
            else {
              var D = xa;
              y.data && y.data.shapes && (D = this.buildShapeData(y.data, i.finalSize)), L = new Qt(D, this.globalData, this);
            }
            if (this.textSpans[t].glyph) {
              var j = this.textSpans[t].glyph;
              this.textSpans[t].childSpan.removeChild(j.layerElement), j.destroy();
            }
            this.textSpans[t].glyph = L, L._debug = !0, L.prepareFrame(0), L.renderFrame(), this.textSpans[t].childSpan.appendChild(L.layerElement), y.t === 1 && this.textSpans[t].childSpan.setAttribute("transform", "scale(" + i.finalSize / 100 + "," + i.finalSize / 100 + ")");
          } else
            B && u.setAttribute("transform", "translate(" + T.props[12] + "," + T.props[13] + ")"), u.textContent = c[t].val, u.setAttributeNS("http://www.w3.org/XML/1998/namespace", "xml:space", "preserve");
        }
        B && u && u.setAttribute("d", E);
      }
      for (; t < this.textSpans.length; )
        this.textSpans[t].span.style.display = "none", t += 1;
      this._sizeChanged = !0;
    }, oi.prototype.sourceRectAtTime = function() {
      if (this.prepareFrame(this.comp.renderedFrame - this.data.st), this.renderInnerContent(), this._sizeChanged) {
        this._sizeChanged = !1;
        var t = this.layerElement.getBBox();
        this.bbox = {
          top: t.y,
          left: t.x,
          width: t.width,
          height: t.height
        };
      }
      return this.bbox;
    }, oi.prototype.getValue = function() {
      var t, e = this.textSpans.length, i;
      for (this.renderedFrame = this.comp.renderedFrame, t = 0; t < e; t += 1)
        i = this.textSpans[t].glyph, i && (i.prepareFrame(this.comp.renderedFrame - this.data.st), i._mdf && (this._mdf = !0));
    }, oi.prototype.renderInnerContent = function() {
      if (this.validateText(), (!this.data.singleShape || this._mdf) && (this.textAnimator.getMeasures(this.textProperty.currentData, this.lettersChangedFlag), this.lettersChangedFlag || this.textAnimator.lettersChangedFlag)) {
        this._sizeChanged = !0;
        var t, e, i = this.textAnimator.renderedLetters, s = this.textProperty.currentData.l;
        e = s.length;
        var o, n, c;
        for (t = 0; t < e; t += 1)
          s[t].n || (o = i[t], n = this.textSpans[t].span, c = this.textSpans[t].glyph, c && c.renderFrame(), o._mdf.m && n.setAttribute("transform", o.m), o._mdf.o && n.setAttribute("opacity", o.o), o._mdf.sw && n.setAttribute("stroke-width", o.sw), o._mdf.sc && n.setAttribute("stroke", o.sc), o._mdf.fc && n.setAttribute("fill", o.fc));
      }
    };
    function Xs(t, e, i) {
      this.initElement(t, e, i);
    }
    U([Br], Xs), Xs.prototype.createContent = function() {
      var t = ft("rect");
      t.setAttribute("width", this.data.sw), t.setAttribute("height", this.data.sh), t.setAttribute("fill", this.data.sc), this.layerElement.appendChild(t);
    };
    function Ei(t, e, i) {
      this.initFrame(), this.initBaseData(t, e, i), this.initFrame(), this.initTransform(t, e, i), this.initHierarchy();
    }
    Ei.prototype.prepareFrame = function(t) {
      this.prepareProperties(t, !0);
    }, Ei.prototype.renderFrame = function() {
    }, Ei.prototype.getBaseElement = function() {
      return null;
    }, Ei.prototype.destroy = function() {
    }, Ei.prototype.sourceRectAtTime = function() {
    }, Ei.prototype.hide = function() {
    }, U([Ti, pr, dr, Ai], Ei);
    function ne() {
    }
    U([fe], ne), ne.prototype.createNull = function(t) {
      return new Ei(t, this.globalData, this);
    }, ne.prototype.createShape = function(t) {
      return new Qt(t, this.globalData, this);
    }, ne.prototype.createText = function(t) {
      return new oi(t, this.globalData, this);
    }, ne.prototype.createImage = function(t) {
      return new Br(t, this.globalData, this);
    }, ne.prototype.createSolid = function(t) {
      return new Xs(t, this.globalData, this);
    }, ne.prototype.configAnimation = function(t) {
      this.svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg"), this.svgElement.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink"), this.renderConfig.viewBoxSize ? this.svgElement.setAttribute("viewBox", this.renderConfig.viewBoxSize) : this.svgElement.setAttribute("viewBox", "0 0 " + t.w + " " + t.h), this.renderConfig.viewBoxOnly || (this.svgElement.setAttribute("width", t.w), this.svgElement.setAttribute("height", t.h), this.svgElement.style.width = "100%", this.svgElement.style.height = "100%", this.svgElement.style.transform = "translate3d(0,0,0)", this.svgElement.style.contentVisibility = this.renderConfig.contentVisibility), this.renderConfig.width && this.svgElement.setAttribute("width", this.renderConfig.width), this.renderConfig.height && this.svgElement.setAttribute("height", this.renderConfig.height), this.renderConfig.className && this.svgElement.setAttribute("class", this.renderConfig.className), this.renderConfig.id && this.svgElement.setAttribute("id", this.renderConfig.id), this.renderConfig.focusable !== void 0 && this.svgElement.setAttribute("focusable", this.renderConfig.focusable), this.svgElement.setAttribute("preserveAspectRatio", this.renderConfig.preserveAspectRatio), this.animationItem.wrapper.appendChild(this.svgElement);
      var e = this.globalData.defs;
      this.setupGlobalData(t, e), this.globalData.progressiveLoad = this.renderConfig.progressiveLoad, this.data = t;
      var i = ft("clipPath"), s = ft("rect");
      s.setAttribute("width", t.w), s.setAttribute("height", t.h), s.setAttribute("x", 0), s.setAttribute("y", 0);
      var o = Et();
      i.setAttribute("id", o), i.appendChild(s), this.layerElement.setAttribute("clip-path", "url(" + W() + "#" + o + ")"), e.appendChild(i), this.layers = t.layers, this.elements = rt(t.layers.length);
    }, ne.prototype.destroy = function() {
      this.animationItem.wrapper && (this.animationItem.wrapper.innerText = ""), this.layerElement = null, this.globalData.defs = null;
      var t, e = this.layers ? this.layers.length : 0;
      for (t = 0; t < e; t += 1)
        this.elements[t] && this.elements[t].destroy && this.elements[t].destroy();
      this.elements.length = 0, this.destroyed = !0, this.animationItem = null;
    }, ne.prototype.updateContainerSize = function() {
    }, ne.prototype.findIndexByInd = function(t) {
      var e = 0, i = this.layers.length;
      for (e = 0; e < i; e += 1)
        if (this.layers[e].ind === t)
          return e;
      return -1;
    }, ne.prototype.buildItem = function(t) {
      var e = this.elements;
      if (!(e[t] || this.layers[t].ty === 99)) {
        e[t] = !0;
        var i = this.createItem(this.layers[t]);
        if (e[t] = i, er() && (this.layers[t].ty === 0 && this.globalData.projectInterface.registerComposition(i), i.initExpressions()), this.appendElementInPos(i, t), this.layers[t].tt) {
          var s = "tp" in this.layers[t] ? this.findIndexByInd(this.layers[t].tp) : t - 1;
          if (s === -1)
            return;
          if (!this.elements[s] || this.elements[s] === !0)
            this.buildItem(s), this.addPendingElement(i);
          else {
            var o = e[s], n = o.getMatte(this.layers[t].tt);
            i.setMatte(n);
          }
        }
      }
    }, ne.prototype.checkPendingElements = function() {
      for (; this.pendingElements.length; ) {
        var t = this.pendingElements.pop();
        if (t.checkParenting(), t.data.tt)
          for (var e = 0, i = this.elements.length; e < i; ) {
            if (this.elements[e] === t) {
              var s = "tp" in t.data ? this.findIndexByInd(t.data.tp) : e - 1, o = this.elements[s], n = o.getMatte(this.layers[e].tt);
              t.setMatte(n);
              break;
            }
            e += 1;
          }
      }
    }, ne.prototype.renderFrame = function(t) {
      if (!(this.renderedFrame === t || this.destroyed)) {
        t === null ? t = this.renderedFrame : this.renderedFrame = t, this.globalData.frameNum = t, this.globalData.frameId += 1, this.globalData.projectInterface.currentFrame = t, this.globalData._mdf = !1;
        var e, i = this.layers.length;
        for (this.completeLayers || this.checkLayers(t), e = i - 1; e >= 0; e -= 1)
          (this.completeLayers || this.elements[e]) && this.elements[e].prepareFrame(t - this.layers[e].st);
        if (this.globalData._mdf)
          for (e = 0; e < i; e += 1)
            (this.completeLayers || this.elements[e]) && this.elements[e].renderFrame();
      }
    }, ne.prototype.appendElementInPos = function(t, e) {
      var i = t.getBaseElement();
      if (i) {
        for (var s = 0, o; s < e; )
          this.elements[s] && this.elements[s] !== !0 && this.elements[s].getBaseElement() && (o = this.elements[s].getBaseElement()), s += 1;
        o ? this.layerElement.insertBefore(i, o) : this.layerElement.appendChild(i);
      }
    }, ne.prototype.hide = function() {
      this.layerElement.style.display = "none";
    }, ne.prototype.show = function() {
      this.layerElement.style.display = "block";
    };
    function ai() {
    }
    U([Ti, pr, dr, Ai, Dr], ai), ai.prototype.initElement = function(t, e, i) {
      this.initFrame(), this.initBaseData(t, e, i), this.initTransform(t, e, i), this.initRenderable(), this.initHierarchy(), this.initRendererElement(), this.createContainerElements(), this.createRenderableComponents(), (this.data.xt || !e.progressiveLoad) && this.buildAllItems(), this.hide();
    }, ai.prototype.prepareFrame = function(t) {
      if (this._mdf = !1, this.prepareRenderableFrame(t), this.prepareProperties(t, this.isInRange), !(!this.isInRange && !this.data.xt)) {
        if (this.tm._placeholder)
          this.renderedFrame = t / this.data.sr;
        else {
          var e = this.tm.v;
          e === this.data.op && (e = this.data.op - 1), this.renderedFrame = e;
        }
        var i, s = this.elements.length;
        for (this.completeLayers || this.checkLayers(this.renderedFrame), i = s - 1; i >= 0; i -= 1)
          (this.completeLayers || this.elements[i]) && (this.elements[i].prepareFrame(this.renderedFrame - this.layers[i].st), this.elements[i]._mdf && (this._mdf = !0));
      }
    }, ai.prototype.renderInnerContent = function() {
      var t, e = this.layers.length;
      for (t = 0; t < e; t += 1)
        (this.completeLayers || this.elements[t]) && this.elements[t].renderFrame();
    }, ai.prototype.setElements = function(t) {
      this.elements = t;
    }, ai.prototype.getElements = function() {
      return this.elements;
    }, ai.prototype.destroyElements = function() {
      var t, e = this.layers.length;
      for (t = 0; t < e; t += 1)
        this.elements[t] && this.elements[t].destroy();
    }, ai.prototype.destroy = function() {
      this.destroyElements(), this.destroyBaseElement();
    };
    function $r(t, e, i) {
      this.layers = t.layers, this.supports3d = !0, this.completeLayers = !1, this.pendingElements = [], this.elements = this.layers ? rt(this.layers.length) : [], this.initElement(t, e, i), this.tm = t.tm ? Q.getProp(this, t.tm, 0, e.frameRate, this) : {
        _placeholder: !0
      };
    }
    U([ne, ai, zr], $r), $r.prototype.createComp = function(t) {
      return new $r(t, this.globalData, this);
    };
    function Zs(t, e) {
      this.animationItem = t, this.layers = null, this.renderedFrame = -1, this.svgElement = ft("svg");
      var i = "";
      if (e && e.title) {
        var s = ft("title"), o = Et();
        s.setAttribute("id", o), s.textContent = e.title, this.svgElement.appendChild(s), i += o;
      }
      if (e && e.description) {
        var n = ft("desc"), c = Et();
        n.setAttribute("id", c), n.textContent = e.description, this.svgElement.appendChild(n), i += " " + c;
      }
      i && this.svgElement.setAttribute("aria-labelledby", i);
      var _ = ft("defs");
      this.svgElement.appendChild(_);
      var u = ft("g");
      this.svgElement.appendChild(u), this.layerElement = u, this.renderConfig = {
        preserveAspectRatio: e && e.preserveAspectRatio || "xMidYMid meet",
        imagePreserveAspectRatio: e && e.imagePreserveAspectRatio || "xMidYMid slice",
        contentVisibility: e && e.contentVisibility || "visible",
        progressiveLoad: e && e.progressiveLoad || !1,
        hideOnTransparent: !(e && e.hideOnTransparent === !1),
        viewBoxOnly: e && e.viewBoxOnly || !1,
        viewBoxSize: e && e.viewBoxSize || !1,
        className: e && e.className || "",
        id: e && e.id || "",
        focusable: e && e.focusable,
        filterSize: {
          width: e && e.filterSize && e.filterSize.width || "100%",
          height: e && e.filterSize && e.filterSize.height || "100%",
          x: e && e.filterSize && e.filterSize.x || "0%",
          y: e && e.filterSize && e.filterSize.y || "0%"
        },
        width: e && e.width,
        height: e && e.height,
        runExpressions: !e || e.runExpressions === void 0 || e.runExpressions
      }, this.globalData = {
        _mdf: !1,
        frameNum: -1,
        defs: _,
        renderConfig: this.renderConfig
      }, this.elements = [], this.pendingElements = [], this.destroyed = !1, this.rendererType = "svg";
    }
    return U([ne], Zs), Zs.prototype.createComp = function(t) {
      return new $r(t, this.globalData, this);
    }, Re("svg", Zs), qe.registerModifier("tm", Kt), qe.registerModifier("pb", wi), qe.registerModifier("rp", se), qe.registerModifier("rd", Bi), qe.registerModifier("zz", ji), qe.registerModifier("op", lt), wt;
  });
})(fn, fn.exports);
var Qa = fn.exports;
const Ja = /* @__PURE__ */ Ka(Qa);
function tl(l, r, a) {
  return Ja.loadAnimation({
    container: l,
    renderer: "svg",
    loop: a.loop,
    autoplay: a.autoplay,
    path: r
  });
}
function Tn() {
  return {
    async: !1,
    breaks: !1,
    extensions: null,
    gfm: !0,
    hooks: null,
    pedantic: !1,
    renderer: null,
    silent: !1,
    tokenizer: null,
    walkTokens: null
  };
}
let Ji = Tn();
function Go(l) {
  Ji = l;
}
const Yo = /[&<>"']/, el = new RegExp(Yo.source, "g"), Xo = /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, il = new RegExp(Xo.source, "g"), rl = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
}, oo = (l) => rl[l];
function Le(l, r) {
  if (r) {
    if (Yo.test(l))
      return l.replace(el, oo);
  } else if (Xo.test(l))
    return l.replace(il, oo);
  return l;
}
const sl = /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig;
function nl(l) {
  return l.replace(sl, (r, a) => (a = a.toLowerCase(), a === "colon" ? ":" : a.charAt(0) === "#" ? a.charAt(1) === "x" ? String.fromCharCode(parseInt(a.substring(2), 16)) : String.fromCharCode(+a.substring(1)) : ""));
}
const ol = /(^|[^\[])\^/g;
function Mt(l, r) {
  let a = typeof l == "string" ? l : l.source;
  r = r || "";
  const h = {
    replace: (g, v) => {
      let b = typeof v == "string" ? v : v.source;
      return b = b.replace(ol, "$1"), a = a.replace(g, b), h;
    },
    getRegex: () => new RegExp(a, r)
  };
  return h;
}
function ao(l) {
  try {
    l = encodeURI(l).replace(/%25/g, "%");
  } catch {
    return null;
  }
  return l;
}
const Yr = { exec: () => null };
function lo(l, r) {
  const a = l.replace(/\|/g, (v, b, O) => {
    let V = !1, W = b;
    for (; --W >= 0 && O[W] === "\\"; )
      V = !V;
    return V ? "|" : " |";
  }), h = a.split(/ \|/);
  let g = 0;
  if (h[0].trim() || h.shift(), h.length > 0 && !h[h.length - 1].trim() && h.pop(), r)
    if (h.length > r)
      h.splice(r);
    else
      for (; h.length < r; )
        h.push("");
  for (; g < h.length; g++)
    h[g] = h[g].trim().replace(/\\\|/g, "|");
  return h;
}
function gs(l, r, a) {
  const h = l.length;
  if (h === 0)
    return "";
  let g = 0;
  for (; g < h && l.charAt(h - g - 1) === r; )
    g++;
  return l.slice(0, h - g);
}
function al(l, r) {
  if (l.indexOf(r[1]) === -1)
    return -1;
  let a = 0;
  for (let h = 0; h < l.length; h++)
    if (l[h] === "\\")
      h++;
    else if (l[h] === r[0])
      a++;
    else if (l[h] === r[1] && (a--, a < 0))
      return h;
  return -1;
}
function ho(l, r, a, h) {
  const g = r.href, v = r.title ? Le(r.title) : null, b = l[1].replace(/\\([\[\]])/g, "$1");
  if (l[0].charAt(0) !== "!") {
    h.state.inLink = !0;
    const O = {
      type: "link",
      raw: a,
      href: g,
      title: v,
      text: b,
      tokens: h.inlineTokens(b)
    };
    return h.state.inLink = !1, O;
  }
  return {
    type: "image",
    raw: a,
    href: g,
    title: v,
    text: Le(b)
  };
}
function ll(l, r) {
  const a = l.match(/^(\s+)(?:```)/);
  if (a === null)
    return r;
  const h = a[1];
  return r.split(`
`).map((g) => {
    const v = g.match(/^\s+/);
    if (v === null)
      return g;
    const [b] = v;
    return b.length >= h.length ? g.slice(h.length) : g;
  }).join(`
`);
}
class Cs {
  // set by the lexer
  constructor(r) {
    Vt(this, "options");
    Vt(this, "rules");
    // set by the lexer
    Vt(this, "lexer");
    this.options = r || Ji;
  }
  space(r) {
    const a = this.rules.block.newline.exec(r);
    if (a && a[0].length > 0)
      return {
        type: "space",
        raw: a[0]
      };
  }
  code(r) {
    const a = this.rules.block.code.exec(r);
    if (a) {
      const h = a[0].replace(/^ {1,4}/gm, "");
      return {
        type: "code",
        raw: a[0],
        codeBlockStyle: "indented",
        text: this.options.pedantic ? h : gs(h, `
`)
      };
    }
  }
  fences(r) {
    const a = this.rules.block.fences.exec(r);
    if (a) {
      const h = a[0], g = ll(h, a[3] || "");
      return {
        type: "code",
        raw: h,
        lang: a[2] ? a[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : a[2],
        text: g
      };
    }
  }
  heading(r) {
    const a = this.rules.block.heading.exec(r);
    if (a) {
      let h = a[2].trim();
      if (/#$/.test(h)) {
        const g = gs(h, "#");
        (this.options.pedantic || !g || / $/.test(g)) && (h = g.trim());
      }
      return {
        type: "heading",
        raw: a[0],
        depth: a[1].length,
        text: h,
        tokens: this.lexer.inline(h)
      };
    }
  }
  hr(r) {
    const a = this.rules.block.hr.exec(r);
    if (a)
      return {
        type: "hr",
        raw: a[0]
      };
  }
  blockquote(r) {
    const a = this.rules.block.blockquote.exec(r);
    if (a) {
      let h = a[0].replace(/\n {0,3}((?:=+|-+) *)(?=\n|$)/g, `
    $1`);
      h = gs(h.replace(/^ *>[ \t]?/gm, ""), `
`);
      const g = this.lexer.state.top;
      this.lexer.state.top = !0;
      const v = this.lexer.blockTokens(h);
      return this.lexer.state.top = g, {
        type: "blockquote",
        raw: a[0],
        tokens: v,
        text: h
      };
    }
  }
  list(r) {
    let a = this.rules.block.list.exec(r);
    if (a) {
      let h = a[1].trim();
      const g = h.length > 1, v = {
        type: "list",
        raw: "",
        ordered: g,
        start: g ? +h.slice(0, -1) : "",
        loose: !1,
        items: []
      };
      h = g ? `\\d{1,9}\\${h.slice(-1)}` : `\\${h}`, this.options.pedantic && (h = g ? h : "[*+-]");
      const b = new RegExp(`^( {0,3}${h})((?:[	 ][^\\n]*)?(?:\\n|$))`);
      let O = "", V = "", W = !1;
      for (; r; ) {
        let H = !1;
        if (!(a = b.exec(r)) || this.rules.block.hr.test(r))
          break;
        O = a[0], r = r.substring(O.length);
        let U = a[2].split(`
`, 1)[0].replace(/^\t+/, (yt) => " ".repeat(3 * yt.length)), R = r.split(`
`, 1)[0], X = 0;
        this.options.pedantic ? (X = 2, V = U.trimStart()) : (X = a[2].search(/[^ ]/), X = X > 4 ? 1 : X, V = U.slice(X), X += a[1].length);
        let tt = !1;
        if (!U && /^ *$/.test(R) && (O += R + `
`, r = r.substring(R.length + 1), H = !0), !H) {
          const yt = new RegExp(`^ {0,${Math.min(3, X - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), mt = new RegExp(`^ {0,${Math.min(3, X - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), jt = new RegExp(`^ {0,${Math.min(3, X - 1)}}(?:\`\`\`|~~~)`), Ft = new RegExp(`^ {0,${Math.min(3, X - 1)}}#`);
          for (; r; ) {
            const Rt = r.split(`
`, 1)[0];
            if (R = Rt, this.options.pedantic && (R = R.replace(/^ {1,4}(?=( {4})*[^ ])/g, "  ")), jt.test(R) || Ft.test(R) || yt.test(R) || mt.test(r))
              break;
            if (R.search(/[^ ]/) >= X || !R.trim())
              V += `
` + R.slice(X);
            else {
              if (tt || U.search(/[^ ]/) >= 4 || jt.test(U) || Ft.test(U) || mt.test(U))
                break;
              V += `
` + R;
            }
            !tt && !R.trim() && (tt = !0), O += Rt + `
`, r = r.substring(Rt.length + 1), U = R.slice(X);
          }
        }
        v.loose || (W ? v.loose = !0 : /\n *\n *$/.test(O) && (W = !0));
        let rt = null, vt;
        this.options.gfm && (rt = /^\[[ xX]\] /.exec(V), rt && (vt = rt[0] !== "[ ] ", V = V.replace(/^\[[ xX]\] +/, ""))), v.items.push({
          type: "list_item",
          raw: O,
          task: !!rt,
          checked: vt,
          loose: !1,
          text: V,
          tokens: []
        }), v.raw += O;
      }
      v.items[v.items.length - 1].raw = O.trimEnd(), v.items[v.items.length - 1].text = V.trimEnd(), v.raw = v.raw.trimEnd();
      for (let H = 0; H < v.items.length; H++)
        if (this.lexer.state.top = !1, v.items[H].tokens = this.lexer.blockTokens(v.items[H].text, []), !v.loose) {
          const U = v.items[H].tokens.filter((X) => X.type === "space"), R = U.length > 0 && U.some((X) => /\n.*\n/.test(X.raw));
          v.loose = R;
        }
      if (v.loose)
        for (let H = 0; H < v.items.length; H++)
          v.items[H].loose = !0;
      return v;
    }
  }
  html(r) {
    const a = this.rules.block.html.exec(r);
    if (a)
      return {
        type: "html",
        block: !0,
        raw: a[0],
        pre: a[1] === "pre" || a[1] === "script" || a[1] === "style",
        text: a[0]
      };
  }
  def(r) {
    const a = this.rules.block.def.exec(r);
    if (a) {
      const h = a[1].toLowerCase().replace(/\s+/g, " "), g = a[2] ? a[2].replace(/^<(.*)>$/, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", v = a[3] ? a[3].substring(1, a[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : a[3];
      return {
        type: "def",
        tag: h,
        raw: a[0],
        href: g,
        title: v
      };
    }
  }
  table(r) {
    const a = this.rules.block.table.exec(r);
    if (!a || !/[:|]/.test(a[2]))
      return;
    const h = lo(a[1]), g = a[2].replace(/^\||\| *$/g, "").split("|"), v = a[3] && a[3].trim() ? a[3].replace(/\n[ \t]*$/, "").split(`
`) : [], b = {
      type: "table",
      raw: a[0],
      header: [],
      align: [],
      rows: []
    };
    if (h.length === g.length) {
      for (const O of g)
        /^ *-+: *$/.test(O) ? b.align.push("right") : /^ *:-+: *$/.test(O) ? b.align.push("center") : /^ *:-+ *$/.test(O) ? b.align.push("left") : b.align.push(null);
      for (const O of h)
        b.header.push({
          text: O,
          tokens: this.lexer.inline(O)
        });
      for (const O of v)
        b.rows.push(lo(O, b.header.length).map((V) => ({
          text: V,
          tokens: this.lexer.inline(V)
        })));
      return b;
    }
  }
  lheading(r) {
    const a = this.rules.block.lheading.exec(r);
    if (a)
      return {
        type: "heading",
        raw: a[0],
        depth: a[2].charAt(0) === "=" ? 1 : 2,
        text: a[1],
        tokens: this.lexer.inline(a[1])
      };
  }
  paragraph(r) {
    const a = this.rules.block.paragraph.exec(r);
    if (a) {
      const h = a[1].charAt(a[1].length - 1) === `
` ? a[1].slice(0, -1) : a[1];
      return {
        type: "paragraph",
        raw: a[0],
        text: h,
        tokens: this.lexer.inline(h)
      };
    }
  }
  text(r) {
    const a = this.rules.block.text.exec(r);
    if (a)
      return {
        type: "text",
        raw: a[0],
        text: a[0],
        tokens: this.lexer.inline(a[0])
      };
  }
  escape(r) {
    const a = this.rules.inline.escape.exec(r);
    if (a)
      return {
        type: "escape",
        raw: a[0],
        text: Le(a[1])
      };
  }
  tag(r) {
    const a = this.rules.inline.tag.exec(r);
    if (a)
      return !this.lexer.state.inLink && /^<a /i.test(a[0]) ? this.lexer.state.inLink = !0 : this.lexer.state.inLink && /^<\/a>/i.test(a[0]) && (this.lexer.state.inLink = !1), !this.lexer.state.inRawBlock && /^<(pre|code|kbd|script)(\s|>)/i.test(a[0]) ? this.lexer.state.inRawBlock = !0 : this.lexer.state.inRawBlock && /^<\/(pre|code|kbd|script)(\s|>)/i.test(a[0]) && (this.lexer.state.inRawBlock = !1), {
        type: "html",
        raw: a[0],
        inLink: this.lexer.state.inLink,
        inRawBlock: this.lexer.state.inRawBlock,
        block: !1,
        text: a[0]
      };
  }
  link(r) {
    const a = this.rules.inline.link.exec(r);
    if (a) {
      const h = a[2].trim();
      if (!this.options.pedantic && /^</.test(h)) {
        if (!/>$/.test(h))
          return;
        const b = gs(h.slice(0, -1), "\\");
        if ((h.length - b.length) % 2 === 0)
          return;
      } else {
        const b = al(a[2], "()");
        if (b > -1) {
          const V = (a[0].indexOf("!") === 0 ? 5 : 4) + a[1].length + b;
          a[2] = a[2].substring(0, b), a[0] = a[0].substring(0, V).trim(), a[3] = "";
        }
      }
      let g = a[2], v = "";
      if (this.options.pedantic) {
        const b = /^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(g);
        b && (g = b[1], v = b[3]);
      } else
        v = a[3] ? a[3].slice(1, -1) : "";
      return g = g.trim(), /^</.test(g) && (this.options.pedantic && !/>$/.test(h) ? g = g.slice(1) : g = g.slice(1, -1)), ho(a, {
        href: g && g.replace(this.rules.inline.anyPunctuation, "$1"),
        title: v && v.replace(this.rules.inline.anyPunctuation, "$1")
      }, a[0], this.lexer);
    }
  }
  reflink(r, a) {
    let h;
    if ((h = this.rules.inline.reflink.exec(r)) || (h = this.rules.inline.nolink.exec(r))) {
      const g = (h[2] || h[1]).replace(/\s+/g, " "), v = a[g.toLowerCase()];
      if (!v) {
        const b = h[0].charAt(0);
        return {
          type: "text",
          raw: b,
          text: b
        };
      }
      return ho(h, v, h[0], this.lexer);
    }
  }
  emStrong(r, a, h = "") {
    let g = this.rules.inline.emStrongLDelim.exec(r);
    if (!g || g[3] && h.match(/[\p{L}\p{N}]/u))
      return;
    if (!(g[1] || g[2] || "") || !h || this.rules.inline.punctuation.exec(h)) {
      const b = [...g[0]].length - 1;
      let O, V, W = b, H = 0;
      const U = g[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (U.lastIndex = 0, a = a.slice(-1 * r.length + b); (g = U.exec(a)) != null; ) {
        if (O = g[1] || g[2] || g[3] || g[4] || g[5] || g[6], !O)
          continue;
        if (V = [...O].length, g[3] || g[4]) {
          W += V;
          continue;
        } else if ((g[5] || g[6]) && b % 3 && !((b + V) % 3)) {
          H += V;
          continue;
        }
        if (W -= V, W > 0)
          continue;
        V = Math.min(V, V + W + H);
        const R = [...g[0]][0].length, X = r.slice(0, b + g.index + R + V);
        if (Math.min(b, V) % 2) {
          const rt = X.slice(1, -1);
          return {
            type: "em",
            raw: X,
            text: rt,
            tokens: this.lexer.inlineTokens(rt)
          };
        }
        const tt = X.slice(2, -2);
        return {
          type: "strong",
          raw: X,
          text: tt,
          tokens: this.lexer.inlineTokens(tt)
        };
      }
    }
  }
  codespan(r) {
    const a = this.rules.inline.code.exec(r);
    if (a) {
      let h = a[2].replace(/\n/g, " ");
      const g = /[^ ]/.test(h), v = /^ /.test(h) && / $/.test(h);
      return g && v && (h = h.substring(1, h.length - 1)), h = Le(h, !0), {
        type: "codespan",
        raw: a[0],
        text: h
      };
    }
  }
  br(r) {
    const a = this.rules.inline.br.exec(r);
    if (a)
      return {
        type: "br",
        raw: a[0]
      };
  }
  del(r) {
    const a = this.rules.inline.del.exec(r);
    if (a)
      return {
        type: "del",
        raw: a[0],
        text: a[2],
        tokens: this.lexer.inlineTokens(a[2])
      };
  }
  autolink(r) {
    const a = this.rules.inline.autolink.exec(r);
    if (a) {
      let h, g;
      return a[2] === "@" ? (h = Le(a[1]), g = "mailto:" + h) : (h = Le(a[1]), g = h), {
        type: "link",
        raw: a[0],
        text: h,
        href: g,
        tokens: [
          {
            type: "text",
            raw: h,
            text: h
          }
        ]
      };
    }
  }
  url(r) {
    var h;
    let a;
    if (a = this.rules.inline.url.exec(r)) {
      let g, v;
      if (a[2] === "@")
        g = Le(a[0]), v = "mailto:" + g;
      else {
        let b;
        do
          b = a[0], a[0] = ((h = this.rules.inline._backpedal.exec(a[0])) == null ? void 0 : h[0]) ?? "";
        while (b !== a[0]);
        g = Le(a[0]), a[1] === "www." ? v = "http://" + a[0] : v = a[0];
      }
      return {
        type: "link",
        raw: a[0],
        text: g,
        href: v,
        tokens: [
          {
            type: "text",
            raw: g,
            text: g
          }
        ]
      };
    }
  }
  inlineText(r) {
    const a = this.rules.inline.text.exec(r);
    if (a) {
      let h;
      return this.lexer.state.inRawBlock ? h = a[0] : h = Le(a[0]), {
        type: "text",
        raw: a[0],
        text: h
      };
    }
  }
}
const hl = /^(?: *(?:\n|$))+/, fl = /^( {4}[^\n]+(?:\n(?: *(?:\n|$))*)?)+/, cl = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, Kr = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, ul = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, Zo = /(?:[*+-]|\d{1,9}[.)])/, Ko = Mt(/^(?!bull |blockCode|fences|blockquote|heading|html)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html))+?)\n {0,3}(=+|-+) *(?:\n+|$)/).replace(/bull/g, Zo).replace(/blockCode/g, / {4}/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).getRegex(), An = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, pl = /^[^\n]+/, Sn = /(?!\s*\])(?:\\.|[^\[\]\\])+/, dl = Mt(/^ {0,3}\[(label)\]: *(?:\n *)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n *)?| *\n *)(title))? *(?:\n+|$)/).replace("label", Sn).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), ml = Mt(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, Zo).getRegex(), Rs = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", En = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, gl = Mt("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n *)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$))", "i").replace("comment", En).replace("tag", Rs).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), Qo = Mt(An).replace("hr", Kr).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Rs).getRegex(), vl = Mt(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", Qo).getRegex(), Cn = {
  blockquote: vl,
  code: fl,
  def: dl,
  fences: cl,
  heading: ul,
  hr: Kr,
  html: gl,
  lheading: Ko,
  list: ml,
  newline: hl,
  paragraph: Qo,
  table: Yr,
  text: pl
}, fo = Mt("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", Kr).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", " {4}[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Rs).getRegex(), yl = {
  ...Cn,
  table: fo,
  paragraph: Mt(An).replace("hr", Kr).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", fo).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Rs).getRegex()
}, _l = {
  ...Cn,
  html: Mt(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", En).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
  heading: /^(#{1,6})(.*)(?:\n+|$)/,
  fences: Yr,
  // fences not supported
  lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
  paragraph: Mt(An).replace("hr", Kr).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", Ko).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex()
}, Jo = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, bl = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, ta = /^( {2,}|\\)\n(?!\s*$)/, wl = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, Qr = "\\p{P}\\p{S}", kl = Mt(/^((?![*_])[\spunctuation])/, "u").replace(/punctuation/g, Qr).getRegex(), xl = /\[[^[\]]*?\]\([^\(\)]*?\)|`[^`]*?`|<[^<>]*?>/g, Tl = Mt(/^(?:\*+(?:((?!\*)[punct])|[^\s*]))|^_+(?:((?!_)[punct])|([^\s_]))/, "u").replace(/punct/g, Qr).getRegex(), Al = Mt("^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)[punct](\\*+)(?=[\\s]|$)|[^punct\\s](\\*+)(?!\\*)(?=[punct\\s]|$)|(?!\\*)[punct\\s](\\*+)(?=[^punct\\s])|[\\s](\\*+)(?!\\*)(?=[punct])|(?!\\*)[punct](\\*+)(?!\\*)(?=[punct])|[^punct\\s](\\*+)(?=[^punct\\s])", "gu").replace(/punct/g, Qr).getRegex(), Sl = Mt("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)[punct](_+)(?=[\\s]|$)|[^punct\\s](_+)(?!_)(?=[punct\\s]|$)|(?!_)[punct\\s](_+)(?=[^punct\\s])|[\\s](_+)(?!_)(?=[punct])|(?!_)[punct](_+)(?!_)(?=[punct])", "gu").replace(/punct/g, Qr).getRegex(), El = Mt(/\\([punct])/, "gu").replace(/punct/g, Qr).getRegex(), Cl = Mt(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), Pl = Mt(En).replace("(?:-->|$)", "-->").getRegex(), Ml = Mt("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", Pl).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), Ps = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/, Il = Mt(/^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/).replace("label", Ps).replace("href", /<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), ea = Mt(/^!?\[(label)\]\[(ref)\]/).replace("label", Ps).replace("ref", Sn).getRegex(), ia = Mt(/^!?\[(ref)\](?:\[\])?/).replace("ref", Sn).getRegex(), Ll = Mt("reflink|nolink(?!\\()", "g").replace("reflink", ea).replace("nolink", ia).getRegex(), Pn = {
  _backpedal: Yr,
  // only used for GFM url
  anyPunctuation: El,
  autolink: Cl,
  blockSkip: xl,
  br: ta,
  code: bl,
  del: Yr,
  emStrongLDelim: Tl,
  emStrongRDelimAst: Al,
  emStrongRDelimUnd: Sl,
  escape: Jo,
  link: Il,
  nolink: ia,
  punctuation: kl,
  reflink: ea,
  reflinkSearch: Ll,
  tag: Ml,
  text: wl,
  url: Yr
}, Fl = {
  ...Pn,
  link: Mt(/^!?\[(label)\]\((.*?)\)/).replace("label", Ps).getRegex(),
  reflink: Mt(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", Ps).getRegex()
}, cn = {
  ...Pn,
  escape: Mt(Jo).replace("])", "~|])").getRegex(),
  url: Mt(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/, "i").replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),
  _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
  del: /^(~~?)(?=[^\s~])([\s\S]*?[^\s~])\1(?=[^~]|$)/,
  text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
}, Rl = {
  ...cn,
  br: Mt(ta).replace("{2,}", "*").getRegex(),
  text: Mt(cn.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
}, vs = {
  normal: Cn,
  gfm: yl,
  pedantic: _l
}, jr = {
  normal: Pn,
  gfm: cn,
  breaks: Rl,
  pedantic: Fl
};
class Ke {
  constructor(r) {
    Vt(this, "tokens");
    Vt(this, "options");
    Vt(this, "state");
    Vt(this, "tokenizer");
    Vt(this, "inlineQueue");
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = r || Ji, this.options.tokenizer = this.options.tokenizer || new Cs(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = {
      inLink: !1,
      inRawBlock: !1,
      top: !0
    };
    const a = {
      block: vs.normal,
      inline: jr.normal
    };
    this.options.pedantic ? (a.block = vs.pedantic, a.inline = jr.pedantic) : this.options.gfm && (a.block = vs.gfm, this.options.breaks ? a.inline = jr.breaks : a.inline = jr.gfm), this.tokenizer.rules = a;
  }
  /**
   * Expose Rules
   */
  static get rules() {
    return {
      block: vs,
      inline: jr
    };
  }
  /**
   * Static Lex Method
   */
  static lex(r, a) {
    return new Ke(a).lex(r);
  }
  /**
   * Static Lex Inline Method
   */
  static lexInline(r, a) {
    return new Ke(a).inlineTokens(r);
  }
  /**
   * Preprocessing
   */
  lex(r) {
    r = r.replace(/\r\n|\r/g, `
`), this.blockTokens(r, this.tokens);
    for (let a = 0; a < this.inlineQueue.length; a++) {
      const h = this.inlineQueue[a];
      this.inlineTokens(h.src, h.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(r, a = []) {
    this.options.pedantic ? r = r.replace(/\t/g, "    ").replace(/^ +$/gm, "") : r = r.replace(/^( *)(\t+)/gm, (O, V, W) => V + "    ".repeat(W.length));
    let h, g, v, b;
    for (; r; )
      if (!(this.options.extensions && this.options.extensions.block && this.options.extensions.block.some((O) => (h = O.call({ lexer: this }, r, a)) ? (r = r.substring(h.raw.length), a.push(h), !0) : !1))) {
        if (h = this.tokenizer.space(r)) {
          r = r.substring(h.raw.length), h.raw.length === 1 && a.length > 0 ? a[a.length - 1].raw += `
` : a.push(h);
          continue;
        }
        if (h = this.tokenizer.code(r)) {
          r = r.substring(h.raw.length), g = a[a.length - 1], g && (g.type === "paragraph" || g.type === "text") ? (g.raw += `
` + h.raw, g.text += `
` + h.text, this.inlineQueue[this.inlineQueue.length - 1].src = g.text) : a.push(h);
          continue;
        }
        if (h = this.tokenizer.fences(r)) {
          r = r.substring(h.raw.length), a.push(h);
          continue;
        }
        if (h = this.tokenizer.heading(r)) {
          r = r.substring(h.raw.length), a.push(h);
          continue;
        }
        if (h = this.tokenizer.hr(r)) {
          r = r.substring(h.raw.length), a.push(h);
          continue;
        }
        if (h = this.tokenizer.blockquote(r)) {
          r = r.substring(h.raw.length), a.push(h);
          continue;
        }
        if (h = this.tokenizer.list(r)) {
          r = r.substring(h.raw.length), a.push(h);
          continue;
        }
        if (h = this.tokenizer.html(r)) {
          r = r.substring(h.raw.length), a.push(h);
          continue;
        }
        if (h = this.tokenizer.def(r)) {
          r = r.substring(h.raw.length), g = a[a.length - 1], g && (g.type === "paragraph" || g.type === "text") ? (g.raw += `
` + h.raw, g.text += `
` + h.raw, this.inlineQueue[this.inlineQueue.length - 1].src = g.text) : this.tokens.links[h.tag] || (this.tokens.links[h.tag] = {
            href: h.href,
            title: h.title
          });
          continue;
        }
        if (h = this.tokenizer.table(r)) {
          r = r.substring(h.raw.length), a.push(h);
          continue;
        }
        if (h = this.tokenizer.lheading(r)) {
          r = r.substring(h.raw.length), a.push(h);
          continue;
        }
        if (v = r, this.options.extensions && this.options.extensions.startBlock) {
          let O = 1 / 0;
          const V = r.slice(1);
          let W;
          this.options.extensions.startBlock.forEach((H) => {
            W = H.call({ lexer: this }, V), typeof W == "number" && W >= 0 && (O = Math.min(O, W));
          }), O < 1 / 0 && O >= 0 && (v = r.substring(0, O + 1));
        }
        if (this.state.top && (h = this.tokenizer.paragraph(v))) {
          g = a[a.length - 1], b && g.type === "paragraph" ? (g.raw += `
` + h.raw, g.text += `
` + h.text, this.inlineQueue.pop(), this.inlineQueue[this.inlineQueue.length - 1].src = g.text) : a.push(h), b = v.length !== r.length, r = r.substring(h.raw.length);
          continue;
        }
        if (h = this.tokenizer.text(r)) {
          r = r.substring(h.raw.length), g = a[a.length - 1], g && g.type === "text" ? (g.raw += `
` + h.raw, g.text += `
` + h.text, this.inlineQueue.pop(), this.inlineQueue[this.inlineQueue.length - 1].src = g.text) : a.push(h);
          continue;
        }
        if (r) {
          const O = "Infinite loop on byte: " + r.charCodeAt(0);
          if (this.options.silent) {
            console.error(O);
            break;
          } else
            throw new Error(O);
        }
      }
    return this.state.top = !0, a;
  }
  inline(r, a = []) {
    return this.inlineQueue.push({ src: r, tokens: a }), a;
  }
  /**
   * Lexing/Compiling
   */
  inlineTokens(r, a = []) {
    let h, g, v, b = r, O, V, W;
    if (this.tokens.links) {
      const H = Object.keys(this.tokens.links);
      if (H.length > 0)
        for (; (O = this.tokenizer.rules.inline.reflinkSearch.exec(b)) != null; )
          H.includes(O[0].slice(O[0].lastIndexOf("[") + 1, -1)) && (b = b.slice(0, O.index) + "[" + "a".repeat(O[0].length - 2) + "]" + b.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
    }
    for (; (O = this.tokenizer.rules.inline.blockSkip.exec(b)) != null; )
      b = b.slice(0, O.index) + "[" + "a".repeat(O[0].length - 2) + "]" + b.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    for (; (O = this.tokenizer.rules.inline.anyPunctuation.exec(b)) != null; )
      b = b.slice(0, O.index) + "++" + b.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
    for (; r; )
      if (V || (W = ""), V = !1, !(this.options.extensions && this.options.extensions.inline && this.options.extensions.inline.some((H) => (h = H.call({ lexer: this }, r, a)) ? (r = r.substring(h.raw.length), a.push(h), !0) : !1))) {
        if (h = this.tokenizer.escape(r)) {
          r = r.substring(h.raw.length), a.push(h);
          continue;
        }
        if (h = this.tokenizer.tag(r)) {
          r = r.substring(h.raw.length), g = a[a.length - 1], g && h.type === "text" && g.type === "text" ? (g.raw += h.raw, g.text += h.text) : a.push(h);
          continue;
        }
        if (h = this.tokenizer.link(r)) {
          r = r.substring(h.raw.length), a.push(h);
          continue;
        }
        if (h = this.tokenizer.reflink(r, this.tokens.links)) {
          r = r.substring(h.raw.length), g = a[a.length - 1], g && h.type === "text" && g.type === "text" ? (g.raw += h.raw, g.text += h.text) : a.push(h);
          continue;
        }
        if (h = this.tokenizer.emStrong(r, b, W)) {
          r = r.substring(h.raw.length), a.push(h);
          continue;
        }
        if (h = this.tokenizer.codespan(r)) {
          r = r.substring(h.raw.length), a.push(h);
          continue;
        }
        if (h = this.tokenizer.br(r)) {
          r = r.substring(h.raw.length), a.push(h);
          continue;
        }
        if (h = this.tokenizer.del(r)) {
          r = r.substring(h.raw.length), a.push(h);
          continue;
        }
        if (h = this.tokenizer.autolink(r)) {
          r = r.substring(h.raw.length), a.push(h);
          continue;
        }
        if (!this.state.inLink && (h = this.tokenizer.url(r))) {
          r = r.substring(h.raw.length), a.push(h);
          continue;
        }
        if (v = r, this.options.extensions && this.options.extensions.startInline) {
          let H = 1 / 0;
          const U = r.slice(1);
          let R;
          this.options.extensions.startInline.forEach((X) => {
            R = X.call({ lexer: this }, U), typeof R == "number" && R >= 0 && (H = Math.min(H, R));
          }), H < 1 / 0 && H >= 0 && (v = r.substring(0, H + 1));
        }
        if (h = this.tokenizer.inlineText(v)) {
          r = r.substring(h.raw.length), h.raw.slice(-1) !== "_" && (W = h.raw.slice(-1)), V = !0, g = a[a.length - 1], g && g.type === "text" ? (g.raw += h.raw, g.text += h.text) : a.push(h);
          continue;
        }
        if (r) {
          const H = "Infinite loop on byte: " + r.charCodeAt(0);
          if (this.options.silent) {
            console.error(H);
            break;
          } else
            throw new Error(H);
        }
      }
    return a;
  }
}
class Ms {
  constructor(r) {
    Vt(this, "options");
    this.options = r || Ji;
  }
  code(r, a, h) {
    var v;
    const g = (v = (a || "").match(/^\S*/)) == null ? void 0 : v[0];
    return r = r.replace(/\n$/, "") + `
`, g ? '<pre><code class="language-' + Le(g) + '">' + (h ? r : Le(r, !0)) + `</code></pre>
` : "<pre><code>" + (h ? r : Le(r, !0)) + `</code></pre>
`;
  }
  blockquote(r) {
    return `<blockquote>
${r}</blockquote>
`;
  }
  html(r, a) {
    return r;
  }
  heading(r, a, h) {
    return `<h${a}>${r}</h${a}>
`;
  }
  hr() {
    return `<hr>
`;
  }
  list(r, a, h) {
    const g = a ? "ol" : "ul", v = a && h !== 1 ? ' start="' + h + '"' : "";
    return "<" + g + v + `>
` + r + "</" + g + `>
`;
  }
  listitem(r, a, h) {
    return `<li>${r}</li>
`;
  }
  checkbox(r) {
    return "<input " + (r ? 'checked="" ' : "") + 'disabled="" type="checkbox">';
  }
  paragraph(r) {
    return `<p>${r}</p>
`;
  }
  table(r, a) {
    return a && (a = `<tbody>${a}</tbody>`), `<table>
<thead>
` + r + `</thead>
` + a + `</table>
`;
  }
  tablerow(r) {
    return `<tr>
${r}</tr>
`;
  }
  tablecell(r, a) {
    const h = a.header ? "th" : "td";
    return (a.align ? `<${h} align="${a.align}">` : `<${h}>`) + r + `</${h}>
`;
  }
  /**
   * span level renderer
   */
  strong(r) {
    return `<strong>${r}</strong>`;
  }
  em(r) {
    return `<em>${r}</em>`;
  }
  codespan(r) {
    return `<code>${r}</code>`;
  }
  br() {
    return "<br>";
  }
  del(r) {
    return `<del>${r}</del>`;
  }
  link(r, a, h) {
    const g = ao(r);
    if (g === null)
      return h;
    r = g;
    let v = '<a href="' + r + '"';
    return a && (v += ' title="' + a + '"'), v += ">" + h + "</a>", v;
  }
  image(r, a, h) {
    const g = ao(r);
    if (g === null)
      return h;
    r = g;
    let v = `<img src="${r}" alt="${h}"`;
    return a && (v += ` title="${a}"`), v += ">", v;
  }
  text(r) {
    return r;
  }
}
class Mn {
  // no need for block level renderers
  strong(r) {
    return r;
  }
  em(r) {
    return r;
  }
  codespan(r) {
    return r;
  }
  del(r) {
    return r;
  }
  html(r) {
    return r;
  }
  text(r) {
    return r;
  }
  link(r, a, h) {
    return "" + h;
  }
  image(r, a, h) {
    return "" + h;
  }
  br() {
    return "";
  }
}
class Qe {
  constructor(r) {
    Vt(this, "options");
    Vt(this, "renderer");
    Vt(this, "textRenderer");
    this.options = r || Ji, this.options.renderer = this.options.renderer || new Ms(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.textRenderer = new Mn();
  }
  /**
   * Static Parse Method
   */
  static parse(r, a) {
    return new Qe(a).parse(r);
  }
  /**
   * Static Parse Inline Method
   */
  static parseInline(r, a) {
    return new Qe(a).parseInline(r);
  }
  /**
   * Parse Loop
   */
  parse(r, a = !0) {
    let h = "";
    for (let g = 0; g < r.length; g++) {
      const v = r[g];
      if (this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[v.type]) {
        const b = v, O = this.options.extensions.renderers[b.type].call({ parser: this }, b);
        if (O !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "paragraph", "text"].includes(b.type)) {
          h += O || "";
          continue;
        }
      }
      switch (v.type) {
        case "space":
          continue;
        case "hr": {
          h += this.renderer.hr();
          continue;
        }
        case "heading": {
          const b = v;
          h += this.renderer.heading(this.parseInline(b.tokens), b.depth, nl(this.parseInline(b.tokens, this.textRenderer)));
          continue;
        }
        case "code": {
          const b = v;
          h += this.renderer.code(b.text, b.lang, !!b.escaped);
          continue;
        }
        case "table": {
          const b = v;
          let O = "", V = "";
          for (let H = 0; H < b.header.length; H++)
            V += this.renderer.tablecell(this.parseInline(b.header[H].tokens), { header: !0, align: b.align[H] });
          O += this.renderer.tablerow(V);
          let W = "";
          for (let H = 0; H < b.rows.length; H++) {
            const U = b.rows[H];
            V = "";
            for (let R = 0; R < U.length; R++)
              V += this.renderer.tablecell(this.parseInline(U[R].tokens), { header: !1, align: b.align[R] });
            W += this.renderer.tablerow(V);
          }
          h += this.renderer.table(O, W);
          continue;
        }
        case "blockquote": {
          const b = v, O = this.parse(b.tokens);
          h += this.renderer.blockquote(O);
          continue;
        }
        case "list": {
          const b = v, O = b.ordered, V = b.start, W = b.loose;
          let H = "";
          for (let U = 0; U < b.items.length; U++) {
            const R = b.items[U], X = R.checked, tt = R.task;
            let rt = "";
            if (R.task) {
              const vt = this.renderer.checkbox(!!X);
              W ? R.tokens.length > 0 && R.tokens[0].type === "paragraph" ? (R.tokens[0].text = vt + " " + R.tokens[0].text, R.tokens[0].tokens && R.tokens[0].tokens.length > 0 && R.tokens[0].tokens[0].type === "text" && (R.tokens[0].tokens[0].text = vt + " " + R.tokens[0].tokens[0].text)) : R.tokens.unshift({
                type: "text",
                text: vt + " "
              }) : rt += vt + " ";
            }
            rt += this.parse(R.tokens, W), H += this.renderer.listitem(rt, tt, !!X);
          }
          h += this.renderer.list(H, O, V);
          continue;
        }
        case "html": {
          const b = v;
          h += this.renderer.html(b.text, b.block);
          continue;
        }
        case "paragraph": {
          const b = v;
          h += this.renderer.paragraph(this.parseInline(b.tokens));
          continue;
        }
        case "text": {
          let b = v, O = b.tokens ? this.parseInline(b.tokens) : b.text;
          for (; g + 1 < r.length && r[g + 1].type === "text"; )
            b = r[++g], O += `
` + (b.tokens ? this.parseInline(b.tokens) : b.text);
          h += a ? this.renderer.paragraph(O) : O;
          continue;
        }
        default: {
          const b = 'Token with "' + v.type + '" type was not found.';
          if (this.options.silent)
            return console.error(b), "";
          throw new Error(b);
        }
      }
    }
    return h;
  }
  /**
   * Parse Inline Tokens
   */
  parseInline(r, a) {
    a = a || this.renderer;
    let h = "";
    for (let g = 0; g < r.length; g++) {
      const v = r[g];
      if (this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[v.type]) {
        const b = this.options.extensions.renderers[v.type].call({ parser: this }, v);
        if (b !== !1 || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(v.type)) {
          h += b || "";
          continue;
        }
      }
      switch (v.type) {
        case "escape": {
          const b = v;
          h += a.text(b.text);
          break;
        }
        case "html": {
          const b = v;
          h += a.html(b.text);
          break;
        }
        case "link": {
          const b = v;
          h += a.link(b.href, b.title, this.parseInline(b.tokens, a));
          break;
        }
        case "image": {
          const b = v;
          h += a.image(b.href, b.title, b.text);
          break;
        }
        case "strong": {
          const b = v;
          h += a.strong(this.parseInline(b.tokens, a));
          break;
        }
        case "em": {
          const b = v;
          h += a.em(this.parseInline(b.tokens, a));
          break;
        }
        case "codespan": {
          const b = v;
          h += a.codespan(b.text);
          break;
        }
        case "br": {
          h += a.br();
          break;
        }
        case "del": {
          const b = v;
          h += a.del(this.parseInline(b.tokens, a));
          break;
        }
        case "text": {
          const b = v;
          h += a.text(b.text);
          break;
        }
        default: {
          const b = 'Token with "' + v.type + '" type was not found.';
          if (this.options.silent)
            return console.error(b), "";
          throw new Error(b);
        }
      }
    }
    return h;
  }
}
class Xr {
  constructor(r) {
    Vt(this, "options");
    this.options = r || Ji;
  }
  /**
   * Process markdown before marked
   */
  preprocess(r) {
    return r;
  }
  /**
   * Process HTML after marked is finished
   */
  postprocess(r) {
    return r;
  }
  /**
   * Process all tokens before walk tokens
   */
  processAllTokens(r) {
    return r;
  }
}
Vt(Xr, "passThroughHooks", /* @__PURE__ */ new Set([
  "preprocess",
  "postprocess",
  "processAllTokens"
]));
var Qi, un, ra;
class Ol {
  constructor(...r) {
    qn(this, Qi);
    Vt(this, "defaults", Tn());
    Vt(this, "options", this.setOptions);
    Vt(this, "parse", ds(this, Qi, un).call(this, Ke.lex, Qe.parse));
    Vt(this, "parseInline", ds(this, Qi, un).call(this, Ke.lexInline, Qe.parseInline));
    Vt(this, "Parser", Qe);
    Vt(this, "Renderer", Ms);
    Vt(this, "TextRenderer", Mn);
    Vt(this, "Lexer", Ke);
    Vt(this, "Tokenizer", Cs);
    Vt(this, "Hooks", Xr);
    this.use(...r);
  }
  /**
   * Run callback for every token
   */
  walkTokens(r, a) {
    var g, v;
    let h = [];
    for (const b of r)
      switch (h = h.concat(a.call(this, b)), b.type) {
        case "table": {
          const O = b;
          for (const V of O.header)
            h = h.concat(this.walkTokens(V.tokens, a));
          for (const V of O.rows)
            for (const W of V)
              h = h.concat(this.walkTokens(W.tokens, a));
          break;
        }
        case "list": {
          const O = b;
          h = h.concat(this.walkTokens(O.items, a));
          break;
        }
        default: {
          const O = b;
          (v = (g = this.defaults.extensions) == null ? void 0 : g.childTokens) != null && v[O.type] ? this.defaults.extensions.childTokens[O.type].forEach((V) => {
            const W = O[V].flat(1 / 0);
            h = h.concat(this.walkTokens(W, a));
          }) : O.tokens && (h = h.concat(this.walkTokens(O.tokens, a)));
        }
      }
    return h;
  }
  use(...r) {
    const a = this.defaults.extensions || { renderers: {}, childTokens: {} };
    return r.forEach((h) => {
      const g = { ...h };
      if (g.async = this.defaults.async || g.async || !1, h.extensions && (h.extensions.forEach((v) => {
        if (!v.name)
          throw new Error("extension name required");
        if ("renderer" in v) {
          const b = a.renderers[v.name];
          b ? a.renderers[v.name] = function(...O) {
            let V = v.renderer.apply(this, O);
            return V === !1 && (V = b.apply(this, O)), V;
          } : a.renderers[v.name] = v.renderer;
        }
        if ("tokenizer" in v) {
          if (!v.level || v.level !== "block" && v.level !== "inline")
            throw new Error("extension level must be 'block' or 'inline'");
          const b = a[v.level];
          b ? b.unshift(v.tokenizer) : a[v.level] = [v.tokenizer], v.start && (v.level === "block" ? a.startBlock ? a.startBlock.push(v.start) : a.startBlock = [v.start] : v.level === "inline" && (a.startInline ? a.startInline.push(v.start) : a.startInline = [v.start]));
        }
        "childTokens" in v && v.childTokens && (a.childTokens[v.name] = v.childTokens);
      }), g.extensions = a), h.renderer) {
        const v = this.defaults.renderer || new Ms(this.defaults);
        for (const b in h.renderer) {
          if (!(b in v))
            throw new Error(`renderer '${b}' does not exist`);
          if (b === "options")
            continue;
          const O = b, V = h.renderer[O], W = v[O];
          v[O] = (...H) => {
            let U = V.apply(v, H);
            return U === !1 && (U = W.apply(v, H)), U || "";
          };
        }
        g.renderer = v;
      }
      if (h.tokenizer) {
        const v = this.defaults.tokenizer || new Cs(this.defaults);
        for (const b in h.tokenizer) {
          if (!(b in v))
            throw new Error(`tokenizer '${b}' does not exist`);
          if (["options", "rules", "lexer"].includes(b))
            continue;
          const O = b, V = h.tokenizer[O], W = v[O];
          v[O] = (...H) => {
            let U = V.apply(v, H);
            return U === !1 && (U = W.apply(v, H)), U;
          };
        }
        g.tokenizer = v;
      }
      if (h.hooks) {
        const v = this.defaults.hooks || new Xr();
        for (const b in h.hooks) {
          if (!(b in v))
            throw new Error(`hook '${b}' does not exist`);
          if (b === "options")
            continue;
          const O = b, V = h.hooks[O], W = v[O];
          Xr.passThroughHooks.has(b) ? v[O] = (H) => {
            if (this.defaults.async)
              return Promise.resolve(V.call(v, H)).then((R) => W.call(v, R));
            const U = V.call(v, H);
            return W.call(v, U);
          } : v[O] = (...H) => {
            let U = V.apply(v, H);
            return U === !1 && (U = W.apply(v, H)), U;
          };
        }
        g.hooks = v;
      }
      if (h.walkTokens) {
        const v = this.defaults.walkTokens, b = h.walkTokens;
        g.walkTokens = function(O) {
          let V = [];
          return V.push(b.call(this, O)), v && (V = V.concat(v.call(this, O))), V;
        };
      }
      this.defaults = { ...this.defaults, ...g };
    }), this;
  }
  setOptions(r) {
    return this.defaults = { ...this.defaults, ...r }, this;
  }
  lexer(r, a) {
    return Ke.lex(r, a ?? this.defaults);
  }
  parser(r, a) {
    return Qe.parse(r, a ?? this.defaults);
  }
}
Qi = new WeakSet(), un = function(r, a) {
  return (h, g) => {
    const v = { ...g }, b = { ...this.defaults, ...v };
    this.defaults.async === !0 && v.async === !1 && (b.silent || console.warn("marked(): The async option was set to true by an extension. The async: false option sent to parse will be ignored."), b.async = !0);
    const O = ds(this, Qi, ra).call(this, !!b.silent, !!b.async);
    if (typeof h > "u" || h === null)
      return O(new Error("marked(): input parameter is undefined or null"));
    if (typeof h != "string")
      return O(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(h) + ", string expected"));
    if (b.hooks && (b.hooks.options = b), b.async)
      return Promise.resolve(b.hooks ? b.hooks.preprocess(h) : h).then((V) => r(V, b)).then((V) => b.hooks ? b.hooks.processAllTokens(V) : V).then((V) => b.walkTokens ? Promise.all(this.walkTokens(V, b.walkTokens)).then(() => V) : V).then((V) => a(V, b)).then((V) => b.hooks ? b.hooks.postprocess(V) : V).catch(O);
    try {
      b.hooks && (h = b.hooks.preprocess(h));
      let V = r(h, b);
      b.hooks && (V = b.hooks.processAllTokens(V)), b.walkTokens && this.walkTokens(V, b.walkTokens);
      let W = a(V, b);
      return b.hooks && (W = b.hooks.postprocess(W)), W;
    } catch (V) {
      return O(V);
    }
  };
}, ra = function(r, a) {
  return (h) => {
    if (h.message += `
Please report this to https://github.com/markedjs/marked.`, r) {
      const g = "<p>An error occurred:</p><pre>" + Le(h.message + "", !0) + "</pre>";
      return a ? Promise.resolve(g) : g;
    }
    if (a)
      return Promise.reject(h);
    throw h;
  };
};
const Ki = new Ol();
function St(l, r) {
  return Ki.parse(l, r);
}
St.options = St.setOptions = function(l) {
  return Ki.setOptions(l), St.defaults = Ki.defaults, Go(St.defaults), St;
};
St.getDefaults = Tn;
St.defaults = Ji;
St.use = function(...l) {
  return Ki.use(...l), St.defaults = Ki.defaults, Go(St.defaults), St;
};
St.walkTokens = function(l, r) {
  return Ki.walkTokens(l, r);
};
St.parseInline = Ki.parseInline;
St.Parser = Qe;
St.parser = Qe.parse;
St.Renderer = Ms;
St.TextRenderer = Mn;
St.Lexer = Ke;
St.lexer = Ke.lex;
St.Tokenizer = Cs;
St.Hooks = Xr;
St.parse = St;
St.options;
St.setOptions;
St.use;
St.walkTokens;
St.parseInline;
Qe.parse;
Ke.lex;
/*! @license DOMPurify 3.4.15 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.4.15/LICENSE */
function co(l, r) {
  (r == null || r > l.length) && (r = l.length);
  for (var a = 0, h = Array(r); a < r; a++) h[a] = l[a];
  return h;
}
function Nl(l) {
  if (Array.isArray(l)) return l;
}
function zl(l, r) {
  var a = l == null ? null : typeof Symbol < "u" && l[Symbol.iterator] || l["@@iterator"];
  if (a != null) {
    var h, g, v, b, O = [], V = !0, W = !1;
    try {
      if (v = (a = a.call(l)).next, r !== 0) for (; !(V = (h = v.call(a)).done) && (O.push(h.value), O.length !== r); V = !0) ;
    } catch (H) {
      W = !0, g = H;
    } finally {
      try {
        if (!V && a.return != null && (b = a.return(), Object(b) !== b)) return;
      } finally {
        if (W) throw g;
      }
    }
    return O;
  }
}
function Dl() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Bl(l, r) {
  return Nl(l) || zl(l, r) || Vl(l, r) || Dl();
}
function Vl(l, r) {
  if (l) {
    if (typeof l == "string") return co(l, r);
    var a = {}.toString.call(l).slice(8, -1);
    return a === "Object" && l.constructor && (a = l.constructor.name), a === "Map" || a === "Set" ? Array.from(l) : a === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a) ? co(l, r) : void 0;
  }
}
const sa = Object.entries, uo = Object.setPrototypeOf, $l = Object.isFrozen, jl = Object.getPrototypeOf, Wl = Object.getOwnPropertyDescriptor;
let re = Object.freeze, oe = Object.seal, br = Object.create, na = typeof Reflect < "u" && Reflect, pn = na.apply, dn = na.construct;
re || (re = function(r) {
  return r;
});
oe || (oe = function(r) {
  return r;
});
pn || (pn = function(r, a) {
  for (var h = arguments.length, g = new Array(h > 2 ? h - 2 : 0), v = 2; v < h; v++)
    g[v - 2] = arguments[v];
  return r.apply(a, g);
});
dn || (dn = function(r) {
  for (var a = arguments.length, h = new Array(a > 1 ? a - 1 : 0), g = 1; g < a; g++)
    h[g - 1] = arguments[g];
  return new r(...h);
});
const Xi = te(Array.prototype.forEach), Hl = te(Array.prototype.lastIndexOf), po = te(Array.prototype.pop), Wr = te(Array.prototype.push), Ul = te(Array.prototype.splice), wr = Array.isArray, qr = te(String.prototype.toLowerCase), tn = te(String.prototype.toString), mo = te(String.prototype.match), Hr = te(String.prototype.replace), go = te(String.prototype.indexOf), ql = te(String.prototype.trim), Gl = te(Number.prototype.toString), Yl = te(Boolean.prototype.toString), vo = typeof BigInt > "u" ? null : te(BigInt.prototype.toString), yo = typeof Symbol > "u" ? null : te(Symbol.prototype.toString), xe = te(Object.prototype.hasOwnProperty), Ur = te(Object.prototype.toString), ce = te(RegExp.prototype.test), Gi = Xl(TypeError);
function te(l) {
  return function(r) {
    r instanceof RegExp && (r.lastIndex = 0);
    for (var a = arguments.length, h = new Array(a > 1 ? a - 1 : 0), g = 1; g < a; g++)
      h[g - 1] = arguments[g];
    return pn(l, r, h);
  };
}
function Xl(l) {
  return function() {
    for (var r = arguments.length, a = new Array(r), h = 0; h < r; h++)
      a[h] = arguments[h];
    return dn(l, a);
  };
}
function bt(l, r) {
  let a = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : qr;
  if (uo && uo(l, null), !wr(r))
    return l;
  let h = r.length;
  for (; h--; ) {
    let g = r[h];
    if (typeof g == "string") {
      const v = a(g);
      v !== g && ($l(r) || (r[h] = v), g = v);
    }
    l[g] = !0;
  }
  return l;
}
function Zl(l) {
  for (let r = 0; r < l.length; r++)
    xe(l, r) || (l[r] = null);
  return l;
}
function Ie(l) {
  const r = br(null);
  for (const h of sa(l)) {
    var a = Bl(h, 2);
    const g = a[0], v = a[1];
    xe(l, g) && (wr(v) ? r[g] = Zl(v) : v && typeof v == "object" && v.constructor === Object ? r[g] = Ie(v) : r[g] = v);
  }
  return r;
}
function Kl(l) {
  switch (typeof l) {
    case "string":
      return l;
    case "number":
      return Gl(l);
    case "boolean":
      return Yl(l);
    case "bigint":
      return vo ? vo(l) : "0";
    case "symbol":
      return yo ? yo(l) : "Symbol()";
    case "undefined":
      return Ur(l);
    case "function":
    case "object": {
      if (l === null)
        return Ur(l);
      const r = l, a = De(r, "toString");
      if (typeof a == "function") {
        const h = a(r);
        return typeof h == "string" ? h : Ur(h);
      }
      return Ur(l);
    }
    default:
      return Ur(l);
  }
}
function De(l, r) {
  for (; l !== null; ) {
    const h = Wl(l, r);
    if (h) {
      if (h.get)
        return te(h.get);
      if (typeof h.value == "function")
        return te(h.value);
    }
    l = jl(l);
  }
  function a() {
    return null;
  }
  return a;
}
function Ql(l) {
  try {
    return ce(l, ""), !0;
  } catch {
    return !1;
  }
}
const _o = re(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "search", "section", "select", "shadow", "slot", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]), en = re(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "enterkeyhint", "exportparts", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "inputmode", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "part", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]), rn = re(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]), Jl = re(["animate", "color-profile", "cursor", "discard", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]), sn = re(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "mprescripts"]), th = re(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]), bo = re(["#text"]), wo = re(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "command", "commandfor", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "exportparts", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inert", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "part", "pattern", "placeholder", "playsinline", "popover", "popovertarget", "popovertargetaction", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "slot", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "wrap", "xmlns"]), nn = re(["accent-height", "accumulate", "additive", "alignment-baseline", "amplitude", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dominant-baseline", "dur", "edgemode", "elevation", "end", "exponent", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "intercept", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "mask-type", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "pointer-events", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "slope", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "tablevalues", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-orientation", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "vector-effect", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]), ko = re(["accent", "accentunder", "align", "bevelled", "close", "columnalign", "columnlines", "columnspacing", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lquote", "lspace", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]), ys = re(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]), eh = oe(/{{[\w\W]*|^[\w\W]*}}/g), ih = oe(/<%[\w\W]*|^[\w\W]*%>/g), rh = oe(/\${[\w\W]*/g), sh = oe(/^data-[\-\w.\u00B7-\uFFFF]+$/), nh = oe(/^aria-[\-\w]+$/), xo = oe(
  /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  // eslint-disable-line no-useless-escape
), oh = oe(/^(?:\w+script|data):/i), ah = oe(
  /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g
  // eslint-disable-line no-control-regex
), lh = oe(/^html$/i), hh = oe(/^[a-z][.\w]*(-[.\w]+)+$/i), To = oe(/<[/\w!]/g), Ao = oe(/<[/\w]/g), fh = oe(/<\/no(script|embed|frames)/i), ch = oe(/\/>/i), Me = {
  element: 1,
  attribute: 2,
  text: 3,
  cdataSection: 4,
  entityReference: 5,
  // Deprecated
  entityNode: 6,
  // Deprecated
  processingInstruction: 7,
  comment: 8,
  document: 9,
  documentType: 10,
  documentFragment: 11,
  notation: 12
  // Deprecated
}, oa = ["style", "script", "xmp", "iframe", "noembed", "noframes", "plaintext", "noscript"], uh = re(bt({}, oa)), ph = function() {
  const l = {};
  return Xi(oa, (r) => {
    l[r] = oe(new RegExp("</" + r + "(?=[\\t\\n\\f\\r />])", "i"));
  }), re(l);
}(), dh = function() {
  return typeof window > "u" ? null : window;
}, mh = function(r, a) {
  if (typeof r != "object" || typeof r.createPolicy != "function")
    return null;
  let h = null;
  const g = "data-tt-policy-suffix";
  a && a.hasAttribute(g) && (h = a.getAttribute(g));
  const v = "dompurify" + (h ? "#" + h : "");
  try {
    return r.createPolicy(v, {
      createHTML(b) {
        return b;
      },
      createScriptURL(b) {
        return b;
      }
    });
  } catch {
    return console.warn("TrustedTypes policy " + v + " could not be created."), null;
  }
}, So = function() {
  return {
    afterSanitizeAttributes: [],
    afterSanitizeElements: [],
    afterSanitizeShadowDOM: [],
    beforeSanitizeAttributes: [],
    beforeSanitizeElements: [],
    beforeSanitizeShadowDOM: [],
    uponSanitizeAttribute: [],
    uponSanitizeElement: [],
    uponSanitizeShadowNode: []
  };
}, Li = function(r, a, h, g) {
  return xe(r, a) && wr(r[a]) ? bt(g.base ? Ie(g.base) : {}, r[a], g.transform) : h;
}, on = function(r, a, h) {
  const g = xe(r, a) ? r[a] : void 0;
  return g && typeof g == "object" ? Ie(g) : h();
};
function aa() {
  let l = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : dh();
  const r = (Z) => aa(Z);
  if (r.version = "3.4.15", r.removed = [], !l || !l.document || l.document.nodeType !== Me.document || !l.Element)
    return r.isSupported = !1, r;
  let a = l.document;
  const h = a, g = h.currentScript;
  l.DocumentFragment;
  const v = l.HTMLTemplateElement, b = l.Node, O = l.Element, V = l.NodeFilter, W = l.NamedNodeMap;
  W === void 0 && (l.NamedNodeMap || l.MozNamedAttrMap), l.HTMLFormElement;
  const H = l.DOMParser, U = l.trustedTypes, R = O.prototype, X = De(R, "cloneNode"), tt = De(R, "remove"), rt = De(R, "removeAttributeNode"), vt = De(R, "nextSibling"), yt = De(R, "childNodes"), mt = De(R, "parentNode"), jt = De(R, "shadowRoot"), Ft = De(R, "attributes"), Rt = b && b.prototype ? De(b.prototype, "nodeType") : null, Bt = b && b.prototype ? De(b.prototype, "nodeName") : null, Te = b && b.prototype ? De(b.prototype, "ownerDocument") : null, ue = function(k) {
    return Rt ? Rt(k) : k.nodeType;
  }, At = function(k) {
    return Bt ? Bt(k) : k.nodeName;
  };
  if (typeof v == "function") {
    const Z = a.createElement("template");
    Z.content && Z.content.ownerDocument && (a = Z.content.ownerDocument);
  }
  let _t, Wt = "", Je, pi = !1, je = 0;
  const dt = function() {
    if (je > 0)
      throw Gi('A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the "DOMPurify and Trusted Types" section of the README.');
  }, Ut = function(k) {
    dt(), je++;
    try {
      return _t.createHTML(k);
    } finally {
      je--;
    }
  }, me = function(k) {
    dt(), je++;
    try {
      return _t.createScriptURL(k);
    } finally {
      je--;
    }
  }, Et = function() {
    return pi || (Je = mh(U, g), pi = !0), Je;
  }, Ot = a, Yt = Ot.implementation, Fe = Ot.createNodeIterator, tr = Ot.createDocumentFragment, Jr = Ot.getElementsByTagName, Os = h.importNode;
  let Nt = So();
  r.isSupported = typeof sa == "function" && typeof mt == "function" && Yt && Yt.createHTMLDocument !== void 0;
  const Ns = eh, er = ih, ir = rh, rr = sh, zs = nh, ft = oh, sr = ah, Oi = hh;
  let ts = xo, It = null;
  const kr = bt({}, [..._o, ...en, ...rn, ...sn, ...bo]);
  let zt = null;
  const ti = bt({}, [...wo, ...nn, ...ko, ...ys]);
  let Re = Object.seal(br(null, {
    tagNameCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    },
    attributeNameCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    },
    allowCustomizedBuiltInElements: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: !1
    }
  })), Ni = null, es = null;
  const Ae = Object.seal(br(null, {
    tagCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    },
    attributeCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    }
  }));
  let at = !0, Ht = !0, di = !1, xr = !0, Se = !1, We = !0, He = !1, Tr = !1, pe = null, Oe = null, nr = !1, ei = !1, or = !1, ar = !1, Ar = !0, Sr = !1;
  const zi = "user-content-";
  let mi = !0, gi = !1, vi = {}, yi = null;
  const is = bt({}, [
    "annotation-xml",
    "audio",
    "colgroup",
    "desc",
    "foreignobject",
    "head",
    "iframe",
    "math",
    "mi",
    "mn",
    "mo",
    "ms",
    "mtext",
    "noembed",
    "noframes",
    "noscript",
    "plaintext",
    "script",
    // <selectedcontent> mirrors the selected <option>'s subtree, cloned by
    // the UA (customizable <select>) — including any on* handlers — and the
    // engine re-mirrors synchronously whenever a removal changes which
    // option/selectedcontent is current, even inside DOMPurify's inert
    // DOMParser document. Hoisting its children on removal re-inserts a fresh
    // mirror target ahead of the walk, which the engine refills, looping
    // forever (DoS) and amplifying output. Dropping its content on removal
    // (rather than hoisting) breaks that cascade; the content is a duplicate
    // of the option, which is sanitized on its own. See campaign-3 F1/F6.
    "selectedcontent",
    "style",
    "svg",
    "template",
    "thead",
    "title",
    "video",
    "xmp"
  ]);
  let rs = null;
  const Q = bt({}, ["audio", "video", "img", "source", "image", "track"]);
  let Xt = null;
  const Ue = bt({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]), ge = "http://www.w3.org/1998/Math/MathML", qt = "http://www.w3.org/2000/svg", ve = "http://www.w3.org/1999/xhtml";
  let Ee = ve, _i = !1, Zt = null;
  const Er = bt({}, [ge, qt, ve], tn), wt = re(["mi", "mo", "mn", "ms", "mtext"]);
  let Cr = bt({}, wt);
  const Pr = re(["annotation-xml"]);
  let Mr = bt({}, Pr);
  const Ds = bt({}, ["title", "style", "font", "a", "script"]);
  let Di = null;
  const Bs = ["application/xhtml+xml", "text/html"], Vs = "text/html";
  let $t = null, bi = null;
  const $s = a.createElement("form"), ss = function(k) {
    return k instanceof RegExp || k instanceof Function;
  }, lr = function() {
    let k = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (bi && bi === k)
      return;
    (!k || typeof k != "object") && (k = {}), k = Ie(k), Di = // eslint-disable-next-line unicorn/prefer-includes
    Bs.indexOf(k.PARSER_MEDIA_TYPE) === -1 ? Vs : k.PARSER_MEDIA_TYPE, $t = Di === "application/xhtml+xml" ? tn : qr, It = Li(k, "ALLOWED_TAGS", kr, {
      transform: $t
    }), zt = Li(k, "ALLOWED_ATTR", ti, {
      transform: $t
    }), Zt = Li(k, "ALLOWED_NAMESPACES", Er, {
      transform: tn
    }), Xt = Li(k, "ADD_URI_SAFE_ATTR", Ue, {
      transform: $t,
      base: Ue
    }), rs = Li(k, "ADD_DATA_URI_TAGS", Q, {
      transform: $t,
      base: Q
    }), yi = Li(k, "FORBID_CONTENTS", is, {
      transform: $t
    }), Ni = Li(k, "FORBID_TAGS", Ie({}), {
      transform: $t
    }), es = Li(k, "FORBID_ATTR", Ie({}), {
      transform: $t
    }), vi = xe(k, "USE_PROFILES") ? k.USE_PROFILES && typeof k.USE_PROFILES == "object" ? Ie(k.USE_PROFILES) : k.USE_PROFILES : !1, at = k.ALLOW_ARIA_ATTR !== !1, Ht = k.ALLOW_DATA_ATTR !== !1, di = k.ALLOW_UNKNOWN_PROTOCOLS || !1, xr = k.ALLOW_SELF_CLOSE_IN_ATTR !== !1, Se = k.SAFE_FOR_TEMPLATES || !1, We = k.SAFE_FOR_XML !== !1, He = k.WHOLE_DOCUMENT || !1, ei = k.RETURN_DOM || !1, or = k.RETURN_DOM_FRAGMENT || !1, ar = k.RETURN_TRUSTED_TYPE || !1, nr = k.FORCE_BODY || !1, Ar = k.SANITIZE_DOM !== !1, Sr = k.SANITIZE_NAMED_PROPS || !1, mi = k.KEEP_CONTENT !== !1, gi = k.IN_PLACE || !1, ts = Ql(k.ALLOWED_URI_REGEXP) ? k.ALLOWED_URI_REGEXP : xo, Ee = typeof k.NAMESPACE == "string" ? k.NAMESPACE : ve, Cr = on(
      k,
      "MATHML_TEXT_INTEGRATION_POINTS",
      () => bt({}, wt)
      // Default built-in map
    ), Mr = on(
      k,
      "HTML_INTEGRATION_POINTS",
      () => bt({}, Pr)
      // Default built-in map
    );
    const z = on(k, "CUSTOM_ELEMENT_HANDLING", () => br(null));
    if (Re = br(null), xe(z, "tagNameCheck") && ss(z.tagNameCheck) && (Re.tagNameCheck = z.tagNameCheck), xe(z, "attributeNameCheck") && ss(z.attributeNameCheck) && (Re.attributeNameCheck = z.attributeNameCheck), xe(z, "allowCustomizedBuiltInElements") && typeof z.allowCustomizedBuiltInElements == "boolean" && (Re.allowCustomizedBuiltInElements = z.allowCustomizedBuiltInElements), oe(Re), Se && (Ht = !1), or && (ei = !0), vi && (It = bt({}, bo), zt = br(null), vi.html === !0 && (bt(It, _o), bt(zt, wo)), vi.svg === !0 && (bt(It, en), bt(zt, nn), bt(zt, ys)), vi.svgFilters === !0 && (bt(It, rn), bt(zt, nn), bt(zt, ys)), vi.mathMl === !0 && (bt(It, sn), bt(zt, ko), bt(zt, ys))), Ae.tagCheck = null, Ae.attributeCheck = null, xe(k, "ADD_TAGS") && (typeof k.ADD_TAGS == "function" ? Ae.tagCheck = k.ADD_TAGS : wr(k.ADD_TAGS) && (It === kr && (It = Ie(It)), bt(It, k.ADD_TAGS, $t))), xe(k, "ADD_ATTR") && (typeof k.ADD_ATTR == "function" ? Ae.attributeCheck = k.ADD_ATTR : wr(k.ADD_ATTR) && (zt === ti && (zt = Ie(zt)), bt(zt, k.ADD_ATTR, $t))), xe(k, "ADD_FORBID_CONTENTS") && wr(k.ADD_FORBID_CONTENTS) && (yi === is && (yi = Ie(yi)), bt(yi, k.ADD_FORBID_CONTENTS, $t)), mi && (It["#text"] = !0), He && bt(It, ["html", "head", "body"]), It.table && (bt(It, ["tbody"]), delete Ni.tbody), k.TRUSTED_TYPES_POLICY) {
      if (typeof k.TRUSTED_TYPES_POLICY.createHTML != "function")
        throw Gi('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
      if (typeof k.TRUSTED_TYPES_POLICY.createScriptURL != "function")
        throw Gi('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
      const q = _t;
      _t = k.TRUSTED_TYPES_POLICY;
      try {
        Wt = Ut("");
      } catch (J) {
        throw _t = q, J;
      }
    } else k.TRUSTED_TYPES_POLICY === null ? (_t = void 0, Wt = "") : (_t === void 0 && (_t = Et()), _t && typeof Wt == "string" && (Wt = Ut("")));
    re && re(k), bi = k;
  }, Ir = bt({}, [...en, ...rn, ...Jl]), ns = bt({}, [...sn, ...th]), os = function(k, z, q) {
    return z.namespaceURI === ve ? k === "svg" : z.namespaceURI === ge ? k === "svg" && (q === "annotation-xml" || Cr[q]) : !!Ir[k];
  }, js = function(k, z, q) {
    return z.namespaceURI === ve ? k === "math" : z.namespaceURI === qt ? k === "math" && Mr[q] : !!ns[k];
  }, qe = function(k, z, q) {
    return z.namespaceURI === qt && !Mr[q] || z.namespaceURI === ge && !Cr[q] ? !1 : !ns[k] && (Ds[k] || !Ir[k]);
  }, ye = function(k) {
    let z = mt(k);
    (!z || !z.tagName) && (z = {
      namespaceURI: Ee,
      tagName: "template"
    });
    const q = qr(k.tagName), J = qr(z.tagName);
    return Zt[k.namespaceURI] ? k.namespaceURI === qt ? os(q, z, J) : k.namespaceURI === ge ? js(q, z, J) : k.namespaceURI === ve ? qe(q, z, J) : !!(Di === "application/xhtml+xml" && Zt[k.namespaceURI]) : !1;
  }, Kt = function(k) {
    Wr(r.removed, {
      element: k
    });
    try {
      mt(k).removeChild(k);
    } catch {
      if (tt(k), !mt(k))
        throw Gi("a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place");
    }
  }, wi = function(k, z, q) {
    try {
      rt(k, z);
    } catch {
      try {
        k.removeAttribute(q);
      } catch {
      }
    }
  }, ki = function(k) {
    ii(k);
    const z = yt(k);
    if (z) {
      const J = [];
      Xi(z, (st) => {
        Wr(J, st);
      }), Xi(J, (st) => {
        try {
          tt(st);
        } catch {
        }
      });
    }
    const q = Ft(k);
    if (q)
      for (let J = q.length - 1; J >= 0; --J) {
        const st = q[J], lt = st && st.name;
        typeof lt == "string" && wi(k, st, lt);
      }
  }, se = function(k, z, q) {
    if (!q)
      try {
        q = z.getAttributeNode(k);
      } catch {
        q = null;
      }
    Wr(r.removed, {
      attribute: q || null,
      from: z
    });
    try {
      q ? rt(z, q) : z.removeAttribute(k);
    } catch {
      try {
        z.removeAttribute(k);
      } catch {
      }
    }
    if (k === "is")
      if (ei || or)
        try {
          Kt(z);
        } catch {
        }
      else
        try {
          z.setAttribute(k, "");
        } catch {
        }
  }, Bi = function(k) {
    const z = Ft(k);
    if (z)
      for (let q = z.length - 1; q >= 0; --q) {
        const J = z[q], st = J && J.name;
        typeof st != "string" || zt[$t(st)] || wi(k, J, st);
      }
  }, ii = function(k) {
    const z = [k];
    for (; z.length > 0; ) {
      const q = z.pop();
      ue(q) === Me.element && Bi(q);
      const st = yt(q);
      if (st)
        for (let lt = st.length - 1; lt >= 0; --lt)
          z.push(st[lt]);
    }
  }, hr = function(k, z) {
    return We ? k === "patchsrc" ? !0 : k === "for" && z !== "label" && z !== "output" : !1;
  }, as = function(k) {
    if (!We)
      return;
    const z = [k];
    for (; z.length > 0; ) {
      const q = z.pop(), J = ue(q);
      if (J === Me.processingInstruction || J === Me.comment && ce(Ao, q.data)) {
        try {
          tt(q);
        } catch {
        }
        continue;
      }
      if (J === Me.element) {
        const lt = q, Ct = $t(At(q));
        try {
          lt.hasAttribute && lt.hasAttribute("patchsrc") && lt.removeAttribute("patchsrc"), lt.hasAttribute && lt.hasAttribute("for") && hr("for", Ct) && lt.removeAttribute("for");
        } catch {
        }
      }
      const st = yt(q);
      if (st)
        for (let lt = st.length - 1; lt >= 0; --lt)
          z.push(st[lt]);
    }
  }, Be = function(k) {
    let z = null, q = null;
    if (nr)
      k = "<remove></remove>" + k;
    else {
      const lt = mo(k, /^[\r\n\t ]+/);
      q = lt && lt[0];
    }
    Di === "application/xhtml+xml" && Ee === ve && (k = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + k + "</body></html>");
    const J = _t ? Ut(k) : k;
    if (Ee === ve)
      try {
        z = new H().parseFromString(J, Di);
      } catch {
      }
    if (!z || !z.documentElement) {
      z = Yt.createDocument(Ee, "template", null);
      try {
        z.documentElement.innerHTML = _i ? Wt : J;
      } catch {
      }
    }
    const st = z.body || z.documentElement;
    return k && q && st.insertBefore(a.createTextNode(q), st.childNodes[0] || null), Ee === ve ? Jr.call(z, He ? "html" : "body")[0] : He ? z.documentElement : st;
  }, ls = function(k) {
    const z = Te ? Te(k) : k.ownerDocument;
    return Fe.call(
      z || k,
      k,
      // eslint-disable-next-line no-bitwise
      V.SHOW_ELEMENT | V.SHOW_COMMENT | V.SHOW_TEXT | V.SHOW_PROCESSING_INSTRUCTION | V.SHOW_CDATA_SECTION,
      null
    );
  }, Vi = function(k) {
    return k = Hr(k, Ns, " "), k = Hr(k, er, " "), k = Hr(k, ir, " "), k;
  }, fr = function(k) {
    var z;
    k.normalize();
    const q = Te ? Te(k) : k.ownerDocument, J = Fe.call(
      q || k,
      k,
      // eslint-disable-next-line no-bitwise
      V.SHOW_TEXT | V.SHOW_COMMENT | V.SHOW_CDATA_SECTION | V.SHOW_PROCESSING_INSTRUCTION,
      null
    );
    let st = J.nextNode();
    for (; st; )
      st.data = Vi(st.data), st = J.nextNode();
    const lt = (z = k.querySelectorAll) === null || z === void 0 ? void 0 : z.call(k, "template");
    lt && Xi(lt, (Ct) => {
      ri(Ct.content) && fr(Ct.content);
    });
  }, Dt = function(k) {
    const z = Bt ? Bt(k) : null;
    return typeof z != "string" || $t(z) !== "form" ? !1 : typeof k.nodeName != "string" || typeof k.textContent != "string" || typeof k.removeChild != "function" || // Realm-safe NamedNodeMap detection: equality against the cached
    // prototype getter. Clobbered .attributes (e.g. <input name="attributes">)
    // makes the direct read diverge from the cached read; a clean form
    // (same-realm OR foreign-realm) has both reads pointing at the same
    // canonical NamedNodeMap.
    k.attributes !== Ft(k) || typeof k.removeAttribute != "function" || // A form descendant named "removeAttributeNode" or "getAttributeNode"
    // shadows these Attr-node methods via [LegacyOverrideBuiltIns].
    // _removeAttribute() / _stripAttributeNode() reach for
    // element.removeAttributeNode(attr) first; when it is shadowed the call
    // throws and the name-based fallback element.removeAttribute(name)
    // ASCII-lowercases its lookup key in an HTML document, silently missing
    // a case-preserved event-handler attribute (e.g. an ONANIMATIONSTART
    // that reached the sanitizer through an XML/XHTML parse). Flag the form
    // so it is removed wholesale, exactly as for the other shadowed methods.
    typeof k.removeAttributeNode != "function" || typeof k.getAttributeNode != "function" || typeof k.setAttribute != "function" || typeof k.namespaceURI != "string" || typeof k.insertBefore != "function" || typeof k.hasChildNodes != "function" || // NodeType clobbering probe. Cached Node.prototype.nodeType getter
    // returns the integer 1 for any Element regardless of realm; direct
    // read on a clobbered form (e.g. <input name="nodeType">) returns
    // the named child element. Cheap addition — nodeType is read from
    // an internal slot, no serialization cost — and removes a residual
    // clobbering surface used by several mXSS / PI / comment branches
    // in _sanitizeElements that compare currentNode.nodeType directly.
    k.nodeType !== Rt(k) || // HTMLFormElement has [LegacyOverrideBuiltIns]: a descendant named
    // "childNodes" shadows the prototype getter. Direct reads of
    // form.childNodes from a clobbered form return the named child
    // instead of the real NodeList, so any walk that reads it directly
    // skips the form's real children. Compare the direct read to the
    // cached Node.prototype getter — when the form's named-property
    // getter intercepts the read, the two values differ and we flag
    // the form. This catches every clobbering child type (input,
    // select, etc.) regardless of whether the named child happens to
    // carry a numeric .length, which a typeof-based probe would miss
    // (e.g. HTMLSelectElement.length is a defined unsigned-long).
    k.childNodes !== yt(k);
  }, ri = function(k) {
    if (!Rt || typeof k != "object" || k === null)
      return !1;
    try {
      return Rt(k) === Me.documentFragment;
    } catch {
      return !1;
    }
  }, Ge = function(k) {
    if (!Rt || typeof k != "object" || k === null)
      return !1;
    try {
      return typeof Rt(k) == "number";
    } catch {
      return !1;
    }
  };
  function Ce(Z, k, z) {
    Z.length !== 0 && Xi(Z, (q) => {
      q.call(r, k, z, bi);
    });
  }
  const Ws = function(k, z) {
    return !!(We && k.hasChildNodes() && !Ge(k.firstElementChild) && ce(To, k.textContent) && ce(To, k.innerHTML) || We && k.namespaceURI === ve && uh[z] && (Ge(k.firstElementChild) || typeof k.textContent == "string" && ce(ph[z], k.textContent)) || k.nodeType === Me.processingInstruction || We && k.nodeType === Me.comment && ce(Ao, k.data));
  }, Ye = function(k, z) {
    if (k instanceof RegExp)
      return ce(k, z);
    if (k instanceof Function) {
      for (var q = arguments.length, J = new Array(q > 2 ? q - 2 : 0), st = 2; st < q; st++)
        J[st - 2] = arguments[st];
      return !!k(z, ...J);
    }
    return !1;
  }, Lr = function(k, z, q) {
    if (!Ni[z] && Fr(z) && Ye(Re.tagNameCheck, z))
      return !1;
    if (mi && !yi[z]) {
      const J = mt(k), st = yt(k);
      if (st && J) {
        const lt = st.length;
        for (let Ct = lt - 1; Ct >= 0; --Ct) {
          const Tt = k === q ? X(st[Ct], !0) : st[Ct];
          J.insertBefore(Tt, vt(k));
        }
      }
    }
    return Kt(k), !0;
  }, $i = function(k, z, q, J) {
    return k.length === 0 ? z : z === q || z === J ? Ie(z) : z;
  }, si = function(k, z) {
    return k === z || mt(k) !== null ? !1 : (gi && ii(k), !0);
  }, cr = function(k, z) {
    if (Ce(Nt.beforeSanitizeElements, k, null), si(k, z))
      return !0;
    if (Dt(k))
      return Kt(k), !0;
    const q = $t(At(k));
    if (It = $i(Nt.uponSanitizeElement, It, kr, pe), Ce(Nt.uponSanitizeElement, k, {
      tagName: q,
      allowedTags: It
    }), si(k, z))
      return !0;
    if (Ws(k, q))
      return Kt(k), !0;
    if (Ni[q] || !(Ae.tagCheck instanceof Function && Ae.tagCheck(q)) && !It[q]) {
      const st = Lr(k, q, z);
      return st === !1 && Ce(Nt.afterSanitizeElements, k, null), st;
    }
    if (ue(k) === Me.element && !ye(k) || (q === "noscript" || q === "noembed" || q === "noframes") && ce(fh, k.innerHTML))
      return Kt(k), !0;
    if (Se && k.nodeType === Me.text) {
      const st = Vi(k.textContent);
      k.textContent !== st && (Wr(r.removed, {
        element: k.cloneNode()
      }), k.textContent = st);
    }
    return Ce(Nt.afterSanitizeElements, k, null), !1;
  }, ni = function(k, z, q) {
    if (es[z] || hr(z, k) || Ar && (z === "id" || z === "name") && (q in a || q in $s))
      return !1;
    const J = zt[z] || Ae.attributeCheck instanceof Function && Ae.attributeCheck(z, k);
    return Ht && ce(rr, z) || at && ce(zs, z) ? !0 : J ? Xt[z] || ce(ts, Hr(q, sr, "")) || (z === "src" || z === "xlink:href" || z === "href") && k !== "script" && go(q, "data:") === 0 && rs[k] || di && !ce(ft, Hr(q, sr, "")) ? !0 : !q : (
      // Condition a) covers a basically valid custom element tag name whose
      // tag passes the configured tagNameCheck and whose attribute name
      // passes the configured attributeNameCheck ...
      Fr(k) && Ye(Re.tagNameCheck, k) && Ye(Re.attributeNameCheck, z, k) || // Condition b) covers an `is` attribute whose value passes the
      // configured tagNameCheck while customized built-in elements are
      // allowed.
      z === "is" && Re.allowCustomizedBuiltInElements && Ye(Re.tagNameCheck, q)
    );
  }, ji = bt({}, ["annotation-xml", "color-profile", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "missing-glyph"]), Fr = function(k) {
    return !ji[qr(k)] && ce(Oi, k);
  }, Hs = function(k, z, q, J) {
    if (_t && typeof U == "object" && typeof U.getAttributeType == "function" && !q)
      switch (U.getAttributeType(k, z)) {
        case "TrustedHTML":
          return Ut(J);
        case "TrustedScriptURL":
          return me(J);
      }
    return J;
  }, Us = function(k, z, q, J) {
    try {
      return q ? k.setAttributeNS(q, z, J) : k.setAttribute(z, J), Dt(k) ? (Kt(k), !1) : !0;
    } catch {
      return se(z, k), !1;
    }
  }, Rr = function(k) {
    Ce(Nt.beforeSanitizeAttributes, k, null);
    const z = k.attributes;
    if (!z || Dt(k))
      return;
    zt = $i(Nt.uponSanitizeAttribute, zt, ti, Oe);
    const q = {
      attrName: "",
      attrValue: "",
      keepAttr: !0,
      allowedAttributes: zt,
      forceKeepAttr: void 0
    };
    let J = z.length;
    const st = $t(k.nodeName);
    for (; J--; ) {
      const lt = z[J], Ct = lt.name, Tt = lt.namespaceURI, ae = lt.value, he = $t(Ct), xi = ae;
      let ee = Ct === "value" ? xi : ql(xi), hs = !1;
      if (q.attrName = he, q.attrValue = ee, q.keepAttr = !0, q.forceKeepAttr = void 0, Ce(Nt.uponSanitizeAttribute, k, q), ee = q.attrValue, Sr && (he === "id" || he === "name") && go(ee, zi) !== 0 && (se(Ct, k, lt), ee = zi + ee, hs = !0), We && ce(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i, ee)) {
        se(Ct, k, lt);
        continue;
      }
      if (he === "attributename" && mo(ee, "href")) {
        se(Ct, k, lt);
        continue;
      }
      if (!q.forceKeepAttr) {
        if (!q.keepAttr) {
          se(Ct, k, lt);
          continue;
        }
        if (!xr && ce(ch, ee)) {
          se(Ct, k, lt);
          continue;
        }
        if (Se && (ee = Vi(ee)), !ni(st, he, ee)) {
          se(Ct, k, lt);
          continue;
        }
        ee = Hs(st, he, Tt, ee), ee !== xi && Us(k, Ct, Tt, ee) && hs && po(r.removed);
      }
    }
    Ce(Nt.afterSanitizeAttributes, k, null);
  }, ur = function(k) {
    let z = null;
    const q = ls(k);
    for (Ce(Nt.beforeSanitizeShadowDOM, k, null); z = q.nextNode(); )
      if (Ce(Nt.uponSanitizeShadowNode, z, null), cr(z, k), Rr(z), ri(z.content) && ur(z.content), ue(z) === Me.element) {
        const J = jt(z);
        ri(J) && (Wi(J), ur(J));
      }
    Ce(Nt.afterSanitizeShadowDOM, k, null);
  }, Wi = function(k) {
    const z = [{
      node: k,
      shadow: null
    }];
    for (; z.length > 0; ) {
      const q = z.pop();
      if (q.shadow) {
        ur(q.shadow);
        continue;
      }
      const J = q.node, lt = ue(J) === Me.element, Ct = yt(J);
      if (Ct)
        for (let Tt = Ct.length - 1; Tt >= 0; --Tt)
          z.push({
            node: Ct[Tt],
            shadow: null
          });
      if (lt) {
        const Tt = Bt ? Bt(J) : null;
        if (typeof Tt == "string" && $t(Tt) === "template") {
          const ae = J.content;
          ri(ae) && z.push({
            node: ae,
            shadow: null
          });
        }
      }
      if (lt) {
        const Tt = jt(J);
        ri(Tt) && z.push({
          node: null,
          shadow: Tt
        }, {
          node: Tt,
          shadow: null
        });
      }
    }
  };
  return r.sanitize = function(Z) {
    let k = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, z = null, q = null, J = null, st = null;
    if (_i = !Z, _i && (Z = "<!-->"), typeof Z != "string" && !Ge(Z) && (Z = Kl(Z), typeof Z != "string"))
      throw Gi("dirty is not a string, aborting");
    if (!r.isSupported)
      return Z;
    Tr ? (It = pe, zt = Oe) : lr(k), (Nt.uponSanitizeElement.length > 0 || Nt.uponSanitizeAttribute.length > 0) && (It = Ie(It)), Nt.uponSanitizeAttribute.length > 0 && (zt = Ie(zt)), r.removed = [];
    const lt = gi && typeof Z != "string" && Ge(Z);
    if (lt) {
      as(Z);
      const ae = At(Z);
      if (typeof ae == "string") {
        const he = $t(ae);
        if (!It[he] || Ni[he])
          throw ki(Z), Gi("root node is forbidden and cannot be sanitized in-place");
      }
      if (Dt(Z))
        throw ki(Z), Gi("root node is clobbered and cannot be sanitized in-place");
      try {
        Wi(Z);
      } catch (he) {
        throw ki(Z), he;
      }
    } else if (Ge(Z))
      z = Be("<!---->"), q = z.ownerDocument.importNode(Z, !0), q.nodeType === Me.element && q.nodeName === "BODY" || q.nodeName === "HTML" ? z = q : z.appendChild(q), Wi(z);
    else {
      if (!ei && !Se && !He && // eslint-disable-next-line unicorn/prefer-includes
      Z.indexOf("<") === -1)
        return _t && ar ? Ut(Z) : Z;
      if (z = Be(Z), !z)
        return ei ? null : ar ? Wt : "";
    }
    z && nr && Kt(z.firstChild);
    const Ct = lt ? Z : z;
    try {
      const ae = ls(Ct);
      for (; J = ae.nextNode(); )
        cr(J, Ct), Rr(J), ri(J.content) && ur(J.content);
    } catch (ae) {
      throw lt && (ki(Z), Xi(r.removed, (he) => {
        he.element && ii(he.element);
      })), ae;
    }
    if (lt)
      return Xi(r.removed, (ae) => {
        ae.element && ii(ae.element);
      }), Se && fr(Z), Z;
    if (ei) {
      if (Se && fr(z), or)
        for (st = tr.call(z.ownerDocument); z.firstChild; )
          st.appendChild(z.firstChild);
      else
        st = z;
      return (zt.shadowroot || zt.shadowrootmode) && (st = Os.call(h, st, !0)), st;
    }
    let Tt = He ? z.outerHTML : z.innerHTML;
    return He && It["!doctype"] && z.ownerDocument && z.ownerDocument.doctype && z.ownerDocument.doctype.name && ce(lh, z.ownerDocument.doctype.name) && (Tt = "<!DOCTYPE " + z.ownerDocument.doctype.name + `>
` + Tt), Se && (Tt = Vi(Tt)), _t && ar ? Ut(Tt) : Tt;
  }, r.setConfig = function() {
    let Z = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    lr(Z), Tr = !0, pe = It, Oe = zt;
  }, r.clearConfig = function() {
    bi = null, Tr = !1, pe = null, Oe = null, _t = Je, Wt = "";
  }, r.isValidAttribute = function(Z, k, z) {
    bi || lr({});
    const q = $t(Z), J = $t(k);
    return ni(q, J, z);
  }, r.addHook = function(Z, k) {
    typeof k == "function" && xe(Nt, Z) && Wr(Nt[Z], k);
  }, r.removeHook = function(Z, k) {
    if (xe(Nt, Z)) {
      if (k !== void 0) {
        const z = Hl(Nt[Z], k);
        return z === -1 ? void 0 : Ul(Nt[Z], z, 1)[0];
      }
      return po(Nt[Z]);
    }
  }, r.removeHooks = function(Z) {
    xe(Nt, Z) && (Nt[Z] = []);
  }, r.removeAllHooks = function() {
    Nt = So();
  }, r;
}
var la = aa();
St.setOptions({ gfm: !0, breaks: !0 });
let Eo = !1;
function gh() {
  Eo || (la.addHook("afterSanitizeAttributes", (l) => {
    l.tagName === "A" && (l.setAttribute("target", "_blank"), l.setAttribute("rel", "noopener noreferrer"));
  }), Eo = !0);
}
function vh(l) {
  gh();
  const r = St.parse(l ?? "", { async: !1 });
  return la.sanitize(r, {
    ALLOWED_TAGS: [
      "a",
      "b",
      "blockquote",
      "br",
      "code",
      "em",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "hr",
      "i",
      "li",
      "ol",
      "p",
      "pre",
      "strong",
      "table",
      "tbody",
      "td",
      "th",
      "thead",
      "tr",
      "ul",
      "span",
      "del",
      "s",
      "sup",
      "sub",
      "img"
    ],
    ALLOWED_ATTR: ["href", "title", "target", "rel", "src", "alt"],
    ALLOW_DATA_ATTR: !1
  });
}
const ze = 12, _s = 10, vr = 200;
function Yi(l, r, a) {
  return Math.max(r, Math.min(a, l));
}
function yh(l, r, a, h) {
  const g = r.width <= 480, v = g ? r.width - ze * 2 : Yi(h.width, ze, r.width - ze * 2), b = l.top + l.height, O = l.top - _s - ze, V = r.height - b - _s - ze, W = O < vr && V >= vr && V > O;
  let H, U, R;
  if (W)
    H = b + _s, R = Yi(h.height, vr, r.height - H - ze);
  else {
    U = r.height - l.top + _s;
    const vt = O > 0 ? O : r.height - ze * 2;
    R = Yi(g ? r.height * 0.7 : h.height, vr, vt);
  }
  R = Yi(R, vr, r.height - ze * 2);
  let X, tt;
  return a === "right" ? tt = Yi(r.width - l.right, ze, r.width - ze - v) : X = Yi(l.left, ze, r.width - ze - v), {
    left: X,
    right: tt,
    top: H,
    bottom: U,
    width: v,
    height: R,
    transformOrigin: `${W ? "top" : "bottom"} ${a}`
  };
}
let Co = 0;
function yr() {
  return Co += 1, "msg-" + Co;
}
const Po = {
  thinking: "Pensando…",
  tool: "Usando herramientas…",
  usedTools: "Usando herramientas…",
  calledTools: "Ejecutando acciones…",
  agentReasoning: "Razonando…",
  nextAgent: "Consultando al agente…"
};
function mn({ name: l }) {
  return l === "chat" ? /* @__PURE__ */ gt("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", "aria-hidden": "true", children: /* @__PURE__ */ gt("path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" }) }) : l === "close" ? /* @__PURE__ */ gt("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2.4", "stroke-linecap": "round", "aria-hidden": "true", children: /* @__PURE__ */ gt("path", { d: "M18 6 6 18M6 6l12 12" }) }) : /* @__PURE__ */ gt("svg", { viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": "true", children: /* @__PURE__ */ gt("path", { d: "M3.4 20.4 21 12 3.4 3.6l-.01 6.53L15 12 3.39 13.87z" }) });
}
function _h(l) {
  return {
    "--ec-font": l.windowFontFamily,
    "--ec-fs": l.windowFontSize + "px",
    "--ec-bg-window": l.windowBackgroundColor,
    "--ec-bg-header": l.windowHeaderBackgroundColor,
    "--ec-bg-bot": l.botMessageBackgroundColor,
    "--ec-c-bot": l.botMessageTextColor,
    "--ec-bg-user": l.userMessageBackgroundColor,
    "--ec-c-user": l.userMessageTextColor,
    "--ec-bg-input": l.textInputBackgroundColor,
    "--ec-c-input": l.textInputTextColor,
    "--ec-c-send": l.textInputSendButtonColor,
    "--ec-c-footer": l.footerTextColor,
    "--ec-button-w": l.buttonWidth,
    "--ec-button-h": l.buttonHeight,
    "--ec-z-button": l.buttonZIndex,
    "--ec-z-window": l.windowZIndex,
    "--ec-tooltip-bg": l.tooltipBackgroundColor,
    "--ec-tooltip-c": l.tooltipTextColor,
    "--ec-tooltip-fs": l.tooltipFontSize,
    "--ec-tooltip-pad": l.tooltipPadding,
    "--ec-tooltip-radius": l.tooltipBorderRadius,
    "--ec-tooltip-offset": l.tooltipPositionOffset + "px"
  };
}
function bh({ config: l }) {
  const r = Fi(null);
  return _r(() => {
    if (l.buttonType !== "lottie" || !r.current || !l.lottieAnimationPath) return;
    const a = tl(r.current, l.lottieAnimationPath, {
      loop: l.lottieLoop,
      autoplay: l.lottieAutoplay
    });
    return () => a.destroy();
  }, [l.buttonType, l.lottieAnimationPath, l.lottieLoop, l.lottieAutoplay]), l.buttonType === "lottie" ? /* @__PURE__ */ gt("div", { ref: r, class: "ecoflow-button--media" }) : l.buttonType === "image" ? /* @__PURE__ */ gt("img", { class: "ecoflow-button--media", src: l.buttonImageSrc, alt: l.buttonAriaLabel }) : l.buttonType === "text" ? /* @__PURE__ */ gt("span", { children: l.buttonText }) : /* @__PURE__ */ gt(mn, { name: "chat" });
}
function wh({ src: l, alt: r }) {
  return l ? /* @__PURE__ */ gt("img", { class: "ecoflow-avatar", src: l, alt: r, loading: "lazy" }) : /* @__PURE__ */ gt("div", { class: "ecoflow-avatar", "aria-hidden": "true" });
}
function kh({ message: l, config: r }) {
  if (l.role === "agent")
    return /* @__PURE__ */ gt("div", { class: "ecoflow-msg ecoflow-msg--agent", children: /* @__PURE__ */ gt("span", { class: "ecoflow-agent-pill", children: l.text }) });
  const a = l.role === "user", h = l.role === "error", g = !a && !h ? r.botMessageShowAvatar : a ? r.userMessageShowAvatar : !1, v = a ? r.userMessageAvatarSrc : r.botMessageAvatarSrc;
  return /* @__PURE__ */ gt("div", { class: `ecoflow-msg${a ? " ecoflow-msg--user" : ""}`, children: [
    g && /* @__PURE__ */ gt(wh, { src: v, alt: a ? "Usuario" : "Bot" }),
    /* @__PURE__ */ gt(
      "div",
      {
        class: `ecoflow-bubble ecoflow-bubble--${h ? "error" : a ? "user" : "bot"}`,
        children: a ? l.text : /* @__PURE__ */ gt(
          "div",
          {
            class: "ecoflow-markdown",
            dangerouslySetInnerHTML: { __html: vh(l.text) }
          }
        )
      }
    )
  ] });
}
function xh({ host: l, config: r }) {
  const [a, h] = gr(!1), [g, v] = gr([]), [b, O] = gr(!1), [V, W] = gr(!1), [H, U] = gr(""), [R, X] = gr(null), tt = Fi(""), rt = Fi(!1), vt = Fi(null), yt = Fi(null), mt = Fi(null), jt = Fi(null), Ft = Fi(() => {
  });
  tt.current || (tt.current = Xa());
  const Rt = () => {
    h(!0), !rt.current && r.windowWelcomeMessage && (rt.current = !0, v((dt) => [
      ...dt,
      { id: yr(), role: "bot", text: r.windowWelcomeMessage }
    ]));
  }, Bt = () => {
    var dt;
    h(!1), (dt = jt.current) == null || dt.abort();
  }, Te = () => a ? Bt() : Rt();
  _r(() => {
    l.open = Rt, l.close = Bt, l.toggle = Te, l.sendMessage = (dt) => {
      Rt(), Ft.current(dt);
    };
  }), _r(() => {
    if (!a) return;
    const dt = () => {
      const Ut = vt.current;
      Ut && X(
        yh(
          Ut.getBoundingClientRect(),
          { width: window.innerWidth, height: window.innerHeight },
          r.buttonSide,
          { width: r.windowWidth, height: r.windowHeight }
        )
      );
    };
    return dt(), window.addEventListener("resize", dt, { passive: !0 }), () => window.removeEventListener("resize", dt);
  }, [a, r.buttonSide, r.windowWidth, r.windowHeight]), _r(() => {
    const dt = yt.current;
    dt && (dt.scrollTop = dt.scrollHeight);
  }, [g, V]), _r(() => {
    a && r.textInputAutoFocus && requestAnimationFrame(() => {
      var dt;
      return (dt = mt.current) == null ? void 0 : dt.focus();
    });
  }, [a, r.textInputAutoFocus]), _r(() => {
    if (!a) return;
    const dt = (Ut) => {
      Ut.key === "Escape" && Bt();
    };
    return document.addEventListener("keydown", dt), () => document.removeEventListener("keydown", dt);
  }, [a]);
  const ue = (dt, Ut) => {
    v((me) => me.map((Et) => Et.id === dt ? { ...Et, text: Et.text + Ut } : Et));
  }, At = (dt, Ut) => {
    v((me) => me.map((Et) => Et.id === dt ? { ...Et, followUps: Ut } : Et));
  }, _t = (dt) => {
    const Ut = dt.trim();
    if (!Ut || b || !r.chatflowId || !r.apiHost) return;
    U(""), v((Ot) => [...Ot, { id: yr(), role: "user", text: Ut }]);
    const me = yr();
    v((Ot) => [...Ot, { id: me, role: "bot", text: "" }]), O(!0), W(!0);
    const Et = new AbortController();
    jt.current = Et, Ya(
      {
        apiHost: r.apiHost,
        chatflowId: r.chatflowId,
        question: Ut,
        chatId: tt.current,
        streaming: !0
      },
      {
        onToken: (Ot) => {
          W(!1), ue(me, Ot);
        },
        onActivity: (Ot) => {
          r.windowShowAgentMessages && Po[Ot] && v((Yt) => [
            ...Yt,
            { id: yr(), role: "agent", text: Po[Ot] }
          ]);
        },
        onMetadata: (Ot) => {
          const Yt = Ot.followUpPrompts;
          Array.isArray(Yt) && At(
            me,
            Yt.filter((tr) => typeof tr == "string")
          );
          const Fe = Ot.chatId;
          typeof Fe == "string" && Fe && (tt.current = Fe);
        },
        onError: (Ot) => {
          v(
            (Yt) => Yt.filter((Fe) => Fe.id !== me || Fe.text !== "").concat([{ id: yr(), role: "error", text: r.windowErrorMessage || Ot }])
          );
        },
        onDone: () => {
          v((Ot) => Ot.filter((Yt) => Yt.id !== me || Yt.text !== ""));
        }
      },
      Et.signal
    ).catch(() => {
      Et.signal.aborted || v(
        (Ot) => Ot.filter((Yt) => Yt.id !== me || Yt.text !== "").concat([{ id: yr(), role: "error", text: r.windowErrorMessage }])
      );
    }).finally(() => {
      O(!1), W(!1), jt.current = null;
    });
  };
  Ft.current = _t;
  const Wt = g.length > 0 && !b && g[g.length - 1].role === "bot" ? g[g.length - 1].followUps : void 0, Je = { bottom: r.buttonBottom };
  Je[r.buttonSide] = r.buttonOffsetX;
  const pi = { position: "absolute" };
  pi[r.buttonSide] = "0";
  const je = R ? {
    left: R.left !== void 0 ? R.left + "px" : void 0,
    right: R.right !== void 0 ? R.right + "px" : void 0,
    top: R.top !== void 0 ? R.top + "px" : void 0,
    bottom: R.bottom !== void 0 ? R.bottom + "px" : void 0,
    width: R.width + "px",
    height: R.height + "px",
    transformOrigin: R.transformOrigin
  } : void 0;
  return /* @__PURE__ */ gt("div", { class: "ecoflow-root", style: _h(r), children: [
    a && R && /* @__PURE__ */ gt(
      "section",
      {
        class: "ecoflow-window",
        part: "window",
        role: "dialog",
        "aria-label": r.windowTitle,
        style: je,
        children: [
          /* @__PURE__ */ gt("header", { class: "ecoflow-header", part: "header", children: [
            /* @__PURE__ */ gt("div", { class: "ecoflow-header-title", children: r.windowTitle }),
            /* @__PURE__ */ gt("button", { class: "ecoflow-close", onClick: Bt, "aria-label": "Cerrar chat", type: "button", children: /* @__PURE__ */ gt(mn, { name: "close" }) })
          ] }),
          /* @__PURE__ */ gt("div", { class: "ecoflow-messages", part: "messages", ref: yt, "aria-live": "polite", children: [
            g.map((dt) => /* @__PURE__ */ gt(kh, { message: dt, config: r }, dt.id)),
            V && /* @__PURE__ */ gt("div", { class: "ecoflow-msg", children: /* @__PURE__ */ gt("div", { class: "ecoflow-bubble ecoflow-bubble--bot ecoflow-typing", children: [
              /* @__PURE__ */ gt("span", {}),
              /* @__PURE__ */ gt("span", {}),
              /* @__PURE__ */ gt("span", {})
            ] }) })
          ] }),
          Wt && Wt.length > 0 && /* @__PURE__ */ gt("div", { class: "ecoflow-chips", children: Wt.map((dt) => /* @__PURE__ */ gt("button", { class: "ecoflow-chip", type: "button", onClick: () => _t(dt), children: dt }, dt)) }),
          /* @__PURE__ */ gt("div", { class: "ecoflow-input-row", part: "input", children: [
            /* @__PURE__ */ gt(
              "input",
              {
                ref: mt,
                class: "ecoflow-input",
                type: "text",
                placeholder: r.textInputPlaceholder,
                maxLength: r.textInputMaxChars,
                value: H,
                disabled: b,
                "aria-label": r.textInputPlaceholder,
                onInput: (dt) => U(dt.target.value),
                onKeyDown: (dt) => {
                  dt.key === "Enter" && _t(H);
                }
              }
            ),
            /* @__PURE__ */ gt(
              "button",
              {
                class: "ecoflow-send",
                type: "button",
                onClick: () => _t(H),
                disabled: b || H.trim() === "",
                "aria-label": "Enviar mensaje",
                children: /* @__PURE__ */ gt(mn, { name: "send" })
              }
            )
          ] }),
          r.footerCompany && /* @__PURE__ */ gt("footer", { class: "ecoflow-footer", part: "footer", children: [
            r.footerText,
            " ",
            /* @__PURE__ */ gt("a", { href: r.footerCompanyLink || "#", target: "_blank", rel: "noopener noreferrer", children: r.footerCompany })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ gt(
      "div",
      {
        ref: vt,
        class: `ecoflow-button${r.buttonType === "lottie" || r.buttonType === "image" ? "" : " ecoflow-button--shape"}`,
        part: "button",
        role: "button",
        tabIndex: 0,
        "aria-label": r.buttonAriaLabel,
        style: Je,
        onClick: Te,
        onKeyDown: (dt) => {
          (dt.key === "Enter" || dt.key === " ") && (dt.preventDefault(), Te());
        },
        children: [
          /* @__PURE__ */ gt(bh, { config: r }),
          r.tooltipEnabled && !a && /* @__PURE__ */ gt("span", { class: "ecoflow-tooltip", style: pi, children: r.tooltipText })
        ]
      }
    )
  ] });
}
const Th = `
*, *::before, *::after { box-sizing: border-box; }

.ecoflow-root {
  all: initial;
  font-family: var(--ec-font);
  font-size: var(--ec-fs);
  color: var(--ec-c-bot);
}

/* ============ Botón lanzador ============ */
.ecoflow-button {
  position: fixed;
  z-index: var(--ec-z-button);
  width: var(--ec-button-w);
  height: var(--ec-button-h);
  border: none;
  padding: 0;
  margin: 0;
  background: transparent;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}
.ecoflow-button:focus-visible {
  outline: 2px solid var(--ec-c-send);
  outline-offset: 3px;
  border-radius: 12px;
}
.ecoflow-button--shape {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--ec-c-send);
  color: #fff;
  font-size: calc(var(--ec-fs) * 1.4);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
  transition: transform 0.15s ease;
}
.ecoflow-button--shape:hover { transform: scale(1.06); }
.ecoflow-button--shape:active { transform: scale(0.97); }
.ecoflow-button svg { width: 55%; height: 55%; }
.ecoflow-button--media, .ecoflow-button--media > * { width: 100%; height: 100%; }

/* ============ Tooltip ============ */
.ecoflow-tooltip {
  position: absolute;
  bottom: calc(100% + var(--ec-tooltip-offset));
  white-space: nowrap;
  background: var(--ec-tooltip-bg);
  color: var(--ec-tooltip-c);
  font-size: var(--ec-tooltip-fs);
  padding: var(--ec-tooltip-pad);
  border-radius: var(--ec-tooltip-radius);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease 0.1s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
}
.ecoflow-button:hover .ecoflow-tooltip,
.ecoflow-button:focus-visible .ecoflow-tooltip { opacity: 1; }

/* ============ Ventana ============ */
.ecoflow-window {
  position: fixed;
  z-index: var(--ec-z-window);
  display: flex;
  flex-direction: column;
  background: var(--ec-bg-window);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.28), 0 2px 8px rgba(0, 0, 0, 0.12);
  animation: ecoflow-pop 0.18s ease-out;
}
@keyframes ecoflow-pop {
  from { opacity: 0; transform: translateY(10px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.ecoflow-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  background: var(--ec-bg-header);
  color: #fff;
  font-weight: 600;
  flex-shrink: 0;
}
.ecoflow-header-title {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.ecoflow-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #fff;
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;
}
.ecoflow-close:hover { background: rgba(255, 255, 255, 0.18); }
.ecoflow-close svg { width: 16px; height: 16px; }

/* ============ Mensajes ============ */
.ecoflow-messages {
  flex: 1;
  overflow-y: auto;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  scrollbar-width: thin;
}
.ecoflow-messages::-webkit-scrollbar { width: 6px; }
.ecoflow-messages::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 3px; }

.ecoflow-msg { display: flex; align-items: flex-end; gap: 8px; }
.ecoflow-msg--user { justify-content: flex-end; }
.ecoflow-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  background: #d8dce6;
}
.ecoflow-bubble {
  max-width: 82%;
  padding: 10px 13px;
  border-radius: 14px;
  line-height: 1.45;
  overflow-wrap: break-word;
  white-space: normal;
}
.ecoflow-bubble--bot {
  background: var(--ec-bg-bot);
  color: var(--ec-c-bot);
  border-bottom-left-radius: 4px;
}
.ecoflow-bubble--user {
  background: var(--ec-bg-user);
  color: var(--ec-c-user);
  border-bottom-right-radius: 4px;
}
.ecoflow-bubble--error {
  background: #fdecea;
  color: #b3261e;
  border-bottom-left-radius: 4px;
}
.ecoflow-msg--agent {
  justify-content: center;
}
.ecoflow-agent-pill {
  font-size: calc(var(--ec-fs) * 0.78);
  color: var(--ec-c-footer);
  background: rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  padding: 3px 10px;
}

/* Indicador de escritura */
.ecoflow-typing { display: inline-flex; gap: 4px; padding: 12px 14px; }
.ecoflow-typing span {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #a7adba;
  animation: ecoflow-bounce 1.2s infinite ease-in-out;
}
.ecoflow-typing span:nth-child(2) { animation-delay: 0.15s; }
.ecoflow-typing span:nth-child(3) { animation-delay: 0.3s; }
@keyframes ecoflow-bounce {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
  30% { transform: translateY(-5px); opacity: 1; }
}

/* ============ Markdown dentro de burbujas ============ */
.ecoflow-markdown > *:first-child { margin-top: 0; }
.ecoflow-markdown > *:last-child { margin-bottom: 0; }
.ecoflow-markdown p { margin: 0 0 8px; }
.ecoflow-markdown ul, .ecoflow-markdown ol { margin: 4px 0 8px; padding-left: 18px; }
.ecoflow-markdown li { margin: 2px 0; }
.ecoflow-markdown a { color: inherit; text-decoration: underline; }
.ecoflow-markdown code {
  background: rgba(0, 0, 0, 0.07);
  border-radius: 4px;
  padding: 1px 5px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  font-size: 0.92em;
}
.ecoflow-markdown pre {
  background: rgba(0, 0, 0, 0.07);
  border-radius: 8px;
  padding: 10px;
  overflow-x: auto;
  margin: 4px 0 8px;
}
.ecoflow-markdown pre code { background: none; padding: 0; }
.ecoflow-markdown blockquote {
  margin: 4px 0 8px;
  padding-left: 10px;
  border-left: 3px solid rgba(0, 0, 0, 0.15);
}
.ecoflow-markdown table { border-collapse: collapse; margin: 4px 0 8px; max-width: 100%; display: block; overflow-x: auto; }
.ecoflow-markdown th, .ecoflow-markdown td { border: 1px solid rgba(0,0,0,0.15); padding: 4px 8px; }
.ecoflow-markdown img { max-width: 100%; border-radius: 8px; }

/* ============ Sugerencias (follow-up prompts) ============ */
.ecoflow-chips { display: flex; flex-wrap: wrap; gap: 8px; padding: 0 14px 10px; }
.ecoflow-chip {
  border: 1px solid var(--ec-c-send);
  color: var(--ec-c-send);
  background: transparent;
  border-radius: 16px;
  padding: 6px 12px;
  font-size: calc(var(--ec-fs) * 0.88);
  font-family: inherit;
  cursor: pointer;
  transition: background 0.15s ease;
}
.ecoflow-chip:hover { background: color-mix(in srgb, var(--ec-c-send) 10%, transparent); }

/* ============ Input ============ */
.ecoflow-input-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  flex-shrink: 0;
  background: var(--ec-bg-input);
}
.ecoflow-input {
  flex: 1;
  min-width: 0;
  border: 1px solid rgba(0, 0, 0, 0.14);
  border-radius: 20px;
  padding: 9px 14px;
  font: inherit;
  color: var(--ec-c-input);
  background: var(--ec-bg-input);
  outline: none;
}
.ecoflow-input:focus { border-color: var(--ec-c-send); }
.ecoflow-input:disabled { opacity: 0.6; }
.ecoflow-send {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border: none;
  border-radius: 50%;
  background: var(--ec-c-send);
  color: #fff;
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;
  transition: transform 0.12s ease;
}
.ecoflow-send:hover:not(:disabled) { transform: scale(1.08); }
.ecoflow-send:disabled { opacity: 0.45; cursor: default; }
.ecoflow-send svg { width: 17px; height: 17px; }

/* ============ Footer ============ */
.ecoflow-footer {
  text-align: center;
  font-size: 11px;
  padding: 6px 8px;
  color: var(--ec-c-footer);
  flex-shrink: 0;
}
.ecoflow-footer a { color: inherit; text-decoration: none; font-weight: 600; }
.ecoflow-footer a:hover { text-decoration: underline; }

@media (prefers-reduced-motion: reduce) {
  .ecoflow-window, .ecoflow-button--shape, .ecoflow-send { animation: none; transition: none; }
  .ecoflow-typing span { animation: none; }
}
`, gn = "ecoflow-chat";
class Ah extends HTMLElement {
  constructor() {
    super(...arguments), this._explicitConfig = {}, this._shadow = null, this.open = () => {
    }, this.close = () => {
    }, this.toggle = () => {
    }, this.sendMessage = () => {
    };
  }
  static get observedAttributes() {
    return La();
  }
  get config() {
    return this._explicitConfig;
  }
  set config(r) {
    this._explicitConfig = r ?? {}, this._render();
  }
  connectedCallback() {
    if (this._shadow) return;
    this._shadow = this.attachShadow({ mode: "open" });
    const r = document.createElement("style");
    r.textContent = Th, this._shadow.appendChild(r), this._render();
  }
  disconnectedCallback() {
    this._shadow && Kn(null, this._shadow);
  }
  attributeChangedCallback() {
    this._render();
  }
  _resolve() {
    const r = typeof window < "u" && window.ECOFLOW_CONFIG ? window.ECOFLOW_CONFIG : {}, a = Lo(this.attributes);
    return Fa([r, a, this._explicitConfig]);
  }
  _render() {
    this._shadow && Kn(/* @__PURE__ */ gt(xh, { host: this, config: this._resolve() }), this._shadow);
  }
}
function ha() {
  typeof window > "u" || typeof customElements > "u" || customElements.get(gn) || customElements.define(gn, Ah);
}
function Mo() {
  const l = document.currentScript;
  if (ha(), !l) return;
  const r = Lo(l.attributes), a = { ...window.ECOFLOW_CONFIG ?? {}, ...r };
  if (!a.chatflowId) return;
  const h = document.createElement(gn);
  h.config = a, document.body.appendChild(h);
}
ha();
typeof document < "u" && (document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", Mo) : Mo());
function Ch({ config: l, onReady: r, className: a, style: h }) {
  const g = Ea(null);
  return Ca(() => {
    const v = g.current;
    v && (v.config = l, r == null || r(v));
  }, [l]), Pa("ecoflow-chat", { ref: g, className: a, style: h });
}
export {
  Ch as EcoflowChat
};
