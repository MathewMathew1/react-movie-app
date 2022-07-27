import useAsync from "./useAsync";
import { useEffect, useState } from "react";

const DEFAULT_OPTIONS = {
    headers: {'Content-type': 'application/json; charset=UTF-8'}
}

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

        let savedDataExist = saveToSessionStorageState===true && sessionStorage.getItem(sessionStorageNameState)

        if(savedDataExist){
            return JSON.parse(sessionStorage.getItem(sessionStorageNameState))
        }

        const { signal } = controller
        const res = await fetch(urlToFetch, { ...DEFAULT_OPTIONS, ...optionsToFetch, signal });
        if (res.ok){
            let promiseData = res.json()
            if(saveToSessionStorageState){
                let data = await promiseData
                sessionStorage.setItem(sessionStorageNameState, JSON.stringify(data))
            }
            
            return promiseData
        }
        const json = await res.json()
    
        return await Promise.reject(json)
        
    }, [urlToFetch])

    return {fetchDataStatus, changeUrl} 
}

export default useFetch 