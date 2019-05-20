const Post = require('models/post');
const {ObjectId} = require('mongoose').Types;
const Joi = require('joi');

exports.checkObjectId = (ctx, next) => {
    const { id } = ctx.params;

    //검증실패
    if(!ObjectId.isValid(id)){
        ctx.status = 400; //400 bad request
        return null;
    }
    return next(); //next를 리턴해야 ctx.body가 제대로 설정됨 
}

/**POST /api/posts { title, body, tags } */

exports.write = async (ctx) => {
    //객체가 지닌 값 검증
    const schema = Joi.object().keys({
        title : Joi.string().required(), //뒤에 required를 붙이면 필수
        body : Joi.string().required(),
        tags : Joi.array().items(Joi.string()).required()//문자열 배열
    });

    // 첫 번째 파라미터는 검증할 객체, 두 번째는 스키마
    const result = Joi.validate(ctx.request.body, schema);

    //오류 발생시 응답
    if(result.error){
        ctx.status = 400;
        ctx.body = result.error;
        return;
    }

    const { title, body, tags } = ctx.request.body;
    
    //새 Post 인스턴스를 만듭니다.
    const post = new Post({
        title, body, tags
    });

    try {
        await post.save(); //데이터베이스에 등록
        ctx.body = post; //저장된 결과 반환
    } catch(e) {
        //디비 오류 발생
        ctx.throw(e, 500);
    }
};

/** GET /api/posts */
exports.list = async (ctx) => {
    try{
        const posts = await Post.find().exec(); //exec를 붙여 줘야 서버에 쿼리 요청 
        ctx.body = posts;
    } catch(e){
        ctx.throw(e, 500)
    }
};

/** GET /api/posts/:id */
exports.read = async (ctx) => {
    const { id } = ctx.params;
    try{
        const post = await Post.findById(id).exec();
        //포스트 존재안할 경우
        if(!post){
            ctx.status = 404;
            return;
        }
        ctx.body = post;
    } catch(e){
        ctx.throw(e, 500);
    }
};

/**DELETE /api/posts/:id */
exports.remove = async (ctx) => {
    const {id} = ctx.params;
    try{
        await Post.findByIdAndRemove(id).exec();
        ctx.status = 204;
    } catch(e){
        ctx.throw(e, 500)
    }
};

/**PATCH /api/posts/:id { title, body, tags } */
exports.update = async (ctx) => {
    const { id } = ctx.params;
    try{
        const post = await Post.findByIdAndUpdate(id, ctx.request.body, {
            new : true // 이 값을 설정해야 업데이트 된 객체를 반환합니다. 안그러면 이전 객체 반환
        }).exec();
        //포스트 없을 때
        if(!post){
            ctx.status = 404;
            return;
        }
        ctx.body = post;
    } catch(e){
        ctx.throw(e, 500)
    }
};