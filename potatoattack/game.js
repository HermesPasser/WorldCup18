// Potato Attack by Hermes Passer in 09-12-17 using Ramu 0.2 and adapted to Ramu 0.6
const POTATO_IMG = RamuUtils.getImage("img/potato.png");

class AnimatedCollisor extends SimpleRectCollisor{
	constructor(x,y,w,h){
		super(x,y, w, h);
		this.forceX = 5;
		this.forceY = -5;
	}
	
	onCollision(){
		this.forceX = -(this.forceX);
		this.forceY = -(this.forceY);
	}
}

class StaticRect extends GameObj{
	constructor(x,y,w,h){
		super(x,y,);	
		this.collider = new AnimatedCollisor(x, y, w, h);
		this.sprite = new Sprite(POTATO_IMG, x, y, w, h);
		this.sprite.canDraw = false;
	}
}

class AnimatedRect extends Drawable{
	constructor(x,y,w,h){
		super(x, y, w, h, false);	
		this.collider = new AnimatedCollisor(x, y, w, h);
		this.sprite = new Sprite(POTATO_IMG, x, y, w, h);
		this.sprite.forceX = Math.floor(Math.random() * 10) - 5
		this.sprite.forceY = Math.floor(Math.random() * 10) - 5;
		this.sprite.canDraw = false;
	}
	
	update(){
		if (this.x <= 0 || this.x >= Ramu.canvas.width - this.width){
			this.collider.forceX = -(this.collider.forceX);
		}
		
		if (this.y <= 0 || this.y >= Ramu.canvas.height - this.height){
			this.collider.forceY = -(this.collider.forceY);
		}

		this.x += this.collider.forceX;
		this.y += this.collider.forceY;
		this.sprite.x += this.collider.forceX;
		this.sprite.y += this.collider.forceY;
		this.collider.x += this.collider.forceX;
		this.collider.y += this.collider.forceY;
	}
}

class MovingChar extends SimpleRectCollisor{
	constructor(x,y,width,height){
		super(x, y, width, height);
		this.die = false;
	}
	
	draw(){
		super.draw();
		if (this.die) Ramu.ctx.fillText("*died*",this.x, this.y);
		else Ramu.ctx.strokeRect(this.x, this.y, this.width, this.height);
	}
	
	update(){
		if (this.die) return;
		
		super.update();
		
		this.canDraw = true;
		var value = 100 * Ramu.time.delta;
		
		if (keyCode.a in Ramu.lastKeysPressed) this.x -= value;
		if (keyCode.d in Ramu.lastKeysPressed) this.x += value;
		if (keyCode.s in Ramu.lastKeysPressed) this.y += value;
		if (keyCode.w in Ramu.lastKeysPressed) this.y -= value;
		
		if (this.x <= 0)
			this.x = Ramu.canvas.width - this.width;
		else if (this.x >= Ramu.canvas.width)
			this.x = this.width;
		
		if (this.y <= 0){
			this.y = Ramu.canvas.height - this.height;
		} else if (this.y >= Ramu.canvas.height){
			this.y = this.height;
		}
		
	}
	
	onCollision(){
		if (!this.die){
			this.width--;
			this.height--;
		}	
		
		if (this.width <= 0 && this.height <= 0){
			this.die = true;
			this.canCollide = false;
		}
	}
}

class MyGame extends Drawable{
	start(){
		this.canDraw = true;
		
		Ramu.inLoop = false;
		
		this.block1 = new StaticRect(300, 50, 50, 50);
		this.block2 = new StaticRect(200, 300, 50, 50);
		
		this.option = [0, 1, 2];
		this.state = { menu: 0, game: 1, gameOver: 2 };
		this.reset();
			
		this.w = Ramu.canvas.width / 2 - 35;
		this.h = Ramu.canvas.height / 2 - 50;
		
		this.gradient = Ramu.ctx.createLinearGradient(0,0,Ramu.canvas.width,0);
		this.gradient.addColorStop("0","red");
		this.gradient.addColorStop("0.5","blue");
		this.gradient.addColorStop("0.8","green");
	}
		
