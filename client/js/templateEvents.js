Template.signup.events({
    'click button': function(e,t){
        e.preventDefault();
        Accounts.createUser({
            email: t.find('#su_email').value,
            username: t.find('#su_username').value,
            password: t.find('#su_password').value,
        });
        t.find('#su_email').value = "";
        t.find('#su_username').value = "";
        t.find('#su_password').value = "";
    }
});

Template.login.events({
    'click button': function(e,t){
        e.preventDefault();
        Meteor.loginWithPassword(
            t.find('#li_username').value,
            t.find('#li_password').value
        );
        t.find('#li_username').value = "";
        t.find('#li_password').value = "";
    }
});

Template.logout.events({
    'click button': function(e,t){
        e.preventDefault();
        Meteor.logout();
    }
});

Template.userItem.events({
    'click button':function(e,t){
        Meteor.call('createGameMethod', t.data._id);
    }
})

Template.hand.events({
    'click #pickMyHand':function(e,t){
        if (t.data.yourTurn) {
            Meteor.call('takePlayerTurnMethod', t.data._id, Meteor.userId(), this)
        } else {
            alert('This is not your turn! Please wait for your opponent.');
        }
    },

})
Template.deck.events({
    'click #pickDeck':function(e,t){
        if (t.data.yourTurn) {
            Meteor.call('takeDeckTurnMethod', t.data._id, Meteor.userId(), this)
        } else {
            alert('This is not your turn. Please wait for your opponent.');
        };
        Meteor.call('endTurnMethod', t.data._id, Meteor.userId(), this)
    }
})
Template.table.events({
    'click #pickTable':function(e,t){
        console.log(this.value);
    }
})
