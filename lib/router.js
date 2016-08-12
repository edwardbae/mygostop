Router.configure({
    layoutTemplate: 'layout'
});

Router.map(function(){
    this.route('home',{
        path:'/',
        data: function(){

        },
    });
    this.route('play',{
        path:'/game/:_id',
        data: function(){
            Session.set("gameId", this.params._id);
            var game = Games.findOne(this.params._id);
            if (game) {
                game.inProgress = game.inProgress;
                game.player = game.players[Meteor.userId()];
                game.yourTurn = game.currentTurn[0] === Meteor.userId();
                game.lastCard = game.mySelection;
                var otherId = game.currentTurn[game.yourTurn ? 1 : 0];
                game.otherPlayer = {
                    username: Meteor.users.findOne(otherId).username,
                    score: game.players[otherId].score,
                    hand:game.players[otherId].hand,
                    pile10:game.players[otherId].pile10,
                    pile05:game.players[otherId].pile05,
                    pile01:game.players[otherId].pile01,
                    go:game.players[otherId].go,
                    times:game.players[otherId].times,
                };
                return game;
            }
            return {};
        }
    });
})