	readInput(){
		if (keyCode.s in Ramu.lastKeysPressed)
			this.currOp = (this.currOp + 1) % this.option.length
		else if (keyCode.w in Ramu.lastKeysPressed) 
			this.currOp = this.currOp - 1 <= -1 ? this.option.length - 1 : this.currOp - 1;
		
		if (keyCode.enter in Ramu.lastKeysPressed){
			if (this.currState == this.state.gameOver){
				this.character.destroy();
				this.currState = this.state.menu;
				this.reset();
			} else {
				switch(this.currOp){
					case 0:
						this.currState = this.state.game;
						break;
					case 1:
						Ramu.debugMode = !Ramu.debugMode;
						break;
					case 2:
						break;
				}
			}
		}
	}
	
	reset(){
		this.character = new MovingChar(Ramu.canvas.width/2 - 25,Ramu.canvas.height/2 - 25, 50, 50);
		this.enemy1 = new AnimatedRect(Math.floor(Math.random() * Ramu.canvas.width - 70), 
			Math.floor(Math.random() * Ramu.canvas.height - 70), 70, 70);
			
		this.enemy2 = new AnimatedRect(Math.floor(Math.random() * Ramu.canvas.width - 70),
			Math.floor(Math.random() * Ramu.canvas.height - 70), 40, 70);
			
		this.enemy1.sprite.canDraw = false;
		this.enemy2.sprite.canDraw = false;
		this.block1.sprite.canDraw = false;
		this.block2.sprite.canDraw = false;
		
		this.currOp = 0;
		this.currState = this.state.menu;
	}
	
	update(){
		if (this.character.die){
			this.currState = this.state.gameOver;
			this.currOp = 0;
		}
	}
	
	draw(){
		Ramu.ctx.fillStyle = this.gradient;
		
		switch(this.currState){
			case this.state.menu:
				this.readInput();
				Ramu.ctx.font="30px Verdana";
				Ramu.ctx.fillText("Potato Attack", this.w - 65, this.h - 50);
			
				Ramu.ctx.font="13px Arial";
				Ramu.ctx.strokeStyle = this.currOp == 0 ? "red" : "black";
				Ramu.ctx.strokeText("Start", this.w, this.h);
				
				Ramu.ctx.strokeStyle = this.currOp == 1 ? "red" : "black";
				Ramu.ctx.strokeText("Run in debug mode: " + Ramu.debugMode, this.w, this.h + 20);
				
				Ramu.ctx.strokeStyle = this.currOp == 2 ? "red" : "black";
				Ramu.ctx.strokeText("Empty option", this.w, this.h + 40);
				
				Ramu.ctx.strokeStyle = "black";
				Ramu.ctx.strokeText("up = w", 1,    Ramu.canvas.height - 65);
				Ramu.ctx.strokeText("down = s", 1,  Ramu.canvas.height - 45);
				Ramu.ctx.strokeText("left = s", 1,  Ramu.canvas.height - 25);
				Ramu.ctx.strokeText("right = d", 1, Ramu.canvas.height - 5);
				Ramu.ctx.strokeText("Hermes Passer - 2017", this.w - 30, Ramu.canvas.height - 5);
				break;
			case this.state.game:
				this.character.canDraw = true;
				this.enemy1.sprite.canDraw = true;
				this.enemy2.sprite.canDraw = true;
				this.block1.sprite.canDraw = true;
				this.block2.sprite.canDraw = true;
				Ramu.inLoop = true;

				break;
			case this.state.gameOver:
				this.readInput();
				Ramu.inLoop = false;
				
				Ramu.ctx.font="30px Verdana";
				Ramu.ctx.fillText("Game Over", this.w - 50, this.h - 50);
			
				Ramu.ctx.font="13px Arial";
				Ramu.ctx.strokeStyle = "red";
				Ramu.ctx.strokeText("return to main menu", this.w, this.h);
				break;
		}
	}
}
	
new MyGame(0,0,0,0);
Ramu.init();
