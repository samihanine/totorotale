//canvas
let canvas = document.getElementById('c1');
let ctx = canvas.getContext('2d');
window.onload = create;

var img = new Image();
img.src = 'Image/Interface/sprite.png';

var img0 = new Image();
img0.src = 'Image/Sprite/heart.png';

var img1 = new Image();
img1.src = 'Image/Sprite/atk.png';

var imgt = new Image();
imgt.src = 'Image/Sprite/test.png';

var sound = {
  mus : new Howl({src: 'son/musique.mp3'}),

  atk : new Howl({src: 'son/snd_laz.wav'}),
  deg : new Howl({src: 'son/snd_damage.wav'}),
  aie : new Howl({src: 'son/snd_hurt1.wav'}),
  sel : new Howl({src: 'son/snd_squeak.wav'}),
  val : new Howl({src: 'son/snd_select.wav'}),
  brk : new Howl({src: 'son/snd_break1.wav'}),
  bkk : new Howl({src: 'son/snd_break2.wav'}),

  vo1 : new Howl({src: 'son/voice1.mp3'}),
  sil : new Howl({src: 'son/silence.mp3'}),
  vo2 : new Howl({src: 'son/voice2.mp3'}),

  end : new Howl({src: 'son/snd_vaporized.wav'}),
};


// -----------------------------------------------------------------------------
// sprite ennemis

// totoro
var sprite1 = {
  img : new Image(),
  ded : new Image(),
  h : 450,
  w : 345,
  ww : 138,
  hh : 180,
  max : 2,
  tick : 800,
}
sprite1.img.src = 'Image/Sprite/Totoro.png';
sprite1.ded.src = 'Image/Sprite/TotoroM.png';

var sprite = [sprite1];

// -------------
// boule
var spriteA1 = {
  img : new Image(),
  h : 15,
  w : 15,
}
spriteA1.img.src = 'Image/Sprite/atk1.png';

// éclaire
var spriteA2 = {
  img : new Image(),
  w : 7.64,
  h : 10,
}
spriteA2.img.src = 'Image/Sprite/atk2.png';

// flèche
var spriteA3 = {
  img : new Image(),
  w : 15,
  h : 15,
}
spriteA3.img.src = 'Image/Sprite/atk3.png';

var spriteA4 = {
  img : new Image(),
  w : 50,
  h : 42,
}
spriteA4.img.src = 'Image/Sprite/atk4.png';

var spAtk = [spriteA1,spriteA2,spriteA3,spriteA4];

// -----------------------------------------------------------------------------

var aff = 1;
var xmax = 600;
var ymax = 450;
var e = window.innerHeight/ymax;


function create(){

  iniFight();
  iniMap();
  iniGo();

  // ----

	update();

}

function changeAff(a){
  iniFight();
  iniMap();
  iniGo();

  aff = a;
}

function update(){

  window.requestAnimationFrame(update);

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  ctx.fillStyle = 'rgb(0,0,0)';
	ctx.fillRect(0, 0, window.innerWidth,window.innerHeight);

  ctx.translate(window.innerWidth/2-((xmax/2)*e), 0)
  ctx.scale(e, e);

  switch(aff){

    case 1 :
      uptdateMap();
    break;

    case 2 :
      uptdateFight();
    break;

    case 3 :
      uptdateGo();
    break;

  }

  ctx.setTransform(1, 0, 0, 1, 0, 0);

}

document.onkeydown = function(event) {

  switch(aff){

    case 1 :
      keyMap();
    break;

    case 2 :
      keyFight();
    break;

    case 3 :
      keyGo();
    break;
  }


}

// -----------------------------------------------------------------------------

var heart;
var zone;
var joueur;
var monstre;
var interface;
var Attaque;

