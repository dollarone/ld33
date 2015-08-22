var PlatformerGame = PlatformerGame || {};

PlatformerGame.game = new Phaser.Game(256, 224, Phaser.AUTO, '');

PlatformerGame.game.state.add('Boot', PlatformerGame.Boot);
PlatformerGame.game.state.add('Preload', PlatformerGame.Preload);
PlatformerGame.game.state.add('Game', PlatformerGame.Game);

PlatformerGame.game.state.start('Boot');