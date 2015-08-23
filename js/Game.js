var PlatformerGame = PlatformerGame || {};

PlatformerGame.Game = function(){};

PlatformerGame.Game.prototype = {


    create: function() {

        
        this.sky = this.game.add.sprite(0, 0, 'sky');
        this.sky.scale.setTo(64 * 16, 32 * 16);

        this.map = this.game.add.tilemap('level1');

        this.map.addTilesetImage('ground', 'gameTiles');

        //this.blockedLayer = this.map.createLayer('objectLayer');
        this.blockedLayer = this.map.createLayer('blockedLayer');

        this.map.setCollisionBetween(1, 100000, true, 'blockedLayer');

        //this.blockedLayer.body.immovable = true;
        this.blockedLayer.resizeWorld();

        this.playerCanJump = true;

        this.corpses = this.game.add.group();
        this.ghosts = this.game.add.group();
        this.ghostsCounters = new Array(30);

        this.ghostSpeedSlow = 20;
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
        var result = this.findObjectsByType('playerStart', this.map, 'objectsLayer');
        this.player = this.game.add.sprite(result[0].x, result[0].y, 'player'); //32, this.game.world.height - 150
        //this.player.anchor.set(0.5);
        this.player.smoothed = false;
        this.game.physics.arcade.enable(this.player); // player now affected by physics. SCIENCE!
        this.game.camera.follow(this.player);

        this.lastTile = this.player;

        this.game.physics.arcade.gravity.y = 300;

        this.player.body.bounce.y = 0.3;
        //this.player.body.gravity.y = 300;
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
        this.scoreText.fixedToCamera = true;

        // add controls
        this.cursors = this.game.input.keyboard.createCursorKeys();

        this.createItems();
        this.createCreatures();
        this.ghosts = this.game.add.group();

        this.playerMaxHealth = 3;
        this.playerHealth = this.playerMaxHealth;

        this.star = this.game.add.sprite(0, 0 , 'objects');
        this.star.frame = 7;
        this.star.visible = false;
        this.star.animations.add('blink', [7,8,15], 10, false);
        
        this.hearts = this.game.add.group();
        for(var i=0; i<5; i++) {

            var heart = this.game.add.sprite(2 + (18*i), 2, 'objects');
            if (this.playerMaxHealth > i) {
                heart.frame = 4;
            }
            else {
                heart.frame = 15;
            }

            this.hearts.add(heart);

        }
        this.hearts.fixedToCamera = true;
        this.noPain = 0;

    },

    update: function() {

        // collisions! player with platforms; coins with platforms
        this.game.physics.arcade.collide(this.player, this.blockedLayer, this.resetJump, null, this);
        this.game.physics.arcade.collide(this.items, this.blockedLayer);
        this.game.physics.arcade.collide(this.creatures, this.blockedLayer);
        //this.game.physics.arcade.collide(this.player, this.ghosts);

        this.corpses.forEach(function(corpse) {
            this.game.physics.arcade.collide(this.player, corpse, this.resetJumpUnconditionally, null, this);
            this.game.physics.arcade.collide(corpse, this.blockedLayer);
            this.game.physics.arcade.collide(corpse, this.corpses);
            this.game.physics.arcade.collide(corpse, this.creatures, this.corpseCreatureCollision, null, this);
        }, this);

        this.ghosts.forEach(function(ghost) {
            this.game.physics.arcade.overlap(this.player, ghost, this.ghostCollision, this.ghostIsNotSpawning, this);
        }, this);

        this.game.physics.arcade.overlap(this.player, this.items, this.collect, null, this);
        this.game.physics.arcade.overlap(this.player, this.creatures, this.creatureCollision, null, this);
        //this.game.physics.arcade.overlap(this.player, this.ghosts, this.ghostCollision, null, this);
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

        // for some strange reason, standing on corpses give you a volocity of 6.02 
        // for some strange reason, standing on 2 corpses give you a volocity of 12.04
        if (this.player.body.velocity.y > 13) {
            this.playerCanJump = false;
        }

        // jump
        if (this.cursors.up.isDown && this.playerCanJump) { // this.player.body.blocked.down //this.playerCanJump) { //} && this.player.body.touching.down) {
            this.player.body.velocity.y = -192;
            this.playerCanJump = false;
        }

        //this.game.debug.body(this.player, 'rgba(255, 255, 0, 0.5)');
        //this.game.debug.body(this.lastTile, 'rgba(255, 255, 255, 0.4)');

        if (!this.playerCanTakeDamage()) {
            this.noPain -= 1;
        }
        this.score = this.noPain;
        this.scoreText.text = 'Score: ' + this.score;
        console.log(this.playerCanJump + " speed: " + this.player.body.velocity.y);
        this.ghosts.forEach(function(ghost) {
            this.updateGhost(ghost);
        }, this);
    },

    collectCoin: function(player, coin) {

        coin.kill();
        this.score += 100;
        this.scoreText.text = 'Score: ' + this.score;
    },

    resetJump: function(player, tile) {

        if (this.player.body.blocked.down) {
            this.playerCanJump = true;
        
        }
    },

    resetJumpUnconditionally: function(player, tile) {

        this.playerCanJump = true;
    },


    createItems: function() {
        this.items = this.game.add.group();
        this.items.enableBody = true;
        
        result = this.findObjectsByType('item', this.map, 'objectsLayer');
        result.forEach(function(element) {
            this.createFromTiledObject(element, this.items);
        }, this);
    },

    createCreatures: function() {
        this.creatures = this.game.add.group();
        this.creatures.enableBody = true;
        
        result = this.findObjectsByType('creature', this.map, 'objectsLayer');
        result.forEach(function(element) {
            this.createFromTiledObject(element, this.creatures);
        }, this);
    },

    // find objects in a tiled layer that contains a property called "type" equal to a value
    findObjectsByType: function(type, map, layer) {
        var result = new Array();
        map.objects[layer].forEach(function(element) {
            if (element.properties.type === type) {
                // phaser uses top left - tiled bottom left so need to adjust:
                element.y -= map.tileHeight;
                result.push(element);
            }
        });
        return result;
    },

    createFromTiledObject: function(element, group) {
        var sprite = group.create(element.x, element.y, 'objects');
        sprite.frame = parseInt(element.properties.frame);

        // copy all of the sprite's properties
        Object.keys(element.properties).forEach(function(key) {
            sprite[key] = element.properties[key];
        });
    },

    collect: function(player, collectable) {
        switch (collectable.frame) {
            case 6: // heart
                if (this.playerHealth < this.playerMaxHealth) {
                    this.hearts.getAt(this.playerHealth).frame = 4;
                    this.playerHealth += 1;
                }
        }
        collectable.destroy();

    },

    creatureCollision: function(player, creature) {
        if (creature.body.touching.up && player.body.touching.down) {
            player.body.velocity.y *= -0.5;
            this.playerCanJump = true;
            //creature.frame = creature.frame + 1;
            this.createCorpse(creature);
            creature.destroy();
        }
        else {
            this.loseLife(1);
            
        }
    },

    loseLife: function(amount) {
        if (this.playerCanTakeDamage())
        {
            this.noPain = 60;
            this.playerHealth -= amount;
            this.hearts.getAt(this.playerHealth).frame = 5;
            if (this.playerHealth <= 0) {
               this.playerDied();
           }
        }
    },

    playerCanTakeDamage: function(player, thing) {
        return (this.noPain === 0);
    },

    playerDied: function() {
        console.log("death is always an option");

    },

    createCorpse: function(creature) {
  //      var ghost = this.map.objects['blockedLayer'].create(creature.x, creature.y, 'objects');
        var corpse = this.corpses.create(creature.x, creature.y + 10, 'objects');
        corpse.frame = creature.frame + 1;
        this.game.physics.arcade.enable(corpse);
        corpse.body.y += 10;
        corpse.body.drag.setTo(100);
        //ghost.body.mass = 10;
  //      ghost.body.gravity.y = 300;
        
        corpse.body.setSize(16, 6);
        //this.game.physics.arcade.enable(ghost); 

        this.star.y = creature.y - 2;
        this.star.x = creature.x - 2;
        this.star.visible = true;
        this.star.animations.play('blink');

        this.spawnGhost(creature);
  
    },

    spawnGhost: function(creature) {

        var ghost = this.ghosts.create(creature.x, creature.y, 'objects');
        this.game.physics.arcade.enable(ghost);
        ghost.frame = creature.frame + 2;
        ghost.alpha = 1;
        console.log("index: " + this.ghosts.getChildIndex(ghost));
        this.ghostsCounters[this.ghosts.getChildIndex(ghost)] = 100;
        console.log("c: " + this.ghostsCounters[0]);
        
        ghost.body.gravity.y = -300;
    },

    updateGhost: function(ghost) {

        //console.log("index2: " + this.ghosts.getChildIndex(ghost));
        //console.log("2c: " + this.ghostsCounters[0]);


        var counter = this.ghostsCounters[this.ghosts.getChildIndex(ghost)];
        if (counter == 0) {
            if (this.player.x > ghost.x) {
                //ghost.x += this.ghostSpeed('slow');
                ghost.body.velocity.x = this.ghostSpeedSlow;
            }
            else if (this.player.x < ghost.x) {
                ghost.body.velocity.x = -this.ghostSpeedSlow;
                //ghost.x -= this.ghostSpeed('slow');
            }
            if (this.player.y > ghost.y) {
                ghost.body.velocity.y = this.ghostSpeedSlow;
                //ghost.y += this.ghostSpeed('slow');
            }
            else if (this.player.y < ghost.y) {
                ghost.body.velocity.y = -this.ghostSpeedSlow;
                //ghost.y -= this.ghostSpeed('slow');
            }
            //this.player.body.velocity.y = -192;
        }
        else if (counter == 1) {
            this.ghostsCounters[this.ghosts.getChildIndex(ghost)] = counter - 1;

        }
        else if (counter > 1) {
            this.ghostsCounters[this.ghosts.getChildIndex(ghost)] = counter - 1;
            ghost.alpha = (100-counter) / 100;
        }



    },

    ghostSpeed: function(type) {
        if (type === 'slow') {
            var max = 0.7;
            var min = 0.2;
            //return Math.random() * (max - min) + min;
            return 0.4;
        }
    },

    ghostCollision: function(player, ghost) {
        ghost.destroy();
        this.loseLife(1);
    },

    ghostIsNotSpawning: function(player, ghost) {
        return this.ghostsCounters[this.ghosts.getChildIndex(ghost)] == 0;
    },

    corpseCreatureCollision: function(corpse, creature) {
        if (creature.body.touching.up && corpse.body.touching.down) {
            this.createCorpse(creature);
            creature.destroy();
        }
    }
};