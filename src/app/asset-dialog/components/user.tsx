import { useState } from 'react';

export function User({ name, picture }: { name: string; picture?: string }) {
  const [hidePicture, setHidePicture] = useState(false);

  return (
    <div className="flex items-center space-x-1">
      {picture && !hidePicture ? (
        <img
          src={picture}
          className="h-24 w-24 rounded-full"
          alt={`${name}'s profile picture`}
          onError={() => setHidePicture(true)}
        />
      ) : null}
      <span>{name}</span>
    </div>
  );
}
