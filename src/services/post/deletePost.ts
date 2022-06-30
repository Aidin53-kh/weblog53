import { http } from "..";

export const deletePost = async (postId: string) => {
    try {
        const { data } = await http.delete(`/posts/${postId}`);
        console.log(data);
    } catch (error) {
        console.log(error);
    }
};
