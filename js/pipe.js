function Pipe(){
     // 管子的x坐标
     this.x=game.canvas.width;
     // 随机一个上管子高度
     this.pipe2H=parseInt(Math.random()*280)+40;
      // 中间的空隙
      this.gap=260;
       // 下管子的高度就有了，80是大地
       this.pipe1H=game.canvas.height-80-this.pipe2H-this.gap;
       // 自己的AABB盒
       this.x1=this.x;
       this.x2=this.x+90;
       this.y1=this.pipe2H;                  // y1就是上管子高
       this.y2=this.pipe2H+this.gap;           // y2是上管子高加缝隙

        // 添加一个标记，自己是否已经被加分了
        this.allReadyScore=false;
        // 加入到管子数字中
        game.pipesArr.push(this);
}
Pipe.prototype.update=function(){
    this.x-=2;
       // 如果管子出屏幕了，就自杀
       if(this.x<-90){
           for(let i=0;i<game.pipesArr.length;i++){
            if(game.pipesArr[i]==this){
                game.pipesArr.splice(i,1)
            }
           }
       }
         // 更新自己的AABB盒
         this.x1=this.x;
         this.x2=this.x+90;
         this.y1=this.pipe2H;
         this.y2=this.pipe2H+this.gap;
          // 判断有没有撞到小鸟
          if(
              (this.y1>game.bird.y1 && this.x1<game.bird.x2 && this.x2>game.bird.x1)
              ||
              (this.y2<game.bird.y2 && this.x1<game.bird.x2 && this.x2>game.bird.x1)
          ){
              console.log('撞了！');
                // 调用Game类的gameover方法
                game.gameover();
          }
           // 判断小鸟有没有安全通过管子。
             // 如果自己没有加过分
             if(!this.allReadyScore && game.bird.x1>this.x2){
                 // 加分
                 game.score++;
                  // 自己标记变脏
                  this.allReadyScore=true;
                   // 播放声音
                   document.getElementById('defen').play();
             }
};
Pipe.prototype.render=function(){
    // 绘制上管子
    game.ctx.drawImage(game.R['pipe2'],0,517-this.pipe2H,90,this.pipe2H,this.x,0,90,this.pipe2H);
     // 绘制下管子
     game.ctx.drawImage(game.R['pipe1'],0,0,90,this.pipe1H,this.x,this.pipe2H+this.gap,90,this.pipe1H);
};