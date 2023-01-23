import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { BsFillShareFill, BsPlusCircleFill, BsShareFill } from "react-icons/bs";
import Player from "../../shared/player";
import { ToastContainer, toast } from "react-toastify";
import Loader from "../../shared/loader";

interface audioList {
  title: string;
  url: string;
  id: number;
}

interface playlistData {
  cover: string;
  music: songDetails[];
  name: string;
  _id: string;
}

interface songDetails {
  _id: string;
  title: string;
  artist: string;
  duration: string;
  src: string;
  cover: string | null;
}
export default function Playlist() {
  const router = useRouter();
  const [isplaying, setisplaying] = useState(false);
  const [currentSong, setCurrentSong] = useState<any>([]);
  const [audioList, setAudioList] = useState<audioList[]>([]);
  const audioElem: any = useRef<any>();
  const [songId, setSongId] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [playlistData, setPlaylistData] = useState<playlistData>();
  const [songsInfo, setSongsInfo] = useState<songDetails[]>([]);
  const { id } = router.query;

  //!musicThings
  useEffect(() => {
    if (isplaying) {
      audioElem.current.play();
    } else {
      audioElem.current.pause();
    }
  }, [isplaying]);
  const findCurrentIndex = audioList.findIndex((object: any) => {
    return object.id == currentSong.id;
  });
  const onPlaying = async () => {
    if (audioElem.current?.duration == audioElem.current?.currentTime) {
      setCurrentSong(audioList[findCurrentIndex + 1]);
      console.log(true);
      setisplaying(false);
      console.log(currentSong);
      setisplaying(true);
    }
    const duration = audioElem.current?.duration;
    const ct = audioElem.current?.currentTime;
    console.log(duration);
    setCurrentSong({
      ...currentSong,
      progress: (ct / duration) * 100,
      length: duration,
    });
  };

  const addMusicToQueue = (song: songDetails) => {
    setAudioList((prev: audioList[]) => [
      ...prev,
      {
        title: song.title,
        artist: song.artist,
        url: song.src,
        cover: song.cover,
        duration: song.duration,
        id: songId,
      },
    ]);
    setSongId(songId + 1);
  };
  const sharePlaylist = () => {
    navigator.clipboard.writeText(
      `Znalazłem ostatnio bardzo fajną playliste z muzyką. Tu masz linka ===> ${location}`
    );
    toast.success("Skopiowano do schowka");
  };

  const playPlaylist = () => {
    songsInfo.forEach((song: any, index: number) => {
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
    setSongId(songId + songsInfo.length + 1);
  };
  //updating state of audiolist
  useEffect(() => {
    if (audioList.length !== 0)
      localStorage.setItem("musicQueue", JSON.stringify(audioList));
  }, [audioList]);
  useEffect(() => {
    //fetching playlist data from API
    const fetchPlaylistData = async () => {
      const data = await axios.get(`/api/playlist/${id}`);
      setPlaylistData(data.data[0]);
    };
    fetchPlaylistData();
    //getting localStorage data and updating audioList state
    if (localStorage.getItem("musicQueue") !== null) {
      const musicQueue = localStorage.getItem("musicQueue") as string;
      const musicObj = JSON.parse(musicQueue);
      setAudioList(musicObj);
      setSongId(musicObj[musicObj.length - 1].id + 1);
    }
  }, [router.isReady]);
  useEffect(() => {
    if (playlistData == null) return;
    axios
      .get("/api/music/", { params: playlistData?.music })
      .then((data: any) => {
        setSongsInfo(data.data);
      });
    setIsLoading(false);
  }, [playlistData]);
  return (
    <div>
      {isLoading ? <Loader /> : null}

      <div className="playlist_container">
        <div className="playlist_hero">
          <Image
            src={playlistData?.cover}
            alt="cover"
            fill
            objectFit="cover"
          ></Image>
          <h1 className="playlist_title">{playlistData?.name}</h1>
          <div className="playlist_buttons">
            <button>
              <BsPlusCircleFill onClick={() => playPlaylist()} />
            </button>
            <button
              onClick={() => {
                sharePlaylist();
              }}
            >
              <BsFillShareFill />
            </button>
          </div>
        </div>
        <table className="table_con">
          <thead className="playlist_table">
            <tr className="playlist_tr">
              <td style={{ width: "1em" }}>#</td>
              <td>Okładka albumu</td>
              <td>Tytul piosenki</td>
              <td>Artysta</td>
              <td>Czas trwania</td>
            </tr>
          </thead>
          {songsInfo?.map((song: songDetails) => {
            if (song.cover == null) {
              song.cover = "/music-placeholder.png";
            }
            return (
              <thead key={song._id} className="playlist_table">
                <tr className="playlist_tr">
                  <td
                    className="table_ico"
                    onClick={() => addMusicToQueue(song)}
                  >
                    <BsPlusCircleFill />
                  </td>
                  <td className="table_image">
                    <Image
                      src={song?.cover}
                      alt="song cover"
                      height={50}
                      width={50}
                    />
                  </td>
                  <td>{song.title}</td>
                  <td>{song.artist}</td>
                  <td>{song.duration}</td>
                </tr>
              </thead>
            );
          })}
        </table>
        <div className="queue_music"></div>
      </div>
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
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}