function iniFight() {

  Attaque = [];
  debuge();

  // id actuel enemy
  monstre = Enemy[0];

  interface = {

    text : {
      t : '',
      c : 0,
      d : 0,
      time : 0,
      tick : 50,
    },

    fight : {
      pos : 0,
      v : 6,
      miss : false,
      tick : 1000,
      time : 0,
    },

    atk : {
      img : img1,
      go : 0,
      c : 0,
      time : 0,
      tick : 125,
    },

    choice : {
      max : 4,
      current : 0,
    },

    cbt : {
      tick : 24,
      time : 0,
    },

    reset : function(){
      this.text.t = '';
      this.text.c = 0;
      this.text.d = 0;
      this.text.time = 0;

      this.fight.pos = 0;
      this.fight.miss = false;
      this.atk.go = 0;
      this.atk.c = 0;
      this.atk.time = 0;
    },

  }

  joueur = {
    name : 'Frisk',
    lvl : 1,
    vie : 42,
    viemax : 42,
    atk : 15,
  }

  zone = {
    x : 0,
    y : 0,
    w : 520,
    h : 130,

    xm : 0,
    ym : 0,
    wm : 0,
    hm : 0,

    isDraw : false,

    draw : function(w,h,hh) {
      y = hh || 0;
      zone.x = 300-zone.w/2;
      zone.y = 300-zone.h/2 + y;
      zone.xm = 300-w/2;
      zone.ym = 300-h/2 + y;
      zone.wm = w;
      zone.hm = h;
      v = 10;

      for (var i = 0; i < v; i++) {
        if (zone.xm < zone.x) zone.x -= 1;
        if (zone.xm > zone.x) zone.x += 1;
        if (zone.ym < zone.y) zone.y -= 1;
        if (zone.ym > zone.y) zone.y += 1;
        if (zone.wm < zone.w) zone.w -= 1;
        if (zone.wm > zone.w) zone.w += 1;
        if (zone.hm < zone.h) zone.h -= 1;
        if (zone.hm > zone.h) zone.h += 1;
      }

      ctx.strokeStyle = 'rgb(255,255,255)';
      ctx.lineWidth = 2;
      ctx.strokeRect(zone.x, zone.y, zone.w, zone.h);

      if (zone.xm == zone.x && zone.ym == zone.y && zone.wm == zone.w && zone.hm == zone.h) { zone.isDraw = true; } else { zone.isDraw = false; }
    }
  }

  heart = {
    x : 0,
    y : 0,
    w : 13,
    h : 13,

    v : 2,
    e : 0,
    img : img0,

    update : function() {

      if (this.e > 0) {
        this.e -= 1;
        ctx.drawImage(imgt, this.x, this.y, this.w, this.h);
      } else {
        ctx.drawImage(this.img, this.x, this.y, this.w, this.h);
      }

        if ((keyState[37] || keyState[81])){
            this.gauche();
        }

        if ((keyState[39] || keyState[68])){
            this.droite();
        }

        if ((keyState[38] || keyState[90])) {
            this.haut();
        }

        if ((keyState[40] || keyState[83])) {
            this.bas();
        }

        if (joueur.vie <= 0) {
          sound.mus.pause();
          sound.mus.currentTime = 0;
          ani.time = Date.now();
          aff = 3;
        }

    },

    gauche : function() { this.test(-this.v,0); },

    droite : function() { this.test(this.v,0); },

    bas : function() { this.test(0,this.v); },

    haut : function() { this.test(0,-this.v); },

    test : function(x,y){
      if (this.x+x > zone.x && this.x+x+this.w < zone.x+zone.w && this.y+y > zone.y && this.y+y+this.h < zone.y+zone.h) {
        this.x += x;
        this.y += y;
      }
    },

    pos : function(){
      this.x = zone.xm + zone.wm/2 - this.w/2;
      this.y = zone.ym + zone.hm/2 - this.h/2;
    },

    detect : function(){
      if (this.e == 0) {

        pixel = ctx.getImageData(rposX(this.x+1), rposY(this.y+1), this.w-2, this.h-2);

        t = 0;
        for (var i = 0; i < pixel.data.length; i++) {
          t++;
          if (t == 4) { t = 0 } else {
            if (pixel.data[i] > 200) {
              joueur.vie -= monstre.atk;
              sound.aie.play();
              this.e = 40;
              break;
            }
          }
        }

      }
    },

  }

}

//-----------------------------------------------------


