// This file is used to declare global types, modules, or interfaces

// Declare a global module or any other custom types you might need
declare module '*.png' {
    const value: string;
    export = value;
  }
  
  declare module '*.jpg' {
    const value: string;
    export = value;
  }
  
  declare module '*.jpeg' {
    const value: string;
    export = value;
  }
  
  declare module '*.svg' {
    const value: string;
    export = value;
  }
  
  // Declare global interfaces or types
  interface Window {
    customProperty?: string; // Example of a global property
  }
  
  // Declare global types or interfaces
  type CustomType = {
    id: number;
    name: string;
    isActive: boolean;
  };
  