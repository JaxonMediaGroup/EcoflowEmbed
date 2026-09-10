var Ea = Object.defineProperty;
var qn = (l) => {
  throw TypeError(l);
};
var Pa = (l, r, n) => r in l ? Ea(l, r, { enumerable: !0, configurable: !0, writable: !0, value: n }) : l[r] = n;
var jt = (l, r, n) => Pa(l, typeof r != "symbol" ? r + "" : r, n), Ma = (l, r, n) => r.has(l) || qn("Cannot " + n);
var Gn = (l, r, n) => r.has(l) ? qn("Cannot add the same private member more than once") : r instanceof WeakSet ? r.add(l) : r.set(l, n);
var _s = (l, r, n) => (Ma(l, r, "access private method"), n);
import { useRef as Ia, useEffect as La, createElement as Fa } from "react";
const Ps = {
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
  footerTextColor: "#9aa0a6",
  voiceInput: "auto",
  voiceOutput: "auto",
  imageUploads: "auto",
  showResetButton: !0,
  persistConversation: !0,
  glass: !1
}, Oo = {
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
const Ra = new Map(
  Object.keys(Ps).map((l) => [
    yn(l),
    l
  ])
), Oa = new Map(
  Object.entries(Oo).map(([l, r]) => [yn(l), r])
);
function Js(l) {
  const r = l.trim();
  return r === "" || r === "true" ? !0 : r === "false" ? !1 : /^-?\d+(\.\d+)?$/.test(r) ? Number(r) : r;
}
function No(l) {
  const r = {}, n = Array.isArray(l) ? l : Array.from(l);
  for (const h of n) {
    const v = yn(h.name), m = Ra.get(v);
    if (m) {
      r[m] = Js(h.value);
      continue;
    }
    const y = Oa.get(v);
    typeof y == "string" ? r[y] = Js(h.value) : y && typeof y == "object" && (r[y.key] = Js(h.value), Object.assign(r, y.extra));
  }
  return r;
}
function Na() {
  const l = (h) => h.replace(/[A-Z]/g, (v) => "-" + v.toLowerCase()), r = Object.keys(Ps).map(l), n = Object.keys(Oo).map(l);
  return Array.from(/* @__PURE__ */ new Set([...r, ...n]));
}
function za(l) {
  const r = Object.assign({}, Ps, ...l);
  if (r.buttonType === "icon" && r.lottieAnimationPath && !r.buttonImageSrc ? r.buttonType = "lottie" : r.buttonType === "lottie" && !r.lottieAnimationPath && (r.buttonType = r.buttonImageSrc ? "image" : "icon"), r.buttonType === "image" && !r.buttonImageSrc && (r.buttonType = "icon"), r.windowHeaderBackgroundColor || (r.windowHeaderBackgroundColor = r.buttonBackgroundColor), r.glass) {
    const n = {
      windowBackgroundColor: "rgba(255, 255, 255, 0.07)",
      botMessageBackgroundColor: "rgba(255, 255, 255, 0.12)",
      botMessageTextColor: "#ffffff",
      textInputTextColor: "#ffffff",
      textInputBackgroundColor: "rgba(255, 255, 255, 0.08)",
      footerTextColor: "rgba(255, 255, 255, 0.65)"
    };
    for (const [h, v] of Object.entries(n))
      r[h] === Ps[h] && (r[h] = v);
  }
  return r;
}
function Da(l, r) {
  return l ? [l] : Array.from(r).filter(
    (n) => n.hasAttribute("data-chatflowid") && n.hasAttribute("data-api-host")
  );
}
function Ba(l, r, n) {
  const h = () => r.forEach((v) => n(v));
  if (l.readyState === "loading") {
    l.addEventListener("DOMContentLoaded", h, { once: !0 });
    return;
  }
  h();
}
var zs, Vt, zo, Qi, Yn, Do, Bo, tn, As, ts, Vo, _n, hn, fn, Ms = {}, Is = [], Va = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i, Ds = Array.isArray;
function Ci(l, r) {
  for (var n in r) l[n] = r[n];
  return l;
}
function bn(l) {
  l && l.parentNode && l.parentNode.removeChild(l);
}
function $a(l, r, n) {
  var h, v, m, y = {};
  for (m in r) m == "key" ? h = r[m] : m == "ref" ? v = r[m] : y[m] = r[m];
  if (arguments.length > 2 && (y.children = arguments.length > 3 ? zs.call(arguments, 2) : n), typeof l == "function" && l.defaultProps != null) for (m in l.defaultProps) y[m] === void 0 && (y[m] = l.defaultProps[m]);
  return Ss(l, y, h, v, null);
}
function Ss(l, r, n, h, v) {
  var m = { type: l, props: r, key: n, ref: h, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: v ?? ++zo, __i: -1, __u: 0 };
  return v == null && Vt.vnode != null && Vt.vnode(m), m;
}
function ss(l) {
  return l.children;
}
function Cs(l, r) {
  this.props = l, this.context = r;
}
function mr(l, r) {
  if (r == null) return l.__ ? mr(l.__, l.__i + 1) : null;
  for (var n; r < l.__k.length; r++) if ((n = l.__k[r]) != null && n.__e != null) return n.__e;
  return typeof l.type == "function" ? mr(l) : null;
}
function Ua(l) {
  if (l.__P && l.__d) {
    var r = l.__v, n = r.__e, h = [], v = [], m = Ci({}, r);
    m.__v = r.__v + 1, Vt.vnode && Vt.vnode(m), wn(l.__P, m, r, l.__n, l.__P.namespaceURI, 32 & r.__u ? [n] : null, h, n ?? mr(r), !!(32 & r.__u), v), m.__v = r.__v, m.__.__k[m.__i] = m, Ho(h, m, v), r.__e = r.__ = null, m.__e != n && $o(m);
  }
}
function $o(l) {
  if ((l = l.__) != null && l.__c != null) return l.__e = l.__c.base = null, l.__k.some(function(r) {
    if (r != null && r.__e != null) return l.__e = l.__c.base = r.__e;
  }), $o(l);
}
function Xn(l) {
  (!l.__d && (l.__d = !0) && Qi.push(l) && !Ls.__r++ || Yn != Vt.debounceRendering) && ((Yn = Vt.debounceRendering) || Do)(Ls);
}
function Ls() {
  try {
    for (var l, r = 1; Qi.length; ) Qi.length > r && Qi.sort(Bo), l = Qi.shift(), r = Qi.length, Ua(l);
  } finally {
    Qi.length = Ls.__r = 0;
  }
}
function Uo(l, r, n, h, v, m, y, F, B, j, W) {
  var H, O, X, rt, et, ct, _t = h && h.__k || Is, dt = r.length;
  for (B = ja(n, r, _t, B, dt), H = 0; H < dt; H++) (X = n.__k[H]) != null && (O = X.__i != -1 && _t[X.__i] || Ms, X.__i = H, ct = wn(l, X, O, v, m, y, F, B, j, W), rt = X.__e, X.ref && O.ref != X.ref && (O.ref && kn(O.ref, null, X), W.push(X.ref, X.__c || rt, X)), et == null && rt != null && (et = rt), 4 & X.__u ? (B = jo(X, B, l), O.__e && (O.__e = null)) : typeof X.type == "function" && ct !== void 0 ? B = ct : rt && (B = rt.nextSibling), X.__u &= -7);
  return n.__e = et, B;
}
function ja(l, r, n, h, v) {
  var m, y, F, B, j, W = n.length, H = W, O = 0;
  for (l.__k = new Array(v), m = 0; m < v; m++) (y = r[m]) != null && typeof y != "boolean" && typeof y != "function" ? (typeof y == "string" || typeof y == "number" || typeof y == "bigint" || y.constructor == String ? y = l.__k[m] = Ss(null, y, null, null, null) : Ds(y) ? y = l.__k[m] = Ss(ss, { children: y }, null, null, null) : y.constructor === void 0 && y.__b > 0 ? y = l.__k[m] = Ss(y.type, y.props, y.key, y.ref ? y.ref : null, y.__v) : l.__k[m] = y, B = m + O, y.__ = l, y.__b = l.__b + 1, F = null, (j = y.__i = Wa(y, n, B, H)) != -1 && (H--, (F = n[j]) && (F.__u |= 2)), F == null || F.__v == null ? (j == -1 && (v > W ? O-- : v < W && O++), typeof y.type != "function" && (y.__u |= 4)) : j != B && (j == B - 1 ? O-- : j == B + 1 ? O++ : (j > B ? O-- : O++, y.__u |= 4))) : l.__k[m] = null;
  if (H) for (m = 0; m < W; m++) (F = n[m]) != null && !(2 & F.__u) && (F.__e == h && (h = mr(F)), Go(F, F));
  return h;
}
function jo(l, r, n) {
  var h, v;
  if (typeof l.type == "function") {
    for (h = l.__k, v = 0; h && v < h.length; v++) h[v] && (h[v].__ = l, r = jo(h[v], r, n));
    return r;
  }
  l.__e != r && (r && l.type && !r.parentNode && (r = mr(l)), r = n.insertBefore(l.__e, r || null));
  do
    r = r && r.nextSibling;
  while (r != null && r.nodeType == 8);
  return r;
}
function Wa(l, r, n, h) {
  var v, m, y, F = l.key, B = l.type, j = r[n], W = j != null && (2 & j.__u) == 0;
  if (j === null && F == null || W && F == j.key && B == j.type) return n;
  if (h > (W ? 1 : 0)) {
    for (v = n - 1, m = n + 1; v >= 0 || m < r.length; ) if ((j = r[y = v >= 0 ? v-- : m++]) != null && !(2 & j.__u) && F == j.key && B == j.type) return y;
  }
  return -1;
}
function Zn(l, r, n) {
  r[0] == "-" ? l.setProperty(r, n ?? "") : l[r] = n == null ? "" : typeof n != "number" || Va.test(r) ? n : n + "px";
}
function bs(l, r, n, h, v) {
  var m, y;
  t: if (r == "style") if (typeof n == "string") l.style.cssText = n;
  else {
    if (typeof h == "string" && (l.style.cssText = h = ""), h) for (r in h) n && r in n || Zn(l.style, r, "");
    if (n) for (r in n) h && n[r] == h[r] || Zn(l.style, r, n[r]);
  }
  else if (r[0] == "o" && r[1] == "n") m = r != (r = r.replace(Vo, "$1")), y = r.toLowerCase(), r = y in l || r == "onFocusOut" || r == "onFocusIn" ? y.slice(2) : r.slice(2), l.l || (l.l = {}), l.l[r + m] = n, n ? h ? n[ts] = h[ts] : (n[ts] = _n, l.addEventListener(r, m ? fn : hn, m)) : l.removeEventListener(r, m ? fn : hn, m);
  else {
    if (v == "http://www.w3.org/2000/svg") r = r.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
    else if (r != "width" && r != "height" && r != "href" && r != "list" && r != "form" && r != "tabIndex" && r != "download" && r != "rowSpan" && r != "colSpan" && r != "role" && r != "popover" && r in l) try {
      l[r] = n ?? "";
      break t;
    } catch {
    }
    typeof n == "function" || (n == null || n === !1 && r[4] != "-" ? l.removeAttribute(r) : l.setAttribute(r, r == "popover" && n == 1 ? "" : n));
  }
}
function Kn(l) {
  return function(r) {
    if (this.l) {
      var n = this.l[r.type + l];
      if (r[As] == null) r[As] = _n++;
      else if (r[As] < n[ts]) return;
      return n(Vt.event ? Vt.event(r) : r);
    }
  };
}
function wn(l, r, n, h, v, m, y, F, B, j) {
  var W, H, O, X, rt, et, ct, _t, dt, Ct, Mt, Bt, Ot, me, re, Et, wt = r.type;
  if (r.constructor !== void 0) return null;
  128 & n.__u && (B = !!(32 & n.__u), m = [F = r.__e = n.__e]), (W = Vt.__b) && W(r);
  t: if (typeof wt == "function") {
    H = y.length;
    try {
      if (dt = r.props, Ct = wt.prototype && wt.prototype.render, Mt = (W = wt.contextType) && h[W.__c], Bt = W ? Mt ? Mt.props.value : W.__ : h, n.__c ? _t = (O = r.__c = n.__c).__ = O.__E : (Ct ? r.__c = O = new wt(dt, Bt) : (r.__c = O = new Cs(dt, Bt), O.constructor = wt, O.render = qa), Mt && Mt.sub(O), O.state || (O.state = {}), O.__n = h, X = O.__d = !0, O.__h = [], O._sb = []), Ct && O.__s == null && (O.__s = O.state), Ct && wt.getDerivedStateFromProps != null && (O.__s == O.state && (O.__s = Ci({}, O.__s)), Ci(O.__s, wt.getDerivedStateFromProps(dt, O.__s))), rt = O.props, et = O.state, O.__v = r, X) Ct && wt.getDerivedStateFromProps == null && O.componentWillMount != null && O.componentWillMount(), Ct && O.componentDidMount != null && O.__h.push(O.componentDidMount);
      else {
        if (Ct && wt.getDerivedStateFromProps == null && dt !== rt && O.componentWillReceiveProps != null && O.componentWillReceiveProps(dt, Bt), r.__v == n.__v || !O.__e && O.shouldComponentUpdate != null && O.shouldComponentUpdate(dt, O.__s, Bt) === !1) {
          r.__v != n.__v && (O.props = dt, O.state = O.__s, O.__d = !1), r.__e = n.__e, r.__k = n.__k, r.__k.some(function(Yt) {
            Yt && (Yt.__ = r);
          }), Is.push.apply(O.__h, O._sb), O._sb = [], O.__h.length && y.push(O), F = mr(n);
          break t;
        }
        O.componentWillUpdate != null && O.componentWillUpdate(dt, O.__s, Bt), Ct && O.componentDidUpdate != null && O.__h.push(function() {
          O.componentDidUpdate(rt, et, ct);
        });
      }
      if (O.context = Bt, O.props = dt, O.__P = l, O.__e = !1, Ot = Vt.__r, me = 0, Ct) O.state = O.__s, O.__d = !1, Ot && Ot(r), W = O.render(O.props, O.state, O.context), Is.push.apply(O.__h, O._sb), O._sb = [];
      else do
        O.__d = !1, Ot && Ot(r), W = O.render(O.props, O.state, O.context), O.state = O.__s;
      while (O.__d && ++me < 25);
      O.state = O.__s, O.getChildContext != null && (h = Ci(Ci({}, h), O.getChildContext())), Ct && !X && O.getSnapshotBeforeUpdate != null && (ct = O.getSnapshotBeforeUpdate(rt, et)), re = W != null && W.type === ss && W.key == null ? qo(W.props.children) : W, F = Uo(l, Ds(re) ? re : [re], r, n, h, v, m, y, F, B, j), O.base = r.__e, r.__u &= -161, O.__h.length && y.push(O), _t && (O.__E = O.__ = null);
    } catch (Yt) {
      if (y.length = H, r.__v = null, B || m != null) {
        if (Yt.then) {
          for (r.__u |= B ? 160 : 128; F && F.nodeType == 8 && F.nextSibling; ) F = F.nextSibling;
          m != null && (m[m.indexOf(F)] = null), r.__e = F;
        } else if (m != null) for (Et = m.length; Et--; ) bn(m[Et]);
      } else r.__e = n.__e;
      r.__k == null && (r.__k = n.__k || []), Yt.then || Wo(r), Vt.__e(Yt, r, n);
    }
  } else m == null && r.__v == n.__v ? (r.__k = n.__k, r.__e = n.__e) : F = r.__e = Ha(n.__e, r, n, h, v, m, y, B, j);
  return (W = Vt.diffed) && W(r), 128 & r.__u ? void 0 : F;
}
function Wo(l) {
  l && (l.__c && (l.__c.__e = !0), l.__k && l.__k.some(Wo));
}
function Ho(l, r, n) {
  for (var h = 0; h < n.length; h++) kn(n[h], n[++h], n[++h]);
  Vt.__c && Vt.__c(r, l), l.some(function(v) {
    try {
      l = v.__h, v.__h = [], l.some(function(m) {
        m.call(v);
      });
    } catch (m) {
      Vt.__e(m, v.__v);
    }
  });
}
function qo(l) {
  return typeof l != "object" || l == null || l.__b > 0 ? l : Ds(l) ? l.map(qo) : l.constructor !== void 0 ? null : Ci({}, l);
}
function Ha(l, r, n, h, v, m, y, F, B) {
  var j, W, H, O, X, rt, et, ct = n.props || Ms, _t = r.props, dt = r.type;
  if (dt == "svg" ? v = "http://www.w3.org/2000/svg" : dt == "math" ? v = "http://www.w3.org/1998/Math/MathML" : v || (v = "http://www.w3.org/1999/xhtml"), m != null) {
    for (j = 0; j < m.length; j++) if ((X = m[j]) && "setAttribute" in X == !!dt && (dt ? X.localName == dt : X.nodeType == 3)) {
      l = X, m[j] = null;
      break;
    }
  }
  if (l == null) {
    if (dt == null) return document.createTextNode(_t);
    l = document.createElementNS(v, dt, _t.is && _t), F && (Vt.__m && Vt.__m(r, m), F = !1), m = null;
  }
  if (dt == null) ct === _t || F && l.data == _t || (l.data = _t);
  else {
    if (m = dt == "textarea" && _t.defaultValue != null ? null : m && zs.call(l.childNodes), !F && m != null) for (ct = {}, j = 0; j < l.attributes.length; j++) ct[(X = l.attributes[j]).name] = X.value;
    for (j in ct) X = ct[j], j == "dangerouslySetInnerHTML" ? H = X : j == "children" || j in _t || j == "value" && "defaultValue" in _t || j == "checked" && "defaultChecked" in _t || bs(l, j, null, X, v);
    for (j in _t) X = _t[j], j == "children" ? O = X : j == "dangerouslySetInnerHTML" ? W = X : j == "value" ? rt = X : j == "checked" ? et = X : F && typeof X != "function" || ct[j] === X || bs(l, j, X, ct[j], v);
    if (W) F || H && (W.__html == H.__html || W.__html == l.innerHTML) || (l.innerHTML = W.__html), r.__k = [];
    else if (H && (l.innerHTML = ""), Uo(r.type == "template" ? l.content : l, Ds(O) ? O : [O], r, n, h, dt == "foreignObject" ? "http://www.w3.org/1999/xhtml" : v, m, y, m ? m[0] : n.__k && mr(n, 0), F, B), m != null) for (j = m.length; j--; ) bn(m[j]);
    F && dt != "textarea" || (j = "value", dt == "progress" && rt == null ? l.removeAttribute("value") : rt != null && (rt !== l[j] || dt == "progress" && !rt || dt == "option" && rt != ct[j]) && bs(l, j, rt, ct[j], v), j = "checked", et != null && et != l[j] && bs(l, j, et, ct[j], v));
  }
  return l;
}
function kn(l, r, n) {
  try {
    if (typeof l == "function") {
      var h = typeof l.__u == "function";
      h && l.__u(), h && r == null || (l.__u = l(r));
    } else l.current = r;
  } catch (v) {
    Vt.__e(v, n);
  }
}
function Go(l, r, n) {
  var h, v;
  if (Vt.unmount && Vt.unmount(l), (h = l.ref) && (h.current && h.current != l.__e || kn(h, null, r)), (h = l.__c) != null) {
    if (h.componentWillUnmount) try {
      h.componentWillUnmount();
    } catch (m) {
      Vt.__e(m, r);
    }
    h.base = h.__P = h.__n = null;
  }
  if (h = l.__k) for (v = 0; v < h.length; v++) h[v] && Go(h[v], r, n || typeof l.type != "function");
  n || bn(l.__e), l.__c = l.__ = l.__e = void 0;
}
function qa(l, r, n) {
  return this.constructor(l, n);
}
function Qn(l, r, n) {
  var h, v, m, y;
  r == document && (r = document.documentElement), Vt.__ && Vt.__(l, r), v = (h = !1) ? null : r.__k, m = [], y = [], wn(r, l = r.__k = $a(ss, null, [l]), v || Ms, Ms, r.namespaceURI, v ? null : r.firstChild ? zs.call(r.childNodes) : null, m, v ? v.__e : r.firstChild, h, y), Ho(m, l, y), l.props.children = null;
}
zs = Is.slice, Vt = { __e: function(l, r, n, h) {
  for (var v, m, y; r = r.__; ) if ((v = r.__c) && !v.__) try {
    if ((m = v.constructor) && m.getDerivedStateFromError != null && (v.setState(m.getDerivedStateFromError(l)), y = v.__d), v.componentDidCatch != null && (v.componentDidCatch(l, h || {}), y = v.__d), y) return v.__E = v;
  } catch (F) {
    l = F;
  }
  throw l;
} }, zo = 0, Cs.prototype.setState = function(l, r) {
  var n;
  n = this.__s != null && this.__s != this.state ? this.__s : this.__s = Ci({}, this.state), typeof l == "function" && (l = l(Ci({}, n), this.props)), l && Ci(n, l), l != null && this.__v && (r && this._sb.push(r), Xn(this));
}, Cs.prototype.forceUpdate = function(l) {
  this.__v && (this.__e = !0, l && this.__h.push(l), Xn(this));
}, Cs.prototype.render = ss, Qi = [], Do = typeof Promise == "function" ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, Bo = function(l, r) {
  return l.__v.__b - r.__v.__b;
}, Ls.__r = 0, tn = Math.random().toString(8), As = "__d" + tn, ts = "__a" + tn, Vo = /(PointerCapture)$|Capture$/i, _n = 0, hn = Kn(!1), fn = Kn(!0);
var Ga = 0;
function tt(l, r, n, h, v, m) {
  r || (r = {});
  var y, F, B = r;
  if ("ref" in B) for (F in B = {}, r) F == "ref" ? y = r[F] : B[F] = r[F];
  var j = { type: l, props: B, key: n, ref: y, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: --Ga, __i: -1, __u: 0, __source: v, __self: m };
  if (typeof l == "function" && (y = l.defaultProps)) for (F in y) B[F] === void 0 && (B[F] = y[F]);
  return Vt.vnode && Vt.vnode(j), j;
}
var rs, Zt, en, Jn, Fs = 0, Yo = [], ee = Vt, to = ee.__b, eo = ee.__r, io = ee.diffed, ro = ee.__c, so = ee.unmount, no = ee.__;
function xn(l, r) {
  ee.__h && ee.__h(Zt, l, Fs || r), Fs = 0;
  var n = Zt.__H || (Zt.__H = { __: [], __h: [] });
  return l >= n.__.length && n.__.push({}), n.__[l];
}
function li(l) {
  return Fs = 1, Ya(Zo, l);
}
function Ya(l, r, n) {
  var h = xn(rs++, 2);
  if (h.t = l, !h.__c && (h.__ = [Zo(void 0, r), function(F) {
    var B = h.__N ? h.__N[0] : h.__[0], j = h.t(B, F);
    B !== j && (h.__N = [j, h.__[1]], h.__c.setState({}));
  }], h.__c = Zt, !Zt.__f)) {
    var v = function(F, B, j) {
      if (!h.__c.__H) return !0;
      var W = !1, H = h.__c.props !== F;
      if (h.__c.__H.__.some(function(X) {
        if (X.__N) {
          W = !0;
          var rt = X.__[0];
          X.__ = X.__N, X.__N = void 0, rt !== X.__[0] && (H = !0);
        }
      }), m) {
        var O = m.call(this, F, B, j);
        return W ? O || H : O;
      }
      return !W || H;
    };
    Zt.__f = !0;
    var m = Zt.shouldComponentUpdate, y = Zt.componentWillUpdate;
    Zt.componentWillUpdate = function(F, B, j) {
      if (this.__e) {
        var W = m;
        m = void 0, v(F, B, j), m = W;
      }
      y && y.call(this, F, B, j);
    }, Zt.shouldComponentUpdate = v;
  }
  return h.__N || h.__;
}
function Ai(l, r) {
  var n = xn(rs++, 3);
  !ee.__s && Xo(n.__H, r) && (n.__ = l, n.u = r, Zt.__H.__h.push(n));
}
function we(l) {
  return Fs = 5, Xa(function() {
    return { current: l };
  }, []);
}
function Xa(l, r) {
  var n = xn(rs++, 7);
  return Xo(n.__H, r) && (n.__ = l(), n.__H = r, n.__h = l), n.__;
}
function Za() {
  for (var l; l = Yo.shift(); ) {
    var r = l.__H;
    if (l.__P && r) try {
      r.__h.some(Es), r.__h.some(cn), r.__h = [];
    } catch (n) {
      r.__h = [], ee.__e(n, l.__v);
    }
  }
}
ee.__b = function(l) {
  Zt = null, to && to(l);
}, ee.__ = function(l, r) {
  l && r.__k && r.__k.__m && (l.__m = r.__k.__m), no && no(l, r);
}, ee.__r = function(l) {
  eo && eo(l), rs = 0;
  var r = (Zt = l.__c).__H;
  r && (en === Zt ? (r.__h = [], Zt.__h = [], r.__.some(function(n) {
    n.__N && (n.__ = n.__N), n.u = n.__N = void 0;
  })) : (r.__h.some(Es), r.__h.some(cn), r.__h = [], rs = 0)), en = Zt;
}, ee.diffed = function(l) {
  io && io(l);
  var r = l.__c;
  r && r.__H && (r.__H.__h.length && (Yo.push(r) !== 1 && Jn === ee.requestAnimationFrame || ((Jn = ee.requestAnimationFrame) || Ka)(Za)), r.__H.__.some(function(n) {
    n.u && (n.__H = n.u, n.u = void 0);
  })), en = Zt = null;
}, ee.__c = function(l, r) {
  r.some(function(n) {
    try {
      n.__h.some(Es), n.__h = n.__h.filter(function(h) {
        return !h.__ || cn(h);
      });
    } catch (h) {
      r.some(function(v) {
        v.__h && (v.__h = []);
      }), r = [], ee.__e(h, n.__v);
    }
  }), ro && ro(l, r);
}, ee.unmount = function(l) {
  so && so(l);
  var r, n = l.__c;
  n && n.__H && (n.__H.__.some(function(h) {
    try {
      Es(h);
    } catch (v) {
      r = v;
    }
  }), n.__H = void 0, r && ee.__e(r, n.__v));
};
var oo = typeof requestAnimationFrame == "function";
function Ka(l) {
  var r, n = function() {
    clearTimeout(h), oo && cancelAnimationFrame(r), setTimeout(l);
  }, h = setTimeout(n, 35);
  oo && (r = requestAnimationFrame(n));
}
function Es(l) {
  var r = Zt, n = l.__c;
  typeof n == "function" && (l.__c = void 0, n()), Zt = r;
}
function cn(l) {
  var r = Zt;
  l.__c = l.__(), Zt = r;
}
function Xo(l, r) {
  return !l || l.length !== r.length || r.some(function(n, h) {
    return n !== l[h];
  });
}
function Zo(l, r) {
  return typeof r == "function" ? r(l) : r;
}
function Qa(l) {
  const r = [];
  let n = l;
  const v = l.replace(/\r\n/g, `
`).split(`

`);
  n = l.endsWith(`

`) ? "" : v.pop() ?? "";
  for (const m of v) {
    const y = m.split(`
`).filter((B) => B.startsWith("data:")).map((B) => B.slice(5).trim());
    if (y.length === 0) continue;
    const F = y.join(`
`);
    try {
      const B = JSON.parse(F);
      r.push({ event: B.event ?? "message", data: B.data });
    } catch {
      F !== "[DONE]" && r.push({ event: "token", data: F });
    }
  }
  return { events: r, rest: n };
}
function Ja(l) {
  return `${l.apiHost.replace(/\/+$/, "")}/api/v1/prediction/${encodeURIComponent(l.chatflowId)}`;
}
async function tl(l, r, n) {
  var H, O, X;
  const h = {
    question: l.question,
    chatId: l.chatId,
    streaming: l.streaming ?? !0,
    ...l.overrideConfig ? { overrideConfig: l.overrideConfig } : {},
    ...(H = l.uploads) != null && H.length ? { uploads: l.uploads } : {}
  }, v = await fetch(Ja(l), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(h),
    signal: n
  });
  if (!v.ok) {
    let rt = `${v.status} ${v.statusText}`;
    try {
      const et = await v.json();
      et != null && et.message && (rt = et.message);
    } catch {
    }
    throw new Error(rt);
  }
  if (!l.streaming || !v.body) {
    const rt = await v.json();
    rt.text && r.onToken(rt.text), (rt.chatId || rt.followUpPrompts) && ((O = r.onMetadata) == null || O.call(r, { chatId: rt.chatId, followUpPrompts: rt.followUpPrompts })), r.onDone();
    return;
  }
  (X = r.onStart) == null || X.call(r);
  const m = v.body.getReader(), y = new TextDecoder();
  let F = "", B = !1;
  const j = (rt) => {
    var _t, dt, Ct, Mt, Bt;
    const { event: et, data: ct } = rt;
    switch (et) {
      case "token":
        typeof ct == "string" && r.onToken(ct);
        break;
      case "thinking":
      case "tool":
      case "usedTools":
      case "calledTools":
      case "agentReasoning":
      case "nextAgent":
        (_t = r.onActivity) == null || _t.call(r, et);
        break;
      case "metadata":
        ct && typeof ct == "object" && ((dt = r.onMetadata) == null || dt.call(r, ct));
        break;
      case "tts_start":
        if (ct && typeof ct == "object") {
          const Ot = ct.format ?? "audio/mpeg";
          (Ct = r.onTtsStart) == null || Ct.call(r, Ot);
        }
        break;
      case "tts_data":
        if (ct && typeof ct == "object") {
          const Ot = ct.audioChunk;
          Ot && ((Mt = r.onTtsChunk) == null || Mt.call(r, Ot));
        }
        break;
      case "tts_end":
        (Bt = r.onTtsEnd) == null || Bt.call(r);
        break;
      case "error":
        B = !0, r.onError(typeof ct == "string" ? ct : JSON.stringify(ct));
        break;
      case "end":
        return !0;
    }
    return !1;
  };
  let W = !1;
  for (; !W; ) {
    const { done: rt, value: et } = await m.read();
    if (rt) break;
    F += y.decode(et, { stream: !0 });
    const { events: ct, rest: _t } = Qa(F);
    F = _t;
    for (const dt of ct)
      if (j(dt)) {
        W = !0;
        break;
      }
  }
  B || r.onDone();
}
function ao() {
  return typeof crypto < "u" && "randomUUID" in crypto ? crypto.randomUUID() : "chat-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
}
const el = {
  stt: !1,
  tts: !1,
  imageUploads: !1,
  imageTypes: [],
  imageMaxSizeMb: 5
};
function il(l) {
  if (!l) return !1;
  try {
    const r = JSON.parse(l);
    return Object.entries(r).some(([n, h]) => n !== "none" && (h == null ? void 0 : h.status) === !0);
  } catch {
    return !1;
  }
}
const lo = /* @__PURE__ */ new Map();
async function rl(l, r) {
  var y, F;
  const n = `${l}|${r}`, h = lo.get(n);
  if (h) return h;
  const v = l.replace(/\/+$/, ""), m = { ...el };
  try {
    const B = await fetch(`${v}/api/v1/chatflows-uploads/${encodeURIComponent(r)}`);
    if (B.ok) {
      const j = await B.json();
      m.stt = j.isSpeechToTextEnabled === !0, m.imageUploads = j.isImageUploadAllowed === !0;
      const W = (y = j.imgUploadSizeAndTypes) == null ? void 0 : y[0];
      (F = W == null ? void 0 : W.fileTypes) != null && F.length && (m.imageTypes = W.fileTypes.filter((H) => !!H), m.imageMaxSizeMb = W.maxUploadSize ?? 5);
    }
  } catch {
  }
  try {
    const B = await fetch(`${v}/api/v1/public-chatflows/${encodeURIComponent(r)}`);
    if (B.ok) {
      const j = await B.json();
      m.tts = il(j.textToSpeech);
    }
  } catch {
  }
  return lo.set(n, m), m;
}
function ho(l) {
  return new Promise((r, n) => {
    const h = new FileReader();
    h.onload = () => r(h.result), h.onerror = () => n(h.error ?? new Error("No se pudo leer el archivo")), h.readAsDataURL(l);
  });
}
function sl(l) {
  const r = (l.type || "audio/webm").split(";", 1)[0].toLowerCase() || "audio/webm", n = r.includes("mp4") ? "m4a" : r.includes("ogg") ? "ogg" : r.includes("wav") ? "wav" : "webm";
  return { name: `audio-${Date.now()}.${n}`, mime: r };
}
function nl(l) {
  return l !== !1;
}
var ol = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function al(l) {
  return l && l.__esModule && Object.prototype.hasOwnProperty.call(l, "default") ? l.default : l;
}
var un = { exports: {} };
(function(l, r) {
  typeof document < "u" && typeof navigator < "u" && function(n, h) {
    l.exports = h();
  }(ol, function() {
    var n = "http://www.w3.org/2000/svg", h = "", v = !1, m = -999999, y = function(e) {
      v = !!e;
    }, F = function() {
      return v;
    }, B = function(e) {
      h = e;
    }, j = function() {
      return h;
    };
    function W(t) {
      return document.createElement(t);
    }
    function H(t, e) {
      var i, s = t.length, a;
      for (i = 0; i < s; i += 1) {
        a = t[i].prototype;
        for (var o in a)
          Object.prototype.hasOwnProperty.call(a, o) && (e.prototype[o] = a[o]);
      }
    }
    function O(t) {
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
          var s, a = this.audios.length;
          for (s = 0; s < a; s += 1)
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
    }(), rt = /* @__PURE__ */ function() {
      function t(i, s) {
        var a = 0, o = [], c;
        switch (i) {
          case "int16":
          case "uint8c":
            c = 1;
            break;
          default:
            c = 1.1;
            break;
        }
        for (a = 0; a < s; a += 1)
          o.push(c);
        return o;
      }
      function e(i, s) {
        return i === "float32" ? new Float32Array(s) : i === "int16" ? new Int16Array(s) : i === "uint8c" ? new Uint8ClampedArray(s) : t(i, s);
      }
      return typeof Uint8ClampedArray == "function" && typeof Float32Array == "function" ? e : t;
    }();
    function et(t) {
      return Array.apply(null, {
        length: t
      });
    }
    var ct = !0, _t = null, dt = "", Ct = /^((?!chrome|android).)*safari/i.test(navigator.userAgent), Mt = Math.pow, Bt = Math.sqrt, Ot = Math.floor, me = Math.min, re = 150, Et = Math.PI / 180, wt = 0.5519;
    function Yt(t, e, i, s) {
      this.type = t, this.currentTime = e, this.totalTime = i, this.direction = s < 0 ? -1 : 1;
    }
    function ci(t, e) {
      this.type = t, this.direction = e < 0 ? -1 : 1;
    }
    function Qe(t, e, i, s) {
      this.type = t, this.currentLoop = i, this.totalLoops = e, this.direction = s < 0 ? -1 : 1;
    }
    function Ve(t, e, i) {
      this.type = t, this.firstFrame = e, this.totalFrames = i;
    }
    function Je(t, e) {
      this.type = t, this.target = e;
    }
    function xe(t, e) {
      this.type = "renderFrameError", this.nativeError = t, this.currentTime = e;
    }
    function Ei(t) {
      this.type = "configError", this.nativeError = t;
    }
    var Gt = /* @__PURE__ */ function() {
      var t = 0;
      return function() {
        return t += 1, dt + "__lottie_element_" + t;
      };
    }();
    function He(t, e, i) {
      var s, a, o, c, b, u, T, C;
      switch (c = Math.floor(t * 6), b = t * 6 - c, u = i * (1 - e), T = i * (1 - b * e), C = i * (1 - (1 - b) * e), c % 6) {
        case 0:
          s = i, a = C, o = u;
          break;
        case 1:
          s = T, a = i, o = u;
          break;
        case 2:
          s = u, a = i, o = C;
          break;
        case 3:
          s = u, a = T, o = i;
          break;
        case 4:
          s = C, a = u, o = i;
          break;
        case 5:
          s = i, a = u, o = T;
          break;
      }
      return [s, a, o];
    }
    function ge(t, e, i) {
      var s = Math.max(t, e, i), a = Math.min(t, e, i), o = s - a, c, b = s === 0 ? 0 : o / s, u = s / 255;
      switch (s) {
        case a:
          c = 0;
          break;
        case t:
          c = e - i + o * (e < i ? 6 : 0), c /= 6 * o;
          break;
        case e:
          c = i - t + o * 2, c /= 6 * o;
          break;
        case i:
          c = t - e + o * 4, c /= 6 * o;
          break;
      }
      return [c, b, u];
    }
    function ui(t, e) {
      var i = ge(t[0] * 255, t[1] * 255, t[2] * 255);
      return i[1] += e, i[1] > 1 ? i[1] = 1 : i[1] <= 0 && (i[1] = 0), He(i[0], i[1], i[2]);
    }
    function _r(t, e) {
      var i = ge(t[0] * 255, t[1] * 255, t[2] * 255);
      return i[2] += e, i[2] > 1 ? i[2] = 1 : i[2] < 0 && (i[2] = 0), He(i[0], i[1], i[2]);
    }
    function br(t, e) {
      var i = ge(t[0] * 255, t[1] * 255, t[2] * 255);
      return i[0] += e / 360, i[0] > 1 ? i[0] -= 1 : i[0] < 0 && (i[0] += 1), He(i[0], i[1], i[2]);
    }
    (function() {
      var t = [], e, i;
      for (e = 0; e < 256; e += 1)
        i = e.toString(16), t[e] = i.length === 1 ? "0" + i : i;
      return function(s, a, o) {
        return s < 0 && (s = 0), a < 0 && (a = 0), o < 0 && (o = 0), "#" + t[s] + t[a] + t[o];
      };
    })();
    var Ji = function(e) {
      ct = !!e;
    }, xt = function() {
      return ct;
    }, Pi = function(e) {
      _t = e;
    }, ti = function() {
      return _t;
    }, Mi = function(e) {
      re = e;
    }, Ii = function() {
      return re;
    }, Fr = function(e) {
      dt = e;
    };
    function ut(t) {
      return document.createElementNS(n, t);
    }
    function Li(t) {
      "@babel/helpers - typeof";
      return Li = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
        return typeof e;
      } : function(e) {
        return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
      }, Li(t);
    }
    var qe = /* @__PURE__ */ function() {
      var t = 1, e = [], i, s, a = {
        onmessage: function() {
        },
        postMessage: function(E) {
          i({
            data: E
          });
        }
      }, o = {
        postMessage: function(E) {
          a.onmessage({
            data: E
          });
        }
      };
      function c(g) {
        if (window.Worker && window.Blob && F()) {
          var E = new Blob(["var _workerSelf = self; self.onmessage = ", g.toString()], {
            type: "text/javascript"
          }), I = URL.createObjectURL(E);
          return new Worker(I);
        }
        return i = g, a;
      }
      function b() {
        s || (s = c(function(E) {
          function I() {
            function N(G, w) {
              var M, f, p = G.length, $, R, st, pt;
              for (f = 0; f < p; f += 1)
                if (M = G[f], "ks" in M && !M.completed) {
                  if (M.completed = !0, M.hasMask) {
                    var vt = M.masksProperties;
                    for (R = vt.length, $ = 0; $ < R; $ += 1)
                      if (vt[$].pt.k.i)
                        A(vt[$].pt.k);
                      else
                        for (pt = vt[$].pt.k.length, st = 0; st < pt; st += 1)
                          vt[$].pt.k[st].s && A(vt[$].pt.k[st].s[0]), vt[$].pt.k[st].e && A(vt[$].pt.k[st].e[0]);
                  }
                  M.ty === 0 ? (M.layers = d(M.refId, w), N(M.layers, w)) : M.ty === 4 ? _(M.shapes) : M.ty === 5 && yt(M);
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
            function _(G) {
              var w, M = G.length, f, p;
              for (w = M - 1; w >= 0; w -= 1)
                if (G[w].ty === "sh")
                  if (G[w].ks.k.i)
                    A(G[w].ks.k);
                  else
                    for (p = G[w].ks.k.length, f = 0; f < p; f += 1)
                      G[w].ks.k[f].s && A(G[w].ks.k[f].s[0]), G[w].ks.k[f].e && A(G[w].ks.k[f].e[0]);
                else G[w].ty === "gr" && _(G[w].it);
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
            }(), U = /* @__PURE__ */ function() {
              var G = [4, 7, 99];
              return function(w) {
                if (w.chars && !L(G, w.v)) {
                  var M, f = w.chars.length;
                  for (M = 0; M < f; M += 1) {
                    var p = w.chars[M];
                    p.data && p.data.shapes && (_(p.data.shapes), p.data.ip = 0, p.data.op = 99999, p.data.st = 0, p.data.sr = 1, p.data.ks = {
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
            }(), gt = /* @__PURE__ */ function() {
              var G = [4, 1, 9];
              function w(f) {
                var p, $ = f.length, R, st;
                for (p = 0; p < $; p += 1)
                  if (f[p].ty === "gr")
                    w(f[p].it);
                  else if (f[p].ty === "fl" || f[p].ty === "st")
                    if (f[p].c.k && f[p].c.k[0].i)
                      for (st = f[p].c.k.length, R = 0; R < st; R += 1)
                        f[p].c.k[R].s && (f[p].c.k[R].s[0] /= 255, f[p].c.k[R].s[1] /= 255, f[p].c.k[R].s[2] /= 255, f[p].c.k[R].s[3] /= 255), f[p].c.k[R].e && (f[p].c.k[R].e[0] /= 255, f[p].c.k[R].e[1] /= 255, f[p].c.k[R].e[2] /= 255, f[p].c.k[R].e[3] /= 255);
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
            }(), lt = /* @__PURE__ */ function() {
              var G = [4, 4, 18];
              function w(f) {
                var p, $ = f.length, R, st;
                for (p = $ - 1; p >= 0; p -= 1)
                  if (f[p].ty === "sh")
                    if (f[p].ks.k.i)
                      f[p].ks.k.c = f[p].closed;
                    else
                      for (st = f[p].ks.k.length, R = 0; R < st; R += 1)
                        f[p].ks.k[R].s && (f[p].ks.k[R].s[0].c = f[p].closed), f[p].ks.k[R].e && (f[p].ks.k[R].e[0].c = f[p].closed);
                  else f[p].ty === "gr" && w(f[p].it);
              }
              function M(f) {
                var p, $, R = f.length, st, pt, vt, At;
                for ($ = 0; $ < R; $ += 1) {
                  if (p = f[$], p.hasMask) {
                    var St = p.masksProperties;
                    for (pt = St.length, st = 0; st < pt; st += 1)
                      if (St[st].pt.k.i)
                        St[st].pt.k.c = St[st].cl;
                      else
                        for (At = St[st].pt.k.length, vt = 0; vt < At; vt += 1)
                          St[st].pt.k[vt].s && (St[st].pt.k[vt].s[0].c = St[st].cl), St[st].pt.k[vt].e && (St[st].pt.k[vt].e[0].c = St[st].cl);
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
            function Q(G) {
              G.__complete || (gt(G), D(G), U(G), Y(G), lt(G), N(G.layers, G.assets), S(G.chars, G.assets), G.__complete = !0);
            }
            function yt(G) {
              G.t.a.length === 0 && "m" in G.t.p;
            }
            var nt = {};
            return nt.completeData = Q, nt.checkColors = gt, nt.checkChars = U, nt.checkPathProperties = Y, nt.checkShapes = lt, nt.completeLayers = N, nt;
          }
          if (o.dataManager || (o.dataManager = I()), o.assetLoader || (o.assetLoader = /* @__PURE__ */ function() {
            function N(x) {
              var d = x.getResponseHeader("content-type");
              return d && x.responseType === "json" && d.indexOf("json") !== -1 || x.response && Li(x.response) === "object" ? x.response : x.response && typeof x.response == "string" ? JSON.parse(x.response) : x.responseText ? JSON.parse(x.responseText) : null;
            }
            function S(x, d, _, A) {
              var L, D = new XMLHttpRequest();
              try {
                D.responseType = "json";
              } catch {
              }
              D.onreadystatechange = function() {
                if (D.readyState === 4)
                  if (D.status === 200)
                    L = N(D), _(L);
                  else
                    try {
                      L = N(D), _(L);
                    } catch (U) {
                      A && A(U);
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
          }()), E.data.type === "loadAnimation")
            o.assetLoader.load(E.data.path, E.data.fullPath, function(N) {
              o.dataManager.completeData(N), o.postMessage({
                id: E.data.id,
                payload: N,
                status: "success"
              });
            }, function() {
              o.postMessage({
                id: E.data.id,
                status: "error"
              });
            });
          else if (E.data.type === "complete") {
            var P = E.data.animation;
            o.dataManager.completeData(P), o.postMessage({
              id: E.data.id,
              payload: P,
              status: "success"
            });
          } else E.data.type === "loadData" && o.assetLoader.load(E.data.path, E.data.fullPath, function(N) {
            o.postMessage({
              id: E.data.id,
              payload: N,
              status: "success"
            });
          }, function() {
            o.postMessage({
              id: E.data.id,
              status: "error"
            });
          });
        }), s.onmessage = function(g) {
          var E = g.data, I = E.id, P = e[I];
          e[I] = null, E.status === "success" ? P.onComplete(E.payload) : P.onError && P.onError();
        });
      }
      function u(g, E) {
        t += 1;
        var I = "processId_" + t;
        return e[I] = {
          onComplete: g,
          onError: E
        }, I;
      }
      function T(g, E, I) {
        b();
        var P = u(E, I);
        s.postMessage({
          type: "loadAnimation",
          path: g,
          fullPath: window.location.origin + window.location.pathname,
          id: P
        });
      }
      function C(g, E, I) {
        b();
        var P = u(E, I);
        s.postMessage({
          type: "loadData",
          path: g,
          fullPath: window.location.origin + window.location.pathname,
          id: P
        });
      }
      function V(g, E, I) {
        b();
        var P = u(E, I);
        s.postMessage({
          type: "complete",
          animation: g,
          id: P
        });
      }
      return {
        loadAnimation: T,
        loadData: C,
        completeAnimation: V
      };
    }(), wr = function() {
      var t = function() {
        var S = W("canvas");
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
        var _ = "";
        if (S.e)
          _ = S.p;
        else if (x) {
          var A = S.p;
          A.indexOf("images/") !== -1 && (A = A.split("/")[1]), _ = x + A;
        } else
          _ = d, _ += S.u ? S.u : "", _ += S.p;
        return _;
      }
      function a(S) {
        var x = 0, d = setInterval((function() {
          var _ = S.getBBox();
          (_.width || x > 500) && (this._imageLoaded(), clearInterval(d)), x += 1;
        }).bind(this), 50);
      }
      function o(S) {
        var x = s(S, this.assetsPath, this.path), d = ut("image");
        Ct ? this.testImageLoaded(d) : d.addEventListener("load", this._imageLoaded, !1), d.addEventListener("error", (function() {
          _.img = t, this._imageLoaded();
        }).bind(this), !1), d.setAttributeNS("http://www.w3.org/1999/xlink", "href", x), this._elementHelper.append ? this._elementHelper.append(d) : this._elementHelper.appendChild(d);
        var _ = {
          img: d,
          assetData: S
        };
        return _;
      }
      function c(S) {
        var x = s(S, this.assetsPath, this.path), d = W("img");
        d.crossOrigin = "anonymous", d.addEventListener("load", this._imageLoaded, !1), d.addEventListener("error", (function() {
          _.img = t, this._imageLoaded();
        }).bind(this), !1), d.src = x;
        var _ = {
          img: d,
          assetData: S
        };
        return _;
      }
      function b(S) {
        var x = {
          assetData: S
        }, d = s(S, this.assetsPath, this.path);
        return qe.loadData(d, (function(_) {
          x.img = _, this._footageLoaded();
        }).bind(this), (function() {
          x.img = {}, this._footageLoaded();
        }).bind(this)), x;
      }
      function u(S, x) {
        this.imagesLoadedCb = x;
        var d, _ = S.length;
        for (d = 0; d < _; d += 1)
          S[d].layers || (!S[d].t || S[d].t === "seq" ? (this.totalImages += 1, this.images.push(this._createImageData(S[d]))) : S[d].t === 3 && (this.totalFootages += 1, this.images.push(this.createFootageData(S[d]))));
      }
      function T(S) {
        this.path = S || "";
      }
      function C(S) {
        this.assetsPath = S || "";
      }
      function V(S) {
        for (var x = 0, d = this.images.length; x < d; ) {
          if (this.images[x].assetData === S)
            return this.images[x].img;
          x += 1;
        }
        return null;
      }
      function g() {
        this.imagesLoadedCb = null, this.images.length = 0;
      }
      function E() {
        return this.totalImages === this.loadedAssets;
      }
      function I() {
        return this.totalFootages === this.loadedFootagesCount;
      }
      function P(S, x) {
        S === "svg" ? (this._elementHelper = x, this._createImageData = this.createImageData.bind(this)) : this._createImageData = this.createImgData.bind(this);
      }
      function N() {
        this._imageLoaded = e.bind(this), this._footageLoaded = i.bind(this), this.testImageLoaded = a.bind(this), this.createFootageData = b.bind(this), this.assetsPath = "", this.path = "", this.totalImages = 0, this.totalFootages = 0, this.loadedAssets = 0, this.loadedFootagesCount = 0, this.imagesLoadedCb = null, this.images = [];
      }
      return N.prototype = {
        loadAssets: u,
        setAssetsPath: C,
        setPath: T,
        loadedImages: E,
        loadedFootages: I,
        destroy: g,
        getAsset: V,
        createImgData: c,
        createImageData: o,
        imageLoaded: e,
        footageLoaded: i,
        setCacheType: P
      }, N;
    }();
    function Ft() {
    }
    Ft.prototype = {
      triggerEvent: function(e, i) {
        if (this._cbs[e])
          for (var s = this._cbs[e], a = 0; a < s.length; a += 1)
            s[a](i);
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
          for (var s = 0, a = this._cbs[e].length; s < a; )
            this._cbs[e][s] === i && (this._cbs[e].splice(s, 1), s -= 1, a -= 1), s += 1;
          this._cbs[e].length || (this._cbs[e] = null);
        }
      }
    };
    var tr = /* @__PURE__ */ function() {
      function t(e) {
        for (var i = e.split(`\r
`), s = {}, a, o = 0, c = 0; c < i.length; c += 1)
          a = i[c].split(":"), a.length === 2 && (s[a[0]] = a[1].trim(), o += 1);
        if (o === 0)
          throw new Error();
        return s;
      }
      return function(e) {
        for (var i = [], s = 0; s < e.length; s += 1) {
          var a = e[s], o = {
            time: a.tm,
            duration: a.dr
          };
          try {
            o.payload = JSON.parse(e[s].cm);
          } catch {
            try {
              o.payload = t(e[s].cm);
            } catch {
              o.payload = {
                name: e[s].cm
              };
            }
          }
          i.push(o);
        }
        return i;
      };
    }(), Nt = /* @__PURE__ */ function() {
      function t(e) {
        this.compositions.push(e);
      }
      return function() {
        function e(i) {
          for (var s = 0, a = this.compositions.length; s < a; ) {
            if (this.compositions[s].data && this.compositions[s].data.nm === i)
              return this.compositions[s].prepareFrame && this.compositions[s].data.xt && this.compositions[s].prepareFrame(this.currentFrame), this.compositions[s].compInterface;
            s += 1;
          }
          return null;
        }
        return e.compositions = [], e.currentFrame = 0, e.registerComposition = t, e;
      };
    }(), Ge = {}, ce = function(e, i) {
      Ge[e] = i;
    };
    function Ye(t) {
      return Ge[t];
    }
    function er() {
      if (Ge.canvas)
        return "canvas";
      for (var t in Ge)
        if (Ge[t])
          return t;
      return "";
    }
    function ve(t) {
      "@babel/helpers - typeof";
      return ve = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
        return typeof e;
      } : function(e) {
        return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
      }, ve(t);
    }
    var ht = function() {
      this._cbs = [], this.name = "", this.path = "", this.isLoaded = !1, this.currentFrame = 0, this.currentRawFrame = 0, this.firstFrame = 0, this.totalFrames = 0, this.frameRate = 0, this.frameMult = 0, this.playSpeed = 1, this.playDirection = 1, this.playCount = 0, this.animationData = {}, this.assets = [], this.isPaused = !0, this.autoplay = !1, this.loop = !0, this.renderer = null, this.animationID = Gt(), this.assetsPath = "", this.timeCompleted = 0, this.segmentPos = 0, this.isSubframeEnabled = xt(), this.segments = [], this._idle = !0, this._completedLoop = !1, this.projectInterface = Nt(), this.imagePreloader = new wr(), this.audioController = X(), this.markers = [], this.configAnimation = this.configAnimation.bind(this), this.onSetupError = this.onSetupError.bind(this), this.onSegmentComplete = this.onSegmentComplete.bind(this), this.drawnFrameEvent = new Yt("drawnFrame", 0, 0, 0), this.expressionsPlugin = ti();
    };
    H([Ft], ht), ht.prototype.setParams = function(t) {
      (t.wrapper || t.container) && (this.wrapper = t.wrapper || t.container);
      var e = "svg";
      t.animType ? e = t.animType : t.renderer && (e = t.renderer);
      var i = Ye(e);
      this.renderer = new i(this, t.rendererSettings), this.imagePreloader.setCacheType(e, this.renderer.globalData.defs), this.renderer.setProjectInterface(this.projectInterface), this.animType = e, t.loop === "" || t.loop === null || t.loop === void 0 || t.loop === !0 ? this.loop = !0 : t.loop === !1 ? this.loop = !1 : this.loop = parseInt(t.loop, 10), this.autoplay = "autoplay" in t ? t.autoplay : !0, this.name = t.name ? t.name : "", this.autoloadSegments = Object.prototype.hasOwnProperty.call(t, "autoloadSegments") ? t.autoloadSegments : !0, this.assetsPath = t.assetsPath, this.initialSegment = t.initialSegment, t.audioFactory && this.audioController.setAudioFactory(t.audioFactory), t.animationData ? this.setupAnimation(t.animationData) : t.path && (t.path.lastIndexOf("\\") !== -1 ? this.path = t.path.substr(0, t.path.lastIndexOf("\\") + 1) : this.path = t.path.substr(0, t.path.lastIndexOf("/") + 1), this.fileName = t.path.substr(t.path.lastIndexOf("/") + 1), this.fileName = this.fileName.substr(0, this.fileName.lastIndexOf(".json")), qe.loadAnimation(t.path, this.configAnimation, this.onSetupError));
    }, ht.prototype.onSetupError = function() {
      this.trigger("data_failed");
    }, ht.prototype.setupAnimation = function(t) {
      qe.completeAnimation(t, this.configAnimation);
    }, ht.prototype.setData = function(t, e) {
      e && ve(e) !== "object" && (e = JSON.parse(e));
      var i = {
        wrapper: t,
        animationData: e
      }, s = t.attributes;
      i.path = s.getNamedItem("data-animation-path") ? s.getNamedItem("data-animation-path").value : s.getNamedItem("data-bm-path") ? s.getNamedItem("data-bm-path").value : s.getNamedItem("bm-path") ? s.getNamedItem("bm-path").value : "", i.animType = s.getNamedItem("data-anim-type") ? s.getNamedItem("data-anim-type").value : s.getNamedItem("data-bm-type") ? s.getNamedItem("data-bm-type").value : s.getNamedItem("bm-type") ? s.getNamedItem("bm-type").value : s.getNamedItem("data-bm-renderer") ? s.getNamedItem("data-bm-renderer").value : s.getNamedItem("bm-renderer") ? s.getNamedItem("bm-renderer").value : er() || "canvas";
      var a = s.getNamedItem("data-anim-loop") ? s.getNamedItem("data-anim-loop").value : s.getNamedItem("data-bm-loop") ? s.getNamedItem("data-bm-loop").value : s.getNamedItem("bm-loop") ? s.getNamedItem("bm-loop").value : "";
      a === "false" ? i.loop = !1 : a === "true" ? i.loop = !0 : a !== "" && (i.loop = parseInt(a, 10));
      var o = s.getNamedItem("data-anim-autoplay") ? s.getNamedItem("data-anim-autoplay").value : s.getNamedItem("data-bm-autoplay") ? s.getNamedItem("data-bm-autoplay").value : s.getNamedItem("bm-autoplay") ? s.getNamedItem("bm-autoplay").value : !0;
      i.autoplay = o !== "false", i.name = s.getNamedItem("data-name") ? s.getNamedItem("data-name").value : s.getNamedItem("data-bm-name") ? s.getNamedItem("data-bm-name").value : s.getNamedItem("bm-name") ? s.getNamedItem("bm-name").value : "";
      var c = s.getNamedItem("data-anim-prerender") ? s.getNamedItem("data-anim-prerender").value : s.getNamedItem("data-bm-prerender") ? s.getNamedItem("data-bm-prerender").value : s.getNamedItem("bm-prerender") ? s.getNamedItem("bm-prerender").value : "";
      c === "false" && (i.prerender = !1), i.path ? this.setParams(i) : this.trigger("destroy");
    }, ht.prototype.includeLayers = function(t) {
      t.op > this.animationData.op && (this.animationData.op = t.op, this.totalFrames = Math.floor(t.op - this.animationData.ip));
      var e = this.animationData.layers, i, s = e.length, a = t.layers, o, c = a.length;
      for (o = 0; o < c; o += 1)
        for (i = 0; i < s; ) {
          if (e[i].id === a[o].id) {
            e[i] = a[o];
            break;
          }
          i += 1;
        }
      if ((t.chars || t.fonts) && (this.renderer.globalData.fontManager.addChars(t.chars), this.renderer.globalData.fontManager.addFonts(t.fonts, this.renderer.globalData.defs)), t.assets)
        for (s = t.assets.length, i = 0; i < s; i += 1)
          this.animationData.assets.push(t.assets[i]);
      this.animationData.__complete = !1, qe.completeAnimation(this.animationData, this.onSegmentComplete);
    }, ht.prototype.onSegmentComplete = function(t) {
      this.animationData = t;
      var e = ti();
      e && e.initExpressions(this), this.loadNextSegment();
    }, ht.prototype.loadNextSegment = function() {
      var t = this.animationData.segments;
      if (!t || t.length === 0 || !this.autoloadSegments) {
        this.trigger("data_ready"), this.timeCompleted = this.totalFrames;
        return;
      }
      var e = t.shift();
      this.timeCompleted = e.time * this.frameRate;
      var i = this.path + this.fileName + "_" + this.segmentPos + ".json";
      this.segmentPos += 1, qe.loadData(i, this.includeLayers.bind(this), (function() {
        this.trigger("data_failed");
      }).bind(this));
    }, ht.prototype.loadSegments = function() {
      var t = this.animationData.segments;
      t || (this.timeCompleted = this.totalFrames), this.loadNextSegment();
    }, ht.prototype.imagesLoaded = function() {
      this.trigger("loaded_images"), this.checkLoaded();
    }, ht.prototype.preloadImages = function() {
      this.imagePreloader.setAssetsPath(this.assetsPath), this.imagePreloader.setPath(this.path), this.imagePreloader.loadAssets(this.animationData.assets, this.imagesLoaded.bind(this));
    }, ht.prototype.configAnimation = function(t) {
      if (this.renderer)
        try {
          this.animationData = t, this.initialSegment ? (this.totalFrames = Math.floor(this.initialSegment[1] - this.initialSegment[0]), this.firstFrame = Math.round(this.initialSegment[0])) : (this.totalFrames = Math.floor(this.animationData.op - this.animationData.ip), this.firstFrame = Math.round(this.animationData.ip)), this.renderer.configAnimation(t), t.assets || (t.assets = []), this.assets = this.animationData.assets, this.frameRate = this.animationData.fr, this.frameMult = this.animationData.fr / 1e3, this.renderer.searchExtraCompositions(t.assets), this.markers = tr(t.markers || []), this.trigger("config_ready"), this.preloadImages(), this.loadSegments(), this.updaFrameModifier(), this.waitForFontsLoaded(), this.isPaused && this.audioController.pause();
        } catch (e) {
          this.triggerConfigError(e);
        }
    }, ht.prototype.waitForFontsLoaded = function() {
      this.renderer && (this.renderer.globalData.fontManager.isLoaded ? this.checkLoaded() : setTimeout(this.waitForFontsLoaded.bind(this), 20));
    }, ht.prototype.checkLoaded = function() {
      if (!this.isLoaded && this.renderer.globalData.fontManager.isLoaded && (this.imagePreloader.loadedImages() || this.renderer.rendererType !== "canvas") && this.imagePreloader.loadedFootages()) {
        this.isLoaded = !0;
        var t = ti();
        t && t.initExpressions(this), this.renderer.initItems(), setTimeout((function() {
          this.trigger("DOMLoaded");
        }).bind(this), 0), this.gotoFrame(), this.autoplay && this.play();
      }
    }, ht.prototype.resize = function(t, e) {
      var i = typeof t == "number" ? t : void 0, s = typeof e == "number" ? e : void 0;
      this.renderer.updateContainerSize(i, s);
    }, ht.prototype.setSubframe = function(t) {
      this.isSubframeEnabled = !!t;
    }, ht.prototype.gotoFrame = function() {
      this.currentFrame = this.isSubframeEnabled ? this.currentRawFrame : ~~this.currentRawFrame, this.timeCompleted !== this.totalFrames && this.currentFrame > this.timeCompleted && (this.currentFrame = this.timeCompleted), this.trigger("enterFrame"), this.renderFrame(), this.trigger("drawnFrame");
    }, ht.prototype.renderFrame = function() {
      if (!(this.isLoaded === !1 || !this.renderer))
        try {
          this.expressionsPlugin && this.expressionsPlugin.resetFrame(), this.renderer.renderFrame(this.currentFrame + this.firstFrame);
        } catch (t) {
          this.triggerRenderFrameError(t);
        }
    }, ht.prototype.play = function(t) {
      t && this.name !== t || this.isPaused === !0 && (this.isPaused = !1, this.trigger("_play"), this.audioController.resume(), this._idle && (this._idle = !1, this.trigger("_active")));
    }, ht.prototype.pause = function(t) {
      t && this.name !== t || this.isPaused === !1 && (this.isPaused = !0, this.trigger("_pause"), this._idle = !0, this.trigger("_idle"), this.audioController.pause());
    }, ht.prototype.togglePause = function(t) {
      t && this.name !== t || (this.isPaused === !0 ? this.play() : this.pause());
    }, ht.prototype.stop = function(t) {
      t && this.name !== t || (this.pause(), this.playCount = 0, this._completedLoop = !1, this.setCurrentRawFrameValue(0));
    }, ht.prototype.getMarkerData = function(t) {
      for (var e, i = 0; i < this.markers.length; i += 1)
        if (e = this.markers[i], e.payload && e.payload.name === t)
          return e;
      return null;
    }, ht.prototype.goToAndStop = function(t, e, i) {
      if (!(i && this.name !== i)) {
        var s = Number(t);
        if (isNaN(s)) {
          var a = this.getMarkerData(t);
          a && this.goToAndStop(a.time, !0);
        } else e ? this.setCurrentRawFrameValue(t) : this.setCurrentRawFrameValue(t * this.frameModifier);
        this.pause();
      }
    }, ht.prototype.goToAndPlay = function(t, e, i) {
      if (!(i && this.name !== i)) {
        var s = Number(t);
        if (isNaN(s)) {
          var a = this.getMarkerData(t);
          a && (a.duration ? this.playSegments([a.time, a.time + a.duration], !0) : this.goToAndStop(a.time, !0));
        } else
          this.goToAndStop(s, e, i);
        this.play();
      }
    }, ht.prototype.advanceTime = function(t) {
      if (!(this.isPaused === !0 || this.isLoaded === !1)) {
        var e = this.currentRawFrame + t * this.frameModifier, i = !1;
        e >= this.totalFrames - 1 && this.frameModifier > 0 ? !this.loop || this.playCount === this.loop ? this.checkSegments(e > this.totalFrames ? e % this.totalFrames : 0) || (i = !0, e = this.totalFrames - 1) : e >= this.totalFrames ? (this.playCount += 1, this.checkSegments(e % this.totalFrames) || (this.setCurrentRawFrameValue(e % this.totalFrames), this._completedLoop = !0, this.trigger("loopComplete"))) : this.setCurrentRawFrameValue(e) : e < 0 ? this.checkSegments(e % this.totalFrames) || (this.loop && !(this.playCount-- <= 0 && this.loop !== !0) ? (this.setCurrentRawFrameValue(this.totalFrames + e % this.totalFrames), this._completedLoop ? this.trigger("loopComplete") : this._completedLoop = !0) : (i = !0, e = 0)) : this.setCurrentRawFrameValue(e), i && (this.setCurrentRawFrameValue(e), this.pause(), this.trigger("complete"));
      }
    }, ht.prototype.adjustSegment = function(t, e) {
      this.playCount = 0, t[1] < t[0] ? (this.frameModifier > 0 && (this.playSpeed < 0 ? this.setSpeed(-this.playSpeed) : this.setDirection(-1)), this.totalFrames = t[0] - t[1], this.timeCompleted = this.totalFrames, this.firstFrame = t[1], this.setCurrentRawFrameValue(this.totalFrames - 1e-3 - e)) : t[1] > t[0] && (this.frameModifier < 0 && (this.playSpeed < 0 ? this.setSpeed(-this.playSpeed) : this.setDirection(1)), this.totalFrames = t[1] - t[0], this.timeCompleted = this.totalFrames, this.firstFrame = t[0], this.setCurrentRawFrameValue(1e-3 + e)), this.trigger("segmentStart");
    }, ht.prototype.setSegment = function(t, e) {
      var i = -1;
      this.isPaused && (this.currentRawFrame + this.firstFrame < t ? i = t : this.currentRawFrame + this.firstFrame > e && (i = e - t)), this.firstFrame = t, this.totalFrames = e - t, this.timeCompleted = this.totalFrames, i !== -1 && this.goToAndStop(i, !0);
    }, ht.prototype.playSegments = function(t, e) {
      if (e && (this.segments.length = 0), ve(t[0]) === "object") {
        var i, s = t.length;
        for (i = 0; i < s; i += 1)
          this.segments.push(t[i]);
      } else
        this.segments.push(t);
      this.segments.length && e && this.adjustSegment(this.segments.shift(), 0), this.isPaused && this.play();
    }, ht.prototype.resetSegments = function(t) {
      this.segments.length = 0, this.segments.push([this.animationData.ip, this.animationData.op]), t && this.checkSegments(0);
    }, ht.prototype.checkSegments = function(t) {
      return this.segments.length ? (this.adjustSegment(this.segments.shift(), t), !0) : !1;
    }, ht.prototype.destroy = function(t) {
      t && this.name !== t || !this.renderer || (this.renderer.destroy(), this.imagePreloader.destroy(), this.trigger("destroy"), this._cbs = null, this.onEnterFrame = null, this.onLoopComplete = null, this.onComplete = null, this.onSegmentStart = null, this.onDestroy = null, this.renderer = null, this.expressionsPlugin = null, this.imagePreloader = null, this.projectInterface = null);
    }, ht.prototype.setCurrentRawFrameValue = function(t) {
      this.currentRawFrame = t, this.gotoFrame();
    }, ht.prototype.setSpeed = function(t) {
      this.playSpeed = t, this.updaFrameModifier();
    }, ht.prototype.setDirection = function(t) {
      this.playDirection = t < 0 ? -1 : 1, this.updaFrameModifier();
    }, ht.prototype.setLoop = function(t) {
      this.loop = t;
    }, ht.prototype.setVolume = function(t, e) {
      e && this.name !== e || this.audioController.setVolume(t);
    }, ht.prototype.getVolume = function() {
      return this.audioController.getVolume();
    }, ht.prototype.mute = function(t) {
      t && this.name !== t || this.audioController.mute();
    }, ht.prototype.unmute = function(t) {
      t && this.name !== t || this.audioController.unmute();
    }, ht.prototype.updaFrameModifier = function() {
      this.frameModifier = this.frameMult * this.playSpeed * this.playDirection, this.audioController.setRate(this.playSpeed * this.playDirection);
    }, ht.prototype.getPath = function() {
      return this.path;
    }, ht.prototype.getAssetsPath = function(t) {
      var e = "";
      if (t.e)
        e = t.p;
      else if (this.assetsPath) {
        var i = t.p;
        i.indexOf("images/") !== -1 && (i = i.split("/")[1]), e = this.assetsPath + i;
      } else
        e = this.path, e += t.u ? t.u : "", e += t.p;
      return e;
    }, ht.prototype.getAssetData = function(t) {
      for (var e = 0, i = this.assets.length; e < i; ) {
        if (t === this.assets[e].id)
          return this.assets[e];
        e += 1;
      }
      return null;
    }, ht.prototype.hide = function() {
      this.renderer.hide();
    }, ht.prototype.show = function() {
      this.renderer.show();
    }, ht.prototype.getDuration = function(t) {
      return t ? this.totalFrames : this.totalFrames / this.frameRate;
    }, ht.prototype.updateDocumentData = function(t, e, i) {
      try {
        var s = this.renderer.getElementByPath(t);
        s.updateDocumentData(e, i);
      } catch {
      }
    }, ht.prototype.trigger = function(t) {
      if (this._cbs && this._cbs[t])
        switch (t) {
          case "enterFrame":
            this.triggerEvent(t, new Yt(t, this.currentFrame, this.totalFrames, this.frameModifier));
            break;
          case "drawnFrame":
            this.drawnFrameEvent.currentTime = this.currentFrame, this.drawnFrameEvent.totalTime = this.totalFrames, this.drawnFrameEvent.direction = this.frameModifier, this.triggerEvent(t, this.drawnFrameEvent);
            break;
          case "loopComplete":
            this.triggerEvent(t, new Qe(t, this.loop, this.playCount, this.frameMult));
            break;
          case "complete":
            this.triggerEvent(t, new ci(t, this.frameMult));
            break;
          case "segmentStart":
            this.triggerEvent(t, new Ve(t, this.firstFrame, this.totalFrames));
            break;
          case "destroy":
            this.triggerEvent(t, new Je(t, this));
            break;
          default:
            this.triggerEvent(t);
        }
      t === "enterFrame" && this.onEnterFrame && this.onEnterFrame.call(this, new Yt(t, this.currentFrame, this.totalFrames, this.frameMult)), t === "loopComplete" && this.onLoopComplete && this.onLoopComplete.call(this, new Qe(t, this.loop, this.playCount, this.frameMult)), t === "complete" && this.onComplete && this.onComplete.call(this, new ci(t, this.frameMult)), t === "segmentStart" && this.onSegmentStart && this.onSegmentStart.call(this, new Ve(t, this.firstFrame, this.totalFrames)), t === "destroy" && this.onDestroy && this.onDestroy.call(this, new Je(t, this));
    }, ht.prototype.triggerRenderFrameError = function(t) {
      var e = new xe(t, this.currentFrame);
      this.triggerEvent("error", e), this.onError && this.onError.call(this, e);
    }, ht.prototype.triggerConfigError = function(t) {
      var e = new Ei(t, this.currentFrame);
      this.triggerEvent("error", e), this.onError && this.onError.call(this, e);
    };
    var Wt = function() {
      var t = {}, e = [], i = 0, s = 0, a = 0, o = !0, c = !1;
      function b(w) {
        for (var M = 0, f = w.target; M < s; )
          e[M].animation === f && (e.splice(M, 1), M -= 1, s -= 1, f.isPaused || V()), M += 1;
      }
      function u(w, M) {
        if (!w)
          return null;
        for (var f = 0; f < s; ) {
          if (e[f].elem === w && e[f].elem !== null)
            return e[f].animation;
          f += 1;
        }
        var p = new ht();
        return g(p, w), p.setData(w, M), p;
      }
      function T() {
        var w, M = e.length, f = [];
        for (w = 0; w < M; w += 1)
          f.push(e[w].animation);
        return f;
      }
      function C() {
        a += 1, gt();
      }
      function V() {
        a -= 1;
      }
      function g(w, M) {
        w.addEventListener("destroy", b), w.addEventListener("_active", C), w.addEventListener("_idle", V), e.push({
          elem: M,
          animation: w
        }), s += 1;
      }
      function E(w) {
        var M = new ht();
        return g(M, null), M.setParams(w), M;
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
        i = w, a && !c ? window.requestAnimationFrame(S) : o = !0;
      }
      function x(w) {
        i = w, window.requestAnimationFrame(S);
      }
      function d(w) {
        var M;
        for (M = 0; M < s; M += 1)
          e[M].animation.pause(w);
      }
      function _(w, M, f) {
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
      function U(w, M, f) {
        var p = [].concat([].slice.call(document.getElementsByClassName("lottie")), [].slice.call(document.getElementsByClassName("bodymovin"))), $, R = p.length;
        for ($ = 0; $ < R; $ += 1)
          f && p[$].setAttribute("data-bm-type", f), u(p[$], w);
        if (M && R === 0) {
          f || (f = "svg");
          var st = document.getElementsByTagName("body")[0];
          st.innerText = "";
          var pt = W("div");
          pt.style.width = "100%", pt.style.height = "100%", pt.setAttribute("data-bm-type", f), st.appendChild(pt), u(pt, w);
        }
      }
      function Y() {
        var w;
        for (w = 0; w < s; w += 1)
          e[w].animation.resize();
      }
      function gt() {
        !c && a && o && (window.requestAnimationFrame(x), o = !1);
      }
      function lt() {
        c = !0;
      }
      function Q() {
        c = !1, gt();
      }
      function yt(w, M) {
        var f;
        for (f = 0; f < s; f += 1)
          e[f].animation.setVolume(w, M);
      }
      function nt(w) {
        var M;
        for (M = 0; M < s; M += 1)
          e[M].animation.mute(w);
      }
      function G(w) {
        var M;
        for (M = 0; M < s; M += 1)
          e[M].animation.unmute(w);
      }
      return t.registerAnimation = u, t.loadAnimation = E, t.setSpeed = I, t.setDirection = P, t.play = N, t.pause = d, t.stop = A, t.togglePause = L, t.searchAnimations = U, t.resize = Y, t.goToAndStop = _, t.destroy = D, t.freeze = lt, t.unfreeze = Q, t.setVolume = yt, t.mute = nt, t.unmute = G, t.getRegisteredAnimations = T, t;
    }(), ei = function() {
      var t = {};
      t.getBezierEasing = i;
      var e = {};
      function i(x, d, _, A, L) {
        var D = L || ("bez_" + x + "_" + d + "_" + _ + "_" + A).replace(/\./g, "p");
        if (e[D])
          return e[D];
        var U = new S([x, d, _, A]);
        return e[D] = U, U;
      }
      var s = 4, a = 1e-3, o = 1e-7, c = 10, b = 11, u = 1 / (b - 1), T = typeof Float32Array == "function";
      function C(x, d) {
        return 1 - 3 * d + 3 * x;
      }
      function V(x, d) {
        return 3 * d - 6 * x;
      }
      function g(x) {
        return 3 * x;
      }
      function E(x, d, _) {
        return ((C(d, _) * x + V(d, _)) * x + g(d)) * x;
      }
      function I(x, d, _) {
        return 3 * C(d, _) * x * x + 2 * V(d, _) * x + g(d);
      }
      function P(x, d, _, A, L) {
        var D, U, Y = 0;
        do
          U = d + (_ - d) / 2, D = E(U, A, L) - x, D > 0 ? _ = U : d = U;
        while (Math.abs(D) > o && ++Y < c);
        return U;
      }
      function N(x, d, _, A) {
        for (var L = 0; L < s; ++L) {
          var D = I(d, _, A);
          if (D === 0) return d;
          var U = E(d, _, A) - x;
          d -= U / D;
        }
        return d;
      }
      function S(x) {
        this._p = x, this._mSampleValues = T ? new Float32Array(b) : new Array(b), this._precomputed = !1, this.get = this.get.bind(this);
      }
      return S.prototype = {
        get: function(d) {
          var _ = this._p[0], A = this._p[1], L = this._p[2], D = this._p[3];
          return this._precomputed || this._precompute(), _ === A && L === D ? d : d === 0 ? 0 : d === 1 ? 1 : E(this._getTForX(d), A, D);
        },
        // Private part
        _precompute: function() {
          var d = this._p[0], _ = this._p[1], A = this._p[2], L = this._p[3];
          this._precomputed = !0, (d !== _ || A !== L) && this._calcSampleValues();
        },
        _calcSampleValues: function() {
          for (var d = this._p[0], _ = this._p[2], A = 0; A < b; ++A)
            this._mSampleValues[A] = E(A * u, d, _);
        },
        /**
             * getTForX chose the fastest heuristic to determine the percentage value precisely from a given X projection.
             */
        _getTForX: function(d) {
          for (var _ = this._p[0], A = this._p[2], L = this._mSampleValues, D = 0, U = 1, Y = b - 1; U !== Y && L[U] <= d; ++U)
            D += u;
          --U;
          var gt = (d - L[U]) / (L[U + 1] - L[U]), lt = D + gt * u, Q = I(lt, _, A);
          return Q >= a ? N(d, lt, _, A) : Q === 0 ? lt : P(d, D, D + u, _, A);
        }
      }, t;
    }(), Fi = /* @__PURE__ */ function() {
      function t(e) {
        return e.concat(et(e.length));
      }
      return {
        double: t
      };
    }(), ye = /* @__PURE__ */ function() {
      return function(t, e, i) {
        var s = 0, a = t, o = et(a), c = {
          newElement: b,
          release: u
        };
        function b() {
          var T;
          return s ? (s -= 1, T = o[s]) : T = e(), T;
        }
        function u(T) {
          s === a && (o = Fi.double(o), a *= 2), i && i(T), o[s] = T, s += 1;
        }
        return c;
      };
    }(), K = function() {
      function t() {
        return {
          addedLength: 0,
          percents: rt("float32", Ii()),
          lengths: rt("float32", Ii())
        };
      }
      return ye(8, t);
    }(), mt = function() {
      function t() {
        return {
          lengths: [],
          totalLength: 0
        };
      }
      function e(i) {
        var s, a = i.lengths.length;
        for (s = 0; s < a; s += 1)
          K.release(i.lengths[s]);
        i.lengths.length = 0;
      }
      return ye(8, t, e);
    }();
    function It() {
      var t = Math;
      function e(g, E, I, P, N, S) {
        var x = g * P + E * N + I * S - N * P - S * g - I * E;
        return x > -1e-3 && x < 1e-3;
      }
      function i(g, E, I, P, N, S, x, d, _) {
        if (I === 0 && S === 0 && _ === 0)
          return e(g, E, P, N, x, d);
        var A = t.sqrt(t.pow(P - g, 2) + t.pow(N - E, 2) + t.pow(S - I, 2)), L = t.sqrt(t.pow(x - g, 2) + t.pow(d - E, 2) + t.pow(_ - I, 2)), D = t.sqrt(t.pow(x - P, 2) + t.pow(d - N, 2) + t.pow(_ - S, 2)), U;
        return A > L ? A > D ? U = A - L - D : U = D - L - A : D > L ? U = D - L - A : U = L - A - D, U > -1e-4 && U < 1e-4;
      }
      var s = /* @__PURE__ */ function() {
        return function(g, E, I, P) {
          var N = Ii(), S, x, d, _, A, L = 0, D, U = [], Y = [], gt = K.newElement();
          for (d = I.length, S = 0; S < N; S += 1) {
            for (A = S / (N - 1), D = 0, x = 0; x < d; x += 1)
              _ = Mt(1 - A, 3) * g[x] + 3 * Mt(1 - A, 2) * A * I[x] + 3 * (1 - A) * Mt(A, 2) * P[x] + Mt(A, 3) * E[x], U[x] = _, Y[x] !== null && (D += Mt(U[x] - Y[x], 2)), Y[x] = U[x];
            D && (D = Bt(D), L += D), gt.percents[S] = A, gt.lengths[S] = L;
          }
          return gt.addedLength = L, gt;
        };
      }();
      function a(g) {
        var E = mt.newElement(), I = g.c, P = g.v, N = g.o, S = g.i, x, d = g._length, _ = E.lengths, A = 0;
        for (x = 0; x < d - 1; x += 1)
          _[x] = s(P[x], P[x + 1], N[x], S[x + 1]), A += _[x].addedLength;
        return I && d && (_[x] = s(P[x], P[0], N[x], S[0]), A += _[x].addedLength), E.totalLength = A, E;
      }
      function o(g) {
        this.segmentLength = 0, this.points = new Array(g);
      }
      function c(g, E) {
        this.partialLength = g, this.point = E;
      }
      var b = /* @__PURE__ */ function() {
        var g = {};
        return function(E, I, P, N) {
          var S = (E[0] + "_" + E[1] + "_" + I[0] + "_" + I[1] + "_" + P[0] + "_" + P[1] + "_" + N[0] + "_" + N[1]).replace(/\./g, "p");
          if (!g[S]) {
            var x = Ii(), d, _, A, L, D, U = 0, Y, gt, lt = null;
            E.length === 2 && (E[0] !== I[0] || E[1] !== I[1]) && e(E[0], E[1], I[0], I[1], E[0] + P[0], E[1] + P[1]) && e(E[0], E[1], I[0], I[1], I[0] + N[0], I[1] + N[1]) && (x = 2);
            var Q = new o(x);
            for (A = P.length, d = 0; d < x; d += 1) {
              for (gt = et(A), D = d / (x - 1), Y = 0, _ = 0; _ < A; _ += 1)
                L = Mt(1 - D, 3) * E[_] + 3 * Mt(1 - D, 2) * D * (E[_] + P[_]) + 3 * (1 - D) * Mt(D, 2) * (I[_] + N[_]) + Mt(D, 3) * I[_], gt[_] = L, lt !== null && (Y += Mt(gt[_] - lt[_], 2));
              Y = Bt(Y), U += Y, Q.points[d] = new c(Y, gt), lt = gt;
            }
            Q.segmentLength = U, g[S] = Q;
          }
          return g[S];
        };
      }();
      function u(g, E) {
        var I = E.percents, P = E.lengths, N = I.length, S = Ot((N - 1) * g), x = g * E.addedLength, d = 0;
        if (S === N - 1 || S === 0 || x === P[S])
          return I[S];
        for (var _ = P[S] > x ? -1 : 1, A = !0; A; )
          if (P[S] <= x && P[S + 1] > x ? (d = (x - P[S]) / (P[S + 1] - P[S]), A = !1) : S += _, S < 0 || S >= N - 1) {
            if (S === N - 1)
              return I[S];
            A = !1;
          }
        return I[S] + (I[S + 1] - I[S]) * d;
      }
      function T(g, E, I, P, N, S) {
        var x = u(N, S), d = 1 - x, _ = t.round((d * d * d * g[0] + (x * d * d + d * x * d + d * d * x) * I[0] + (x * x * d + d * x * x + x * d * x) * P[0] + x * x * x * E[0]) * 1e3) / 1e3, A = t.round((d * d * d * g[1] + (x * d * d + d * x * d + d * d * x) * I[1] + (x * x * d + d * x * x + x * d * x) * P[1] + x * x * x * E[1]) * 1e3) / 1e3;
        return [_, A];
      }
      var C = rt("float32", 8);
      function V(g, E, I, P, N, S, x) {
        N < 0 ? N = 0 : N > 1 && (N = 1);
        var d = u(N, x);
        S = S > 1 ? 1 : S;
        var _ = u(S, x), A, L = g.length, D = 1 - d, U = 1 - _, Y = D * D * D, gt = d * D * D * 3, lt = d * d * D * 3, Q = d * d * d, yt = D * D * U, nt = d * D * U + D * d * U + D * D * _, G = d * d * U + D * d * _ + d * D * _, w = d * d * _, M = D * U * U, f = d * U * U + D * _ * U + D * U * _, p = d * _ * U + D * _ * _ + d * U * _, $ = d * _ * _, R = U * U * U, st = _ * U * U + U * _ * U + U * U * _, pt = _ * _ * U + U * _ * _ + _ * U * _, vt = _ * _ * _;
        for (A = 0; A < L; A += 1)
          C[A * 4] = t.round((Y * g[A] + gt * I[A] + lt * P[A] + Q * E[A]) * 1e3) / 1e3, C[A * 4 + 1] = t.round((yt * g[A] + nt * I[A] + G * P[A] + w * E[A]) * 1e3) / 1e3, C[A * 4 + 2] = t.round((M * g[A] + f * I[A] + p * P[A] + $ * E[A]) * 1e3) / 1e3, C[A * 4 + 3] = t.round((R * g[A] + st * I[A] + pt * P[A] + vt * E[A]) * 1e3) / 1e3;
        return C;
      }
      return {
        getSegmentsLength: a,
        getNewSegment: V,
        getPointInSegment: T,
        buildBezierData: b,
        pointOnLine2D: e,
        pointOnLine3D: i
      };
    }
    var bt = It(), Ht = m, ue = Math.abs;
    function Fe(t, e) {
      var i = this.offsetTime, s;
      this.propType === "multidimensional" && (s = rt("float32", this.pv.length));
      for (var a = e.lastIndex, o = a, c = this.keyframes.length - 1, b = !0, u, T, C; b; ) {
        if (u = this.keyframes[o], T = this.keyframes[o + 1], o === c - 1 && t >= T.t - i) {
          u.h && (u = T), a = 0;
          break;
        }
        if (T.t - i > t) {
          a = o;
          break;
        }
        o < c - 1 ? o += 1 : (a = 0, b = !1);
      }
      C = this.keyframesMetadata[o] || {};
      var V, g, E, I, P, N, S = T.t - i, x = u.t - i, d;
      if (u.to) {
        C.bezierData || (C.bezierData = bt.buildBezierData(u.s, T.s || u.e, u.to, u.ti));
        var _ = C.bezierData;
        if (t >= S || t < x) {
          var A = t >= S ? _.points.length - 1 : 0;
          for (g = _.points[A].point.length, V = 0; V < g; V += 1)
            s[V] = _.points[A].point[V];
        } else {
          C.__fnct ? N = C.__fnct : (N = ei.getBezierEasing(u.o.x, u.o.y, u.i.x, u.i.y, u.n).get, C.__fnct = N), E = N((t - x) / (S - x));
          var L = _.segmentLength * E, D, U = e.lastFrame < t && e._lastKeyframeIndex === o ? e._lastAddedLength : 0;
          for (P = e.lastFrame < t && e._lastKeyframeIndex === o ? e._lastPoint : 0, b = !0, I = _.points.length; b; ) {
            if (U += _.points[P].partialLength, L === 0 || E === 0 || P === _.points.length - 1) {
              for (g = _.points[P].point.length, V = 0; V < g; V += 1)
                s[V] = _.points[P].point[V];
              break;
            } else if (L >= U && L < U + _.points[P + 1].partialLength) {
              for (D = (L - U) / _.points[P + 1].partialLength, g = _.points[P].point.length, V = 0; V < g; V += 1)
                s[V] = _.points[P].point[V] + (_.points[P + 1].point[V] - _.points[P].point[V]) * D;
              break;
            }
            P < I - 1 ? P += 1 : b = !1;
          }
          e._lastPoint = P, e._lastAddedLength = U - _.points[P].partialLength, e._lastKeyframeIndex = o;
        }
      } else {
        var Y, gt, lt, Q, yt;
        if (c = u.s.length, d = T.s || u.e, this.sh && u.h !== 1)
          if (t >= S)
            s[0] = d[0], s[1] = d[1], s[2] = d[2];
          else if (t <= x)
            s[0] = u.s[0], s[1] = u.s[1], s[2] = u.s[2];
          else {
            var nt = $e(u.s), G = $e(d), w = (t - x) / (S - x);
            se(s, Ut(nt, G, w));
          }
        else
          for (o = 0; o < c; o += 1)
            u.h !== 1 && (t >= S ? E = 1 : t < x ? E = 0 : (u.o.x.constructor === Array ? (C.__fnct || (C.__fnct = []), C.__fnct[o] ? N = C.__fnct[o] : (Y = u.o.x[o] === void 0 ? u.o.x[0] : u.o.x[o], gt = u.o.y[o] === void 0 ? u.o.y[0] : u.o.y[o], lt = u.i.x[o] === void 0 ? u.i.x[0] : u.i.x[o], Q = u.i.y[o] === void 0 ? u.i.y[0] : u.i.y[o], N = ei.getBezierEasing(Y, gt, lt, Q).get, C.__fnct[o] = N)) : C.__fnct ? N = C.__fnct : (Y = u.o.x, gt = u.o.y, lt = u.i.x, Q = u.i.y, N = ei.getBezierEasing(Y, gt, lt, Q).get, u.keyframeMetadata = N), E = N((t - x) / (S - x)))), d = T.s || u.e, yt = u.h === 1 ? u.s[o] : u.s[o] + (d[o] - u.s[o]) * E, this.propType === "multidimensional" ? s[o] = yt : s = yt;
      }
      return e.lastIndex = a, s;
    }
    function Ut(t, e, i) {
      var s = [], a = t[0], o = t[1], c = t[2], b = t[3], u = e[0], T = e[1], C = e[2], V = e[3], g, E, I, P, N;
      return E = a * u + o * T + c * C + b * V, E < 0 && (E = -E, u = -u, T = -T, C = -C, V = -V), 1 - E > 1e-6 ? (g = Math.acos(E), I = Math.sin(g), P = Math.sin((1 - i) * g) / I, N = Math.sin(i * g) / I) : (P = 1 - i, N = i), s[0] = P * a + N * u, s[1] = P * o + N * T, s[2] = P * c + N * C, s[3] = P * b + N * V, s;
    }
    function se(t, e) {
      var i = e[0], s = e[1], a = e[2], o = e[3], c = Math.atan2(2 * s * o - 2 * i * a, 1 - 2 * s * s - 2 * a * a), b = Math.asin(2 * i * s + 2 * a * o), u = Math.atan2(2 * i * o - 2 * s * a, 1 - 2 * i * i - 2 * a * a);
      t[0] = c / Et, t[1] = b / Et, t[2] = u / Et;
    }
    function $e(t) {
      var e = t[0] * Et, i = t[1] * Et, s = t[2] * Et, a = Math.cos(e / 2), o = Math.cos(i / 2), c = Math.cos(s / 2), b = Math.sin(e / 2), u = Math.sin(i / 2), T = Math.sin(s / 2), C = a * o * c - b * u * T, V = b * u * c + a * o * T, g = b * o * c + a * u * T, E = a * u * c - b * o * T;
      return [V, g, E, C];
    }
    function pi() {
      var t = this.comp.renderedFrame - this.offsetTime, e = this.keyframes[0].t - this.offsetTime, i = this.keyframes[this.keyframes.length - 1].t - this.offsetTime;
      if (!(t === this._caching.lastFrame || this._caching.lastFrame !== Ht && (this._caching.lastFrame >= i && t >= i || this._caching.lastFrame < e && t < e))) {
        this._caching.lastFrame >= t && (this._caching._lastKeyframeIndex = -1, this._caching.lastIndex = 0);
        var s = this.interpolateValue(t, this._caching);
        this.pv = s;
      }
      return this._caching.lastFrame = t, this.pv;
    }
    function di(t) {
      var e;
      if (this.propType === "unidimensional")
        e = t * this.mult, ue(this.v - e) > 1e-5 && (this.v = e, this._mdf = !0);
      else
        for (var i = 0, s = this.v.length; i < s; )
          e = t[i] * this.mult, ue(this.v[i] - e) > 1e-5 && (this.v[i] = e, this._mdf = !0), i += 1;
    }
    function Ri() {
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
    function Oi(t) {
      this.effectsSequence.push(t), this.container.addDynamicProperty(this);
    }
    function Ni(t, e, i, s) {
      this.propType = "unidimensional", this.mult = i || 1, this.data = e, this.v = i ? e.k * i : e.k, this.pv = e.k, this._mdf = !1, this.elem = t, this.container = s, this.comp = t.comp, this.k = !1, this.kf = !1, this.vel = 0, this.effectsSequence = [], this._isFirstFrame = !0, this.getValue = Ri, this.setVValue = di, this.addEffect = Oi;
    }
    function zi(t, e, i, s) {
      this.propType = "multidimensional", this.mult = i || 1, this.data = e, this._mdf = !1, this.elem = t, this.container = s, this.comp = t.comp, this.k = !1, this.kf = !1, this.frameId = -1;
      var a, o = e.k.length;
      for (this.v = rt("float32", o), this.pv = rt("float32", o), this.vel = rt("float32", o), a = 0; a < o; a += 1)
        this.v[a] = e.k[a] * this.mult, this.pv[a] = e.k[a];
      this._isFirstFrame = !0, this.effectsSequence = [], this.getValue = Ri, this.setVValue = di, this.addEffect = Oi;
    }
    function as(t, e, i, s) {
      this.propType = "unidimensional", this.keyframes = e.k, this.keyframesMetadata = [], this.offsetTime = t.data.st, this.frameId = -1, this._caching = {
        lastFrame: Ht,
        lastIndex: 0,
        value: 0,
        _lastKeyframeIndex: -1
      }, this.k = !0, this.kf = !0, this.data = e, this.mult = i || 1, this.elem = t, this.container = s, this.comp = t.comp, this.v = Ht, this.pv = Ht, this._isFirstFrame = !0, this.getValue = Ri, this.setVValue = di, this.interpolateValue = Fe, this.effectsSequence = [pi.bind(this)], this.addEffect = Oi;
    }
    function ls(t, e, i, s) {
      this.propType = "multidimensional";
      var a, o = e.k.length, c, b, u, T;
      for (a = 0; a < o - 1; a += 1)
        e.k[a].to && e.k[a].s && e.k[a + 1] && e.k[a + 1].s && (c = e.k[a].s, b = e.k[a + 1].s, u = e.k[a].to, T = e.k[a].ti, (c.length === 2 && !(c[0] === b[0] && c[1] === b[1]) && bt.pointOnLine2D(c[0], c[1], b[0], b[1], c[0] + u[0], c[1] + u[1]) && bt.pointOnLine2D(c[0], c[1], b[0], b[1], b[0] + T[0], b[1] + T[1]) || c.length === 3 && !(c[0] === b[0] && c[1] === b[1] && c[2] === b[2]) && bt.pointOnLine3D(c[0], c[1], c[2], b[0], b[1], b[2], c[0] + u[0], c[1] + u[1], c[2] + u[2]) && bt.pointOnLine3D(c[0], c[1], c[2], b[0], b[1], b[2], b[0] + T[0], b[1] + T[1], b[2] + T[2])) && (e.k[a].to = null, e.k[a].ti = null), c[0] === b[0] && c[1] === b[1] && u[0] === 0 && u[1] === 0 && T[0] === 0 && T[1] === 0 && (c.length === 2 || c[2] === b[2] && u[2] === 0 && T[2] === 0) && (e.k[a].to = null, e.k[a].ti = null));
      this.effectsSequence = [pi.bind(this)], this.data = e, this.keyframes = e.k, this.keyframesMetadata = [], this.offsetTime = t.data.st, this.k = !0, this.kf = !0, this._isFirstFrame = !0, this.mult = i || 1, this.elem = t, this.container = s, this.comp = t.comp, this.getValue = Ri, this.setVValue = di, this.interpolateValue = Fe, this.frameId = -1;
      var C = e.k[0].s.length;
      for (this.v = rt("float32", C), this.pv = rt("float32", C), a = 0; a < C; a += 1)
        this.v[a] = Ht, this.pv[a] = Ht;
      this._caching = {
        lastFrame: Ht,
        lastIndex: 0,
        value: rt("float32", C)
      }, this.addEffect = Oi;
    }
    var J = /* @__PURE__ */ function() {
      function t(i, s, a, o, c) {
        s.sid && (s = i.globalData.slotManager.getProp(s));
        var b;
        if (!s.k.length)
          b = new Ni(i, s, o, c);
        else if (typeof s.k[0] == "number")
          b = new zi(i, s, o, c);
        else
          switch (a) {
            case 0:
              b = new as(i, s, o, c);
              break;
            case 1:
              b = new ls(i, s, o, c);
              break;
          }
        return b.effectsSequence.length && c.addDynamicProperty(b), b;
      }
      var e = {
        getProp: t
      };
      return e;
    }();
    function Kt() {
    }
    Kt.prototype = {
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
    var ii = function() {
      function t() {
        return rt("float32", 2);
      }
      return ye(8, t);
    }();
    function Ae() {
      this.c = !1, this._length = 0, this._maxLength = 8, this.v = et(this._maxLength), this.o = et(this._maxLength), this.i = et(this._maxLength);
    }
    Ae.prototype.setPathData = function(t, e) {
      this.c = t, this.setLength(e);
      for (var i = 0; i < e; )
        this.v[i] = ii.newElement(), this.o[i] = ii.newElement(), this.i[i] = ii.newElement(), i += 1;
    }, Ae.prototype.setLength = function(t) {
      for (; this._maxLength < t; )
        this.doubleArrayLength();
      this._length = t;
    }, Ae.prototype.doubleArrayLength = function() {
      this.v = this.v.concat(et(this._maxLength)), this.i = this.i.concat(et(this._maxLength)), this.o = this.o.concat(et(this._maxLength)), this._maxLength *= 2;
    }, Ae.prototype.setXYAt = function(t, e, i, s, a) {
      var o;
      switch (this._length = Math.max(this._length, s + 1), this._length >= this._maxLength && this.doubleArrayLength(), i) {
        case "v":
          o = this.v;
          break;
        case "i":
          o = this.i;
          break;
        case "o":
          o = this.o;
          break;
        default:
          o = [];
          break;
      }
      (!o[s] || o[s] && !a) && (o[s] = ii.newElement()), o[s][0] = t, o[s][1] = e;
    }, Ae.prototype.setTripleAt = function(t, e, i, s, a, o, c, b) {
      this.setXYAt(t, e, "v", c, b), this.setXYAt(i, s, "o", c, b), this.setXYAt(a, o, "i", c, b);
    }, Ae.prototype.reverse = function() {
      var t = new Ae();
      t.setPathData(this.c, this._length);
      var e = this.v, i = this.o, s = this.i, a = 0;
      this.c && (t.setTripleAt(e[0][0], e[0][1], s[0][0], s[0][1], i[0][0], i[0][1], 0, !1), a = 1);
      var o = this._length - 1, c = this._length, b;
      for (b = a; b < c; b += 1)
        t.setTripleAt(e[o][0], e[o][1], s[o][0], s[o][1], i[o][0], i[o][1], b, !1), o -= 1;
      return t;
    }, Ae.prototype.length = function() {
      return this._length;
    };
    var Xt = function() {
      function t() {
        return new Ae();
      }
      function e(a) {
        var o = a._length, c;
        for (c = 0; c < o; c += 1)
          ii.release(a.v[c]), ii.release(a.i[c]), ii.release(a.o[c]), a.v[c] = null, a.i[c] = null, a.o[c] = null;
        a._length = 0, a.c = !1;
      }
      function i(a) {
        var o = s.newElement(), c, b = a._length === void 0 ? a.v.length : a._length;
        for (o.setLength(b), o.c = a.c, c = 0; c < b; c += 1)
          o.setTripleAt(a.v[c][0], a.v[c][1], a.o[c][0], a.o[c][1], a.i[c][0], a.i[c][1], c);
        return o;
      }
      var s = ye(4, t, e);
      return s.clone = i, s;
    }();
    function Se() {
      this._length = 0, this._maxLength = 4, this.shapes = et(this._maxLength);
    }
    Se.prototype.addShape = function(t) {
      this._length === this._maxLength && (this.shapes = this.shapes.concat(et(this._maxLength)), this._maxLength *= 2), this.shapes[this._length] = t, this._length += 1;
    }, Se.prototype.releaseShapes = function() {
      var t;
      for (t = 0; t < this._length; t += 1)
        Xt.release(this.shapes[t]);
      this._length = 0;
    };
    var Re = function() {
      var t = {
        newShapeCollection: a,
        release: o
      }, e = 0, i = 4, s = et(i);
      function a() {
        var c;
        return e ? (e -= 1, c = s[e]) : c = new Se(), c;
      }
      function o(c) {
        var b, u = c._length;
        for (b = 0; b < u; b += 1)
          Xt.release(c.shapes[b]);
        c._length = 0, e === i && (s = Fi.double(s), i *= 2), s[e] = c, e += 1;
      }
      return t;
    }(), Di = function() {
      var t = -999999;
      function e(S, x, d) {
        var _ = d.lastIndex, A, L, D, U, Y, gt, lt, Q, yt, nt = this.keyframes;
        if (S < nt[0].t - this.offsetTime)
          A = nt[0].s[0], D = !0, _ = 0;
        else if (S >= nt[nt.length - 1].t - this.offsetTime)
          A = nt[nt.length - 1].s ? nt[nt.length - 1].s[0] : nt[nt.length - 2].e[0], D = !0;
        else {
          for (var G = _, w = nt.length - 1, M = !0, f, p, $; M && (f = nt[G], p = nt[G + 1], !(p.t - this.offsetTime > S)); )
            G < w - 1 ? G += 1 : M = !1;
          if ($ = this.keyframesMetadata[G] || {}, D = f.h === 1, _ = G, !D) {
            if (S >= p.t - this.offsetTime)
              Q = 1;
            else if (S < f.t - this.offsetTime)
              Q = 0;
            else {
              var R;
              $.__fnct ? R = $.__fnct : (R = ei.getBezierEasing(f.o.x, f.o.y, f.i.x, f.i.y).get, $.__fnct = R), Q = R((S - (f.t - this.offsetTime)) / (p.t - this.offsetTime - (f.t - this.offsetTime)));
            }
            L = p.s ? p.s[0] : f.e[0];
          }
          A = f.s[0];
        }
        for (gt = x._length, lt = A.i[0].length, d.lastIndex = _, U = 0; U < gt; U += 1)
          for (Y = 0; Y < lt; Y += 1)
            yt = D ? A.i[U][Y] : A.i[U][Y] + (L.i[U][Y] - A.i[U][Y]) * Q, x.i[U][Y] = yt, yt = D ? A.o[U][Y] : A.o[U][Y] + (L.o[U][Y] - A.o[U][Y]) * Q, x.o[U][Y] = yt, yt = D ? A.v[U][Y] : A.v[U][Y] + (L.v[U][Y] - A.v[U][Y]) * Q, x.v[U][Y] = yt;
      }
      function i() {
        var S = this.comp.renderedFrame - this.offsetTime, x = this.keyframes[0].t - this.offsetTime, d = this.keyframes[this.keyframes.length - 1].t - this.offsetTime, _ = this._caching.lastFrame;
        return _ !== t && (_ < x && S < x || _ > d && S > d) || (this._caching.lastIndex = _ < S ? this._caching.lastIndex : 0, this.interpolateShape(S, this.pv, this._caching)), this._caching.lastFrame = S, this.pv;
      }
      function s() {
        this.paths = this.localShapeCollection;
      }
      function a(S, x) {
        if (S._length !== x._length || S.c !== x.c)
          return !1;
        var d, _ = S._length;
        for (d = 0; d < _; d += 1)
          if (S.v[d][0] !== x.v[d][0] || S.v[d][1] !== x.v[d][1] || S.o[d][0] !== x.o[d][0] || S.o[d][1] !== x.o[d][1] || S.i[d][0] !== x.i[d][0] || S.i[d][1] !== x.i[d][1])
            return !1;
        return !0;
      }
      function o(S) {
        a(this.v, S) || (this.v = Xt.clone(S), this.localShapeCollection.releaseShapes(), this.localShapeCollection.addShape(this.v), this._mdf = !0, this.paths = this.localShapeCollection);
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
      function b(S, x, d) {
        this.propType = "shape", this.comp = S.comp, this.container = S, this.elem = S, this.data = x, this.k = !1, this.kf = !1, this._mdf = !1;
        var _ = d === 3 ? x.pt.k : x.ks.k;
        this.v = Xt.clone(_), this.pv = Xt.clone(this.v), this.localShapeCollection = Re.newShapeCollection(), this.paths = this.localShapeCollection, this.paths.addShape(this.v), this.reset = s, this.effectsSequence = [];
      }
      function u(S) {
        this.effectsSequence.push(S), this.container.addDynamicProperty(this);
      }
      b.prototype.interpolateShape = e, b.prototype.getValue = c, b.prototype.setVValue = o, b.prototype.addEffect = u;
      function T(S, x, d) {
        this.propType = "shape", this.comp = S.comp, this.elem = S, this.container = S, this.offsetTime = S.data.st, this.keyframes = d === 3 ? x.pt.k : x.ks.k, this.keyframesMetadata = [], this.k = !0, this.kf = !0;
        var _ = this.keyframes[0].s[0].i.length;
        this.v = Xt.newElement(), this.v.setPathData(this.keyframes[0].s[0].c, _), this.pv = Xt.clone(this.v), this.localShapeCollection = Re.newShapeCollection(), this.paths = this.localShapeCollection, this.paths.addShape(this.v), this.lastFrame = t, this.reset = s, this._caching = {
          lastFrame: t,
          lastIndex: 0
        }, this.effectsSequence = [i.bind(this)];
      }
      T.prototype.getValue = c, T.prototype.interpolateShape = e, T.prototype.setVValue = o, T.prototype.addEffect = u;
      var C = function() {
        var S = wt;
        function x(d, _) {
          this.v = Xt.newElement(), this.v.setPathData(!0, 4), this.localShapeCollection = Re.newShapeCollection(), this.paths = this.localShapeCollection, this.localShapeCollection.addShape(this.v), this.d = _.d, this.elem = d, this.comp = d.comp, this.frameId = -1, this.initDynamicPropertyContainer(d), this.p = J.getProp(d, _.p, 1, 0, this), this.s = J.getProp(d, _.s, 1, 0, this), this.dynamicProperties.length ? this.k = !0 : (this.k = !1, this.convertEllToPath());
        }
        return x.prototype = {
          reset: s,
          getValue: function() {
            this.elem.globalData.frameId !== this.frameId && (this.frameId = this.elem.globalData.frameId, this.iterateDynamicProperties(), this._mdf && this.convertEllToPath());
          },
          convertEllToPath: function() {
            var _ = this.p.v[0], A = this.p.v[1], L = this.s.v[0] / 2, D = this.s.v[1] / 2, U = this.d !== 3, Y = this.v;
            Y.v[0][0] = _, Y.v[0][1] = A - D, Y.v[1][0] = U ? _ + L : _ - L, Y.v[1][1] = A, Y.v[2][0] = _, Y.v[2][1] = A + D, Y.v[3][0] = U ? _ - L : _ + L, Y.v[3][1] = A, Y.i[0][0] = U ? _ - L * S : _ + L * S, Y.i[0][1] = A - D, Y.i[1][0] = U ? _ + L : _ - L, Y.i[1][1] = A - D * S, Y.i[2][0] = U ? _ + L * S : _ - L * S, Y.i[2][1] = A + D, Y.i[3][0] = U ? _ - L : _ + L, Y.i[3][1] = A + D * S, Y.o[0][0] = U ? _ + L * S : _ - L * S, Y.o[0][1] = A - D, Y.o[1][0] = U ? _ + L : _ - L, Y.o[1][1] = A + D * S, Y.o[2][0] = U ? _ - L * S : _ + L * S, Y.o[2][1] = A + D, Y.o[3][0] = U ? _ - L : _ + L, Y.o[3][1] = A - D * S;
          }
        }, H([Kt], x), x;
      }(), V = function() {
        function S(x, d) {
          this.v = Xt.newElement(), this.v.setPathData(!0, 0), this.elem = x, this.comp = x.comp, this.data = d, this.frameId = -1, this.d = d.d, this.initDynamicPropertyContainer(x), d.sy === 1 ? (this.ir = J.getProp(x, d.ir, 0, 0, this), this.is = J.getProp(x, d.is, 0, 0.01, this), this.convertToPath = this.convertStarToPath) : this.convertToPath = this.convertPolygonToPath, this.pt = J.getProp(x, d.pt, 0, 0, this), this.p = J.getProp(x, d.p, 1, 0, this), this.r = J.getProp(x, d.r, 0, Et, this), this.or = J.getProp(x, d.or, 0, 0, this), this.os = J.getProp(x, d.os, 0, 0.01, this), this.localShapeCollection = Re.newShapeCollection(), this.localShapeCollection.addShape(this.v), this.paths = this.localShapeCollection, this.dynamicProperties.length ? this.k = !0 : (this.k = !1, this.convertToPath());
        }
        return S.prototype = {
          reset: s,
          getValue: function() {
            this.elem.globalData.frameId !== this.frameId && (this.frameId = this.elem.globalData.frameId, this.iterateDynamicProperties(), this._mdf && this.convertToPath());
          },
          convertStarToPath: function() {
            var d = Math.floor(this.pt.v) * 2, _ = Math.PI * 2 / d, A = !0, L = this.or.v, D = this.ir.v, U = this.os.v, Y = this.is.v, gt = 2 * Math.PI * L / (d * 2), lt = 2 * Math.PI * D / (d * 2), Q, yt, nt, G, w = -Math.PI / 2;
            w += this.r.v;
            var M = this.data.d === 3 ? -1 : 1;
            for (this.v._length = 0, Q = 0; Q < d; Q += 1) {
              yt = A ? L : D, nt = A ? U : Y, G = A ? gt : lt;
              var f = yt * Math.cos(w), p = yt * Math.sin(w), $ = f === 0 && p === 0 ? 0 : p / Math.sqrt(f * f + p * p), R = f === 0 && p === 0 ? 0 : -f / Math.sqrt(f * f + p * p);
              f += +this.p.v[0], p += +this.p.v[1], this.v.setTripleAt(f, p, f - $ * G * nt * M, p - R * G * nt * M, f + $ * G * nt * M, p + R * G * nt * M, Q, !0), A = !A, w += _ * M;
            }
          },
          convertPolygonToPath: function() {
            var d = Math.floor(this.pt.v), _ = Math.PI * 2 / d, A = this.or.v, L = this.os.v, D = 2 * Math.PI * A / (d * 4), U, Y = -Math.PI * 0.5, gt = this.data.d === 3 ? -1 : 1;
            for (Y += this.r.v, this.v._length = 0, U = 0; U < d; U += 1) {
              var lt = A * Math.cos(Y), Q = A * Math.sin(Y), yt = lt === 0 && Q === 0 ? 0 : Q / Math.sqrt(lt * lt + Q * Q), nt = lt === 0 && Q === 0 ? 0 : -lt / Math.sqrt(lt * lt + Q * Q);
              lt += +this.p.v[0], Q += +this.p.v[1], this.v.setTripleAt(lt, Q, lt - yt * D * L * gt, Q - nt * D * L * gt, lt + yt * D * L * gt, Q + nt * D * L * gt, U, !0), Y += _ * gt;
            }
            this.paths.length = 0, this.paths[0] = this.v;
          }
        }, H([Kt], S), S;
      }(), g = function() {
        function S(x, d) {
          this.v = Xt.newElement(), this.v.c = !0, this.localShapeCollection = Re.newShapeCollection(), this.localShapeCollection.addShape(this.v), this.paths = this.localShapeCollection, this.elem = x, this.comp = x.comp, this.frameId = -1, this.d = d.d, this.initDynamicPropertyContainer(x), this.p = J.getProp(x, d.p, 1, 0, this), this.s = J.getProp(x, d.s, 1, 0, this), this.r = J.getProp(x, d.r, 0, 0, this), this.dynamicProperties.length ? this.k = !0 : (this.k = !1, this.convertRectToPath());
        }
        return S.prototype = {
          convertRectToPath: function() {
            var d = this.p.v[0], _ = this.p.v[1], A = this.s.v[0] / 2, L = this.s.v[1] / 2, D = me(A, L, this.r.v), U = D * (1 - wt);
            this.v._length = 0, this.d === 2 || this.d === 1 ? (this.v.setTripleAt(d + A, _ - L + D, d + A, _ - L + D, d + A, _ - L + U, 0, !0), this.v.setTripleAt(d + A, _ + L - D, d + A, _ + L - U, d + A, _ + L - D, 1, !0), D !== 0 ? (this.v.setTripleAt(d + A - D, _ + L, d + A - D, _ + L, d + A - U, _ + L, 2, !0), this.v.setTripleAt(d - A + D, _ + L, d - A + U, _ + L, d - A + D, _ + L, 3, !0), this.v.setTripleAt(d - A, _ + L - D, d - A, _ + L - D, d - A, _ + L - U, 4, !0), this.v.setTripleAt(d - A, _ - L + D, d - A, _ - L + U, d - A, _ - L + D, 5, !0), this.v.setTripleAt(d - A + D, _ - L, d - A + D, _ - L, d - A + U, _ - L, 6, !0), this.v.setTripleAt(d + A - D, _ - L, d + A - U, _ - L, d + A - D, _ - L, 7, !0)) : (this.v.setTripleAt(d - A, _ + L, d - A + U, _ + L, d - A, _ + L, 2), this.v.setTripleAt(d - A, _ - L, d - A, _ - L + U, d - A, _ - L, 3))) : (this.v.setTripleAt(d + A, _ - L + D, d + A, _ - L + U, d + A, _ - L + D, 0, !0), D !== 0 ? (this.v.setTripleAt(d + A - D, _ - L, d + A - D, _ - L, d + A - U, _ - L, 1, !0), this.v.setTripleAt(d - A + D, _ - L, d - A + U, _ - L, d - A + D, _ - L, 2, !0), this.v.setTripleAt(d - A, _ - L + D, d - A, _ - L + D, d - A, _ - L + U, 3, !0), this.v.setTripleAt(d - A, _ + L - D, d - A, _ + L - U, d - A, _ + L - D, 4, !0), this.v.setTripleAt(d - A + D, _ + L, d - A + D, _ + L, d - A + U, _ + L, 5, !0), this.v.setTripleAt(d + A - D, _ + L, d + A - U, _ + L, d + A - D, _ + L, 6, !0), this.v.setTripleAt(d + A, _ + L - D, d + A, _ + L - D, d + A, _ + L - U, 7, !0)) : (this.v.setTripleAt(d - A, _ - L, d - A + U, _ - L, d - A, _ - L, 1, !0), this.v.setTripleAt(d - A, _ + L, d - A, _ + L - U, d - A, _ + L, 2, !0), this.v.setTripleAt(d + A, _ + L, d + A - U, _ + L, d + A, _ + L, 3, !0)));
          },
          getValue: function() {
            this.elem.globalData.frameId !== this.frameId && (this.frameId = this.elem.globalData.frameId, this.iterateDynamicProperties(), this._mdf && this.convertRectToPath());
          },
          reset: s
        }, H([Kt], S), S;
      }();
      function E(S, x, d) {
        var _;
        if (d === 3 || d === 4) {
          var A = d === 3 ? x.pt : x.ks, L = A.k;
          L.length ? _ = new T(S, x, d) : _ = new b(S, x, d);
        } else d === 5 ? _ = new g(S, x) : d === 6 ? _ = new C(S, x) : d === 7 && (_ = new V(S, x));
        return _.k && S.addDynamicProperty(_), _;
      }
      function I() {
        return b;
      }
      function P() {
        return T;
      }
      var N = {};
      return N.getShapeProp = E, N.getConstructorFunction = I, N.getKeyframedConstructorFunction = P, N;
    }();
    /*!
     Transformation Matrix v2.0
     (c) Epistemex 2014-2015
     www.epistemex.com
     By Ken Fyrstenberg
     Contributions by leeoniya.
     License: MIT, header required.
     */
    var Qt = /* @__PURE__ */ function() {
      var t = Math.cos, e = Math.sin, i = Math.tan, s = Math.round;
      function a() {
        return this.props[0] = 1, this.props[1] = 0, this.props[2] = 0, this.props[3] = 0, this.props[4] = 0, this.props[5] = 1, this.props[6] = 0, this.props[7] = 0, this.props[8] = 0, this.props[9] = 0, this.props[10] = 1, this.props[11] = 0, this.props[12] = 0, this.props[13] = 0, this.props[14] = 0, this.props[15] = 1, this;
      }
      function o(f) {
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
      function b(f) {
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
      function C(f, p) {
        return this.shear(i(f), i(p));
      }
      function V(f, p) {
        var $ = t(p), R = e(p);
        return this._t($, R, 0, 0, -R, $, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)._t(1, 0, 0, 0, i(f), 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)._t($, -R, 0, 0, R, $, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
      }
      function g(f, p, $) {
        return !$ && $ !== 0 && ($ = 1), f === 1 && p === 1 && $ === 1 ? this : this._t(f, 0, 0, 0, 0, p, 0, 0, 0, 0, $, 0, 0, 0, 0, 1);
      }
      function E(f, p, $, R, st, pt, vt, At, St, oe, Pe, oi, Me, de, Ne, zt) {
        return this.props[0] = f, this.props[1] = p, this.props[2] = $, this.props[3] = R, this.props[4] = st, this.props[5] = pt, this.props[6] = vt, this.props[7] = At, this.props[8] = St, this.props[9] = oe, this.props[10] = Pe, this.props[11] = oi, this.props[12] = Me, this.props[13] = de, this.props[14] = Ne, this.props[15] = zt, this;
      }
      function I(f, p, $) {
        return $ = $ || 0, f !== 0 || p !== 0 || $ !== 0 ? this._t(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, f, p, $, 1) : this;
      }
      function P(f, p, $, R, st, pt, vt, At, St, oe, Pe, oi, Me, de, Ne, zt) {
        var at = this.props;
        if (f === 1 && p === 0 && $ === 0 && R === 0 && st === 0 && pt === 1 && vt === 0 && At === 0 && St === 0 && oe === 0 && Pe === 1 && oi === 0)
          return at[12] = at[12] * f + at[15] * Me, at[13] = at[13] * pt + at[15] * de, at[14] = at[14] * Pe + at[15] * Ne, at[15] *= zt, this._identityCalculated = !1, this;
        var wi = at[0], Gi = at[1], ki = at[2], ai = at[3], xi = at[4], Ti = at[5], Ie = at[6], Yi = at[7], Xi = at[8], Ze = at[9], Zi = at[10], Ke = at[11], fr = at[12], gs = at[13], vs = at[14], ys = at[15];
        return at[0] = wi * f + Gi * st + ki * St + ai * Me, at[1] = wi * p + Gi * pt + ki * oe + ai * de, at[2] = wi * $ + Gi * vt + ki * Pe + ai * Ne, at[3] = wi * R + Gi * At + ki * oi + ai * zt, at[4] = xi * f + Ti * st + Ie * St + Yi * Me, at[5] = xi * p + Ti * pt + Ie * oe + Yi * de, at[6] = xi * $ + Ti * vt + Ie * Pe + Yi * Ne, at[7] = xi * R + Ti * At + Ie * oi + Yi * zt, at[8] = Xi * f + Ze * st + Zi * St + Ke * Me, at[9] = Xi * p + Ze * pt + Zi * oe + Ke * de, at[10] = Xi * $ + Ze * vt + Zi * Pe + Ke * Ne, at[11] = Xi * R + Ze * At + Zi * oi + Ke * zt, at[12] = fr * f + gs * st + vs * St + ys * Me, at[13] = fr * p + gs * pt + vs * oe + ys * de, at[14] = fr * $ + gs * vt + vs * Pe + ys * Ne, at[15] = fr * R + gs * At + vs * oi + ys * zt, this._identityCalculated = !1, this;
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
      function _(f) {
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
      function U(f, p, $) {
        return f * this.props[2] + p * this.props[6] + $ * this.props[10] + this.props[14];
      }
      function Y() {
        var f = this.props[0] * this.props[5] - this.props[1] * this.props[4], p = this.props[5] / f, $ = -this.props[1] / f, R = -this.props[4] / f, st = this.props[0] / f, pt = (this.props[4] * this.props[13] - this.props[5] * this.props[12]) / f, vt = -(this.props[0] * this.props[13] - this.props[1] * this.props[12]) / f, At = new Qt();
        return At.props[0] = p, At.props[1] = $, At.props[4] = R, At.props[5] = st, At.props[12] = pt, At.props[13] = vt, At;
      }
      function gt(f) {
        var p = this.getInverseMatrix();
        return p.applyToPointArray(f[0], f[1], f[2] || 0);
      }
      function lt(f) {
        var p, $ = f.length, R = [];
        for (p = 0; p < $; p += 1)
          R[p] = gt(f[p]);
        return R;
      }
      function Q(f, p, $) {
        var R = rt("float32", 6);
        if (this.isIdentity())
          R[0] = f[0], R[1] = f[1], R[2] = p[0], R[3] = p[1], R[4] = $[0], R[5] = $[1];
        else {
          var st = this.props[0], pt = this.props[1], vt = this.props[4], At = this.props[5], St = this.props[12], oe = this.props[13];
          R[0] = f[0] * st + f[1] * vt + St, R[1] = f[0] * pt + f[1] * At + oe, R[2] = p[0] * st + p[1] * vt + St, R[3] = p[0] * pt + p[1] * At + oe, R[4] = $[0] * st + $[1] * vt + St, R[5] = $[0] * pt + $[1] * At + oe;
        }
        return R;
      }
      function yt(f, p, $) {
        var R;
        return this.isIdentity() ? R = [f, p, $] : R = [f * this.props[0] + p * this.props[4] + $ * this.props[8] + this.props[12], f * this.props[1] + p * this.props[5] + $ * this.props[9] + this.props[13], f * this.props[2] + p * this.props[6] + $ * this.props[10] + this.props[14]], R;
      }
      function nt(f, p) {
        if (this.isIdentity())
          return f + "," + p;
        var $ = this.props;
        return Math.round((f * $[0] + p * $[4] + $[12]) * 100) / 100 + "," + Math.round((f * $[1] + p * $[5] + $[13]) * 100) / 100;
      }
      function G() {
        for (var f = 0, p = this.props, $ = "matrix3d(", R = 1e4; f < 16; )
          $ += s(p[f] * R) / R, $ += f === 15 ? ")" : ",", f += 1;
        return $;
      }
      function w(f) {
        var p = 1e4;
        return f < 1e-6 && f > 0 || f > -1e-6 && f < 0 ? s(f * p) / p : f;
      }
      function M() {
        var f = this.props, p = w(f[0]), $ = w(f[1]), R = w(f[4]), st = w(f[5]), pt = w(f[12]), vt = w(f[13]);
        return "matrix(" + p + "," + $ + "," + R + "," + st + "," + pt + "," + vt + ")";
      }
      return function() {
        this.reset = a, this.rotate = o, this.rotateX = c, this.rotateY = b, this.rotateZ = u, this.skew = C, this.skewFromAxis = V, this.shear = T, this.scale = g, this.setTransform = E, this.translate = I, this.transform = P, this.multiply = N, this.applyToPoint = A, this.applyToX = L, this.applyToY = D, this.applyToZ = U, this.applyToPointArray = yt, this.applyToTriplePoints = Q, this.applyToPointStringified = nt, this.toCSS = G, this.to2dCSS = M, this.clone = d, this.cloneFromProps = _, this.equals = x, this.inversePoints = lt, this.inversePoint = gt, this.getInverseMatrix = Y, this._t = this.transform, this.isIdentity = S, this._identity = !0, this._identityCalculated = !1, this.props = rt("float32", 16), this.reset();
      };
    }();
    function Rr(t) {
      "@babel/helpers - typeof";
      return Rr = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
        return typeof e;
      } : function(e) {
        return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
      }, Rr(t);
    }
    var Tt = {};
    function Or(t) {
      B(t);
    }
    function Nr() {
      Wt.searchAnimations();
    }
    function zr(t) {
      Ji(t);
    }
    function Vs(t) {
      Fr(t);
    }
    function ir(t) {
      return Wt.loadAnimation(t);
    }
    function $s(t) {
      if (typeof t == "string")
        switch (t) {
          case "high":
            Mi(200);
            break;
          default:
          case "medium":
            Mi(50);
            break;
          case "low":
            Mi(10);
            break;
        }
      else !isNaN(t) && t > 1 && Mi(t);
    }
    function Us() {
      return typeof navigator < "u";
    }
    function qt(t, e) {
      t === "expressions" && Pi(e);
    }
    function Bi(t) {
      switch (t) {
        case "propertyFactory":
          return J;
        case "shapePropertyFactory":
          return Di;
        case "matrix":
          return Qt;
        default:
          return null;
      }
    }
    Tt.play = Wt.play, Tt.pause = Wt.pause, Tt.setLocationHref = Or, Tt.togglePause = Wt.togglePause, Tt.setSpeed = Wt.setSpeed, Tt.setDirection = Wt.setDirection, Tt.stop = Wt.stop, Tt.searchAnimations = Nr, Tt.registerAnimation = Wt.registerAnimation, Tt.loadAnimation = ir, Tt.setSubframeRendering = zr, Tt.resize = Wt.resize, Tt.goToAndStop = Wt.goToAndStop, Tt.destroy = Wt.destroy, Tt.setQuality = $s, Tt.inBrowser = Us, Tt.installPlugin = qt, Tt.freeze = Wt.freeze, Tt.unfreeze = Wt.unfreeze, Tt.setVolume = Wt.setVolume, Tt.mute = Wt.mute, Tt.unmute = Wt.unmute, Tt.getRegisteredAnimations = Wt.getRegisteredAnimations, Tt.useWebWorker = y, Tt.setIDPrefix = Vs, Tt.__getFactory = Bi, Tt.version = "5.13.0";
    function js() {
      document.readyState === "complete" && (clearInterval(Ws), Nr());
    }
    function hs(t) {
      for (var e = kr.split("&"), i = 0; i < e.length; i += 1) {
        var s = e[i].split("=");
        if (decodeURIComponent(s[0]) == t)
          return decodeURIComponent(s[1]);
      }
      return null;
    }
    var kr = "";
    {
      var Dr = document.getElementsByTagName("script"), fs = Dr.length - 1, cs = Dr[fs] || {
        src: ""
      };
      kr = cs.src ? cs.src.replace(/^[^\?]+\??/, "") : "", hs("renderer");
    }
    var Ws = setInterval(js, 100);
    try {
      Rr(r) !== "object" && (window.bodymovin = Tt);
    } catch {
    }
    var ri = function() {
      var t = {}, e = {};
      t.registerModifier = i, t.getModifier = s;
      function i(a, o) {
        e[a] || (e[a] = o);
      }
      function s(a, o, c) {
        return new e[a](o, c);
      }
      return t;
    }();
    function Ce() {
    }
    Ce.prototype.initModifierProperties = function() {
    }, Ce.prototype.addShapeToModifier = function() {
    }, Ce.prototype.addShape = function(t) {
      if (!this.closed) {
        t.sh.container.addDynamicProperty(t.sh);
        var e = {
          shape: t.sh,
          data: t,
          localShapeCollection: Re.newShapeCollection()
        };
        this.shapes.push(e), this.addShapeToModifier(e), this._isAnimated && t.setAsAnimated();
      }
    }, Ce.prototype.init = function(t, e) {
      this.shapes = [], this.elem = t, this.initDynamicPropertyContainer(t), this.initModifierProperties(t, e), this.frameId = m, this.closed = !1, this.k = !1, this.dynamicProperties.length ? this.k = !0 : this.getValue(!0);
    }, Ce.prototype.processKeys = function() {
      this.elem.globalData.frameId !== this.frameId && (this.frameId = this.elem.globalData.frameId, this.iterateDynamicProperties());
    }, H([Kt], Ce);
    function Jt() {
    }
    H([Ce], Jt), Jt.prototype.initModifierProperties = function(t, e) {
      this.s = J.getProp(t, e.s, 0, 0.01, this), this.e = J.getProp(t, e.e, 0, 0.01, this), this.o = J.getProp(t, e.o, 0, 0, this), this.sValue = 0, this.eValue = 0, this.getValue = this.processKeys, this.m = e.m, this._isAnimated = !!this.s.effectsSequence.length || !!this.e.effectsSequence.length || !!this.o.effectsSequence.length;
    }, Jt.prototype.addShapeToModifier = function(t) {
      t.pathsData = [];
    }, Jt.prototype.calculateShapeEdges = function(t, e, i, s, a) {
      var o = [];
      e <= 1 ? o.push({
        s: t,
        e
      }) : t >= 1 ? o.push({
        s: t - 1,
        e: e - 1
      }) : (o.push({
        s: t,
        e: 1
      }), o.push({
        s: 0,
        e: e - 1
      }));
      var c = [], b, u = o.length, T;
      for (b = 0; b < u; b += 1)
        if (T = o[b], !(T.e * a < s || T.s * a > s + i)) {
          var C, V;
          T.s * a <= s ? C = 0 : C = (T.s * a - s) / i, T.e * a >= s + i ? V = 1 : V = (T.e * a - s) / i, c.push([C, V]);
        }
      return c.length || c.push([0, 0]), c;
    }, Jt.prototype.releasePathsData = function(t) {
      var e, i = t.length;
      for (e = 0; e < i; e += 1)
        mt.release(t[e]);
      return t.length = 0, t;
    }, Jt.prototype.processShapes = function(t) {
      var e, i;
      if (this._mdf || t) {
        var s = this.o.v % 360 / 360;
        if (s < 0 && (s += 1), this.s.v > 1 ? e = 1 + s : this.s.v < 0 ? e = 0 + s : e = this.s.v + s, this.e.v > 1 ? i = 1 + s : this.e.v < 0 ? i = 0 + s : i = this.e.v + s, e > i) {
          var a = e;
          e = i, i = a;
        }
        e = Math.round(e * 1e4) * 1e-4, i = Math.round(i * 1e4) * 1e-4, this.sValue = e, this.eValue = i;
      } else
        e = this.sValue, i = this.eValue;
      var o, c, b = this.shapes.length, u, T, C, V, g, E = 0;
      if (i === e)
        for (c = 0; c < b; c += 1)
          this.shapes[c].localShapeCollection.releaseShapes(), this.shapes[c].shape._mdf = !0, this.shapes[c].shape.paths = this.shapes[c].localShapeCollection, this._mdf && (this.shapes[c].pathsData.length = 0);
      else if (i === 1 && e === 0 || i === 0 && e === 1) {
        if (this._mdf)
          for (c = 0; c < b; c += 1)
            this.shapes[c].pathsData.length = 0, this.shapes[c].shape._mdf = !0;
      } else {
        var I = [], P, N;
        for (c = 0; c < b; c += 1)
          if (P = this.shapes[c], !P.shape._mdf && !this._mdf && !t && this.m !== 2)
            P.shape.paths = P.localShapeCollection;
          else {
            if (o = P.shape.paths, T = o._length, g = 0, !P.shape._mdf && P.pathsData.length)
              g = P.totalShapeLength;
            else {
              for (C = this.releasePathsData(P.pathsData), u = 0; u < T; u += 1)
                V = bt.getSegmentsLength(o.shapes[u]), C.push(V), g += V.totalLength;
              P.totalShapeLength = g, P.pathsData = C;
            }
            E += g, P.shape._mdf = !0;
          }
        var S = e, x = i, d = 0, _;
        for (c = b - 1; c >= 0; c -= 1)
          if (P = this.shapes[c], P.shape._mdf) {
            for (N = P.localShapeCollection, N.releaseShapes(), this.m === 2 && b > 1 ? (_ = this.calculateShapeEdges(e, i, P.totalShapeLength, d, E), d += P.totalShapeLength) : _ = [[S, x]], T = _.length, u = 0; u < T; u += 1) {
              S = _[u][0], x = _[u][1], I.length = 0, x <= 1 ? I.push({
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
    }, Jt.prototype.addPaths = function(t, e) {
      var i, s = t.length;
      for (i = 0; i < s; i += 1)
        e.addShape(t[i]);
    }, Jt.prototype.addSegment = function(t, e, i, s, a, o, c) {
      a.setXYAt(e[0], e[1], "o", o), a.setXYAt(i[0], i[1], "i", o + 1), c && a.setXYAt(t[0], t[1], "v", o), a.setXYAt(s[0], s[1], "v", o + 1);
    }, Jt.prototype.addSegmentFromArray = function(t, e, i, s) {
      e.setXYAt(t[1], t[5], "o", i), e.setXYAt(t[2], t[6], "i", i + 1), s && e.setXYAt(t[0], t[4], "v", i), e.setXYAt(t[3], t[7], "v", i + 1);
    }, Jt.prototype.addShapes = function(t, e, i) {
      var s = t.pathsData, a = t.shape.paths.shapes, o, c = t.shape.paths._length, b, u, T = 0, C, V, g, E, I = [], P, N = !0;
      for (i ? (V = i._length, P = i._length) : (i = Xt.newElement(), V = 0, P = 0), I.push(i), o = 0; o < c; o += 1) {
        for (g = s[o].lengths, i.c = a[o].c, u = a[o].c ? g.length : g.length + 1, b = 1; b < u; b += 1)
          if (C = g[b - 1], T + C.addedLength < e.s)
            T += C.addedLength, i.c = !1;
          else if (T > e.e) {
            i.c = !1;
            break;
          } else
            e.s <= T && e.e >= T + C.addedLength ? (this.addSegment(a[o].v[b - 1], a[o].o[b - 1], a[o].i[b], a[o].v[b], i, V, N), N = !1) : (E = bt.getNewSegment(a[o].v[b - 1], a[o].v[b], a[o].o[b - 1], a[o].i[b], (e.s - T) / C.addedLength, (e.e - T) / C.addedLength, g[b - 1]), this.addSegmentFromArray(E, i, V, N), N = !1, i.c = !1), T += C.addedLength, V += 1;
        if (a[o].c && g.length) {
          if (C = g[b - 1], T <= e.e) {
            var S = g[b - 1].addedLength;
            e.s <= T && e.e >= T + S ? (this.addSegment(a[o].v[b - 1], a[o].o[b - 1], a[o].i[0], a[o].v[0], i, V, N), N = !1) : (E = bt.getNewSegment(a[o].v[b - 1], a[o].v[0], a[o].o[b - 1], a[o].i[0], (e.s - T) / S, (e.e - T) / S, g[b - 1]), this.addSegmentFromArray(E, i, V, N), N = !1, i.c = !1);
          } else
            i.c = !1;
          T += C.addedLength, V += 1;
        }
        if (i._length && (i.setXYAt(i.v[P][0], i.v[P][1], "i", P), i.setXYAt(i.v[i._length - 1][0], i.v[i._length - 1][1], "o", i._length - 1)), T > e.e)
          break;
        o < c - 1 && (i = Xt.newElement(), N = !0, I.push(i), V = 0);
      }
      return I;
    };
    function Vi() {
    }
    H([Ce], Vi), Vi.prototype.initModifierProperties = function(t, e) {
      this.getValue = this.processKeys, this.amount = J.getProp(t, e.a, 0, null, this), this._isAnimated = !!this.amount.effectsSequence.length;
    }, Vi.prototype.processPath = function(t, e) {
      var i = e / 100, s = [0, 0], a = t._length, o = 0;
      for (o = 0; o < a; o += 1)
        s[0] += t.v[o][0], s[1] += t.v[o][1];
      s[0] /= a, s[1] /= a;
      var c = Xt.newElement();
      c.c = t.c;
      var b, u, T, C, V, g;
      for (o = 0; o < a; o += 1)
        b = t.v[o][0] + (s[0] - t.v[o][0]) * i, u = t.v[o][1] + (s[1] - t.v[o][1]) * i, T = t.o[o][0] + (s[0] - t.o[o][0]) * -i, C = t.o[o][1] + (s[1] - t.o[o][1]) * -i, V = t.i[o][0] + (s[0] - t.i[o][0]) * -i, g = t.i[o][1] + (s[1] - t.i[o][1]) * -i, c.setTripleAt(b, u, T, C, V, g, o);
      return c;
    }, Vi.prototype.processShapes = function(t) {
      var e, i, s = this.shapes.length, a, o, c = this.amount.v;
      if (c !== 0) {
        var b, u;
        for (i = 0; i < s; i += 1) {
          if (b = this.shapes[i], u = b.localShapeCollection, !(!b.shape._mdf && !this._mdf && !t))
            for (u.releaseShapes(), b.shape._mdf = !0, e = b.shape.paths.shapes, o = b.shape.paths._length, a = 0; a < o; a += 1)
              u.addShape(this.processPath(e[a], c));
          b.shape.paths = b.localShapeCollection;
        }
      }
      this.dynamicProperties.length || (this._mdf = !1);
    };
    var $i = function() {
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
              var C, V;
              if (T = this.elem.globalData.frameRate, this.p && this.p.keyframes && this.p.getValueAtTime)
                this.p._caching.lastFrame + this.p.offsetTime <= this.p.keyframes[0].t ? (C = this.p.getValueAtTime((this.p.keyframes[0].t + 0.01) / T, 0), V = this.p.getValueAtTime(this.p.keyframes[0].t / T, 0)) : this.p._caching.lastFrame + this.p.offsetTime >= this.p.keyframes[this.p.keyframes.length - 1].t ? (C = this.p.getValueAtTime(this.p.keyframes[this.p.keyframes.length - 1].t / T, 0), V = this.p.getValueAtTime((this.p.keyframes[this.p.keyframes.length - 1].t - 0.05) / T, 0)) : (C = this.p.pv, V = this.p.getValueAtTime((this.p._caching.lastFrame + this.p.offsetTime - 0.01) / T, this.p.offsetTime));
              else if (this.px && this.px.keyframes && this.py.keyframes && this.px.getValueAtTime && this.py.getValueAtTime) {
                C = [], V = [];
                var g = this.px, E = this.py;
                g._caching.lastFrame + g.offsetTime <= g.keyframes[0].t ? (C[0] = g.getValueAtTime((g.keyframes[0].t + 0.01) / T, 0), C[1] = E.getValueAtTime((E.keyframes[0].t + 0.01) / T, 0), V[0] = g.getValueAtTime(g.keyframes[0].t / T, 0), V[1] = E.getValueAtTime(E.keyframes[0].t / T, 0)) : g._caching.lastFrame + g.offsetTime >= g.keyframes[g.keyframes.length - 1].t ? (C[0] = g.getValueAtTime(g.keyframes[g.keyframes.length - 1].t / T, 0), C[1] = E.getValueAtTime(E.keyframes[E.keyframes.length - 1].t / T, 0), V[0] = g.getValueAtTime((g.keyframes[g.keyframes.length - 1].t - 0.01) / T, 0), V[1] = E.getValueAtTime((E.keyframes[E.keyframes.length - 1].t - 0.01) / T, 0)) : (C = [g.pv, E.pv], V[0] = g.getValueAtTime((g._caching.lastFrame + g.offsetTime - 0.01) / T, g.offsetTime), V[1] = E.getValueAtTime((E._caching.lastFrame + E.offsetTime - 0.01) / T, E.offsetTime));
              } else
                V = t, C = V;
              this.v.rotate(-Math.atan2(C[1] - V[1], C[0] - V[0]));
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
      function a() {
      }
      function o(u) {
        this._addDynamicProperty(u), this.elem.addDynamicProperty(u), this._isDirty = !0;
      }
      function c(u, T, C) {
        if (this.elem = u, this.frameId = -1, this.propType = "transform", this.data = T, this.v = new Qt(), this.pre = new Qt(), this.appliedTransformations = 0, this.initDynamicPropertyContainer(C || u), T.p && T.p.s ? (this.px = J.getProp(u, T.p.x, 0, 0, this), this.py = J.getProp(u, T.p.y, 0, 0, this), T.p.z && (this.pz = J.getProp(u, T.p.z, 0, 0, this))) : this.p = J.getProp(u, T.p || {
          k: [0, 0, 0]
        }, 1, 0, this), T.rx) {
          if (this.rx = J.getProp(u, T.rx, 0, Et, this), this.ry = J.getProp(u, T.ry, 0, Et, this), this.rz = J.getProp(u, T.rz, 0, Et, this), T.or.k[0].ti) {
            var V, g = T.or.k.length;
            for (V = 0; V < g; V += 1)
              T.or.k[V].to = null, T.or.k[V].ti = null;
          }
          this.or = J.getProp(u, T.or, 1, Et, this), this.or.sh = !0;
        } else
          this.r = J.getProp(u, T.r || {
            k: 0
          }, 0, Et, this);
        T.sk && (this.sk = J.getProp(u, T.sk, 0, Et, this), this.sa = J.getProp(u, T.sa, 0, Et, this)), this.a = J.getProp(u, T.a || {
          k: [0, 0, 0]
        }, 1, 0, this), this.s = J.getProp(u, T.s || {
          k: [100, 100, 100]
        }, 1, 0.01, this), T.o ? this.o = J.getProp(u, T.o, 0, 0.01, u) : this.o = {
          _mdf: !1,
          v: 1
        }, this._isDirty = !0, this.dynamicProperties.length || this.getValue(!0);
      }
      c.prototype = {
        applyToMatrix: e,
        getValue: i,
        precalculateMatrix: s,
        autoOrient: a
      }, H([Kt], c), c.prototype.addDynamicProperty = o, c.prototype._addDynamicProperty = Kt.prototype.addDynamicProperty;
      function b(u, T, C) {
        return new c(u, T, C);
      }
      return {
        getTransformProperty: b
      };
    }();
    function le() {
    }
    H([Ce], le), le.prototype.initModifierProperties = function(t, e) {
      this.getValue = this.processKeys, this.c = J.getProp(t, e.c, 0, null, this), this.o = J.getProp(t, e.o, 0, null, this), this.tr = $i.getTransformProperty(t, e.tr, this), this.so = J.getProp(t, e.tr.so, 0, 0.01, this), this.eo = J.getProp(t, e.tr.eo, 0, 0.01, this), this.data = e, this.dynamicProperties.length || this.getValue(!0), this._isAnimated = !!this.dynamicProperties.length, this.pMatrix = new Qt(), this.rMatrix = new Qt(), this.sMatrix = new Qt(), this.tMatrix = new Qt(), this.matrix = new Qt();
    }, le.prototype.applyTransforms = function(t, e, i, s, a, o) {
      var c = o ? -1 : 1, b = s.s.v[0] + (1 - s.s.v[0]) * (1 - a), u = s.s.v[1] + (1 - s.s.v[1]) * (1 - a);
      t.translate(s.p.v[0] * c * a, s.p.v[1] * c * a, s.p.v[2]), e.translate(-s.a.v[0], -s.a.v[1], s.a.v[2]), e.rotate(-s.r.v * c * a), e.translate(s.a.v[0], s.a.v[1], s.a.v[2]), i.translate(-s.a.v[0], -s.a.v[1], s.a.v[2]), i.scale(o ? 1 / b : b, o ? 1 / u : u), i.translate(s.a.v[0], s.a.v[1], s.a.v[2]);
    }, le.prototype.init = function(t, e, i, s) {
      for (this.elem = t, this.arr = e, this.pos = i, this.elemsData = s, this._currentCopies = 0, this._elements = [], this._groups = [], this.frameId = -1, this.initDynamicPropertyContainer(t), this.initModifierProperties(t, e[i]); i > 0; )
        i -= 1, this._elements.unshift(e[i]);
      this.dynamicProperties.length ? this.k = !0 : this.getValue(!0);
    }, le.prototype.resetElements = function(t) {
      var e, i = t.length;
      for (e = 0; e < i; e += 1)
        t[e]._processed = !1, t[e].ty === "gr" && this.resetElements(t[e].it);
    }, le.prototype.cloneElements = function(t) {
      var e = JSON.parse(JSON.stringify(t));
      return this.resetElements(e), e;
    }, le.prototype.changeGroupRender = function(t, e) {
      var i, s = t.length;
      for (i = 0; i < s; i += 1)
        t[i]._render = e, t[i].ty === "gr" && this.changeGroupRender(t[i].it, e);
    }, le.prototype.processShapes = function(t) {
      var e, i, s, a, o, c = !1;
      if (this._mdf || t) {
        var b = Math.ceil(this.c.v);
        if (this._groups.length < b) {
          for (; this._groups.length < b; ) {
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
        o = 0;
        var T;
        for (s = 0; s <= this._groups.length - 1; s += 1) {
          if (T = o < b, this._groups[s]._render = T, this.changeGroupRender(this._groups[s].it, T), !T) {
            var C = this.elemsData[s].it, V = C[C.length - 1];
            V.transform.op.v !== 0 ? (V.transform.op._mdf = !0, V.transform.op.v = 0) : V.transform.op._mdf = !1;
          }
          o += 1;
        }
        this._currentCopies = b;
        var g = this.o.v, E = g % 1, I = g > 0 ? Math.floor(g) : Math.ceil(g), P = this.pMatrix.props, N = this.rMatrix.props, S = this.sMatrix.props;
        this.pMatrix.reset(), this.rMatrix.reset(), this.sMatrix.reset(), this.tMatrix.reset(), this.matrix.reset();
        var x = 0;
        if (g > 0) {
          for (; x < I; )
            this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, 1, !1), x += 1;
          E && (this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, E, !1), x += E);
        } else if (g < 0) {
          for (; x > I; )
            this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, 1, !0), x -= 1;
          E && (this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, -E, !0), x -= E);
        }
        s = this.data.m === 1 ? 0 : this._currentCopies - 1, a = this.data.m === 1 ? 1 : -1, o = this._currentCopies;
        for (var d, _; o; ) {
          if (e = this.elemsData[s].it, i = e[e.length - 1].transform.mProps.v.props, _ = i.length, e[e.length - 1].transform.mProps._mdf = !0, e[e.length - 1].transform.op._mdf = !0, e[e.length - 1].transform.op.v = this._currentCopies === 1 ? this.so.v : this.so.v + (this.eo.v - this.so.v) * (s / (this._currentCopies - 1)), x !== 0) {
            for ((s !== 0 && a === 1 || s !== this._currentCopies - 1 && a === -1) && this.applyTransforms(this.pMatrix, this.rMatrix, this.sMatrix, this.tr, 1, !1), this.matrix.transform(N[0], N[1], N[2], N[3], N[4], N[5], N[6], N[7], N[8], N[9], N[10], N[11], N[12], N[13], N[14], N[15]), this.matrix.transform(S[0], S[1], S[2], S[3], S[4], S[5], S[6], S[7], S[8], S[9], S[10], S[11], S[12], S[13], S[14], S[15]), this.matrix.transform(P[0], P[1], P[2], P[3], P[4], P[5], P[6], P[7], P[8], P[9], P[10], P[11], P[12], P[13], P[14], P[15]), d = 0; d < _; d += 1)
              i[d] = this.matrix.props[d];
            this.matrix.reset();
          } else
            for (this.matrix.reset(), d = 0; d < _; d += 1)
              i[d] = this.matrix.props[d];
          x += 1, o -= 1, s += a;
        }
      } else
        for (o = this._currentCopies, s = 0, a = 1; o; )
          e = this.elemsData[s].it, i = e[e.length - 1].transform.mProps.v.props, e[e.length - 1].transform.mProps._mdf = !1, e[e.length - 1].transform.op._mdf = !1, o -= 1, s += a;
      return c;
    }, le.prototype.addShape = function() {
    };
    function rr() {
    }
    H([Ce], rr), rr.prototype.initModifierProperties = function(t, e) {
      this.getValue = this.processKeys, this.rd = J.getProp(t, e.r, 0, null, this), this._isAnimated = !!this.rd.effectsSequence.length;
    }, rr.prototype.processPath = function(t, e) {
      var i = Xt.newElement();
      i.c = t.c;
      var s, a = t._length, o, c, b, u, T, C, V = 0, g, E, I, P, N, S;
      for (s = 0; s < a; s += 1)
        o = t.v[s], b = t.o[s], c = t.i[s], o[0] === b[0] && o[1] === b[1] && o[0] === c[0] && o[1] === c[1] ? (s === 0 || s === a - 1) && !t.c ? (i.setTripleAt(o[0], o[1], b[0], b[1], c[0], c[1], V), V += 1) : (s === 0 ? u = t.v[a - 1] : u = t.v[s - 1], T = Math.sqrt(Math.pow(o[0] - u[0], 2) + Math.pow(o[1] - u[1], 2)), C = T ? Math.min(T / 2, e) / T : 0, N = o[0] + (u[0] - o[0]) * C, g = N, S = o[1] - (o[1] - u[1]) * C, E = S, I = g - (g - o[0]) * wt, P = E - (E - o[1]) * wt, i.setTripleAt(g, E, I, P, N, S, V), V += 1, s === a - 1 ? u = t.v[0] : u = t.v[s + 1], T = Math.sqrt(Math.pow(o[0] - u[0], 2) + Math.pow(o[1] - u[1], 2)), C = T ? Math.min(T / 2, e) / T : 0, I = o[0] + (u[0] - o[0]) * C, g = I, P = o[1] + (u[1] - o[1]) * C, E = P, N = g - (g - o[0]) * wt, S = E - (E - o[1]) * wt, i.setTripleAt(g, E, I, P, N, S, V), V += 1) : (i.setTripleAt(t.v[s][0], t.v[s][1], t.o[s][0], t.o[s][1], t.i[s][0], t.i[s][1], V), V += 1);
      return i;
    }, rr.prototype.processShapes = function(t) {
      var e, i, s = this.shapes.length, a, o, c = this.rd.v;
      if (c !== 0) {
        var b, u;
        for (i = 0; i < s; i += 1) {
          if (b = this.shapes[i], u = b.localShapeCollection, !(!b.shape._mdf && !this._mdf && !t))
            for (u.releaseShapes(), b.shape._mdf = !0, e = b.shape.paths.shapes, o = b.shape.paths._length, a = 0; a < o; a += 1)
              u.addShape(this.processPath(e[a], c));
          b.shape.paths = b.localShapeCollection;
        }
      }
      this.dynamicProperties.length || (this._mdf = !1);
    };
    function mi(t, e) {
      return Math.abs(t - e) * 1e5 <= Math.min(Math.abs(t), Math.abs(e));
    }
    function xr(t) {
      return Math.abs(t) <= 1e-5;
    }
    function us(t, e, i) {
      return t * (1 - i) + e * i;
    }
    function Xe(t, e, i) {
      return [us(t[0], e[0], i), us(t[1], e[1], i)];
    }
    function ps(t, e, i) {
      if (t === 0) return [];
      var s = e * e - 4 * t * i;
      if (s < 0) return [];
      var a = -e / (2 * t);
      if (s === 0) return [a];
      var o = Math.sqrt(s) / (2 * t);
      return [a - o, a + o];
    }
    function sr(t, e, i, s) {
      return [-t + 3 * e - 3 * i + s, 3 * t - 6 * e + 3 * i, -3 * t + 3 * e, t];
    }
    function Tr(t) {
      return new $t(t, t, t, t, !1);
    }
    function $t(t, e, i, s, a) {
      a && yi(t, e) && (e = Xe(t, s, 1 / 3)), a && yi(i, s) && (i = Xe(t, s, 2 / 3));
      var o = sr(t[0], e[0], i[0], s[0]), c = sr(t[1], e[1], i[1], s[1]);
      this.a = [o[0], c[0]], this.b = [o[1], c[1]], this.c = [o[2], c[2]], this.d = [o[3], c[3]], this.points = [t, e, i, s];
    }
    $t.prototype.point = function(t) {
      return [((this.a[0] * t + this.b[0]) * t + this.c[0]) * t + this.d[0], ((this.a[1] * t + this.b[1]) * t + this.c[1]) * t + this.d[1]];
    }, $t.prototype.derivative = function(t) {
      return [(3 * t * this.a[0] + 2 * this.b[0]) * t + this.c[0], (3 * t * this.a[1] + 2 * this.b[1]) * t + this.c[1]];
    }, $t.prototype.tangentAngle = function(t) {
      var e = this.derivative(t);
      return Math.atan2(e[1], e[0]);
    }, $t.prototype.normalAngle = function(t) {
      var e = this.derivative(t);
      return Math.atan2(e[0], e[1]);
    }, $t.prototype.inflectionPoints = function() {
      var t = this.a[1] * this.b[0] - this.a[0] * this.b[1];
      if (xr(t)) return [];
      var e = -0.5 * (this.a[1] * this.c[0] - this.a[0] * this.c[1]) / t, i = e * e - 1 / 3 * (this.b[1] * this.c[0] - this.b[0] * this.c[1]) / t;
      if (i < 0) return [];
      var s = Math.sqrt(i);
      return xr(s) ? s > 0 && s < 1 ? [e] : [] : [e - s, e + s].filter(function(a) {
        return a > 0 && a < 1;
      });
    }, $t.prototype.split = function(t) {
      if (t <= 0) return [Tr(this.points[0]), this];
      if (t >= 1) return [this, Tr(this.points[this.points.length - 1])];
      var e = Xe(this.points[0], this.points[1], t), i = Xe(this.points[1], this.points[2], t), s = Xe(this.points[2], this.points[3], t), a = Xe(e, i, t), o = Xe(i, s, t), c = Xe(a, o, t);
      return [new $t(this.points[0], e, a, c, !0), new $t(c, o, s, this.points[3], !0)];
    };
    function gi(t, e) {
      var i = t.points[0][e], s = t.points[t.points.length - 1][e];
      if (i > s) {
        var a = s;
        s = i, i = a;
      }
      for (var o = ps(3 * t.a[e], 2 * t.b[e], t.c[e]), c = 0; c < o.length; c += 1)
        if (o[c] > 0 && o[c] < 1) {
          var b = t.point(o[c])[e];
          b < i ? i = b : b > s && (s = b);
        }
      return {
        min: i,
        max: s
      };
    }
    $t.prototype.bounds = function() {
      return {
        x: gi(this, 0),
        y: gi(this, 1)
      };
    }, $t.prototype.boundingBox = function() {
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
    function si(t, e, i) {
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
    function Oe(t) {
      var e = t.bez.split(0.5);
      return [si(e[0], t.t1, t.t), si(e[1], t.t, t.t2)];
    }
    function Hs(t, e) {
      return Math.abs(t.cx - e.cx) * 2 < t.width + e.width && Math.abs(t.cy - e.cy) * 2 < t.height + e.height;
    }
    function ni(t, e, i, s, a, o) {
      if (Hs(t, e)) {
        if (i >= o || t.width <= s && t.height <= s && e.width <= s && e.height <= s) {
          a.push([t.t, e.t]);
          return;
        }
        var c = Oe(t), b = Oe(e);
        ni(c[0], b[0], i + 1, s, a, o), ni(c[0], b[1], i + 1, s, a, o), ni(c[1], b[0], i + 1, s, a, o), ni(c[1], b[1], i + 1, s, a, o);
      }
    }
    $t.prototype.intersections = function(t, e, i) {
      e === void 0 && (e = 2), i === void 0 && (i = 7);
      var s = [];
      return ni(si(this, 0, 1), si(t, 0, 1), 0, e, s, i), s;
    }, $t.shapeSegment = function(t, e) {
      var i = (e + 1) % t.length();
      return new $t(t.v[e], t.o[e], t.i[i], t.v[i], !0);
    }, $t.shapeSegmentInverted = function(t, e) {
      var i = (e + 1) % t.length();
      return new $t(t.v[i], t.i[i], t.o[e], t.v[e], !0);
    };
    function Br(t, e) {
      return [t[1] * e[2] - t[2] * e[1], t[2] * e[0] - t[0] * e[2], t[0] * e[1] - t[1] * e[0]];
    }
    function nr(t, e, i, s) {
      var a = [t[0], t[1], 1], o = [e[0], e[1], 1], c = [i[0], i[1], 1], b = [s[0], s[1], 1], u = Br(Br(a, o), Br(c, b));
      return xr(u[2]) ? null : [u[0] / u[2], u[1] / u[2]];
    }
    function vi(t, e, i) {
      return [t[0] + Math.cos(e) * i, t[1] - Math.sin(e) * i];
    }
    function Ar(t, e) {
      return Math.hypot(t[0] - e[0], t[1] - e[1]);
    }
    function yi(t, e) {
      return mi(t[0], e[0]) && mi(t[1], e[1]);
    }
    function or() {
    }
    H([Ce], or), or.prototype.initModifierProperties = function(t, e) {
      this.getValue = this.processKeys, this.amplitude = J.getProp(t, e.s, 0, null, this), this.frequency = J.getProp(t, e.r, 0, null, this), this.pointsType = J.getProp(t, e.pt, 0, null, this), this._isAnimated = this.amplitude.effectsSequence.length !== 0 || this.frequency.effectsSequence.length !== 0 || this.pointsType.effectsSequence.length !== 0;
    };
    function Vr(t, e, i, s, a, o, c) {
      var b = i - Math.PI / 2, u = i + Math.PI / 2, T = e[0] + Math.cos(i) * s * a, C = e[1] - Math.sin(i) * s * a;
      t.setTripleAt(T, C, T + Math.cos(b) * o, C - Math.sin(b) * o, T + Math.cos(u) * c, C - Math.sin(u) * c, t.length());
    }
    function qs(t, e) {
      var i = [e[0] - t[0], e[1] - t[1]], s = -Math.PI * 0.5, a = [Math.cos(s) * i[0] - Math.sin(s) * i[1], Math.sin(s) * i[0] + Math.cos(s) * i[1]];
      return a;
    }
    function Gs(t, e) {
      var i = e === 0 ? t.length() - 1 : e - 1, s = (e + 1) % t.length(), a = t.v[i], o = t.v[s], c = qs(a, o);
      return Math.atan2(0, 1) - Math.atan2(c[1], c[0]);
    }
    function $r(t, e, i, s, a, o, c) {
      var b = Gs(e, i), u = e.v[i % e._length], T = e.v[i === 0 ? e._length - 1 : i - 1], C = e.v[(i + 1) % e._length], V = o === 2 ? Math.sqrt(Math.pow(u[0] - T[0], 2) + Math.pow(u[1] - T[1], 2)) : 0, g = o === 2 ? Math.sqrt(Math.pow(u[0] - C[0], 2) + Math.pow(u[1] - C[1], 2)) : 0;
      Vr(t, e.v[i % e._length], b, c, s, g / ((a + 1) * 2), V / ((a + 1) * 2));
    }
    function Sr(t, e, i, s, a, o) {
      for (var c = 0; c < s; c += 1) {
        var b = (c + 1) / (s + 1), u = a === 2 ? Math.sqrt(Math.pow(e.points[3][0] - e.points[0][0], 2) + Math.pow(e.points[3][1] - e.points[0][1], 2)) : 0, T = e.normalAngle(b), C = e.point(b);
        Vr(t, C, T, o, i, u / ((s + 1) * 2), u / ((s + 1) * 2)), o = -o;
      }
      return o;
    }
    or.prototype.processPath = function(t, e, i, s) {
      var a = t._length, o = Xt.newElement();
      if (o.c = t.c, t.c || (a -= 1), a === 0) return o;
      var c = -1, b = $t.shapeSegment(t, 0);
      $r(o, t, 0, e, i, s, c);
      for (var u = 0; u < a; u += 1)
        c = Sr(o, b, e, i, s, -c), u === a - 1 && !t.c ? b = null : b = $t.shapeSegment(t, (u + 1) % a), $r(o, t, u + 1, e, i, s, c);
      return o;
    }, or.prototype.processShapes = function(t) {
      var e, i, s = this.shapes.length, a, o, c = this.amplitude.v, b = Math.max(0, Math.round(this.frequency.v)), u = this.pointsType.v;
      if (c !== 0) {
        var T, C;
        for (i = 0; i < s; i += 1) {
          if (T = this.shapes[i], C = T.localShapeCollection, !(!T.shape._mdf && !this._mdf && !t))
            for (C.releaseShapes(), T.shape._mdf = !0, e = T.shape.paths.shapes, o = T.shape.paths._length, a = 0; a < o; a += 1)
              C.addShape(this.processPath(e[a], c, b, u));
          T.shape.paths = T.localShapeCollection;
        }
      }
      this.dynamicProperties.length || (this._mdf = !1);
    };
    function ar(t, e, i) {
      var s = Math.atan2(e[0] - t[0], e[1] - t[1]);
      return [vi(t, s, i), vi(e, s, i)];
    }
    function Z(t, e) {
      var i, s, a, o, c, b, u;
      u = ar(t.points[0], t.points[1], e), i = u[0], s = u[1], u = ar(t.points[1], t.points[2], e), a = u[0], o = u[1], u = ar(t.points[2], t.points[3], e), c = u[0], b = u[1];
      var T = nr(i, s, a, o);
      T === null && (T = s);
      var C = nr(c, b, a, o);
      return C === null && (C = c), new $t(i, T, C, b);
    }
    function k(t, e, i, s, a) {
      var o = e.points[3], c = i.points[0];
      if (s === 3 || yi(o, c)) return o;
      if (s === 2) {
        var b = -e.tangentAngle(1), u = -i.tangentAngle(0) + Math.PI, T = nr(o, vi(o, b + Math.PI / 2, 100), c, vi(c, b + Math.PI / 2, 100)), C = T ? Ar(T, o) : Ar(o, c) / 2, V = vi(o, b, 2 * C * wt);
        return t.setXYAt(V[0], V[1], "o", t.length() - 1), V = vi(c, u, 2 * C * wt), t.setTripleAt(c[0], c[1], c[0], c[1], V[0], V[1], t.length()), c;
      }
      var g = yi(o, e.points[2]) ? e.points[0] : e.points[2], E = yi(c, i.points[1]) ? i.points[3] : i.points[1], I = nr(g, o, c, E);
      return I && Ar(I, o) < a ? (t.setTripleAt(I[0], I[1], I[0], I[1], I[0], I[1], t.length()), I) : o;
    }
    function z(t, e) {
      var i = t.intersections(e);
      return i.length && mi(i[0][0], 1) && i.shift(), i.length ? i[0] : null;
    }
    function q(t, e) {
      var i = t.slice(), s = e.slice(), a = z(t[t.length - 1], e[0]);
      return a && (i[t.length - 1] = t[t.length - 1].split(a[0])[0], s[0] = e[0].split(a[1])[1]), t.length > 1 && e.length > 1 && (a = z(t[0], e[e.length - 1]), a) ? [[t[0].split(a[0])[0]], [e[e.length - 1].split(a[1])[1]]] : [i, s];
    }
    function it(t) {
      for (var e, i = 1; i < t.length; i += 1)
        e = q(t[i - 1], t[i]), t[i - 1] = e[0], t[i] = e[1];
      return t.length > 1 && (e = q(t[t.length - 1], t[0]), t[t.length - 1] = e[0], t[0] = e[1]), t;
    }
    function ot(t, e) {
      var i = t.inflectionPoints(), s, a, o, c;
      if (i.length === 0)
        return [Z(t, e)];
      if (i.length === 1 || mi(i[1], 1))
        return o = t.split(i[0]), s = o[0], a = o[1], [Z(s, e), Z(a, e)];
      o = t.split(i[0]), s = o[0];
      var b = (i[1] - i[0]) / (1 - i[0]);
      return o = o[1].split(b), c = o[0], a = o[1], [Z(s, e), Z(c, e), Z(a, e)];
    }
    function ft() {
    }
    H([Ce], ft), ft.prototype.initModifierProperties = function(t, e) {
      this.getValue = this.processKeys, this.amount = J.getProp(t, e.a, 0, null, this), this.miterLimit = J.getProp(t, e.ml, 0, null, this), this.lineJoin = e.lj, this._isAnimated = this.amount.effectsSequence.length !== 0;
    }, ft.prototype.processPath = function(t, e, i, s) {
      var a = Xt.newElement();
      a.c = t.c;
      var o = t.length();
      t.c || (o -= 1);
      var c, b, u, T = [];
      for (c = 0; c < o; c += 1)
        u = $t.shapeSegment(t, c), T.push(ot(u, e));
      if (!t.c)
        for (c = o - 1; c >= 0; c -= 1)
          u = $t.shapeSegmentInverted(t, c), T.push(ot(u, e));
      T = it(T);
      var C = null, V = null;
      for (c = 0; c < T.length; c += 1) {
        var g = T[c];
        for (V && (C = k(a, V, g[0], i, s)), V = g[g.length - 1], b = 0; b < g.length; b += 1)
          u = g[b], C && yi(u.points[0], C) ? a.setXYAt(u.points[1][0], u.points[1][1], "o", a.length() - 1) : a.setTripleAt(u.points[0][0], u.points[0][1], u.points[1][0], u.points[1][1], u.points[0][0], u.points[0][1], a.length()), a.setTripleAt(u.points[3][0], u.points[3][1], u.points[3][0], u.points[3][1], u.points[2][0], u.points[2][1], a.length()), C = u.points[3];
      }
      return T.length && k(a, V, T[0][0], i, s), a;
    }, ft.prototype.processShapes = function(t) {
      var e, i, s = this.shapes.length, a, o, c = this.amount.v, b = this.miterLimit.v, u = this.lineJoin;
      if (c !== 0) {
        var T, C;
        for (i = 0; i < s; i += 1) {
          if (T = this.shapes[i], C = T.localShapeCollection, !(!T.shape._mdf && !this._mdf && !t))
            for (C.releaseShapes(), T.shape._mdf = !0, e = T.shape.paths.shapes, o = T.shape.paths._length, a = 0; a < o; a += 1)
              C.addShape(this.processPath(e[a], c, u, b));
          T.shape.paths = T.localShapeCollection;
        }
      }
      this.dynamicProperties.length || (this._mdf = !1);
    };
    function Rt(t) {
      for (var e = t.fStyle ? t.fStyle.split(" ") : [], i = "normal", s = "normal", a = e.length, o, c = 0; c < a; c += 1)
        switch (o = e[c].toLowerCase(), o) {
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
    var Pt = function() {
      var t = 5e3, e = {
        w: 0,
        size: 0,
        shapes: [],
        data: {
          shapes: []
        }
      }, i = [];
      i = i.concat([2304, 2305, 2306, 2307, 2362, 2363, 2364, 2364, 2366, 2367, 2368, 2369, 2370, 2371, 2372, 2373, 2374, 2375, 2376, 2377, 2378, 2379, 2380, 2381, 2382, 2383, 2387, 2388, 2389, 2390, 2391, 2402, 2403]);
      var s = 127988, a = 917631, o = 917601, c = 917626, b = 65039, u = 8205, T = 127462, C = 127487, V = ["d83cdffb", "d83cdffc", "d83cdffd", "d83cdffe", "d83cdfff"];
      function g(w) {
        var M = w.split(","), f, p = M.length, $ = [];
        for (f = 0; f < p; f += 1)
          M[f] !== "sans-serif" && M[f] !== "monospace" && $.push(M[f]);
        return $.join(",");
      }
      function E(w, M) {
        var f = W("span");
        f.setAttribute("aria-hidden", !0), f.style.fontFamily = M;
        var p = W("span");
        p.innerText = "giItT1WQy@!-/#", f.style.position = "absolute", f.style.left = "-10000px", f.style.top = "-10000px", f.style.fontSize = "300px", f.style.fontVariant = "normal", f.style.fontStyle = "normal", f.style.fontWeight = "normal", f.style.letterSpacing = "0", f.appendChild(p), document.body.appendChild(f);
        var $ = p.offsetWidth;
        return p.style.fontFamily = g(w) + ", " + M, {
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
        var f = document.body && M ? "svg" : "canvas", p, $ = Rt(w);
        if (f === "svg") {
          var R = ut("text");
          R.style.fontSize = "100px", R.setAttribute("font-family", w.fFamily), R.setAttribute("font-style", $.style), R.setAttribute("font-weight", $.weight), R.textContent = "1", w.fClass ? (R.style.fontFamily = "inherit", R.setAttribute("class", w.fClass)) : R.style.fontFamily = w.fFamily, M.appendChild(R), p = R;
        } else {
          var st = new OffscreenCanvas(500, 500).getContext("2d");
          st.font = $.style + " " + $.weight + " 100px " + w.fFamily, p = st;
        }
        function pt(vt) {
          return f === "svg" ? (p.textContent = vt, p.getComputedTextLength()) : p.measureText(vt).width;
        }
        return {
          measureText: pt
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
          this.isLoaded = !0, w.list.forEach(function(Pe) {
            Pe.helper = P(Pe), Pe.cache = {};
          }), this.fonts = w.list;
          return;
        }
        var f = w.list, p, $ = f.length, R = $;
        for (p = 0; p < $; p += 1) {
          var st = !0, pt, vt;
          if (f[p].loaded = !1, f[p].monoCase = E(f[p].fFamily, "monospace"), f[p].sansCase = E(f[p].fFamily, "sans-serif"), !f[p].fPath)
            f[p].loaded = !0, R -= 1;
          else if (f[p].fOrigin === "p" || f[p].origin === 3) {
            if (pt = document.querySelectorAll('style[f-forigin="p"][f-family="' + f[p].fFamily + '"], style[f-origin="3"][f-family="' + f[p].fFamily + '"]'), pt.length > 0 && (st = !1), st) {
              var At = W("style");
              At.setAttribute("f-forigin", f[p].fOrigin), At.setAttribute("f-origin", f[p].origin), At.setAttribute("f-family", f[p].fFamily), At.type = "text/css", At.innerText = "@font-face {font-family: " + f[p].fFamily + "; font-style: normal; src: url('" + f[p].fPath + "');}", M.appendChild(At);
            }
          } else if (f[p].fOrigin === "g" || f[p].origin === 1) {
            for (pt = document.querySelectorAll('link[f-forigin="g"], link[f-origin="1"]'), vt = 0; vt < pt.length; vt += 1)
              pt[vt].href.indexOf(f[p].fPath) !== -1 && (st = !1);
            if (st) {
              var St = W("link");
              St.setAttribute("f-forigin", f[p].fOrigin), St.setAttribute("f-origin", f[p].origin), St.type = "text/css", St.rel = "stylesheet", St.href = f[p].fPath, document.body.appendChild(St);
            }
          } else if (f[p].fOrigin === "t" || f[p].origin === 2) {
            for (pt = document.querySelectorAll('script[f-forigin="t"], script[f-origin="2"]'), vt = 0; vt < pt.length; vt += 1)
              f[p].fPath === pt[vt].src && (st = !1);
            if (st) {
              var oe = W("link");
              oe.setAttribute("f-forigin", f[p].fOrigin), oe.setAttribute("f-origin", f[p].origin), oe.setAttribute("rel", "stylesheet"), oe.setAttribute("href", f[p].fPath), M.appendChild(oe);
            }
          }
          f[p].helper = P(f[p], M), f[p].cache = {}, this.fonts.push(f[p]);
        }
        R === 0 ? this.isLoaded = !0 : setTimeout(this.checkLoadedFonts.bind(this), 100);
      }
      function S(w) {
        if (w) {
          this.chars || (this.chars = []);
          var M, f = w.length, p, $ = this.chars.length, R;
          for (M = 0; M < f; M += 1) {
            for (p = 0, R = !1; p < $; )
              this.chars[p].style === w[M].style && this.chars[p].fFamily === w[M].fFamily && this.chars[p].ch === w[M].ch && (R = !0), p += 1;
            R || (this.chars.push(w[M]), $ += 1);
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
          var R = p.helper;
          if (w === " ") {
            var st = R.measureText("|" + w + "|"), pt = R.measureText("||");
            p.cache[$] = (st - pt) / 100;
          } else
            p.cache[$] = R.measureText(w) / 100;
        }
        return p.cache[$] * f;
      }
      function _(w) {
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
        return V.indexOf(f) !== -1;
      }
      function D(w) {
        return w === u;
      }
      function U(w) {
        return w === b;
      }
      function Y(w) {
        var M = A(w);
        return M >= T && M <= C;
      }
      function gt(w) {
        return Y(w.substr(0, 2)) && Y(w.substr(2, 2));
      }
      function lt(w) {
        return i.indexOf(w) !== -1;
      }
      function Q(w, M) {
        var f = A(w.substr(M, 2));
        if (f !== s)
          return !1;
        var p = 0;
        for (M += 2; p < 5; ) {
          if (f = A(w.substr(M, 2)), f < o || f > c)
            return !1;
          p += 1, M += 2;
        }
        return A(w.substr(M, 2)) === a;
      }
      function yt() {
        this.isLoaded = !0;
      }
      var nt = function() {
        this.fonts = [], this.chars = null, this.typekitLoaded = 0, this.isLoaded = !1, this._warned = !1, this.initTime = Date.now(), this.setIsLoadedBinded = this.setIsLoaded.bind(this), this.checkLoadedFontsBinded = this.checkLoadedFonts.bind(this);
      };
      nt.isModifier = L, nt.isZeroWidthJoiner = D, nt.isFlagEmoji = gt, nt.isRegionalCode = Y, nt.isCombinedCharacter = lt, nt.isRegionalFlag = Q, nt.isVariationSelector = U, nt.BLACK_FLAG_CODE_POINT = s;
      var G = {
        addChars: S,
        addFonts: N,
        getCharData: x,
        getFontByName: _,
        measureText: d,
        checkLoadedFonts: I,
        setIsLoaded: yt
      };
      return nt.prototype = G, nt;
    }();
    function pe(t) {
      this.animationData = t;
    }
    pe.prototype.getProp = function(t) {
      return this.animationData.slots && this.animationData.slots[t.sid] ? Object.assign(t, this.animationData.slots[t.sid].p) : t;
    };
    function _e(t) {
      return new pe(t);
    }
    function Ui() {
    }
    Ui.prototype = {
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
    var ne = /* @__PURE__ */ function() {
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
    function ds(t, e, i) {
      this.p = J.getProp(e, t.v, 0, 0, i);
    }
    function Ln(t, e, i) {
      this.p = J.getProp(e, t.v, 0, 0, i);
    }
    function da(t, e, i) {
      this.p = J.getProp(e, t.v, 1, 0, i);
    }
    function ma(t, e, i) {
      this.p = J.getProp(e, t.v, 1, 0, i);
    }
    function ga(t, e, i) {
      this.p = J.getProp(e, t.v, 0, 0, i);
    }
    function va(t, e, i) {
      this.p = J.getProp(e, t.v, 0, 0, i);
    }
    function ya(t, e, i) {
      this.p = J.getProp(e, t.v, 0, 0, i);
    }
    function _a() {
      this.p = {};
    }
    function Fn(t, e) {
      var i = t.ef || [];
      this.effectElements = [];
      var s, a = i.length, o;
      for (s = 0; s < a; s += 1)
        o = new Ur(i[s], e), this.effectElements.push(o);
    }
    function Ur(t, e) {
      this.init(t, e);
    }
    H([Kt], Ur), Ur.prototype.getValue = Ur.prototype.iterateDynamicProperties, Ur.prototype.init = function(t, e) {
      this.data = t, this.effectElements = [], this.initDynamicPropertyContainer(e);
      var i, s = this.data.ef.length, a, o = this.data.ef;
      for (i = 0; i < s; i += 1) {
        switch (a = null, o[i].ty) {
          case 0:
            a = new ds(o[i], e, this);
            break;
          case 1:
            a = new Ln(o[i], e, this);
            break;
          case 2:
            a = new da(o[i], e, this);
            break;
          case 3:
            a = new ma(o[i], e, this);
            break;
          case 4:
          case 7:
            a = new ya(o[i], e, this);
            break;
          case 10:
            a = new ga(o[i], e, this);
            break;
          case 11:
            a = new va(o[i], e, this);
            break;
          case 5:
            a = new Fn(o[i], e);
            break;
          default:
            a = new _a(o[i]);
            break;
        }
        a && this.effectElements.push(a);
      }
    };
    function ji() {
    }
    ji.prototype = {
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
        var e = ne(this.data.bm), i = this.baseElement || this.layerElement;
        i.style["mix-blend-mode"] = e;
      },
      initBaseData: function(e, i, s) {
        this.globalData = i, this.comp = s, this.data = e, this.layerId = Gt(), this.data.sr || (this.data.sr = 1), this.effectsManager = new Fn(this.data, this, this.dynamicProperties);
      },
      getType: function() {
        return this.type;
      },
      sourceRectAtTime: function() {
      }
    };
    function Wi() {
    }
    Wi.prototype = {
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
        var s, a = this.dynamicProperties.length;
        for (s = 0; s < a; s += 1)
          (i || this._isParent && this.dynamicProperties[s].propType === "transform") && (this.dynamicProperties[s].getValue(), this.dynamicProperties[s]._mdf && (this.globalData._mdf = !0, this._mdf = !0));
      },
      addDynamicProperty: function(e) {
        this.dynamicProperties.indexOf(e) === -1 && this.dynamicProperties.push(e);
      }
    };
    function Hi(t, e, i) {
      this.initFrame(), this.initRenderable(), this.assetData = e.getAssetData(t.refId), this.footageData = e.imageLoader.getAsset(this.assetData), this.initBaseData(t, e, i);
    }
    Hi.prototype.prepareFrame = function() {
    }, H([Ui, ji, Wi], Hi), Hi.prototype.getBaseElement = function() {
      return null;
    }, Hi.prototype.renderFrame = function() {
    }, Hi.prototype.destroy = function() {
    }, Hi.prototype.initExpressions = function() {
    }, Hi.prototype.getFootageData = function() {
      return this.footageData;
    };
    function Ee(t, e, i) {
      this.initFrame(), this.initRenderable(), this.assetData = e.getAssetData(t.refId), this.initBaseData(t, e, i), this._isPlaying = !1, this._canPlay = !1;
      var s = this.globalData.getAssetsPath(this.assetData);
      this.audio = this.globalData.audioController.createAudio(s), this._currentTime = 0, this.globalData.audioController.addAudio(this), this._volumeMultiplier = 1, this._volume = 1, this._previousVolume = null, this.tm = t.tm ? J.getProp(this, t.tm, 0, e.frameRate, this) : {
        _placeholder: !0
      }, this.lv = J.getProp(this, t.au && t.au.lv ? t.au.lv : {
        k: [100]
      }, 1, 0.01, this);
    }
    Ee.prototype.prepareFrame = function(t) {
      if (this.prepareRenderableFrame(t, !0), this.prepareProperties(t, !0), this.tm._placeholder)
        this._currentTime = t / this.data.sr;
      else {
        var e = this.tm.v;
        this._currentTime = e;
      }
      this._volume = this.lv.v[0];
      var i = this._volume * this._volumeMultiplier;
      this._previousVolume !== i && (this._previousVolume = i, this.audio.volume(i));
    }, H([Ui, ji, Wi], Ee), Ee.prototype.renderFrame = function() {
      this.isInRange && this._canPlay && (this._isPlaying ? (!this.audio.playing() || Math.abs(this._currentTime / this.globalData.frameRate - this.audio.seek()) > 0.1) && this.audio.seek(this._currentTime / this.globalData.frameRate) : (this.audio.play(), this.audio.seek(this._currentTime / this.globalData.frameRate), this._isPlaying = !0));
    }, Ee.prototype.show = function() {
    }, Ee.prototype.hide = function() {
      this.audio.pause(), this._isPlaying = !1;
    }, Ee.prototype.pause = function() {
      this.audio.pause(), this._isPlaying = !1, this._canPlay = !1;
    }, Ee.prototype.resume = function() {
      this._canPlay = !0;
    }, Ee.prototype.setRate = function(t) {
      this.audio.rate(t);
    }, Ee.prototype.volume = function(t) {
      this._volumeMultiplier = t, this._previousVolume = t * this._volume, this.audio.volume(this._previousVolume);
    }, Ee.prototype.getBaseElement = function() {
      return null;
    }, Ee.prototype.destroy = function() {
    }, Ee.prototype.sourceRectAtTime = function() {
    }, Ee.prototype.initExpressions = function() {
    };
    function be() {
    }
    be.prototype.checkLayers = function(t) {
      var e, i = this.layers.length, s;
      for (this.completeLayers = !0, e = i - 1; e >= 0; e -= 1)
        this.elements[e] || (s = this.layers[e], s.ip - s.st <= t - this.layers[e].st && s.op - s.st > t - this.layers[e].st && this.buildItem(e)), this.completeLayers = this.elements[e] ? this.completeLayers : !1;
      this.checkPendingElements();
    }, be.prototype.createItem = function(t) {
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
    }, be.prototype.createCamera = function() {
      throw new Error("You're using a 3d camera. Try the html renderer.");
    }, be.prototype.createAudio = function(t) {
      return new Ee(t, this.globalData, this);
    }, be.prototype.createFootage = function(t) {
      return new Hi(t, this.globalData, this);
    }, be.prototype.buildAllItems = function() {
      var t, e = this.layers.length;
      for (t = 0; t < e; t += 1)
        this.buildItem(t);
      this.checkPendingElements();
    }, be.prototype.includeLayers = function(t) {
      this.completeLayers = !1;
      var e, i = t.length, s, a = this.layers.length;
      for (e = 0; e < i; e += 1)
        for (s = 0; s < a; ) {
          if (this.layers[s].id === t[e].id) {
            this.layers[s] = t[e];
            break;
          }
          s += 1;
        }
    }, be.prototype.setProjectInterface = function(t) {
      this.globalData.projectInterface = t;
    }, be.prototype.initItems = function() {
      this.globalData.progressiveLoad || this.buildAllItems();
    }, be.prototype.buildElementParenting = function(t, e, i) {
      for (var s = this.elements, a = this.layers, o = 0, c = a.length; o < c; )
        a[o].ind == e && (!s[o] || s[o] === !0 ? (this.buildItem(o), this.addPendingElement(t)) : (i.push(s[o]), s[o].setAsParent(), a[o].parent !== void 0 ? this.buildElementParenting(t, a[o].parent, i) : t.setHierarchy(i))), o += 1;
    }, be.prototype.addPendingElement = function(t) {
      this.pendingElements.push(t);
    }, be.prototype.searchExtraCompositions = function(t) {
      var e, i = t.length;
      for (e = 0; e < i; e += 1)
        if (t[e].xt) {
          var s = this.createComp(t[e]);
          s.initExpressions(), this.globalData.projectInterface.registerComposition(s);
        }
    }, be.prototype.getElementById = function(t) {
      var e, i = this.elements.length;
      for (e = 0; e < i; e += 1)
        if (this.elements[e].data.ind === t)
          return this.elements[e];
      return null;
    }, be.prototype.getElementByPath = function(t) {
      var e = t.shift(), i;
      if (typeof e == "number")
        i = this.elements[e];
      else {
        var s, a = this.elements.length;
        for (s = 0; s < a; s += 1)
          if (this.elements[s].data.nm === e) {
            i = this.elements[s];
            break;
          }
      }
      return t.length === 0 ? i : i.getElementByPath(t);
    }, be.prototype.setupGlobalData = function(t, e) {
      this.globalData.fontManager = new Pt(), this.globalData.slotManager = _e(t), this.globalData.fontManager.addChars(t.chars), this.globalData.fontManager.addFonts(t.fonts, e), this.globalData.getAssetData = this.animationItem.getAssetData.bind(this.animationItem), this.globalData.getAssetsPath = this.animationItem.getAssetsPath.bind(this.animationItem), this.globalData.imageLoader = this.animationItem.imagePreloader, this.globalData.audioController = this.animationItem.audioController, this.globalData.frameId = 0, this.globalData.frameRate = t.fr, this.globalData.nm = t.nm, this.globalData.compSize = {
        w: t.w,
        h: t.h
      };
    };
    var ba = {
      TRANSFORM_EFFECT: "transformEFfect"
    };
    function Cr() {
    }
    Cr.prototype = {
      initTransform: function() {
        var e = new Qt();
        this.finalTransform = {
          mProp: this.data.ks ? $i.getTransformProperty(this, this.data.ks, this) : {
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
          var e, i = this.finalTransform.mat, s = 0, a = this.hierarchy.length;
          if (!this.finalTransform._matMdf)
            for (; s < a; ) {
              if (this.hierarchy[s].finalTransform.mProp._mdf) {
                this.finalTransform._matMdf = !0;
                break;
              }
              s += 1;
            }
          if (this.finalTransform._matMdf)
            for (e = this.finalTransform.mProp.v.props, i.cloneFromProps(e), s = 0; s < a; s += 1)
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
              var a = this.localTransforms[e].matrix;
              s.multiply(a);
            }
            s.multiply(this.finalTransform.mat);
          }
          if (this.finalTransform._opMdf) {
            var o = this.finalTransform.localOpacity;
            for (e = 0; e < i; e += 1)
              o *= this.localTransforms[e].opacity * 0.01;
            this.finalTransform.localOpacity = o;
          }
        }
      },
      searchEffectTransforms: function() {
        if (this.renderableEffectsManager) {
          var e = this.renderableEffectsManager.getEffects(ba.TRANSFORM_EFFECT);
          if (e.length) {
            this.localTransforms = [], this.finalTransform.localMat = new Qt();
            var i = 0, s = e.length;
            for (i = 0; i < s; i += 1)
              this.localTransforms.push(e[i]);
          }
        }
      },
      globalToLocal: function(e) {
        var i = [];
        i.push(this.finalTransform);
        for (var s = !0, a = this.comp; s; )
          a.finalTransform ? (a.data.hasMask && i.splice(0, 0, a.finalTransform), a = a.comp) : s = !1;
        var o, c = i.length, b;
        for (o = 0; o < c; o += 1)
          b = i[o].mat.applyToPointArray(0, 0, 0), e = [e[0] - b[0], e[1] - b[1], 0];
        return e;
      },
      mHelper: new Qt()
    };
    function lr(t, e, i) {
      this.data = t, this.element = e, this.globalData = i, this.storedData = [], this.masksProperties = this.data.masksProperties || [], this.maskElement = null;
      var s = this.globalData.defs, a, o = this.masksProperties ? this.masksProperties.length : 0;
      this.viewData = et(o), this.solidPath = "";
      var c, b = this.masksProperties, u = 0, T = [], C, V, g = Gt(), E, I, P, N, S = "clipPath", x = "clip-path";
      for (a = 0; a < o; a += 1)
        if ((b[a].mode !== "a" && b[a].mode !== "n" || b[a].inv || b[a].o.k !== 100 || b[a].o.x) && (S = "mask", x = "mask"), (b[a].mode === "s" || b[a].mode === "i") && u === 0 ? (E = ut("rect"), E.setAttribute("fill", "#ffffff"), E.setAttribute("width", this.element.comp.data.w || 0), E.setAttribute("height", this.element.comp.data.h || 0), T.push(E)) : E = null, c = ut("path"), b[a].mode === "n")
          this.viewData[a] = {
            op: J.getProp(this.element, b[a].o, 0, 0.01, this.element),
            prop: Di.getShapeProp(this.element, b[a], 3),
            elem: c,
            lastPath: ""
          }, s.appendChild(c);
        else {
          u += 1, c.setAttribute("fill", b[a].mode === "s" ? "#000000" : "#ffffff"), c.setAttribute("clip-rule", "nonzero");
          var d;
          if (b[a].x.k !== 0 ? (S = "mask", x = "mask", N = J.getProp(this.element, b[a].x, 0, null, this.element), d = Gt(), I = ut("filter"), I.setAttribute("id", d), P = ut("feMorphology"), P.setAttribute("operator", "erode"), P.setAttribute("in", "SourceGraphic"), P.setAttribute("radius", "0"), I.appendChild(P), s.appendChild(I), c.setAttribute("stroke", b[a].mode === "s" ? "#000000" : "#ffffff")) : (P = null, N = null), this.storedData[a] = {
            elem: c,
            x: N,
            expan: P,
            lastPath: "",
            lastOperator: "",
            filterId: d,
            lastRadius: 0
          }, b[a].mode === "i") {
            V = T.length;
            var _ = ut("g");
            for (C = 0; C < V; C += 1)
              _.appendChild(T[C]);
            var A = ut("mask");
            A.setAttribute("mask-type", "alpha"), A.setAttribute("id", g + "_" + u), A.appendChild(c), s.appendChild(A), _.setAttribute("mask", "url(" + j() + "#" + g + "_" + u + ")"), T.length = 0, T.push(_);
          } else
            T.push(c);
          b[a].inv && !this.solidPath && (this.solidPath = this.createLayerSolidPath()), this.viewData[a] = {
            elem: c,
            lastPath: "",
            op: J.getProp(this.element, b[a].o, 0, 0.01, this.element),
            prop: Di.getShapeProp(this.element, b[a], 3),
            invRect: E
          }, this.viewData[a].prop.k || this.drawPath(b[a], this.viewData[a].prop.v, this.viewData[a]);
        }
      for (this.maskElement = ut(S), o = T.length, a = 0; a < o; a += 1)
        this.maskElement.appendChild(T[a]);
      u > 0 && (this.maskElement.setAttribute("id", g), this.element.maskedElement.setAttribute(x, "url(" + j() + "#" + g + ")"), s.appendChild(this.maskElement)), this.viewData.length && this.element.addRenderableComponent(this);
    }
    lr.prototype.getMaskProperty = function(t) {
      return this.viewData[t].prop;
    }, lr.prototype.renderFrame = function(t) {
      var e = this.element.finalTransform.mat, i, s = this.masksProperties.length;
      for (i = 0; i < s; i += 1)
        if ((this.viewData[i].prop._mdf || t) && this.drawPath(this.masksProperties[i], this.viewData[i].prop.v, this.viewData[i]), (this.viewData[i].op._mdf || t) && this.viewData[i].elem.setAttribute("fill-opacity", this.viewData[i].op.v), this.masksProperties[i].mode !== "n" && (this.viewData[i].invRect && (this.element.finalTransform.mProp._mdf || t) && this.viewData[i].invRect.setAttribute("transform", e.getInverseMatrix().to2dCSS()), this.storedData[i].x && (this.storedData[i].x._mdf || t))) {
          var a = this.storedData[i].expan;
          this.storedData[i].x.v < 0 ? (this.storedData[i].lastOperator !== "erode" && (this.storedData[i].lastOperator = "erode", this.storedData[i].elem.setAttribute("filter", "url(" + j() + "#" + this.storedData[i].filterId + ")")), a.setAttribute("radius", -this.storedData[i].x.v)) : (this.storedData[i].lastOperator !== "dilate" && (this.storedData[i].lastOperator = "dilate", this.storedData[i].elem.setAttribute("filter", null)), this.storedData[i].elem.setAttribute("stroke-width", this.storedData[i].x.v * 2));
        }
    }, lr.prototype.getMaskelement = function() {
      return this.maskElement;
    }, lr.prototype.createLayerSolidPath = function() {
      var t = "M0,0 ";
      return t += " h" + this.globalData.compSize.w, t += " v" + this.globalData.compSize.h, t += " h-" + this.globalData.compSize.w, t += " v-" + this.globalData.compSize.h + " ", t;
    }, lr.prototype.drawPath = function(t, e, i) {
      var s = " M" + e.v[0][0] + "," + e.v[0][1], a, o;
      for (o = e._length, a = 1; a < o; a += 1)
        s += " C" + e.o[a - 1][0] + "," + e.o[a - 1][1] + " " + e.i[a][0] + "," + e.i[a][1] + " " + e.v[a][0] + "," + e.v[a][1];
      if (e.c && o > 1 && (s += " C" + e.o[a - 1][0] + "," + e.o[a - 1][1] + " " + e.i[0][0] + "," + e.i[0][1] + " " + e.v[0][0] + "," + e.v[0][1]), i.lastPath !== s) {
        var c = "";
        i.elem && (e.c && (c = t.inv ? this.solidPath + s : s), i.elem.setAttribute("d", c)), i.lastPath = s;
      }
    }, lr.prototype.destroy = function() {
      this.element = null, this.globalData = null, this.maskElement = null, this.data = null, this.masksProperties = null;
    };
    var jr = function() {
      var t = {};
      t.createFilter = e, t.createAlphaToLuminanceFilter = i;
      function e(s, a) {
        var o = ut("filter");
        return o.setAttribute("id", s), a !== !0 && (o.setAttribute("filterUnits", "objectBoundingBox"), o.setAttribute("x", "0%"), o.setAttribute("y", "0%"), o.setAttribute("width", "100%"), o.setAttribute("height", "100%")), o;
      }
      function i() {
        var s = ut("feColorMatrix");
        return s.setAttribute("type", "matrix"), s.setAttribute("color-interpolation-filters", "sRGB"), s.setAttribute("values", "0 0 0 1 0  0 0 0 1 0  0 0 0 1 0  0 0 0 1 1"), s;
      }
      return t;
    }(), Rn = function() {
      var t = {
        maskType: !0,
        svgLumaHidden: !0,
        offscreenCanvas: typeof OffscreenCanvas < "u"
      };
      return (/MSIE 10/i.test(navigator.userAgent) || /MSIE 9/i.test(navigator.userAgent) || /rv:11.0/i.test(navigator.userAgent) || /Edge\/\d./i.test(navigator.userAgent)) && (t.maskType = !1), /firefox/i.test(navigator.userAgent) && (t.svgLumaHidden = !1), t;
    }(), Ys = {}, On = "filter_result_";
    function Xs(t) {
      var e, i = "SourceGraphic", s = t.data.ef ? t.data.ef.length : 0, a = Gt(), o = jr.createFilter(a, !0), c = 0;
      this.filters = [];
      var b;
      for (e = 0; e < s; e += 1) {
        b = null;
        var u = t.data.ef[e].ty;
        if (Ys[u]) {
          var T = Ys[u].effect;
          b = new T(o, t.effectsManager.effectElements[e], t, On + c, i), i = On + c, Ys[u].countsAsEffect && (c += 1);
        }
        b && this.filters.push(b);
      }
      c && (t.globalData.defs.appendChild(o), t.layerElement.setAttribute("filter", "url(" + j() + "#" + a + ")")), this.filters.length && t.addRenderableComponent(this);
    }
    Xs.prototype.renderFrame = function(t) {
      var e, i = this.filters.length;
      for (e = 0; e < i; e += 1)
        this.filters[e].renderFrame(t);
    }, Xs.prototype.getEffects = function(t) {
      var e, i = this.filters.length, s = [];
      for (e = 0; e < i; e += 1)
        this.filters[e].type === t && s.push(this.filters[e]);
      return s;
    };
    function Wr() {
    }
    Wr.prototype = {
      initRendererElement: function() {
        this.layerElement = ut("g");
      },
      createContainerElements: function() {
        this.matteElement = ut("g"), this.transformedElement = this.layerElement, this.maskedElement = this.layerElement, this._sizeChanged = !1;
        var e = null;
        if (this.data.td) {
          this.matteMasks = {};
          var i = ut("g");
          i.setAttribute("id", this.layerId), i.appendChild(this.layerElement), e = i, this.globalData.defs.appendChild(i);
        } else this.data.tt ? (this.matteElement.appendChild(this.layerElement), e = this.matteElement, this.baseElement = this.matteElement) : this.baseElement = this.layerElement;
        if (this.data.ln && this.layerElement.setAttribute("id", this.data.ln), this.data.cl && this.layerElement.setAttribute("class", this.data.cl), this.data.ty === 0 && !this.data.hd) {
          var s = ut("clipPath"), a = ut("path");
          a.setAttribute("d", "M0,0 L" + this.data.w + ",0 L" + this.data.w + "," + this.data.h + " L0," + this.data.h + "z");
          var o = Gt();
          if (s.setAttribute("id", o), s.appendChild(a), this.globalData.defs.appendChild(s), this.checkMasks()) {
            var c = ut("g");
            c.setAttribute("clip-path", "url(" + j() + "#" + o + ")"), c.appendChild(this.layerElement), this.transformedElement = c, e ? e.appendChild(this.transformedElement) : this.baseElement = this.transformedElement;
          } else
            this.layerElement.setAttribute("clip-path", "url(" + j() + "#" + o + ")");
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
        this.maskManager = new lr(this.data, this, this.globalData), this.renderableEffectsManager = new Xs(this), this.searchEffectTransforms();
      },
      getMatte: function(e) {
        if (this.matteMasks || (this.matteMasks = {}), !this.matteMasks[e]) {
          var i = this.layerId + "_" + e, s, a, o, c;
          if (e === 1 || e === 3) {
            var b = ut("mask");
            b.setAttribute("id", i), b.setAttribute("mask-type", e === 3 ? "luminance" : "alpha"), o = ut("use"), o.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#" + this.layerId), b.appendChild(o), this.globalData.defs.appendChild(b), !Rn.maskType && e === 1 && (b.setAttribute("mask-type", "luminance"), s = Gt(), a = jr.createFilter(s), this.globalData.defs.appendChild(a), a.appendChild(jr.createAlphaToLuminanceFilter()), c = ut("g"), c.appendChild(o), b.appendChild(c), c.setAttribute("filter", "url(" + j() + "#" + s + ")"));
          } else if (e === 2) {
            var u = ut("mask");
            u.setAttribute("id", i), u.setAttribute("mask-type", "alpha");
            var T = ut("g");
            u.appendChild(T), s = Gt(), a = jr.createFilter(s);
            var C = ut("feComponentTransfer");
            C.setAttribute("in", "SourceGraphic"), a.appendChild(C);
            var V = ut("feFuncA");
            V.setAttribute("type", "table"), V.setAttribute("tableValues", "1.0 0.0"), C.appendChild(V), this.globalData.defs.appendChild(a);
            var g = ut("rect");
            g.setAttribute("width", this.comp.data.w), g.setAttribute("height", this.comp.data.h), g.setAttribute("x", "0"), g.setAttribute("y", "0"), g.setAttribute("fill", "#ffffff"), g.setAttribute("opacity", "0"), T.setAttribute("filter", "url(" + j() + "#" + s + ")"), T.appendChild(g), o = ut("use"), o.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#" + this.layerId), T.appendChild(o), Rn.maskType || (u.setAttribute("mask-type", "luminance"), a.appendChild(jr.createAlphaToLuminanceFilter()), c = ut("g"), T.appendChild(g), c.appendChild(this.layerElement), T.appendChild(c)), this.globalData.defs.appendChild(u);
          }
          this.matteMasks[e] = i;
        }
        return this.matteMasks[e];
      },
      setMatte: function(e) {
        this.matteElement && this.matteElement.setAttribute("mask", "url(" + j() + "#" + e + ")");
      }
    };
    function Er() {
    }
    Er.prototype = {
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
    function Hr() {
    }
    (function() {
      var t = {
        initElement: function(i, s, a) {
          this.initFrame(), this.initBaseData(i, s, a), this.initTransform(i, s, a), this.initHierarchy(), this.initRenderable(), this.initRendererElement(), this.createContainerElements(), this.createRenderableComponents(), this.createContent(), this.hide();
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
      H([Ui, O(t)], Hr);
    })();
    function qr(t, e, i) {
      this.assetData = e.getAssetData(t.refId), this.assetData && this.assetData.sid && (this.assetData = e.slotManager.getProp(this.assetData)), this.initElement(t, e, i), this.sourceRect = {
        top: 0,
        left: 0,
        width: this.assetData.w,
        height: this.assetData.h
      };
    }
    H([ji, Cr, Wr, Er, Wi, Hr], qr), qr.prototype.createContent = function() {
      var t = this.globalData.getAssetsPath(this.assetData);
      this.innerElem = ut("image"), this.innerElem.setAttribute("width", this.assetData.w + "px"), this.innerElem.setAttribute("height", this.assetData.h + "px"), this.innerElem.setAttribute("preserveAspectRatio", this.assetData.pr || this.globalData.renderConfig.imagePreserveAspectRatio), this.innerElem.setAttributeNS("http://www.w3.org/1999/xlink", "href", t), this.layerElement.appendChild(this.innerElem);
    }, qr.prototype.sourceRectAtTime = function() {
      return this.sourceRect;
    };
    function wa(t, e) {
      this.elem = t, this.pos = e;
    }
    function Nn() {
    }
    Nn.prototype = {
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
        for (var i = this.processedElements, s = 0, a = i.length; s < a; ) {
          if (i[s].elem === e)
            return i[s].pos;
          s += 1;
        }
        return 0;
      },
      addProcessedElement: function(e, i) {
        for (var s = this.processedElements, a = s.length; a; )
          if (a -= 1, s[a].elem === e) {
            s[a].pos = i;
            return;
          }
        s.push(new wa(e, i));
      },
      prepareFrame: function(e) {
        this.prepareRenderableFrame(e), this.prepareProperties(e, this.isInRange);
      }
    };
    var zn = {
      1: "butt",
      2: "round",
      3: "square"
    }, Dn = {
      1: "miter",
      2: "round",
      3: "bevel"
    };
    function Bn(t, e, i) {
      this.caches = [], this.styles = [], this.transformers = t, this.lStr = "", this.sh = i, this.lvl = e, this._isAnimated = !!i.k;
      for (var s = 0, a = t.length; s < a; ) {
        if (t[s].mProps.dynamicProperties.length) {
          this._isAnimated = !0;
          break;
        }
        s += 1;
      }
    }
    Bn.prototype.setAsAnimated = function() {
      this._isAnimated = !0;
    };
    function Vn(t, e) {
      this.data = t, this.type = t.ty, this.d = "", this.lvl = e, this._mdf = !1, this.closed = t.hd === !0, this.pElem = ut("path"), this.msElem = null;
    }
    Vn.prototype.reset = function() {
      this.d = "", this._mdf = !1;
    };
    function ms(t, e, i, s) {
      this.elem = t, this.frameId = -1, this.dataProps = et(e.length), this.renderer = i, this.k = !1, this.dashStr = "", this.dashArray = rt("float32", e.length ? e.length - 1 : 0), this.dashoffset = rt("float32", 1), this.initDynamicPropertyContainer(s);
      var a, o = e.length || 0, c;
      for (a = 0; a < o; a += 1)
        c = J.getProp(t, e[a].v, 0, 0, this), this.k = c.k || this.k, this.dataProps[a] = {
          n: e[a].n,
          p: c
        };
      this.k || this.getValue(!0), this._isAnimated = this.k;
    }
    ms.prototype.getValue = function(t) {
      if (!(this.elem.globalData.frameId === this.frameId && !t) && (this.frameId = this.elem.globalData.frameId, this.iterateDynamicProperties(), this._mdf = this._mdf || t, this._mdf)) {
        var e = 0, i = this.dataProps.length;
        for (this.renderer === "svg" && (this.dashStr = ""), e = 0; e < i; e += 1)
          this.dataProps[e].n !== "o" ? this.renderer === "svg" ? this.dashStr += " " + this.dataProps[e].p.v : this.dashArray[e] = this.dataProps[e].p.v : this.dashoffset[0] = this.dataProps[e].p.v;
      }
    }, H([Kt], ms);
    function $n(t, e, i) {
      this.initDynamicPropertyContainer(t), this.getValue = this.iterateDynamicProperties, this.o = J.getProp(t, e.o, 0, 0.01, this), this.w = J.getProp(t, e.w, 0, null, this), this.d = new ms(t, e.d || {}, "svg", this), this.c = J.getProp(t, e.c, 1, 255, this), this.style = i, this._isAnimated = !!this._isAnimated;
    }
    H([Kt], $n);
    function Un(t, e, i) {
      this.initDynamicPropertyContainer(t), this.getValue = this.iterateDynamicProperties, this.o = J.getProp(t, e.o, 0, 0.01, this), this.c = J.getProp(t, e.c, 1, 255, this), this.style = i;
    }
    H([Kt], Un);
    function jn(t, e, i) {
      this.initDynamicPropertyContainer(t), this.getValue = this.iterateDynamicProperties, this.style = i;
    }
    H([Kt], jn);
    function Gr(t, e, i) {
      this.data = e, this.c = rt("uint8c", e.p * 4);
      var s = e.k.k[0].s ? e.k.k[0].s.length - e.p * 4 : e.k.k.length - e.p * 4;
      this.o = rt("float32", s), this._cmdf = !1, this._omdf = !1, this._collapsable = this.checkCollapsable(), this._hasOpacity = s, this.initDynamicPropertyContainer(i), this.prop = J.getProp(t, e.k, 1, null, this), this.k = this.prop.k, this.getValue(!0);
    }
    Gr.prototype.comparePoints = function(t, e) {
      for (var i = 0, s = this.o.length / 2, a; i < s; ) {
        if (a = Math.abs(t[i * 4] - t[e * 4 + i * 2]), a > 0.01)
          return !1;
        i += 1;
      }
      return !0;
    }, Gr.prototype.checkCollapsable = function() {
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
    }, Gr.prototype.getValue = function(t) {
      if (this.prop.getValue(), this._mdf = !1, this._cmdf = !1, this._omdf = !1, this.prop._mdf || t) {
        var e, i = this.data.p * 4, s, a;
        for (e = 0; e < i; e += 1)
          s = e % 4 === 0 ? 100 : 255, a = Math.round(this.prop.v[e] * s), this.c[e] !== a && (this.c[e] = a, this._cmdf = !t);
        if (this.o.length)
          for (i = this.prop.v.length, e = this.data.p * 4; e < i; e += 1)
            s = e % 2 === 0 ? 100 : 1, a = e % 2 === 0 ? Math.round(this.prop.v[e] * 100) : this.prop.v[e], this.o[e - this.data.p * 4] !== a && (this.o[e - this.data.p * 4] = a, this._omdf = !t);
        this._mdf = !t;
      }
    }, H([Kt], Gr);
    function Pr(t, e, i) {
      this.initDynamicPropertyContainer(t), this.getValue = this.iterateDynamicProperties, this.initGradientData(t, e, i);
    }
    Pr.prototype.initGradientData = function(t, e, i) {
      this.o = J.getProp(t, e.o, 0, 0.01, this), this.s = J.getProp(t, e.s, 1, null, this), this.e = J.getProp(t, e.e, 1, null, this), this.h = J.getProp(t, e.h || {
        k: 0
      }, 0, 0.01, this), this.a = J.getProp(t, e.a || {
        k: 0
      }, 0, Et, this), this.g = new Gr(t, e.g, this), this.style = i, this.stops = [], this.setGradientData(i.pElem, e), this.setGradientOpacity(e, i), this._isAnimated = !!this._isAnimated;
    }, Pr.prototype.setGradientData = function(t, e) {
      var i = Gt(), s = ut(e.t === 1 ? "linearGradient" : "radialGradient");
      s.setAttribute("id", i), s.setAttribute("spreadMethod", "pad"), s.setAttribute("gradientUnits", "userSpaceOnUse");
      var a = [], o, c, b;
      for (b = e.g.p * 4, c = 0; c < b; c += 4)
        o = ut("stop"), s.appendChild(o), a.push(o);
      t.setAttribute(e.ty === "gf" ? "fill" : "stroke", "url(" + j() + "#" + i + ")"), this.gf = s, this.cst = a;
    }, Pr.prototype.setGradientOpacity = function(t, e) {
      if (this.g._hasOpacity && !this.g._collapsable) {
        var i, s, a, o = ut("mask"), c = ut("path");
        o.appendChild(c);
        var b = Gt(), u = Gt();
        o.setAttribute("id", u);
        var T = ut(t.t === 1 ? "linearGradient" : "radialGradient");
        T.setAttribute("id", b), T.setAttribute("spreadMethod", "pad"), T.setAttribute("gradientUnits", "userSpaceOnUse"), a = t.g.k.k[0].s ? t.g.k.k[0].s.length : t.g.k.k.length;
        var C = this.stops;
        for (s = t.g.p * 4; s < a; s += 2)
          i = ut("stop"), i.setAttribute("stop-color", "rgb(255,255,255)"), T.appendChild(i), C.push(i);
        c.setAttribute(t.ty === "gf" ? "fill" : "stroke", "url(" + j() + "#" + b + ")"), t.ty === "gs" && (c.setAttribute("stroke-linecap", zn[t.lc || 2]), c.setAttribute("stroke-linejoin", Dn[t.lj || 2]), t.lj === 1 && c.setAttribute("stroke-miterlimit", t.ml)), this.of = T, this.ms = o, this.ost = C, this.maskId = u, e.msElem = c;
      }
    }, H([Kt], Pr);
    function Wn(t, e, i) {
      this.initDynamicPropertyContainer(t), this.getValue = this.iterateDynamicProperties, this.w = J.getProp(t, e.w, 0, null, this), this.d = new ms(t, e.d || {}, "svg", this), this.initGradientData(t, e, i), this._isAnimated = !!this._isAnimated;
    }
    H([Pr, Kt], Wn);
    function ka() {
      this.it = [], this.prevViewData = [], this.gr = ut("g");
    }
    function xa(t, e, i) {
      this.transform = {
        mProps: t,
        op: e,
        container: i
      }, this.elements = [], this._isAnimated = this.transform.mProps.dynamicProperties.length || this.transform.op.effectsSequence.length;
    }
    var Hn = function(e, i, s, a) {
      if (i === 0)
        return "";
      var o = e.o, c = e.i, b = e.v, u, T = " M" + a.applyToPointStringified(b[0][0], b[0][1]);
      for (u = 1; u < i; u += 1)
        T += " C" + a.applyToPointStringified(o[u - 1][0], o[u - 1][1]) + " " + a.applyToPointStringified(c[u][0], c[u][1]) + " " + a.applyToPointStringified(b[u][0], b[u][1]);
      return s && i && (T += " C" + a.applyToPointStringified(o[u - 1][0], o[u - 1][1]) + " " + a.applyToPointStringified(c[0][0], c[0][1]) + " " + a.applyToPointStringified(b[0][0], b[0][1]), T += "z"), T;
    }, Ta = function() {
      var t = new Qt(), e = new Qt(), i = {
        createRenderFunction: s
      };
      function s(V) {
        switch (V.ty) {
          case "fl":
            return b;
          case "gf":
            return T;
          case "gs":
            return u;
          case "st":
            return C;
          case "sh":
          case "el":
          case "rc":
          case "sr":
            return c;
          case "tr":
            return a;
          case "no":
            return o;
          default:
            return null;
        }
      }
      function a(V, g, E) {
        (E || g.transform.op._mdf) && g.transform.container.setAttribute("opacity", g.transform.op.v), (E || g.transform.mProps._mdf) && g.transform.container.setAttribute("transform", g.transform.mProps.v.to2dCSS());
      }
      function o() {
      }
      function c(V, g, E) {
        var I, P, N, S, x, d, _ = g.styles.length, A = g.lvl, L, D, U, Y;
        for (d = 0; d < _; d += 1) {
          if (S = g.sh._mdf || E, g.styles[d].lvl < A) {
            for (D = e.reset(), U = A - g.styles[d].lvl, Y = g.transformers.length - 1; !S && U > 0; )
              S = g.transformers[Y].mProps._mdf || S, U -= 1, Y -= 1;
            if (S)
              for (U = A - g.styles[d].lvl, Y = g.transformers.length - 1; U > 0; )
                D.multiply(g.transformers[Y].mProps.v), U -= 1, Y -= 1;
          } else
            D = t;
          if (L = g.sh.paths, P = L._length, S) {
            for (N = "", I = 0; I < P; I += 1)
              x = L.shapes[I], x && x._length && (N += Hn(x, x._length, x.c, D));
            g.caches[d] = N;
          } else
            N = g.caches[d];
          g.styles[d].d += V.hd === !0 ? "" : N, g.styles[d]._mdf = S || g.styles[d]._mdf;
        }
      }
      function b(V, g, E) {
        var I = g.style;
        (g.c._mdf || E) && I.pElem.setAttribute("fill", "rgb(" + Ot(g.c.v[0]) + "," + Ot(g.c.v[1]) + "," + Ot(g.c.v[2]) + ")"), (g.o._mdf || E) && I.pElem.setAttribute("fill-opacity", g.o.v);
      }
      function u(V, g, E) {
        T(V, g, E), C(V, g, E);
      }
      function T(V, g, E) {
        var I = g.gf, P = g.g._hasOpacity, N = g.s.v, S = g.e.v;
        if (g.o._mdf || E) {
          var x = V.ty === "gf" ? "fill-opacity" : "stroke-opacity";
          g.style.pElem.setAttribute(x, g.o.v);
        }
        if (g.s._mdf || E) {
          var d = V.t === 1 ? "x1" : "cx", _ = d === "x1" ? "y1" : "cy";
          I.setAttribute(d, N[0]), I.setAttribute(_, N[1]), P && !g.g._collapsable && (g.of.setAttribute(d, N[0]), g.of.setAttribute(_, N[1]));
        }
        var A, L, D, U;
        if (g.g._cmdf || E) {
          A = g.cst;
          var Y = g.g.c;
          for (D = A.length, L = 0; L < D; L += 1)
            U = A[L], U.setAttribute("offset", Y[L * 4] + "%"), U.setAttribute("stop-color", "rgb(" + Y[L * 4 + 1] + "," + Y[L * 4 + 2] + "," + Y[L * 4 + 3] + ")");
        }
        if (P && (g.g._omdf || E)) {
          var gt = g.g.o;
          for (g.g._collapsable ? A = g.cst : A = g.ost, D = A.length, L = 0; L < D; L += 1)
            U = A[L], g.g._collapsable || U.setAttribute("offset", gt[L * 2] + "%"), U.setAttribute("stop-opacity", gt[L * 2 + 1]);
        }
        if (V.t === 1)
          (g.e._mdf || E) && (I.setAttribute("x2", S[0]), I.setAttribute("y2", S[1]), P && !g.g._collapsable && (g.of.setAttribute("x2", S[0]), g.of.setAttribute("y2", S[1])));
        else {
          var lt;
          if ((g.s._mdf || g.e._mdf || E) && (lt = Math.sqrt(Math.pow(N[0] - S[0], 2) + Math.pow(N[1] - S[1], 2)), I.setAttribute("r", lt), P && !g.g._collapsable && g.of.setAttribute("r", lt)), g.s._mdf || g.e._mdf || g.h._mdf || g.a._mdf || E) {
            lt || (lt = Math.sqrt(Math.pow(N[0] - S[0], 2) + Math.pow(N[1] - S[1], 2)));
            var Q = Math.atan2(S[1] - N[1], S[0] - N[0]), yt = g.h.v;
            yt >= 1 ? yt = 0.99 : yt <= -1 && (yt = -0.99);
            var nt = lt * yt, G = Math.cos(Q + g.a.v) * nt + N[0], w = Math.sin(Q + g.a.v) * nt + N[1];
            I.setAttribute("fx", G), I.setAttribute("fy", w), P && !g.g._collapsable && (g.of.setAttribute("fx", G), g.of.setAttribute("fy", w));
          }
        }
      }
      function C(V, g, E) {
        var I = g.style, P = g.d;
        P && (P._mdf || E) && P.dashStr && (I.pElem.setAttribute("stroke-dasharray", P.dashStr), I.pElem.setAttribute("stroke-dashoffset", P.dashoffset[0])), g.c && (g.c._mdf || E) && I.pElem.setAttribute("stroke", "rgb(" + Ot(g.c.v[0]) + "," + Ot(g.c.v[1]) + "," + Ot(g.c.v[2]) + ")"), (g.o._mdf || E) && I.pElem.setAttribute("stroke-opacity", g.o.v), (g.w._mdf || E) && (I.pElem.setAttribute("stroke-width", g.w.v), I.msElem && I.msElem.setAttribute("stroke-width", g.w.v));
      }
      return i;
    }();
    function te(t, e, i) {
      this.shapes = [], this.shapesData = t.shapes, this.stylesList = [], this.shapeModifiers = [], this.itemsData = [], this.processedElements = [], this.animatedContents = [], this.initElement(t, e, i), this.prevViewData = [];
    }
    H([ji, Cr, Wr, Nn, Er, Wi, Hr], te), te.prototype.initSecondaryElement = function() {
    }, te.prototype.identityMatrix = new Qt(), te.prototype.buildExpressionInterface = function() {
    }, te.prototype.createContent = function() {
      this.searchShapes(this.shapesData, this.itemsData, this.prevViewData, this.layerElement, 0, [], !0), this.filterUniqueShapes();
    }, te.prototype.filterUniqueShapes = function() {
      var t, e = this.shapes.length, i, s, a = this.stylesList.length, o, c = [], b = !1;
      for (s = 0; s < a; s += 1) {
        for (o = this.stylesList[s], b = !1, c.length = 0, t = 0; t < e; t += 1)
          i = this.shapes[t], i.styles.indexOf(o) !== -1 && (c.push(i), b = i._isAnimated || b);
        c.length > 1 && b && this.setShapesAsAnimated(c);
      }
    }, te.prototype.setShapesAsAnimated = function(t) {
      var e, i = t.length;
      for (e = 0; e < i; e += 1)
        t[e].setAsAnimated();
    }, te.prototype.createStyleElement = function(t, e) {
      var i, s = new Vn(t, e), a = s.pElem;
      if (t.ty === "st")
        i = new $n(this, t, s);
      else if (t.ty === "fl")
        i = new Un(this, t, s);
      else if (t.ty === "gf" || t.ty === "gs") {
        var o = t.ty === "gf" ? Pr : Wn;
        i = new o(this, t, s), this.globalData.defs.appendChild(i.gf), i.maskId && (this.globalData.defs.appendChild(i.ms), this.globalData.defs.appendChild(i.of), a.setAttribute("mask", "url(" + j() + "#" + i.maskId + ")"));
      } else t.ty === "no" && (i = new jn(this, t, s));
      return (t.ty === "st" || t.ty === "gs") && (a.setAttribute("stroke-linecap", zn[t.lc || 2]), a.setAttribute("stroke-linejoin", Dn[t.lj || 2]), a.setAttribute("fill-opacity", "0"), t.lj === 1 && a.setAttribute("stroke-miterlimit", t.ml)), t.r === 2 && a.setAttribute("fill-rule", "evenodd"), t.ln && a.setAttribute("id", t.ln), t.cl && a.setAttribute("class", t.cl), t.bm && (a.style["mix-blend-mode"] = ne(t.bm)), this.stylesList.push(s), this.addToAnimatedContents(t, i), i;
    }, te.prototype.createGroupElement = function(t) {
      var e = new ka();
      return t.ln && e.gr.setAttribute("id", t.ln), t.cl && e.gr.setAttribute("class", t.cl), t.bm && (e.gr.style["mix-blend-mode"] = ne(t.bm)), e;
    }, te.prototype.createTransformElement = function(t, e) {
      var i = $i.getTransformProperty(this, t, this), s = new xa(i, i.o, e);
      return this.addToAnimatedContents(t, s), s;
    }, te.prototype.createShapeElement = function(t, e, i) {
      var s = 4;
      t.ty === "rc" ? s = 5 : t.ty === "el" ? s = 6 : t.ty === "sr" && (s = 7);
      var a = Di.getShapeProp(this, t, s, this), o = new Bn(e, i, a);
      return this.shapes.push(o), this.addShapeToModifiers(o), this.addToAnimatedContents(t, o), o;
    }, te.prototype.addToAnimatedContents = function(t, e) {
      for (var i = 0, s = this.animatedContents.length; i < s; ) {
        if (this.animatedContents[i].element === e)
          return;
        i += 1;
      }
      this.animatedContents.push({
        fn: Ta.createRenderFunction(t),
        element: e,
        data: t
      });
    }, te.prototype.setElementStyles = function(t) {
      var e = t.styles, i, s = this.stylesList.length;
      for (i = 0; i < s; i += 1)
        e.indexOf(this.stylesList[i]) === -1 && !this.stylesList[i].closed && e.push(this.stylesList[i]);
    }, te.prototype.reloadShapes = function() {
      this._isFirstFrame = !0;
      var t, e = this.itemsData.length;
      for (t = 0; t < e; t += 1)
        this.prevViewData[t] = this.itemsData[t];
      for (this.searchShapes(this.shapesData, this.itemsData, this.prevViewData, this.layerElement, 0, [], !0), this.filterUniqueShapes(), e = this.dynamicProperties.length, t = 0; t < e; t += 1)
        this.dynamicProperties[t].getValue();
      this.renderModifiers();
    }, te.prototype.searchShapes = function(t, e, i, s, a, o, c) {
      var b = [].concat(o), u, T = t.length - 1, C, V, g = [], E = [], I, P, N;
      for (u = T; u >= 0; u -= 1) {
        if (N = this.searchProcessedElement(t[u]), N ? e[u] = i[N - 1] : t[u]._render = c, t[u].ty === "fl" || t[u].ty === "st" || t[u].ty === "gf" || t[u].ty === "gs" || t[u].ty === "no")
          N ? e[u].style.closed = t[u].hd : e[u] = this.createStyleElement(t[u], a), t[u]._render && e[u].style.pElem.parentNode !== s && s.appendChild(e[u].style.pElem), g.push(e[u].style);
        else if (t[u].ty === "gr") {
          if (!N)
            e[u] = this.createGroupElement(t[u]);
          else
            for (V = e[u].it.length, C = 0; C < V; C += 1)
              e[u].prevViewData[C] = e[u].it[C];
          this.searchShapes(t[u].it, e[u].it, e[u].prevViewData, e[u].gr, a + 1, b, c), t[u]._render && e[u].gr.parentNode !== s && s.appendChild(e[u].gr);
        } else t[u].ty === "tr" ? (N || (e[u] = this.createTransformElement(t[u], s)), I = e[u].transform, b.push(I)) : t[u].ty === "sh" || t[u].ty === "rc" || t[u].ty === "el" || t[u].ty === "sr" ? (N || (e[u] = this.createShapeElement(t[u], b, a)), this.setElementStyles(e[u])) : t[u].ty === "tm" || t[u].ty === "rd" || t[u].ty === "ms" || t[u].ty === "pb" || t[u].ty === "zz" || t[u].ty === "op" ? (N ? (P = e[u], P.closed = !1) : (P = ri.getModifier(t[u].ty), P.init(this, t[u]), e[u] = P, this.shapeModifiers.push(P)), E.push(P)) : t[u].ty === "rp" && (N ? (P = e[u], P.closed = !0) : (P = ri.getModifier(t[u].ty), e[u] = P, P.init(this, t, u, e), this.shapeModifiers.push(P), c = !1), E.push(P));
        this.addProcessedElement(t[u], u + 1);
      }
      for (T = g.length, u = 0; u < T; u += 1)
        g[u].closed = !0;
      for (T = E.length, u = 0; u < T; u += 1)
        E[u].closed = !0;
    }, te.prototype.renderInnerContent = function() {
      this.renderModifiers();
      var t, e = this.stylesList.length;
      for (t = 0; t < e; t += 1)
        this.stylesList[t].reset();
      for (this.renderShape(), t = 0; t < e; t += 1)
        (this.stylesList[t]._mdf || this._isFirstFrame) && (this.stylesList[t].msElem && (this.stylesList[t].msElem.setAttribute("d", this.stylesList[t].d), this.stylesList[t].d = "M0 0" + this.stylesList[t].d), this.stylesList[t].pElem.setAttribute("d", this.stylesList[t].d || "M0 0"));
    }, te.prototype.renderShape = function() {
      var t, e = this.animatedContents.length, i;
      for (t = 0; t < e; t += 1)
        i = this.animatedContents[t], (this._isFirstFrame || i.element._isAnimated) && i.data !== !0 && i.fn(i.data, i.element, this._isFirstFrame);
    }, te.prototype.destroy = function() {
      this.destroyBaseElement(), this.shapesData = null, this.itemsData = null;
    };
    function Zs(t, e, i, s, a, o) {
      this.o = t, this.sw = e, this.sc = i, this.fc = s, this.m = a, this.p = o, this._mdf = {
        o: !0,
        sw: !!e,
        sc: !!i,
        fc: !!s,
        m: !0,
        p: !0
      };
    }
    Zs.prototype.update = function(t, e, i, s, a, o) {
      this._mdf.o = !1, this._mdf.sw = !1, this._mdf.sc = !1, this._mdf.fc = !1, this._mdf.m = !1, this._mdf.p = !1;
      var c = !1;
      return this.o !== t && (this.o = t, this._mdf.o = !0, c = !0), this.sw !== e && (this.sw = e, this._mdf.sw = !0, c = !0), this.sc !== i && (this.sc = i, this._mdf.sc = !0, c = !0), this.fc !== s && (this.fc = s, this._mdf.fc = !0, c = !0), this.m !== a && (this.m = a, this._mdf.m = !0, c = !0), o.length && (this.p[0] !== o[0] || this.p[1] !== o[1] || this.p[4] !== o[4] || this.p[5] !== o[5] || this.p[12] !== o[12] || this.p[13] !== o[13]) && (this.p = o, this._mdf.p = !0, c = !0), c;
    };
    function Te(t, e) {
      this._frameId = m, this.pv = "", this.v = "", this.kf = !1, this._isFirstFrame = !0, this._mdf = !1, e.d && e.d.sid && (e.d = t.globalData.slotManager.getProp(e.d)), this.data = e, this.elem = t, this.comp = this.elem.comp, this.keysIndex = 0, this.canResize = !1, this.minimumFontSize = 1, this.effectsSequence = [], this.currentData = {
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
    Te.prototype.defaultBoxWidth = [0, 0], Te.prototype.copyData = function(t, e) {
      for (var i in e)
        Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
      return t;
    }, Te.prototype.setCurrentData = function(t) {
      t.__complete || this.completeTextData(t), this.currentData = t, this.currentData.boxWidth = this.currentData.boxWidth || this.defaultBoxWidth, this._mdf = !0;
    }, Te.prototype.searchProperty = function() {
      return this.searchKeyframes();
    }, Te.prototype.searchKeyframes = function() {
      return this.kf = this.data.d.k.length > 1, this.kf && this.addEffect(this.getKeyframeValue.bind(this)), this.kf;
    }, Te.prototype.addEffect = function(t) {
      this.effectsSequence.push(t), this.elem.addDynamicProperty(this);
    }, Te.prototype.getValue = function(t) {
      if (!((this.elem.globalData.frameId === this.frameId || !this.effectsSequence.length) && !t)) {
        this.currentData.t = this.data.d.k[this.keysIndex].s.t;
        var e = this.currentData, i = this.keysIndex;
        if (this.lock) {
          this.setCurrentData(this.currentData);
          return;
        }
        this.lock = !0, this._mdf = !1;
        var s, a = this.effectsSequence.length, o = t || this.data.d.k[this.keysIndex].s;
        for (s = 0; s < a; s += 1)
          i !== this.keysIndex ? o = this.effectsSequence[s](o, o.t) : o = this.effectsSequence[s](this.currentData, o.t);
        e !== o && this.setCurrentData(o), this.v = this.currentData, this.pv = this.v, this.lock = !1, this.frameId = this.elem.globalData.frameId;
      }
    }, Te.prototype.getKeyframeValue = function() {
      for (var t = this.data.d.k, e = this.elem.comp.renderedFrame, i = 0, s = t.length; i <= s - 1 && !(i === s - 1 || t[i + 1].t > e); )
        i += 1;
      return this.keysIndex !== i && (this.keysIndex = i), this.data.d.k[this.keysIndex].s;
    }, Te.prototype.buildFinalText = function(t) {
      for (var e = [], i = 0, s = t.length, a, o, c = !1, b = !1, u = ""; i < s; )
        c = b, b = !1, a = t.charCodeAt(i), u = t.charAt(i), Pt.isCombinedCharacter(a) ? c = !0 : a >= 55296 && a <= 56319 ? Pt.isRegionalFlag(t, i) ? u = t.substr(i, 14) : (o = t.charCodeAt(i + 1), o >= 56320 && o <= 57343 && (Pt.isModifier(a, o) ? (u = t.substr(i, 2), c = !0) : Pt.isFlagEmoji(t.substr(i, 4)) ? u = t.substr(i, 4) : u = t.substr(i, 2))) : a > 56319 ? (o = t.charCodeAt(i + 1), Pt.isVariationSelector(a) && (c = !0)) : Pt.isZeroWidthJoiner(a) && (c = !0, b = !0), c ? (e[e.length - 1] += u, c = !1) : e.push(u), i += u.length;
      return e;
    }, Te.prototype.completeTextData = function(t) {
      t.__complete = !0;
      var e = this.elem.globalData.fontManager, i = this.data, s = [], a, o, c, b = 0, u, T = i.m.g, C = 0, V = 0, g = 0, E = [], I = 0, P = 0, N, S, x = e.getFontByName(t.f), d, _ = 0, A = Rt(x);
      t.fWeight = A.weight, t.fStyle = A.style, t.finalSize = t.s, t.finalText = this.buildFinalText(t.t), o = t.finalText.length, t.finalLineHeight = t.lh;
      var L = t.tr / 1e3 * t.finalSize, D;
      if (t.sz)
        for (var U = !0, Y = t.sz[0], gt = t.sz[1], lt, Q; U; ) {
          Q = this.buildFinalText(t.t), lt = 0, I = 0, o = Q.length, L = t.tr / 1e3 * t.finalSize;
          var yt = -1;
          for (a = 0; a < o; a += 1)
            D = Q[a].charCodeAt(0), c = !1, Q[a] === " " ? yt = a : (D === 13 || D === 3) && (I = 0, c = !0, lt += t.finalLineHeight || t.finalSize * 1.2), e.chars ? (d = e.getCharData(Q[a], x.fStyle, x.fFamily), _ = c ? 0 : d.w * t.finalSize / 100) : _ = e.measureText(Q[a], t.f, t.finalSize), I + _ > Y && Q[a] !== " " ? (yt === -1 ? o += 1 : a = yt, lt += t.finalLineHeight || t.finalSize * 1.2, Q.splice(a, yt === a ? 1 : 0, "\r"), yt = -1, I = 0) : (I += _, I += L);
          lt += x.ascent * t.finalSize / 100, this.canResize && t.finalSize > this.minimumFontSize && gt < lt ? (t.finalSize -= 1, t.finalLineHeight = t.finalSize * t.lh / t.s) : (t.finalText = Q, o = t.finalText.length, U = !1);
        }
      I = -L, _ = 0;
      var nt = 0, G;
      for (a = 0; a < o; a += 1)
        if (c = !1, G = t.finalText[a], D = G.charCodeAt(0), D === 13 || D === 3 ? (nt = 0, E.push(I), P = I > P ? I : P, I = -2 * L, u = "", c = !0, g += 1) : u = G, e.chars ? (d = e.getCharData(G, x.fStyle, e.getFontByName(t.f).fFamily), _ = c ? 0 : d.w * t.finalSize / 100) : _ = e.measureText(u, t.f, t.finalSize), G === " " ? nt += _ + L : (I += _ + L + nt, nt = 0), s.push({
          l: _,
          an: _,
          add: C,
          n: c,
          anIndexes: [],
          val: u,
          line: g,
          animatorJustifyOffset: 0
        }), T == 2) {
          if (C += _, u === "" || u === " " || a === o - 1) {
            for ((u === "" || u === " ") && (C -= _); V <= a; )
              s[V].an = C, s[V].ind = b, s[V].extra = _, V += 1;
            b += 1, C = 0;
          }
        } else if (T == 3) {
          if (C += _, u === "" || a === o - 1) {
            for (u === "" && (C -= _); V <= a; )
              s[V].an = C, s[V].ind = b, s[V].extra = _, V += 1;
            C = 0, b += 1;
          }
        } else
          s[b].ind = b, s[b].extra = 0, b += 1;
      if (t.l = s, P = I > P ? I : P, E.push(I), t.sz)
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
      t.lineWidths = E;
      var w = i.a, M, f;
      S = w.length;
      var p, $, R = [];
      for (N = 0; N < S; N += 1) {
        for (M = w[N], M.a.sc && (t.strokeColorAnim = !0), M.a.sw && (t.strokeWidthAnim = !0), (M.a.fc || M.a.fh || M.a.fs || M.a.fb) && (t.fillColorAnim = !0), $ = 0, p = M.s.b, a = 0; a < o; a += 1)
          f = s[a], f.anIndexes[N] = $, (p == 1 && f.val !== "" || p == 2 && f.val !== "" && f.val !== " " || p == 3 && (f.n || f.val == " " || a == o - 1) || p == 4 && (f.n || a == o - 1)) && (M.s.rn === 1 && R.push($), $ += 1);
        i.a[N].s.totalChars = $;
        var st = -1, pt;
        if (M.s.rn === 1)
          for (a = 0; a < o; a += 1)
            f = s[a], st != f.anIndexes[N] && (st = f.anIndexes[N], pt = R.splice(Math.floor(Math.random() * R.length), 1)[0]), f.anIndexes[N] = pt;
      }
      t.yOffset = t.finalLineHeight || t.finalSize * 1.2, t.ls = t.ls || 0, t.ascent = x.ascent * t.finalSize / 100;
    }, Te.prototype.updateDocumentData = function(t, e) {
      e = e === void 0 ? this.keysIndex : e;
      var i = this.copyData({}, this.data.d.k[e].s);
      i = this.copyData(i, t), this.data.d.k[e].s = i, this.recalculate(e), this.setCurrentData(i), this.elem.addDynamicProperty(this);
    }, Te.prototype.recalculate = function(t) {
      var e = this.data.d.k[t].s;
      e.__complete = !1, this.keysIndex = 0, this._isFirstFrame = !0, this.getValue(e);
    }, Te.prototype.canResizeFont = function(t) {
      this.canResize = t, this.recalculate(this.keysIndex), this.elem.addDynamicProperty(this);
    }, Te.prototype.setMinimumFontSize = function(t) {
      this.minimumFontSize = Math.floor(t) || 1, this.recalculate(this.keysIndex), this.elem.addDynamicProperty(this);
    };
    var Aa = function() {
      var t = Math.max, e = Math.min, i = Math.floor;
      function s(o, c) {
        this._currentTextLength = -1, this.k = !1, this.data = c, this.elem = o, this.comp = o.comp, this.finalS = 0, this.finalE = 0, this.initDynamicPropertyContainer(o), this.s = J.getProp(o, c.s || {
          k: 0
        }, 0, 0, this), "e" in c ? this.e = J.getProp(o, c.e, 0, 0, this) : this.e = {
          v: 100
        }, this.o = J.getProp(o, c.o || {
          k: 0
        }, 0, 0, this), this.xe = J.getProp(o, c.xe || {
          k: 0
        }, 0, 0, this), this.ne = J.getProp(o, c.ne || {
          k: 0
        }, 0, 0, this), this.sm = J.getProp(o, c.sm || {
          k: 100
        }, 0, 0, this), this.a = J.getProp(o, c.a, 0, 0.01, this), this.dynamicProperties.length || this.getValue();
      }
      s.prototype = {
        getMult: function(c) {
          this._currentTextLength !== this.elem.textProperty.currentData.l.length && this.getValue();
          var b = 0, u = 0, T = 1, C = 1;
          this.ne.v > 0 ? b = this.ne.v / 100 : u = -this.ne.v / 100, this.xe.v > 0 ? T = 1 - this.xe.v / 100 : C = 1 + this.xe.v / 100;
          var V = ei.getBezierEasing(b, u, T, C).get, g = 0, E = this.finalS, I = this.finalE, P = this.data.sh;
          if (P === 2)
            I === E ? g = c >= I ? 1 : 0 : g = t(0, e(0.5 / (I - E) + (c - E) / (I - E), 1)), g = V(g);
          else if (P === 3)
            I === E ? g = c >= I ? 0 : 1 : g = 1 - t(0, e(0.5 / (I - E) + (c - E) / (I - E), 1)), g = V(g);
          else if (P === 4)
            I === E ? g = 0 : (g = t(0, e(0.5 / (I - E) + (c - E) / (I - E), 1)), g < 0.5 ? g *= 2 : g = 1 - 2 * (g - 0.5)), g = V(g);
          else if (P === 5) {
            if (I === E)
              g = 0;
            else {
              var N = I - E;
              c = e(t(0, c + 0.5 - E), I - E);
              var S = -N / 2 + c, x = N / 2;
              g = Math.sqrt(1 - S * S / (x * x));
            }
            g = V(g);
          } else P === 6 ? (I === E ? g = 0 : (c = e(t(0, c + 0.5 - E), I - E), g = (1 + Math.cos(Math.PI + Math.PI * 2 * c / (I - E))) / 2), g = V(g)) : (c >= i(E) && (c - E < 0 ? g = t(0, e(e(I, 1) - (E - c), 1)) : g = t(0, e(I - c, 1))), g = V(g));
          if (this.sm.v !== 100) {
            var d = this.sm.v * 0.01;
            d === 0 && (d = 1e-8);
            var _ = 0.5 - d * 0.5;
            g < _ ? g = 0 : (g = (g - _) / d, g > 1 && (g = 1));
          }
          return g * this.a.v;
        },
        getValue: function(c) {
          this.iterateDynamicProperties(), this._mdf = c || this._mdf, this._currentTextLength = this.elem.textProperty.currentData.l.length || 0, c && this.data.r === 2 && (this.e.v = this._currentTextLength);
          var b = this.data.r === 2 ? 1 : 100 / this.data.totalChars, u = this.o.v / b, T = this.s.v / b + u, C = this.e.v / b + u;
          if (T > C) {
            var V = T;
            T = C, C = V;
          }
          this.finalS = T, this.finalE = C;
        }
      }, H([Kt], s);
      function a(o, c, b) {
        return new s(o, c);
      }
      return {
        getTextSelectorProp: a
      };
    }();
    function Sa(t, e, i) {
      var s = {
        propType: !1
      }, a = J.getProp, o = e.a;
      this.a = {
        r: o.r ? a(t, o.r, 0, Et, i) : s,
        rx: o.rx ? a(t, o.rx, 0, Et, i) : s,
        ry: o.ry ? a(t, o.ry, 0, Et, i) : s,
        sk: o.sk ? a(t, o.sk, 0, Et, i) : s,
        sa: o.sa ? a(t, o.sa, 0, Et, i) : s,
        s: o.s ? a(t, o.s, 1, 0.01, i) : s,
        a: o.a ? a(t, o.a, 1, 0, i) : s,
        o: o.o ? a(t, o.o, 0, 0.01, i) : s,
        p: o.p ? a(t, o.p, 1, 0, i) : s,
        sw: o.sw ? a(t, o.sw, 0, 0, i) : s,
        sc: o.sc ? a(t, o.sc, 1, 0, i) : s,
        fc: o.fc ? a(t, o.fc, 1, 0, i) : s,
        fh: o.fh ? a(t, o.fh, 0, 0, i) : s,
        fs: o.fs ? a(t, o.fs, 0, 0.01, i) : s,
        fb: o.fb ? a(t, o.fb, 0, 0.01, i) : s,
        t: o.t ? a(t, o.t, 0, 0, i) : s
      }, this.s = Aa.getTextSelectorProp(t, e.s, i), this.s.t = e.s.t;
    }
    function hr(t, e, i) {
      this._isFirstFrame = !0, this._hasMaskedPath = !1, this._frameId = -1, this._textData = t, this._renderType = e, this._elem = i, this._animatorsData = et(this._textData.a.length), this._pathData = {}, this._moreOptions = {
        alignment: {}
      }, this.renderedLetters = [], this.lettersChangedFlag = !1, this.initDynamicPropertyContainer(i);
    }
    hr.prototype.searchProperties = function() {
      var t, e = this._textData.a.length, i, s = J.getProp;
      for (t = 0; t < e; t += 1)
        i = this._textData.a[t], this._animatorsData[t] = new Sa(this._elem, i, this);
      this._textData.p && "m" in this._textData.p ? (this._pathData = {
        a: s(this._elem, this._textData.p.a, 0, 0, this),
        f: s(this._elem, this._textData.p.f, 0, 0, this),
        l: s(this._elem, this._textData.p.l, 0, 0, this),
        r: s(this._elem, this._textData.p.r, 0, 0, this),
        p: s(this._elem, this._textData.p.p, 0, 0, this),
        m: this._elem.maskManager.getMaskProperty(this._textData.p.m)
      }, this._hasMaskedPath = !0) : this._hasMaskedPath = !1, this._moreOptions.alignment = s(this._elem, this._textData.m.a, 1, 0, this);
    }, hr.prototype.getMeasures = function(t, e) {
      if (this.lettersChangedFlag = e, !(!this._mdf && !this._isFirstFrame && !e && (!this._hasMaskedPath || !this._pathData.m._mdf))) {
        this._isFirstFrame = !1;
        var i = this._moreOptions.alignment.v, s = this._animatorsData, a = this._textData, o = this.mHelper, c = this._renderType, b = this.renderedLetters.length, u, T, C, V, g = t.l, E, I, P, N, S, x, d, _, A, L, D, U, Y, gt, lt;
        if (this._hasMaskedPath) {
          if (lt = this._pathData.m, !this._pathData.n || this._pathData._mdf) {
            var Q = lt.v;
            this._pathData.r.v && (Q = Q.reverse()), E = {
              tLength: 0,
              segments: []
            }, V = Q._length - 1;
            var yt;
            for (U = 0, C = 0; C < V; C += 1)
              yt = bt.buildBezierData(Q.v[C], Q.v[C + 1], [Q.o[C][0] - Q.v[C][0], Q.o[C][1] - Q.v[C][1]], [Q.i[C + 1][0] - Q.v[C + 1][0], Q.i[C + 1][1] - Q.v[C + 1][1]]), E.tLength += yt.segmentLength, E.segments.push(yt), U += yt.segmentLength;
            C = V, lt.v.c && (yt = bt.buildBezierData(Q.v[C], Q.v[0], [Q.o[C][0] - Q.v[C][0], Q.o[C][1] - Q.v[C][1]], [Q.i[0][0] - Q.v[0][0], Q.i[0][1] - Q.v[0][1]]), E.tLength += yt.segmentLength, E.segments.push(yt), U += yt.segmentLength), this._pathData.pi = E;
          }
          if (E = this._pathData.pi, I = this._pathData.f.v, d = 0, x = 1, N = 0, S = !0, L = E.segments, I < 0 && lt.v.c)
            for (E.tLength < Math.abs(I) && (I = -Math.abs(I) % E.tLength), d = L.length - 1, A = L[d].points, x = A.length - 1; I < 0; )
              I += A[x].partialLength, x -= 1, x < 0 && (d -= 1, A = L[d].points, x = A.length - 1);
          A = L[d].points, _ = A[x - 1], P = A[x], D = P.partialLength;
        }
        V = g.length, u = 0, T = 0;
        var nt = t.finalSize * 1.2 * 0.714, G = !0, w, M, f, p, $;
        p = s.length;
        var R, st = -1, pt, vt, At, St = I, oe = d, Pe = x, oi = -1, Me, de, Ne, zt, at, wi, Gi, ki, ai = "", xi = this.defaultPropsArray, Ti;
        if (t.j === 2 || t.j === 1) {
          var Ie = 0, Yi = 0, Xi = t.j === 2 ? -0.5 : -1, Ze = 0, Zi = !0;
          for (C = 0; C < V; C += 1)
            if (g[C].n) {
              for (Ie && (Ie += Yi); Ze < C; )
                g[Ze].animatorJustifyOffset = Ie, Ze += 1;
              Ie = 0, Zi = !0;
            } else {
              for (f = 0; f < p; f += 1)
                w = s[f].a, w.t.propType && (Zi && t.j === 2 && (Yi += w.t.v * Xi), M = s[f].s, R = M.getMult(g[C].anIndexes[f], a.a[f].s.totalChars), R.length ? Ie += w.t.v * R[0] * Xi : Ie += w.t.v * R * Xi);
              Zi = !1;
            }
          for (Ie && (Ie += Yi); Ze < C; )
            g[Ze].animatorJustifyOffset = Ie, Ze += 1;
        }
        for (C = 0; C < V; C += 1) {
          if (o.reset(), Me = 1, g[C].n)
            u = 0, T += t.yOffset, T += G ? 1 : 0, I = St, G = !1, this._hasMaskedPath && (d = oe, x = Pe, A = L[d].points, _ = A[x - 1], P = A[x], D = P.partialLength, N = 0), ai = "", ki = "", wi = "", Ti = "", xi = this.defaultPropsArray;
          else {
            if (this._hasMaskedPath) {
              if (oi !== g[C].line) {
                switch (t.j) {
                  case 1:
                    I += U - t.lineWidths[g[C].line];
                    break;
                  case 2:
                    I += (U - t.lineWidths[g[C].line]) / 2;
                    break;
                }
                oi = g[C].line;
              }
              st !== g[C].ind && (g[st] && (I += g[st].extra), I += g[C].an / 2, st = g[C].ind), I += i[0] * g[C].an * 5e-3;
              var Ke = 0;
              for (f = 0; f < p; f += 1)
                w = s[f].a, w.p.propType && (M = s[f].s, R = M.getMult(g[C].anIndexes[f], a.a[f].s.totalChars), R.length ? Ke += w.p.v[0] * R[0] : Ke += w.p.v[0] * R), w.a.propType && (M = s[f].s, R = M.getMult(g[C].anIndexes[f], a.a[f].s.totalChars), R.length ? Ke += w.a.v[0] * R[0] : Ke += w.a.v[0] * R);
              for (S = !0, this._pathData.a.v && (I = g[0].an * 0.5 + (U - this._pathData.f.v - g[0].an * 0.5 - g[g.length - 1].an * 0.5) * st / (V - 1), I += this._pathData.f.v); S; )
                N + D >= I + Ke || !A ? (Y = (I + Ke - N) / P.partialLength, vt = _.point[0] + (P.point[0] - _.point[0]) * Y, At = _.point[1] + (P.point[1] - _.point[1]) * Y, o.translate(-i[0] * g[C].an * 5e-3, -(i[1] * nt) * 0.01), S = !1) : A && (N += P.partialLength, x += 1, x >= A.length && (x = 0, d += 1, L[d] ? A = L[d].points : lt.v.c ? (x = 0, d = 0, A = L[d].points) : (N -= P.partialLength, A = null)), A && (_ = P, P = A[x], D = P.partialLength));
              pt = g[C].an / 2 - g[C].add, o.translate(-pt, 0, 0);
            } else
              pt = g[C].an / 2 - g[C].add, o.translate(-pt, 0, 0), o.translate(-i[0] * g[C].an * 5e-3, -i[1] * nt * 0.01, 0);
            for (f = 0; f < p; f += 1)
              w = s[f].a, w.t.propType && (M = s[f].s, R = M.getMult(g[C].anIndexes[f], a.a[f].s.totalChars), (u !== 0 || t.j !== 0) && (this._hasMaskedPath ? R.length ? I += w.t.v * R[0] : I += w.t.v * R : R.length ? u += w.t.v * R[0] : u += w.t.v * R));
            for (t.strokeWidthAnim && (Ne = t.sw || 0), t.strokeColorAnim && (t.sc ? de = [t.sc[0], t.sc[1], t.sc[2]] : de = [0, 0, 0]), t.fillColorAnim && t.fc && (zt = [t.fc[0], t.fc[1], t.fc[2]]), f = 0; f < p; f += 1)
              w = s[f].a, w.a.propType && (M = s[f].s, R = M.getMult(g[C].anIndexes[f], a.a[f].s.totalChars), R.length ? o.translate(-w.a.v[0] * R[0], -w.a.v[1] * R[1], w.a.v[2] * R[2]) : o.translate(-w.a.v[0] * R, -w.a.v[1] * R, w.a.v[2] * R));
            for (f = 0; f < p; f += 1)
              w = s[f].a, w.s.propType && (M = s[f].s, R = M.getMult(g[C].anIndexes[f], a.a[f].s.totalChars), R.length ? o.scale(1 + (w.s.v[0] - 1) * R[0], 1 + (w.s.v[1] - 1) * R[1], 1) : o.scale(1 + (w.s.v[0] - 1) * R, 1 + (w.s.v[1] - 1) * R, 1));
            for (f = 0; f < p; f += 1) {
              if (w = s[f].a, M = s[f].s, R = M.getMult(g[C].anIndexes[f], a.a[f].s.totalChars), w.sk.propType && (R.length ? o.skewFromAxis(-w.sk.v * R[0], w.sa.v * R[1]) : o.skewFromAxis(-w.sk.v * R, w.sa.v * R)), w.r.propType && (R.length ? o.rotateZ(-w.r.v * R[2]) : o.rotateZ(-w.r.v * R)), w.ry.propType && (R.length ? o.rotateY(w.ry.v * R[1]) : o.rotateY(w.ry.v * R)), w.rx.propType && (R.length ? o.rotateX(w.rx.v * R[0]) : o.rotateX(w.rx.v * R)), w.o.propType && (R.length ? Me += (w.o.v * R[0] - Me) * R[0] : Me += (w.o.v * R - Me) * R), t.strokeWidthAnim && w.sw.propType && (R.length ? Ne += w.sw.v * R[0] : Ne += w.sw.v * R), t.strokeColorAnim && w.sc.propType)
                for (at = 0; at < 3; at += 1)
                  R.length ? de[at] += (w.sc.v[at] - de[at]) * R[0] : de[at] += (w.sc.v[at] - de[at]) * R;
              if (t.fillColorAnim && t.fc) {
                if (w.fc.propType)
                  for (at = 0; at < 3; at += 1)
                    R.length ? zt[at] += (w.fc.v[at] - zt[at]) * R[0] : zt[at] += (w.fc.v[at] - zt[at]) * R;
                w.fh.propType && (R.length ? zt = br(zt, w.fh.v * R[0]) : zt = br(zt, w.fh.v * R)), w.fs.propType && (R.length ? zt = ui(zt, w.fs.v * R[0]) : zt = ui(zt, w.fs.v * R)), w.fb.propType && (R.length ? zt = _r(zt, w.fb.v * R[0]) : zt = _r(zt, w.fb.v * R));
              }
            }
            for (f = 0; f < p; f += 1)
              w = s[f].a, w.p.propType && (M = s[f].s, R = M.getMult(g[C].anIndexes[f], a.a[f].s.totalChars), this._hasMaskedPath ? R.length ? o.translate(0, w.p.v[1] * R[0], -w.p.v[2] * R[1]) : o.translate(0, w.p.v[1] * R, -w.p.v[2] * R) : R.length ? o.translate(w.p.v[0] * R[0], w.p.v[1] * R[1], -w.p.v[2] * R[2]) : o.translate(w.p.v[0] * R, w.p.v[1] * R, -w.p.v[2] * R));
            if (t.strokeWidthAnim && (wi = Ne < 0 ? 0 : Ne), t.strokeColorAnim && (Gi = "rgb(" + Math.round(de[0] * 255) + "," + Math.round(de[1] * 255) + "," + Math.round(de[2] * 255) + ")"), t.fillColorAnim && t.fc && (ki = "rgb(" + Math.round(zt[0] * 255) + "," + Math.round(zt[1] * 255) + "," + Math.round(zt[2] * 255) + ")"), this._hasMaskedPath) {
              if (o.translate(0, -t.ls), o.translate(0, i[1] * nt * 0.01 + T, 0), this._pathData.p.v) {
                gt = (P.point[1] - _.point[1]) / (P.point[0] - _.point[0]);
                var fr = Math.atan(gt) * 180 / Math.PI;
                P.point[0] < _.point[0] && (fr += 180), o.rotate(-fr * Math.PI / 180);
              }
              o.translate(vt, At, 0), I -= i[0] * g[C].an * 5e-3, g[C + 1] && st !== g[C + 1].ind && (I += g[C].an / 2, I += t.tr * 1e-3 * t.finalSize);
            } else {
              switch (o.translate(u, T, 0), t.ps && o.translate(t.ps[0], t.ps[1] + t.ascent, 0), t.j) {
                case 1:
                  o.translate(g[C].animatorJustifyOffset + t.justifyOffset + (t.boxWidth - t.lineWidths[g[C].line]), 0, 0);
                  break;
                case 2:
                  o.translate(g[C].animatorJustifyOffset + t.justifyOffset + (t.boxWidth - t.lineWidths[g[C].line]) / 2, 0, 0);
                  break;
              }
              o.translate(0, -t.ls), o.translate(pt, 0, 0), o.translate(i[0] * g[C].an * 5e-3, i[1] * nt * 0.01, 0), u += g[C].l + t.tr * 1e-3 * t.finalSize;
            }
            c === "html" ? ai = o.toCSS() : c === "svg" ? ai = o.to2dCSS() : xi = [o.props[0], o.props[1], o.props[2], o.props[3], o.props[4], o.props[5], o.props[6], o.props[7], o.props[8], o.props[9], o.props[10], o.props[11], o.props[12], o.props[13], o.props[14], o.props[15]], Ti = Me;
          }
          b <= C ? ($ = new Zs(Ti, wi, Gi, ki, ai, xi), this.renderedLetters.push($), b += 1, this.lettersChangedFlag = !0) : ($ = this.renderedLetters[C], this.lettersChangedFlag = $.update(Ti, wi, Gi, ki, ai, xi) || this.lettersChangedFlag);
        }
      }
    }, hr.prototype.getValue = function() {
      this._elem.globalData.frameId !== this._frameId && (this._frameId = this._elem.globalData.frameId, this.iterateDynamicProperties());
    }, hr.prototype.mHelper = new Qt(), hr.prototype.defaultPropsArray = [], H([Kt], hr);
    function Ue() {
    }
    Ue.prototype.initElement = function(t, e, i) {
      this.lettersChangedFlag = !0, this.initFrame(), this.initBaseData(t, e, i), this.textProperty = new Te(this, t.t, this.dynamicProperties), this.textAnimator = new hr(t.t, this.renderType, this), this.initTransform(t, e, i), this.initHierarchy(), this.initRenderable(), this.initRendererElement(), this.createContainerElements(), this.createRenderableComponents(), this.createContent(), this.hide(), this.textAnimator.searchProperties(this.dynamicProperties);
    }, Ue.prototype.prepareFrame = function(t) {
      this._mdf = !1, this.prepareRenderableFrame(t), this.prepareProperties(t, this.isInRange);
    }, Ue.prototype.createPathShape = function(t, e) {
      var i, s = e.length, a, o = "";
      for (i = 0; i < s; i += 1)
        e[i].ty === "sh" && (a = e[i].ks.k, o += Hn(a, a.i.length, !0, t));
      return o;
    }, Ue.prototype.updateDocumentData = function(t, e) {
      this.textProperty.updateDocumentData(t, e);
    }, Ue.prototype.canResizeFont = function(t) {
      this.textProperty.canResizeFont(t);
    }, Ue.prototype.setMinimumFontSize = function(t) {
      this.textProperty.setMinimumFontSize(t);
    }, Ue.prototype.applyTextPropertiesToMatrix = function(t, e, i, s, a) {
      switch (t.ps && e.translate(t.ps[0], t.ps[1] + t.ascent, 0), e.translate(0, -t.ls, 0), t.j) {
        case 1:
          e.translate(t.justifyOffset + (t.boxWidth - t.lineWidths[i]), 0, 0);
          break;
        case 2:
          e.translate(t.justifyOffset + (t.boxWidth - t.lineWidths[i]) / 2, 0, 0);
          break;
      }
      e.translate(s, a, 0);
    }, Ue.prototype.buildColor = function(t) {
      return "rgb(" + Math.round(t[0] * 255) + "," + Math.round(t[1] * 255) + "," + Math.round(t[2] * 255) + ")";
    }, Ue.prototype.emptyProp = new Zs(), Ue.prototype.destroy = function() {
    }, Ue.prototype.validateText = function() {
      (this.textProperty._mdf || this.textProperty._isFirstFrame) && (this.buildNewText(), this.textProperty._isFirstFrame = !1, this.textProperty._mdf = !1);
    };
    var Ca = {
      shapes: []
    };
    function _i(t, e, i) {
      this.textSpans = [], this.renderType = "svg", this.initElement(t, e, i);
    }
    H([ji, Cr, Wr, Er, Wi, Hr, Ue], _i), _i.prototype.createContent = function() {
      this.data.singleShape && !this.globalData.fontManager.chars && (this.textContainer = ut("text"));
    }, _i.prototype.buildTextContents = function(t) {
      for (var e = 0, i = t.length, s = [], a = ""; e < i; )
        t[e] === "\r" || t[e] === "" ? (s.push(a), a = "") : a += t[e], e += 1;
      return s.push(a), s;
    }, _i.prototype.buildShapeData = function(t, e) {
      if (t.shapes && t.shapes.length) {
        var i = t.shapes[0];
        if (i.it) {
          var s = i.it[i.it.length - 1];
          s.s && (s.s.k[0] = e, s.s.k[1] = e);
        }
      }
      return t;
    }, _i.prototype.buildNewText = function() {
      this.addDynamicProperty(this);
      var t, e, i = this.textProperty.currentData;
      this.renderedLetters = et(i ? i.l.length : 0), i.fc ? this.layerElement.setAttribute("fill", this.buildColor(i.fc)) : this.layerElement.setAttribute("fill", "rgba(0,0,0,0)"), i.sc && (this.layerElement.setAttribute("stroke", this.buildColor(i.sc)), this.layerElement.setAttribute("stroke-width", i.sw)), this.layerElement.setAttribute("font-size", i.finalSize);
      var s = this.globalData.fontManager.getFontByName(i.f);
      if (s.fClass)
        this.layerElement.setAttribute("class", s.fClass);
      else {
        this.layerElement.setAttribute("font-family", s.fFamily);
        var a = i.fWeight, o = i.fStyle;
        this.layerElement.setAttribute("font-style", o), this.layerElement.setAttribute("font-weight", a);
      }
      this.layerElement.setAttribute("aria-label", i.t);
      var c = i.l || [], b = !!this.globalData.fontManager.chars;
      e = c.length;
      var u, T = this.mHelper, C = "", V = this.data.singleShape, g = 0, E = 0, I = !0, P = i.tr * 1e-3 * i.finalSize;
      if (V && !b && !i.sz) {
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
        for (e = x.length, E = i.ps ? i.ps[1] + i.ascent : 0, t = 0; t < e; t += 1)
          u = this.textSpans[t].span || ut("tspan"), u.textContent = x[t], u.setAttribute("x", 0), u.setAttribute("y", E), u.style.display = "inherit", N.appendChild(u), this.textSpans[t] || (this.textSpans[t] = {
            span: null,
            glyph: null
          }), this.textSpans[t].span = u, E += i.finalLineHeight;
        this.layerElement.appendChild(N);
      } else {
        var d = this.textSpans.length, _;
        for (t = 0; t < e; t += 1) {
          if (this.textSpans[t] || (this.textSpans[t] = {
            span: null,
            childSpan: null,
            glyph: null
          }), !b || !V || t === 0) {
            if (u = d > t ? this.textSpans[t].span : ut(b ? "g" : "text"), d <= t) {
              if (u.setAttribute("stroke-linecap", "butt"), u.setAttribute("stroke-linejoin", "round"), u.setAttribute("stroke-miterlimit", "4"), this.textSpans[t].span = u, b) {
                var A = ut("g");
                u.appendChild(A), this.textSpans[t].childSpan = A;
              }
              this.textSpans[t].span = u, this.layerElement.appendChild(u);
            }
            u.style.display = "inherit";
          }
          if (T.reset(), V && (c[t].n && (g = -P, E += i.yOffset, E += I ? 1 : 0, I = !1), this.applyTextPropertiesToMatrix(i, T, c[t].line, g, E), g += c[t].l || 0, g += P), b) {
            _ = this.globalData.fontManager.getCharData(i.finalText[t], s.fStyle, this.globalData.fontManager.getFontByName(i.f).fFamily);
            var L;
            if (_.t === 1)
              L = new Yr(_.data, this.globalData, this);
            else {
              var D = Ca;
              _.data && _.data.shapes && (D = this.buildShapeData(_.data, i.finalSize)), L = new te(D, this.globalData, this);
            }
            if (this.textSpans[t].glyph) {
              var U = this.textSpans[t].glyph;
              this.textSpans[t].childSpan.removeChild(U.layerElement), U.destroy();
            }
            this.textSpans[t].glyph = L, L._debug = !0, L.prepareFrame(0), L.renderFrame(), this.textSpans[t].childSpan.appendChild(L.layerElement), _.t === 1 && this.textSpans[t].childSpan.setAttribute("transform", "scale(" + i.finalSize / 100 + "," + i.finalSize / 100 + ")");
          } else
            V && u.setAttribute("transform", "translate(" + T.props[12] + "," + T.props[13] + ")"), u.textContent = c[t].val, u.setAttributeNS("http://www.w3.org/XML/1998/namespace", "xml:space", "preserve");
        }
        V && u && u.setAttribute("d", C);
      }
      for (; t < this.textSpans.length; )
        this.textSpans[t].span.style.display = "none", t += 1;
      this._sizeChanged = !0;
    }, _i.prototype.sourceRectAtTime = function() {
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
    }, _i.prototype.getValue = function() {
      var t, e = this.textSpans.length, i;
      for (this.renderedFrame = this.comp.renderedFrame, t = 0; t < e; t += 1)
        i = this.textSpans[t].glyph, i && (i.prepareFrame(this.comp.renderedFrame - this.data.st), i._mdf && (this._mdf = !0));
    }, _i.prototype.renderInnerContent = function() {
      if (this.validateText(), (!this.data.singleShape || this._mdf) && (this.textAnimator.getMeasures(this.textProperty.currentData, this.lettersChangedFlag), this.lettersChangedFlag || this.textAnimator.lettersChangedFlag)) {
        this._sizeChanged = !0;
        var t, e, i = this.textAnimator.renderedLetters, s = this.textProperty.currentData.l;
        e = s.length;
        var a, o, c;
        for (t = 0; t < e; t += 1)
          s[t].n || (a = i[t], o = this.textSpans[t].span, c = this.textSpans[t].glyph, c && c.renderFrame(), a._mdf.m && o.setAttribute("transform", a.m), a._mdf.o && o.setAttribute("opacity", a.o), a._mdf.sw && o.setAttribute("stroke-width", a.sw), a._mdf.sc && o.setAttribute("stroke", a.sc), a._mdf.fc && o.setAttribute("fill", a.fc));
      }
    };
    function Ks(t, e, i) {
      this.initElement(t, e, i);
    }
    H([qr], Ks), Ks.prototype.createContent = function() {
      var t = ut("rect");
      t.setAttribute("width", this.data.sw), t.setAttribute("height", this.data.sh), t.setAttribute("fill", this.data.sc), this.layerElement.appendChild(t);
    };
    function qi(t, e, i) {
      this.initFrame(), this.initBaseData(t, e, i), this.initFrame(), this.initTransform(t, e, i), this.initHierarchy();
    }
    qi.prototype.prepareFrame = function(t) {
      this.prepareProperties(t, !0);
    }, qi.prototype.renderFrame = function() {
    }, qi.prototype.getBaseElement = function() {
      return null;
    }, qi.prototype.destroy = function() {
    }, qi.prototype.sourceRectAtTime = function() {
    }, qi.prototype.hide = function() {
    }, H([ji, Cr, Er, Wi], qi);
    function he() {
    }
    H([be], he), he.prototype.createNull = function(t) {
      return new qi(t, this.globalData, this);
    }, he.prototype.createShape = function(t) {
      return new te(t, this.globalData, this);
    }, he.prototype.createText = function(t) {
      return new _i(t, this.globalData, this);
    }, he.prototype.createImage = function(t) {
      return new qr(t, this.globalData, this);
    }, he.prototype.createSolid = function(t) {
      return new Ks(t, this.globalData, this);
    }, he.prototype.configAnimation = function(t) {
      this.svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg"), this.svgElement.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink"), this.renderConfig.viewBoxSize ? this.svgElement.setAttribute("viewBox", this.renderConfig.viewBoxSize) : this.svgElement.setAttribute("viewBox", "0 0 " + t.w + " " + t.h), this.renderConfig.viewBoxOnly || (this.svgElement.setAttribute("width", t.w), this.svgElement.setAttribute("height", t.h), this.svgElement.style.width = "100%", this.svgElement.style.height = "100%", this.svgElement.style.transform = "translate3d(0,0,0)", this.svgElement.style.contentVisibility = this.renderConfig.contentVisibility), this.renderConfig.width && this.svgElement.setAttribute("width", this.renderConfig.width), this.renderConfig.height && this.svgElement.setAttribute("height", this.renderConfig.height), this.renderConfig.className && this.svgElement.setAttribute("class", this.renderConfig.className), this.renderConfig.id && this.svgElement.setAttribute("id", this.renderConfig.id), this.renderConfig.focusable !== void 0 && this.svgElement.setAttribute("focusable", this.renderConfig.focusable), this.svgElement.setAttribute("preserveAspectRatio", this.renderConfig.preserveAspectRatio), this.animationItem.wrapper.appendChild(this.svgElement);
      var e = this.globalData.defs;
      this.setupGlobalData(t, e), this.globalData.progressiveLoad = this.renderConfig.progressiveLoad, this.data = t;
      var i = ut("clipPath"), s = ut("rect");
      s.setAttribute("width", t.w), s.setAttribute("height", t.h), s.setAttribute("x", 0), s.setAttribute("y", 0);
      var a = Gt();
      i.setAttribute("id", a), i.appendChild(s), this.layerElement.setAttribute("clip-path", "url(" + j() + "#" + a + ")"), e.appendChild(i), this.layers = t.layers, this.elements = et(t.layers.length);
    }, he.prototype.destroy = function() {
      this.animationItem.wrapper && (this.animationItem.wrapper.innerText = ""), this.layerElement = null, this.globalData.defs = null;
      var t, e = this.layers ? this.layers.length : 0;
      for (t = 0; t < e; t += 1)
        this.elements[t] && this.elements[t].destroy && this.elements[t].destroy();
      this.elements.length = 0, this.destroyed = !0, this.animationItem = null;
    }, he.prototype.updateContainerSize = function() {
    }, he.prototype.findIndexByInd = function(t) {
      var e = 0, i = this.layers.length;
      for (e = 0; e < i; e += 1)
        if (this.layers[e].ind === t)
          return e;
      return -1;
    }, he.prototype.buildItem = function(t) {
      var e = this.elements;
      if (!(e[t] || this.layers[t].ty === 99)) {
        e[t] = !0;
        var i = this.createItem(this.layers[t]);
        if (e[t] = i, ti() && (this.layers[t].ty === 0 && this.globalData.projectInterface.registerComposition(i), i.initExpressions()), this.appendElementInPos(i, t), this.layers[t].tt) {
          var s = "tp" in this.layers[t] ? this.findIndexByInd(this.layers[t].tp) : t - 1;
          if (s === -1)
            return;
          if (!this.elements[s] || this.elements[s] === !0)
            this.buildItem(s), this.addPendingElement(i);
          else {
            var a = e[s], o = a.getMatte(this.layers[t].tt);
            i.setMatte(o);
          }
        }
      }
    }, he.prototype.checkPendingElements = function() {
      for (; this.pendingElements.length; ) {
        var t = this.pendingElements.pop();
        if (t.checkParenting(), t.data.tt)
          for (var e = 0, i = this.elements.length; e < i; ) {
            if (this.elements[e] === t) {
              var s = "tp" in t.data ? this.findIndexByInd(t.data.tp) : e - 1, a = this.elements[s], o = a.getMatte(this.layers[e].tt);
              t.setMatte(o);
              break;
            }
            e += 1;
          }
      }
    }, he.prototype.renderFrame = function(t) {
      if (!(this.renderedFrame === t || this.destroyed)) {
        t === null ? t = this.renderedFrame : this.renderedFrame = t, this.globalData.frameNum = t, this.globalData.frameId += 1, this.globalData.projectInterface.currentFrame = t, this.globalData._mdf = !1;
        var e, i = this.layers.length;
        for (this.completeLayers || this.checkLayers(t), e = i - 1; e >= 0; e -= 1)
          (this.completeLayers || this.elements[e]) && this.elements[e].prepareFrame(t - this.layers[e].st);
        if (this.globalData._mdf)
          for (e = 0; e < i; e += 1)
            (this.completeLayers || this.elements[e]) && this.elements[e].renderFrame();
      }
    }, he.prototype.appendElementInPos = function(t, e) {
      var i = t.getBaseElement();
      if (i) {
        for (var s = 0, a; s < e; )
          this.elements[s] && this.elements[s] !== !0 && this.elements[s].getBaseElement() && (a = this.elements[s].getBaseElement()), s += 1;
        a ? this.layerElement.insertBefore(i, a) : this.layerElement.appendChild(i);
      }
    }, he.prototype.hide = function() {
      this.layerElement.style.display = "none";
    }, he.prototype.show = function() {
      this.layerElement.style.display = "block";
    };
    function bi() {
    }
    H([ji, Cr, Er, Wi, Hr], bi), bi.prototype.initElement = function(t, e, i) {
      this.initFrame(), this.initBaseData(t, e, i), this.initTransform(t, e, i), this.initRenderable(), this.initHierarchy(), this.initRendererElement(), this.createContainerElements(), this.createRenderableComponents(), (this.data.xt || !e.progressiveLoad) && this.buildAllItems(), this.hide();
    }, bi.prototype.prepareFrame = function(t) {
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
    }, bi.prototype.renderInnerContent = function() {
      var t, e = this.layers.length;
      for (t = 0; t < e; t += 1)
        (this.completeLayers || this.elements[t]) && this.elements[t].renderFrame();
    }, bi.prototype.setElements = function(t) {
      this.elements = t;
    }, bi.prototype.getElements = function() {
      return this.elements;
    }, bi.prototype.destroyElements = function() {
      var t, e = this.layers.length;
      for (t = 0; t < e; t += 1)
        this.elements[t] && this.elements[t].destroy();
    }, bi.prototype.destroy = function() {
      this.destroyElements(), this.destroyBaseElement();
    };
    function Yr(t, e, i) {
      this.layers = t.layers, this.supports3d = !0, this.completeLayers = !1, this.pendingElements = [], this.elements = this.layers ? et(this.layers.length) : [], this.initElement(t, e, i), this.tm = t.tm ? J.getProp(this, t.tm, 0, e.frameRate, this) : {
        _placeholder: !0
      };
    }
    H([he, bi, Wr], Yr), Yr.prototype.createComp = function(t) {
      return new Yr(t, this.globalData, this);
    };
    function Qs(t, e) {
      this.animationItem = t, this.layers = null, this.renderedFrame = -1, this.svgElement = ut("svg");
      var i = "";
      if (e && e.title) {
        var s = ut("title"), a = Gt();
        s.setAttribute("id", a), s.textContent = e.title, this.svgElement.appendChild(s), i += a;
      }
      if (e && e.description) {
        var o = ut("desc"), c = Gt();
        o.setAttribute("id", c), o.textContent = e.description, this.svgElement.appendChild(o), i += " " + c;
      }
      i && this.svgElement.setAttribute("aria-labelledby", i);
      var b = ut("defs");
      this.svgElement.appendChild(b);
      var u = ut("g");
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
        defs: b,
        renderConfig: this.renderConfig
      }, this.elements = [], this.pendingElements = [], this.destroyed = !1, this.rendererType = "svg";
    }
    return H([he], Qs), Qs.prototype.createComp = function(t) {
      return new Yr(t, this.globalData, this);
    }, ce("svg", Qs), ri.registerModifier("tm", Jt), ri.registerModifier("pb", Vi), ri.registerModifier("rp", le), ri.registerModifier("rd", rr), ri.registerModifier("zz", or), ri.registerModifier("op", ft), Tt;
  });
})(un, un.exports);
var ll = un.exports;
const hl = /* @__PURE__ */ al(ll);
function fl(l, r, n) {
  return hl.loadAnimation({
    container: l,
    renderer: "svg",
    loop: n.loop,
    autoplay: n.autoplay,
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
let yr = Tn();
function Ko(l) {
  yr = l;
}
const Qo = /[&<>"']/, cl = new RegExp(Qo.source, "g"), Jo = /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, ul = new RegExp(Jo.source, "g"), pl = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
}, fo = (l) => pl[l];
function Be(l, r) {
  if (r) {
    if (Qo.test(l))
      return l.replace(cl, fo);
  } else if (Jo.test(l))
    return l.replace(ul, fo);
  return l;
}
const dl = /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig;
function ml(l) {
  return l.replace(dl, (r, n) => (n = n.toLowerCase(), n === "colon" ? ":" : n.charAt(0) === "#" ? n.charAt(1) === "x" ? String.fromCharCode(parseInt(n.substring(2), 16)) : String.fromCharCode(+n.substring(1)) : ""));
}
const gl = /(^|[^\[])\^/g;
function Dt(l, r) {
  let n = typeof l == "string" ? l : l.source;
  r = r || "";
  const h = {
    replace: (v, m) => {
      let y = typeof m == "string" ? m : m.source;
      return y = y.replace(gl, "$1"), n = n.replace(v, y), h;
    },
    getRegex: () => new RegExp(n, r)
  };
  return h;
}
function co(l) {
  try {
    l = encodeURI(l).replace(/%25/g, "%");
  } catch {
    return null;
  }
  return l;
}
const es = { exec: () => null };
function uo(l, r) {
  const n = l.replace(/\|/g, (m, y, F) => {
    let B = !1, j = y;
    for (; --j >= 0 && F[j] === "\\"; )
      B = !B;
    return B ? "|" : " |";
  }), h = n.split(/ \|/);
  let v = 0;
  if (h[0].trim() || h.shift(), h.length > 0 && !h[h.length - 1].trim() && h.pop(), r)
    if (h.length > r)
      h.splice(r);
    else
      for (; h.length < r; )
        h.push("");
  for (; v < h.length; v++)
    h[v] = h[v].trim().replace(/\\\|/g, "|");
  return h;
}
function ws(l, r, n) {
  const h = l.length;
  if (h === 0)
    return "";
  let v = 0;
  for (; v < h && l.charAt(h - v - 1) === r; )
    v++;
  return l.slice(0, h - v);
}
function vl(l, r) {
  if (l.indexOf(r[1]) === -1)
    return -1;
  let n = 0;
  for (let h = 0; h < l.length; h++)
    if (l[h] === "\\")
      h++;
    else if (l[h] === r[0])
      n++;
    else if (l[h] === r[1] && (n--, n < 0))
      return h;
  return -1;
}
function po(l, r, n, h) {
  const v = r.href, m = r.title ? Be(r.title) : null, y = l[1].replace(/\\([\[\]])/g, "$1");
  if (l[0].charAt(0) !== "!") {
    h.state.inLink = !0;
    const F = {
      type: "link",
      raw: n,
      href: v,
      title: m,
      text: y,
      tokens: h.inlineTokens(y)
    };
    return h.state.inLink = !1, F;
  }
  return {
    type: "image",
    raw: n,
    href: v,
    title: m,
    text: Be(y)
  };
}
function yl(l, r) {
  const n = l.match(/^(\s+)(?:```)/);
  if (n === null)
    return r;
  const h = n[1];
  return r.split(`
`).map((v) => {
    const m = v.match(/^\s+/);
    if (m === null)
      return v;
    const [y] = m;
    return y.length >= h.length ? v.slice(h.length) : v;
  }).join(`
`);
}
class Rs {
  // set by the lexer
  constructor(r) {
    jt(this, "options");
    jt(this, "rules");
    // set by the lexer
    jt(this, "lexer");
    this.options = r || yr;
  }
  space(r) {
    const n = this.rules.block.newline.exec(r);
    if (n && n[0].length > 0)
      return {
        type: "space",
        raw: n[0]
      };
  }
  code(r) {
    const n = this.rules.block.code.exec(r);
    if (n) {
      const h = n[0].replace(/^ {1,4}/gm, "");
      return {
        type: "code",
        raw: n[0],
        codeBlockStyle: "indented",
        text: this.options.pedantic ? h : ws(h, `
`)
      };
    }
  }
  fences(r) {
    const n = this.rules.block.fences.exec(r);
    if (n) {
      const h = n[0], v = yl(h, n[3] || "");
      return {
        type: "code",
        raw: h,
        lang: n[2] ? n[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : n[2],
        text: v
      };
    }
  }
  heading(r) {
    const n = this.rules.block.heading.exec(r);
    if (n) {
      let h = n[2].trim();
      if (/#$/.test(h)) {
        const v = ws(h, "#");
        (this.options.pedantic || !v || / $/.test(v)) && (h = v.trim());
      }
      return {
        type: "heading",
        raw: n[0],
        depth: n[1].length,
        text: h,
        tokens: this.lexer.inline(h)
      };
    }
  }
  hr(r) {
    const n = this.rules.block.hr.exec(r);
    if (n)
      return {
        type: "hr",
        raw: n[0]
      };
  }
  blockquote(r) {
    const n = this.rules.block.blockquote.exec(r);
    if (n) {
      let h = n[0].replace(/\n {0,3}((?:=+|-+) *)(?=\n|$)/g, `
    $1`);
      h = ws(h.replace(/^ *>[ \t]?/gm, ""), `
`);
      const v = this.lexer.state.top;
      this.lexer.state.top = !0;
      const m = this.lexer.blockTokens(h);
      return this.lexer.state.top = v, {
        type: "blockquote",
        raw: n[0],
        tokens: m,
        text: h
      };
    }
  }
  list(r) {
    let n = this.rules.block.list.exec(r);
    if (n) {
      let h = n[1].trim();
      const v = h.length > 1, m = {
        type: "list",
        raw: "",
        ordered: v,
        start: v ? +h.slice(0, -1) : "",
        loose: !1,
        items: []
      };
      h = v ? `\\d{1,9}\\${h.slice(-1)}` : `\\${h}`, this.options.pedantic && (h = v ? h : "[*+-]");
      const y = new RegExp(`^( {0,3}${h})((?:[	 ][^\\n]*)?(?:\\n|$))`);
      let F = "", B = "", j = !1;
      for (; r; ) {
        let W = !1;
        if (!(n = y.exec(r)) || this.rules.block.hr.test(r))
          break;
        F = n[0], r = r.substring(F.length);
        let H = n[2].split(`
`, 1)[0].replace(/^\t+/, (_t) => " ".repeat(3 * _t.length)), O = r.split(`
`, 1)[0], X = 0;
        this.options.pedantic ? (X = 2, B = H.trimStart()) : (X = n[2].search(/[^ ]/), X = X > 4 ? 1 : X, B = H.slice(X), X += n[1].length);
        let rt = !1;
        if (!H && /^ *$/.test(O) && (F += O + `
`, r = r.substring(O.length + 1), W = !0), !W) {
          const _t = new RegExp(`^ {0,${Math.min(3, X - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), dt = new RegExp(`^ {0,${Math.min(3, X - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), Ct = new RegExp(`^ {0,${Math.min(3, X - 1)}}(?:\`\`\`|~~~)`), Mt = new RegExp(`^ {0,${Math.min(3, X - 1)}}#`);
          for (; r; ) {
            const Bt = r.split(`
`, 1)[0];
            if (O = Bt, this.options.pedantic && (O = O.replace(/^ {1,4}(?=( {4})*[^ ])/g, "  ")), Ct.test(O) || Mt.test(O) || _t.test(O) || dt.test(r))
              break;
            if (O.search(/[^ ]/) >= X || !O.trim())
              B += `
` + O.slice(X);
            else {
              if (rt || H.search(/[^ ]/) >= 4 || Ct.test(H) || Mt.test(H) || dt.test(H))
                break;
              B += `
` + O;
            }
            !rt && !O.trim() && (rt = !0), F += Bt + `
`, r = r.substring(Bt.length + 1), H = O.slice(X);
          }
        }
        m.loose || (j ? m.loose = !0 : /\n *\n *$/.test(F) && (j = !0));
        let et = null, ct;
        this.options.gfm && (et = /^\[[ xX]\] /.exec(B), et && (ct = et[0] !== "[ ] ", B = B.replace(/^\[[ xX]\] +/, ""))), m.items.push({
          type: "list_item",
          raw: F,
          task: !!et,
          checked: ct,
          loose: !1,
          text: B,
          tokens: []
        }), m.raw += F;
      }
      m.items[m.items.length - 1].raw = F.trimEnd(), m.items[m.items.length - 1].text = B.trimEnd(), m.raw = m.raw.trimEnd();
      for (let W = 0; W < m.items.length; W++)
        if (this.lexer.state.top = !1, m.items[W].tokens = this.lexer.blockTokens(m.items[W].text, []), !m.loose) {
          const H = m.items[W].tokens.filter((X) => X.type === "space"), O = H.length > 0 && H.some((X) => /\n.*\n/.test(X.raw));
          m.loose = O;
        }
      if (m.loose)
        for (let W = 0; W < m.items.length; W++)
          m.items[W].loose = !0;
      return m;
    }
  }
  html(r) {
    const n = this.rules.block.html.exec(r);
    if (n)
      return {
        type: "html",
        block: !0,
        raw: n[0],
        pre: n[1] === "pre" || n[1] === "script" || n[1] === "style",
        text: n[0]
      };
  }
  def(r) {
    const n = this.rules.block.def.exec(r);
    if (n) {
      const h = n[1].toLowerCase().replace(/\s+/g, " "), v = n[2] ? n[2].replace(/^<(.*)>$/, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", m = n[3] ? n[3].substring(1, n[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : n[3];
      return {
        type: "def",
        tag: h,
        raw: n[0],
        href: v,
        title: m
      };
    }
  }
  table(r) {
    const n = this.rules.block.table.exec(r);
    if (!n || !/[:|]/.test(n[2]))
      return;
    const h = uo(n[1]), v = n[2].replace(/^\||\| *$/g, "").split("|"), m = n[3] && n[3].trim() ? n[3].replace(/\n[ \t]*$/, "").split(`
`) : [], y = {
      type: "table",
      raw: n[0],
      header: [],
      align: [],
      rows: []
    };
    if (h.length === v.length) {
      for (const F of v)
        /^ *-+: *$/.test(F) ? y.align.push("right") : /^ *:-+: *$/.test(F) ? y.align.push("center") : /^ *:-+ *$/.test(F) ? y.align.push("left") : y.align.push(null);
      for (const F of h)
        y.header.push({
          text: F,
          tokens: this.lexer.inline(F)
        });
      for (const F of m)
        y.rows.push(uo(F, y.header.length).map((B) => ({
          text: B,
          tokens: this.lexer.inline(B)
        })));
      return y;
    }
  }
  lheading(r) {
    const n = this.rules.block.lheading.exec(r);
    if (n)
      return {
        type: "heading",
        raw: n[0],
        depth: n[2].charAt(0) === "=" ? 1 : 2,
        text: n[1],
        tokens: this.lexer.inline(n[1])
      };
  }
  paragraph(r) {
    const n = this.rules.block.paragraph.exec(r);
    if (n) {
      const h = n[1].charAt(n[1].length - 1) === `
` ? n[1].slice(0, -1) : n[1];
      return {
        type: "paragraph",
        raw: n[0],
        text: h,
        tokens: this.lexer.inline(h)
      };
    }
  }
  text(r) {
    const n = this.rules.block.text.exec(r);
    if (n)
      return {
        type: "text",
        raw: n[0],
        text: n[0],
        tokens: this.lexer.inline(n[0])
      };
  }
  escape(r) {
    const n = this.rules.inline.escape.exec(r);
    if (n)
      return {
        type: "escape",
        raw: n[0],
        text: Be(n[1])
      };
  }
  tag(r) {
    const n = this.rules.inline.tag.exec(r);
    if (n)
      return !this.lexer.state.inLink && /^<a /i.test(n[0]) ? this.lexer.state.inLink = !0 : this.lexer.state.inLink && /^<\/a>/i.test(n[0]) && (this.lexer.state.inLink = !1), !this.lexer.state.inRawBlock && /^<(pre|code|kbd|script)(\s|>)/i.test(n[0]) ? this.lexer.state.inRawBlock = !0 : this.lexer.state.inRawBlock && /^<\/(pre|code|kbd|script)(\s|>)/i.test(n[0]) && (this.lexer.state.inRawBlock = !1), {
        type: "html",
        raw: n[0],
        inLink: this.lexer.state.inLink,
        inRawBlock: this.lexer.state.inRawBlock,
        block: !1,
        text: n[0]
      };
  }
  link(r) {
    const n = this.rules.inline.link.exec(r);
    if (n) {
      const h = n[2].trim();
      if (!this.options.pedantic && /^</.test(h)) {
        if (!/>$/.test(h))
          return;
        const y = ws(h.slice(0, -1), "\\");
        if ((h.length - y.length) % 2 === 0)
          return;
      } else {
        const y = vl(n[2], "()");
        if (y > -1) {
          const B = (n[0].indexOf("!") === 0 ? 5 : 4) + n[1].length + y;
          n[2] = n[2].substring(0, y), n[0] = n[0].substring(0, B).trim(), n[3] = "";
        }
      }
      let v = n[2], m = "";
      if (this.options.pedantic) {
        const y = /^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(v);
        y && (v = y[1], m = y[3]);
      } else
        m = n[3] ? n[3].slice(1, -1) : "";
      return v = v.trim(), /^</.test(v) && (this.options.pedantic && !/>$/.test(h) ? v = v.slice(1) : v = v.slice(1, -1)), po(n, {
        href: v && v.replace(this.rules.inline.anyPunctuation, "$1"),
        title: m && m.replace(this.rules.inline.anyPunctuation, "$1")
      }, n[0], this.lexer);
    }
  }
  reflink(r, n) {
    let h;
    if ((h = this.rules.inline.reflink.exec(r)) || (h = this.rules.inline.nolink.exec(r))) {
      const v = (h[2] || h[1]).replace(/\s+/g, " "), m = n[v.toLowerCase()];
      if (!m) {
        const y = h[0].charAt(0);
        return {
          type: "text",
          raw: y,
          text: y
        };
      }
      return po(h, m, h[0], this.lexer);
    }
  }
  emStrong(r, n, h = "") {
    let v = this.rules.inline.emStrongLDelim.exec(r);
    if (!v || v[3] && h.match(/[\p{L}\p{N}]/u))
      return;
    if (!(v[1] || v[2] || "") || !h || this.rules.inline.punctuation.exec(h)) {
      const y = [...v[0]].length - 1;
      let F, B, j = y, W = 0;
      const H = v[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (H.lastIndex = 0, n = n.slice(-1 * r.length + y); (v = H.exec(n)) != null; ) {
        if (F = v[1] || v[2] || v[3] || v[4] || v[5] || v[6], !F)
          continue;
        if (B = [...F].length, v[3] || v[4]) {
          j += B;
          continue;
        } else if ((v[5] || v[6]) && y % 3 && !((y + B) % 3)) {
          W += B;
          continue;
        }
        if (j -= B, j > 0)
          continue;
        B = Math.min(B, B + j + W);
        const O = [...v[0]][0].length, X = r.slice(0, y + v.index + O + B);
        if (Math.min(y, B) % 2) {
          const et = X.slice(1, -1);
          return {
            type: "em",
            raw: X,
            text: et,
            tokens: this.lexer.inlineTokens(et)
          };
        }
        const rt = X.slice(2, -2);
        return {
          type: "strong",
          raw: X,
          text: rt,
          tokens: this.lexer.inlineTokens(rt)
        };
      }
    }
  }
  codespan(r) {
    const n = this.rules.inline.code.exec(r);
    if (n) {
      let h = n[2].replace(/\n/g, " ");
      const v = /[^ ]/.test(h), m = /^ /.test(h) && / $/.test(h);
      return v && m && (h = h.substring(1, h.length - 1)), h = Be(h, !0), {
        type: "codespan",
        raw: n[0],
        text: h
      };
    }
  }
  br(r) {
    const n = this.rules.inline.br.exec(r);
    if (n)
      return {
        type: "br",
        raw: n[0]
      };
  }
  del(r) {
    const n = this.rules.inline.del.exec(r);
    if (n)
      return {
        type: "del",
        raw: n[0],
        text: n[2],
        tokens: this.lexer.inlineTokens(n[2])
      };
  }
  autolink(r) {
    const n = this.rules.inline.autolink.exec(r);
    if (n) {
      let h, v;
      return n[2] === "@" ? (h = Be(n[1]), v = "mailto:" + h) : (h = Be(n[1]), v = h), {
        type: "link",
        raw: n[0],
        text: h,
        href: v,
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
    let n;
    if (n = this.rules.inline.url.exec(r)) {
      let v, m;
      if (n[2] === "@")
        v = Be(n[0]), m = "mailto:" + v;
      else {
        let y;
        do
          y = n[0], n[0] = ((h = this.rules.inline._backpedal.exec(n[0])) == null ? void 0 : h[0]) ?? "";
        while (y !== n[0]);
        v = Be(n[0]), n[1] === "www." ? m = "http://" + n[0] : m = n[0];
      }
      return {
        type: "link",
        raw: n[0],
        text: v,
        href: m,
        tokens: [
          {
            type: "text",
            raw: v,
            text: v
          }
        ]
      };
    }
  }
  inlineText(r) {
    const n = this.rules.inline.text.exec(r);
    if (n) {
      let h;
      return this.lexer.state.inRawBlock ? h = n[0] : h = Be(n[0]), {
        type: "text",
        raw: n[0],
        text: h
      };
    }
  }
}
const _l = /^(?: *(?:\n|$))+/, bl = /^( {4}[^\n]+(?:\n(?: *(?:\n|$))*)?)+/, wl = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, ns = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, kl = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, ta = /(?:[*+-]|\d{1,9}[.)])/, ea = Dt(/^(?!bull |blockCode|fences|blockquote|heading|html)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html))+?)\n {0,3}(=+|-+) *(?:\n+|$)/).replace(/bull/g, ta).replace(/blockCode/g, / {4}/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).getRegex(), An = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, xl = /^[^\n]+/, Sn = /(?!\s*\])(?:\\.|[^\[\]\\])+/, Tl = Dt(/^ {0,3}\[(label)\]: *(?:\n *)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n *)?| *\n *)(title))? *(?:\n+|$)/).replace("label", Sn).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), Al = Dt(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, ta).getRegex(), Bs = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", Cn = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, Sl = Dt("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n *)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$))", "i").replace("comment", Cn).replace("tag", Bs).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), ia = Dt(An).replace("hr", ns).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Bs).getRegex(), Cl = Dt(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", ia).getRegex(), En = {
  blockquote: Cl,
  code: bl,
  def: Tl,
  fences: wl,
  heading: kl,
  hr: ns,
  html: Sl,
  lheading: ea,
  list: Al,
  newline: _l,
  paragraph: ia,
  table: es,
  text: xl
}, mo = Dt("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", ns).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", " {4}[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Bs).getRegex(), El = {
  ...En,
  table: mo,
  paragraph: Dt(An).replace("hr", ns).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", mo).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", Bs).getRegex()
}, Pl = {
  ...En,
  html: Dt(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", Cn).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
  heading: /^(#{1,6})(.*)(?:\n+|$)/,
  fences: es,
  // fences not supported
  lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
  paragraph: Dt(An).replace("hr", ns).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", ea).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex()
}, ra = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, Ml = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, sa = /^( {2,}|\\)\n(?!\s*$)/, Il = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, os = "\\p{P}\\p{S}", Ll = Dt(/^((?![*_])[\spunctuation])/, "u").replace(/punctuation/g, os).getRegex(), Fl = /\[[^[\]]*?\]\([^\(\)]*?\)|`[^`]*?`|<[^<>]*?>/g, Rl = Dt(/^(?:\*+(?:((?!\*)[punct])|[^\s*]))|^_+(?:((?!_)[punct])|([^\s_]))/, "u").replace(/punct/g, os).getRegex(), Ol = Dt("^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)[punct](\\*+)(?=[\\s]|$)|[^punct\\s](\\*+)(?!\\*)(?=[punct\\s]|$)|(?!\\*)[punct\\s](\\*+)(?=[^punct\\s])|[\\s](\\*+)(?!\\*)(?=[punct])|(?!\\*)[punct](\\*+)(?!\\*)(?=[punct])|[^punct\\s](\\*+)(?=[^punct\\s])", "gu").replace(/punct/g, os).getRegex(), Nl = Dt("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)[punct](_+)(?=[\\s]|$)|[^punct\\s](_+)(?!_)(?=[punct\\s]|$)|(?!_)[punct\\s](_+)(?=[^punct\\s])|[\\s](_+)(?!_)(?=[punct])|(?!_)[punct](_+)(?!_)(?=[punct])", "gu").replace(/punct/g, os).getRegex(), zl = Dt(/\\([punct])/, "gu").replace(/punct/g, os).getRegex(), Dl = Dt(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), Bl = Dt(Cn).replace("(?:-->|$)", "-->").getRegex(), Vl = Dt("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", Bl).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), Os = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/, $l = Dt(/^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/).replace("label", Os).replace("href", /<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), na = Dt(/^!?\[(label)\]\[(ref)\]/).replace("label", Os).replace("ref", Sn).getRegex(), oa = Dt(/^!?\[(ref)\](?:\[\])?/).replace("ref", Sn).getRegex(), Ul = Dt("reflink|nolink(?!\\()", "g").replace("reflink", na).replace("nolink", oa).getRegex(), Pn = {
  _backpedal: es,
  // only used for GFM url
  anyPunctuation: zl,
  autolink: Dl,
  blockSkip: Fl,
  br: sa,
  code: Ml,
  del: es,
  emStrongLDelim: Rl,
  emStrongRDelimAst: Ol,
  emStrongRDelimUnd: Nl,
  escape: ra,
  link: $l,
  nolink: oa,
  punctuation: Ll,
  reflink: na,
  reflinkSearch: Ul,
  tag: Vl,
  text: Il,
  url: es
}, jl = {
  ...Pn,
  link: Dt(/^!?\[(label)\]\((.*?)\)/).replace("label", Os).getRegex(),
  reflink: Dt(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", Os).getRegex()
}, pn = {
  ...Pn,
  escape: Dt(ra).replace("])", "~|])").getRegex(),
  url: Dt(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/, "i").replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),
  _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
  del: /^(~~?)(?=[^\s~])([\s\S]*?[^\s~])\1(?=[^~]|$)/,
  text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
}, Wl = {
  ...pn,
  br: Dt(sa).replace("{2,}", "*").getRegex(),
  text: Dt(pn.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
}, ks = {
  normal: En,
  gfm: El,
  pedantic: Pl
}, Xr = {
  normal: Pn,
  gfm: pn,
  breaks: Wl,
  pedantic: jl
};
class hi {
  constructor(r) {
    jt(this, "tokens");
    jt(this, "options");
    jt(this, "state");
    jt(this, "tokenizer");
    jt(this, "inlineQueue");
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = r || yr, this.options.tokenizer = this.options.tokenizer || new Rs(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = {
      inLink: !1,
      inRawBlock: !1,
      top: !0
    };
    const n = {
      block: ks.normal,
      inline: Xr.normal
    };
    this.options.pedantic ? (n.block = ks.pedantic, n.inline = Xr.pedantic) : this.options.gfm && (n.block = ks.gfm, this.options.breaks ? n.inline = Xr.breaks : n.inline = Xr.gfm), this.tokenizer.rules = n;
  }
  /**
   * Expose Rules
   */
  static get rules() {
    return {
      block: ks,
      inline: Xr
    };
  }
  /**
   * Static Lex Method
   */
  static lex(r, n) {
    return new hi(n).lex(r);
  }
  /**
   * Static Lex Inline Method
   */
  static lexInline(r, n) {
    return new hi(n).inlineTokens(r);
  }
  /**
   * Preprocessing
   */
  lex(r) {
    r = r.replace(/\r\n|\r/g, `
`), this.blockTokens(r, this.tokens);
    for (let n = 0; n < this.inlineQueue.length; n++) {
      const h = this.inlineQueue[n];
      this.inlineTokens(h.src, h.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(r, n = []) {
    this.options.pedantic ? r = r.replace(/\t/g, "    ").replace(/^ +$/gm, "") : r = r.replace(/^( *)(\t+)/gm, (F, B, j) => B + "    ".repeat(j.length));
    let h, v, m, y;
    for (; r; )
      if (!(this.options.extensions && this.options.extensions.block && this.options.extensions.block.some((F) => (h = F.call({ lexer: this }, r, n)) ? (r = r.substring(h.raw.length), n.push(h), !0) : !1))) {
        if (h = this.tokenizer.space(r)) {
          r = r.substring(h.raw.length), h.raw.length === 1 && n.length > 0 ? n[n.length - 1].raw += `
` : n.push(h);
          continue;
        }
        if (h = this.tokenizer.code(r)) {
          r = r.substring(h.raw.length), v = n[n.length - 1], v && (v.type === "paragraph" || v.type === "text") ? (v.raw += `
` + h.raw, v.text += `
` + h.text, this.inlineQueue[this.inlineQueue.length - 1].src = v.text) : n.push(h);
          continue;
        }
        if (h = this.tokenizer.fences(r)) {
          r = r.substring(h.raw.length), n.push(h);
          continue;
        }
        if (h = this.tokenizer.heading(r)) {
          r = r.substring(h.raw.length), n.push(h);
          continue;
        }
        if (h = this.tokenizer.hr(r)) {
          r = r.substring(h.raw.length), n.push(h);
          continue;
        }
        if (h = this.tokenizer.blockquote(r)) {
          r = r.substring(h.raw.length), n.push(h);
          continue;
        }
        if (h = this.tokenizer.list(r)) {
          r = r.substring(h.raw.length), n.push(h);
          continue;
        }
        if (h = this.tokenizer.html(r)) {
          r = r.substring(h.raw.length), n.push(h);
          continue;
        }
        if (h = this.tokenizer.def(r)) {
          r = r.substring(h.raw.length), v = n[n.length - 1], v && (v.type === "paragraph" || v.type === "text") ? (v.raw += `
` + h.raw, v.text += `
` + h.raw, this.inlineQueue[this.inlineQueue.length - 1].src = v.text) : this.tokens.links[h.tag] || (this.tokens.links[h.tag] = {
            href: h.href,
            title: h.title
          });
          continue;
        }
        if (h = this.tokenizer.table(r)) {
          r = r.substring(h.raw.length), n.push(h);
          continue;
        }
        if (h = this.tokenizer.lheading(r)) {
          r = r.substring(h.raw.length), n.push(h);
          continue;
        }
        if (m = r, this.options.extensions && this.options.extensions.startBlock) {
          let F = 1 / 0;
          const B = r.slice(1);
          let j;
          this.options.extensions.startBlock.forEach((W) => {
            j = W.call({ lexer: this }, B), typeof j == "number" && j >= 0 && (F = Math.min(F, j));
          }), F < 1 / 0 && F >= 0 && (m = r.substring(0, F + 1));
        }
        if (this.state.top && (h = this.tokenizer.paragraph(m))) {
          v = n[n.length - 1], y && v.type === "paragraph" ? (v.raw += `
` + h.raw, v.text += `
` + h.text, this.inlineQueue.pop(), this.inlineQueue[this.inlineQueue.length - 1].src = v.text) : n.push(h), y = m.length !== r.length, r = r.substring(h.raw.length);
          continue;
        }
        if (h = this.tokenizer.text(r)) {
          r = r.substring(h.raw.length), v = n[n.length - 1], v && v.type === "text" ? (v.raw += `
` + h.raw, v.text += `
` + h.text, this.inlineQueue.pop(), this.inlineQueue[this.inlineQueue.length - 1].src = v.text) : n.push(h);
          continue;
        }
        if (r) {
          const F = "Infinite loop on byte: " + r.charCodeAt(0);
          if (this.options.silent) {
            console.error(F);
            break;
          } else
            throw new Error(F);
        }
      }
    return this.state.top = !0, n;
  }
  inline(r, n = []) {
    return this.inlineQueue.push({ src: r, tokens: n }), n;
  }
  /**
   * Lexing/Compiling
   */
  inlineTokens(r, n = []) {
    let h, v, m, y = r, F, B, j;
    if (this.tokens.links) {
      const W = Object.keys(this.tokens.links);
      if (W.length > 0)
        for (; (F = this.tokenizer.rules.inline.reflinkSearch.exec(y)) != null; )
          W.includes(F[0].slice(F[0].lastIndexOf("[") + 1, -1)) && (y = y.slice(0, F.index) + "[" + "a".repeat(F[0].length - 2) + "]" + y.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
    }
    for (; (F = this.tokenizer.rules.inline.blockSkip.exec(y)) != null; )
      y = y.slice(0, F.index) + "[" + "a".repeat(F[0].length - 2) + "]" + y.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    for (; (F = this.tokenizer.rules.inline.anyPunctuation.exec(y)) != null; )
      y = y.slice(0, F.index) + "++" + y.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
    for (; r; )
      if (B || (j = ""), B = !1, !(this.options.extensions && this.options.extensions.inline && this.options.extensions.inline.some((W) => (h = W.call({ lexer: this }, r, n)) ? (r = r.substring(h.raw.length), n.push(h), !0) : !1))) {
        if (h = this.tokenizer.escape(r)) {
          r = r.substring(h.raw.length), n.push(h);
          continue;
        }
        if (h = this.tokenizer.tag(r)) {
          r = r.substring(h.raw.length), v = n[n.length - 1], v && h.type === "text" && v.type === "text" ? (v.raw += h.raw, v.text += h.text) : n.push(h);
          continue;
        }
        if (h = this.tokenizer.link(r)) {
          r = r.substring(h.raw.length), n.push(h);
          continue;
        }
        if (h = this.tokenizer.reflink(r, this.tokens.links)) {
          r = r.substring(h.raw.length), v = n[n.length - 1], v && h.type === "text" && v.type === "text" ? (v.raw += h.raw, v.text += h.text) : n.push(h);
          continue;
        }
        if (h = this.tokenizer.emStrong(r, y, j)) {
          r = r.substring(h.raw.length), n.push(h);
          continue;
        }
        if (h = this.tokenizer.codespan(r)) {
          r = r.substring(h.raw.length), n.push(h);
          continue;
        }
        if (h = this.tokenizer.br(r)) {
          r = r.substring(h.raw.length), n.push(h);
          continue;
        }
        if (h = this.tokenizer.del(r)) {
          r = r.substring(h.raw.length), n.push(h);
          continue;
        }
        if (h = this.tokenizer.autolink(r)) {
          r = r.substring(h.raw.length), n.push(h);
          continue;
        }
        if (!this.state.inLink && (h = this.tokenizer.url(r))) {
          r = r.substring(h.raw.length), n.push(h);
          continue;
        }
        if (m = r, this.options.extensions && this.options.extensions.startInline) {
          let W = 1 / 0;
          const H = r.slice(1);
          let O;
          this.options.extensions.startInline.forEach((X) => {
            O = X.call({ lexer: this }, H), typeof O == "number" && O >= 0 && (W = Math.min(W, O));
          }), W < 1 / 0 && W >= 0 && (m = r.substring(0, W + 1));
        }
        if (h = this.tokenizer.inlineText(m)) {
          r = r.substring(h.raw.length), h.raw.slice(-1) !== "_" && (j = h.raw.slice(-1)), B = !0, v = n[n.length - 1], v && v.type === "text" ? (v.raw += h.raw, v.text += h.text) : n.push(h);
          continue;
        }
        if (r) {
          const W = "Infinite loop on byte: " + r.charCodeAt(0);
          if (this.options.silent) {
            console.error(W);
            break;
          } else
            throw new Error(W);
        }
      }
    return n;
  }
}
class Ns {
  constructor(r) {
    jt(this, "options");
    this.options = r || yr;
  }
  code(r, n, h) {
    var m;
    const v = (m = (n || "").match(/^\S*/)) == null ? void 0 : m[0];
    return r = r.replace(/\n$/, "") + `
`, v ? '<pre><code class="language-' + Be(v) + '">' + (h ? r : Be(r, !0)) + `</code></pre>
` : "<pre><code>" + (h ? r : Be(r, !0)) + `</code></pre>
`;
  }
  blockquote(r) {
    return `<blockquote>
${r}</blockquote>
`;
  }
  html(r, n) {
    return r;
  }
  heading(r, n, h) {
    return `<h${n}>${r}</h${n}>
`;
  }
  hr() {
    return `<hr>
`;
  }
  list(r, n, h) {
    const v = n ? "ol" : "ul", m = n && h !== 1 ? ' start="' + h + '"' : "";
    return "<" + v + m + `>
` + r + "</" + v + `>
`;
  }
  listitem(r, n, h) {
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
  table(r, n) {
    return n && (n = `<tbody>${n}</tbody>`), `<table>
<thead>
` + r + `</thead>
` + n + `</table>
`;
  }
  tablerow(r) {
    return `<tr>
${r}</tr>
`;
  }
  tablecell(r, n) {
    const h = n.header ? "th" : "td";
    return (n.align ? `<${h} align="${n.align}">` : `<${h}>`) + r + `</${h}>
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
  link(r, n, h) {
    const v = co(r);
    if (v === null)
      return h;
    r = v;
    let m = '<a href="' + r + '"';
    return n && (m += ' title="' + n + '"'), m += ">" + h + "</a>", m;
  }
  image(r, n, h) {
    const v = co(r);
    if (v === null)
      return h;
    r = v;
    let m = `<img src="${r}" alt="${h}"`;
    return n && (m += ` title="${n}"`), m += ">", m;
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
  link(r, n, h) {
    return "" + h;
  }
  image(r, n, h) {
    return "" + h;
  }
  br() {
    return "";
  }
}
class fi {
  constructor(r) {
    jt(this, "options");
    jt(this, "renderer");
    jt(this, "textRenderer");
    this.options = r || yr, this.options.renderer = this.options.renderer || new Ns(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.textRenderer = new Mn();
  }
  /**
   * Static Parse Method
   */
  static parse(r, n) {
    return new fi(n).parse(r);
  }
  /**
   * Static Parse Inline Method
   */
  static parseInline(r, n) {
    return new fi(n).parseInline(r);
  }
  /**
   * Parse Loop
   */
  parse(r, n = !0) {
    let h = "";
    for (let v = 0; v < r.length; v++) {
      const m = r[v];
      if (this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[m.type]) {
        const y = m, F = this.options.extensions.renderers[y.type].call({ parser: this }, y);
        if (F !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "paragraph", "text"].includes(y.type)) {
          h += F || "";
          continue;
        }
      }
      switch (m.type) {
        case "space":
          continue;
        case "hr": {
          h += this.renderer.hr();
          continue;
        }
        case "heading": {
          const y = m;
          h += this.renderer.heading(this.parseInline(y.tokens), y.depth, ml(this.parseInline(y.tokens, this.textRenderer)));
          continue;
        }
        case "code": {
          const y = m;
          h += this.renderer.code(y.text, y.lang, !!y.escaped);
          continue;
        }
        case "table": {
          const y = m;
          let F = "", B = "";
          for (let W = 0; W < y.header.length; W++)
            B += this.renderer.tablecell(this.parseInline(y.header[W].tokens), { header: !0, align: y.align[W] });
          F += this.renderer.tablerow(B);
          let j = "";
          for (let W = 0; W < y.rows.length; W++) {
            const H = y.rows[W];
            B = "";
            for (let O = 0; O < H.length; O++)
              B += this.renderer.tablecell(this.parseInline(H[O].tokens), { header: !1, align: y.align[O] });
            j += this.renderer.tablerow(B);
          }
          h += this.renderer.table(F, j);
          continue;
        }
        case "blockquote": {
          const y = m, F = this.parse(y.tokens);
          h += this.renderer.blockquote(F);
          continue;
        }
        case "list": {
          const y = m, F = y.ordered, B = y.start, j = y.loose;
          let W = "";
          for (let H = 0; H < y.items.length; H++) {
            const O = y.items[H], X = O.checked, rt = O.task;
            let et = "";
            if (O.task) {
              const ct = this.renderer.checkbox(!!X);
              j ? O.tokens.length > 0 && O.tokens[0].type === "paragraph" ? (O.tokens[0].text = ct + " " + O.tokens[0].text, O.tokens[0].tokens && O.tokens[0].tokens.length > 0 && O.tokens[0].tokens[0].type === "text" && (O.tokens[0].tokens[0].text = ct + " " + O.tokens[0].tokens[0].text)) : O.tokens.unshift({
                type: "text",
                text: ct + " "
              }) : et += ct + " ";
            }
            et += this.parse(O.tokens, j), W += this.renderer.listitem(et, rt, !!X);
          }
          h += this.renderer.list(W, F, B);
          continue;
        }
        case "html": {
          const y = m;
          h += this.renderer.html(y.text, y.block);
          continue;
        }
        case "paragraph": {
          const y = m;
          h += this.renderer.paragraph(this.parseInline(y.tokens));
          continue;
        }
        case "text": {
          let y = m, F = y.tokens ? this.parseInline(y.tokens) : y.text;
          for (; v + 1 < r.length && r[v + 1].type === "text"; )
            y = r[++v], F += `
` + (y.tokens ? this.parseInline(y.tokens) : y.text);
          h += n ? this.renderer.paragraph(F) : F;
          continue;
        }
        default: {
          const y = 'Token with "' + m.type + '" type was not found.';
          if (this.options.silent)
            return console.error(y), "";
          throw new Error(y);
        }
      }
    }
    return h;
  }
  /**
   * Parse Inline Tokens
   */
  parseInline(r, n) {
    n = n || this.renderer;
    let h = "";
    for (let v = 0; v < r.length; v++) {
      const m = r[v];
      if (this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[m.type]) {
        const y = this.options.extensions.renderers[m.type].call({ parser: this }, m);
        if (y !== !1 || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(m.type)) {
          h += y || "";
          continue;
        }
      }
      switch (m.type) {
        case "escape": {
          const y = m;
          h += n.text(y.text);
          break;
        }
        case "html": {
          const y = m;
          h += n.html(y.text);
          break;
        }
        case "link": {
          const y = m;
          h += n.link(y.href, y.title, this.parseInline(y.tokens, n));
          break;
        }
        case "image": {
          const y = m;
          h += n.image(y.href, y.title, y.text);
          break;
        }
        case "strong": {
          const y = m;
          h += n.strong(this.parseInline(y.tokens, n));
          break;
        }
        case "em": {
          const y = m;
          h += n.em(this.parseInline(y.tokens, n));
          break;
        }
        case "codespan": {
          const y = m;
          h += n.codespan(y.text);
          break;
        }
        case "br": {
          h += n.br();
          break;
        }
        case "del": {
          const y = m;
          h += n.del(this.parseInline(y.tokens, n));
          break;
        }
        case "text": {
          const y = m;
          h += n.text(y.text);
          break;
        }
        default: {
          const y = 'Token with "' + m.type + '" type was not found.';
          if (this.options.silent)
            return console.error(y), "";
          throw new Error(y);
        }
      }
    }
    return h;
  }
}
class is {
  constructor(r) {
    jt(this, "options");
    this.options = r || yr;
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
jt(is, "passThroughHooks", /* @__PURE__ */ new Set([
  "preprocess",
  "postprocess",
  "processAllTokens"
]));
var vr, dn, aa;
class Hl {
  constructor(...r) {
    Gn(this, vr);
    jt(this, "defaults", Tn());
    jt(this, "options", this.setOptions);
    jt(this, "parse", _s(this, vr, dn).call(this, hi.lex, fi.parse));
    jt(this, "parseInline", _s(this, vr, dn).call(this, hi.lexInline, fi.parseInline));
    jt(this, "Parser", fi);
    jt(this, "Renderer", Ns);
    jt(this, "TextRenderer", Mn);
    jt(this, "Lexer", hi);
    jt(this, "Tokenizer", Rs);
    jt(this, "Hooks", is);
    this.use(...r);
  }
  /**
   * Run callback for every token
   */
  walkTokens(r, n) {
    var v, m;
    let h = [];
    for (const y of r)
      switch (h = h.concat(n.call(this, y)), y.type) {
        case "table": {
          const F = y;
          for (const B of F.header)
            h = h.concat(this.walkTokens(B.tokens, n));
          for (const B of F.rows)
            for (const j of B)
              h = h.concat(this.walkTokens(j.tokens, n));
          break;
        }
        case "list": {
          const F = y;
          h = h.concat(this.walkTokens(F.items, n));
          break;
        }
        default: {
          const F = y;
          (m = (v = this.defaults.extensions) == null ? void 0 : v.childTokens) != null && m[F.type] ? this.defaults.extensions.childTokens[F.type].forEach((B) => {
            const j = F[B].flat(1 / 0);
            h = h.concat(this.walkTokens(j, n));
          }) : F.tokens && (h = h.concat(this.walkTokens(F.tokens, n)));
        }
      }
    return h;
  }
  use(...r) {
    const n = this.defaults.extensions || { renderers: {}, childTokens: {} };
    return r.forEach((h) => {
      const v = { ...h };
      if (v.async = this.defaults.async || v.async || !1, h.extensions && (h.extensions.forEach((m) => {
        if (!m.name)
          throw new Error("extension name required");
        if ("renderer" in m) {
          const y = n.renderers[m.name];
          y ? n.renderers[m.name] = function(...F) {
            let B = m.renderer.apply(this, F);
            return B === !1 && (B = y.apply(this, F)), B;
          } : n.renderers[m.name] = m.renderer;
        }
        if ("tokenizer" in m) {
          if (!m.level || m.level !== "block" && m.level !== "inline")
            throw new Error("extension level must be 'block' or 'inline'");
          const y = n[m.level];
          y ? y.unshift(m.tokenizer) : n[m.level] = [m.tokenizer], m.start && (m.level === "block" ? n.startBlock ? n.startBlock.push(m.start) : n.startBlock = [m.start] : m.level === "inline" && (n.startInline ? n.startInline.push(m.start) : n.startInline = [m.start]));
        }
        "childTokens" in m && m.childTokens && (n.childTokens[m.name] = m.childTokens);
      }), v.extensions = n), h.renderer) {
        const m = this.defaults.renderer || new Ns(this.defaults);
        for (const y in h.renderer) {
          if (!(y in m))
            throw new Error(`renderer '${y}' does not exist`);
          if (y === "options")
            continue;
          const F = y, B = h.renderer[F], j = m[F];
          m[F] = (...W) => {
            let H = B.apply(m, W);
            return H === !1 && (H = j.apply(m, W)), H || "";
          };
        }
        v.renderer = m;
      }
      if (h.tokenizer) {
        const m = this.defaults.tokenizer || new Rs(this.defaults);
        for (const y in h.tokenizer) {
          if (!(y in m))
            throw new Error(`tokenizer '${y}' does not exist`);
          if (["options", "rules", "lexer"].includes(y))
            continue;
          const F = y, B = h.tokenizer[F], j = m[F];
          m[F] = (...W) => {
            let H = B.apply(m, W);
            return H === !1 && (H = j.apply(m, W)), H;
          };
        }
        v.tokenizer = m;
      }
      if (h.hooks) {
        const m = this.defaults.hooks || new is();
        for (const y in h.hooks) {
          if (!(y in m))
            throw new Error(`hook '${y}' does not exist`);
          if (y === "options")
            continue;
          const F = y, B = h.hooks[F], j = m[F];
          is.passThroughHooks.has(y) ? m[F] = (W) => {
            if (this.defaults.async)
              return Promise.resolve(B.call(m, W)).then((O) => j.call(m, O));
            const H = B.call(m, W);
            return j.call(m, H);
          } : m[F] = (...W) => {
            let H = B.apply(m, W);
            return H === !1 && (H = j.apply(m, W)), H;
          };
        }
        v.hooks = m;
      }
      if (h.walkTokens) {
        const m = this.defaults.walkTokens, y = h.walkTokens;
        v.walkTokens = function(F) {
          let B = [];
          return B.push(y.call(this, F)), m && (B = B.concat(m.call(this, F))), B;
        };
      }
      this.defaults = { ...this.defaults, ...v };
    }), this;
  }
  setOptions(r) {
    return this.defaults = { ...this.defaults, ...r }, this;
  }
  lexer(r, n) {
    return hi.lex(r, n ?? this.defaults);
  }
  parser(r, n) {
    return fi.parse(r, n ?? this.defaults);
  }
}
vr = new WeakSet(), dn = function(r, n) {
  return (h, v) => {
    const m = { ...v }, y = { ...this.defaults, ...m };
    this.defaults.async === !0 && m.async === !1 && (y.silent || console.warn("marked(): The async option was set to true by an extension. The async: false option sent to parse will be ignored."), y.async = !0);
    const F = _s(this, vr, aa).call(this, !!y.silent, !!y.async);
    if (typeof h > "u" || h === null)
      return F(new Error("marked(): input parameter is undefined or null"));
    if (typeof h != "string")
      return F(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(h) + ", string expected"));
    if (y.hooks && (y.hooks.options = y), y.async)
      return Promise.resolve(y.hooks ? y.hooks.preprocess(h) : h).then((B) => r(B, y)).then((B) => y.hooks ? y.hooks.processAllTokens(B) : B).then((B) => y.walkTokens ? Promise.all(this.walkTokens(B, y.walkTokens)).then(() => B) : B).then((B) => n(B, y)).then((B) => y.hooks ? y.hooks.postprocess(B) : B).catch(F);
    try {
      y.hooks && (h = y.hooks.preprocess(h));
      let B = r(h, y);
      y.hooks && (B = y.hooks.processAllTokens(B)), y.walkTokens && this.walkTokens(B, y.walkTokens);
      let j = n(B, y);
      return y.hooks && (j = y.hooks.postprocess(j)), j;
    } catch (B) {
      return F(B);
    }
  };
}, aa = function(r, n) {
  return (h) => {
    if (h.message += `
Please report this to https://github.com/markedjs/marked.`, r) {
      const v = "<p>An error occurred:</p><pre>" + Be(h.message + "", !0) + "</pre>";
      return n ? Promise.resolve(v) : v;
    }
    if (n)
      return Promise.reject(h);
    throw h;
  };
};
const gr = new Hl();
function Lt(l, r) {
  return gr.parse(l, r);
}
Lt.options = Lt.setOptions = function(l) {
  return gr.setOptions(l), Lt.defaults = gr.defaults, Ko(Lt.defaults), Lt;
};
Lt.getDefaults = Tn;
Lt.defaults = yr;
Lt.use = function(...l) {
  return gr.use(...l), Lt.defaults = gr.defaults, Ko(Lt.defaults), Lt;
};
Lt.walkTokens = function(l, r) {
  return gr.walkTokens(l, r);
};
Lt.parseInline = gr.parseInline;
Lt.Parser = fi;
Lt.parser = fi.parse;
Lt.Renderer = Ns;
Lt.TextRenderer = Mn;
Lt.Lexer = hi;
Lt.lexer = hi.lex;
Lt.Tokenizer = Rs;
Lt.Hooks = is;
Lt.parse = Lt;
Lt.options;
Lt.setOptions;
Lt.use;
Lt.walkTokens;
Lt.parseInline;
fi.parse;
hi.lex;
/*! @license DOMPurify 3.4.15 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.4.15/LICENSE */
function go(l, r) {
  (r == null || r > l.length) && (r = l.length);
  for (var n = 0, h = Array(r); n < r; n++) h[n] = l[n];
  return h;
}
function ql(l) {
  if (Array.isArray(l)) return l;
}
function Gl(l, r) {
  var n = l == null ? null : typeof Symbol < "u" && l[Symbol.iterator] || l["@@iterator"];
  if (n != null) {
    var h, v, m, y, F = [], B = !0, j = !1;
    try {
      if (m = (n = n.call(l)).next, r !== 0) for (; !(B = (h = m.call(n)).done) && (F.push(h.value), F.length !== r); B = !0) ;
    } catch (W) {
      j = !0, v = W;
    } finally {
      try {
        if (!B && n.return != null && (y = n.return(), Object(y) !== y)) return;
      } finally {
        if (j) throw v;
      }
    }
    return F;
  }
}
function Yl() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Xl(l, r) {
  return ql(l) || Gl(l, r) || Zl(l, r) || Yl();
}
function Zl(l, r) {
  if (l) {
    if (typeof l == "string") return go(l, r);
    var n = {}.toString.call(l).slice(8, -1);
    return n === "Object" && l.constructor && (n = l.constructor.name), n === "Map" || n === "Set" ? Array.from(l) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? go(l, r) : void 0;
  }
}
const la = Object.entries, vo = Object.setPrototypeOf, Kl = Object.isFrozen, Ql = Object.getPrototypeOf, Jl = Object.getOwnPropertyDescriptor;
let ae = Object.freeze, fe = Object.seal, Ir = Object.create, ha = typeof Reflect < "u" && Reflect, mn = ha.apply, gn = ha.construct;
ae || (ae = function(r) {
  return r;
});
fe || (fe = function(r) {
  return r;
});
mn || (mn = function(r, n) {
  for (var h = arguments.length, v = new Array(h > 2 ? h - 2 : 0), m = 2; m < h; m++)
    v[m - 2] = arguments[m];
  return r.apply(n, v);
});
gn || (gn = function(r) {
  for (var n = arguments.length, h = new Array(n > 1 ? n - 1 : 0), v = 1; v < n; v++)
    h[v - 1] = arguments[v];
  return new r(...h);
});
const dr = ie(Array.prototype.forEach), th = ie(Array.prototype.lastIndexOf), yo = ie(Array.prototype.pop), Zr = ie(Array.prototype.push), eh = ie(Array.prototype.splice), Lr = Array.isArray, Jr = ie(String.prototype.toLowerCase), rn = ie(String.prototype.toString), _o = ie(String.prototype.match), Kr = ie(String.prototype.replace), bo = ie(String.prototype.indexOf), ih = ie(String.prototype.trim), rh = ie(Number.prototype.toString), sh = ie(Boolean.prototype.toString), wo = typeof BigInt > "u" ? null : ie(BigInt.prototype.toString), ko = typeof Symbol > "u" ? null : ie(Symbol.prototype.toString), Le = ie(Object.prototype.hasOwnProperty), Qr = ie(Object.prototype.toString), ke = ie(RegExp.prototype.test), cr = nh(TypeError);
function ie(l) {
  return function(r) {
    r instanceof RegExp && (r.lastIndex = 0);
    for (var n = arguments.length, h = new Array(n > 1 ? n - 1 : 0), v = 1; v < n; v++)
      h[v - 1] = arguments[v];
    return mn(l, r, h);
  };
}
function nh(l) {
  return function() {
    for (var r = arguments.length, n = new Array(r), h = 0; h < r; h++)
      n[h] = arguments[h];
    return gn(l, n);
  };
}
function kt(l, r) {
  let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : Jr;
  if (vo && vo(l, null), !Lr(r))
    return l;
  let h = r.length;
  for (; h--; ) {
    let v = r[h];
    if (typeof v == "string") {
      const m = n(v);
      m !== v && (Kl(r) || (r[h] = m), v = m);
    }
    l[v] = !0;
  }
  return l;
}
function oh(l) {
  for (let r = 0; r < l.length; r++)
    Le(l, r) || (l[r] = null);
  return l;
}
function De(l) {
  const r = Ir(null);
  for (const h of la(l)) {
    var n = Xl(h, 2);
    const v = n[0], m = n[1];
    Le(l, v) && (Lr(m) ? r[v] = oh(m) : m && typeof m == "object" && m.constructor === Object ? r[v] = De(m) : r[v] = m);
  }
  return r;
}
function ah(l) {
  switch (typeof l) {
    case "string":
      return l;
    case "number":
      return rh(l);
    case "boolean":
      return sh(l);
    case "bigint":
      return wo ? wo(l) : "0";
    case "symbol":
      return ko ? ko(l) : "Symbol()";
    case "undefined":
      return Qr(l);
    case "function":
    case "object": {
      if (l === null)
        return Qr(l);
      const r = l, n = We(r, "toString");
      if (typeof n == "function") {
        const h = n(r);
        return typeof h == "string" ? h : Qr(h);
      }
      return Qr(l);
    }
    default:
      return Qr(l);
  }
}
function We(l, r) {
  for (; l !== null; ) {
    const h = Jl(l, r);
    if (h) {
      if (h.get)
        return ie(h.get);
      if (typeof h.value == "function")
        return ie(h.value);
    }
    l = Ql(l);
  }
  function n() {
    return null;
  }
  return n;
}
function lh(l) {
  try {
    return ke(l, ""), !0;
  } catch {
    return !1;
  }
}
const xo = ae(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "search", "section", "select", "shadow", "slot", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]), sn = ae(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "enterkeyhint", "exportparts", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "inputmode", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "part", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]), nn = ae(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]), hh = ae(["animate", "color-profile", "cursor", "discard", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]), on = ae(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "mprescripts"]), fh = ae(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]), To = ae(["#text"]), Ao = ae(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "command", "commandfor", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "exportparts", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inert", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "part", "pattern", "placeholder", "playsinline", "popover", "popovertarget", "popovertargetaction", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "slot", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "wrap", "xmlns"]), an = ae(["accent-height", "accumulate", "additive", "alignment-baseline", "amplitude", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dominant-baseline", "dur", "edgemode", "elevation", "end", "exponent", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "intercept", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "mask-type", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "pointer-events", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "slope", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "tablevalues", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-orientation", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "vector-effect", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]), So = ae(["accent", "accentunder", "align", "bevelled", "close", "columnalign", "columnlines", "columnspacing", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lquote", "lspace", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]), xs = ae(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]), ch = fe(/{{[\w\W]*|^[\w\W]*}}/g), uh = fe(/<%[\w\W]*|^[\w\W]*%>/g), ph = fe(/\${[\w\W]*/g), dh = fe(/^data-[\-\w.\u00B7-\uFFFF]+$/), mh = fe(/^aria-[\-\w]+$/), Co = fe(
  /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  // eslint-disable-line no-useless-escape
), gh = fe(/^(?:\w+script|data):/i), vh = fe(
  /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g
  // eslint-disable-line no-control-regex
), yh = fe(/^html$/i), _h = fe(/^[a-z][.\w]*(-[.\w]+)+$/i), Eo = fe(/<[/\w!]/g), Po = fe(/<[/\w]/g), bh = fe(/<\/no(script|embed|frames)/i), wh = fe(/\/>/i), ze = {
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
}, fa = ["style", "script", "xmp", "iframe", "noembed", "noframes", "plaintext", "noscript"], kh = ae(kt({}, fa)), xh = function() {
  const l = {};
  return dr(fa, (r) => {
    l[r] = fe(new RegExp("</" + r + "(?=[\\t\\n\\f\\r />])", "i"));
  }), ae(l);
}(), Th = function() {
  return typeof window > "u" ? null : window;
}, Ah = function(r, n) {
  if (typeof r != "object" || typeof r.createPolicy != "function")
    return null;
  let h = null;
  const v = "data-tt-policy-suffix";
  n && n.hasAttribute(v) && (h = n.getAttribute(v));
  const m = "dompurify" + (h ? "#" + h : "");
  try {
    return r.createPolicy(m, {
      createHTML(y) {
        return y;
      },
      createScriptURL(y) {
        return y;
      }
    });
  } catch {
    return console.warn("TrustedTypes policy " + m + " could not be created."), null;
  }
}, Mo = function() {
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
}, Ki = function(r, n, h, v) {
  return Le(r, n) && Lr(r[n]) ? kt(v.base ? De(v.base) : {}, r[n], v.transform) : h;
}, ln = function(r, n, h) {
  const v = Le(r, n) ? r[n] : void 0;
  return v && typeof v == "object" ? De(v) : h();
};
function ca() {
  let l = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : Th();
  const r = (Z) => ca(Z);
  if (r.version = "3.4.15", r.removed = [], !l || !l.document || l.document.nodeType !== ze.document || !l.Element)
    return r.isSupported = !1, r;
  let n = l.document;
  const h = n, v = h.currentScript;
  l.DocumentFragment;
  const m = l.HTMLTemplateElement, y = l.Node, F = l.Element, B = l.NodeFilter, j = l.NamedNodeMap;
  j === void 0 && (l.NamedNodeMap || l.MozNamedAttrMap), l.HTMLFormElement;
  const W = l.DOMParser, H = l.trustedTypes, O = F.prototype, X = We(O, "cloneNode"), rt = We(O, "remove"), et = We(O, "removeAttributeNode"), ct = We(O, "nextSibling"), _t = We(O, "childNodes"), dt = We(O, "parentNode"), Ct = We(O, "shadowRoot"), Mt = We(O, "attributes"), Bt = y && y.prototype ? We(y.prototype, "nodeType") : null, Ot = y && y.prototype ? We(y.prototype, "nodeName") : null, me = y && y.prototype ? We(y.prototype, "ownerDocument") : null, re = function(k) {
    return Bt ? Bt(k) : k.nodeType;
  }, Et = function(k) {
    return Ot ? Ot(k) : k.nodeName;
  };
  if (typeof m == "function") {
    const Z = n.createElement("template");
    Z.content && Z.content.ownerDocument && (n = Z.content.ownerDocument);
  }
  let wt, Yt = "", ci, Qe = !1, Ve = 0;
  const Je = function() {
    if (Ve > 0)
      throw cr('A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the "DOMPurify and Trusted Types" section of the README.');
  }, xe = function(k) {
    Je(), Ve++;
    try {
      return wt.createHTML(k);
    } finally {
      Ve--;
    }
  }, Ei = function(k) {
    Je(), Ve++;
    try {
      return wt.createScriptURL(k);
    } finally {
      Ve--;
    }
  }, Gt = function() {
    return Qe || (ci = Ah(H, v), Qe = !0), ci;
  }, He = n, ge = He.implementation, ui = He.createNodeIterator, _r = He.createDocumentFragment, br = He.getElementsByTagName, Ji = h.importNode;
  let xt = Mo();
  r.isSupported = typeof la == "function" && typeof dt == "function" && ge && ge.createHTMLDocument !== void 0;
  const Pi = ch, ti = uh, Mi = ph, Ii = dh, Fr = mh, ut = gh, Li = vh, qe = _h;
  let wr = Co, Ft = null;
  const tr = kt({}, [...xo, ...sn, ...nn, ...on, ...To]);
  let Nt = null;
  const Ge = kt({}, [...Ao, ...an, ...So, ...xs]);
  let ce = Object.seal(Ir(null, {
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
  })), Ye = null, er = null;
  const ve = Object.seal(Ir(null, {
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
  let ht = !0, Wt = !0, ei = !1, Fi = !0, ye = !1, K = !0, mt = !1, It = !1, bt = null, Ht = null, ue = !1, Fe = !1, Ut = !1, se = !1, $e = !0, pi = !1;
  const di = "user-content-";
  let Ri = !0, Oi = !1, Ni = {}, zi = null;
  const as = kt({}, [
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
  let ls = null;
  const J = kt({}, ["audio", "video", "img", "source", "image", "track"]);
  let Kt = null;
  const ii = kt({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]), Ae = "http://www.w3.org/1998/Math/MathML", Xt = "http://www.w3.org/2000/svg", Se = "http://www.w3.org/1999/xhtml";
  let Re = Se, Di = !1, Qt = null;
  const Rr = kt({}, [Ae, Xt, Se], rn), Tt = ae(["mi", "mo", "mn", "ms", "mtext"]);
  let Or = kt({}, Tt);
  const Nr = ae(["annotation-xml"]);
  let zr = kt({}, Nr);
  const Vs = kt({}, ["title", "style", "font", "a", "script"]);
  let ir = null;
  const $s = ["application/xhtml+xml", "text/html"], Us = "text/html";
  let qt = null, Bi = null;
  const js = n.createElement("form"), hs = function(k) {
    return k instanceof RegExp || k instanceof Function;
  }, kr = function() {
    let k = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (Bi && Bi === k)
      return;
    (!k || typeof k != "object") && (k = {}), k = De(k), ir = // eslint-disable-next-line unicorn/prefer-includes
    $s.indexOf(k.PARSER_MEDIA_TYPE) === -1 ? Us : k.PARSER_MEDIA_TYPE, qt = ir === "application/xhtml+xml" ? rn : Jr, Ft = Ki(k, "ALLOWED_TAGS", tr, {
      transform: qt
    }), Nt = Ki(k, "ALLOWED_ATTR", Ge, {
      transform: qt
    }), Qt = Ki(k, "ALLOWED_NAMESPACES", Rr, {
      transform: rn
    }), Kt = Ki(k, "ADD_URI_SAFE_ATTR", ii, {
      transform: qt,
      base: ii
    }), ls = Ki(k, "ADD_DATA_URI_TAGS", J, {
      transform: qt,
      base: J
    }), zi = Ki(k, "FORBID_CONTENTS", as, {
      transform: qt
    }), Ye = Ki(k, "FORBID_TAGS", De({}), {
      transform: qt
    }), er = Ki(k, "FORBID_ATTR", De({}), {
      transform: qt
    }), Ni = Le(k, "USE_PROFILES") ? k.USE_PROFILES && typeof k.USE_PROFILES == "object" ? De(k.USE_PROFILES) : k.USE_PROFILES : !1, ht = k.ALLOW_ARIA_ATTR !== !1, Wt = k.ALLOW_DATA_ATTR !== !1, ei = k.ALLOW_UNKNOWN_PROTOCOLS || !1, Fi = k.ALLOW_SELF_CLOSE_IN_ATTR !== !1, ye = k.SAFE_FOR_TEMPLATES || !1, K = k.SAFE_FOR_XML !== !1, mt = k.WHOLE_DOCUMENT || !1, Fe = k.RETURN_DOM || !1, Ut = k.RETURN_DOM_FRAGMENT || !1, se = k.RETURN_TRUSTED_TYPE || !1, ue = k.FORCE_BODY || !1, $e = k.SANITIZE_DOM !== !1, pi = k.SANITIZE_NAMED_PROPS || !1, Ri = k.KEEP_CONTENT !== !1, Oi = k.IN_PLACE || !1, wr = lh(k.ALLOWED_URI_REGEXP) ? k.ALLOWED_URI_REGEXP : Co, Re = typeof k.NAMESPACE == "string" ? k.NAMESPACE : Se, Or = ln(
      k,
      "MATHML_TEXT_INTEGRATION_POINTS",
      () => kt({}, Tt)
      // Default built-in map
    ), zr = ln(
      k,
      "HTML_INTEGRATION_POINTS",
      () => kt({}, Nr)
      // Default built-in map
    );
    const z = ln(k, "CUSTOM_ELEMENT_HANDLING", () => Ir(null));
    if (ce = Ir(null), Le(z, "tagNameCheck") && hs(z.tagNameCheck) && (ce.tagNameCheck = z.tagNameCheck), Le(z, "attributeNameCheck") && hs(z.attributeNameCheck) && (ce.attributeNameCheck = z.attributeNameCheck), Le(z, "allowCustomizedBuiltInElements") && typeof z.allowCustomizedBuiltInElements == "boolean" && (ce.allowCustomizedBuiltInElements = z.allowCustomizedBuiltInElements), fe(ce), ye && (Wt = !1), Ut && (Fe = !0), Ni && (Ft = kt({}, To), Nt = Ir(null), Ni.html === !0 && (kt(Ft, xo), kt(Nt, Ao)), Ni.svg === !0 && (kt(Ft, sn), kt(Nt, an), kt(Nt, xs)), Ni.svgFilters === !0 && (kt(Ft, nn), kt(Nt, an), kt(Nt, xs)), Ni.mathMl === !0 && (kt(Ft, on), kt(Nt, So), kt(Nt, xs))), ve.tagCheck = null, ve.attributeCheck = null, Le(k, "ADD_TAGS") && (typeof k.ADD_TAGS == "function" ? ve.tagCheck = k.ADD_TAGS : Lr(k.ADD_TAGS) && (Ft === tr && (Ft = De(Ft)), kt(Ft, k.ADD_TAGS, qt))), Le(k, "ADD_ATTR") && (typeof k.ADD_ATTR == "function" ? ve.attributeCheck = k.ADD_ATTR : Lr(k.ADD_ATTR) && (Nt === Ge && (Nt = De(Nt)), kt(Nt, k.ADD_ATTR, qt))), Le(k, "ADD_FORBID_CONTENTS") && Lr(k.ADD_FORBID_CONTENTS) && (zi === as && (zi = De(zi)), kt(zi, k.ADD_FORBID_CONTENTS, qt)), Ri && (Ft["#text"] = !0), mt && kt(Ft, ["html", "head", "body"]), Ft.table && (kt(Ft, ["tbody"]), delete Ye.tbody), k.TRUSTED_TYPES_POLICY) {
      if (typeof k.TRUSTED_TYPES_POLICY.createHTML != "function")
        throw cr('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
      if (typeof k.TRUSTED_TYPES_POLICY.createScriptURL != "function")
        throw cr('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
      const q = wt;
      wt = k.TRUSTED_TYPES_POLICY;
      try {
        Yt = xe("");
      } catch (it) {
        throw wt = q, it;
      }
    } else k.TRUSTED_TYPES_POLICY === null ? (wt = void 0, Yt = "") : (wt === void 0 && (wt = Gt()), wt && typeof Yt == "string" && (Yt = xe("")));
    ae && ae(k), Bi = k;
  }, Dr = kt({}, [...sn, ...nn, ...hh]), fs = kt({}, [...on, ...fh]), cs = function(k, z, q) {
    return z.namespaceURI === Se ? k === "svg" : z.namespaceURI === Ae ? k === "svg" && (q === "annotation-xml" || Or[q]) : !!Dr[k];
  }, Ws = function(k, z, q) {
    return z.namespaceURI === Se ? k === "math" : z.namespaceURI === Xt ? k === "math" && zr[q] : !!fs[k];
  }, ri = function(k, z, q) {
    return z.namespaceURI === Xt && !zr[q] || z.namespaceURI === Ae && !Or[q] ? !1 : !fs[k] && (Vs[k] || !Dr[k]);
  }, Ce = function(k) {
    let z = dt(k);
    (!z || !z.tagName) && (z = {
      namespaceURI: Re,
      tagName: "template"
    });
    const q = Jr(k.tagName), it = Jr(z.tagName);
    return Qt[k.namespaceURI] ? k.namespaceURI === Xt ? cs(q, z, it) : k.namespaceURI === Ae ? Ws(q, z, it) : k.namespaceURI === Se ? ri(q, z, it) : !!(ir === "application/xhtml+xml" && Qt[k.namespaceURI]) : !1;
  }, Jt = function(k) {
    Zr(r.removed, {
      element: k
    });
    try {
      dt(k).removeChild(k);
    } catch {
      if (rt(k), !dt(k))
        throw cr("a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place");
    }
  }, Vi = function(k, z, q) {
    try {
      et(k, z);
    } catch {
      try {
        k.removeAttribute(q);
      } catch {
      }
    }
  }, $i = function(k) {
    mi(k);
    const z = _t(k);
    if (z) {
      const it = [];
      dr(z, (ot) => {
        Zr(it, ot);
      }), dr(it, (ot) => {
        try {
          rt(ot);
        } catch {
        }
      });
    }
    const q = Mt(k);
    if (q)
      for (let it = q.length - 1; it >= 0; --it) {
        const ot = q[it], ft = ot && ot.name;
        typeof ft == "string" && Vi(k, ot, ft);
      }
  }, le = function(k, z, q) {
    if (!q)
      try {
        q = z.getAttributeNode(k);
      } catch {
        q = null;
      }
    Zr(r.removed, {
      attribute: q || null,
      from: z
    });
    try {
      q ? et(z, q) : z.removeAttribute(k);
    } catch {
      try {
        z.removeAttribute(k);
      } catch {
      }
    }
    if (k === "is")
      if (Fe || Ut)
        try {
          Jt(z);
        } catch {
        }
      else
        try {
          z.setAttribute(k, "");
        } catch {
        }
  }, rr = function(k) {
    const z = Mt(k);
    if (z)
      for (let q = z.length - 1; q >= 0; --q) {
        const it = z[q], ot = it && it.name;
        typeof ot != "string" || Nt[qt(ot)] || Vi(k, it, ot);
      }
  }, mi = function(k) {
    const z = [k];
    for (; z.length > 0; ) {
      const q = z.pop();
      re(q) === ze.element && rr(q);
      const ot = _t(q);
      if (ot)
        for (let ft = ot.length - 1; ft >= 0; --ft)
          z.push(ot[ft]);
    }
  }, xr = function(k, z) {
    return K ? k === "patchsrc" ? !0 : k === "for" && z !== "label" && z !== "output" : !1;
  }, us = function(k) {
    if (!K)
      return;
    const z = [k];
    for (; z.length > 0; ) {
      const q = z.pop(), it = re(q);
      if (it === ze.processingInstruction || it === ze.comment && ke(Po, q.data)) {
        try {
          rt(q);
        } catch {
        }
        continue;
      }
      if (it === ze.element) {
        const ft = q, Rt = qt(Et(q));
        try {
          ft.hasAttribute && ft.hasAttribute("patchsrc") && ft.removeAttribute("patchsrc"), ft.hasAttribute && ft.hasAttribute("for") && xr("for", Rt) && ft.removeAttribute("for");
        } catch {
        }
      }
      const ot = _t(q);
      if (ot)
        for (let ft = ot.length - 1; ft >= 0; --ft)
          z.push(ot[ft]);
    }
  }, Xe = function(k) {
    let z = null, q = null;
    if (ue)
      k = "<remove></remove>" + k;
    else {
      const ft = _o(k, /^[\r\n\t ]+/);
      q = ft && ft[0];
    }
    ir === "application/xhtml+xml" && Re === Se && (k = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + k + "</body></html>");
    const it = wt ? xe(k) : k;
    if (Re === Se)
      try {
        z = new W().parseFromString(it, ir);
      } catch {
      }
    if (!z || !z.documentElement) {
      z = ge.createDocument(Re, "template", null);
      try {
        z.documentElement.innerHTML = Di ? Yt : it;
      } catch {
      }
    }
    const ot = z.body || z.documentElement;
    return k && q && ot.insertBefore(n.createTextNode(q), ot.childNodes[0] || null), Re === Se ? br.call(z, mt ? "html" : "body")[0] : mt ? z.documentElement : ot;
  }, ps = function(k) {
    const z = me ? me(k) : k.ownerDocument;
    return ui.call(
      z || k,
      k,
      // eslint-disable-next-line no-bitwise
      B.SHOW_ELEMENT | B.SHOW_COMMENT | B.SHOW_TEXT | B.SHOW_PROCESSING_INSTRUCTION | B.SHOW_CDATA_SECTION,
      null
    );
  }, sr = function(k) {
    return k = Kr(k, Pi, " "), k = Kr(k, ti, " "), k = Kr(k, Mi, " "), k;
  }, Tr = function(k) {
    var z;
    k.normalize();
    const q = me ? me(k) : k.ownerDocument, it = ui.call(
      q || k,
      k,
      // eslint-disable-next-line no-bitwise
      B.SHOW_TEXT | B.SHOW_COMMENT | B.SHOW_CDATA_SECTION | B.SHOW_PROCESSING_INSTRUCTION,
      null
    );
    let ot = it.nextNode();
    for (; ot; )
      ot.data = sr(ot.data), ot = it.nextNode();
    const ft = (z = k.querySelectorAll) === null || z === void 0 ? void 0 : z.call(k, "template");
    ft && dr(ft, (Rt) => {
      gi(Rt.content) && Tr(Rt.content);
    });
  }, $t = function(k) {
    const z = Ot ? Ot(k) : null;
    return typeof z != "string" || qt(z) !== "form" ? !1 : typeof k.nodeName != "string" || typeof k.textContent != "string" || typeof k.removeChild != "function" || // Realm-safe NamedNodeMap detection: equality against the cached
    // prototype getter. Clobbered .attributes (e.g. <input name="attributes">)
    // makes the direct read diverge from the cached read; a clean form
    // (same-realm OR foreign-realm) has both reads pointing at the same
    // canonical NamedNodeMap.
    k.attributes !== Mt(k) || typeof k.removeAttribute != "function" || // A form descendant named "removeAttributeNode" or "getAttributeNode"
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
    k.nodeType !== Bt(k) || // HTMLFormElement has [LegacyOverrideBuiltIns]: a descendant named
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
    k.childNodes !== _t(k);
  }, gi = function(k) {
    if (!Bt || typeof k != "object" || k === null)
      return !1;
    try {
      return Bt(k) === ze.documentFragment;
    } catch {
      return !1;
    }
  }, si = function(k) {
    if (!Bt || typeof k != "object" || k === null)
      return !1;
    try {
      return typeof Bt(k) == "number";
    } catch {
      return !1;
    }
  };
  function Oe(Z, k, z) {
    Z.length !== 0 && dr(Z, (q) => {
      q.call(r, k, z, Bi);
    });
  }
  const Hs = function(k, z) {
    return !!(K && k.hasChildNodes() && !si(k.firstElementChild) && ke(Eo, k.textContent) && ke(Eo, k.innerHTML) || K && k.namespaceURI === Se && kh[z] && (si(k.firstElementChild) || typeof k.textContent == "string" && ke(xh[z], k.textContent)) || k.nodeType === ze.processingInstruction || K && k.nodeType === ze.comment && ke(Po, k.data));
  }, ni = function(k, z) {
    if (k instanceof RegExp)
      return ke(k, z);
    if (k instanceof Function) {
      for (var q = arguments.length, it = new Array(q > 2 ? q - 2 : 0), ot = 2; ot < q; ot++)
        it[ot - 2] = arguments[ot];
      return !!k(z, ...it);
    }
    return !1;
  }, Br = function(k, z, q) {
    if (!Ye[z] && Vr(z) && ni(ce.tagNameCheck, z))
      return !1;
    if (Ri && !zi[z]) {
      const it = dt(k), ot = _t(k);
      if (ot && it) {
        const ft = ot.length;
        for (let Rt = ft - 1; Rt >= 0; --Rt) {
          const Pt = k === q ? X(ot[Rt], !0) : ot[Rt];
          it.insertBefore(Pt, ct(k));
        }
      }
    }
    return Jt(k), !0;
  }, nr = function(k, z, q, it) {
    return k.length === 0 ? z : z === q || z === it ? De(z) : z;
  }, vi = function(k, z) {
    return k === z || dt(k) !== null ? !1 : (Oi && mi(k), !0);
  }, Ar = function(k, z) {
    if (Oe(xt.beforeSanitizeElements, k, null), vi(k, z))
      return !0;
    if ($t(k))
      return Jt(k), !0;
    const q = qt(Et(k));
    if (Ft = nr(xt.uponSanitizeElement, Ft, tr, bt), Oe(xt.uponSanitizeElement, k, {
      tagName: q,
      allowedTags: Ft
    }), vi(k, z))
      return !0;
    if (Hs(k, q))
      return Jt(k), !0;
    if (Ye[q] || !(ve.tagCheck instanceof Function && ve.tagCheck(q)) && !Ft[q]) {
      const ot = Br(k, q, z);
      return ot === !1 && Oe(xt.afterSanitizeElements, k, null), ot;
    }
    if (re(k) === ze.element && !Ce(k) || (q === "noscript" || q === "noembed" || q === "noframes") && ke(bh, k.innerHTML))
      return Jt(k), !0;
    if (ye && k.nodeType === ze.text) {
      const ot = sr(k.textContent);
      k.textContent !== ot && (Zr(r.removed, {
        element: k.cloneNode()
      }), k.textContent = ot);
    }
    return Oe(xt.afterSanitizeElements, k, null), !1;
  }, yi = function(k, z, q) {
    if (er[z] || xr(z, k) || $e && (z === "id" || z === "name") && (q in n || q in js))
      return !1;
    const it = Nt[z] || ve.attributeCheck instanceof Function && ve.attributeCheck(z, k);
    return Wt && ke(Ii, z) || ht && ke(Fr, z) ? !0 : it ? Kt[z] || ke(wr, Kr(q, Li, "")) || (z === "src" || z === "xlink:href" || z === "href") && k !== "script" && bo(q, "data:") === 0 && ls[k] || ei && !ke(ut, Kr(q, Li, "")) ? !0 : !q : (
      // Condition a) covers a basically valid custom element tag name whose
      // tag passes the configured tagNameCheck and whose attribute name
      // passes the configured attributeNameCheck ...
      Vr(k) && ni(ce.tagNameCheck, k) && ni(ce.attributeNameCheck, z, k) || // Condition b) covers an `is` attribute whose value passes the
      // configured tagNameCheck while customized built-in elements are
      // allowed.
      z === "is" && ce.allowCustomizedBuiltInElements && ni(ce.tagNameCheck, q)
    );
  }, or = kt({}, ["annotation-xml", "color-profile", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "missing-glyph"]), Vr = function(k) {
    return !or[Jr(k)] && ke(qe, k);
  }, qs = function(k, z, q, it) {
    if (wt && typeof H == "object" && typeof H.getAttributeType == "function" && !q)
      switch (H.getAttributeType(k, z)) {
        case "TrustedHTML":
          return xe(it);
        case "TrustedScriptURL":
          return Ei(it);
      }
    return it;
  }, Gs = function(k, z, q, it) {
    try {
      return q ? k.setAttributeNS(q, z, it) : k.setAttribute(z, it), $t(k) ? (Jt(k), !1) : !0;
    } catch {
      return le(z, k), !1;
    }
  }, $r = function(k) {
    Oe(xt.beforeSanitizeAttributes, k, null);
    const z = k.attributes;
    if (!z || $t(k))
      return;
    Nt = nr(xt.uponSanitizeAttribute, Nt, Ge, Ht);
    const q = {
      attrName: "",
      attrValue: "",
      keepAttr: !0,
      allowedAttributes: Nt,
      forceKeepAttr: void 0
    };
    let it = z.length;
    const ot = qt(k.nodeName);
    for (; it--; ) {
      const ft = z[it], Rt = ft.name, Pt = ft.namespaceURI, pe = ft.value, _e = qt(Rt), Ui = pe;
      let ne = Rt === "value" ? Ui : ih(Ui), ds = !1;
      if (q.attrName = _e, q.attrValue = ne, q.keepAttr = !0, q.forceKeepAttr = void 0, Oe(xt.uponSanitizeAttribute, k, q), ne = q.attrValue, pi && (_e === "id" || _e === "name") && bo(ne, di) !== 0 && (le(Rt, k, ft), ne = di + ne, ds = !0), K && ke(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i, ne)) {
        le(Rt, k, ft);
        continue;
      }
      if (_e === "attributename" && _o(ne, "href")) {
        le(Rt, k, ft);
        continue;
      }
      if (!q.forceKeepAttr) {
        if (!q.keepAttr) {
          le(Rt, k, ft);
          continue;
        }
        if (!Fi && ke(wh, ne)) {
          le(Rt, k, ft);
          continue;
        }
        if (ye && (ne = sr(ne)), !yi(ot, _e, ne)) {
          le(Rt, k, ft);
          continue;
        }
        ne = qs(ot, _e, Pt, ne), ne !== Ui && Gs(k, Rt, Pt, ne) && ds && yo(r.removed);
      }
    }
    Oe(xt.afterSanitizeAttributes, k, null);
  }, Sr = function(k) {
    let z = null;
    const q = ps(k);
    for (Oe(xt.beforeSanitizeShadowDOM, k, null); z = q.nextNode(); )
      if (Oe(xt.uponSanitizeShadowNode, z, null), Ar(z, k), $r(z), gi(z.content) && Sr(z.content), re(z) === ze.element) {
        const it = Ct(z);
        gi(it) && (ar(it), Sr(it));
      }
    Oe(xt.afterSanitizeShadowDOM, k, null);
  }, ar = function(k) {
    const z = [{
      node: k,
      shadow: null
    }];
    for (; z.length > 0; ) {
      const q = z.pop();
      if (q.shadow) {
        Sr(q.shadow);
        continue;
      }
      const it = q.node, ft = re(it) === ze.element, Rt = _t(it);
      if (Rt)
        for (let Pt = Rt.length - 1; Pt >= 0; --Pt)
          z.push({
            node: Rt[Pt],
            shadow: null
          });
      if (ft) {
        const Pt = Ot ? Ot(it) : null;
        if (typeof Pt == "string" && qt(Pt) === "template") {
          const pe = it.content;
          gi(pe) && z.push({
            node: pe,
            shadow: null
          });
        }
      }
      if (ft) {
        const Pt = Ct(it);
        gi(Pt) && z.push({
          node: null,
          shadow: Pt
        }, {
          node: Pt,
          shadow: null
        });
      }
    }
  };
  return r.sanitize = function(Z) {
    let k = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, z = null, q = null, it = null, ot = null;
    if (Di = !Z, Di && (Z = "<!-->"), typeof Z != "string" && !si(Z) && (Z = ah(Z), typeof Z != "string"))
      throw cr("dirty is not a string, aborting");
    if (!r.isSupported)
      return Z;
    It ? (Ft = bt, Nt = Ht) : kr(k), (xt.uponSanitizeElement.length > 0 || xt.uponSanitizeAttribute.length > 0) && (Ft = De(Ft)), xt.uponSanitizeAttribute.length > 0 && (Nt = De(Nt)), r.removed = [];
    const ft = Oi && typeof Z != "string" && si(Z);
    if (ft) {
      us(Z);
      const pe = Et(Z);
      if (typeof pe == "string") {
        const _e = qt(pe);
        if (!Ft[_e] || Ye[_e])
          throw $i(Z), cr("root node is forbidden and cannot be sanitized in-place");
      }
      if ($t(Z))
        throw $i(Z), cr("root node is clobbered and cannot be sanitized in-place");
      try {
        ar(Z);
      } catch (_e) {
        throw $i(Z), _e;
      }
    } else if (si(Z))
      z = Xe("<!---->"), q = z.ownerDocument.importNode(Z, !0), q.nodeType === ze.element && q.nodeName === "BODY" || q.nodeName === "HTML" ? z = q : z.appendChild(q), ar(z);
    else {
      if (!Fe && !ye && !mt && // eslint-disable-next-line unicorn/prefer-includes
      Z.indexOf("<") === -1)
        return wt && se ? xe(Z) : Z;
      if (z = Xe(Z), !z)
        return Fe ? null : se ? Yt : "";
    }
    z && ue && Jt(z.firstChild);
    const Rt = ft ? Z : z;
    try {
      const pe = ps(Rt);
      for (; it = pe.nextNode(); )
        Ar(it, Rt), $r(it), gi(it.content) && Sr(it.content);
    } catch (pe) {
      throw ft && ($i(Z), dr(r.removed, (_e) => {
        _e.element && mi(_e.element);
      })), pe;
    }
    if (ft)
      return dr(r.removed, (pe) => {
        pe.element && mi(pe.element);
      }), ye && Tr(Z), Z;
    if (Fe) {
      if (ye && Tr(z), Ut)
        for (ot = _r.call(z.ownerDocument); z.firstChild; )
          ot.appendChild(z.firstChild);
      else
        ot = z;
      return (Nt.shadowroot || Nt.shadowrootmode) && (ot = Ji.call(h, ot, !0)), ot;
    }
    let Pt = mt ? z.outerHTML : z.innerHTML;
    return mt && Ft["!doctype"] && z.ownerDocument && z.ownerDocument.doctype && z.ownerDocument.doctype.name && ke(yh, z.ownerDocument.doctype.name) && (Pt = "<!DOCTYPE " + z.ownerDocument.doctype.name + `>
` + Pt), ye && (Pt = sr(Pt)), wt && se ? xe(Pt) : Pt;
  }, r.setConfig = function() {
    let Z = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    kr(Z), It = !0, bt = Ft, Ht = Nt;
  }, r.clearConfig = function() {
    Bi = null, It = !1, bt = null, Ht = null, wt = ci, Yt = "";
  }, r.isValidAttribute = function(Z, k, z) {
    Bi || kr({});
    const q = qt(Z), it = qt(k);
    return yi(q, it, z);
  }, r.addHook = function(Z, k) {
    typeof k == "function" && Le(xt, Z) && Zr(xt[Z], k);
  }, r.removeHook = function(Z, k) {
    if (Le(xt, Z)) {
      if (k !== void 0) {
        const z = th(xt[Z], k);
        return z === -1 ? void 0 : eh(xt[Z], z, 1)[0];
      }
      return yo(xt[Z]);
    }
  }, r.removeHooks = function(Z) {
    Le(xt, Z) && (xt[Z] = []);
  }, r.removeAllHooks = function() {
    xt = Mo();
  }, r;
}
var ua = ca();
Lt.setOptions({ gfm: !0, breaks: !0 });
let Io = !1;
function Sh() {
  Io || (ua.addHook("afterSanitizeAttributes", (l) => {
    l.tagName === "A" && (l.setAttribute("target", "_blank"), l.setAttribute("rel", "noopener noreferrer"));
  }), Io = !0);
}
function Ch(l) {
  Sh();
  const r = Lt.parse(l ?? "", { async: !1 });
  return ua.sanitize(r, {
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
const je = 12, Ts = 10, Mr = 200;
function ur(l, r, n) {
  return Math.max(r, Math.min(n, l));
}
function Eh(l, r, n, h) {
  const v = r.width <= 480, m = v ? r.width - je * 2 : ur(h.width, je, r.width - je * 2), y = l.top + l.height, F = l.top - Ts - je, B = r.height - y - Ts - je, j = F < Mr && B >= Mr && B > F;
  let W, H, O;
  if (j)
    W = y + Ts, O = ur(h.height, Mr, r.height - W - je);
  else {
    H = r.height - l.top + Ts;
    const ct = F > 0 ? F : r.height - je * 2;
    O = ur(v ? r.height * 0.7 : h.height, Mr, ct);
  }
  O = ur(O, Mr, r.height - je * 2);
  let X, rt;
  return n === "right" ? rt = ur(r.width - l.right, je, r.width - je - m) : X = ur(l.left, je, r.width - je - m), {
    left: X,
    right: rt,
    top: W,
    bottom: H,
    width: m,
    height: O,
    transformOrigin: `${j ? "top" : "bottom"} ${n}`
  };
}
const Ph = "ecoflow-chat:", Mh = 24 * 60 * 60 * 1e3;
function Ih(l, r) {
  return Ph + l.replace(/\/+$/, "") + ":" + r;
}
function In() {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}
function Lh(l) {
  if (!l || typeof l != "object") return !1;
  const r = l;
  return typeof r.id == "string" && typeof r.text == "string" && typeof r.role == "string";
}
function Lo(l, r = In()) {
  if (!r) return null;
  try {
    const n = r.getItem(l);
    if (!n) return null;
    const h = JSON.parse(n);
    return typeof (h == null ? void 0 : h.chatId) != "string" || !Array.isArray(h == null ? void 0 : h.messages) || typeof h.savedAt != "number" || Date.now() - h.savedAt > Mh ? null : {
      chatId: h.chatId,
      savedAt: h.savedAt,
      messages: h.messages.filter(Lh)
    };
  } catch {
    return null;
  }
}
function Fh(l, r, n = In()) {
  if (!n) return !1;
  try {
    return n.setItem(l, JSON.stringify(r)), !0;
  } catch {
    try {
      const h = {
        ...r,
        messages: r.messages.map(
          (v) => v.fileUploads ? { ...v, fileUploads: v.fileUploads.map((m) => ({ ...m, data: void 0 })) } : v
        )
      };
      return n.setItem(l, JSON.stringify(h)), !0;
    } catch {
      return !1;
    }
  }
}
function Rh(l, r = In()) {
  try {
    r == null || r.removeItem(l);
  } catch {
  }
}
let Fo = 0;
function pr() {
  return Fo += 1, "msg-" + Fo;
}
const Ro = {
  thinking: "Pensando…",
  tool: "Usando herramientas…",
  usedTools: "Usando herramientas…",
  calledTools: "Ejecutando acciones…",
  agentReasoning: "Razonando…",
  nextAgent: "Consultando al agente…"
};
function Oh() {
  if (typeof MediaRecorder > "u") return "";
  for (const l of ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"])
    if (MediaRecorder.isTypeSupported(l)) return l;
  return "";
}
function Nh(l) {
  const r = l.reduce((v, m) => v + Math.ceil(m.length * 3 / 4), 0), n = new Uint8Array(r);
  let h = 0;
  for (const v of l) {
    const m = Uint8Array.from(atob(v), (y) => y.charCodeAt(0));
    n.set(m, h), h += m.length;
  }
  return n.subarray(0, h);
}
function Si({ name: l }) {
  switch (l) {
    case "chat":
      return /* @__PURE__ */ tt("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": 2, "stroke-linecap": "round", "stroke-linejoin": "round", "aria-hidden": !0, children: /* @__PURE__ */ tt("path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" }) });
    case "close":
      return /* @__PURE__ */ tt("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2.4", "stroke-linecap": "round", "aria-hidden": "true", children: /* @__PURE__ */ tt("path", { d: "M18 6 6 18M6 6l12 12" }) });
    case "mic":
      return /* @__PURE__ */ tt("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", "aria-hidden": "true", children: [
        /* @__PURE__ */ tt("path", { d: "M12 2a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" }),
        /* @__PURE__ */ tt("path", { d: "M19 10v1a7 7 0 0 1-14 0v-1M12 18v4" })
      ] });
    case "stop":
      return /* @__PURE__ */ tt("svg", { viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": "true", children: /* @__PURE__ */ tt("rect", { x: "6", y: "6", width: "12", height: "12", rx: "2" }) });
    case "image":
      return /* @__PURE__ */ tt("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", "aria-hidden": "true", children: [
        /* @__PURE__ */ tt("rect", { x: "3", y: "3", width: "18", height: "18", rx: "3" }),
        /* @__PURE__ */ tt("circle", { cx: "9", cy: "9", r: "2" }),
        /* @__PURE__ */ tt("path", { d: "m21 15-4.6-4.6a2 2 0 0 0-2.8 0L5 20" })
      ] });
    case "reset":
      return /* @__PURE__ */ tt("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", "aria-hidden": "true", children: [
        /* @__PURE__ */ tt("path", { d: "M3 12a9 9 0 1 0 3-6.7L3 8" }),
        /* @__PURE__ */ tt("path", { d: "M3 3v5h5" })
      ] });
    default:
      return /* @__PURE__ */ tt("svg", { viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": "true", children: /* @__PURE__ */ tt("path", { d: "M3.4 20.4 21 12 3.4 3.6l-.01 6.53L15 12 3.39 13.87z" }) });
  }
}
function zh(l) {
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
function Dh({ config: l }) {
  const r = we(null);
  return Ai(() => {
    if (l.buttonType !== "lottie" || !r.current || !l.lottieAnimationPath) return;
    const n = fl(r.current, l.lottieAnimationPath, {
      loop: l.lottieLoop,
      autoplay: l.lottieAutoplay
    });
    return () => n.destroy();
  }, [l.buttonType, l.lottieAnimationPath, l.lottieLoop, l.lottieAutoplay]), l.buttonType === "lottie" ? /* @__PURE__ */ tt("div", { ref: r, class: "ecoflow-button--media" }) : l.buttonType === "image" ? /* @__PURE__ */ tt("img", { class: "ecoflow-button--media", src: l.buttonImageSrc, alt: l.buttonAriaLabel }) : l.buttonType === "text" ? /* @__PURE__ */ tt("span", { children: l.buttonText }) : /* @__PURE__ */ tt(Si, { name: "chat" });
}
function Bh({ src: l, alt: r }) {
  return l ? /* @__PURE__ */ tt("img", { class: "ecoflow-avatar", src: l, alt: r, loading: "lazy" }) : /* @__PURE__ */ tt("div", { class: "ecoflow-avatar", "aria-hidden": "true" });
}
function Vh({ uploads: l }) {
  return l != null && l.length ? /* @__PURE__ */ tt("div", { class: "ecoflow-attachments", children: l.map(
    (r) => r.mime.startsWith("image/") && r.data ? /* @__PURE__ */ tt("img", { class: "ecoflow-attachment-img", src: r.data, alt: r.name }, r.name) : /* @__PURE__ */ tt("span", { class: "ecoflow-attachment-audio", children: [
      /* @__PURE__ */ tt(Si, { name: "mic" }),
      " Audio"
    ] }, r.name)
  ) }) : null;
}
function $h({ message: l, config: r }) {
  if (l.role === "agent")
    return /* @__PURE__ */ tt("div", { class: "ecoflow-msg ecoflow-msg--agent", children: /* @__PURE__ */ tt("span", { class: "ecoflow-agent-pill", children: l.text }) });
  const n = l.role === "user", h = l.role === "error", v = !n && !h ? r.botMessageShowAvatar : n ? r.userMessageShowAvatar : !1, m = n ? r.userMessageAvatarSrc : r.botMessageAvatarSrc;
  return /* @__PURE__ */ tt("div", { class: `ecoflow-msg${n ? " ecoflow-msg--user" : ""}`, children: [
    v && /* @__PURE__ */ tt(Bh, { src: m, alt: n ? "Usuario" : "Bot" }),
    /* @__PURE__ */ tt(
      "div",
      {
        class: `ecoflow-bubble ecoflow-bubble--${h ? "error" : n ? "user" : "bot"}`,
        children: [
          /* @__PURE__ */ tt(Vh, { uploads: l.fileUploads }),
          n ? l.text : /* @__PURE__ */ tt(
            "div",
            {
              class: "ecoflow-markdown",
              dangerouslySetInnerHTML: { __html: Ch(l.text) }
            }
          )
        ]
      }
    )
  ] });
}
function Uh({ host: l, config: r }) {
  var Fi, ye;
  const n = Ih(r.apiHost, r.chatflowId), [h, v] = li(!1), [m, y] = li(() => {
    var K;
    return !r.persistConversation || !r.chatflowId ? [] : ((K = Lo(n)) == null ? void 0 : K.messages) ?? [];
  }), [F, B] = li(!1), [j, W] = li(!1), [H, O] = li(""), [X, rt] = li(null), [et, ct] = li(null), [_t, dt] = li(!1), [Ct, Mt] = li(null), [Bt, Ot] = li(!1), me = we(""), re = we(!1), Et = we(null), wt = we(null), Yt = we(null), ci = we(null), Qe = we(null), Ve = we(() => {
  }), Je = we(null), xe = we([]), Ei = we(null), Gt = we([]), He = we("audio/mpeg"), ge = we(null), ui = we("");
  me.current || (me.current = r.persistConversation && ((Fi = Lo(n)) == null ? void 0 : Fi.chatId) || ao()), m.length > 0 && (re.current = !0);
  const _r = r.voiceInput === "auto" ? (et == null ? void 0 : et.stt) ?? !1 : r.voiceInput === !0, br = r.imageUploads === "auto" ? (et == null ? void 0 : et.imageUploads) ?? !1 : r.imageUploads === !0;
  Ai(() => {
    if (!r.apiHost || !r.chatflowId) return;
    let K = !1;
    return rl(r.apiHost, r.chatflowId).then((mt) => {
      K || ct(mt);
    }), () => {
      K = !0;
    };
  }, [r.apiHost, r.chatflowId]), Ai(() => {
    !r.persistConversation || F || !r.chatflowId || m.length !== 0 && Fh(n, { chatId: me.current, messages: m, savedAt: Date.now() });
  }, [m, F, r.persistConversation, n]);
  const Ji = () => {
    v(!0), !re.current && r.windowWelcomeMessage && (re.current = !0, y((K) => [
      ...K,
      { id: pr(), role: "bot", text: r.windowWelcomeMessage }
    ]));
  }, xt = () => {
    ge.current && (ge.current.pause(), ge.current.src.startsWith("blob:") && URL.revokeObjectURL(ge.current.src), ge.current = null);
  }, Pi = () => {
    var K;
    v(!1), (K = Qe.current) == null || K.abort(), xt(), qe(!1);
  }, ti = () => h ? Pi() : Ji(), Mi = () => {
    var K;
    (K = Qe.current) == null || K.abort(), xt(), y([]), me.current = ao(), r.persistConversation && Rh(n), re.current = !1, r.windowWelcomeMessage && (re.current = !0, y([{ id: pr(), role: "bot", text: r.windowWelcomeMessage }]));
  };
  Ai(() => {
    l.open = Ji, l.close = Pi, l.toggle = ti, l.sendMessage = (K) => {
      Ji(), Ve.current(K);
    };
  }), Ai(() => {
    if (!h) return;
    const K = () => {
      const mt = Et.current;
      mt && rt(
        Eh(
          mt.getBoundingClientRect(),
          { width: window.innerWidth, height: window.innerHeight },
          r.buttonSide,
          { width: r.windowWidth, height: r.windowHeight }
        )
      );
    };
    return K(), window.addEventListener("resize", K, { passive: !0 }), () => window.removeEventListener("resize", K);
  }, [h, r.buttonSide, r.windowWidth, r.windowHeight]), Ai(() => {
    const K = wt.current;
    K && (K.scrollTop = K.scrollHeight);
  }, [m, j]), Ai(() => {
    h && r.textInputAutoFocus && !_t && requestAnimationFrame(() => {
      var K;
      return (K = Yt.current) == null ? void 0 : K.focus();
    });
  }, [h, r.textInputAutoFocus, _t]), Ai(() => {
    if (!h) return;
    const K = (mt) => {
      mt.key === "Escape" && Pi();
    };
    return document.addEventListener("keydown", K), () => document.removeEventListener("keydown", K);
  }, [h]), Ai(
    () => () => {
      var K;
      qe(!1), xt(), (K = Ei.current) == null || K.getTracks().forEach((mt) => mt.stop());
    },
    []
  );
  const Ii = (K, mt) => {
    y((It) => It.map((bt) => bt.id === K ? { ...bt, text: bt.text + mt } : bt));
  }, Fr = (K, mt) => {
    y((It) => It.map((bt) => bt.id === K ? { ...bt, followUps: mt } : bt));
  }, ut = (K, mt) => {
    y((It) => It.map((bt) => bt.id === K ? { ...bt, text: mt } : bt));
  }, Li = async () => {
    var mt;
    if (_t || F) return;
    const K = Oh();
    if (!((mt = navigator.mediaDevices) != null && mt.getUserMedia) || K === "" && typeof MediaRecorder > "u") {
      Ot(!0);
      return;
    }
    try {
      const It = await navigator.mediaDevices.getUserMedia({ audio: !0 });
      Ei.current = It;
      const bt = new MediaRecorder(It, K ? { mimeType: K } : void 0);
      xe.current = [], bt.ondataavailable = (Ht) => {
        Ht.data.size > 0 && xe.current.push(Ht.data);
      }, bt.onstop = () => wr(), Je.current = bt, bt.start(), dt(!0);
    } catch {
      Ot(!0);
    }
  }, qe = (K) => {
    const mt = Je.current;
    if (!mt || mt.state === "inactive") {
      dt(!1);
      return;
    }
    mt.__send = K, mt.stop();
  }, wr = async () => {
    var bt, Ht;
    dt(!1), (bt = Ei.current) == null || bt.getTracks().forEach((ue) => ue.stop()), Ei.current = null;
    const K = Je.current;
    if (Je.current = null, !((K == null ? void 0 : K.__send) !== !1) || xe.current.length === 0) return;
    const It = new Blob(xe.current, { type: ((Ht = xe.current[0]) == null ? void 0 : Ht.type) || "audio/webm" });
    xe.current = [];
    try {
      const ue = await ho(new File([It], "audio", { type: It.type }));
      Ve.current("", [{ ...sl(It), data: ue, type: "audio" }]);
    } catch {
    }
  }, Ft = async (K) => {
    var bt;
    const mt = K.target, It = (bt = mt.files) == null ? void 0 : bt[0];
    if (mt.value = "", !!It && !(et != null && et.imageTypes.length && !et.imageTypes.includes(It.type)) && !(et && It.size > et.imageMaxSizeMb * 1024 * 1024))
      try {
        const Ht = await ho(It);
        Mt({ name: It.name, mime: It.type, data: Ht, type: "image" });
      } catch {
      }
  }, tr = (K) => {
    xt(), Gt.current = [], He.current = K.includes("/") ? K : `audio/${K === "mp3" ? "mpeg" : K}`;
  }, Nt = (K) => {
    Gt.current.push(K);
  }, Ge = () => {
    if (!nl(r.voiceOutput) || Gt.current.length === 0) return;
    const K = Nh(Gt.current);
    Gt.current = [];
    const mt = new Audio(URL.createObjectURL(new Blob([K], { type: He.current })));
    ge.current = mt, mt.onended = () => {
      mt.src.startsWith("blob:") && URL.revokeObjectURL(mt.src), ge.current === mt && (ge.current = null);
    }, mt.play().catch(() => {
      xt();
    });
  }, ce = (K, mt) => {
    const It = K.trim(), bt = ((mt == null ? void 0 : mt.length) ?? 0) > 0;
    if (!It && !bt || F || _t || !r.chatflowId || !r.apiHost) return;
    O(""), Mt(null);
    const Ht = {
      id: pr(),
      role: "user",
      text: It,
      ...bt ? { fileUploads: mt } : {}
    };
    ui.current = Ht.id, y((Ut) => [...Ut, Ht]);
    const ue = pr();
    y((Ut) => [...Ut, { id: ue, role: "bot", text: "" }]), B(!0), W(!0);
    const Fe = new AbortController();
    Qe.current = Fe, tl(
      {
        apiHost: r.apiHost,
        chatflowId: r.chatflowId,
        question: It,
        chatId: me.current,
        streaming: !0,
        ...bt ? { uploads: mt } : {}
      },
      {
        onToken: (Ut) => {
          W(!1), Ii(ue, Ut);
        },
        onActivity: (Ut) => {
          r.windowShowAgentMessages && Ro[Ut] && y((se) => [
            ...se,
            { id: pr(), role: "agent", text: Ro[Ut] }
          ]);
        },
        onMetadata: (Ut) => {
          const se = Ut.followUpPrompts;
          Array.isArray(se) && Fr(
            ue,
            se.filter((di) => typeof di == "string")
          );
          const $e = Ut.chatId;
          typeof $e == "string" && $e && (me.current = $e);
          const pi = Ut.question;
          typeof pi == "string" && pi && !It && ui.current && ut(ui.current, pi);
        },
        onTtsStart: tr,
        onTtsChunk: Nt,
        onTtsEnd: Ge,
        onError: (Ut) => {
          y(
            (se) => se.filter(($e) => $e.id !== ue || $e.text !== "").concat([{ id: pr(), role: "error", text: r.windowErrorMessage || Ut }])
          );
        },
        onDone: () => {
          y((Ut) => Ut.filter((se) => se.id !== ue || se.text !== ""));
        }
      },
      Fe.signal
    ).catch(() => {
      Fe.signal.aborted || y(
        (Ut) => Ut.filter((se) => se.id !== ue || se.text !== "").concat([{ id: pr(), role: "error", text: r.windowErrorMessage }])
      );
    }).finally(() => {
      B(!1), W(!1), Qe.current = null;
    });
  };
  Ve.current = ce;
  const Ye = m.length > 0 && !F && m[m.length - 1].role === "bot" ? m[m.length - 1].followUps : void 0, er = { bottom: r.buttonBottom };
  er[r.buttonSide] = r.buttonOffsetX;
  const ve = { position: "absolute" };
  ve[r.buttonSide] = "0";
  const ht = X ? {
    left: X.left !== void 0 ? X.left + "px" : void 0,
    right: X.right !== void 0 ? X.right + "px" : void 0,
    top: X.top !== void 0 ? X.top + "px" : void 0,
    bottom: X.bottom !== void 0 ? X.bottom + "px" : void 0,
    width: X.width + "px",
    height: X.height + "px",
    transformOrigin: X.transformOrigin
  } : void 0, Wt = _r && !Bt, ei = ((ye = et == null ? void 0 : et.imageTypes) == null ? void 0 : ye.join(",")) || "image/*";
  return /* @__PURE__ */ tt("div", { class: "ecoflow-root", style: zh(r), children: [
    h && X && /* @__PURE__ */ tt(
      "section",
      {
        class: `ecoflow-window${r.glass ? " ecoflow-window--glass" : ""}`,
        part: "window",
        role: "dialog",
        "aria-label": r.windowTitle,
        style: ht,
        children: [
          /* @__PURE__ */ tt("header", { class: "ecoflow-header", part: "header", children: [
            /* @__PURE__ */ tt("div", { class: "ecoflow-header-title", children: r.windowTitle }),
            r.showResetButton && /* @__PURE__ */ tt(
              "button",
              {
                class: "ecoflow-header-btn",
                onClick: Mi,
                "aria-label": "Reiniciar conversación",
                title: "Reiniciar conversación",
                type: "button",
                children: /* @__PURE__ */ tt(Si, { name: "reset" })
              }
            ),
            /* @__PURE__ */ tt(
              "button",
              {
                class: "ecoflow-header-btn ecoflow-close",
                onClick: Pi,
                "aria-label": "Cerrar chat",
                type: "button",
                children: /* @__PURE__ */ tt(Si, { name: "close" })
              }
            )
          ] }),
          /* @__PURE__ */ tt("div", { class: "ecoflow-messages", part: "messages", ref: wt, "aria-live": "polite", children: [
            m.map((K) => /* @__PURE__ */ tt($h, { message: K, config: r }, K.id)),
            j && /* @__PURE__ */ tt("div", { class: "ecoflow-msg", children: /* @__PURE__ */ tt("div", { class: "ecoflow-bubble ecoflow-bubble--bot ecoflow-typing", children: [
              /* @__PURE__ */ tt("span", {}),
              /* @__PURE__ */ tt("span", {}),
              /* @__PURE__ */ tt("span", {})
            ] }) })
          ] }),
          Ye && Ye.length > 0 && /* @__PURE__ */ tt("div", { class: "ecoflow-chips", children: Ye.map((K) => /* @__PURE__ */ tt("button", { class: "ecoflow-chip", type: "button", onClick: () => ce(K), children: K }, K)) }),
          /* @__PURE__ */ tt("div", { class: "ecoflow-input-row", part: "input", children: [
            Ct && /* @__PURE__ */ tt("div", { class: "ecoflow-preview", children: [
              /* @__PURE__ */ tt("img", { src: Ct.data, alt: Ct.name }),
              /* @__PURE__ */ tt(
                "button",
                {
                  class: "ecoflow-preview-remove",
                  onClick: () => Mt(null),
                  "aria-label": "Quitar imagen",
                  type: "button",
                  children: /* @__PURE__ */ tt(Si, { name: "close" })
                }
              )
            ] }),
            br && !_t && /* @__PURE__ */ tt(ss, { children: [
              /* @__PURE__ */ tt(
                "input",
                {
                  ref: ci,
                  type: "file",
                  accept: ei,
                  style: { display: "none" },
                  onChange: Ft,
                  "aria-hidden": "true",
                  tabIndex: -1
                }
              ),
              /* @__PURE__ */ tt(
                "button",
                {
                  class: "ecoflow-icon-btn",
                  onClick: () => {
                    var K;
                    return (K = ci.current) == null ? void 0 : K.click();
                  },
                  disabled: F || !!Ct,
                  "aria-label": "Adjuntar imagen",
                  title: "Adjuntar imagen",
                  type: "button",
                  children: /* @__PURE__ */ tt(Si, { name: "image" })
                }
              )
            ] }),
            /* @__PURE__ */ tt(
              "input",
              {
                ref: Yt,
                class: "ecoflow-input",
                type: "text",
                placeholder: r.textInputPlaceholder,
                maxLength: r.textInputMaxChars,
                value: H,
                disabled: F || _t,
                "aria-label": r.textInputPlaceholder,
                onInput: (K) => O(K.target.value),
                onKeyDown: (K) => {
                  K.key === "Enter" && ce(H, Ct ? [Ct] : void 0);
                }
              }
            ),
            Wt && !_t && /* @__PURE__ */ tt(
              "button",
              {
                class: "ecoflow-icon-btn",
                onClick: Li,
                disabled: F,
                "aria-label": "Hablar",
                title: "Hablar",
                type: "button",
                children: /* @__PURE__ */ tt(Si, { name: "mic" })
              }
            ),
            _t && /* @__PURE__ */ tt(
              "button",
              {
                class: "ecoflow-icon-btn ecoflow-icon-btn--recording",
                onClick: () => qe(!0),
                "aria-label": "Detener y enviar",
                title: "Detener y enviar",
                type: "button",
                children: /* @__PURE__ */ tt(Si, { name: "stop" })
              }
            ),
            /* @__PURE__ */ tt(
              "button",
              {
                class: "ecoflow-send",
                type: "button",
                onClick: () => ce(H, Ct ? [Ct] : void 0),
                disabled: F || _t || H.trim() === "" && !Ct,
                "aria-label": "Enviar mensaje",
                children: /* @__PURE__ */ tt(Si, { name: "send" })
              }
            )
          ] }),
          r.footerCompany && /* @__PURE__ */ tt("footer", { class: "ecoflow-footer", part: "footer", children: [
            r.footerText,
            " ",
            /* @__PURE__ */ tt("a", { href: r.footerCompanyLink || "#", target: "_blank", rel: "noopener noreferrer", children: r.footerCompany })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ tt(
      "div",
      {
        ref: Et,
        class: `ecoflow-button${r.buttonType === "lottie" || r.buttonType === "image" ? "" : " ecoflow-button--shape"}`,
        part: "button",
        role: "button",
        tabIndex: 0,
        "aria-label": r.buttonAriaLabel,
        style: er,
        onClick: ti,
        onKeyDown: (K) => {
          (K.key === "Enter" || K.key === " ") && (K.preventDefault(), ti());
        },
        children: [
          /* @__PURE__ */ tt(Dh, { config: r }),
          r.tooltipEnabled && !h && /* @__PURE__ */ tt("span", { class: "ecoflow-tooltip", style: ve, children: r.tooltipText })
        ]
      }
    )
  ] });
}
const jh = `
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

/* Botones de acción del header (reset comparte base con close) */
.ecoflow-header-btn {
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
.ecoflow-header-btn:hover { background: rgba(255, 255, 255, 0.18); }
.ecoflow-header-btn svg { width: 15px; height: 15px; }

/* ============ Mensajes ============ */
.ecoflow-messages {
  flex: 1;
  overflow-y: auto;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  scrollbar-width: thin;
  scrollbar-color: var(--ec-c-send) var(--ec-bg-window);
}
.ecoflow-messages::-webkit-scrollbar { width: 6px; }
.ecoflow-messages::-webkit-scrollbar-track { background: var(--ec-bg-window); }
.ecoflow-messages::-webkit-scrollbar-thumb {
  background: var(--ec-c-send);
  border: 1px solid var(--ec-bg-window);
  border-radius: 999px;
}
.ecoflow-messages::-webkit-scrollbar-thumb:hover {
  background: color-mix(in srgb, var(--ec-c-send) 82%, black);
}

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

/* ============ Adjuntos en mensajes ============ */
.ecoflow-attachments { display: flex; flex-direction: column; gap: 6px; }
.ecoflow-attachment-img {
  max-width: 200px;
  max-height: 160px;
  border-radius: 10px;
  object-fit: cover;
  display: block;
}
.ecoflow-attachment-audio {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: calc(var(--ec-fs) * 0.85);
  opacity: 0.85;
}
.ecoflow-attachment-audio svg { width: 14px; height: 14px; }

/* ============ Input ============ */
.ecoflow-input-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  flex-shrink: 0;
  background: var(--ec-bg-input);
  flex-wrap: wrap;
}
.ecoflow-preview {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
}
.ecoflow-preview img {
  height: 64px;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.12);
}
.ecoflow-preview-remove {
  position: absolute;
  left: 54px;
  top: -6px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: none;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.65);
  color: #fff;
  cursor: pointer;
  padding: 0;
}
.ecoflow-preview-remove svg { width: 11px; height: 11px; }

/* Botones cuadrados de la barra de input (imagen, micrófono) */
.ecoflow-icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--ec-c-send);
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;
  transition: background 0.15s ease;
}
.ecoflow-icon-btn:hover:not(:disabled) { background: rgba(128, 128, 128, 0.18); }
.ecoflow-icon-btn:disabled { opacity: 0.4; cursor: default; }
.ecoflow-icon-btn svg { width: 18px; height: 18px; }
.ecoflow-icon-btn--recording {
  background: #e5484d;
  color: #fff;
  animation: ecoflow-rec-pulse 1.2s infinite ease-in-out;
}
@keyframes ecoflow-rec-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(229, 72, 77, 0.5); }
  50% { box-shadow: 0 0 0 8px rgba(229, 72, 77, 0); }
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

/* ============ Tema liquid glass ============ */
.ecoflow-window--glass {
  -webkit-backdrop-filter: blur(24px) saturate(160%);
  backdrop-filter: blur(24px) saturate(160%);
  border: 1px solid rgba(255, 255, 255, 0.18);
}
.ecoflow-window--glass .ecoflow-header {
  background: color-mix(in srgb, var(--ec-bg-header) 55%, transparent);
  -webkit-backdrop-filter: blur(24px);
  backdrop-filter: blur(24px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}
.ecoflow-window--glass .ecoflow-input-row { border-top-color: rgba(255, 255, 255, 0.12); }
.ecoflow-window--glass .ecoflow-input { border-color: rgba(255, 255, 255, 0.22); }
.ecoflow-window--glass .ecoflow-agent-pill { background: rgba(255, 255, 255, 0.1); }
.ecoflow-window--glass .ecoflow-markdown code { background: rgba(255, 255, 255, 0.14); }
.ecoflow-window--glass .ecoflow-markdown pre { background: rgba(255, 255, 255, 0.1); }
.ecoflow-window--glass .ecoflow-bubble--bot {
  background: color-mix(in srgb, var(--ec-bg-bot) 88%, black);
}
.ecoflow-window--glass .ecoflow-bubble--error { background: rgba(179, 38, 30, 0.28); color: #ffb4ab; }
.ecoflow-window--glass .ecoflow-messages {
  scrollbar-color: color-mix(in srgb, var(--ec-c-send) 72%, white) transparent;
}
.ecoflow-window--glass .ecoflow-messages::-webkit-scrollbar-track { background: transparent; }
.ecoflow-window--glass .ecoflow-messages::-webkit-scrollbar-thumb {
  background: color-mix(in srgb, var(--ec-c-send) 72%, white);
  border-color: rgba(255, 255, 255, 0.16);
}

@media (prefers-reduced-motion: reduce) {
  .ecoflow-window, .ecoflow-button--shape, .ecoflow-send { animation: none; transition: none; }
  .ecoflow-typing span { animation: none; }
}
`, vn = "ecoflow-chat";
class Wh extends HTMLElement {
  constructor() {
    super(...arguments), this._explicitConfig = {}, this._shadow = null, this.open = () => {
    }, this.close = () => {
    }, this.toggle = () => {
    }, this.sendMessage = () => {
    };
  }
  static get observedAttributes() {
    return Na();
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
    r.textContent = jh, this._shadow.appendChild(r), this._render();
  }
  disconnectedCallback() {
    this._shadow && Qn(null, this._shadow);
  }
  attributeChangedCallback() {
    this._render();
  }
  _resolve() {
    const r = typeof window < "u" && window.ECOFLOW_CONFIG ? window.ECOFLOW_CONFIG : {}, n = No(this.attributes);
    return za([r, n, this._explicitConfig]);
  }
  _render() {
    this._shadow && Qn(/* @__PURE__ */ tt(Uh, { host: this, config: this._resolve() }), this._shadow);
  }
}
function pa() {
  typeof window > "u" || typeof customElements > "u" || customElements.get(vn) || customElements.define(vn, Wh);
}
function Hh(l) {
  if (pa(), !l) return;
  const r = No(l.attributes), n = { ...window.ECOFLOW_CONFIG ?? {}, ...r };
  if (!n.chatflowId) return;
  const h = document.createElement(vn);
  h.config = n, document.body.appendChild(h);
}
pa();
if (typeof document < "u") {
  const l = Da(
    document.currentScript,
    document.scripts
  );
  Ba(document, l, Hh);
}
function Yh({ config: l, onReady: r, className: n, style: h }) {
  const v = Ia(null);
  return La(() => {
    const m = v.current;
    m && (m.config = l, r == null || r(m));
  }, [l]), Fa("ecoflow-chat", { ref: v, className: n, style: h });
}
export {
  Yh as EcoflowChat
};
