export const getIsSpyMaster = () =>
  window && window.location.pathname.includes('spymaster');

export const getGameId = () => {
  console.log(`window.location.query:`, window.location.search);
  const params = new URLSearchParams(window.location.search);
  const game = params.get('game');
  console.log(`params, game:`, params, game);
  return game;
};
