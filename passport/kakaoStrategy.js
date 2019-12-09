const kakaoStrategy = require('passport-kakao').Strategy;
const userModel = require('../model/userModel');
module.exports = async (passport) => {
  passport.use(new kakaoStrategy({
    clientID:process.env.KAKAO_REST_API_KEY,
    clientSecret:'',
    callbackURL:'/auth/kakao/callback'
  }, async (accessToken, refreshToken, profile, done) => {
    try{
      const exUser = await userModel.findOne({snsId:profile.id, provider:'kakao'});
      if(exUser){
        done(null, exUser);
      }else{
        let kakao_info = profile._json.kakao_account;
        const newUser = await userModel.create({
          user_id:profile.provider + '_' + profile.id,
          user_name:profile.username,
          user_pw:'kakao_pw',
          snsId:profile.id,
          provider:'kakao',
          profile_image:kakao_info.profile.profile_image_url,
          thumbnail_image:kakao_info.profile.profile_image_url,
          email:kakao_info.email,
          age_range:kakao_info.age_range,
          birthday:kakao_info.birthday,
          gender:kakao_info.gender
        });
        done(null, newUser);
      }
    } catch (e) {
      console.error(e);
      done(e);
    }
  }));
};