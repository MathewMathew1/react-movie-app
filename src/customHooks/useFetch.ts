import useAsync from "./useAsync";
import { useEffect, useState } from "react";

const DEFAULT_OPTIONS = {
    headers: {'Content-type': 'application/json; charset=UTF-8'}
}

const SESSION_STORAGE_TIME = 5 * 60 * 1000

const LOADING_NOT_FINISHED = "LOADING_NOT_FINISHED"

const useFetch = (url, options = {}, dependencies = [], saveToSessionStorage=false, sessionStorageName='') => {
    const [urlToFetch, setUrlToFetch] = useState(url)
    const [optionsToFetch, setOptionsToFetch] = useState(options)
    const [saveToSessionStorageState, setSaveToSessionStorageState] = useState(saveToSessionStorage)
    const [sessionStorageNameState, setSessionStorageNameState] = useState(sessionStorageName)
    const controller = new AbortController()
    

    useEffect(  () => {
        return () => {
            controller.abort()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    
    const changeUrl = ({newUrl, newOptions={}, newSaveToSessionStorage=false, newSessionStorageName=''}: 
        {newUrl: string, newOptions?: any, newSaveToSessionStorage?: boolean, newSessionStorageName?: string}) =>{
        setUrlToFetch(newUrl)
        setOptionsToFetch(newOptions)
        setSessionStorageNameState(newSessionStorageName)
        setSaveToSessionStorageState(newSaveToSessionStorage)
    }
    
    const fetchDataStatus = useAsync(async () => {
        if(urlToFetch === ''){
            return LOADING_NOT_FINISHED
        }

        const savedData = sessionStorage.getItem(sessionStorageNameState)
        let savedDataExist = saveToSessionStorageState===true && savedData

        if(savedDataExist){
            const { timestamp, data } = JSON.parse(savedData);

            // Check if the data is expired
            if (Date.now() - timestamp <= SESSION_STORAGE_TIME) {
                return data;
            } else {
                sessionStorage.removeItem(sessionStorageNameState); // Remove expired data
            }

        }

        const { signal } = controller
        const res = await fetch(urlToFetch, { ...DEFAULT_OPTIONS, ...optionsToFetch, signal });
        if (res.ok) {
            const promiseData = await res.json();
            if (saveToSessionStorageState) {
                const data = {
                    timestamp: Date.now(),
                    data: promiseData
                };
                sessionStorage.setItem(sessionStorageNameState, JSON.stringify(data));
            }
            return promiseData;
        }
        const json = await res.json()
    
        return await Promise.reject(json)
        
    }, [urlToFetch])

    return {fetchDataStatus, changeUrl} 
}

export default useFetch 