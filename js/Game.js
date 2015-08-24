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
        //this.foregroundLayer = this.map.createLayer('foregroundLayer');

        this.map.setCollisionBetween(1, 100000, true, 'blockedLayer');

        //this.blockedLayer.body.immovable = true;
        this.blockedLayer.resizeWorld();

        this.playerCanJump = true;

        this.corpses = this.game.add.group();
        this.ghosts = this.game.add.group();
        this.ghostsCounters = new Array(30);

        this.ghostSpeedSlow = 20;
        this.ghostSpeedBoss = 40;
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
        this.player = this.game.add.sprite(result[0].x, result[0].y, 'objects'); //32, this.game.world.height - 150

        //this.player.anchor.set(0.5);
        //this.player.smoothed = false;
        this.game.physics.arcade.enable(this.player); // player now affected by physics. SCIENCE!
        this.game.camera.follow(this.player);

        this.lastTile = this.player;

        this.game.physics.arcade.gravity.y = 300;

        this.player.body.bounce.y = 0.3;
        //this.player.body.gravity.y = 300;
        this.player.body.collideWorldBounds = false;

/*
        var i = 0; //16*8;
        this.water_1.forEach(function(sprite) {
            //sprite.animations.add('wave', [16*8+0, 16*8+1, 16*8+ 2, 16*8+ 3, 16*8+ 4, 16*8+ 5, 16*8+ 6, 16*8+ 7,
            // 16*8+8, 16*8+9, 16*8+10, 16*8+11, 16*8+12, 16*8+13, 16*8+14, 16*8+15], 10, true);
            //sprite.animations.play('wave');
            sprite.animations.currentAnim.setFrame(16*8+i, true);
            i += 4;
        }, this);
*/
        // animations
        this.player.animations.add('left', [0], 10, true);
        this.player.animations.add('right', [0], 10, true);
        this.player.animations.add('blink', [0,15,0,15,0,15,0,15,0], 9, false);
        // [0,1,2,3,4,5,6,7,8,9,10,0,15], 1, false); //
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


        // add controls
        this.cursors = this.game.input.keyboard.createCursorKeys();

        this.createItems();
        this.createCreatures();
        this.creatures.add(this.boss);

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
        this.time = 100;
  /*      this.water_1.animations.play('wave');/*
        this.water2.animations.play('wave_2');
        this.water3.animations.play('wave_3');
        this.water4.animations.play('wave_4');*/



        this.water_1 = this.game.add.group();
        this.water_1.create(26 * 16, 28 * 16, 'tiles');
        this.water_1.create(27 * 16, 28 * 16, 'tiles');
        this.water_1.create(28 * 16, 28 * 16, 'tiles');
        this.water_1.create(29 * 16, 28 * 16, 'tiles');
        this.water_1.create(30 * 16, 28 * 16, 'tiles');
        this.water_1.create(31 * 16, 28 * 16, 'tiles');
        
        this.water_2 = this.game.add.group();
        this.water_2.create(26 * 16, 29 * 16, 'tiles');
        this.water_2.create(27 * 16, 29 * 16, 'tiles');
        this.water_2.create(28 * 16, 29 * 16, 'tiles');
        this.water_2.create(29 * 16, 29 * 16, 'tiles');
        this.water_2.create(30 * 16, 29 * 16, 'tiles');
        this.water_2.create(31 * 16, 29 * 16, 'tiles');

        this.water_3 = this.game.add.group();
        this.water_3.create(26 * 16, 30 * 16, 'tiles');
        this.water_3.create(27 * 16, 30 * 16, 'tiles');
        this.water_3.create(28 * 16, 30 * 16, 'tiles');
        this.water_3.create(29 * 16, 30 * 16, 'tiles');
        this.water_3.create(30 * 16, 30 * 16, 'tiles');
        this.water_3.create(31 * 16, 30 * 16, 'tiles');

        this.water_4 = this.game.add.group();
        this.water_4.create(26 * 16, 31 * 16, 'tiles');
        this.water_4.create(27 * 16, 31 * 16, 'tiles');
        this.water_4.create(28 * 16, 31 * 16, 'tiles');
        this.water_4.create(29 * 16, 31 * 16, 'tiles');
        this.water_4.create(30 * 16, 31 * 16, 'tiles');
        this.water_4.create(31 * 16, 31 * 16, 'tiles');

        var row = 8;
        //this.water_1.callAll('animations.add', 'animations', 'wave', [16*8+0, 16*8+1, 16*8+ 2, 16*8+ 3, 16*8+ 4, 16*8+ 5, 16*8+ 6, 16*8+ 7,
        //     16*8+8, 16*8+9, 16*8+10, 16*8+11, 16*8+12, 16*8+13, 16*8+14, 16*8+15], 10, true);
        this.water_1.callAll('animations.add', 'animations', 'wave', [16*row+0, 16*row+1, 16*row+2, 16*row+3, 16*row+4, 16*row+5, 16*row+6, 16*row+7,
             16*row+8, 16*row+9, 16*row+10, 16*row+11, 16*row+12, 16*row+13, 16*row+14, 16*row+15], 10, true);
        this.water_1.callAll('play', null, 'wave');
        var i = 16*row;
        this.water_1.forEach(function(sprite) {
            sprite.animations.currentAnim.setFrame(i, true);
            i += 2;
        }, this);

        row += 1;
        this.water_2.callAll('animations.add', 'animations', 'wave', [16*row+0, 16*row+1, 16*row+2, 16*row+3, 16*row+4, 16*row+5, 16*row+6, 16*row+7,
             16*row+8, 16*row+9, 16*row+10, 16*row+11, 16*row+12, 16*row+13, 16*row+14, 16*row+15], 10, true);
        this.water_2.callAll('play', null, 'wave');
        i = 16*row;
        this.water_2.forEach(function(sprite) {
            sprite.animations.currentAnim.setFrame(i, true);
            i += 4;
        }, this);

        row += 1;
        this.water_3.callAll('animations.add', 'animations', 'wave', [16*row+0, 16*row+1, 16*row+2, 16*row+3, 16*row+4, 16*row+5, 16*row+6, 16*row+7,
             16*row+8, 16*row+9, 16*row+10, 16*row+11, 16*row+12, 16*row+13, 16*row+14, 16*row+15], 10, true);
        this.water_3.callAll('play', null, 'wave');
        i = 16*row;
        this.water_3.forEach(function(sprite) {
            sprite.animations.currentAnim.setFrame(i, true);
            i += 4;
        }, this);


        row += 1;
        this.water_4.callAll('animations.add', 'animations', 'wave', [16*row+0, 16*row+1, 16*row+2, 16*row+3, 16*row+4, 16*row+5, 16*row+6, 16*row+7,
             16*row+8, 16*row+9, 16*row+10, 16*row+11, 16*row+12, 16*row+13, 16*row+14, 16*row+15], 10, true);
        this.water_4.callAll('play', null, 'wave');
        i = 16*row;
        this.water_4.forEach(function(sprite) {
            sprite.animations.currentAnim.setFrame(i, true);
            i += 4;
        }, this);

        this.ghosts = this.game.add.group();


        // add a score text
        this.scoreText = this.game.add.text(40, 20, 'The Frog King\nand his minions\nhave invaded\nyour country!', { fontSize: '16px', fill: '#000'});
        this.score = 0;
        this.scoreText.fixedToCamera = true;
        this.scoreText.visible = true;        

        // add an info text
        this.infoText = this.game.add.text(43, 85, 'Game Over', { fontSize: '32px', fill: '#000'});
        this.infoText.fixedToCamera = true;
        this.infoText.visible = false;
        this.gameOver = 0;

        this.music = this.game.add.audio('theme');
        this.sound_crunch = this.game.add.audio('crunch');
        this.sound_ghost1 = this.game.add.audio('ghost1');
        this.sound_ghost2 = this.game.add.audio('ghost2');
        this.sound_ghost3 = this.game.add.audio('ghost3');
        this.sound_ghost4 = this.game.add.audio('ghost4');
        this.sound_ghost5 = this.game.add.audio('ghost5');
        this.sound_death1 = this.game.add.audio('death1');
        this.sound_death2 = this.game.add.audio('death2');
        this.sound_ouch1  = this.game.add.audio('ouch1');
        this.sound_ouch2  = this.game.add.audio('ouch2');
        this.sound_ouch3  = this.game.add.audio('ouch3');
        this.sound_ouch4  = this.game.add.audio('ouch4');
        this.sound_ouch5  = this.game.add.audio('ouch5');
        this.sound_ooh1   = this.game.add.audio('ooh1');
        this.sound_ooh2   = this.game.add.audio('ooh2');
        this.sound_ohyeah = this.game.add.audio('ohyeah');
        this.sound_frog1  = this.game.add.audio('frog1');
        this.sound_frog2  = this.game.add.audio('frog2');
        this.sound_frog3  = this.game.add.audio('frog3');
        this.sound_laugh  = this.game.add.audio('laugh');
        this.sound_bossfrog  = this.game.add.audio('boss-frog');
        this.sound_land  = this.game.add.audio('land');
        this.sound_land.volume = 0.5;
        this.music.loop = true;
        this.music.play();


    },

    update: function() {

        if (!this.player.inWorld) {
            this.loseLife(1);
            this.respawn();
        }

        if (this.gameOver == 1) {
            this.state.start('Preload');
        }

        if (this.gameOver > 0) {
            this.player.body.velocity.y = 10;
            this.player.body.velocity.x = 0;
            this.gameOver -= 1;
        }
        else {

            // collisions! player with platforms; coins with platforms
            this.game.physics.arcade.collide(this.player, this.blockedLayer, this.resetJump, null, this);
            this.game.physics.arcade.collide(this.items, this.blockedLayer);
            this.game.physics.arcade.collide(this.creatures, this.blockedLayer);
            this.game.physics.arcade.collide(this.creatures, this.creatures);
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
                if (this.playerCanTakeDamage()) {
                    this.player.animations.play('left');
                }
            }
            else if (this.cursors.right.isDown) {
                this.player.body.velocity.x = 64;
                if (this.playerCanTakeDamage()) {
                    this.player.animations.play('right');
                }
            }
            else { // stand still
                if (this.playerCanTakeDamage()) {
                    this.player.animations.stop();
                    this.player.frame = 0;
                }
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
            //this.score = this.noPain;
            //this.scoreText.text = 'Score: ' + this.score;
//            this.scoreText.visible = false;
            //console.log(this.playerCanJump + " speed: " + this.player.body.velocity.y);
            this.ghosts.forEach(function(ghost) {
                this.updateGhost(ghost);
            }, this);

            this.creatures.forEach(function(frog) { 
                this.frogMove(frog);
            }, this);
        }
    },








