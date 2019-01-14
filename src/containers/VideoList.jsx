import React from "react";
import VideoListItem from "../components/VideoListItem";

const VideoList = ({ movieList, callback}) => {
  return (
    <div>
      <ul>
        {movieList.map(movie => {
          return (
            <VideoListItem
              key={movie.id}
              movie={movie}
              callback={callback}
            />
          );
        })}
      </ul>
    </div>
  );
  /* function receiveCallBack(movie) {
    props.callback(movie);
  } */
};

export default VideoList;
