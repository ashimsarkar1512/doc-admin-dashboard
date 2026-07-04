import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write content here...",
  className = "",
}: RichTextEditorProps) {
  const modules = {
    toolbar: [
      [
        { header: [1, 2, 3, 4, 5, 6, false] },
        { size: ["small", false, "large", "huge"] },
      ],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "list",
    "bullet",
    "link",
    "image",
  ];

  return (
    <div className={`rich-text-editor-container ${className}`}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        className="bg-white rounded-lg"
      />
      {/* 
        Add custom styling to ensure Quill looks consistent with our design. 
        You might want to tweak these or move them to index.css if they grow large.
      */}
      <style>{`
        .rich-text-editor-container .ql-container {
          min-height: 200px;
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
          font-family: inherit;
          font-size: 20px;
        }
        .rich-text-editor-container .ql-toolbar {
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
          background-color: #f8fafc;
        }
        /* We remove !important from color so that Quill inline colors can apply */
        .ql-editor { color: #000000; }
        .ql-editor h1 { font-size: 2.25rem !important; font-weight: 700 !important; line-height: 1.2 !important; margin-bottom: 0.5em !important; color: #000000; }
        .ql-editor h2 { font-size: 1.875rem !important; font-weight: 700 !important; line-height: 1.3 !important; margin-bottom: 0.5em !important; color: #000000; }
        .ql-editor h3 { font-size: 1.5rem !important; font-weight: 600 !important; line-height: 1.4 !important; margin-bottom: 0.5em !important; color: #000000; }
        .ql-editor h4 { font-size: 1.25rem !important; font-weight: 600 !important; line-height: 1.5 !important; margin-bottom: 0.5em !important; color: #000000; }
        .ql-editor h5 { font-size: 1.125rem !important; font-weight: 600 !important; line-height: 1.5 !important; margin-bottom: 0.5em !important; color: #000000; }
        .ql-editor h6 { font-size: 1rem !important; font-weight: 600 !important; line-height: 1.5 !important; margin-bottom: 0.5em !important; color: #000000; }
        .ql-editor p { margin-bottom: 1em !important; line-height: 1.6 !important; }
        .ql-editor em, .ql-editor i { font-style: italic !important; font-family: system-ui, 'Segoe UI', sans-serif !important; }
        .ql-editor strong, .ql-editor b { font-weight: bold !important; }
        .ql-editor u { text-decoration: underline !important; }
        .ql-editor s { text-decoration: line-through !important; }
        .ql-editor ul { list-style-type: disc !important; padding-left: 1.5em !important; margin-bottom: 1em !important; }
        
        /* Fix missing dropdown labels in Quill snow theme */
        .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
        .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before { content: 'Heading 3' !important; }
        .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
        .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before { content: 'Heading 4' !important; }
        .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
        .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before { content: 'Heading 5' !important; }
        .ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
        .ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before { content: 'Heading 6' !important; }
        .ql-editor ol { list-style-type: decimal !important; padding-left: 1.5em !important; margin-bottom: 1em !important; }
        .ql-editor li { margin-bottom: 0.25em !important; }
      `}</style>
    </div>
  );
}
