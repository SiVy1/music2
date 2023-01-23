import React from "react";
import Player from "../shared/player";
import { useRef, useState, useEffect } from "react";
import songsdata from "../shared/audios.json";
import Loader from "../shared/loader";
import axios from "axios";

export default function HomePage() {
  //!Interfaces
  interface Playlist {
    _id: number;
    name: string;
    music: [
      {
        title: string;
        src: string;
      }
    ];
    id: number;
  }

  //!States
  const [isplaying, setisplaying] = useState(false);
  const [currentSong, setCurrentSong] = useState<any>([]);
  const [audioList, setAudioList]: any = useState([]);
  const audioElem: any = useRef<any>();
  const [songId, setSongId] = useState(0);
  const [isLoading, setIsLoading]: any = useState(true);
  const [playlistData, setPlaylistData]: any = useState([]);
  //!musicThings
  useEffect(() => {
    if (isplaying) {
      audioElem.current.play();
    } else {
      audioElem.current.pause();
    }
  }, [isplaying]);

  const onPlaying = () => {
    const duration = audioElem.current?.duration;
    const ct = audioElem.current?.currentTime;
    setCurrentSong({
      ...currentSong,
      progress: (ct / duration) * 100,
      length: duration,
    });
  };

  const currentIndex = audioList.findIndex((object: any) => {
    return object.id == currentSong.id;
  });

  const addMusicToQueue = (name: string, path: string) => {
    setAudioList((prev: any) => [
      ...prev,
      { title: name, url: path, id: songId },
    ]);
    setSongId(songId + 1);
  };

  const playPlaylistFromDB = async (id: number) => {
    let data = await axios.get(`/api/playlist/${id}`);

    axios
      .get("/api/music", { params: data.data[0].music })
      .then((data: any) => {
        data.data.forEach((song: any, index: number) => {
          if (song.cover == null) {
            song.cover = "/music-placeholder.png";
          }
          setAudioList((prev: any) => [
            ...prev,
            {
              title: song.title,
              artist: song.artist,
              url: song.src,
              cover: song.cover,
              duration: song.duration,
              id: songId + index + 1,
            },
          ]);
        });
      });
    setSongId(songId + songsdata.music.length + 1);
  };

  //!otherUtils
  useEffect(() => {
    const fetchData: any = async () => {
      const data: any = await axios.get("/api/test");
      await setPlaylistData(data.data);

      setIsLoading(false);
    };
    fetchData();
    if (localStorage.getItem("musicQueue") !== null) {
      const musicQueue = localStorage.getItem("musicQueue") as string;
      const musicObj = JSON.parse(musicQueue);
      setAudioList(musicObj);
      setSongId(musicObj[musicObj.length - 1].id + 1);
    }
  }, []);
  useEffect(() => {
    if (audioList.length !== 0)
      localStorage.setItem("musicQueue", JSON.stringify(audioList));
  }, [audioList]);
  return (
    <div className="App">
      {isLoading ? <Loader /> : null}

      <button onClick={() => addMusicToQueue("1", "/music/1.mp3")}>
        Add to queue
      </button>
      <button onClick={() => addMusicToQueue("2", "/music/2.mp3")}>
        Add to queue2
      </button>
      <button onClick={() => addMusicToQueue("3", "/music/2.mp3")}>
        Add to queue2
      </button>
      <button onClick={() => addMusicToQueue("4", "/music/2.mp3")}>
        Add to queue2
      </button>
      <button onClick={() => playPlaylistFromDB(1)}>Play playlist</button>
      {playlistData?.map((item: Playlist) => {
        return (
          <div
            key={item._id}
            // onClick={() => window.location.replace(`/playlist/${item._id}`)}
          >
            <h2>{item._id}</h2>

            <button onClick={() => playPlaylistFromDB(item._id)}>
              Add playlist
            </button>
          </div>
        );
      })}

      <audio src={currentSong.url} ref={audioElem} onTimeUpdate={onPlaying} />
      <Player
        audioList={audioList}
        setAudioList={setAudioList}
        isplaying={isplaying}
        setisplaying={setisplaying}
        audioElem={audioElem}
        currentSong={currentSong}
        setCurrentSong={setCurrentSong}
      />
    </div>
  );
}
