import React, { useEffect, useState } from 'react';
import { AiOutlinePlusCircle, AiOutlineEdit, AiOutlineSave, AiOutlineDelete } from 'react-icons/ai';
import api from "../../utils/api";

const Quotes = () => {
    const [quotes, setQuotes] = useState([]);
    const [newQuote, setNewQuote] = useState('');
    const [editedQuote, setEditedQuote] = useState(''); // Track the edited quote text
    const [quotesLoading, setQuotesLoading] = useState(true);

    useEffect(() => {
        const fetchQuotes = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));

                if (!user || !user.authToken) {
                    // Handle missing authToken (e.g., redirect or set an error state)
                    return;
                }

                const authTokenUser = user.authToken;

                const response = await api.get('/quotes/random', {
                    headers: { Authorization: `Bearer ${authTokenUser}` },
                });

                setQuotes([response.data.data.quote]);
            } catch (error) {
                console.error('Error fetching quotes:', error);
            } finally {
                setQuotesLoading(false);
            }
        };

        fetchQuotes();
    }, []);

    const handleEdit = (index) => {
        const updatedQuotes = [...quotes];
        updatedQuotes[index].isEditing = true;
        setEditedQuote(updatedQuotes[index].quote); // Set the editedQuote to the current quote
        setQuotes(updatedQuotes);
    };

    const handleSave = (index) => {
        const updatedQuotes = [...quotes];
        updatedQuotes[index].quote = editedQuote; // Update with the editedQuote
        updatedQuotes[index].isEditing = false;
        setQuotes(updatedQuotes);
    };

    const handleDelete = (index) => {
        const updatedQuotes = [...quotes];
        updatedQuotes.splice(index, 1);
        setQuotes(updatedQuotes);
    };

    const handleAdd = () => {
        if (newQuote.trim() !== '') {
            setQuotes([...quotes, { quote: newQuote, isEditing: false }]);
            setNewQuote('');
        }
    };

    return (
        <div className="flex flex-col gap-4 px-8 py-4 border rounded-lg bg-purple-100">
            <div className="title text-lg text-purple-900 font-extrabold">Quotes</div>
            <div className='max-h-[10vh] overflow-auto'>
            {quotes.map((item, index) => (
                <div key={index} className="flex gap-2 items-center">
                    {item.isEditing ? (
                        <input
                            type="text"
                            value={editedQuote} // Use editedQuote for editing
                            onChange={(e) => setEditedQuote(e.target.value)}
                            className="w-full bg-white border rounded-lg px-2 py-1"
                        />
                    ) : (
                        <div className="text-sm md:text-md lg:text-lg xl:text-xl text-purple-900 italic font-bold">
                            "{item.quote}"
                        </div>
                    )}
                    {item.isEditing ? (
                        <button
                            className="border rounded-3xl flex justify-center items-center gap-2 bg-green-100 p-2"
                            onClick={() => handleSave(index)}
                        >
                            <AiOutlineSave />
                        </button>
                    ) : (
                        <button
                            className="border rounded-3xl flex justify-center items-center gap-2 bg-yellow-100 p-2"
                            onClick={() => handleEdit(index)}
                        >
                            <AiOutlineEdit />
                        </button>
                    )}
                    <button
                        className="border rounded-3xl flex justify-center items-center gap-2 bg-red-100 p-2"
                        onClick={() => handleDelete(index)}
                    >
                        <AiOutlineDelete />
                    </button>
                </div>
            ))}
            </div>
            <div className="flex gap-2 items-center">
                <input
                    type="text"
                    value={newQuote}
                    onChange={(e) => setNewQuote(e.target.value)}
                    className="w-full bg-white border rounded-lg px-2 py-1"
                    placeholder="Add a new quote"
                />
                <button
                    className="border rounded-3xl flex justify-center items-center gap-2 bg-blue-100 p-2"
                    onClick={handleAdd}
                >
                    <AiOutlinePlusCircle />
                </button>
            </div>
        </div>
    );
};

export default Quotes;
