import { Button, Input, Logo } from 'components';
import { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { gameExists } from 'services/database-service';


/**
 * The view for the home page
 * @returns {JSX.Element}
 * @constructor
 */
export function Home() {
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const pin = e.target.pin.value;

    if (await gameExists(pin)) {
      history.push(`/game/${pin}`);
    } else {
      toast.error(`No game with pin ${pin}`);
    }

    setLoading(false);
  };


  /**
   * Allows to write game pin and then join game. Also allows you to redirect to start a new game
   */
  return (
    <div className="w-full h-screen bg-gray-800 flex justify-center items-center">
      <div className="flex flex-col items-center">
        <Logo height="139" width="342" />

        <form className="w-full" onSubmit={handleSubmit}>
          <Input
            id="pin"
            name="pin"
            placeholder="Game PIN"
            regex={/^\d{0,5}$/}
          />

          <div className="w-full mt-4">
            <Button label="Join Game" primary large type="submit" />
          </div>
        </form>

        <div className="mt-24">
          <Link to="/game/new">
            <Button label="New Game" secondary></Button>
          </Link>
        </div>
      </div>

      {loading && (
        <div className="w-full h-full absolute top-0 left-0 bg-gray-800 bg-opacity-50 flex justify-center items-center text-white text-4xl font-bold">
          Loading game...
        </div>
      )}
    </div>
  );
}
