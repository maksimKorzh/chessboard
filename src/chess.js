/************************************************\
 ------------------------------------------------
 
                     JS Chess
 
 ------------------------------------------------
 
         Javascript chess library providing
            chess board widget empowered
            by the chess engine analysis
        that you can embed into your website
          
                        by
                        
                 Code Monkey King
 
 ------------------------------------------------
\************************************************/

// encapsulate engine object
var Chess = function() {
  
  /****************************\
                 
            DEFINITIONS
                 
  \****************************/
  
  // sides to move  
  const white = 0;
  const black = 1;
  
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
  
  // square encoding
  const a8 = 0,    b8 = 1,    c8 = 2,   d8 = 3,   e8 = 4,   f8 = 5,   g8 = 6,   h8 = 7;
  const a7 = 16,   b7 = 17,   c7 = 18,  d7 = 19,  e7 = 20,  f7 = 21,  g7 = 22,  h7 = 23;
  const a6 = 32,   b6 = 33,   c6 = 34,  d6 = 35,  e6 = 36,  f6 = 37,  g6 = 39,  h6 = 40;
  const a5 = 48,   b5 = 49,   c5 = 50,  d5 = 51,  e5 = 52,  f5 = 53,  g5 = 54,  h5 = 55;
  const a4 = 64,   b4 = 65,   c4 = 66,  d4 = 67,  e4 = 68,  f4 = 69,  g4 = 70,  h4 = 71;
  const a3 = 80,   b3 = 81,   c3 = 82,  d3 = 83,  e3 = 84,  f3 = 85,  g3 = 86,  h3 = 87;
  const a2 = 96,   b2 = 97,   c2 = 98,  d2 = 99,  e2 = 100, f2 = 101, g2 = 102, h2 = 103;
  const a1 = 112,  b1 = 113,  c1 = 114, d1 = 115, e1 = 116, f1 = 117, g1 = 118, h1 = 119;
  const no_sq = 120;
  
  // convert board square indexes to coordinates
  const coordinates = [
    'a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8', 'i8', 'j8', 'k8', 'l8', 'm8', 'n8', 'o8', 'p8',
    'a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7', 'i7', 'j7', 'k7', 'l7', 'm7', 'n7', 'o7', 'p7',
    'a6', 'b6', 'c6', 'd6', 'e6', 'f6', 'g6', 'h6', 'i6', 'j6', 'k6', 'l6', 'm6', 'n6', 'o6', 'p6',
    'a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5', 'i5', 'j5', 'k5', 'l5', 'm5', 'n5', 'o5', 'p5',
    'a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4', 'i4', 'j4', 'k4', 'l4', 'm4', 'n4', 'o4', 'p4',
    'a3', 'b3', 'c3', 'd3', 'e3', 'f3', 'g3', 'h3', 'i3', 'j3', 'k3', 'l3', 'm3', 'n3', 'o3', 'p3',
    'a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2', 'i2', 'j2', 'k2', 'l2', 'm2', 'n2', 'o2', 'p2',
    'a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1', 'i1', 'j1', 'k1', 'l1', 'm1', 'n1', 'o1', 'p1'
  ];
  
  // unicode piece representation
  const unicode_pieces = [
    // use dot for empty squares 
    '.',
    
    //  ♙         ♘         ♗         ♖         ♕         ♔  
    '\u2659', '\u2658', '\u2657', '\u2656', '\u2655', '\u2654',
    
    //  ♟︎         ♞         ♝         ♜         ♛         ♚
    '\u265F', '\u265E', '\u265D', '\u265C', '\u265B', '\u265A'
  ];

  // encode ascii pieces
  var char_pieces = {
      'P': P,
      'N': N,
      'B': B,
      'R': R,
      'Q': Q,
      'K': K,
      'p': p,
      'n': n,
      'b': b,
      'r': r,
      'q': q,
      'k': k,
  };
  
  // decode promoted pieces
  var promoted_pieces = {
    [Q]: 'q',
    [R]: 'r',
    [B]: 'b',
    [N]: 'n',
    [q]: 'q',
    [r]: 'r',
    [b]: 'b',
    [n]: 'n'
  };

  // castling bits
  const KC = 1, QC = 2, kc = 4, qc = 8;
  
  
  // castling rights
  var castling_rights = [
     7, 15, 15, 15,  3, 15, 15, 11,  o, o, o, o, o, o, o, o,
    15, 15, 15, 15, 15, 15, 15, 15,  o, o, o, o, o, o, o, o,
    15, 15, 15, 15, 15, 15, 15, 15,  o, o, o, o, o, o, o, o,
    15, 15, 15, 15, 15, 15, 15, 15,  o, o, o, o, o, o, o, o,
    15, 15, 15, 15, 15, 15, 15, 15,  o, o, o, o, o, o, o, o,
    15, 15, 15, 15, 15, 15, 15, 15,  o, o, o, o, o, o, o, o,
    15, 15, 15, 15, 15, 15, 15, 15,  o, o, o, o, o, o, o, o,
    13, 15, 15, 15, 12, 15, 15, 14,  o, o, o, o, o, o, o, o
  ];
  
  // piece move offsets
  var knight_offsets = [33, 31, 18, 14, -33, -31, -18, -14];
  var bishop_offsets = [15, 17, -15, -17];
  var rook_offsets = [16, -16, 1, -1];
  var king_offsets = [16, -16, 1, -1, 15, 17, -15, -17];
  
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
  
  // side to move
  var side = white;

  // enpassant square
  var enpassant = no_sq;

  // castling rights (dec 15 => bin 1111 => both kings can castle to both sides)
  var castle = 15;
  
  // fifty move counter
  var fifty = 0;
  
  // position hash key
  var hash_key = 0;

  // kings' squares
  var king_square = [e1, e8];


  /****************************\
                 
      RANDOM NUMBER GENERATOR
                 
  \****************************/
  
  // pseudo random number state
  var random_state = 1804289383;

  // generate 32-bit pseudo legal numbers
  function random() {
    // get current state
    var number = random_state;
    
    // XOR shift algorithm
    number ^= number << 13;
    number ^= number >> 17;
    number ^= number << 5;
    
    // update random number state
    random_state = number;
    
    // return random number
    return number;
  }


  /****************************\
                 
           ZOBRIST KEYS
                 
  \****************************/
  
  // random piece keys (piece * square)
  var piece_keys = new Array(13 * 128);
  
  // random castle keys
  var castle_keys = new Array(16);
  
  // random side key
  var side_key;
  
  // init random hash keys
  function init_random_keys() {
    // loop over piece codes
    for (var index = 0; index < 13 * 128; index++)
      // init random piece keys
      piece_keys[index] = random();

    // loop over castling keys
    for (var index = 0; index < 16; index++)
      // init castling keys
      castle_keys[index] = random();
        
    // init random side key
    side_key = random();
  }
  
  // generate hash key (unique position ID) from scratch
  function generate_hash_key() {
    // define final hash key
    var final_key = 0;
    
    // loop over board squares
	  for(var square = 0; square < 128; square++) {
		  // make sure square is on board
		  if ((square & 0x88) == 0)
		  {
		    // init piece
		    var piece = board[square];
        
        // if piece available
		    if (piece != e)
		      // hash piece
			    final_key ^= piece_keys[(piece * 128) + square];
		  }		
	  }

    // if white to move
	  if (side == white)
		  // hash side 
		  final_key ^= side_key;
	  
	  // if enpassant is available
	  if (enpassant != no_sq)
	    // hash enpassant square
		  final_key ^= piece_keys[enpassant];
	  
	  // hash castling rights
	  final_key ^= castle_keys[castle];
	  
	  // return final hash key (unique position ID)
	  return final_key;
  }


  /****************************\
                 
          BOARD METHODS
                 
  \****************************/
  
  // print chess board to console
  function print_board() {
    // chess board string
    var board_string = '';
    
    // loop over board ranks
    for (var rank = 0; rank < 8; rank++) {
      // loop over board files
      for (var file = 0; file < 16; file++) {
        // convert file & rank to square
        var square = rank * 16 + file;
        
        // print ranks
        if (file == 0)
          board_string += (8 - rank).toString() + ' ';
        
        // make sure that the square is on board
        if ((square & 0x88) == 0)
        {
          // init piece
          var piece = board[square];
          
          // append pieces to board string
          board_string += unicode_pieces[piece] + ' ';
        }
      }
      
      // append new line to chess board
      board_string += '\n'
    }
    
    // append files to board string
    board_string += '  a b c d e f g h';
    
    // append board state variables
    board_string += '\n\n  Side:     ' + ((side == 0) ? 'white': 'black');
    board_string += '\n  Castling:  ' + ((castle & KC) ? 'K' : '-') + 
                                        ((castle & QC) ? 'Q' : '-') +
                                        ((castle & kc) ? 'k' : '-') +
                                        ((castle & qc) ? 'q' : '-');
                                        
    board_string += '\n  Ep:          ' + ((enpassant == no_sq) ? 'no': coordinates[enpassant]);
    board_string += '\n\n  50 moves:    ' + fifty; 
    board_string += '\n  Key: ' + hash_key;
    
    // print board string to console
    console.log(board_string);
  }
  
  // reset board
  function reset_board() {
    // loop over board ranks
    for (var rank = 0; rank < 8; rank++) {
      // loop over board files
      for (var file = 0; file < 16; file++) {
        // convert file & rank to square
        var square = rank * 16 + file;
                
        // make sure that the square is on board
        if ((square & 0x88) == 0)
          // reset each board square
          board[square] = e;
      }
    }
  
    // reset board state variables
    side = -1;
    enpassant = no_sq;
    castle = 0;
    fifty = 0;
    hash_key = 0;
    king_square = [0, 0];
  }
  
  // parse FEN string to init board position
  function parse_fen(fen) {
    // reset chess board and state variables
    reset_board();
    
    // FEN char index
    var index = 0;
    
    // loop over board ranks
    for (var rank = 0; rank < 8; rank++) {
      // loop over board files
      for (var file = 0; file < 16; file++) {
        // convert file & rank to square
        var square = rank * 16 + file;
           
        // make sure that the square is on board
        if ((square & 0x88) == 0) {
          // match pieces
          if ((fen[index].charCodeAt() >= 'a'.charCodeAt() &&
               fen[index].charCodeAt() <= 'z'.charCodeAt()) || 
              (fen[index].charCodeAt() >= 'A'.charCodeAt() &&
               fen[index].charCodeAt() <= 'Z'.charCodeAt())) {
            // set up kings' squares
            if (fen[index] == 'K')
              king_square[white] = square;
            
            else if (fen[index] == 'k')
              king_square[black] = square;
            
            // set the piece on board
            board[square] = char_pieces[fen[index]];
            
            // increment FEN pointer
            index++;
          }
          
          // match empty squares
          if (fen[index].charCodeAt() >= '0'.charCodeAt() &&
              fen[index].charCodeAt() <= '9'.charCodeAt()) {
            // calculate offset
            var offset = fen[index] - '0';
            
            // decrement file on empty squares
            if (!(board[square]))
                file--;
            
            // skip empty squares
            file += offset;
            
            // increment FEN pointer
            index++;
          }
          
          // match end of rank
          if (fen[index] == '/')
            // increment FEN pointer
            index++;
        }
      }
    }
    
    // go to side parsing
    index++;
    
    // parse side to move
    side = (fen[index] == 'w') ? white : black;
    
    // go to castling rights parsing
    index += 2;
    
    // parse castling rights
    while (fen[index] != ' ') {
      switch(fen[index]) {
        case 'K': castle |= KC; break;
        case 'Q': castle |= QC; break;
        case 'k': castle |= kc; break;
        case 'q': castle |= qc; break;
        case '-': break;
      }
      
      // increment pointer
      index++;
    }
    
    // got to empassant square
    index++;
    
    // parse empassant square
    if (fen[index] != '-') {
      // parse enpassant square's file & rank
      var file = fen[index].charCodeAt() - 'a'.charCodeAt();
      var rank = 8 - (fen[index + 1].charCodeAt() - '0'.charCodeAt());

      // set up enpassant square
      enpassant = rank * 16 + file;
    }
    
    else
      // set enpassant to no square (offboard)
      enpassant = no_sq;
    
    // parse 50 move count
    fifty = Number(fen.slice(index, fen.length - 1).split(' ')[1]);

    // init hash key
    hash_key = generate_hash_key();
  }

  
  /****************************\
                 
          MOVE GENERATOR
                 
  \****************************/
	  
  // print move list
  function print_move_list(move_list) {
    // print table header
    var list_moves = 'Move     Capture  Double   Enpass   Castling\n\n';

    // loop over moves in a movelist
    for (var index = 0; index < move_list.count; index++) {
      var move = move_list.moves[index];
      list_moves += coordinates[get_move_source(move)] + coordinates[get_move_target(move)];
      list_moves += (get_move_piece(move) ? promoted_pieces[get_move_piece(move)] : ' ');
      list_moves += '    ' + get_move_capture(move) +
                    '        ' +get_move_pawn(move) +
                    '        ' + get_move_enpassant(move) +
                    '        ' + get_move_castling(move) + '\n';
    }
    
    // append total moves
    list_moves += '\nTotal moves: ' + move_list.count;
    
    // print move list to console
    console.log(list_moves);
    
  }
  
  /*
      Move formatting
      
      0000 0000 0000 0000 0111 1111       source square
      0000 0000 0011 1111 1000 0000       target square
      0000 0011 1100 0000 0000 0000       promoted piece
      0000 0100 0000 0000 0000 0000       capture flag
      0000 1000 0000 0000 0000 0000       double pawn flag
      0001 0000 0000 0000 0000 0000       enpassant flag
      0010 0000 0000 0000 0000 0000       castling
  */

  // encode move
  function encode_move(source, target, piece, capture, pawn, enpassant, castling) {
    return (source) |
           (target << 7) |
           (piece << 14) |
           (capture << 18) |
           (pawn << 19) |
           (enpassant << 20) |
           (castling << 21)
  }

  // decode move's source square
  function get_move_source(move) { return move & 0x7f }

  // decode move's target square
  function get_move_target(move) { return (move >> 7) & 0x7f }

  // decode move's promoted piece
  function get_move_piece(move) { return (move >> 14) & 0xf }

  // decode move's capture flag
  function get_move_capture(move) { return (move >> 18) & 0x1 }

  // decode move's double pawn push flag
  function get_move_pawn(move) { return (move >> 19) & 0x1 }

  // decode move's enpassant flag
  function get_move_enpassant(move) { return (move >> 20) & 0x1 }

  // decode move's castling flag
  function get_move_castling(move) { return (move >> 21) & 0x1 }

  // is square attacked
  function is_square_attacked(square, side) {
    // pawn attacks
    if (!side) {
      // if target square is on board and is white pawn
      if (!((square + 17) & 0x88) && (board[square + 17] == P))
        return 1;
      
      // if target square is on board and is white pawn
      if (!((square + 15) & 0x88) && (board[square + 15] == P))
        return 1;
    }
    
    else {
      // if target square is on board and is black pawn
      if (!((square - 17) & 0x88) && (board[square - 17] == p))
        return 1;
      
      // if target square is on board and is black pawn
      if (!((square - 15) & 0x88) && (board[square - 15] == p))
        return 1;
    }
    
    // knight attacks
    for (var index = 0; index < 8; index++) {
      // init target square
      var target_square = square + knight_offsets[index];
      
      // lookup target piece
      var target_piece = board[target_square];
      
      // if target square is on board
      if (!(target_square & 0x88)) {
        // if target piece is knight
        if (!side ? target_piece == N : target_piece == n)
          return 1;
      } 
    }
    
    // king attacks
    for (var index = 0; index < 8; index++) {
      // init target square
      var target_square = square + king_offsets[index];
      
      // lookup target piece
      var target_piece = board[target_square];
      
      // if target square is on board
      if (!(target_square & 0x88)) {
        // if target piece is either white or black king
        if (!side ? target_piece == K : target_piece == k)
          return 1;
      } 
    }
    
    // bishop & queen attacks
    for (var index = 0; index < 4; index++) {
      // init target square
      var target_square = square + bishop_offsets[index];
        
      // loop over attack ray
      while (!(target_square & 0x88)) {
        // target piece
        var target_piece = board[target_square];
        
        // if target piece is either white or black bishop or queen
        if (!side ? (target_piece == B || target_piece == Q) : (target_piece == b || target_piece == q))
          return 1;

        // break if hit a piece
        if (target_piece)
          break;
    
        // increment target square by move offset
        target_square += bishop_offsets[index];
      }
    }
    
    // rook & queen attacks
    for (var index = 0; index < 4; index++) {
      // init target square
      var target_square = square + rook_offsets[index];
      
      // loop over attack ray
      while (!(target_square & 0x88)) {
        // target piece
        var target_piece = board[target_square];
        
        // if target piece is either white or black bishop or queen
        if (!side ? (target_piece == R || target_piece == Q) : (target_piece == r || target_piece == q))
          return 1;

        // break if hit a piece
        if (target_piece)
          break;
    
        // increment target square by move offset
        target_square += rook_offsets[index];
      }
    }
    
    return 0;
  }

  // print attack map
  function print_attacked_squares(side) {
    // attack board string
    var attack_string = '  ' + (!side ? 'White' : 'Black') + ' attacks\n\n';

    // loop over board ranks
    for (var rank = 0; rank < 8; rank++) {
      // loop over board files
      for (var file = 0; file < 16; file++) {
        // init square
        var square = rank * 16 + file;
        
        // print ranks
        if (file == 0)
          attack_string += (8 - rank).toString() + ' ';
        
        // if square is on board
        if (!(square & 0x88))
           attack_string += (is_square_attacked(square, side) ? 'x ' : '. ');  
      }
      
      // append new line to attack string
      attack_string += '\n';
    }
    
    // append files to attack string
    attack_string += '  a b c d e f g h\n\n';
    
    // print attack board
    console.log(attack_string);
  }
  
  // populate move list
  function add_move(move_list, move) {
    // push move into the move list
    move_list.moves[move_list.count] = move;
    
    // increment move count
    move_list.count++;
  }

  // move generator
  function generate_moves(move_list) {
    // loop over all board squares
    for (var square = 0; square < 128; square++) {
      // check if the square is on board
      if (!(square & 0x88)) {
        // white pawn and castling moves
        if (!side) {
          // white pawn moves
          if (board[square] == P) {
            // init target square
            var to_square = square - 16;
                  
            // quite white pawn moves (check if target square is on board)
            if (!(to_square & 0x88) && !board[to_square]) {   
              // pawn promotions
              if (square >= a7 && square <= h7) {
                add_move(move_list, encode_move(square, to_square, Q, 0, 0, 0, 0));
                add_move(move_list, encode_move(square, to_square, R, 0, 0, 0, 0));
                add_move(move_list, encode_move(square, to_square, B, 0, 0, 0, 0));
                add_move(move_list, encode_move(square, to_square, N, 0, 0, 0, 0));                            
              }
              
              else {
                // one square ahead pawn move
                add_move(move_list, encode_move(square, to_square, 0, 0, 0, 0, 0));
                
                // two squares ahead pawn move
                if ((square >= a2 && square <= h2) && !board[square - 32])
                  add_move(move_list, encode_move(square, square - 32, 0, 0, 1, 0, 0));
              }
            }
                  
            // white pawn capture moves
            for (var index = 0; index < 4; index++) {
              // init pawn offset
              var pawn_offset = bishop_offsets[index];
              
              // white pawn offsets
              if (pawn_offset < 0) {
                // init target square
                var to_square = square + pawn_offset;
                
                // check if target square is on board
                if (!(to_square & 0x88)) {
                  // capture pawn promotion
                  if (
                       (square >= a7 && square <= h7) &&
                       (board[to_square] >= 7 && board[to_square] <= 12)
                     ) {
                    add_move(move_list, encode_move(square, to_square, Q, 1, 0, 0, 0));
                    add_move(move_list, encode_move(square, to_square, R, 1, 0, 0, 0));
                    add_move(move_list, encode_move(square, to_square, B, 1, 0, 0, 0));
                    add_move(move_list, encode_move(square, to_square, N, 1, 0, 0, 0));
                  }
                  
                  else {
                    // casual capture
                    if (board[to_square] >= 7 && board[to_square] <= 12)
                      add_move(move_list, encode_move(square, to_square, 0, 1, 0, 0, 0));
                    
                    // enpassant capture
                    if (to_square == enpassant)
                      add_move(move_list, encode_move(square, to_square, 0, 1, 0, 1, 0));
                  }
                }
              }
            }
          }
                
          // white king castling
          if (board[square] == K) {
            // if king side castling is available
            if (castle & KC) {
              // make sure there are empty squares between king & rook
              if (!board[f1] && !board[g1]) {
                // make sure king & next square are not under attack
                if (!is_square_attacked(e1, black) && !is_square_attacked(f1, black))
                  add_move(move_list, encode_move(e1, g1, 0, 0, 0, 0, 1));
              }
            }
              
            // if queen side castling is available
            if (castle & QC) {
              // make sure there are empty squares between king & rook
              if (!board[d1] && !board[b1] && !board[c1]) {
                // make sure king & next square are not under attack
                if (!is_square_attacked(e1, black) && !is_square_attacked(d1, black))
                  add_move(move_list, encode_move(e1, c1, 0, 0, 0, 0, 1));
              }
            }
          }
        }
            
        // black pawn and castling moves
        else
        {
          // black pawn moves
          if (board[square] == p) {
            // init target square
            var to_square = square + 16;
            
            // quite black pawn moves (check if target square is on board)
            if (!(to_square & 0x88) && !board[to_square]) {   
              // pawn promotions
              if (square >= a2 && square <= h2) {
                add_move(move_list, encode_move(square, to_square, q, 0, 0, 0, 0));
                add_move(move_list, encode_move(square, to_square, r, 0, 0, 0, 0));
                add_move(move_list, encode_move(square, to_square, b, 0, 0, 0, 0));
                add_move(move_list, encode_move(square, to_square, n, 0, 0, 0, 0));
              }
              
              else {
                // one square ahead pawn move
                add_move(move_list, encode_move(square, to_square, 0, 0, 0, 0, 0));
                
                // two squares ahead pawn move
                if ((square >= a7 && square <= h7) && !board[square + 32])
                  add_move(move_list, encode_move(square, square + 32, 0, 0, 1, 0, 0));
              }
            }
              
            // black pawn capture moves
            for (var index = 0; index < 4; index++)
            {
              // init pawn offset
              var pawn_offset = bishop_offsets[index];
              
              // white pawn offsets
              if (pawn_offset > 0)
              {
                // init target square
                var to_square = square + pawn_offset;
                
                // check if target square is on board
                if (!(to_square & 0x88)) {
                  // capture pawn promotion
                  if (
                       (square >= a2 && square <= h2) &&
                       (board[to_square] >= 1 && board[to_square] <= 6)
                     ) {
                    add_move(move_list, encode_move(square, to_square, q, 1, 0, 0, 0));
                    add_move(move_list, encode_move(square, to_square, r, 1, 0, 0, 0));
                    add_move(move_list, encode_move(square, to_square, b, 1, 0, 0, 0));
                    add_move(move_list, encode_move(square, to_square, n, 1, 0, 0, 0));
                  }
                  
                  else {
                    // casual capture
                    if (board[to_square] >= 1 && board[to_square] <= 6)
                      add_move(move_list, encode_move(square, to_square, 0, 1, 0, 0, 0));
                    
                    // enpassant capture
                    if (to_square == enpassant)
                      add_move(move_list, encode_move(square, to_square, 0, 1, 0, 1, 0));
                  }
                }
              }
            }
          }
          
          // black king castling
          if (board[square] == k) {
            // if king side castling is available
            if (castle & kc) {
              // make sure there are empty squares between king & rook
              if (!board[f8] && !board[g8]) {
                // make sure king & next square are not under attack
                if (!is_square_attacked(e8, white) && !is_square_attacked(f8, white))
                  add_move(move_list, encode_move(e8, g8, 0, 0, 0, 0, 1));
              }
            }
            
            // if queen side castling is available
            if (castle & qc) {
              // make sure there are empty squares between king & rook
              if (!board[d8] && !board[b8] && !board[c8])
              {
                // make sure king & next square are not under attack
                if (!is_square_attacked(e8, white) && !is_square_attacked(d8, white))
                  add_move(move_list, encode_move(e8, c8, 0, 0, 0, 0, 1));
              }
            }
          }
        }
            
        // knight moves
        if (!side ? board[square] == N : board[square] == n) {
          // loop over knight move offsets
          for (var index = 0; index < 8; index++) {
            // init target square
            var to_square = square + knight_offsets[index];
            
            // init target piece
            var piece = board[to_square];
            
            // make sure target square is onboard
            if (!(to_square & 0x88)) {
              if (
                   !side ?
                   (!piece || (piece >= 7 && piece <= 12)) : 
                   (!piece || (piece >= 1 && piece <= 6))
                 ) {
                // on capture
                if (piece)
                  add_move(move_list, encode_move(square, to_square, 0, 1, 0, 0, 0));
                    
                // on empty square
                else
                  add_move(move_list, encode_move(square, to_square, 0, 0, 0, 0, 0));
              }
            }
          }
        }
            
        // king moves
        if (!side ? board[square] == K : board[square] == k) {
          // loop over king move offsets
          for (var index = 0; index < 8; index++) {
            // init target square
            var to_square = square + king_offsets[index];
            
            // init target piece
            var piece = board[to_square];
            
            // make sure target square is onboard
            if (!(to_square & 0x88)) {
              if (
                   !side ?
                   (!piece || (piece >= 7 && piece <= 12)) : 
                   (!piece || (piece >= 1 && piece <= 6))
                 ) {
                  // on capture
                  if (piece)
                    add_move(move_list, encode_move(square, to_square, 0, 1, 0, 0, 0));
                      
                  // on empty square
                  else
                    add_move(move_list, encode_move(square, to_square, 0, 0, 0, 0, 0));
              }
            }
          }
        }
            
        // bishop & queen moves
        if (
             !side ?
             (board[square] == B) || (board[square] == Q) :
             (board[square] == b) || (board[square] == q)
           ) {
          // loop over bishop & queen offsets
          for (var index = 0; index < 4; index++) {
            // init target square
            var to_square = square + bishop_offsets[index];
            
            // loop over attack ray
            while (!(to_square & 0x88)) {
              // init target piece
              var piece = board[to_square];
              
              // if hits own piece
              if (!side ? (piece >= 1 && piece <= 6) : ((piece >= 7 && piece <= 12)))
                break;
              
              // if hits opponent's piece
              if (!side ? (piece >= 7 && piece <= 12) : ((piece >= 1 && piece <= 6))) {
                add_move(move_list, encode_move(square, to_square, 0, 1, 0, 0, 0));
                break;
              }
              
              // if steps into an empty squre
              if (!piece)
                add_move(move_list, encode_move(square, to_square, 0, 0, 0, 0, 0));
              
              // increment target square
              to_square += bishop_offsets[index];
            }
          }
        }
            
        // rook & queen moves
        if (
             !side ?
             (board[square] == R) || (board[square] == Q) :
             (board[square] == r) || (board[square] == q)
           ) {
          // loop over bishop & queen offsets
          for (var index = 0; index < 4; index++) {
            // init target square
            var to_square = square + rook_offsets[index];
            
            // loop over attack ray
            while (!(to_square & 0x88)) {
              // init target piece
              var piece = board[to_square];
              
              // if hits own piece
              if (!side ? (piece >= 1 && piece <= 6) : ((piece >= 7 && piece <= 12)))
                break;
              
              // if hits opponent's piece
              if (!side ? (piece >= 7 && piece <= 12) : ((piece >= 1 && piece <= 6))) {
                  add_move(move_list, encode_move(square, to_square, 0, 1, 0, 0, 0));
                break;
              }
              
              // if steps into an empty squre
              if (!piece)
                add_move(move_list, encode_move(square, to_square, 0, 0, 0, 0, 0));
              
              // increment target square
              to_square += rook_offsets[index];
            }
          }
        }
      }
    }
  }

  // move flag constants
  const all_moves = 0;
  const only_captures = 1;

  // make move
  function make_move(move, capture_flag) {
    // quiet move
    if (capture_flag == all_moves) {
      // backup current board position
      var board_copy, king_square_copy, side_copy, enpassant_copy, castle_copy, fifty_copy, hash_copy;
      board_copy = JSON.parse(JSON.stringify(board));
      side_copy = side;
      enpassant_copy = enpassant;
      castle_copy = castle;
      hash_copy = hash_key;
      fifty_copy = fifty;
      king_square_copy = JSON.parse(JSON.stringify(king_square));
      
      // parse move
      var from_square = get_move_source(move);
      var to_square = get_move_target(move);
      var promoted_piece = get_move_piece(move);
      var enpass = get_move_enpassant(move);
      var double_push = get_move_pawn(move);
      var castling = get_move_castling(move);
      var piece = board[from_square];
      var captured_piece = board[to_square];
      
      // move piece
      board[to_square] = board[from_square];
      board[from_square] = e;
      
      // hash piece
      hash_key ^= piece_keys[piece * 128 + from_square]; // remove piece from source square in hash key
      hash_key ^= piece_keys[piece * 128 + to_square];   // set piece to the target square in hash key
      
      // increment fifty move rule counter
      fifty++;
      
      // if pawn moved
      if (board[from_square] == P || board[from_square] == p)
        // reset fifty move rule counter
        fifty = 0;
      
      // if move is a capture
      if (get_move_capture(move)) {
        // remove the piece from hash key
        if (captured_piece)
          hash_key ^= piece_keys[captured_piece * 128 + to_square];
        
        // reset fifty move rule counter
        fifty = 0;
      }
      
      // pawn promotion
      if (promoted_piece) {
        // white to move
        if (side == white)
          // remove pawn from hash key
          hash_key ^= piece_keys[P * 128 + to_square];

        // black to move
        else 
          // remove pawn from hash key
          hash_key ^= piece_keys[p * 128 + to_square];
        
        // promote pawn
        board[to_square] = promoted_piece;
        
        // add promoted piece into the hash key
        hash_key ^= piece_keys[promoted_piece * 128 + to_square];
      }
      
      // enpassant capture
      if (enpass) {
        // white to move
        if (side == white) {
          // remove captured pawn
          board[to_square + 16] = e;
          
          // remove pawn from hash key
          hash_key ^= piece_keys[p * 128 + to_square + 16];
        }
        
        // black to move
        else {
          // remove captured pawn
          board[to_square - 16] = e;

          // remove pawn from hash key
          hash_key ^= piece_keys[(P * 128) + (to_square - 16)];
        }
      }
      
      // hash enpassant if available
      if (enpassant != no_sq) hash_key ^= piece_keys[enpassant];
        
      // reset enpassant square
      enpassant = no_sq;
      
      // double pawn push
      if (double_push) {
        // white to move
        if (side == white) {
          // set enpassant square
          enpassant = to_square + 16;
          
          // hash enpassant
          hash_key ^= piece_keys[to_square + 16];
        }
        
        // black to move
        else {
          // set enpassant square
          enpassant = to_square - 16;
          
          // hash enpassant
          hash_key ^= piece_keys[to_square - 16];
        }
      }
      
      // castling
      if (castling) {
        // switch target square
        switch(to_square) {
          // white castles king side
          case g1:
            // move H rook
            board[f1] = board[h1];
            board[h1] = e;
            
            // hash rook
            hash_key ^= piece_keys[R * 128 + h1];  // remove rook from h1 from hash key
            hash_key ^= piece_keys[R * 128 + f1];  // put rook on f1 into a hash key
            break;
          
          // white castles queen side
          case c1:
            // move A rook
            board[d1] = board[a1];
            board[a1] = e;
            
            // hash rook
            hash_key ^= piece_keys[R * 128 + a1];  // remove rook from a1 from hash key
            hash_key ^= piece_keys[R * 128 + d1];  // put rook on d1 into a hash key
            break;
         
         // black castles king side
          case g8:
            // move H rook
            board[f8] = board[h8];
            board[h8] = e;
            
            // hash rook
            hash_key ^= piece_keys[r * 128 + h8];  // remove rook from h8 from hash key
            hash_key ^= piece_keys[r * 128 + f8];  // put rook on f8 into a hash key
            break;
         
         // black castles queen side
          case c8:
            // move A rook
            board[d8] = board[a8];
            board[a8] = e;
            
            // hash rook
            hash_key ^= piece_keys[r * 128 + a8];  // remove rook from a8 from hash key
            hash_key ^= piece_keys[r * 128 + d8];  // put rook on d8 into a hash key
            break;
        }
      }
      
      // update king square
      if (board[to_square] == K || board[to_square] == k)
        king_square[side] = to_square;
      
      // hash castling
      hash_key ^= castle_keys[castle];
        
      // update castling rights
      castle &= castling_rights[from_square];
      castle &= castling_rights[to_square];
      
      // hash castling
      hash_key ^= castle_keys[castle];
        
      // change side
      side ^= 1;
      
      // hash side
      hash_key ^= side_key;
      
      // take move back if king is under the check
      if (is_square_attacked(!side ? king_square[side ^ 1] : king_square[side ^ 1], side)) {
        // restore board position
        board = JSON.parse(JSON.stringify(board_copy));
        side = side_copy;
        enpassant = enpassant_copy;
        castle = castle_copy;
        hash_key = hash_copy;
        fifty = fifty_copy;
        king_square = JSON.parse(JSON.stringify(king_square_copy));

        // illegal move
        return 0;
      }
      
      else
        // legal move
        return 1;
    }
    
    // capture move
    else {
      // if move is a capture
      if (get_move_capture(move))
        // make capture move
        make_move(move, all_moves);
      
      else
        // move is not a capture
        return 0;
    }
  }

  /****************************\
                 
               PERFT
                 
  \****************************/
  
  // visited nodes count
  var nodes = 0;
  
  // perft driver
  function perft_driver(depth)
  {
    // escape condition
    if  (!depth) {
      // count current position
      nodes++;
      return;
    }
    
    // reset move list
    var move_list = {
      moves: [],
      count: 0
    };
    
    // create move list
    var move_list = {
      moves: new Array(256),
      count: 0
    }
    
    // generate moves
    generate_moves(move_list);
    
    // loop over the generated moves
    for (var move_count = 0; move_count < move_list.count; move_count++) {
      // backup current board position
      var board_copy, king_square_copy, side_copy, enpassant_copy, castle_copy, fifty_copy, hash_copy;
      board_copy = JSON.parse(JSON.stringify(board));
      side_copy = side;
      enpassant_copy = enpassant;
      castle_copy = castle;
      fifty_copy = fifty;
      hash_copy = hash_key;
      
      king_square_copy = JSON.parse(JSON.stringify(king_square));
      
      // make only legal moves
      if (!make_move(move_list.moves[move_count], all_moves))
        // skip illegal move
        continue;
      
      if (side && board[get_move_target(move_list.moves[move_count])] >= 7)
      {      console.log('wrong side moved piece!');
        console.log(depth)
        console.log(move_count)
      }
      
      // recursive call
      perft_driver(depth - 1);
      
      // restore board position
      board = JSON.parse(JSON.stringify(board_copy));
      side = side_copy;
      enpassant = enpassant_copy;
      castle = castle_copy;
      hash_key = hash_copy;
      fifty = fifty_copy;
      king_square = JSON.parse(JSON.stringify(king_square_copy));
    }
  }

  // perft test
  function perft_test(depth)
  {
    console.log('Performance test:\n\n');
    result_string = '';
    
    // init start time
    var start_time = new Date().getTime();

    // create move list
    var move_list = {
      moves: new Array(256),
      count: 0
    }
    
    // generate moves
    generate_moves(move_list);
    
    // loop over the generated moves
    for (var move_count = 0; move_count < move_list.count; move_count++)
    {
      // backup current board position
      var board_copy, king_square_copy, side_copy, enpassant_copy, castle_copy, fifty_copy, hash_copy;
      board_copy = JSON.parse(JSON.stringify(board));
      side_copy = side;
      enpassant_copy = enpassant;
      castle_copy = castle;
      hash_copy = hash_key;
      fifty_copy = fifty;
      king_square_copy = JSON.parse(JSON.stringify(king_square));
        
      // make only legal moves
      if (!make_move(move_list.moves[move_count], all_moves))
        // skip illegal move
        continue;
      
      // cummulative nodes
      var cum_nodes = nodes;
      
      // recursive call
      perft_driver(depth - 1);
      
      // old nodes
      var old_nodes = nodes - cum_nodes;

      // restore board position
      board = JSON.parse(JSON.stringify(board_copy));
      side = side_copy;
      enpassant = enpassant_copy;
      castle = castle_copy;
      hash_key = hash_copy;
      fifty = fifty_copy;
      king_square = JSON.parse(JSON.stringify(king_square_copy));
      
      // print current move
      console.log(  'move' +
                    ' ' + (move_count + 1) + ((move_count < 9) ? ':  ': ': ') +
                    coordinates[get_move_source(move_list.moves[move_count])] +
                    coordinates[get_move_target(move_list.moves[move_count])] +
                    (get_move_piece(move_list.moves[move_count]) ?
                    promoted_pieces[get_move_piece(move_list.moves[move_count])]: ' ') +
                    '    nodes: ' + old_nodes + '\n');
    }
    
    // append results
    result_string += '\nDepth: ' + depth;
    result_string += '\nNodes: ' + nodes;
    result_string += '\n Time: ' + (new Date().getTime() - start_time) + ' ms';
    
    // print results
    console.log(result_string);
  }
  

  /****************************\
                 
            EVALUATION
                 
  \****************************/
  
  // piece weights
  var piece_weights = [0, 100, 300, 350, 500, 900, 1000, -100, -300, -350, -500, -900, -1000];

  // evaluate position
  function evaluate() {
    // piece counts for material draw detection
    var piece_counts = {
      [P]: 0, [N]: 0, [B]: 0, [R]: 0, [Q]: 0, [K]: 0,
      [p]: 0, [n]: 0, [b]: 0, [r]: 0, [q]: 0, [k]: 0
    }

    // static score (material + positional benefits)
    var score = 0;
    
    // loop over board squares
    for(var square = 0; square < 128; square++)
    {
        // make sure square is on board
        if(!(square & 0x88))
        {
            // init piece
            var piece = board[square]
            
            // if piece available
            if(piece)
            {
                // count piece
                piece_counts[piece]++;
                
                // calculate material score
                score += piece_weights[piece];
                
                // white positional score
                if (piece >= P && piece <= K)
                  // calculate positional score
                  score += board[square + 8];
                  
                // black positional score
                else if (piece >= p && piece <= k)
                  // calculate positional score
                  score -= board[square + 8];
            }
        }
    }
    
    // no pawns on board (material draw detection)
    if(!piece_counts[P] && !piece_counts[p]) {
      // no rooks & queens on board
      if (!piece_counts[R] && !piece_counts[r] && !piece_counts[Q] && !piece_counts[q]) {
	      // no bishops on board
	      if (!piece_counts[B] && !piece_counts[b]) {
	        // less than 3 knights on board for either side
          if (piece_counts[N] < 3 && piece_counts[n] < 3)
            // return material draw
            return 0;
	      }
	      
	      // no knights on board
	      else if (!piece_counts[N] && !piece_counts[n]) {
          // less than 2 bishops on board for both sides
          if (Math.abs(piece_counts[B] - piece_counts[b]) < 2)
            // return material draw
            return 0;
	      }
	      
	      // less than 3 white knights and no white bishops or 1 white bishop and no white knights
	      else if ((piece_counts[N] < 3 && !piece_counts[B]) || (piece_counts[B] == 1 && !piece_counts[N])) {
	        // same as above but for black
	        if ((piece_counts[n] < 3 && !piece_counts[b]) || (piece_counts[b] == 1 && !piece_counts[n]))
	          // return material draw
	          return 0;
	      }
	      
	    }
	    
	    // no queens on board
	    else if (!piece_counts[Q] && !piece_counts[q]) {
        // each side has one rook
        if (piece_counts[R] == 1 && piece_counts[r] == 1) {
          // each side has less than two minor pieces
          if ((piece_counts[N] + piece_counts[B]) < 2 && (piece_counts[n] + piece_counts[b]) < 2)
            // return material draw
            return 0;
        }
        
        // white has one rook and no black rooks
        else if (piece_counts[R] == 1 && !piece_counts[r]) {        
          // white has no minor pieces and black has either one or two minor pieces
          if ((piece_counts[N] + piece_counts[B] == 0) &&
            (((piece_counts[n] + piece_counts[b]) == 1) || 
             ((piece_counts[n] + piece_counts[b]) == 2)))
            // return material draw
            return 0;

        }
        
        // black has one rook and no white rooks
        else if (piece_counts[r] == 1 && !piece_counts[R]) {
          // black has no minor pieces and white has either one or two minor pieces
          if ((piece_counts[n] + piece_counts[b] == 0) &&
            (((piece_counts[N] + piece_counts[B]) == 1) ||
             ((piece_counts[N] + piece_counts[B]) == 2)))
            // return material draw
            return 0;
        }
      }
    }
    
    // return score depending on side to move
    return (side == white) ? score : -score;
  }
  

  /****************************\
                 
           INITIALIZATION
                 
  \****************************/
  
  // init all when Chess() object is created
  (function init_all() {
    // init random keys
    init_random_keys();
    
    // init hash key for starting position
    hash_key = generate_hash_key();
    
  }())


  /****************************\
                 
             RUN TESTS
                 
  \****************************/
  
  function tests() {
    parse_fen('r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1 ');
    print_board();
    
    console.log(evaluate());
  }
  
  /****************************\
                 
        PUBLIC API REFERENCE
                 
  \****************************/

  return {
    // print chess board to console
    print_board: function() { return print_board(); },
    
    // parse FEN to init board position
    parse_fen: function(fen) { return parse_fen(fen); },

    // generate pseudo legal moves
    generate_moves: function(move_list) { return generate_moves(move_list); },
        
    // debug
    tests: function() { return tests(); }
    
    // search
    //search: function() { return new Promise(function() {search(); }); }
  }
}

/* TEST DRIVER */

// create engine instance
var chess = new Chess();
chess.tests();


// 'r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1 '
// 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1 '
// 'r2q1rk1/ppp2ppp/2n1bn2/2b1p3/3pP3/3P1NPP/PPP1NPB1/R1BQ1RK1 b - - 0 9 '

/*
I just want to search on a board separate from the board associated with GUI.
Well, probably instantiating a board should do a trick.
What if I simply create several instances, say:

// GUI
var board = new Chess();

// engine
var engine = new Chess();

engine.search(board.position)



*/







