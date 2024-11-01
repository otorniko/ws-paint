import socket from "../services/socketService";

export const Intro = ({ init, isReady }) => {
  const onClick = () => {
    // const room = document.querySelector('input[name="room"]:checked').value;
    init();
  }
  return (
    <header className={isReady ? "hidden intro" : "intro"}>
      <div className="intro__content">
        <h1>Web Socket Paint</h1>
        <form onSubmit={onClick}>
          <br />
          <br />
          <input type="radio" id="room" value="room1" name="room" defaultChecked />
          <label htmlFor="room1">Room 1</label>
          <input type="radio" id="room" value="room2" name="room" />
          <label htmlFor="room2">Room 2</label>
          <input type="radio" id="room" value="room3" name="room" />
          <label htmlFor="room3">Room 3</label>
        </form>
        <br />
        <button onClick={onClick} className="blob-btn">
          <span className="blob-text">Start painting</span>
          <span className="blob-btn__inner">
            <span className="blob-btn__blobs">
              <span className="blob-btn__blob"></span>
              <span className="blob-btn__blob"></span>
              <span className="blob-btn__blob"></span>
              <span className="blob-btn__blob"></span>
            </span>
          </span>
        </button>
      </div>
    </header>
  );
};