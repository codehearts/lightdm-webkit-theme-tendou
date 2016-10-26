/* jshint mocha: true */
/* global Tendou, sinon, assert, beforeEach */
describe('Tendou', function() {
  var __Tendou__ = Tendou.__test_framework__;
  var __Tendou_prop__ = Tendou.__test_framework_properties__;

  describe('LightDM authentication', function() {
    var fakes;

    beforeEach(function() {
      // Sandboxed environment, avoids polluting the global namespace with stubs
      fakes = sinon.collection;
    });

    afterEach(function() {
      // Cancel any previous login attempt
      lightdm.cancel_authentication();

      fakes.restore();
    });

    before(function() {
      // Initialize the LightDM handlers before running these tests
      __Tendou__.init_lightdm_handlers();

      // Create a mock password field element
      __Tendou_prop__.el_input_pass = {
        value: '',
        focus: function() { /* empty stub */ },
      };

      lightdm.num_users = 2;
      lightdm.users = [
        { name: 'shinji' },
        { name: 'rei'    },
      ];
    });

    it('should authenticate a user with a correct password', function() {
      var lightdm_login_stub = fakes.stub(lightdm, 'login');
      __Tendou_prop__.el_input_pass.value = 'shinji'; // Password is username

      window.start_authentication('shinji'); // Begin auth for user "shinji"
      window.provide_secret(); // Provide the password field value to LightDM

      assert.isTrue(
        lightdm.is_authenticated,
        'user was not authenticated'
      );

      // The mock framework is broken and sets the auth user to null
      assert.isTrue(
        lightdm_login_stub.calledWithExactly(null, lightdm.default_session),
        'lightdm login function was not called'
      );
    });

    it('should not authenticate a user with an incorrect password', function() {
      var lightdm_login_stub = fakes.stub(lightdm, 'login');
      var show_error_stub = fakes.stub(window, 'show_error');
      __Tendou_prop__.el_input_pass.value = 'incorrect'; // Incorrect password

      window.start_authentication('shinji'); // Begin auth for user "shinji"
      window.provide_secret(); // Provide the password field value to LightDM

      assert.isFalse(
        lightdm.is_authenticated,
        'user was authenticated'
      );

      assert.isTrue(
        show_error_stub.calledWithExactly('Your password was incorrect'),
        'lightdm did not display an error message to the user'
      );

      assert.equal(0, lightdm_login_stub.callCount,
        'lightdm login function was not called'
      );
    });

    it('should authenticate a user after an incorrect password', function() {
      var lightdm_login_stub = fakes.stub(lightdm, 'login');
      var show_error_stub = fakes.stub(window, 'show_error');
      __Tendou_prop__.el_input_pass.value = 'incorrect'; // Incorrect password

      window.start_authentication('shinji'); // Begin auth for user "shinji"
      window.provide_secret(); // Provide the password field value to LightDM

      assert.isFalse(
        lightdm.is_authenticated,
        'user was authenticated'
      );

      assert.isTrue(
        show_error_stub.calledWithExactly('Your password was incorrect'),
        'lightdm did not display an error message to the user'
      );

      assert.equal(0, lightdm_login_stub.callCount,
        'lightdm login function was not called'
      );

      __Tendou_prop__.el_input_pass.value = 'shinji'; // Password is username

      window.provide_secret(); // Provide the password field value to LightDM

      assert.isTrue(
        lightdm.is_authenticated,
        'user was not authenticated'
      );

      // The mock framework is broken and sets the auth user to null
      assert.isTrue(
        lightdm_login_stub.calledWithExactly(null, lightdm.default_session),
        'lightdm login function was not called'
      );
    });

    it('should authenticate a different user after a failed login', function() {
      var lightdm_login_stub = fakes.stub(lightdm, 'login');
      var show_error_stub = fakes.stub(window, 'show_error');
      __Tendou_prop__.el_input_pass.value = 'incorrect'; // Incorrect password

      window.start_authentication('shinji'); // Begin auth for user "shinji"
      window.provide_secret(); // Provide the password field value to LightDM

      assert.isFalse(
        lightdm.is_authenticated,
        'user was authenticated'
      );

      assert.isTrue(
        show_error_stub.calledWithExactly('Your password was incorrect'),
        'lightdm did not display an error message to the user'
      );

      assert.equal(0, lightdm_login_stub.callCount,
        'lightdm login function was not called'
      );

      // Switch the user to authenticate
      
      __Tendou_prop__.el_input_pass.value = 'rei'; // Password is username

      lightdm.cancel_authentication();
      window.start_authentication('rei'); // Begin auth for user "rei"
      window.provide_secret(); // Provide the password field value to LightDM

      assert.isTrue(
        lightdm.is_authenticated,
        'user was not authenticated'
      );

      // The mock framework is broken and sets the auth user to null
      assert.isTrue(
        lightdm_login_stub.calledWithExactly(null, lightdm.default_session),
        'lightdm login function was not called'
      );
    });
  });
});