function uptdateFight() {

  if (!sound.mus.playing()) {
    sound.mus.play();
    sound.mus.volume(0.6);
  }

  //iu
  a = '#FF7E24';
  b = '#FF7E24';
  c = '#FF7E24';
  d = '#FF7E24';
  if (interface.choice.current == 1) a = '#FFFF00';
  if (interface.choice.current == 2) b = '#FFFF00';
  if (interface.choice.current == 3) c = '#FFFF00';
  if (interface.choice.current == 4) d = '#FFFF00';

  ctx.lineWidth = 1;
  ctx.strokeStyle = a;
  ctx.strokeRect(40, 400, 100, 40);
  ctx.strokeStyle = b;
  ctx.strokeRect(180, 400, 100, 40);
  ctx.strokeStyle = c;
  ctx.strokeRect(320, 400, 100, 40);
  ctx.strokeStyle = d;
  ctx.strokeRect(460, 400, 100, 40);

  ctx.font = '23px Verdana';
  ctx.textAlign = 'right';
  ctx.fillStyle = a;
  ctx.fillText('FIGHT', 136, 429);
  ctx.fillStyle = b;
  ctx.fillText('ACT', 262, 429);
  ctx.fillStyle = c;
  ctx.fillText('ITEM', 410, 429);
  ctx.font = '22px Verdana';
  ctx.fillStyle = d;
  ctx.fillText('MERCY', 557, 429);

  if (interface.choice.current == 1) { ctx.drawImage(heart.img, 46, 413, heart.w, heart.h); } else { ctx.drawImage(img, 0, 0, 15, 28, 45, 405, 15, 28); }
  if (interface.choice.current == 2) { ctx.drawImage(heart.img, 192, 413, heart.w, heart.h); } else { ctx.drawImage(img, 0, 39, 15, 28, 192, 412, 15, 28); }
  if (interface.choice.current == 3) { ctx.drawImage(heart.img, 330, 413, heart.w, heart.h); } else { ctx.drawImage(img, 0, 67, 15, 28, 330, 408, 15, 28); }
  if (interface.choice.current == 4) { ctx.drawImage(heart.img, 464, 413, heart.w, heart.h); } else { ctx.drawImage(img, 0, 98, 15, 28, 463, 410, 15, 28); }

  // info joueur
  ctx.font = '12px KulminoituvaRegular';
  ctx.fillStyle = 'rgb(255,255,255)';
  ctx.textAlign = 'left';
  ctx.fillText(joueur.name, 40, 388);
  ctx.fillText('LV ' + joueur.lvl, 150, 388);
  ctx.fillText(joueur.vie + ' / ' + joueur.viemax, 280 + joueur.viemax, 388);

  ctx.font = '10px KulminoituvaRegular';
  ctx.fillText('HP', 238, 387);
  ctx.fillStyle = 'rgb(255,0,0)';
  ctx.fillRect(258,376,joueur.viemax,13);
  ctx.fillStyle = 'rgb(255,255,0)';
  ctx.fillRect(258,376,joueur.vie,13);

  //carré vert
  if (monstre.cadre == 1) {
    ctx.strokeStyle = '#3A7748';
    ctx.lineWidth = 1;
    ctx.strokeRect(10, 10, 580, 215);

    ctx.strokeStyle = '#3A7748';
    ctx.lineWidth = 1;
    ctx.strokeRect(10, 10, 580, 215);
    for (var i=1; i<6; i++) {
      ctx.strokeRect(10+96*i, 10, 0.1, 215);
    }
    ctx.strokeRect(10, 112.5, 580, 0.1);
  }

  monstre.draw();

  // A quel étape sommes-nous ?
  switch (monstre.step[monstre.currentstep][0]) {
    // phase de choix libre
    case 0:
      zone.draw(520, 130);
      if (interface.choice.current == 0) interface.choice.current = 1;
      ctx.font = '14px KulminoituvaRegular';
      ctx.fillStyle = 'rgb(255,255,255)';
      ctx.textAlign = 'left';
      if (zone.isDraw) { ctx.fillText('* ' + monstre.text, 50, 265); }
    break;
    // phase de dialogue
    case 1:
      zone.draw(520, 130);

      ctx.fillStyle = 'rgb(255,255,255)';
      ctx.beginPath();
      ctx.moveTo(416, 85);
      ctx.lineTo(380, 95);
      ctx.lineTo(416, 105);
      ctx.fill();

      ctx.fillStyle = 'rgb(255,255,255)';
      roundRect(415,50,155,80,13);

      ctx.font = '14px KulminoituvaRegular';
      ctx.fillStyle = 'rgb(255,255,255)';
      ctx.textAlign = 'left';
      if (zone.isDraw) { ctx.fillText('* ' + monstre.text, 50, 265); }

      if (Date.now() - interface.text.time > interface.text.tick) {
        interface.text.time = Date.now();
        if (interface.text.c < monstre.step[monstre.currentstep][1].length) {
          if (monstre.step[monstre.currentstep][1][interface.text.c] == ' ' || monstre.step[monstre.currentstep][1][interface.text.c] == '/') { sound.sil.play(); } else { sound.vo1.play(); }
          interface.text.t = interface.text.t + monstre.step[monstre.currentstep][1][interface.text.c];
          interface.text.c += 1;
        }
      }

      ctx.font = '9px KulminoituvaRegular';
      ctx.fillStyle = 'rgb(0,0,0)';
      ctx.textAlign = 'left';
      fillTextM(interface.text.t, 423, 69);
    break;
    // phase d'attaque
    case 2:
      zone.draw(520, 130);
      if (zone.isDraw) {

      ctx.drawImage(img, 0, 215, 565, 130, 41, 236, 518, 128);

      n = 'rgb(0,0,0)';
      nn = 'rgb(255,255,255)';
      // -- calcul dégats
      a = (250 - interface.fight.pos)/5;
      if (a < 0) a = (a*-1);
      a = 1 - (a*0.02);
      // -- deplacement du curseur
      if (interface.atk.go == 0) {
        if (interface.fight.pos <= 490) {
          interface.fight.pos += interface.fight.v;
         } else {
          interface.fight.miss = true;
          interface.fight.time = Date.now();
          monstre.step[monstre.currentstep][0] = 4;
        }
      }
      // -- animation d'attaque
      if (interface.atk.go == 1) {
        if (Date.now() - interface.atk.time > interface.atk.tick) {
          interface.atk.time = Date.now();
          interface.atk.c += 1;
          if (n == 'rgb(0,0,0)') { n = 'rgb(255,255,255)'; } else { n = 'rgb(0,0,0)'; }
          if (nn == 'rgb(0,0,0)') { nn = 'rgb(255,255,255)'; } else { nn = 'rgb(0,0,0)'; }
        }

        ctx.drawImage(interface.atk.img,interface.atk.c*25,0,25,120,287.5,50,25,120);

        if (interface.atk.c*25 == interface.atk.img.width) {
          interface.atk.go = 2;
          sound.deg.play();
          if (monstre.vul == 0) { monstre.vie = Math.round(monstre.vie - joueur.atk*a); } else {
            monstre.vul = monstre.vie;
            monstre.vie -= monstre.vie;
          }
          if (monstre.vie < 0) monstre.vie = 0;
        }
      }
      // -- animation de degat recu
      if (interface.atk.go == 2) {

        ctx.font = '20px KulminoituvaRegular';
        ctx.fillStyle = 'rgb(255,0,0)';
        ctx.textAlign = 'center';
        if (monstre.vul == 0) { ctx.fillText(Math.round(joueur.atk*a), 380 + monstre.viemax/2, 99); } else { ctx.fillText(monstre.vul, 380 + monstre.viemax/2, 99); }

        monstre.degat();

      }

      ctx.fillStyle = n;
      ctx.fillRect(40+interface.fight.pos,236,14,128);
      ctx.fillStyle = nn;
      ctx.fillRect(44+interface.fight.pos,239,6,122);
      }
    break;
    // change le texte affiché
    case 3:
      monstre.text = monstre.step[monstre.currentstep][1];
      monstre.vul = monstre.step[monstre.currentstep][2];
      monstre.newstep();
    break;
    // phase de combat
    case 4:
      if (interface.fight.miss == true) {
          ctx.font = '22px KulminoituvaRegular';
          ctx.fillStyle = 'rgb(255,255,255)';
          ctx.textAlign = 'left';
          ctx.fillText('MISS', 360, 70);

         if (Date.now() - interface.fight.time > interface.fight.tick) {
           interface.fight.miss = false;
         }
      }

      zone.draw(zoneX, zoneY, zoneYY);

      if (zone.isDraw) {

        for (i=0; i<Attaque.length; i++){
          Attaque[i].affichage();
          Attaque[i].deplacement();
        }
        for (i=0; i<Attaque.length; i++){
          Attaque[i].end(i);
        }
        if (Attaque.length == 0) monstre.newstep();

        heart.detect();
        heart.update();

      } else {
        heart.pos();
      }
    break;
    // change fin de cbt
    case 5:
      monstre.end = [];
      for (var i = 1; i < monstre.step[monstre.currentstep].length; i++) {
        monstre.end.push(monstre.step[monstre.currentstep][i]);
      }
      monstre.newstep();
    break;
    // mort du monstre
    case 6:
      sound.mus.pause();
      zone.draw(520, 130);
      ctx.font = '14px KulminoituvaRegular';
      ctx.fillStyle = 'rgb(255,255,255)';
      ctx.textAlign = 'left';
      if (zone.isDraw) { ctx.fillText('* ' + monstre.name + ' a perdu.', 50, 265); }

      ctx.fillStyle = 'rgb(255,255,255)';
      ctx.beginPath();
      ctx.moveTo(416, 85);
      ctx.lineTo(380, 95);
      ctx.lineTo(416, 105);
      ctx.fill();
      ctx.fillStyle = 'rgb(255,255,255)';
      roundRect(415,50,155,80,13);

      if (Date.now() - interface.text.time > interface.text.tick) {
        interface.text.time = Date.now();
        if (interface.text.c < monstre.end[interface.text.d].length) {
          if (monstre.end[interface.text.d][interface.text.c] == ' ' || monstre.end[interface.text.d][interface.text.c] == '/') { sound.sil.play(); } else { sound.vo1.play(); }
          interface.text.t = interface.text.t + monstre.end[interface.text.d][interface.text.c];
          interface.text.c += 1;
        }
      }

      ctx.font = '9px KulminoituvaRegular';
      ctx.fillStyle = 'rgb(0,0,0)';
      ctx.textAlign = 'left';
      fillTextM(interface.text.t, 423, 69);
    break;
    // fin du cbt
    case 7:
      zone.draw(520, 130);
      ctx.font = '14px KulminoituvaRegular';
      ctx.fillStyle = 'rgb(255,255,255)';
      ctx.textAlign = 'left';
      if (zone.isDraw) { fillTextM('* Appuyez sur une touche pour revenir au menu /  principal', 50, 265); }

      if (monstre.d > 0) { monstre.d -= 0.05; }
      if (monstre.d <= 0) { monstre.d = 0; }
      monstre.spriteF = 'opacity(' + monstre.d + ')';
    break;
  }


}

