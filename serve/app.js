window.onload = function() {

    var board1 = new Array(10); // board1 array
    var board2 = new Array(10); // board2 array
    var piecenum = document.getElementById("piecenum");
    var flip = document.getElementById("flip");
    var hit = document.getElementById("hitmiss");
    var hover = document.getElementById("hover");
    var flipd = 0;
    var hits = 0;
    var turn = 0;
    var nxtpiece = 1;
    const boatsize = [2, 3, 3, 4, 5];
    var socket = io();
    var sub = document.getElementById("submit");

    sub.addEventListener("click", function(e) {
        var s = document.getElementById("key")
        console.log(s.value);
        socket.emit('gamekey', s.value);
    });

    socket.on('sendarray', function(data) {
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                  board2[i][j] = data[i][j];
            }
        }
    });

    socket.on('sendturn', function(data) {
        if (nxtpiece<6) 
            return
        turn = 1;
        var turntxt = document.getElementById("turn");
        turntxt.innerHTML = "YOUR TURN";
    });

    socket.on('sendhit', function(data, hit) {
        var boardup = document.getElementById("p1"+data);
        boardup.src = "files/empty"+hit+".png";
        boardup.style.zIndex = "1";
    });

    socket.on('sendwin', function(data) {
        var platxt = document.getElementById("place");
        platxt.innerHTML = "YOU LOST!";
        hit.innerHTML = "";
        hits = 17;
        var turntxt = document.getElementById("turn");
        turntxt.innerHTML = "";
    });

    var updatetext = function() {
        piecenum.innerHTML = "PIECE: "+ nxtpiece;
        
        if (nxtpiece==6) {
            for (let i = 0; i < 100; i++) {
                var p = document.getElementById("p1"+i);
                p.src = "files/empty5.png";
            }
            piecenum.innerHTML = "";
            flip.innerHTML = "";
            var b = document.getElementById("boatpic");
            b.src = "files/empty5.png";
            b.style.width = "0px";
            hover.src = "files/empty5.png";
            var platxt = document.getElementById("place");
            platxt.innerHTML = "NOW FIGHT!";
            platxt.style.left = "460px";
            nxtpiece = 7;
    
        } else {
            piecenum.innerHTML = "PIECE: "+ nxtpiece;
            var b = document.getElementById("boatpic");
            b.src = "files/boatn"+nxtpiece+".png";
            b.style.width = boatsize[nxtpiece-1]*16*5+'px';
    
            if (flipd== 0) {
               flip.innerHTML="HORIZONTAL"
            } else {
               flip.innerHTML="VERTICAL"
            }
        }
    }
    
    updatetext();
    
    flip.addEventListener("click", function(e) {
        if (flipd== 0) {
            flipd=1;
        } else {
            flipd=0;
        }
        updatetext();
    });
    
    for (let i = 0; i < 10; i++) {
        board1[i] = new Array(10);
        board2[i] = new Array(10);
    } // end for i
    
    var cnt = 0;
    var grid = document.getElementById("grid1");
    var grid2 = document.getElementById("grid2");
    
    var water1 = document.createElement("img");
    water1.src = "files/water.png";
    water1.id = "water1";
    grid.appendChild(water1);
    
    var water2 = document.createElement("img");
    water2.src = "files/water.png";
    water2.id = "water2";
    grid2.appendChild(water2);
    
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
            board1[i][j] = 0;
          //  board2[i][j] = Math.floor(Math.random() * 4);;
            
            var plot1 = document.createElement("img");
            plot1.src = "files/empty4.png";
            plot1.id = "p1"+cnt;
            plot1.style.position = 'absolute'
            plot1.style.width = '48px';
            plot1.style.height = 'auto';
            plot1.style.top = 0 + (48*i) +'px';
            plot1.style.left = 0 + (48*j) +'px';
            plot1.style.imageRendering = 'pixelated'
        
            grid.appendChild(plot1);
    
            var plot2 = document.createElement("img");
            plot2.src = "files/empty.png";
            plot2.id = "p2"+cnt;
            plot2.style.position = 'absolute'
            plot2.style.width = '48px';
            plot2.style.height = 'auto';
            plot2.style.top = 0 + (48*i) +'px';
            plot2.style.left = 500 + (48*j) +'px';
            plot2.style.imageRendering = 'pixelated'
        
            plot1.addEventListener("click", function(e) {
                //console.log(parseInt(e.target.id.slice(2, e.target.id.length)));
                place(parseInt(e.target.id.slice(2, e.target.id.length)))
            });
    
            plot1.addEventListener("mouseover", function(e) {
                //console.log(parseInt(e.target.id.slice(2, e.target.id.length)));
    
                if (nxtpiece>5)
                    return;
    
                if (check3(parseInt(e.target.id.slice(2, e.target.id.length))))
                    return;

                var red = check2(parseInt(e.target.id.slice(2, e.target.id.length)));
                
                var bboard = document.getElementById("gameboard").getBoundingClientRect();
                var locat = document.getElementById("p1"+parseInt(e.target.id.slice(2, e.target.id.length)));
                let piece = locat.getBoundingClientRect();
    
                offsett = piece.top - bboard.top;
                offsetl = piece.left - bboard.left;
                if (red == true) {
                    hover.src = "files/boatb"+nxtpiece+".png";
                } else 
                    hover.src = "files/boatp"+nxtpiece+".png";
                hover.style.position = 'absolute'
                hover.style.width = boatsize[nxtpiece-1]*16*3+'px';
                hover.style.height = 'auto';
                hover.style.top = offsett +'px';
                hover.style.left = offsetl +'px';
                hover.style.imageRendering = 'pixelated';
                hover.style.pointerEvents = 'none';
                hover.style.transform = 'rotate(0deg)';
    
                if (flipd == 1) {
                    hover.style.transformOrigin = 'top left';
                    hover.style.transform = 'rotate(-90deg)';
                    hover.style.top = (offsett+48)+'px';
                }
                //grid.appendChild(boat);
            });
    
            plot2.addEventListener("click", function(e) {
                //console.log(e.target.id.slice(2, e.target.id.length));
                if (nxtpiece<6 || hits == 17 || turn == 0) 
                    return;
                p = parseInt(e.target.id.slice(2, e.target.id.length));
                console.log(board2[Math.floor(p/10)][p%10]);
                if (board2[Math.floor(p/10)][p%10] == 1) {
                    e.target.src = "files/empty2.png";
                    hit.innerHTML="HIT!"
                    hits++;
                    console.log(hits);
                    socket.emit('hit',p, "2");
                    socket.emit('turn');
                    var turntxt = document.getElementById("turn");
                    turntxt.innerHTML = "THEIR TURN";
                    e.target.style.pointerEvents = 'none';
                    turn = 0;
                    if (hits == 17) {
                        console.log("WIN");
                        var platxt = document.getElementById("place");
                        platxt.innerHTML = "YOU WON!";
                        hit.innerHTML = "";
                        socket.emit('win', document.cookie.substring(8));
                        var turntxt = document.getElementById("turn");
                        turntxt.innerHTML = "";
                    }
                } else {
                    e.target.src = "files/empty3.png";
                    hit.innerHTML="MISS!"
                    socket.emit('hit',p, "");
                    socket.emit('turn');
                    var turntxt = document.getElementById("turn");
                    turntxt.innerHTML = "THEIR TURN";
                    turn = 0;
                }
            });
    
            grid2.appendChild(plot2);
    
            cnt++;
      } // end for j
    } // end for i
    
    var place = function(z) {
    
        if (nxtpiece>5) 
            return;
        
        if (check(z))
            return;

    
        var bboard = document.getElementById("gameboard").getBoundingClientRect();
        var locat = document.getElementById("p1"+z);
        let piece = locat.getBoundingClientRect();
    
        offsett = piece.top - bboard.top;
        offsetl = piece.left - bboard.left;
        var boat = document.createElement("img");
        boat.src = "files/boats"+nxtpiece+".png";
        boat.id = "boat";
        boat.style.position = 'absolute'
        boat.style.width = boatsize[nxtpiece-1]*16*3+'px';
        boat.style.height = 'auto';
        boat.style.top = offsett + 'px';
        boat.style.left = offsetl +'px';
        boat.style.imageRendering = 'pixelated';
        boat.style.pointerEvents = 'none';
    
        console.log(boatsize[nxtpiece-1]);
        console.log(Math.floor(z/10) +" "+ (z%10));
        hover.src = "files/empty5.png";
        if (flipd == 1) {
            boat.style.transformOrigin = 'top left';
            boat.style.transform = 'rotate(-90deg)';
            boat.style.top = (offsett+48)+'px';
            for(let i = 0; i < boatsize[nxtpiece-1]; i++) {
                board1[Math.floor(z/10)-i][(z%10)] = 1;
            }    
        } else {
            for(let i = 0; i < boatsize[nxtpiece-1]; i++) {
                board1[Math.floor(z/10)][(z%10)+i] = 1;
            }
        
        }
    
    
        grid.appendChild(boat);
    
        nxtpiece++;
    
        if (nxtpiece>5) {
            socket.emit('array', board1);
            socket.emit('turn');
        }
        updatetext();
    
    }
    
    var check = function(z) {
        for(let i = 0; i < boatsize[nxtpiece-1]; i++) {
            if (flipd == 1) {
                if (!(Math.floor(z/10)-i > -1 && (z%10) < 10))
                    return true;
                if (board1[Math.floor(z/10)-i][(z%10)] == 1)
                    return true;
            }
            if (flipd == 0) {
                if (!(Math.floor(z/10) > -1 && (z%10)+i < 10))
                    return true;
                if (board1[Math.floor(z/10)][(z%10)+i] == 1)
                    return true;
            }
        }  
        return false;
    }

    var check2 = function(z) {
        for(let i = 0; i < boatsize[nxtpiece-1]; i++) {
            if (flipd == 1) {
                if (board1[Math.floor(z/10)-i][(z%10)] == 1)
                    return true;
            }
            if (flipd == 0) {
                if (board1[Math.floor(z/10)][(z%10)+i] == 1)
                    return true;
            }
        }  
        return false;
    }

    var check3 = function(z) {
        for(let i = 0; i < boatsize[nxtpiece-1]; i++) {
            if (flipd == 1) {
                if (!(Math.floor(z/10)-i > -1 && (z%10) < 10))
                    return true;
            }
            if (flipd == 0) {
                if (!(Math.floor(z/10) > -1 && (z%10)+i < 10))
                    return true;
            }
        }  
        return false;
    }
    
    }