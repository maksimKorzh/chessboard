var Board = function() {
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
                         '" width="60" height="60" style="font-size: 50px;" onclick="board.make_move(this.id)"></td>'
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
  function update_board()
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
    console.log()
  }
  
  return { 
    loop: function() { return loop(); }
  }
};

var board = Board();
board.loop()









