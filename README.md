tiny-button-cooldown
====================

A simple JavaScript library for adding animated cooldowns to buttons

Simple example usage:

    var basicCooldownExample = new Cooldown({
        padding: 10,          // amount of padding to add to each button
        buttons: $('button'), // list of buttons to apply cooldowns to
        length: 1,            // length of cooldown (1 second)
        autoSetupAll: true    // do the rest of the work automatically
    });
