import { prisma } from "./";

const userAccess = {
  async userCreate(userInfo) {
    const newUser = await prisma.user.create({ data: userInfo });
    return newUser ? true : false;
  },

  async userFindOneByEmail(userEmail) {
    const user = await prisma.user.findUnique({ where: { email: userEmail } });
    return user;
  },

  async userFindOneById(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        isAdmin: true,
        email: true,
        name: true,
        nickname: true,
      },
    });
    return user;
  },

  async userFindPasswordById(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        password: true,
      },
    });
    return user.password;
  },

  async userUpdate(userId, userInfo) {
    const userUpdate = await prisma.user.update({
      where: { id: userId },
      data: userInfo,
    });
    return userUpdate ? true : false;
  },

  async userDeleteById(userId) {
    const userDeletion = await prisma.user.update({
      where: { id: userId },
      data: { deletedAt: new Date() },
    });
  },
};

export { userAccess };
