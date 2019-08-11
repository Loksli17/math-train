const config   = require('../config');
const mongoose = require('../lib/database/mongoose');
const async      = require('async');
const News = require('../models/newsModel');

let query = async () => {
    let remove = await News.remove({});

    let create = await async.parallel([
            function(callback){
                let mathNew = new News({
                    title:'I. The Book',

                    image: '1.jpg',

                    text:" The place was dark and dusty and half-lost \n" +
                        "In tangles of old alleys near the quays, \n" +
                        "Reeking of strange things brought in from the seas, \n" +
                        "And with queer curls of fog that west winds tossed. \n" +
                        "Small lozenge panes, obscured by smoke and frost, \n" +
                        "Just shewed the books, in piles like twisted trees, \n" +
                        "Rotting from floor to roof - congeries \n" +
                        "Of crumbling elder lore at little cost. ",

                    description:"The place was dark and dusty and half-lost \n" +
                        "In tangles of old alleys near the quays",

                    date :"09-08-2019 17:21",

                    view : 0,
                });
                mathNew.save(function(err){
                    if(err){
                        console.log(err);
                        throw err;
                    }
                    callback(err, mathNew);
                });
            },
            function(callback){
                let mathNew = new News({
                    title:'I. The Book',

                    image: '1.jpg',

                    text:" The place was dark and dusty and half-lost \n" +
                        "In tangles of old alleys near the quays, \n" +
                        "Reeking of strange things brought in from the seas, \n" +
                        "And with queer curls of fog that west winds tossed. \n" +
                        "Small lozenge panes, obscured by smoke and frost, \n" +
                        "Just shewed the books, in piles like twisted trees, \n" +
                        "Rotting from floor to roof - congeries \n" +
                        "Of crumbling elder lore at little cost. ",

                    description:"The place was dark and dusty and half-lost \n" +
                        "In tangles of old alleys near the quays",

                    date :"09-08-2019 17:21",

                    view : 0,
                });
                mathNew.save(function(err){
                    if(err){
                        console.log(err);
                        throw err;
                    }
                    callback(err, mathNew);
                });
            },
            function(callback){
                let mathNew = new News({
                    title:'I. The Book',

                    image: '1.jpg',

                    text:" The place was dark and dusty and half-lost \n" +
                        "In tangles of old alleys near the quays, \n" +
                        "Reeking of strange things brought in from the seas, \n" +
                        "And with queer curls of fog that west winds tossed. \n" +
                        "Small lozenge panes, obscured by smoke and frost, \n" +
                        "Just shewed the books, in piles like twisted trees, \n" +
                        "Rotting from floor to roof - congeries \n" +
                        "Of crumbling elder lore at little cost. ",

                    description:"The place was dark and dusty and half-lost \n" +
                        "In tangles of old alleys near the quays",

                    date :"09-08-2019 17:21",

                    view : 0,
                });
                mathNew.save(function(err){
                    if(err){
                        console.log(err);
                        throw err;
                    }
                    callback(err, mathNew);
                });
            },
            function(callback){
                let mathNew = new News({
                    title:'I. The Book',

                    image: '1.jpg',

                    text:" The place was dark and dusty and half-lost \n" +
                        "In tangles of old alleys near the quays, \n" +
                        "Reeking of strange things brought in from the seas, \n" +
                        "And with queer curls of fog that west winds tossed. \n" +
                        "Small lozenge panes, obscured by smoke and frost, \n" +
                        "Just shewed the books, in piles like twisted trees, \n" +
                        "Rotting from floor to roof - congeries \n" +
                        "Of crumbling elder lore at little cost. ",

                    description:"The place was dark and dusty and half-lost \n" +
                        "In tangles of old alleys near the quays",

                    date :"09-08-2019 17:21",

                    view : 0,
                });
                mathNew.save(function(err){
                    if(err){
                        console.log(err);
                        throw err;
                    }
                    callback(err, mathNew);
                });
            },

        ],
        function(err, result){
            if(err){
                console.log(err);
                throw err;
            }
            console.log('Creating was success')
        });
};

query();
