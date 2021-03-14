import axios from 'axios';
import { Button, Timer } from 'components';
import { useGame } from 'contexts/game';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

export const PresentWord = () => {
  const [hasPosted, setHasPosted] = useState(false);
  const { currentWord, pin, currentStateEndTime } = useGame();
const [disabledButton, setDisabledButton] = useState(true)

  const postExplanation = (explanation) => {
    const form = new FormData();
    form.append('explanation', explanation);

    axios
      .post(`/games/${pin}/add_explanation`, form)
      .then((res) => {
        console.log(res);
        toast('Submitted explanation 😎');
        setHasPosted(true);
      })
      .catch((err) => {
        console.log('yoooo');
        toast.error('Failed submitting answer 😩');
        console.log(err);
      });
  };

  const handleExplanationSubmit = (event) => {
    event.preventDefault();
    const explanation = event.target.explanation.value;
    postExplanation(explanation);
  };

  const handleChangedExplanation = (event) => {
    if(event.target.value !== '') {
      setDisabledButton(false)
    } else {
      setDisabledButton(true)
    }
  }

  return (
    <div className="w-full">
      {/* WORD */}
      <div className=" w-full px-5 sm:px-20">
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold text-center justify-center mb-10 ">
          {currentWord}
        </h1>{' '}
        <Timer start={new Date().getTime()} end={currentStateEndTime} />
        {!hasPosted ? (
          <form
            onSubmit={handleExplanationSubmit}
            className="flex flex-col w-full"
          >
            <textarea
              name="explanation"
              className="p-5 rounded-lg text-white bg-gray-600  border-none h-72 my-10"
              placeholder="Write your explanation.."
              onChange={handleChangedExplanation}
              
            ></textarea>

            <Button primary={!disabledButton} disabled={disabledButton} label="Submit" />
          </form>
        ) : (
          <div className="w-full p-10 rounded-lg bg-gray-600 text-center text-bold">
            Your explanation is submitted
          </div>
        )}
      </div>
    </div>
  );
};
