import React, { useEffect, useState, useRef, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { TextStyle, Color, FontFamily, FontSize } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Placeholder from "@tiptap/extension-placeholder";

/* ═══════════════════════════════════════════════════════════════════
   Constants
   ═══════════════════════════════════════════════════════════════════ */

const FONT_FAMILIES = [
  { label: "Default", value: "" },
  { label: "Inter", value: "Inter" },
  { label: "Arial", value: "Arial" },
  { label: "Georgia", value: "Georgia" },
  { label: "Times New Roman", value: "Times New Roman" },
  { label: "Courier New", value: "Courier New" },
  { label: "Verdana", value: "Verdana" },
  { label: "Trebuchet MS", value: "Trebuchet MS" },
  { label: "Comic Sans MS", value: "Comic Sans MS" },
];

const FONT_SIZES = [
  "12px", "14px", "16px", "18px", "20px", "24px", "28px", "32px", "36px", "48px",
];

const HEADING_LEVELS = [
  { label: "Normal", value: 0 },
  { label: "Heading 1", value: 1 },
  { label: "Heading 2", value: 2 },
  { label: "Heading 3", value: 3 },
  { label: "Heading 4", value: 4 },
];

const COLOR_PRESETS = [
  "#000000", "#434343", "#666666", "#999999", "#b7b7b7", "#cccccc", "#d9d9d9", "#efefef", "#f3f3f3", "#ffffff",
  "#980000", "#ff0000", "#ff9900", "#ffff00", "#00ff00", "#00ffff", "#4a86e8", "#0000ff", "#9900ff", "#ff00ff",
  "#e6b8af", "#f4cccc", "#fce5cd", "#fff2cc", "#d9ead3", "#d0e0e3", "#c9daf8", "#cfe2f3", "#d9d2e9", "#ead1dc",
  "#dd7e6b", "#ea9999", "#f9cb9c", "#ffe599", "#b6d7a8", "#a2c4c9", "#a4c2f4", "#9fc5e8", "#b4a7d6", "#d5a6bd",
  "#cc4125", "#e06666", "#f6b26b", "#ffd966", "#93c47d", "#76a5af", "#6d9eeb", "#6fa8dc", "#8e7cc3", "#c27ba0",
];

/* ═══════════════════════════════════════════════════════════════════
   Small UI helpers
   ═══════════════════════════════════════════════════════════════════ */

/** Toolbar icon-button */
const Btn = ({ onClick, active, children, title, disabled }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    disabled={disabled}
    className={`rte-btn ${active ? "rte-btn--active" : ""}`}
  >
    {children}
  </button>
);

/** Separator */
const Sep = () => <div className="rte-sep" />;

/** Dropdown wrapper that closes on outside click */
const Dropdown = ({ trigger, children, isOpen, setIsOpen }) => {
  const ref = useRef(null);
  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [setIsOpen]);
  return (
    <div ref={ref} className="rte-dropdown">
      <button
        type="button"
        className="rte-btn rte-dropdown-trigger"
        onClick={() => setIsOpen((o) => !o)}
      >
        {trigger} <span className="rte-caret">▾</span>
      </button>
      {isOpen && <div className="rte-dropdown-menu">{children}</div>}
    </div>
  );
};

