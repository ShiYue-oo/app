class Introduction {
    constructor(root) {

        this.root = root;
        this.$introduction = $(`
            <div class="ac-game-introduction">
                <div class="ac-game-introduction-return">
                    返回
                </div>
                <div class="ac-game-introduction-title">
                    星际大逃杀
                </div>
                <div class="ac-game-introduction-content">
                    <div class="ac-game-introduction-content-item">
                        <div class="ac-game-introduction-content-item-title">
                            游戏目标
                        </div>
                        <div class="ac-game-introduction-content-item-content">
                            
                        </div>
                    </div>
                    <div class="ac-game-introduction-content-item">
                        <div class="ac-game-introduction-content-item-title">
                            操作说明
                        </div>
                        <div class="ac-game-introduction-content-item-content">
                            q + 鼠标左键   攻击 发射火球
                            </br>
                            f + 鼠标左键   瞬移闪现
                            </br>
                            e  开启护盾
                            </br>
                            鼠标右键   移动到点击位置
                        </div>
                    </div>
                </div>
            </div>
        `);

        this.hide();
        this.root.$ac_game.append(this.$introduction);
        this.start();
        this.$introduction_return = this.$introduction.find('.ac-game-introduction-return');
    }
    start() {

    }
    add_listening_events() {
        let outer = this;
        this.$introduction_return.click(function () {
            outer.introduction_return();
        });
    }
    show(mode) {
        this.$introduction.show();
        this.add_listening_events();
    }
    introduction_return() {
        this.hide();
        this.root.menu.show();
    }
    hide() {
        this.$introduction.hide();
    }
}