//-----------------------------------------------------

function keyFight(){

  if (event.keyCode == 77) {
    if (sound.mus.paused) {
      sound.mus.play();
    } else {
      sound.mus.pause();
    }
  }

  switch (monstre.step[monstre.currentstep][0]) {

    // phase de choix
    case 0:
      if (event.keyCode == 37) {
        interface.choice.current -= 1;
        if (interface.choice.current == 0) interface.choice.current = interface.choice.max;
        sound.sel.play();
      }

      if (event.keyCode == 39) {
        interface.choice.current += 1;
        if (interface.choice.current == interface.choice.max+1) interface.choice.current = 1;
        sound.sel.play();
      }

      if (event.keyCode == 90) {

        if (interface.choice.current == 1) {
           monstre.step[monstre.currentstep][0] = 2;
           interface.choice.current = 0;
           sound.val.play();
        }

      }
    break;
    // phase de dialogue
    case 1:
      if (event.keyCode == 90) {

        if (interface.text.c < monstre.step[monstre.currentstep][1].length) {
          interface.text.t = monstre.step[monstre.currentstep][1];
          interface.text.c = monstre.step[monstre.currentstep][1].length;
        } else {
          monstre.newstep();
        }

      }
    break;
    // phase d'attaque
    case 2:
      if (event.keyCode == 90) {
        if (interface.atk.go == 0) {
          if (interface.fight.pos > 1) {
            sound.atk.play();
            interface.atk.go = 1;
          }
        }

      }

    break;
    // phase de cbt
    case 4:
      if (event.keyCode == 220) {
        Attaque = [];
      }
    break;
    // phase de cbt
    case 6:
      if (event.keyCode == 90) {

        if (interface.text.c < monstre.end[interface.text.d].length) {
          interface.text.t = monstre.end[interface.text.d];
          interface.text.c = monstre.end[interface.text.d].length;
        } else {
          if (interface.text.d < monstre.end.length-1) {
            interface.text.t = '';
            interface.text.c = 0;
            interface.text.d += 1;
          } else {
            sound.end.play();
            monstre.d = 1;
            monstre.step[monstre.currentstep][0] = 7;
          }
        }

      }
    break;
    case 7:
      if (monstre.d <= 0) {
        changeAff(1);
      }
    break;
  }

}

