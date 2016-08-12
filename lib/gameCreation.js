GameFactory = {};

GameFactory.createGame = function(playerIds){
    var deck = createDeck(),
        players = createPlayers(playerIds);
    GameFactory.dealPlayers(players, deck);
    var table = dealTable(deck);
    return {
        deck:deck,
        players:players,
        table: table,
        currentTurn: playerIds,
        inProgress: true,
        playerTurn:true,
        stooler:false,
        started: new Date(),
        target: [],
        mySelection:[]
    };
};
GameFactory.dealPlayers = function(players, deck){
    for (var i = 0; i < 11; i++) {
        Object.keys(players).forEach(function(id){
            players[id].hand.push(deck.shift());
        });
    }
};
function dealTable(deck){
    var c = deck.shift.bind(deck);
    return [c(),c(),c(),c(),c(),c(),c(),c()]
}

function createPlayers(ids){
    var o = {};
    ids.forEach(function(id){
        o[id]={
            hand: [],
            pile10: [],
            pile05: [],
            pile01: [],
            score: 0,
            go:0,           //고
            stooler:0,      //싸고
            times: 1,  //흔들고
        }
    });
    return o;
}

function createDeck(){
    var suits = ['♥', '♦', '♣', '♠'],
        cards = [];
    suits.forEach(function(suit){
        for (var i = 1; i <= 13; i++) {
            var name = i;
            if (i ===  1) name = 'A';
            if (i === 11) name = 'J';
            if (i === 12) name = 'Q';
            if (i === 13) name = 'K';
            cards.push({
                suit:suit,
                value:i,
                name: name
            });
        }
    });
    return _.shuffle(cards);
}
