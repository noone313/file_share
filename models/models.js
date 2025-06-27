import { Sequelize, DataTypes } from "sequelize";
import { config } from 'dotenv';
config();
const sequelize = new Sequelize(process.env.DB_URI);



const File = sequelize.define('File',{

    fileId : {
        type: DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false,

    },
    fileName: {
        type: DataTypes.STRING,
        allowNull:false,
        

    },
    accessToken: {
  type: DataTypes.STRING,
  allowNull: false,
  unique: true,
  validate: {
    len: [20, 100], 
  }
},

    fileType: {
        type: DataTypes.STRING,
        allowNull:false,
        

    },
    title : {
        type : DataTypes.STRING,
        allowNull:true,
        validate:{
            len:[0,100],
        }

    },
    message:{
        type:DataTypes.STRING,
        allowNull:true,
        validate:{
            len:[0,500],
        }

    },
    expiresAt:{
        type:DataTypes.DATE,
        allowNull:true,
        validate:{
            isDate:true,
        }

    },
    password:{
        type:DataTypes.STRING,
        allowNull:true,
        validate:{
            isAlphanumeric:true,
        }

    },
    locked : {
        type:DataTypes.BOOLEAN,
        allowNull:true,
        defaultValue:false,

    },
    recoverable:{
        type:DataTypes.BOOLEAN,
        allowNull:true,
        defaultValue:true,
        

    },
    fileLink:{
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
            isUrl:true,
        }

    },
    userId:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:'Users',
            key:'userId',
        }
    },

}, {
    timestamps:true,
    createdAt:'createdAt',
    updatedAt:'updatedAt',
    
});










const User = sequelize.define('User',{

    userId : {
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false,
    },

    userName : {
        type: DataTypes.STRING,
        allowNull:false,
        validate:{
            isAlphanumeric:true,
        }
    },

    email : {
        type: DataTypes.STRING,
        allowNull:false,
        unique:true,
        validate:{
            isEmail:true,
        }

    },
    password : {
        type : DataTypes.STRING,
        allowNull:false,
        validate:{
            len: [8,70]
        }

    },
    role : {
        type: DataTypes.STRING,
        allowNull:false,
        defaultValue:'user',

    },
    
    

}, {
    timestamps:true,
    createdAt:'createdAt',
    updatedAt:'updatedAt',

});

User.hasMany(File,{
    foreignKey:'userId',
    sourceKey:'userId',
});

File.belongsTo(User,{
    foreignKey:'userId',
    targetKey:'userId',
    onDelete:'CASCADE', 

});









const startServer = async () => {
    try {
      await sequelize.authenticate();
      console.log("✅ تم الاتصال بقاعدة البيانات");
  
      await sequelize.sync({ alter: true });
      console.log("🔄 تم تحديث الجداول تلقائيًا");
    } catch (error) {
      console.error("❌ خطأ فادح:", error);
      process.exit(1);
    }
  };




export { sequelize, startServer,User, File };