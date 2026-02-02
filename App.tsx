import React, { useState, useRef } from 'react';
import { FamilyNodeData, PersonData } from './types';
import { 
  addChildToNode, 
  addSpouseToNode, 
  removeSpouseFromNode, 
  updateNodeData, 
  deleteNodeFromTree 
} from './utils/treeUtils';
import { FamilyNode } from './components/FamilyNode';
import { ZoomIn, ZoomOut, Move, Image as ImageIcon, FileJson, Upload, RefreshCw, Trash2 } from 'lucide-react';
import html2canvas from 'html2canvas';

const INITIAL_DATA: FamilyNodeData = {
  id: 'root-1',
  name: 'King Cyrus',
  title: 'The Great',
  birthYear: '600 BC',
  deathYear: '530 BC',
  gender: 'male',
  spouse: {
    id: 's-1',
    name: 'Cassandane',
    title: 'Queen',
    birthYear: '',
    deathYear: '',
    gender: 'female'
  },
  children: [
    {
      id: 'c-1',
      name: 'Cambyses II',
      title: 'King',
      gender: 'male',
      children: []
    },
    {
      id: 'c-2',
      name: 'Bardiya',
      title: 'Prince',
      gender: 'male',
      children: []
    },
    {
      id: 'c-3',
      name: 'Atossa',
      title: 'Queen',
      gender: 'female',
      spouse: {
        id: 's-2',
        name: 'Darius I',
        title: 'King',
        gender: 'male'
      },
      children: [
        {
          id: 'gc-1',
          name: 'Xerxes I',
          title: 'King',
          gender: 'male',
          children: []
        }
      ]
    }
  ]
};

