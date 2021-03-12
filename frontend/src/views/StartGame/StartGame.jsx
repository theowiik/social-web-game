import Axios from 'axios';
import { Navbar, Container } from 'components';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from 'components/Button/Button';

export function StartGame() {
  const [categories, setCategories] = useState([]);
  const history = useHistory();

  const fetchCategories = () =>
    Axios.get('/categories')
      .then((res) => {
        if (Array.isArray(res.data)) setCategories(res.data);
      })
      .catch((err) => {
        console.log('Failed to fetch categories');
        console.log(err);
      });

  const handleStartGame = (event) => {
    event.preventDefault();
    const chosenCategory = event.target.category.value;
    console.log(chosenCategory);

    const form = new FormData();
    form.append('category', chosenCategory) 
    //Post start game with new pin
    Axios.post(`/games/`, form)
      .then((res) => {
        console.log('Created a new game with category ' + chosenCategory);
        console.log(res);
        //Redirect to lobby
        history.push(`/game/${res.data.pin}`);
      })
      .catch((err) => {
        console.log('Failed to create game');
        console.log(err);
      });

  
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="w-full min-h-screen  text-white bg-gray-800 justify-center">
      <Navbar label="Game Settings" onBackClickPath="/" />

      <Container>
        <form
          onSubmit={handleStartGame}
          className="flex flex-col justify-center items-center"
        >
          <div className="bg-gray-700 rounded-xl w-96 p-10 mt-20">
            <h2 className="text-2xl font-bold">Select category</h2>
            <ul className="mt-5">
              {categories.map((category) => (
                <>
                  <input
                    id="category"
                    name="category"
                    type="radio"
                    value={category.name}
                  />
                  <label className="ml-2">{category.name}</label>
                  <br></br>
                </>
              ))}
            </ul>
          </div>
          <div className="mt-14">
            <Button primary label="Start game" type="submit" />
          </div>
        </form>
      </Container>
    </div>
  );
}
