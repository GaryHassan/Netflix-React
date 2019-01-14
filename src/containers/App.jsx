import React, { Component } from "react";
import SearchBar from "../components/SearchBar";
import Video from "../components/Video";
import VideoList from "./VideoList";
import axios from "axios";
import VideoDetail from "../components/VideoDetail";

const API_END_POINT = "https://api.themoviedb.org/3/";
const POPULAR_MOVIES_URL =
  "discover/movie?language=fr&sort_by=popularity.desc&include_adult=false&append_to_response=images";
const API_KEY = "api_key=2dc6452dd5cc6c17a58c21ac8c4a2cc0";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { movieList: {}, currentMovie: {} };
  }

  componentDidMount() {
    this.initMovies();
  }
  initMovies() {
    axios.get(`${API_END_POINT}${POPULAR_MOVIES_URL}&${API_KEY}`).then(
      function(response) {
        this.setState(
          {
            //Affiche les films les plus populaires (du 2è au 5è)
            movieList: response.data.results.slice(1, 6),
            //Affiche le film le plus populaire
            currentMovie: response.data.results[0]
          },
          function() {
            this.applyVideoToCurrentMovie();
          }
        );
      }.bind(this)
    );
  }

  applyVideoToCurrentMovie() {
    axios
      .get(
        `${API_END_POINT}movie/${
          this.state.currentMovie.id
        }?${API_KEY}&append_to_response=videos&include_adult=false`
      )
      .then(
        function(response) {
          const youtubeKey = response.data.videos.results[0].key;
          let newCurrentMovieState = this.state.currentMovie;
          newCurrentMovieState.videoId = youtubeKey;
          this.setState({ currentMovie: newCurrentMovieState });
        }.bind(this)
      );
  }

  receiveCallBack = movie => {
    this.setState({ currentMovie: movie }, function() {
      this.applyVideoToCurrentMovie();
    });
  };

  render() {
    const renderVideoList = () => {
      if (this.state.movieList.length >= 5) {
        return (
          <VideoList
            movieList={this.state.movieList}
            callback={this.receiveCallBack}
          />
        );
      }
    };
    return (
      <div>
        <div className="search_bar">
          <SearchBar />
        </div>

        <div className="row">
          <div className="col-md-8">
            <Video videoId={this.state.currentMovie.videoId} />
            <br />
            <VideoDetail
              //Affiche le titre du film
              title={this.state.currentMovie.title}
              //Affiche la description du film
              description={this.state.currentMovie.overview}
            />
          </div>

          <div className="col-md-4">{renderVideoList()}</div>
        </div>
      </div>
    );
  }
}

export default App;
