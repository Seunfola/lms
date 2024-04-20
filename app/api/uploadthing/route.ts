import { createRouteHandler } from "uploadthing/next";
import { authMiddleware } from "@clerk/nextjs";
import { ourFileRouter } from "./core";

export const uploadThingHandler = authMiddleware({
  publicRoutes: ["/api/uploadthing"],
});

export const { GET: getUploadThing, POST: postUploadThing } = createRouteHandler({
  router: ourFileRouter,
});
