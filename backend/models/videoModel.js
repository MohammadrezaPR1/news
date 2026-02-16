import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const {DataTypes} = Sequelize;

const Video = db.define("video",{
    title:{
        type:DataTypes.STRING,
    },
    description:{
        type:DataTypes.TEXT,
    },
    video:{
        type:DataTypes.STRING,
    },
    url:{
        type:DataTypes.STRING,
    }
},{freezeTableName:true});

export default Video ; 