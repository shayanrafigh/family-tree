import React from 'react';
import { FamilyNodeData, PersonData } from '../types';
import { PersonCard } from './PersonCard';
import { Plus, Heart } from 'lucide-react';

interface FamilyNodeProps {
  node: FamilyNodeData;
  onUpdateNode: (id: string, data: Partial<PersonData>, isSpouse?: boolean) => void;
  onAddChild: (parentId: string) => void;
  onAddSpouse: (nodeId: string) => void;
  onRemoveSpouse: (nodeId: string) => void;
  onDeleteNode: (nodeId: string) => void;
  isRoot?: boolean;
}

export const FamilyNode: React.FC<FamilyNodeProps> = ({
  node,
  onUpdateNode,
  onAddChild,
  onAddSpouse,
  onRemoveSpouse,
  onDeleteNode,
  isRoot = false,
}) => {
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="flex flex-col items-center">
      {/* NODE CONTENT WRAPPER */}
      <div className="flex items-center gap-12 relative mb-12 group/node z-10">
        
        {/* Connection Line to Spouse */}
        {node.spouse && (
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 border-t-2 border-slate-300 z-0"></div>
        )}

        {/* Primary Person */}
        <div className="relative z-10">
          <PersonCard
            person={node}
            onChange={(data) => onUpdateNode(node.id, data, false)}
            canDelete={!isRoot}
            onDelete={() => onDeleteNode(node.id)}
          />
          
          {/* Action Menu */}
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex gap-2 opacity-0 group-hover/node:opacity-100 transition-all duration-200 translate-y-2 group-hover/node:translate-y-0 z-20">
             <button
              onClick={() => onAddChild(node.id)}
              className="bg-slate-800 hover:bg-slate-700 text-white rounded-full p-1.5 shadow-lg hover:scale-110 transition-transform"
              title="Add Child"
            >
              <Plus size={16} />
            </button>
            {!node.spouse && (
              <button
                onClick={() => onAddSpouse(node.id)}
                className="bg-pink-500 hover:bg-pink-600 text-white rounded-full p-1.5 shadow-lg hover:scale-110 transition-transform"
                title="Add Spouse"
              >
                <Heart size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Spouse Person */}
        {node.spouse && (
          <div className="relative z-10">
            <PersonCard
              person={node.spouse}
              onChange={(data) => onUpdateNode(node.id, data, true)}
              isSpouse
              canDelete
              onDelete={() => onRemoveSpouse(node.id)}
            />
          </div>
        )}

        {/* The vertical line dropping down to children */}
        {hasChildren && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 h-12 w-px bg-slate-300"></div>
        )}
      </div>

      {/* CHILDREN RENDERER */}
      {hasChildren && (
        <div className="flex relative pt-4">
          
          {/* The Horizontal Connector Line */}
          {node.children.length > 1 && (
             <div className="absolute top-0 left-0 right-0 h-px bg-slate-300 mx-auto w-[calc(100%-13rem)] translate-y-0"></div>
          )}

          {node.children.map((child, index) => {
             const isFirst = index === 0;
             const isLast = index === node.children.length - 1;
             const isOnly = node.children.length === 1;

             return (
               <div key={child.id} className="relative flex flex-col items-center px-6">
                  
                  {/* Vertical Line Up to the horizontal connector */}
                  {!isOnly && (
                     <>
                      {/* Masking lines to prevent overlap on corners */}
                      {isFirst && <div className="absolute top-[-1rem] left-0 w-[50%] h-px bg-slate-50"></div>}
                      {isLast && <div className="absolute top-[-1rem] right-0 w-[50%] h-px bg-slate-50"></div>}
                      
                       <div className="absolute top-[-1rem] left-1/2 -translate-x-1/2 h-5 w-px bg-slate-300"></div>
                     </>
                  )}
                  
                  {isOnly && (
                      <div className="absolute top-[-1rem] left-1/2 -translate-x-1/2 h-5 w-px bg-slate-300"></div>
                  )}

                  <FamilyNode
                    node={child}
                    onUpdateNode={onUpdateNode}
                    onAddChild={onAddChild}
                    onAddSpouse={onAddSpouse}
                    onRemoveSpouse={onRemoveSpouse}
                    onDeleteNode={onDeleteNode}
                  />
               </div>
             );
          })}
        </div>
      )}
    </div>
  );
};