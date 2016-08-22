'use strict';

const _ = require('lodash');
const logger = require('logfmt');
var restaurants = [];

module.exports = socketservice;

function socketservice() {
    var self = this;

    var add = function(restaurant){
        let index = _.findIndex(restaurants, (resto)=>resto.id === restaurant.id && 
                                                    resto.socket.id===restaurant.socket.id);
        if(index !== -1) return;

        restaurants.push(restaurant);
    };

    var remove = function(socketId){
        let index = _.findIndex(restaurants, (resto)=>resto.socket.id === socketId);
        if(index !== -1){
            restaurants.splice(index,1);
        }
    };

    /**
     * return le socketId du restaurant ou -1
     */
    var findByRestaurant = function(restaurantId){

        return _.filter(restaurants, (resto)=>resto.id===restaurantId);
    };

    var findAll = function(){
        return sockets;
    };

    return {
        add: add,
        remove: remove,
        findByRestaurant: findByRestaurant,
        findAll:findAll
    };


};
