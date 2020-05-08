// 游戏类
function Game() {
    // 得到画布，设置为实例的属性，即实例有一个属性叫做canvas
    this.canvas = document.getElementById('canvas');
    // 渲染上下文
    this.ctx = this.canvas.getContext('2d');

    // 要做一个事情，加载所有的图片。只有把所有的图片都加载完毕了，游戏才开始。
    // 全部图片数组
    var allimages = [
        { 'alias': 'bird', 'path': 'images/bird.png' },
        { 'alias': 'pipe1', 'path': 'images/pipe1.png' },
        { 'alias': 'pipe2', 'path': 'images/pipe2.png' },
        { 'alias': 'land', 'path': 'images/ground.png' },
        { 'alias': 'bg', 'path': 'images/background.png' },
        { 'alias': '0', 'path': 'images/0.png' },
        { 'alias': '1', 'path': 'images/1.png' },
        { 'alias': '2', 'path': 'images/2.png' },
        { 'alias': '3', 'path': 'images/3.png' },
        { 'alias': '4', 'path': 'images/4.png' },
        { 'alias': '5', 'path': 'images/5.png' },
        { 'alias': '6', 'path': 'images/6.png' },
        { 'alias': '7', 'path': 'images/7.png' },
        { 'alias': '8', 'path': 'images/8.png' },
        { 'alias': '9', 'path': 'images/9.png' },
        { 'alias': 'gameover', 'path': 'images/gameover.png' },
        { 'alias': 'btn', 'path': 'images/btn.png' },
    ];

    // 图片资源对象，加载好一个，就往里面添加一个属性
    this.R = {
    };
    // 备份
    var self = this;

    // 设置显示的文字的样式
    this.ctx.font = '40px 微软雅黑';
    this.ctx.textAlign = 'center';

    // 遍历allimages数组，每遍历一个对象，就创建一个img对象，写这个img的src和onload
    // 当每一个图片onload之后呢，就在this.R对象中创建一个和alias同名的属性
    // 属性的值就是img对象。每加载好一个图片，就判断一下R中的属性总数和allimages数组的总长度是否一致
    // 如果一致，就说明全部图片都加载好了。因为图片不是按顺序加载完毕的，它是看网速、图片大小。
    for (let i = 0; i < allimages.length; i++) {
        (function (i) {
            // 创建一个图片对象
            var img = new Image();
            // 监听图片的onload事件
            img.onload = function () {
                // 加载好一个图片，就给R对象设置一个和alias同名的属性。
                self.R[allimages[i].alias] = img;
                // 清屏
                self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
                // 显示加载字样
                self.ctx.fillText(
                    '正在加载图片 ' + Object.keys(self.R).length + '/' + allimages.length,
                    self.canvas.width / 2,
                    self.canvas.height / 2
                );

                // 由于不知道谁是最后一个加载完毕的，所以我们的思路就是每加载好一张图片，就判断一次，看看R对象中的属性个数和allimages数组长度是否相同
                // 得到一个对象的属性个数，应该使用Object.keys(对象).length
                if (Object.keys(self.R).length == allimages.length) {
                    // 都加载完毕，就可以开始定时器了
                    self.start();
                }
            }
            // 设置图片的src属性
            img.src = allimages[i].path;
        })(i);
    }
}
Game.prototype.start = function () {
    // 备份
    var self = this;
    // 帧编号
    this.f = -1;
    // 设置文字不居中了
    this.ctx.textAlign = 'left';
    this.ctx.font = '20px 宋体';
    // 实例化大地
    this.land = new Land();
    // 管子有很多，所以还要准备管子数组
    this.pipesArr = [];
    // 实例化小鸟
    this.bird = new Bird();
    // 实例化分数，Instance是实例的意思
    this.scoreInstance = new Score();

    // 分数，这是个数字，不是实例，实例也要看这个数字。
    // 为什么没有把数字写到Score类里面，因为考拉老师觉得，这个数字很重要
    // 应该由game类亲自管理
    this.score = 0;

    // 是否已经死亡
    this.isGameover = false;

    // 自己的死亡场景
    this.gameoverscene = null;

    // 添加监听
    this.canvas.onmousedown = function (e) {
        if (!self.isGameover) {
            self.bird.fly();
        } else {
            // 当已经死亡了，并且死亡超过了40帧，并且点击的位置也在按钮上
            if (self.gameoverscene.f > 40) {
                if (
                    e.offsetX > self.canvas.width / 2 - 58 && e.offsetX < self.canvas.width / 2 + 58
                    &&
                    e.offsetY > 280 && e.offsetY < 280 + 70
                ) {
                    // alert('你点击了按钮');
                    // 恢复游戏
                    self.score = 0;
                    self.bird = new Bird();
                    self.pipesArr = [];
                    self.isGameover = false;
                }
            }
        }
    }

    // 定时器
    setInterval(function () {
        // 清屏
        self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);

        // 帧编号加1
        self.f++;
        // 打印帧编号
        self.ctx.fillText(
            self.f, 10, 20
        );

        // 渲染背景
        self.ctx.drawImage(self.R['bg'], 0, 0, self.canvas.width, self.canvas.height - 80);

        // 每帧都要调用大地的更新和渲染方法
        !self.isGameover && self.land.update();
        self.land.render();

        // 判断帧编号是不是200的倍数，如果是，就实例化管子
        if (self.f % 200 == 0) {
            new Pipe();
        }

        // 遍历所有管子，调用它们的update和render方法
        for (var i = 0; i < self.pipesArr.length; i++) {
            !self.isGameover && self.pipesArr[i].update();
            self.pipesArr[i].render();
        }

        // 每帧都要调用小鸟的更新和渲染方法
        !self.isGameover && self.bird.update();
        self.bird.render();

        // 渲染分数
        self.scoreInstance.render();

        // 渲染死亡场景
        if (self.isGameover) {
            self.gameoverscene.update();
            self.gameoverscene.render();
        }
    }, 20);
}
// 死亡方法
Game.prototype.gameover = function () {
    this.isGameover = true;
    // 当死亡了，gameoverscene才被new出来
    this.gameoverscene = new GameOverScene();
    // 播放声音
    document.getElementById('zhuang').play();
}