import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prismaInstance: PrismaClient | undefined;
}

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
};

export const prisma = globalThis.prismaInstance ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaInstance = prisma;
}

export default prisma;
