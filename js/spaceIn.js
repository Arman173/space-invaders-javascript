'use strict'

//VARIABLES GLOBALES DEL JUEGO
var canvas; var ctx;
var canvasWidth; var canvasHeight;
var score; var scoreText;
var waves = 1; var waveText = "Wave 1";
var delayForSeeWave = 0;
var gameOver = false;
var score = 0; var highScore = 500;
var ROWS = 5; var COLUMNS = 11;
var numberOfShields = 4
var shield_Array = new Array(4);
//var shieldsParts_Array = new Array();
var ShieldImage = new Array(5);
var ShieldImageDir = new Array(
  "sprites/part_1.png",//posicion 0
  "sprites/part_2.png",//posicion 1
  "sprites/part_3.png",//posicion 2
  "sprites/part_4.png",//posicion 3
  "sprites/part_5.png",//posicion 4
);
var shieldW = 30; var shieldH = 30;
var alien_Array = new Array();
var aliens = 0;
var delayForIncreaseSpeedAlien = 3;//la cantidad para incrementar la velocidad del alien
var delayForIncrease = 3;//delay del a cantidad para incrementar la velocidad del alien
var subtractionOfAliens = 3;
var aliensForChangeDificult;
var offsetx = 20; var offsety = 100;
var limitx = 20; var limity = 100;
var limitw = 760; var limith = 400;
var limitBulletAlien = 600;
//Variables para el input del juego
var KEY_RIGHT = 39;
var KEY_A = 65;
var KEY_LEFT = 37;
var KEY_D = 68;
var KEY_BAR = 32;
var keyPressed = null;
var key = [];
var eventArray = new Array();
//variables de los objetos del juego

//variables del Jugador
var myPlayer;
var initialPlayerLifes = 3;
var playerLifes;
var initialY = 500;
var playerwidth = 44; var playerHeight = 44;
var playerOffsetX = 4;  var playerOffsetY = 23;
var playerOffsetW = 8;  var playerOffsetH = 27;
var playerSpeed = 3;
var playerImage;
var dirPlayerImage = "sprites/Player.png";
//variables de la bala
var bullet;
var canShoot = true;
var bulletWidth = 2;
var bulletHeight = 16;
var bulletSpeed = 8;
var bulletImage;
var dirPlayerBulletImage = "sprites/playerBullet.png";
//variables de las vidas del jugador
var myLifes;
var lifesPostitionX = 25;
var lifesPostitionY = 550;
var lifesWidth = 30; var lifesHeight = 30;
//vaiables del alien
var alienWidth = 44;  var alienHeight = 44;
var xOffset = 7;  var yOffset = 15;
var wOffset = 14; var hOffset = 30;
var alienDir;
var initalAlienSpeed = 4;
var alienSpeed;
var initialAlienTimer = 46;
var alienTimer = 46;
var restTimer = 2;
var lastAlienSpeed = 18;
var lastAlienTimer = 2;
var alienImage;
var dirAlienImage = "sprites/alienSpritesheet.png";
//variables de la bala del alien
var alienBullet;
var indexAlienArray = 0 ;
var alienBwidth = 6;  var alienBheigth = 12;
var alienBspeed = 5;
var alienBcanShoot = true;
var alienPoint = 15;
//variables de la nave de puntos adicionales
var ship;
var shipW = 45; var shipH = 45;
var shipYoffset = 15;
var shipHoffset = 33;
var shipSpeed = 4;
var staticPos = 800;
var shipImage;
var shipImageDir = "sprites/ship.png";

//botones del canvas de JUEGO
var startButton;
var startButtonX = 285;
var startButtonY = 325;
var startButtonW = 230;
var startButtonH = 40;
//
var restartButton;
var restartButtonX = 300;
var restartButtonY = 300;
var restartButtonW = 200;
var restartButtonH = 40;

//CLASES DEL JUEGO
class Object {
  constructor(x,y,w,h) {
    this.x = x; this.y = y;
    this.w = w; this.h = h;
    this.tag = "undefined";
  }
  Collision(obj) {
    if((this.x > obj.x+obj.w) || (this.x+this.w < obj.x) || (this.y > obj.y+obj.h) || (this.y+this.h < obj.y)){
      return false;
    }else {
      return true;
    }
  }
}

