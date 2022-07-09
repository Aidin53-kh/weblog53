import { http } from '..';
import { getTitleAndDiscription } from './utils';

type CreatePostProps = {
    editor: HTMLDivElement | null;
    tags: string;
    rtl: boolean;
    postImages: {
        [key: string]: File; // key is object URL as refrence from File
    };
    isPublic: boolean;
    authorId: string
};

type UploadPostImagesResponse = {
    file: string; 
    ref: string;
}[]

export const createPost = async ({ editor, tags, rtl, postImages, isPublic, authorId }: CreatePostProps) => {
    const { title, description, error } = getTitleAndDiscription(editor);
    const formData = new FormData();
    let thumbnail = '';

    if (error) return { error, post: null };

    Object.keys(postImages).map((objectUrl) => {
        formData.append('images', postImages[objectUrl]); // array of Files
        formData.append('refs[]', objectUrl); // array of object URL
    });

    try {
        const { data } = await http.post<UploadPostImagesResponse>('/api/upload/postImages', formData);

        editor?.querySelectorAll('img').forEach((img, index) => {
            data.map((imageData) => {
                if (img.src === imageData.ref) {
                    if (index === 0) thumbnail = imageData.file;
                    img.src = `http://localhost:3000/uploads/post/${imageData.file}`;
                }
            });
        });

        const { data: post } = await http.post('/api/posts', {
            template: editor?.innerHTML,
            title,
            description,
            rtl,
            tags: tags.split(','),
            thumbnail,
            images: data.map((imageData) => imageData.file),
            isPublic,
            authorId,
        });

        return { error: null, post };
    } catch (error) {
        return { error, post: null };
    }
};
