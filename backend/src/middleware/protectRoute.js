import { requireAuth } from "@clerk/express";
import { clerkClient } from "@clerk/clerk-sdk-node";
import User from "../models/User.js";

export const protectRoute = [
  requireAuth(),
  async (req, res, next) => {
    try {
      const clerkId = req.auth().userId;

      let user = await User.findOne({ clerkId });

      // create user if not found
      if (!user) {
        const clerkUser = await clerkClient.users.getUser(clerkId);

        user = await User.findOneAndUpdate(
          { email: clerkUser.emailAddresses[0].emailAddress },
          {
            clerkId,
            email: clerkUser.emailAddresses[0].emailAddress,
            name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
            profile_img: clerkUser.imageUrl,
          },
          { upsert: true, new: true },
        );
      }

      req.user = user;

      next();
    } catch (error) {
      console.error("Error in protectRoute middleware", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
];
