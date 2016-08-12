Turns = {};

//checks if cardObject is included in the setArray
Turns.inHand = function(set, cardObject) {
    for (var i = 0; i < set.length; i++) {
        if (matchCard(set[i], cardObject)) return true;
    }
    return false;
};
function matchCard(a,b){
    return a.suit===b.suit && a.value===b.value;
}
Turns.check4bomber =  function(gameId, playerId, card, hand){
    var bomberFound = [];
    hand.forEach(function(eachCardInHand){
        if (eachCardInHand.value === card.value) {
            bomberFound.push(eachCardInHand)
        }
    })
    return bomberFound;
};

Turns.findMatches =  function(card, set){
    var matchFound = [];
    set.forEach(function(eachCardInSet){
        if (eachCardInSet.value === card.value) {
            matchFound.push(eachCardInSet)
        }
    })
    return matchFound;
};

Turns.insertOneCardInTarget = function(gameId, card) {
    var tempObj = {};
    tempObj['target'] = [];

    tempObj['target'].push(card)
    Games.update(gameId, {$set:tempObj});
};
Turns.insertCardsInTarget = function(gameId, set, card) {
    var tempObj = {};
    tempObj['target'] = [];
    for (var i = 0; i < set.length; i++) {
        tempObj['target'].push(set[i])
    }
    // tempObj['target'].push(card)
    Games.update(gameId, {$set:tempObj});
};
Turns.insertCardsInMySelection = function(gameId, card) {
    var tempObj = {};
    tempObj['mySelection'] = [];
    tempObj['mySelection'].push(card)
    Games.update(gameId, {$set:tempObj});
};
Turns.insertBomberInMySelection = function(gameId, set) {
    var tempObj = {};
    tempObj['mySelection'] = [];
    for (var i = 0; i < set.length; i++) {
        tempObj['mySelection'].push(set[i])
    }
    Games.update(gameId, {$set:tempObj});
};


////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
Turns.addCardToTable = function (gameId, card) {
    Games.update(gameId, {
        $push:{table:card}
    });
}
Turns.addCardArrayToTable = function (gameId, tableArr, importArr) {
    var tempObj = {};
    tempObj['table'] = tableArr
    for (var i = 0; i < importArr.length; i++) {
        tempObj['table'].push(importArr[i])
    }
    Games.update(gameId, {$set:tempObj});
}
Turns.removeCardFromHand = function (gameId, playerId, card, set) {
    var tempObj = {};
    tempObj['players.'+playerId+'.hand'] = card;
    Games.update(gameId, {
        $pull:tempObj
    });
}
Turns.removeCardArrayFromHand = function (currentPlayer, gameId, playerId, cardArray, importArr) {
    for (var i = 0; i < cardArray.length; i++) {
        var index = importArr.indexOf(cardArray[i]);
        importArr.splice(index, 1);
    }
    var tempObj = {};
    tempObj['players.'+playerId+'.hand'] = importArr;
    Games.update(gameId, {$set:tempObj});
}
////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////


Turns.removeCardFromDeck = function (gameId, card) {
    Games.update(gameId, {
        $pull:{deck:card}
    });
}



Turns.takeMatch = function(gameId, game, playerId, card, match) {
    var tempObj = {}
    if (card.value === 1) {
        tempObj['players.'+playerId+'.pile01'] = match[0];
        Games.update(gameId, {
            $push:tempObj
        });
        tempObj['players.'+playerId+'.pile01'] = card;
        Games.update(gameId, {
            $push:tempObj
        });
    } else if (card.value > 9) {
        tempObj['players.'+playerId+'.pile05'] = match[0];
        Games.update(gameId, {
            $push:tempObj
        });
        tempObj['players.'+playerId+'.pile05'] = card;
        Games.update(gameId, {
            $push:tempObj
        });

    } else {
        tempObj['players.'+playerId+'.pile10'] = match[0];
        Games.update(gameId, {
            $push:tempObj
        });
        tempObj['players.'+playerId+'.pile10'] = card;
        Games.update(gameId, {
            $push:tempObj
        });
    }
};
Turns.takeRest = function(gameId, game, playerId, card) {
    var tempObj = {}
    if (card.value === 1) {
        tempObj['players.'+playerId+'.pile01'] = card;
        Games.update(gameId, {
            $push:tempObj
        });
    } else if (card.value > 9) {
        tempObj['players.'+playerId+'.pile05'] = card;
        Games.update(gameId, {
            $push:tempObj
        });
    } else {
        tempObj['players.'+playerId+'.pile10'] = card;
        Games.update(gameId, {
            $push:tempObj
        });
    }
};
Turns.takePlayerMatch = function(gameId, game, playerId, card, match) {
    var tempObj = {}
    if (match[0].value === 1) {
        for (var i = 0; i < match.length; i++) {
            tempObj['players.'+playerId+'.pile01'] = match[i];
            Games.update(gameId, {
                $push:tempObj
            });
        }
    } else if (match[0].value > 9) {
        for (var i = 0; i < match.length; i++) {
            tempObj['players.'+playerId+'.pile05'] = match[i];
            Games.update(gameId, {
                $push:tempObj
            });
        }
    } else {
        for (var i = 0; i < match.length; i++) {
            tempObj['players.'+playerId+'.pile10'] = match[i];
            Games.update(gameId, {
                $push:tempObj
            });
        }
    }
};

