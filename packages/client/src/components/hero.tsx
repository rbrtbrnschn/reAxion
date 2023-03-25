import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RouteNames, routes } from '../routes';

interface Props extends React.HTMLAttributes<HTMLDivElement> {}
export const Hero = ({ ...props }: Props) => {
  const navigate = useNavigate();
  return (
    <div
      className="hero min-h-screen bg-primary text-primary-content"
      {...props}
    >
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold">Know your milliseconds</h1>
          <p className="py-6">
            "Ready, set, go! Fiery orange to calming green, can you guess the
            time? Just wait for the countdown, watch the colors change, and make
            your best guess!" ~ ChatGpt
          </p>

          <button
            className="btn btn-outline btn-primary bg-base-100"
            onClick={() => {
              navigate(routes[RouteNames.GAME_PAGE].path);
            }}
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};
