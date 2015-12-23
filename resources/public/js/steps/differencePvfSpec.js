define(['steps/differencePvf'], function(Step) {
  describe("steps/differencePvf", function() {
    describe("initialize", function() {
      it("works", function() {
        var scope = {};
        var workspace = {
          problem: {
            criteria: {
              "A": {
                "pvf": {
                  "range": [
                    0,
                    20
                  ],
                  "direction": "decreasing"
                }
              },
              "B": {
                "pvf": {
                  "range": [
                    -10,
                    10 
                  ],
                  "direction": "increasing"
                }
              },
            }
          }
        };
        var step = Step(scope, workspace);
        var state = step.initialize();
        expect(state.criterion).toEqual("A");
        expect(state.pvfPrefs).toEqual({ "A": [], "B": [] });
        var intervals = {
          "A": [ [20, 15], [15, 10], [10, 5], [5, 0] ],
          "B": [ [-10, -5], [-5, 0], [0, 5], [5, 10] ]
        };
        expect(state.intervals).toEqual(intervals);
        expect(state.question).toEqual([0, 1]);
      });
    }); // describe initialize

    describe("validChoice", function() {
      it("allows only <, >, =", function() {
        var step = Step({}, {});
        expect(step.validChoice({ 'choice': '<'})).toBeTruthy();
        expect(step.validChoice({ 'choice': '>'})).toBeTruthy();
        expect(step.validChoice({ 'choice': '='})).toBeTruthy();
        expect(step.validChoice({})).toBeFalsy();
        expect(step.validChoice({ 'choice': '*'})).toBeFalsy();
      });
    }); // describe validChoice

    describe("nextState", function() {
      it("advances to the next interval", function() {
        var scope = {};
        var workspace = {
          problem: {
            criteria: {
              "A": {
                "pvf": {
                  "range": [
                    0,
                    20
                  ],
                  "direction": "decreasing"
                }
              }
            }
          }
        };
        var step = Step(scope, workspace);
        var state = step.initialize();

        state.choice = '=';
        state = step.nextState(state);
        expect(state.choice).toBeUndefined();
        expect(state.question).toEqual([1,2]);
        expect(state.criterion).toEqual("A");
        expect(state.pvfPrefs).toEqual({ "A": [[0, 1, "="]] });

        state.choice = '=';
        state = step.nextState(state);
        expect(state.choice).toBeUndefined();
        expect(state.question).toEqual([2,3]);
        expect(state.criterion).toEqual("A");
        expect(state.pvfPrefs).toEqual({ "A": [[0, 1, "="], [1, 2, "="]] });
      });

      it("advances to the next criterion", function() {
        var scope = {};
        var workspace = {
          problem: {
            criteria: {
              "A": {
                "pvf": {
                  "range": [
                    0,
                    20
                  ],
                  "direction": "decreasing"
                }
              },
              "B": {
                "pvf": {
                  "range": [
                    -10,
                    10
                  ],
                  "direction": "increasing"
                }
              }
            }
          }
        };
        var step = Step(scope, workspace);
        var state = step.initialize();
        state.choice = '=';
        state = step.nextState(state);
        state.choice = '=';
        state = step.nextState(state);
        state.choice = '=';
        state = step.nextState(state);

        expect(state.choice).toBeUndefined();
        expect(state.question).toEqual([0,1]);
        expect(state.criterion).toEqual("B");
        expect(state.pvfPrefs).toEqual({ "A": [[0, 1, "="], [1, 2, "="], [2, 3, "="]], "B": [] });

        state.choice = '=';
        state = step.nextState(state);
        state.choice = '=';
        state = step.nextState(state);
        state.choice = '=';
        expect(step.isFinished(state)).toBeTruthy();
      });
    });

  });
});
