import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const TeacherLayout = async ({ children }: { children: React.ReactNode }) => {
  const { userId: currentUserId } = auth();

  if (!currentUserId) {
    redirect("/"); 
  }

  return (
    <div>
      {children}
    </div>
  );
};

export default TeacherLayout;