document.onmousedown = function(event) {
  a = Math.round(window.innerWidth/2-((xmax/2)*e));
  xs = Math.round((event.clientX-a)/e);
  ys = Math.round(event.clientY/e);
  xm = event.clientX;
  ym = event.clientY;


  xx = rposX(xs);
}

//-----------------------------------------------------

var Enemy = [];
function AllEnemy(name,sprite,v,c,s,a){
  this.name = name;
  this.sprite = sprite;

  this.atk = a || 4;
  this.spriteX = (xmax-sprite.ww)/2;
  this.spriteY = 10 + 205/2 - sprite.hh/2;
  this.spriteW = sprite.ww;
  this.spriteH = sprite.hh;
  this.spriteF = 'none';

  this.tick = sprite.tick;
  this.time = Date.now();
  this.s = 0;
  this.d = 0;

  this.vie = v;
  this.viemax = v;
  this.v = v;

  this.cadre = c;
  this.text = '...',
  this.currentstep = 0;
  this.step = s;
  this.end = [];
  this.vul = 0;

  this.draw = function(x) {
    if (Date.now() - this.time > this.tick) {
      this.time = Date.now();
      if (this.s == this.sprite.max-1) { this.s = 0; } else { this.s += 1; }
    }
    if (monstre.step[monstre.currentstep][0] < 6) {
      ctx.filter = this.spriteF;
      ctx.drawImage(this.sprite.img, this.s*this.sprite.w, 0, this.sprite.w, this.sprite.h, this.spriteX, this.spriteY, this.spriteW, this.spriteH);
      ctx.filter = 'none';
      this.spriteF = 'none';
    } else {
      ctx.filter = this.spriteF;
      ctx.drawImage(this.sprite.ded, 0, 0, this.sprite.w, this.sprite.h, this.spriteX, this.spriteY, this.spriteW, this.spriteH);
      ctx.filter = 'none';
      this.spriteF = 'none';
    }

  };

  this.degat = function(a){
    this.spriteF = 'opacity(0.8)';

    if (Date.now() - this.time > 50) {
      this.time = Date.now();
      if (this.d == 0) {
        this.d = 1;
        this.spriteX -= 10;
      } else {
        this.d = 0;
        this.spriteX += 10;
      }
    }

    ctx.fillStyle = 'rgb(255,0,0)';
    ctx.fillRect(380,60,this.viemax,10);
    ctx.fillStyle = 'rgb(0,255,0)';
    ctx.fillRect(380,60,this.v,10);
    if (this.v > this.vie) { this.v -= 1; }

    if (Date.now() - interface.atk.time > 1000) {
      if (this.v == this.vie) {
        interface.atk.go = 0;
        monstre.spriteX = (xmax-monstre.sprite.ww)/2;
        if (monstre.vie > 0) { monstre.step[monstre.currentstep][0] = 4; } else { monstre.step[monstre.currentstep][0] = 6; }
      }
    }

  };

  this.newstep = function() {
    interface.reset();

    monstre.currentstep += 1;

    if (monstre.currentstep > monstre.step.length-1) {

      m = [];
      for (var i = 0; i < monstre.step.length; i++) {
        if (monstre.step[i][0] == 4) m.push(monstre.step[i][1])
      }
      m = cleanArray(m);
      m = m[Math.floor(Math.random()*m.length)];
      m = parseInt(m, 10);
      monstre.step.push([0,m]);

    }

    if (monstre.step[monstre.currentstep][0] == 0) combo(monstre.step[monstre.currentstep][1]);

  }

  Enemy.push(this);
}

