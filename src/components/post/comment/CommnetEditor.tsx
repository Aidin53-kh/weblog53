import { FormatBold, FormatItalic, FormatTextdirectionLToROutlined, FormatTextdirectionRToLOutlined } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
import { useRouter } from 'next/router';
import { FC, useEffect, useRef, useState } from 'react';

export interface CommnetEditorProps {
    onSubmit?: (template: string, rtl: boolean) => void;
    isLoading: boolean;
    className?: string;
    defaultTemplate?: string;
    cancelButton?: boolean;
    cancelButtonFn?: () => void;
    defaultDir?: boolean;
    editMode?: boolean;
}

export const CommentEditor: FC<CommnetEditorProps> = ({
    onSubmit,
    isLoading,
    className,
    defaultTemplate,
    cancelButton,
    cancelButtonFn,
    defaultDir,
    editMode,
}) => {
    const router = useRouter();
    const [rtl, setRtl] = useState(defaultDir ?? false);
    const editorRef = useRef<any>(null);

    const hanldeItalic = () => {
        editorRef.current.focus();
        document.execCommand('Italic', false);
    };

    const handleBold = () => {
        editorRef.current.focus();
        document.execCommand('Bold', false);
    };

    const hanldeSubmit = () => {
        onSubmit?.(editorRef.current.innerHTML, rtl);
        editorRef.current.innerHTML = '';
    };

    useEffect(() => {
        if (!defaultTemplate) editorRef.current.innerHTML = '';
    }, [router.query]);

    return (
        <div className={`shadow-md border rounded-lg py-3 px-4 ${className || ''}`}>
            <div
                ref={editorRef}
                data-placeholder="Enter Your Commnet"
                className={`text-sm leading-6 empty:before:content-[attr(data-placeholder)] outline-none before:text-gray-500 ${
                    rtl ? 'rtl' : 'ltr'
                }`}
                contentEditable
                dangerouslySetInnerHTML={{ __html: defaultTemplate || '' }}
            ></div>
            <footer className="flex items-center justify-between mt-4">
                <div className="flex gap-3">
                    {rtl ? (
                        <FormatTextdirectionLToROutlined
                            onClick={() => setRtl(!rtl)}
                            className={`text-gray-500 cursor-pointer`}
                        />
                    ) : (
                        <FormatTextdirectionRToLOutlined
                            onClick={() => setRtl(!rtl)}
                            className={`text-gray-500 cursor-pointer`}
                        />
                    )}
                    <FormatItalic onClick={hanldeItalic} className={`text-gray-500 cursor-pointer`} />
                    <FormatBold onClick={handleBold} className={`text-gray-500 cursor-pointer`} />
                </div>
                <div className="flex items-center gap-6">
                    {cancelButton && (
                        <button className="text-red-500" onClick={cancelButtonFn}>
                            Cancel
                        </button>
                    )}
                    {isLoading ? (
                        <CircularProgress size={20} color="success" />
                    ) : (
                        <button className="text-green-600" onClick={hanldeSubmit}>
                            {editMode ? 'Edit' : 'Send'}
                        </button>
                    )}
                </div>
            </footer>
        </div>
    );
};
