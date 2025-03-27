import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';
import JoditEditor from "jodit-react";
import Cookies from 'js-cookie';
import apiService from '../api/api';
import { toast } from 'react-hot-toast';

function EditorPage() {
    const { id } = useParams();
    const editor = useRef(null);
    const navigate = useNavigate();
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("Untitled Document");
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [loadingDraft, setLoadingDraft] = useState(false);
    const [loadingDrive, setLoadingDrive] = useState(false);

    useEffect(() => {
        if (id) {
            const drafts = JSON.parse(localStorage.getItem("editorDrafts")) || [];
            const existingDraft = drafts.find(draft => draft.id === id);
            if (existingDraft) {
                setTitle(existingDraft.title);
                setContent(existingDraft.content);
            }
        }
    }, [id]);

    const saveDraft = (toastt = true) => {
        setLoadingDraft(true);
        const existingDrafts = JSON.parse(localStorage.getItem("editorDrafts")) || [];

        const newDraft = {
            id,
            title,
            content,
            timestamp: new Date().toISOString(),
        };

        const updatedDrafts = existingDrafts.filter(draft => draft.id !== id);
        updatedDrafts.push(newDraft);

        localStorage.setItem("editorDrafts", JSON.stringify(updatedDrafts));
        setLoadingDraft(false);
        if (toastt) {
            toast.success("Draft saved successfully!");
        }
    };

    const SaveInDrive = async (html, name) => {
        saveDraft(false);
        setLoadingDrive(true);
        const token = Cookies.get("token");
        const jwt = Cookies.get("jwt");

        const completeHtml = `
            <html>
                <head>
                    <meta charset="UTF-8">
                    <title>${name}</title>
                </head>
                <body>
                    ${html}
                </body>
            </html>
        `;

        try {
            const response = await apiService.insertFile(token, completeHtml, name,jwt);

            if (response && response.fileId !== undefined) {
                toast.success("File saved to Google Drive!");
            } else {
                throw new Error(response.statusText || "Failed to save to Google Drive.");
            }
        } catch (error) {
            console.error("Error saving to Google Drive:", error);
            toast.error(error.message || "Failed to save to Google Drive.");
        } finally {
            setLoadingDrive(false);
        }
    };

    useEffect(() => {
        const verifyToken = async () => {
            const jwt = Cookies.get("jwt");
            if (jwt) {
                try {
                    await apiService.getAuthData(jwt);
                } catch (error) {
                    Cookies.remove("jwt");
                    navigate("/");
                }
            } else {
                navigate("/");
            }
        };
        verifyToken();
    }, [navigate]);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            {isEditingTitle ? (
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    onBlur={() => setIsEditingTitle(false)}
                                    className="text-xl font-semibold bg-transparent border-none focus:ring-0 focus:border-none p-0"
                                    placeholder="Untitled Document"
                                    autoFocus
                                />
                            ) : (
                                <h1
                                    className="text-xl font-semibold flex items-center cursor-pointer"
                                    onClick={() => setIsEditingTitle(true)}
                                >
                                    {title} <FaEdit className="ml-2 text-gray-500" />
                                </h1>
                            )}
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={saveDraft}
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center"
                                disabled={loadingDraft}>
                                {loadingDraft && <span className="loader mr-2"></span>}
                                Save Draft
                            </button>
                            <button
                                onClick={() => SaveInDrive(content, title)}
                                className="px-6 py-3 text-sm font-medium text-white bg-blue-600 rounded-md shadow-md hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 flex items-center"
                                disabled={loadingDrive}>
                                {loadingDrive && <span className="loader mr-2"></span>}
                                {loadingDrive ? "Saving Please Wait" : "Save in Google Drive"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="p-4">
                        <JoditEditor
                            ref={editor}
                            value={content}
                            config={{
                                height: '70vh',
                                buttons: [
                                    'bold', 'italic', 'underline', 'strikethrough',
                                    'ul', 'ol', 'outdent', 'indent',
                                    'font', 'fontsize', 'brush', 'paragraph',
                                    'align', 'undo', 'redo', 'eraser',
                                    'copyformat', 'hr', 'symbol', 'fullsize'
                                ],
                                uploader: { insertImageAsBase64URI: false },
                                filebrowser: false,
                            }}
                            onBlur={(newContent) => setContent(newContent)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EditorPage;