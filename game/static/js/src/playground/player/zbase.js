class Player extends AcGameObject{
    constructor(playground, x, y, radius, color, speed, is_me){
        super();
        this.playground = playground;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.vx = 1;
        this.vy = 1;
        this.move_length = 0;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.is_me = is_me;
        this.eps = 0.1;
        this.cur_skill = null;
        this.damage_x = 0;
        this.damage_y = 0;
        this.damage_speed = 0;
        this.friction = 0.9;
    }
    start(){
        if(this.is_me){
            this.add_listening_events();
        }else{
            let tx = Math.random() * this.playground.width;
            let ty = Math.random() * this.playground.height;
            this.move_to(tx,ty);
        }
    }
    add_listening_events(){
        let outer = this;
        this.playground.game_map.$canvas.on("contextmenu", function(){
            return false;
        });
        this.playground.game_map.$canvas.mousedown(function(e){
            if(e.which===3){  // 右键
                outer.move_to(e.clientX, e.clientY);
            }else if(e.which===1){
                if(outer.cur_skill === "fireball"){
                    outer.shoot_fireball(e.clientX, e.clientY);
                }
                outer.cur_skill = null;
            }
        });
        $(window).keydown(function(e){
            if(e.which===81){
                outer.cur_skill = "fireball";
                return false;
            }
        });
    }
    shoot_fireball(tx,ty){
        let x = this.x;
        let y = this.y;
        let angle = Math.atan2(ty-y,tx-x);
        let vx = Math.cos(angle);
        let vy = Math.sin(angle);
        let radius = this.playground.height * 0.01;
        let color = "blue";
        let speed = this.playground.height * 0.5;
        let move_length = this.playground.height * 1.5;
        new FireBall(this.playground, this, x, y, radius, vx, vy, this.playground.height*0.01, color, speed, move_length);
    }
    get_dist(x1,y1,x2,y2){
        return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2));
    }
    move_to(x, y){
        this.move_length = this.get_dist(this.x,this.y,x,y);
        let angle = Math.atan2(y-this.y,x-this.x);
        this.vx = Math.cos(angle);
        this.vy = Math.sin(angle);
    }

    is_attacked(damage,angle){
        this.radius -= damage;
        if(this.radius <10){
            this.destroy();
            return false;
        }
        this.speed *=0.8;
        this.damage_x = Math.cos(angle);
        this.damage_y = Math.sin(angle);
        this.damage_speed = damage*150;

        for(let i=0;i<10+Math.random()*5;i++){
            let x=this.x;
            let y=this.y;
            let radius = this.radius*Math.random()*0.1;
            let angle = Math.random()*Math.PI*2;
            let vx = Math.cos(angle);
            let vy = Math.sin(angle);
            let color = this.color;
            let speed =this.speed*10;
            new Particle(this.playground,x,y,radius,vx,vy,color,speed);
        }
    }

    update(){
        if(Math.random()<1/180.0){
            let player = this.playground.players[0];
            this.shoot_fireball(player.x,player.y);
        }
        if(this.damage_speed > 10){
            this.vx = this.vy=0;
            this.move_length = 0;
            this.x += this.damage_x * this.damage_speed * this.timedelta/1000;
            this.y += this.damage_y * this.damage_speed * this.timedelta/1000;
            this.damage_speed *= this.friction;
        }
        if(this.move_length < this.eps){
            this.move_length = 0;
            this.vx = 0;
            this.vy = 0;
            if(!this.is_me){  // 如果不是玩家自己，到达终点后再随机选一个位置移动
                let tx = Math.random() * this.playground.width;
                let ty = Math.random() * this.playground.height;
                this.move_to(tx,ty);
            }
        }else{
            let moved = Math.min(this.move_length,this.speed * this.timedelta/1000);
            this.x += this.vx * moved;
            this.y += this.vy * moved;
            this.move_length -= moved;
        }
        this.render();
    }
    render(){
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2,false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }
}