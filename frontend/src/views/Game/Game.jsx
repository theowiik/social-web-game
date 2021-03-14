import axios from 'axios';
import { Button, GameLayout, Lobby, Round, Summary } from 'components';
import { useGame } from 'contexts/game';
import { states } from 'lib/constants';
import { getRandomName } from 'lib/names';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { gameExists } from 'services/database-service';
import { websocketBaseUrl } from 'services/urlConstants';
import { createStompClient } from 'services/websocketService';

{
  /** Temp to trigger statechanges */
}
var selectedIndex = 0;
const tempGameStatesList = [
  'LOBBY',
  'PRESENT_WORD_INPUT_EXPLANATION',
  'SELECT_EXPLANATION',
  'PRESENT_ANSWER',
  'PRESENT_SCORE',
  'END'
];

export const Game = () => {
  const params = useParams();
  const pin = params.pin;
  const websocketEndpointUrl = `${websocketBaseUrl}/chat`;
  const subscribeToEndpoint = `/topic/messages/${pin}`;

  const joinGame = () => {
    const form = new FormData();
    form.append('name', getRandomName());
    axios
      .post(`/games/${pin}/join`, form)
      .then((res) => {
        console.log(res);
        localStorage.setItem('playerName', form.get('name'));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const connectedCallback = () => {
    joinGame();
  };

  const messageCallback = (message) => {
    let game;
    try {
      game = JSON.parse(message.body);
      console.log('Recieved: ', game);
      setCurrentStateEndTime(game.currentStateEndTime);
      setPlayers(game.players);
      setCurrentWord(game.word);
      setSelectedExplanations(game.selectedExplanations);
      setExplanations(game.explanations);
      setGlobalGameState(game.state);
    } catch (error) {
      console.log(error);
    }
  };

  const memoizedMessageCallback = useCallback(messageCallback, []);
  const memoizedConnectedCallback = useCallback(connectedCallback, []);

  const stompClient = useMemo(() => {
    createStompClient(
      websocketEndpointUrl,
      subscribeToEndpoint,
      memoizedMessageCallback,
      memoizedConnectedCallback
    );
  }, [
    websocketEndpointUrl,
    subscribeToEndpoint,
    memoizedMessageCallback,
    memoizedConnectedCallback
  ]);

  const [gameFound, setGameFound] = useState(false);
  const history = useHistory();

  const {
    globalGameState,
    setGlobalGameState,
    setPlayers,
    setCurrentStateEndTime,
    setCurrentWord,
    setSelectedExplanations,
    setExplanations,
    setPin
  } = useGame();

  const checkIfGameExists = async () => {
    if (await gameExists(pin)) {
      setGameFound(true);
      setPin(pin);
    } else {
      history.push('/');
    }
  };

  useEffect(() => {
    checkIfGameExists();

    //TODO: make sure to give the context the right state from websocket on reload
  }, []);

  return (
    <GameLayout>
      {(() => {
        if (globalGameState === states.LOBBY) {
          return <Lobby />;
        } else if (globalGameState === states.END) {
          return <Summary />;
        } else {
          return <Round />;
        }
      })()}

      <p className='cursor-pointer text-gray-500 ml-8' onClick={() =>
        setGlobalGameState(
          tempGameStatesList[selectedIndex++ % tempGameStatesList.length]
        )
      }>
        (Dev) Byt state
      </p>
    </GameLayout>
  );
};
