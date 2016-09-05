var Tendou = (function(lightdm) {
	'use strict';

	var Public = {
		/**
		 * Initializes the functionality for this theme.
		 */
		init: function() {
			init_lightdm_handlers();
			init_keypress_handler();

			// DOM initializers
			init_dom_elements();
			init_dom_users_list();
			init_dom_listeners();
		},

		/**
		 * Private methods which are exposed for the purpose of testing.
		 */
		test_framework: {
			init_lightdm_handlers:    init_lightdm_handlers,
			init_keypress_handler:    init_keypress_handler,
			get_full_name_from_index: get_full_name_from_index,
			get_picture_from_index:   get_picture_from_index,
		},
	};



	/*
	 *
	 * Private properties
	 *
	 */

	var el_form_login_form = null, // Login form
		el_input_user      = null, // User input field
		el_input_pass      = null, // Password input field
		el_ul_user_list    = null, // List of users
		el_p_message       = null, // Messages to display to the user
		el_h1_full_name    = null, // Heading for the current user's full name
		el_figure_profile  = null, // Container for the current user's picture
		el_img_profile     = null, // Container for the current user's picture
		el_button_shutdown = null, // Shutdown button
		el_button_restart  = null, // Restart button
		el_button_sleep    = null, // Sleep button
		current_user_index = 0,    // Index of the currently selected user
		default_avatar     = 'images/default-avatar.png';



	/*
	 *
	 * Private methods
	 *
	 */

	function init_dom_elements() {
		if (el_input_user === null) {
			el_form_login_form = document.getElementById('login-form');
			el_input_user      = document.getElementById('user');
			el_input_pass      = document.getElementById('password');
			el_ul_user_list    = document.getElementById('user-list');
			el_p_message       = document.getElementById('message');
			el_h1_full_name    = document.getElementById('login-name');
			el_figure_profile  = document.getElementById('profile-image');
			el_img_profile     = el_figure_profile.querySelector('img');
			el_button_shutdown = document.getElementById('shutdown');
			el_button_restart  = document.getElementById('reboot');
			el_button_sleep    = document.getElementById('sleep');
		}
	};


	/**
	 * Registeres event listeners on DOM elements.
	 */
	function init_dom_listeners() {
		/* Update the current user when a user list entry is clicked */
		el_ul_user_list.addEventListener('click', function(e) {
			var user_index = parseInt(e.target.id.replace('user-', ''), 10);

			set_current_user(user_index);
			indicate_current_user_on_screen();
		});

		/* Updates the user list when the currently selected user changes. */
		el_input_user.addEventListener('change', function(e) {
			e.preventDefault();
			indicate_current_user_on_screen(e.currentTarget.selectedIndex);
		});

		/* Authenticates with LightDM when the login form is submitted. */
		el_form_login_form.addEventListener('submit', function(e) {
			e.preventDefault();

			// Clear all messages and display the waiting indicator
			clear_message();
			show_wait_indicator();

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
	};


	/**
	 * Populates the user list with all users registered under LightDM.
	 */
	function init_dom_users_list() {
		var user_index,
			fullname;

		if (lightdm.num_users > 1) {
			for (user_index = 0; user_index < lightdm.num_users; user_index++) {
				if (lightdm.users.hasOwnProperty(user_index)) {
					fullname = get_full_name_from_index(user_index);

					el_ul_user_list.insertAdjacentHTML(
						'beforeend',
						'<li id="user-'+user_index+'">'+fullname+'</li>'
					);
				}
			}

			// Select the first user in the list
			set_current_user(0);
			indicate_current_user_on_screen();
		}
	};


	/**
	 * Register keypress handlers.
	 */
	function init_keypress_handler() {
		window.onkeydown = function(e) {
			var key = (e.key ? e.key : e.keyCode);
			var new_user_index;

			if (key == 38) {        // Up
				e.preventDefault();

				// Select the previous user in the list
				new_user_index = ((current_user_index - 1)+lightdm.num_users);
				new_user_index = new_user_index % lightdm.num_users;
				set_current_user(new_user_index);
				indicate_current_user_on_screen();
			} else if (key == 40) { // Down
				e.preventDefault();

				// Select the next user in the list
				new_user_index = (current_user_index+1) % lightdm.num_users;
				set_current_user(new_user_index);
				indicate_current_user_on_screen(new_user_index);
			}
		};
	};


	/**
	 * Returns the full name for the user with the given id, if available.
	 * If a full name is not available, their real name will be used.
	 * If there is no real name, their username will be used.
	 *
	 * @param int user_index The index of the user in the LightDM user array.
	 * @return string The full name for the user.
	 */
	function get_full_name_from_index(user_index) {
		var user = lightdm.users[user_index];

		if (user.display_name) {
			return user.display_name;
		} else if (user.real_name) {
			return user.real_name;
		} else {
			return user.name;
		}
	};


	/**
	 * Displays the given general message to the user.
	 *
	 * @param string text The message to display.
	 */
	function show_message(text) {
		el_p_message.innerHTML= text;
		el_p_message.classList.remove('cleared');
		el_p_message.classList.remove('error');
	};


	/**
	 * Displays the given error message to the user.
	 *
	 * @param string text The error message to display.
	 */
	function show_error(text) {
		show_message(text);
		el_p_message.classList.add('error');
	};


	/**
	 * Clears all messages displayed to the user.
	 */
	function clear_message() {
		show_message('');
		el_p_message.classList.add('cleared');
	};


	/**
	 * Displays the wait indicator to the user.
	 */
	function show_wait_indicator() {
		el_p_message.insertAdjacentHTML(
			'afterend',
			'<div class="spinner"></div>'
		);
	};


	/**
	 * Removes the wait indicator.
	 */
	function hide_wait_indicator() {
		var spinners = document.getElementsByClassName('spinner');

		while (spinners[0]) {
			spinners[0].parentNode.removeChild(spinners[0]);
		}
	};


	/**
	 * Returns the path of the picture for the user with the given id.
	 *
	 * @param int user_index The index of the user in the LightDM user array.
	 */
	function get_picture_from_index(user_index) {
		var picture;

		if (lightdm.users[user_index].image) {
			picture = lightdm.users[user_index].image;
		} else {
			picture = default_avatar;
		}

		return picture;
	};


	/**
	 * Updates the current user picture for the user with the given id.
	 *
	 * @param int user_index The index of the user in the LightDM user array.
	 */
	function update_user_picture(user_index) {
		// Disable animation on the image
		el_figure_profile.style.webkitAnimationName = 'none';
		el_figure_profile.style.animationName = 'none';

		// Change the displayed image
		el_img_profile.src = get_picture_from_index(user_index);

		// Reapply the animation
		setTimeout(function() {
			el_figure_profile.style.webkitAnimationDelay = 0;
			el_figure_profile.style.webkitAnimationName  = 'avatar_in';
			el_figure_profile.style.animationDelay = 0;
			el_figure_profile.style.animationName  = 'avatar_in';
		}, 1);
	};


	/**
	 * Updates the currently displayed full name for the user with the given id.
	 *
	 * @param int user_index The index of the user in the LightDM user array.
	 */
	function update_user_full_name(user_index) {
		el_h1_full_name.innerHTML = get_full_name_from_index(user_index);
	};


	/**
	 * Sets the current user to the user with the given id.
	 *
	 * @param int user_index The index of the user in the LightDM user array.
	 */
	function set_current_user(user_index) {
		var current_user_name = lightdm.users[user_index].name;

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
	};


	/**
	 * Indicates the currently selected user in the DOM.
	 */
	function indicate_current_user_on_screen() {
		var index = current_user_index,
			el_li_user_entry = document.getElementById('user-'+index);

		// Set this user as the user to log in
		el_input_user.value = lightdm.users[current_user_index].name;

		// Update the display
		update_user_picture(current_user_index);
		update_user_full_name(current_user_index);

		// Deselect all other users
		Array.prototype.forEach.call(
			el_ul_user_list.getElementsByClassName('selected'),
			function(e) { e.className = ''; }
		);

		// Mark this user as selected if they have a list entry
		if (el_li_user_entry) {
			el_li_user_entry.className = 'selected';
		}

		// Clear all messages and the wait indicator
		clear_message();
		hide_wait_indicator();
	};


	/**
	 * Initializes methods that are used with LightDM.
	 */
	function init_lightdm_handlers() {
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
			lightdm.provide_secret(el_input_pass.value);
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
				show_error('Your password was incorrect');

				// Reset the password field and remove the wait indicator
				el_input_pass.value = '';
				el_input_pass.focus();
				hide_wait_indicator();

				// Restart authentication for the current user
				lightdm.start_authentication(lightdm.users[current_user_index]);
			}
		};

		/**
		 * Called for LightDM to display errors.
		 */
		window.show_error = function(e) { e; /* do nothing */ };

		/**
		 * Called for LightDM to display the login prompt.
		 */
		window.show_prompt = function(e) { e; /* do nothing */ };
	};



	// Expose the public interface
	return Public;
} (lightdm));
