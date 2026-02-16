import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./userModel.js";
import Category from "./categoryModel.js"

const{DataTypes} = Sequelize;

const News = await db.define("news",{
    userId :{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    catId:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    title :{
        type:DataTypes.STRING,
        allowNull:false,
    },
    description :{
        type:DataTypes.TEXT,
        allowNull:false,
    },
    subTitle1 :{
        type:DataTypes.STRING,
        allowNull:true,
    },
    subDescription1 :{
        type:DataTypes.TEXT,
        allowNull:true,
    },
    subTitle2 :{
        type:DataTypes.STRING,
        allowNull:true,
    },
    subDescription2 :{
        type:DataTypes.TEXT,
        allowNull:true,
    },
     subTitle3 :{
        type:DataTypes.STRING,
        allowNull:true,
    },
    subDescription3 :{
        type:DataTypes.TEXT,
        allowNull:true,
    },
     subTitle4 :{
        type:DataTypes.STRING,
        allowNull:true,
    },
    subDescription4 :{
        type:DataTypes.TEXT,
        allowNull:true,
    },
    numViews :{
        type:DataTypes.INTEGER,
        defaultValue:0,
    },
    numLike:{
        type:DataTypes.INTEGER,
        defaultValue:0
    },
    image :{
        type:DataTypes.STRING,
    },
    url :{
        type:DataTypes.STRING,
    },
    images: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    imagesUrl: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    video: {
        type: DataTypes.STRING,
        allowNull: true
    },
    videoUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },
}, { freezeTableName: true })


Users.hasMany(News);
News.belongsTo(Users,{foreignKey:"userId"});

Category.hasMany(News);
News.belongsTo(Category,{foreignKey:"catId"})


export default News;