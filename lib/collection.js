Games = new Mongo.Collection('games');
Credits = new Mongo.Collection('credits');

if (Meteor.isServer) {
    Meteor.publish('games', function(){
        return Games.find({currentTurn:this.userId});
    });
    Meteor.publish('users', function(){
        return Meteor.users.find();
    });
    Meteor.publish('credits', function(){
        return Credits.find({_id:this.userId})
    })
};

if (Meteor.isClient) {
    Meteor.subscribe('games');
    Meteor.subscribe('users');
    Meteor.subscribe('credits');
};


// game = {
//     currentTurn: [userid1, userid2] //this will alternate
//     boss:[userid1]
//     deck:[d10, s1, h3, c12, d11, s5, d10, s1, h3, c12, d11, s5, d10, s1, h3, c12, d11, s5,d10, s1, h3, c12, d11, s5],
//     table:[d10, s1, h3, c12, d11, s5, d10, s1],
//     players:{
//         playerA:{
//             hand:[d10, s1, h3, c12, d11, s5, s2], //at the start 11 cards
//             pile10:[],
//             pile05:[],
//             pile01:[],
//             score:{}
//         },
//         playerB:{
//             hand:[d10, s1, h3, c12, d11, s5, s2], //at the start 11 cards
//             pile10:[h2, ], // 1 point from 10 2~9 cards
//             pile05:[h10, h11, s10, s11], // 1 point from 5 ten,j,q,k cards
//             pile01:[d1, h1], // 1 point for every ace
//             go: 0 // interger
//             stooler:0, //싸고
//             bomber:0, //폭탄
//             shaker:0, //흔들고
//             cleaner:0, //쓸
//             kisser:0, //쪽
//             foiler: false //바가지
//             score:{}
//         }
//     },
//     inProgress: true/false,
//     started: date,
//     finished: date,
//     winner: userId
//     special:[
//         x2:true/false,
//         x4:true/false,
//         x8:true/false
//     ]
// }
