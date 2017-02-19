/* exported Tendou */
/* jshint latedef: false */
function Tendou() {
  'use strict';

  /*
   *
   * Private properties
   *
   */

  var self = this;
  this._el_text_message    = null; // Messages to display to the user
  this._el_wait_indicator  = null; // Displayed when the user must wait

  var el_form_login_form   = null, // Login form
      el_input_user        = null, // User input field
      el_list_user_list    = null, // List of users
      el_heading_full_name = null, // Heading for the current user's full name
      el_figure_profile    = null, // Container for the current user's picture
      el_img_profile       = null, // Container for the current user's picture
      el_button_shutdown   = null, // Shutdown button
      el_button_restart    = null, // Restart button
      el_button_sleep      = null, // Sleep button
      current_user_index   = 0,    // Index of the currently selected user
      keypress_handlers    = {},   // Registered keypress callbacks
      default_avatar       = 'images/default-avatar.png',



  PrivateProp = {
    el_input_pass: null, // Password input field
  },
  


  /*
   *
   * Private methods
   *
   */

  Private = {
    /**
     * Initializes methods that are used with LightDM.
     */
    init_lightdm_handlers: function() {
      /**
       * Begins authenticating the given user.
       *
       * @param The username of the user to start authenticating.
       */
      window.start_authentication = function(username) {
        lightdm.cancel_timed_login(); // Cancel any previous login attempt
        lightdm.start_authentication(username);
      };

      /**
       * Provide the user-entered password to LightDM.
       */
      window.provide_secret = function() {
        // Pass the user-entered password to LightDM
        lightdm.provide_secret(PrivateProp.el_input_pass.value);
      };

      /**
       * Called when authentication of the user is complete.
       */
      window.authentication_complete = function() {
        if (lightdm.is_authenticated) {
          // Log in if the user was successfully authenticated
          lightdm.login(
            lightdm.authentication_user,
            lightdm.default_session
          );
        } else {
          // Show an error message if authentication was not successful
          window.show_error('Your password was incorrect');

          // Reset the password field and remove the wait indicator
          PrivateProp.el_input_pass.value = '';
          PrivateProp.el_input_pass.focus();
          self._hide_wait_indicator();

          // Restart authentication for the current user
          lightdm.start_authentication(lightdm.users[current_user_index].name);
        }
      };

      /**
       * Displays the given error message to the user.
       *
       * @param string text The error message to display.
       */
      window.show_error = function(text) {
        show_message(text);
        self._el_text_message.classList.add('error');
      };

      /**
       * Called for LightDM to display the login prompt.
       */
      window.show_prompt = function() { /* do nothing */ };
    },

    /**
     * Register keypress handlers.
     */
    init_keypress_handler: function() {
      window.onkeydown = Private.keypress_event_translator;

      // Up arrow selects previous user, down arrow selects next user
      Public.register_keypress_handler(38, Public.select_previous_user);
      Public.register_keypress_handler(40, Public.select_next_user);
    },

    /**
     * Calls `keypress_handler` with the information from a KeyboardEvent.
     * `preventDefault` will be called on the event if it is handled.
     *
     * @param event e The KeyboardEvent to forward to `keypress_handler`.
     */
    keypress_event_translator: function(e) {
      var key = (e.key ? e.key : e.keyCode);

      if (Private.keypress_handler(key)) {
        e.preventDefault();
      }
    },

    /**
     * Calls all callbacks registered to a specific keybinding.
     * The return value should be used to determine whether to call
     * preventDefault() on the KeyboardEvent object.
     *
     * @param int key_code The code of the key pressed.
     * @return bool True if the key was handled, false otherwise.
     */
    keypress_handler: function(key_code) {
      var was_handled = false;

      if (keypress_handlers[key_code] !== undefined) {
        keypress_handlers[key_code].forEach(function(callback) {
          was_handled = true;
          callback();
        });
      }

      return was_handled;
    },

    /**
     * Returns the index of the current user.
     *
     * @return int The index of the current user in the LightDM user array.
     */
    get_current_user_index: function() {
      return current_user_index;
    },

    /**
     * Returns the index of the previous user.
     *
     * @return int The index of the previous user in the LightDM user array.
     */
    get_previous_user_index: function() {
      var previous_index = ((current_user_index - 1)+lightdm.num_users);
      return previous_index % lightdm.num_users;
    },

    /**
     * Returns the index of the next user.
     *
     * @return int The index of the next user in the LightDM user array.
     */
    get_next_user_index: function() {
      return ((current_user_index + 1) % lightdm.num_users);
    },

    /**
     * Sets the current user to the user with the given id.
     *
     * @param int user_index Index of the user in the LightDM user array.
     */
    set_current_user_index: function(user_index) {
      var current_user_name;

      // Do nothing if there is no user at this index
      if (user_index >= 0 && user_index < lightdm.num_users) {
        current_user_name = lightdm.users[user_index].name;

        // Update the index of the current user globally
        current_user_index = user_index;
        
        // Cancel authentication for a previous authentication attempt
        if (lightdm._username) {
          lightdm.cancel_authentication();
        }

        // Start authentication for the new user
        if (current_user_name !== null) {
          window.start_authentication(current_user_name);
        }
      }
    },
  },



  /*
   *
   * Public members
   *
   */

  Public = {
    /**
     * Initializes the functionality for this theme.
     */
    init: function() {
      Private.init_lightdm_handlers();
      Private.init_keypress_handler();

      // DOM initializers
      init_dom_elements();
      init_dom_users_list();
      init_dom_listeners();
    },

    /**
     * Selects the previous LightDM user.
     */
    select_previous_user: function() {
      var previous_user_index = Private.get_previous_user_index();

      if (previous_user_index !== Private.get_current_user_index()) {
        Private.set_current_user_index(previous_user_index);
        indicate_current_user_on_screen();
      }
    },

    /**
     * Selects the next LightDM user.
     */
    select_next_user: function() {
      var next_user_index = Private.get_next_user_index();

      if (next_user_index !== Private.get_current_user_index()) {
        Private.set_current_user_index(next_user_index);
        indicate_current_user_on_screen();
      }
    },

    /**
     * Returns the full name for the user with the given id, if available.
     * If a full name is not available, their real name will be used.
     * If there is no real name, their username will be used.
     *
     * @param int user_index Index of the user in the LightDM user array.
     * @return string The full name for the user.
     */
    get_full_name_from_index: function(user_index) {
      var user = lightdm.users[user_index];
      var name;

      if (user.display_name) {
        name = user.display_name;
      } else if (user.real_name) {
        name = user.real_name;
      } else {
        name = user.name;
      }

      return name;
    },

    /**
     * Returns the path of the picture for the user with the given id.
     *
     * @param int user_index Index of the user in the LightDM user array.
     */
    get_picture_from_index: function(user_index) {
      var picture;

      if (lightdm.users[user_index].image) {
        picture = lightdm.users[user_index].image;
      } else {
        picture = default_avatar;
      }

      return picture;
    },

    /**
     * Registers a callback for when a specific key is pressed.
     *
     * @param int key The keycode of the key to listen for.
     * @param function callback The function to call when the key is pressed.
     */
    register_keypress_handler: function(key, callback) {
      if (keypress_handlers[key] === undefined) {
        keypress_handlers[key] = [];
      }

      keypress_handlers[key].push(callback);
    },



    /**
     * Expose private methods for the purpose of testing.
     */
    __test_framework__: Private,
    __test_framework_properties__: PrivateProp,

    /**
     * Add function prototype here, because Tendou returns
     * an object other than `this`. Should be refactored
     * to not return a new object.
     */

    _el_text_message:     this._el_text_message,
    _el_wait_indicator:   this._el_wait_indicator,
    _show_wait_indicator: Tendou.prototype._show_wait_indicator,
    _hide_wait_indicator: Tendou.prototype._hide_wait_indicator,
  };



  /*
   *
   * Private methods
   *
   */

  function init_dom_elements() {
    el_form_login_form   = document.getElementById('login-form');
    el_input_user        = document.getElementById('user');
    PrivateProp.el_input_pass = document.getElementById('password');
    el_list_user_list    = document.getElementById('user-list');
    self._el_text_message      = document.getElementById('message');
    el_heading_full_name = document.getElementById('login-name');
    el_figure_profile    = document.getElementById('profile-image');
    el_img_profile       = el_figure_profile.querySelector('img');
    el_button_shutdown   = document.getElementById('shutdown');
    el_button_restart    = document.getElementById('reboot');
    el_button_sleep      = document.getElementById('sleep');
  }


  /**
   * Registeres event listeners on DOM elements.
   */
  function init_dom_listeners() {
    /* Update the current user when a user list entry is clicked */
    el_list_user_list.addEventListener('click', function(e) {
      var user_index = parseInt(e.target.id.replace('user-', ''), 10);

      Private.set_current_user_index(user_index);
      indicate_current_user_on_screen();
    });

    /* Updates the user list when the currently selected user changes. */
    el_input_user.addEventListener('change', function(e) {
      e.preventDefault();
      Private.set_current_user_index(e.currentTarget.selectedIndex);
      indicate_current_user_on_screen();
    });

    /* Authenticates with LightDM when the login form is submitted. */
    el_form_login_form.addEventListener('submit', function(e) {
      e.preventDefault();

      // Clear all messages and display the waiting indicator
      clear_message();
      self._show_wait_indicator();

      window.provide_secret();
    });

    /* Tell LightDM to shut down when the shutdown button is clicked. */
    el_button_shutdown.addEventListener('click', function(e) {
      e.preventDefault();
      show_message('Goodbye');
      lightdm.shutdown();
    });

    /* Tell LightDM to reboot when the reboot button is clicked. */
    el_button_restart.addEventListener('click', function(e) {
      e.preventDefault();
      show_message('See you soon');
      lightdm.restart();
    });

    /* Tell LightDM to sleep when the sleep button is clicked. */
    el_button_sleep.addEventListener('click', function(e) {
      e.preventDefault();
      show_message('Goodnight');
      lightdm.suspend();
    });
  }


  /**
   * Populates the user list with all users registered under LightDM.
   */
  function init_dom_users_list() {
    var user_index;
    var fullname;

    if (lightdm.num_users > 1) {
      for (user_index = 0; user_index < lightdm.num_users; user_index++) {
        if (lightdm.users.hasOwnProperty(user_index)) {
          fullname = Public.get_full_name_from_index(user_index);

          el_list_user_list.insertAdjacentHTML(
            'beforeend',
            '<li id="user-'+user_index+'">'+fullname+'</li>'
          );
        }
      }
    }

    // Select the first user in the list
    Private.set_current_user_index(0);
    indicate_current_user_on_screen();
  }


  /**
   * Displays the given general message to the user.
   *
   * @param string text The message to display.
   */
  function show_message(text) {
    self._el_text_message.innerHTML= text;
    self._el_text_message.classList.remove('cleared');
    self._el_text_message.classList.remove('error');
  }


  /**
   * Clears all messages displayed to the user.
   */
  function clear_message() {
    show_message('');
    self._el_text_message.classList.add('cleared');
  }


  /**
   * Updates the current user picture for the user with the given id.
   *
   * @param int user_index Index of the user in the LightDM user array.
   */
  function update_user_picture(user_index) {
    // Disable animation on the image
    el_figure_profile.style.webkitAnimationName = 'none';
    el_figure_profile.style.animationName = 'none';

    // Change the displayed image
    el_img_profile.src = Public.get_picture_from_index(user_index);

    // Reapply the animation
    setTimeout(function() {
      el_figure_profile.style.webkitAnimationDelay = 0;
      el_figure_profile.style.webkitAnimationName  = 'avatar_in';
      el_figure_profile.style.animationDelay = 0;
      el_figure_profile.style.animationName  = 'avatar_in';
    }, 1);
  }


  /**
   * Updates the currently displayed full name for the user with the given id.
   *
   * @param int user_index Index of the user in the LightDM user array.
   */
  function update_user_full_name(user_index) {
    var full_name = Public.get_full_name_from_index(user_index);
    el_heading_full_name.innerHTML = full_name;
  }


  /**
   * Indicates the currently selected user in the DOM.
   */
  function indicate_current_user_on_screen() {
    var index = current_user_index;
    var el_li_user_entry = document.getElementById('user-'+index);

    // Set this user as the user to log in
    el_input_user.value = lightdm.users[current_user_index].name;

    // Update the display
    update_user_picture(current_user_index);
    update_user_full_name(current_user_index);

    // Deselect all other users
    Array.prototype.forEach.call(
      el_list_user_list.getElementsByClassName('selected'),
      function(e) { e.className = ''; }
    );

    // Mark this user as selected if they have a list entry
    if (el_li_user_entry) {
      el_li_user_entry.className = 'selected';
    }

    // Clear all messages and the wait indicator
    clear_message();
    self._hide_wait_indicator();
  }



  // Expose the public interface
  return Public;
}


/**
 * Displays the wait indicator to the user.
 * Only one wait indicator is displayed at a time.
 */
Tendou.prototype._show_wait_indicator = function() {
  if (null === this._el_wait_indicator) {
    this._el_wait_indicator = document.createElement('div');
    this._el_wait_indicator.className = 'spinner';

    this._el_text_message.insertAdjacentElement(
      'afterend',
      this._el_wait_indicator
    );
  }
};


/**
 * Removes the wait indicator.
 */
Tendou.prototype._hide_wait_indicator = function() {
  if (null !== this._el_wait_indicator) {
    this._el_wait_indicator.remove();
    this._el_wait_indicator = null;
  }
};
