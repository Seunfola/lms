import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/"],
  afterAuth: (auth, req, evt) => {
    if (!auth.isPublicRoute && !auth.userId) {
      return new Response("Unauthorized", { status: 401 });
    }
  },
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)", "/", "/(api|trpc)(.*)"],
};
