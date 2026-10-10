import { useState } from "react";

function useSlideDirection(index, total) {
  const [state, setState] = useState({ prev: index, direction: 1 });

  if (state.prev !== index) {
    const diff = index - state.prev;
    let direction = diff > 0 ? 1 : -1;

    // Saltos circulares: último → primero = adelante, primero → último = atrás
    if (diff === -(total - 1)) direction = 1;
    if (diff === total - 1) direction = -1;

    setState({ prev: index, direction });
    return direction;
  }

  return state.direction;
}

export { useSlideDirection };
