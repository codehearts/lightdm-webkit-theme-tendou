/* jshint mocha: true */
/* global Tendou, sinon, assert */
describe('wait indicator', function() {
  var tendou, sandbox,
      createElement_stub, insertAdjacentElement_spy, remove_spy;

  sandbox = sinon.sandbox.create();

  beforeEach(function() {
    tendou = new Tendou();

    // Stub createElement to return an object with an empty className property
    remove_spy = sandbox.spy();
    createElement_stub = sandbox.stub(document, 'createElement', function() {
      return {
        className:  '',
        remove:     remove_spy,
      };
    });

    // Spy on the insertAdjacentElement call
    insertAdjacentElement_spy = sandbox.spy();
    tendou._el_text_message = {
      insertAdjacentElement: insertAdjacentElement_spy,
    };
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('should be added to the DOM', function() {
    // Show the wait indicator
    tendou._show_wait_indicator();

    // Verify the indicator was added to the DOM
    assert.equal(
      tendou._el_wait_indicator,
      insertAdjacentElement_spy.getCall(0).args[1],
      'wait indicator element was not added to DOM'
    );
  });

  it('should not show more than one indicator', function() {
    // Attempt to display multiple wait indicators
    tendou._show_wait_indicator();
    tendou._show_wait_indicator();
    tendou._show_wait_indicator();

    // Verify the indicator was displayed once
    assert.equal(
      1, insertAdjacentElement_spy.callCount,
      'wait indicator was not shown exactly once'
    );
  });

  it('should not be hidden if it was never shown', function() {
    // Attempt to hide the wait indicator when it was never shown
    tendou._hide_wait_indicator();

    // Verify that nothing happened
    assert.equal(
      0, remove_spy.callCount,
      'attempted to remove wait indicator from DOM when it was never shown'
    );
  });

  it('should be removed from DOM when hidden', function() {
    // Show the wait indicator and hide it
    tendou._show_wait_indicator();
    tendou._hide_wait_indicator();

    // Verify that the wait indicator was removed from the DOM
    assert.equal(
      1, remove_spy.callCount,
      'hiding wait indicator did not remove it from DOM'
    );
  });

  it('should be possible to show after hiding', function() {
    // Show the wait indicator, hide it, then show it again
    tendou._show_wait_indicator();
    tendou._hide_wait_indicator();
    tendou._show_wait_indicator();

    // Verify that the wait indicator was added, removed, and added to the DOM
    assert.isTrue(
      insertAdjacentElement_spy.calledBefore(remove_spy),
      'wait indicator not added to DOM before removing');
    assert.isTrue(
      remove_spy.calledBefore(insertAdjacentElement_spy),
      'wait indicator did not remove from DOM before adding');
    assert.equal(
      2, insertAdjacentElement_spy.callCount,
      'hiding wait indicator did not remove it from DOM'
    );
  });
});
