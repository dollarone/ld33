var PlatformerGame = PlatformerGame || {};

PlatformerGame.Game = function(){};

PlatformerGame.Game.prototype = {


    create: function() {

        this.map = this.game.add.tilemap('level1');

        this.map.addTilesetImage('ground', 'gameTiles');

        this.blockedLayer = this.map.createLayer('blockedLayer');
        
        this.map.setCollisionBetween(1, 100000, true, 'blockedLayer');

        //this.blockedLayer.body.immovable = true;
        this.blockedLayer.resizeWorld();

        this.playerCanJump = true;
/*
        this.game.add.sprite(0, 0, 'sky');
/*
        this.platforms = this.game.add.group();
        this.platforms.enableBody = true;

        this.ground = this.platforms.create(0, this.game.world.height - 64, 'ground');
        this.ground.body.immovable = true; // player can now stand on it

        this.ledge = this.platforms.create(0, 32, 'platform');
        this.ledge.body.immovable = true;

        this.ledge = this.platforms.create(32, 32, 'platform');
        this.ledge.body.immovable = true;
*/
        this.player = this.game.add.sprite(32, this.game.world.height - 150, 'player');
        this.player.anchor.set(0.5);
        this.player.smoothed = false;

        this.lastTile = this.player;

        this.game.physics.arcade.enable(this.player); // player now affected by physics. SCIENCE!
        this.game.camera.follow(this.player);

        this.player.body.bounce.y = 0.3;
        this.player.body.gravity.y = 300;
        this.player.body.collideWorldBounds = false;

        // animations
        this.player.animations.add('left', [0], 10, true);
        this.player.animations.add('right', [0], 10, true);
/*
        this.coins = this.game.add.group();

        this.coins.enableBody = true;

        // create some coins
        for (var i = 0; i < 10; i++) {
            var coin = this.coins.create(i * 32, 0, 'coin');

            coin.body.gravity.y = 300; // coins can fall down
            coin.body.bounce.y = 0.3;
        }
        */
        // add a score text
        this.scoreText = this.game.add.text(90, 0, 'Score: 0', { fontSize: '32px', fill: '#000'});
        this.score = 0;

        // add controls
        this.cursors = this.game.input.keyboard.createCursorKeys();

    },

    update: function() {

        // collisions! player with platforms; coins with platforms
        this.game.physics.arcade.collide(this.player, this.blockedLayer, this.resetJump, null, this);
        this.game.physics.arcade.collide(this.player, this.platforms);
        //this.game.physics.arcade.collide(this.coins,  this.platforms);


        // if player overlaps a coin, call the collectCoin function
//        this.game.physics.arcade.overlap(this.player, this.coins, this.collectCoin, null, this);

        // reset the players velocity 
        this.player.body.velocity.x = 0;

        if (this.cursors.left.isDown) {
            this.player.body.velocity.x = -64;
            this.player.animations.play('left');
        }
        else if (this.cursors.right.isDown) {
            this.player.body.velocity.x = 64;
            this.player.animations.play('right');
        }
        else { // stand still
            this.player.animations.stop();
            this.player.frame = 0;
        }

        // jump
        if (this.cursors.up.isDown && this.playerCanJump) { // this.player.body.blocked.down //this.playerCanJump) { //} && this.player.body.touching.down) {
            this.player.body.velocity.y = -192;
            this.playerCanJump = false;
        }

        this.game.debug.body(this.player, 'rgba(255, 255, 0, 0.5)');
        this.game.debug.body(this.lastTile, 'rgba(255, 255, 255, 0.4)');
    },

    collectCoin: function(player, coin) {

        coin.kill();
        this.score += 100;
        this.scoreText.text = 'Score: ' + this.score;
    },

    resetJump: function(player, tile) {

        if (this.player.body.blocked.down) {
            this.playerCanJump = true;
    },
/*        console.log('collison');
        console.log(player);
        console.log(tile);
        console.log(this.lastTile);

        this.lastTile = tile;
        this.lastTile.debug = true;
        this.lastTile.dirty = true;
        this.map.dirty = true;
        this.map.setLayer(this.blockedLayer);
        if(player.y > tile.y) {
            //this.playerCanJump = true;
        }
        */
    }
};