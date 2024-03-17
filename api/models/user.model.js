const mongoose= require('mongoose');

const userschema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    profilePicture:{
        type:String,
        default:"https://in.images.search.yahoo.com/images/view;_ylt=Awr1TccWEPJlumE2m1q9HAx.;_ylu=c2VjA3NyBHNsawNpbWcEb2lkAzFkODZkYjE0NWQzYzBiNmEzZjEzYTcwODk4NTlmZTdkBGdwb3MDMTAEaXQDYmluZw--?back=https%3A%2F%2Fin.images.search.yahoo.com%2Fsearch%2Fimages%3Fp%3Ddefault%2Bprofile%2Bpicture%26type%3DE210IN714G91826%26fr%3Dmcafee%26fr2%3Dpiv-web%26tab%3Dorganic%26ri%3D10&w=860&h=663&imgurl=www.kindpng.com%2Fpicc%2Fm%2F451-4517876_default-profile-hd-png-download.png&rurl=https%3A%2F%2Fmavink.com%2Fexplore%2FDefault-Profile-Photo&size=23.3KB&p=default+profile+picture&oid=1d86db145d3c0b6a3f13a7089859fe7d&fr2=piv-web&fr=mcafee&tt=Default+Profile+Photo&b=0&ni=21&no=10&ts=&tab=organic&sigr=fTEuUMK.xIjd&sigb=o7QlXlGmfTkO&sigi=5BoWClVygUMC&sigt=yHIlFT28iCfZ&.crumb=M7otTrqgVYF&fr=mcafee&fr2=piv-web&type=E210IN714G91826",
    },
    isAdmin:{
        type:Boolean,
        default:false,
    }
},
    {timestamps:true}
);

const User=mongoose.model('User',userschema);
module.exports=User;