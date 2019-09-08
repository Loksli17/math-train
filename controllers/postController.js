const PostModel  = require('./../models/mysql/postModel');
const TagModel   = require('./../models/mysql/tagModel');
const Pagination = require('./../lib/pagination');


exports.index = async function (req, res) {

    const Tag = new TagModel();
    const Post= new PostModel();

    let tags = {};
    let posts= {};
    let disciplines = {};
    let where = '';
    let id_tag_quary = '';

    tags = await Tag.find('all', {
        order : 'id_parent',
    });

    for (let i = 0; i < tags.length; i++){
        if (tags[i].id_parent == null){
            disciplines[tags[i].id]   = {};
            disciplines[tags[i].id].name = tags[i].title;
            disciplines[tags[i].id].tags = [];

        }else{
            disciplines[tags[i].id_parent].tags.push({
                name : tags[i].title,
                id   : tags[i].id,
            });
        }
    }

    if (req.query.tag != undefined){
        for (let i = 0 ;i  < req.query.tag.length ; i++){
            if (i!= req.query.tag.length - 1){
                id_tag_quary =id_tag_quary + 'tag.id = ' + req.query.tag[i] + ' or ';
            }else{
                id_tag_quary = id_tag_quary + 'tag.id = ' + req.query.tag[i] + ' ';
            }
        }

        for (let i = 0; i < tags.length; i++){
            if (tags[i].id_parent == null){
                disciplines[tags[i].id]   = {};
                disciplines[tags[i].id].name = tags[i].title;
                disciplines[tags[i].id].tags = [];

            }else{
                let find = false;
                for(let j = 0; j<req.query.tag.length; j++){
                    if (tags[i].id == req.query.tag[j]){
                        find = true;
                        disciplines[tags[i].id_parent].tags.push({
                            name : tags[i].title,
                            id   : tags[i].id,
                            checked : 'checked',
                        });
                        break;
                    }
                }
                if (find == false){
                    disciplines[tags[i].id_parent].tags.push({
                        name : tags[i].title,
                        id   : tags[i].id,
                    });
                }
            }
        }

    where = id_tag_quary;
    }else{
        where = '1=1';
    }

    //пагинация
    let page  = 1,
        url   = req.originalUrl,
        count = 0;

    if(req.query.page != undefined){
        page = req.query.page;
        url = req.originalUrl.substring(0, req.originalUrl.length - 7);

    }

    count = await Post.find('count', {
        join: [ ['inner', 'post_has_tag','post_has_tag.post_id = post.id'],
            ['inner', 'tag','post_has_tag.tag_id = tag.id']],
        where : where,
    });


    let pagination = new Pagination({
        pageSize  : 4,
        limit     : 1,
        page      : page,
        url       : url,
        count     : count,
    });

    posts = await Post.find('all' ,{
        join: [ ['inner', 'post_has_tag','post_has_tag.post_id = post.id'],
            ['inner', 'tag','post_has_tag.tag_id = tag.id']],
        where : where,
        select: ['post.id','tag.title as ttitle','post.view','post.text','post.description','post.image'],
        order: 'id',
        orderDesc: true,
        limit: pagination.skip + ', ' + pagination.limit,
    });

    res.render('posts/index',{
        disciplines :  disciplines,
        posts       : posts,
        pages       : pagination.getPages(),
    });
};


exports.singlePost = async function (req,res) {
    const Post = new PostModel();

    let post = {};
    let id_post = req.query.id;

    id_post = Number(id_post);
    if(!id_post){
        res.status(404);
        res.render('server/404', {error: 'Пост на найден'});
        return;
    }

    let where   = 'post.id = ' + id_post;

    post= await Post.find('one' ,{
        join: [ ['inner', 'post_has_tag','post_has_tag.post_id = post.id'],
            ['inner', 'tag','post_has_tag.tag_id = tag.id']],
        where : where,
        select: ['post.id','tag.title as ttitle','post.view','post.text','post.description','post.image'],
    });

    if (post == undefined){
        res.status(404);
        res.render('server/404', {error: 'Пост на найден'});
        return;
    }

    res.render('posts/post',{
        post  : post,
    })
};