// ---------
function debuge(){
  Enemy = [];

  var Etape = [
    [3,'Totoro veut se battre.',0],
    [5,'Bon..','Je retourne faire /ma sieste.','Adieu.'],

    [1,'Comment oses-tu me /réveiller ?/Pauvre insolent.'],
    [1,"Prépare-toi à passer /un sale quart /d'heure !"],
    [0,1],
    [1,'Ne pense pas pouvoir /échapper à mes /griffes !'],
    [0,4],
    [1,'Tu vas bientôt avoir /le tournis à bouger /dans tous les sens /comme tu le fais.'],
    [0,3],
    [1,"Essaie d'esquiver ça !"],
    [0,5],
    [1,"Tu commences à /me mettre vraiment /en colère !"],
    [0,2],
    [1,"Tu es bien résistant.."],
    [0,8],
    [1,"Voici une de mes /attaques préférées. /Je l'ai appelée : /La griffe en colère"],
    [0,6],
    [1,"Il est temps d'en /finir."],
    [1,"Personne ne peut /survivre au roi des /Hamsters !"],
    [0,7],
    [3,"Totoro t'épargne.",1],
    [1,"Je ne peux pas /lutter. Tu as gagné."],
  ];
  // nom | sprite | viemax | cadre(1 oui, 0 non) | étapes
  new AllEnemy('Totoro',sprite[0],124,1,Etape);
  // ---------
}
//-----------------------------------------------------

var zoneX;
var zoneY;
var zoneYY;

function combo(x){

  switch (x) {
    case 1:
      v = 2;
      a = 2;
      for(var y=235; y>-2335;y-=100) {
        if (a == 1) a = Random(1,3);
        else if (a == 2) a = Random(1,3);
        else if (a == 3) a = Random(2,4);
        else if (a == 4) a = Random(2,4);

        if (a !== 1) new dAtk(spAtk[0],225,y,v,225,350);
        if (a !== 1) new dAtk(spAtk[0],242,y,v,242,350);
        if (a !== 2) new dAtk(spAtk[0],259,y,v,259,350);
        if (a !== 2) new dAtk(spAtk[0],276,y,v,276,350);
        if (a !== 3) new dAtk(spAtk[0],293,y,v,293,350);
        if (a !== 3) new dAtk(spAtk[0],310,y,v,310,350);
        if (a !== 4) new dAtk(spAtk[0],327,y,v,327,350);
        if (a !== 4) new dAtk(spAtk[0],344,y,v,344,350);
        if (a !== 4) new dAtk(spAtk[0],361,y,v,361,350);

        v += 0.007;
      }

      zoneX = 150;
      zoneY = 130;
      zoneYY = 0;
    break;
    case 2:
      for(var y=235; y>-1700;y-=9) {
        x = Random(225,365);
        new dAtk(spAtk[1],x,y,1.5,x,355);
      }

      zoneX = 150;
      zoneY = 130;
      zoneYY = 0;
    break;
    case 3:
      new torAtk(100, 301, 50, 1.5, 225);
      new torAtk(500, 301, 12, 1.5, 375);

      zoneX = 150;
      zoneY = 60;
    break;
    case 4:
      p = 46;
      v = 3;
      for(var a=0 ; a<p*22;a+=p) {
        x = Random(1,3);

        if (x !== 1) new dAtk(spAtk[3],150,235,v,325,235,a,a+p/2);
        if (x !== 2) new dAtk(spAtk[3],400,277,v,225,277,a,a+p/2);
        if (x !== 3) new dAtk(spAtk[3],150,319,v,325,319,a,a+p/2);
      }

      zoneX = 150;
      zoneY = 130;
      zoneYY = 0;
    break;
    case 5:
      v = 1.4;
      for(var a=0 ; a<1350;a+=16) {
        c = Random(1,3);

        switch (c) {
          case 1:
            y = 218 + Random(1,13)*10;
            new dAtk(spAtk[2],200,y,v,360,y,a);
          break;
          case 2:
            y = 218 + Random(1,13)*10;
            new dAtk(spAtk[2],400,y,v,225,y,a);
          break;
          case 3:
            x = 218 + Random(1,14)*10;
            new dAtk(spAtk[2],x,200,v,x,350,a,0,1);
          break;
        }
      }

      zoneX = 150;
      zoneY = 130;
      zoneYY = 0;
    break;
    case 6:
      p = 150;
      v = 3;
      for(var a=0 ; a<p*9;a+=p) {
        x = Random(1,3);

        if (x !== 1) new dAtk(spAtk[3],150,235,v,325,235,a,a+p/2);
        if (x !== 2) new dAtk(spAtk[3],400,277,v,225,277,a,a+p/2);
        if (x !== 3) new dAtk(spAtk[3],150,319,v,325,319,a,a+p/2);
      }

      for(var y=235; y>-1700;y-=30) {
        x = Random(225,365);
        new dAtk(spAtk[1],x,y,1.5,x,355);
      }

      zoneX = 150;
      zoneY = 130;
      zoneYY = 0;
    break;
    case 7:
      new torAtk(100, 300, 50, 1, 300,300,90,2000,5);

      v = 0.8;
      for(var a=0 ; a<1800;a+=60) {
          x = 218 + Random(1,14)*10;
          new dAtk(spAtk[2],x,150,v,x,350,a,0,1);
      }

      zoneX = 150;
      zoneY = 130;
      zoneYY = 0;
    break;
    case 8:
      v = 2.1;
      a = 3;
      for(var y=235; y>-2735;y-=60) {
        if (a == 1) a = Random(1,2);
        else if (a == 2) a = Random(1,3);
        else if (a == 3) a = Random(2,4);
        else if (a == 4) a = Random(3,4);

        if (a !== 1) new dAtk(spAtk[0],225,y,v,225,343);
        if (a !== 1) new dAtk(spAtk[0],242,y,v,242,343);
        if (a !== 2) new dAtk(spAtk[0],259,y,v,259,343);
        if (a !== 2) new dAtk(spAtk[0],276,y,v,276,343);
        if (a !== 3) new dAtk(spAtk[0],293,y,v,293,343);
        if (a !== 3) new dAtk(spAtk[0],310,y,v,310,343);
        if (a !== 4) new dAtk(spAtk[0],327,y,v,327,343);
        if (a !== 4) new dAtk(spAtk[0],344,y,v,344,343);
        if (a !== 4) new dAtk(spAtk[0],361,y,v,361,343);
      }

      zoneX = 150;
      zoneY = 15;
      zoneYY = 50;
    break;
  }

}

