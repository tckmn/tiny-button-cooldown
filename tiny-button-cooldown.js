/*
 * Simple usage example:
 *   var c = new Cooldown({
 * 	   padding: 10,
 *     buttons: $('button'),
 *     autoSetup: true
 *   });
 */

function Cooldown(options) {
	if (!options.padding) options.padding = 0;
	options.buttons = $(options.buttons); // verify just in case
	
	for (x in options) {
		// call functions specified in constructor, if possible (ex. autoSetup: true)
		if (options[x] === true && typeof this[x] === 'function') this[x]();
		else {
			// proceed normally
			this[x] = options[x];
		}
	}
	
	this.initialize();
}
Cooldown.prototype.initialize = function() {
	this.setupButtons();
	if (this.toAutoSetupInInitialize) this._autoSetup();
};
Cooldown.prototype.setupButtons = function() {
	this.buttons.css({
		padding: this.padding + 'px',
		position: 'relative'
	});
};
Cooldown.prototype.autoSetup = function() { this.toAutoSetupInInitialize = true; };
Cooldown.prototype._autoSetup = function() {
	var cooldown = this;
	this.buttons.each(function() {
		// verify jQuery object first, just in case
		$(this).click(function() {
			cooldown.cooldown(this);
		}).append($('<div>')
			.text('\u00A0')
			.addClass('_tiny_button_cooldown_progress-bar')
			.css({
				position: 'absolute',
				top: '0px',
				left: '0px',
				backgroundColor: '#000', // TODO make customizable
				opacity: '0.5',
				width: '0px',
				height: '0px'
			}));
	});
};
Cooldown.prototype.cooldown = function($el, callback, length) {
	// validate element to cool down, make sure it's a jQuery object
	$el = $($el);
	
	// is there already a cooldown happening?
	if ($el.is('[disabled]')) return;
	
	// look everywhere we can to find a cooldown amount, and error out if there is none
	var cooldownAmount = length || $el.attr('data-cooldown') || this.length;
	if (!cooldownAmount) throw new Error('Error: cooldown: cannot find a cooldown length');
	
	// convert to number and handle decimals
	cooldownAmount += '';
	cooldownAmount = cooldownAmount.indexOf('.') > -1 ? parseFloat(cooldownAmount) : parseInt(cooldownAmount);
	
	// now, to add the cooldown!
	$el.attr('disabled', 'disabled');
	$('._tiny_button_cooldown_progress-bar', $el).css({
		height: ($el.height() + this.padding*2) + 'px',
		width: ($el.width() + this.padding*2) + 'px'
	}).animate({
		width: 0
	}, {
		duration: cooldownAmount * 1000,
		easing: 'linear',
		complete: function() {
			$el.removeAttr('disabled');
			if (callback) callback($el);
		}
	});
};