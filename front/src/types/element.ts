export interface Category {
    _id: string;
    name: string;
  }
  
 export interface SearchBarProps {
    onSearch: (query: string) => void;
  }