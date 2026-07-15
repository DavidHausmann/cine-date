import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

interface UpsertGoogleUserInput {
  googleId: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async upsertGoogleUser(input: UpsertGoogleUserInput) {
    return this.prisma.user.upsert({
      where: { email: input.email },
      update: {
        googleId: input.googleId,
        name: input.name,
        avatarUrl: input.avatarUrl,
      },
      create: {
        googleId: input.googleId,
        email: input.email,
        name: input.name,
        avatarUrl: input.avatarUrl,
      },
    });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }
}
