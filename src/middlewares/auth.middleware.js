import jwt from "jsonwebtoken";
import userModel from "../../DB/Models/user.model.js";

export const auth = (accessRoles) => {
  return async (req, res, next) => {
    const { accesstoken } = req.headers;
    if (!accesstoken)
      return next(new Error("please login first", { cause: 400 }));

    if (!accesstoken.startsWith(process.env.TOKEN_PREFIX))
      return next(new Error("invalid token prefix", { cause: 400 }));

    const token = accesstoken.split(process.env.TOKEN_PREFIX)[1];

    try {
      const decodedData = jwt.verify(token, process.env.JWT_SECRET_LOGIN);
      console.log(decodedData);
      if (!decodedData?.id)
        return next(new Error("invalid token payload", { cause: 400 }));

      // console.log(decodedData.id);
      // user check
      const findUser = await userModel.findById(
        decodedData.id,
        "username email role"
      );

      // loggdInUser ROle
      if (!findUser)
        return next(new Error("please signUp first", { cause: 404 }));
      // auhtorization
      if (!accessRoles.includes(findUser.role))
        return next(new Error("unauthorized", { cause: 401 }));
      req.authUser = findUser;
      // console.log(req.authUser);
      next();
    } catch (error) {
      console.log(error);
      if (error == "TokenExpiredError: jwt expired") {
        const findUser = await userModel.findOne({ token });
        if (!findUser) return next(new Error("wrong token", { cause: 400 }));
        const userToken = jwt.sign(
          { email:findUser.email, id: findUser._id },
          process.env.JWT_SECRET_LOGIN,
          { expiresIn: "1d" }
        );
        // updated isLoggedIn = true  in database
        findUser.token = userToken;

        findUser.isLoggedIn = true;
        await findUser.save();
        res.status(200).json({
          msg:"refrash token success",
          token:userToken
        })
      }
    }
  };
};
