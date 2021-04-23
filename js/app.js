function initCanvas() {
   //declaro mi canvas
   var ctx = document.getElementById('my_canvas').getContext('2d');

   //creo los objetos
   var backgroundImage = new Image();
   var naveImage = new Image();
   var enemiespic1 = new Image();
   var enemiespic2 = new Image();

   //les doy la ruta cn su atributo src
   backgroundImage.src = "image/background-pic.jpg";
   naveImage.src = "image/spaceship-pic.png";
   enemiespic1.src="image/enemigo1.png";
   enemiespic2.src="image/enemigo2.png";

var cW = ctx.canvas.width;
var cH = ctx.canvas.height;

//creo una funcion q retorna un objeto de una nave enemiga
var enemyTemplate = function (options) {
   return{
      id: options.id || '',
      x: options.x || '', //eje x
      y: options.y ||'', //eje y
      w: options.w ||'', //ancho
      h: options.h ||'', //largo
      Image: options.Image || enemiespic1,
   }
}

//creo un arreglo al cual le paso la function convertica en objeto y creo dentro de esta una nave(el ide puede ser el nombre q me de la gana)
var enemies = [
   //grupo 1
   new enemyTemplate({id:"enemy1", x:100, y:-20, w:50, h:30}),
   new enemyTemplate({id:"enemy2", x:225, y:-20, w:50, h:30}),
   new enemyTemplate({id:"enemy3", x:350, y:-20, w:80, h:30}),
   new enemyTemplate({id:"enemy4", x:100, y:-70, w:80, h:30}),
   new enemyTemplate({id:"enemy5", x:225, y:-70, w:50, h:30}),
   new enemyTemplate({id:"enemy6", x:350, y:-70, w:50, h:30}),
   new enemyTemplate({id:"enemy7", x:475, y:-70, w:50, h:30}),
   new enemyTemplate({id:"enemy8", x:600, y:-70, w:80, h:30}),
   new enemyTemplate({id:"enemy9", x:475, y:-20, w:50, h:30}),
   new enemyTemplate({id:"enemy10", x:600, y:-20, w:50, h:30}),

      //grupo 2
      new enemyTemplate({id:"enemy11", x:100, y:-220, w:50, h:30, Image: enemiespic2}),
      new enemyTemplate({id:"enemy12", x:225, y:-220, w:50, h:30, Image: enemiespic2}),
      new enemyTemplate({id:"enemy13", x:350, y:-220, w:80, h:50, Image: enemiespic2}),
      new enemyTemplate({id:"enemy14", x:100, y:-270, w:80, h:50, Image: enemiespic2}),
      new enemyTemplate({id:"enemy15", x:225, y:-270, w:50, h:30, Image: enemiespic2}),
      new enemyTemplate({id:"enemy16", x:350, y:-270, w:50, h:30, Image: enemiespic2}),
      new enemyTemplate({id:"enemy17", x:475, y:-270, w:50, h:30, Image: enemiespic2}),
      new enemyTemplate({id:"enemy18", x:600, y:-270, w:80, h:50, Image: enemiespic2}),
      new enemyTemplate({id:"enemy19", x:475, y:-200, w:50, h:30, Image: enemiespic2}),
      new enemyTemplate({id:"enemy20", x:600, y:-200, w:50, h:30, Image: enemiespic2}),
];

//function q renderiza a los enemigos
var renderEnemies = function (enemyList) {//recivo enemies y la llamo enemyList, por eso puedo entrar a las propiedades del objeto desde drawImage, la function animate une a renderEnemies con enemies
   for(var i =0; i < enemyList.length; i++){
      var enemy = enemyList[i];
      ctx.drawImage(enemy.Image, enemy.x, enemy.y +=.5, enemy.w, enemy.h)
      launcher.hitDetectLowerlevel(enemy)//esta en luncher esta function
   }
}

//mi nave
function Launcher() {
   this.y = 500,
   this.x = cW*.5 - 25,
   this.w = 100,
   this.h=100,
   this.direccion,
   this.bg = "#fff",
   this.misiles = [];

   //con este objeto alimentaremos la function hitDetectLowerlevel, para determinar  si se termon el juego o no(si el enemigo llego abajo)
   this.gameStatus = {
      over: false,
      message: "",
      fillStyle: "#f00",
      font: 'italic bold 36px Arial, sans-serif'
   }

   this.render = function () {
      if(this.direccion === 'left'){
         this.x -= 5;
      }else if(this.direccion === 'right'){
         this.x += 5;
      }else if(this.direccion === 'downArrow'){
         this.y += 5;
      }else if(this.direccion === 'upArrow'){
         this.y -= 5;
      }
      ctx.fillStyle = this.bg;
      ctx.drawImage(backgroundImage, 10, 10);//x,y
      ctx.drawImage(naveImage, this.x, this.y, 100, 90);

      //misiles
      for(var i = 0; i < this.misiles.length; i++){
         var m = this.misiles[i];
         ctx.fillRect(m.x, m.y -= 5, m.w, m.h);//eje x y de el misil, -=5 pq voy al top, ancho y largo
         this.hitDetect(m,i);//referencia a la funcion de colision(misil,indice)
         if(m.y <= 0){//cuando el top d misil sea 0, lo remuevo con el metodo splice(ondice, cantidad q voy a remover)
            this.misiles.splice(i, 1);
         }
      }
      if(enemies.length === 0){
         clearInterval(animateInteval);
         ctx.fillStyle = '#ff0';
         ctx.font = this.gameStatus.font;
         ctx.fillText('You win!!', cW*.5-80,50)
      }
   }//end render

   //matar enemigos
   this.hitDetect = function (m, mi) {
      for(var i = 0; i< enemies.length; i++){
         var e = enemies[i];

         if(m.x <= e.x + e.w && m.x + m.w >= e.x &&
            m.y >= e.y && m.y <= e.y + e.h){//comparo la trayectoria en "x" y "y", de ser oguales, lo remuevo
            enemies.splice(i,1);//uso splice para remover pq es un arreglo
            document.querySelector('.barra').innerHTML = "Destroyed " +e.id;
            console.log(e.id)
         }
      }
   }
   //terminara el juego cuando pierda
   this.hitDetectLowerlevel = function (enemy) {
      if(enemy.y>550){//si el enemigo en el eje y esta por encima de 550
         this.gameStatus.over = true;
         this.gameStatus.message = 'Enemy(s) have passed!';
      }
      //si la nave colisiona con el enemigo
      if((enemy.y  < this.y  +  25  && enemy.y > this.y-25) &&
         (enemy.x  < this.x  +  45  && enemy.x > this.x-45)){//el -25 es para q el enemigo n quede por debajo de la nave
         this.gameStatus.over = true;
         this.gameStatus.message="you Died!!";
      }
      //si el juego se termino, limpio el interval
      if(this.gameStatus.over === true){
         clearInterval(animateInteval);
         ctx.fillStyle = this.gameStatus.fillStyle;
         ctx.font = this.gameStatus.font;

         ctx.fillText(this.gameStatus.message, cW*.5-80, 50);
      }
   }
   
}//end launcher
var launcher = new Launcher();//instancio para renderizar en animate

//limpio el canvas y ejecuto la function
function animate() {
   ctx.clearRect(0, 0, cW, cH);
   launcher.render()
   renderEnemies(enemies)//a la function rendersEnemies le paso el arreglo enemies(enemylist)
}
var animateInteval = setInterval(animate, 6);

//los botones
var  left_btn = document.getElementById("left_btn");
var  fire_btn = document.getElementById("fire_btn");
var right_btn = document.getElementById("right_btn");

//izquierda
left_btn.addEventListener('mousedown', function(event){
   launcher.direccion='left';
});
left_btn.addEventListener('mouseup', function(event){
   launcher.direccion='';
});
//derecha
right_btn.addEventListener('mousedown', function(event){
   launcher.direccion='right';
});
right_btn.addEventListener('mouseup', function(event){
   launcher.direccion='';
});
//boton misil(boton)
fire_btn.addEventListener('mousedown', function(event){
   launcher.misiles.push({
      x: launcher.x + launcher.w*.5,//esta formula es para q el misol salga del centro de la nave
      y:launcher.y,
      w:3,
      h:10
   })
});

//boton misil (tecla spaciadora)
document.addEventListener('keydown', function (event) {
   if(event.keyCode === 32){
      launcher.misiles.push({
         x: launcher.x + launcher.w*.5,//esta formula es para q el misol salga del centro de la nave
         y:launcher.y,
         w:3,
         h:10
      })
   }
})

//capturo los eventos del teclado para mover la nave con los condicionales q hice en render y actualizo la direccion del launcher
//izquierda
document.addEventListener('keydown', function(event){
   if(event.keyCode === 37){
      launcher.direccion = 'left';
      //para q n se salga del canvas
      if(launcher.x < cW*.2 -130){
         launcher.x +=0;
         launcher.direccion ='';
      }
   }
});
document.addEventListener('keyup', function(event){
   if(event.keyCode === 37){
         launcher.x +=0;
         launcher.direccion ='';
      }
});
//derecha
document.addEventListener('keydown', function(event){
   if(event.keyCode === 39){
      launcher.direccion = 'right';
      //para q n se salga del canvas
      if(launcher.x > cW -110){
         launcher.x -=0;
         launcher.direccion ='';
      }
   }
});
document.addEventListener('keyup', function(event){
   if(event.keyCode === 39){
         launcher.x -=0;
         launcher.direccion ='';
      }
});
//Arriba
document.addEventListener('keydown', function(event){
   if(event.keyCode === 38){
      launcher.direccion = 'upArrow';
      //para q n se salga del canvas
      if(launcher.y < cH*.2 -80){
         launcher.y -=0;
         launcher.direccion ='';
      }
   }
});
document.addEventListener('keyup', function(event){
   if(event.keyCode === 38){
         launcher.y -=0;
         launcher.direccion ='';
      }
});
//Abajo
document.addEventListener('keydown', function(event){
   if(event.keyCode === 40){
      launcher.direccion = 'downArrow';
      //para q n se salga del canvas
      if(launcher.y > cH -110){
         launcher.y -=0;
         launcher.direccion ='';
      }
   }
});
document.addEventListener('keyup', function(event){
   if(event.keyCode === 40){
         launcher.y +=0;
         launcher.direccion ='';
      }
});
//reset
document.addEventListener('keydown', function(event){
   if(event.keyCode === 80){
location.reload();
      }
});



};//end initCanvas

window.addEventListener('load', function(event){
   initCanvas()
});