import React, { useReducer, useEffect, useState } from 'react';
import './App.scss';
import useLocalStorage from './components/useLocalStorage';

interface Joke {
  id: number;
  joke: string;
  rate: number;
}

type State = Joke[];

type Action = 
  | { type: 'ADD_JOKE'; joke: string }
  | { type: 'UPDATE_RATE'; id: number; rate: number }
  | { type: 'SET_JOKES'; jokes: Joke[] }
  | { type: 'DELETE_JOKE'; id: number }
  | { type: 'UPDATE_JOKE'; id: number; joke: string };

const initialState: State = [
  { id: 1, joke: 'What do you call a very small valentine? A valen-tiny!', rate: 3 },
  { id: 2, joke: 'What did the dog say when he rubbed his tail on the sandpaper? Rough, rough!', rate: 2 },
  { id: 3, joke: 'A termite walks into the bar and says, "Where is the bartender?"', rate: 1 },
  { id: 4, joke: 'Why did the scarecrow win an award? Because he was outstanding in his field!', rate: 0 },
  { id: 5, joke: 'Why was the math book sad? Because it had too many problems.', rate: 0 }
];

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_JOKE':
      const newJoke: Joke = { id: state.length + 1, joke: action.joke, rate: 0 };
      return [...state, newJoke];
    case 'UPDATE_RATE':
      return state.map(joke => 
        joke.id === action.id ? { ...joke, rate: action.rate } : joke
      );
    case 'SET_JOKES':
      return action.jokes;
    case 'DELETE_JOKE':
      return state.filter(joke => joke.id !== action.id);
    case 'UPDATE_JOKE':
      return state.map(joke => 
        joke.id === action.id ? { ...joke, joke: action.joke } : joke
      );
    default:
      return state;
  }
};

const App: React.FC = () => {
  const [storedJokes, setStoredJokes] = useLocalStorage<Joke[]>('jokes', initialState);
  const [jokes, dispatch] = useReducer(reducer, storedJokes);
  const [editId, setEditId] = useState<number | null>(null);
  const [editText, setEditText] = useState<string>('');

  useEffect(() => {
    setStoredJokes(jokes);
  }, [jokes, setStoredJokes]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements[0] as HTMLInputElement;
    const joke = input.value;
    if (joke) {
      dispatch({ type: 'ADD_JOKE', joke });
      input.value = '';
    }
  };

  const updateRate = (id: number, rate: number) => {
    dispatch({ type: 'UPDATE_RATE', id, rate });
  };

  const deleteJoke = (id: number) => {
    dispatch({ type: 'DELETE_JOKE', id });
  };

  const editJoke = (id: number, joke: string) => {
    setEditId(id);
    setEditText(joke);
  };

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (editId !== null && editText.trim() !== '') {
      dispatch({ type: 'UPDATE_JOKE', id: editId, joke: editText });
      setEditId(null);
      setEditText('');
    }
  };

  return (
    <div className="container">
      <h2>Sample jokes</h2>
      <form className="form" onSubmit={handleSubmit}>
        <input type="text" placeholder="Add a joke" />
        <button type="submit">Add Joke</button>
      </form>
      <div className="jokes">
        {jokes.sort((a, b) => b.rate - a.rate).map(joke => (
          <div key={joke.id} className="joke">
            <div className="joke-text">{joke.joke}</div>
            <div className="text">{joke.rate}</div>
            <div className="joke-buttons">
              <button onClick={() => updateRate(joke.id, joke.rate + 1)}>⬆</button>
              <button onClick={() => updateRate(joke.id, joke.rate - 1)}>⬇</button>
              <button onClick={() => deleteJoke(joke.id)}>Delete</button>
              <button onClick={() => editJoke(joke.id, joke.joke)}>Edit</button>
            </div>
            {editId === joke.id && (
              <form className="form" onSubmit={handleEditSubmit}>
                <input 
                  type="text" 
                  value={editText} 
                  onChange={(e) => setEditText(e.target.value)} 
                  placeholder="Edit joke" 
                />
                <button type="submit">Update Joke</button>
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
