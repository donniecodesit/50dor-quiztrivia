import { useGlobalContext } from "../Context/Context";

export default function Modal() {
    const { modal, closeModal, correct, questions } = useGlobalContext();
    const score = ((correct/questions.length)*100).toFixed(0);
    return (
        <div className={`${modal ? "modal-container isOpen" : "modal-container"}`}>
            <div className="modal-content">
                <h2>
                    {
                        score > 75 ? "Congrats!" : score > 45 ? "Nice!" : "Finished!"
                    }
                </h2>
                <p>You answered {score}% correct!</p>
                <button className="close-btn" onClick={closeModal}>Play Again?</button>
            </div>
        </div>
    )
}