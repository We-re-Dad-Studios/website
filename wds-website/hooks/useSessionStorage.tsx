import React from 'react'

export const useSessionStorage = () => {
  const getItem=(key:string)=>{
    const data= sessionStorage.getItem(key);
    return data
  }
  const storeItem=(key:string,data:string)=>{
    sessionStorage.setItem(key,data);
  }
return {getItem,storeItem};
}
