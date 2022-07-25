import { useCallback, useEffect, useState } from "react";

const LOADING_NOT_FINISHED = "LOADING_NOT_FINISHED"


const useAsync = (callback, dependencies = []) => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string|undefined>()
    const [value, setValue] = useState<any>(Object)

    const callbackMemoized = useCallback(()=>{
        var currentdate = new Date(); 
        setLoading(true)
        setError(undefined)
        setValue(undefined)
        callback()
            .then((newValue)=>{
                if(newValue===LOADING_NOT_FINISHED) return
            
                setValue(newValue)
                setLoading(false)
                
                console.log(dependencies)
            })
            .catch(setError)
            .finally(() => {
               
            })
    // eslint-disable-next-line react-hooks/exhaustive-deps        
    }, dependencies)

    useEffect(() => {
        callbackMemoized()
    }, [callbackMemoized])

    return {loading, error, value, setValue}
}

export default useAsync

