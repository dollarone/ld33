var PlatformerGame = PlatformerGame || {};

PlatformerGame.Boot = function(){};

PlatformerGame.Boot.prototype = {

    preload: function() {
        this.load.image('preloadingbar', 'assets/images/preloadingbar.png');
    },

    create: function() {
        this.game.stage.backgroundColor = '#000'; // black

        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;

        this.scale.setScreenSize(true); // set automatically

        this.game.stage.smoothed = false;


        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.state.start('Preload');
    }
};