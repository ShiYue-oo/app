class AcGamePlayground{
    constructor(root){
        this.root = root;
        this.$playground = $(`
            <div class="ac-game-playground"></div>
            `);
//        this.hide();
        this.root.$ac_game.append(this.$playground);
        this.width = this.$playground.width();
        this.height = this.$playground.height();
        this.game_map = new GameMap(this);
        this.players = [];
        this.players.push(new Player(this,this.width/2,this.height/2,this.height*0.05,"white",this.height*0.3,true));
        for(let i = 0;i < 10000;i++){
            this.players.push(new Player(this,Math.random()*this.width,Math.random()*this.height,this.height*0.05,this.get_random_color(),this.height*0.3,false));
        }
        this.start();
    }
    get_random_color(){
        let colors = ["red","green","blue","yellow","purple","orange","pink","brown","gray"];
        return colors[Math.floor(Math.random()*colors.length)];
    }
    start(){

    }
    show(){
        this.$playground.show();
    }
    hide(){
        this.$playground.hide();
    }
}