class Player extends Object {
  constructor(x, y, w, h) {
    super(x,y,w,h);
    this.x += playerOffsetX;
    this.y = initialY;
    this.y += playerOffsetY;
    this.w -= playerOffsetW;
    this.h -= playerOffsetH;
    //this.y = initialY;
  }
  Move(inputX){

    this.x += (playerSpeed*inputX);
    if(this.x < 0) this.x = 0;
    if(this.x > canvasWidth-this.w) this.x = canvasWidth-this.w;

  }
  setX(x){
    this.x = x;
  }
  shoot(){
    if(canShoot){
      bullet.shoot(this.x + 17);
      canShoot = false;
    }
  }
  drawPlayer = function(){
    ctx.drawImage(playerImage,this.x-playerOffsetX,this.y-playerOffsetY,this.w+playerOffsetW,this.h+playerOffsetH);
    ctx.strokeStyle = "blue";
    ctx.strokeRect(this.x,this.y,this.w,this.h);
  }
}
class PlayerBullet extends Object {
  constructor(x,y,w,h) {
    super(x,y,w,h);
    //this.wasCollided = false;
  }
  shoot(x){
    this.x = x;
    this.y = initialY;
    //this.wasCollided = false;
    //console.log("disparo")
  }
  move(){
    if(this.y + this.h < 0 || canShoot){
      canShoot = true;
      this.y = myPlayer.y;
      this.x = myPlayer.x;
    }else {
      this.y -= bulletSpeed;
    }
  }
  drawBullet(){
    if(!canShoot){
      ctx.fillStyle = "white";
      ctx.fillRect(this.x,this.y,this.w,this.h);
    }
  }
}
class PlayerLifes {
  constructor(x,y) {
    this.x = x; this.y = y;
    this.lives = 1;
  }
  assignLifes(lives){
    this.lives = lives;
  }
  drawLives(){

    for(var i = 0; i<this.lives-1; i++){
      ctx.drawImage(playerImage,this.x+40*i,this.y,lifesWidth,lifesHeight);
    }

    //ctx.drawImage(playerImage,this.x,this.y,lifesWidth,lifesHeight);
  }
}
class ShieldPart extends Object {
  constructor(x,y,w,h,image) {
    super(x,y,w,h);
    //this.image = new Image();
    this.image=image;
    this.resistance = 16;
  }
  takeDamage(){
    if(this.resistance>0)
    this.resistance-=1;
  }
  draw(x,y){
    this.x = x; this.y = y;
    switch (this.resistance) {
      case 16:ctx.drawImage(this.image,0,0,64,64,this.x,this.y,this.w,this.h);
      break;
      case 15:ctx.drawImage(this.image,0,0,64,64,this.x,this.y,this.w,this.h);
      break;
      case 14:ctx.drawImage(this.image,64,0,64,64,this.x,this.y,this.w,this.h);
      break;
      case 13:ctx.drawImage(this.image,64,0,64,64,this.x,this.y,this.w,this.h);
      break;
      case 12:ctx.drawImage(this.image,128,0,64,64,this.x,this.y,this.w,this.h);
      break;
      case 11:ctx.drawImage(this.image,128,0,64,64,this.x,this.y,this.w,this.h);
      break;
      case 10:ctx.drawImage(this.image,192,0,64,64,this.x,this.y,this.w,this.h);
      break;
      case 9:ctx.drawImage(this.image,192,0,64,64,this.x,this.y,this.w,this.h);
      break;
      case 8:ctx.drawImage(this.image,256,0,64,64,this.x,this.y,this.w,this.h);
      break;
      case 7:ctx.drawImage(this.image,256,0,64,64,this.x,this.y,this.w,this.h);
      break;
      case 6:ctx.drawImage(this.image,320,0,64,64,this.x,this.y,this.w,this.h);
      break;
      case 5:ctx.drawImage(this.image,320,0,64,64,this.x,this.y,this.w,this.h);
      break;
      case 4:ctx.drawImage(this.image,384,0,64,64,this.x,this.y,this.w,this.h);
      break;
      case 3:ctx.drawImage(this.image,384,0,64,64,this.x,this.y,this.w,this.h);
      break;
      case 2:ctx.drawImage(this.image,448,0,64,64,this.x,this.y,this.w,this.h);
      break;
      case 1:ctx.drawImage(this.image,448,0,64,64,this.x,this.y,this.w,this.h);
      break;
      default:
    }

  }
}
class Shield {
  constructor(x,y) {
    this.x=x; this.y=y;
    this.shieldParts = new Array();
  }
  Collision(){
    for(var i = 0; i < this.shieldParts.length; i++){
      if((this.shieldParts[i].Collision(bullet)||this.shieldParts[i].Collision(alienBullet))&&this.shieldParts[i].resistance>0){
        this.shieldParts[i].resistance-=1;
        if(this.shieldParts[i].Collision(bullet)){
          canShoot = true;
        }else {
          alienBcanShoot = true;
        }
      }
    }
  }
  draw(){
    //ctx.strokeStyle = "white";
    //ctx.strokeRect(this.x,this.y,shieldW*3,shieldH*2);
    //
    //if(this.shieldParts[0]!=null)
    this.shieldParts[0].draw(this.x,this.y+shieldH);
    //if(this.shieldParts[0]!=null)
    this.shieldParts[1].draw(this.x,this.y);
    //if(this.shieldParts[0]!=null)
    this.shieldParts[2].draw(this.x+shieldW,this.y);
    //if(this.shieldParts[0]!=null)
    this.shieldParts[3].draw(this.x+shieldW*2,this.y);
    //if(this.shieldParts[0]!=null)
    this.shieldParts[4].draw(this.x+shieldW*2,this.y+shieldH);
  }
}
class Alien extends Object {
  constructor(x,y,w,h) {
    super(x,y,w,h);
    this.x += xOffset;
    this.y += yOffset;
    this.w -= wOffset;
    this.h -= hOffset;
    //this.bullet = new AlienBullet(this.x,this.y,alienBwidth,alienBheigth);
    this.delay = 0;
    this.delayDead = 0;
    this.killAlien = false;
    this.isDead = false;
    this.figure = 0;
    //this.dir = alienSpeed;
    this.goDown = false;
  }
  outOfLimit(){
    if(this.y+this.h>limith+offsety){
      finishGame();
    }
    if(this.x+alienDir < limitx || this.x+this.w+alienDir > limitw+limitx){
      return true;
    }else {
      return false;
    }
  }
  dead(){
    this.killAlien = true;
    aliens--;
    updateScore(alienPoint);
    console.log("Aliens: "+aliens);
  }
  changeDirection(){
    alienDir = (alienDir==alienSpeed?-alienSpeed:alienSpeed);
    //if(!this.isDead)console.log(alienDir);console.log(alienSpeed);
    this.goDown = true;
  }
  shoot(){
    alienBullet.shoot(this.x+13,this.y+6);
  }
  Move = function(){
    if(!this.killAlien){
      if(this.delay<=alienTimer){
        this.delay++;
      }else {
        if(this.goDown){
          this.y+=30;
          this.delay = 0;
          this.figure = (this.figure==0?1:0)
          this.goDown = false;
          //console.log(this.x+this.w);
        }else {
          this.x+=alienDir;
          this.delay = 0;
          this.figure = (this.figure==0?1:0)
        }
      }
      switch (this.figure) {
        //imagen 0
        case 0:ctx.drawImage(alienImage,0,0,128,128,this.x-xOffset,this.y-yOffset,this.w+wOffset,this.h+hOffset);
        break;
        //imagen 1
        case 1:ctx.drawImage(alienImage,128,0,128,128,this.x-xOffset,this.y-yOffset,this.w+wOffset,this.h+hOffset);
        break;
        default:
        break;
      }
    }else {
      if(this.delayDead <= 10){
        ctx.drawImage(alienImage,256,0,128,128,this.x-xOffset,this.y-yOffset,this.w+wOffset,this.h+hOffset);
        this.delayDead++;
      }else {
        this.isDead = true;
      }
    }
  }
  draw = function(){

    ctx.strokeStyle = "green";
    ctx.strokeRect(this.x-xOffset,this.y-yOffset,this.w+wOffset,this.h+hOffset);
    ctx.strokeStyle = "white";
    ctx.strokeRect(this.x,this.y,this.w,this.h);
    //ctx.drawImage(alienImage,0,0,128,128,this.x-xOffset,this.y-yOffset,this.w+wOffset,this.h+hOffset);
  }
}
class AlienBullet extends Object {
  constructor(x,y,w,h) {
    super(x,y,w,h);
    //this.canShot = true;
  }
  shoot(x,y){
    this.x=x; this.y=y;
    alienBcanShoot = false;
  }
  move(){
    if(this.y+this.h > limitBulletAlien){
      this.y = -10;
      alienBcanShoot = true;
    }else {
      this.y+=alienBspeed;
    }
  }
  drawBullet(){
    if(!alienBcanShoot){
      ctx.fillStyle = "green";
      ctx.fillRect(this.x,this.y,this.w,this.h);
    }
  }
}
class Ship extends Object {
  constructor(x,y,w,h) {
    super(x,y,w,h);
    this.y += shipYoffset;
    this.h -= shipHoffset;
    this.canMove = true;
    this.timeForChangeImage = 3;
    this.animationDelay = 0;
    this.posXshipImage = 0;
    this.timerForInstance = 60;
  }
  takePoints(){
    updateScore(getAleatoryNumber(50,250));
  }
  setRandomInstance(){
    this.canMove = true;
    this.timerForInstance = getAleatoryNumber(600,960);
  }
  move(){
    if(this.timerForInstance<=0){
      this.setRandomInstance();
    }else {
      this.timerForInstance--;
    }
    if(this.x+this.w>0 && this.canMove){
      this.x-=shipSpeed;
    }else {
      this.canMove = false;
      this.x = staticPos;
    }
  }
  animationShip(){
    if(this.animationDelay>=this.timeForChangeImage){
      if(this.posXshipImage==256){
        this.posXshipImage = 0;
        //console.log("a");
        //ctx.drawImage(shipImage,this.posXshipImage,0,64,64,this.x,this.y-shipYoffset,this.w,this.h+shipHoffset);
      }else {
        this.posXshipImage+=64;
        //ctx.drawImage(shipImage,this.posXshipImage,0,64,64,this.x,this.y-shipYoffset,this.w,this.h+shipHoffset);
      }
      this.animationDelay = 0;
    }else {
      this.animationDelay++;
    }
    ctx.drawImage(shipImage,this.posXshipImage,0,64,64,this.x,this.y-shipYoffset,this.w,this.h+shipHoffset);
  }
  draw(){
    //ctx.drawImage(shipImage,0,0,64,64,this.x,this.y-shipYoffset,this.w,this.h+shipHoffset);
    this.animationShip();
    //ctx.strokeStyle = "white";
    //ctx.strokeRect(this.x,this.y,this.w,this.h);
  }
}
class StartButton {
  constructor(x,y,w,h) {
    this.x = x; this.y = y;
    this.w = w; this.h = h;
    this.text = ""; this.color = "white";
    this.fontSize = "10";
    this.textX; this.textW;
  }
  onClickButton(e){
    var pos = ajustMousePos(e.clientX,e.clientY);
    var x = pos.x;
    var y = pos.y;
    //console.log("x: "+Math.round(x)+" y:"+Math.round(y));
    if((x>startButtonX)&&(x<startButtonX+startButtonW)&&(y>startButtonY)&&(y<startButtonY+startButtonH)){
      console.log("has tocado el boton");
      startGame();
    }
  }
  enabled(ena){
    if(ena){
      canvas.addEventListener("click",this.onClickButton,false);
      this.onMouseMove(true);
    }else {
      canvas.removeEventListener("click",this.onClickButton,false);
      this.onMouseMove(false);
    }
  }
  onMouseMove(ena){
    if(ena){
      canvas.onmousemove = function(e){
        var pos = ajustMousePos(e.clientX,e.clientY);
        var x = pos.x;
        var y = pos.y;
        //console.log("x: "+Math.round(x)+" y:"+Math.round(y));
        if((x>startButtonX)&&(x<startButtonX+startButtonW)&&(y>startButtonY)&&(y<startButtonY+startButtonH)){
          console.log("estas sobre el boton");
          startButton.view("yellow");
        }else {
          startButton.view("white");
        }
      }
    }else {
      canvas.onmousemove = null;
    }
  }
  writeText(text, fontSize = 10, color = "white"){
    this.text = text; this.color = color;
    this.fontSize = String(fontSize);
    this.textW = (Number(fontSize)*this.text.length)/2;
    this.textX = this.x + ((this.w-this.textW)/2);
  }
  view(colorText = this.color){
    this.color = colorText;
    ctx.clearRect(this.x,this.y,this.w,this.h);
    ctx.fillStyle = this.color;
    ctx.font = "bold "+this.fontSize+"px Rosewood Std";
    ctx.fillText(this.text, this.textX, this.y+this.h);
    //console.log(this.text.length);
  }
  viewBox(){
    ctx.strokeStyle = "white";
    ctx.strokeRect(this.x, this.y, this.w, this.h);
    ctx.strokeStyle = "white";
    ctx.strokeRect(this.x, this.y, this.w/2, this.h);
  }
}
class RestartButton extends StartButton {
  constructor(x,y,w,h) {
    super(x,y,w,h);
  }
  onClickButton(e){
    var pos = ajustMousePos(e.clientX,e.clientY);
    var x = pos.x;
    var y = pos.y;
    //console.log("x: "+Math.round(x)+" y:"+Math.round(y));
    if((x>restartButtonX)&&(x<restartButtonY+restartButtonW)&&(y>restartButtonY)&&(y<restartButtonY+restartButtonH)){
      console.log("has tocado el boton");
      restartButton.enabled(false);
      waves = 1;
      setTimeout("restartGame()",2000);
    }
  }
  onMouseMove(ena){
    if(ena){
      canvas.onmousemove = function(e){
        var pos = ajustMousePos(e.clientX,e.clientY);
        var x = pos.x;
        var y = pos.y;
        //console.log("x: "+Math.round(x)+" y:"+Math.round(y));
        if((x>restartButtonX)&&(x<restartButtonY+restartButtonW)&&(y>restartButtonY)&&(y<restartButtonY+restartButtonH)){
          console.log("estas sobre el boton");
          restartButton.color = "yellow";
          //restartButton.view("yellow");
        }else {
          restartButton.color = "white";
          //restartButton.view("white");
        }
      }
    }else {
      canvas.onmousemove = null;
    }
  }
}
//FUNCIONES DEL JUEGO

