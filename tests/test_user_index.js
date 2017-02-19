/* jshint mocha: true */
/* global Tendou, assert, after, before */
describe('Tendou', function() {
  describe('__test_framework__', function() {
    var tendou, __Tendou__;

    before(function() {
      tendou = new Tendou();
      __Tendou__ = tendou.__test_framework__;

      // Initialize the LightDM handlers before running these tests
      __Tendou__.init_lightdm_handlers();
    });

    describe('multi user environment', function() {
      var saved_num_users = lightdm.num_users;
      var saved_users = lightdm.users;

      before(function() {
        lightdm.num_users = 3;
        lightdm.users = [
          { name: 'shinji' },
          { name: 'rei'    },
          { name: 'asuka'  },
        ];
      });

      after(function() {
        lightdm.num_users = saved_num_users;
        lightdm.users = saved_users;
      });

      describe('set_current_user_index(user_index)', function() {
        it('should set the current user index to the given value', function() {
          __Tendou__.set_current_user_index(0);
          assert.equal(0, __Tendou__.get_current_user_index());

          __Tendou__.set_current_user_index(1);
          assert.equal(1, __Tendou__.get_current_user_index());
        });

        it('should not set the current user index out of bounds', function() {
          __Tendou__.set_current_user_index(0);

          __Tendou__.set_current_user_index(-1);
          assert.equal(0, __Tendou__.get_current_user_index());

          __Tendou__.set_current_user_index(100);
          assert.equal(0, __Tendou__.get_current_user_index());
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

    describe('single user environment', function() {
      var saved_num_users = lightdm.num_users;
      var saved_users = lightdm.users;

      before(function() {
        lightdm.num_users = 1;
        lightdm.users = [
          { name: 'shinji' }
        ];
      });

      after(function() {
        lightdm.num_users = saved_num_users;
        lightdm.users = saved_users;
      });

      describe('set_current_user_index(user_index)', function() {
        it('should only set the current user index if user exists', function() {
          __Tendou__.set_current_user_index(0);
          assert.equal(0, __Tendou__.get_current_user_index());

          __Tendou__.set_current_user_index(1);
          assert.equal(0, __Tendou__.get_current_user_index());
        });
      });

      describe('get_previous_user_index()', function() {
        it('should stay at the current value', function() {
          __Tendou__.set_current_user_index(0);
          assert.equal(0, __Tendou__.get_previous_user_index());
        });
      });

      describe('get_next_user_index()', function() {
        it('should always stay at the current value', function() {
          __Tendou__.set_current_user_index(0);
          assert.equal(0, __Tendou__.get_next_user_index());
        });
      });
    });
  });
});
