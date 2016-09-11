/* jshint mocha: true */
/* global Tendou, assert, before */
describe('Tendou', function() {
  describe('__test_framework__', function() {
    var __Tendou__ = Tendou.__test_framework__;

    before(function() {
      // Initialize the LightDM handlers before running these tests
      __Tendou__.init_lightdm_handlers();
    });

    describe('set_current_user_index(user_index)', function() {
      it('should set the current user index to the given value', function() {
        __Tendou__.set_current_user_index(0);
        assert.equal(0, __Tendou__.get_current_user_index());

        __Tendou__.set_current_user_index(1);
        assert.equal(1, __Tendou__.get_current_user_index());
      });
    });

    describe('get_previous_user_index()', function() {
      it('should wrap from 0 to length - 1', function() {
        __Tendou__.set_current_user_index(0);
        assert.equal(2, __Tendou__.get_previous_user_index());
      });

      it('should return 1 when the current value is 2', function() {
        __Tendou__.set_current_user_index(2);
        assert.equal(1, __Tendou__.get_previous_user_index());
      });
    });

    describe('get_next_user_index()', function() {
      it('should wrap from length - 1 to 0', function() {
        __Tendou__.set_current_user_index(2);
        assert.equal(0, __Tendou__.get_next_user_index());
      });

      it('should return 2 when the current value is 1', function() {
        __Tendou__.set_current_user_index(1);
        assert.equal(2, __Tendou__.get_next_user_index());
      });
    });
  });
});
