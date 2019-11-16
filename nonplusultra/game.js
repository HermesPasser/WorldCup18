const ROCK_IMG = Ramu.Utils.getImage('res/rock.gif');

class Rock extends SimpleRectCollider{
	constructor(x, y){
		super(x, y, 39, 36);
		this.velocity = 100;
		this.sprite = new Sprite(ROCK_IMG, x, y, 39, 36);
	}
	
	static instantiate(){
		new Rock(500, Math.trunc(Math.random() * Ramu.width));
	}
	
	update(){
		if (game.isDead)
			return;
		
		this.x -= this.velocity * Ramu.time.delta;
		this.sprite.x -= this.velocity * Ramu.time.delta;
		
		if (this.x + this.width < 0)
			this.destroy();
	}
	
	onCollision(){
		for (let i = 0; i < this.collision.length; i++){
			if (this.collision[i].tag === 'player'){
				game.player.destroy();
				game.isDead = true;
				break;
			}
		}
	}
	
	destroy(){
		super.destroy();
		this.sprite.destroy();
	}
}

class Player extends SimpleRectCollider{
	constructor(x, y){
		super(x, y, 100, 50);
		this.velocity = 5;
		this.tag = 'player';
		this.sprite = new Sprite(Ramu.Utils.getImage('res/ship.gif'), x, y, 100, 50);
	}

	up(){
		if (this.y  <= 0)
			return;
		
		this.y -= this.velocity; 
		this.sprite.y -= this.velocity; 
	}
	
	left(){
		if (this.x  <= 0)
			return;

		this.x -= this.velocity; 
		this.sprite.x -= this.velocity; 
	}
	
	right(){
		if (this.x + this.width >= Ramu.width)
			return;
		
		this.x += this.velocity; 
		this.sprite.x += this.velocity; 
	}
	
	down(){
		if (this.y + this.height >= Ramu.height)
			return;
		
		this.y += this.velocity; 
		this.sprite.y += this.velocity; 
	}
	
	destroy(){
		super.destroy();
		this.sprite.destroy();
	}
}

class Game extends GameObj{
	start(){
		this.sea = new SpriteAnimation(0, 0, 500, 500);
		this.sea.addFrame([Ramu.Utils.getImage('res/sea1.gif'), Ramu.Utils.getImage('res/sea2.gif')]);
		
		this.player = new Player(200, 200);
		this.rules = new Ramu.Text("'a/w/s/d' to move. Hermes Passer, in 2018-07-03", 1, 20, 300);
		this.timeToInstantiate = 2;
		this.currentTimeToInstantiate = 2;
		this.isDead = false;
	}
	
	update(){
		if (this.isDead)
			return;
		
		this.input();
		
		this.currentTimeToInstantiate += Ramu.time.delta;
		if (this.currentTimeToInstantiate >= this.timeToInstantiate){
			this.currentTimeToInstantiate = 0;
			Rock.instantiate();
		}
	}
		
	input(){
		if (Ramu.isPressed('w')) this.player.up();
		if (Ramu.isPressed('s')) this.player.down();
		if (Ramu.isPressed('a')) this.player.left();
		if (Ramu.isPressed('d')) this.player.right();
	}
}

Ramu.init(500, 500); 
var game = new Game();
