function otherId(game){
    return game.currentTurn[game.currentTurn[0]===Meteor.userId()?1:0]
};

Template.gameList.helpers({
    games: function(){
        return Games.find({inProgress: true}).map(function(game){
            game.otherPlayer= Meteor.users.findOne(otherId(game)).username;
            game.started=moment(game.started).fromNow();
            return game;
        })
    }
});

Template.userList.helpers({
    users: function(){
        var myId = Meteor.userId(),
            cantPlayAgainst=[myId];
        Games.find({inProgress:true}).forEach(function(game){
            cantPlayAgainst.push(otherId(game));
        });

        return Meteor.users.find({
            _id:{$not:{$in:cantPlayAgainst}}
        });
    }
})
