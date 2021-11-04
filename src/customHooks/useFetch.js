import useAsync from "./useAsync";
import { useEffect, useState } from "react";

const controller = new AbortController()
const { signal } = controller
const DEFAULT_OPTIONS = {
    signal,
    headers: {'Content-type': 'application/json; charset=UTF-8'}
}

const useFetch = (url, options = {}, dependencies = [], saveToSessionStorage=false, sessionStorageName='') => {
    const [urlToFetch, setUrlToFetch] = useState(url)
    const [optionsToFetch, setOptionsToFetch] = useState(options)
    const [saveToSessionStorageState, setSaveToSessionStorageState] = useState(saveToSessionStorage)
    const [sessionStorageNameState, setSessionStorageNameState] = useState(sessionStorageName)

    useEffect(  () => {

        return () => {
            controller.abort()
        }

    }, [])

    
    const changeUrl = (newUrl, newOptions, newSaveToSessionStorage=false, newSessionStorageName='') =>{
        setUrlToFetch(newUrl)
        setOptionsToFetch(newOptions)
        setSessionStorageNameState(newSessionStorageName)
        setSaveToSessionStorageState(newSaveToSessionStorage)
    }
    
    
    const fetchDataStatus = useAsync(async () => {
        if(urlToFetch === ''){
            return
        }

        let savedDataExist = saveToSessionStorageState===true && sessionStorage.getItem(sessionStorageNameState)
        if(savedDataExist){
            return JSON.parse(sessionStorage.getItem(sessionStorageNameState))
        }
        
        const res = await fetch(urlToFetch, { ...DEFAULT_OPTIONS, ...optionsToFetch });
        if (res.ok){
            let promiseData = res.json()
            if(saveToSessionStorageState){
                let data = await promiseData
                console.log(data)
                sessionStorage.setItem(sessionStorageNameState, JSON.stringify(data))
            }
            
            return promiseData
        }
        const json = await res.json();
        
        
        return await Promise.reject(json);
    }, [urlToFetch])

    return {fetchDataStatus, changeUrl} 
}

export default useFetch 