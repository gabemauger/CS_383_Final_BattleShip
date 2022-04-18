window.onload = function() {

var board1 = new Array(10); // board1 array
var board2 = new Array(10); // board2 array
var piecenum = document.getElementById("piecenum");
var flip = document.getElementById("flip");
var hit = document.getElementById("hitmiss");
var hover = document.getElementById("hover");
var flipd = 0;
var nxtpiece = 1;
const boatsize = [2, 3, 3, 4, 5];


var updatetext = function() {
    piecenum.innerHTML = "Piece: "+ nxtpiece;
    
    if (nxtpiece>5) {
        for (let i = 0; i < 100; i++) {
            var p = document.getElementById("p1"+i);
            p.src = "files/empty5.png";
        }
        piecenum.innerHTML = "";
        flip.innerHTML = "";
        var b = document.getElementById("boatpic");
        b.src = "files/empty5.png";
        hover.src = "files/empty5.png";

    } else {
        piecenum.innerHTML = "Piece: "+ nxtpiece;
        var b = document.getElementById("boatpic");
        b.src = "files/boats"+nxtpiece+".png";
        b.style.width = boatsize[nxtpiece-1]*16*3+'px';

        if (flipd== 0) {
           flip.innerHTML="Horizontal"
        } else {
           flip.innerHTML="Vertical"
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
        board2[i][j] = Math.floor(Math.random() * 4);;
        
	    var plot1 = document.createElement("img");
	    plot1.src = "files/empty4.png";
        plot1.id = "p1"+cnt;
        plot1.style.position = 'fixed'
        plot1.style.width = '48px';
        plot1.style.height = 'auto';
        plot1.style.top = 0 + (48*i) +'px';
        plot1.style.left = 0 + (48*j) +'px';
        plot1.style.imageRendering = 'pixelated'
    
        grid.appendChild(plot1);

        var plot2 = document.createElement("img");
	    plot2.src = "files/empty.png";
        plot2.id = "p2"+cnt;
        plot2.style.position = 'fixed'
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

            var locat = document.getElementById("p1"+parseInt(e.target.id.slice(2, e.target.id.length)));
            let piece = locat.getBoundingClientRect();

            hover.src = "files/boatp"+nxtpiece+".png";
            hover.style.position = 'fixed'
            hover.style.width = boatsize[nxtpiece-1]*16*3+'px';
            hover.style.height = 'auto';
            hover.style.top = piece.top +'px';
            hover.style.left = piece.left +'px';
            hover.style.imageRendering = 'pixelated';
            hover.style.pointerEvents = 'none';
            hover.style.transform = 'rotate(0deg)';

            if (flipd == 1) {
                hover.style.transformOrigin = 'top left';
                hover.style.transform = 'rotate(-90deg)';
                hover.style.top = (piece.top+48)+'px';
            }
            //grid.appendChild(boat);
        });

        plot2.addEventListener("click", function(e) {
            //console.log(e.target.id.slice(2, e.target.id.length));
            p = parseInt(e.target.id.slice(2, e.target.id.length));
            console.log(board2[Math.floor(p/10)][p%10]);
            if (board2[Math.floor(p/10)][p%10] == 1) {
                e.target.src = "files/empty2.png";
                hit.innerHTML="Hit!"
            } else {
                e.target.src = "files/empty3.png";
                hit.innerHTML="Miss!"
            }
        });

        grid2.appendChild(plot2);

        cnt++;
  } // end for j
} // end for i

var place = function(z) {

    if (nxtpiece>5) 
        return;
    

    var locat = document.getElementById("p1"+z);
    let piece = locat.getBoundingClientRect();

    var boat = document.createElement("img");
    boat.src = "files/boats"+nxtpiece+".png";
    boat.id = "boat";
    boat.style.position = 'fixed'
    boat.style.width = boatsize[nxtpiece-1]*16*3+'px';
    boat.style.height = 'auto';
    boat.style.top = piece.top +'px';
    boat.style.left = piece.left +'px';
    boat.style.imageRendering = 'pixelated';
    boat.style.pointerEvents = 'none';


    if (flipd == 1) {
        boat.style.transformOrigin = 'top left';
        boat.style.transform = 'rotate(-90deg)';
        boat.style.top = (piece.top+48)+'px';
    }
    grid.appendChild(boat);

    nxtpiece++;

    updatetext();

}

}