// attaque directionnel
// sprite - pos x - pos y - vitesse x - vitesse y - but x - but y - depart - pause - suivre
function dAtk(sprite, x, y, v, bx, by, dep, pau, hid) {
  this.sprite = sprite;

  this.x = x;
  this.y = y;
  this.vx = x <= bx ? v : -v;
  this.vy = y <= by ? v : -v;

  this.bx = bx || x;
  this.by = by || y;

  this.dep = dep || 0;
  this.pau = pau || 0;
  this.hid = hid || 234;

  this.deplacement = function() {

    if (this.dep == 0 && this.pau == 0) {

      if (this.x !== this.bx) this.x += this.vx;

      if (this.y !== this.by) this.y += this.vy;

    }

    if (this.dep > 0) this.dep -= 1;
    if (this.pau > 0) this.pau -= 1;

  };

  this.affichage = function() {

    if (this.dep == 0 && this.y > this.hid) ctx.drawImage(this.sprite.img,this.x,this.y,this.sprite.w,this.sprite.h);

  }

  this.end = function(i){

    if (this.vx > 0 && this.x >= this.bx && this.y >= this.by) Attaque.splice(i,1);
    if (this.vx < 0 && this.x <= this.bx && this.y >= this.by) Attaque.splice(i,1);

  }

  Attaque.push(this);
}


// attaque qui tourne
function torAtk(x, y, av, v, fx, fy, l, m, ep) {
  this.sprite = sprite;
  this.x = x;
  this.y = y;
  this.fx = fx || x;
  this.fy = fy || y;
  this.v = v;
  this.av = av;
  this.angle = av;
  this.l = l || 75;
  this.m = m || 1500;
  this.ep = ep || 3;

  this.deplacement = function() {
    if (this.x > this.fx) this.x -= 1;
    if (this.x < this.fx) this.x += 1;

    this.angle += this.v;
  };

  this.affichage = function(i) {
    r = this.angle * Math.PI / 180;
    ctx.translate(this.x,this.y)
    ctx.rotate(r);
    ctx.fillStyle = 'rgb(255,255,255)';
    ctx.fillRect(0,0,this.l,this.ep);
    ctx.fillRect(0,0,this.ep,this.l);
    ctx.fillRect(0,0,-this.l,this.ep);
    ctx.fillRect(0,0,this.ep,-this.l);
    ctx.rotate(-r);
    ctx.translate(-this.x,-this.y);
  };

  this.end = function(i){

    if (this.angle - this.av > this.m) { Attaque.splice(i,1); }

  }

  Attaque.push(this);
}

// -----------------------------------------------------------------------------

function iniMap() {



}

