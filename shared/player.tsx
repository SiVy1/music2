import React, { useRef, useState, useEffect } from "react";
import {
  BsFillPlayCircleFill,
  BsFillPauseCircleFill,
  BsFillSkipStartCircleFill,
  BsFillSkipEndCircleFill,
  BsFillXCircleFill,
  BsPatchMinusFill,
} from "react-icons/bs";
import Image from "next/image";
import { useDetectClickOutside } from "react-detect-click-outside";

import { BsJustify } from "react-icons/bs";
const Player = ({
  audioElem,
  isplaying,
  setisplaying,
  currentSong,
  setCurrentSong,
  audioList,
  setAudioList,
}: any) => {
  const clickRef = useRef<any>();
  const [queueClicked, setQueueClicked] = useState<boolean>(false);
  const detectIfClickedOutside = useDetectClickOutside({
    onTriggered: () => setQueueClicked(false),
  });
  const PlayPause = () => {
    setisplaying(!isplaying);
  };
  const deleteItemFromPlaylist = async (id: any) => {
    if (currentIndex + 1 == audioList.length) {
      setCurrentSong(audioList[0]);
    } else if (currentSong.id == id) {
      setCurrentSong(audioList[currentIndex + 1]);
    }
    await setAudioList(audioList.filter((item: any) => item.id !== id));
  };
  const checkWidth = (e: any) => {
    let width = clickRef.current.clientWidth;
    const offset = e.nativeEvent.offsetX;

    const divprogress = (offset / width) * 100;

    const progress = (divprogress / 100) * currentSong.length;
    audioElem.current.currentTime = Number(progress);
  };
  const currentIndex = audioList.findIndex((object: any) => {
    return object.id == currentSong.id;
  });

  const skipBack = async () => {
    await setisplaying(false);
    if (currentIndex == 0) {
      setCurrentSong(audioList[audioList.length - 1]);
    } else if (currentSong.id == null) {
      setCurrentSong(audioList[audioList.length - 1]);
    } else {
      setCurrentSong(audioList[currentIndex - 1]);
    }

    audioElem.current.currentTime = 0;
    await setisplaying(true);
  };

  const skiptoNext = async () => {
    await setisplaying(false);
    if (currentIndex + 1 == audioList.length) {
      setCurrentSong(audioList[0]);
    } else {
      setCurrentSong(audioList[currentIndex + 1]);
      audioElem.current.currentTime = 0;
      audioElem.current.play();
    }
    await setisplaying(true);
  };
  const getTime = () => {
    let second = audioElem.current?.duration;
    let complateMinutes = Math.floor(audioElem.current?.duration / 60);
    let complateSeconds = second % 60;
    second = Math.round(complateSeconds);
    if (second < 10) {
      return complateMinutes + ":0" + second;
    } else if (!second) {
      return "Loading...";
    } else {
      return complateMinutes + ":" + second;
    }
  };
  useEffect(() => {
    if (audioList.length == 0) return;
    setCurrentSong(audioList[0]);
  }, [audioList]);

  return (
    <div className="player_container">
      <div className="player_image">
        <Image src={currentSong.cover} alt="song-image" fill />
      </div>
      <div className="player">
        <div className="navigation">
          <div
            className="navigation_wrapper"
            onClick={checkWidth}
            ref={clickRef}
          >
            <div
              className="seek_bar"
              style={{ width: `${currentSong.progress + "%"}` }}
            ></div>
          </div>
        </div>
        <div className="title">
          <span>
            {currentSong.artist} - {currentSong.title}
          </span>
          <span> {getTime()}</span>
        </div>
        <div className="controls">
          <BsFillSkipStartCircleFill
            className="btn_action skip_button"
            onClick={skipBack}
          />
          {isplaying ? (
            <BsFillPauseCircleFill
              className="btn_action pp"
              onClick={PlayPause}
            />
          ) : (
            <BsFillPlayCircleFill
              className="btn_action pp"
              onClick={PlayPause}
            />
          )}
          <BsFillSkipEndCircleFill
            className="btn_action skip_button"
            onClick={skiptoNext}
          />
        </div>
        <div className="dropdown" ref={detectIfClickedOutside}>
          <BsJustify onClick={() => setQueueClicked(!queueClicked)} />
          <div
            className="dropdown-content"
            style={
              queueClicked
                ? {
                    display: "flex",
                  }
                : { display: "none" }
            }
          >
            <BsFillXCircleFill
              className="close_ico"
              onClick={() => setQueueClicked(!queueClicked)}
            />
            <table className="queue_con">
              {audioList.map((song: any) => {
                return (
                  <thead key={song._id} className="queue_table">
                    <tr className="queue_tr">
                      <td
                        className="table_ico"
                        onClick={() => deleteItemFromPlaylist(song.id)}
                      >
                        <BsPatchMinusFill />
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
          </div>
        </div>
      </div>
    </div>
  );
};
export default Player;
