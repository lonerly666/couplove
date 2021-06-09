"use strict";


class Widget{
    constructor(build){
        if(arguments.length===1&&this.validateBuild(build)){
            const userId = build.userId;
            const partnerId = build.partnerId;
            const type = build.type;
            Object.defineProperties(this,{
                userId:{
                    value:userId,
                    writable:false,
                },
                partnerId:{
                    value:partnerId,
                    writable:false,
                },
                type:{
                    type:type,
                    writable:false,
                }
            })
        }
    }
    validateBuild(build)
    {
        return (String(build.constructor)===String(Widget.Builder));
    }
    static get Builder()
    {
        class Builder{
            setUserId(userId){
                this.userId = userId;
                return this;
            }
            setPartnerId(partnerId){
                this.partnerId = partnerId;
                return this;
            }
            setType(type){
                this.type = type;
                return this;
            }
            build()
            {
                return new Widget(this);
            }
        }
        return Builder;
    }

}
module.exports = Widget;