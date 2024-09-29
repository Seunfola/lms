import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const TeacherLayout = ({ children }: { children: React.ReactNode }) => {
  const { userId: currentUserId } = auth();

  if (!currentUserId) {
    return redirect("/");
  }

  return <div>
            {children}
          </div>;
};

export default TeacherLayout;

