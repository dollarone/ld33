var PlatformerGame = PlatformerGame || {};

PlatformerGame.Preload = function(){};

PlatformerGame.Preload.prototype = {

    preload: function() {
        // show preloadingbar
        this.preloadingbar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadingbar');
        this.preloadingbar.anchor.setTo(0.5);

        this.load.setPreloadSprite(this.preloadingbar);

        // load game assets:
        this.load.tilemap('level1', 'assets/tilemaps/level1.json', null, Phaser.Tilemap.TILED_JSON);   
        this.game.load.image('player', 'assets/images/player.png');
        this.game.load.image('sky', 'assets/images/sky.png');
        this.game.load.image('ground', 'assets/images/ground.png');
        this.game.load.image('platform', 'assets/images/platform.png');
        this.game.load.image('coin', 'assets/images/coin.png');
    },

    create: function() {
        this.state.start('Game');
    }
};