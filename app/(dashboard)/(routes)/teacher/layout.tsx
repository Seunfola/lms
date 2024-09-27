import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const TeacherLayout = ({ children }: { children: React.ReactNode }) => {
  const { userId } = auth();

  // Since isTutor is removed, you can add any other logic or just allow all authenticated users
  // If you want to add any other checks, this is where you could place them.
  
  if (!userId) {
    return redirect("/");
  }

  return <>{children}</>;
};

export default TeacherLayout;
