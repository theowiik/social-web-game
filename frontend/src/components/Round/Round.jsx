import React from 'react';
import { useGame } from 'contexts/game';
import {
  PresentAnswers,
  PresentWord,
  PresentScore,
  PresentCorrectAnswer,
} from 'components';
import { UserTile } from 'components/UserTile/UserTile';
import { states, colors } from 'lib/constants';

/**
 * The template for all the round views, changes depending on state. Includes a list of players in the game
 * to the left of the page for every round page.
 * @returns {JSX.Element}
 * @constructor
 */
export const Round = () => {
  const { players, globalGameState } = useGame();

  return (
    <div className="grid grid-cols-5 gap-2 ">
      <div className="hidden md:inline col-span-5 md:col-span-1 h-full pl-5 pt-20">
        {/** Display players to the left */}
        <h2 className="text-gray-300 font-bold ml-2">Players:</h2>
        {players.map((player, index) => {
          return (
            <div key={`player-${index}`}>
              <UserTile
                {...player}
                color={colors[index % colors.length]}
                isCurrentUser={
                  player.name === localStorage.getItem('playerName')
                }
              />
            </div>
          );
        })}
      </div>

      <div className="col-span-5 md:col-span-4 p-5 md:p-20 w-full h-full flex flex-col justify-center items-center md:justify-start md:items-start">
        {/** Display corresponding view for current state */}
        {globalGameState === states.PRESENT_WORD_INPUT_EXPLANATION && (
          <PresentWord />
        )}
        {globalGameState === states.SELECT_EXPLANATION && <PresentAnswers />}
        {globalGameState === states.PRESENT_ANSWER && <PresentCorrectAnswer />}
        {globalGameState === states.PRESENT_SCORE && <PresentScore />}
      </div>
    </div>
  );
};
