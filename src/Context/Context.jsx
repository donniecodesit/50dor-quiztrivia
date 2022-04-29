import { useState, createContext, useContext } from "react";
import axios from "axios";

const table = {
    "video games": 15,
    "board games": 16,
    sports: 21,
    history: 23,
    politics: 24,
    art: 25,
    animals: 27,
    vehicles: 28
}

const AppContext = createContext();
const AppProvider = ({ children }) => {
    //Cases: Waiting, Loading, Questions, Index, Correct, Error
    const [waiting, setWaiting] = useState(true);
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [index, setIndex] = useState(0);
    const [correct, setCorrect] = useState(0);
    const [error, setError] = useState(false);
    const [modal, setModal] = useState(false);
    const [quiz, setQuiz] = useState({
        amount: 10,
        category: "video games",
        difficulty: "easy"
    });
    
    // Fetch questions from OpenTDB
    const fetchQuestions = async(URL) => {
        setLoading(true);
        setWaiting(false);

        const response = await axios(URL).catch((err) => console.log(err));
        if (response) {
            const data = response.data.results;
            if (data.length) {
                setQuestions(data);
                setLoading(false);
                setWaiting(false);
                setError(false);
            } else {
                setWaiting(true);
                setLoading(true);
            }
        } else setWaiting(true);
    }

    const openModal = () => {
        setModal(true);
    }

    const closeModal = () => {
        setModal(false);
        setWaiting(true);
        setCorrect(0);
    }

    const nextQuestion = () => {
        setIndex((oldIndex) => {
            const index = oldIndex + 1;
            if (index > questions.length - 1) {
                openModal();
                return 0;
            } else {
                return index;
            }
        })
    }

    const checkAnswers = (value) => {
        if (value) setCorrect((oldState) => oldState + 1);
        nextQuestion();
    }

    const handleChange = ({target}) => {
        setQuiz({ ...quiz, [target.name]: target.value })
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const { amount, category, difficulty } = quiz;
        const URL = `https://opentdb.com/api.php?amount=${amount}&difficulty=${difficulty}&category=${table[category]}&type=multiple`
        fetchQuestions(URL);
    }


    return (
        <AppContext.Provider value={{ waiting, loading, questions, index, correct, error, modal, nextQuestion, checkAnswers, closeModal, quiz, handleChange, handleSubmit}}>
            {children}
        </AppContext.Provider>
    )
}

export const useGlobalContext = () => {
    return useContext(AppContext);
}

export { AppContext, AppProvider }