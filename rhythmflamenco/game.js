const MUSIC = 'res/2AiresChoqueros.ogg'
const DIRECTION = {TOP: 38, LEFT: 37, RIGHT: 39, BOTTOM: 40}; // arrows key code

class Slot extends SimpleRectCollider{
	constructor(x, y, direction){
		super(x + 25, y + 25, 25, 25);
		this.sprite = new Sprite(Ramu.Utils.getImage('res/slot.png'), x, y, 50, 50);
		this.sprite.drawPriority = 1;
		this.tag = 'slot';
	}
}

class Arrow extends Sprite{
	constructor(img, y, direction){
		super(img, Ramu.width/2 - 25, y, 50, 50);
		this.direction = direction;
		this.tag = 'arrow sprite';
		this.canDestroy = false;
		this.drawPriority = 2;
	}
	
	static instantiate(){
		let img, isRight = false, isBottom = false;	
		let keyCode = [38, 37, 39, 40];
		let direction = keyCode[parseInt(Math.random() * keyCode.length)];		
		
		switch (direction){
			case DIRECTION.TOP:
				img = Ramu.Utils.getImage('res/arrow_up.png');
				break;
			case DIRECTION.LEFT:
				img = Ramu.Utils.getImage('res/arrow_left.png');
				break;
			case DIRECTION.RIGHT:
				img = Ramu.Utils.getImage('res/arrow_left.png');
				isRight = true;
				break;
			case DIRECTION.BOTTOM:
				img = Ramu.Utils.getImage('res/arrow_up.png');
				isBottom = true;
		}
		
		let arrow = new Arrow(img, -51, direction);
		arrow.flipHorizontally = isRight;
		arrow.flipVertically = isBottom;
		
		return arrow;
	}
	
	start(){
		this.collisor = new SimpleRectCollider(this.x + 25, this.y - 25, 25, 25);
		this.collisor.direction = this.direction;
		this.collisor.parent = this;
		this.collisor.tag = 'arrow';
	}
	
	update(){
		this.y += 50 * Ramu.time.delta;
		
		if (this.y > 0)
			this.canCallDestroy = true; // not to conflict with canDestroy that would stop the execution of the update.
		
		this.collisor.y = this.y + 25;
		
		if (this.canCallDestroy && Ramu.Utils.isOutOfCanvas(this)){
			game.missPoints++;
			this.destroy();
		}
	}
	
	destroy(){
		super.destroy();
		this.collisor.destroy();
	}
}

class Game extends GameObj{
	start(){
		this.slot = new Slot(Ramu.width/2 - 25, Ramu.height - 100);
		//  is in img folderbecause is used by other scripts too
		this.hitParticle = new SimpleParticle(Ramu.Utils.getImage("../img/particleblue.png"), new Rect(Ramu.width/2 , Ramu.height - 75, 1, 1), 1, 500); 
		// this.hitParticle.setDrawPriority(2);
		
		this.missParticle = new SimpleParticle(Ramu.Utils.getImage("res/particlered.png"), new Rect(Ramu.width/2 , Ramu.height - 75, 1, 1), 1, 500);
		this.started = false;
		this.gameEnd = false;
		
		this.startText = new Ramu.Text("Press 'space' to start", Ramu.width/2 - 50, Ramu.height/2, 300);
		this.startText.fillStyle = 'white';
		this.infodump = new Ramu.Text("Play using the 'arrows'. Hermes Passer, in 2018-06-22", 1, 20, 300);
		this.infodump.fillStyle = 'white';
		this.score = new Ramu.Text('', 1, 40, 300);
		this.score.fillStyle = 'white';
		
		this.timeToInstantiate = 2;
		this.currentTimeToInstantiate = 0;
		this.timeToReload = 14;
		this.currentTimeToReload = 0;	
		
		this.audio = new Ramu.Audio(MUSIC);
		this.setRules();
		
		this.hitPoints = 0;
		this.missPoints = 0;
	}
	
	setRules(){
		// Game end
		this.audio.onAudioEnd = function() {
			game.started = false;
			game.gameEnd = true;
			game.startText.text = 'game end, press \'space\' to reload';
			game.startText.canDraw = true;
		}
		
		// Add point when pressed the correct key while the arrow is in the slot
		this.slot.onCollision = function(){
			let obj = this.collision[this.collision.length - 1];
			let objKey = obj.direction;
			
			if (objKey in Ramu.lastKeysPressed){ // pressed the correct key
				game.hitPoints++;
				obj.parent.destroy();
				game.hitParticle.init();
			} else if (!Ramu.Utils.isEmpty(Ramu.lastKeysPressed)){ // pressed the wrong key (do nothing if none key is pressed)
				game.missPoints++;
				game.missParticle.init();
			}
			
			Ramu.lastKeysPressed = {}; // mais uma vez, criar uma func pra isso.
		}
	}
	
	update(){
		this.score.text = 'HIT: ' + this.hitPoints + " | MISSED: " + this.missPoints;
		
		if (!this.started && !this.gameEnd && keyCode.space in Ramu.pressedKeys){
			this.started = true;
			this.startText.canDraw = false;
			this.audio.play();
		}
		
		// To not show the reload text before the last arrow move until the end of screen
		if (this.gameEnd){
			if (this.currentTimeToReload >= this.timeToReload && keyCode.space in Ramu.pressedKeys)
				location.reload();
			this.currentTimeToReload += Ramu.time.delta;	
		}
		
		if (!this.started)
			return;
		
		if (this.currentTimeToInstantiate >= this.timeToInstantiate){
			this.currentTimeToInstantiate = 0;
			Arrow.instantiate();
		}
		
		this.currentTimeToInstantiate += Ramu.time.delta;	
	}
}

Ramu.init(500, 500); 
var game = new Game();
