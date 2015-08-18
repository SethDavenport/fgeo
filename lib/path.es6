'use strict';
import R from 'ramda';
import * as point from './point';

export class Path {
  constructor(vertices) {
    this.vertices = vertices || [];
  }
}

export var centroid = R.curry(function centroid(path) {
  var sumX = 0;
  var sumY = 0;

  path.vertices.forEach(function (v) {
    sumX += v.x;
    sumY += v.y;
  });

  return new point.Point(
    sumX/path.vertices.length,
    sumY/path.vertices.length);
});

export var resize = R.curry(function resize(path, ratio) {
  var c = centroid(path);
  var newVertices = path.vertices.map(function(v) {
    var deltaX = c.x - v.x;
    var deltaY = c.y - v.y;
    var p = new point.Point(
        v.x + (deltaX * (1 - ratio)),
        v.y + (deltaY * (1 - ratio)));

    p.arcSweep = v.arcSweep;
    return p;
  });

  return new Path(newVertices);
});

export var computeMedians = R.curry(function computeMedians(path) {
  var num = path.vertices.length;
  return R.map(
    function getMedian(i) {
      return point.median(
        path.vertices[i],
        path.vertices[(i+1)%num]);
    },
    R.range(0, num));
});

export var computeMinDistance = R.curry(function computeMinDistance(path, p) {
  var medians = computeMedians(path);
  var radii = R.map(point.distance(p), medians);
  return R.reduce(function (a, b) {
    return a, b, a < b ? a : b;
  }, Infinity, radii);
});
