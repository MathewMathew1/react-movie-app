import { useState } from "react";

const useArray = <T>(defaultValue: T[]) => {
    const [array, setArray] =  useState<T[]>(defaultValue)


    const push = (value: T): void => {
        setArray(array => [...array, value])
    }


    const update = (newValue: T, index: number): void => {

        setArray(array => [
            ...array.slice(0, index), // remove value
            newValue,
            ...array.slice(index+1, array.length)
        ])
    }

    const includes = (value: T): boolean => {
        if(array.includes(value)){
            return true
        }
        return false
    }

    const removeValueByIndex = (index: number): void => {
        setArray(array => [...array.slice(0, index), ...array.slice(index + 1, array.length)])
    }

    const moveValueUp = (index: number, newIndex: number): void => {
        let newArray = [...array]
        newArray.splice(newIndex , 0, newArray.splice(index, 1)[0])
 
        setArray(newArray) 
    }


    //Works on array of objects
    const updateObjectByKey = <K extends keyof T, K2 extends keyof T>(key: K, keyValue: T[K], updatedFields: {field: K2, fieldValue: T[K2]}[]): void=> {   // updatedFields Should array of objects {field: fieldValue}
        const index = array.findIndex((obj: T) => obj[key] === keyValue)

        if(index===-1) return
        let objectToUpdate: T = array[index]
        
        for(let i=0; i<updatedFields.length; i++){
            objectToUpdate[updatedFields[i]["field"]] = updatedFields[i]["fieldValue"]
        }

        setArray(array => [
            ...array.slice(0, index), // remove value
            objectToUpdate,
            ...array.slice(index+1, array.length)
        ])
       
    }

    const removeByKey = <K extends keyof T>(key: K, keyValue: T[K]): void => {  
        const index = array.findIndex((obj: T) => obj[key] === keyValue)
        if(index===-1) return
        setArray(array => [...array.slice(0, index), ...array.slice(index + 1, array.length)])
    }

    const findIndexByKey = <K extends keyof T>(key: K, keyValue: T[K]): number =>{
        const index = array.findIndex((obj: T) => obj[key] === keyValue)
        return index
    }

    const updateObjectByIndex = <K extends keyof T>(index: number, updatedFields: {field: K, fieldValue: T[K]}[]): void => {
    
  
        let objectToUpdate: T = array[index]
        
        for(let i=0; i<updatedFields.length; i++){
            objectToUpdate[updatedFields[i]["field"]] = updatedFields[i]["fieldValue"]
        }

        setArray(array => [
            ...array.slice(0, index), // remove value
            objectToUpdate,
            ...array.slice(index+1, array.length)
        ])
    }

   

    return {array, set: setArray, push, removeValueByIndex, update, includes, removeByKey, updateObjectByKey, 
        updateObjectByIndex, findIndexByKey, moveValueUp}
}
export default useArray