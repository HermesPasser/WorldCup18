const DIRECTION = {TOP: 0, LEFT: 1, RIGHT: 2, BOTTOM: 3};

class Entity extends Drawable{
	constructor(x, y, width, height, color = 'black'){
		super(x, y, width, height, true);
		this.color = color;
		this.collisor = new SimpleRectCollider(x, y, width, height);
		this.velocity = 70;
	}
	
	update(){
		this.collisor.x = this.x;
		this.collisor.y = this.y;
	}
	
	draw(){
		Ramu.ctx.fillStyle = this.color;
		Ramu.ctx.fillRect(this.x, this.y, this.width, this.height);
	}
	
	fixMove(){
		if (this.x < -50)
			this.x = Ramu.width;
		else if (this.x > Ramu.width)
			this.x = -51;

		if (this.y < -50) 
			this.y = Ramu.height;
		else if (this.y > Ramu.height) 
			this.y = -51;
	}
	
	force(){
		return this.velocity * Ramu.time.delta;
	}
	
	walkUp()   { this.y -= this.force(); this.fixMove(); }
	
	walkLeft() { this.x -= this.force(); this.fixMove(); }
	
	walkRight(){ this.x += this.force(); this.fixMove(); }
	
	walkDown() { this.y += this.force(); this.fixMove(); }
}

class Player extends Entity{
	constructor(x, y){
		super(x, y, 50, 50);
	}
	
	start(){
		this.tag = 'player';
		this.normalColor = 'yellow';
		this.inciteColor = 'red';
		this.collisor.tag = 'player collisor';
		this.color = this.normalColor;	
	}
	
	incite(){ this.color = this.inciteColor; }
	
	dissuade(){ this.color = this.normalColor; }

}

class Enemy extends Entity{
	constructor(x, y){
		super(x, y, 50, 50, 'brown');
		
		this.enemyBack = new Entity()
		this.collisorBack = new SimpleRectCollider(x, y + 25, 50, 25);
	}
	
	start(){
		this.angry = false;
		this.angryMultiplayer = 2.5;
		this.currentDirection = DIRECTION.TOP;
		this.timeToChangeDirection = 3;
		this.currentTimeDirection = 0;
		
		this.inDash = false;
		this.timeToEndDash = 1.5;
		this.currentTimeDash = this.timeToEndDash;
		
		this.collisor.height /= 2;
		this.collisor.tag = 'enemy head';
		this.collisorBack.tag = 'enemy back';
		this.velocity = 70;
	}
	
	update(){
		super.update();
		this.collisorBack.x = this.x;
		this.collisorBack.y = this.y + 25;
		this.ai();
	}
	
	drawBack(){
		Ramu.ctx.fillStyle = '#992828';
		Ramu.ctx.fillRect(this.x, this.y + 25, this.width, this.height / 2);
	}
	
	draw(){
		super.draw();
		this.drawBack();
	}
	
	force(){
		return this.angry ? super.force() * this.angryMultiplayer : super.force();	
	}
	
	ai(){
		if (this.angry)
			this.dash();
		 else
			this.LookAtRandomDirection();

		this.move();
	}

	dash(){
		// Start Dash
		if (!this.inDash){
			this.LookAtPlayerDirection();
			this.inDash = true;
		}
		
		this.currentTimeDash += Ramu.time.delta;
		if (this.currentTimeDash >= this.timeToEndDash){
			// End Dash
			this.inDash = false;
			this.angry = false;
			this.currentTimeDash = 0;
		}
	}
	
	LookAtRandomDirection(){
		// 'cause is not a good idea to change the direction each frame
		if (this.currentTimeDirection <= this.timeToChangeDirection){
			this.currentTimeDirection += Ramu.time.delta;
			return;
		}
		
		this.currentTimeDirection = 0;
			
		let dirs = ['TOP', 'LEFT', 'RIGHT', 'BOTTOM', 'FOLLOW'];
		let dir = dirs[parseInt(Math.random() * dirs.length)];
		
		if (dir === 'FOLLOW'){
			this.LookAtPlayerDirection();
			return;
		}

		this.currentDirection = DIRECTION[dir];	
	}
	
	LookAtPlayerDirection(){
		let x = Math.pow(game.player.x - this.x, 2),
			y = Math.pow(game.player.y - this.y, 2);
		
		if (x < y)
			if (this.y >= game.player.y)
				this.currentDirection = DIRECTION.TOP;
			else 
				this.currentDirection = DIRECTION.BOTTOM;
		else 
			if (this.x >= game.player.x)
				this.currentDirection = DIRECTION.LEFT;
			else 
				this.currentDirection = DIRECTION.RIGHT;
	}
	
	move(){
		switch (this.currentDirection){
			case DIRECTION.TOP:
				this.walkUp();
				break;
			case DIRECTION.LEFT:
				this.walkLeft();
				break;
			case DIRECTION.RIGHT:
				this.walkRight();
				break;
			case DIRECTION.BOTTOM:
				this.walkDown();
		}
	}
}

class Game extends GameObj{
	start(){
		this.scorePlayer = 0;
		this.scoreEnemy = 0;
		this.score = new Ramu.Text('', Ramu.width/2 - 25, 10, 300);
		this.rules = new Ramu.Text("Hit the darkest part to kill the bull. 'a/w/s/d' to move and 'space' to incite. The bull will make attacks while you \nincite him. \nHermes Passer, in 2018-06-21", 1, 20, 500);
		
		// if starts in same rect then the setRules will say that enemy has won
		this.player = new Player(0,0);
		this.enemy = new Enemy(-100,-100);
		
		this.reset();
		this.setRules();
	}
	
	reset(){
		this.player.x = 200;
		this.player.y = 100;
		this.player.collisor.collision = [];
		
		this.enemy.x = 200;
		this.enemy.y = 450;
		this.enemy.angry = false;
		this.enemy.inDash = false;
		
		// maybe create a func to empty this?
		Ramu.pressedKeys = {};
	}
	
	setRules(){
		this.player.collisor.onCollision = function(){
			for (let i = 0; i < this.collision.length; i++){
				let tag = this.collision[i].tag;
				
				if (tag === 'enemy head'){
					game.scoreEnemy++;
					game.reset();
					break;
				}
				
				if (tag === 'enemy back'){
					game.scorePlayer++;
					game.reset();
					break;
				}
			}
		}
	}
	
	update(){
		this.input();
		this.score.text = 'PLAYER ' + this.scorePlayer + ' | ENEMY ' + this.scoreEnemy;
	}
		
	input(){
		if (Ramu.isPressed('w')) this.player.walkUp();
		else if (Ramu.isPressed('s')) this.player.walkDown();
		
		if (Ramu.isPressed('a')) this.player.walkLeft();
		else if (Ramu.isPressed('d')) this.player.walkRight();
		
		if (Ramu.isPressed('space')) {
			this.player.incite();
			this.enemy.angry = true;
		} else {
			this.player.dissuade();
		}
	}
}

Ramu.init(500, 500); 
var game = new Game();
