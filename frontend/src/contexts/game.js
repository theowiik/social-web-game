import React, { useMemo } from "react";
const GameContext = React.createContext();

const gameStates = {
  OPEN_LOBBY: "OPEN_LOBBY",
  START_GAME: "START_GAME",
  END_GAME: "END_GAME",
};

const roundStates = {
  PRESENT_WORD_INPUT_EXPLANATION: "PRESENT_WORD_INPUT_EXPLANATION",
  SELECT_EXPLANATION: "SELECT_EXPLANATION",
  PRESENT_ANSWER: "PRESENT_ANSWER",
  PRESENT_SCORE: "PRESENT_SCORE",
};

const actions = {
  SET_GLOBAL_STATE: "SET_GLOBAL_STATE",
  SET_PIN: "SET_PIN",
  SET_PLAYERS: "SET_PLAYERS"
}

const initialGameState = {
  globalGameState: gameStates.OPEN_LOBBY,
  pin: '12345',
  players: [],
};

const initialRoundState = {
  globalRoundState: roundStates.PRESENT_WORD_INPUT_EXPLANATION,
};

function gameReducer(state, action) {
  switch (action.type) {
    case actions.SET_GLOBAL_STATE: {
      return {
        ...state,
        globalGameState: action.state,
      };
    }
    case actions.SET_PIN: {
      return {
        ...state,
        pin: action.pin,
      };
    }
    case actions.SET_PLAYERS: {
      return {
        ...state,
        players: action.players,
      };
    }
    default: {
      return {
        ...state,
      };
    }
  }
}

function roundReducer(state, action) {
  switch (action.type) {
    case actions.SET_GLOBAL_STATE: {
      return {
        ...state,
        globalGameState: action.state,
      };
    }
    default: {
      return {
        ...state,
      };
    }
  }
}

export const GameProvider = (props) => {
  const [gameState, dispatch] = React.useReducer(gameReducer, initialGameState);
  const [roundState, roundDispatch] = React.useReducer(
    roundReducer,
    initialRoundState
  );

  const setGlobalGameState = (state) => {
    dispatch({ type: actions.SET_GLOBAL_STATE, state: state });
  };
  const setPin = (pin) => dispatch({type: actions.SET_PIN, pin: pin})
  const setPlayers = (players) =>
    dispatch({ type: actions.SET_PLAYERS, players: players });
  const setGlobalRoundState = (state) => {
    roundDispatch({ type: actions.SET_GLOBAL_STATE, state: state });
  };

  const value = useMemo(
    () => ({
      ...gameState,
      ...roundState,
      setGlobalGameState,
      setPin,
      setPlayers,
      setGlobalRoundState,
    }),
    [gameState, roundState]
  );

  return <GameContext.Provider value={value} {...props} />;
};

export const useGame = () => {
  const context = React.useContext(GameContext);
  if (context === undefined) {
    throw new Error(`useGame must be used within a GameProvider`);
  }
  return context;
};

export const ManagedGameContext = ({ children }) => (
  <GameProvider>{children}</GameProvider>
);
