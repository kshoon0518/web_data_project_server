import express from "express";
import { isUser } from "../middlewares";
import { userService } from "../services";
const userRouter = express.Router();

userRouter.post("/register", async (req, res, next) => {
  try {
    const { email, name, nickname, password } = req.body;
    await userService.createUser({
      email,
      name,
      nickname,
      password,
    });
    res.status(201).json({ message: "회원가입에 성공하였습니다." });
  } catch (err) {
    next(err);
  }
});

userRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const loginResult = await userService.login({ email, password });
    const { token, isAdmin } = loginResult;
    res.cookie("token", token, {
      maxAge: 3600000,
      httpOnly: true,
      signed: true,
    });
    if (isAdmin) {
      res.status(201).json({
        message: "(관리자)로그인에 성공하였습니다.",
        isAdmin: isAdmin,
      });
    } else {
      res.status(201).json({
        message: "(사용자)로그인에 성공하였습니다.",
        isAdmin: isAdmin,
      });
    }
  } catch (err) {
    next(err);
  }
});

userRouter.delete("/logout", isUser, async (req, res, next) => {
  try {
    res.clearCookie({ message: "token" });
    res.status(200).json({ message: "로그아웃하였습니다." });
  } catch (err) {
    next(err);
  }
});

userRouter.get("/account", isUser, async (req, res, next) => {
  try {
    const userId = req.user_id;
    const userInfo = await userService.getUserInfo(userId);
    res.status(200).json({
      message: "마이페이지 접근에 성공하였습니다.",
      userInfo: userInfo,
    });
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
      res.status(200).json({
        message: "회원정보(닉네임) 변경에 성공하였습니다.",
      });
    } else if (oldPassword && newPassword) {
      await userService.updateUserPassword(userId, oldPassword, newPassword);
      res.status(200).json({
        message: "회원정보(비밀번호) 변경에 성공하였습니다.",
      });
    } else {
      res.status(400).json({ message: "잘못된 정보로 요청하셨습니다." });
    }
  } catch (err) {
    next(err);
  }
});

userRouter.delete("/account", isUser, async (req, res, next) => {
  try {
    const userId = req.user_id;
    const { password } = req.body;
    await userService.softDeleteUser(userId, password);
    res.clearCookie("token");
    res.status(200).json({ message: "삭제 완료" });
  } catch (err) {
    next(err);
  }
});

export { userRouter };
