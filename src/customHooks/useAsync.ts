import { useCallback, useEffect, useState } from "react";

const useAsync = (callback, dependencies = []) => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string|undefined>()
    const [value, setValue] = useState<any>(Object)

    const callbackMemoized = useCallback(()=>{
        setLoading(true)
        setError(undefined)
        setValue(undefined)
        callback()
            .then(setValue)
            .catch(setError)
            .finally(() => setLoading(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps        
    }, dependencies)

    useEffect(() => {
        callbackMemoized()
    }, [callbackMemoized])

    return {loading, error, value, setValue}
}

export default useAsync

