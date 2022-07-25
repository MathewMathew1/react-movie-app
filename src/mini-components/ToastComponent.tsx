

import { Toast } from "react-bootstrap"

const ToastComponent  = ({toastMessage, showToast, setShowToast}:{toastMessage: string, showToast: boolean, 
    setShowToast: Function}): JSX.Element => {
    
    return (
        <div>
            <Toast style={{backgroundColor: "var(--green-good)"}} className="toast" 
                onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide>
                <Toast.Header>{toastMessage}</Toast.Header>
            </Toast>
        </div>
    )      
}

export default ToastComponent