import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

function Dialog() {
    const ref = useRef();
    const dispatch = useDispatch();
    const openModal = useSelector((state) => state.modal.open);


    useEffect(() => {
        if (openModal) {
            ref.current?.showModal();
        } else {
            ref.current?.close();
        }
    }, [openModal]);

    const closeModal = () => {
        dispatch(closeModal());
    };

    return (
        <dialog
            ref={ref}
            onCancel={closeModal}
        >
            Loading existing canvas...
            <button onClick={closeModal}>
                Close
            </button>
        </dialog>
    );
}

export default Dialog;