var playerTurnOver = false;
Meteor.methods({
    createGameMethod: function(otherPlayerId){
        var game = GameFactory.createGame([Meteor.userId(), otherPlayerId]);
        Games.insert(game);
    },
    takePlayerTurnMethod: function(gameId, playerId, card){
        var game = Games.findOne(gameId);
        var playerTurn = game.playerTurn;
        var inProgress = game.inProgress;
        if (!inProgress) {
            console.log('Game has ended');
            return;
        }
        if (playerTurn) {
            var hand = game.players[playerId].hand; //player's cards array
            var currentPlayer = game.players[playerId];
            var matchFound = Turns.findMatches(card, game.table); //matched array
            var bomberFound = Turns.check4bomber(gameId, playerId, card, hand); //bomber array
            if (bomberFound.length===4) {
                Turns.insertCardsInTarget(gameId, matchFound, card);
                Turns.insertBomberInMySelection(gameId, bomberFound);
                Turns.ceo(gameId, card)
                Turns.removeCardArrayFromHand(currentPlayer, gameId, playerId, bomberFound, hand);
                Turns.addCardArrayToTable(gameId, game.table, bomberFound);
            } else if (bomberFound.length===3 && matchFound.length===1) {
                Turns.insertCardsInTarget(gameId, matchFound, card);
                Turns.insertBomberInMySelection(gameId, bomberFound);
                Turns.takeOppCard("bomber", game, gameId);
                Turns.bomber(gameId, playerId, hand);
                Turns.removeCardArrayFromHand(currentPlayer, gameId, playerId, bomberFound, hand);
                Turns.addCardArrayToTable(gameId, game.table, bomberFound);
            } else if (bomberFound.length===3 && matchFound.length===0) {
                Turns.insertCardsInTarget(gameId, matchFound, card);
                Turns.insertCardsInMySelection(gameId, card);
                Turns.shaker(gameId, card)
                Turns.removeCardFromHand(gameId, playerId, card, hand);
                Turns.addCardToTable(gameId, card);
            } else if (bomberFound.length===1 && matchFound.length===3) {
                Turns.insertCardsInTarget(gameId, matchFound, card);
                Turns.insertCardsInMySelection(gameId, card);
                Turns.removeCardFromHand(gameId, playerId, card, hand);
                Turns.addCardToTable(gameId, card);
            } else if (matchFound.length === 2) {
                Turns.insertOneCardInTarget(gameId, matchFound[0]);
                Turns.insertCardsInMySelection(gameId, card);
                Turns.removeCardFromHand(gameId, playerId, card, hand);
                Turns.addCardToTable(gameId, card);
            } else if (matchFound.length > 0) {
                Turns.insertCardsInTarget(gameId, matchFound, card);
                Turns.insertCardsInMySelection(gameId, card);
                Turns.removeCardFromHand(gameId, playerId, card, hand);
                Turns.addCardToTable(gameId, card);
            } else if (card.value<0) {
                Turns.insertCardsInMySelection(gameId, card);
                Turns.removeCardFromHand(gameId, playerId, card, hand);
            }
            else {
                Turns.insertCardsInTarget(gameId, matchFound, card);
                Turns.insertCardsInMySelection(gameId, card);
                Turns.removeCardFromHand(gameId, playerId, card, hand);
                Turns.addCardToTable(gameId, card);
            }
        } else {
            console.log('flip one card from deck');
        }
        Games.update(gameId, {
            $set:{playerTurn:false}//set it to false to play deckhand
        });
    },
    takeDeckTurnMethod: function(gameId, playerId, game){
        var card = game.deck[0]
        var game = Games.findOne(gameId);
        var playerTurn = game.playerTurn;
        var matchFound = Turns.findMatches(game.deck[0], game.table); //matched array
        if (!playerTurn) {
            if (matchFound.length===0) {    //no match
                if (game.target.length>0) {     // checks if my played card has a match
                    Turns.takePlayerMatch(gameId, game, playerId, card, game.mySelection);
                    Turns.takePlayerMatch(gameId, game, playerId, card, game.target);
                    Turns.removeCardsFromTable(gameId, game.mySelection);
                    Turns.removeCardsFromTable(gameId, game.target);
                }
                Turns.removeCardFromDeck(gameId, game.deck[0])
                Turns.addCardToTable(gameId, game.deck[0]);
            } else if (matchFound.length===1 && game.deck[0].value===game.mySelection[0].value) {   //matches my card
                Turns.takeOppCard("Its a kisser");
                Turns.removeCardFromDeck(gameId, game.deck[0]);
                Turns.addCardToTable(gameId, game.deck[0]);
                Turns.takeMatch(gameId, game, playerId, card, matchFound);
                Turns.removeCardFromTable(gameId, card);
                Turns.removeCardFromTable(gameId, matchFound[0]);
            } else if (matchFound.length===2 && game.deck[0].value===game.mySelection[0].value && game.target.length===1) {
                console.log('STOOLED!!!!');
                Turns.removeCardFromDeck(gameId, game.deck[0]);
                Turns.addCardToTable(gameId, game.deck[0]);
            } else if (matchFound.length===3) {

                if (game.target.length>0) {     // checks if my played card has a match
                    Turns.takePlayerMatch(gameId, game, playerId, card, game.mySelection);
                    Turns.takePlayerMatch(gameId, game, playerId, card, game.target);
                    Turns.removeCardsFromTable(gameId, game.mySelection);
                    Turns.removeCardsFromTable(gameId, game.target);
                }
                Turns.takeOppCard('Oh Yeah!!!');
                Turns.removeCardFromDeck(gameId, game.deck[0]);
                Turns.addCardToTable(gameId, game.deck[0]);
                Turns.takePlayerMatch(gameId, game, playerId, card, matchFound);
                Turns.takeRest(gameId, game, playerId, card);

                Turns.removeCardFromTable(gameId, card);
                Turns.removeCardFromTable(gameId, matchFound[2]);
                Turns.removeCardFromTable(gameId, matchFound[1]);
                Turns.removeCardFromTable(gameId, matchFound[0]);
            } else if (matchFound.length===1) {
                if (game.target.length>0) {     // checks if my played card has a match
                    Turns.takePlayerMatch(gameId, game, playerId, card, game.mySelection);
                    Turns.takePlayerMatch(gameId, game, playerId, card, game.target);
                    Turns.removeCardsFromTable(gameId, game.mySelection);
                    Turns.removeCardsFromTable(gameId, game.target);
                }
                Turns.removeCardFromDeck(gameId, game.deck[0]);
                Turns.addCardToTable(gameId, game.deck[0]);
                Turns.takeMatch(gameId, game, playerId, card, matchFound);
                Turns.removeCardFromTable(gameId, card);
                Turns.removeCardFromTable(gameId, matchFound[0]);
            } else if (matchFound.length===2) {
                if (game.target.length>0) {     // checks if my played card has a match
                    Turns.takePlayerMatch(gameId, game, playerId, card, game.mySelection);
                    Turns.takePlayerMatch(gameId, game, playerId, card, game.target);
                    Turns.removeCardsFromTable(gameId, game.mySelection);
                    Turns.removeCardsFromTable(gameId, game.target);
                }
                Turns.removeCardFromDeck(gameId, game.deck[0]);
                Turns.addCardToTable(gameId, game.deck[0]);
                Turns.takeMatch(gameId, game, playerId, card, matchFound);
                Turns.removeCardFromTable(gameId, card);
                Turns.removeCardFromTable(gameId, matchFound[0]);
            }
        } else {
            console.log('play the players move first');
        }
    },
    endTurnMethod: function(gameId, playerId, card){
        var game = Games.findOne(gameId);
        Turns.checkCleaner(game, gameId);
        Turns.calcScore(game, gameId, playerId);
        Turns.endTurn(gameId, playerId);
    }
});
