const mysql = require('../lib/database/mysql');
const async = require('async');

let mysqlQueryPost = 'INSERT INTO `post` SET ?';
let mysqlQueryPht  = 'INSERT INTO `post_has_tag` SET ?';

let posts = [
    {
        id          : '1',
        title       : 'Простые операции над множествами',
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
        view        : '0',
        image       : '1.jpg',
    },
    {
        id          : '2',
        title       : 'Простые операции над множествами',
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
        view        : '0',
        image       : '1.jpg',
    },
    {
        id          : '3',
        title       : 'Простые операции над множествами',
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
        view        : '0',
        image       : '1.jpg',
    },
    {
        id          : '4',
        title       : 'Простые операции над множествами',
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
        view        : '0',
        image       : '1.jpg',
    },
];

let postHasTag = [
    {
        id     : '1',
        post_id: '1',
        tag_id : '3',
    },
    {
        id     : '2',
        post_id: '1',
        tag_id : '2',
    },
    {
        id     : '3',
        post_id: '1',
        tag_id : '2',
    },
]

let query = async () => {
    let removePostHasTag = await mysql.promise().query("DELETE FROM `post_has_tag` WHERE 1");
    let removePost = await mysql.promise().query("DELETE FROM `post` WHERE 1");

    let createPost = await async.parallel([
        function(callback){
            mysql.query(mysqlQueryPost, posts[0], function(err, result){
                if(err){
                    console.log(err);
                    throw err;
                }
                callback(err, result);
            });
        },
        function(callback){
            mysql.query(mysqlQueryPost, posts[1], function(err, result){
                if(err){
                    console.log(err);
                    throw err;
                }
                callback(err, result);
            });
        },
        function(callback){
            mysql.query(mysqlQueryPost, posts[2], function(err, result){
                if(err){
                    console.log(err);
                    throw err;
                }
                callback(err, result);
            });
        },
        function(callback){
            mysql.query(mysqlQueryPost, posts[3], function(err, result){
                if(err){
                    console.log(err);
                    throw err;
                }
                callback(err, result);
            });
        },
    ],
        function(err, result){
            if(err){
                console.log(err);
                throw err;
            }
            console.log('Creating post success');
        }
    );

    let createPostHasTag = await async.parallel([
            function(callback){
                 mysql.query(mysqlQueryPht, postHasTag[0], function(err, result){
                     if(err){
                         console.log(err);
                         throw err;
                     }
                     callback(err, result);
                 });
            },
            function(callback){
                mysql.query(mysqlQueryPht, postHasTag[1], function(err, result){
                    if(err){
                        console.log(err);
                        throw err;
                    }
                    callback(err, result);
                });
            },
            function(callback){
                mysql.query(mysqlQueryPht, postHasTag[2], function(err, result){
                    if(err){
                        console.log(err);
                        throw err;
                    }
                    callback(err, result);
                });
            }
    ],
        function(err, result){
            if(err){
                console.log(err);
                throw err;
            }
            console.log('Creating post_has_tag was success');
        }
    );
};

query();
