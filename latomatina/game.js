const TOMATO_IMG = Ramu.Utils.getImage('res/tomato.gif');
const CITIZEN_IMG = Ramu.Utils.getImage('res/citizen.gif');

class Tomato extends SimpleRectCollider{
	constructor(x){
		super(x, 541, 41, 39);
		this.sprite = new Sprite(TOMATO_IMG, x, 541, 41, 39);
		this.sprite.drawPriority = 3;
		this.tag = 'tomato';
		this.velocity = 300;
	}
	
	update(){
		super.update();
		this.y -= this.velocity * Ramu.time.delta;
		this.sprite.y -= this.velocity * Ramu.time.delta;
		
		if (this.y + this.width < 0){
			this.destroy();
			this.sprite.destroy();
		}
	}
	
	destroy(){
		super.destroy();
		this.sprite.destroy();
	}
}

class Citizen extends SimpleRectCollider{
	constructor(x){
		super(x, 259, 58, 69);
		this.sprite = new Sprite(CITIZEN_IMG, x, 259, 58, 69);
		this.sprite.drawPriority = 1;
		this.canCollide = false;
		this.tag = 'citizen';
				
		this.state = ['goingUp', 'waiting', 'goingDown', 'destroy'];
		this.currentState = 0;
		this.timeToChangeState = 40;
		this.currentTimeToChange = 0;
	}
	
	goUp(){
		this.canCollide = false;
		this.y -= 100 * Ramu.time.delta;
		this.sprite.y -= 100 * Ramu.time.delta;	
	}
	
	goDown(){
		this.canCollide = false;
		this.y += 100 * Ramu.time.delta;
		this.sprite.y += 100 * Ramu.time.delta;	
	}
	
	update(){
		super.update();
		
		this.currentTimeToChange += 1;
		if (this.currentTimeToChange >= this.timeToChangeState){
			this.currentTimeToChange = 0;	
			this.currentState++;
		}	
	
		switch (this.state[this.currentState]){
			case 'goingUp':
				this.goUp();
				break;
			case 'waiting':
				this.canCollide = true;
				break;
			case 'goingDown':
				this.goDown();
				break;
			case 'destroy':
				game.missScore++;
				this.destroy();
		}
	}
	
	onCollision(){
		let obj = this;
		this.collision.forEach(function(item) {
			if (item.tag === 'tomato'){
				game.hitScore++;
				item.destroy();
				obj.destroy();
			}
		});
	}
	
	destroy(){
		super.destroy();
		this.sprite.destroy();
	}
}

class Game extends GameObj{
	start(){
		this.bg = new Panorama(Ramu.Utils.getImage('res/crowd.gif'), 0, 0, 500, 259, 50);
		this.truck = new Sprite(Ramu.Utils.getImage('res/bucket.gif'), 0, 259, 500, 241);
		this.truck.drawPriority = 2;
		
		this.score = new Ramu.Text('', Ramu.width / 2 - 40, 460, 300);
		this.infoDump = new Ramu.Text('Click to throw a tomato. Hermes Passer in 2018-06-26', 40, 480, 300);
		
		this.timeToThrow = 1;
		this.currentTimeThrow = this.timeToThrow;
		this.canThrow = false;
		
		this.timeToInstantiate = 1;
		this.currentTimeInstantiate = 0;
		
		this.hitScore = 0;
		this.missScore = 0;
		
		this.clickableCanvas = new Clickable(0, 0, Ramu.width, Ramu.height);
		this.clickableCanvas.onClick = function(){
			game.throwTomato(Ramu.clickedPosition.X);
		}
	}
	
	update(){		
		if (this.currentTimeThrow >= this.timeToThrow)
			this.canThrow = true;
		
		if (this.currentTimeInstantiate >= this.timeToInstantiate)
			this.instantiateCitizen();
		
		this.currentTimeThrow += Ramu.time.delta;
		this.currentTimeInstantiate += Ramu.time.delta;
		this.score.text = "HITS: " + this.hitScore + " | MISS: " + this.missScore;
	}

	throwTomato(x){
		if (!this.canThrow)
			return;
		new Tomato(x);
		this.currentTimeThrow = 0;
		this.canThrow = false;
	}
	
	instantiateCitizen(){
		this.currentTimeInstantiate = 0;
		let x = Math.trunc(Math.random() * Ramu.width);
		new Citizen(x);
	}
}

Ramu.init(500, 500); 
var game = new Game();
