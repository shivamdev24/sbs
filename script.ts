import { prisma } from "./lib/prisma";
import { hashPassword } from "./lib/utils/hash";

async function main() {
  // Create

  const hashedPassword = await hashPassword("admin123");

  const user = await prisma.user.create({
    data: {
      email: "admin@sbs.io",
      password: hashedPassword,
      role: "ADMIN",
      verified: true,
    },
  });
  console.log("Created user:", user);

  const business = await prisma.businessProfile.create({
    data: {
      ownerId: user.id,
      ownerName: "admin",
    },
  });
  console.log("Created business:", business);

  // Fetch all users with their posts
  const allUser = await prisma.user.findMany();
  console.log("All users:", JSON.stringify(allUser, null, 2));

  const allUsers = await prisma.businessProfile.findMany();
  console.log("All profile:", JSON.stringify(allUsers, null, 2));
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
