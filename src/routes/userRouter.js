import express from "express";
import { isUser } from "../middlewares";
import { userService } from "../services";
const userRouter = express.Router();

userRouter.post("/register", async (req, res, next) => {
  try {
    const { email, name, nickname, password } = req.body;
    const isSuccess = await userService.createUser({
      email,
      name,
      nickname,
      password,
    });
    res.status(201).json("회원가입에 성공하였습니다.");
  } catch (err) {
    next(err);
  }
});

userRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const token = await userService.login({ email, password });
    res.cookie("token", token, {
      maxAge: 3600000,
      httpOnly: true,
      signed: true,
    });
    res.status(200).json("로그인에 성공하였습니다.");
  } catch (err) {
    next(err);
  }
});

userRouter.delete("/logout", isUser, async (req, res, next) => {
  try {
    res.clearCookie("token");
    res.status(200).json("로그아웃하였습니다.");
  } catch (err) {
    next(err);
  }
});

userRouter.get("/account", isUser, async (req, res, next) => {
  try {
    const userId = req.user_id;
    const userInfo = await userService.getUserInfo(userId);
    res.status(200).json(userInfo);
  } catch (err) {
    next(err);
  }
});

userRouter.patch("/account", isUser, async (req, res, next) => {
  try {
    const userId = req.user_id;
    const { nickname, oldPassword, newPassword } = req.body;
    if (nickname) {
      await userService.updateUserNickname(userId, nickname);
      res.status(200).json("회원정보(닉네임) 변경에 성공하였습니다.");
    } else if (oldPassword && newPassword) {
      await userService.updateUserPassword(userId, oldPassword, newPassword);
      res.status(200).json("회원정보(비밀번호) 변경에 성공하였습니다.");
    } else {
      res.status(400).json("잘못된 정보로 요청하셨습니다.");
    }
  } catch (err) {
    next(err);
  }
});

export { userRouter };