Turns.removeCardFromTable = function (gameId, card) {
    Games.update(gameId, {
        $pull:{table:card}
    });
}
Turns.removeCardsFromTable = function (gameId, cardArr) {
    var tempObj = {};
    for (var i = 0; i < cardArr.length; i++) {
        tempObj['table'] = cardArr[i]
        Games.update(gameId, {
            $pull:tempObj
        });
    }
}

Turns.takeOppCard = function (special,game,gameId) {
    // console.log(special+" Take one card from opponents pile");
    // var otherPlayerId = game.currentTurn[game.currentTurn[0]===Meteor.userId()?1:0];
    // console.log(otherPlayerId);
    // if (game.players[otherPlayerId].pile05) {
    //     var cardToTake = [];
    //     cardToTake.push(game.players[otherPlayerId].pile05[0]);
    //     var tempObj = {};
    //     tempObj['players.'+otherPlayerId+'.pile05'] = cardToTake
    //     console.log(tempObj);
    //     // Games.update(gameId, {
    //     //     $set:{tempObj}
    //     // });
    // }
}

// $pull:{deck:card}

Turns.ceo = function (){
    console.log('CEO!!!');
}
Turns.bomber = function (gameId, playerId, hand){
    var tempObj = {};
    tempObj['players.'+playerId+'.hand'] = hand
    var dummy1={
              "suit": "💣",
              "value": -1,
              "name": "B"
          };
    var dummy2={
              "suit": "💣",
              "value": -2,
              "name": "B"
          };
    tempObj['players.'+playerId+'.hand'].push(dummy1)
    tempObj['players.'+playerId+'.hand'].push(dummy2)
    Games.update(gameId, {
        $set:tempObj
    });
}
Turns.shaker = function (){
    console.log('Shaker');
}
Turns.ohYeah = function (){
    console.log('Oh Yeah!');
}

Turns.checkCleaner = function (game, gameId){
    console.log('checking for cleaner: '+game.table.length);
    if (game.table.length===0) {
        Turns.takeOppCard('Cleaner');
    }
}

Turns.calcScore = function(game, gameId, playerId){
    var score = game.players[playerId].score;
    var pile01 = game.players[playerId].pile01.length;
    var pile05 = game.players[playerId].pile05.length;
    var pile10 = game.players[playerId].pile10.length;

    if (pile01>1) {
        pile01 = pile01-1;
    } else {
        pile01 = 0;
    }
    if (pile05>3) {
        pile05 = pile05-3;
    } else {
        pile05 = 0;
    }
    if (pile10>7) {
        pile10 = pile10-7;
    } else {
        pile10 = 0;
    }


    score=pile01+pile05+pile10;
    var tempObj = {};
    tempObj['players.'+playerId+'.score'] = score;
    Games.update(gameId, {$set:tempObj});

    if (score>7) {
        if (Meteor.isClient) {
            alert("You have "+score+"pts! Do you want to 'Stop' the game or 'Go' for more points?")
        }
        Games.update(gameId, {
            $set:{inProgress:false}
        });
    }
}

Turns.endTurn = function (gameId, playerId){
    var tempObj = {};
    tempObj['mySelection'] = [];
    Games.update(gameId, {$set:tempObj});
    var tempObj2 = {};
    tempObj2['target'] = [];
    Games.update(gameId, {$set:tempObj2});
    Games.update(gameId, {
        $set:{playerTurn:true}
    });

    var empObj = {playerId}
    Games.update(gameId, {
        $pull: {currentTurn: playerId}
    });
    Games.update(gameId, {
        $push: { currentTurn: { $each: [playerId], $position: 1 } }
    });
}
