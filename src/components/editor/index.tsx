import React, { useEffect, useState } from 'react';
import { FormatBold, FormatItalic, Image, Link as LinkIcon, Title } from '@mui/icons-material';
import { Switch } from '@mui/material';

interface TextEditorProps {
    rtl?: boolean;
    onChange?: () => any;
    ref: React.ForwardedRef<HTMLDivElement>;
    defaultTemplate?: string;
    onDirChange?: (data: { rtl: boolean }) => any;
    onUploadImage?: (file: any, objectUrl: string) => void;
}

const TextEditor: React.FC<TextEditorProps> = React.forwardRef((props, ref) => {
    const [italic, setItalic] = useState(false);
    const [bold, setBold] = useState(false);

    const [url, setUrl] = useState('');

    const hanldeItalic = () => {
        setItalic(!italic);
        // @ts-ignore: Object is possibly 'null'.
        ref.current.focus();
        document.execCommand('Italic', false);
    };

    const handleBold = () => {
        setBold(!bold);
        // @ts-ignore: Object is possibly 'null'.
        ref.current.focus();
        document.execCommand('Bold', false);
    };

    const createLink = () => {
        if (url.trim()) {
            const text = document.getSelection()?.toString();
            document.execCommand('insertHTML', false, `<a href='${url}' class='text-blue-400' target='_blank'>${text}</a>`);
            setUrl('');
        }
    };

    const createHeader = (tagname: string, classes?: string) => {
        if (document.getSelection()?.toString()) {
            const text = document.getSelection()?.toString();
            document.execCommand('insertHTML', false, `<${tagname} class='${classes || ''}'>${text}</${tagname}>`);
        } else {
            document.execCommand('insertHTML', false, `<${tagname} class="${classes || ''}"><br/></${tagname}>`);
        }
    };

    const createImage = (file: any) => {
        if (file) {
            const src = URL.createObjectURL(file);
            document.execCommand(
                'insertHTML',
                false,
                `<div class='text-center overflow-hidden rounded-lg'><img src="${src}" alt="post"/></div><div><br/></div>`
            );
            props.onUploadImage?.(file, src);
        }
    };

    useEffect(() => {
        // @ts-ignore: Object is possibly 'null'.
        ref.current.addEventListener('paste', (e: any) => {
            e.preventDefault();
            var text = e.clipboardData.getData('text/plain');
            document.execCommand('insertText', false, text);
        });

        // @ts-ignore: Object is possibly 'null'.
        ref.current.addEventListener('keydown', (e: any) => {
            if (e.code === 'Enter') disableFormats();
            else setTimeout(() => syncFormats(), 10); // waite for change cammand state and then sync with format icons
        });

        // @ts-ignore: Object is possibly 'null'.
        ref.current.addEventListener('mouseup', syncFormats);

        // @ts-ignore: Object is possibly 'null'.
        ref.current.addEventListener('touchend', syncFormats);
    }, []);

    const syncFormats = () => {
        setItalic(document.queryCommandState('Italic'));
        setBold(document.queryCommandState('Bold'));
    };

    const disableFormats = () => {
        if (document.queryCommandState('Italic')) {
            document.execCommand('Italic', false);
            setItalic(false);
        }
        if (document.queryCommandState('Underline')) {
            document.execCommand('Underline', false);
        }
        if (document.queryCommandState('Bold')) {
            document.execCommand('Bold', false);
            setBold(false);
        }
    };

    return (
        <>
            <div className="py-2 border-b bg-white flex items-center justify-between sticky top-[-1px]">
                <div className="flex items-center gap-3">
                    <Switch
                        checked={props.rtl}
                        onChange={(_, rtl) => {
                            props.onDirChange?.({ rtl });
                            // @ts-ignore: Object is possibly 'null'.
                            ref.current.focus();
                        }}
                    />
                    <FormatItalic onClick={hanldeItalic} className={`text-gray-500 cursor-pointer ${italic && 'bg-green-100'}`} />
                    <FormatBold onClick={handleBold} className={`text-gray-500 cursor-pointer ${bold && 'bg-green-100'}`} />
                    <Title
                        onClick={() => createHeader('h2', 'text-3xl font-bold mb-6')}
                        className={`text-gray-500 cursor-pointer`}
                    />
                    <Title
                        fontSize="small"
                        onClick={() => createHeader('h3', 'text-xl font-bold mb-5')}
                        className={`text-gray-500 cursor-pointer`}
                    />
                    <label htmlFor="createImage">
                        <Image className='text-gray-500 cursor-pointer' />
                    </label>
                    <input
                        type="file"
                        name="createImage"
                        id="createImage"
                        hidden
                        onChange={(e) => {
                            // @ts-ignore: Object is possibly 'null'.
                            createImage(e.target.files[0]);
                        }}
                    />
                </div>

                <div className="flex items-center gap-3">
                    <LinkIcon onClick={createLink} className={`text-gray-500 cursor-pointer`} />
                    <input
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="url"
                        className="outline-none bg-gray-100 px-3 py-1 rounded-md"
                    />
                </div>
            </div>
            <div
                dangerouslySetInnerHTML={{ __html: props.defaultTemplate || '' }}
                onInput={props.onChange}
                draggable={false}
                contentEditable
                ref={ref}
                id="create-post-editor"
                className={`py-4 mb-12 child:leading-8 outline-none mx-auto ${props.rtl && 'rtl'}`}
            ></div>
        </>
    );
});

export default TextEditor;
