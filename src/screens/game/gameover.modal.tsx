import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RouteNames } from "../../interfaces/route.interface";
import { routes } from "../../routes";
import { useStoreActions, useStoreState } from "../../store";

interface Props {
  isOpen: boolean;
  close?: () => void;
}
export const GameoverModal = ({ isOpen, close }: Props) => {
  const game = useStoreState((state) => state.game);
  const _game = useStoreActions((actions) => actions.game);
  const score = game.score;

  const [name, setName] = useState("");
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    if (value.length > 3) return;
    setName(value);
  };

  function saveGame() {}
  const navigate = useNavigate();
  return (
    <div>
      <input
        type="checkbox"
        id="my-gameover-modal"
        className="modal-toggle"
        checked={isOpen}
      />
      <div className="modal modal-bottom sm:modal-middle" onClick={close}>
        <div className="modal-box" onClick={(e) => e.stopPropagation()}>
          <h3 className="font-bold text-lg">Game Over!</h3>
          <p className="py-4">
            You're score is: {score}. Well done. To save your score, enter your
            name below.
          </p>
          <div className="modal-action">
            <div className="form-control w-full">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Enter name:</span>
                </label>
                <label className="input-group">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      navigate(routes[RouteNames.GAME_OVER_PAGE].path);
                    }}
                  ></form>
                  <input
                    type="text"
                    placeholder="XYZ"
                    className="input input-bordered w-full uppercase"
                    onChange={onChange}
                    value={name}
                  />
                  <button
                    className="btn"
                    onClick={() => {
                      navigate(routes[RouteNames.GAME_OVER_PAGE].path);
                    }}
                  >
                    Submit
                  </button>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
