import PostEditor from "@/components/posts/editor/PostEditor";
import Post from "@/components/posts/Post";
import prisma from "@/lib/prisma";
import { postDataInclude } from "@/lib/types";

// Home Page
export default async function Home() {
  // create post function
  const posts = await prisma.post.findMany({
    // fetch user data
    include: postDataInclude,
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="w-full min-w-0">
      <div className="w-full min-w-0 space-y-5">
        <PostEditor />

        {/* fetch post content */}
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    </main>
  );
}
