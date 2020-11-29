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
  
  // print move
  function print_move(move) {
      if (get_move_piece(move))
          return coordinates[get_move_source(move)] +
                 coordinates[get_move_target(move)] +
                 promoted_pieces[get_move_piece(move)];
      else
          return coordinates[get_move_source(move)] +
                 coordinates[get_move_target(move)];
  }
	
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
    
    // reset repetition table
    for (var index = 0; index < repetition_table.length; index++) repetition_table[index] = 0;
  }
  
  // parse FEN string to init board position
  function parse_fen(fen) {
    // reset chess board and state variables
    reset_board();
    
    // clear hash table
    clear_hash_table();
    
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
    
    return 1;
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
                 
        TRANSPOSITION TABLE
                 
  \****************************/

  // number hash table entries
  var hash_entries = 2796202;

  // no hash entry found constant
  const no_hash_entry = 100000;

  // transposition table hash flags
  const hash_flag_exact = 0;
  const hash_flag_alpha = 1;
  const hash_flag_beta = 2;

  // define TT instance
  var hash_table = [];
  
  // clear TT (hash table)
  function clear_hash_table() {
    // loop over TT elements
    for (var index = 0; index < hash_entries; index++) {
      // reset TT inner fields
      hash_table[index] = {
        hash_key: 0,
        depth: 0,
        flag: 0,
        score: 0,
        best_move: 0
      }
    }
  }
  
  // read hash entry data
  function read_hash_entry(alpha, beta, best_move, depth) {
    var hash_entry = hash_table[Math.abs(hash_key) % hash_entries];

    // make sure we're dealing with the exact position we need
    if (hash_entry.hash_key == hash_key) {
      // make sure that we match the exact depth our search is now at
      if (hash_entry.depth >= depth) {
        // extract stored score from TT entry
        var score = hash_entry.score;
        
        // retrieve score independent from the actual path
        // from root node (position) to current node (position)
        if (score < -mate_score) score += ply;
        if (score > mate_score) score -= ply;
    
        // match the exact (PV node) score 
        if (hash_entry.flag == hash_flag_exact)
          // return exact (PV node) score
          return score;
        
        // match alpha (fail-low node) score
        if ((hash_entry.flag == hash_flag_alpha) &&
            (score <= alpha))
          // return alpha (fail-low node) score
          return alpha;
        
        // match beta (fail-high node) score
        if ((hash_entry.flag == hash_flag_beta) &&
            (score >= beta))
          // return beta (fail-high node) score
          return beta;
      }

      // store best move
      best_move.value = hash_entry.best_move;
    }
    
    // if hash entry doesn't exist
    return no_hash_entry;
  }

  // write hash entry data
  function write_hash_entry(score, best_move, depth, hash_flag) {
    
    var hash_entry = hash_table[Math.abs(hash_key) % hash_entries];

    // store score independent from the actual path
    // from root node (position) to current node (position)
    if (score < -mate_score) score -= ply;
    if (score > mate_score) score += ply;

    // write hash entry data 
    hash_entry.hash_key = hash_key;
    hash_entry.score = score;
    hash_entry.flag = hash_flag;
    hash_entry.depth = depth;
    hash_entry.best_move = best_move;
  }
  
  /****************************\
                 
              SEARCH
                 
  \****************************/
  
  // variable to flag that time is up
  var stopped = 0;
  
  /* 
       These are the score bounds for the range of the mating scores
     [-infinity, -mate_value ... -mate_score, ... score ... mate_score ... mate_value, infinity]
  */
     
  const infinity = 50000;
  const mate_value = 49000;
  const mate_score = 48000;

  // most valuable victim & less valuable attacker

  /*
                            
      (Victims) Pawn Knight Bishop   Rook  Queen   King
    (Attackers)
          Pawn   105    205    305    405    505    605
        Knight   104    204    304    404    504    604
        Bishop   103    203    303    403    503    603
          Rook   102    202    302    402    502    602
         Queen   101    201    301    401    501    601
          King   100    200    300    400    500    600
  */

  // MVV LVA
  var mvv_lva = [
	  0,   0,   0,   0,   0,   0,   0,  0,   0,   0,   0,   0,   0,
	  0, 105, 205, 305, 405, 505, 605,  105, 205, 305, 405, 505, 605,
	  0, 104, 204, 304, 404, 504, 604,  104, 204, 304, 404, 504, 604,
	  0, 103, 203, 303, 403, 503, 603,  103, 203, 303, 403, 503, 603,
	  0, 102, 202, 302, 402, 502, 602,  102, 202, 302, 402, 502, 602,
	  0, 101, 201, 301, 401, 501, 601,  101, 201, 301, 401, 501, 601,
	  0, 100, 200, 300, 400, 500, 600,  100, 200, 300, 400, 500, 600,

	  0, 105, 205, 305, 405, 505, 605,  105, 205, 305, 405, 505, 605,
	  0, 104, 204, 304, 404, 504, 604,  104, 204, 304, 404, 504, 604,
	  0, 103, 203, 303, 403, 503, 603,  103, 203, 303, 403, 503, 603,
	  0, 102, 202, 302, 402, 502, 602,  102, 202, 302, 402, 502, 602,
	  0, 101, 201, 301, 401, 501, 601,  101, 201, 301, 401, 501, 601,
	  0, 100, 200, 300, 400, 500, 600,  100, 200, 300, 400, 500, 600
  ];

  // max ply that we can reach within a search
  const max_ply = 64;

  // killer moves
  var killer_moves = new Array(2 * max_ply);

  // history moves
  var history_moves = new Array(13 * 128);

  /*
        ================================
              Triangular PV table
        --------------------------------
          PV line: e2e4 e7e5 g1f3 b8c6
        ================================
             0    1    2    3    4    5
        
        0    m1   m2   m3   m4   m5   m6
        
        1    0    m2   m3   m4   m5   m6 
        
        2    0    0    m3   m4   m5   m6
        
        3    0    0    0    m4   m5   m6
         
        4    0    0    0    0    m5   m6
        
        5    0    0    0    0    0    m6
  */

  // PV length
  var pv_length = new Array(max_ply);

  // PV table
  var pv_table = new Array(max_ply * max_ply);

  // follow PV & score PV move
  var follow_pv;
  var score_pv;
  
  // repetition table
  var repetition_table = new Array(1000);
  
  // repetition index
  var repetition_index = 0;

  // half move counter
  var ply = 0;
  
  // clear search data structures
  function clear_search() {
    // reset nodes counter
    nodes = 0;
    
    // reset "time is up" flag
    stopped = 0;
    
    // reset follow PV flags
    follow_pv = 0;
    score_pv = 0;
    
    // clear helper data structures for search
    for (var index = 0; index < killer_moves.length; index++) killer_moves[index] = 0;
    for (var index = 0; index < history_moves.length; index++) history_moves[index] = 0;
    for (var index = 0; index < pv_table.length; index++) pv_table[index] = 0;
    for (var index = 0; index < pv_length.length; index++) pv_length[index] = 0;
  }

  // enable PV move scoring
  function enable_pv_scoring(move_list) {
    // disable following PV
    follow_pv = 0;
    
    // loop over the moves within a move list
    for (var count = 0; count < move_list.count; count++) {
      // make sure we hit PV move
      if (pv_table[ply] == move_list.moves[count]) {
        // enable move scoring
        score_pv = 1;
        
        // enable following PV
        follow_pv = 1;
      }
    }
  }
  
  /*  =======================
         Move ordering
    =======================
    
    1. PV move
    2. Captures in MVV/LVA
    3. 1st killer move
    4. 2nd killer move
    5. History moves
    6. Unsorted moves
  */

  // score moves
  function score_move(move) {
    // if PV move scoring is allowed
    if (score_pv) {
        // make sure we are dealing with PV move
        if (pv_table[ply] == move) {
            // disable score PV flag
            score_pv = 0;
            
            // give PV move the highest score to search it first
            return 20000;
        }
    }
      
    // score capture move
    if (get_move_capture(move))
      // score move by MVV LVA lookup
      return mvv_lva[board[get_move_source(move)] * 13 + board[get_move_target(move)]] + 10000
    
    // score quiet move
    else {
      // score 1st killer move
      if (killer_moves[ply] == move)
        return 9000;
      
      // score 2nd killer move
      else if (killer_moves[max_ply + ply] == move)
        return 8000;
      
      // score history move
      else
        return history_moves[get_move_piece(move) * 128 + get_move_target(move)];
    }
    
    return 0;
  }
  
  // sort moves in descending order
  function sort_moves(move_list, best_move) {
    // move scores
    var move_scores = new Array(move_list.count);
    
    // score all the moves within a move list
    for (var count = 0; count < move_list.count; count++) {
        // if hash move available
        if (best_move == move_list.moves[count])
          // score move
          move_scores[count] = 30000;

        else
          // score move
          move_scores[count] = score_move(move_list.moves[count]);
    }
    
    // loop over current move within a move list
    for (var current_move = 0; current_move < move_list.count; current_move++) {
      // loop over next move within a move list
      for (var next_move = current_move + 1; next_move < move_list.count; next_move++) {
        // compare current and next move scores
        if (move_scores[current_move] < move_scores[next_move]) {
          // swap scores
          var temp_score = move_scores[current_move];
          move_scores[current_move] = move_scores[next_move];
          move_scores[next_move] = temp_score;
          
          // swap moves
          var temp_move = move_list.moves[current_move];
          move_list.moves[current_move] = move_list.moves[next_move];
          move_list.moves[next_move] = temp_move;
        }
      }
    }
  }
  
  // print move scores
  function print_move_scores(move_list) {
    console.log("Move scores:\n\n");

    // loop over moves within a move list
    for (var count = 0; count < move_list.count; count++)
      console.log('move:', print_move(move_list.moves[count]),
                  '    score: ' + score_move(move_list.moves[count]));

  }
  
  // quiescence search
  function quiescence(alpha, beta) {
    // every 2047 nodes
    //if((nodes & 2047 ) == 0)
      // "listen" to the GUI/user input
	    //communicate();
  
    // increment nodes count
    nodes++;

    // we are too deep, hence there's an overflow of arrays relying on max ply constant
    if (ply > 10)
      // evaluate position
      return evaluate();

    // evaluate position
    var evaluation = evaluate();
    
    // fail-hard beta cutoff
    if (evaluation >= beta)
      // node (position) fails high
      return beta;
    
    // found a better move
    if (evaluation > alpha)
      // PV node (position)
      alpha = evaluation;
    
    // create move list instance
    var move_list = {
      moves: new Array(256),
      count: 0
    }
    
    // generate moves
    generate_moves(move_list);
    
    // sort moves
    sort_moves(move_list, 0);
    
    // loop over moves within a movelist
    for (var count = 0; count < move_list.count; count++) {
      // backup current board position
      var board_copy, king_square_copy, side_copy, enpassant_copy, castle_copy, fifty_copy, hash_copy;
      board_copy = JSON.parse(JSON.stringify(board));
      side_copy = side;
      enpassant_copy = enpassant;
      castle_copy = castle;
      hash_copy = hash_key;
      fifty_copy = fifty;
      king_square_copy = JSON.parse(JSON.stringify(king_square));
      
      // increment ply
      ply++;
      
      // increment repetition index & store hash key
      repetition_index++;
      repetition_table[repetition_index] = hash_key;

      // make sure to make only legal moves
      if (make_move(move_list.moves[count], only_captures) == 0) {
        // decrement ply
        ply--;
        
        // decrement repetition index
        repetition_index--;

        // skip to next move
        continue;
      }
      
      // score current move
      var score = -quiescence(-beta, -alpha);
      
      // decrement ply
      ply--;
      
      // decrement repetition index
      repetition_index--;

      // restore board position
      board = JSON.parse(JSON.stringify(board_copy));
      side = side_copy;
      enpassant = enpassant_copy;
      castle = castle_copy;
      hash_key = hash_copy;
      fifty = fifty_copy;
      king_square = JSON.parse(JSON.stringify(king_square_copy));
      
      // reutrn 0 if time is up
      if (stopped == 1) return 0;
      
      // found a better move
      if (score > alpha)
      {
        // PV node (position)
        alpha = score;
        
        // fail-hard beta cutoff
        if (score >= beta)
          // node (position) fails high
          return beta;
      }
    }
    
    // node (position) fails low
    return alpha;
  }

  // negamax search
  function negamax(alpha, beta, depth) {       
    // PV length
    pv_length[ply] = ply;
    
    // current move's score
    var score;
    
    // best move for TT
    var best_move = {value: 0};
    
    // define hash flag
    var hash_flag = hash_flag_alpha;
    
    // a hack by Pedro Castro to figure out whether the current node is PV node or not 
    var pv_node = beta - alpha > 1;
    
    // read hash entry if we're not in a root ply and hash entry is available
    // and current node is not a PV node
    if (ply && (score = read_hash_entry(alpha, beta, best_move, depth)) != no_hash_entry && pv_node == 0)
      // if the move has already been searched (hence has a value)
      // we just return the score for this move without searching it
      return score;
    
    // escape condition
    if  (!depth)
      // search for calm position before evaluation
      return quiescence(alpha, beta);
      //return evaluate();

    // update nodes count
    nodes++;
    
    // is king in check?
    var in_check = is_square_attacked(king_square[side], side ^ 1);
    
    // increase depth if king is in check
    if (in_check) depth++;
    
    // legal moves
    var legal_moves = 0;
    
    // get static evaluation score
	  var static_eval = evaluate();
      
    // evaluation pruning / static null move pruning
	  if (depth < 3 && !pv_node && !in_check &&  Math.abs(beta - 1) > -infinity + 100) {   
      // define evaluation margin
		  var eval_margin = 120 * depth;
		  
		  // evaluation margin substracted from static evaluation score fails high
		  if (static_eval - eval_margin >= beta)
	      // evaluation margin substracted from static evaluation score
			  return static_eval - eval_margin;
	  }

	  // null move pruning
    if (depth >= 3 && in_check == 0 && ply)
    {
      // backup current board position
      var board_copy, king_square_copy, side_copy, enpassant_copy, castle_copy, fifty_copy, hash_copy;
      board_copy = JSON.parse(JSON.stringify(board));
      side_copy = side;
      enpassant_copy = enpassant;
      castle_copy = castle;
      fifty_copy = fifty;
      hash_copy = hash_key;
      king_square_copy = JSON.parse(JSON.stringify(king_square));
      
      // increment ply
      ply++;
      
      // increment repetition index & store hash key
      repetition_index++;
      repetition_table[repetition_index] = hash_key;
      
      // hash enpassant if available
      if (enpassant != no_sq) hash_key ^= piece_keys[enpassant];
      
      // reset enpassant capture square
      enpassant = no_sq;
      
      // switch the side, literally giving opponent an extra move to make
      side ^= 1;
      
      // hash the side
      hash_key ^= side_key;
              
      // search moves with reduced depth to find beta cutoffs
      score = -negamax(-beta, -beta + 1, depth - 1 - 2);

      // decrement ply
      ply--;
      
      // decrement repetition index
      repetition_index--;
          
      // restore board position
      board = JSON.parse(JSON.stringify(board_copy));
      side = side_copy;
      enpassant = enpassant_copy;
      castle = castle_copy;
      hash_key = hash_copy;
      fifty = fifty_copy;
      king_square = JSON.parse(JSON.stringify(king_square_copy));

      // reutrn 0 if time is up
      if (stopped == 1) return 0;

      // fail-hard beta cutoff
      if (score >= beta)
        // node (position) fails high
        return beta;
    }
    
	  // razoring
    if (!pv_node && !in_check && depth <= 3) {
      // get static eval and add first bonus
      score = static_eval + 125;
      
      // define new score
      var new_score;
      
      // static evaluation indicates a fail-low node
      if (score < beta) {
        // on depth 1
        if (depth == 1) {
          // get quiscence score
          new_score = quiescence(alpha, beta);
          
          // return quiescence score if it's greater then static evaluation score
          return (new_score > score) ? new_score : score;
        }
        
        // add second bonus to static evaluation
        score += 175;
        
        // static evaluation indicates a fail-low node
        if (score < beta && depth <= 2) {
          // get quiscence score
          new_score = quiescence(alpha, beta);
          
          // quiescence score indicates fail-low node
          if (new_score < beta)
            // return quiescence score if it's greater then static evaluation score
            return (new_score > score) ? new_score : score;
        }
      }
	  }
    
    // create move list variable
    var move_list = {
      moves: new Array(256),
      count: 0
    }
    
    // generate moves
    generate_moves(move_list);
    
    // if we are now following PV line
    if (follow_pv)
      // enable PV move scoring
      enable_pv_scoring(move_list);
        
    // move ordering
    sort_moves(move_list, best_move.value);
    
    // number of moves searched in a move list
    var moves_searched = 0;
    
    // loop over the generated moves
    for (var count = 0; count < move_list.count; count++)
    {
      // backup current board position
      var board_copy, king_square_copy, side_copy, enpassant_copy, castle_copy, fifty_copy, hash_copy;
      board_copy = JSON.parse(JSON.stringify(board));
      side_copy = side;
      enpassant_copy = enpassant;
      castle_copy = castle;
      fifty_copy = fifty;
      hash_copy = hash_key;
      king_square_copy = JSON.parse(JSON.stringify(king_square));
        
      // increment ply
      ply++;
      
      // increment repetition index & store hash key
      repetition_index++;
      repetition_table[repetition_index] = hash_key;
      
      // make only legal moves
      if (!make_move(move_list.moves[count], all_moves)) {
        // decrement ply
        ply--;
        
        // decrement repetition index
        repetition_index--;
        
        // skip illegal move
        continue;
      }
       
      // increment legal moves
      legal_moves++;
      
      // full depth search
      if (moves_searched == 0)
        // do normal alpha beta search
        score = -negamax(-beta, -alpha, depth - 1);
      
      // late move reduction (LMR)
      else {
        // condition to consider LMR
        if(
            moves_searched >= 4 &&
            depth >= 3 &&
            in_check == 0 && 
            get_move_capture(move_list.moves[count]) == 0 &&
            get_move_piece(move_list.moves[count]) == 0
          )
            // search current move with reduced depth:
            score = -negamax(-alpha - 1, -alpha, depth - 2);
        
        // hack to ensure that full-depth search is done
        else score = alpha + 1;
        
        // principle variation search PVS
        if(score > alpha)
        {
         /* Once you've found a move with a score that is between alpha and beta,
            the rest of the moves are searched with the goal of proving that they are all bad.
            It's possible to do this a bit faster than a search that worries that one
            of the remaining moves might be good. */
            score = -negamax(-alpha - 1, -alpha, depth-1);
        
         /* If the algorithm finds out that it was wrong, and that one of the
            subsequent moves was better than the first PV move, it has to search again,
            in the normal alpha-beta manner.  This happens sometimes, and it's a waste of time,
            but generally not often enough to counteract the savings gained from doing the
            "bad move proof" search referred to earlier. */
            if((score > alpha) && (score < beta))
             /* re-search the move that has failed to be proved to be bad
                with normal alpha beta score bounds*/
                score = -negamax(-beta, -alpha, depth-1);
        }
      }
      
      // decrement ply
      ply--;
      
      // decrement repetition index
      repetition_index--;

      // restore board position
      board = JSON.parse(JSON.stringify(board_copy));
      side = side_copy;
      enpassant = enpassant_copy;
      castle = castle_copy;
      hash_key = hash_copy;
      fifty = fifty_copy;
      king_square = JSON.parse(JSON.stringify(king_square_copy));
      
      // increment the counter of moves searched so far
      moves_searched++;
        
      // alpha acts like max in MiniMax
      if (score > alpha) {
        // switch hash flag from storing score for fail-low node
        // to the one storing score for PV node
        hash_flag = hash_flag_exact;
            
        // update history score
        history_moves[board[get_move_source(move_list.moves[count])] * 128 + get_move_target(move_list.moves[count])] += depth;

        // set alpha score
        alpha = score;
        
        // update best move
        best_move.value = move_list.moves[count];
        
        // store PV move
        pv_table[ply * 64 + ply] = move_list.moves[count];
        
        // update PV line
        for (var i = ply + 1; i < pv_length[ply + 1]; i++)
          pv_table[ply * 64 + i] = pv_table[(ply + 1) * 64 + i];
        
        // update PV length
        pv_length[ply] = pv_length[ply + 1];                
        
        //  fail hard beta-cutoff
        if (score >= beta) {
          // store hash entry with the score equal to beta
          write_hash_entry(beta, best_move.value, depth, hash_flag_beta);
          
          if (get_move_capture(move_list.moves[count]) == 0) {
            // update killer moves
            killer_moves[max_ply + ply] = killer_moves[ply];
            killer_moves[ply] = move_list.moves[count];
          }
          
          return beta;
        }
      }      
    }
    
    // if no legal moves
    if (!legal_moves) {
      // check mate detection
      if (in_check)
        return -mate_score + ply;
      
      // stalemate detection
      else
        return 0;
    }
    
    // store hash entry with the score equal to alpha
    write_hash_entry(alpha, best_move.value, depth, hash_flag);
    
    // return alpha score
    return alpha;
  }  

  // search position for the best move
  function search_position(depth) {
    // search start time
    var start = new Date().getTime();

    // define best score variable
    var score = 0;
    
    // clear search data structures
    clear_search();
        
    // define initial alpha beta bounds
    var alpha = -infinity;
    var beta = infinity;
 
    // iterative deepening
    for (var current_depth = 1; current_depth <= depth; current_depth++)
    {
      // if time is up
      if (stopped == 1)
		    // stop calculating and return best move so far 
		    break;
	  
      // enable follow PV flag
      follow_pv = 1;
      
      // find best move within a given position
      score = negamax(alpha, beta, current_depth);

      /* we fell outside the window, so try again with a full-width window (and the same depth)
      if ((score <= alpha) || (score >= beta)) {
        alpha = -infinity;    
        beta = infinity;      
        continue;
      }

      // set up the window for the next iteration
      alpha = score - 50;
      beta = score + 50;
      */
      // if PV is available
      if (pv_length[0]) {
        // print search info
        if (score > -mate_value && score < -mate_score)
          console.log('Score: mate in %d\nDepth: %d\nNodes: %d\nTime %d', -(score + mate_value) / 2 - 1, current_depth, nodes, new Date().getTime() - start);
        
        else if (score > mate_score && score < mate_value)
          console.log('Score: mate in %d\nDepth: %d\nNodes: %d\nTime %d', (mate_value - score) / 2 + 1, current_depth, nodes, new Date().getTime() - start);   
        
        else
          {}//console.log('Score: %d cp\nDepth: %d\nNodes: %d\nTime: %d', score, current_depth, nodes, new Date().getTime() - start);

        // define move string
        var pv_line = 'PV: ';
        
        // loop over the moves within a PV line
        for (var count = 0; count < pv_length[0]; count++)
          // print PV move
          pv_line += print_move(pv_table[count]) + ' ';
        
        // print new line
        console.log(pv_line);        
      }
    }
    
    // console log final info
    console.log('Score: %d cp\nDepth: %d\nNodes: %d\nTime: %d', score, depth, nodes, new Date().getTime() - start);

  }
  
  /****************************\
                 
                GUI
                 
  \****************************/

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

  // variable to check click-on-piece state
  var click_lock = false;

  // user input variables
  var user_source, user_target;

  // default search depth
  var search_depth = 3;

  function make_move_gui(square) {
    // convert div ID to square index
    var click_square = parseInt(square, 10)

    // if user clicks on source square 
    if(!click_lock && board[click_square]){
      // highlight clicked square
      document.getElementById(square).style.backgroundColor = '#fff';
      
      // init user source square
      user_source = click_square;
      
      // lock click
      click_lock ^= 1;
    }
    
    // if user clicks on destination square
    else if(click_lock){
      // extract row and column from target square
      var col = user_source & 7;
      var row = user_source >> 4;
      
      // restore color of the square that piece has left
      var color = (col + row) % 2 ? 'aaa' : 'eee'
      document.getElementById(user_source).style.backgroundColor = '#' + color;
      
      // move piece
      /*board[click_sq] = board[user_source];
      board[user_source] = 0;
      
      // if pawn promotion
      if(((board[click_sq] == 9) && (click_sq >= 0 && click_sq <= 7)) ||
         ((board[click_sq] == 18) && (click_sq >= 112 && click_sq <= 119)))
          board[click_sq] |= 7;    // convert pawn to corresponding side's queen
      */
      
      // change side
      //side ^= 1;
      
      // unlock click
      click_lock ^= 1;
      
      // update position
      update_board();
      
      // make computer move in response
      //setTimeout("think(search_depth)", 100);
      think(5);
    }
  }

  function think(depth){
    // search position
    var score = search_position(depth);

    // make computer move
    make_move(pv_table[0], all_moves);
    
    // Checkmate detection
    if(score == 10000){
      update_board();
      setTimeout(
        function(){
          alert("White is checkmated!");
          location.reload();
        }, 100);
    }
    
    else if(score == -10000){
      setTimeout(
        function(){
          alert("Black is checkmated!");
          location.reload();
        }, 100);
    }
    
    else {
      update_board();
    }
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
    // parse position from FEN string
    //parse_fen('r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1 ');
    parse_fen('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1 ');
    print_board();
    
    /* create move list
    var move_list = {
      moves: new Array(256),
      count: 0
    }
    
    // generate moves
    generate_moves(move_list);
    
    // print move list
    print_move_list(move_list);
    
    // init search variables
    clear_search();
    
    // sort moves
    sort_moves(move_list);
    
    // print move list after move ordering
    print_move_scores(move_list);
    */
    
    //perft_test(3);
    
    //search_position(5);
    

    
    
    draw_board();
    update_board();
    
  }
  
  /****************************\
                 
        PUBLIC API REFERENCE
                 
  \****************************/

  return {    
    // parse FEN to init board position
    parse_fen: function(fen) { return parse_fen(fen); },

    // generate pseudo legal moves
    generate_moves: function(move_list) { return generate_moves(move_list); },
    
    // make move
    make_move: function(square) { make_move_gui(square); },
    
    // think
    think: function(depth) { think(depth); },
    
    // search
    //search: function() { return new Promise(function() {search(); }); }
    
    // debug
    tests: function() { return tests(); }
  }
}

/* TEST DRIVER */

// create engine instance
var board = new Chess();
board.tests();


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



document.write('<button onclick="board.think(4)">MOVE</button>')



