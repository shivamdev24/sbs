//  data: {
     
//       email: "admin@sbs.io",
//   password: "admin123",
//   role:"ADMIN",
//   verified: true
//     }



import { prisma } from "./lib/prisma";

async function main() {
  // Create a new user with a post
  const user = await prisma.user.create({
    data: {
     
      email: "admin@sbs.io",
  password: "admin123",
  role:"ADMIN",
  verified: true
    }
  });
  console.log("Created user:", user);


  const business = await prisma.businessProfile.create({
    data: {
     
      ownerId: user.id,
      ownerName: "admin"
    }
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