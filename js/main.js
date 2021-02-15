
$(function () {

    $("#begin").hide();
    $(".title").hide();
    $(".buttons").hide();
    $(".key").hide();
    $(".legend").hide();
    $("#startGame").hide();

    $("#begin").delay(50).fadeIn(2000);
    $(".title").delay(250).slideToggle(1500);
    $(".buttons").delay(1000).fadeIn(500);
    $(".key").delay(2500).fadeIn(500);
    $(".legend").delay(5000).fadeIn(500);

    $("#backgroundGame").css("background-image", "url(img/backgroundGameSepia.jpg)");

    $("#startGame")
    .delay(7500)
    .slideToggle("slow")
    .click(start);
});

function restartGame() {
	soundGameover.pause();
	$("#end").remove();
	start();
	
}

function start() {
    $("#backgroundGame").css("background-image", "url(img/backgroundGame.jpg)");

  // =====================================================
  // principais variaveis do jogo
  var game = {};
  var gameEnd = false;
  var key = {
    // valor decimal de cada key
    W: 87,
    S: 83,
    D: 68,
  };
  var canShoot = true;

  var points = 0;
  var saves = 0;
  var losts = 0;
  var actualEnergy = 3;

  game.press = [];

  // movimentação do jogo
  game.timer = setInterval(loop, 30);
  // movimentação inimigo
  var velocity = 5;
  var positionY = parseInt(Math.random() * 334);
  // sons do jogo
  var music = document.getElementById("music");
  var soundShoot = document.getElementById("soundShoot");
  var soundExplosion = document.getElementById("soundExplosion");
  var soundGameover = document.getElementById("soundGameover");
  var soundLost = document.getElementById("soundLost");
  var soundSave = document.getElementById("soundSave");

  // =====================================================
  // animação de inicio
  $("#begin").fadeOut("slow");

  $("#backgroundGame").append(
    "<div id='player' class='player-animation'></div>"
  );
  $("#backgroundGame").append(
    "<div id='enemy1' class='enemy-animation'></div>"
  );
  $("#backgroundGame").append("<div id='enemy2'></div>");
  $("#backgroundGame").append(
    "<div id='friend' class='friend-animation' ></div>"
  );

  $("#backgroundGame").append("<div id='score'></div>");
  $("#backgroundGame").append("<div id='energy'></div>");

  music.addEventListener(
    "ended",
    function () {
      music.currentTime = 0;
      music.play();
    },
    false
  );
  music.play();

  // =====================================================
  // funções do jogo

  $(document).keydown(function (e) {
    game.press[e.which] = true;
  });

  $(document).keyup(function (e) {
    game.press[e.which] = false;
  });

  function movePlayer() {
    if (game.press[key.W]) {
      var top = parseInt($("#player").css("top"));
      $("#player").css("top", top - 15);
      if (top <= 5) {
        $("#player").css("top", (top = 5));
      }
    }

    if (game.press[key.S]) {
      var top = parseInt($("#player").css("top"));
      $("#player").css("top", top + 15);
      if (top >= 434) {
        $("#player").css("top", (top = 434));
      }
    }

    if (game.press[key.D]) {
      shoot();
    }
  }

  function moveEnemy1() {
    positionX = parseInt($("#enemy1").css("left"));
    $("#enemy1").css("left", positionX - velocity);
    $("#enemy1").css("top", positionY);

    if (positionX <= -250) {
      positionY = parseInt(Math.random() * 334);
      $("#enemy1").css("left", 1500);
      $("#enemy1").css("top", positionY);
    }
  }

  function moveEnemy2() {
    positionX = parseInt($("#enemy2").css("left"));
    $("#enemy2").css("left", positionX - 3);

    if (positionX <= -250) {
      $("#enemy2").css("left", 1500);
    }
  }

  function moveFriend() {
    positionX = parseInt($("#friend").css("left"));
    $("#friend").css("left", positionX + 1);

    if (positionX > 1200) {
      $("#friend").css("left", 0);
    }
  }

  function shoot() {
    if (canShoot == true) {
        soundShoot.play();
      canShoot = false;

      shootPos = parseInt($("#player").css("bottom"));
      positionX = parseInt($("#player").css("left"));
      shootX = positionX + 190;
      shootOn = shootPos - 5;
      $("#backgroundGame").append("<div id='shoot'></div");
      $("#shoot").css("bottom", shootOn);
      $("#shoot").css("left", shootX);

      var timeShoot = window.setInterval(executShoot, 15);
    } //Fecha podeAtirar

    function executShoot() {
      positionX = parseInt($("#shoot").css("left"));
      $("#shoot").css("left", positionX + 5);

      if (positionX > 1200) {
        window.clearInterval(timeShoot);
        timeShoot = null;
        $("#shoot").remove();
        canShoot = true;
      }
    } // Fecha executShoot()
  }

  function collide() {
    var collision1 = $("#player").collision($("#enemy1"));
    var collision2 = $("#player").collision($("#enemy2"));
    var collision3 = $("#shoot").collision($("#enemy1"));
    var collision4 = $("#shoot").collision($("#enemy2"));
    var collision5 = $("#player").collision($("#friend"));
    var collision6 = $("#enemy2").collision($("#friend"));

    // player contra o enemy1
    if (collision1.length > 0) {
      actualEnergy--;
      enemy1X = parseInt($("#enemy1").css("left"));
      enemy1Y = parseInt($("#enemy1").css("top"));
      explosionEnemy1(enemy1X, enemy1Y);
      positionY = parseInt(Math.random() * 334);
      $("#enemy1").css("left", 1500);
      $("#enemy1").css("top", positionY);
    }
    // jogador com o enemy2
    if (collision2.length > 0) {
      actualEnergy--;
      enemy2X = parseInt($("#enemy2").css("left"));
      enemy2Y = parseInt($("#enemy2").css("top"));
      explosionEnemy2(enemy2X, enemy2Y);

      $("#enemy2").remove();

      reposEnemy2();
    }

    // Disparo com o enemy1

    if (collision3.length > 0) {
      points = points + 100;
      velocity = velocity + 0.3;

      enemy1X = parseInt($("#enemy1").css("left"));
      enemy1Y = parseInt($("#enemy1").css("top"));

      explosionEnemy1(enemy1X, enemy1Y);
      $("#shoot").css("left", 1500);

      positionY = parseInt(Math.random() * 334);
      $("#enemy1").css("left", 1300);
      $("#enemy1").css("top", positionY);
    }

    // Disparo com o enemy2

    if (collision4.length > 0) {
      points = points + 50;
      velocity = velocity + 0.15;

      enemy2X = parseInt($("#enemy2").css("left"));
      enemy2Y = parseInt($("#enemy2").css("top"));
      $("#enemy2").remove();

      explosionEnemy2(enemy2X, enemy2Y);
      $("#shoot").css("left", 1500);

      reposEnemy2();
    }

    // jogador com amigo

    if (collision5.length > 0) {
      saves++;
        soundSave.play()
      reposFriend();
      $("#friend").remove();
    }

    // amigo com enemy2

    if (collision6.length > 0) {
      losts++;
      friendX = parseInt($("#friend").css("left"));
      friendY = parseInt($("#friend").css("top"));
      explosionFriend(friendX, friendY);
      $("#friend").remove();

      reposFriend();
    }
  }

  function explosionEnemy1(enemy1X, enemy1Y) {
      soundExplosion.play()
    $("#backgroundGame").append("<div id='explosion1'></div");
    $("#explosion1").css("background-image", "url(img/explode.png)");
    var div = $("#explosion1");
    div.css("top", enemy1Y);
    div.css("left", enemy1X);
    div.animate({ width: 200, opacity: 0 }, "slow");

    var timeExplosion = window.setInterval(removeExplosion, 1000);

    function removeExplosion() {
      div.remove();
      window.clearInterval(timeExplosion);
      timeExplosion = null;
    }
  }

  function explosionEnemy2(enemy2X, enemy2Y) {
      soundExplosion.play()
    $("#backgroundGame").append("<div id='explosion2'></div");
    $("#explosion2").css("background-image", "url(img/explode.png)");
    var div2 = $("#explosion2");
    div2.css("top", enemy2Y);
    div2.css("left", enemy2X);
    div2.animate({ width: 200, opacity: 0 }, "slow");

    var timeExplosion2 = window.setInterval(removeExplosion2, 1000);

    function removeExplosion2() {
      div2.remove();
      window.clearInterval(timeExplosion2);
      timeExplosion2 = null;
    }
  }

  function explosionFriend(friendX, friendY) {
      soundLost.play();
    $("#backgroundGame").append(
      "<div id='explosion3' class='friend-explosion'></div"
    );
    $("#explosion3").css("top", friendY);
    $("#explosion3").css("left", friendX);
    var timeExplosion3 = window.setInterval(resetexplosion3, 1000);
    function resetexplosion3() {
      $("#explosion3").remove();
      window.clearInterval(timeExplosion3);
      timeExplosion3 = null;
    }
  }

  function reposEnemy2() {
    var timeCollision4 = window.setInterval(repos4, 5000);

    function repos4() {
      window.clearInterval(timeCollision4);
      timeCollision4 = null;

      if (gameEnd == false) {
        $("#backgroundGame").append("<div id='enemy2'></div");
      }
    }
  }

  function reposFriend() {
    var timeFriend = window.setInterval(repos6, 6000);

    function repos6() {
      window.clearInterval(timeFriend);
      timeFriend = null;

      if (gameEnd == false) {
        $("#backgroundGame").append(
          "<div id='friend' class='friend-animation'></div>"
        );
      }
    }
  }

  function gameOver() {
	gameEnd=true;
	music.pause();
	soundGameover.play();
    $("#backgroundGame").css("background-image", "url(img/backgroundGameBW.jpg)");
	
	window.clearInterval(game.timer);
	game.timer=null;
	
	$("#player").remove();
	$("#enemy1").remove();
	$("#enemy2").remove();
	$("#friend").remove();
	
	$("#backgroundGame").append("<div id='end'></div>");
	
	$("#end").html(`<h1> Game Over </h1><p>Sua pontuação foi: ${points}</p> <div id='reinicia' onClick=restartGame()><h3>Jogar Novamente</h3></div>`);
	}

  function score() {
    $("#score").html(
      `<h2> Pontos: ${points} | Salvos: ${saves} | Perdidos: ${losts} </h2>`
    );
  }

  function energy() {
    if (actualEnergy == 3) {
      $("#energy").css("background-image", "url(img/energy3.png)");
    }

    if (actualEnergy == 2) {
      $("#energy").css("background-image", "url(img/energy2.png)");
    }

    if (actualEnergy == 1) {
      $("#energy").css("background-image", "url(img/energy1.png)");
    }

    if (actualEnergy == 0) {
      $("#energy").css("background-image", "url(img/energy0.png)");

      gameOver();
    }
  }

  function moveBackground() {
    left = parseInt($("#backgroundGame").css("background-position"));
    $("#backgroundGame").css("background-position", left - 1);
  }

  function loop() {
    moveBackground();
    movePlayer();
    moveEnemy1();
    moveEnemy2();
    moveFriend();
    collide();
    score();
    energy();
  }
}
