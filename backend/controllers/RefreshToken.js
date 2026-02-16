import jwt from "jsonwebtoken";
import Users from "../models/userModel.js";

export const refreshToken = async (req, res) => {
  try {
    // 1
    const refreshToken = req.cookies.refreshToken;
    // 2
    if (!refreshToken) return res.sendStatus(401).json("توکنی یافت نشد");
    // 3
    const user = await Users.findAll({
      where: {
        refresh_token: refreshToken,
      },
    });
    // 4
    if (!user[0]) return res.sendStatus(403).json("کاربری یافت نشد");
    // 5
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err)
          return res.sendStatus(403).json("توکن مورد منقرض شده یا دستکاری شده");
        const userId = user[0].id;
        const name = user[0].name;
        const email = user[0].email;
        const isAdmin = user[0].isAdmin;
        const accsessToken = jwt.sign(
          { userId, name, email, isAdmin },
          process.env.ACCSESS_TOKEN_SECRET,
          {
            expiresIn: "45s",
          }
        );
        res.json({ accsessToken });
      }
    );
  } catch (error) {
    console.log(`we have som error : 
        ${error}`);
  }
};