/** Color picker popover */
const ColorPicker = ({ label, icon, currentColor, onSelect, isOpen, setIsOpen }) => {
  const ref = useRef(null);
  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [setIsOpen]);

  return (
    <div ref={ref} className="rte-dropdown">
      <button
        type="button"
        className="rte-btn rte-color-trigger"
        title={label}
        onClick={() => setIsOpen((o) => !o)}
      >
        <span>{icon}</span>
        <span
          className="rte-color-bar"
          style={{ backgroundColor: currentColor || "#000" }}
        />
      </button>
      {isOpen && (
        <div className="rte-color-panel">
          <div className="rte-color-grid">
            {COLOR_PRESETS.map((c) => (
              <button
                key={c}
                type="button"
                className={`rte-color-swatch ${currentColor === c ? "rte-color-swatch--active" : ""}`}
                style={{ backgroundColor: c }}
                title={c}
                onClick={() => {
                  onSelect(c);
                  setIsOpen(false);
                }}
              />
            ))}
          </div>
          <div className="rte-color-custom">
            <label>Custom:</label>
            <input
              type="color"
              value={currentColor || "#000000"}
              onChange={(e) => {
                onSelect(e.target.value);
                setIsOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   Toolbar
   ═══════════════════════════════════════════════════════════════════ */

const Toolbar = ({ editor }) => {
  const [fontOpen, setFontOpen] = useState(false);
  const [sizeOpen, setSizeOpen] = useState(false);
  const [headingOpen, setHeadingOpen] = useState(false);
  const [textColorOpen, setTextColorOpen] = useState(false);
  const [hlColorOpen, setHlColorOpen] = useState(false);

  if (!editor) return null;

  // Current values
  const currentFont =
    editor.getAttributes("textStyle").fontFamily || "Default";
  const currentSize =
    editor.getAttributes("textStyle").fontSize || "16px";
  const currentHeading = HEADING_LEVELS.find((h) =>
    h.value ? editor.isActive("heading", { level: h.value }) : false
  );
  const currentTextColor = editor.getAttributes("textStyle").color || "#000000";
  const currentHlColor =
    editor.getAttributes("highlight").color || "#ffff00";

  /* ─── Link helper ─────────────────────────────────────────── */
  const setLink = useCallback(() => {
    const prev = editor.getAttributes("link").href || "";
    const url = window.prompt("Enter URL:", prev);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  }, [editor]);

  /* ─── Image helper ────────────────────────────────────────── */
  const addImage = useCallback(() => {
    const url = window.prompt("Enter image URL:");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  }, [editor]);

  return (
    <div className="rte-toolbar">
      {/* ── Row 1: Dropdowns ────────────────────────────────── */}
      <div className="rte-toolbar-row">
        {/* Heading */}
        <Dropdown
          trigger={currentHeading ? currentHeading.label : "Normal"}
          isOpen={headingOpen}
          setIsOpen={setHeadingOpen}
        >
          {HEADING_LEVELS.map((h) => (
            <button
              key={h.value}
              type="button"
              className={`rte-dropdown-item ${(h.value === 0 && !currentHeading) ||
                currentHeading?.value === h.value
                ? "rte-dropdown-item--active"
                : ""
                }`}
              onClick={() => {
                if (h.value === 0) {
                  editor.chain().focus().setParagraph().run();
                } else {
                  editor
                    .chain()
                    .focus()
                    .toggleHeading({ level: h.value })
                    .run();
                }
                setHeadingOpen(false);
              }}
            >
              {h.label}
            </button>
          ))}
        </Dropdown>

        <Sep />

        {/* Font Family */}
        <Dropdown
          trigger={currentFont}
          isOpen={fontOpen}
          setIsOpen={setFontOpen}
        >
          {FONT_FAMILIES.map((f) => (
            <button
              key={f.label}
              type="button"
              className={`rte-dropdown-item ${currentFont === (f.value || "Default")
                ? "rte-dropdown-item--active"
                : ""
                }`}
              style={{ fontFamily: f.value || "inherit" }}
              onClick={() => {
                if (f.value) {
                  editor.chain().focus().setFontFamily(f.value).run();
                } else {
                  editor.chain().focus().unsetFontFamily().run();
                }
                setFontOpen(false);
              }}
            >
              {f.label}
            </button>
          ))}
        </Dropdown>

        <Sep />

        {/* Font Size */}
        <Dropdown
          trigger={currentSize}
          isOpen={sizeOpen}
          setIsOpen={setSizeOpen}
        >
          {FONT_SIZES.map((s) => (
            <button
              key={s}
              type="button"
              className={`rte-dropdown-item ${currentSize === s ? "rte-dropdown-item--active" : ""
                }`}
              onClick={() => {
                editor.chain().focus().setFontSize(s).run();
                setSizeOpen(false);
              }}
            >
              {s}
            </button>
          ))}
        </Dropdown>
      </div>

      {/* ── Row 2: All buttons ──────────────────────────────── */}
      <div className="rte-toolbar-row">
        {/* Text formatting */}
        <Btn
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Bold (Ctrl+B)"
        >
          <b>B</b>
        </Btn>
        <Btn
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Italic (Ctrl+I)"
        >
          <i>I</i>
        </Btn>
        <Btn
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
          title="Underline (Ctrl+U)"
        >
          <u>U</u>
        </Btn>
        <Btn
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
          title="Strikethrough"
        >
          <s>S</s>
        </Btn>
        <Btn
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          active={editor.isActive("subscript")}
          title="Subscript"
        >
          X<sub>2</sub>
        </Btn>
        <Btn
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          active={editor.isActive("superscript")}
          title="Superscript"
        >
          X<sup>2</sup>
        </Btn>

        <Sep />

        {/* Colors */}
        <ColorPicker
          label="Text Color"
          icon="A"
          currentColor={currentTextColor}
          isOpen={textColorOpen}
          setIsOpen={setTextColorOpen}
          onSelect={(c) => editor.chain().focus().setColor(c).run()}
        />
        <ColorPicker
          label="Highlight Color"
          icon="🖍"
          currentColor={currentHlColor}
          isOpen={hlColorOpen}
          setIsOpen={setHlColorOpen}
          onSelect={(c) =>
            editor.chain().focus().toggleHighlight({ color: c }).run()
          }
        />

        <Sep />

        {/* Alignment */}
        <Btn
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          active={editor.isActive({ textAlign: "left" })}
          title="Align Left"
        >
          ≡
        </Btn>
        <Btn
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          active={editor.isActive({ textAlign: "center" })}
          title="Align Center"
        >
          ☰
        </Btn>
        <Btn
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          active={editor.isActive({ textAlign: "right" })}
          title="Align Right"
        >
          ≡
        </Btn>
        <Btn
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          active={editor.isActive({ textAlign: "justify" })}
          title="Justify"
        >
          ☰
        </Btn>

        <Sep />

        {/* Lists */}
        <Btn
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Bullet List"
        >
          •≡
        </Btn>
        <Btn
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="Numbered List"
        >
          1.
        </Btn>

        <Sep />

        {/* Block */}
        <Btn
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          title="Blockquote"
        >
          ❝
        </Btn>
        <Btn
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive("codeBlock")}
          title="Code Block"
        >
          {"</>"}
        </Btn>
        <Btn
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Rule"
        >
          ―
        </Btn>

        <Sep />

        {/* Link & Image */}
        <Btn
          onClick={setLink}
          active={editor.isActive("link")}
          title="Insert Link"
        >
          🔗
        </Btn>
        <Btn onClick={addImage} title="Insert Image">
          🖼
        </Btn>

        <Sep />

        {/* Undo / Redo / Clear */}
        <Btn
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo (Ctrl+Z)"
        >
          ↩
        </Btn>
        <Btn
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo (Ctrl+Y)"
        >
          ↪
        </Btn>
        <Btn
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
          title="Clear Formatting"
        >
          ✕
        </Btn>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   Rich Text Editor
   ═══════════════════════════════════════════════════════════════════ */

const RichTextEditor = ({
  value = "",
  onChange,
  placeholder = "Start typing…",
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
        link: false,
        underline: false,
      }),
      Underline,
      TextStyle,
      FontSize,
      Color,
      Highlight.configure({ multicolor: true }),
      FontFamily,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { target: "_blank", rel: "noopener noreferrer" },
      }),
      Image.configure({ inline: false }),
      Subscript,
      Superscript,
      Placeholder.configure({ placeholder }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "rte-content",
      },
    },
  });

  // Sync external value changes
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value]);

  if (!editor) return null;

  return (
    <div className="rte-wrapper">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />

      {/* ─── Scoped styles ────────────────────────────────── */}
      <style>{`
        /* ── Wrapper ─────────────────────────────── */
        .rte-wrapper {
          width: 100%;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          background: #fff;
          overflow: hidden;
          transition: box-shadow 0.15s, border-color 0.15s;
        }
        .rte-wrapper:focus-within {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59,130,246,.15);
        }

        /* ── Toolbar ─────────────────────────────── */
        .rte-toolbar {
          background: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
          padding: 4px 6px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .rte-toolbar-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 2px;
        }

        /* ── Buttons ─────────────────────────────── */
        .rte-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 28px;
          height: 28px;
          padding: 0 5px;
          border: none;
          border-radius: 4px;
          background: transparent;
          color: #374151;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.12s, color 0.12s;
          white-space: nowrap;
        }
        .rte-btn:hover { background: #e5e7eb; }
        .rte-btn--active,
        .rte-btn--active:hover { background: #3b82f6; color: #fff; }
        .rte-btn:disabled { opacity: .4; cursor: default; }
        .rte-btn:disabled:hover { background: transparent; }

        /* ── Separator ───────────────────────────── */
        .rte-sep {
          width: 1px;
          height: 20px;
          background: #d1d5db;
          margin: 0 3px;
          flex-shrink: 0;
        }

        /* ── Dropdown ────────────────────────────── */
        .rte-dropdown { position: relative; }
        .rte-dropdown-trigger {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          max-width: 140px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .rte-caret { font-size: 10px; opacity: .6; }
        .rte-dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          z-index: 50;
          min-width: 140px;
          max-height: 220px;
          overflow-y: auto;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          box-shadow: 0 4px 12px rgba(0,0,0,.12);
          padding: 4px;
          margin-top: 2px;
        }
        .rte-dropdown-item {
          display: block;
          width: 100%;
          text-align: left;
          padding: 5px 8px;
          border: none;
          border-radius: 4px;
          background: transparent;
          font-size: 13px;
          cursor: pointer;
          color: #374151;
        }
        .rte-dropdown-item:hover { background: #f3f4f6; }
        .rte-dropdown-item--active { background: #eff6ff; color: #2563eb; font-weight: 600; }

        /* ── Color picker ────────────────────────── */
        .rte-color-trigger {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          gap: 1px;
          padding: 2px 5px !important;
        }
        .rte-color-bar {
          display: block;
          width: 16px;
          height: 3px;
          border-radius: 1px;
        }
        .rte-color-panel {
          position: absolute;
          top: 100%;
          left: 0;
          z-index: 50;
          width: 232px;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          box-shadow: 0 4px 16px rgba(0,0,0,.15);
          padding: 8px;
          margin-top: 2px;
        }
        .rte-color-grid {
          display: grid;
          grid-template-columns: repeat(10, 1fr);
          gap: 3px;
        }
        .rte-color-swatch {
          width: 20px;
          height: 20px;
          border: 1px solid #ddd;
          border-radius: 3px;
          cursor: pointer;
          transition: transform 0.1s;
        }
        .rte-color-swatch:hover { transform: scale(1.25); z-index: 1; }
        .rte-color-swatch--active { outline: 2px solid #3b82f6; outline-offset: 1px; }
        .rte-color-custom {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 6px;
          font-size: 12px;
          color: #6b7280;
        }
        .rte-color-custom input[type="color"] {
          width: 28px;
          height: 22px;
          padding: 0;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          cursor: pointer;
        }

        /* ── Editor content area ─────────────────── */
        .rte-content {
          min-height: 140px;
          padding: 0.65rem 0.85rem;
          outline: none;
          font-size: 15px;
          line-height: 1.6;
          color: #1f2937;
        }

        /* Placeholder */
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #9ca3af;
          pointer-events: none;
          height: 0;
        }

        /* Prose styles inside editor */
        .ProseMirror { min-height: 140px; padding: 0.65rem 0.85rem; outline: none; }
        .ProseMirror h1 { font-size: 1.75rem; font-weight: 700; margin: 0.5rem 0; }
        .ProseMirror h2 { font-size: 1.4rem; font-weight: 650; margin: 0.5rem 0; }
        .ProseMirror h3 { font-size: 1.15rem; font-weight: 600; margin: 0.4rem 0; }
        .ProseMirror h4 { font-size: 1.05rem; font-weight: 600; margin: 0.35rem 0; }
        .ProseMirror p  { margin: 0.25rem 0; }
        .ProseMirror ul { list-style: disc; padding-left: 1.5rem; margin: 0.5rem 0; }
        .ProseMirror ol { list-style: decimal; padding-left: 1.5rem; margin: 0.5rem 0; }
        .ProseMirror li > p { margin: 0; }
        .ProseMirror blockquote {
          border-left: 3px solid #d1d5db;
          padding-left: 1rem;
          color: #6b7280;
          margin: 0.5rem 0;
          font-style: italic;
        }
        .ProseMirror pre {
          background: #1e293b;
          color: #e2e8f0;
          font-family: "Courier New", monospace;
          padding: 0.75rem 1rem;
          border-radius: 6px;
          overflow-x: auto;
          margin: 0.5rem 0;
          font-size: 13px;
          line-height: 1.5;
        }
        .ProseMirror pre code { background: transparent; color: inherit; font-size: inherit; }
        .ProseMirror code {
          background: #f1f5f9;
          color: #e11d48;
          padding: 0.15rem 0.35rem;
          border-radius: 3px;
          font-size: 0.9em;
          font-family: "Courier New", monospace;
        }
        .ProseMirror hr {
          border: none;
          border-top: 2px solid #e5e7eb;
          margin: 1rem 0;
        }
        .ProseMirror a {
          color: #2563eb;
          text-decoration: underline;
          cursor: pointer;
        }
        .ProseMirror a:hover { color: #1d4ed8; }
        .ProseMirror img {
          max-width: 100%;
          height: auto;
          border-radius: 6px;
          margin: 0.5rem 0;
        }
        .ProseMirror mark {
          border-radius: 2px;
          padding: 0 2px;
        }
        .ProseMirror sub { vertical-align: sub; font-size: 0.8em; }
        .ProseMirror sup { vertical-align: super; font-size: 0.8em; }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
