var login = (function(lightdm) {
	var el_input_user   = document.getElementById('user'),            // User input field
		el_input_pass   = document.getElementById('password'),        // Password input field
		el_ul_user_list = document.getElementById('user-list'),       // List of users
		el_p_message    = document.getElementById('message'),         // Messages to display to the user
		el_h1_full_name = document.getElementById('login-name'),      // Heading for the current user's full name
		el_figure_profile = document.getElementById('profile-image'), // Container for the current user's picture
		el_img_profile  = el_figure_profile.querySelector('img'),     // Container for the current user's picture
		default_avatar  = 'images/default-avatar.png',                // Default user avatar
		current_user_index = 0;                                       // Index of the currently selected user

	/**
	 * Returns the full name for the user with the given id, if available.
	 * If a full name is not available, their real name will be used.
	 * If there is no real name, their username will be used.
	 *
	 * @param int user_index The index of the user in the LightDM user array.
	 * @return string The full name for the user.
	 */
	var get_user_full_name = function(user_index) {
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
	var show_message = function(text) {
		el_p_message.innerHTML= text;
		el_p_message.classList.remove('cleared');
		el_p_message.classList.remove('error');
	};

	/**
	 * Displays the given error message to the user.
	 *
	 * @param string text The error message to display.
	 */
	var show_error = function(text) {
		show_message(text);
		el_p_message.classList.add('error');
	};

	/**
	 * Clears all messages displayed to the user.
	 */
	var clear_message = function() {
		show_message('');
		el_p_message.classList.add('cleared');
	};

	/**
	 * Displays the wait indicator to the user.
	 */
	var show_wait_indicator = function() {
		el_p_message.insertAdjacentHTML(
			'afterend',
			'<div class="spinner"></div>'
		);
	};

	/**
	 * Removes the wait indicator.
	 */
	var hide_wait_indicator = function() {
		var spinners = document.getElementsByClassName('spinner');

		while (spinners[0]) {
			spinners[0].parentNode.removeChild(spinners[0]);
		}
	};

	/**
	 * Finds and displays the user picture for the user with the given id.
	 *
	 * @param int user_index The index of the user in the LightDM user array.
	 */
	var find_and_display_user_picture = function(user_index) {
		// Disable animation on the image
		el_figure_profile.style.webkitAnimationName = 'none';
		el_figure_profile.style.animationName = 'none';

		// Change the displayed image
		if (lightdm.users[user_index].image) {
			el_img_profile.src = lightdm.users[user_index].image;
		} else {
			el_img_profile.src = default_avatar;
		}

		// Reapply the animation
		setTimeout(function() {
			el_figure_profile.style.webkitAnimationDelay = 0;
			el_figure_profile.style.webkitAnimationName  = 'avatar_in';
			el_figure_profile.style.animationDelay = 0;
			el_figure_profile.style.animationName  = 'avatar_in';
		}, 1);
	};

	/**
	 * Finds and displays the full name for the user with the given id.
	 *
	 * @param int user_index The index of the user in the LightDM user array.
	 */
	var find_and_display_user_full_name = function(user_index) {
		el_h1_full_name.innerHTML = get_user_full_name(user_index);
	};

	/**
	 * Sets the current user to the user with the given id.
	 *
	 * @param int user_index The index of the user in the LightDM user array.
	 */
	var select_user_from_list = function(user_index) {
		var selected_user_name = lightdm.users[user_index].name,
			el_li_user_list_entry = document.getElementById('user-' + user_index);

		// Update the index of the current user globally
		current_user_index = user_index;

		// Set this user as the user to log in
		el_input_user.value = selected_user_name;

		// Update the display
		find_and_display_user_picture(user_index);
		find_and_display_user_full_name(user_index);

		// Mark this user as selected if they have a list entry
		if (el_li_user_list_entry) {
			// Deselect all other users
			Array.prototype.forEach.call(el_ul_user_list.getElementsByClassName('selected'), function(element) {
				element.className = '';
			});

			el_li_user_list_entry.className = 'selected';
		}

		// Clear all messages and the wait indicator
		clear_message();
		hide_wait_indicator();

		// Cancel authentication for a previous authentication attempt
		if (lightdm._username) {
			lightdm.cancel_authentication();
		}

		// Start authentication for the new user
		if (selected_user_name !== null) {
			window.start_authentication(selected_user_name);
		}
	};

	/**
	 * Populates the user list in the DOM with all users registered under LightDM.
	 */
	var setup_users_list = function() {
		var list = el_ul_user_list,
			user_index,
			fullname;

		for (user_index = 0; lightdm.num_users > 1 && user_index < lightdm.num_users; user_index++) {
			if (lightdm.users.hasOwnProperty(user_index)) {
				fullname = get_user_full_name(user_index);

				list.insertAdjacentHTML(
					'beforeend',
					'<li id="user-' + user_index + '">' + fullname + '</li>'
				);

				// Set an event handler to switch the user on click
				(function(user_index) {
					document.getElementById('user-' + user_index).addEventListener('click', function(e) {
						e.preventDefault();
						select_user_from_list(user_index);
					});
				} (user_index));
			}
		}

		select_user_from_list(0); // Select the first user in the list
	};


	/**
	 *
	 * Functions that LightDM needs.
	 *
	 */

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
		// Clear all messages and display the waiting indicator
		clear_message();
		show_wait_indicator();

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
			// Show an error message if the user was not successfully authenticated
			show_error('Your password was incorrect');

			// Reset the password field and remove the wait indicator
			el_input_pass.value = '';
			el_input_pass.focus();
			hide_wait_indicator();

			// Restart authentication for the current user
			lightdm.start_authentication(el_input_user.value);
		}
	};

	/**
	 * Called for LightDM to display errors.
	 */
    window.show_error  = function(e) { /* no used */ };

	/**
	 * Called for LightDM to display the login prompt.
	 */
    window.show_prompt = function(e) { /* no used */ };



	/**
	 * Initializes the functionality for this theme.
	 */
	var init = function() {
		setup_users_list(); // Initialize the user list

		// Register event listeners

		/* Updates the user list when the currently selected user changes. */
		el_input_user.addEventListener('change', function(e) {
			e.preventDefault();
			select_user_from_list(e.currentTarget.selectedIndex);
		});

		/* Authenticates with LightDM when the login form is submitted. */
		document.getElementById('login-form').addEventListener('submit', function(e) {
			e.preventDefault();
			window.provide_secret();
		});

		/* Tell LightDM to shut down when the shutdown button is clicked. */
		document.getElementById('shutdown').addEventListener('click', function(e) {
			e.preventDefault();
			show_message('Goodbye');
			lightdm.shutdown();
		});

		/* Tell LightDM to reboot when the reboot button is clicked. */
		document.getElementById('reboot').addEventListener('click', function(e) {
			e.preventDefault();
			show_message('See you soon');
			lightdm.restart();
		});

		/* Tell LightDM to sleep when the sleep button is clicked. */
		document.getElementById('sleep').addEventListener('click', function(e) {
			e.preventDefault();
			show_message('Goodnight');
			lightdm.suspend();
		});

		/**
		 * Register keypress handlers.
		 */
		window.onkeydown = function(e) {
			var key = (e.key ? e.key : e.keyCode);
			var new_user_index;

			if (key == 38) {        // Up
				// Select the previous user in the list
				new_user_index = ((current_user_index - 1) + user_count);
				new_user_index = new_user_index % user_count;
				select_user_from_list(new_user_index);
			} else if (key == 40) { // Down
				// Select the next user in the list
				new_user_index = (current_user_index + 1) % lightdm.num_users;
				select_user_from_list(new_user_index);
			}
		};
	};

	return {
		init: init
	};
} (lightdm));

/* Initialize the theme. */
login.init();
