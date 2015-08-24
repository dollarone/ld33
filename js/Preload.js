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
        // this.game.load.image('player', 'assets/images/player.png');
        this.game.load.image('sky', 'assets/images/sky.png');
        this.game.load.image('gameTiles', 'assets/images/gameTiles.png');
        //this.game.load.image('platform', 'assets/images/platform.png');
        //this.game.load.image('coin', 'assets/images/coin.png');
        
        this.game.load.image('heart', 'assets/images/heart.png');
        this.game.load.spritesheet('objects', 'assets/images/objects.png', 16, 16, 16);
        this.game.load.spritesheet('tiles', 'assets/images/gameTiles.png', 16, 16, 16*16);

        this.game.load.audio('theme', 'assets/audio/theme.ogg');
        this.game.load.audio('ghost1', 'assets/audio/ghost1.ogg');
        this.game.load.audio('ghost2', 'assets/audio/ghost2.ogg');
        this.game.load.audio('ghost3', 'assets/audio/ghost3.ogg');
        this.game.load.audio('ghost4', 'assets/audio/ghost4.ogg');
        this.game.load.audio('ghost5', 'assets/audio/ghost5.ogg');
        this.game.load.audio('crunch', 'assets/audio/crunch.ogg');
        this.game.load.audio('frog1', 'assets/audio/frog1.ogg');
        this.game.load.audio('frog2', 'assets/audio/frog2.ogg');
        this.game.load.audio('frog3', 'assets/audio/frog3.ogg');
        this.game.load.audio('boss-frog', 'assets/audio/boss-frog.ogg');
        this.game.load.audio('effort', 'assets/audio/effort.ogg');
        this.game.load.audio('death1', 'assets/audio/death1.ogg');
        this.game.load.audio('death2', 'assets/audio/death2.ogg');
        this.game.load.audio('fall1', 'assets/audio/fall1.ogg');
        this.game.load.audio('fall2', 'assets/audio/fall2.ogg');
        this.game.load.audio('yawn', 'assets/audio/yawn.ogg');
        this.game.load.audio('whistle', 'assets/audio/whistle.ogg');
        this.game.load.audio('bettergetgoing', 'assets/audio/bettergetgoing.ogg');
        this.game.load.audio('hark', 'assets/audio/hark.ogg');
        this.game.load.audio('ffs', 'assets/audio/ffs.ogg');
        this.game.load.audio('ooh1', 'assets/audio/ooh1.ogg');
        this.game.load.audio('ooh2', 'assets/audio/ooh2.ogg');
        this.game.load.audio('laugh', 'assets/audio/laugh.ogg');
        this.game.load.audio('slam', 'assets/audio/slam.ogg');
        this.game.load.audio('ohyeah', 'assets/audio/ohyeah.ogg');
        this.game.load.audio('smooch', 'assets/audio/smooch.ogg');
        this.game.load.audio('land', 'assets/audio/land.ogg');
        this.game.load.audio('land_big', 'assets/audio/land_big.ogg');
        this.game.load.audio('ouch1', 'assets/audio/ouch1.ogg');
        this.game.load.audio('ouch2', 'assets/audio/ouch2.ogg');
        this.game.load.audio('ouch3', 'assets/audio/ouch3.ogg');
        this.game.load.audio('ouch4', 'assets/audio/ouch4.ogg');
        this.game.load.audio('ouch5', 'assets/audio/ouch5.ogg');
        },

    create: function() {
        this.state.start('Game');
    }
};