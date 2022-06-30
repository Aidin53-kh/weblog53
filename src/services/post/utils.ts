/**
 * first element is title
 * seconde element is discreption
 * ignore empty elements
 */
export const getTitleAndDiscription = (editor: HTMLDivElement | null) => {
    let title = '';
    let description = '';
    let isMoreThenOneParagraph = false;

    if (editor?.textContent && editor?.textContent.length > 100) {
        for (let i = 0; i <= editor.children.length; i++) {
            const child = editor.children[i];
            if (!child?.textContent) continue;

            if (!title) title = child.textContent;
            else {
                description = child.textContent;
                isMoreThenOneParagraph = true;
                break;
            }
        }

        if (!isMoreThenOneParagraph) {
            return { title, description, error: { message: 'your post content must be includes more then one paragraph' } };
        }
    } else {
        return { title, description, error: { message: 'your post content is very small' } };
    }
    return { title, description, error: null };
};
