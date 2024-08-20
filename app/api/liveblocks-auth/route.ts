import { getUserColor } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { Liveblocks } from "@liveblocks/node";
import { redirect } from "next/navigation";

const liveblocks = new Liveblocks({
  secret: "sk_dev_suhRspMAxrzUfQa1lOxZpo3xL3oOxu1noH7TLS-g0RDGmx0uECP7enO_QeS8CV_q",
});

export async function POST(request: Request) {
  const clerkUser  = await currentUser();

  if(!clerkUser) redirect('/sign-in');

  const{id, firstName , lastName , emailAddresses, imageUrl} = clerkUser;
  

  const user = {
    id,
    info:{
      id,
      name: `${firstName} ${lastName}`,
      email: emailAddresses[0].emailAddress,
      avatar: imageUrl,
      color: getUserColor(id)
    }
  }


  // Identify the user and return the result
  const { status, body } = await liveblocks.identifyUser(
    {
      userId: user.info.email,
      groupIds: [],
    },
    { userInfo: user.info },
  );

  return new Response(body, { status });
}