//Funciones del score
function viewScore() {
  ctx.fillStyle = "white";
  ctx.font = "bold 25px Rosewood Std";
  ctx.fillText("Score: "+score, 15, 35);
  ctx.fillStyle = "white";
  ctx.font = "bold 25px Rosewood Std";
  ctx.fillText("High Score: "+highScore, 550, 35);
}
function updateScore(amount) {
  score += amount;
}
function finishGame() {
  gameOver = true;
  restartButton.enabled(true);
}
//loadind screen
function loadingGame() {
  ctx.clearRect(0,0,canvasWidth,canvasHeight);
  ctx.fillStyle = "#5FFF1A";
  ctx.font = "bold 50px Rosewood Std";
  ctx.fillText("Loading Game", 250, 300);
  setTimeout("StartingScreen()",1500);
}
//pantalla de inicio
function StartingScreen() {
  ctx.clearRect(0,0,canvasWidth,canvasHeight);
  ctx.fillStyle = "#5FFF1A";
  ctx.font = "bold 100px Rosewood Std";
  ctx.fillText("Space Invaders", 75, 275);
  //startButton.viewBox();
  startButton.view();
  startButton.enabled(true);
  //startButton.onMouseMove(true);
  //startButton.onMouseMove();
  //canvas.addEventListener("click",startButton.onClickButton,false);
}
//funcion del gameOver
function Gameover() {
  var lon = (canvasWidth-(55*9))/2;
  var lon2 = (canvasWidth-(55*8))/2;
  ctx.clearRect(0,0,canvasWidth,canvasHeight);
  ctx.fillStyle = "red";
  ctx.font = "bold 100px Rosewood Std";
  ctx.fillText("Game Over", lon, 275);
  //restartButton
  //tartButton.viewBox();
  restartButton.view();
  //restartButton.enabled(true);
  //
  ctx.fillStyle = "white";
  ctx.font = "bold 25px Rosewood Std";
  ctx.fillText("Score: "+score,250,400);
  ctx.fillText("High Score: "+highScore,250,435);

  //ctx.fillText("Vuelve A Cargar La pagina Para Jugar", lon2, 325);
}
//inicar la partida
function startGame() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = "#5FFF1A";
  ctx.font = "bold 60px Rosewood Std";
  ctx.fillText("Ready Player One", (canvas.width-((16*60)/2))/2, 285);
  ctx.font = "bold 30px Rosewood Std";
  ctx.fillText(waveText,(canvas.width-((waveText.length*30)/2))/2,335);
  startButton.enabled(false);
  setTimeout("animation()",1500);
}
function restartGame() {
  //restartButton.enabled(false);
  //
  alienSpeed = initalAlienSpeed
  alienDir = alienSpeed;
  alienTimer = initialAlienTimer;
  aliens = 0;
  alien_Array = [];
  //console.log(alien_Array.length);
  //aliens
  for(var r = 0; r < ROWS; r++){
    for(var c = 0; c < COLUMNS; c++){
      alien_Array.push(new Alien(offsetx+45*c,offsety+30*r,alienWidth,alienHeight))
      aliens++;
    }
  }
  aliensForChangeDificult = aliens-subtractionOfAliens;
  console.log("Aliens: "+aliens);
  console.log("Aliens for Change dificult: "+aliensForChangeDificult);
  //ship
  ship = new Ship(staticPos,50,shipW,shipH);
  //player and others
  myPlayer = new Player(canvas.width/2,0,playerwidth,playerHeight);
  myLifes = new PlayerLifes(lifesPostitionX,lifesPostitionY);
  playerLifes = initialPlayerLifes;
  myLifes.assignLifes(playerLifes);
  score = 0;
  bullet = new PlayerBullet(canvas.width/2+20,initialY,bulletWidth,bulletHeight);
  alienBullet = new AlienBullet(0,0,alienBwidth,alienBheigth);
  //shields
  createNewShields();
  //
  gameOver = false;
}
//iniciar una nueva oleada
function newWave() {
  alienSpeed = initalAlienSpeed
  alienDir = alienSpeed;
  alienTimer = initialAlienTimer;
  aliens = 0;
  alien_Array = [];
  //
  for(var r = 0; r < ROWS; r++){
    for(var c = 0; c < COLUMNS; c++){
      alien_Array.push(new Alien(offsetx+45*c,offsety+30*r,alienWidth,alienHeight))
      aliens++;
    }
  }
  aliensForChangeDificult = aliens-subtractionOfAliens;
  console.log("Aliens: "+aliens);
  console.log("Aliens for Change dificult: "+aliensForChangeDificult);
  //ship
  ship = new Ship(staticPos,50,shipW,shipH);
  //player and others
  //myPlayer = new Player(canvas.width/2,0,playerwidth,playerHeight);
  //myLifes = new PlayerLifes(lifesPostitionX,lifesPostitionY);
  //playerLifes = initialPlayerLifes;
  //myLifes.assignLifes(playerLifes);
  //score = 0;
  //bullet = new PlayerBullet(canvas.width/2+20,initialY,bulletWidth,bulletHeight);
  alienBullet = new AlienBullet(0,0,alienBwidth,alienBheigth);
  //shields
  createNewShields();
  //
  //gameOver = false;
}
function screenWave() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = "#5FFF1A";
  ctx.font = "bold 40px Rosewood Std";
  ctx.fillText(waveText,(canvas.width-((waveText.length*40)/2))/2,300);
}
function viewWaves() {

  if(delayForSeeWave <= 120){
    if(delayForSeeWave == 0){
      waves += 1;
      waveText = "Wave "+waves;
    }else if (delayForSeeWave > 0) {
      screenWave();
    }
    delayForSeeWave++;
  }else {
    delayForSeeWave=0;
    newWave();
    //console.log("empezar el juego");
  }

}
//funciones para la dificultad del juego
function changeAlienSpeed(newSpeed) {
  alienSpeed = newSpeed;
  alienDir = (alienDir<0?-alienSpeed:alienSpeed);


}
function ChangeDificultGame() {
  if(aliens == 1){
      alienTimer = lastAlienTimer;
      changeAlienSpeed(lastAlienSpeed);
  }else {
    if(aliens == aliensForChangeDificult){
      aliensForChangeDificult = aliens - subtractionOfAliens;
      alienTimer-=restTimer;
      //restTimer-=6;
      console.log("alienTimer: "+alienTimer);
      console.log("restTimer: "+restTimer);
      if(delayForIncrease>=delayForIncreaseSpeedAlien){
        changeAlienSpeed(alienSpeed+=2);
        console.log(alienSpeed);
        delayForIncrease = 0;
      }else {
        delayForIncrease++;
      }
      console.log("Aliens: "+aliens);
      console.log("Aliens for Change dificult: "+aliensForChangeDificult);
    }
  }
}

