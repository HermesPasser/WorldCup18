
class Train extends SimpleRectCollider{
	constructor(x, y){
		super(x, y, 32, 47);
		this.sprite = new Sprite(Ramu.Utils.getImage('res/train.gif'), this.x, this.y, 32, 47);
		this.sprite.drawPriority = 1;
		
		this.drawPriority = this.sprite.drawPriority + 1;	
		this.velocity = 50;
		this.canGo = false;
		this.tag = 'train';
	}
	
	update(){
		super.update();
		
		if (this.canGo){			
			this.y -= this.velocity * Ramu.time.delta;
			this.sprite.y -= this.velocity * Ramu.time.delta;
		}
		
		if (Ramu.Utils.isOutOfCanvas(this)){
			game.lose();
			game.audio.pause();
			this.canGo = false;
		}
	}
	
	teleport(){
		this.x = game.exPortal.x - 1;
		this.y = game.exPortal.y;
		this.sprite.x = game.exPortal.x - 1;
		this.sprite.y = game.exPortal.y;
	}
}

class EntranceTunnel extends SimpleRectCollider{
	constructor(x, y){
		super(x, y, 34, 17);
		this.sprite = new Sprite(Ramu.Utils.getImage('res/entrance_tunnel.png'), this.x, this.y, 34, 97);
		this.drawPriority = this.sprite.drawPriority + 1;
	}
	
	onCollision(){
		for (let i = 0; i < this.collision.length; i++)
			if (this.collision[i].tag === 'train'){
				game.train.canGo = false;
				game.audio.pause();
				game.win();
			}
	}
}

class EntrancePortal extends SimpleRectCollider{
	constructor(x, y){
		super(x, y, 26, 6);
		this.sprite = new Sprite(Ramu.Utils.getImage('res/entrance_portal.gif'), this.x, this.y, 26, 18);
	}
	
	onCollision(){
		for (let i = 0; i < this.collision.length; i++)
			if (this.collision[i].tag === 'train')
				game.train.teleport();
	}
	
	setPosition(){
		this.x = Ramu.clickedPosition.X;
		this.y = Ramu.clickedPosition.Y;

		this.sprite.x = Ramu.clickedPosition.X;
		this.sprite.y = Ramu.clickedPosition.Y;
	}
	
	destroy(){
		super.destroy();
		this.sprite.destroy();
	}
}

class Game extends GameObj{
	start(){		
		new Sprite(Ramu.Utils.getImage('res/ground.gif'), 0, 0, Ramu.width, Ramu.height);
		
		this.audio = new Audio('res/steam-train-whistle-daniel_simon.wav');
		this.audio.loop = true;
		
		this.infoDump = new Ramu.Text('Click to place the portal. Hermes Passer in 2018-06-29', 100, 490, 500);
		this.result = new Ramu.Text('', 200, 250, 200);
		
		this.enTunnel = new EntranceTunnel(300, 1);
		this.exTunnel = new Sprite(Ramu.Utils.getImage('res/exit_tunnel.gif'), 30, Ramu.height - 97, 34, 97);
		this.enTunnel.drawPriority = 2;
		this.exTunnel.drawPriority = 2;
		
		this.exPortal = new Sprite(Ramu.Utils.getImage('res/exit_portal.gif'), 302, 300, 26, 18);
		this.enPortal = new EntrancePortal(355, 30);
		
		this.train = new Train(this.exTunnel.x + 1, this.exTunnel.y + 20);
		
		this.setRules();
	}
		
	lose(){ this.result.text = "YOU LOST"; }
	
	win(){ this.result.text = "YOU WON"; }
	
	setRules(){
		this.btn = new SimpleSpriteButton(350, 475, 108, 20, Ramu.Utils.getImage('res/button.gif'));
		this.btn.setOnClick(function(){
			game.train.canGo = true;
			game.audio.play();
		});
		
		this.clickableCanvas = new Clickable(0, this.exTunnel.height, Ramu.width, Ramu.height - this.exTunnel.height * 2 - 50);
		this.clickableCanvas.onClick = function(){
			game.enPortal.setPosition();
		}
	}
}

Ramu.init(500, 500); 
var game = new Game();