export default function App() {
  const [treeData, setTreeData] = useState<FamilyNodeData>(INITIAL_DATA);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handlers for Tree Manipulation
  const handleUpdateNode = (id: string, data: Partial<PersonData>, isSpouse?: boolean) => {
    setTreeData(prev => updateNodeData(prev, id, data, isSpouse));
  };

  const handleAddChild = (parentId: string) => {
    setTreeData(prev => addChildToNode(prev, parentId));
  };

  const handleAddSpouse = (nodeId: string) => {
    setTreeData(prev => addSpouseToNode(prev, nodeId));
  };

  const handleRemoveSpouse = (nodeId: string) => {
    setTreeData(prev => removeSpouseFromNode(prev, nodeId));
  };

  const handleDeleteNode = (nodeId: string) => {
    const newTree = deleteNodeFromTree(treeData, nodeId);
    if (newTree) setTreeData(newTree);
  };

  const handleReset = () => {
    if(confirm("Are you sure you want to reset the entire tree to default? Unsaved changes will be lost.")) {
      setTreeData(INITIAL_DATA);
      setScale(1);
      setPosition({x: 0, y: 0});
    }
  }

  // --- File & Image Operations ---

  const handleExportImage = async () => {
    const element = document.getElementById('family-tree-content');
    if (!element) return;

    try {
      // Create a temporary clone or adjust style if needed, 
      // but usually html2canvas works on visible elements.
      // We pass scale: 2 for better resolution (Retina support).
      const canvas = await html2canvas(element, {
        backgroundColor: '#f8fafc', // match bg-slate-50
        scale: 2,
        logging: false,
        useCORS: true,
      });

      const link = document.createElement('a');
      link.download = `dynasty-tree-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error("Export image failed", err);
      alert("Failed to create image. Please try again.");
    }
  };

  const handleExportJson = () => {
    const dataStr = JSON.stringify(treeData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `dynasty-data-${new Date().toISOString().slice(0, 10)}.json`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJsonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json && json.id && json.children) {
           setTreeData(json);
           alert("Family tree loaded successfully!");
        } else {
           alert("Invalid file format. Please upload a valid JSON family tree.");
        }
      } catch (err) {
        console.error("Load failed", err);
        alert("Failed to parse file.");
      }
    };
    reader.readAsText(file);
    // Reset input so same file can be selected again if needed
    e.target.value = '';
  };


  // --- Zoom/Pan Handlers ---
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      setScale(s => Math.min(Math.max(0.2, s * delta), 2));
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).closest('button')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-slate-50 font-sans">
      
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept=".json" 
        className="hidden" 
      />

      {/* Toolbar */}
      <div className="fixed top-6 left-6 z-50 flex flex-col gap-3">
        {/* Navigation Group */}
        <div className="bg-white/90 backdrop-blur-sm p-1.5 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20 flex flex-col gap-1">
          <button onClick={() => setScale(s => Math.min(2, s + 0.1))} className="p-2.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors" title="Zoom In">
            <ZoomIn size={20} />
          </button>
          <button onClick={() => setScale(s => Math.max(0.2, s - 0.1))} className="p-2.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors" title="Zoom Out">
            <ZoomOut size={20} />
          </button>
          <div className="h-px bg-slate-200 mx-2 my-1"></div>
          <button onClick={() => { setScale(1); setPosition({x:0, y:0}) }} className="p-2.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors" title="Reset View">
            <Move size={20} />
          </button>
        </div>
        
        {/* Actions Group */}
        <div className="bg-white/90 backdrop-blur-sm p-1.5 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20 flex flex-col gap-1">
           <button onClick={handleExportJson} className="p-2.5 hover:bg-emerald-50 text-emerald-600 rounded-lg transition-colors" title="Save File (JSON)">
            <FileJson size={20} />
          </button>
           <button onClick={handleImportJsonClick} className="p-2.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors" title="Load File (JSON)">
            <Upload size={20} />
          </button>
           <button onClick={handleExportImage} className="p-2.5 hover:bg-indigo-50 text-indigo-600 rounded-lg transition-colors" title="Export as Image (PNG)">
            <ImageIcon size={20} />
          </button>
          <div className="h-px bg-slate-200 mx-2 my-1"></div>
           <button onClick={handleReset} className="p-2.5 hover:bg-red-50 text-red-500 rounded-lg transition-colors" title="Reset Data">
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      <div className="fixed top-6 right-6 z-50 pointer-events-none">
          <div className="bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20 max-w-sm">
             <h2 className="font-bold text-slate-800 text-lg mb-1 tracking-tight">Dynasty Builder</h2>
             <p className="text-sm text-slate-500 leading-relaxed">
               Craft your lineage. Hover over cards to expand your tree. 
               <br/><span className="text-xs mt-2 block opacity-75">Drag to pan • Scroll to zoom</span>
             </p>
          </div>
      </div>

      {/* Canvas */}
      <div 
        ref={containerRef}
        className={`flex-1 overflow-hidden cursor-${isDragging ? 'grabbing' : 'grab'} bg-slate-50 relative`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        {/* CSS Grid Pattern */}
        <div className="absolute inset-0 z-0 opacity-[0.4] pointer-events-none" 
             style={{
                 backgroundImage: 'linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)',
                 backgroundSize: '40px 40px',
                 transform: `translate(${position.x % 40}px, ${position.y % 40}px) scale(${scale})` // Parallax effect on grid
             }}>
        </div>

        <div 
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: 'top left',
            transition: isDragging ? 'none' : 'transform 0.1s cubic-bezier(0.2, 0, 0.2, 1)'
          }}
          className="w-full h-full p-20 flex justify-center min-w-[200vw] min-h-[200vh] z-10 relative"
        >
          {/* 
            ID 'family-tree-content' is targeted by html2canvas.
            p-10 and bg-slate-50 ensures the export has padding and background.
            inline-block ensures it wraps the content width/height exactly.
          */}
          <div id="family-tree-content" className="inline-block p-10 bg-slate-50 rounded-lg">
            <FamilyNode
              node={treeData}
              onUpdateNode={handleUpdateNode}
              onAddChild={handleAddChild}
              onAddSpouse={handleAddSpouse}
              onRemoveSpouse={handleRemoveSpouse}
              onDeleteNode={handleDeleteNode}
              isRoot={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}