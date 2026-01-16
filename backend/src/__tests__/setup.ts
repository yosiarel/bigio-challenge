import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset } from 'jest-mock-extended';

export const mockPrisma = mockDeep<PrismaClient>();

jest.mock('../utils/prisma', () => ({
  __esModule: true,
  default: mockPrisma,
}));

beforeEach(() => {
  mockReset(mockPrisma);
  
  mockPrisma.$transaction.mockImplementation((arg: any) => {
    if (Array.isArray(arg)) {
      return Promise.resolve(arg.map(() => []));
    }
    return Promise.resolve([]);
  });
});
