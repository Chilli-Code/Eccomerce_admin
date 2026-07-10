import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Highlight from '@tiptap/extension-highlight';
import Color from '@tiptap/extension-color';
import {TextStyle} from '@tiptap/extension-text-style';
import { 
  Bold, Italic, Underline as UnderlineIcon, 
  AlignLeft, AlignCenter, AlignRight,
  List, ListOrdered, Link as LinkIcon,
  Heading1, Heading2, Minus, Undo, Redo,
  Highlighter, Code, Palette, X
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

// Paleta de colores profesionales
const COLOR_PALETTE = {
  basic: [
    { name: 'Negro', code: '#000000' },
    { name: 'Gris oscuro', code: '#4b5563' },
    { name: 'Gris', code: '#6b7280' },
    { name: 'Gris claro', code: '#9ca3af' },
  ],
  vibrant: [
    { name: 'Rojo', code: '#ef4444' },
    { name: 'Naranja', code: '#f97316' },
    { name: 'Amarillo', code: '#eab308' },
    { name: 'Verde', code: '#22c55e' },
    { name: 'Azul', code: '#3b82f6' },
    { name: 'Morado', code: '#a855f7' },
    { name: 'Rosa', code: '#ec489a' },
  ],
  pastel: [
    { name: 'Rojo pastel', code: '#fecaca' },
    { name: 'Naranja pastel', code: '#fed7aa' },
    { name: 'Amarillo pastel', code: '#fef9c3' },
    { name: 'Verde pastel', code: '#bbf7d0' },
    { name: 'Azul pastel', code: '#bfdbfe' },
    { name: 'Morado pastel', code: '#e9d5ff' },
    { name: 'Rosa pastel', code: '#fbcfe8' },
  ]
};

const HIGHLIGHT_PALETTE = [
  { name: 'Amarillo', code: '#ffeb3b' },
  { name: 'Verde claro', code: '#8bc34a' },
  { name: 'Azul claro', code: '#64b5f6' },
  { name: 'Naranja', code: '#ffb74d' },
  { name: 'Rosa', code: '#f06292' },
  { name: 'Morado', code: '#ba68c8' },
  { name: 'Rojo', code: '#ef5350' },
  { name: 'Gris', code: '#9e9e9e' },
];

export default function RichTextEditor({ value, onChange, placeholder = "Describe tu producto..." }) {
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [currentTextColor, setCurrentTextColor] = useState('#000000');
  const [currentHighlightColor, setCurrentHighlightColor] = useState('#ffeb3b');
  const [customColor, setCustomColor] = useState('#000000');
  
  const textColorRef = useRef(null);
  const highlightRef = useRef(null);
  const colorPickerRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2] },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary-600 underline',
        },
      }),
      TextStyle,
      Color.configure({
        types: ['textStyle'],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'min-h-[200px] focus:outline-none prose prose-sm max-w-none p-3',
      },
    },
  });

  // Cerrar selectores al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (textColorRef.current && !textColorRef.current.contains(event.target)) {
        setShowTextColorPicker(false);
      }
      if (highlightRef.current && !highlightRef.current.contains(event.target)) {
        setShowHighlightPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!editor) {
    return null;
  }

  const ToolbarButton = ({ onClick, active, children, title }) => (
    <button
      type="button"
      onClick={onClick}
      className={`p-2 rounded-md text-sm transition-colors ${
        active 
          ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' 
          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
      }`}
      title={title}
    >
      {children}
    </button>
    
  );


  const addLink = () => {
    const url = window.prompt('URL del enlace:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const clearFormatting = () => {
    editor.chain().focus().clearNodes().unsetAllMarks().run();
  };

  const applyTextColor = (colorCode) => {
    setCurrentTextColor(colorCode);
    setCustomColor(colorCode);
    editor.chain().focus().setColor(colorCode).run();
  };

  const applyHighlight = (colorCode) => {
    setCurrentHighlightColor(colorCode);
    editor.chain().focus().toggleHighlight({ color: colorCode }).run();
  };

  const removeTextColor = () => {
    editor.chain().focus().unsetColor().run();
  };

  const removeHighlight = () => {
    editor.chain().focus().unsetHighlight().run();
  };

  // Prevenir que el clic en el selector de color cierre la paleta
  const handleColorPickerClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-900">
      {/* Toolbar Principal */}
      <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Negrita">
          <Bold size={16} />
        </ToolbarButton>
        
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Cursiva">
          <Italic size={16} />
        </ToolbarButton>
        
        <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Subrayado">
          <UnderlineIcon size={16} />
        </ToolbarButton>
        
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
        
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="Título 1">
          <Heading1 size={16} />
        </ToolbarButton>
        
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Título 2">
          <Heading2 size={16} />
        </ToolbarButton>
        <ToolbarButton
  onClick={() => editor.chain().focus().setParagraph().run()}
  active={editor.isActive('paragraph')}
  title="Párrafo normal"
>
  <span className="font-bold text-sm">P</span>
</ToolbarButton>
        
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
        
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Alinear izquierda">
          <AlignLeft size={16} />
        </ToolbarButton>
        
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Centrar">
          <AlignCenter size={16} />
        </ToolbarButton>
        
        <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Alinear derecha">
          <AlignRight size={16} />
        </ToolbarButton>
        
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
        
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Lista con viñetas">
          <List size={16} />
        </ToolbarButton>
        
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Lista numerada">
          <ListOrdered size={16} />
        </ToolbarButton>
        
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
        
        <ToolbarButton onClick={addLink} active={editor.isActive('link')} title="Insertar enlace">
          <LinkIcon size={16} />
        </ToolbarButton>
        
        <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Línea horizontal">
          <Minus size={16} />
        </ToolbarButton>
        
        <div className="flex-1" />
        
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Deshacer">
          <Undo size={16} />
        </ToolbarButton>
        
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Rehacer">
          <Redo size={16} />
        </ToolbarButton>
      </div>
      
      {/* Segunda fila - Colores */}
      <div className="flex flex-wrap items-center gap-2 p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30">
        {/* Color de texto */}
        <div ref={textColorRef} className="relative">
          <button
            type="button"
            onClick={() => setShowTextColorPicker(!showTextColorPicker)}
            className={`p-2 rounded-md text-sm transition-colors flex items-center gap-2 ${
              editor.isActive('textStyle') 
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' 
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
            }`}
            title="Color de texto"
          >
            <Palette size={14} />
            <div 
              className="w-5 h-5 rounded-md border border-gray-300 shadow-sm"
              style={{ backgroundColor: currentTextColor }}
            />
            <span className="text-xs">Color</span>
          </button>
          
          {showTextColorPicker && (
            <div 
              ref={colorPickerRef}
              className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Color de texto</span>
                <button
                  onClick={() => setShowTextColorPicker(false)}
                  className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
              
              <div className="px-3 py-1">
                {/* Colores básicos */}
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Colores básicos</p>
                <div className="grid grid-cols-8 gap-1.5 mb-3">
                  {COLOR_PALETTE.basic.map((color) => (
                    <button
                      key={color.code}
                      onClick={() => applyTextColor(color.code)}
                      className={`w-6 h-6 rounded-md hover:scale-110 transition-transform ${
                        currentTextColor === color.code ? 'ring-2 ring-offset-1 ring-primary-500' : ''
                      }`}
                      style={{ backgroundColor: color.code, border: color.code === '#ffffff' ? '1px solid #e5e7eb' : 'none' }}
                      title={color.name}
                    />
                  ))}
                </div>
                
                {/* Colores vibrantes */}
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Colores vibrantes</p>
                <div className="grid grid-cols-7 gap-1.5 mb-3">
                  {COLOR_PALETTE.vibrant.map((color) => (
                    <button
                      key={color.code}
                      onClick={() => applyTextColor(color.code)}
                      className={`w-6 h-6 rounded-md hover:scale-110 transition-transform ${
                        currentTextColor === color.code ? 'ring-2 ring-offset-1 ring-primary-500' : ''
                      }`}
                      style={{ backgroundColor: color.code }}
                      title={color.name}
                    />
                  ))}
                </div>
                
                {/* Colores pastel */}
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Colores pastel</p>
                <div className="grid grid-cols-7 gap-1.5 mb-3">
                  {COLOR_PALETTE.pastel.map((color) => (
                    <button
                      key={color.code}
                      onClick={() => applyTextColor(color.code)}
                      className={`w-6 h-6 rounded-md hover:scale-110 transition-transform ${
                        currentTextColor === color.code ? 'ring-2 ring-offset-1 ring-primary-500' : ''
                      }`}
                      style={{ backgroundColor: color.code }}
                      title={color.name}
                    />
                  ))}
                </div>
                
                {/* Selector de color personalizado */}
                <div className="mt-2 pt-1 border-t border-gray-200 dark:border-gray-700">
                  <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Color personalizado</label>
                  <div className="flex gap-2" onClick={handleColorPickerClick}>
                    <input
                      type="color"
                      value={customColor}
                      onChange={(e) => {
                        setCustomColor(e.target.value);
                        applyTextColor(e.target.value);
                      }}
                      className="w-6 h-6 rounded cursor-pointer border border-gray-300 dark:border-gray-600"
                    />
                    <input
                      type="text"
                      value={customColor}
                      onChange={(e) => {
                        setCustomColor(e.target.value);
                        if (e.target.value.match(/^#[0-9A-Fa-f]{6}$/)) {
                          applyTextColor(e.target.value);
                        }
                      }}
                      className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 font-mono"
                      placeholder="#000000"
                    />
                  </div>
                </div>
                
                {/* Botón quitar color */}
                <button
                  onClick={removeTextColor}
                  className="w-full mt-3 px-2 py-1.5 text-xs rounded text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
                >
                  Quitar color
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Resaltado */}
        <div ref={highlightRef} className="relative">
          <button
            type="button"
            onClick={() => setShowHighlightPicker(!showHighlightPicker)}
            className={`p-2 rounded-md text-sm transition-colors flex items-center gap-2 ${
              editor.isActive('highlight') 
                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' 
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
            }`}
            title="Resaltar texto"
          >
            <Highlighter size={14} />
            <div 
              className="w-5 h-5 rounded-md border border-gray-300 shadow-sm"
              style={{ backgroundColor: currentHighlightColor }}
            />
            <span className="text-xs">Resaltar</span>
          </button>
          
          {showHighlightPicker && (
            <div 
              className="absolute top-full left-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Resaltar texto</span>
                <button
                  onClick={() => setShowHighlightPicker(false)}
                  className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <X size={12} />
                </button>
              </div>
              
              <div className="p-3">
                <div className="grid grid-rows-2 grid-flow-col gap-2 justify-start w-max">
                  {HIGHLIGHT_PALETTE.map((color) => (
                    <button
                      key={color.code}
                      onClick={() => applyHighlight(color.code)}
                      className={`w-5 h-5 aspect-square rounded-md hover:scale-105 transition-transform ${
                        currentHighlightColor === color.code ? 'ring-2 ring-offset-1 ring-primary-500' : ''
                      }`}
                      style={{ backgroundColor: color.code }}
                      title={color.name}
                    />
                  ))}
                </div>
                
                <button
                  onClick={removeHighlight}
                  className="w-full mt-2 px-2 py-1.5 text-xs rounded text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
                >
                  Quitar resaltado
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
        
        <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Código">
          <Code size={14} />
        </ToolbarButton>
        
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
        

        
        <button
          type="button"
          onClick={clearFormatting}
          className="px-2 py-1 text-xs rounded text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
        >
          Limpiar formato
        </button>
      </div>
      
      {/* Editor */}
      <EditorContent editor={editor} />
      
      {/* Contador */}
      <div className="px-3 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30 text-xs text-gray-500">
        {editor.getText().length} caracteres
      </div>
    </div>
  );
}