//funciones de las colisiones de los aliens
function gameCollision() {

  if(bullet.Collision(alienBullet)){
    canShoot = true;
    alienBcanShoot = true;
    console.log("Han chocado las balas");
  }

  CollsionShields();

  if(alienBullet.Collision(myPlayer) && aliens > 0){
    alienBcanShoot = true;
    playerLifes-=1;
    myLifes.assignLifes(playerLifes);
    if(playerLifes<=0){
      finishGame();
    }
    //console.log("te han disparado");
  }
  //detectamos colisiones con la bala
  for (var i = 0; i < alien_Array.length; i++) {
    if(!alien_Array[i].isDead){
      if(alien_Array[i].Collision(bullet)){
        canShoot = true;
        alien_Array[i].dead();
        //console.log("ha colisionado el enemigo "+i);
        }
      }
    }

    if(ship.Collision(bullet)){
      ship.takePoints();
      ship.canMove = false;
    }

}
function changeAlienDirection() {
  for(var i = 0; i < alien_Array.length; i++){
    alien_Array[i].changeDirection();
  }
}
function verifyAlienLimits() {
  for(var i = 0; i< alien_Array.length; i++){
    if(alien_Array[i].outOfLimit() && !alien_Array[i].isDead){
      changeAlienDirection();
      console.log("outOfLimit");
      break;
    }
  }
}

