import GoogleTokenStrategy from "passport-google-id-token";

import { ApiError } from "./errors/ApiError";
import UserRepo from "../models/UserModel";

export const authWithGoogle = () => {
  return new GoogleTokenStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
    },
    async function (parsedToken, googleId, done) {
      const { email, name, picture } = parsedToken.payload;
      try {
        let user = await UserRepo.findOne({ email });
        if (!user) {
          const newUser = new UserRepo({
            name,
            email,
            avatar: picture,
            isGoogleLoggedIn: true
          });
          await newUser.save();
          user = newUser;
   
        }
        return done(null, user);
      } catch (error) {
        return done(ApiError.Unauthorized("google authentication failed"));
      }
    }
  );
};