//-----------------------------------------------------------------------------------------------------------------








//-----------------------------------------------------------------------------------------------------------------



    collectCoin: function(player, coin) {

        coin.kill();
        this.score += 100;
        this.scoreText.text = 'Score: ' + this.score;
    },

    resetJump: function(player, tile) {
        
        if (!this.playerCanJump && this.player.body.blocked.down) {
            
            this.sound_land.play(); // sounds horrible
        }
        if (this.player.body.blocked.down) {
            this.playerCanJump = true;
        
        }
    },

    resetJumpUnconditionally: function(player, tile) {

        if (!this.playerCanJump) {
           this.sound_crunch.volume = 0.3;
           this.sound_crunch.play();// sounds horrible
           this.sound_land.play();
        }
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
        result = this.findObjectsByType('boss', this.map, 'objectsLayer');
        this.boss = this.creatures.create(result[0].x, result[0].y, 'objects');
        this.boss.scale.setTo(4, 4);
        this.boss.y -= 48;
        this.boss.frame = 1;
        this.boss['type'] = 'boss';
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
                this.playRandomOohSound();
                break;
            case 9: // gold heart
                this.hearts.getAt(this.playerMaxHealth).frame = 5;
                this.playerMaxHealth += 1;
                if (this.playerHealth < this.playerMaxHealth) {
                    this.hearts.getAt(this.playerHealth).frame = 4;
                    this.playerHealth += 1;
                }
                this.sound_ohyeah.play();
                break;
        }
        collectable.destroy();

    },

    creatureCollision: function(player, creature) {
        if (creature.body.touching.up && player.body.touching.down) {
            this.sound_crunch.volume = 0.9;
            this.sound_crunch.play();
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
        if (this.playerCanTakeDamage() && this.playerHealth > 0)
        {
            this.noPain = 50;
            this.player.animations.play('blink');
            this.playerHealth -= amount;
            this.hearts.getAt(this.playerHealth).frame = 5;
            if (this.playerHealth <= 0) {
               this.playerDied();
               this.playRandomDeathSound();
           }
           else {
                this.playRandomOuchSound();
           }
        }
    },

    playerCanTakeDamage: function(player, thing) {
        return (this.noPain === 0);
    },

    playerDied: function() {
        //console.log("death is always an option");
        this.infoText.visible = true;
        this.gameOver = 300;
        this.music.stop();

        // respawn all creatures etc



    },

    respawn: function() {
        var result = this.findObjectsByType('playerStart', this.map, 'objectsLayer');
        this.player.x = result[0].x;
        this.player.y = result[0].y;
        this.inPain = 120;
        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;
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
        //console.log("index: " + this.ghosts.getChildIndex(ghost));
        this.ghostsCounters[this.ghosts.getChildIndex(ghost)] = 100;
        //console.log("c: " + this.ghostsCounters[0]);
        
        ghost.body.gravity.y = -300;
        if (creature['type'] == 'boss') {
            ghost['type'] = 'boss';
        }

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
            this.playRandomGhostSound();

        }
        else if (counter > 1) {
            this.ghostsCounters[this.ghosts.getChildIndex(ghost)] = counter - 1;
            ghost.alpha = (100-counter) / 100;
        }        

    },

    playRandomGhostSound: function() {
        switch(this.game.rnd.integerInRange(1, 5)) {
            case 1: 
                this.sound_ghost1.volume = 0.7;
                this.sound_ghost1.play();
                break;
            case 2: 
                this.sound_ghost2.play();
                break;
            case 3: 
                this.sound_ghost3.play();
                break;
            case 4: 
                this.sound_ghost4.play();
                break;
            default:
                this.sound_ghost5.play();
                break;
        }
    },

    playRandomOuchSound: function() {
        switch(this.game.rnd.integerInRange(1, 5)) {
            case 1: 
                this.sound_ouch1.play();
                break;
            case 2: 
                this.sound_ouch2.play();
                break;
            case 3: 
                this.sound_ouch3.play();
                break;
            case 4: 
                this.sound_ouch4.play();
                break;
            default:
                this.sound_ouch5.play();
                break;
        }
    },
    
    playRandomDeathSound: function() {
        switch(this.game.rnd.integerInRange(1, 2)) {
            case 1: 
                this.sound_death1.play();
                break;
            default:
                this.sound_death2.play();
                break;
        }
    },


    playRandomOohSound: function() {
        switch(this.game.rnd.integerInRange(1, 2)) {
            case 1: 
                this.sound_ooh1.play();
                break;
            default:
                this.sound_ooh2.play();
                break;
        }
    },

    playRandomFrogSound: function() {
        switch(this.game.rnd.integerInRange(1, 3)) {
            case 1: 
                this.sound_frog1.play();
                break;
            case 1: 
                this.sound_frog2.play();
                break;
            default:
                this.sound_frog3.play();
                break;
        }
    },


    ghostCollision: function(player, ghost) {
        ghost.destroy();
        if (ghost['type'] == 'boss') {
            this.endGame();
        }
        else {
            this.loseLife(1);
        }
    },

    endGame: function() {

        this.scoreText.text = "The Frog King's ghost\ntells you each frog\nyou killed...\nwas one of your friends.\nTurns out...\nYou are the Monster!";
        this.scoreText.visible = true;
        this.sound_laugh.play();

    },

    ghostIsNotSpawning: function(player, ghost) {
        return this.ghostsCounters[this.ghosts.getChildIndex(ghost)] == 0;
    },

    corpseCreatureCollision: function(corpse, creature) {
        if (creature.body.touching.up && corpse.body.touching.down) {
            this.sound_crunch.volume = 1.2;
            this.sound_crunch.play();
            this.createCorpse(creature);
            creature.destroy();            
        }
    },

    distanceBetweenTwoPoints: function(a, b) {
        var xs = b.x - a.x;
        xs = xs * xs;

        var ys = b.y - a.y;
        ys = ys * ys;

        return Math.sqrt(xs + ys);
    },

    frogMove: function(frog) {


        if (frog['type'] == 'boss') {
            if (this.distanceBetweenTwoPoints(frog, this.player) < 190 && this.player.y <= frog.y + 50) {

                if (this.game.rnd.integerInRange(1, 50) == 1) {
                    this.sound_bossfrog.play();
                }
                
            
                if (this.player.x > frog.x) {
                    //ghost.x += this.ghostSpeed('slow');
                    frog.body.velocity.x = this.ghostSpeedBoss;
                }
                else if (this.player.x < frog.x) {
                    frog.body.velocity.x = -this.ghostSpeedBoss;
                    //ghost.x -= this.ghostSpeed('slow');
                }

                if (this.game.rnd.integerInRange(0, 5) === 0 && frog.body.blocked.down) {
                    frog.body.velocity.y = -226; //this.ghostSpeedSlow;
                    
                }
           }
        }
        else {
            
            if (this.distanceBetweenTwoPoints(frog, this.player) < 80 && this.player.y <= frog.y + 10) {

                if (this.game.rnd.integerInRange(1, 80) == 1) {
                    this.playRandomFrogSound(); // ideally each frog should have 1 sound but whateves
                    this.scoreText.visible = false;
                }
                
            
                if (this.player.x > frog.x) {
                    //ghost.x += this.ghostSpeed('slow');
                    frog.body.velocity.x = this.ghostSpeedSlow;
                }
                else if (this.player.x < frog.x) {
                    frog.body.velocity.x = -this.ghostSpeedSlow;
                    //ghost.x -= this.ghostSpeed('slow');
                }

                if (this.game.rnd.integerInRange(0, 5) === 0 && frog.body.blocked.down) {
                    frog.body.velocity.y = -128; //this.ghostSpeedSlow;
                    
                }
           }
       }

    }

};