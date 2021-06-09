const Widget = require('../entities/Widget');
const widgetModel = require('../models/widgetModel');

class WidgetManager{

    static async createWidget(widget){
        return await widgetModel.create(this.constructWidget(widget))
        .then(docs=>{
            return docs;
        })
        .catch(err=>{
            console.log(err);
            return err;
        })

    }

    static constructWidget(widget)
    {
        return{
            userId:widget.userId,
            type:widget.type
        }
    }

    static async getWidget(userId)
    {
        try{

            const docs = await widgetModel.find({
                userId:userId
            })
            return {
                success:true,
                widget:docs
            }
         }
        catch(err)
        {
            console.log(err);
            return{
                success:false
            }
         }
    }

    static async deleteWidget(userId,type)
    {
        try{
            const result = widgetModel.findOneAndDelete({
                userId:userId,
                type:type
            });
            return result;

        }
        catch(err)
        {
            console.log(err)
            return err;
        }
    }

}
module.exports = WidgetManager;