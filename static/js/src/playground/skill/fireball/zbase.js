class FireBall extends AcGameObject {
    constructor(playground, player, x, y, radius, vx, vy, damage, color, speed, move_length) {
        super();
        this.playground = playground;
        this.player = player;
        this.ctx = this.playground.game_map.ctx;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.damage = damage;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.move_length = move_length;
        this.eps = 0.01;
    }
    start() {
    }
    update() {
        if (this.move_length < this.eps) {
            this.destroy();
            return false;
        }

        this.update_move();
        if (this.player.character !== "enemy") {
            this.update_attack();
        }


        this.render();
    }
    update_move() {
        let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
        this.x += this.vx * moved;
        this.y += this.vy * moved;
        this.move_length -= moved;
    }

    update_attack() {
        for (let i = 0; i < this.playground.players.length; i++) {
            let player = this.playground.players[i];
            if (this.player === player) continue;
            if (player.cur_skill === "guard" && this.is_collision_with_guard(player)) {
                this.destroy();
                break;
            } else if (this.is_collision(player)) {
                this.attack(player);
                break;
            }
        }
    }
    get_dist(x1, y1, x2, y2) {
        return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    }
    is_collision(player) {
        let dist = this.get_dist(this.x, this.y, player.x, player.y);
        return dist < this.radius + player.radius;
    }
    is_collision_with_guard(player) {
        let dist = this.get_dist(this.x, this.y, player.x, player.y);
        return dist < this.radius + player.radius * 2;

    }
    attack(player) {
        let angle = Math.atan2(player.y - this.y, player.x - this.x);
        player.is_attacked(this.damage, angle);

        if (this.playground.mode === "multi mode") {
            this.playground.mps.send_attack(player.uuid, player.x, player.y, angle, this.damage, this.uuid);
        }
        this.destroy();
    }
    render() {
        let scale = this.playground.scale;
        let ctx_x = this.x - this.playground.cx, ctx_y = this.y - this.playground.cy; // 把虚拟地图中的坐标换算成canvas中的坐标
        if (ctx_x < -0.1 * this.playground.width / scale ||
            ctx_x > 1.1 * this.playground.width / scale ||
            ctx_y < -0.1 * this.playground.height / scale ||
            ctx_y > 1.1 * this.playground.height / scale) {
            return;
        }

        this.ctx.beginPath();
        this.ctx.arc(ctx_x * scale, ctx_y * scale, this.radius * scale, 0, Math.PI * 2, false);
        this.ctx.fillStyle = this.color;
        this.ctx.fill();
    }

    on_destroy() {
        let fireballs = this.player.fireballs;
        for (let i = 0; i < fireballs.length; i++) {
            if (fireballs[i] === this) {
                fireballs.splice(i, 1);
                break;
            }
        }
    }

}