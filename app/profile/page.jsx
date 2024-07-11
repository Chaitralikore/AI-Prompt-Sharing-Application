"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Profile from "@components/Profile";

const MyProfile = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      if (session?.user.id) {
        const response = await fetch(`/api/users/${session?.user.id}/posts`);
        const data = await response.json();
        setPosts(data);
      }
    };

    fetchPosts();
  }, [session?.user.id]);

  const handleEdit = (post) => {
    router.push(`/update-prompt?id=${post._id}`);
  };

  const handleDelete = async (post) => {
    const hasConfirmed = confirm("Are you sure you want to delete this prompt?");
    
    if (hasConfirmed) {
      try {
        const response = await fetch(`/api/prompt/${post._id}`, {
          method: "DELETE",
        });
  
        if (response.ok) {
          const filteredPosts = posts.filter((item) => item._id !== post._id);
          setPosts(filteredPosts);
        } else {
          console.error("Failed to delete the prompt.");
        }
      } catch (error) {
        console.error("Error deleting the prompt:", error);
      }
    }
  };
  

  return (
    <Profile
      name='My'
      desc='Welcome to your personalized profile page. Share your exceptional prompts and inspire others with the power of your imagination'
      data={posts}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  );
};

export default MyProfile;
