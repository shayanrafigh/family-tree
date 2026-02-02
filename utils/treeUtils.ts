import { FamilyNodeData, PersonData } from '../types';

export const generateId = (): string => Math.random().toString(36).substr(2, 9);

export const createEmptyNode = (): FamilyNodeData => ({
  id: generateId(),
  name: 'New Person',
  gender: 'male',
  children: []
});

// Recursive function to find and update a node
export const updateTree = (
  root: FamilyNodeData,
  nodeId: string,
  updateFn: (node: FamilyNodeData) => FamilyNodeData | null // Return null to delete
): FamilyNodeData | null => {
  // Check root
  if (root.id === nodeId) {
    return updateFn(root);
  }

  // Check children
  const newChildren = root.children
    .map((child) => updateTree(child, nodeId, updateFn))
    .filter((child): child is FamilyNodeData => child !== null);

  if (newChildren.length !== root.children.length || newChildren.some((child, i) => child !== root.children[i])) {
    return { ...root, children: newChildren };
  }

  return root;
};

// Specific actions
export const addSpouseToNode = (root: FamilyNodeData, nodeId: string): FamilyNodeData => {
  return updateTree(root, nodeId, (node) => ({
    ...node,
    spouse: { 
      id: generateId(), 
      name: 'Spouse', 
      birthYear: '',
      gender: node.gender === 'male' ? 'female' : 'male' // Smart opposite gender assignment
    }
  })) || root;
};

export const removeSpouseFromNode = (root: FamilyNodeData, nodeId: string): FamilyNodeData => {
  return updateTree(root, nodeId, (node) => {
    const { spouse, ...rest } = node;
    return rest as FamilyNodeData;
  }) || root;
};

export const addChildToNode = (root: FamilyNodeData, parentId: string): FamilyNodeData => {
  return updateTree(root, parentId, (node) => ({
    ...node,
    children: [...node.children, createEmptyNode()]
  })) || root;
};

export const updateNodeData = (root: FamilyNodeData, nodeId: string, data: Partial<PersonData>, isSpouse: boolean = false): FamilyNodeData => {
  return updateTree(root, nodeId, (node) => {
    if (isSpouse && node.spouse) {
      return { ...node, spouse: { ...node.spouse, ...data } };
    } else if (!isSpouse) {
      return { ...node, ...data };
    }
    return node;
  }) || root;
};

export const deleteNodeFromTree = (root: FamilyNodeData, nodeId: string): FamilyNodeData | null => {
  if (root.id === nodeId) return null; // Cannot delete root from here really, usually blocked by UI
  return updateTree(root, nodeId, () => null); // updateTree filters out nulls
};