import {slice} from "./array";
import constant from "./constant";
import {cos, halfPi, sin} from "./math";
import {path} from "d3-path";

function defaultSource(d) {
  return d.source;
}

function defaultTarget(d) {
  return d.target;
}

function defaultRadius(d) {
  return d.radius;
}

function defaultStartAngle(d) {
  return d.startAngle;
}

function defaultEndAngle(d) {
  return d.endAngle;
}

function defaultArrow(d) {
  return d.hasOwnProperty('arrow') ? d.arrow : false;
}

function defaultArrowPadding(d) {
  return d.hasOwnProperty('arrowPadding') ? d.arrowPadding : 0;
}

function defaultLocalArc(d) {
  return d.hasOwnProperty('localArc') ? d.localArc : false;
}

function defaultLocalArcWidth(d) {
  return d.radius ? d.radius / 10 : 10;
}

export default function() {
  var source = defaultSource,
      target = defaultTarget,
      radius = defaultRadius,
      startAngle = defaultStartAngle,
      endAngle = defaultEndAngle,
      arrow = defaultArrow,
      arrowPadding = defaultArrowPadding,
      localArc = defaultLocalArc,
      localArcWidth = defaultLocalArcWidth,
      context = null;

  function ribbon() {
    var buffer,
        argv = slice.call(arguments),
        ap = arrowPadding.apply(this, argv),
        arr = arrow.apply(this, argv),
        la = localArc.apply(this, argv),
        law = localArcWidth.apply(this, argv),
        s = source.apply(this, argv),
        t = target.apply(this, argv),
        sr = +radius.apply(this, (argv[0] = s, argv)),
        sa0 = startAngle.apply(this, argv) - halfPi,
        sa1 = endAngle.apply(this, argv) - halfPi,
        sx0 = sr * cos(sa0),
        sy0 = sr * sin(sa0),
        tr = +radius.apply(this, (argv[0] = t, argv)) - (arr ? ap : 0),
        ta0 = startAngle.apply(this, argv) - halfPi,
        ta1 = endAngle.apply(this, argv) - halfPi;

    if (!context) context = buffer = path();

    context.moveTo(sx0, sy0);
    context.arc(0, 0, sr, sa0, sa1);
    if (sa0 !== ta0 || sa1 !== ta1) { // TODO sr !== tr?
      if (arr) {
        var tr2 = tr - 20,
            ta = (ta0 + ta1) / 2,
            tx1 = tr * cos(ta),
            ty1 = tr * sin(ta),
            tx2 = tr2 * cos(ta1),
            ty2 = tr2 * sin(ta1);

        context.quadraticCurveTo(0, 0, tr2 * cos(ta0), tr2 * sin(ta0));
        context.lineTo(tx1, ty1);
        context.lineTo(tx2, ty2);
      } else {
        context.quadraticCurveTo(0, 0, tr * cos(ta0), tr * sin(ta0));
        context.arc(0, 0, tr, ta0, ta1);
      }
      context.quadraticCurveTo(0, 0, sx0, sy0);
    } else if (la) {
      sr -= law;
      context.lineTo(sr * cos(sa1), sr * sin(sa1));
      context.arc(0, 0, sr, sa1, sa0, true);
    } else {
      context.quadraticCurveTo(0, 0, sx0, sy0);
    }
    
    context.closePath();

    if (buffer) return context = null, buffer + "" || null;
  }


  ribbon.arrowPadding = function(_) {
    return arguments.length ? (arrowPadding = typeof _ === "function" ? _ : constant(+_), ribbon) : arrowPadding;
  };

  ribbon.arrow = function(_) {
    return arguments.length ? (arrow = typeof _ === "function" ? _ : constant(_), ribbon) : arrow;
  };

  ribbon.localArcWidth = function(_) {
    return arguments.length ? (localArcWidth = typeof _ === "function" ? _ : constant(+_), ribbon) : localArcWidth;
  };

  ribbon.localArc = function(_) {
    return arguments.length ? (localArc = typeof _ === "function" ? _ : constant(_), ribbon) : localArc;
  };

  ribbon.radius = function(_) {
    return arguments.length ? (radius = typeof _ === "function" ? _ : constant(+_), ribbon) : radius;
  };

  ribbon.startAngle = function(_) {
    return arguments.length ? (startAngle = typeof _ === "function" ? _ : constant(+_), ribbon) : startAngle;
  };

  ribbon.endAngle = function(_) {
    return arguments.length ? (endAngle = typeof _ === "function" ? _ : constant(+_), ribbon) : endAngle;
  };

  ribbon.source = function(_) {
    return arguments.length ? (source = _, ribbon) : source;
  };

  ribbon.target = function(_) {
    return arguments.length ? (target = _, ribbon) : target;
  };

  ribbon.context = function(_) {
    return arguments.length ? ((context = _ == null ? null : _), ribbon) : context;
  };

  return ribbon;
}
