import React from "react";
import { Store} from "./Store";
import {IAction, IEpisode} from './interfaces';

export default function App(): JSX.Element {
  const { state, dispatch } = React.useContext(Store);

  React.useEffect(() => {
    state.episodes.length === 0 && fetchDataAction();
  });

  const fetchDataAction = async () => {
    const URL =
      "https://api.tvmaze.com/singlesearch/shows?q=rick-&-morty&embed=episodes";
    const data = await fetch(URL);
    const dataJSON = await data.json();
    return dispatch({
      type: "FETCH_DATA",
      payload: dataJSON._embedded.episodes,
    });
  };

  const toggleFavAction= (episode: IEpisode): IAction => {
    const episodesInFav = state.favorites.includes(episode)
    let dispatchObject = {
      type: 'ADD_FAV',
      payload: episode
    }
    if(episodesInFav) {
      const favWithoutEpisode = state.favorites.filter((fav: IEpisode)=> fav.id !== episode.id)
      dispatchObject = {
      type: 'REMOVE_FAV',
      payload: favWithoutEpisode
    }
  }

    return dispatch(dispatchObject)
}

  {console.log(state)}
  return (
    <React.Fragment>
      <header className='header'>
        <div>
          <h1>Rick and Morty</h1>
          <p> Pick your favorite episode!</p>
        </div>
        <div>
          Favorite(s): {state.favorites.length}
        </div>
      </header>
      <section className='episode-layout'>
        {state.episodes.map((episode: IEpisode) => {
          return (
            <section key={episode.id} className='episode-box'>
              <img src={episode.image && episode.image.medium} alt={`Rick and Morty ${episode.name}`}/>
              <div>{episode.name}</div>
              <section>
                <div>
                Season: {episode.season} Number: {episode.number}</div>
                <button type="button" onClick={()=> toggleFavAction(episode)}>
                  {state.favorites.find((fav : IEpisode) => fav.id === episode.id) ? 'Unfav' : 'Fav'}
                </button>
              </section>
            </section>
          );
        })}
      </section>
    </React.Fragment>
  );
}
