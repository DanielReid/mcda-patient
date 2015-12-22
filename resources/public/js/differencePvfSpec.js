define(['underscore', 'differencePvf'], function(_, DifferencePvf) {
  describe('forest', function() {
    it('returns a forest for zero answers', function() {
      expect(DifferencePvf.forest(2, [])).toEqual([
        { 'v': [0] }, { 'v': [1] }]);
      expect(DifferencePvf.forest(4, [])).toEqual([
        { 'v': [0] }, { 'v': [1] }, { 'v': [2] }, { 'v': [3] }]);
    });

    it('merges nodes for equality constraints', function() {
      expect(DifferencePvf.forest(2, [[0, 1, '=']])).toEqual([
        { 'v': [0, 1] }]);
      expect(DifferencePvf.forest(3, [[0, 1, '=']])).toEqual([
        { 'v': [0, 1] }, { 'v': [2] }]);
      expect(DifferencePvf.forest(3, [[0, 1, '='], [1, 2, '=']])).toEqual([
        { 'v': [0, 1, 2] }]);
    });

    it('adds children for an inequality constraint', function() {
      expect(DifferencePvf.forest(2, [[0, 1, '>']])).toEqual([
        { 'v': [0], 'c': [{ 'v': [1] }] }]);
      expect(DifferencePvf.forest(2, [[0, 1, '<']])).toEqual([
        { 'v': [1], 'c': [{ 'v': [0] }] }]);
      expect(DifferencePvf.forest(3, [[0, 2, '>']])).toEqual([
        { 'v': [0], 'c': [{ 'v': [2] }] }, { 'v': [1] }]);
    });

    it('can chain inequalities', function() {
      expect(DifferencePvf.forest(3, [[0, 1, '<'], [1, 2, '<']])).toEqual([
        { 'v': [2], 'c': [{ 'v': [1], 'c': [{ 'v': [0] }] }] }
      ]);
      expect(DifferencePvf.forest(3, [[0, 1, '>'], [1, 2, '>']])).toEqual([
        { 'v': [0], 'c': [{ 'v': [1], 'c': [{ 'v': [2] }] }] }
      ]);
    });

    it('can equate nodes in inequality', function() {
      expect(DifferencePvf.forest(3, [[0, 1, '>'], [1, 2, '=']])).toEqual([
        { 'v': [0], 'c': [{ 'v': [1, 2] }] }
      ]);
      expect(DifferencePvf.forest(3, [[0, 1, '>'], [0, 2, '=']])).toEqual([
        { 'v': [0, 2], 'c': [{ 'v': [1] }] }
      ]);
      expect(DifferencePvf.forest(4, [[0, 1, '>'], [1, 2, '>'], [1, 3, '=']])).toEqual([
        { 'v': [0], 'c': [{ 'v': [1, 3], 'c': [{ 'v': [2] }] }] }
      ]);
    });

    it('can fork inequalities', function() {
      expect(DifferencePvf.forest(3, [[1, 0, '>']])).toEqual([
        { 'v': [1], 'c': [{ 'v': [0] }] }, { 'v': [2] }
      ]);
      expect(DifferencePvf.forest(3, [[1, 0, '>'], [1, 2, '>']])).toEqual([
        { 'v': [1], 'c': [{ 'v': [0] }, { 'v': [2] }] }
      ]);
    });

    it('can merge inequalities', function() {
      expect(DifferencePvf.forest(3, [[1, 0, '>'], [2, 0, '>']])).toEqual([
        { 'v': [1], 'c': [{ 'v': [0] }] }, { 'v': [2], 'c': [{ 'v': [0] }] }
      ]);
    });

    it('can equate nodes of a fork', function() {
      expect(DifferencePvf.forest(3, [[1, 0, '>'], [1, 2, '>'], [0, 2, '=']])).toEqual([
        { 'v': [1], 'c': [{ 'v': [0, 2] }] }
      ]);
      expect(DifferencePvf.forest(3, [[1, 0, '>'], [1, 2, '>'], [2, 0, '=']])).toEqual([
        { 'v': [1], 'c': [{ 'v': [0, 2] }] }
      ]);
    });

    it('can equate nodes of a merge', function() {
      expect(DifferencePvf.forest(3, [[1, 0, '>'], [2, 0, '>'], [1, 2, '=']])).toEqual([
        { 'v': [1, 2], 'c': [{ 'v': [0] }] }
      ]);
      expect(DifferencePvf.forest(3, [[1, 0, '>'], [2, 0, '>'], [2, 1, '=']])).toEqual([
        { 'v': [1, 2], 'c': [{ 'v': [0] }] }
      ]);
    });

    it('can resolve a fork to a line', function() {
      expect(DifferencePvf.forest(3, [[1, 0, '>'], [1, 2, '>'], [0, 2, '>']])).toEqual([
        { 'v': [1], 'c': [{ 'v': [0], 'c': [{ 'v': [2] }] }] }
      ]);
    });

    it('can resolve a merge to a line', function() {
      expect(DifferencePvf.forest(3, [[0, 1, '>'], [2, 1, '>'], [0, 2, '>']])).toEqual([
        { 'v': [0], 'c': [{ 'v': [2], 'c': [{ 'v': [1] }] }] }
      ]);
    });

    it('can equate nodes that have different parents', function() {
      expect(DifferencePvf.forest(4, [[0, 1, '>'], [2, 3, '>'], [1, 3, '=']])).toEqual([
        { 'v': [0], 'c': [{ 'v': [1, 3] }] }, { 'v': [2], 'c': [{ 'v': [1, 3] }] }
      ]);
    });

    it('can add inequality between nodes that have different parents', function() {
      expect(DifferencePvf.forest(4, [[0, 1, '>'], [2, 3, '>'], [1, 3, '>']])).toEqual([
        { 'v': [0], 'c': [{ 'v': [1], 'c': [{ 'v': [3] }] }] }, { 'v': [2], 'c': [{ 'v': [3] }] }
      ]);
    });

    it('can add inequality between nodes that have different children', function() {
      expect(DifferencePvf.forest(4, [[0, 1, '>'], [2, 3, '>'], [0, 2, '>']])).toEqual([
        { 'v': [0], 'c': [{ 'v': [1] }, { 'v': [2], 'c': [{ 'v': [3] }] }] }
      ]);
    });

    it('can handle complex cases', function() {
      expect(DifferencePvf.forest(4, [[0, 1, "<"], [1, 2, ">"], [2, 3, ">"], [0, 2, "<"], [0, 3, ">"]])).toEqual([
        { v: [1], c: [{ v: [2], c: [{ v: [0], c: [{ v: [3] }] }] }] }
      ]);

      expect(DifferencePvf.forest(4, [[0, 1, ">"], [1, 2, "<"], [2, 3, ">"], [0, 2, ">"]])).toEqual([
        { v: [0], c: [{ v: [2], c: [{ v: [1] }, { v: [3] }] }] }
      ]);

      expect(DifferencePvf.forest(4, [[0, 1, ">"], [1, 2, "<"], [2, 3, ">"], [0, 2, ">"], [1, 3, ">"]])).toEqual([
        { v: [0], c: [{ v: [2], c: [{ v: [1], c: [{ v: [3] }] }] }] }
      ]);

      expect(DifferencePvf.forest(4, [[0, 3, ">"], [3, 1, ">"], [2, 1, ">"], [2, 0, ">"]])).toEqual([
        { v: [2], c: [{ v: [0], c: [{ v: [3], c: [{ v: [1] }] }] }] }
      ]);

      expect(DifferencePvf.forest(4, [[0, 3, ">"], [3, 1, ">"], [2, 1, ">"], [0, 2, ">"]])).toEqual([
        { v: [0], c: [{ v: [2], c: [{ v: [1] }] }, { v: [3], c: [{ v: [1] }] }] }
      ]);

      expect(DifferencePvf.forest(4, [[0, 3, ">"], [3, 1, ">"], [2, 1, ">"], [0, 2, ">"], [2, 3, "="]])).toEqual([
        { v: [0], c: [{ v: [2, 3], c: [{ v: [1] }] }] }
      ]);

      expect(DifferencePvf.forest(4, [[0, 3, ">"], [3, 1, ">"], [2, 1, ">"], [0, 2, ">"], [2, 3, "<"]])).toEqual([
        { v: [0], c: [{ v: [3], c: [{ v: [2], c: [{ v: [1] }] }] }] }
      ]);
    });

    it('detects inconsistencies', function() {
      expect(function() { DifferencePvf.forest(2, [[1, 0, ">"], [1, 0, "<"]]) }).toThrowError("Inconsistent answers");
     expect(function() { DifferencePvf.forest(2, [[1, 0, ">"], [1, 0, "="]]) }).toThrowError("Inconsistent answers");
      expect(function() { DifferencePvf.forest(2, [[0, 1, ">"], [1, 0, "="]]) }).toThrowError("Inconsistent answers");
      expect(function() { DifferencePvf.forest(3, [[0, 1, ">"], [1, 2, ">"], [2, 0, ">"]]) }).toThrowError("Inconsistent answers");
      expect(function() { DifferencePvf.forest(3, [[0, 1, "="], [0, 1, ">"]]) }).toThrowError("Inconsistent answers");
      expect(function() { DifferencePvf.forest(2, [[0, 2, "="]]) }).toThrowError("Node index out of bounds");
      expect(function() { DifferencePvf.forest(2, [[-1, 1, "="]]) }).toThrowError("Node index out of bounds");
    });
  });

  describe('isComplete', function() {
    it('detects completeness', function() {
      expect(DifferencePvf.isComplete(DifferencePvf.forest(3, [[0, 1, "="], [1, 2, "="]]))).toEqual(true);
      expect(DifferencePvf.isComplete(DifferencePvf.forest(3, [[0, 1, ">"], [1, 2, ">"]]))).toEqual(true);
      expect(DifferencePvf.isComplete(DifferencePvf.forest(3, [[0, 1, "<"], [1, 2, "<"]]))).toEqual(true);
      expect(DifferencePvf.isComplete(DifferencePvf.forest(3, [[0, 1, ">"], [1, 2, "<"]]))).toEqual(false);
    });

    
  });

  describe('nextInterval', function() {
    it('asks about the diagonal first', function() {
      expect(DifferencePvf.nextInterval(4, [])).toEqual([0,1]);
      expect(DifferencePvf.nextInterval(4, [[0, 1, "="]])).toEqual([1,2]);
      expect(function() { DifferencePvf.nextInterval(4, [[0, 2, "="]]) }).toThrowError("Expected first n-1 answers to be about the diagonal");
      expect(DifferencePvf.nextInterval(4, [[0, 1, "="], [1, 2, "="]])).toEqual([2,3]);
    });

    it('terminates on complete information', function() {
      expect(DifferencePvf.nextInterval(4, [[0, 1, "="], [1, 2, "="], [2, 3, "="]])).toEqual(undefined);
      expect(DifferencePvf.nextInterval(4, [[0, 1, ">"], [1, 2, ">"], [2, 3, ">"]])).toEqual(undefined);
      expect(DifferencePvf.nextInterval(4, [[0, 1, "<"], [1, 2, "<"], [2, 3, "<"]])).toEqual(undefined);
    });

    it('dynamically asks for more information', function() {
      expect(DifferencePvf.nextInterval(3, [[0, 1, ">"], [1, 2, "<"]])).toEqual([0, 2]);
      expect(DifferencePvf.nextInterval(3, [[0, 1, "<"], [1, 2, ">"]])).toEqual([0, 2]);
      expect(DifferencePvf.nextInterval(4, [[0, 1, "<"], [1, 2, ">"], [2, 3, "<"]])).toEqual([0, 2]);
      expect(DifferencePvf.nextInterval(4, [[0, 1, "<"], [1, 2, ">"], [2, 3, "<"], [0, 2, ">"]])).toEqual([0, 3]);
      expect(DifferencePvf.nextInterval(4, [[0, 1, "<"], [1, 2, ">"], [2, 3, "<"], [0, 2, ">"], [0, 3, "<"]])).toEqual([1, 3]);
      expect(DifferencePvf.nextInterval(4, [[0, 1, "<"], [1, 2, ">"], [2, 3, ">"]])).toEqual([0, 2]);
      expect(DifferencePvf.nextInterval(4, [[0, 1, "<"], [1, 2, ">"], [2, 3, ">"]])).toEqual([0, 2]);
      expect(DifferencePvf.nextInterval(4, [[0, 1, "<"], [1, 2, "<"], [2, 3, ">"]])).toEqual([0, 3]);
    });
  });
});
