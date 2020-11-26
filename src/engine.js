/************************************************\
 ------------------------------------------------
 
                 CODE MONKEY CHESS
 
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
var Engine = function() {
  
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

  // castling rights (bits)
  const KC = 1, QC = 2, kc = 4, qc = 8;
  
  // 0x88 chess board representation
  var board = [
      r, n, b, q, k, b, n, r,  o, o, o, o, o, o, o, o,
      p, p, p, p, p, p, p, p,  o, o, o, o, o, o, o, o,
      e, e, e, e, e, e, e, e,  o, o, o, o, o, o, o, o,
      e, e, e, e, e, e, e, e,  o, o, o, o, o, o, o, o,
      e, e, e, e, e, e, e, e,  o, o, o, o, o, o, o, o,
      e, e, e, e, e, e, e, e,  o, o, o, o, o, o, o, o,
      P, P, P, P, P, P, P, P,  o, o, o, o, o, o, o, o,
      R, N, B, Q, K, B, N, R,  o, o, o, o, o, o, o, o
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
  function random()
  {
      // get current state
      var number = random_state;
      
      // XOR shift algorithm
      number ^= number << 13;
      number ^= number >> 17;
      number ^= number << 5;
      
      // update random number state
      random_state = number;
      
      // return random number
      return new Uint32Array([number])[0];
  }
  
  /****************************\
                 
           ZOBRIST KEYS
                 
  \****************************/
  
  // random piece keys (piece * square)
  var piece_keys = new Uint32Array(14 * 128);
  
  // init random hash keys
  (function init_random_keys()
  {
    // loop over piece codes
    for (var index = 0; index < 14 * 128; index++)
    {
     
        // init random piece keys
        piece_keys[index] = random();
    }

    // loop over board squares
    for (int square = 0; square < 128; square++)
      // init random enpassant keys
      enpassant_keys[square] = random();
    
    // loop over castling keys
    for (int index = 0; index < 16; index++)
      // init castling keys
      castle_keys[index] = get_random_U64_number();
        
    // init random side key
    side_key = get_random_U64_number();*/
  }())
  
  /****************************\
                 
              METHODS
                 
  \****************************/
  
  // get side to move
  function get_side() {
    return side;
  }
  
  // set side to move
  function set_side(color) {
    side = color;
  }
  
  // get enpassant square
  function get_enpassant() {
    return enpassant;
  }
  
  // set enpassant square
  function set_enpassant(square) {
    enpassant = square;
  }
  
  // get castling rights
  function get_castle() {
    return castle;
  }
  
  // set castling rights
  function set_castle(rights) {
    castle = rights;
  }
  
  // get piece from at the given board square
  function get_piece(square) {
    return board[square];
  }
  
  // set piece to the given board square
  function set_piece(piece, square) {
    board[square] = piece;
  }
  
  // pop piece from the given board square
  function pop_piece(square) {
    board[square] = e;
  }
  
  // get fifty move count
  function get_fifty() {
    return fifty;
  }
  
  // set fifty move count
  function set_fifty(count) {
    fifty = count;
  }
  
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
    board_string += '\n\n  50 moves: ' + fifty; 
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
        if ((square & 0x88) == 0)
        {
          // match pieces
          if ((fen[index].charCodeAt() >= 'a'.charCodeAt() &&
               fen[index].charCodeAt() <= 'z'.charCodeAt()) || 
              (fen[index].charCodeAt() >= 'A'.charCodeAt() &&
               fen[index].charCodeAt() <= 'Z'.charCodeAt()))
          {
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
              fen[index].charCodeAt() <= '9'.charCodeAt())
          {
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
    while (fen[index] != ' ')
    {
        switch(fen[index])
        {
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
    if (fen[index] != '-')
    {
        // parse enpassant square's file & rank
        var file = fen[index].charCodeAt() - 'a'.charCodeAt();
        var rank = 8 - (fen[index + 1].charCodeAt() - '0'.charCodeAt());

        // set up enpassant square
        enpassant = rank * 16 + file;
    }
    
    else
        enpassant = no_sq;
    
    // parse 50 move count
    fifty = Number(fen.slice(index, fen.length - 1).split(' ')[1]);

    // TODO init hash key
  }
  
  /****************************\
                 
        PUBLIC API REFERENCE
                 
  \****************************/

  return {
    // side to move color
    color: {
      WHITE: white,
      BLACK: black
    },
    
    // piece codes
    pieces: {
      NO_PIECE: e,
      WHITE_PAWN: P,
      WHITE_KNIGHT: N,
      WHITE_BISHOP: B,
      WHITE_ROOK: R,
      WHITE_QUEEN: Q,
      WHITE_KING: K,
      BLACK_PAWN: p,
      BLACK_KNIGHT: n,
      BLACK_BISHOP: b,
      BLACK_ROOK: r,
      BLACK_QUEEN: q,
      BLACK_KING: k
    },
    
    // square indices
    squares: {
      A8: a8, B8: b8, C8: c8, D8: d8, E8: e8, F8: f8, G8: g8, H8: h8, 
      A7: a7, B7: b7, C7: c7, D7: d7, E7: e7, F7: f7, G7: g7, H7: h7, 
      A6: a6, B6: b6, C6: c6, D6: d6, E6: e6, F6: f6, G6: g6, H6: h6, 
      A5: a5, B5: b5, C5: c5, D5: d5, E5: e5, F5: f5, G5: g5, H5: h5, 
      A4: a4, B4: b4, C4: c4, D4: d4, E4: e4, F4: f4, G4: g4, H4: h4, 
      A3: a3, B3: b3, C3: c3, D3: d3, E3: e3, F3: f3, G3: g3, H3: h3, 
      A2: a2, B2: b2, C2: c2, D2: d2, E2: e2, F2: f2, G2: g2, H2: h2, 
      A1: a1, B1: b1, C1: c1, D1: d1, E1: e1, F1: f1, G1: g1, H1: h1
    },
    
    // square coordinates
    coordinates: coordinates,
    
    // unicode pieces
    unicode_pieces: unicode_pieces,
  
    // side to move interaction
    get_side: function() { return get_side(); },
    set_side: function(color) { return set_side(color); },
    
    // board enpassant saquare interaction
    get_enpassant: function() { return get_enpassant(); },
    set_enpassant: function(square) { return set_enpassant(square); },
    
    // board castling rights interaction
    get_castle: function() { return get_castle(); },
    set_castle: function(rights) { return set_castle(rights); },
  
    // fifty move count interaction
    get_fifty: function() { return get_fifty(); },
    set_fifty: function(count) { return set_fifty(count)},
    
    // chess board array interaction
    get_piece: function(square) { return get_piece(square); },
    set_piece: function(piece, square) { return set_piece(piece, square); },
    pop_piece: function(square) { return pop_piece(square); },
    
    // print chess board to console
    print_board: function() { return print_board(); },
    
    // reset board
    reset_board: function() { return reset_board(); },
    
    // parse FEN to init board position
    parse_fen: function(fen) { return parse_fen(fen); }
  }
}

/* TEST DRIVER */

// create engine instance
var engine = new Engine();

engine.parse_fen('r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1 ');
engine.print_board();

// 'r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1 '
// 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1 '
// 'r2q1rk1/ppp2ppp/2n1bn2/2b1p3/3pP3/3P1NPP/PPP1NPB1/R1BQ1RK1 b - - 0 9 '









