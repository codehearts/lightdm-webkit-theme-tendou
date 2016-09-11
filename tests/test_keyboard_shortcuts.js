/* jshint mocha: true */
/* global Tendou, sinon, assert, after, beforeEach */
describe('Tendou', function() {
  describe('__test_framework__', function() {
    var __Tendou__ = Tendou.__test_framework__;

    describe('init_keypress_handler()', function() {
      it('should register all keybindings', function() {
        var registration_stub = sinon.stub(Tendou, 'register_keypress_handler');
        Tendou.__test_framework__.init_keypress_handler();

        assert.equal(
          window.onkeydown, __Tendou__.keypress_event_translator,
          'window.onkeydown was not set to keypress_event_translator'
        );

        assert.isTrue(
          registration_stub.calledWithExactly(40, Tendou.select_next_user),
          'select_next_user keybinding was not registered'
        );

        assert.isTrue(
          registration_stub.calledWithExactly(38, Tendou.select_previous_user),
          'select_previous_user keybinding was not registered'
        );
      });
    });

    describe('keypress_event_translator()', function() {
      var keypress_handler = sinon.stub(__Tendou__, 'keypress_handler');
      var mock_event = { key: 40, preventDefault: sinon.spy() };

      beforeEach(function() {
        mock_event.preventDefault.reset();
      });

      after(function() {
        keypress_handler.restore();
      });

      it('should pass keyboard events on as simple arguments', function() {
        __Tendou__.keypress_event_translator(mock_event);

        assert.isTrue(
          keypress_handler.calledWithExactly(mock_event.key),
          'keypress handler was called with incorrect arguments'
        );
      });

      it('should preventDefault when keypress is handled', function() {
        keypress_handler.returns(true);

        __Tendou__.keypress_event_translator(mock_event);

        assert.isTrue(
          mock_event.preventDefault.calledOnce,
          'preventDefault was not called when keypress_handler returned true'
        );
      });

      it('should not preventDefault when keypress isn\'t handled', function() {
        keypress_handler.returns(false);

        __Tendou__.keypress_event_translator(mock_event);

        assert.isFalse(
          mock_event.preventDefault.called,
          'preventDefault was called when keypress_handler returned false'
        );
      });
    });

    describe('keypress_handler()', function() {
      var handler_spy_1 = sinon.spy();
      var handler_spy_2 = sinon.spy();
      var handler_spy_3 = sinon.spy();

      Tendou.register_keypress_handler(0, handler_spy_1);
      Tendou.register_keypress_handler(0, handler_spy_2);
      Tendou.register_keypress_handler(1, handler_spy_3);

      beforeEach(function() {
        handler_spy_1.reset();
        handler_spy_2.reset();
        handler_spy_3.reset();
      });

      it('should call all registered callbacks for a keybinding', function() {
        __Tendou__.keypress_handler(0);

        assert.isTrue(
          handler_spy_1.calledOnce,
          'keypress_handler did not call the first registered handler'
        );

        assert.isTrue(
          handler_spy_2.calledOnce,
          'keypress_handler did not call the second registered handler'
        );

        assert.isFalse(
          handler_spy_3.called,
          'keypress_handler called a handler registered to a different key'
        );
      });

      it('should return true when the keypress is handled', function() {
        assert.isTrue(
          __Tendou__.keypress_handler(0),
          'keypress_handler did not return true when the key was handled'
        );
      });

      it('should return false when the keypress is not handled', function() {
        assert.isFalse(
          __Tendou__.keypress_handler(2),
          'keypress_handler did not return false when the key was not handled'
        );
      });
    });
  });
});