//funciones para el disparo de los aliens
function assignAlienShot() {
  do{
    indexAlienArray = getAleatoryNumber(0,alien_Array.length-1);
  }while(alien_Array[indexAlienArray].isDead);
  return indexAlienArray;
}
function AlienShots() {
  if(alienBcanShoot && aliens > 0){
    //assignAlienShot();
    alien_Array[assignAlienShot()].shoot();

  }else if (aliens == 0) {
    console.log("Ya no hay aliens");
  }
}
function getAleatoryNumber(min,max) {
  return Math.round(Math.random() * (max-min) + min);
}
function viewLimits() {
  ctx.strokeStyle = "white";
  ctx.strokeRect(limitx, limity, limitw, limith);
  ctx.strokeStyle = "green";
  ctx.strokeRect(0, 540, canvasWidth, 540);
  ctx.strokeStyle = "white";
  ctx.strokeRect(0, limitBulletAlien, canvasWidth, limitBulletAlien);
}
function DrawGame() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  //moves
  bullet.move();
  alienBullet.move();
  //draws
  myPlayer.drawPlayer();
  for (var i = 0; i < alien_Array.length; i++) {
    if(!alien_Array[i].isDead){
      alien_Array[i].Move();
      //alien_Array[i].draw();
    }
  }
  ship.move();

  bullet.drawBullet();
  alienBullet.drawBullet();
  drawShields();
  ship.draw();
}

