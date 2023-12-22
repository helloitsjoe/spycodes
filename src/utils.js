export const getIsSpyMaster = () =>
  window && window.location.pathname.includes('spymaster');

export const getGameId = () => {
  console.log(`window.location:`, window.location);
  console.log(`window.location.search:`, window.location.search);
  const params = new URLSearchParams(window.location.search);
  const game = params.get('game');
  console.log(`params, game:`, params, game);
  return game;
};

export const generateGameId = () => {
  const getCap = () =>
    String.fromCharCode(Math.floor(Math.random() * (90 - 65) + 65));
  return `${getCap()}${getCap()}${getCap()}${getCap()}`;
};
