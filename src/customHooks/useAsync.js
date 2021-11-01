import { useCallback, useEffect, useState } from "react";

const useAsync = (callback, dependencies = []) => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState()
    const [value, setValue] = useState(Object)



    const callbackMemoized = useCallback(()=>{
        setLoading(true)
        setError()
        setValue()
        callback()
            .then(setValue)
            .catch(setError)
            .finally(() => setLoading(false))
    }, dependencies)

    useEffect(() => {
        callbackMemoized()
    }, [callbackMemoized])

    return {loading, error, value}
}

export default useAsync