function FrameUpdate() {
  inputEvents();
  DrawGame();
  AlienShots();
  gameCollision();
  verifyAlienLimits();
  myLifes.drawLives();
  ChangeDificultGame();
  viewScore();
  //viewLimits();
}


function inputEvents() {
  if(key[KEY_RIGHT]||key[KEY_D]) myPlayer.Move(playerSpeed);
  if(key[KEY_LEFT]||key[KEY_A]) myPlayer.Move(-playerSpeed);
  if(key[KEY_BAR]) myPlayer.shoot();
}

/**************
LISTENER
**************/
document.addEventListener("keydown",function(e){
	keyPressed = e.keyCode;
	key[e.keyCode] = true;
});
document.addEventListener("keyup",function(e){
	key[e.keyCode] = false;
});

function animation() {
  requestAnimationFrame(animation);
  if(!gameOver && aliens > 0){
  FrameUpdate();
}else if (!gameOver && aliens >= 0) {
  viewWaves();
  //console.log("s");
}else {
  cancelAnimationFrame(animation);
  Gameover();
  //requestAnimationFrame();
  }
}

function LoadShieldImage() {
  CreateShields();
  for(var i = 0; i<ShieldImageDir.length; i++){
    ShieldImage[i] = new Image();
    ShieldImage[i].src = ShieldImageDir[i];
    ShieldImage[i].onload = function() {
      for(var s = 0; s<shield_Array.length; s++){
        for(var j=0;j<5;j++){
          shield_Array[s].shieldParts.push(new ShieldPart(0,0,shieldW,shieldH,ShieldImage[j]));
        }
      }
    }
  }
  //drawShields();
}
function CreateShields() {
  for(var i = 0; i<shield_Array.length; i++){
    shield_Array[i] = new Shield(100+170*i,440);
  }
}
function createNewShields() {
  CreateShields();
  for(var s = 0; s<shield_Array.length; s++){
    for(var j=0;j<5;j++){
      shield_Array[s].shieldParts.push(new ShieldPart(0,0,shieldW,shieldH,ShieldImage[j]));
    }
  }
}
function drawShields() {
  for(var i = 0; i<shield_Array.length; i++){
    shield_Array[i].draw();
  }
}
function CollsionShields() {
  for(var i = 0; i < shield_Array.length; i++){
    shield_Array[i].Collision();
  }
}

