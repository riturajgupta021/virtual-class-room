import { useState, useEffect, useRef } from "react";
import "./VideoConference.css";

const VideoConference = () => {
  const [roomId, setRoomId] = useState(""); // User's classroom ID
  const [isJoined, setIsJoined] = useState(false);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const socket = useRef(null);

  useEffect(() => {
    if (isJoined) {
      const signalingServer = "ws://localhost:5000"; // WebSocket server URL
      socket.current = new WebSocket(signalingServer);

      const configuration = {
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      };

      peerConnection.current = new RTCPeerConnection(configuration);

      // Handle ICE candidate
      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          socket.current.send(
            JSON.stringify({
              type: "candidate",
              candidate: event.candidate,
              roomId,
            })
          );
        }
      };

      // Handle remote stream
      peerConnection.current.ontrack = (event) => {
        remoteVideoRef.current.srcObject = event.streams[0];
      };

      // Receive signaling messages
      socket.current.onmessage = async (message) => {
        const data = JSON.parse(message.data);

        if (data.type === "offer") {
          await peerConnection.current.setRemoteDescription(
            new RTCSessionDescription(data.offer)
          );
          const answer = await peerConnection.current.createAnswer();
          await peerConnection.current.setLocalDescription(answer);
          socket.current.send(
            JSON.stringify({ type: "answer", answer, roomId })
          );
        } else if (data.type === "answer") {
          await peerConnection.current.setRemoteDescription(
            new RTCSessionDescription(data.answer)
          );
        } else if (data.type === "candidate") {
          try {
            await peerConnection.current.addIceCandidate(
              new RTCIceCandidate(data.candidate)
            );
          } catch (error) {
            console.error("Error adding received ICE candidate", error);
          }
        }
      };

      // Get local media stream
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          localVideoRef.current.srcObject = stream;
          stream.getTracks().forEach((track) =>
            peerConnection.current.addTrack(track, stream)
          );
        });

      return () => {
        peerConnection.current.close();
        socket.current.close();
      };
    }
  }, [isJoined, roomId]);

  const joinRoom = () => {
    if (roomId.trim() === "") {
      alert("Please enter a valid Room ID.");
      return;
    }
    socket.current.send(JSON.stringify({ type: "join", roomId }));
    setIsJoined(true);
  };

  return (
    <div className="video-conference">
      {!isJoined ? (
        <div className="join-room">
          <h2>Join Classroom</h2>
          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <button onClick={joinRoom}>Join Room</button>
        </div>
      ) : (
        <div className="classroom">
          <div className="video-container">
            <div className="video-wrapper">
              <video ref={localVideoRef} autoPlay muted className="video" />
              <p>Your Video</p>
            </div>
            <div className="video-wrapper">
              <video ref={remoteVideoRef} autoPlay className="video" />
              <p>Classmate   Video</p>
            </div>
          </div>
          <div className="controls">
            <button
              onClick={() =>
                localVideoRef.current.srcObject
                  .getVideoTracks()
                  .forEach((track) => (track.enabled = !track.enabled))
              }
            >
              Toggle Video
            </button>
            <button
              onClick={() =>
                localVideoRef.current.srcObject
                  .getAudioTracks()
                  .forEach((track) => (track.enabled = !track.enabled))
              }
            >
              Toggle Audio
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoConference;