function uptdateMap() {
  ctx.strokeStyle = 'rgb(220,220,220)';
  ctx.strokeRect(0,30,600,380);

  ctx.translate(0,10);
  ctx.font = '12px KulminoituvaRegular';
  ctx.fillStyle = 'rgb(220,220,220)';
  ctx.textAlign = 'left';

  fillTextM('* Vous devez appuyer sur [z] pour passer les dialogues.', 9, 60);
  fillTextM('* Vous devez appuyer sur [m] pour couper la musique.', 9, 90);
  fillTextM("* Lorsque vous attaquez, vous devez viser le centre de l'image /  pour infliger un maximum de dégats à votre adversaire.", 9, 120);

  ctx.drawImage(heart.img, 300, 170, heart.w, heart.h);

  fillTextM("* Il s'agit d'un fangame, reprenant la mécanique de combat du jeu/  Undertale.", 9, 215);
  fillTextM("* La musique et les sons utilisés ne m'appartienne pas.", 9, 265);
  fillTextM("* Ce fangame a été réalisé par Sam4AF.", 9, 295);

  ctx.drawImage(heart.img, 300, 315, heart.w, heart.h);

  fillTextM("* Appuyez sur n'importe quelles touches pour commencer.", 9, 360);
  ctx.translate(0,-10);
}

function keyMap() {

  changeAff(2);

}

// -----------------------------------------------------------------------------
var ani;

function iniGo() {

  ani = {
    time : 0,
    tick : 1000,
    s : 0,
    a : 0,

    c : 0,
    t : '',
    text : "N'abandonne pas !/Garde ta détermination !!"
  }

}

function uptdateGo() {

  if (ani.s == 0) ctx.drawImage(heart.img, heart.x, heart.y, heart.w, heart.h);
  if (ani.s == 1) ctx.drawImage(img,19,0,19,16,heart.x-1,heart.y,15,13);

  if (ani.s == 2) {

    if (ani.a < 1) ani.a += 0.01;

    a = 'rgba(255,255,255,' + ani.a + ')';
    ctx.fillStyle = a;
    ctx.font = '90px KulminoituvaRegular';
    ctx.textAlign = 'center';
    ctx.fillText('Game',300,100);
    ctx.fillText('Over',300,190);

    ctx.font = '14px KulminoituvaRegular';
    ctx.fillStyle = 'rgb(220,220,220)';
    ctx.textAlign = 'center';
    fillTextM(ani.t, 300, 290);

    if (ani.c >= ani.text.length) {
      ctx.font = '11px KulminoituvaRegular';
      ctx.fillStyle = 'rgb(255,255,255)';
      ctx.textAlign = 'center';
      ctx.fillText('Appuie sur [z] pour recommencer', 500, 400);
    }

  }

  if (Date.now() - ani.time > ani.tick) {
    if (ani.s == 0) {
      ani.s = 1;
      sound.brk.play();
      ani.time = Date.now();
    }
    else if (ani.s == 1) {
      ani.s = 2;
      sound.bkk.play();
      ani.tick = 50;
      ani.time = Date.now();
    }
    else if (ani.s == 2 && ani.a >= 1) {
      ani.time = Date.now();
      if (ani.c < ani.text.length) {
        ani.t = ani.t + ani.text[ani.c];
        ani.c += 1;
        if (ani.text[ani.c] == ' ' || ani.text[ani.c] == '/') { sound.sil.play(); } else { sound.vo2.play(); }
      }
    }

  }


}

function keyGo() {

  if (event.keyCode == 90) {

    if (ani.c >= ani.text.length) {
      changeAff(2);
    }

  }

}

// -----------------------------------------------------------------------------

function rposX(x){
  a = Math.round(window.innerWidth/2-((xmax/2)*e));
  b = Math.round(x*e);

  return Math.round(b+a);
}

function rposY(y){
  return Math.round(y*e);
}

// -----------------------------------------------------------------------------

function Random(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min +1)) + min;
}

function roundDecimal(nombre, precision){
    var precision = precision || 2;
    var tmp = Math.pow(10, precision);
    return Math.round( nombre*tmp )/tmp;
}

// key controle
let keyState = [];
document.addEventListener(
    'keydown',
    (event)=>{
        keyState[event.keyCode || event.which] = true;
    }
);

document.addEventListener(
    'keyup',
    (event)=>{
        keyState[event.keyCode || event.which] = false;
    }
);

function fillTextM(text, x, y) {
  var lineHeight = ctx.measureText("M").width * 1.2;
  var lines = text.split("/");
  for (var i = 0; i < lines.length; ++i) {
    ctx.fillText(lines[i], x, y); y += lineHeight*1.8;
  }
}

function cleanArray(array) {
  var i, j, len = array.length, out = [], obj = {};
  for (i = 0; i < len; i++) {
    obj[array[i]] = 0;
  }
  for (j in obj) {
    out.push(j);
  }
  return out;
}

function roundRect(x, y, ww, hh, r) {
    if (ww < 2 * r) r = ww / 2;
    if (hh < 2 * r) r = hh / 2;
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.arcTo(x+ww, y, x+ww, y+hh, r);
    ctx.arcTo(x+ww, y+hh, x, y+hh, r);
    ctx.arcTo(x, y+hh, x, y, r);
    ctx.arcTo(x, y, x+ww, y, r);
    ctx.closePath();
    ctx.fill();
  }