function ajustMousePos(xx, yy) {
  var posCanvas = canvas.getBoundingClientRect();
	var x = xx - posCanvas.left;
	var y = yy - posCanvas.top;
	return {x:x, y:y}
}

window.requestAnimationFrame = (function(){
  return window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  function(callback){window.setTimeout(callback, 17);}
})();

window.cancelAnimationFrame = window.cancelAnimationFrame ||
window.mozCancelAnimationFrame;

window.onload = function() {
  canvas = document.getElementById("myGame");

  if(canvas && canvas.getContext){
    ctx = canvas.getContext("2d");
    if(ctx){

      canvasWidth = canvas.width;
      canvasHeight = canvas.height;
      limitw = canvasWidth - (offsetx*2);
      alienSpeed = initalAlienSpeed
      alienTimer = initialAlienTimer;
      alienDir = alienSpeed;
      startButton = new StartButton(startButtonX,startButtonY,startButtonW,startButtonH);
      startButton.writeText("Start Game",40);
      restartButton = new RestartButton(restartButtonX,restartButtonY,restartButtonW,restartButtonH);
      restartButton.writeText("Play Again",35);
      console.log(limitw);

      alienImage = new Image();
      alienImage.src = dirAlienImage;
      alienImage.onload = function(){
        for(var r = 0; r < ROWS; r++){
          for(var c = 0; c < COLUMNS; c++){
            alien_Array.push(new Alien(offsetx+45*c,offsety+30*r,alienWidth,alienHeight));
            aliens++;
          }
        }
        aliensForChangeDificult = aliens-subtractionOfAliens;
        console.log("Aliens: "+aliens);
        console.log("Aliens for Change dificult: "+aliensForChangeDificult);
        for (var i = 0; i < alien_Array.length; i++) {
          //dibujamos los cuadrados de los aliens
          //alien_Array[i].draw();
        }
      }

      shipImage = new Image();
      shipImage.src = shipImageDir;
      shipImage.onload = function() {
        ship = new Ship(staticPos,50,shipW,shipH);
      }

      playerImage = new Image();
      playerImage.src = dirPlayerImage;
      playerImage.onload = function(){
        myPlayer = new Player(canvas.width/2,0,playerwidth,playerHeight);
        myLifes = new PlayerLifes(lifesPostitionX,lifesPostitionY);
        playerLifes = initialPlayerLifes;
        myLifes.assignLifes(playerLifes);
        bullet = new PlayerBullet(canvas.width/2+20,initialY,bulletWidth,bulletHeight);
        alienBullet = new AlienBullet(0,0,alienBwidth,alienBheigth);
        //myPlayer.drawPlayer();
        //bullet.drawBullet();
        //StartingScreen();
        LoadShieldImage();
        loadingGame();
        //setTimeout("StartingScreen()",1000);
        //setTimeout("animation()",3000)
        //animation();
      }

    }else {
      alert('error al crear tu contexto');
    }
  }
}
