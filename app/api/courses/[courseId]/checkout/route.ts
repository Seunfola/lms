import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import paystack from "@/lib/stripe]";

export async function POST(req: Request, { params }: { params: { courseId: string } }) {
  try {
    const user = await currentUser();

    if (!user || !user.id || !user.emailAddresses?.[0]?.emailAddress) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        isPublished: true,
      },
    });

    if (!course) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: params.courseId,
        },
      },
    });

    if (purchase) {
      return new NextResponse("Already Purchased", { status: 400 });
    }

    let paystackCustomer = await db.paystackCustomer.findUnique({
      where: {
        userId: user.id,
      },
      select: {
        paystackCustomerId: true,
      },
    });

    if (!paystackCustomer) {
     
      const existingCustomerResponse = await paystack.get(`/customer?email=${user.emailAddresses[0].emailAddress}`);
      if (existingCustomerResponse.data.status && existingCustomerResponse.data.data.length > 0) {
        paystackCustomer = await db.paystackCustomer.create({
          data: {
            userId: user.id,
            paystackCustomerId: existingCustomerResponse.data.data[0].customer_code,
          },
        });
      } else {

        const newCustomerResponse = await paystack.post('/customer', {
          email: user.emailAddresses[0].emailAddress,
        });
        paystackCustomer = await db.paystackCustomer.create({
          data: {
            userId: user.id,
            paystackCustomerId: newCustomerResponse.data.data.customer_code,
          },
        });
      }
    }

    const amount = Math.round(course.price! * 100); 

    const transactionResponse = await paystack.post('/transaction/initialize', {
      amount,
      email: user.emailAddresses[0].emailAddress,
      metadata: {
        courseId: course.id,
        userId: user.id,
      },
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?success=1`,
    });

    const { authorization_url } = transactionResponse.data.data;

    return NextResponse.json({ url: authorization_url });

  } catch (error) {
    console.log("[COURSE_ID_CHECKOUT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
