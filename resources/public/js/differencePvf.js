'use strict';
define(['underscore'], function(_) {
  function ffind(forest, idx) {
    for (var i = 0; i < forest.c.length; ++i) {
      var node = forest.c[i];
      if (_.contains(node.v, idx)) return node;
      var found = node.c ? ffind(node, idx) : null;
      if (found) {
        return found;
      }
    }
    return null;
  }

  // remove all occurences of target
  function fremove(forest, target) {
    var children = _.filter(forest.c, function(c) { return !_.isEqual(c.v, target.v); });
    return fnode(forest.v, _.map(children, _.partial(fremove, _, target)));
  }

  // remove the direct children that match the targets
  // (not equivalent to repeated fremove
  function fremoveChildren(forest, node, targets) {
    var children = _.reject(node.c, function(c) {
      return _.find(targets, function(t) { return _.isEqual(t.v, c.v); }); });
    return freplace(forest, node, fnode(node.v, children));
  }

  // replace all occurrences of oldValue by newValue
  function freplace(forest, oldValue, newValue) {
    if (_.isEqual(forest.v, oldValue.v)) return newValue;
    return fnode(forest.v,
      _.map(forest.c, _.partial(freplace, _, oldValue, newValue)));
  }

  function fparentOf(pnode, cnode) {
    return pnode.c && _.find(pnode.c, function(c) { return _.isEqual(cnode.v, c.v); });
  }

  function fancestorOf(pnode, cnode) {
    if (fparentOf(pnode, cnode)) return true;
    return pnode.c ? !!_.find(pnode.c, _.partial(fancestorOf, _, cnode)) : false;
  }

  // find all ancestors of a node
  function fancestors(forest, node) {
    if (fancestorOf(forest, node)) {
      return _.reduce(forest.c, function(memo, p) { return _.union(memo, fancestors(p, node)); }, [forest]);
    }
    return [];
  }

  // find all descendents of a node
  function fdescendants(node) {
    var recur = _.map(node.c, fdescendants);
    return _.reduce(recur, function(memo, x) { return _.union(memo, x); }, node.c || []);
  }

  // remove toRemove as child of all given nodes
  function fremoveFrom(forest, nodes, toRemove) {
    return _.reduce(nodes, function(memo, node) {
      if (_.contains(node.c, toRemove)) {
        return freplace(memo, node, fnode(node.v, _.without(node.c, toRemove)));
      } else {
        return memo;
      }
    }, forest);
  }

  function funique(nodes) {
    return _.map(_.groupBy(nodes, "v"), _.first);
  }

  function fnode(v, c) {
    var it = {};
    it.v = _.sortBy(v, _.identity);
    if (!_.isEmpty(c)) {
      it.c = _.sortBy(funique(c), function(node) { return node.v[0]; });
    }
    return it;
  }

  var DifferencePvf = {};

  DifferencePvf.nextInterval = function(nIntervals, answers) {
    var n = answers.length;

    var ok = _.every(_.range(Math.min(nIntervals - 1, n)), function(i) {
      return answers[i][0] == i && answers[i][1] == i + 1;
    });
    if (!ok) {
      throw new Error("Expected first n-1 answers to be about the diagonal");
    }
    if (n + 1 < nIntervals) {
      return [n, n + 1];
    }

    var forest = { v: [], c: this.forest(nIntervals, answers) };
    if (!this.isComplete(forest.c)) {
      var upperDiagonal = [].concat.apply([],
        _.map(_.range(0, nIntervals - 2), function(i) {
          return _.map(_.range(i + 2, nIntervals), function(j) { return [i, j] });
        }));
      var availableIntervals = _.reject(upperDiagonal, function(pair) {
        var l = ffind(forest, pair[0]);
        var r = ffind(forest, pair[1]);
        return fancestorOf(l, r) || fancestorOf(r, l) || _.isEqual(r.v, l.v);
      });
      return availableIntervals[0];
    }
  };

  DifferencePvf.forest = function(nIntervals, answers) {
    var init = {
      'v': [],
      'c': _.range(nIntervals).map(function(i) { return { 'v': [i] }; })
    };

    function handleEqual(forest, pair) {
      var l = ffind(forest, pair[0]);
      var r = ffind(forest, pair[1]);
      if (fancestorOf(r, l) || fancestorOf(l, r)) throw new Error("Inconsistent answers");

      var newNode = fnode(_.union(l.v, r.v), _.union(l.c, r.c));
      // remove less specific relations
      forest = fremoveFrom(forest, fancestors(forest, l), r);
      forest = fremoveFrom(forest, fancestors(forest, r), l);
      // replace both nodes by merged node
      return freplace(freplace(forest, r, newNode), l, newNode);
    }

    function handleGreater(forest, pair) {
      var l = ffind(forest, pair[0]);
      var r = ffind(forest, pair[1]);
      if (fancestorOf(r, l) || _.contains(l.v, pair[1])) throw new Error("Inconsistent answers");

      // if r is a child of any ancestor of l, that information is redundant
      forest = fremoveFrom(forest, fancestors(forest, l), r);
      // if any descendant of l is a child of r, that information is redundant
      forest = fremoveChildren(forest, l, fdescendants(r));
      // re-find l because its children may have changed
      l = ffind(forest, pair[0]);
      return freplace(forest, l, fnode(l.v, _.union(l.c, [r])));
    }

    function f(forest, answer) {
      if (answer[0] < 0 || answer[0] >= nIntervals || answer[1] < 0 || answer[1] >= nIntervals) {
        throw new Error("Node index out of bounds");
      }

      switch (answer[2]) {
        case "=":
          return handleEqual(forest, [answer[0], answer[1]]);
        case ">":
          return handleGreater(forest, [answer[0], answer[1]]);
        case "<":
          return handleGreater(forest, [answer[1], answer[0]]);
        default:
          throw "Unrecognized answer type " + answer[2];
      }
    }

    return _.reduce(answers, f, init).c;
  };

  DifferencePvf.isComplete = function(forest) {
    function complete(node) {
      return !node.c || (node.c.length == 1 && complete(node.c[0]));
    }
    return forest.length > 1 ? false : complete(forest[0]);
  }

  return DifferencePvf;
});
