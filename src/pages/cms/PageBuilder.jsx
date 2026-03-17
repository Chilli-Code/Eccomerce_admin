import { useState, useEffect, useRef } from "react";
import { Monitor, Tablet, Smartphone, Undo2, Redo2, Eye, Square, FileCode, Trash2 } from "../../lib/icons.js";
import grapesjs from "grapesjs";
import "grapesjs/dist/css/grapes.min.css";
import blocksBasic from "grapesjs-blocks-basic";

export default function PageBuilder({ content, onChange }) {
    const containerRef = useRef(null);
    const instanceRef = useRef(null);
    const [leftPanel, setLeftPanel] = useState("blocks");
    const [rightPanel, setRightPanel] = useState("styles");

    useEffect(() => {
        if (!containerRef.current || instanceRef.current) return;

        const timer = setTimeout(() => {
            instanceRef.current = grapesjs.init({
                container: "#gjs-editor",
                height: "100%",
                width: "100%",
                storageManager: false,
                plugins: [blocksBasic],
                pluginsOpts: { [blocksBasic]: { flexGrid: true } },
                components: content || `
          <section style="padding:60px 40px;font-family:sans-serif;background:#f9fafb">
            <h1 style="font-size:2rem;font-weight:700;color:#111827;margin-bottom:16px">Mi página</h1>
            <p style="font-size:1rem;color:#6b7280;line-height:1.7">Empieza editando este contenido o arrastra bloques desde el panel izquierdo.</p>
          </section>
        `,
                blockManager: { appendTo: "#blocks-container" },
                styleManager: {
                    appendTo: "#styles-container",
                    sectors: [
                        { name: "Tipografía", open: true, properties: ["font-family", "font-size", "font-weight", "font-style", "color", "line-height", "letter-spacing", "text-align", "text-decoration", "text-transform"] },
                        { name: "Dimensiones", open: false, properties: ["width", "min-width", "max-width", "height", "min-height", "max-height", "margin", "padding"] },
                        { name: "Posición", open: false, properties: ["position", "top", "right", "bottom", "left", "display", "flex-direction", "justify-content", "align-items", "float", "overflow"] },
                        { name: "Decoraciones", open: false, properties: ["background-color", "background-image", "background-size", "background-position", "background-repeat", "border", "border-radius", "box-shadow", "opacity"] },
                    ],
                },
                layerManager: { appendTo: "#layers-container" },
                traitManager: { appendTo: "#traits-container" },
                selectorManager: { appendTo: "#selectors-container" },
                deviceManager: {
                    devices: [
                        { name: "Desktop", width: "" },
                        { name: "Tablet", width: "768px", widthMedia: "992px" },
                        { name: "Mobile", width: "320px", widthMedia: "480px" },
                    ],
                },
                panels: { defaults: [] },
            });

            // Bloques custom
            const bm = instanceRef.current.BlockManager;
            bm.add("hero-section", {
                label: "Hero", category: "Secciones",
                content: `<section style="padding:80px 40px;text-align:center;background:linear-gradient(135deg,#4f46e5,#7c3aed);color:white">
          <h1 style="font-size:2.5rem;font-weight:800;margin-bottom:16px">Tu título aquí</h1>
          <p style="font-size:1.1rem;opacity:.85;margin-bottom:32px">Descripción atractiva de tu propuesta de valor</p>
          <a href="#" style="background:white;color:#4f46e5;padding:12px 32px;border-radius:8px;font-weight:600;text-decoration:none">Comenzar</a>
        </section>`,
            });
            bm.add("features-3col", {
                label: "3 columnas", category: "Secciones",
                content: `<section style="padding:60px 40px;background:#fff">
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;max-width:1100px;margin:0 auto">
            ${[1, 2, 3].map(i => `<div style="padding:24px;border:1px solid #e5e7eb;border-radius:12px;text-align:center">
              <div style="width:48px;height:48px;background:#ede9fe;border-radius:12px;margin:0 auto 16px;font-size:24px;display:flex;align-items:center;justify-content:center">⭐</div>
              <h3 style="font-size:1.1rem;font-weight:600;color:#111827;margin-bottom:8px">Característica ${i}</h3>
              <p style="color:#6b7280;font-size:.9rem;line-height:1.6">Descripción de esta característica.</p>
            </div>`).join("")}
          </div>
        </section>`,
            });
            bm.add("cta-section", {
                label: "CTA Banner", category: "Secciones",
                content: `<section style="padding:60px 40px;background:#1e1b4b;color:white;text-align:center">
          <h2 style="font-size:2rem;font-weight:700;margin-bottom:12px">¿Listo para empezar?</h2>
          <p style="opacity:.8;margin-bottom:28px">Únete a miles de clientes satisfechos</p>
          <a href="#" style="background:#4f46e5;color:white;padding:14px 36px;border-radius:8px;font-weight:600;text-decoration:none">Comenzar gratis</a>
        </section>`,
            });
            bm.add("image-text", {
                label: "Imagen + Texto", category: "Secciones",
                content: `<section style="padding:60px 40px;background:#fff">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center;max-width:1100px;margin:0 auto">
            <img src="https://via.placeholder.com/500x350/e0e7ff/4f46e5?text=Imagen" style="width:100%;border-radius:12px"/>
            <div>
              <h2 style="font-size:1.8rem;font-weight:700;color:#111827;margin-bottom:16px">Tu título aquí</h2>
              <p style="color:#6b7280;line-height:1.7;margin-bottom:24px">Describe tu producto o servicio.</p>
              <a href="#" style="background:#4f46e5;color:white;padding:12px 28px;border-radius:8px;font-weight:600;text-decoration:none">Saber más</a>
            </div>
          </div>
        </section>`,
            });
            bm.add("testimonial", {
                label: "Testimonio", category: "Secciones",
                content: `<section style="padding:60px 40px;background:#f9fafb;text-align:center">
          <blockquote style="max-width:600px;margin:0 auto">
            <p style="font-size:1.3rem;color:#374151;line-height:1.7;font-style:italic;margin-bottom:24px">"Este producto cambió completamente nuestra forma de trabajar."</p>
            <footer>
              <div style="width:48px;height:48px;background:#4f46e5;border-radius:50%;margin:0 auto 8px;color:white;display:flex;align-items:center;justify-content:center;font-weight:700">JD</div>
              <p style="font-weight:600;color:#111827">Juan Díaz</p>
              <p style="color:#9ca3af;font-size:.85rem">CEO, Empresa XYZ</p>
            </footer>
          </blockquote>
        </section>`,
            });
            bm.add("contact-form", {
                label: "Formulario", category: "Formularios",
                content: `<section style="padding:60px 40px;background:#fff">
          <div style="max-width:500px;margin:0 auto">
            <h2 style="font-size:1.8rem;font-weight:700;color:#111827;margin-bottom:8px;text-align:center">Contáctanos</h2>
            <form style="display:flex;flex-direction:column;gap:16px;margin-top:24px">
              <input type="text" placeholder="Tu nombre" style="padding:12px 16px;border:1px solid #e5e7eb;border-radius:8px;font-size:1rem"/>
              <input type="email" placeholder="Tu email" style="padding:12px 16px;border:1px solid #e5e7eb;border-radius:8px;font-size:1rem"/>
              <textarea placeholder="Tu mensaje" rows="4" style="padding:12px 16px;border:1px solid #e5e7eb;border-radius:8px;font-size:1rem;resize:vertical"></textarea>
              <button type="submit" style="background:#4f46e5;color:white;padding:14px;border:none;border-radius:8px;font-size:1rem;font-weight:600;cursor:pointer">Enviar</button>
            </form>
          </div>
        </section>`,
            });

            instanceRef.current.on("update", () => {
                onChange(instanceRef.current.getHtml());
            });
        }, 150);

        return () => {
            clearTimeout(timer);
            if (instanceRef.current) {
                instanceRef.current.destroy();
                instanceRef.current = null;
            }
        };
    }, []);

    return (
        <div ref={containerRef} className="flex flex-col h-full bg-gray-900">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-700 flex-shrink-0">
                <div className="flex items-center gap-1">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mr-2">Editor</span>
                    {[
                        { icon: Monitor, title: "Desktop", device: "Desktop" },
                        { icon: Tablet, title: "Tablet", device: "Tablet" },
                        { icon: Smartphone, title: "Mobile", device: "Mobile" },
                    ].map(d => (
                        <button key={d.device} title={d.title}
                            onClick={() => {
                                const editor = instanceRef.current;
                                if (!editor) return;
                                const device = editor.Devices.get(d.device);
                                if (device) {
                                    editor.Devices.select(device);
                                    setTimeout(() => {
                                        const frame = editor.Canvas.getFrameEl();
                                        if (frame) {
                                            const width = device.get("width") || "100%";
                                            frame.style.width = width;
                                        }
                                        editor.refresh();
                                    }, 50);
                                }
                            }}
                            className="p-2 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
                        >
                            <d.icon size={16} />
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-1">
                    {[
                        { icon: Undo2, title: "Deshacer", cmd: "core:undo" },
                        { icon: Redo2, title: "Rehacer", cmd: "core:redo" },
                        { icon: Eye, title: "Preview", cmd: "preview" },
                        { icon: Square, title: "Bordes", cmd: "sw-visibility" },
                        { icon: FileCode, title: "Exportar", cmd: "export-template" },
                        { icon: Trash2, title: "Limpiar", cmd: "core:canvas-clear" },
                    ].map(a => (
                        <button key={a.cmd} title={a.title}
                            onClick={() => instanceRef.current?.runCommand(a.cmd)}
                            className="p-2 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
                        >
                            <a.icon size={16} />
                        </button>
                    ))}
                </div>
            </div>

            {/* Body */}
            <div className="flex flex-1 overflow-hidden">
                {/* Left */}
                <div className="w-52 flex-shrink-0 bg-gray-900 border-r border-gray-700 flex flex-col overflow-hidden">
                    <div className="flex border-b border-gray-700 flex-shrink-0">
                        {[{ key: "blocks", label: "Bloques" }, { key: "layers", label: "Capas" }].map(t => (
                            <button key={t.key} onClick={() => setLeftPanel(t.key)}
                                className={`flex-1 py-2 text-xs font-medium transition-colors ${leftPanel === t.key ? "text-indigo-400 border-b-2 border-indigo-400" : "text-gray-500 hover:text-gray-300"}`}
                            >{t.label}</button>
                        ))}
                    </div>
                    <div className="flex-1 overflow-y-auto bg-black">
                        <div id="blocks-container" className={leftPanel === "blocks" ? "" : "hidden"} />
                        <div id="layers-container" className={leftPanel === "layers" ? "" : "hidden"} />
                    </div>
                </div>

                {/* Canvas */}
                <div id="gjs-editor" className="flex-1 overflow-hidden" style={{ position: "relative" }} />

                {/* Right */}
                <div className="w-60 flex-shrink-0 px-2 bg-gray-900 border-l border-gray-700 flex flex-col overflow-hidden">
                    <div className="flex border-b border-gray-700 flex-shrink-0">
                        {[{ key: "styles", label: "Estilos" }, { key: "classes", label: "Clases" }, { key: "traits", label: "Props" }].map(t => (
                            <button key={t.key} onClick={() => setRightPanel(t.key)}
                                className={`flex-1 py-2 text-xs font-medium transition-colors ${rightPanel === t.key ? "text-indigo-400 border-b-2 border-indigo-400" : "text-gray-500 hover:text-gray-300"}`}
                            >{t.label}</button>
                        ))}
                    </div>
                    <div className="flex-1 overflow-y-auto">

                        {/* Estilos */}
                        <div className={rightPanel === "styles" ? "" : "hidden"}>
                            <div id="styles-container" />
                        </div>

                        {/* Clases 👇 */}
                        <div className={rightPanel === "classes" ? "" : "hidden"}>
                            <div id="selectors-container" />
                        </div>

                        {/* Props */}
                        <div className={rightPanel === "traits" ? "" : "hidden"}>
                            <div id="traits-container" />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}