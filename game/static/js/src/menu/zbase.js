class AcGameMenu {
    constructor(root) {
        this.root = root;
        this.$menu = $(`
            <div class="ac-game-menu">
                <div class="ac-game-menu-field">
                    <div class="ac-game-menu-field-item ac-game-menu-field-item-single-mode">
                         单人模式
                    </div>
                    <br>
                    <div class="ac-game-menu-field-item ac-game-menu-field-item-multi-mode">
                         多人模式
                    </div>
                    <br>
                    <div class="ac-game-menu-field-item ac-game-menu-field-item-introduction">
                         游戏说明
                    </div>
                    <br>
                    <div class="ac-game-menu-field-item ac-game-menu-field-item-settings">
                            退出
                    </div>
                    <audio id="background-music" src="https://app1817.acapp.acwing.com.cn/static/audio/menu/menu.mp3" loop></audio>
                </div>
            </div>
        `);
        this.root.$ac_game.append(this.$menu); // 将菜单添加到DOM中
        this.hide(); // 在菜单添加到DOM后隐藏
        this.$single_mode = this.$menu.find('.ac-game-menu-field-item-single-mode');
        this.$multi_mode = this.$menu.find('.ac-game-menu-field-item-multi-mode');
        this.$introduction = this.$menu.find('.ac-game-menu-field-item-introduction');
        this.$settings = this.$menu.find('.ac-game-menu-field-item-settings');

        this.start();
    }

    start() {
        this.add_listening_events();
    }

    add_listening_events() {
        let outer = this;

        this.$single_mode.click(function () {
            outer.hide();
            outer.root.playground.show("single mode");

        });

        this.$multi_mode.click(function () {
            outer.hide();
            outer.root.playground.show("multi mode");
        });

        this.$introduction.click(function () {
            outer.hide();
            outer.root.introduction.show();
        });

        this.$settings.click(function () {
            outer.root.settings.logout_on_remote();
        });
    }

    show() {
        this.$menu.show();
    }

    hide() {
        this.$menu.hide();
    }
}
