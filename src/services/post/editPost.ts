import { http } from '..';
import { getTitleAndDiscription } from './utils';

type EditPostProps = {
    editor: HTMLDivElement | null;
    tags: string;
    rtl: boolean;
    postId: string;
    postImages: {
        [key: string]: File; // key is object URL (blob) as refrence from File
    };
    isPublic: boolean;
};

type SavePostImagesResponse = {
    ref: string; // object URL
    file: string; // file name
}[];

export const editPost = async ({ editor, tags, rtl, postId, postImages, isPublic }: EditPostProps) => {
    const { title, description, error } = getTitleAndDiscription(editor);
    const formData = new FormData();

    const oldImages: string[] = [];
    let thumbnail = '';

    if (error) return { error, post: null };

    Object.keys(postImages).map((objectUrl) => {
        formData.append('images', postImages[objectUrl]); // array of Files
        formData.append('refs[]', objectUrl); // array of object URL
    });

    try {
        const { data } = await http.post<SavePostImagesResponse>('/api/upload/postImages', formData);

        editor?.querySelectorAll('img').forEach((img, index) => {
            if (img.src.startsWith('blob:')) {
                data.map((imageData) => {
                    if (index === 0) thumbnail = imageData.file;
                    if (img.src === imageData.ref) {
                        img.src = `https://weblog53.netlify.app/uploads/post/${imageData.file}`;
                    }
                });
            } else {
                const imageName = img.src.slice(img.src.lastIndexOf('/') + 1);
                if (index === 0) thumbnail = imageName;
                oldImages.push(imageName);
            }
        });

        const { data: post } = await http.patch(`/api/posts/${postId}/edit`, {
            template: editor?.innerHTML,
            title,
            description,
            rtl,
            tags: tags.split(','),
            thumbnail,
            images: data.map((imageData) => imageData.file),
            oldImages: oldImages,
            isPublic
        });

        return { error: null, post };
    } catch (error) {
        return { error, post: null };
    }
};
