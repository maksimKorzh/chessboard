var Board = function() {
  // piece encoding  
  const P = 1;    // white pawn
  const N = 2;    // white knight
  const B = 3;    // white bishop
  const R = 4;    // white rook
  const Q = 5;    // white queen
  const K = 6;    // white king

  const p = 7;    // black pawn
  const n = 8;    // black knight
  const b = 9;    // black bishop
  const r = 10;   // black rook
  const q = 11;   // black queen
  const k = 12;   // black king
  
  const o = 13;   // "piece" at offboard sqaure
  const e = 0;    // "piece" at empty square
  
  // 0x88 chess board representation & PST scores
  var board = [
      r, n, b, q, k, b, n, r,  0,  0,  5,  5,  0,  0,  5,  0,
      p, p, p, p, p, p, p, p,  5,  5,  0,  0,  0,  0,  5,  5,
      e, e, e, e, e, e, e, e,  5, 10, 15, 20, 20, 15, 10,  5,
      e, e, e, e, e, e, e, e,  5, 10, 20, 30, 30, 20, 10,  5, 
      e, e, e, e, e, e, e, e,  5, 10, 20, 30, 30, 20, 10,  5,
      e, e, e, e, e, e, e, e,  5, 10, 15, 20, 20, 15, 10,  5,
      P, P, P, P, P, P, P, P,  5,  5,  0,  0,  0,  0,  5,  5,
      R, N, B, Q, K, B, N, R,  0,  0,  5,  5,  0,  0,  5,  0
  ];
  
  function draw_board() {
    // create HTML rable tag
    var chess_board = '<table align="center" cellspacing="0">';
    
    // loop over board rows
    for (var row = 0; row < 8; row++)
    {
      // create table row
      chess_board += '<tr>'
      
      // loop over board columns
      for (var col = 0; col < 16; col++)
      {
        // init square
        var square = row * 16 + col;
        
        // make sure square is on board
        if ((square & 0x88) == 0)
          // create table cell
          chess_board += '<td align="center" id="' + square + 
                         '"bgcolor="#' + ( ((col + row) % 2) ? 'aaa' : 'eee') + 
                         '" width="60" height="60" style="font-size: 50px;" ondrop="window.Board().drop(this.id)" ondragover="window.Board().allowDrop(event)" ondragstart="window.Board().drag(event, this.id)"></td>'
      }
      
      // close table row tag
      chess_board += '</tr>'
    }
    
    // close div tag
    chess_board += '</table>';
    
    // render chess board to screen
    document.write(chess_board);
  }

  // update board position (draw pieces)
  function draw_pieces()
  {
    // loop over board rows
    for (var row = 0; row < 8; row++)
    {
      // loop over board columns
      for (var col = 0; col < 16; col++)
      {
        // int square
        var square = row * 16 + col;
        
        // make sure square is on board
        if ((square & 0x88) == 0)
          // draw pieces
          document.getElementById(square).innerHTML = '<img src ="Images/' + (board[square]) +'.gif">';;
      }
    }
  }
  
  function loop() {
    draw_board();
    draw_pieces();
  }
 
  function allowDrop(ev) {
    ev.preventDefault();
    console.log('allow drop')
  }

  function drag(square) {
    //ev.dataTransfer.setData(ev.target.id, ev.target.id);
    console.log('drag', square, event)
    board[square] = 0;
  }

  function drop(square) {
    console.log('drop', square, event.dataTransfer.getData('src'))
    board[square] = P
    draw_pieces();
  }
  
  return { 
    loop: function() { return loop() },
    allowDrop: function(ev) { allowDrop(ev) },
    drag: function(ev) { drag(ev) },
    drop: function(ev) { drop(ev) }
  }
};

var board = Board();
board.loop();










