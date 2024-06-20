import React, { useReducer, useEffect } from 'react';
import './App.scss';

interface Joke {
  id: number;
  joke: string;
  rate: number;
}

type State = Joke[];

type Action = 
  | { type: 'ADD_JOKE'; joke: string }
  | { type: 'UPDATE_RATE'; id: number; rate: number }
  | { type: 'SET_JOKES'; jokes: Joke[] };

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
      const updatedState = [...state, newJoke];
      localStorage.setItem('jokes', JSON.stringify(updatedState));
      return updatedState;
    case 'UPDATE_RATE':
      const stateWithUpdatedRate = state.map(joke => 
        joke.id === action.id ? { ...joke, rate: action.rate } : joke
      );
      localStorage.setItem('jokes', JSON.stringify(stateWithUpdatedRate));
      return stateWithUpdatedRate;
    case 'SET_JOKES':
      return action.jokes;
    default:
      return state;
  }
};

const App: React.FC = () => {
  const [jokes, dispatch] = useReducer(reducer, initialState);

  // Load jokes from localStorage on mount
  useEffect(() => {
    const storedJokes = localStorage.getItem('jokes');
    if (storedJokes) {
      dispatch({ type: 'SET_JOKES', jokes: JSON.parse(storedJokes) });
    }
  }, []);

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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
