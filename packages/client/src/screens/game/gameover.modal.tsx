import { RouteNames } from '@reaxion/common/enums';
import classNames from 'classnames';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../routes';
import { useStoreActions, useStoreState } from '../../store';

interface Props {
  isOpen: boolean;
  close?: () => void;
}
export const GameoverModal = ({ isOpen, close }: Props) => {
  const game = useStoreState((state) => state.game);
  const _game = useStoreActions((actions) => actions.game);
  const score = game.currentScore;

  const [name, setName] = useState('');
  const [formHasError, setFormHasError] = useState(false);
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    if (value.length === 3 && formHasError) setFormHasError(false);
    if (value.length > 3) return;
    setName(value);
  };

  function handleSubmit() {
    if (name.length !== 3) {
      setFormHasError(true);
      return;
    }
    _game.setCurrentName(name);
    navigate(routes[RouteNames.RECENT_STATS_PAGE].path);
  }
  const navigate = useNavigate();
  return (
    <div>
      <input
        type="checkbox"
        id="my-gameover-modal"
        className="modal-toggle"
        checked={isOpen}
        readOnly
      />
      <div className="modal modal-bottom sm:modal-middle" onClick={close}>
        <div className="modal-box" onClick={(e) => e.stopPropagation()}>
          <h3 className="font-bold text-lg">Game Over!</h3>
          <p className="py-4">
            You're score is: {score}. Well done. To save your score, enter your
            name below.
          </p>
          <div className="modal-action ">
            <div className="form-control w-full">
              <form
                className="form-control"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
              >
                <label className="label">
                  <span
                    className={classNames({
                      'label-text': true,
                      'text-error': formHasError,
                    })}
                  >
                    {!formHasError
                      ? 'Enter name:'
                      : 'Name must have 3 characters!'}
                  </span>
                </label>
                <label className="input-group">
                  <input
                    type="text"
                    placeholder="XYZ"
                    className={classNames({
                      'input input-bordered w-full uppercase': true,
                      'input-error': formHasError,
                    })}
                    onChange={onChange}
                    value={name}
                  />
                  <button className="btn" onClick={handleSubmit}>
                    Submit
                  </button>
                </label>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
