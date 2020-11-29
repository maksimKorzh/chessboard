// negamax alpha beta search
  function negamax(alpha, beta, depth)
  {
    // init PV length
    pv_length[ply] = ply;
    
    // variable to store current move's score (from the static evaluation perspective)
    var score;
    
    // best move (to store in TT)
    var best_move = 0;
    
    // define hash flag
    //var hash_flag = hash_flag_alpha;
    
    // if position repetition occurs
    //if (ply && is_repetition() || fifty >= 100)
        // return draw score
        //return 0;
    
    // a hack by Pedro Castro to figure out whether the current node is PV node or not 
    var pv_node = beta - alpha > 1;
    
    // read hash entry if we're not in a root ply and hash entry is available
    // and current node is not a PV node
    //if (ply && (score = read_hash_entry(alpha, beta, &best_move, depth)) != no_hash_entry && pv_node == 0)
      // if the move has already been searched (hence has a value)
      // we just return the score for this move without searching it
      //return score;
        
    // every 2047 nodes
    //if((nodes & 2047 ) == 0)
      // "listen" to the GUI/user input
	    //communicate();
    
    // recursion escapre condition
    if (depth == 0)
      // run quiescence search
      return quiescence(alpha, beta);

    // we are too deep, hence there's an overflow of arrays relying on max ply constant
    if (ply > max_ply - 1)
      // evaluate position
      return evaluate();

    // increment nodes count
    nodes++;
    
    // is king in check
    var in_check = is_square_attacked(king_square[side], side ^ 1);
    
    // increase search depth if the king has been exposed into a check
    if (in_check) depth++;
    
    // legal moves counter
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
    if (depth >= 3 && in_check == 0 && ply) {
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
      
    // create move list instance
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
    
    // sort moves
    sort_moves(move_list, best_move);
    
    // number of moves searched in a move list
    var moves_searched = 0;
    
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
      if (!make_move(move_list.moves[count], all_moves)) {
          // decrement ply
          ply--;
          
          // decrement repetition index
          repetition_index--;
          
          // skip to next move
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
            moves_searched >= full_depth_moves &&
            depth >= reduction_limit &&
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
                with normal alpha beta score bounds */
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
      
      // reutrn 0 if time is up
      if (stopped == 1)
        return 0;
      
      // increment the counter of moves searched so far
      moves_searched++;
      
      // found a better move
      if (score > alpha) {
        // switch hash flag from storing score for fail-low node
        // to the one storing score for PV node
        //hash_flag = hash_flag_exact;
        
        // store best move (for TT)
        best_move = move_list.moves[count];
    
        // on quiet moves
        if (get_move_capture(move_list.moves[count]) == 0)
          // store history moves
          history_moves[get_move_piece(move_list.moves[count]) * 128 + get_move_target(move_list.moves[count])] += depth;
        
        // PV node (position)
        alpha = score;
        
        // write PV move
        pv_table[ply * max_ply + ply] = move_list.moves[count];
        
        // loop over the next ply
        for (var next_ply = ply + 1; next_ply < pv_length[ply + 1]; next_ply++)
          // copy move from deeper ply into a current ply's line
          pv_table[ply * max_ply + next_ply] = pv_table[(ply + 1) * max_ply + next_ply];
        
        // adjust PV length
        pv_length[ply] = pv_length[ply + 1];
        
        // fail-hard beta cutoff
        if (score >= beta)
        {
          // store hash entry with the score equal to beta
          //write_hash_entry(beta, best_move, depth, hash_flag_beta);
      
          // on quiet moves
          if (get_move_capture(move_list.moves[count]) == 0) {
            // store killer moves
            killer_moves[max_ply + ply] = killer_moves[ply];
            killer_moves[ply] = move_list.moves[count];
          }
          
          // node (position) fails high
          return beta;
        }            
      }
    }
    
    // we don't have any legal moves to make in the current postion
    if (legal_moves == 0) {
      // king is in check
      if (in_check)
        // return mating score (assuming closest distance to mating position)
        return -mate_value + ply;
      
      // king is not in check
      else
        // return stalemate score
        return 0;
    }
    
    // store hash entry with the score equal to alpha
    //write_hash_entry(alpha, best_move, depth, hash_flag);
    
    // node (position) fails low
    return alpha;
  }
