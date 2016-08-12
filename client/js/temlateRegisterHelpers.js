Template.registerHelper('sort', function(cards){
    return _.sortBy(cards, 'value')
});
Template.registerHelper('red', function(cards){
    if (this.suit=="♥" || this.suit=="♦") {
        return true;
    }
});
