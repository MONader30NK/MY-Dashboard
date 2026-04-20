import { useReducer } from 'react';
import './App.css';
const initialState = { count: 0, step: 1 };

function reducer(state, action) {
  switch (action.type) {
    case 'inc':
      return { ...state, count: state.count + state.step };
    case 'dec':
      return { ...state, count: state.count - state.step };
    case 'setStep':
      return { ...state, step: action.payload };
    case 'setCount':
        return{...state,count:action.payload};
    case 'reset':
      return initialState;
    default:
      return state;
  }
}

function CounterProject() {
  // استخدام الـ useReducer بدلاً من useState المتكرر
  const [state, dispatch] = useReducer(reducer, initialState);

  // لسهولة القراءة بنفك الـ state
  const { count, step } = state;

  return (
    <>
      <div>
        <h1>Count: {count}</h1>
        <input
          type="number"
          value={count}
          onChange={(e) => dispatch({ type: 'setCount', payload: Number(e.target.value) })}
        />
        <button className='counter' onClick={() => dispatch({ type: 'inc' })}>Increment</button>
        <button className='counter' onClick={() => dispatch({ type: 'dec' })}>Decrement</button>
        <button className='counter' onClick={() => dispatch({ type: 'reset' })}>Reset All</button>
      </div>

      <hr />

      <div>
        <h2>Step: {step}</h2>
        <input
          type="number"
          value={step}
          onChange={(e) => dispatch({ type: 'setStep', payload: Number(e.target.value) })}
        />
        <button className='counter' onClick={() => dispatch({ type: 'setStep', payload: step + 1 })}>
          Increment Step
        </button>
        <button className='counter' onClick={() => dispatch({ type: 'setStep', payload: step - 1 })}>
          Decrement Step
        </button>
      </div>
    </>
  );
}

export default CounterProject;