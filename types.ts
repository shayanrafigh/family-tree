export interface PersonData {
  id: string;
  name: string;
  birthYear?: string;
  deathYear?: string;
  title?: string;
  gender?: 'male' | 'female';
}

export interface FamilyNodeData extends PersonData {
  spouse?: PersonData;
  children: FamilyNodeData[];
}

export interface TreeAction {
  type: 'UPDATE_NAME' | 'UPDATE_YEARS' | 'UPDATE_TITLE' | 'ADD_SPOUSE' | 'REMOVE_SPOUSE' | 'ADD_CHILD' | 'DELETE_NODE';
  payload: any;
}