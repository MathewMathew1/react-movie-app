import  {createContext, useContext, useEffect,} from "react";
import useArray from "./customHooks/useArray";
import { severityColors } from "./types/types";

const MAXIMUM_AMOUNT_OF_SNACKBARS = 3

export type SnackbarInfo = {
    message: string,
    severity: severityColors
}

type SnackbarContextProps = {    
    snackBarsInfos: SnackbarInfo[]
}

type SnackbarUpdateProps = {    
    addSnackBar: ({snackbarText, severity}: {snackbarText: string, severity: string}) => void
    removeSnackBarByIndex: (index: number) => void
}

const SnackbarContext = createContext({} as SnackbarContextProps)
const SnackbarUpdate = createContext({} as SnackbarUpdateProps)

export function useSnackbar(){
    return useContext(SnackbarContext)
}

export function useUpdateSnackbar(){
    return useContext(SnackbarUpdate)
}

const SnackbarProvider = ({ children }: {children: any}): JSX.Element => {
    const snackBarInfos = useArray<SnackbarInfo>([])

    useEffect(() => {
        let snackbarInfo = sessionStorage.getItem("snackbar")
        if(snackbarInfo){
            sessionStorage.removeItem("snackbar")
            let snackbarInfoParsed: SnackbarInfo = JSON.parse(snackbarInfo)
            addSnackBar({snackbarText: snackbarInfoParsed.message, severity: severityColors[snackbarInfoParsed.severity]})
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const addSnackBar = ({snackbarText, severity}: {snackbarText: string, severity: severityColors}): void => {
        if(snackBarInfos.array.length >= MAXIMUM_AMOUNT_OF_SNACKBARS){
            snackBarInfos.removeValueByIndex(0)
        }
        snackBarInfos.push({message: snackbarText, severity: severityColors[severity]})
    }

    const removeSnackBarByIndex = (index: number): void => {
        snackBarInfos.removeValueByIndex(index)
    }

    return (
        <SnackbarContext.Provider value={{snackBarsInfos: snackBarInfos.array}}>
            <SnackbarUpdate.Provider value={{addSnackBar, removeSnackBarByIndex}}>
                {children}   
            </SnackbarUpdate.Provider>
        </SnackbarContext.Provider>
    )
}

export default SnackbarProvider