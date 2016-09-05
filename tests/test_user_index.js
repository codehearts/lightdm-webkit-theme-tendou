/* global Tendou, assert */
describe('Tendou', function() {
  before(function() {
	// Initialize the LightDM handlers before running these tests
    Tendou.test_framework.init_lightdm_handlers();
  });

  describe('test_framework', function() {
    describe('set_current_user_index(user_index)', function() {
      it('should set the current user index to the given value', function() {
	    Tendou.test_framework.set_current_user_index(0);
        assert.equal(0, Tendou.get_current_user_index());

	    Tendou.test_framework.set_current_user_index(1);
        assert.equal(1, Tendou.get_current_user_index());
      });
    });
  });

  describe('get_previous_user_index()', function() {
    it('should wrap from 0 to length - 1', function() {
	  Tendou.test_framework.set_current_user_index(0);
      assert.equal(2, Tendou.get_previous_user_index());
    });

    it('should return 1 when the current value is 2', function() {
	  Tendou.test_framework.set_current_user_index(2);
      assert.equal(1, Tendou.get_previous_user_index());
    });
  });

  describe('get_next_user_index()', function() {
    it('should wrap from length - 1 to 0', function() {
	  Tendou.test_framework.set_current_user_index(2);
      assert.equal(0, Tendou.get_next_user_index());
    });

    it('should return 2 when the current value is 1', function() {
	  Tendou.test_framework.set_current_user_index(1);
      assert.equal(2, Tendou.get_next_user_index());
    });
  });
});
