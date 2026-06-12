import { useState, useRef, useEffect } from "react";

export default function RichTextEditor({ value, onChange, placeholder = "Write content..." }) {
  const editorRef = useRef(null);
  const colorInputRef = useRef(null);

  const [activeStyles, setActiveStyles] = useState({
    bold: false,
    italic: false,
    underline: false,
    strikeThrough: false,
    h1: false,
    h2: false,
    h3: false,
    h4: false,
    ul: false,
    ol: false,
  });

  // Sync value from parent once on mount
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, []);

  const handleInput = () => {
    if (editorRef.current) {
      onChange?.(editorRef.current.innerHTML);
    }
    updateActiveStyles();
  };

  const updateActiveStyles = () => {
    if (!editorRef.current) return;
    try {
      const bold = document.queryCommandState("bold");
      const italic = document.queryCommandState("italic");
      const underline = document.queryCommandState("underline");
      const strikeThrough = document.queryCommandState("strikeThrough");

      const block = document.queryCommandValue("formatBlock");
      const h1 = block === "h1" || block === "heading 1";
      const h2 = block === "h2" || block === "heading 2";
      const h3 = block === "h3" || block === "heading 3";
      const h4 = block === "h4" || block === "heading 4";

      let ul = false;
      let ol = false;
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        let node = selection.getRangeAt(0).startContainer;
        while (node && node !== editorRef.current) {
          if (node.nodeName === "UL") ul = true;
          if (node.nodeName === "OL") ol = true;
          node = node.parentNode;
        }
      }

      setActiveStyles({
        bold,
        italic,
        underline,
        strikeThrough,
        h1,
        h2,
        h3,
        h4,
        ul,
        ol,
      });
    } catch (e) {
      // Fail silent on initial render command state checks
    }
  };

  useEffect(() => {
    const handleSelectionChange = () => {
      updateActiveStyles();
    };
    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, []);

  const executeCommand = (command, argument = null) => {
    document.execCommand(command, false, argument);
    handleInput();
  };

  // Link insertion feature removed


  // Image insertion feature removed


  const insertHeading = (headerTag) => {
    // formatBlock requires the exact tag name, sometimes wrapped in brackets depending on browser compatibility
    try {
      executeCommand("formatBlock", headerTag.toLowerCase());
    } catch (e) {
      executeCommand("formatBlock", `<${headerTag.toUpperCase()}>`);
    }
  };

  // YouTube embed feature removed


  const handleColorChange = (e) => {
    executeCommand("foreColor", e.target.value);
  };

  return (
    <div className="w-full border border-slate-200 rounded-3xl overflow-hidden bg-white shadow-md transition-all focus-within:border-brand-gold focus-within:ring-4 focus-within:ring-brand-gold/15 flex flex-col">
      {/* Visual WYSIWYG Toolbar */}
      <div className="flex flex-wrap items-center border-b border-slate-100 bg-slate-50/70 p-3 gap-2 select-none">

        {/* Formatting Group */}
        <div className="flex items-center bg-white border border-slate-150 rounded-xl p-1 shadow-sm gap-0.5">
          <button
            type="button"
            onClick={() => executeCommand("bold")}
            className={`px-2.5 py-1.5 text-xs font-black rounded-lg transition ${activeStyles.bold ? "bg-brand-gold text-brand-navy" : "text-slate-700 hover:bg-slate-50"
              }`}
            title="Bold"
          >
            B
          </button>
          <button
            type="button"
            onClick={() => executeCommand("italic")}
            className={`px-2.5 py-1.5 text-xs italic font-bold rounded-lg transition ${activeStyles.italic ? "bg-brand-gold text-brand-navy" : "text-slate-700 hover:bg-slate-50"
              }`}
            title="Italic"
          >
            I
          </button>
          <button
            type="button"
            onClick={() => executeCommand("underline")}
            className={`px-2.5 py-1.5 text-xs underline font-bold rounded-lg transition ${activeStyles.underline ? "bg-brand-gold text-brand-navy" : "text-slate-700 hover:bg-slate-50"
              }`}
            title="Underline"
          >
            U
          </button>
          <button
            type="button"
            onClick={() => executeCommand("strikeThrough")}
            className={`px-2.5 py-1.5 text-xs line-through font-bold rounded-lg transition ${activeStyles.strikeThrough ? "bg-brand-gold text-brand-navy" : "text-slate-700 hover:bg-slate-50"
              }`}
            title="Strikethrough"
          >
            S
          </button>
        </div>

        {/* Headings */}
        <div className="flex items-center bg-white border border-slate-150 rounded-xl p-1 shadow-sm gap-0.5">
          {["H1", "H2", "H3", "H4"].map((h) => {
            const hKey = h.toLowerCase();
            const isActive = activeStyles[hKey];
            return (
              <button
                key={h}
                type="button"
                onClick={() => insertHeading(h)}
                className={`px-2 py-1 text-[11px] font-extrabold rounded-lg transition ${isActive ? "bg-brand-gold text-brand-navy" : "text-slate-650 hover:bg-slate-50"
                  }`}
                title={`Heading ${h[1]}`}
              >
                {h}
              </button>
            );
          })}
        </div>

        {/* Lists & Alignment */}
        <div className="flex items-center bg-white border border-slate-150 rounded-xl p-1 shadow-sm gap-0.5">
          <button
            type="button"
            onClick={() => executeCommand("insertUnorderedList")}
            className={`px-2 py-1 text-xs rounded-lg transition font-medium ${activeStyles.ul ? "bg-brand-gold text-brand-navy" : "text-slate-750 hover:bg-slate-50"
              }`}
            title="Bullet List"
          >
            • List
          </button>
          <button
            type="button"
            onClick={() => executeCommand("insertOrderedList")}
            className={`px-2 py-1 text-xs rounded-lg transition font-medium ${activeStyles.ol ? "bg-brand-gold text-brand-navy" : "text-slate-750 hover:bg-slate-50"
              }`}
            title="Ordered List"
          >
            1. List
          </button>
          <button
            type="button"
            onClick={() => executeCommand("justifyLeft")}
            className="px-2.5 py-1.5 text-xs text-slate-750 hover:bg-slate-50 rounded-lg transition"
            title="Align Left"
          >
            Left
          </button>
          <button
            type="button"
            onClick={() => executeCommand("justifyCenter")}
            className="px-2.5 py-1.5 text-xs text-slate-750 hover:bg-slate-50 rounded-lg transition"
            title="Align Center"
          >
            Center
          </button>
          <button
            type="button"
            onClick={() => executeCommand("justifyRight")}
            className="px-2.5 py-1.5 text-xs text-slate-750 hover:bg-slate-50 rounded-lg transition"
            title="Align Right"
          >
            Right
          </button>
        </div>




        {/* Spectrum Color Picker */}
        <div className="flex items-center gap-1.5 bg-white border border-slate-150 rounded-xl px-2.5 py-1.5 shadow-sm">
          <label className="text-[11px] font-bold text-slate-500 cursor-pointer" onClick={() => colorInputRef.current?.click()}>
            Text Color
          </label>
          <input
            ref={colorInputRef}
            type="color"
            onChange={handleColorChange}
            className="w-6 h-6 rounded-md border-0 outline-none cursor-pointer bg-transparent"
            title="Choose Color Spectrum"
          />
        </div>
      </div>

      {/* Interactive Visual WYSIWYG Editable Area */}
      <div className="p-3.5 flex-1 min-h-[350px]">
        <div
          ref={editorRef}
          contentEditable={true}
          onInput={handleInput}
          onKeyUp={updateActiveStyles}
          onClick={updateActiveStyles}
          placeholder={placeholder}
          className="w-full h-full min-h-[330px] px-4 py-3 outline-none border-0 text-brand-navy leading-relaxed prose max-w-none focus:outline-none"
          style={{ userSelect: "text" }}
        />
      </div>
    </div>
  );
}
