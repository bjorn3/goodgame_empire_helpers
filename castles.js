/* global Meteor, Template, Session, Mongo, Router, AccountsTemplates, $, SimpleSchema */

Castles = new Mongo.Collection("castles");

Castles.attachSchema(new SimpleSchema({
    name: {
        type: String
    },
    wereld: {
        type: String
    },
    X: {
        type: Number
    },
    Y: {
        type: Number
    },
    owner: {
        type: String
    }
}));
